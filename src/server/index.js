const express = require("express")
const passport = require("passport")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const {graphqlExpress, graphiqlExpress} = require("graphql-server-express")
const history = require("connect-history-api-fallback")
const importFromGroup = require("./jobs/importFromGroup.js")

const {secret} = require("../config")
const schema = require("./schema")

const baseUrl = require("./middlewares/baseUrl")
const setupFbStrategy = require("./middlewares/setupFbStrategy")
const attachUser = require("./middlewares/attachUser")

const app = express()
app.use(baseUrl)
app.use(cors())
app.use(cookieParser())
app.use(attachUser)

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

// Enable group imports functions if FACEBOOK_GROUP_ID is set
if (process.env.FACEBOOK_GROUP_ID) {
  console.log("I M P O R T   F R O M   G R O U P   E N A B L E D")
  app.get(
    "/authenticateForImport",
    setupFbStrategy,
    passport.authenticate("facebook", {
      scope: ["user_friends", "user_managed_groups"],
    }),
  )
  const time = 5 * 60 * 1000
  const recursive = () => {
    importFromGroup()
    setTimeout(recursive, time)
  }
  recursive()
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
