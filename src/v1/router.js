const express = require("express");

const routes = new express.Router();

routes.get("/", (req, res) =>
  res.status(200).json({ message: "server is up" })
);

module.exports = routes;
