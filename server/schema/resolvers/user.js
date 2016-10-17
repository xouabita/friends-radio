const knex = require('../../knex.js')

const User = module.exports = {
  medias: ({id}, {skip, limit}) =>
    knex('medias').where('user_id', id)
      .limit(Math.min(50, limit)).offset(skip)
      .orderBy('created_at', 'desc'),
  likes: ({id}, {skip, limit}) =>
    knex.select('medias.*').from('reactions')
      .innerJoin('medias', 'medias.id', 'reactions.media_id')
      .where({'reactions.type': 'like'})
      .limit(Math.min(50, limit)).offset(skip)
      .orderBy('created_at', 'asc'),
  dislikes: ({id}, {skip, limit}) =>
    knex.select('medias.*').from('reactions')
      .innerJoin('medias', 'medias.id', 'reactions.media_id')
      .where({'reactions.type': 'dislike'})
      .limit(Math.min(50, limit)).offset(skip)
      .orderBy('created_at', 'asc'),
  mediaCount: ({id}) =>
    knex('medias').where('user_id', id).count('id as CNT').then((rows) =>
      rows[0].CNT),
  likeCount: ({id}) =>
    knex('reactions').where({user_id: id, type: 'like'}).count('id as CNT')
      .then(([row]) => row.CNT),
  dislikeCount: ({id}) =>
    knex('reactions').where({user_id: id, type: 'dislike'}).count('id as CNT')
      .then(([row]) => row.CNT)
}
