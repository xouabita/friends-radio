const MediaConnection = require("../connections/MediaConnection")

const User = `
type User {
  id: String!
  name: String!
  ${MediaConnection.field("medias")}
  ${MediaConnection.field("reactions", ["type: ReactionType!"])}
}
`

module.exports = [User]
