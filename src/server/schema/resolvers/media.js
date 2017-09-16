const knex = require("../../knex.js")

module.exports = {
  posted_by: ({user_id}) =>
    knex("users").where("id", user_id).then(([user]) => user),
  myReaction: ({id}, _, {me}) =>
    !me
      ? null
      : knex("reactions")
          .where({user_id: me.id, media_id: id})
          .limit("1")
          .then(([row]) => row),
}
