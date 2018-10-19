/* xtend (https://getxtend.com/)
@copyright (c) 2017 - 2018 Riccardo Caroli
@license MIT (https://github.com/minimit/xtend-library/blob/master/LICENSE) */

'use strict';

//////////////////////
// Xt
//////////////////////

class XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @param {String} attr Attribute name with json options
   * @constructor
   */
  constructor(object, jsOptions = {}, attr) {
    this.object = object;
    if (this.object && !this.object.dataset.xtCoreDone) {
      this.object.dataset.xtCoreDone = 'true';
      this.defaults = {
        "onBlock": false,
        "offBlock": false,
        "auto": false,
        "autoPause": false,
        "autoAlways": false,
        "delayOn": false,
        "delayOff": false,
        "durationOn": false,
        "durationOff": false
      };
      this.defaults = Xt.merge([this.defaults, this.constructor.defaults]);
      // js options
      this.options = Xt.merge([this.defaults, jsOptions]);
      // markup options
      let markupOptions = this.object.getAttribute(attr);
      this.options = Xt.merge([this.options, markupOptions ? JSON.parse(markupOptions) : {}]);
      // classes
      if (this.options.class) {
        this.options.classes = [...this.options.class.split(' ')];
      }
      // internals
      this.detail = {};
      this.detail.queueOn = [];
      this.detail.queueOff = [];
      // init
      this.initSetup();
      this.initScope();
      this.initEvents();
      this.initAria();
    }
  }

  //////////////////////
  // init
  //////////////////////

  /**
   * setup namespace, container and options
   */
  initSetup() {
    let self = this;
    let options = self.options;
    // setup (based on xtend mode)
    if (options.targets && options.targets.indexOf('#') !== -1) {
      // xtend all mode
      this.mode = 'unique';
      this.container = document.documentElement;
      options.max = Infinity;
      this.namespace = options.targets.toString() + '-' + options.classes.toString();
    } else {
      // xtend unique mode
      this.mode = 'multiple';
      this.container = this.object;
      this.namespace = Xt.getUniqueID();
    }
    // final namespace
    this.namespace = this.namespace.replace(/^[^a-z]+|[^\w:.-]+/gi, '');
    // currents array based on namespace (so shared between Xt objects)
    if (!this.getCurrents()) {
      this.setCurrents([]);
    }
  }

  /**
   * init elements, targets and currents
   */
  initScope() {
    let self = this;
    let options = self.options;
    // elements
    this.elements = [];
    if (options.elements) {
      this.elements = Xt.arrSingle(this.container.querySelectorAll(options.elements));
    }
    if (!this.elements.length) {
      this.elements = Xt.arrSingle(this.object);
      // @FIX on next frame set all elements querying the namespace
      Xt.requestAnimationFrame.call(window, function () {
        let namespaceQuery = '[data-xt-namespace=' + self.namespace + ']';
        self.elements = Xt.arrSingle(document.querySelectorAll(namespaceQuery));
      });
    }
    // targets
    this.targets = [];
    if (options.targets) {
      let arr = Array.from(this.container.querySelectorAll(options.targets));
      arr = arr.filter(x => !Xt.parents(x, options.targets).length); // filter out parent
      this.targets = arr;
    }
    // appendTo
    if (options.appendTo) {
      let appendToTarget = document.querySelectorAll(options.appendTo);
      if (appendToTarget.length) {
        for (let el of this.targets) {
          appendToTarget[0].appendChild(el);
        }
      }
    }
    // @FIX set namespace for next frame
    for (let el of this.elements) {
      el.setAttribute('data-xt-namespace', self.namespace);
    }
    // automatic initial currents
    Xt.requestAnimationFrame.call(window, function () {
      if (self.elements.length) {
        // elements
        for (let el of self.elements) {
          let found = false;
          if (el.classList.contains(...options.classes)) {
            el.classList.remove(...options.classes);
            found = true;
          }
          let targets = self.getTargets(el);
          for (let tr of targets) {
            if (tr.classList.contains(...options.classes)) {
              tr.classList.remove(...options.classes);
              found = true;
            }
          }
          if (found) {
            self.eventOn(el);
          }
        }
        // if currents < min
        let todo = options.min - self.getCurrents().length;
        if (todo) {
          for (let i = 0; i < todo; i++) {
            self.eventOn(self.elements[i]);
          }
        }
      }
    });
  }

  /**
   * init aria
   */
  initAria() {
    let self = this;
    let options = self.options;
    // aria
    if (options.aria) {
      if (this.targets.length) {
        for (let el of this.elements) {
          // id
          let ariaEls = self.getInside(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          let id = ariaEl.getAttribute('id');
          el.dataset.namespace = Xt.getUniqueID();
          if (!id) {
            ariaEl.setAttribute('id', el.dataset.namespace + '-element');
          }
          // selected
          ariaEl.setAttribute('aria-selected', 'false');
        }
        for (let tr of this.targets) {
          // id
          let el = this.getElementsFromTarget(tr)[0];
          let id = tr.getAttribute('id');
          tr.dataset.namespace = el.dataset.namespace;
          if (!id) {
            id = tr.dataset.namespace + '-target';
            tr.setAttribute('id', id);
          }
          // tabindex
          tr.setAttribute('tabindex', '-1');
          // expanded
          let role = tr.getAttribute('role');
          if (role === 'tabpanel' || role === 'listbox' || role === 'dialog') {
            tr.setAttribute('aria-expanded', 'false');
          }
          // depending on el
          let ariaEls = self.getInside(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          ariaEl.setAttribute('aria-controls', id);
          tr.setAttribute('aria-labelledby', ariaEl.getAttribute('id'));
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
    // toggle
    options.toggle = !options.off;
    // events
    for (let el of this.elements) {
      // event on
      let onHandler = Xt.dataStorage.put(el, 'onHandler', self.eventOnHandler.bind(self).bind(self, el));
      if (options.on) {
        let events = [...options.on.split(' ')];
        for (let event of events) {
          el.removeEventListener(event, onHandler);
          el.addEventListener(event, onHandler);
        }
      }
      el.removeEventListener('on', onHandler);
      el.addEventListener('on', onHandler);
      // event off
      let offHandler = Xt.dataStorage.put(el, 'offHandler', self.eventOffHandler.bind(self).bind(self, el));
      if (options.off) {
        let events = [...options.off.split(' ')];
        for (let event of events) {
          el.removeEventListener(event, offHandler);
          el.addEventListener(event, offHandler);
        }
      }
      el.removeEventListener('off', offHandler);
      el.addEventListener('off', offHandler);
    }
    // listener
    for (let tr of this.targets) {
      let el = this.getElementsFromTarget(tr)[0];
      if (el) {
        // event
        let onHandler = Xt.dataStorage.get(el, 'onHandler');
        let offHandler = Xt.dataStorage.get(el, 'offHandler');
        tr.removeEventListener('on', onHandler);
        tr.addEventListener('on', onHandler);
        tr.removeEventListener('off', offHandler);
        tr.addEventListener('off', offHandler);
      }
    }
    // auto
    if (options.auto) {
      this.auto();
      // focus and blur
      window.removeEventListener('focus', self.auto.bind(self));
      window.addEventListener('focus', self.auto.bind(self));
      window.removeEventListener('blur', self.autoStop.bind(self));
      window.addEventListener('blur', self.autoStop.bind(self));
    }
  }

  /**
   * element on handler
   * @param {Node|HTMLElement} element
   * @param {Event} e
   */
  eventOnHandler(element, e) {
    let self = this;
    let options = self.options;
    if (!e.detail || !e.detail.skip) {
      // event block
      if (options.onBlock) {
        let now = new Date().getTime();
        let old = parseFloat(element.dataset['xtEventBlock' + e.type]) || 0;
        element.dataset['xtEventBlock' + e.type] = now.toString();
        if (now - old < options.onBlock) {
          return false;
        }
      }
      // on handler
      let eventLimit = self.container.querySelectorAll('.event-limit');
      if (eventLimit.length) {
        if (Xt.checkOutside(e, eventLimit)) {
          self.eventOn(element);
        }
      } else {
        self.eventOn(element);
      }
      // auto
      if (self.options.autoPause) {
        self.autoPause();
      } else if (self.options.auto) {
        self.auto();
      }
    }
  }

  /**
   * element off handler
   * @param {Node|HTMLElement} element
   * @param {Event} e
   */
  eventOffHandler(element, e) {
    let self = this;
    let options = self.options;
    if (!e.detail || !e.detail.skip) {
      // event block
      if (options.offBlock) {
        let now = new Date().getTime();
        let old = parseFloat(element.dataset['xtEventBlock' + e.type]) || 0;
        element.dataset['xtEventBlock' + e.type] = now.toString();
        if (now - old < options.offBlock) {
          return false;
        }
      }
      // off handler
      let eventLimit = self.container.querySelectorAll('.event-limit');
      if (eventLimit.length) {
        if (Xt.checkOutside(e, eventLimit)) {
          self.eventOff(element);
        }
      } else {
        self.eventOff(element);
      }
    }
  }

  /**
   * activate index element
   * @param {Number} index
   */
  goToIndex(index) {
    let current = this.elements[index];
    this.eventOn(current);
    return current;
  }

  /**
   * activate next element
   */
  goToNext() {
    let curentIndex = this.curentIndex !== undefined ? this.curentIndex + 1 : 0;
    curentIndex = curentIndex > this.elements.length - 1 ? 0 : curentIndex;
    this.forceNormalDirection = this.curentIndex > curentIndex;
    let current = this.elements[curentIndex];
    this.eventOn(current);
    return current;
  }

  /**
   * activate prev element
   */
  goToPrev() {
    let curentIndex = this.curentIndex !== undefined ? this.curentIndex - 1 : 0;
    curentIndex = curentIndex < 0 ? this.elements.length - 1 : curentIndex;
    this.forceInverseDirection = this.curentIndex < curentIndex;
    let current = this.elements[curentIndex];
    this.eventOn(current);
    return current;
  }

  /**
   * set auto change
   * @param {Boolean} instant
   */
  auto(instant = false) {
    let self = this;
    let options = self.options;
    // auto
    this.autoStop();
    let time = !instant ? options.auto : 0;
    self.autoInterval = setInterval(function () {
      if (!options.autoAlways && self.object.offsetParent === null) { // if not :visible don't change
        return false;
      }
      self.goToNext();
    }, time);
  }

  /**
   * set autoPause change
   * @param {Boolean} instant
   */
  autoPause(instant = false) {
    let self = this;
    let options = self.options;
    // autoPause
    this.autoStop();
    let time = !instant ? options.autoPause : 0;
    if (time !== 'stop') {
      self.autoPauseTimeout = setTimeout(function () {
        self.auto(true);
        self.auto();
      }, time);
    }
  }

  /**
   * stop auto change
   */
  autoStop() {
    clearInterval(this.autoInterval);
    clearTimeout(this.autoPauseTimeout);
  }

  //////////////////////
  // events utils
  //////////////////////

  /**
   * choose which elements to activate/deactivate (based on xtend mode and containers)
   * @param {Node|HTMLElement} element Element that triggered interaction
   * @returns {Object} object.all and object.single
   */
  getElements(element) {
    if (!this.elements || !this.elements.length) {
      return {all: [], single: null};
    }
    if (this.mode === 'unique') {
      // choose all elements
      let final = this.elements;
      return {all: Xt.arrSingle(final), single: final.length > 1 ? final[0] : final};
    } else if (this.mode === 'multiple') {
      // choose element by group
      let group = element.getAttribute('data-group');
      if (group) {
        // all group elements if group
        let groupElements = Array.from(this.elements).filter(x => x.getAttribute('data-group') === group);
        let final = Xt.arrSingle(groupElements);
        return {all: final, single: final[0]};
      } else {
        // element if not group
        let final = element;
        return {all: Xt.arrSingle(final), single: final};
      }
    }
  }

  /**
   * choose which targets to activate/deactivate (based on xtend mode and containers)
   * @param {Node|HTMLElement} element Element that triggered interaction
   * @returns {Array}
   */
  getTargets(element) {
    if (!this.targets || !this.targets.length) {
      return [];
    }
    if (this.mode === 'unique') {
      // choose all targets
      return this.targets;
    } else if (this.mode === 'multiple') {
      // choose only target by group
      let group = element.getAttribute('data-group');
      let groupElements = Array.from(this.elements).filter(x => x.getAttribute('data-group') === group);
      let groupTargets = Array.from(this.targets).filter(x => x.getAttribute('data-group') === group);
      let final;
      if (group) {
        // all group targets if group
        final = groupTargets;
      } else {
        // not group targets by index if not group
        let index = groupElements.findIndex(x => x === element);
        final = groupTargets[index];
      }
      return Xt.arrSingle(final);
    }
  }

  /**
   * choose which elements to activate/deactivate from target (based on xtend mode and containers)
   * @param {Node|HTMLElement} target Target to trigger interaction on
   * @returns {Array}
   */
  getElementsFromTarget(target) {
    if (!this.elements || !this.elements.length) {
      return [];
    }
    if (this.mode === 'unique') {
      // choose all targets
      return this.elements;
    } else if (this.mode === 'multiple') {
      // choose only target by group
      let group = target.getAttribute('data-group');
      let groupElements = Array.from(this.elements).filter(x => x.getAttribute('data-group') === group);
      let groupTargets = Array.from(this.targets).filter(x => x.getAttribute('data-group') === group);
      let final;
      if (group) {
        // all group targets if group
        final = groupElements;
      } else {
        // not group targets by index if not group
        let index = groupTargets.findIndex(x => x === target);
        final = groupElements[index];
      }
      return Xt.arrSingle(final);
    }
  }

  /**
   * query for inside
   * @param {Node|HTMLElement|Array} element Element to search from
   * @param {String} query Query for querySelectorAll
   * @returns {Array}
   */
  getInside(element, query) {
    if (!query) {
      return [];
    }
    if (!element.length) {
      // search element
      return Xt.arrSingle(element.querySelectorAll(query));
    } else {
      // search array
      let arr = [];
      for (let el of element) {
        arr.push(...el.querySelectorAll(query));
      }
      return arr;
    }
  }

  /**
   * get currents based on namespace (so shared between Xt objects)
   * @returns {Array}
   */
  getCurrents() {
    return Xt.currents[this.namespace];
  }

  /**
   * set currents based on namespace (so shared between Xt objects)
   * @param {Array} arr
   */
  setCurrents(arr) {
    Xt.currents[this.namespace] = arr;
  }

  /**
   * add current based on namespace (so shared between Xt objects)
   * @param {Node|HTMLElement} element To be added
   */
  addCurrent(element) {
    let arr = Xt.currents[this.namespace];
    arr.push(element);
  }

  /**
   * remove currents based on namespace (so shared between Xt objects)
   * @param {Node|HTMLElement} element To be removed
   */
  removeCurrent(element) {
    Xt.currents[this.namespace] = Xt.currents[this.namespace].filter(x => x !== element);
  }

  /**
   * if element is in current (so shared between Xt objects)
   * @param {Node|HTMLElement} element To be checked
   */
  hasCurrent(element) {
    return Xt.currents[this.namespace].filter(x => x === element).length;
  }

  /**
   * check element on
   * @param {Node|HTMLElement} element To be checked
   */
  checkOn(element) {
    // check
    let groupElements = this.getElements(element);
    return !this.hasCurrent(groupElements.single);
  }

  /**
   * check element off
   * @param {Node|HTMLElement} element To be checked
   */
  checkOff(element) {
    // skip if min >= currents
    if (this.options.min - this.getCurrents().length >= 0) {
      return false;
    }
    // check
    let groupElements = this.getElements(element);
    return this.hasCurrent(groupElements.single);
  }

  /**
   * check elements animation
   * @param {NodeList|Array} elements To be checked
   * @returns {Boolean} If elements are animating
   */
  checkAnim(elements) {
    // check
    elements = elements.filter(x => x.classList.contains('in') || x.classList.contains('out'));
    return elements.length > 0;
  }

  /**
   * set index and direction
   * @param {Node|HTMLElement} element Current element
   */
  setIndexAndDirection(element) {
    let index = 0;
    for (let [i, el] of this.elements.entries()) {
      if (el === element) {
        index = i;
        break;
      }
    }
    this.inverseDirection = !this.forceNormalDirection && (this.forceInverseDirection || this.curentIndex > index);
    this.forceNormalDirection = false;
    this.forceInverseDirection = false;
    this.curentIndex = index;
  }

  /**
   * set index and direction
   * @param {Array} all All objects to be decorate
   */
  decorateDirection(all) {
    if (!this.inverseDirection) {
      for (let el of all) {
        el.classList.remove('direction-inverse');
      }
    } else {
      for (let el of all) {
        el.classList.add('direction-inverse');
      }
    }
  }

  //////////////////////
  // events
  //////////////////////

  /**
   * element on
   * @param {Node|HTMLElement} element To be activated
   */
  eventOn(element) {
    let self = this;
    let options = self.options;
    // toggle
    if (this.checkOn(element)) {
      // on
      this.specialOnActivate = false;
      let groupElements = this.getElements(element);
      this.addCurrent(groupElements.single);
      this.setIndexAndDirection(element);
      let targets = this.getTargets(element);
      let elementsInner = this.getInside(element, options.elementsInner);
      let targetsInner = this.getInside(targets, options.targetsInner);
      this.decorateDirection([...groupElements.all, ...targets, ...elementsInner, ...targetsInner]);
      // if currents > max
      let currents = this.getCurrents();
      if (currents.length > options.max) {
        /*
        // remove queue and end
        let removed = this.detail.queueOn.pop();
        console.log('CURRENTS RESET'); // @TODO
        this.queueOffEnd(removed);
        */
        // deactivate old
        this.eventOff(currents[0]);
      }
      // if queue too big // @TODO
      //this.queueOnTodo();
      //this.queueOffTodo();
      // queue obj
      let obj = {};
      if (groupElements.all.length) {
        obj['elements'] = {
          queueEls: groupElements.all,
          groupElements: groupElements
        };
      }
      if (targets.length) {
        obj['targets'] = {
          queueEls: targets,
          groupElements: groupElements
        };
      }
      if (elementsInner.length) {
        obj['elementsInner'] = {
          queueEls: elementsInner,
          groupElements: groupElements
        };
      }
      if (targetsInner.length) {
        obj['targetsInner'] = {
          queueEls: targetsInner,
          groupElements: groupElements
        };
      }
      if (options.instant === true) {
        this.detail.queueOn = [obj];
      } else {
        this.detail.queueOn.unshift(obj);
      }
      // queue remove duplicate // @TODO
      // for (let i = 0; i < this.detail.queueOff.length - 1; i++) { // - 1 not the last one running!
      //   let check = this.detail.queueOff[i];
      //   if (self.detail.queueOn[0]['elements'].groupElements.single === check['elements'].groupElements.single) {
      //     let removed = self.detail.queueOff.splice(i, 1);
      //     console.log('on removeoff', check['elements'].groupElements.single, self.detail.queueOff, self.detail.queueOn);
      //     self.queueOffEnd(check);
      //     break;
      //   }
      // }
      // queue run
      for (let type in this.detail.queueOn[0]) {
        self.queueOn(type, 0, true);
      }
    } else if (options.toggle) {
      // off
      this.eventOff(element);
    }
  }

  /**
   * element off
   * @param {Node|HTMLElement} element To be deactivated
   */
  eventOff(element) {
    let self = this;
    let options = self.options;
    // toggle
    if (this.checkOff(element)) {
      // off
      this.specialOffDeactivate = false;
      this.specialOffAnimate = false;
      let groupElements = this.getElements(element);
      this.removeCurrent(groupElements.single);
      let targets = this.getTargets(element);
      let elementsInner = this.getInside(element, options.elementsInner);
      let targetsInner = this.getInside(targets, options.targetsInner);
      this.decorateDirection([...groupElements.all, ...targets, ...elementsInner, ...targetsInner]);
      // if queue too big // @TODO
      //this.queueOnTodo();
      //this.queueOffTodo();
      // queue obj
      let obj = {};
      if (groupElements.all.length) {
        obj['elements'] = {
          queueEls: groupElements.all,
          groupElements: groupElements
        };
      }
      if (targets.length) {
        obj['targets'] = {
          queueEls: targets,
          groupElements: groupElements
        };
      }
      if (elementsInner.length) {
        obj['elementsInner'] = {
          queueEls: elementsInner,
          groupElements: groupElements
        };
      }
      if (targetsInner.length) {
        obj['targetsInner'] = {
          queueEls: targetsInner,
          groupElements: groupElements
        };
      }
      if (options.instant === true) {
        this.detail.queueOff = [obj];
      } else {
        this.detail.queueOff.unshift(obj);
      }
      // // queue remove duplicate // @TODO
      // for (let i = 0; i < this.detail.queueOn.length - 1; i++) { // - 1 not the last one running!
      //   let check = this.detail.queueOn[i];
      //   if (self.detail.queueOff[0]['elements'].groupElements.single === check['elements'].groupElements.single) {
      //     let removed = self.detail.queueOn.splice(i, 1);
      //     console.log('off removeon', check['elements'].groupElements.single, self.detail.queueOn, self.detail.queueOff);
      //     self.queueOnEnd(check);
      //     break;
      //   }
      // }
      // queue run
      for (let type in this.detail.queueOff[0]) {
        self.queueOff(type, 0, true);
      }
    }
  }

  /**
   * queue on done
   * @param {Object} obj Queue object
   * @param {String} type Type of element
   */
  queueOnDone(obj, type) {
    if (obj[type]) {
      // done
      obj[type].done = true;
      this.queueOff(type, this.detail.queueOff.length - 1);
      // all done
      let allDone = true;
      for (let type in obj) {
        if (!obj[type].done) {
          allDone = false;
        }
      }
      if (allDone) {
        this.detail.queueOn.pop();
      }
    }
  }

  /**
   * queue off done
   * @param {Object} obj Queue object
   * @param {String} type Type of element
   */
  queueOffDone(obj, type) {
    if (obj[type]) {
      // done
      obj[type].done = true;
      this.queueOn(type, this.detail.queueOn.length - 1);
      // all done
      let allDone = true;
      for (let type in obj) {
        if (!obj[type].done) {
          allDone = false;
        }
      }
      if (allDone) {
        this.detail.queueOff.pop();
      }
    }
  }

  /**
   * if queue on too big, end what is still to do
   */
  queueOnTodo() {
    // end what is still to do
    if (this.detail.queueOn.length > this.options.max) {
      // remove queue and end
      let removed = this.detail.queueOn.shift();
      this.queueOnEnd(removed);
    }
  }

  /**
   * if queue off too big, end what is still to do
   */
  queueOffTodo() {
    // end what is still to do
    if (this.detail.queueOff.length > this.options.max) {
      // remove queue and end
      let removed = this.detail.queueOff.shift();
      this.queueOffEnd(removed);
    }
  }

  /**
   * queue on end
   * @param {Object} obj Queue object to end
   */
  queueOnEnd(obj) {
    let self = this;
    // end queue
    for (let type in obj) {
      if (!obj[type].done) {
        for (let el of obj[type].queueEls) {
          clearTimeout(el.dataset.xtDelayTimeout);
          clearTimeout(el.dataset.xtAnimTimeout);
          self.queueOnStart(obj, el, type, true);
          self.queueOnAnimDone(obj, el, type, true);
        }
      }
      self.queueOff(type, this.detail.queueOff.length - 1);
    }
  }

  /**
   * queue off end
   * @param {Object} obj Queue object to end
   */
  queueOffEnd(obj) {
    let self = this;
    // end queue
    for (let type in obj) {
      if (!obj[type].done) {
        for (let el of obj[type].queueEls) {
          clearTimeout(el.dataset.xtDelayTimeout);
          clearTimeout(el.dataset.xtAnimTimeout);
          self.queueOffStart(obj, el, type, true);
          self.queueOffAnimDone(obj, el, type, true);
        }
      }
      self.queueOn(type, this.detail.queueOn.length - 1);
    }
  }

  /**
   * queue on
   * @param {String} type Type of element
   * @param {Number} index Queue index
   * @param {Boolean} queueInitial If it's the initial queue
   */
  queueOn(type, index, queueInitial = false) {
    let obj = this.detail.queueOn[index];
    let objOther = this.detail.queueOff[this.detail.queueOff.length - 1];
    if (obj && obj[type] && !obj[type].done) {
      if (!objOther || !objOther[type] || objOther[type].done) {
        this.queueOnDelay(obj, type, queueInitial);
      }
    }
  }

  /**
   * queue off
   * @param {String} type Type of element
   * @param {Number} index Queue index
   * @param {Boolean} queueInitial If it's the initial queue
   */
  queueOff(type, index, queueInitial = false) {
    let obj = this.detail.queueOff[index];
    let objOther = this.detail.queueOn[this.detail.queueOn.length - 1];
    if (obj && obj[type] && !obj[type].done) {
      if (!objOther || !objOther[type] || objOther[type].done) {
        this.queueOffDelay(obj, type, queueInitial);
      }
    }
  }

  /**
   * queue on delay
   * @param {Object} obj Queue object
   * @param {String} type Type of elements
   * @param {Boolean} queueInitial If it's the initial queue
   */
  queueOnDelay(obj, type, queueInitial) {
    let self = this;
    let options = self.options;
    // delay
    let els = obj[type].queueEls;
    for (let el of els) {
      clearTimeout(el.dataset.xtDelayTimeout);
      clearTimeout(el.dataset.xtAnimTimeout);
      let delay;
      if (options.delayOn) {
        if (isNaN(options.delayOn)) {
          let count = parseInt(el.dataset.xtOnCount) || obj[type].queueEls.findIndex(x => x === el);
          let tot = parseInt(el.dataset.xtOnTot) || els.length;
          let fnc = new Function('current', 'total', options.delayOn);
          delay = fnc(count, tot - 1).toString();
        } else {
          delay = queueInitial ? 0 : options.delayOn;
        }
      }
      if (delay) {
        el.dataset.xtDelayTimeout = setTimeout(function () {
          self.queueOnStart(obj, el, type);
        }, delay).toString();
      } else {
        self.queueOnStart(obj, el, type);
      }
      // queue done
      if (options.instant === true) {
        if (el === els[0]) { // only if first element
          self.queueOnDone(obj, type);
        }
      }
    }
  }

  /**
   * queue off delay
   * @param {Object} obj Queue object
   * @param {String} type Type of elements
   * @param {Boolean} queueInitial If it's the initial queue
   */
  queueOffDelay(obj, type, queueInitial) {
    let self = this;
    let options = self.options;
    // delay
    let els = obj[type].queueEls;
    for (let el of els) {
      clearTimeout(el.dataset.xtDelayTimeout);
      clearTimeout(el.dataset.xtAnimTimeout);
      let delay;
      if (options.delayOn) {
        if (isNaN(options.delayOn)) {
          let count = parseInt(el.dataset.xtOffCount) || obj[type].queueEls.findIndex(x => x === el);
          let tot = parseInt(el.dataset.xtOffTot) || els.length;
          let fnc = new Function('current', 'total', options.delayOff);
          delay = fnc(count, tot - 1).toString();
        } else {
          delay = queueInitial ? 0 : options.delayOff;
        }
      }
      if (delay) {
        el.dataset.xtDelayTimeout = setTimeout(function () {
          self.queueOffStart(obj, el, type);
        }, delay).toString();
      } else {
        self.queueOffStart(obj, el, type);
      }
      // queue done
      if (options.instant === true) {
        if (el === els[0]) { // only if first element
          self.queueOffDone(obj, type);
        }
      }
    }
  }

  /**
   * queue on start
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement} el Elements to be deactivated
   * @param {String} type Type of elements
   * @param {Boolean} skipQueue If skip queue
   */
  queueOnStart(obj, el, type, skipQueue = false) {
    let self = this;
    let options = self.options;
    // activate
    el.classList.add(...options.classes);
    el.classList.add('in');
    el.classList.remove('out');
    // additionals
    if (type === 'elements') {
      // aria
      if (options.aria) {
        let ariaEls = self.getInside(el, options.ariaControls);
        let ariaEl = ariaEls.length ? ariaEls[0] : el;
        ariaEl.setAttribute('aria-selected', 'true');
      }
    }
    if (type === 'targets' || type === 'targetsInner') {
      // aria
      if (options.aria) {
        let role = el.getAttribute('role');
        if (role === 'tabpanel' || role === 'listbox' || role === 'dialog') {
          el.setAttribute('aria-expanded', 'true');
        }
      }
      // special
      this.specialBackdrop(el);
      this.specialCenter(el);
      this.specialMiddle(el);
      this.specialCollapseOn(el);
      this.specialCloseOn(el, obj[type].groupElements.single);
      // special one time
      if (!this.specialOnActivate) {
        this.specialOnActivate = true;
        this.specialClassHtmlOn();
        this.specialScrollbarOn();
        // focus
        if (options.aria) {
          if (options.scrollbar) {
            Xt.focusBlock = true;
            Xt.focusLimitOn(el);
            el.focus();
          }
        }
      }
    }
    // queue
    if (!skipQueue) {
      this.queueOnAnim(obj, el, type);
      // queue done
      let els = obj[type].queueEls;
      if (typeof options.instant === 'object' && options.instant[type]) {
        if (el === els[els.length - 1]) { // only if last element
          this.queueOnDone(obj, type);
        }
      }
    }
    // listener dispatch
    el.dispatchEvent(new CustomEvent('on', {detail: {skip: true, object: self}}));
  }

  /**
   * queue off start
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement} el Elements to be deactivated
   * @param {String} type Type of elements
   * @param {Boolean} skipQueue If skip queue
   */
  queueOffStart(obj, el, type, skipQueue = false) {
    let self = this;
    let options = self.options;
    // deactivate
    el.classList.remove(...options.classes);
    el.classList.remove('in');
    el.classList.add('out');
    // additionals
    if (type === 'targets' || type === 'targetsInner') {
      // special
      this.specialCollapseOff(el);
      this.specialCloseOff(el);
      // special one time
      if (!this.specialOffDeactivate) {
        this.specialOffDeactivate = true;
        this.specialClassHtmlOff();
      }
    }
    // queue
    if (!skipQueue) {
      this.queueOffAnim(obj, el, type);
      // queue done
      let els = obj[type].queueEls;
      if (typeof options.instant === 'object' && options.instant[type]) {
        if (el === els[els.length - 1]) { // only if last element
          this.queueOffDone(obj, type);
        }
      }
    }
    // listener dispatch
    el.dispatchEvent(new CustomEvent('off', {detail: {skip: true, object: self}}));
  }

  /**
   * queue on anim
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement} el Element to be animated
   * @param {String} type Type of element
   */
  queueOnAnim(obj, el, type) {
    let self = this;
    let options = self.options;
    // anim
    let duration = Xt.animDuration(el, options.durationOn);
    clearTimeout(el.dataset.xtAnimTimeout);
    if (!duration) {
      self.queueOnAnimDone(obj, el, type);
    } else {
      el.dataset.xtAnimTimeout = setTimeout(function () {
        self.queueOnAnimDone(obj, el, type);
      }, duration).toString();
    }
  }

  /**
   * queue off anim
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement} el Element to be animated
   * @param {String} type Type of element
   */
  queueOffAnim(obj, el, type) {
    let self = this;
    let options = self.options;
    // anim
    let duration = Xt.animDuration(el, options.durationOff);
    clearTimeout(el.dataset.xtAnimTimeout);
    if (!duration) {
      self.queueOffAnimDone(obj, el, type);
    } else {
      el.dataset.xtAnimTimeout = setTimeout(function () {
        self.queueOffAnimDone(obj, el, type);
      }, duration).toString();
    }
  }

  /**
   * queue on anim done
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement} el Element to be animated
   * @param {String} type Type of element
   * @param {Boolean} skipQueue If skip queue
   */
  queueOnAnimDone(obj, el, type, skipQueue = false) {
    let self = this;
    let options = self.options;
    // reset
    el.classList.remove('in');
    // collapse-width and collapse-height
    let style = getComputedStyle(el);
    if (style.getPropertyValue('--collapse-height')) {
      el.style.height = 'auto';
    }
    if (style.getPropertyValue('--collapse-width')) {
      el.style.width = 'auto';
    }
    // queue
    if (!skipQueue) {
      // queue done
      let els = obj[type].queueEls;
      if (!options.instant || !options.instant[type]) {
        if (el === els[els.length - 1]) { // only if last element
          this.queueOnDone(obj, type);
        }
      }
    }
  }

  /**
   * queue off anim done
   * @param {Object} obj Queue object
   * @param {Node|HTMLElement} el Element to be animated
   * @param {String} type Type of element
   * @param {Boolean} skipQueue If skip queue
   */
  queueOffAnimDone(obj, el, type, skipQueue = false) {
    let self = this;
    let options = self.options;
    // reset
    el.classList.remove('out');
    // additionals
    if (type === 'elements') {
      // aria
      if (options.aria) {
        let ariaEls = self.getInside(el, options.ariaControls);
        let ariaEl = ariaEls.length ? ariaEls[0] : el;
        ariaEl.setAttribute('aria-selected', 'false');
      }
    }
    if (type === 'targets') {
      // aria
      if (options.aria) {
        let role = el.getAttribute('role');
        if (role === 'tabpanel' || role === 'listbox' || role === 'dialog') {
          el.setAttribute('aria-expanded', 'false');
        }
      }
      // special one time
      if (!self.specialOffAnimate) {
        self.specialOffAnimate = true;
        self.specialScrollbarOff();
        // focus
        if (options.aria) {
          if (options.scrollbar) {
            Xt.focusBlock = false;
            Xt.focusLimitOff();
            Xt.focus.focus();
          }
        }
      }
    }
    // queue
    if (!skipQueue) {
      // queue done
      let els = obj[type].queueEls;
      if (!options.instant || !options.instant[type]) {
        if (el === els[els.length - 1]) { // only if last element
          this.queueOffDone(obj, type);
        }
      }
    }
  }

  //////////////////////
  // activation specials
  //////////////////////

  /**
   * add html class
   */
  specialClassHtmlOn() {
    let self = this;
    let options = self.options;
    //
    if (options.classHtml) {
      let container = document.documentElement;
      container.classList.add(...options.classHtml.split(' '));
    }
  }

  /**
   * remove html class
   */
  specialClassHtmlOff() {
    let self = this;
    let options = self.options;
    //
    if (options.classHtml) {
      let container = document.documentElement;
      container.classList.remove(...options.classHtml.split(' '));
    }
  }

  /**
   * backdrop append to element
   * @param {Node|HTMLElement} el Element
   */
  specialBackdrop(el) {
    let self = this;
    let options = self.options;
    //
    if (options.backdrop) {
      let elements;
      if (options.backdrop === 'object') {
        elements = Xt.arrSingle(this.object);
      } else if (options.backdrop === 'targets') {
        elements = Xt.arrSingle(el);
      } else {
        elements = el.querySelectorAll(options.backdrop);
        if (!elements.length) {
          elements = this.object.querySelectorAll(options.backdrop);
        }
      }
      for (let element of elements) {
        let backdrop = element.querySelectorAll('.xt-backdrop');
        if (!backdrop.length) {
          backdrop = Xt.createElement('<div class="xt-backdrop"></div>');
          element.append(backdrop);
        }
      }
    }
  }

  /**
   * center position on activation
   * @param {Node|HTMLElement} el Element
   */
  specialCenter(el) {
    let style = getComputedStyle(el);
    if (style.getPropertyValue('--center')) {
      let add = this.object.clientWidth;
      let remove = el.clientWidth;
      el.style.left = ((add - remove) / 2) + 'px';
    }
  }

  /**
   * middle position on activation
   * @param {Node|HTMLElement} el Element
   */
  specialMiddle(el) {
    let style = getComputedStyle(el);
    if (style.getPropertyValue('--middle')) {
      let add = this.object.clientHeight;
      let remove = el.clientHeight;
      el.style.top = ((add - remove) / 2) + 'px';
    }
  }

  /**
   * open collapse on activation
   * @param {Node|HTMLElement} el Element
   */
  specialCollapseOn(el) {
    let style = getComputedStyle(el);
    if (style.getPropertyValue('--collapse-height')) {
      el.classList.add('xt-calculating');
      el.style.height = 'auto';
      el.style.paddingTop = '';
      el.style.paddingBottom = '';
      let h = el.clientHeight + 'px';
      let pt = el.style.paddingTop;
      let pb = el.style.paddingBottom;
      Xt.requestAnimationFrame.call(window, function () {
        el.classList.remove('xt-calculating');
        el.style.height = '0';
        el.style.paddingTop = '0';
        el.style.paddingBottom = '0';
        Xt.requestAnimationFrame.call(window, function () {
          el.style.height = h;
          el.style.paddingTop = pt;
          el.style.paddingBottom = pb;
        });
      });
    }
    if (style.getPropertyValue('--collapse-width')) {
      el.classList.add('xt-calculating');
      el.style.width = 'auto';
      el.style.paddingLeft = '';
      el.style.paddingRight = '';
      let w = el.clientHeight + 'px';
      let pl = el.style.paddingLeft;
      let pr = el.style.paddingRight;
      Xt.requestAnimationFrame.call(window, function () {
        el.classList.remove('xt-calculating');
        el.style.width = '0';
        el.style.paddingLeft = '0';
        el.style.paddingRight = '0';
        Xt.requestAnimationFrame.call(window, function () {
          el.style.width = w;
          el.style.paddingLeft = pl;
          el.style.paddingRight = pr;
        });
      });
    }
  }

  /**
   * close collapse on deactivation
   * @param {Node|HTMLElement} el Element
   */
  specialCollapseOff(el) {
    let style = getComputedStyle(el);
    if (style.getPropertyValue('--collapse-height')) {
      let h = el.clientHeight + 'px';
      let pt = el.style.paddingTop;
      let pb = el.style.paddingBottom;
      Xt.requestAnimationFrame.call(window, function () {
        el.style.height = h;
        el.style.paddingTop = pt;
        el.style.paddingBottom = pb;
        Xt.requestAnimationFrame.call(window, function () {
          el.style.height = '0';
          el.style.paddingTop = '0';
          el.style.paddingBottom = '0';
        });
      });
    }
    if (style.getPropertyValue('--collapse-width')) {
      let w = el.clientWidth + 'px';
      let pl = el.style.paddingLeft;
      let pr = el.style.paddingRight;
      Xt.requestAnimationFrame.call(window, function () {
        el.style.width = w;
        el.style.paddingLeft = pl;
        el.style.paddingRight = pr;
        Xt.requestAnimationFrame.call(window, function () {
          el.style.width = '0';
          el.style.paddingLeft = '0';
          el.style.paddingRight = '0';
        });
      });
    }
  }

  /**
   * add close events on element
   * @param {Node|HTMLElement} el Element
   * @param {Node|HTMLElement} single Element to toggle
   */
  specialCloseOn(el, single) {
    let self = this;
    let options = self.options;
    // closeInside
    if (options.closeInside) {
      let closeElements = el.querySelectorAll(options.closeInside);
      Xt.requestAnimationFrame.call(window, function () {
        for (let closeElement of closeElements) {
          let specialCloseInsideHandler = Xt.dataStorage.put(el, 'specialCloseInsideHandler', self.specialCloseInsideHandler.bind(self).bind(self, closeElement, single));
          closeElement.removeEventListener('click', specialCloseInsideHandler);
          closeElement.addEventListener('click', specialCloseInsideHandler);
        }
      });
    }
    // closeOutside
    if (options.closeOutside) {
      let closeElements = document.querySelectorAll(options.closeOutside);
      Xt.requestAnimationFrame.call(window, function () {
        for (let closeElement of closeElements) {
          let specialCloseOutsideHandler = Xt.dataStorage.put(el, 'specialCloseOutsideHandler', self.specialCloseOutsideHandler.bind(self).bind(self, el, single));
          closeElement.removeEventListener('click', specialCloseOutsideHandler);
          closeElement.addEventListener('click', specialCloseOutsideHandler);
        }
      });
    }
  }

  /**
   * remove close events on element
   * @param {Node|HTMLElement} el Element
   */
  specialCloseOff(el) {
    let self = this;
    let options = self.options;
    // closeInside
    if (options.closeInside) {
      let closeElements = el.querySelectorAll(options.closeInside);
      for (let closeElement of closeElements) {
        let specialCloseInsideHandler = Xt.dataStorage.get(el, 'specialCloseInsideHandler');
        closeElement.removeEventListener('click', specialCloseInsideHandler);
      }
    }
    // closeOutside
    if (options.closeOutside) {
      let closeElements = document.querySelectorAll(options.closeOutside);
      for (let closeElement of closeElements) {
        let specialCloseOutsideHandler = Xt.dataStorage.get(el, 'specialCloseOutsideHandler');
        closeElement.removeEventListener('click', specialCloseOutsideHandler);
      }
    }
  }

  /**
   * element on handler
   * @param {Node|HTMLElement} checkEl
   * @param {Node|HTMLElement} single
   * @param {Event} e
   */
  specialCloseInsideHandler(checkEl, single, e) {
    if (Xt.checkInside(e, Xt.arrSingle(checkEl))) {
      this.eventOff(single);
    }
  }

  /**
   * element off handler
   * @param {Node|HTMLElement} checkEl
   * @param {Node|HTMLElement} single
   * @param {Event} e
   */
  specialCloseOutsideHandler(checkEl, single, e) {
    if (Xt.checkOutside(e, Xt.arrSingle(checkEl))) {
      this.eventOff(single);
    }
  }

  /**
   * scrollbar activation
   */
  specialScrollbarOn() {
    let self = this;
    let options = self.options;
    // scrollbar on
    if (options.scrollbar) {
      let elements;
      let width = Xt.scrollbarWidth();
      // check fixed
      elements = document.querySelectorAll('.xt-check-fixed > *');
      for (let element of elements) {
        let style = getComputedStyle(element);
        if (style.position === 'fixed') {
          element.classList.add('xt-fixed');
        } else {
          element.classList.remove('xt-fixed');
        }
      }
      // fixed
      elements = document.querySelectorAll('.xt-fixed');
      for (let element of elements) {
        element.style.paddingRight = '';
        if (self.normalizeWidth(element.clientWidth) === '') {
          let style = getComputedStyle(element);
          let padding = style.paddingRight;
          let str = 'calc(' + padding + ' + ' + width + 'px)';
          element.classList.add('no-transition');
          Xt.requestAnimationFrame.call(window, function () {
            element.style.paddingRight = str;
            Xt.requestAnimationFrame.call(window, function () {
              element.classList.remove('no-transition');
            });
          });
        }
      }
      // backdrop
      elements = document.querySelectorAll('.xt-backdrop');
      for (let element of elements) {
        element.style.right = width + 'px';
      }
      // scroll
      let container = document.documentElement;
      container.style.paddingRight = width + 'px';
      container.classList.add('xt-scrollbar');
    }
  }

  /**
   * scrollbar deactivation
   */
  specialScrollbarOff() {
    let self = this;
    let options = self.options;
    // scrollbar off
    if (options.scrollbar) {
      let elements;
      // fixed
      elements = document.querySelectorAll('.xt-fixed');
      for (let element of elements) {
        element.classList.add('no-transition');
        Xt.requestAnimationFrame.call(window, function () {
          element.style.paddingRight = '';
          Xt.requestAnimationFrame.call(window, function () {
            element.classList.remove('no-transition');
          });
        });
      }
      // backdrop
      elements = document.querySelectorAll('.xt-backdrop');
      for (let element of elements) {
        element.style.right = '';
      }
      // scroll
      let container = document.documentElement;
      container.style.paddingRight = '';
      container.classList.remove('xt-scrollbar');
    }
  }

  /**
   * if full width return '' else return value in px
   * @param {Number|String} width
   * @returns {String} Value in px
   */
  normalizeWidth(width) {
    width = parseFloat(width);
    if (width + Xt.scrollbarWidth() >= window.innerWidth) {
      width = '';
    } else {
      width += 'px';
    }
    return width;
  }

}

// export

window.XtCore = XtCore;
export {XtCore};

//////////////////////
// XtToggle
//////////////////////

class XtToggle extends XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions, 'data-xt-toggle');
  }

  /**
   * init aria
   */
  initAria() {
    super.initAria();
    let self = this;
    let options = self.options;
    // aria
    if (options.aria) {
      if (this.targets.length) {
        if (this.mode === 'multiple') {
          this.object.setAttribute('role', 'tablist');
          if (options.max > 1) {
            this.object.setAttribute('aria-multiselectable', 'true');
          }
          for (let el of this.elements) {
            let ariaEls = self.getInside(el, options.ariaControls);
            let ariaEl = ariaEls.length ? ariaEls[0] : el;
            ariaEl.setAttribute('role', 'tab');
          }
          for (let tr of this.targets) {
            tr.setAttribute('role', 'tabpanel');
          }
        }
      }
    }
  }

}

// default

XtToggle.defaults = {
  "elements": ":scope > a, :scope > button",
  "targets": ":scope > [class^=\"toggle-\"], :scope > [class*=\" toggle-\"]",
  "class": "active",
  "on": "click",
  "min": 0,
  "max": 1,
  "instant": {"elements": true},
  "aria": true
};

// export

window.XtToggle = XtToggle;
export {XtToggle};

//////////////////////
// XtDrop
//////////////////////

class XtDrop extends XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions, 'data-xt-drop');
  }

  /**
   * init aria
   */
  initAria() {
    super.initAria();
    let self = this;
    let options = self.options;
    // aria
    if (options.aria) {
      if (this.targets.length) {
        for (let el of this.elements) {
          let ariaEls = self.getInside(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          ariaEl.setAttribute('aria-haspopup', 'listbox');
        }
        for (let tr of this.targets) {
          tr.setAttribute('role', 'listbox');
        }
      }
    }
  }

}

// default

XtDrop.defaults = {
  "targets": ":scope > .drop",
  "elementsInner": ":scope > a, :scope > button",
  "class": "active",
  "on": "click",
  "min": 0,
  "max": 1,
  "instant": {"elementsInner": true},
  "closeOutside": "body",
  "aria": true,
  "ariaControls": ":scope > a, :scope > button"
};

// export

window.XtDrop = XtDrop;
export {XtDrop};

//////////////////////
// XtOverlay
//////////////////////

class XtOverlay extends XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions, 'data-xt-overlay');
  }

  /**
   * init aria
   */
  initAria() {
    super.initAria();
    let self = this;
    let options = self.options;
    // aria
    if (options.aria) {
      if (this.targets.length) {
        for (let el of this.elements) {
          let ariaEls = self.getInside(el, options.ariaControls);
          let ariaEl = ariaEls.length ? ariaEls[0] : el;
          ariaEl.setAttribute('aria-haspopup', 'dialog');
        }
        for (let tr of this.targets) {
          tr.setAttribute('role', 'dialog');
          tr.setAttribute('aria-modal', 'true');
        }
      }
    }
  }

}

// default

XtOverlay.defaults = {
  "elements": ":scope > a, :scope > button",
  "targets": ":scope > .overlay-outer",
  "class": "active",
  "on": "click",
  "min": 0,
  "max": 1,
  "instant": {"elements": true},
  "appendTo": "body",
  "backdrop": "targets",
  "classHtml": "xt-overlay",
  "closeInside": ".overlay-dismiss, :scope > .xt-backdrop, :scope .overlay-inner > .btn-close",
  "scrollbar": true,
  "aria": true
};

// export

window.XtOverlay = XtOverlay;
export {XtOverlay};

//////////////////////
// XtSlider
//////////////////////

class XtSlider extends XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions, 'data-xt-slider');
  }

  //////////////////////
  // init
  //////////////////////

  /**
   * init events
   */
  initEvents() {
    super.initEvents();
    let self = this;
    let options = self.options;
    if (options.drag) {
      for (let tr of this.targets) {
        // event on
        let dragStartHandler = Xt.dataStorage.put(tr, 'dragStartHandler', self.eventDragStartHandler.bind(self).bind(self, tr));
        let eventsOn = ['mousedown', 'touchstart'];
        for (let event of eventsOn) {
          tr.removeEventListener(event, dragStartHandler);
          tr.addEventListener(event, dragStartHandler);
        }
      }
    }
  }

  /**
   * element drag on handler
   * @param {Node|HTMLElement} target
   * @param {Event} e
   */
  eventDragStartHandler(target, e) {
    let self = this;
    let options = self.options;
    if (!e.button || e.button !== 2) { // not right click or it gets stuck
      //if (!this.checkAnim(Xt.arrSingle(target))) { // @TODO
      // save event
      this.detail.eInit = e;
      // logic
      let eventLimit = this.container.querySelectorAll('.event-limit');
      if (eventLimit.length) {
        if (Xt.checkOutside(e, eventLimit)) {
          this.eventDragStart(target, e);
        }
      } else {
        this.eventDragStart(target, e);
      }
      // auto
      if (options.autoPause) {
        this.autoPause();
      }
      // event off
      let dragEndHandler = Xt.dataStorage.put(window, 'dragEndHandler', self.eventDragEndHandler.bind(self).bind(self, target));
      let eventsOff = ['mouseup', 'touchend'];
      for (let event of eventsOff) {
        window.removeEventListener(event, dragEndHandler);
        window.addEventListener(event, dragEndHandler);
      }
      //}
    }
  }

  /**
   * element drag off handler
   * @param {Node|HTMLElement} target
   * @param {Event} e
   */
  eventDragEndHandler(target, e) {
    let self = this;
    let options = self.options;
    //if (!this.checkAnim(Xt.arrSingle(target))) { // @TODO
    // logic
    let eventLimit = this.container.querySelectorAll('.event-limit');
    if (eventLimit.length) {
      if (Xt.checkOutside(e, eventLimit)) {
        this.eventDragEnd(target, e);
      }
    } else {
      this.eventDragEnd(target, e);
    }
    // auto
    if (options.autoPause) {
      this.autoPause();
    }
    // event off
    let dragEndHandler = Xt.dataStorage.get(window, 'dragEndHandler');
    let eventsOff = ['mouseup', 'touchend'];
    for (let event of eventsOff) {
      window.removeEventListener(event, dragEndHandler);
    }
    //}
  }

  /**
   * element drag on
   * @param {Node|HTMLElement} target
   * @param {Event} e
   */
  eventDragStart(target, e) {
    let self = this;
    // save event
    this.detail.eCurrent = e;
    // event move
    let dragHandler = Xt.dataStorage.put(target, 'dragHandler', self.eventDragHandler.bind(self).bind(self, target));
    let events = ['mousemove', 'touchmove'];
    for (let event of events) {
      target.removeEventListener(event, dragHandler);
      target.addEventListener(event, dragHandler);
    }
    // listener dispatch
    target.dispatchEvent(new CustomEvent('dragStart.slider', {detail: {skip: true, object: self}}));
  }

  /**
   * element drag off
   * @param {Node|HTMLElement} target
   * @param {Event} e
   */
  eventDragEnd(target, e) {
    let self = this;
    // save event
    this.detail.eCurrent = e;
    // event move
    let dragHandler = Xt.dataStorage.get(target, 'dragHandler');
    let events = ['mousemove', 'touchmove'];
    for (let event of events) {
      target.removeEventListener(event, dragHandler);
    }
    // listener dispatch
    target.dispatchEvent(new CustomEvent('dragEnd.slider', {detail: {skip: true, object: self}}));
  }

  /**
   * element drag handler
   * @param {Node|HTMLElement} target
   * @param {Event} e
   */
  eventDragHandler(target, e) {
    let self = this;
    let options = self.options;
    // save event
    this.detail.eCurrent = e;
    // listener dispatch
    target.dispatchEvent(new CustomEvent('drag.slider', {detail: {skip: true, object: self}}));
    // auto
    if (options.autoPause) {
      this.autoPause();
    }
  }

}

// default

XtSlider.defaults = {
  "elements": ".slide-control",
  "targets": ":scope > .slides > .slide",
  "class": "active",
  "on": "click",
  "min": 1,
  "max": 1,
  "instant": {"elements": true},
  "drag": false,
  "dragThreshold": 100,
  "aria": true
};

// export

window.XtSlider = XtSlider;
export {XtSlider};

//////////////////////
// XtSticky
//////////////////////

class XtSticky extends XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions, 'data-xt-sticky');
  }

  //////////////////////
  // init
  //////////////////////

  /**
   * init elements, targets and currents
   */
  initScope() {
    super.initScope();
    // mode
    this.mode = 'unique';
    // container
    this.container = Xt.parents(this.object, '.xt-container');
    if (!this.container.length) {
      this.container = Xt.createElement('<div class="xt-container xt-check-fixed"></div>');
      this.object.before(this.container);
      this.container.append(this.object);
      this.container = Xt.parents(this.object, '.xt-container');
    }
    // targets
    this.targets = this.container[0].querySelectorAll('.xt-clone');
    if (!this.targets.length) {
      this.targets = this.object.cloneNode(true);
      this.targets.classList.add('xt-clone');
      for (let elId of this.targets.querySelectorAll('[id]')) {
        elId.setAttribute('id', elId.getAttribute('id') + '-clone');
      }
      for (let elName of this.targets.querySelectorAll('[name]')) {
        elName.setAttribute('name', elName.getAttribute('name') + '-clone');
      }
      this.container[0].append(this.targets);
    }
    this.targets = Xt.arrSingle(this.targets);
    // xt-fixed
    this.object.classList.add('xt-fixed');
    // hide
    if (this.options.hide === 'down') {
      this.object.classList.add('sticky-hide-down');
    } else {
      this.object.classList.remove('sticky-hide-down');
    }
    if (this.options.hide === 'up') {
      this.object.classList.add('sticky-hide-up');
    } else {
      this.object.classList.remove('sticky-hide-up');
    }
    // z-index
    this.unique = Xt.getUniqueNum();
    this.object.style.zIndex = '' + (100 - this.unique);
  }

  /**
   * init events
   */
  initEvents() {
    let self = this;
    let options = self.options;
    // event on
    let stickyHandler = Xt.dataStorage.put(window, 'stickyHandler', self.eventStickyHandler.bind(self));
    if (options.on) {
      let events = [...options.on.split(' ')];
      for (let event of events) {
        window.removeEventListener(event, stickyHandler);
        window.addEventListener(event, stickyHandler);
      }
    }
    window.removeEventListener('scroll.sticky', stickyHandler);
    window.addEventListener('scroll.sticky', stickyHandler);
    // listener dispatch initial
    window.dispatchEvent(new CustomEvent('scroll.sticky'));
    // autoClose
    let autoCloseEl = this.object;
    let autoCloseHandler = Xt.dataStorage.put(autoCloseEl, 'addHandler', this.autoCloseSticky);
    autoCloseEl.removeEventListener('hide.sticky', autoCloseHandler);
    autoCloseEl.addEventListener('hide.sticky', autoCloseHandler);
  }

  /**
   * element on handler
   * @param {Event} e
   */
  eventStickyHandler(e) {
    if (!e.detail || !e.detail.skip) {
      this.eventScroll(this.object);
    }
  }

  /**
   * autoclose xt components on hide.sticky
   * @param {Event} e
   */
  autoCloseSticky(e) {
    for (let drop of e.target.querySelectorAll('.drop-outer.active')) {
      drop.dispatchEvent(new CustomEvent('off'));
    }
  }

  //////////////////////
  // events
  //////////////////////

  /**
   * window scroll
   * @param {Node|HTMLElement} element To be activated or deactivated
   */
  eventScroll(element) {
    let self = this;
    let options = self.options;
    // vars
    let anim = true;
    let hide = false;
    let scrollInverse = false;
    let add = 0;
    let addHide = 0;
    let windowHeight = window.innerHeight;
    let el = self.object;
    let rectElTop = el.getBoundingClientRect().top;
    let heightEl = parseFloat(getComputedStyle(el).height);
    let heightTarget = parseFloat(getComputedStyle(self.targets[0]).height);
    let rectContainerTop = self.container[0].getBoundingClientRect().top;
    let scrollingElement = document.scrollingElement;
    let scrollHeight = scrollingElement.scrollHeight;
    let scrollTop = scrollingElement.scrollTop;
    let scrollTopOld = self.detail.scrollTopOld;
    // direction
    if (scrollTop < scrollTopOld) {
      el.classList.remove('sticky-down');
      el.classList.add('sticky-up');
      scrollInverse = true;
    } else {
      el.classList.add('sticky-down');
      el.classList.remove('sticky-up');
    }
    // hide
    if (options.hide === 'down') {
      if (!scrollInverse) {
        addHide = heightTarget;
      }
    }
    if (options.hide === 'up') {
      if (scrollInverse) {
        addHide = heightTarget;
      }
    }
    // scroll
    let top = self.eventScrollPos(options.limit['top'] || self.targets, scrollTop, rectContainerTop);
    let bottom = self.eventScrollPos(options.limit['bottom'], scrollTop, Infinity);
    if (options.position === 'top') {
      bottom -= heightTarget;
    }
    if (options.position === 'bottom') {
      top -= windowHeight - heightTarget;
      bottom = Math.abs(scrollHeight - windowHeight - bottom);
    }
    // contain and add
    let addTop = 0;
    let addBottom = 0;
    if (options.contain) {
      if (options.contain['top']) {
        let addTopObj = self.eventScrollHeight(options.contain['top'], scrollInverse);
        addTop = addTopObj.val;
        if (addTop !== null && addTop > rectContainerTop) {
          add = addTop;
          if (!addTopObj.foundHide) {
            anim = false;
          }
        } else {
          addTop = null;
        }
      }
      if (options.contain['bottom']) {
        addBottom = self.eventScrollPos(options.contain['bottom']);
        if (addBottom !== null && addBottom < heightEl + addTop) {
          add = addBottom - heightEl;
          anim = false;
        } else {
          addBottom = null;
        }
      }
    }
    // save real add for calculation
    el.dataset.xtAddSticky = add.toString();
    // activation
    let checkTop = scrollTop >= top - add + addHide;
    let checkBottom = scrollTop < bottom + add - addHide;
    if (checkTop && checkBottom) {
      // inside
      self.eventOn(element);
      // hide
      if (addHide) {
        hide = true;
      }
    } else {
      // outside
      self.eventOff(element);
    }
    // after active
    if (el.classList.contains('active')) {
      // hide
      if (hide) {
        add = -heightEl;
        if (!el.classList.contains('sticky-hide')) {
          el.classList.add('sticky-hide');
          // listener dispatch
          el.dispatchEvent(new CustomEvent('hide.sticky', {detail: {skip: true, object: self}}));
        }
      } else {
        if (el.classList.contains('sticky-hide')) {
          el.classList.remove('sticky-hide');
          // listener dispatch
          el.dispatchEvent(new CustomEvent('show.sticky', {detail: {skip: true, object: self}}));
        }
      }
    } else {
      // reset
      add = 0;
      anim = false;
    }
    // anim
    if (anim && scrollTopOld !== undefined) {
      if (!el.classList.contains('sticky-anim')) {
        el.classList.add('sticky-anim');
      }
    } else {
      if (el.classList.contains('sticky-anim')) {
        el.classList.remove('sticky-anim');
      }
    }
    // top and bottom
    if (!checkTop) {
      if (!el.classList.contains('sticky-top')) {
        el.classList.add('sticky-top');
      }
    } else {
      if (el.classList.contains('sticky-top')) {
        el.classList.remove('sticky-top');
      }
    }
    if (!checkBottom) {
      if (!el.classList.contains('sticky-bottom')) {
        el.classList.add('sticky-bottom');
      }
    } else {
      if (el.classList.contains('sticky-bottom')) {
        el.classList.remove('sticky-bottom');
      }
    }
    // set add
    if (add !== self.detail.addOld) {
      el.classList.add('no-transition');
      if (self.detail.addOld !== undefined) {
        el.style[options.position] = rectElTop + 'px';
      }
      Xt.cancelAnimationFrame.call(window, el.dataset.eventFrame);
      el.dataset.eventFrame = Xt.requestAnimationFrame.call(window, function () {
        el.classList.remove('no-transition');
        el.style[options.position] = add + 'px';
      });
    }
    // fix position fixed width 100% of parent
    let width = self.normalizeWidth(self.container[0].clientWidth);
    if (el.style.width !== width) {
      el.style.width = width;
    }
    // save for direction
    self.detail.addOld = add;
    self.detail.scrollTopOld = scrollTop;
  }

  /**
   * get position of option
   * @param {String|Number|Element} option
   * @param {Number} val Default value
   * @param {Number} scrollTop Window's scrollTop
   * @returns {Number} value Option's position (px)
   */
  eventScrollPos(option, scrollTop = 0, val = null) {
    if (!isNaN(parseFloat(option))) {
      val = option;
    } else {
      let elements = Array.isArray(option) || NodeList.prototype.isPrototypeOf(option) ? option : document.querySelectorAll(option);
      if (elements.length) {
        let found = false;
        val = 0;
        for (let el of elements) {
          let addSticky = parseFloat(el.dataset.xtAddSticky);
          if (addSticky) { // if sticky-hide get real add
            let style = getComputedStyle(el);
            if (style.display !== 'none') {
              val += addSticky;
              found = true;
            }
          } else {
            let rect = el.getBoundingClientRect();
            val += rect.top;
            found = true;
          }
        }
        if (found) {
          val += scrollTop;
        } else {
          val = null;
        }
      }
    }
    return val;
  }

  /**
   * get height of option
   * @param {String|Number|Element} option
   * @param {Boolean} scrollInverse
   * @param {Number} val Default value
   * @returns {Object} obj Option's height (px) and if found hide element
   */
  eventScrollHeight(option, scrollInverse, val = null) {
    let foundHide = false;
    if (!isNaN(parseFloat(option))) {
      val = option;
    } else {
      let elements = Array.isArray(option) || NodeList.prototype.isPrototypeOf(option) ? option : document.querySelectorAll(option);
      if (elements.length) {
        for (let el of elements) {
          if (el.classList.contains('sticky-hide-down') && el.classList.contains('active')) {
            if (scrollInverse) {
              val += el.clientHeight;
              foundHide = true;
            }
          } else if (el.classList.contains('sticky-hide-up') && el.classList.contains('active')) {
            if (!scrollInverse) {
              val += el.clientHeight;
              foundHide = true;
            }
          } else {
            val += el.clientHeight;
          }
        }
      }
    }
    return {val: val, foundHide: foundHide};
  }

}

// default

XtSticky.defaults = {
  "class": "active",
  "on": "scroll resize",
  "min": 0,
  "max": Infinity,
  "position": "top",
  "limit": {"bottom": Infinity},
  "contain": false,
  "hide": false,
  "aria": false
};

// export

window.XtSticky = XtSticky;
export {XtSticky};

//////////////////////
// XtFade
//////////////////////

class XtFade extends XtCore {

  /**
   * constructor
   * @param {Node|HTMLElement} object Base node
   * @param {Object} jsOptions User options
   * @constructor
   */
  constructor(object, jsOptions = {}) {
    super(object, jsOptions, 'data-xt-fade');
  }

  //////////////////////
  // init
  //////////////////////

  /**
   * init events
   */
  initEvents() {
    let self = this;
    let options = self.options;
    // event on
    let fadeHandler = Xt.dataStorage.put(window, 'fadeHandler', self.eventFadeHandler.bind(self));
    if (options.on) {
      let events = [...options.on.split(' ')];
      for (let event of events) {
        window.removeEventListener(event, fadeHandler);
        window.addEventListener(event, fadeHandler);
      }
    }
    window.removeEventListener('scroll.fade', fadeHandler);
    window.addEventListener('scroll.fade', fadeHandler);
    // listener dispatch initial
    window.dispatchEvent(new CustomEvent('scroll.fade'));
  }

  /**
   * element on handler
   * @param {Event} e
   */
  eventFadeHandler(e) {
    if (!e.detail || !e.detail.skip) {
      this.eventScroll(this.object);
    }
  }

  //////////////////////
  // events
  //////////////////////

  /**
   * window scroll
   */
  eventScroll() {
    let self = this;
    let options = self.options;
    // vars
    let current = 0;
    let currents = [];
    let scrollInverse = false;
    let windowHeight = window.innerHeight;
    let scrollingElement = document.scrollingElement;
    let scrollTop = scrollingElement.scrollTop;
    let scrollTopOld = self.detail.scrollTopOld;
    // direction
    if (scrollTop < scrollTopOld) {
      scrollInverse = true;
    }
    // core
    for (let el of self.elements) {
      if (el.offsetParent && !el.classList.contains('fade-block')) {
        // vars
        let rectElTop = el.offsetParent.getBoundingClientRect().top + el.offsetTop; // we use parents to not include transforms animations
        let heightEl = parseFloat(getComputedStyle(el).height);
        // scroll
        let changed = false;
        let top = rectElTop + scrollTop;
        let bottom = top + heightEl;
        let dist = windowHeight * options.distance;
        // activation
        let checkTop = scrollTop + windowHeight >= top + dist;
        let checkBottom = scrollTop < bottom - dist;
        if (checkTop && checkBottom) {
          // inside
          changed = self.checkOn(el);
          if (changed) {
            currents.push(el);
            Xt.cancelAnimationFrame.call(window, el.dataset.eventFrame);
            el.dataset.eventFrame = Xt.requestAnimationFrame.call(window, function () {
              current++;
              el.dataset.xtOnCount = current.toString();
              el.dataset.xtOnTot = currents.length.toString();
              self.eventOn(el);
            });
          }
        } else {
          // outside
          changed = self.checkOff(el);
          el.classList.add('fade-visible');
          if (changed) {
            el.classList.add('fade-scroll');
            currents.push(el);
            Xt.cancelAnimationFrame.call(window, el.dataset.eventFrame);
            el.dataset.eventFrame = Xt.requestAnimationFrame.call(window, function () {
              current++;
              el.dataset.xtOffCount = current.toString();
              el.dataset.xtOffTot = currents.length.toString();
              self.eventOff(el);
            });
          }
        }
        // direction
        if (changed) {
          if (scrollInverse) {
            el.classList.remove('fade-down');
            el.classList.add('fade-up');
          } else {
            el.classList.add('fade-down');
            el.classList.remove('fade-up');
          }
        }
      }
    }
    // save for direction
    self.detail.scrollTopOld = scrollTop;
  }

}

// default

XtFade.defaults = {
  "elements": ".fade",
  "class": "active",
  "on": "scroll resize",
  "min": 0,
  "max": Infinity,
  "instant": true,
  "distance": 0.2,
  "aria": false
};

// export

window.XtFade = XtFade;
export {XtFade};
