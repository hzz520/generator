require('./check.versions')()

const webpack = require('webpack')
const Merge = require('webpack-merge')
const { resolve } = require('path')

const {
  getView,
  dev,
  paths
} = require('./config')

const {
  publicPath,
  host,
  port,
  autoOpenBrower,
  quiet
} = dev

const {
  SRC_PATH,
  NODE_PATH
} = paths

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
        include: SRC_PATH,
        exclude: [NODE_PATH, resolve(SRC_PATH, './assets')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[hash:base64:5]'
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.scss$/,
        include: resolve(SRC_PATH, './assets'),
        exclude: NODE_PATH,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        include: SRC_PATH,
        exclude: [NODE_PATH, resolve(SRC_PATH, './assets')],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[hash:base64:5]'
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.less$/,
        include: resolve(SRC_PATH, './assets'),
        exclude: NODE_PATH,
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
