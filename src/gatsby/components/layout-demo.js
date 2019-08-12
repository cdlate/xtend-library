import React from "react"
import PropTypes from "prop-types"

import {Xt} from "xtend-library";
import {makeDocument} from "assets/scripts/theme.js"
import ResizeSensor from "assets/scripts/ResizeSensor.js"

class Layout extends React.Component {
  componentDidMount() {
    const {demo} = this.props
    if (demo.full) {
      document.querySelector('html').classList.add('iframe-full')
    }
    let iframeLoaded = function () {
      if (window.self !== window.top) {
        window.parent.initIframe(window.name, demo.htmlSource, demo.jsSource, demo.cssSource)
        window.parent.resizeIframe(window.frameElement.getAttribute('name'))
        new ResizeSensor(document.querySelector('#body-outer'), function () {
          window.parent.resizeIframe(window.frameElement.getAttribute('name'))
        })
      }
      makeDocument()
      Xt.load()
    }
    Xt.ready(iframeLoaded)
  }

  render() {
    const {children} = this.props
    return (
      <>
        {children}
      </>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  demo: PropTypes.shape({
    htmlSource: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    jsSource: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    cssSource: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
}

export default Layout
