const knex      = require('knex')
const dbConfig  = require('../knexfile.js')

module.exports = process.env.NODE_ENV === 'production'
  ? knex(dbConfig.production)
  : knex(dbConfig.development)
