import React from "react"
import PropTypes from "prop-types"

import {populateDemo} from "assets/scripts/demo.js"

let demoIndex = 0

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.demoRef = React.createRef()
  }

  componentDidMount() {
    populateDemo(this.demoRef.current, demoIndex)
    demoIndex++
  }

  render() {
    const {children} = this.props
    return (
      <xt-toggle class="demo" ref={this.demoRef}>
        {children}
      </xt-toggle>
    )
  }
}

export default Demo

Demo.propTypes = {
  children: PropTypes.node.isRequired,
}
