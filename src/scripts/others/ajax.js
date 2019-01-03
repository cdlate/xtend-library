/* xtend (https://getxtend.com/)
@copyright (c) 2017 - 2018 Riccardo Caroli
@license MIT (https://github.com/minimit/xtend-library/blob/master/LICENSE) */

'use strict';

import Xt from '../xtend';
import Core from '../core';

//////////////////////
// Drop
//////////////////////

class Ajax extends Core {

  /**
   * constructor
   * @param {Node|HTMLElement|EventTarget|Window} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions);
  }

  //////////////////////
  // init
  //////////////////////

  /**
   * init currents
   */
  initCurrents() {
    let self = this;
    super.initCurrents();
    // detect url
    let url;
    if (history.state && history.state.url) {
      // detect from history
      url = history.state.url;
    } else {
      // detect from url location (absolute url without domain name)
      let loc = window.location.href.split('#')[0];
      url = loc.replace(/https?:\/\/[^\/]+/i, '');
    }
    // set pushstate
    self.pushState(url, document.title);
  }

  /**
   * init events
   */
  initEvents() {
    let self = this;
    super.initEvents();
    // event popstate
    window.onpopstate = self.eventPopstateHandler.bind(self);
  }

  /**
   * element popstate handler
   * @param {Event} e
   */
  eventPopstateHandler(e) {
    let self = this;
    // handler
    if (!e.detail || !e.detail.skip) {
      if (history.state && history.state.url) {
        self.ajaxCall(history.state.url);
      }
    }
  }

  //////////////////////
  // queue utils
  //////////////////////

  /**
   * queue on done
   * @param {Object} obj Queue object
   * @param {String} type Type of element
   * @param {Boolean} skipQueue If skip queue
   */
  queueOnDone(obj, type, skipQueue = false) {
    let self = this;
    super.queueOnDone(obj, type, skipQueue);
    // done
    obj[type].done = true;
    let done = 0;
    for (let type in obj) {
      if (obj[type].done) {
        done++;
      }
    }
    // ajax on done
    if (done === Object.entries(obj).length) {
      self.ajaxCall(obj[type].groupElements.single.getAttribute('href'));
    }
  }

  //////////////////////
  // ajax
  //////////////////////

  /**
   * ajax call
   * @param {String} url Url to get
   */
  ajaxCall(url) {
    let self = this;
    // make ajax call
    if (url) {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          self.ajaxSuccess(url, request.responseText);
        } else {
          self.ajaxError(url, request.responseText);
        }
      };
      request.onerror = function() {
        self.ajaxError(url, request.responseText);
      };
      request.send();
    }
  }

  /**
   * ajax success
   * @param {String} url Url to get
   * @param {String} responseText Html response
   */
  ajaxSuccess(url, responseText) {
    let self = this;
    let options = self.options;
    // set substitute
    let target = self.object;
    let html = document.createElement('html');
    html.innerHTML = responseText.trim();
    let title = html.querySelectorAll('head title')[0].innerHTML;
    let substitute = html.querySelectorAll(options.query)[0];
    // data-xt-ajax-keep
    for (let keep of target.querySelectorAll('[data-xt-ajax-keep]')) {
      // keep and sub
      let id = keep.getAttribute('data-xt-ajax-keep');
      let sub = substitute.querySelectorAll('[data-xt-ajax-keep="' + id + '"]')[0];
      // copy
      //sub.parentNode.replaceChild(keep, sub);
      // loop all descendants
      let elsKeep = keep.querySelectorAll('*');
      let elsSub = sub.querySelectorAll('*');
      for (let i = 0; i < elsKeep.length; i++) {
        let elKeep = elsKeep[i];
        let elSub = elsSub[i];
        if (elSub) {
          sub.dataset.xtAjaxKept = url;
          // check storage for events
          let storages = Xt.dataStorage.getAll(elKeep);
          if (storages) {
            for (let [key, value] of storages) {
              // copy events
              let handler = Xt.dataStorage.put(elSub, key, value);
              elSub.removeEventListener('click', handler);
              elSub.addEventListener('click', handler);
            }
          }
        }
      }
    }
    // populate dom
    target.outerHTML = substitute.outerHTML;
    // pushstate
    self.pushState(url, title);
    // garbage collector
    html = null;
    substitute = null;
    // dispatch
    self.eDetailSet();
    target.dispatchEvent(new CustomEvent('ajax.xt', {detail: self.eDetail}));
  }

  /**
   * ajax error
   * @param {String} url Url to get
   * @param {String} responseText Html response
   */
  ajaxError(url, responseText) {
    console.log('ajax error error:', responseText);
  }

  /**
   * history pushstate
   */
  pushState(url, title) {
    // push object state
    if (!history.state || !history.state.url || history.state.url !== url) {
      document.title = title;
      history.pushState({'url': url, 'title': title}, title, url);
    } else {
      document.title = history.state.title;
    }
  }

}

//////////////////////
// defaults
//////////////////////

Ajax.componentName = 'ajax';
Ajax.defaults = {
  "query": "body", // needs to be unique
  "elements": "a[href^=\"/\"]",
  "class": "active",
  "on": "click",
  "min": 0,
  "max": Infinity
};

//////////////////////
// export
//////////////////////

export default Ajax;