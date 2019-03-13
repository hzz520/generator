const webpack = require('webpack')
const Merge = require('webpack-merge')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const { resolve } = require('path')

const WebpackHtmlConfig = require('./webpack.html')
const {
  paths
} = require('./config')

const {
  SRC_PATH,
  DIST_PATH,
  NODE_PATH,
  VIEW_PATH
} = paths

module.exports = (env, view) => {
  let WebpackBaseConfig = {
    mode: env,
    entry: {},
    output: {
      path: DIST_PATH,
      filename: 'js/[name].js'
    },
    optimization: {
      occurrenceOrder: true,
      sideEffects: false,
      concatenateModules: true,
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          vendors: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          styles: {
            name: 'styles',
            test: /\.less$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
      alias: {
        // 'react': resolve(NODE_PATH, './react/index.js'),
        // 'react-dom': resolve(NODE_PATH, './react-dom/index.js'),
        // 'react-router-dom': resolve(NODE_PATH, './react-router-dom/umd/react-router-dom.min.js'),
        // 'react-id-swiper': resolve(NODE_PATH, './react-id-swiper/lib/index.js'),
        // 'react-transition-group': resolve(NODE_PATH, './react-transition-group/dist/react-transition-group.js'),
        // 'mobx': resolve(NODE_PATH, './mobx/lib/mobx.min.js'),
        // 'mobx-react': resolve(NODE_PATH, './mobx-react/index.min.js'),
        // 'querystring': resolve(NODE_PATH, './querystring/index.js'),
        // 'loadsh': resolve(NODE_PATH, './lodash/lodash.min.js'),
        // 'axios': resolve(NODE_PATH, './axios/dist/axios.min.js'),
        // 'rc-form': resolve(NODE_PATH, './rc-form/lib/index.js'),
        // 'js-cookie': resolve(NODE_PATH, './js-cookie'),
        // 'hsitory': resolve(NODE_PATH, './history/umd/hsitory.min.js'),
        // 'crypto-js': resolve(NODE_PATH, './crypto-js'),
        '@': SRC_PATH,
        '@utils': resolve(VIEW_PATH, './index/utils'),
        '@components': resolve(VIEW_PATH, './index/components'),
        '@pages': resolve(VIEW_PATH, './index/pages')
      }
    },
    module: {
      noParse: (content) => {
        return /Zepto|zepto|jQuery|WBAPP/.test(content)
      },
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: SRC_PATH,
          exclude: NODE_PATH,
          use: [
            'babel-loader',
            'eslint-loader'
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'medias/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    plugins: [
      new StyleLintPlugin({
        context: SRC_PATH,
        configFile: resolve(__dirname, '../.stylelintrc'),
        files: '**/*.scss',
        quiet: true,
        syntax: 'scss'
      }),
      new StyleLintPlugin({
        context: SRC_PATH,
        configFile: resolve(__dirname, '../.stylelintrc'),
        files: '**/*.less',
        quiet: true,
        syntax: 'less'
      }),
      new webpack.LoaderOptionsPlugin({ options: {} })
    ]
  }

  return Merge(WebpackBaseConfig, WebpackHtmlConfig(env, view))
}
