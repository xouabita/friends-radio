const knex = require('../../knex.js')

const Mutation = module.exports = {
  addMedia: (_, {media}, {me}) => {
    media.user_id = me.id
    return knex('medias').insert(media).returning('id').then(([id]) => {
      return knex('medias').where('id', id).then(([media]) => media)
    })
  }
}
