const {makeExecutableSchema} = require('graphql-tools')

const resolvers = require('./resolvers')
const typeDefs  = require('./types')

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})
