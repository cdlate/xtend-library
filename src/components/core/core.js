//////////////////////
// import
//////////////////////

import {Xt} from 'xtend-library'

//////////////////////
// Core
//////////////////////

export class Core {

  /**
   * constructor
   * @param {Node|HTMLElement|EventTarget|Window} object Base node
   * @param {Object} optionsJs User options
   * @constructor
   */
  constructor(object, optionsJs = {}) {
    let self = this;
    self.object = object;
    self.optionsJs = optionsJs;
    self.componentName = self.constructor.componentName;
    self.componentNamespace = self.componentName.replace(/^[^a-z]+|[ ,#_:.-]+/gi, '');
    // @FIX multiple initializations when setting position fixed
    let alreadyDefinedInstance = Xt.get(self.componentName, self.object)
    if (!alreadyDefinedInstance) {
      // set
      Xt.set(self.componentName, self.object, self);
      // init
      self.init(object, optionsJs);
    } else {
      return alreadyDefinedInstance;
    }
  }

  //////////////////////
  // init
  //////////////////////

  /**
   * init
   */
  init(object = false, optionsJs = false) {
    let self = this;
    self.object = object || self.object;
    self.optionsJs = optionsJs || self.optionsJs;
    // vars
    self.classes = [];
    self.classesIn = [];
    self.classesOut = [];
    self.classesInitial = [];
    self.classesInverse = [];
    self.elements = [];
    self.targets = [];
    self.currentIndex = null;
    self.initialCurrents = [];
    self.detail = {};
    self.disabled = false;
    self.detail.queueOn = [];
    self.detail.queueOff = [];
    self.detail.inverse = false;
    self.detail.autoPaused = false;
    self.destroyElements = [document, window, self.object];
    // init
    self.initVars();
    self.initSetup();
    self.initLogic();
  }

  /**
   * init vars
   */
  initVars() {
    let self = this;
    // option
    self.optionsDefault = {
      "class": "active",
      "classIn": "in",
      "classOut": "out",
      "classInitial": "initial",
      "classInverse": "inverse",
      "instant": false,
      "autoClose": false,
      "onBlock": false,
      "offBlock": false,
      "loop": true,
      "jump": false,
      "imageLoadedInit": false,
      "delayOn": false,
      "delayOff": false,
      "durationOn": false,
      "durationOff": false,
      "keyboard": {
        "selector": false
      },
      "auto": {
        "time": false,
        "step": 1,
        "initial": true,
        "inverse": false,
        "pause": false
      },
      "aria": {
        "tabindex": true,
        "controls": true,
        "labelledby": true
      }
    };
    self.optionsDefault = Xt.merge([self.optionsDefault, self.constructor.optionsDefault]);
    // js options
    self.options = Xt.merge([self.optionsDefault, self.optionsJs]);
    // markup options
    let markupOptions = self.object.getAttribute('data-' + self.componentName);
    self.options = Xt.merge([self.options, markupOptions ? JSON.parse(markupOptions) : {}]);
    // classes
    self.classes = [...self.options.class.split(' ')];
    self.classesIn = [...self.options.classIn.split(' ')];
    self.classesOut = [...self.options.classOut.split(' ')];
    self.classesInitial = [...self.options.classInitial.split(' ')];
    self.classesInverse = [...self.options.classInverse.split(' ')];
  }

  /**
   * init setup
   */
  initSetup() {
    let self = this;
    let options = self.options;
    // setup (based on xtend mode)
    if (options.targets && options.targets.indexOf('#') !== -1) {
      // xtend unique mode
      self.mode = 'unique';
      self.container = document.documentElement;
      options.max = Infinity;
      self.namespace = self.componentName + '-' + options.targets.toString() + '-' + self.classes.toString();
    } else {
      // xtend multiple mode
      self.mode = 'multiple';
      self.container = self.object;
      let uniqueId = Xt.dataStorage.get(self.container, 'xtUniqueId');
      Xt.dataStorage.set(self.container, 'xtUniqueId', uniqueId ? uniqueId : Xt.getuniqueId());
      self.namespace = self.componentName + '-' + Xt.dataStorage.get(self.container, 'xtUniqueId');
    }
    // final namespace
    self.namespace = self.namespace.replace(/^[^a-z]+|[ ,#_:.-]+/gi, '');
    // currents array based on namespace (so shared between Xt objects)
    self.setCurrents([]);
  }

  /**
   * init logic
   */
  initLogic() {
    let self = this;
    self.initScope();
    self.initAria();
    self.initStart(true);
  }

  /**
   * init elements, targets and currents
   */
  initScope() {
    let self = this;
    // elements
    self.initScopeElements();
    // targets
    self.initScopeTargets();
  }

  /**
   * init elements
   */
  initScopeElements() {
    let self = this;
    let options = self.options;
    // elements
    if (options.elements) {
      let arr = Array.from(Xt.arrSingle(self.container.querySelectorAll(options.elements)));
      arr = arr.filter(x => !x.closest('.xt-ignore')); // filter out ignore
      self.elements = arr;
      self.destroyElements.push(...self.elements);
    }
    if (!self.elements.length) {
      self.elements = Xt.arrSingle(self.object);
      // @FIX set namespace for next frame
      requestAnimationFrame(function () {
        let arr = Array.from(Xt.arrSingle(document.querySelectorAll('[data-xt-namespace=' + self.namespace + ']')));
        arr = arr.filter(x => !x.closest('.xt-ignore')); // filter out ignore
        if (arr.length) { // fix when using shadow dom doesn't query deep
          self.elements = arr;
          self.destroyElements.push(...self.elements);
        }
      });
    }
  }

  /**
   * init targets
   */
  initScopeTargets() {
    let self = this;
    let options = self.options;
    // targets
    if (options.targets) {
      let arr = Array.from(self.container.querySelectorAll(options.targets));
      //arr = arr.filter(x => !x.parentElement.closest(options.targets)); // filter out parent
      arr = arr.filter(x => !x.closest('.xt-ignore')); // filter out ignore
      self.targets = arr;
      self.destroyElements.push(...self.targets);
    }
  }

  /**
   * init start
   * @param {Boolean} saveCurrents
   */
  initStart(saveCurrents = false) {
    let self = this;
    let options = self.options;
    // initial
    let currents = 0;
    self.initial = true;
    self.currentIndex = null;
    // @FIX set namespace for next frame
    for (let el of self.elements) {
      el.setAttribute('data-xt-namespace', self.namespace);
    }
    // automatic initial currents
    let elements = self.getGroups();
    if (elements.length) {
      // check elements
      for (let element of elements) {
        // reset
        let found = self.initReset(element, saveCurrents);
        if (found) {
          // initial
          currents++;
          // reactivate
          requestAnimationFrame(function () {
            // activate
            self.eventOn(element, true);
          });
        }
      }
      // if currents < min
      let todo = options.min - currents;
      if (todo > 0) {
        let start = 0;
        if (!self.disabled && self.dragger && options.drag.wrap) {
          start = 1;
          todo += start;
        }
        // initial
        currents++;
        // activate
        requestAnimationFrame(function () {
          for (let i = start; i < todo; i++) {
            self.eventOn(self.elements[i], true);
          }
        });
      }
      // initial
      self.setCurrents([]);
      if (saveCurrents) {
        requestAnimationFrame(function () {
          self.initialCurrents = self.getCurrents().slice(0);
        });
      }
      if (currents === 0) {
        self.initial = false;
        if (options.auto && options.auto.initial) {
          self.eventAutoStart();
        }
      }
    }
    // init events
    self.initEvents();
    // listener dispatch
    requestAnimationFrame( function () {
      let detail = self.eDetailSet();
      self.object.dispatchEvent(new CustomEvent('init.xt', {detail: detail}));
    });
  }

  /**
   * init reset element activation
   * @param {Node|HTMLElement|EventTarget|Window} el Element to check and reset
   * @returns {Boolean} if element was activated
   * @param {Boolean} saveCurrents
   */
  initReset(el, saveCurrents = false) {
    let self = this;
    let found = false;
    // elements
    let group = el.getAttribute('data-xt-group');
    if (group) {
      let groupEls = Array.from(self.elements).filter(x => x.getAttribute('data-xt-group') === group);
      for (let groupEl of groupEls) {
        if (groupEl.classList.contains(self.classes[0])) {
          groupEl.classList.remove(...self.classes, ...self.classesIn, ...self.classesOut, ...self.classesInitial, ...self.classesInverse);
          Xt.dataStorage.remove(groupEl, self.componentNamespace + 'Initial');
          if (saveCurrents) {
            found = true;
          }
          // listener dispatch
          let detail = self.eDetailSet();
          groupEl.dispatchEvent(new CustomEvent('off.xt', {bubbles: true, detail: detail}));
        }
        if (!saveCurrents && self.initialCurrents.includes(groupEl)) {
          found = true;
        }
      }
    } else {
      if (el.classList.contains(self.classes[0])) {
        el.classList.remove(...self.classes, ...self.classesIn, ...self.classesOut, ...self.classesInitial, ...self.classesInverse);
        Xt.dataStorage.remove(el, self.componentNamespace + 'Initial');
        if (saveCurrents) {
          found = true;
        }
        // listener dispatch
        let detail = self.eDetailSet();
        el.dispatchEvent(new CustomEvent('off.xt', {bubbles: true, detail: detail}));
      }
      if (!saveCurrents && self.initialCurrents.includes(el)) {
        found = true;
      }
    }
    // targets
    let targets = self.getTargets(el);
    for (let tr of targets) {
      if (tr.classList.contains(self.classes[0])) {
        tr.classList.remove(...self.classes, ...self.classesIn, ...self.classesOut, ...self.classesInitial, ...self.classesInverse);
        Xt.dataStorage.remove(tr, self.componentNamespace + 'Initial');
        if (saveCurrents) {
          found = true;
        }
        // listener dispatch
        let detail = self.eDetailSet();
        tr.dispatchEvent(new CustomEvent('off.xt', {bubbles: true, detail: detail}));
      }
    }
    return found;
  }

  /**
   * init aria
   */
  initAria() {
    let self = this;
    let options = self.options;
    // aria
    if (options.aria) {
      if (self.targets.length) {
        for (let el of self.elements) {
          let ariaEls = Xt.queryAll(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          // id
          if (options.aria === true || options.aria.labelledby || options.aria.controls) {
            let id = ariaEl.getAttribute('id');
            if (!id) {
              ariaEl.setAttribute('id', Xt.getuniqueId());
            }
          }
          // selected
          ariaEl.setAttribute('aria-selected', 'false');
        }
        for (let tr of self.targets) {
          let els = self.getTargets(tr);
          // expanded
          let role = tr.getAttribute('role');
          if (role === 'tabpanel' || role === 'listbox' || role === 'dialog') {
            tr.setAttribute('aria-expanded', 'false');
          }
          // tabindex
          if (options.aria === true || options.aria.tabindex) {
            let focusables = tr.querySelectorAll(Xt.focusables);
            for (let focusable of focusables) {
              focusable.setAttribute('tabindex', '-1');
            }
          }
          // id
          if (options.aria === true || options.aria.labelledby || options.aria.controls) {
            let id = tr.getAttribute('id');
            if (!id) {
              tr.setAttribute('id', Xt.getuniqueId());
            }
          }
          // labelledby
          if (options.aria === true || options.aria.labelledby) {
            let str = ' ';
            str += tr.getAttribute('aria-labelledby') || '';
            for (let el of els) {
              let ariaEls = Xt.queryAll(el, options.ariaControls);
              let ariaEl = ariaEls.length ? ariaEls[0] : el;
              str += ' ' + ariaEl.getAttribute('id');
            }
            tr.setAttribute('aria-labelledby', str.trim());
          }
        }
        if (options.aria === true || options.aria.controls) {
          for (let el of self.elements) {
            let trs = self.getTargets(el);
            let ariaEls = Xt.queryAll(el, options.ariaControls);
            let ariaEl = ariaEls.length ? ariaEls[0] : el;
            // controls
            let str = ' ';
            str += ariaEl.getAttribute('aria-controls') || '';
            for (let tr of trs) {
              str += ' ' + tr.getAttribute('id');
            }
            ariaEl.setAttribute('aria-controls', str.trim());
          }
        }
      }
    }
  }

  /**
   * init events
   */
  initEvents() {
    let self = this;
    let options = self.options;
    // status
    let checkHandler = Xt.dataStorage.put(window, 'resize.check' + '.' + self.namespace,
      self.eventStatusHandler.bind(self).bind(self));
    addEventListener('resize', checkHandler);
    self.eventStatusHandler();
    // event
    for (let el of self.elements) {
      // event on
      if (options.on) {
        let onHandler = Xt.dataStorage.put(el, options.on + '.' + self.namespace,
          self.eventOnHandler.bind(self).bind(self, el));
        let events = [...options.on.split(' ')];
        for (let event of events) {
          el.addEventListener(event, onHandler);
        }
        el.addEventListener('on.xt', onHandler);
        // @FIX off.xt toggle
        if (!options.off) {
          el.addEventListener('off.xt', onHandler);
        }
        // @FIX prevents click on touch until clicked two times
        if (events.includes('mouseenter') || events.includes('mousehover')) {
          let touchLinksStartHandler = Xt.dataStorage.put(el, 'touchend.touchfix' + '.' + self.namespace,
            self.eventTouchLinksStartHandler.bind(self).bind(self, el));
          el.addEventListener('touchend', touchLinksStartHandler);
        }
      }
      // event off
      if (options.off) {
        let offHandler = Xt.dataStorage.put(el, options.off + '.' + self.namespace,
          self.eventOffHandler.bind(self).bind(self, el));
        if (options.off) {
          let events = [...options.off.split(' ')];
          for (let event of events) {
            el.addEventListener(event, offHandler);
          }
        }
        el.addEventListener('off.xt', offHandler);
      }
    }
    // listener
    for (let tr of self.targets) {
      let el = self.getElements(tr)[0];
      if (el) {
        // event
        let onHandler = Xt.dataStorage.get(el, options.on + '.' + self.namespace);
        tr.addEventListener('on.xt', onHandler);
        let offHandler = Xt.dataStorage.get(el, options.off + '.' + self.namespace);
        tr.addEventListener('off.xt', offHandler);
        // @FIX off.xt toggle
        if (!options.off) {
          tr.addEventListener('off.xt', onHandler);
        }
      }
    }
    // auto
    if (options.auto && options.auto.time) {
      // focus auto
      let focusHandler = Xt.dataStorage.put(window, 'focus' + '.' + self.namespace,
        self.eventAutoResumeHandler.bind(self));
      addEventListener('focus', focusHandler);
      // blur auto
      let blurHandler = Xt.dataStorage.put(window, 'blur' + '.' + self.namespace,
        self.eventAutoPauseHandler.bind(self));
      addEventListener('blur', blurHandler);
      // autoPause
      if (options.auto && options.auto.pause) {
        let autoPauseEls = self.object.querySelectorAll(options.auto.pause);
        if (autoPauseEls.length) {
          self.destroyElements.push(...autoPauseEls);
          for (let el of autoPauseEls) {
            // pause
            let autoPauseOnHandler = Xt.dataStorage.put(el, 'mouseenter focus' + '.' + self.namespace,
              self.eventAutoPauseHandler.bind(self));
            let eventsPause = ['mouseenter', 'focus'];
            for (let event of eventsPause) {
              el.addEventListener(event, autoPauseOnHandler);
            }
            // resume
            let autoResumeOnHandler = Xt.dataStorage.put(el, 'mouseleave blur' + '.' + self.namespace,
              self.eventAutoResumeHandler.bind(self));
            let eventsResume = ['mouseleave', 'blur'];
            for (let event of eventsResume) {
              el.addEventListener(event, autoResumeOnHandler);
            }
          }
        }
      }
    }
    // jump
    if (options.jump) {
      for (let jump of self.targets) {
        let jumpHandler = Xt.dataStorage.put(jump, 'click.jump' + '.' + self.namespace,
          self.eventJumpHandler.bind(self).bind(self, jump));
        jump.addEventListener('click', jumpHandler, true); // useCapture or it gets the click from elements inside the target
        // jump
        if (!self.disabled) {
          jump.classList.add('jump');
        } else {
          jump.classList.remove('jump');
        }
      }
    }
    // navigation
    if (options.navigation) {
      self.navs = self.object.querySelectorAll(options.navigation);
      if (self.navs.length) {
        self.destroyElements.push(...self.navs);
        for (let nav of self.navs) {
          let navHandler = Xt.dataStorage.put(nav, 'click.nav' + '.' + self.namespace,
            self.eventNavHandler.bind(self).bind(self, nav));
          nav.addEventListener('click', navHandler);
        }
      }
    }
    // keyboard
    if (options.keyboard && options.keyboard.selector) {
      let keyboards = options.keyboard.selector === 'object' ? Xt.arrSingle(self.object) : self.object.querySelectorAll(options.keyboard.selector);
      self.destroyElements.push(...keyboards);
      for (let keyboard of keyboards) {
        keyboard.setAttribute('tabindex', '0');
        // focus
        let keyboardFocusHandler = Xt.dataStorage.put(keyboard, 'focus.keyboard' + '.' + self.namespace,
          self.eventKeyboardFocusHandler.bind(self).bind(self, keyboard));
        keyboard.addEventListener('focus', keyboardFocusHandler);
        // blur
        let keyboardBlurHandler = Xt.dataStorage.put(keyboard, 'blur.keyboard' + '.' + self.namespace,
          self.eventKeyboardBlurHandler.bind(self).bind(self, keyboard));
        keyboard.addEventListener('blur', keyboardBlurHandler);
      }
    }
    // autoClose
    if (options.autoClose) {
      let autoCloseHandler = Xt.dataStorage.put(window, 'autoClose' + '.' + self.namespace,
        self.eventAutoCloseHandler.bind(self));
      addEventListener('autoClose.xt', autoCloseHandler);
    }
    // images
    for (let el of self.elements.filter(x => !x.classList.contains('xt-clone'))) {
      let imgs = el.querySelectorAll('img');
      self.destroyElements.push(...imgs);
      for (let img of imgs) {
        if (!Xt.dataStorage.get(img, self.componentNamespace + 'ImageLoadedDone')) {
          Xt.dataStorage.set(img, self.componentNamespace + 'ImageLoadedDone', true);
          if (!img.complete) {
            let imgLoadHandler = Xt.dataStorage.put(img, 'load' + '.' + self.namespace,
              self.eventImgLoadedHandler.bind(self).bind(self, el, true));
            img.addEventListener('load', imgLoadHandler);
          } else {
            self.eventImgLoadedHandler(el, false);
          }
        }
      }
    }
    for (let tr of self.targets.filter(x => !x.classList.contains('xt-clone'))) {
      let imgs = tr.querySelectorAll('img');
      self.destroyElements.push(...imgs);
      for (let img of imgs) {
        if (!Xt.dataStorage.get(img, self.componentNamespace + 'ImageLoadedDone')) {
          Xt.dataStorage.set(img, self.componentNamespace + 'ImageLoadedDone', true);
          if (!img.complete) {
            let imgLoadHandler = Xt.dataStorage.put(img, 'load' + '.' + self.namespace,
              self.eventImgLoadedHandler.bind(self).bind(self, tr, true));
            img.addEventListener('load', imgLoadHandler);
          } else {
            self.eventImgLoadedHandler(tr, false);
          }
        }
      }
    }
    // wheel
    if (options.wheel && options.wheel.selector) {
      let wheel = self.detail.wheel = options.wheel.selector === 'object' ? self.object :
        options.wheel.selector === 'scrollingElement' ? document.scrollingElement :
          self.object.querySelector(options.wheel.selector);
      self.destroyElements.push(wheel);
      let eWheel = 'onwheel' in wheel ? 'wheel' : wheel.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
      // wheel
      let wheelHandler = Xt.dataStorage.put(wheel, eWheel + '.' + self.namespace,
        self.eventWheelHandler.bind(self));
      wheel.addEventListener(eWheel, wheelHandler, Xt.passiveSupported ? {passive: false} : false);
      // stop
      let wheelStopHandler = Xt.dataStorage.put(wheel, eWheel + '.stop' + '.' + self.namespace,
        self.eventWheelStop.bind(self));
      wheel.addEventListener('stop.wheel.xt', wheelStopHandler, Xt.passiveSupported ? {passive: false} : false);
      // block
      if (options.wheel.block) {
        let block = wheel.parentNode;
        let wheelBlockHandler = Xt.dataStorage.put(block, eWheel + '.block' + '.' + self.namespace,
          self.eventWheelBlockHandler.bind(self));
        block.addEventListener(eWheel, wheelBlockHandler, Xt.passiveSupported ? {passive: false} : false);
      }
    }
  }

  //////////////////////
  // handler
  //////////////////////

  /**
   * element on handler
   * @param {Node|HTMLElement|EventTarget|Window} element
   * @param {Event} e
   */
  eventOnHandler(element, e) {
    let self = this;
    let options = self.options;
    // handler
    if (element === e.target || element.contains(e.target)) { // @FIX on.xt and off.xt: handler triggered by child xt events
      if (!e || !e.detail || !e.detail.skip) { // needed because we trigger .xt event
        // event block
        if (options.onBlock) {
          let now = new Date().getTime();
          let old = Xt.dataStorage.get(element, self.componentNamespace + 'EventBlock' + e.type) || 0;
          Xt.dataStorage.set(element, self.componentNamespace + 'EventBlock' + e.type, now);
          if (now - old < options.onBlock) {
            return false;
          }
        }
        // on handler
        let eventLimit = self.container.querySelectorAll('.event-limit');
        if (eventLimit.length) {
          if (!Xt.checkNested(e.target, eventLimit)) {
            self.eventOn(element, false, e);
          }
        } else {
          self.eventOn(element, false, e);
        }
      }
    }
  }

  /**
   * element off handler
   * @param {Node|HTMLElement|EventTarget|Window} element
   * @param {Event} e
   */
  eventOffHandler(element, e) {
    let self = this;
    let options = self.options;
    // handler
    if (element === e.target || element.contains(e.target)) { // @FIX on.xt and off.xt: handler triggered by child xt events
      if (!e || !e.detail || !e.detail.skip) { // needed because we trigger .xt event
        // event block
        if (options.offBlock) {
          let now = new Date().getTime();
          let old = Xt.dataStorage.get(element, self.componentNamespace + 'EventBlock' + e.type) || 0;
          Xt.dataStorage.set(element, self.componentNamespace + 'EventBlock' + e.type, now);
          if (now - old < options.offBlock) {
            return false;
          }
        }
        // off handler
        let eventLimit = self.container.querySelectorAll('.event-limit');
        if (eventLimit.length) {
          if (!Xt.checkNested(e.target, eventLimit)) {
            self.eventOff(element, false, e);
          }
        } else {
          self.eventOff(element, false, e);
        }
      }
    }
  }

  /**
   * init prevents click on touch until clicked two times
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventTouchLinksStartHandler(el, e) {
    let self = this;
    // event touchLinks
    let touchLinksHandler = Xt.dataStorage.put(el, 'click.touchfix' + '.' + self.namespace,
      self.eventTouchLinksHandler.bind(self).bind(self, el));
    el.addEventListener('click', touchLinksHandler);
    // event touchReset
    let touchResetHandler = Xt.dataStorage.put(el, 'off.touchfix' + '.' + self.namespace,
      self.eventTouchLinksResetHandler.bind(self).bind(self, el));
    el.addEventListener('off.xt', touchResetHandler);
  }

  /**
   * remove prevents click on touch until clicked two times
   * @param {Node|HTMLElement|EventTarget|Window} el
   */
  eventTouchLinksEndHandler(el) {
    let self = this;
    // event touchLinks
    let touchLinksHandler = Xt.dataStorage.get(el, 'click.touchfix' + '.' + self.namespace);
    el.removeEventListener('click', touchLinksHandler);
    // event touchReset
    let touchResetHandler = Xt.dataStorage.get(el, 'off.touchfix' + '.' + self.namespace);
    el.removeEventListener('off.xt', touchResetHandler);
  }

  /**
   * prevents click on touch until clicked two times
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventTouchLinksHandler(el, e) {
    let self = this;
    if (!Xt.dataStorage.get(el, self.componentNamespace + 'TouchLinksDone')) {
      Xt.dataStorage.set(el, self.componentNamespace + 'TouchLinksDone', true);
      // prevent default
      e.preventDefault();
    } else {
      self.eventTouchLinksEndHandler(el);
      Xt.dataStorage.remove(el, self.componentNamespace + 'TouchLinksDone');
    }
  }

  /**
   * reset prevents click on touch until clicked two times
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventTouchLinksResetHandler(el, e) {
    let self = this;
    self.eventTouchLinksEndHandler(el);
    Xt.dataStorage.remove(el, self.componentNamespace + 'TouchLinksDone');
  }

  /**
   * auto pause handler
   * @param {Event} e
   */
  eventAutoPauseHandler(e) {
    let self = this;
    if (!e || !e.detail || !e.detail.skip) { // needed because we trigger .xt event
      if (!self.detail.autoPaused) {
        self.eventAutoPause();
        // paused
        self.detail.autoPaused = true;
      }
    }
  }

  /**
   * auto resume handler
   * @param {Event} e
   */
  eventAutoResumeHandler(e) {
    let self = this;
    if (!e || !e.detail || !e.detail.skip) { // needed because we trigger .xt event
      if (self.detail.autoPaused) {
        self.eventAutoStart();
        // paused
        self.detail.autoPaused = false;
      }
    }
  }

  /**
   * jump handler
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventJumpHandler(el, e) {
    let self = this;
    // handler
    self.eventJump(el, e);
  }

  /**
   * nav handler
   * @param {Node|HTMLElement|EventTarget|Window} nav
   * @param {Event} e
   */
  eventNavHandler(nav, e) {
    let self = this;
    // handler
    self.eventNav(nav, e);
  }

  /**
   * keyboard focus handler
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventKeyboardFocusHandler(el, e) {
    let self = this;
    // handler
    let keyboardHandler = Xt.dataStorage.put(document, 'keyup.keyboard' + '.' + self.namespace,
      self.eventKeyboardHandler.bind(self));
    document.addEventListener('keyup', keyboardHandler);
  }

  /**
   * keyboard blur handler
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventKeyboardBlurHandler(el, e) {
    // handler
    let keyboardHandler = Xt.dataStorage.get(document, 'keyup.keyboard' + '.' + self.namespace);
    document.removeEventListener('keyup', keyboardHandler);
  }

  /**
   * keyboard handler
   * @param {Event} e
   */
  eventKeyboardHandler(e) {
    let self = this;
    let options = self.options;
    // key
    let code = e.keyCode ? e.keyCode : e.which;
    let prev;
    let next;
    if (options.keyboard.vertical) {
      if (options.keyboard.inverse) {
        prev = 40;
        next = 38;
      } else {
        prev = 38;
        next = 40;
      }
    } else {
      if (options.keyboard.inverse) {
        prev = 39;
        next = 37;
      } else {
        prev = 37;
        next = 39;
      }
    }
    if (code === prev) {
      self.goToPrev(1);
    } else if (code === next) {
      self.goToNext(1);
    }
  }

  /**
   * autoClose handler
   * @param {Event} e
   */
  eventAutoCloseHandler(e) {
    let self = this;
    // restart
    let currents = self.getCurrents();
    for (let current of currents) {
      self.eventOff(current);
    }
  }

  /**
   * imageLoaded
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   * @param {Boolean} deferred
   */
  eventImgLoadedHandler(el, deferred = true) {
    let self = this;
    let options = self.options;
    // class
    el.classList.add('xt-imageLoaded');
    // listener dispatch
    let detail = self.eDetailSet();
    detail.deferred = deferred;
    el.dispatchEvent(new CustomEvent('imageLoaded.xt', {bubbles: true, detail: detail}));
    // imageLoadedInit
    if (options.imageLoadedInit && deferred) {
      clearTimeout(Xt.dataStorage.get(self.object, 'xt' + self.componentNamespace + 'imageLoadedInit' + 'Timeout'));
      Xt.dataStorage.set(self.object, 'xt' + self.componentNamespace + 'imageLoadedInit' + 'Timeout', setTimeout(function () {
        self.initLogic();
      }, Xt.imageLoadedDelay));
    }
  }

  //////////////////////
  // event util
  //////////////////////

  /**
   * get groups (one element per group)
   * @returns {Array} array of elements
   */
  getGroups() {
    let self = this;
    // groups
    let groups = [];
    for (let element of self.elements) {
      // choose element by group
      let group = element.getAttribute('data-xt-group');
      if (group) {
        let found = groups.filter(x => x.getAttribute('data-xt-group') === group);
        if (!found.length) {
          groups.push(element);
        }
      } else {
        groups.push(element);
      }
    }
    return groups;
  }

  /**
   * get elements from element or target
   * @param {Node|HTMLElement|EventTarget|Window} el Element that triggered interaction
   * @returns {Array} The first element is the one on getGroups()
   */
  getElements(el) {
    let self = this;
    // getElements
    if (!self.elements || !self.elements.length) {
      return [];
    }
    if (self.mode === 'unique' || !el) {
      // choose all elements
      return self.elements;
    } else if (self.mode === 'multiple') {
      // choose element by group
      let final;
      let group = el.getAttribute('data-xt-group');
      let groupElements = Array.from(self.elements).filter(x => x.getAttribute('data-xt-group') === group);
      let groupTargets = Array.from(self.targets).filter(x => x.getAttribute('data-xt-group') === group);
      if (group) {
        // all group targets if group
        final = Xt.arrSingle(groupElements);
      } else {
        // not group targets by index if not group
        if (Array.from(self.elements).includes(el)) { // @FIX when argument is already element
          final = Xt.arrSingle(el);
        } else {
          let index = groupTargets.findIndex(x => x === el);
          final = Xt.arrSingle(groupElements[index]);
        }
      }
      return final;
    }
  }

  /**
   * get targets from element or target
   * @param {Node|HTMLElement|EventTarget|Window} el Element that triggered interaction
   * @returns {Array}
   */
  getTargets(el) {
    let self = this;
    // getTargets
    if (!self.targets || !self.targets.length) {
      return [];
    }
    if (self.mode === 'unique' || !el) {
      // choose all targets
      return self.targets;
    } else if (self.mode === 'multiple') {
      // choose only target by group
      let final;
      let group = el.getAttribute('data-xt-group');
      let groupElements = Array.from(self.elements).filter(x => x.getAttribute('data-xt-group') === group);
      let groupTargets = Array.from(self.targets).filter(x => x.getAttribute('data-xt-group') === group);
      if (group) {
        // all group targets if group
        final = Xt.arrSingle(groupTargets);
      } else {
        // not group targets by index if not group
        if (Array.from(self.targets).includes(el)) { // @FIX when argument is already target
          final = Xt.arrSingle(el);
        } else {
          let index = groupElements.findIndex(x => x === el);
          final = Xt.arrSingle(groupTargets[index]);
        }
      }
      return final;
    }
  }

  /**
   * get currents based on namespace (so shared between Xt objects)
   * @returns {Array}
   */
  getCurrents() {
    let self = this;
    // getCurrents
    return Xt.currents[self.namespace];
  }

  /**
   * set currents based on namespace (so shared between Xt objects)
   * @param {Array} arr
   */
  setCurrents(arr) {
    let self = this;
    // setCurrents
    Xt.currents[self.namespace] = arr;
  }

  /**
   * add current based on namespace (so shared between Xt objects)
   * @param {Node|HTMLElement|EventTarget|Window} element To be added
   */
  addCurrent(element) {
    let self = this;
    // addCurrent
    if (!self.hasCurrent(element)) {
      let arr = Xt.currents[self.namespace];
      arr.push(element);
    }
  }

  /**
   * remove currents based on namespace (so shared between Xt objects)
   * @param {Node|HTMLElement|EventTarget|Window} element To be removed
   */
  removeCurrent(element) {
    let self = this;
    // removeCurrent
    Xt.currents[self.namespace] = Xt.currents[self.namespace].filter(x => x !== element);
  }

  /**
   * if element or target is in current (so shared between Xt objects)
   * @param {Node|HTMLElement|EventTarget|Window} element To be checked
   */
  hasCurrent(element) {
    let self = this;
    // hasCurrent
    let groupElements = self.getElements(element);
    return Xt.currents[self.namespace].filter(x => x === groupElements[0]).length;
  }

  /**
   * check element on
   * @param {Node|HTMLElement|EventTarget|Window} element To be checked
   */
  checkOn(element) {
    let self = this;
    // check
    return !self.hasCurrent(element);
  }

  /**
   * check element off
   * @param {Node|HTMLElement|EventTarget|Window} element To be checked
   */
  checkOff(element) {
    let self = this;
    let options = self.options;
    // skip if min >= currents
    if (options.min - self.getCurrents().length >= 0) {
      return false;
    }
    // check
    return self.hasCurrent(element);
  }

  /**
   * check elements animation
   * @param {NodeList|Array} elements To be checked
   * @returns {Boolean} If elements are animating
   */
  checkAnim(elements) {
    let self = this;
    // check
    elements = elements.filter(x => x.classList.contains(...self.classesIn) || x.classList.contains(...self.classesOut));
    return elements.length > 0;
  }

  /**
   * set index and direction
   * @param {Node|HTMLElement|EventTarget|Window} element Current element
   */
  setIndexAndDirection(element) {
    let self = this;
    // setIndexAndDirection
    let index = 0;
    for (let [i, el] of self.elements.entries()) {
      if (el === element) {
        index = i;
        break;
      }
    }
    self.detail.inverse = self.detail.inverseForce !== null ? self.detail.inverseForce : self.currentIndex > index;
    self.detail.inverseForce = null;
    self.currentIndex = index;
  }

  /**
   * set e detail
   * @param {Event} e
   */
  eDetailSet(e = null) {
    // e.detail
    let detail = e && e.detail && typeof e.detail === 'object' ? e.detail : {};
    // detail
    detail.self = this;
    detail.skip = true;
    // return
    return detail;
  }

  /**
   * activate element
   * @param {Node|HTMLElement|EventTarget|Window} el Elements to be activated
   */
  activate(el) {
    let self = this;
    // activate
    el.classList.add(...self.classes);
    el.classList.add(...self.classesIn);
    el.classList.remove(...self.classesOut);
    if (self.initial || Xt.dataStorage.get(el, self.componentNamespace + 'Initial')) {
      el.classList.add(...self.classesInitial);
    }
    if (!self.detail.inverse) {
      el.classList.remove(...self.classesInverse);
    } else {
      el.classList.add(...self.classesInverse);
    }
  }

  /**
   * deactivate element
   * @param {Node|HTMLElement|EventTarget|Window} el Elements to be deactivated
   */
  deactivate(el) {
    let self = this;
    // activate
    el.classList.remove(...self.classes);
    el.classList.remove(...self.classesIn);
    el.classList.add(...self.classesOut);
    if (!self.initial && !Xt.dataStorage.get(el, self.componentNamespace + 'Initial')) {
      el.classList.remove(...self.classesInitial);
    }
    if (!self.detail.inverse) {
      el.classList.remove(...self.classesInverse);
    } else {
      el.classList.add(...self.classesInverse);
    }
  }

  //////////////////////
  // event
  //////////////////////

  /**
   * element on
   * @param {Node|HTMLElement|EventTarget|Window} element To be activated
   * @param {Boolean} force
   * @param {Event} e
   * @returns {Boolean} If activated
   */
  eventOn(element, force = false, e = null) {
    let self = this;
    let options = self.options;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // toggle
    if (force || self.checkOn(element)
      && (!e || !e.type || e.type !== 'off.xt')) { // @FIX off.xt toggle
      // auto
      if (options.auto && options.auto.time) {
        self.eventAutoStop();
      }
      // on
      let groupElements = self.getElements(element);
      self.addCurrent(groupElements[0]);
      self.setIndexAndDirection(element);
      let targets = self.getTargets(element);
      let elementsInner = Xt.queryAll(element, options.elementsInner);
      let targetsInner = Xt.queryAll(targets, options.targetsInner);
      // if currents > max
      let currents = self.getCurrents();
      if (currents.length > options.max) {
        // deactivate old
        self.eventOff(currents[0]);
      }
      // detail
      let detail = self.eDetailSet(e);
      // queue obj
      let actionCurrent = 'On';
      let actionOther = 'Off';
      let obj = {};
      obj['elements'] = {
        detail: detail,
        queueEls: groupElements
      };
      if (targets.length) {
        obj['targets'] = {
          detail: detail,
          queueEls: targets
        };
      }
      if (elementsInner.length) {
        obj['elementsInner'] = {
          detail: detail,
          queueEls: elementsInner
        };
      }
      if (targetsInner.length) {
        obj['targetsInner'] = {
          detail: detail,
          queueEls: targetsInner
        };
      }
      // put in queue
      if (typeof options.instant !== 'object' && options.instant === true) {
        self.detail['queue' + actionCurrent] = [obj];
      } else {
        self.detail['queue' + actionCurrent].unshift(obj);
      }
      // queue run
      for (let type in self.detail['queue' + actionCurrent][0]) {
        self.queueStart(actionCurrent, actionOther, type, 0, true);
      }
      // activated
      return true;
    } else if ((!e || !e.type || e.type !== 'on.xt')) { // @FIX off.xt toggle
      // off
      self.eventOff(element, e);
    }
    // activated
    return false;
  }

  /**
   * element off
   * @param {Node|HTMLElement|EventTarget|Window} element To be deactivated
   * @param {Boolean} force
   * @param {Event} e
   * @returns {Boolean} If deactivated
   */
  eventOff(element, force = false, e = null) {
    let self = this;
    let options = self.options;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // toggle
    if (force || self.checkOff(element)) {
      // off
      let groupElements = self.getElements(element);
      self.removeCurrent(groupElements[0]);
      let targets = self.getTargets(element);
      let elementsInner = Xt.queryAll(element, options.elementsInner);
      let targetsInner = Xt.queryAll(targets, options.targetsInner);
      if (element.blur) { // @FIX sometimes blur is undefined
        element.blur(); // @FIX :focus styles
      }
      // currentIndex after a frame for sequential events
      requestAnimationFrame(function () {
        if (self.getCurrents().length === 0) {
          self.currentIndex = null;
        }
      });
      // auto
      if (!self.getCurrents().length) {
        self.eventAutoStop();
      }
      // detail
      let detail = self.eDetailSet(e);
      // queue obj
      let actionCurrent = 'Off';
      let actionOther = 'On';
      let obj = {};
      obj['elements'] = {
        detail: detail,
        queueEls: groupElements
      };
      if (targets.length) {
        obj['targets'] = {
          detail: detail,
          queueEls: targets
        };
      }
      if (elementsInner.length) {
        obj['elementsInner'] = {
          detail: detail,
          queueEls: elementsInner
        };
      }
      if (targetsInner.length) {
        obj['targetsInner'] = {
          detail: detail,
          queueEls: targetsInner
        };
      }
      // put in queue
      if (typeof options.instant !== 'object' && options.instant === true) {
        self.detail['queue' + actionCurrent] = [obj];
      } else {
        self.detail['queue' + actionCurrent].unshift(obj);
      }
      // if queue too big
      if (self.detail['queue' + actionCurrent].length > options.max) {
        // remove queue on and done other queue
        let removedOn = self.detail['queue' + actionOther].shift();
        self.queueStop(actionOther, actionCurrent, removedOn);
        // remove queue off and done other queue
        let removedOff = self.detail['queue' + actionCurrent].shift();
        self.queueStop(actionCurrent, actionOther, removedOff);
      }
      // queue run
      for (let type in self.detail['queue' + actionCurrent][0]) {
        self.queueStart(actionCurrent, actionOther, type, 0, true);
      }
      // deactivated
      return true;
    }
    // deactivated
    return false;
  }

  /**
   * auto start
   */
  eventAutoStart() {
    let self = this;
    let options = self.options;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // start
    if (options.auto && options.auto.time) {
      // paused
      self.detail.autoPaused = false;
      // clear
      clearInterval(Xt.dataStorage.get(self.object, self.componentNamespace + 'AutoStartInterval'));
      // auto
      let time = options.auto.time;
      if (self.currentIndex !== null &&  // not when nothing activated
        !self.initial || options.auto.initial) { // not when initial
        Xt.dataStorage.set(self.object, self.componentNamespace + 'AutoStartInterval', setInterval(function () { // interval because can become :visible
          if (Xt.visible(self.object)) {
            // auto
            if (getComputedStyle(self.object).pointerEvents !== 'none') { // not when disabled
              if (options.auto.inverse) {
                self.goToPrev(options.auto.step, true);
              } else {
                self.goToNext(options.auto.step, true);
              }
            }
          }
        }, time));
        // listener dispatch
        let detail = self.eDetailSet();
        self.object.dispatchEvent(new CustomEvent('start.xt.auto', {detail: detail}));
      }
    }
  }

  /**
   * auto stop
   */
  eventAutoStop() {
    let self = this;
    let options = self.options;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // stop
    if (options.auto && options.auto.time) {
      // clear
      clearInterval(Xt.dataStorage.get(self.object, self.componentNamespace + 'AutoStartInterval'));
      // listener dispatch
      let detail = self.eDetailSet();
      self.object.dispatchEvent(new CustomEvent('stop.xt.auto', {detail: detail}));
    }
  }

  /**
   * auto stop
   */
  eventAutoPause() {
    let self = this;
    let options = self.options;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // pause
    if (options.auto && options.auto.time) {
      // clear
      clearInterval(Xt.dataStorage.get(self.object, self.componentNamespace + 'AutoStartInterval'));
      // listener dispatch
      let detail = self.eDetailSet();
      self.object.dispatchEvent(new CustomEvent('pause.xt.auto', {detail: detail}));
    }
  }

  /**
   * jump
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventJump(el, e) {
    let self = this;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // check disabled
    if (el.closest('.jumps--none')) {
      return false;
    }
    // jump
    let element = self.getTargets(el)[0];
    if (self.checkOn(element)) {
      self.eventOn(element);
    }
  }

  /**
   * nav
   * @param {Node|HTMLElement|EventTarget|Window} nav
   * @param {Event} e
   */
  eventNav(nav, e) {
    let self = this;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // nav
    let index = 0;
    if (self.currentIndex !== null) {
      index = self.currentIndex + parseFloat(nav.getAttribute('data-xt-nav'));
    }
    self.goToIndex(index, true);
  }

  //////////////////////
  // queue
  //////////////////////

  /**
   * queue start
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {String} type Type of element
   * @param {Number} index Queue index
   * @param {Boolean} queueInitial If it's the initial queue
   */
  queueStart(actionCurrent, actionOther, type, index, queueInitial = false) {
    let self = this;
    let options = self.options;
    // queue start
    let obj = self.detail['queue' + actionCurrent][index];
    if (obj && obj[type] && !obj[type].done) {
      let objOther = self.detail['queue' + actionOther][self.detail['queue' + actionOther].length - 1];
      if (!objOther || !objOther[type] || objOther[type].done) {
        if (typeof options.instant !== 'object' && options.instant === true) {
          obj[type].instant = true;
        } else if (typeof options.instant === 'object' && options.instant[type]) {
          obj[type].instantType = true;
        }
        self.queueDelay(actionCurrent, actionOther, obj, type, queueInitial);
      }
    }
  }

  /**
   * queue stop
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {Object} obj Queue object to end
   */
  queueStop(actionCurrent, actionOther, obj) {
    let self = this;
    // stop type if done
    for (let type in obj) {
      if (obj[type].done) {
        for (let el of obj[type].queueEls) {
          // clear timeout and frame
          cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
          clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'DelayTimeout'));
          clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'AnimTimeout'));
          // done other queue
          self.queueDelayDone(actionOther, actionCurrent, obj, el, type, true);
          self.queueAnimDone(actionOther, actionCurrent, obj, el, type, true);
        }
      }
    }
  }

  /**
   * queue stop all
   */
  queueStopAll() {
    let self = this;
    // stop all obj in queues
    let queues = [...self.detail['queue' + 'On'], ...self.detail['queue' + 'Off']];
    for (let obj in queues) {
      for (let type in queues[obj]) {
        for (let el of queues[obj][type].queueEls) {
          // clear timeout and frame
          cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
          clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'DelayTimeout'));
          clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'AnimTimeout'));
        }
      }
    }
  }

  /**
   * queue delay
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {Object} obj Queue object
   * @param {String} type Type of elements
   * @param {Boolean} queueInitial If it's the initial queue
   */
  queueDelay(actionCurrent, actionOther, obj, type, queueInitial) {
    let self = this;
    let options = self.options;
    // delay
    let els = obj[type].queueEls;
    for (let el of els) {
      // delay
      let delay = options['delay' + actionCurrent];
      if (delay) {
        if (isNaN(delay)) {
          let count = Xt.dataStorage.get(el, self.componentNamespace + actionCurrent + 'Count') || els.findIndex(x => x === el);
          let tot = Xt.dataStorage.get(el, self.componentNamespace + actionCurrent + 'Tot') || els.length;
          let fnc = delay;
          if (typeof fnc === 'string') {
            fnc = new Function('current', 'total', fnc);
          }
          delay = fnc(count, tot - 1).toString();
        } else {
          delay = queueInitial ? 0 : delay;
        }
      }
      // delay fnc
      clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'DelayTimeout'));
      clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'AnimTimeout'));
      if (delay && !obj[type].instant && !obj[type].instantType) {
        Xt.dataStorage.set(el, self.componentNamespace + 'DelayTimeout', setTimeout(function () {
          self.queueDelayDone(actionCurrent, actionOther, obj, el, type);
        }, delay));
      } else {
        self.queueDelayDone(actionCurrent, actionOther, obj, el, type);
      }
      // queue done
      if (obj[type].instant) {
        if (el === els[els.length - 1]) { // only if last element
          self.queueDone(actionCurrent, actionOther, obj, type);
        }
      }
    }
  }

  /**
   * queue delay done
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement|EventTarget|Window} el Elements to be deactivated
   * @param {String} type Type of elements
   * @param {Boolean} skipQueue If skip queue
   */
  queueDelayDone(actionCurrent, actionOther, obj, el, type, skipQueue = false) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // activate
      self.activate(el);
      // special
      let before = getComputedStyle(el, ':before').getPropertyValue('content').replace(/['"]+/g, '');
      let after = getComputedStyle(el, ':after').getPropertyValue('content').replace(/['"]+/g, '');
      self.specialCenter(el, before, after);
      self.specialMiddle(el, before, after);
      self.specialCollapse(actionCurrent, el, before, after);
      if (type === 'targets'
        || (!self.targets.length && type === 'elements')) { // @FIX when standalone
        // appendTo
        if (options.appendTo) {
          let appendToTarget = document.querySelector(options.appendTo);
          let appendOrigin = document.querySelector('[data-xt-origin=' + self.namespace + ']');
          if (!appendOrigin) {
            el.before(Xt.createElement('<div class="xt-ignore" data-xt-origin=' + self.namespace + '></div>'));
          }
          el.classList.add('xt-ignore'); // @FIX ignore Xt.observer and init
          appendToTarget.appendChild(el);
        }
      }
      if (type === 'targets' || type === 'targetsInner') {
        self.specialClose(actionCurrent, el, obj['elements'].queueEls[0]);
      }
      // aria
      if (options.aria) {
        if (type === 'elements') {
          // selected
          let ariaEls = Xt.queryAll(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          ariaEl.setAttribute('aria-selected', 'true');
        }
        if (type === 'targets') {
          // expanded
          let role = el.getAttribute('role');
          if (role === 'tabpanel' || role === 'listbox' || role === 'dialog') {
            el.setAttribute('aria-expanded', 'true');
          }
        }
      }
      // listener dispatch
      el.dispatchEvent(new CustomEvent('on.xt', {bubbles: true, detail: obj[type].detail}));
    } else if (actionCurrent === 'Off') {
      // deactivate
      self.deactivate(el);
      // special
      let before = getComputedStyle(el, ':before').getPropertyValue('content').replace(/['"]+/g, '');
      let after = getComputedStyle(el, ':after').getPropertyValue('content').replace(/['"]+/g, '');
      self.specialCollapse(actionCurrent, el, before, after);
      if (type === 'targets' || type === 'targetsInner') {
        self.specialClose(actionCurrent, el);
      }
      // listener dispatch
      el.dispatchEvent(new CustomEvent('off.xt', {bubbles: true, detail: obj[type].detail}));
    }
    // queue
    if (!skipQueue) {
      self.queueAnim(actionCurrent, actionOther, obj, el, type);
      // queue done
      if (obj[type].instantType) {
        let els = obj[type].queueEls;
        if (el === els[els.length - 1]) { // only if last element
          self.queueDone(actionCurrent, actionOther, obj, type);
        }
      }
    }
  }

  /**
   * queue anim
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement|EventTarget|Window} el Element to be animated
   * @param {String} type Type of element
   */
  queueAnim(actionCurrent, actionOther, obj, el, type) {
    let self = this;
    let options = self.options;
    // anim
    let duration = Xt.animTime(el, options['duration' + actionCurrent]);
    clearTimeout(Xt.dataStorage.get(el, self.componentNamespace + 'AnimTimeout'));
    if (!duration || obj[type].instant || obj[type].instantType) {
      self.queueAnimDone(actionCurrent, actionOther, obj, el, type);
    } else {
      Xt.dataStorage.set(el, self.componentNamespace + 'AnimTimeout', setTimeout(function () {
        self.queueAnimDone(actionCurrent, actionOther, obj, el, type);
      }, duration));
    }
  }

  /**
   * queue anim done
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement|EventTarget|Window} el Element to be animated
   * @param {String} type Type of element
   * @param {Boolean} skipQueue If skip queue
   */
  queueAnimDone(actionCurrent, actionOther, obj, el, type, skipQueue = false) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // reset
      el.classList.remove(...self.classesIn);
      // special
      let before = getComputedStyle(el, ':before').getPropertyValue('content').replace(/['"]+/g, '');
      let after = getComputedStyle(el, ':after').getPropertyValue('content').replace(/['"]+/g, '');
      self.specialCollapse('Reset', el, before, after);
      // aria
      if (options.aria) {
        // tabindex
        if (options.aria === true || options.aria.tabindex) {
          if (type === 'targets') {
            let focusables = el.querySelectorAll(Xt.focusables);
            for (let focusable of focusables) {
              focusable.removeAttribute('tabindex');
            }
          }
        }
      }
      // listener dispatch
      el.dispatchEvent(new CustomEvent('ondone.xt', {bubbles: true, detail: obj[type].detail}));
    } else if (actionCurrent === 'Off') {
      // reset
      el.classList.remove(...self.classesOut);
      // special
      if (type === 'targets'
        || (!self.targets.length && type === 'elements')) { // @FIX when standalone
        // appendTo
        if (options.appendTo) {
          let appendOrigin = document.querySelector('[data-xt-origin=' + self.namespace + ']');
          if (appendOrigin) {
            appendOrigin.before(el);
            appendOrigin.remove();
            requestAnimationFrame(function () {
              el.classList.remove('xt-ignore'); // @FIX ignore Xt.observer and init
            });
          } else {
            el.remove();
          }
        }
      }
      // aria
      if (options.aria) {
        // selected
        if (type === 'elements') {
          let ariaEls = Xt.queryAll(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          ariaEl.setAttribute('aria-selected', 'false');
        }
        if (type === 'targets') {
          // expanded
          let role = el.getAttribute('role');
          if (role === 'tabpanel' || role === 'listbox' || role === 'dialog') {
            el.setAttribute('aria-expanded', 'false');
          }
          // tabindex
          if (options.aria === true || options.aria.tabindex) {
            let focusables = el.querySelectorAll(Xt.focusables);
            for (let focusable of focusables) {
              focusable.setAttribute('tabindex', '-1');
              focusable.blur();
            }
          }
        }
      }
      // listener dispatch
      el.dispatchEvent(new CustomEvent('offdone.xt', {bubbles: true, detail: obj[type].detail}));
    }
    // queue
    if (!skipQueue) {
      // queue done
      if (!obj[type].instant && !obj[type].instantType) {
        let els = obj[type].queueEls;
        if (el === els[els.length - 1]) { // only if last element
          self.queueDone(actionCurrent, actionOther, obj, type);
        }
      }
    }
  }

  /**
   * queue done
   * @param {String} actionCurrent Current action
   * @param {String} actionOther Other action
   * @param {Object} obj Queue object
   * @param {String} type Type of element
   */

  queueDone(actionCurrent, actionOther, obj, type) {
    let self = this;
    // check
    if (obj[type]) {
      // type done
      obj[type].done = true;
      // check done
      let done = 0;
      for (let type in obj) {
        if (obj[type].done) {
          done++;
        }
      }
      // one done
      if (done === 1) {
        // queue progress
        self.queueProgress(actionCurrent, obj);
      }
      // queue
      self.queueStart(actionOther, actionCurrent, type, self.detail['queue' + actionOther].length - 1);
      // all done
      if (done === Object.entries(obj).length) {
        // remove queue
        self.detail['queue' + actionCurrent].pop();
        // queue complete
        self.queueComplete(actionCurrent, obj);
      }
    }
  }

  /**
   * logic to execute on queue first progress
   * @param {String} actionCurrent Current action
   * @param {Object} obj Queue object
   */
  queueProgress(actionCurrent, obj) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // special
      self.specialBackdrop(obj);
      self.specialClassHtml(actionCurrent);
      self.specialScrollbar(actionCurrent);
      // focus
      if (options.scrollbar) {
        let el = obj['targets'] ? obj['targets'].queueEls[0] : obj['elements'].queueEls[0];
        Xt.focus.block = true;
        Xt.focusLimit.on(el);
        el.focus();
      }
    } else if (actionCurrent === 'Off') {
      // special
      self.specialClassHtml(actionCurrent);
      // focus
      if (options.scrollbar) {
        Xt.focus.block = false;
        Xt.focusLimit.off();
        Xt.focus.current.focus();
      }
    }
  }

  /**
   * logic to execute on queue complete
   * @param {String} actionCurrent Current action
   * @param {Object} obj Queue object
   */
  queueComplete(actionCurrent, obj) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // auto
      if (options.auto && options.auto.time) {
        self.eventAutoStart();
      }
      // initial
      self.initial = false;
    } else if (actionCurrent === 'Off') {
      // special
      self.specialScrollbar(actionCurrent);
    }
  }

  //////////////////////
  // wheel
  //////////////////////

  /**
   * wheel handler
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */
  eventWheelHandler(e) {
    let self = this;
    self.eventWheelSmooth(e);
  }

  /**
   * wheel block handler
   * @param {Event} e
   */
  eventWheelBlockHandler(e) {
    let self = this;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // prevent default if not loop
    let max = self.getGroups().length - 1;
    let delta = -e.deltaY || -e.detail || e.wheelDelta || e.wheelDeltaY;
    if ((delta > 0 && self.currentIndex > 0) || (delta < 0 && self.currentIndex < max - 1)) {
      // prevent wheel
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * event wheel smooth for Xt
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Event} e
   */

  eventWheelSmooth(e) {
    let self = this;
    let options = self.options;
    let el = self.detail.wheel;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // if document.scrollingElement scroll current overflow scroll
    if (el === document.scrollingElement) {
      let elFinal;
      for (let composed of e.composedPath()) {
        if (composed === document.scrollingElement // always when scrollingElement
          || getComputedStyle(composed).overflowY === 'scroll') {
          if (composed.scrollHeight > composed.clientHeight) { // when scrollable
            elFinal = composed;
          } else if (window.self !== window.top) {
            elFinal = window.top.document.scrollingElement;
          } else {
            elFinal = window.self.document.scrollingElement;
          }
          break;
        }
      }
      if (!elFinal) {
        return false;
      } else if (elFinal === document.body) {
        elFinal = self.object; // document.scrollingElement
      }
      el = elFinal;
    }
    // delta
    let delta = -e.deltaY || -e.detail || e.wheelDelta || e.wheelDeltaY;
    if (delta === 0) {
      return;
    }
    if (e.deltaMode === 1) {
      // deltaMode 1: by lines
      delta *= 30;
    } else if (e.deltaMode === 2) {
      // deltaMode 2: by pages
      if (options.wheel.horizontal) {
        delta *= el.offsetWidth;
      } else {
        delta *= el.offsetHeight;
      }
    }
    // factor
    delta *= options.wheel.factor;
    // instant
    if (!options.wheel.friction) {
      // wheel
      if (delta < 0) {
        self.goToNext(1);
      } else if (delta > 0) {
        self.goToPrev(1);
      }
      // dispatch
      let detail = self.eDetailSet(e);
      self.detail.wheel.dispatchEvent(new CustomEvent('wheelstart.xt', {detail: detail}));
      self.detail.wheel.dispatchEvent(new CustomEvent('wheelend.xt', {detail: detail}));
      // return
      return false;
    }
    // min and max
    let min = self.detail.wheelMin || 0;
    let max = self.detail.wheelMax;
    // calculate max
    if (!self.detail.wheelMax) {
      if (!options.wheel.transform) {
        if (options.wheel.horizontal) {
          max = el.scrollWidth - el.offsetWidth;
        } else {
          max = el.scrollHeight - el.offsetHeight;
        }
      } else {
        let full = 0;
        if (options.wheel.horizontal) {
          for (let child of el.children) {
            full += child.offsetWidth;
          }
          max = full - el.offsetWidth;
        } else {
          for (let child of el.children) {
            full += child.offsetHeight;
          }
          max = full - el.offsetHeight;
        }
      }
    }
    // calculate end
    if (!self.detail.wheelMoving) {
      // get current
      if (!options.wheel.transform) {
        if (options.wheel.horizontal) {
          self.detail.wheelCurrent = el.scrollLeft;
        } else {
          self.detail.wheelCurrent = el.scrollTop;
        }
      } else {
        if (options.wheel.horizontal) {
          self.detail.wheelCurrent = -Xt.getTranslate(el)[0];
        } else {
          self.detail.wheelCurrent = -Xt.getTranslate(el)[1];
        }
      }
      // set end
      self.detail.wheelEnd = self.detail.wheelCurrent - delta;
    } else {
      // set end
      self.detail.wheelEnd = self.detail.wheelEnd - delta;
    }
    // friction to limit
    if (options.wheel.limit) {
      // limit
      self.detail.wheelEnd = Math.max(min, Math.min(self.detail.wheelEnd, max));
    }
    // propagate if already at min or max
    if (self.detail.wheelMin && self.detail.wheelMax) { // only when setting wheelMin and wheelMax
      if (delta < 0) {
        if (self.detail.wheelCurrent >= max) {
          return false;
        }
      } else if (delta > 0) {
        if (self.detail.wheelCurrent <= min) {
          return false;
        }
      }
    }
    // prevent wheel
    e.preventDefault();
    // moving
    if (!self.detail.wheelMoving) {
      self.detail.wheelMoving = true;
      // dispatch
      let detail = self.eDetailSet();
      detail.wheelX = -self.detail.wheelCurrent;
      self.detail.wheel.dispatchEvent(new CustomEvent('wheelstart.xt', {detail: detail}));
      // friction
      self.eventFrictionSmooth(el, min, max);
    }
  }

  /**
   * event friction smooth for Xt
   * @param {Node|HTMLElement|EventTarget|Window} el
   * @param {Number} min Minimum value
   * @param {Number} max Maximum value
   */

  eventFrictionSmooth(el, min, max) {
    let self = this;
    let options = self.options;
    // disabled
    if (self.disabled && !self.initial) {
      return false;
    }
    // vars
    let delta = self.detail.wheelEnd - self.detail.wheelCurrent;
    let deltaAbs = Math.abs(delta);
    let sign = Math.sign(delta);
    // momentum
    let fncFriction = options.wheel.friction;
    if (typeof fncFriction === 'string') {
      fncFriction = new Function('delta', fncFriction);
    }
    if (deltaAbs >= options.wheel.frictionLimit) {
      self.detail.wheelCurrent += fncFriction(deltaAbs) * sign;
    } else {
      self.detail.wheelCurrent = self.detail.wheelEnd;
    }
    // set
    if (!options.wheel.transform) {
      if (options.wheel.horizontal) {
        el.scrollLeft = self.detail.wheelCurrent;
      } else {
        el.scrollTop = self.detail.wheelCurrent;
      }
    } else {
      if (options.wheel.horizontal) {
        el.style.transform = 'translateX(' + (-self.detail.wheelCurrent) + 'px)';
      } else {
        el.style.transform = 'translateY(' + (-self.detail.wheelCurrent) + 'px)';
      }
    }
    // loop
    if (self.detail.wheelCurrent > min && self.detail.wheelCurrent < max && // limit
      deltaAbs >= options.wheel.frictionLimit) { // frictionLimit
      // friction
      cancelAnimationFrame(Xt.dataStorage.get(self.detail.wheel, self.componentNamespace + 'WheelSmoothFrame'));
      Xt.dataStorage.set(self.detail.wheel, self.componentNamespace + 'WheelSmoothFrame', requestAnimationFrame(function () {
        self.eventFrictionSmooth(el, min, max);
      }));
      // dispatch
      let detail = self.eDetailSet();
      detail.wheelX = -self.detail.wheelCurrent;
      self.detail.wheel.dispatchEvent(new CustomEvent('wheel.xt', {detail: detail}));
    } else {
      // moving
      self.detail.wheelMoving = false;
      // vars
      self.detail.wheelEnd = false;
      // dispatch
      let detail = self.eDetailSet();
      detail.wheelX = -self.detail.wheelCurrent;
      self.detail.wheel.dispatchEvent(new CustomEvent('wheelend.xt', {detail: detail}));
    }
  }

  /**
   * event wheel stop for Xt
   */

  eventWheelStop() {
    let self = this;
    let el = self.detail.wheel;
    cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'WheelSmoothFrame'));
    self.detail.wheelMoving = false;
  }

  //////////////////////
  // special
  //////////////////////

  /**
   * add or remove close events on element
   * @param {String} actionCurrent Current action
   * @param {Node|HTMLElement|EventTarget|Window} el Element
   * @param {Node|HTMLElement|EventTarget|Window} single Element to toggle
   */
  specialClose(actionCurrent, el, single) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // closeInside
      if (options.closeInside) {
        let closeElements = el.querySelectorAll(options.closeInside);
        requestAnimationFrame(function () {
          for (let closeElement of closeElements) {
            let specialCloseInsideHandler = Xt.dataStorage.put(closeElement, 'click.close' + '.' + self.namespace,
              self.eventSpecialCloseInsideHandler.bind(self).bind(self, closeElement, single));
            closeElement.addEventListener('click', specialCloseInsideHandler);
          }
        });
      }
      // closeOutside
      if (options.closeOutside) {
        let closeElements = document.querySelectorAll(options.closeOutside);
        requestAnimationFrame(function () {
          for (let closeElement of closeElements) {
            let specialCloseOutsideHandler = Xt.dataStorage.put(closeElement, 'click.close' + '.' + self.namespace,
              self.eventSpecialCloseOutsideHandler.bind(self).bind(self, el, single));
            closeElement.addEventListener('click', specialCloseOutsideHandler);
          }
        });
      }
    } else if (actionCurrent === 'Off') {
      // closeInside
      if (options.closeInside) {
        let closeElements = el.querySelectorAll(options.closeInside);
        for (let closeElement of closeElements) {
          let specialCloseInsideHandler = Xt.dataStorage.get(closeElement, 'click.close' + '.' + self.namespace);
          closeElement.removeEventListener('click', specialCloseInsideHandler);
        }
      }
      // closeOutside
      if (options.closeOutside) {
        let closeElements = document.querySelectorAll(options.closeOutside);
        for (let closeElement of closeElements) {
          let specialCloseOutsideHandler = Xt.dataStorage.get(closeElement, 'click.close' + '.' + self.namespace);
          closeElement.removeEventListener('click', specialCloseOutsideHandler);
        }
      }
    }
  }

  /**
   * specialClose on handler
   * @param {Node|HTMLElement|EventTarget|Window} checkEl
   * @param {Node|HTMLElement|EventTarget|Window} single
   * @param {Event} e
   */
  eventSpecialCloseInsideHandler(checkEl, single, e) {
    let self = this;
    // prevent closing when nested and moved (ex: overlay)
    if (!Xt.checkNested(checkEl, self.targets)) {
      return false;
    }
    // handler
    if (Xt.checkNested(e.target, Xt.arrSingle(checkEl))) {
      self.eventOff(single);
    }
  }

  /**
   * specialClose off handler
   * @param {Node|HTMLElement|EventTarget|Window} checkEl
   * @param {Node|HTMLElement|EventTarget|Window} single
   * @param {Event} e
   */
  eventSpecialCloseOutsideHandler(checkEl, single, e) {
    let self = this;
    // handler
    if (!Xt.checkNested(e.target, Xt.arrSingle(checkEl))) {
      self.eventOff(single);
    }
  }

  /**
   * open or close or reset collapse
   * @param {String} actionCurrent Current action
   * @param {Node|HTMLElement|EventTarget|Window} el Element
   * @param {String} before Before content
   * @param {String} after After content
   */
  specialCollapse(actionCurrent, el, before, after) {
    if (el instanceof HTMLElement) {
      if (actionCurrent === 'On') {
        if (before === 'xt-collapse--height') {
          cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
          Xt.dataStorage.set(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
            el.classList.add('xt-hide', 'trans-anim-none');
            el.style.height = 'auto';
            let h = el.clientHeight + 'px';
            el.style.height = '0';
            cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
            Xt.dataStorage.set(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
              el.classList.remove('xt-hide', 'trans-anim-none');
              el.style.height = h;
            }));
          }));
        }
        if (after === 'xt-collapse--width') {
          cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
          Xt.dataStorage.set(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
            el.classList.add('xt-hide', 'trans-anim-none');
            el.style.width = 'auto';
            let w = el.clientHeight + 'px';
            el.style.width = '0';
            cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
            Xt.dataStorage.set(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
              el.classList.remove('xt-hide', 'trans-anim-none');
              el.style.width = w;
            })).toString();
          }));
        }
      } else if (actionCurrent === 'Off') {
        if (before === 'xt-collapse--height') {
          let h = el.offsetHeight + 'px';
          cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
          Xt.dataStorage.set(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
            el.classList.remove('xt-hide', 'trans-anim-none');
            el.style.height = h;
            cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
            Xt.dataStorage.set(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
              el.style.height = '0';
            }));
          }));
        }
        if (after === 'xt-collapse--width') {
          let w = el.offsetWidth + 'px';
          cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
          Xt.dataStorage.put(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
            el.classList.remove('xt-hide', 'trans-anim-none');
            el.style.width = w;
            cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'CollapseFrame'));
            Xt.dataStorage.put(el, self.componentNamespace + 'CollapseFrame', requestAnimationFrame(function () {
              el.style.width = '0';
            }));
          }));
        }
      } else if (actionCurrent === 'Reset') {
        if (before === 'xt-collapse--height') {
          el.style.height = 'inherit';
        }
        if (after === 'xt-collapse--width') {
          el.style.width = 'inherit';
        }
      }
    }
  }

  /**
   * scrollbar activation
   * @param {String} actionCurrent Current action
   */
  specialScrollbar(actionCurrent) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // scrollbar on
      if (options.scrollbar) {
        // checks
        Xt.scrollbar.add(self.namespace);
        // check fixed
        let checks = document.querySelectorAll('.xt-fixed--check, .xt-fixed--check > *');
        for (let check of checks) {
          let style = getComputedStyle(check);
          if (style.position === 'fixed') {
            check.classList.add('xt-fixed');
          } else {
            check.classList.remove('xt-fixed');
          }
        }
        // scrollbar
        let container = document.documentElement;
        container.classList.add('xt-scrollbar');
        Xt.scrollbarSpaceOn(container);
      }
    } else if (actionCurrent === 'Off') {
      // scrollbar off
      if (options.scrollbar) {
        // checks
        Xt.scrollbar.remove(self.namespace);
        if (!Xt.scrollbar.get().length) {
          // scrollbar
          let container = document.documentElement;
          container.classList.remove('xt-scrollbar');
          Xt.scrollbarSpaceOff(container);
        }
      }
    }
  }

  /**
   * add or remove html class
   * @param {String} actionCurrent Current action
   */
  specialClassHtml(actionCurrent) {
    let self = this;
    let options = self.options;
    if (actionCurrent === 'On') {
      // class on
      if (options.classHtml) {
        let container = document.documentElement;
        container.classList.add(...options.classHtml.split(' '));
      }
    } else if (actionCurrent === 'Off') {
      // class off
      if (options.classHtml) {
        let container = document.documentElement;
        container.classList.remove(...options.classHtml.split(' '));
      }
    }
  }

  /**
   * backdrop append to element
   * @param {Object} obj Queue object
   */
  specialBackdrop(obj) {
    let self = this;
    let options = self.options;
    // backdrop
    if (options.backdrop) {
      let elements = typeof options.backdrop === 'string' && obj[options.backdrop] ? Xt.arrSingle(obj[options.backdrop].queueEls) : Xt.arrSingle(self.object);
      for (let element of elements) {
        let backdrop = element.querySelectorAll('.backdrop');
        if (!backdrop.length) {
          backdrop = Xt.createElement('<div class="backdrop xt-ignore"></div>');
          element.append(backdrop);
          // @FIX pass wheel event or when you mousewheel over .backdrop it doesn't scroll
          let eWheel = 'onwheel' in backdrop ? 'wheel' : backdrop.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
          backdrop.addEventListener(eWheel, function(e) {
            let delta = -e.deltaY || -e.detail || e.wheelDelta || e.wheelDeltaY;
            element.scrollTop -= delta;
          }, Xt.passiveSupported ? {passive: false} : false);
        }
      }
    }
  }

  /**
   * center position on activation
   * @param {Node|HTMLElement|EventTarget|Window} el Element
   * @param {String} before Before content
   * @param {String} after After content
   */
  specialCenter(el, before, after) {
    let self = this;
    // specialCenter
    if (before === 'xt-drop--center') {
      let add = self.object.clientWidth;
      let remove = el.clientWidth;
      el.style.left = ((add - remove) / 2) + 'px';
    }
  }

  /**
   * middle position on activation
   * @param {Node|HTMLElement|EventTarget|Window} el Element
   * @param {String} before Before content
   * @param {String} after After content
   */
  specialMiddle(el, before, after) {
    let self = this;
    // specialMiddle
    if (after === 'xt-drop--middle') {
      let add = self.object.clientHeight;
      let remove = el.clientHeight;
      el.style.top = ((add - remove) / 2) + 'px';
    }
  }

  //////////////////////
  // goto
  //////////////////////

  /**
   * activate next element
   * @param {Number} amount
   * @param {Boolean} force
   * @param {Boolean} loop
   */
  goToNext(amount = 1, force = false, loop = null) {
    let self = this;
    // goToIndex
    let index = 0;
    if (self.currentIndex !== null) {
      index = self.currentIndex + amount;
    }
    self.detail.inverseForce = false;
    self.goToIndex(index, force, loop);
  }

  /**
   * activate prev element
   * @param {Number} amount
   * @param {Boolean} force
   * @param {Boolean} loop
   */
  goToPrev(amount = 1, force = false, loop = null) {
    let self = this;
    // goToIndex
    let index = self.getGroups().length - 1;
    if (self.currentIndex !== null) {
      index = self.currentIndex - amount;
    }
    self.detail.inverseForce = true;
    self.goToIndex(index, force, loop);
  }

  /**
   * activate index element
   * @param {Number} index
   * @param {Boolean} force
   * @param {Boolean} loop
   */
  goToIndex(index, force = false, loop = null) {
    let self = this;
    let options = self.options;
    // check
    let max = self.getGroups().length - 1;
    if (index > max) {
      if (loop || (loop === null && options.loop)) {
        index = index - max - 1;
        index = index > max ? max : index; // prevent overflow
      } else {
        index = max;
      }
    } else if (index < 0) {
      if (loop || (loop == null && options.loop)) {
        index = index + max + 1;
        index = index < 0 ? 0 : index; // prevent overflow
      } else {
        index = 0;
      }
    }
    // go
    let current = self.getGroups()[index];
    self.eventOn(current, force);
  }

  //////////////////////
  // status
  //////////////////////

  /**
   * status handler
   * @param {Event} e
   */
  eventStatusHandler(e = null) {
    let self = this;
    // handler
    Xt.eventDelay(e, self.object, function () {
      self.eventStatus();
    }, self.componentNamespace + 'Resize');
  }

  /**
   * status
   */
  eventStatus() {
    let self = this;
    // check disabled
    if (self.object instanceof HTMLElement // @FIX not on window
      && getComputedStyle(self.object, ':after').getPropertyValue('content').replace(/['"]+/g, '') === 'xt-disable') {
      self.disable();
    } else if (self.disabled) {
      self.enable();
    }
  }

  /**
   * disable
   */
  disable() {
    let self = this;
    // disable
    self.disabled = true;
    self.object.classList.add('xt-disabled');
  }

  /**
   * disable
   */
  enable() {
    let self = this;
    // enable
    self.disabled = false;
    self.object.classList.remove('xt-disabled');
  }

  //////////////////////
  // destroy
  //////////////////////

  /**
   * destroy
   */
  destroy(weak = false) {
    let self = this;
    // stop auto
    self.eventAutoStop();
    // stop queue
    self.queueStopAll();
    // remove events
    if (self.destroyElements) {
      for (let element of self.destroyElements) {
        let storages = Xt.dataStorage.getAll(element);
        if (storages) {
          for (let [key, storage] of storages) {
            if (key.endsWith(self.namespace)) {
              let handler = Xt.dataStorage.get(element, key);
              let events = key.split('.')[0].split(' ');
              for (let event of events) {
                element.removeEventListener(event, handler);
                element.removeEventListener(event, handler, true);
                element.removeEventListener(event, handler, {passive: true});
                Xt.dataStorage.remove(element, key);
              }
            }
          }
        }
      }
    }
    // not weak destroy
    if (!weak) {
      // unmount
      if (self.unmount) {
        self.unmount();
      }
      // destroy
      delete this;
    }
  }

}

//////////////////////
// option
//////////////////////

Core.componentName = 'xt-core';

//////////////////////
// observe
//////////////////////

Xt.mount.push({
  matches: '[data-' + Core.componentName + ']',
  fnc: function (main, index, query) {

    let self = new Core(main, main.getAttribute('data-' + Core.componentName));

    // destroy

    return function unmount() {
      self.destroy();
      self = null;
    };

  }
});
