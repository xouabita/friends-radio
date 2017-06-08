module.exports = {
  development: {
    client: 'pg',
    connection: {
      user: 'friendsradio_user',
      database: 'friendsradio_dev'
    },
  },
  production: {
    client: 'pg',
    connection: process.env.RAZZLE_DATABASE_URL,
  }
}
