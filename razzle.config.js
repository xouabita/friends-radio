module.exports = {
  modify(config, {target, dev}, webpack) {
    config.module.rules.push({
        test: /\.styl$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'stylus-loader'
        ]
    })

    return config
  }
}
