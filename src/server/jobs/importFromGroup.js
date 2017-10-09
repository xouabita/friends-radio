const fetch = require("node-fetch")
const knex = require("../knex")
const awaiting = require("awaiting")
const youtubeInfo = require("youtube-info")
const youtubeVideoId = require("youtube-video-id")
const {JSDOM} = require("jsdom")
const getUrls = require("get-urls")

const FACEBOOK_GROUP_ID = process.env.FACEBOOK_GROUP_ID
const USER_ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN
const BASE_URL = "https://graph.facebook.com"
const URL_FEED = `/${FACEBOOK_GROUP_ID}`

async function getUrl() {
  const [{value}] = await knex("vars").where("name", "lastFacebookImport")
  const since = +value

  const fields = `fields=feed.since(${since}).limit(500){message,link,from,created_time}`
  return `${BASE_URL + URL_FEED}?access_token=${USER_ACCESS_TOKEN}&${fields}`
}

async function soundcloudInfo(url) {
  const wholePage = await JSDOM.fromURL(url)
  const articleString = Array.from(
    wholePage.window.document.getElementsByTagName("noscript"),
  ).find(elem => elem.innerHTML.includes("article")).innerHTML

  const article = new JSDOM(articleString)
  const articleDoc = article.window.document

  const [title, artist] = Array.from(
    articleDoc.querySelectorAll('[itemprop="name"] a'),
  ).map(elem => elem.textContent)

  const [h, m, s] = articleDoc
    .querySelector('[itemprop="duration"]')
    .content.replace("PT", "")
    .split(/H|M|S/)

  const duration = +h * 3600 + +m * 60 + +s

  const thumbnail = articleDoc.querySelector('p [itemprop="image"]').src

  return {
    title,
    artist,
    duration,
    thumbnail,
  }
}

async function getFeed() {
  const url = await getUrl()
  const {feed} = await fetch(url).then(data => data.json())
  return (feed || {}).data
}

function formatPost(post) {
  return {
    user_id: post.from.id,
    url: post.link,
    description: post.message,
    created_at: post.created_time,
  }
}

async function fetchInfo(post) {
  if (!post.url && post.description) {
    const urls = Array.from(getUrls(post.description))
    post.url = urls[0]
  }
  try {
    const youtubeId = youtubeVideoId(post.url)
    if (youtubeId !== post.url) {
      let ytInfo
      for (var i = 0; i < 3; i++)
        try {
          ytInfo = await youtubeInfo(youtubeVideoId(post.url))
        } catch (e) {
          if (i === 2) throw e
        }
      return Object.assign({}, post, {
        duration: ytInfo.duration,
        title: ytInfo.title,
        thumbnail: ytInfo.thumbnailUrl,
      })
    } else if (post.url.includes("soundcloud")) {
      const scInfo = await soundcloudInfo(post.url)
      return Object.assign({}, post, scInfo)
    } else {
      throw new Error(`invalid url: ${post.url}`)
    }
  } catch (e) {
    console.error(`Couldn't import ${post.url}`)
    console.error(e)
    return null
  }
}

async function formatFeed(feed) {
  const formatedFeed = feed.map(formatPost)
  const formatedFeedWithInfos = await awaiting.map(formatedFeed, 10, fetchInfo)
  return formatedFeedWithInfos.filter(
    media => media && media.title && media.duration && media.url,
  )
}

async function importFromGroup() {
  try {
    const feed = await getFeed()
    if (!feed) {
      console.log("No new songs to import")
      return
    }
    const medias = await formatFeed(feed)
    await knex("medias").insert(medias)
    await knex("vars")
      .where("name", "lastFacebookImport")
      .update({value: parseInt(new Date() / 1000, 10)})
  } catch (e) {
    console.error(`Couldn't import from group '${FACEBOOK_GROUP_ID}''`)
    console.error(e)
  }
}

module.exports = importFromGroup

if (require.main === module) {
  importFromGroup().then(() => console.log("DONE!!!!"))
}
