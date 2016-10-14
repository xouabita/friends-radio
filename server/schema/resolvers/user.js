const knex = require('../../knex.js')

const User = module.exports = {
  medias: ({id}, {skip, limit}) =>
    knex('medias').where('user_id', id)
      .limit(Math.min(50, limit)).offset(skip)
      .orderBy('created_at', 'desc'),
  mediaCount: ({id}) =>
    knex('medias').where('user_id', id).count('id as CNT').then((rows) =>
      rows[0].CNT)
}
