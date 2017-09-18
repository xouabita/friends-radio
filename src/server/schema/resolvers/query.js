const knex = require("../../knex.js")
const MediaConnection = require("../connections/MediaConnection")

module.exports = {
  user: (_, {id}) => knex("users").where("id", id).then(([user]) => user),
  me: (_, __, {me}) => me,
  media: (_, {id}) => knex("medias").where("id", id).then(([media]) => media),
  test_medias: MediaConnection.resolver(knex("medias")),
  medias: (_, {skip, limit}) =>
    knex("medias")
      .select()
      .limit(Math.min(50, limit))
      .offset(skip)
      .orderBy("created_at", "desc"),
}
