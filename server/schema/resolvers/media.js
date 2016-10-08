const knex = require('../../knex.js')

const Media = module.exports = {
  posted_by: ({user_id}) => knex('users').where('id', user_id).then(([user]) => user)
}
