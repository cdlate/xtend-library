import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="list list-default list-space-small align-items-center">

  <button type="button" class="btn btn-default">
    default
  </button>

  <button type="button" class="btn btn-default btn-tiny">
    tiny
  </button>

  <button type="button" class="btn btn-default btn-small">
    small
  </button>

  <button type="button" class="btn btn-default btn-medium">
    medium
  </button>

  <button type="button" class="btn btn-default btn-large">
    large
  </button>

  <button type="button" class="btn btn-default btn-big">
    big
  </button>

</div>
`
