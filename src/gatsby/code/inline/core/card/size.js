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
    <button type="button" class="box box-card box--default box--small">
      <div class="box-design"></div>
      <div class="box-inner">
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Small</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </button>
  </div>
  
  <div class="col-12 col-6--sm">
    <button type="button" class="box box-card box--default box--small box--collapse box--full">
      <div class="box-design"></div>
      <div class="box-inner">
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Small full</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </button>
  </div>
  
  
  <div class="col-12 col-6--sm">
    <button type="button" class="box box-card box--default box--medium">
      <div class="box-design"></div>
      <div class="box-inner">
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Medium</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </button>
  </div>
  
  <div class="col-12 col-6--sm">
    <button type="button" class="box box-card box--default box--medium box--collapse box--full">
      <div class="box-design"></div>
      <div class="box-inner">
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Medium full</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </button>
  </div>
  
  
  <div class="col-12 col-6--sm">
    <button type="button" class="box box-card box--default box--big">
      <div class="box-design"></div>
      <div class="box-inner">
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Big</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </button>
  </div>
  
  <div class="col-12 col-6--sm">
    <button type="button" class="box box-card box--default box--big box--collapse box--full 
      <div class="box-design"></div>
      <div class="box-inner">
        <div class="box-content">
          <div class="box-block box-item">
            <div class="box-title">Big full</div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
          </div>
        </div>
      </div>
    </button>
  </div>
</div>
`
