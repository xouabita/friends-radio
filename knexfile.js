module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'radiozizi_user',
      database: 'radiozizi_development'
    },
    migrations: {
      directory: './server/migrations'
    }
  },
}
