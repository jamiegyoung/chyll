const express = require("express");
const SpotifyClient = require("../../../spotify");
const config = require("../../../config.json");
const db = require("../../../database");
const { v4: uuidv4 } = require("uuid");
const { checkAccess } = require("../../../middleware");

const router = express.Router();

const getPlaylists = async (userId, accessToken, refreshToken) => {
  const loggedInClient = new SpotifyClient(
    config.spotify.client_id,
    config.spotify.client_secret,
    "https://jamieyoung.tech/api/v1/callback"
  );

  await loggedInClient.setTokens(accessToken, refreshToken);

  const playlists = await loggedInClient
    .getPlaylists()
    .then((res) => res.items)
    .catch((e) => console.error(e));

  const cleanPlaylists = playlists
    .filter((val) => val.owner.id === userId)
    .map((val) => ({
      label: val.name,
      value: val.id,
    }));
  return cleanPlaylists;
};

router.get("/submit_login", async (req, res) => {
  const spotifyClient = new SpotifyClient(
    config.spotify.client_id,
    config.spotify.client_secret,
    "https://jamieyoung.tech/api/v1/callback"
  );

  const state = uuidv4();
  spotifyClient.setState(state);
  req.session.client_state = state;
  res.redirect(spotifyClient.getAuthUrl(state));
});

router.get("/callback", async (req, res) => {
  if (req.session.client_state !== req.query.state) {
    return res.status(401).redirect("/login");
  }
  const loggedInClient = new SpotifyClient(
    config.spotify.client_id,
    config.spotify.client_secret,
    "https://jamieyoung.tech/api/v1/callback"
  );

  loggedInClient.setAuthorizationCode(req.query.code);
  await loggedInClient.setTokens().catch((e) => {
    res.status(401).redirect("/login");
    return;
  });

  const userId = await loggedInClient.getID();
  const user = await db.getUser(userId).catch((e) => console.error(e));

  const handleUserInDB = async () => {
    if (!user) {
      await db.addUser(
        userId,
        loggedInClient.getAccessToken(),
        loggedInClient.getRefreshToken()
      );
      return;
    }
    await db.updateUser(
      userId,
      loggedInClient.getAccessToken(),
      loggedInClient.getRefreshToken()
    );
    return;
  };

  await handleUserInDB();
  req.session.userId = userId;
  res.status(202).redirect("/home");
  return;
});

router.use(express.json());

router.post("/set_playlist", checkAccess, async (req, res) => {
  if (req.body) {
    if (!req.body.value) return;
    const playlistFound = (
      await getPlaylists(
        req.session.userId,
        req.session.access_token,
        req.session.refresh_token
      )
    ).find((val) => val.value === req.body.value);
    // check if the playlist is able to be modified
    if (playlistFound) {
      db.setUserPlaylist(req.session.userId, req.body.value);
      res.sendStatus(200);
      return;
    }
  }
  res.sendStatus(403);
});

router.get("/remove_playlist", checkAccess, (req, res) => {
  db.setUserPlaylist(req.session.userId, null);
  res.sendStatus(200);
});

router.get("/get_playlists", checkAccess, async (req, res) => {
  const cleanPlaylists = await getPlaylists(
    req.session.userId,
    req.session.access_token,
    req.session.refresh_token
  );
  const user = await db.getUser(req.session.userId);
  if (user) {
    if (user[0].playlist_id) {
      return res.json({
        active: user[0].playlist_id,
        available: cleanPlaylists,
      });
    }
  }
  res.json({ available: cleanPlaylists });
});

router.get("/user_count", async (_req, res) => {
  res.json({ count: await db.getUserCount() })
})

module.exports = router;
