const mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  vote: Number
})

module.exports = mongoose.model('Vote', VoteSchema)
