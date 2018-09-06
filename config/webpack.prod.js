require('./check.versions')()

const webpack = require('webpack')
const Merge = require('webpack-merge')
const rimraf = require('rimraf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const {
  publicPath,
  minimize,
  compressCss
} = require('./config').prod
const {
  getView,
  paths
} = require('./config')

const {
  DIST_PATH,
  NODE_PATH,
  SRC_PATH
} = paths

const WebpackBaseConfig = require('./webpack.base')

let env = 'production'
let view = getView(env)

// if (view === 'all') {
//   rimraf.sync(`${DIST_PATH}/*`)
// } else if (view) {
//   rimraf.sync(`${DIST_PATH}/*/${view}.*`)
//   rimraf.sync(`${DIST_PATH}/js/vendor.*.js`)
//   rimraf.sync(`${DIST_PATH}/js/manifest.*.js`)
// }
rimraf.sync(`${DIST_PATH}/*`)

const WebpackProdConfig = {
  entry: {},
  output: {
    publicPath,
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js'
  },
  optimization: {
    minimize
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        include: SRC_PATH,
        exclude: NODE_PATH,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        include: SRC_PATH,
        exclude: NODE_PATH,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      allchunks: true
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}

if (compressCss) {
  WebpackProdConfig.plugins.push(new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      mergeLonghand: false,
      discardComments: { removeAll: true }
    },
    canPrint: true
  }))
}

module.exports = Merge(WebpackBaseConfig(env, view), WebpackProdConfig)
