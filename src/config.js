const port = process.env.PORT || 3000
const baseUrl = process.env.RAZZLE_BASE_URL || `http://localhost:${port}`

const fbOptions = {
  clientID: process.env.RAZZLE_FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${baseUrl}/auth/facebook/callback`,
  profileFields: ["id", "displayName"],
}

const secret = process.env.MASTER_KEY || "jesuisunananas"

module.exports = {
  baseUrl,
  fbOptions,
  secret,
  port,
}
