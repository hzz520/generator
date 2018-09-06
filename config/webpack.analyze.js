const Merge = require('webpack-merge')
const WebpackProdConfig = require('./webpack.prod')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = Merge(WebpackProdConfig, {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
