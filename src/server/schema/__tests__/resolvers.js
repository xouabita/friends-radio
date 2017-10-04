const knex = require("../../knex")
const knexCleaner = require("knex-cleaner")
const {fakeUsers, fakeMedias, fakeReactions} = require("../../__fixtures__")

const [users, medias, reactions] = [fakeUsers(), fakeMedias(), fakeReactions()]

beforeAll(async () => {
  await knexCleaner.clean(knex)
  await knex("users").insert(users)
  await knex("medias").insert(medias)
  await knex("reactions").insert(reactions)
})

describe("media resolver", () => {
  const mediaResolver = require("../resolvers/media")
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
  const queryResolver = require("../resolvers/query")
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
  const reactionResolver = require("../resolvers/reaction")
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
  const userResolver = require("../resolvers/user")
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
  const mutationResolver = require("../resolvers/mutation")
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
    expect(media.user_id).toBe(users[0].id)
    const [{count}] = await knex("medias").count()
    expect(+count).toBe(medias.length + 1)
    const [mediaFromDb] = await knex("medias").where({id: media.id})
    expect(mediaFromDb).toEqual(media)
  })
  test("addMedia with all", async () => {
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
    expect(media.user_id).toBe(users[0].id)
    const [{count}] = await knex("medias").count()
    expect(+count).toBe(medias.length + 2)
    const [mediaFromDb] = await knex("medias").where({id: media.id})
    expect(mediaFromDb).toEqual(media)
  })
  describe("editMedia", () => {
    const testId = "13c309d6-c4e6-4f8b-b52a-c05ae0c03e99"
    test("doesn't edit if user is not the same", async () => {
      const media = await mutationResolver.editMedia(
        null,
        {
          media_id: testId,
          media: {
            artist: "Major Lazer",
          },
        },
        {me: users[0]},
      )
      expect(media).toEqual(medias[1])
      const [mediaFromDb] = await knex("medias").where({id: testId})
      expect(mediaFromDb).toEqual(medias[1])
    })
    test("edit if user is the same", async () => {
      const media = await mutationResolver.editMedia(
        null,
        {
          media_id: testId,
          media: {
            artist: "Major Lazer",
          },
        },
        {me: users[1]},
      )
      expect(media.artist).toBe("Major Lazer")
      const [mediaFromDb] = await knex("medias").where({id: testId})
      expect(mediaFromDb).toEqual(media)
    })
  })
  describe("deleteMedia", () => {
    test("do not delete when user id is wrong", async () => {
      const inputMedia = {
        title: "test",
        url: "test",
        duration: "1.6",
      }
      const media = await mutationResolver.addMedia(
        null,
        {media: inputMedia},
        {me: users[0]},
      )
      const count = await knex("medias").count().then(([{count}]) => +count)
      const deletedMedia = await mutationResolver.deleteMedia(
        null,
        {media_id: media.id},
        {me: users[1]},
      )
      expect(deletedMedia).toBeUndefined()
      const newCount = await knex("medias").count().then(([{count}]) => +count)
      expect(newCount).toBe(count)
      const [mediaFromDb] = await knex("medias").where({id: media.id})
      expect(mediaFromDb).toBeDefined()
    })
    test("delete when user id is right", async () => {
      const inputMedia = {
        title: "test",
        url: "test",
        duration: "1.6",
      }
      const media = await mutationResolver.addMedia(
        null,
        {media: inputMedia},
        {me: users[0]},
      )
      const count = await knex("medias").count().then(([{count}]) => +count)
      const deletedMedia = await mutationResolver.deleteMedia(
        null,
        {media_id: media.id},
        {me: users[0]},
      )
      expect(deletedMedia.title).toBe("test")
      expect(deletedMedia.url).toBe("test")
      expect(deletedMedia.duration).toBe("1.60")
      const newCount = await knex("medias").count().then(([{count}]) => +count)
      expect(newCount).toBe(count - 1)
      const [mediaFromDb] = await knex("medias").where({id: media.id})
      expect(mediaFromDb).toBeUndefined()
    })
  })
  test("addMutation", async () => {
    const inputMutation = {
      media_id: medias[2].id,
      type: "LIKE",
    }
    const reaction = await mutationResolver.addReaction(null, inputMutation, {
      me: users[0],
    })
    expect(reaction.user_id).toBe(users[0].id)
    const [{count}] = await knex("reactions").count()
    expect(+count).toBe(reactions.length + 1)
    const [reactionFromDb] = await knex("reactions").where({id: reaction.id})
    expect(reactionFromDb).toEqual(reaction)
  })
  test("deleteMutation", async () => {
    const inputMutation = {
      media_id: medias[1].id,
      type: "LIKE",
    }
    const reaction = await mutationResolver.addReaction(null, inputMutation, {
      me: users[0],
    })
    const count = await knex("reactions").count().then(([{count}]) => +count)
    const deletedReaction = await mutationResolver.deleteReaction(
      null,
      inputMutation,
      {
        me: users[0],
      },
    )
    expect(deletedReaction.id).toBe(reaction.id)
    expect(deletedReaction.media_id).toBe(medias[1].id)
    expect(deletedReaction.type).toBe("like")
    const newCount = await knex("reactions").count().then(([{count}]) => +count)
    expect(newCount).toBe(count - 1)
    const [reactionFromDb] = await knex("reactions").where({id: reaction.id})
    expect(reactionFromDb).toBeUndefined()
  })
})
