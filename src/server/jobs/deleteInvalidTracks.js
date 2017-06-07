const isValidTrack = require('../../isValidTrack')
const knex = require("../knex")
const a = require('awaiting')

knex('medias').select().then(medias => a.map(medias, 10, media =>
  isValidTrack(media.url).then(res => {
    if (!res) {
      return knex('medias').where('id', media.id).del()
    }
}))).then(res => console.log('done!'))
    .catch(err => console.log(err))
