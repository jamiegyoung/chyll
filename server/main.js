require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const db = require("./src/database");
const { checkAccess } = require("./src/middleware");
const csurf = require("csurf");

const { startDailyCheck } = require("./src/dailyCheck");

startDailyCheck();

const app = express();

app.use(helmet());

app.use(
  cookieSession({
    name: "chyllSession",
    keys: [
      process.env.COOKIE_KEY_1,
      process.env.COOKIE_KEY_2,
      process.env.COOKIE_KEY_3,
    ],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  })
);

// 200 requests per minute
const frontEndLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 60,
});

app.use(cookieParser());

const csrfMiddleware = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

app.use(csrfMiddleware);

// Cookies last 1 day
app.use(express.static("public"));

app.use("/api", csrfMiddleware, require("./src/routes/api"));

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

app.get("/home", frontEndLimiter, checkAccess, (req, res) => {
  res.cookie("CSRF-Token", req.csrfToken());
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
