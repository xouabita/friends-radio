const Query = require('./query.js')

const Schema = `
schema {
  query: Query
}
`

module.exports = [Schema, Query]
