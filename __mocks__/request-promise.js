const req = require("request")

module.exports = params =>
  new Promise((resolve, reject) => {
    req(params, (err, res, body) => {
      if (err) reject(err)
      else resolve(body)
    })
  })
