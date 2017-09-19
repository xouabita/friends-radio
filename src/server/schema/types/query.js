const MediaConnection = require("../connections/MediaConnection")

const Query = `
type Query {
  user(id: String!): User!
  me: User
  media(id: String!): Media!
  ${MediaConnection.field("medias")}
}
`

module.exports = () => [Query]
