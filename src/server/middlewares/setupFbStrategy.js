const passport = require("passport")
const FbStrategy = require("passport-facebook").Strategy
const {fbOptions} = require("../../config")
const knex = require("../knex.js")

module.exports = function setupFbStrategy(req, res, next) {
  if (!req.app.get("fbStrategySetup")) {
    const options = {
      ...fbOptions,
      callbackURL: `${req.baseUrl}/auth/facebook/callback`,
    }
    passport.use(
      new FbStrategy(options, (token, refresh, profile, done) => {
        const {id} = profile
        console.log(`Token for ${profile.displayName}: ${token}`)
        knex("users").where("id", id).then(rows => {
          if (rows.length) done(null, profile)
          else {
            const {displayName} = profile
            knex("users").insert({id, name: displayName}).then(user => {
              done(null, profile)
            })
          }
        })
      }),
    )
    req.app.set("fbStrategySetup", true)
  }
  next()
}
