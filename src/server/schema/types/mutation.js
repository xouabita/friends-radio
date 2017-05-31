const Mutation = `
type Mutation {
  addMedia(media: AddMediaInput!) : Media!,
  editMedia(media_id: String!, media: EditMediaInput!) : Media!
  deleteMedia(media_id: String!) : Media!
  addReaction(media_id: String!, type: ReactionType) : Reaction!,
  deleteReaction(media_id: String!, type: ReactionType): Reaction!
}
`

module.exports = [Mutation]
