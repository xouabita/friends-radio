module.exports = {
  development: {
    client: "pg",
    connection: {
      user: "friendsradio_user",
      database: "friendsradio_dev",
    },
  },
  test: {
    client: "pg",
    connection: {
      user: "friendsradio_user",
      database: "friendsradio_test",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
  },
}
