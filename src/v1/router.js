const express = require("express");

const booksController = require("./controllers/books");

const routes = new express.Router();

routes.get("/", (req, res) =>
  res.status(200).json({ message: "server is up" })
);

routes.get("/book", booksController.index);

module.exports = routes;
