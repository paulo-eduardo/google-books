var request = require('request')
var Votes = require('../Models/Votes')

// Exposing google api key so we can run it outside docker
const GOOGLE_API =
  process.env.GOOGLE_API || 'AIzaSyDngLUVp-CMMAVGuqTLKcjfodmgDi160sI'

module.exports = {
  index (req, res) {
    request(
      `https://www.googleapis.com/books/v1/volumes?q=react&key=${GOOGLE_API}`,
      function (error, response, body) {
        if (error) return res.status(500).json(error)
        const library = JSON.parse(body)

        const filterLibrary = library.items.flatMap(x => {
          return {
            id: x.id,
            title: x.volumeInfo.title,
            description: x.volumeInfo.description,
            selfLink: x.selfLink
          }
        })

        return res.status(200).json(filterLibrary)
      }
    )
  },

  storeVote (req, res) {
    const { action } = req.body

    Votes.findOne({ id: req.params.id }, async (err, vote) => {
      if (err) return res.status(500).json({ error: err })

      if (vote) {
        vote.vote += action === 1 ? 1 : -1
        vote
          .save()
          .then(() => res.sendStatus(201))
          .catch(err => res.status(500).json({ err: err }))
      }

      request(
        `https://www.googleapis.com/books/v1/volumes/${
          req.params.id
        }?q=react&key=${GOOGLE_API}`,
        async (error, response, body) => {
          if (error) return res.status(500).json(error)
          const book = JSON.parse(body)

          await Votes.create({
            id: req.params.id,
            vote: action === 2 ? 1 : 0,
            title: book.volumeInfo.title
          })
          return res.sendStatus(200)
        }
      )
    })
  },

  listVotes (req, res) {
    const { type } = req.query

    if (type !== 'top-ten') {
      return res.sendStatus(404)
    }

    Votes.find({})
      .sort({ vote: -1 })
      .limit(10)
      .then(votes => {
        if (votes.length === 0) return res.sendStatus(204)

        return res.status(200).json(votes)
      })
      .catch(err => {
        return res.status(500).json({ error: err })
      })
  },

  async truncateVotes (req, res) {
    await Votes.deleteMany({})
    return res.sendStatus(200)
  }
}
