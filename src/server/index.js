const express      = require('express')
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const passport     = require('passport')
const jwt          = require('jsonwebtoken')
const morgan       = require('morgan')
const cors         = require('cors')

const FbStrategy = require('passport-facebook').Strategy
const { fbOptions, secret, port } = require('../config.js')

const knex = require('./knex.js')

const {apolloExpress, graphiqlExpress} = require('apollo-server')
const history = require('connect-history-api-fallback')
const schema = require('./schema')

passport.use(new FbStrategy(fbOptions, (token, refresh, profile, done) => {
  const {id} = profile
  knex('users').where('id', id).then(rows => {
    if (rows.length)
      done(null, profile)
    else {
      const {displayName} = profile
      knex('users').insert({id, name: displayName})
        .then((user) => {
          done(null, profile)
        })
    }
  })
}))

const app = express()

app.use(cors())
app.use(morgan('combined'))
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
  res.cookie('jwt_token', token, { httpOnly: true }).redirect('/')
})
app.get('/disconnect', (req, res) => res.clearCookie('jwt_token').redirect('/'))



// Graphql routes
app.use('/graphql', bodyParser.json(), apolloExpress((req, res) => ({
  schema,
  context: {me: req.user}
})))

// graphiql endpoint only for developement
if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }))
}

app.use(history())
app.use(express.static(process.env.RAZZLE_PUBLIC_DIR))

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
app.get('*', (req, res) => {
  res.send(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Radio Zizi 📻</title>
    ${
      assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ''
    }
    <script src="${assets.client.js}" defer></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
  `)
})

export default app
