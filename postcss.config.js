const path = require('path')
const fs = require('fs')
const postcsImport = require('postcss-import')
const postcssMixins = require('postcss-mixins')
const postcssNesting = require('postcss-nesting')
const postcssSimpleVars = require('postcss-simple-vars')
const postcssExtendRule = require('postcss-extend-rule')
const postcssObjectFitImages = require('postcss-object-fit-images')
const postcssCalc = require('postcss-calc')
const postcssPresetEnv = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')

module.exports = {
  parser: 'postcss-scss',
  map: true,
  plugins: [
    postcsImport({
      // resolve xtend-library
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
    }),
    postcssMixins(),
    postcssNesting(),
    postcssSimpleVars(),
    postcssExtendRule(),
    postcssObjectFitImages(),
    postcssCalc({
      mediaQueries: true,
    }),
    postcssPresetEnv({
      stage: 0,
      features: {
        'color-mod-function': { unresolved: 'warn' },
      },
    }),
    autoprefixer(),
  ],
}
