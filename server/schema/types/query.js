const Query = `
type Query {
  user(id: String!): User!
  me: User!
  media(id: String!): Media!
  medias(skip: Int = 0, limit: Int = 30): [Media]!
}
`

module.exports = () => [Query]
