const express = require('express')
const basicAuth = require('express-basic-auth')

const booksController = require('./controllers/books')

const routes = new express.Router()

routes.get('/book', booksController.index)
routes.get('/report/book', booksController.listVotes)
routes.post(
  '/book/:id',
  basicAuth({ users: { admin: 'admin' } }),
  booksController.storeVote
)
routes.get('/truncateVotes', booksController.truncateVotes)

module.exports = routes
