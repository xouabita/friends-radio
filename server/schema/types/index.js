const Query    = require('./query.js')
const Mutation = require('./mutation.js')
const Media    = require('./media.js')
const User     = require('./user.js')

const Schema = `
schema {
  query: Query
  mutation: Mutation
}
`

module.exports = [Schema].concat(Query, Mutation, Media, User)
