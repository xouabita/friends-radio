
exports.up = function(knex, Promise) {
  return knex.schema.createTable('reactions', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    t.string('user_id').notNullable()
    t.string('media_id').notNullable()
    t.enu('type', ['like', 'dislike'])
    t.timestamp('created_at').defaultTo(knex.fn.now())

    t.foreign('user_id').references('users.id')
    t.foreign('media_id').references('medias.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('reactions')
};
