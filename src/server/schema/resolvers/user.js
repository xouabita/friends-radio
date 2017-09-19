const knex = require("../../knex.js")
const MediaConnection = require("../connections/MediaConnection")

module.exports = {
  medias: MediaConnection.resolver(({id}) =>
    knex("medias").where("user_id", id),
  ),
  reactions: MediaConnection.resolver(
    ({id}, {type}) =>
      knex
        .select("medias.*", "reactions.created_at as reaction_created_at")
        .from("reactions")
        .innerJoin("medias", "medias.id", "reactions.media_id")
        .where({
          "reactions.type": type.toLowerCase(),
          "reactions.user_id": id,
        }),
    {cursorFrom: "reaction_created_at"},
  ),
}
