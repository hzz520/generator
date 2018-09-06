require('./check.versions')()

const webpack = require('webpack')
const Merge = require('webpack-merge')

const {
  getView,
  dev
//   paths
} = require('./config')

const {
  publicPath,
  host,
  port,
  autoOpenBrower,
  quiet
} = dev

// const {
// //   DIST_PATH
// } = paths

const WebpackBaseConfig = require('./webpack.base')

let env = 'development'
let view = getView(env)

const WebpackDevConfig = {
  mode: 'development',
  output: {
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    compress: true,
    host,
    port,
    quiet,
    open: autoOpenBrower
  }
}

module.exports = Merge(WebpackBaseConfig(env, view), WebpackDevConfig)
