/* xtend (https://getxtend.com/)
@copyright (c) 2017 - 2018 Riccardo Caroli
@license MIT (https://github.com/minimit/xtend-library/blob/master/LICENSE) */

'use strict';

import Xt from '../xtend';
import Core from '../core';

//////////////////////
// Slider
//////////////////////

class Slider extends Core {

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
   * init elements, targets and currents
   */
  initScope() {
    let self = this;
    let options = self.options;
    // targets
    self.initScopeTargets();
    // dragger
    self.dragger = self.object.querySelectorAll(options.dragger)[0];
    // autoHeight
    if (options.autoHeight) {
      self.autoHeight = self.object.querySelectorAll(options.autoHeight)[0];
    }
    // automatic group
    let draggerWidthTemp;
    if (options.groupMq) {
      // width
      let draggerWidth = self.dragger ? self.dragger.offsetWidth : self.object.offsetWidth;
      // groupMq media
      let mqs = Object.entries(options.groupMq);
      if (mqs.length) {
        for (let [key, value] of mqs) {
          if (window.matchMedia(key).matches) {
            draggerWidthTemp = draggerWidth * value;
          }
        }
      }
      draggerWidth = draggerWidthTemp;
      // generate groups
      self.groupMq = [];
      self.groupMq.push([]);
      let currentCount = draggerWidth;
      for (let [i, target] of self.targets.entries()) {
        // calculate
        let targetWidth = target.offsetWidth;
        if (targetWidth === 0) { // when display none
          let container = target.parentNode;
          let clone = target.cloneNode(true);
          clone.classList.add('xt-calculating');
          container.append(clone);
          targetWidth = clone.offsetWidth;
          container.removeChild(clone);
        }
        currentCount -= targetWidth;
        // overflow
        let currentGroup = self.groupMq.length - 1;
        if (currentCount < 0 && self.groupMq[currentGroup].length) {
          self.groupMq.push([]);
          currentGroup = self.groupMq.length - 1;
          currentCount = draggerWidth;
          currentCount -= targetWidth;
        }
        // assign group
        self.groupMq[currentGroup].push(target);
        target.setAttribute('data-xt-group', self.namespace + '-' + currentGroup);
      }
    }
    // generate elements
    if (options.pagination) {
      let pags = self.object.querySelectorAll(options.pagination);
      // remove old
      self.pags = self.pags ? self.pags : [];
      for (let pags of self.pags) {
        for (let pag of pags) {
          let container = pag.parentNode;
          container.removeChild(pag);
        }
      }
      // add new
      self.pags = [];
      for (let pag of pags) {
        self.pags.push([]);
        // vars
        let currentPags = self.pags[self.pags.length - 1];
        let clone = pag.querySelectorAll('.xt-clone')[0];
        let container = clone.parentNode;
        let arr;
        if (options.groupMq) {
          arr = self.groupMq;
        } else {
          arr = self.targets;
        }
        // populate
        for (let [i, group] of arr.entries()) {
          currentPags[i] = clone.cloneNode(true);
          let item = currentPags[i];
          let html = item.innerHTML;
          html = html.replace(new RegExp('{{num}}', 'ig'), (i + 1).toString());
          html = html.replace(new RegExp('{{tot}}', 'ig'), arr.length.toString());
          item.innerHTML = html;
          item.classList.remove('xt-clone');
          if (options.groupMq) {
            item.setAttribute('data-xt-group', self.namespace + '-' + i);
          }
          container.insertBefore(item, clone);
        }
      }
    }
    // only one call per group
    for (let slide of self.targets) {
      delete slide.dataset.xtinitDraggerDone;
      delete slide.dataset.xtSlideOnDone;
    }
    // initDragger
    self.initDragger();
    // elements
    self.initScopeElements();
  }

  /**
   * init events
   */
  initEvents() {
    super.initEvents();
    let self = this;
    let options = self.options;
    let dragger = self.dragger;
    // targets
    for (let slide of self.targets) {
      // disable links
      slide.classList.add('links--none');
      // slide on
      let slideOnHandler = Xt.dataStorage.put(slide, 'slideOnHandler' + self.namespace,
        self.eventSlideOnHandler.bind(self).bind(self, dragger, slide));
      slide.removeEventListener('on.xt', slideOnHandler);
      slide.addEventListener('on.xt', slideOnHandler, true); // @FIX event.xt: useCapture for custom events order on re-init(
      // slide off
      let slideOffHandler = Xt.dataStorage.put(slide, 'slideOffHandler' + self.namespace,
        self.eventSlideOffHandler.bind(self).bind(self, dragger, slide));
      slide.removeEventListener('off.xt', slideOffHandler);
      slide.addEventListener('off.xt', slideOffHandler, true); // @FIX event.xt: useCapture for custom events order on re-init(
    }
    // dragger
    if (options.drag) {
      // drag
      let dragstartHandler = Xt.dataStorage.put(dragger, 'dragstartHandler' + self.namespace,
        self.eventDragstartHandler.bind(self).bind(self, dragger));
      let events = ['mousedown', 'touchstart'];
      for (let event of events) {
        dragger.removeEventListener(event, dragstartHandler);
        dragger.addEventListener(event, dragstartHandler);
      }
      // grab
      if (!self.detail.disabled) {
        dragger.classList.add('grab');
      } else {
        dragger.classList.remove('grab');
      }
    }
  }

  /**
   * init dragger
   */
  initDragger() {
    let self = this;
    // init slides
    for (let targets of self.targets) {
      self.initDraggerSlide(targets);
    }
  }

  /**
   * init dragger slide
   */
  initDraggerSlide(slide) {
    let self = this;
    let options = self.options;
    // save vars
    if (!slide.dataset.xtinitDraggerDone
      && (slide.offsetWidth || slide.offsetHeight || slide.getClientRects().length)) { // :visible
      // vars
      let targets = self.getTargets(slide);
      let slideLeft = slide.offsetLeft;
      let slideWidth = slide.offsetWidth;
      let slideHeight = slide.offsetHeight;
      // group
      let group = slide.getAttribute('data-xt-group');
      if (group) {
        if (!slide.dataset.xtinitDraggerDone) {
          // vars
          slideLeft = Infinity;
          slideWidth = 0;
          slideHeight = 0;
          for (let target of targets) {
            slideLeft = target.offsetLeft < slideLeft ? slide.offsetLeft : slideLeft;
            slideWidth += target.offsetWidth;
            let h = target.offsetHeight;
            slideHeight = h > slideHeight ? h : slideHeight;
          }
          for (let target of targets) {
            target.dataset.xtinitDraggerDone = 'true';
            target.dataset.groupHeight = slideHeight.toString();
          }
        }
      } else {
        slide.dataset.xtinitDraggerDone = 'true';
      }
      // pos with alignment
      let pos;
      if (options.align === 'center') {
        pos = self.dragger.offsetWidth / 2 - slideLeft - slideWidth / 2;
      } else if (options.align === 'left') {
        pos = -slideLeft;
        pos = pos > 0 ? 0 : pos; // @FIX initial value sometimes is wrong
      } else if (options.align === 'right') {
        pos = -slideLeft + self.dragger.offsetWidth - slideWidth;
      }
      // pos with contain
      if (options.contain) {
        let min = 0;
        let slideLast = self.targets[self.targets.length - 1];
        let slideLastLeft = slideLast.offsetLeft;
        let slideLastWidth = slideLast.offsetWidth;
        let max = -slideLastLeft + self.dragger.offsetWidth - slideLastWidth;
        pos = pos > min ? min : pos;
        pos = pos < max ? max : pos;
      }
      // save pos
      if (group) {
        for (let target of targets) {
          target.dataset.groupPos = pos.toString();
        }
      } else {
        slide.dataset.groupPos = pos.toString();
      }
    }
  }

  //////////////////////
  // handler
  //////////////////////

  /**
   * slide on handler
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Node|HTMLElement|EventTarget|Window} slide
   * @param {Event} e
   */
  eventSlideOnHandler(dragger, slide, e) {
    let self = this;
    // handler
    if (e.target === slide) { // @FIX event.xt: handler triggered by child xt events
      self.eventSlideOn(dragger, e);
    }
  }

  /**
   * slide off handler
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Node|HTMLElement|EventTarget|Window} slide
   * @param {Event} e
   */
  eventSlideOffHandler(dragger, slide, e) {
    let self = this;
    // handler
    if (e.target === slide) { // @FIX event.xt: handler triggered by child xt events
      self.eventSlideOff(dragger, e);
    }
  }

  /**
   * element drag on handler
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventDragstartHandler(dragger, e) {
    let self = this;
    // handler
    if (!e.button || e.button !== 2) { // not right click or it gets stuck
      if (self.detail.initial || !self.checkAnim(Xt.arrSingle(dragger))) {
        // save event
        self.detail.eInit = e;
        // logic
        let eventLimit = self.container.querySelectorAll('.event-limit');
        if (eventLimit.length) {
          if (!Xt.checkNested(e.target, eventLimit)) {
            self.eventDragstart(dragger, e);
          }
        } else {
          self.eventDragstart(dragger, e);
        }
        // auto
        self.eventAutoPause();
        // event off
        let dragendHandler = Xt.dataStorage.put(dragger, 'dragendHandler' + self.namespace,
          self.eventDragendHandler.bind(self).bind(self, dragger));
        let events = ['mouseup', 'touchend'];
        for (let event of events) {
          removeEventListener(event, dragendHandler);
          addEventListener(event, dragendHandler);
        }
      }
    }
  }

  /**
   * element drag off handler
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventDragendHandler(dragger, e) {
    let self = this;
    // logic
    let eventLimit = self.container.querySelectorAll('.event-limit');
    if (eventLimit.length) {
      if (!Xt.checkNested(e.target, eventLimit)) {
        self.eventDragend(dragger, e);
      }
    } else {
      self.eventDragend(dragger, e);
    }
    // auto
    self.eventAutoStart();
    // event off
    let dragendHandler = Xt.dataStorage.get(dragger, 'dragendHandler' + self.namespace);
    let events = ['mouseup', 'touchend'];
    for (let event of events) {
      removeEventListener(event, dragendHandler);
    }
  }

  /**
   * element drag on
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventDragstart(dragger, e) {
    let self = this;
    // save event
    self.detail.eCurrent = e;
    // eDetail
    self.eDetailSet(e);
    // event move
    let dragHandler = Xt.dataStorage.put(dragger, 'dragHandler' + self.namespace,
      self.eventDragHandler.bind(self).bind(self, dragger));
    let events = ['mousemove', 'touchmove'];
    for (let event of events) {
      dragger.removeEventListener(event, dragHandler);
      dragger.addEventListener(event, dragHandler);
    }
    // logic
    self.logicDragstart(dragger, e);
  }

  /**
   * element drag off
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventDragend(dragger, e) {
    let self = this;
    // save event
    self.detail.eCurrent = e;
    // eDetail
    self.eDetailSet(e);
    // event move
    let dragHandler = Xt.dataStorage.get(dragger, 'dragHandler' + self.namespace);
    let events = ['mousemove', 'touchmove'];
    for (let event of events) {
      dragger.removeEventListener(event, dragHandler);
    }
    // logic
    self.logicDragend(dragger, e);
  }

  /**
   * element drag handler
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventDragHandler(dragger, e) {
    let self = this;
    // disable links
    dragger.classList.add('links--none');
    dragger.classList.add('jumps--none');
    // save event
    self.detail.eCurrent = e;
    // eDetail
    self.eDetailSet(e);
    // logic
    self.logicDrag(dragger, e);
  }

  //////////////////////
  // event
  //////////////////////

  /**
   * resize
   */
  eventCheck() {
    let self = this;
    super.eventCheck();
    // reinit
    if (!self.detail.initial) {
      self.detail.initial = true;
      self.init();
    }
  }

  /**
   * slide on
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventSlideOn(dragger, e) {
    let self = this;
    let slide = e.target;
    // disabled
    if (self.detail.disabled && !self.detail.initial) {
      return false;
    }
    // only one call per group
    if (slide.dataset.xtSlideOnDone) {
      return false;
    }
    let targets = self.getTargets(slide);
    for (let target of targets) {
      target.dataset.xtSlideOnDone = 'true';
    }
    // reinit if needed
    self.initDraggerSlide(slide);
    // autoHeight
    if (self.autoHeight) {
      let slideHeight = slide.offsetHeight;
      if (slide.getAttribute('data-xt-group')) {
        slideHeight = parseFloat(slide.dataset.groupHeight);
      }
      self.autoHeight.style.height = slideHeight + 'px';
    }
    // val
    self.detail.xPosOld = self.detail.xPos;
    self.detail.xPos = self.detail.xPosCurrent = self.detail.xPosReal = parseFloat(slide.dataset.groupPos);
    // prevent alignment animation
    self.dragger.classList.remove('trans-anim-none');
    // initial or resizing
    if (self.detail.initial) {
      // prevent alignment animation
      self.dragger.classList.add('trans-anim-none');
      requestAnimationFrame(function () {
        self.dragger.classList.remove('trans-anim-none');
      });
    }
    // drag position
    dragger.style.transform = 'translateX(' + self.detail.xPos + 'px)';
    // disable drag
    dragger.classList.add('pointer-events--none');
    Xt.animTimeout(dragger, function () {
      dragger.classList.remove('pointer-events--none');
    });
    // disable links
    slide.classList.remove('links--none');
    dragger.classList.remove('jumps--none');
  }

  /**
   * slide off
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  eventSlideOff(dragger, e) {
    let self = this;
    let slide = e.target;
    // disabled
    if (self.detail.disabled && !self.detail.initial) {
      return false;
    }
    // disable links
    slide.classList.add('links--none');
    // only one call per group
    let group = slide.getAttribute('data-xt-group');
    if (group) {
      delete slide.dataset.xtSlideOnDone;
    }
  }

  //////////////////////
  // logic
  //////////////////////

  /**
   * element drag on logic
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  logicDragstart(dragger, e) {
    let self = this;
    // disabled
    if (self.detail.disabled && !self.detail.initial) {
      return false;
    }
    // prevent dragging animation
    self.dragger.classList.add('trans-anim-none');
    // listener dispatch
    dragger.dispatchEvent(new CustomEvent('dragstart.xt.slider', {detail: self.eDetail}));
  }

  /**
   * element drag off logic
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  logicDragend(dragger, e) {
    let self = this;
    // disabled
    if (self.detail.disabled && !self.detail.initial) {
      return false;
    }
    // disable drag
    requestAnimationFrame(function () { // needed for touch links triggering before logicDragend
      dragger.classList.add('pointer-events--none');
    });
    // disable links
    requestAnimationFrame(function () {
      dragger.classList.remove('links--none');
      dragger.classList.remove('jumps--none');
    });
    // logic
    self.logicDragfriction(dragger, e);
  }

  /**
   * element drag friction logic
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  logicDragfriction(dragger, e) {
    let self = this;
    let options = self.options;
    // friction
    if (Math.abs(self.detail.xVelocity) > options.drag.limit) {
      // drag
      self.logicDrag(dragger, e, true);
      // loop
      requestAnimationFrame(function () {
        self.logicDragfriction(dragger, e);
      });
    } else {
      // dragend
      requestAnimationFrame(self.logicDragfrictionend.bind(self).bind(e, dragger));
    }
  }

  /**
   * element drag logic
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   * @param {Boolean} friction
   */
  logicDrag(dragger, e, friction = false) {
    let self = this;
    let options = self.options;
    let xPosCurrent = self.detail.xPosCurrent || 0;
    // disabled
    if (self.detail.disabled && !self.detail.initial) {
      return false;
    }
    // calculate
    let pos = self.detail.xPosReal;
    if (friction) {
      // momentum
      if (self.detail.xDate) {
        let dateDiff = new Date() - self.detail.xDate;
        self.detail.xDate = null;
        if (dateDiff < 150) {
          let dateFactor = dateDiff / 10;
          self.detail.xVelocity *= options.drag.friction / dateFactor;
        } else {
          self.detail.xVelocity = 0;
        }
      } else {
        self.detail.xVelocity *= options.drag.friction;
      }
      // on friction
      pos = pos + self.detail.xVelocity;
      self.detail.xStart = self.detail.eInit.clientX || self.detail.eInit.touches[0].clientX;
      self.detail.xCurrent = pos + self.detail.xStart - xPosCurrent;
    } else {
      // momentum
      self.detail.xDate = new Date();
      // on normal drag
      let xPosOld = pos || 0;
      self.detail.xStart = self.detail.eInit.clientX || self.detail.eInit.touches[0].clientX;
      self.detail.xCurrent = self.detail.eCurrent.clientX || self.detail.eCurrent.touches[0].clientX;
      pos = xPosCurrent + (self.detail.xCurrent - self.detail.xStart) * options.drag.factor;
      // velocity
      self.detail.xVelocity = pos - xPosOld;
    }
    // val
    self.detail.xPosReal = pos;
    // overflow
    let first = self.targets[0];
    let last = self.targets[self.targets.length - 1];
    let min = parseFloat(first.dataset.groupPos);
    let max = parseFloat(last.dataset.groupPos);
    if (friction) {
      if (pos > min) {
        self.detail.xVelocity = Math.nthroot(self.detail.xVelocity, options.drag.overflow);
      } else if (pos < max) {
        self.detail.xVelocity = Math.nthroot(self.detail.xVelocity, options.drag.overflow);
      }
    } else {
      if (pos > min) {
        self.detail.xVelocity = 0;
        let overflow = pos - min;
        pos = min + Math.nthroot(overflow, options.drag.overflow);
      } else if (pos < max) {
        self.detail.xVelocity = 0;
        let overflow = pos - max;
        pos = max - Math.nthroot(-overflow, options.drag.overflow);
      }
    }
    // val
    self.detail.xPosOld = self.detail.xPos;
    self.detail.xPos = pos;
    // drag position
    dragger.style.transform = 'translateX(' + self.detail.xPos + 'px)';
    // listener dispatch
    dragger.dispatchEvent(new CustomEvent('drag.xt.slider', {detail: self.eDetail}));
  }

  /**
   * element drag friction off logic
   * @param {Node|HTMLElement|EventTarget|Window} dragger
   * @param {Event} e
   */
  logicDragfrictionend(dragger, e) {
    let self = this;
    let options = self.options;
    let xPosCurrent = self.detail.xPosCurrent || 0;
    // only one call per group
    let currents = self.getCurrents();
    for (let current of currents) {
      let group = current.getAttribute('data-xt-group');
      if (group) {
        for (let target of self.getTargets(current)) {
          delete target.dataset.xtSlideOnDone;
        }
      }
    }
    // activate or reset
    let xPos = self.detail.xPosReal;
    let xDist = xPos - xPosCurrent;
    if (Math.abs(xDist) > options.drag.threshold) {
      // get nearest
      let found = self.currentIndex;
      if (options.groupMq) {
        for (let [i, group] of self.groupMq.entries()) {
          for (let slideCheck of group) {
            let check = xPos - dragger.offsetWidth / 2 + slideCheck.offsetLeft;
            if (check < 0
              && (slideCheck.offsetWidth || slideCheck.offsetHeight || slideCheck.getClientRects().length)) { // :visible
              found = i;
            }
          }
        }
      } else {
        for (let [i, slideCheck] of self.targets.entries()) {
          let check = xPos - dragger.offsetWidth / 2 + slideCheck.offsetLeft;
          if (check < 0
            && (slideCheck.offsetWidth || slideCheck.offsetHeight || slideCheck.getClientRects().length)) { // :visible
            found = i;
          }
        }
      }
      // goTo with force
      requestAnimationFrame(function () { // @FIX jump event order (slider drag single)
        if (found === self.currentIndex) {
          // change at least one
          if (Math.sign(xDist) < 0) {
            self.goToNext(1, true);
          } else {
            self.goToPrev(1, true);
          }
        } else {
          // goToIndex
          self.goToIndex(found, true);
        }
      });
    } else {
      // val
      self.detail.xPosOld = self.detail.xPos;
      self.detail.xPos = self.detail.xPosCurrent;
      // drag position
      dragger.style.transform = 'translateX(' + self.detail.xPosCurrent + 'px)';
      // disable drag
      Xt.animTimeout(dragger, function () {
        dragger.classList.remove('pointer-events--none');
      });
      // prevent dragging animation
      self.dragger.classList.remove('trans-anim-none');
      // listener dispatch
      dragger.dispatchEvent(new CustomEvent('dragend.xt.slider', {detail: self.eDetail}));
    }
  }

}

//////////////////////
// defaults
//////////////////////

Slider.componentName = 'slider';
Slider.defaults = {
  "elements": "[data-xt-pag]",
  "targets": ".slide",
  "class": "active",
  "on": "click",
  "toggle": false,
  "min": 1,
  "max": 1,
  "instant": true,
  "jump": true,
  "navigation": "[data-xt-nav]",
  "keyboard": {
    "selector": ".slides"
  },
  "aria": {
    "labelledby": false
  },
  // slider only
  "autoHeight": ".slides",
  "groupMq": {"all": 0.8},
  "align": "center",
  "contain": false,
  "pagination": ".slider_pagination",
  "dragger": ".slides_inner",
  "drag": {
    "threshold": 100,
    "factor": 1,
    "friction": 0.9,
    "limit": 2.5,
    "overflow": 1.2
  }
};

//////////////////////
// export
//////////////////////

export default Slider;