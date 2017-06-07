const axios = require('axios')
const getYoutubeId = require('get-youtube-id')

module.exports = function isValidTrack(url) {
  const id = getYoutubeId(url)
  if (id) {
    url = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  }
  return new Promise(resolve => {
    axios.head(url)
      .then(() => resolve(true))
      .catch(() => resolve(false))
  })
}
