const schedule = require("node-schedule");
const SpotifyClient = require("./spotify");
const config = require("./config.json");
const { getAllPlaylists } = require("./database");

const addSongs = async (accessToken, refreshToken, playlistId, userId) => {
  // create spotify instance
  const loggedInClient = new SpotifyClient(
    process.env.SPOTIFY_CLIENT_ID || config.spotify.client_id,
    process.env.SPOTIFY_CLIENT_SECRET || config.spotify.client_secret,
    process.env.SPOTIFY_CALLBACK_URL || config.spotify.callback_url
  );
  await loggedInClient.setTokens(accessToken, refreshToken);
  await loggedInClient.addTracks(
    process.env.SOURCE_PLAYLIST_ID || config.spotify.source_playlist_id,
    playlistId,
    userId
  );
};

const startDailyCheck = async () => {
  const rule = new schedule.RecurrenceRule();
  rule.minute = 0;
  rule.hour = 17;
  rule.tz = "Etc/UTC";

  this.dailyCheck = schedule.scheduleJob(rule, async () => {
    console.log("starting daily job! " + new Date().toUTCString());
    const allPlaylists = await getAllPlaylists();
    for (let i = 0; i < allPlaylists.length; i++) {
      setTimeout(async () => {
        await addSongs(
          allPlaylists[i].access_token,
          allPlaylists[i].refresh_token,
          allPlaylists[i].playlist_id,
          allPlaylists[i].user_id
        );
      }, 1000 * i);
    }
  });
  // Removed invoke for release
  // this.dailyCheck.invoke();
};

module.exports = { startDailyCheck };
