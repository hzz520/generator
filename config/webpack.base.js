const webpack = require('webpack')
const Merge = require('webpack-merge')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const WebpackHtmlConfig = require('./webpack.html')
const {
  paths
} = require('./config')

const {
  SRC_PATH,
  DIST_PATH,
  NODE_PATH
} = paths

module.exports = (env, view) => {
  let WebpackBaseConfig = {
    mode: 'development',
    entry: {},
    output: {
      path: DIST_PATH,
      filename: 'js/[name].[hash].js'
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
          }
        }
      }
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.scss', '.css'],
      alias: {
        'vue': resolve(NODE_PATH, './vue/dist/vue.esm.js'),
        'vue-router': resolve(NODE_PATH, './vue-router/dist/vue-router.esm.js'),
        'vuex': resolve(NODE_PATH, './vuex/dist/vuex.esm.js'),
        '@': SRC_PATH
      }
    },
    module: {
      noParse: (content) => {
        return /Zepto|zepto|jQuery/.test(content)
      },
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx|vue)$/,
          include: SRC_PATH,
          exclude: NODE_PATH,
          use: [
            {
              loader: 'eslint-loader'
            }
          ]
        },
        {
          test: /\.(js|jsx)$/,
          include: SRC_PATH,
          exclude: NODE_PATH,
          use: [
            'babel-loader'
          ]
        },
        {
          test: /\.vue$/,
          include: SRC_PATH,
          exclude: NODE_PATH,
          use: {
            loader: 'vue-loader',
            options: {
              preserveWhitespace: false,
              extractCSS: true,
              transformAssetUrls: {
                video: ['src', 'poster'],
                source: 'src',
                img: 'src',
                image: 'xlink:href'
              }
            }
          }
        },
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
      new VueLoaderPlugin(),
      new webpack.LoaderOptionsPlugin({ options: {} })
    ]
  }

  return Merge(WebpackBaseConfig, WebpackHtmlConfig(env, view))
}
