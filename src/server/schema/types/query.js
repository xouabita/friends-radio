const MediaConnection = require("../connections/MediaConnection")

const Query = `
type Query {
  user(id: String!): User!
  me: User
  media(id: String!): Media!
  medias(skip: Int = 0, limit: Int = 30): [Media]!
  ${MediaConnection.field("test_medias")}
}
`

module.exports = () => [Query]
