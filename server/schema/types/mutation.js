const Mutation = `
type Mutation {
  addMedia(media: MediaInput!) : Media,
  addReaction(media_id: String!, type: ReactionType) : Reaction,
  deleteReaction(media_id: String!, type: ReactionType): Boolean!
}
`

module.exports = [Mutation]
