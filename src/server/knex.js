const knex = require("knex")
const dbConfig = require("../../knexfile")

module.exports =
  process.env.NODE_ENV === "production"
    ? knex(dbConfig.production)
    : process.env.NODE_ENV === "test"
      ? knex(dbConfig.test)
      : knex(dbConfig.development)
