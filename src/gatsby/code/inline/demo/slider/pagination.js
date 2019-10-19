import path from 'path'

const dirs = path.dirname(__filename).split('/')
export const demo = {
  name: path.basename(__filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop()
}

demo.htmlSource = `
<div class="slider"
     data-xt-slider>

  <div class="slides">
    <ul class="slides-inner">

      <li class="slide col-6 col-4--sm">
        <div class="slide-inner">

          <div class="box box-card box--default text-align--center">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="box-content">
                <div class="box-block box-item">
                  <h1 class="slide_pagination-content">1</h1>
                  <nav class="slider-pagination">
                    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>

      <li class="slide col-6 col-4--sm">
        <div class="slide-inner">

          <div class="box box-card box--default text-align--center">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="box-content">
                <div class="box-block box-item">
                  <h1 class="slide_pagination-content">2</h1>
                  <nav class="slider-pagination">
                    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>

      <li class="slide col-6 col-4--sm">
        <div class="slide-inner">

          <div class="box box-card box--default text-align--center">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="box-content">
                <div class="box-block box-item">
                  <h1 class="slide_pagination-content">3</h1>
                  <nav class="slider-pagination">
                    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>

      <li class="slide col-6 col-4--sm">
        <div class="slide-inner">

          <div class="box box-card box--default text-align--center">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="box-content">
                <div class="box-block box-item">
                  <h1 class="slide_pagination-content">4</h1>
                  <nav class="slider-pagination">
                    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>

      <li class="slide col-6 col-4--sm">
        <div class="slide-inner">

          <div class="box box-card box--default text-align--center">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="box-content">
                <div class="box-block box-item">
                  <h1 class="slide_pagination-content">5</h1>
                  <nav class="slider-pagination">
                    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>

      <li class="slide col-12">
        <div class="slide-inner">

          <div class="box box-card box--default text-align--center">
            <div class="box-design"></div>
            <div class="box-inner">
              <div class="box-content">
                <div class="box-block box-item" style="height: 15rem;">
                  <h1 class="slide_pagination-content">6</h1>
                  <nav class="slider-pagination">
                    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>

    </ul>
  </div>

  <nav class="slider-pagination">
    <button type="button" class="btn btn--default xt-ignore" data-xt-pag title="Slide xt-num">
      xt-num of xt-tot : xt-content
    </button>
  </nav>

</div>
`
