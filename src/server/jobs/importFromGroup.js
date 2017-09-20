const {exec} = require("child-process-promise")
const fetch = require("node-fetch")
const knex = require("../knex")
const awaiting = require("awaiting")

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

async function getFeed() {
  const url = await getUrl()
  console.log(url)
  const {feed} = await fetch(url).then(data => data.json())
  const filterPost = post =>
    post.link &&
    (post.link.includes("youtube") || post.link.includes("soundcloud"))
  return feed.data.filter(filterPost)
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
  try {
    const info = await exec(`youtube-dl -j ${post.url}`)
      .then(({stdout}) => stdout)
      .then(text => JSON.parse(text))
      .then(moreInfo =>
        Object.assign(post, {
          duration: moreInfo.duration,
          thumbnail: moreInfo.thumbnails[0].url,
          title: moreInfo.title,
          artist:
            moreInfo.extractor === "soundcloud" ? moreInfo.uploader : undefined,
        }),
      )
    return info
  } catch (e) {
    return null
  }
}

async function formatFeed(feed) {
  const formatedFeed = feed.map(formatPost)
  const formatedFeedWithInfos = await awaiting.map(formatedFeed, 10, fetchInfo)
  return formatedFeedWithInfos
}

async function importFromGroup() {
  try {
    const feed = await getFeed()
    const medias = await formatFeed(feed)
    await knex("medias").insert(medias)
    await knex("vars")
      .where("name", "lastFacebookImport")
      .update({value: new Date() / 1000})
  } catch (e) {
    console.error(`Couldn't import from group '${FACEBOOK_GROUP_ID}''`)
    console.error(e)
  }
}

module.exports = importFromGroup

if (require.main === module) {
  console.log("should not be here")
  importFromGroup()
}
