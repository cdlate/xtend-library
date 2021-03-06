import React from 'react'
import path from 'path'

import DemoVanillaIframe from 'components/demo/demo-vanilla-iframe'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  container: false,
  full: false,
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="sticky-0"
     data-xt-sticky="{ sticky: 'fixed', limit: { top: '.sticky-0-start' }, hide: 'down' }">
  <div class="card card-primary card-squared">
    <div class="card-design"></div>
    <div class="card-inner">
      <div class="card-content">
        <div class="card-block card-item">
          Sticky top
        </div>
      </div>
    </div>
  </div>
</div>

<div class="sticky-0-start"></div>

<div class="sticky-1"
     data-xt-sticky="{ sticky: 'absolute', contain: { top: '.sticky-0:not(.xt-clone)' } }">
  <div class="card card-primary card-squared">
    <div class="card-design"></div>
    <div class="card-inner">
      <div class="card-content">
        <div class="card-block card-item">
          Sticky middle
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card card-default card-squared">
  <div class="card-design"></div>
  <div class="card-inner">
    <div class="card-content">
      <div class="card-block card-item">
        <div class="card-title">Lorem ipsum dolor sit amet</div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie diam nec euismod commodo. Nunc ut fringilla nibh. Duis quis arcu quis neque tempor lobortis nec nec mauris. Proin vel elit pretium metus egestas congue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit sagittis quam eget elementum. Vestibulum eu nulla nisl. Duis nec commodo tortor. Aenean feugiat, libero eget ultricies viverra, justo nunc efficitur lorem, at aliquet ante eros in est.</p>
      </div>
    </div>
  </div>
</div>

<div class="sticky-2"
     data-xt-sticky="{ contain: { top: '.sticky-0:not(.xt-clone), .sticky-1:not(.xt-clone)', bottom: '.sticky-3:not(.xt-clone)' }, hide: 'up' }">
  <div class="card card-primary card-squared">
      <div class="card-design"></div>
      <div class="card-inner">
      <div class="card-content">
        <div class="card-block card-item">
          Sticky bottom
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card card-default card-squared">
  <div class="card-design"></div>
  <div class="card-inner">
    <div class="card-content">
      <div class="card-block card-item">
        <div class="card-title">Lorem ipsum dolor sit amet</div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie diam nec euismod commodo. Nunc ut fringilla nibh. Duis quis arcu quis neque tempor lobortis nec nec mauris. Proin vel elit pretium metus egestas congue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit sagittis quam eget elementum. Vestibulum eu nulla nisl. Duis nec commodo tortor. Aenean feugiat, libero eget ultricies viverra, justo nunc efficitur lorem, at aliquet ante eros in est.</p>
      </div>
    </div>
  </div>
</div>

<br><br><br><br><br><br><br>
<br><br><br><br><br><br><br>
<br><br><br><br><br><br><br>
<br><br><br><br><br><br><br>
<br><br><br><br><br><br><br>
<br><br><br><br><br><br><br>
`

class Page extends React.Component {
  render() {
    return <DemoVanillaIframe demo={demo} />
  }
}

export default Page
