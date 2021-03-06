import path from 'path'
const img = require('components/snippets/img').default

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="demo--checkradio-card">
  <div class="row row-default">

    <div class="col-12 col-6-sm">
      <input type="checkbox" id="check-card-0">
      <label for="check-card-0" class="card card-primary align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-asset">
            ${img({ classes: 'media-cover', ratio: '37.5%' })}
          </div>
          <div class="card-content">
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p><strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="col-12 col-6-sm">
      <input type="checkbox" id="check-card-1">
      <label for="check-card-1" class="card card-primary align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-asset">
            ${img({ classes: 'media-cover', ratio: '37.5%' })}
          </div>
          <div class="card-content">
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p><strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="col-12 col-6-sm">
      <input type="radio" id="radio-card-0" name="radio-card">
      <label for="radio-card-0" class="card card-primary align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-asset">
            ${img({ classes: 'media-cover', ratio: '37.5%' })}
          </div>
          <div class="card-content">
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p><strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="col-12 col-6-sm">
      <input type="radio" id="radio-card-1" name="radio-card">
      <label for="radio-card-1" class="card card-primary align-center">
        <div class="card-design"></div>
        <div class="card-inner">
          <div class="card-asset">
            ${img({ classes: 'media-cover', ratio: '37.5%' })}
          </div>
          <div class="card-content">
            <div class="card-block card-item">
              <div class="card-title">Lorem ipsum</div>
              <p><strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>
              <div class="form-label"></div>
            </div>
          </div>
        </div>
      </label>
    </div>

  </div>
</div>
`
