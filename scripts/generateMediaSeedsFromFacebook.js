const {exec} = require('child-process-promise')
const input = require('./input.json')
const {writeFileSync} = require('fs')

const formatInfo = feed => Promise.resolve({
  user_id: feed.from.id,
  url: feed.link,
  description: feed.message
})

const fetchInfo = info =>
  exec(`youtube-dl -j ${info.url}`)
    .then(({stdout}) => stdout)
    .then(text => JSON.parse(text))
    .then(moreInfo => Object.assign(info, {
      duration: moreInfo.duration,
      thumbnail: moreInfo.thumbnails[0].url,
      title: moreInfo.title,
      artist: moreInfo.extractor === 'soundcloud' ? moreInfo.uploader : undefined
    }))

const filterInvalidUrl = feed => feed.link && (feed.link.includes('youtube') || feed.link.includes('soundcloud'))

const resolveChunk = (input_data) => new Promise(done => {
  const filtered = input_data.filter(filterInvalidUrl)
  const promises = filtered.map((feed) => formatInfo(feed)
    .then(fetchInfo)
    .catch(err => {
      console.log(err)
      return null
    }))
  Promise.all(promises).then(done).catch(err => console.log(err))
})

let result = []
const resolveChunks = (step, i) => {
  if (i > input.data.length) {
    writeFileSync('./result.json', JSON.stringify(result))
    return
  }
  resolveChunk(input.data.slice(i, i+step)).then(chunks => {
    result.push(...chunks)
    resolveChunks(step, i + step)
  })
}

resolveChunks(40, 0)
