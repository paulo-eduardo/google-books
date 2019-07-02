var request = require('request')
var Votes = require('../Models/Votes')

module.exports = {
  index (req, res) {
    request('https://www.googleapis.com/books/v1/volumes?q=react', function (
      error,
      response,
      body
    ) {
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
    })
  },

  storeVote (req, res) {
    const { action } = req.body

    Votes.find({ id: req.params.id }, async (err, vote) => {
      if (err) return res.status(500).json({ error: err })

      if (vote) {
        vote.vote += action === 2 ? 1 : -1
        await vote.save()
        return res.status(200)
      }

      await Votes.create({ id: req.params.id, vote: action === 2 ? 1 : -1 })
      return res.status(200)
    })
  }
}
