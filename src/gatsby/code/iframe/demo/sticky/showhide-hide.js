import React from 'react'
import path from 'path'

import DemoVanillaIframe from 'components/demo-vanilla-iframe'

const dirs = path.dirname(__filename).split('/')
export const demo = {
  container: true,
  full: false,
  name: path.basename(__filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop()
}

demo.htmlSource = `
<div class="sticky-0"
     data-xt-sticky="{ sticky: 'fixed', limit: { top: '.sticky-0-start' }, hide: 'down' }">
  <div class="box box-card box--primary box--squared">
      <div class="box-design"></div>
      <div class="box-inner">
      <div class="box-content">
        <div class="box-block box-item">
          Sticky top
        </div>
      </div>
    </div>
  </div>
</div>

<div class="sticky-0-start"></div>

<div class="sticky-1"
     data-xt-sticky="{ sticky: 'absolute', contain: { top: '.sticky-0:not(.xt-clone)' } }">
  <div class="box box-card box--primary box--squared">
      <div class="box-design"></div>
      <div class="box-inner">
      <div class="box-content">
        <div class="box-block box-item">
          Sticky middle
        </div>
      </div>
    </div>
  </div>
</div>

<div class="box box-card box--default box--squared">
      <div class="box-design"></div>
      <div class="box-inner">
    <div class="box-content">
      <div class="box-block box-item">
        <div class="box-title">Lorem ipsum dolor sit amet</div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie diam nec euismod commodo. Nunc ut fringilla nibh. Duis quis arcu quis neque tempor lobortis nec nec mauris. Proin vel elit pretium metus egestas congue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque hendrerit sagittis quam eget elementum. Vestibulum eu nulla nisl. Duis nec commodo tortor. Aenean feugiat, libero eget ultricies viverra, justo nunc efficitur lorem, at aliquet ante eros in est.</p>
      </div>
    </div>
  </div>
</div>

<div class="sticky-2"
     data-xt-sticky="{ contain: { top: '.sticky-0:not(.xt-clone), .sticky-1:not(.xt-clone)', bottom: '.sticky-3:not(.xt-clone)' }, hide: 'up' }">
  <div class="box box-card box--primary box--squared">
      <div class="box-design"></div>
      <div class="box-inner">
      <div class="box-content">
        <div class="box-block box-item">
          Sticky bottom <span class="hide-sticky">.hide-sticky</span> <span class="show-sticky">.show-sticky</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="box box-card box--default box--squared">
      <div class="box-design"></div>
      <div class="box-inner">
    <div class="box-content">
      <div class="box-block box-item">
        <div class="box-title">Lorem ipsum dolor sit amet</div>
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
  render () {
    return (
      <DemoVanillaIframe demo={demo}/>
    )
  }
}

export default Page
