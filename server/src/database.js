const mysql = require("mysql");
const CryptoJS = require("crypto-js");
const AES = CryptoJS.AES;
const SHA3 = CryptoJS.SHA3;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

const getUser = (userId) => _getUser(SHA3(userId).toString());

const _getUser = (userId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM spotify_info WHERE user_id = ?",
      [userId],
      (err, res) => {
        if (err) reject(err);
        if (res.length === 0) resolve(false);
        const decryptedRes = res.map((val) => {
          val["access_token"] = AES.decrypt(
            val["access_token"],
            process.env.ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);

          val["refresh_token"] = AES.decrypt(
            val["refresh_token"],
            process.env.ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);

          if (val["playlist_id"]) {
            val["playlist_id"] = AES.decrypt(
              val["playlist_id"],
              process.env.ENCRYPTION_KEY
            ).toString(CryptoJS.enc.Utf8);
          }

          return val;
        });
        resolve(decryptedRes);
      }
    );
  });
};

const addUser = (userId, accessToken, refreshToken) =>
  _addUser(
    SHA3(userId).toString(),
    AES.encrypt(accessToken, process.env.ENCRYPTION_KEY).toString(),
    AES.encrypt(refreshToken, process.env.ENCRYPTION_KEY).toString()
  );

const _addUser = (userId, accessToken, refreshToken) =>
  new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO `spotify_info` (user_id, access_token, refresh_token) VALUES (?, ?, ?)",
      [userId, accessToken, refreshToken],
      (err, _res) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });

const updateUser = (userId, accessToken, refreshToken) =>
  _updateUser(
    SHA3(userId).toString(),
    AES.encrypt(accessToken, process.env.ENCRYPTION_KEY).toString(),
    AES.encrypt(refreshToken, process.env.ENCRYPTION_KEY).toString()
  );

const _updateUser = (userId, accessToken, refreshToken) =>
  new Promise((resolve, reject) => {
    connection.query(
      "UPDATE `spotify_info` SET access_token=?, refresh_token=? WHERE user_id=?",
      [accessToken, refreshToken, userId],
      (err, _res) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });

const setUserPlaylist = (userId, playlistId) =>
  _setUserPlaylist(
    SHA3(userId).toString(),
    AES.encrypt(playlistId, process.env.ENCRYPTION_KEY).toString()
  );

const _setUserPlaylist = (userId, playlistId) =>
  new Promise((resolve, reject) => {
    connection.query(
      "UPDATE `spotify_info` SET playlist_id=? WHERE user_id=?",
      [playlistId, userId],
      (err, _res) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });

const removeUser = (userId, hash) => {
  if (hash) {
    _removeUser(SHA3(userId).toString());
    return;
  }
  _removeUser(userId);
};

const _removeUser = (userId) =>
  new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM `spotify_info` WHERE user_id = ?",
      [userId],
      (err, _res) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });

const getUserCount = () =>
  new Promise((resolve, reject) => {
    connection.query(
      "SELECT COUNT(*) FROM `spotify_info` WHERE `playlist_id` IS NOT NULL ",
      (err, res) => {
        if (err) reject(err);
        resolve(res[0]["COUNT(*)"]);
      }
    );
  });

const getAllPlaylists = () =>
  new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM `spotify_info` WHERE `playlist_id` IS NOT NULL",
      (err, res) => {
        if (err) reject(err);
        const decryptedRes = res.map((val) => {
          val["access_token"] = AES.decrypt(
            val["access_token"],
            process.env.ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);

          val["refresh_token"] = AES.decrypt(
            val["refresh_token"],
            process.env.ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8);

          if (val["playlist_id"]) {
            val["playlist_id"] = AES.decrypt(
              val["playlist_id"],
              process.env.ENCRYPTION_KEY
            ).toString(CryptoJS.enc.Utf8);
          }

          return val;
        });
        resolve(decryptedRes);
      }
    );
  });

module.exports = {
  getUser,
  addUser,
  updateUser,
  removeUser,
  getUserCount,
  setUserPlaylist,
  getAllPlaylists,
};
