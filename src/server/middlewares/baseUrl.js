module.exports = function baseUrl(req, res, next) {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol
  req.baseUrl = `${protocol}://${req.headers.host}`
  next()
}
