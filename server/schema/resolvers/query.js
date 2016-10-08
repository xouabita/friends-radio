const knex = require('../../knex.js')

const Query = module.exports = {
  user: (_, {id}) => knex('users').where('id', id).then(([user]) => user),
  me: (_, __, {me}) => me,
  media: (_, {id}) => knex('medias').where('id', id).then(([media]) => media),
  medias: () => knex.select().from('medias')
}
