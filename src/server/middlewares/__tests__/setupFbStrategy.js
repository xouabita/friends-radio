describe("setupFbStrategy when first request", () => {
  const fakePassport = {
    use: jest.fn(),
  }
  const fakeFbStartegy = jest.fn()
  const fakeConfig = {
    fbOptions: {foo: "bar"},
  }
  const fakeThen = jest.fn()
  const fakeWhere = jest.fn(() => ({then: fakeThen}))
  const fakeInsert = jest.fn()
  const fakeKnex = jest.fn(() => ({
    where: fakeWhere,
    insert: fakeInsert,
  }))
  jest.doMock("passport", () => fakePassport)
  jest.doMock("passport-facebook", () => ({Strategy: fakeFbStartegy}))
  jest.doMock("../../../config", () => fakeConfig)
  jest.doMock("../../knex", () => fakeKnex)
  jest.spyOn(console, "log").mockImplementation(() => undefined)

  const fakeReq = {
    app: {
      get: jest.fn(() => false),
      set: jest.fn(),
    },
    baseUrl: "BASE_URL",
  }
  const fakeNext = jest.fn()
  const setupFbStrategy = require("../setupFbStrategy")
  setupFbStrategy(fakeReq, null, fakeNext)

  const options = fakeFbStartegy.mock.calls[0][0]
  const fbStrategy = fakeFbStartegy.mock.calls[0][1]

  test("it should call next", () => {
    expect(fakeNext).toBeCalled()
  })

  test("it should get/set fbStrategySetup", () => {
    expect(fakeReq.app.get).toBeCalledWith("fbStrategySetup")
    expect(fakeReq.app.set).toBeCalledWith("fbStrategySetup", true)
  })

  test("it should setup FbStrategy with right options", () => {
    expect(options).toEqual({
      foo: "bar",
      callbackURL: "BASE_URL/auth/facebook/callback",
    })
  })

  describe("fbStrategy callback", () => {
    const fakeProfile = {
      displayName: "Foo Bar",
      id: "fake_id",
    }
    const fakeDone = jest.fn()
    fbStrategy("fake_token", null, fakeProfile, fakeDone)
    const then = fakeThen.mock.calls[0][0]

    test("it should return profile when user exists", () => {
      then(["foobar"])
      expect(fakeDone).toBeCalledWith(null, fakeProfile)
      expect(fakeWhere).toBeCalledWith("id", "fake_id")
    })

    test("it should insert user if he doesn't exist", () => {
      const fakeInsertThen = jest.fn()
      fakeInsert.mockReturnValueOnce({
        then: fakeInsertThen,
      })
      then([])
      const insertThen = fakeInsertThen.mock.calls[0][0]
      insertThen()
      expect(fakeInsert).toBeCalledWith({
        id: fakeProfile.id,
        name: fakeProfile.displayName,
      })
      expect(fakeDone).toBeCalledWith(null, fakeProfile)
    })
  })
})

test("setupFbStrategy after the first request", () => {
  const fakeReq = {
    app: {
      get: jest.fn(() => true),
    },
  }
  const fakeNext = jest.fn()
  const setupFbStrategy = require("../setupFbStrategy")
  setupFbStrategy(fakeReq, null, fakeNext)
  expect(fakeReq.app.get).toBeCalledWith("fbStrategySetup")
  expect(fakeNext).toBeCalled()
})
