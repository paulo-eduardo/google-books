var request = require('request')
var Votes = require('../Models/Votes')

module.exports = {
  index (req, res) {
    request(
      'https://www.googleapis.com/books/v1/volumes?q=react&key=AIzaSyDngLUVp-CMMAVGuqTLKcjfodmgDi160sI',
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
        vote.vote += action === 2 ? 1 : -1
        await vote.save()
        return res.sendStatus(200)
      }

      request(
        `https://www.googleapis.com/books/v1/volumes/${
          req.params.id
        }?q=react&key=AIzaSyDngLUVp-CMMAVGuqTLKcjfodmgDi160sI`,
        async (error, response, body) => {
          if (error) return res.status(500).json(error)
          const book = JSON.parse(body)

          await Votes.create({
            id: req.params.id,
            vote: action === 2 ? 1 : -1,
            title: book.volumeInfo.title
          })
          return res.sendStatus(200)
        }
      )
    })
  },

  listVotes (req, res) {
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
