import {Xt} from "../../../../src/scripts/xtend";

//////////////////////
// anchors and sidebar
//////////////////////

const makeDocument = function () {
  // .make-line
  for (let el of document.querySelectorAll('.site_article h2, .site_article h3')) {
    el.classList.add('make-line');
  }
  for (let el of document.querySelectorAll('.make-line')) {
    el.innerHTML = '<span class="make-line_line">' + el.innerHTML + '</span>';
    el.innerHTML = '<span class="make-line_container">' + el.innerHTML + '</span>';
  }
  // .make-anchor
  for (let el of document.querySelectorAll('.site_article h2, .site_article h3')) {
    el.classList.add('make-line');
    // previous h2 if h3
    let prevElement;
    if (el.tagName === 'H3') {
      prevElement = el;
      while (prevElement.previousElementSibling) {
        if (prevElement.tagName === 'H2') {
          break;
        }
        prevElement = prevElement.previousElementSibling;
      }
    }
    // id
    let id = '';
    if (prevElement) {
      id += prevElement.textContent.replace(/\s+/g, '-').toLowerCase() + '-';
    }
    id += el.textContent.replace(/\s+/g, '-').toLowerCase();
    // make-anchor
    el.setAttribute('id', id);
    el.innerHTML = '<a href="#' + id + '" aria-label="Anchor to ' + el.textContent + '" tabindex="-1">' + el.innerHTML + '</a>';
    el.classList.add('make-anchor');
    el.append(Xt.createElement('<span class="site_article_anchor"><span class="btn"><span class="icon-link" aria-hidden="true"></span></span></span>'));
  }
}

export {makeDocument};

/*
// .demo-cols

for (let element of document.querySelectorAll('.demo-cols')) {
  for (let [i, el] of element.querySelectorAll('[class^=\'col--\'], [class*=\' col--\']').entries()) {
    el.setAttribute('data-index', i);
  }
}

// .demo-cols-nested

for (let element of document.querySelectorAll('.demo-cols-nested [class^=\'col--\'], .demo-cols-nested [class*=\' col--\']')) {
  for (let [i, el] of element.querySelectorAll('[class^=\'col--\'], [class*=\' col--\']').entries()) {
    el.setAttribute('data-index', i);
  }
}
*/
