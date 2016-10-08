const Query = require('./query.js')
const Mutation = require('./mutation.js')

const Schema = `
schema {
  query: Query
  mutation: Mutation
}
`

module.exports = [Schema, Query, Mutation]
