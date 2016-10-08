const express      = require('express')
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const passport     = require('passport')
const jwt          = require('jsonwebtoken')

const FbStrategy = require('passport-facebook').Strategy
const { fbOptions, secret, port } = require('../config.js')

passport.use(new FbStrategy(fbOptions, (token, refresh, profile, done) => {
  done(null, profile)
}))

const app = express()

app.use(cookieParser())
app.use((req, res, next) => {
  console.log(req.cookies)
  next()
})

// Authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/facebook/callback', passport.authenticate('facebook', {session: false}), (req, res) => {
  const token = jwt.sign({id: req.user.id}, secret)
  res.cookie('jwt_token', token).redirect('/')
})
app.get('/disconnect', (req, res) => res.clearCookie('jwt_token').redirect('/'))

app.get('/', (req, res) => res.end(`<a href='/auth/facebook'>Connect</a>`))

app.listen(port)
console.log(`Listening on ${port}...`)
