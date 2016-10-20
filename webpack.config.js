const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer-stylus')

const jsx = process.env.NODE_ENV === 'production'
  ? './index.js'
  : [
       'react-hot-loader/patch',
       'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
       './index.js'
    ]

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, './client'),
  entry: {
    jsx: jsx,
    html: './index.html',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ],
  },
  output: {
    path: path.join(__dirname, './static'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.styl$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.png$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    })
  ],
  stylus: {
    use: [autoprefixer()]
  }
}
