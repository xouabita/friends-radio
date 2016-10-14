const User = `
type User {
  id: String!
  name: String!
  mediaCount: Int!
  medias(skip: Int = 0, limit: Int = 30): [Media]!
}
`

module.exports = [User]
