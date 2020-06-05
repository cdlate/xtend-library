import path from 'path'
const img = require('components/snippets/img').default

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop(),
}

demo.htmlSource = `
<div class="row row-default">

  <div class="col-12">
    <div class="card card-primary">
      <div class="card-design"></div>
      <div class="card-inner">
        <div class="card-content">
          <div class="card-item-nested card-item card-group-sm">
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
            </div>
            <div class="card-block card-item card-block-side">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="col-12">
    <div class="card card-primary">
      <div class="card-design"></div>
      <div class="card-inner">
        <div class="card-content">
          <div class="card-item-nested card-item card-group-sm">
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
            </div>
            <div class="card-item card-block-side">
              <div class="card-asset">
                ${img({ classes: 'media-cover', ratio: '37.5%' })}
              </div>
              <div class="card-block card-item">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
`