const users  = require('./users.json')
const medias = require('./medias.json')

exports.seed = function(knex, Promise) {
  return knex('medias').del()
    .then(() => knex('users').del())
    .then(() => Promise.all(users.map(user => knex('users').insert(user))))
    .then(() => Promise.all(medias
      .map(media => knex('medias').insert(media))))
};
