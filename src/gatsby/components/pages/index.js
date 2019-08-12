import React from "react"

import SEO from "components/seo"
import Layout from "components/layout"

class Page extends React.Component {
  componentDidMount() {
    let testAsyncToggle = document.querySelector('#test-async-toggle');
    testAsyncToggle.addEventListener('click', function () {
      let target = document.querySelector('xt-toggle .toggle--block');
      let content = target.querySelector('.alert_content');
      content.innerHTML = '<xt-toggle class="list list-space--small align-items--center">\n        <button type="button" class="btn">\n          <span>Toggle 0a</span>\n        </button>\n        <button type="button" class="btn">\n          <span>Toggle 0b</span>\n        </button>\n        <button type="button" class="btn">\n          <span>Toggle 0c</span>\n        </button>\n        <div class="alert toggle--block">\n          <div class="alert_content">\n            Target 0a\n          </div>\n        </div>\n        <div class="alert toggle--block">\n          <div class="alert_content">\n            Target 0b\n          </div>\n        </div>\n        <div class="alert toggle--block">\n          <div class="alert_content">\n            Target 0c\n          </div>\n        </div>\n      </xt-toggle>\n      '
      let child = target.querySelector('xt-toggle .toggle--block');
      target.dispatchEvent(new CustomEvent('on.xt'));
      child.dispatchEvent(new CustomEvent('on.xt'));
    });
  }
  render() {
    const seo = {};
    seo.title = "Home"
    seo.description = "Description"

    return (
      <Layout seo={seo}>
        <SEO title={seo.title + ' — ' + seo.description}/>
        <a href="/demos/docs/presentation/slider/other">
           slider
        </a>
        <br/>
        <a href="/demos/docs/presentation/slider/extension-toggle-js">
          slider toggle
        </a>
        <br/>
        <a href="/demos/faq/test-custom-element">
          custom elements
        </a>
        <br/>
        <br/>
        <br/>
        <div className="list list-space--small align-items--center">
          <button type="button" className="btn" id="test-async-toggle">
            <span>test async and toggle</span>
          </button>
        </div>
        <br/>
        <xt-toggle class="list list-space--small align-items--center"
                   options='{"max": 2}'>
          <button type="button" className="btn">
            <span>Toggle 0</span>
          </button>
          <button type="button" className="btn">
            <span>Toggle 1</span>
          </button>
          <button type="button" className="btn">
            <span>Toggle 2</span>
          </button>
          <div className="alert toggle--block">
            <div className="alert_content">
              Target 0
            </div>
          </div>
          <div className="alert toggle--block">
            <div className="alert_content">
              Target 1
            </div>
          </div>
          <div className="alert toggle--block">
            <div className="alert_content">
              Target 2
            </div>
          </div>
        </xt-toggle>
      </Layout>
    )
  }
}

export default Page
