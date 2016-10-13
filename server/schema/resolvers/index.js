const Query    = require('./query.js')
const Mutation = require('./mutation.js')
const Media    = require('./media.js')
const User     = require('./user.js')
const Reaction = require('./reaction.js')

const resolvers = module.exports = {
  User,
  Media,
  Query,
  Mutation,
  Reaction
}
