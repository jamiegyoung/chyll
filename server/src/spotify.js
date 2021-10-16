const SpotifyWebApi = require("spotify-web-api-node");
const { removeUser, updateUser } = require("./database");

const scope = [
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
];

const checkTracks = (prevTracks, track) => {
  let flag = true;
  prevTracks.forEach((prevTrack) => {
    if (track.track.id === prevTrack.track.id) {
      flag = false;
    }
  });
  return flag;
};

class SpotifyClient {
  constructor(clientID, clientSecret, redirectUri) {
    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setClientId(clientID);
    this.spotifyApi.setClientSecret(clientSecret);
    this.spotifyApi.setRedirectURI(redirectUri);
  }

  setAuthorizationCode(authCode) {
    this.authorizationCode = authCode;
  }

  setState(state) {
    this.state = state;
  }

  getAuthUrl() {
    return this.spotifyApi.createAuthorizeURL(scope, this.state);
  }

  async getID() {
    return (await this.spotifyApi.getMe()).body.id;
  }

  getAccessToken() {
    return this.spotifyApi.getAccessToken();
  }

  getRefreshToken() {
    return this.spotifyApi.getRefreshToken();
  }

  async getPlaylists() {
    try {
      const userPlaylists = (
        await this.spotifyApi.getUserPlaylists().catch((res) => {
          console.log(res);
        })
      ).body;
      return userPlaylists;
    } catch (error) {
      await this.refreshAccessToken();
      const userPlaylists = (
        await this.spotifyApi.getUserPlaylists().catch((res) => {
          console.log("an error happened when getting playlists:");
          console.log(res);
        })
      ).body;
      return userPlaylists;
    }
  }

  async setTokens(accessToken = undefined, refreshToken = undefined) {
    if (accessToken && refreshToken) {
      this.spotifyApi.setAccessToken(accessToken);
      this.spotifyApi.setRefreshToken(refreshToken);
      return;
    }
    const tokenRes = await this.getTokens();
    this.spotifyApi.setAccessToken(tokenRes.access_token);
    this.spotifyApi.setRefreshToken(tokenRes.refresh_token);
  }

  getTokens() {
    return new Promise((resolve, reject) => {
      this.spotifyApi
        .authorizationCodeGrant(this.authorizationCode)
        .then(async (data) => {
          resolve(data.body);
        })
        .catch(async () => {
          // not sure if this is the best way to go about it but I wrote it a while ago and it seems to work.
          await this.refreshAccessToken()
            .then((res) => resolve(res))
            .catch((res) => reject(res));
        });
    });
  }

  refreshAccessToken() {
    return new Promise((resolve, reject) => {
      this.spotifyApi
        .refreshAccessToken()
        .then(async (res) => {
          console.log("refreshing access token");
          this.spotifyApi.setAccessToken(res.body.access_token);
          updateUser(await this.getID(), res.body.access_token, this.getRefreshToken());
          resolve(true);
        })
        .catch((e) => {
          console.log("refreshing access token failed");
          reject(e);
        });
    });
  }

  async addTracks(oldPlaylist, newPlaylist, userId) {
    const getAllTracks = async (playlist, tracks = [], offset = 0) => {
      try {
        const newTracks = (
          await this.spotifyApi
            .getPlaylistTracks(playlist, { limit: 100, offset })
            .catch((e) => console.error(e))
        ).body.items;
        if (newTracks.length === 0) return tracks;
        return getAllTracks(playlist, tracks.concat(newTracks), offset + 100);
      } catch (error) {
        await this.refreshAccessToken();
        const newTracks = (
          await this.spotifyApi
            .getPlaylistTracks(playlist, { limit: 100, offset })
            .catch(async (e) => {
              if (e.statusCode === 404) {
                console.log(
                  "removing user as playlist no longer found: " + userId
                );
                await removeUser(userId, false);
                return;
              }
            })
        ).body.items;
        if (newTracks.length === 0) return tracks;
        return getAllTracks(playlist, tracks.concat(newTracks), offset + 100);
      }
    };
    const newTracks = await getAllTracks(oldPlaylist);
    const prevTracks = await getAllTracks(newPlaylist);
    const filteredNewTracks = newTracks.filter((track) =>
      checkTracks(prevTracks, track)
    );
    const trackURIs = filteredNewTracks.map((x) => x.track.uri);
    for (let index = 0; index < trackURIs.length; index += 100) {
      if (trackURIs.length > 0) {
        // can only add 100 songs at a time
        this.spotifyApi
          .addTracksToPlaylist(newPlaylist, trackURIs.slice(index, index + 100))
          .catch((e) => console.error(e));
      }
    }
  }
}

module.exports = SpotifyClient;
