const users = [{
  "name": "Maxime Chllx",
  "id": "10204356502977896",
  "gender": true
},
{
  "name": "Vincent Abita",
  "id": "874783759252163",
  "gender": true
},
{
  "name": "Kévin Royère",
  "id": "608319465960119",
  "gender": true
},
{
  "name": "Nicolas Lucas de Peslouan",
  "id": "10208233675354042",
  "gender": true
},
{
  "name": "Luc Bouillaguet",
  "id": "10204351158914753",
  "gender": true
},
{
  "name": "Alexandre Abita",
  "id": "745012025545444",
  "gender": true
}]

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all(users.map(user => knex('users').insert(user)))
    });
};
