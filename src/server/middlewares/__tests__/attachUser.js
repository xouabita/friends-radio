beforeEach(() => {
  jest.resetModules()
})

test("it should not attach user if no jwt_token cookies", async () => {
  const attachUser = require("../attachUser")

  const fakeReq = {
    cookies: {},
  }
  const fakeRes = {
    clearCookie: jest.fn(),
  }
  const fakeNext = jest.fn()
  await attachUser(fakeReq, fakeRes, fakeNext)
  expect(fakeReq.user).toBeFalsy()
  expect(fakeRes.clearCookie).toBeCalledWith("jwt_token")
  expect(fakeNext).toBeCalled()
})

test("it should not attach user if jwt_token is invalid", async () => {
  jest.doMock("jsonwebtoken", () => ({
    verify: jest.fn(() => {
      throw "Error"
    }),
  }))
  const attachUser = require("../attachUser")

  const fakeReq = {
    cookies: {
      jwt_token: "foobar",
    },
  }
  const fakeRes = {
    clearCookie: jest.fn(),
  }
  const fakeNext = jest.fn()
  await attachUser(fakeReq, fakeRes, fakeNext)
  expect(fakeReq.user).toBeFalsy()
  expect(fakeRes.clearCookie).toBeCalledWith("jwt_token")
  expect(fakeNext).toBeCalled()
})

test("it should clearCookie if no users in db", async () => {
  jest.doMock("jsonwebtoken", () => ({
    verify: jest.fn(() => ({id: "foo"})),
  }))
  const fakeWhere = jest.fn(() => [])
  const fakeKnex = jest.fn(() => ({where: fakeWhere}))
  jest.doMock("../../knex", () => fakeKnex)
  const attachUser = require("../attachUser")

  const fakeReq = {
    cookies: {
      jwt_token: "foobar",
    },
  }
  const fakeRes = {
    clearCookie: jest.fn(),
  }
  const fakeNext = jest.fn()
  await attachUser(fakeReq, fakeRes, fakeNext)
  expect(fakeReq.user).toBeFalsy()
  expect(fakeRes.clearCookie).toBeCalledWith("jwt_token")
  expect(fakeNext).toBeCalled()
  expect(fakeKnex).toBeCalledWith("users")
  expect(fakeWhere).toBeCalledWith("id", "foo")
})

test("it should set req.user if everything is ok", async () => {
  jest.doMock("jsonwebtoken", () => ({
    verify: jest.fn(() => ({id: "foo"})),
  }))
  const fakeWhere = jest.fn(() => ["fakeUser"])
  const fakeKnex = jest.fn(() => ({where: fakeWhere}))
  jest.doMock("../../knex", () => fakeKnex)
  const attachUser = require("../attachUser")

  const fakeReq = {
    cookies: {
      jwt_token: "foobar",
    },
  }
  const fakeRes = {
    clearCookie: jest.fn(),
  }
  const fakeNext = jest.fn()
  await attachUser(fakeReq, fakeRes, fakeNext)
  expect(fakeReq.user).toBe("fakeUser")
  expect(fakeRes.clearCookie).not.toBeCalled()
  expect(fakeNext).toBeCalled()
  expect(fakeKnex).toBeCalledWith("users")
  expect(fakeWhere).toBeCalledWith("id", "foo")
})
