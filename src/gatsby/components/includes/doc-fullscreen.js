import React from 'react'

class DocFullscreen extends React.Component {
  render() {
    return (
      <>
        <div id="gatbsy_open-full-trigger"></div>
        <div id="gatbsy_open-full">
          <div className="btn btn-close" aria-label="Close"></div>
          <div className="card-content" id="gatbsy_open-full-content"></div>
        </div>
      </>
    )
  }
}

export default DocFullscreen
