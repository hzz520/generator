const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const { resolve } = require('path')
const chalk = require('chalk')

const {
  VIEW_PATH
} = require('./config').paths

module.exports = (env, viewPath) => {
  const htmlConf = {
    entry: {},
    plugins: []
  }

  const setEntryPlugins = (view) => {
    const viewPathJs = resolve(VIEW_PATH, `${view}/index.jsx`)
    const viewPathHtml = resolve(VIEW_PATH, `${view}/index.html`)

    if (fs.existsSync(viewPathJs) && fs.existsSync(viewPathHtml)) {
      htmlConf.entry[view] = viewPathJs

      htmlConf.plugins.push(new HtmlWebpackPlugin({
        inject: true,
        chunks: ['manifest', 'vendor', `${view}`],
        template: viewPathHtml,
        filename: `html/${view}.html`
      }))
    } else {
      // throw new Error('Not Found', viewPathJs, 'or', viewPathHtml)
      console.error(chalk.red(`Not Found ${viewPathJs} or ${viewPathHtml}`))
      process.exit(1)
    }
  }

  if (viewPath && viewPath !== 'all') {
    setEntryPlugins(viewPath)
  } else if (viewPath === undefined) {
    // console.log(process.env)
    let {
      type
    } = process.env
    // let temp = env === 'development' ? 'dev' : 'build'
    console.error(chalk.red('you should run script with'), chalk.red(`npm run ${type} -- --view all|[view] `), chalk.gray('// 多页应用对应的页面文件夹'))
    process.exit()
  } else {
    const subDirs = fs.readdirSync(VIEW_PATH)
    subDirs.map(view => {
      if (fs.lstatSync(resolve(VIEW_PATH, view)).isDirectory()) {
        setEntryPlugins(view)
      }
    })
  }

  return htmlConf
}
