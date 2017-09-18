const knex = require("../knex")

class Connection {
  constructor(type, {edgeFields = [], connectionFields = []} = {}) {
    this._type = type
    this.edgeFields = edgeFields
    this.connectionFields = connectionFields
  }

  get edgeType() {
    return `
      type ${this._type}Edge {
        cursor: String!
        node: ${this._type}
        ${this.edgeFields.join("\n")}
      }
    `
  }

  get connectionType() {
    return `
      type ${this._type}Connection {
        edges: [${this._type}Edge]
        nodes: [${this._type}]
        pageInfo: PageInfo!
        totalCount: Int!
        ${this.connectionFields.join("\n")}
      }
    `
  }

  field(name, customArgs = []) {
    const args = [
      "first: Int",
      "after: String",
      "last: Int",
      "before: String",
      ...customArgs,
    ]
    return `${name}(${args.join(", ")}): ${this._type}Connection`
  }

  get type() {
    return `
      ${this.edgeType}

      ${this.connectionType}
    `
  }

  encode(value) {
    return Buffer.from(JSON.stringify(value)).toString("base64")
  }

  decode(value) {
    return Buffer.from(value, "base64").toString()
  }

  async queryCount(query) {
    const countQuery = knex.count().from(query.clone().as("query"))
    const [{count}] = await countQuery

    return count
  }

  resolver(query, {cursorFrom = "created_at", direction = "desc"} = {}) {
    return async (_, {first, after, last, before}) => {
      query = query.clone()
      if (!first && !last) {
        throw new Error(
          "You must provide a 'first' or 'last' value to properly paginate" +
            ` the ${this._type}Connection'`,
        )
      }

      first = Math.max(first, 0)
      last = Math.max(last, 0)

      query.orderBy(cursorFrom, direction)

      const totalCount = await this.queryCount(query)

      if (after) {
        const afterCursor = this.decode(after)
        const operator = direction === "desc" ? "<" : ">"
        query.where(cursorFrom, operator, afterCursor)
      }

      if (before) {
        const beforeCursor = this.decode(before)
        const operator = direction === "desc" ? ">" : "<"
        query.where(cursorFrom, operator, beforeCursor)
      }

      const slicedNodesCount = await this.queryCount(query)

      if (first) {
        query.limit(first)
      }

      if (last) {
        query.offset(slicedNodesCount - last)
      }

      const nodes = await query.select()
      const pageInfo = {
        endCursor: this.encode(nodes[nodes.length - 1][cursorFrom]),
        startCursor: this.encode(nodes[0][cursorFrom]),
        hasNextPage: !!(
          first &&
          nodes.length >= first &&
          slicedNodesCount > first
        ),
        hasPreviousPage: !!(
          last &&
          nodes.length >= last &&
          slicedNodesCount > last
        ),
      }
      const edges = nodes.map(node => ({
        cursor: this.encode(node[cursorFrom]),
        node,
      }))

      return {
        edges,
        nodes,
        totalCount,
        pageInfo,
      }
    }
  }
}

exports.PageInfo = `
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }
`

exports.connection = function connection(...args) {
  return new Connection(...args)
}
