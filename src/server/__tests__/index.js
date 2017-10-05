const request = require("supertest")

const fakeSetupFb = jest.fn((req, res, next) => next())
const fakeAuthenticate = jest.fn()
const fakePassport = {
  authenticate: jest.fn(() => fakeAuthenticate),
}
const fakeJwt = {
  sign: jest.fn(() => "supertoken"),
}
jest.doMock("passport", () => fakePassport)
jest.doMock("../middlewares/setupFbStrategy", () => fakeSetupFb)
jest.doMock("jsonwebtoken", () => fakeJwt)

process.env.RAZZLE_PUBLIC_DIR = "."

// mock assets.json
process.env.RAZZLE_ASSETS_MANIFEST = "."
jest.doMock(".", () => ({
  client: {
    css: "client_test.css",
    js: "client_test.js",
  },
}))

const app = require("..")

test("/auth/facebook", async () => {
  fakeAuthenticate.mockImplementationOnce((req, res) => res.sendStatus(200))
  await request(app).get("/auth/facebook").expect(200)
  expect(fakePassport.authenticate).toBeCalledWith("facebook")
  expect(fakeSetupFb).toBeCalled()
})

test("/auth/facebook/callback", async () => {
  fakeAuthenticate.mockImplementationOnce((req, res, next) => {
    req.user = {id: "super_id"}
    next()
  })
  const {res} = await request(app).get("/auth/facebook/callback").expect(302)
  expect(res.headers["set-cookie"]).toMatchSnapshot()
})
