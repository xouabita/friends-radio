const Media = require('./media.js')

const Mutation = `
type Mutation {
  addMedia(media: MediaInput!) : Media
}
`

module.exports = () => [Mutation, Media]
