import path from 'path'

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
      default
    </button>
    <div class="overlay">
      <div class="overlay-container">
        <div class="overlay-inner">
          
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
      primary
    </button>
    <div class="overlay">
      <div class="overlay-container">
        <div class="overlay-inner">
          
          <div class="box box-overlay box--primary">
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
      default
    </button>
    <div class="overlay">
      <div class="overlay-container">
        <div class="overlay-inner">
          
          <button type="button" class="box box-overlay box--default">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="btn btn-close" aria-label="Close"></div>
              <div class="box-content">
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
              </div>
            </div>
          </button>
          
        </div>
      </div>
    </div>
  </div>

  <div data-xt-overlay>
    <button type="button" class="btn btn--primary">
      primary
    </button>
    <div class="overlay">
      <div class="overlay-container">
        <div class="overlay-inner">
          
          <button type="button" class="box box-overlay box--primary">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="btn btn-close" aria-label="Close"></div>
              <div class="box-content">
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
                <div class="box-block box-item">
                  <div class="box-title">Lorem Ipsum</div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non feugiat lorem, nec volutpat turpis. Sed pulvinar hendrerit mauris at pharetra. Suspendisse vel aliquam quam, non tincidunt sem.</p>
                </div>
              </div>
            </div>
          </button>
          
        </div>
      </div>
    </div>
  </div>
</div>
`
