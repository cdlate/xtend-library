(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{"1P8c":function(n,a,e){"use strict";e.r(a),e.d(a,"alt",(function(){return i})),e.d(a,"ratio",(function(){return l})),a.default=function(n){var a=n.classes,e=void 0===a?null:a,i=n.ratio,l=void 0===i?null:i,t=n.height,s=void 0===t?null:t,r=n.style,d=void 0===r?null:r,o=n.loading;return'<div class="media-container"'+(l||s||d?' style="':"")+(l?"padding-bottom:"+l+";":"")+(s?"height:"+s+";":"")+(d?" "+d+";":"")+(l||s||d?'"':"")+'><div class="media-inner"><img class="media'+(e?" "+e:"")+'" src="/img.svg" loading="'+(void 0===o?"lazy":o)+'" alt=""/></div></div>'};var i=function(n){var a=n.classes,e=void 0===a?null:a,i=n.ratio,l=void 0===i?null:i,t=n.height,s=void 0===t?null:t,r=n.style,d=void 0===r?null:r,o=n.loading;return'<div class="media-container"'+(l||s||d?' style="':"")+(l?"padding-bottom:"+l+";":"")+(s?"height:"+s+";":"")+(d?" "+d+";":"")+(l||s||d?'"':"")+'><div class="media-inner"><img class="media'+(e?" "+e:"")+'" src="/img-alt.svg" loading="'+(void 0===o?"lazy":o)+'" alt=""/></div></div>'},l=function(n){var a=n.classes,e=void 0===a?null:a,i=n.ratio,l=void 0===i?null:i,t=n.height,s=void 0===t?null:t,r=n.style,d=void 0===r?null:r,o=n.loading;return'<div class="media-container"'+(l||s||d?' style="':"")+(l?"padding-bottom:"+l+";":"")+(s?"height:"+s+";":"")+(d?" "+d+";":"")+(l||s||d?'"':"")+'><div class="media-inner"><img class="media'+(e?" "+e:"")+'" src="/img-ratio.svg" loading="'+(void 0===o?"lazy":o)+'" alt=""/></div></div>'}},"2srA":function(n,a,e){"use strict";e.r(a),function(n){e.d(a,"demo",(function(){return v}));e("HQhv"),e("sC2a");var i=e("q1tI"),l=e.n(i),t=e("33yf"),s=e.n(t),r=e("IRUh");var d=e("JrsZ").default,o=n.replace(/\\/g,"/"),c=s.a.dirname(o).split("/"),v={container:!0,full:!1,name:s.a.basename(o,".js"),dirs:c};v.htmlSource="\n"+d()+"\n";var u=function(n){var a,e;function i(){return n.apply(this,arguments)||this}return e=n,(a=i).prototype=Object.create(e.prototype),a.prototype.constructor=a,a.__proto__=e,i.prototype.render=function(){return l.a.createElement(r.a,{demo:v})},i}(l.a.Component);a.default=u}.call(this,"src/gatsby/code/iframe/themes/slide-overlay-v1.js")},JrsZ:function(n,a,e){"use strict";e.r(a);var i=e("1P8c").default;a.default=function(){return'\n<div class="list list-default list-space-small align-items-center">\n\n  <div data-xt-overlay>\n    <button type="button" class="btn btn-primary">\n      overlay full\n    </button>\n    <div class="overlay overlay-default overlay-screen overlay-size-full">\n      <div class="overlay-container">\n        <div class="overlay-inner">\n          <div class="overlay-design"></div>\n\n            <div class="card card-overlay">\n              <div class="card-design"></div>\n              <div class="btn btn-close" aria-label="Close"></div>\n              <div class="card-inner">\n                <div class="card-content">\n                  <div class="card-asset">\n                    '+i({classes:"media-cover",ratio:"100%"})+'\n                  </div>\n                </div>\n              </div>\n            </div>\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div data-xt-overlay>\n    <button type="button" class="btn btn-primary">\n      overlay menu left\n    </button>\n    <div class="overlay overlay-default overlay-position-left overlay-close-outside">\n      <div class="overlay-container">\n        <div class="overlay-inner">\n          <div class="overlay-design"></div>\n\n          <div class="card card-overlay"\n            style="align-items: stretch;">\n            <div class="card-design"></div>\n            <div class="btn btn-close" aria-label="Close"></div>\n            <div class="card-inner">\n              <div class="card-content">\n                <div class="card-item card-item--menu">\n                  <div class="list">\n                    <button type="button" class="btn btn-primary btn-tall btn-squared">\n                      Menu\n                    </button>\n                    <button type="button" class="btn btn-primary btn-tall btn-squared">\n                      Info\n                    </button>\n                    <button type="button" class="btn btn-primary btn-tall btn-squared">\n                      Account\n                    </button>\n                  </div>\n                </div>\n                <div class="card-asset">\n                  '+i({classes:"media-cover",ratio:"37.5%"})+'\n                </div>\n                <div class="card-block card-item">\n                  <div class="card-title">Lorem ipsum</div>\n                  <p><strong>Lorem ipsum</strong> dolor sit amet, consectetur <a href="#">adipiscing elit</a>. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>\n                </div>\n                <div class="card-block card-item card-block-side"\n                  style="margin-top: auto">\n                  <p><strong>Lorem ipsum</strong> dolor sit amet, consectetur <a href="#">adipiscing elit</a>.</p>\n                </div>\n              </div>\n            </div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div data-xt-overlay>\n    <button type="button" class="btn btn-primary">\n      overlay contact\n    </button>\n    <div class="overlay overlay-default overlay-close-outside">\n      <div class="overlay-container">\n        <div class="overlay-inner">\n          <div class="overlay-design"></div>\n\n          <div class="card card-overlay"\n            style="align-items: stretch;">\n            <div class="card-design"></div>\n            <div class="btn btn-close" aria-label="Close"></div>\n            <div class="card-inner">\n              <div class="card-content">\n\n                <div class="card-item-nested card-item card-group-sm card-item--order">\n\n                  <div class="card-block card-item">\n\n                    <div class="card-title">\n                      Contact us\n                    </div>\n\n                    <form class="form-default">\n\n                      <div class="row row-form">\n                        <div class="col-form-double">\n                          <div class="form-group">\n                            <label class="form-label">\n                              Name\n                            </label>\n                            <input type="text" class="form-item"\n                              placeholder="Name" required>\n                          </div>\n                        </div>\n                        <div class="col-form-double">\n                          <div class="form-group">\n                            <label class="form-label">\n                              Surname\n                            </label>\n                            <input type="text" class="form-item"\n                              placeholder="Surname" required>\n                          </div>\n                        </div>\n                      </div>\n\n                      <div class="row row-form">\n                        <div class="col-form-double">\n                          <div class="form-group">\n                            <label class="form-label">\n                              Email\n                            </label>\n                            <input type="email" class="form-item"\n                              placeholder="Email" required>\n                          </div>\n                        </div>\n                        <div class="col-form-double">\n                          <div class="form-group">\n                            <label class="form-label">\n                              Telephone\n                            </label>\n                            <input type="text" class="form-item"\n                              placeholder="Telephone" required>\n                          </div>\n                        </div>\n                      </div>\n\n                      <div class="form-group">\n                        <label class="form-label">\n                          Select an option\n                        </label>\n                        <select class="form-item"\n                          required>\n                          <option selected value="">Select an option</option>\n                          <option>Option 1</option>\n                          <option>Option 2</option>\n                          <option>Option 3</option>\n                        </select>\n                      </div>\n\n                      <div class="form-group">\n                        <label class="form-label">\n                          Textarea\n                        </label>\n                        <textarea class="form-item"\n                          placeholder="Textarea" required></textarea>\n                      </div>\n\n                      <div class="form-group">\n                        <input type="checkbox" id="check-contact" name="check-contact"\n                          required>\n                        <label class="form-label" for="check-contact">\n                        <span>\n                          I <strong>read and accept</strong> the <a href="#" target="_blank">sales conditions</a> and the <a href="#" target="_blank">privacy policy</a>.\n                        </label>\n                      </div>\n\n                      <button type="submit" class="btn btn-primary btn-wide">\n                        Send\n                      </button>\n\n                    </form>\n\n                  </div>\n\n                  <div class="card-item card-block-side col-5-sm"\n                    style="display: flex; flex-direction: column">\n                    <div class="card-block card-item">\n                      <p class="h5">\n                        Didn\'t find what you was looking for?\n                      </p>\n                      <p>\n                         Contact our customer service at <a href="tel:+39333010101">+39 333 010101</a> or email us at <a href="mailto:info@info.com">info@info.com</a>.\n                      </p>\n                    </div>\n                    <div class="card-asset"\n                      style="margin-top: auto">\n                      '+i({classes:"media-cover",ratio:"100%",loading:"eager"})+'\n                    </div>\n                  </div>\n\n                </div>\n\n              </div>\n            </div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div data-xt-overlay>\n    <button type="button" class="btn btn-primary">\n      overlay newsletter\n    </button>\n    <div class="overlay overlay-default overlay-size-small overlay-close-outside">\n      <div class="overlay-container">\n        <div class="overlay-inner">\n          <div class="overlay-design"></div>\n\n          <div class="card card-overlay"\n            style="align-items: stretch;">\n            <div class="card-design"></div>\n            <div class="btn btn-close" aria-label="Close"></div>\n            <div class="card-inner">\n              <div class="card-content">\n\n                <div class="card-item-nested card-item card-group-sm">\n\n                  <div class="card-item col-5-sm">\n                    <div class="card-asset full-y">\n                      '+i({classes:"media-cover",ratio:"37.5%",loading:"eager"})+'\n                    </div>\n                  </div>\n\n                  <div class="card-block card-item">\n\n                    <div class="card-title">\n                      Subscribe to our newsletter\n                    </div>\n\n                    <form class="form-default">\n\n                      <div class="form-group">\n                        <label class="form-label">\n                          Email\n                        </label>\n                        <input type="email" class="form-item"\n                          placeholder="Email" required>\n                      </div>\n\n                      <div class="form-group-inline">\n\n                        <label class="form-label flex-full">\n                          Select an option\n                        </label>\n\n                        <div class="form-group">\n                          <input type="radio" id="radio-newsletter-0" name="radio-newsletter"\n                            required>\n                          <label class="form-label" for="radio-newsletter-0">\n                            Option 1\n                          </label>\n                        </div>\n\n                        <div class="form-group">\n                          <input type="radio" id="radio-newsletter-1" name="radio-newsletter"\n                            required>\n                          <label class="form-label" for="radio-valinewsletterdation-1">\n                            Option 2\n                          </label>\n                        </div>\n\n                      </div>\n\n                      <div class="form-group">\n                        <input type="checkbox" id="check-newsletter" name="check-newsletter"\n                          required>\n                        <label class="form-label" for="check-newsletter">\n                        <span>\n                          I <strong>read and accept</strong> the <a href="#" target="_blank">sales conditions</a> and the <a href="#" target="_blank">privacy policy</a>.\n                        </label>\n                      </div>\n\n                      <button type="submit" class="btn btn-primary btn-wide">\n                        Subscribe\n                      </button>\n\n                    </form>\n\n                  </div>\n\n                </div>\n\n                <div class="card-block card-item card-block-side card-block-small">\n                  <p>Receive <strong>free discount</strong> periodically on all our products.</p>\n                </div>\n\n              </div>\n            </div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n</div>\n'}}}]);
//# sourceMappingURL=component---src-gatsby-code-iframe-themes-slide-overlay-v-1-js-b778b631b504b492c091.js.map