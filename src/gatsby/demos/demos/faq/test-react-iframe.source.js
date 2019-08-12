import React from "react"

import {Xt} from "xtend-library";

class Component extends React.Component {
  componentDidMount() {
    console.log('bbb', Xt, document, document.querySelectorAll('.drop--disable'))
  }
  render() {
    return (
      <div>
        <div class="drop_outer drop--disable" data-xt-drop>
          <button type="button" class="btn btn--primary">
            <span>Toggle</span>
          </button>
          <div class="drop">
            <div class="drop_inner">
              <div class="drop_design"></div>
              <div class="drop_content">
                <ul class="list list--drop">
                  <li>
                    <button type="button" class="btn">
                      <span>Lorem ipsum dolor</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="btn">
                      <span>Dolor sit</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="btn">
                      <span>Amet</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="drop_outer drop--disable-example" data-xt-drop>
          <button type="button" class="btn btn--primary">
            <span>Toggle</span>
          </button>
          <div class="drop">
            <div class="drop_inner">
              <div class="drop_design"></div>
              <div class="drop_content">
                <ul class="list list--drop">
                  <li>
                    <button type="button" class="btn">
                      <span>Lorem ipsum dolor</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="btn">
                      <span>Dolor sit</span>
                    </button>
                  </li>
                  <li class="drop_outer event-limit" data-xt-drop>
                    <button type="button" class="btn">
                      <span>Toggle</span>
                    </button>
                    <div class="drop drop--primary drop--after drop--middle">
                      <div class="drop_inner">
                        <div class="drop_design"></div>
                        <div class="drop_content">
                          <ul class="list list--drop">
                            <li>
                              <button type="button" class="btn">
                                <span>Lorem ipsum dolor</span>
                              </button>
                            </li>
                            <li>
                              <button type="button" class="btn">
                                <span>Dolor sit</span>
                              </button>
                            </li>
                            <li class="drop_outer event-limit" data-xt-drop>
                              <button type="button" class="btn">
                                <span>Toggle</span>
                              </button>
                              <div class="drop drop--secondary drop--center drop--middle">
                                <div class="drop_inner">
                                  <div class="drop_design"></div>
                                  <div class="drop_content">
                                    <ul class="list list--drop">
                                      <li>
                                        <button type="button" class="btn">
                                          <span>Lorem ipsum dolor</span>
                                        </button>
                                      </li>
                                      <li>
                                        <button type="button" class="btn">
                                          <span>Dolor sit</span>
                                        </button>
                                      </li>
                                      <li>
                                        <button type="button" class="btn">
                                          <span>Amet</span>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Component
