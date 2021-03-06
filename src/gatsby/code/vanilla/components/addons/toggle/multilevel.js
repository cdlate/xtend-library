import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<div class="demo--multilevel">
  <div class="multilevel">

    <nav role="navigation" class="multilevel-tab">

      <div class="multilevel-title-wrapper">
        <div class="h4 multilevel-title">
          Products
        </div>
        <button type="button" class="btn btn-text btn-none multilevel-reset display-none multilevel-tab-reset">
          Back
        </button>
      </div>

      <nav class="list-block multilevel-list">
        <button type="button" class="btn" data-xt-group="cat-0">
          Category 0
        </button>
        <button type="button" class="btn" data-xt-group="cat-1">
          Category 1
        </button>
        <a href="#" class="btn">
          Link 0
        </a>
        <a href="#" class="btn">
          Link 1
        </a>
      </nav>

      <div class="multilevel-title-wrapper">
        <div class="h4 multilevel-title">
          About
        </div>
      </div>
      <nav class="list-block multilevel-list">
        <a href="#" class="btn">
          Link 0
        </a>
        <a href="#" class="btn">
          Link 1
        </a>
      </nav>

    </nav>

    <nav role="navigation" class="multilevel-tab" data-xt-group="cat-0">

      <div class="multilevel-title-wrapper">
        <div class="h4 multilevel-title">
          Category 0
        </div>
        <button type="button" class="btn btn-text btn-none multilevel-reset">
          Back
        </button>
      </div>

      <nav class="list-block multilevel-list">
        <button type="button" class="btn" data-xt-group="cat-0a">
          Category 0a
        </button>
        <button type="button" class="btn" data-xt-group="cat-0b">
          Category 0b
        </button>
        <a href="#" class="btn">
          Link 0
        </a>
        <a href="#" class="btn">
          Link 1
        </a>
      </nav>

    </nav>

    <nav role="navigation" class="multilevel-tab" data-xt-group="cat-0a">

      <div class="multilevel-title-wrapper">
        <div class="h4 multilevel-title">
          Category 0a
        </div>
        <button type="button" class="btn btn-text btn-none multilevel-reset">
          Back
        </button>
      </div>

      <nav class="list-block multilevel-list">
        <a href="#" class="btn">
          Link 0
        </a>
        <a href="#" class="btn">
          Link 1
        </a>
      </nav>

    </nav>

    <nav role="navigation" class="multilevel-tab" data-xt-group="cat-0b">

      <div class="multilevel-title-wrapper">
        <div class="h4 multilevel-title">
          Category 0b
        </div>
        <button type="button" class="btn btn-text btn-none multilevel-reset">
          Back
        </button>
      </div>

      <nav class="list-block multilevel-list">
        <a href="#" class="btn">
          Link 0
        </a>
        <a href="#" class="btn">
          Link 1
        </a>
      </nav>

    </nav>

    <nav role="navigation" class="multilevel-tab" data-xt-group="cat-1">

      <div class="multilevel-title-wrapper">
        <div class="h4 multilevel-title">
          Category 1
        </div>
        <button type="button" class="btn btn-text btn-none multilevel-reset">
          Back
        </button>
      </div>

      <nav class="list-block multilevel-list">
        <a href="#" class="btn">
          Link 0
        </a>
        <a href="#" class="btn">
          Link 1
        </a>
      </nav>

    </nav>

  </div>
</div>
`
