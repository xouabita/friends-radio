const MediaInput = `
input MediaInput {
  title: String!
  url: String!
  duration: Int!

  artist: String
  description: String
  thumbnail: String
}
`

const Media = `
type Media {
  id: String!

  title: String!
  url: String!
  duration: Int!

  artist: String
  description: String
  thumbnail: String

  myReaction: Reaction

  posted_by: User!
}
`

module.exports = [Media, MediaInput]
