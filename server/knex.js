const knex      = require('knex')
const dbConfig  = require('../knexfile.js')

module.exports = knex(dbConfig.development)
