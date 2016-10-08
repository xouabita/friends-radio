const User = require('./user.js')

const Query = `
type Query {
  user(id: String!): User!
  me: User!
}
`

module.exports = () => [User, Query]
