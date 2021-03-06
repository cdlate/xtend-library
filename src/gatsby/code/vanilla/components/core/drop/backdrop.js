import path from 'path'
const markupDrop = require('components/snippets/components/markup-drop').default
const indentString = require('indent-string')

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="list list-default list-space-small align-items-center">

  <div class="drop-container" data-xt-drop="{ backdrop: true }">
    <button type="button" class="btn btn-primary">
      backdrop
    </button>
    <div class="drop drop-default drop-bottom drop-left">
    ${indentString(markupDrop(), 6)}
    </div>
  </div>

  <div class="drop-container" data-xt-drop="{ on: 'mouseenter', off: 'mouseleave', backdrop: true }">
    <button type="button" class="btn btn-primary">
    backdrop mouseenter
    </button>
    <div class="drop drop-default drop-bottom drop-left">
    ${indentString(markupDrop(), 6)}
    </div>
  </div>

</div>
`
