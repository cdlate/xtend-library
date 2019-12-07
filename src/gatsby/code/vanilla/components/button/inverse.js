import path from 'path'

const dirs = path.dirname(__filename).split('/')
export const demo = {
  name: path.basename(__filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop(),
}

demo.htmlSource = `
<div class="list list--default list-space--small align-items-center text-inverse" style="padding: 1rem 1.5rem; background: #7567f8;">
  <button type="button" class="btn btn--default">
    default
  </button>

  <button type="button" class="btn btn--primary">
    primary
  </button>

  <button type="button" class="btn btn--text">
    text
  </button>

  <button type="button" class="btn btn--link">
    link
  </button>
</div>
`