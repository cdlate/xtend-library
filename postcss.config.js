const path = require('path')
const fs = require('fs')

module.exports = {
  parser: 'postcss-scss',
  map: true,
  plugins: {
    'postcss-import': {
      // resolve xtend-library css
      resolve: function(id) {
        const arr = id.split('/')
        const first = arr[0]
        if (first === '~xtend-library') {
          arr.shift()
          const theme = path.resolve(__dirname, './' + arr.join('/'))
          const module = path.resolve(__dirname, './node_modules/' + arr.join('/'))
          if (fs.existsSync(theme)) {
            return theme
          } else {
            return module
          }
        }
      },
    },
    'postcss-mixins': {},
    'postcss-nesting': {},
    'postcss-simple-vars': {},
    'postcss-extend-rule': {},
    'postcss-object-fit-images': {},
    'postcss-calc': {
      mediaQueries: true,
    },
    'postcss-preset-env': {
      stage: 0,
      features: {
        'color-mod-function': { unresolved: 'warn' },
      },
    },
    autoprefixer: {},
  },
}
