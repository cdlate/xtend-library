import path from 'path'

const dirs = path.dirname(__filename).split('/');
export const demo = {
  name: path.basename(__filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop(),
  css: false,
  js: false,
}

demo.htmlSource = `
  <div class="list list-space--small align-items--center demo-source-from">
    <button type="button" class="btn" data-xt-toggle>
      <span>Toggle</span>
    </button>
    <button type="button" class="btn" data-xt-toggle>
      <span>Toggle</span>
    </button>
  </div>
`