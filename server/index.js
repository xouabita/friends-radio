const express      = require('express')
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const passport     = require('passport')
const jwt          = require('jsonwebtoken')

const FbStrategy = require('passport-facebook').Strategy
const { fbOptions, secret, port } = require('../config.js')

const knex = require('./knex.js')

passport.use(new FbStrategy(fbOptions, (token, refresh, profile, done) => {
  const {id} = profile
  knex('users').where('id', id).then(rows => {
    if (rows.length)
      done(null, profile)

    const {displayName, gender} = profile
    knex('users').insert({id, name: displayName, gender: gender === 'male'})
    .then((user) => {
      done(null, profile)
    })
  })
}))

const app = express()

app.use(cookieParser())
app.use((req, res, next) => {
  if (req.cookies.jwt_token) {
    const {id} = jwt.verify(req.cookies.jwt_token, secret)
    knex('users').where('id', id).then((rows) => {
      if (!rows.length)
        next()

      req.user = rows[0]
      next()
    })
  } else {
    req.user = null
    next()
  }
})

// Authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/facebook/callback', passport.authenticate('facebook', {session: false}), (req, res) => {
  const token = jwt.sign({id: req.user.id}, secret)
  res.cookie('jwt_token', token).redirect('/')
})
app.get('/disconnect', (req, res) => res.clearCookie('jwt_token').redirect('/'))

app.get('/', (req, res) => res.end(`<a href='/auth/facebook'>Connect</a><a href='/disconnect'>Disconnect</a>`))

app.listen(port)
console.log(`Listening on ${port}...`)
