const razzleHeroku = require("razzle-heroku")

const graphqlRegexp = /\.(graphql|gql)$/
const graphqlLoader = {
  test: graphqlRegexp,
  exclude: /node_modules/,
  loader: "graphql-tag/loader",
}

const isFileLoader = rule => !rule.test

module.exports = {
  modify: (config, {target, dev}, webpack) => {
    config = razzleHeroku(config, {target, dev}, webpack)

    // Exclude graphql files from file loaders
    const fileLoaderIndex = config.module.rules.findIndex(isFileLoader)
    config.module.rules[fileLoaderIndex].exclude.push(graphqlRegexp)

    // Push graphqlLoader to rules
    config.module.rules.push(graphqlLoader)

    return config
  },
}
