const User = require('./user.js')

const Query = `
type Query {
  user(id: String!): User!
  me: User!
  media(id: String!): Media!
  medias: [Media]!
}
`

module.exports = () => [User, Query]
