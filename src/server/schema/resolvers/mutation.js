const knex = require("../../knex.js")

module.exports = {
  addMedia: (_, {media}, {me}) => {
    media.user_id = me.id
    return knex("medias").insert(media).returning("id").then(([id]) => {
      return knex("medias").where("id", id).then(([media]) => media)
    })
  },
  editMedia: async (_, {media_id, media}, {me}) => {
    let [m] = await knex("medias").where({id: media_id})
    if (m.user_id !== me.id) {
      return m
    }
    await knex("medias").where({id: media_id}).update(media)
    return (await knex("medias").where({id: media_id}))[0]
  },
  deleteMedia: async (_, {media_id}, {me}) => {
    let [media] = await knex("medias").where({id: media_id, user_id: me.id})
    if (media) await knex("medias").where({id: media_id}).del()
    return media
  },
  addReaction: async (_, {media_id, type}, {me}) => {
    const data = {user_id: me.id, media_id}
    type = type.toLowerCase()
    const reaction = knex("reactions").where(data)
    const count = await reaction.update({type})
    if (!count) await knex("reactions").insert({...data, type})

    return (await knex.select().from("reactions").where(data))[0]
  },
  deleteReaction: async (_, {media_id, type}, {me}) => {
    const data = {user_id: me.id, media_id}
    const [reaction] = await knex.select().from("reactions").where(data)

    await knex("reactions").where(data).del()

    return reaction
  },
}
