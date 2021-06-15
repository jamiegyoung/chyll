const express = require("express");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const config = require("./src/config.json");
const db = require("./src/database");
const { checkAccess } = require("./src/middleware");

const { startDailyCheck } = require("./src/dailyCheck");

startDailyCheck();

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: "chyllSession",
    keys: config.cookies.keys,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true,
  })
);

// 200 requests per minute
const frontEndLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 60,
});

// Cookies last 1 day
app.use(express.static("public"));

app.use("/api", require("./src/routes/api"));

app.get("/login", frontEndLimiter, async (req, res) => {
  if (await db.getUser(req.session.userId)) {
    res.redirect("/home");
    return;
  }
  res.sendFile(path.join(__dirname, "private", "index.html"));
});

app.get("/", frontEndLimiter, (_req, res) => {
  res.redirect("/home");
});

app.get("/home", frontEndLimiter, checkAccess, (_req, res) => {
  res.sendFile(path.join(__dirname, "private", "index.html"));
});

app.get("/logout", frontEndLimiter, async (req, res) => {
  const user = await db.getUser(req.session.userId);
  if (!user[0].playlist_id) {
    db.removeUser(req.session.userId, true);
  }
  req.session = null;
  res.redirect("/login");
});

app.get("/404", frontEndLimiter, (_req, res) => {
  res.sendFile(path.join(__dirname, "private", "index.html"));
});

app.use((_req, res, next) => {
  res.status(404).redirect("/404");
});

app.listen(3000);
