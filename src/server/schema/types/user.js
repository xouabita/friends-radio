const User = `
type User {
  id: String!
  name: String!
  mediaCount: Int!
  likeCount: Int!
  dislikeCount: Int!
  medias(skip: Int = 0, limit: Int = 30): [Media]!
  likes(skip: Int = 0, limit: Int = 30): [Media]!
  dislikes(skip: Int = 0, limit: Int = 30): [Media]!
}
`

module.exports = [User]
