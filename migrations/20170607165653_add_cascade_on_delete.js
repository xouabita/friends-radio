exports.up = function(knex, Promise) {
  return knex.schema.table('reactions', t =>
    t.dropForeign('media_id')
  ).then(() => knex.schema.table('reactions', t =>
      t.foreign('media_id').references('medias.id').onDelete('CASCADE')
  ))
}

exports.down = function(knex, Promise) {
  return knex.schema.table('reactions', t =>
    t.dropForeign('media_id')
  ).then(() => knex.schema.table('reactions', t =>
      t.foreign('media_id').references('medias.id').onDelete('CASCADE')
  ))
}
