import React from "react"
import path from "path";

import DemoVanillaIframe from "components/demo-vanilla-iframe"

const demo = {
  name: path.basename(__filename, '.js'),
  js: false,
  css: true,
  full: false
}
demo.htmlSource = `
<div data-xt-overlay>
  <button type="button" class="btn btn--primary">
    <span>toggle</span>
  </button>
  <div class="overlay_outer overlay--pos overlay--right">
    <div class="overlay">
      <div class="overlay_inner">

        <div class="overlay_design"></div>
        <button type="button" class="btn btn--close overlay_dismiss" aria-label="Close"><span></span></button>

        <div class="overlay_content--menu">
          <button type="button" class="btn btn--primary btn--big btn--wide btn--tall">
            <span>Menu</span>
          </button>
          <button type="button" class="btn btn--primary btn--big btn--wide btn--tall">
            <span>Account</span>
          </button>
        </div>

        <div class="overlay_content overlay_content--title">
          <h2>Lorem ipsum</h2>
        </div>

        <div class="overlay_content">
          <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, lectus quis ornare volutpat,
            ligula nulla sollicitudin nunc, ut commodo nulla enim nec nisi.</p>
          <p>Morbi sodales, dolor a iaculis ornare, velit justo lacinia erat, pretium sollicitudin dui sem id
            justo.</p>
        </div>

        <div class="overlay_content overlay_content--foot">
          <button type="button" class="btn btn--primary overlay_dismiss">
            <span>Close</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</div>
`

class Page extends React.Component {
  componentDidMount() {
    if (demo.js) {
      require("./" + demo.name + ".source.js")
    }
  }

  render() {
    if (demo.js) {
      demo.jsSource = require("!!raw-loader!./" + demo.name + ".source.js").default
    }
    if (demo.css) {
      demo.cssSource = require("!!raw-loader!./" + demo.name + ".source.less").default
      demo.css = demo.css ? require("!raw-loader!less-loader!./" + demo.name + ".source.less").default : null
    }
    return (
      <DemoVanillaIframe demo={demo}/>
    )
  }
}

export default Page