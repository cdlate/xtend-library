import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  component: dirs.pop(),
  type: dirs.pop(),
}

demo.htmlSource = `
<form class="form-default">
  <div class="form-group">
    <input type="checkbox" class="unstyled" id="checkbox-disabled-unstyled" disabled checked>
    <label class="form-label" for="checkbox-disabled-unstyled">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum velit condimentum efficitur feugiat. Sed sit amet leo nunc. <a href="#">sales conditions</a> and the <a href="#">privacy policy</a>
    </label>
  </div>

  <div class="form-group">
    <input type="radio" class="unstyled" id="radio-disabled-unstyled-0" name="radio-disabled-unstyled" disabled checked>
    <label class="form-label" for="radio-disabled-unstyled-0">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum velit condimentum efficitur feugiat. Sed sit amet leo nunc. <a href="#">sales conditions</a> and the <a href="#">privacy policy</a>
    </label>
  </div>

  <div class="form-group">
    <input type="radio" class="unstyled" id="radio-disabled-unstyled-1" name="radio-disabled-unstyled" disabled>
    <label class="form-label" for="radio-disabled-unstyled-1">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum velit condimentum efficitur feugiat. Sed sit amet leo nunc. <a href="#">sales conditions</a> and the <a href="#">privacy policy</a>
    </label>
  </div>

  <button type="submit" class="btn btn-primary">
    submit
  </button>
</form>
`