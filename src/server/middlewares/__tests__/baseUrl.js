const baseUrl = require("../baseUrl")

test("it should works without 'x-forwarded-proto'", async () => {
  const fakeReq = {
    headers: {
      host: "bar",
    },
    protocol: "foo",
  }
  const fakeNext = jest.fn()
  baseUrl(fakeReq, null, fakeNext)
  expect(fakeReq.baseUrl).toBe("foo://bar")
  expect(fakeNext).toBeCalled()
})

test("it should works with 'x-forwarded-proto'", async () => {
  const fakeReq = {
    headers: {
      host: "bar",
      "x-forwarded-proto": "foo",
    },
    protocol: "lol",
  }
  const fakeNext = jest.fn()
  baseUrl(fakeReq, null, fakeNext)
  expect(fakeReq.baseUrl).toBe("foo://bar")
  expect(fakeNext).toBeCalled()
})
