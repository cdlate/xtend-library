const glob = require('glob')
const writeFile = require('write')

// write xtend scss

let cssCore = ''
const cssCoreGlob = new glob.Glob('src/core/**/*.scss', { ignore: ['**/_*.scss'] }, (er, files) => {
  for (const file of files) {
    cssCore += `@import 'xtend-library/${file}';\n`
  }
})
cssCoreGlob.on('end', () => {
  writeFile('./src/core.scss', cssCore, (err) => {
    if (err) console.log(err)
  })
})

let cssAddons = ''
const cssAddonsGlob = new glob.Glob('src/addons/**/*.scss', { ignore: ['**/_*.scss'] }, (er, files) => {
  for (const file of files) {
    cssAddons += `@import 'xtend-library/${file}';\n`
  }
})
cssAddonsGlob.on('end', () => {
  writeFile('./src/addons.scss', cssAddons, (err) => {
    if (err) console.log(err)
  })
})

let cssExtensions = ''
const cssExtensionsGlob = new glob.Glob('src/extensions/**/*.scss', { ignore: ['**/_*.scss'] }, (er, files) => {
  for (const file of files) {
    cssExtensions += `@import 'xtend-library/${file}';\n`
  }
})
cssExtensionsGlob.on('end', () => {
  writeFile('./src/extensions.scss', cssExtensions, (err) => {
    if (err) console.log(err)
  })
})

let cssDemos = ''
const cssDemosGlob = new glob.Glob('src/private/demos/**/*.scss', { ignore: ['**/_*.scss'] }, (er, files) => {
  for (const file of files) {
    cssDemos += `@import 'xtend-library/${file}';\n`
  }
})
cssDemosGlob.on('end', () => {
  writeFile('./src/demos.scss', cssDemos, (err) => {
    if (err) console.log(err)
  })
})
