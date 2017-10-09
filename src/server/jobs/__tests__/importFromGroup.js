const data = {
  feed: {
    data: [
      {
        link: "https://soundcloud.com/confession/tchami-malaa-summer-99",
        from: {
          name: "Alexandre Abita",
          id: "1219170918129550",
        },
        created_time: "2017-10-04T10:41:22+0000",
        id: "949912881715938_1857143850992832",
      },
      {
        message: "Gros sons. Gros clip.",
        link: "https://youtu.be/tkzY_VwNIek",
        from: {
          name: "Luc Bouillaguet",
          id: "10207760159337633",
        },
        created_time: "2017-10-01T13:04:23+0000",
        id: "949912881715938_1853726081334609",
      },
      {
        from: {
          name: "Alexandre Abita",
          id: "1219170918129550",
        },
        created_time: "2017-09-20T18:46:36+0000",
        id: "949912881715938_1841282059245678",
      },
    ],
  },
}

const fakeData = {
  json: jest.fn(),
}
const fakeUpdate = jest.fn()
const fakeWhere = jest.fn()
const fakeInsert = jest.fn()
const fakeKnex = jest.fn(() => ({
  where: fakeWhere,
  insert: fakeInsert,
}))
const fakeFetch = jest.fn(async () => fakeData)

beforeAll(() => {
  jest.doMock("../../knex", () => fakeKnex)
  jest.doMock("node-fetch", () => fakeFetch)
})

test("no song to import", async () => {
  const spyLog = jest.spyOn(console, "log")
  spyLog.mockImplementation(() => undefined)
  const importFromGroup = require("../importFromGroup")
  fakeWhere.mockImplementationOnce(async () => [{value: "fff"}])
  fakeData.json.mockImplementationOnce(() => ({}))
  await importFromGroup()
  expect(fakeInsert).not.toBeCalled()
  expect(spyLog).toBeCalledWith("No new songs to import")
})

test("new songs to import", async () => {
  const spyErr = jest.spyOn(console, "error")
  spyErr.mockImplementation(() => undefined)
  const importFromGroup = require("../importFromGroup")
  fakeWhere
    .mockImplementationOnce(async () => [{value: "fff"}])
    .mockImplementationOnce(() => ({
      update: fakeUpdate,
    }))
  fakeData.json.mockImplementationOnce(() => data)
  await importFromGroup()
  expect(fakeInsert.mock.calls).toMatchSnapshot()
  expect(spyErr.calls).toMatchSnapshot()
})
