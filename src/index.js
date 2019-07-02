const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

console.log(process.env.MONGO_URI)

const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true
    })
    .then(() => {
      console.log('MongoDB is connected')
    })
    .catch(() => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
      setTimeout(connectWithRetry, 1000)
    })
}

connectWithRetry()

const app = express()

app.use(morgan('combined'))
app.use(cors('*'))
app.use(bodyParser.json())

app.use('/api/v1', require('./v1/router'))

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
