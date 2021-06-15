const db = require("../database");
const SHA3 = require("crypto-js/sha3");

const checkAccess = async (req, res, next) => {
  const getUser = async (userId) => {
    if (!userId) return false;
    const user = await db.getUser(userId);
    if (user) {
      return user[0];
    }
    return false;
  };

  const user = await getUser(req.session.userId);
  if (user) {
    req.session.access_token = user.access_token;
    req.session.refresh_token = user.refresh_token;
    next();
    return;
  }
  res.status(401).redirect("/login");
};

module.exports = { checkAccess };
