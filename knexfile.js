module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'radiozizi_user',
      database: 'radiozizi_development'
    },
    migrations: {
      directory: './server/migrations'
    },
    seeds: {
      directory: './server/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './server/migrations'
    },
    seeds: {
      directory: './server/seeds'
    }
  }
}
