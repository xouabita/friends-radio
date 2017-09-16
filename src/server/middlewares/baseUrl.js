module.exports = function baseUrl(req, res, next) {
  req.baseUrl = `${req.protocol}://${req.headers.host}`
  next()
}
