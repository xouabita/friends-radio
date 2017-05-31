exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', t => {
    t.string('id').primary()
    t.string('name')
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
};
