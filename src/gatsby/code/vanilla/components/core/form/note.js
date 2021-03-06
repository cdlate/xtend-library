import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<form class="form-default">
  <div class="form-group form-group-small">
    <label class="form-label">
      Small
    </label>
    <input type="text" class="form-item"/>
    <div class="form-note">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis.
    </div>
  </div>

  <div class="form-group form-group-medium">
    <label class="form-label">
      Medium
    </label>
    <input type="text" class="form-item"/>
    <div class="form-note">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis.
    </div>
  </div>

  <div class="form-group form-group-large">
    <label class="form-label">
      Large
    </label>
    <input type="text" class="form-item"/>
    <div class="form-note">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus laoreet leo sit amet iaculis.
    </div>
  </div>

  <button type="submit" class="btn btn-primary">
    submit
  </button>
</form>
`
