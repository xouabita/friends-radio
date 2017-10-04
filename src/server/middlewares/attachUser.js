const {secret} = require("../../config")
const knex = require("../knex")
const jwt = require("jsonwebtoken")

module.exports = async function attachUser(req, res, next) {
  try {
    if (req.cookies.jwt_token) {
      const {id} = jwt.verify(req.cookies.jwt_token, secret)
      const [user] = await knex("users").where("id", id)
      req.user = user
    }
  } catch (e) {
  } finally {
    if (!req.user) {
      res.clearCookie("jwt_token")
    }
    next()
  }
}
