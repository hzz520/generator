require('./check.versions')()

const { resolve } = require('path')
const webpack = require('webpack')
const Merge = require('webpack-merge')
const rimraf = require('rimraf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MyPlugin = require('webpack-hash-exclude-plugin')

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
rimraf.sync(resolve(__dirname, '../.tiny.cache.json'))
rimraf.sync(`${DIST_PATH}/*`)

const WebpackProdConfig = {
  devtool: '#cheap-source-map',
  entry: {},
  output: {
    publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].[chunkhash].js'
  },
  optimization: {
    minimize
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png)$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 1000,
              name: 'assets/imgs/[name].[hash:7].[ext]'
            }
          },
          {
            loader: require.resolve('nokey-tinypng-webpack-loader'),
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(scss)$/,
        include: SRC_PATH,
        exclude: [NODE_PATH, resolve(SRC_PATH, './assets')],
        use: [
          MiniCssExtractPlugin.loader,
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
        test: /\.(scss)$/,
        include: resolve(SRC_PATH, './assets'),
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
        exclude: /(node_modules|assets|global)/,
        use: [
          MiniCssExtractPlugin.loader,
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
        include: /(assets|global)/,
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
    new MyPlugin({
      excludeJs: ['vendor', 'styles', 'index'],
      excludeCss: ['styles']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
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
