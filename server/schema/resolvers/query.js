const knex = require('../../knex.js')

const Query = module.exports = {
  user(_, {id}) {
    return knex('users').where('id', id).then((rows) => {
      return rows[0]
    })
  },
  me(_, __, {me}) {
    return me
  }
}
