
const { resolve } = require('path')

const SRC_PATH = resolve(__dirname, '../src')
const DIST_PATH = resolve(__dirname, '../build')
const VIEW_PATH = resolve(__dirname, '../src/views')
const NODE_PATH = resolve(__dirname, '../node_modules')

module.exports = {
  dev: {
    host: '0.0.0.0',
    port: 8089,
    publicPath: '/',
    autoOpenBrower: true,
    quiet: false
  },
  prod: {
    publicPath: '../',
    minimize: true,
    compressCss: true
  },
  paths: {
    SRC_PATH,
    DIST_PATH,
    VIEW_PATH,
    NODE_PATH
  },
  getView: (env) => {
    if (process.argv.indexOf('--view') > -1 && process.argv[process.argv.indexOf('--view') + 1] && process.argv[process.argv.indexOf('--view') + 1].indexOf('--') === -1) {
      return process.argv[process.argv.indexOf('--view') + 1]
    } else if (process.argv.indexOf('--view') > -1 && process.argv[process.argv.indexOf('--view') + 1] && process.argv[process.argv.indexOf('--view') + 1] === 'all') {
      return 'all'
    } else {
      return undefined
    }
  }
}
