const spinner = require('components/snippets/spinner').default

export default () => {
  return `
<div class="loader loader-spinner loader-mouse loader-js">
  <span class="spinner">
    ${spinner({})}
  </span>
</div>

<div class="slides">
  <nav class="slides-inner">

    <div class="slide col-6 col-4-sm">
      <div class="slide-inner">

        <div class="card card-slide">
          <div class="card-design"></div>
          <div class="card-inner">
            <div class="card-content">
              <div class="card-block card-item">
                <div class="card-title">1</div>
              </div>
              <div class="loader loader-x loader-size-bottom loader-js">
                <div class="filler">
                  <span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="slide col-6 col-4-sm">
      <div class="slide-inner">

        <div class="card card-slide">
          <div class="card-design"></div>
          <div class="card-inner">
            <div class="card-content">
              <div class="card-block card-item">
                <div class="card-title">2</div>
              </div>
              <div class="loader loader-x loader-size-bottom loader-js">
                <div class="filler">
                  <span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="slide col-6 col-4-sm">
      <div class="slide-inner">

        <div class="card card-slide">
          <div class="card-design"></div>
          <div class="card-inner">
            <div class="card-content">
              <div class="card-block card-item">
                <div class="card-title">3</div>
              </div>
              <div class="loader loader-x loader-size-bottom loader-js">
                <div class="filler">
                  <span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="slide col-7 col-5-sm">
      <div class="slide-inner">

        <div class="card card-slide">
          <div class="card-design"></div>
          <div class="card-inner">
            <div class="card-content">
              <div class="card-block card-item">
                <div class="card-title">4</div>
              </div>
              <div class="loader loader-x loader-size-bottom loader-js">
                <div class="filler">
                  <span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="slide col-7 col-5-sm">
      <div class="slide-inner">

        <div class="card card-slide">
          <div class="card-design"></div>
          <div class="card-inner">
            <div class="card-content">
              <div class="card-block card-item">
                <div class="card-title">5</div>
              </div>
              <div class="loader loader-x loader-size-bottom loader-js">
                <div class="filler">
                  <span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </nav>
</div>

<nav class="slider-pagination">
  <button type="button" class="btn btn-default xt-ignore" data-xt-pag title="Slide xt-num">
    <span class="loader loader-y loader-js">
      <span class="filler">
        <span></span><span></span>
      </span>
    </span>
  </button>
</nav>
`
}
