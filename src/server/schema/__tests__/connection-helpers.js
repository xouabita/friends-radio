const {connection} = require("../connection-helpers")
const {compose} = require("ramda")
const {parse, print} = require("graphql")

const prettyPrint = compose(print, parse)

const TestConnection = connection("Test")
const expectedEdgeType = `
  type TestEdge {
    cursor: String!
    node: Test
  }
`
const expectedConnectionType = `
  type TestConnection {
    edges: [TestEdge]
    nodes: [Test]
    pageInfo: PageInfo!
    totalCount: Int!
  }
`

test("Edge Type should be valid", () => {
  const prettyExpectation = prettyPrint(expectedEdgeType)
  const prettyTested = prettyPrint(TestConnection.edgeType)
  expect(prettyTested).toBe(prettyExpectation)
})

test("Connection Type should be valid", () => {
  const prettyExpectation = prettyPrint(expectedConnectionType)
  const prettyTested = prettyPrint(TestConnection.connectionType)
  expect(prettyTested).toBe(prettyExpectation)
})

test("type should return ConnectionType and EdgeType", () => {
  const prettyExpectation = prettyPrint(`
    ${expectedEdgeType}

    ${expectedConnectionType}
  `)
  const prettyTested = prettyPrint(TestConnection.type)
})

test("encode/decode", () => {
  const encodeDecode = compose(TestConnection.decode, TestConnection.encode)
  expect(encodeDecode("foobar42")).toBe(JSON.stringify("foobar42"))
})
