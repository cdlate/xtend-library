import path from 'path'

const dirs = path.dirname(__filename).split('/')
export const demo = {
  name: path.basename(__filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop()
}

demo.htmlSource = `
<div class="row">
  <div class="col-12 col-6--sm">
    <div class="box box-card box--default">
      <div class="box-inner">
        <div class="btn btn-close" aria-label="Close"></div>
        <div class="box-design"></div>
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Default</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col-12 col-6--sm">
    <div class="box box-card box--default box--collapse box--full">
      <div class="box-inner">
        <div class="btn btn-close" aria-label="Close"></div>
        <div class="box-design"></div>
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Default full</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col-12 col-6--sm">
    <div class="box box-card box--primary">
      <div class="box-inner">
        <div class="btn btn-close" aria-label="Close"></div>
        <div class="box-design"></div>
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Primary</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col-12 col-6--sm">
    <div class="box box-card box--primary box--collapse box--full">
      <div class="box-inner">
        <div class="btn btn-close" aria-label="Close"></div>
        <div class="box-design"></div>
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Primary full</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
