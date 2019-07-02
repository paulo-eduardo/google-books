const jwt = require('jsonwebtoken')

const redis = require('redis')

const redisClient = redis.createClient(process.env.REDIS_URI)

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value))

const signinAuthentication = (req, res) => {
  const { usuario, password } = req.body

  if (usuario === 'admin' && password === 'admin') {
    const token = jwt.sign({ usuario }, 'JWT_SECRET_KEY', {
      expiresIn: '2 days'
    })

    setToken(token, usuario)
    return res.status(200).json(token)
  }

  return res.status(401).send('Unauthorized')
}

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).send('Unauthorized')
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized')
    }
    return next()
  })
}

module.exports = {
  signinAuthentication,
  requireAuth
}
