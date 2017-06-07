const knex      = require('knex')
const dbConfig  = require('../../knexfile')

module.exports = process.env.NODE_ENV === 'production'
  ? knex(dbConfig.production)
  : knex(dbConfig.development)
