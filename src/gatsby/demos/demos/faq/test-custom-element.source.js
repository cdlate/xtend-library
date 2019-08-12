// test async and toggle

let testAsyncToggle = document.querySelector('#test-async-toggle');
testAsyncToggle.addEventListener('click', function () {
  let target = document.querySelector('xt-toggle .toggle--block');
  let content = target.querySelector('.alert_content');
  content.innerHTML = '<xt-toggle class="list list-space--small align-items--center">\n        <button type="button" class="btn">\n          <span>Toggle 0a</span>\n        </button>\n        <button type="button" class="btn">\n          <span>Toggle 0b</span>\n        </button>\n        <button type="button" class="btn">\n          <span>Toggle 0c</span>\n        </button>\n        <div class="alert toggle--block">\n          <div class="alert_content">\n            Target 0a\n          </div>\n        </div>\n        <div class="alert toggle--block">\n          <div class="alert_content">\n            Target 0b\n          </div>\n        </div>\n        <div class="alert toggle--block">\n          <div class="alert_content">\n            Target 0c\n          </div>\n        </div>\n      </xt-toggle>\n      '
  let child = target.querySelector('xt-toggle .toggle--block');
  target.dispatchEvent(new CustomEvent('on.xt'));
  child.dispatchEvent(new CustomEvent('on.xt'));
});
