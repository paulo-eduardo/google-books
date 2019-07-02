const mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  vote: {
    type: Number,
    min: [0, 'vote cant be less then 0']
  },
  title: String
})

module.exports = mongoose.model('Vote', VoteSchema)
