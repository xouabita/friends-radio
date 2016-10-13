const ReactionType = `
enum ReactionType {
  LIKE
  DISLIKE
}
`

const Reaction = `
type Reaction {
  type: ReactionType
  media: Media
  user: User
}
`

module.exports = [Reaction, ReactionType]
