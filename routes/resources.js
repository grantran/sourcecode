"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.post("/", (req, res) => {
    knex('resources').insert({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      user_id: req.session.userid,
      tags: req.body.tags,
      image: req.body.image

    }).then(() => {
      res.redirect("/");
    });
  });

  router.get("/", (req, res) => {
    knex('resources').select(['resources.id', 'resources.title', 'resources.url', 'resources.user_id', 'resources.description', 'resources.tags', 'resources.image', 'users.username'])
    .leftJoin('users', 'resources.user_id', 'users.id')
    .then(function(results) {
      res.json(results);
    });
  });

  return router;
}
