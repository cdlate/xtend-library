const glob = require('glob')
const writeFile = require('write')

// build xtend js

let jsCore = ''
const jsCoreGlob = new glob.Glob('src/core/**/*.js', (er, files) => {
  jsCore += `if (typeof window !== 'undefined') {\n`
  for (const file of files) {
    jsCore += `  require('xtend-library/${file}')\n`
  }
  jsCore += '}'
  jsCore += '\n'
})
jsCoreGlob.on('end', () => {
  writeFile('./src/xtend-core.js', jsCore, (err) => {
    if (err) console.log(err)
  })
})

let jsAddons = `if (typeof window !== 'undefined') {\n`
const jsAddonsGlob = new glob.Glob('src/addons/**/*.js', (er, files) => {
  for (const file of files) {
    // const obj = path.parse(file); ${obj.dir}/${obj.name}
    jsAddons += `  require('xtend-library/${file}')\n`
  }
  jsAddons += '}'
  jsAddons += '\n'
})
jsAddonsGlob.on('end', () => {
  writeFile('./src/xtend-addons.js', jsAddons, (err) => {
    if (err) console.log(err)
  })
})

let jsExtensions = `if (typeof window !== 'undefined') {\n`
const jsExtensionsGlob = new glob.Glob('src/extensions/**/*.js', (er, files) => {
  for (const file of files) {
    // const obj = path.parse(file); ${obj.dir}/${obj.name}
    jsExtensions += `  require('xtend-library/${file}')\n`
  }
  jsExtensions += '}'
  jsExtensions += '\n'
})
jsExtensionsGlob.on('end', () => {
  writeFile('./src/xtend-extensions.js', jsExtensions, (err) => {
    if (err) console.log(err)
  })
})

let jsDemos = `if (typeof window !== 'undefined') {\n`
const jsDemosGlob = new glob.Glob('src/private/demos/**/*.js', (er, files) => {
  for (const file of files) {
    jsDemos += `  require('xtend-library/${file}')\n`
  }
  jsDemos += '}'
  jsDemos += '\n'
})
jsDemosGlob.on('end', () => {
  writeFile('./src/xtend-demos.js', jsDemos, (err) => {
    if (err) console.log(err)
  })
})
