const port = process.env.PORT || 3000

const fbOptions = {
  clientID: process.env.RAZZLE_FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  profileFields: ["id", "displayName"],
}

const secret = process.env.MASTER_KEY || "jesuisunananas"

module.exports = {
  fbOptions,
  secret,
  port,
}
