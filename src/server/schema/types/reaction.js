const ReactionType = `
enum ReactionType {
  LIKE
  DISLIKE
}
`

const Reaction = `
type Reaction {
  id: String!
  type: ReactionType!
  media: Media!
  user: User!
}
`

module.exports = [Reaction, ReactionType]
