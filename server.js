const port = 4001;
const db = require("./db/users");

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(morgan("short"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST",
    credentials: true,
  })
);

app.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const result = await db.addNewUser(username, password);
    res.status(201).send({ msg: "creation success" });
  } catch (error) {
    res.status(400).send({ msg: "creation failed" });
  }
});

const session = require("express-session");
// in-memory storage only used for development purposes
const store = new session.MemoryStore();
const cookieParser = require("cookie-parser");

app.use(
  session({
    secret: "some random string hehe",
    name: "sessionID",
    cookie: {
      // session will expires within 10 minutes.
      maxAge: 1000 * 60 * 10,
    },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(cookieParser());

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(
  new localStrategy(function (username, password, done) {
    db.findByUsername(username, async (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) return done(null, false);
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
    res.status(201).send(req.user);
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      res.clearCookie("sessionID");
      res.status(204).send({
        msg: "logged out",
      });
    });
  });
});

const errorHandler = (err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
  }
  res.status(err.status).send(err.message);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
