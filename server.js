const port = 3000;
const db = require("./db/users");

const express = require("express");
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(morgan("short"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const session = require("express-session");
// in-memory storage only used for development purposes
const store = new session.MemoryStore();

app.use(
  session({
    secret: "some random string hehe",
    cookie: {
      // session will expires within 10 minutes.
      maxAge: 1000 * 60 * 10,
    },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(
  new localStrategy(function (username, password, done) {
    db.findByUsername(username, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (password !== user.password) return done(null, false);
      done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.findById(id, (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.status(200).send("login succeed");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.status(200).send("logout succeed");
});

const errorHandler = (error, req, res) => {
  if (!err.status) {
    err.status = 500;
  }
  res.status(err.status).send(err.message);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
