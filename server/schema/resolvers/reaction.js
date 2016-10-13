const knex = require('../../knex.js')

const Reaction = module.exports = {
  media: ({media_id}) =>
    knex('medias').where('id', media_id).then(([media]) => media),
  user: ({user_id}) =>
    knex('users').where('id', user_id).then(([user]) => user),
  type: (_, {type}) => type.toUpperCase()
}
