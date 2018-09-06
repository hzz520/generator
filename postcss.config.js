module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'postcss-cssnext': {},
    'postcss-write-svg': {},
    'postcss-px-to-viewport': {
      viewportWidth: 750,
      selectorBlackList: ['.ignore', '.hairlines']
    }
  }
}
