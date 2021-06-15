const express = require("express");
const cookieSession = require("cookie-session");
const config = require("./src/config.json");
const db = require("./src/database");
const helmet = require("helmet");
const path = require("path");
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

// Cookies last 1 day
app.use(express.static("public"));

app.use("/api", require("./src/routes/api"));

app.get("/login", async (req, res) => {
  if (await db.getUser(req.session.userId)) {
    res.redirect("/home");
    return;
  }
  res.sendFile(path.join(__dirname, "private", "index.html"));
});

app.get("/", (_req, res) => {
  res.redirect("/home");
});

app.get("/home", checkAccess, (_req, res) => {
  res.sendFile(path.join(__dirname, "private", "index.html"));
});

app.get("/logout", async (req, res) => {
  const user = await db.getUser(req.session.userId);
  if (!user[0].playlist_id) {
    db.removeUser(req.session.userId, true);
  }
  req.session = null;
  res.redirect("/login");
});

app.get("/404", (_req, res) => {
  res.sendFile(path.join(__dirname, "private", "index.html"));
});

app.use((_req, res, next) => {
  res.status(404).redirect("/404");
});

app.listen(3000);
