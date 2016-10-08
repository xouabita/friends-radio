exports.up = function(knex, Promise) {
  return knex.raw('create extension if not exists "uuid-ossp"').then(() => {
    return knex.schema.createTable('medias', t => {
      t.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      t.string('user_id').notNullable()

      t.string('title').notNullable()
      t.string('url').notNullable()
      t.decimal('duration').notNullable()
      t.string('thumbnail')
      t.string('artist')
      t.text('description')

      t.timestamp('created_at').defaultTo(knex.fn.now())
      t.foreign('user_id').references('users.id')
    })
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('medias').then(() => {
    knex.raw('drop extension if exists "uuid-ossp"')
  })
};
