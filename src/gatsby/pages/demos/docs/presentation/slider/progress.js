import React from "react"
import path from "path";

import DemoVanillaIframe from "components/demo-vanilla-iframe"
let spinner = require("components/snippet/spinner").default

const demo = {
  name: path.basename(__filename, '.js'),
  js: true,
  css: true,
  full: false
}
demo.htmlSource = `
  <div class="slider">
    <div class="loader loader--spinner loader--mouse loader--js">
      <span class="spinner">
        ` + spinner + `
      </span>
    </div>

    <div class="slides">
      <ul class="slides_inner">

        <li class="slide">
          <div class="slide_inner">

            <div class="card">
              <div class="card_design"></div>
              <div class="card_content">
                <h1>1</h1>
                <div class="loader loader--x loader--size-bottom loader--js">
                  <div class="filler">
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>

        <li class="slide">
          <div class="slide_inner">

            <div class="card">
              <div class="card_design"></div>
              <div class="card_content">
                <h1>2</h1>
                <div class="loader loader--x loader--size-bottom loader--js">
                  <div class="filler">
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>

        <li class="slide">
          <div class="slide_inner">

            <div class="card">
              <div class="card_design"></div>
              <div class="card_content">
                <h1>3</h1>
                <div class="loader loader--x loader--size-bottom loader--js">
                  <div class="filler">
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>

        <li class="slide">
          <div class="slide_inner">

            <div class="card">
              <div class="card_design"></div>
              <div class="card_content">
                <h1>4</h1>
                <div class="loader loader--x loader--size-bottom loader--js">
                  <div class="filler">
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>

        <li class="slide">
          <div class="slide_inner">

            <div class="card">
              <div class="card_design"></div>
              <div class="card_content">
                <h1>5</h1>
                <div class="loader loader--x loader--size-bottom loader--js">
                  <div class="filler">
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>

      </ul>
    </div>

    <nav class="slider_pagination">
      <button type="button" class="xt-clone" data-xt-pag>
        <span class="loader loader--y loader--js">
          <span class="filler">
            <span></span><span></span>
          </span>
        </span>
      </button>
    </nav>

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