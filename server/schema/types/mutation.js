const Mutation = `
type Mutation {
  addMedia(media: MediaInput!) : Media
}
`

module.exports = () => [Mutation]
