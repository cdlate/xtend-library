import path from 'path'

const filename = __filename.replace(/\\/g, '/')
const dirs = path.dirname(filename).split('/')
export const demo = {
  name: path.basename(filename, '.js'),
  dirs: dirs,
}

demo.htmlSource = `
<form class="form-default">

  <div class="form-group">
    <label class="form-label">
      Letters
    </label>
    <input type="text" class="form-item"
      placeholder="Input" required pattern="[A-Za-z]+">
  </div>

  <div class="form-group">
    <label class="form-label">
      Custom
    </label>
    <input type="text" class="form-item demo--validation-custom"
      placeholder="Input" required>
  </div>
  <script>
    function validationCustom (e) {
        var item = e.target
        var constraints = ['^(CH-)?\\\\d{4}$', 'Switzerland ZIPs must have exactly 4 digits: e.g. CH-1950 or 1950'];
        var constraint = new RegExp(constraints[0], '');
        if (constraint.test(item.value)) {
            item.setCustomValidity('');
        } else {
            item.setCustomValidity(constraints[1]);
        }
    }
    var items = document.querySelectorAll('.demo--validation-custom')
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.addEventListener('input', validationCustom);
    }
  </script>

  <div class="form-group">
    <label class="form-label">
      Email
    </label>
    <input type="email" class="form-item"
      placeholder="Email" required>
  </div>

  <div class="form-group">
    <label class="form-label">
      Number
    </label>
    <input type="number" class="form-item"
      placeholder="Number" required min="1" max="10">
  </div>

  <div class="form-group">
    <label class="form-label">
      File
    </label>
    <input type="file" class="form-item"
      required/>
  </div>

  <div class="form-group">
    <label class="form-label">
      Textarea
    </label>
    <textarea class="form-item"
      placeholder="Textarea" required></textarea>
  </div>

  <div class="form-group">
    <label class="form-label">
      Select
    </label>
    <select class="form-item"
      required>
      <option selected value="">Select an option</option>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>
  </div>

  <div class="form-group">
    <label class="form-label">
      Select multiple
    </label>
    <select class="form-item"
      multiple required>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>
  </div>

  <div class="form-group-inline">

    <div class="form-group">
      <input type="radio" id="radio-validation-0" name="radio-validation"
        required>
      <label class="form-label" for="radio-validation-0">
        Lorem ipsum dolor
      </label>
    </div>

    <div class="form-group">
      <input type="radio" id="radio-validation-1" name="radio-validation"
        required>
        <label class="form-label" for="radio-validation-1">
          Lorem ipsum dolor
        </label>
      </div>
    </div>

  </div>

  <div class="form-group">
    <input type="checkbox" id="check-validation" name="check-validation"
      required>
    <label class="form-label" for="check-validation-inverse">
      <strong>Lorem ipsum</strong> dolor sit amet, <a href="#">consectetur adipiscing</a> elit. Nullam suscipit, velit eu tristique mollis, dui felis dictum turpis, a auctor est odio ac diam. Sed mauris augue, sagittis vitae magna eget, vehicula scelerisque elit.
    </label>
  </div>

  <button type="submit" class="btn btn-primary btn-big">
    Send
  </button>

</form>
`
