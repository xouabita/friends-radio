const {exec} = require('child-process-promise')
const {writeFileSync} = require('fs')
const {fbOptions: {clientID, clientSecret}} = require('../config.js')
const fetch = require('node-fetch')

const formatInfo = feed => Promise.resolve({
  user_id: feed.from.id,
  url: feed.link,
  description: feed.message,
  created_at: feed.created_time
})

const FACEBOOK_GROUP_ID = process.env.FACEBOOK_GROUP_ID
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN

const BASE_URL  = 'https://graph.facebook.com'
const URL_FEED  = `/${FACEBOOK_GROUP_ID}`
const FIELDS    = 'fields=feed.limit(500){message,link,from,created_time}'

const getInput = async () => {
  const url = BASE_URL + URL_FEED +`?access_token=${USER_ACCESS_TOKEN}&${FIELDS}`
  console.log(url)
  const feed = await fetch(url)
  return await feed.json()
}

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

const resolveChunks = (input, step, i, result = []) => {
  if (i > input.feed.data.length) {
    writeFileSync('./result.json', JSON.stringify(result))
    return
  }
  resolveChunk(input.feed.data.slice(i, i+step)).then(chunks => {
    result.push(...chunks)
    resolveChunks(input, step, i + step, result)
  })
}

const getFeedAndSaveData = async () => {
  const input = await getInput()
  console.log(input)
  resolveChunks(input, 30, 0)
}

getFeedAndSaveData()
