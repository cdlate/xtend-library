import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop(),
}

demo.htmlSource = `
<div class="demo--checkradio-card">
  <div class="row row-default">

    <div class="col-12 col-6-sm">
      <input type="checkbox" id="check-card-0">
      <label for="check-card-0" class="card card-default align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-content">
            <div class="card-asset">
              <div class="media-container" style="padding-bottom:37.5%"><div class="media-inner"><img class="media media-cover" src="/img.svg" alt loading="lazy"/></div></div>
            </div>
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="col-12 col-6-sm">
      <input type="checkbox" id="check-card-1">
      <label for="check-card-1" class="card card-default align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-content">
            <div class="card-asset">
              <div class="media-container" style="padding-bottom:37.5%"><div class="media-inner"><img class="media media-cover" src="/img.svg" alt loading="lazy"/></div></div>
            </div>
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="col-12 col-6-sm">
      <input type="radio" id="radio-card-0" name="radio-card">
      <label for="radio-card-0" class="card card-default align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-content">
            <div class="card-asset">
              <div class="media-container" style="padding-bottom:37.5%"><div class="media-inner"><img class="media media-cover" src="/img.svg" alt loading="lazy"/></div></div>
            </div>
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="col-12 col-6-sm">
      <input type="radio" id="radio-card-1" name="radio-card">
      <label for="radio-card-1" class="card card-default align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-content">
            <div class="card-asset">
              <div class="media-container" style="padding-bottom:37.5%"><div class="media-inner"><img class="media media-cover" src="/img.svg" alt loading="lazy"/></div></div>
            </div>
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

  </div>
</div>
`