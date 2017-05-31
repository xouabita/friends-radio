const AddMediaInput = `
input AddMediaInput {
  title: String!
  url: String!
  duration: Int!

  artist: String
  description: String
  thumbnail: String
}
`

const EditMediaInput = `
input EditMediaInput {
  title: String
  url: String
  duration: Int
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

module.exports = [Media, AddMediaInput, EditMediaInput]
