const knex = require("../knex")
const knexCleaner = require("knex-cleaner")

const users = [{id: "1", name: "John Doe"}, {id: "2", name: "Jean-Luc Borgnol"}]
const medias = [
  {
    id: "6697c3b3-7934-45d5-bb0c-a985a262204f",
    user_id: "1",
    title: "Skrillex & Poo Bear - Would You Ever",
    url: "https://soundcloud.com/skrillex/wouldyouever",
    duration: "234.00",
    thumbnail:
      "https://i1.sndcdn.com/artworks-000235280255-5fyldq-t500x500.jpg",
    artist: "Skrillex",
    description: 'test3 "https://soundcloud.com/skrillex/wouldyouever"',
    created_at: new Date("2017-09-20T16:41:54.000Z"),
  },
  {
    id: "13c309d6-c4e6-4f8b-b52a-c05ae0c03e99",
    user_id: "2",
    title:
      "Major Lazer - Sua Cara (feat. Anitta & Pabllo Vittar) (Official Audio)",
    url: "https://www.youtube.com/watch?v=2TzEALB4qP0",
    duration: "169.00",
    thumbnail: "https://i.ytimg.com/vi/2TzEALB4qP0/maxresdefault.jpg",
    artist: null,
    description: "test2",
    created_at: new Date("2017-09-20T15:13:44.000Z"),
  },
  {
    id: "520051cd-f2e6-436f-9400-0b069de3d118",
    user_id: "2",
    title: "The Chemical Brothers - Asleep From Day",
    url: "https://www.youtube.com/watch?v=Cj7F0KU367s",
    duration: "298.00",
    thumbnail: "https://i.ytimg.com/vi/Cj7F0KU367s/hqdefault.jpg",
    artist: null,
    description: null,
    created_at: new Date("2017-09-16T23:25:51.000Z"),
  },
  {
    id: "ebe7610c-8d49-48a0-8ba0-22cf54d880ac",
    user_id: "1",
    title: 'Diplo ft. Jahan Lennon - "About That Life" (Official Music Video)',
    url: "https://www.youtube.com/watch?v=ylwggwp_YsY",
    duration: "187.00",
    thumbnail: "https://i.ytimg.com/vi/ylwggwp_YsY/maxresdefault.jpg",
    artist: null,
    description: null,
    created_at: new Date("2017-09-16T23:24:11.000Z"),
  },
  {
    id: "ca96d4e0-b35d-4016-ac6e-b756e75c6492",
    user_id: "2",
    title:
      "ビッチと会う feat. Weny Dacillo, Pablo Blasta & JP THE WAVY / DJ CHARI & DJ TATSUKI",
    url: "https://www.youtube.com/watch?v=qkg2st1CWKg",
    duration: "316.00",
    thumbnail: "https://i.ytimg.com/vi/qkg2st1CWKg/maxresdefault.jpg",
    artist: null,
    description: null,
    created_at: new Date("2017-09-11T15:47:38.000Z"),
  },
  {
    id: "8727546e-0a28-4a86-9721-a454ad4fc544",
    user_id: "1",
    title:
      "Yellow Claw - Good Day ft. DJ Snake & Elliphant [OFFICIAL MUSIC VIDEO]",
    url: "https://www.youtube.com/watch?v=RyMqplmQ_fE",
    duration: "252.00",
    thumbnail: "https://i.ytimg.com/vi/RyMqplmQ_fE/maxresdefault.jpg",
    artist: null,
    description: "Moi j'aime bien le dimanche",
    created_at: new Date("2017-09-10T15:38:43.000Z"),
  },
]
const reactions = [
  {
    id: "e37a3977-323f-4aaf-b53b-6036c3e89f32",
    user_id: "1",
    media_id: "6697c3b3-7934-45d5-bb0c-a985a262204f",
    type: "dislike",
    created_at: new Date("2017-09-23T16:22:46.769Z"),
  },
  {
    id: "a439c88e-88de-45f8-b140-f783e86fba94",
    user_id: "2",
    media_id: "13c309d6-c4e6-4f8b-b52a-c05ae0c03e99",
    type: "like",
    created_at: new Date("2017-09-23T16:29:11.802Z"),
  },
  {
    id: "73c8fd17-2ec6-4819-9434-878e153f3104",
    user_id: "1",
    media_id: "13c309d6-c4e6-4f8b-b52a-c05ae0c03e99",
    type: "dislike",
    created_at: new Date("2017-09-24T09:35:21.060Z"),
  },
  {
    id: "ea39f370-4295-4198-8e07-484b8a8bcfbe",
    user_id: "1",
    media_id: "8727546e-0a28-4a86-9721-a454ad4fc544",
    type: "like",
    created_at: new Date("2017-09-24T09:44:23.444Z"),
  },
]

beforeAll(async () => {
  await knexCleaner.clean(knex)
  await knex("users").insert(users)
  await knex("medias").insert(medias)
  await knex("reactions").insert(reactions)
})

describe("media resolver", () => {
  const mediaResolver = require("./resolvers/media")
  test("posted_by", async () => {
    const posted_by = await mediaResolver.posted_by(medias[0])
    expect(posted_by).toEqual(users[0])
  })
  test("myReaction", async () => {
    const myReaction = await mediaResolver.myReaction(medias[0], null, {
      me: users[0],
    })
    expect(myReaction).toEqual(reactions[0])
    const myNullReaction = await mediaResolver.myReaction(medias[0], null, {})
    expect(myNullReaction).toBeNull()
  })
})

describe("query resolver", () => {
  const queryResolver = require("./resolvers/query")
  test("user", async () => {
    const user = await queryResolver.user(null, {id: "2"})
    expect(user).toEqual(users[1])
  })
  test("me", async () => {
    const me = await queryResolver.me(null, null, {me: users[1]})
    expect(me).toEqual(users[1])
  })
  test("media", async () => {
    const media = await queryResolver.media(null, {
      id: "13c309d6-c4e6-4f8b-b52a-c05ae0c03e99",
    })
    expect(media).toEqual(medias[1])
  })
  test("medias", async () => {
    const mediasFirst = await queryResolver.medias(null, {first: 1})
    expect(mediasFirst).toMatchSnapshot()
    const mediasSecond = await queryResolver.medias(null, {
      first: 1,
      after: mediasFirst.pageInfo.endCursor,
    })
    expect(mediasSecond).toMatchSnapshot()
    const allMedias = await queryResolver.medias(null, {first: 10})
    expect(allMedias).toMatchSnapshot()
  })
})

describe("reaction resolver", () => {
  const reactionResolver = require("./resolvers/reaction")
  test("media", async () => {
    const media = await reactionResolver.media(reactions[1])
    expect(media).toEqual(medias[1])
  })
  test("user", async () => {
    const user = await reactionResolver.user(reactions[1])
    expect(user).toEqual(users[1])
  })
  test("type", async () => {
    const like = await reactionResolver.type(reactions[1])
    expect(like).toBe("LIKE")
    const dislike = await reactionResolver.type(reactions[0])
    expect(dislike).toBe("DISLIKE")
  })
})

describe("user resolver", () => {
  const userResolver = require("./resolvers/user")
  test("medias", async () => {
    const mediasUser0 = await userResolver.medias(users[0], {first: 10})
    const mediasUser1 = await userResolver.medias(users[1], {first: 10})
    expect(mediasUser0).toMatchSnapshot()
    expect(mediasUser1).toMatchSnapshot()
  })
  test("reactions", async () => {
    const likes = await userResolver.medias(users[0], {first: 10, type: "LIKE"})
    expect(likes).toMatchSnapshot()
    const dislikes = await userResolver.medias(users[0], {
      first: 10,
      type: "DISLIKE",
    })
    expect(dislikes).toMatchSnapshot()
  })
})

describe("mutation resolver", () => {
  const mutationResolver = require("./resolvers/mutation")
  test("addMedia minimum", async () => {
    const minimumMedia = {
      title: "Daughter - Candles",
      url: "https://www.youtube.com/watch?v=BucfErwPTWs",
      duration: "296.00",
    }
    const media = await mutationResolver.addMedia(
      null,
      {media: minimumMedia},
      {me: users[0]},
    )
    for (const key of ["title", "url", "duration"])
      expect(media[key]).toEqual(minimumMedia[key])
    const [{count}] = await knex("medias").count()
    expect(+count).toBe(medias.length + 1)
    const [mediaFromDb] = await knex("medias").where({id: media.id})
    expect(mediaFromDb).toEqual(media)
  })
  test("add media with all", async () => {
    const mediaWithAll = {
      title: "XO Tour Llif3",
      artist: "Lil Uzi Vert",
      url: "https://www.youtube.com/watch?v=WrsFXgQk5UI",
      duration: "257.00",
      thumbnail: "https://i.ytimg.com/vi/WrsFXgQk5UI/hqdefault.jpg",
      description: "I like this music so much",
    }
    const media = await mutationResolver.addMedia(
      null,
      {media: mediaWithAll},
      {me: users[0]},
    )
    for (const key of [
      "title",
      "url",
      "duration",
      "artist",
      "thumbnail",
      "description",
    ])
      expect(media[key]).toEqual(mediaWithAll[key])
    const [{count}] = await knex("medias").count()
    expect(+count).toBe(medias.length + 2)
    const [mediaFromDb] = await knex("medias").where({id: media.id})
    expect(mediaFromDb).toEqual(media)
  })
})
