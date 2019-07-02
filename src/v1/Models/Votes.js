const mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  vote: Number,
  title: String
})

module.exports = mongoose.model('Vote', VoteSchema)
