import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="list list-default list-space-small align-items-center"
     data-xt-toggle="{ min: 1, preventEvent: true }">

  <a href="#toggle--with-link-0" class="btn btn-default">
    Toggle 0
  </a>

  <a href="#toggle--with-link-1" class="btn btn-default">
    Toggle 1
  </a>

  <div class="note note-default note-background toggle-block">
    Target 0
  </div>

  <div class="note note-default note-background toggle-block">
    Target 1
  </div>

</div>
`
