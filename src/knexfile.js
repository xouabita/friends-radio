module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'friendsradio_user',
      database: 'friendsradio_dev'
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
