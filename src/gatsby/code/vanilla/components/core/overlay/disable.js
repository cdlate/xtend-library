import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="demo--overlay-disable" data-xt-overlay>
  <button type="button" class="btn btn-primary demo--overlay-disable-btn">
    Toggle
  </button>
  <div class="overlay overlay-default demo--overlay-disable">
    <div class="overlay-container">
      <div class="overlay-inner">
        <div class="overlay-design"></div>

          <div class="card card-overlay">
            <div class="card-design"></div>
            <div class="btn btn-close" aria-label="Close"></div>
            <div class="card-inner">
              <div class="card-content">
                <div class="card-block card-item">
                  <div class="card-title">Lorem ipsum</div>
                  <p><strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>
                  <p>Morbi sodales, dolor a iaculis ornare, velit justo lacinia erat, pretium sollicitudin dui sem id justo.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, lectus quis ornare volutpat, ligula nulla sollicitudin nunc, ut commodo nulla enim nec nisi.</p>
                  <p>Morbi sodales, dolor a iaculis ornare, velit justo lacinia erat, pretium sollicitudin dui sem id justo.</p>

                  <div data-xt-overlay>
                    <button type="button" class="btn btn-primary">
                      Toggle
                    </button>
                    <div class="overlay overlay-default overlay-size-small">
                      <div class="overlay-container">
                        <div class="overlay-inner">
                          <div class="overlay-design"></div>

                          <div class="card card-overlay">
                            <div class="card-design"></div>
                            <div class="btn btn-close" aria-label="Close"></div>
                            <div class="card-inner">
                              <div class="card-content">
                                <div class="card-block card-item">
                                  <div class="card-title">Lorem ipsum</div>
                                  <p><strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.</p>
                                  <p>Morbi sodales, dolor a iaculis ornare, velit justo lacinia erat, pretium sollicitudin dui sem id justo.</p>
                                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, lectus quis ornare volutpat, ligula nulla sollicitudin nunc, ut commodo nulla enim nec nisi.</p>
                                  <p>Morbi sodales, dolor a iaculis ornare, velit justo lacinia erat, pretium sollicitudin dui sem id justo.</p>
                                  <div class="drop-container" data-xt-drop="{ backdrop: true }">
                                    <button type="button" class="btn btn-primary">
                                      drop backdrop
                                    </button>
                                    <div class="drop drop-default drop-bottom drop-left">
                                      <div class="drop-inner">
                                        <div class="drop-design"></div>
                                        <div class="drop-content">

                                          <nav class="list-block list-drop">
                                            <button type="button" class="btn btn-default">
                                              Lorem ipsum dolor
                                            </button>
                                            <button type="button" class="btn btn-default">
                                              Dolor sit
                                            </button>
                                            <button type="button" class="btn btn-default">
                                              Amet
                                            </button>
                                          </nav>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

      </div>
    </div>
  </div>
</div>
`
