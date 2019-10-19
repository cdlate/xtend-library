import path from 'path'
const img = require('components/snippets/img').default

const dirs = path.dirname(__filename).split('/')
export const demo = {
  name: path.basename(__filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop()
}

demo.htmlSource = `
<div class="list list--default list-space--small align-items--center demo-source-from">
  <div data-xt-overlay>
    <button type="button" class="btn btn--primary">
      screen
    </button>
    <div class="overlay overlay--default overlay-screen">
      <div class="overlay-container">
        <div class="overlay-inner">
          <div class="overlay-design"></div>
          
          <div class="box box-overlay box--default">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="btn btn-close" aria-label="Close"></div>
              <div class="box-content">
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  
  <div data-xt-overlay>
    <button type="button" class="btn btn--primary">
      screen multiple
    </button>
    <div class="overlay overlay--default overlay-screen">
      <div class="overlay-container">
        <div class="overlay-inner">
          <div class="overlay-design"></div>
          
          <div class="box box-overlay box--default">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="btn btn-close" aria-label="Close"></div>
              <div class="box-content">
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
              </div>
              <div class="box-content">
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  
  <div data-xt-overlay>
    <button type="button" class="btn btn--primary">
      screen full none
    </button>
    <div class="overlay overlay--default overlay-screen overlay--full overlay--none">
      <div class="overlay-container">
        <div class="overlay-inner">
          <div class="overlay-design"></div>
          
          <div class="box box-overlay box--default">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="btn btn-close" aria-label="Close"></div>
              <div class="box-content">
                <div class="box-asset">
                  ${img({ width: 1200, height: 1200 })}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</div>
`
