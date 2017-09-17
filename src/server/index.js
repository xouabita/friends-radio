const express = require("express")
const passport = require("passport")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const {graphqlExpress, graphiqlExpress} = require("graphql-server-express")
const history = require("connect-history-api-fallback")

const baseUrl = require("./middlewares/baseUrl")
const setupFbStrategy = require("./middlewares/setupFbStrategy")
const {secret} = require("../config")
const knex = require("./knex.js")

const schema = require("./schema")

const app = express()
app.use(baseUrl)
app.use(cors())
app.use(cookieParser())

app.use((req, res, next) => {
  try {
    if (req.cookies.jwt_token) {
      const {id} = jwt.verify(req.cookies.jwt_token, secret)
      knex("users").where("id", id).then(rows => {
        if (rows.length) {
          req.user = rows[0]
        }
      })
    }
  } catch (err) {
    console.error(err)
  } finally {
    if (!req.user) {
      res.clearCookie("jwt_token")
    }
    next()
  }
})

// Authentication routes
app.get("/auth/facebook", setupFbStrategy, passport.authenticate("facebook"))
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {session: false}),
  (req, res) => {
    const token = jwt.sign({id: req.user.id}, secret)
    res.cookie("jwt_token", token, {httpOnly: true}).redirect("/")
  },
)
app.get("/disconnect", (req, res) => res.clearCookie("jwt_token").redirect("/"))

// Graphql routes
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress((req, res) => ({
    schema,
    context: {me: req.user},
  })),
)

// graphiql endpoint only for developement
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/graphiql",
    graphiqlExpress({
      endpointURL: "/graphql",
    }),
  )
}

app.use(history())
app.use(express.static(process.env.RAZZLE_PUBLIC_DIR))

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)
app.get("*", (req, res) => {
  res.send(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Friends Radio 📻</title>
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans"
      rel="stylesheet"
    >
    ${assets.client.css
      ? `<link rel="stylesheet" href="${assets.client.css}">`
      : ""}
    <script src="${assets.client.js}" defer></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
  `)
})

module.exports = app
