const express = require('express')

const booksController = require('./controllers/books')

const auth = require('./controllers/auth')

const routes = new express.Router()

routes.get('/', (req, res) => res.status(200).json({ message: 'server is up' }))

routes.post('/login', auth.signinAuthentication)

routes.get('/book', booksController.index)
routes.get('/report', booksController.listVotes)
routes.post('/book/:id', auth.requireAuth, booksController.storeVote)
routes.get('/truncateVotes', booksController.truncateVotes)

module.exports = routes
