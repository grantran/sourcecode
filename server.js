"use strict";
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const register = require("./routes/register");
const login = require("./routes/login");
const resourcesRoutes = require("./routes/resources");
const commentsRoutes = require("./routes/comments");
const likebutton = require("./routes/likebutton");
const profilesRoutes = require("./routes/profiles");
const updateUserRoutes = require("./routes/updateusername");
const getTagsRoutes = require("./routes/addtags");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['1q2w3e4r5t6y', 'qawsedrftgyh']
}));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/register", register(knex));
app.use("/login", login(knex));
app.use("/api/users", usersRoutes(knex));
app.use("/api/resources", resourcesRoutes(knex));
app.use("/api/comments", commentsRoutes(knex));
app.use("/api/likebutton", likebutton(knex));
app.use("/api/profiles", profilesRoutes(knex));
app.use("/api/updateuser", updateUserRoutes(knex));
app.use("/api/gettags", getTagsRoutes(knex));
// Home page
app.get("/", (req, res) => {
  let userData = false;
  knex('users').select("*").then((results) => {
    results.some(function(item) {
      if (item.id === req.session.userid) {
        userData = item;
        return true;
      } else {}
    })
    console.log(userData, 'userdata');
    res.render("index", {
      userData: userData
    })
  })
});
//Profile Page
app.get("/profile", (req, res) => {
    let userData = {};
    knex('users').select("*").then((results) => {
      results.some(function(item) {
        if (item.id === req.session.userid) {
          userData = item;
          return true;
        } else {
          userData = 'noUser';
        }
      })
      res.render("profile", {
        userData: userData
      })
    })
  })
  //Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
