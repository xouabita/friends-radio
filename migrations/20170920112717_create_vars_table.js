exports.up = (knex, Promise) => {
  return knex.schema
    .createTable("vars", t => {
      t.string("name").primary()
      t.string("value")
    })
    .then(() =>
      knex("vars").insert({
        name: "lastFacebookImport",
        value: +new Date(0),
      }),
    )
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("vars")
}
