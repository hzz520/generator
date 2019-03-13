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
  quiet,
  openPage,
  proxy
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
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        include: SRC_PATH,
        exclude: NODE_PATH,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/imgs/[name].[hash:7].[ext]'
            }
          },
          'image-webpack-loader'
        ]
      },
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
        // exclude: [NODE_PATH, resolve(SRC_PATH, './assets'), resolve(VIEW_PATH, './index/components/common/toast')],
        exclude: /(node_modules|assets|global)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]-[local]-[hash:base64:5]'
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.less$/,
        // include: [resolve(SRC_PATH, './assets'), resolve(VIEW_PATH, './index/components/common/toast'), resolve(SRC_PATH, './assets')],
        include: /(assets|global)/,
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
    contentBase: resolve(__dirname, '../build'),
    hot: true,
    inline: true,
    historyApiFallback: false,
    useLocalIp: true,
    compress: true,
    writeToDisk: false,
    host,
    port,
    quiet,
    open: autoOpenBrower,
    openPage,
    proxy: proxy
  }
}

module.exports = Merge(WebpackBaseConfig(env, view), WebpackDevConfig)
