
const { resolve } = require('path')

const SRC_PATH = resolve(__dirname, '../src')
const DIST_PATH = resolve(__dirname, '../build')
const VIEW_PATH = resolve(__dirname, '../src/views')
const NODE_PATH = resolve(__dirname, '../node_modules')
const VIEW_PRE = 'html'

module.exports = {
  dev: {
    host: '0.0.0.0',
    port: 8089,
    publicPath: '/',
    autoOpenBrower: true,
    quiet: false,
    openPage: `./${VIEW_PRE}/`,
    proxy: [
      {
        context: ['/api1/*'],
        target: 'http://10.252.63.100:3400',
        pathRewrite: { '^/api1': '' },
        changeOrigin: true,
        secure: false,
        ws: true
      },
      {
        context: ['/springEvent/**/*'],
        target: 'http://10.8.23.219:8001',
        // target: 'http://10.252.62.203:8001',
        // pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false,
        ws: true
      }
    ]
  },
  prod: {
    // publicPath: '//j1.58cdn.com.cn/frs/fangfe/spring-festival-activity-2019/1.0/',
    publicPath: '../',
    minimize: true,
    compressCss: true
  },
  paths: {
    SRC_PATH,
    DIST_PATH,
    VIEW_PATH,
    NODE_PATH,
    VIEW_PRE
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
