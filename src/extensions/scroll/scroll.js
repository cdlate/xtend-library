import { Xt } from 'xtend-library'
import 'xtend-library/src/core/toggle/toggle.js'
import JSON5 from 'json5'

/**
 * Scroll
 */
class Scroll extends Xt.Toggle {
  /**
   * constructor
   * @param {Node|HTMLElement|EventTarget|Window} object Base node
   * @param {Object} optionsCustom User options
   * @constructor
   */
  constructor(object, optionsCustom = {}) {
    super(object, optionsCustom)
  }

  //
  // init
  //

  /**
   * init elements, targets and currents
   */
  initScope() {
    super.initScope()
    const self = this
    const options = self.options
    // loop
    self.targets = []
    for (const el of self.elements) {
      if (!options.sticky) {
        // not sticky
        self.targets.push(el)
      } else {
        // sticky container
        let container = el.closest('.xt-container')
        if (!container) {
          container = Xt.createElement('<div class="xt-container xt-fixed-check"></div>')
          el.before(container)
          // @FIX mount inside clone components (sticky, scroll etc..)
          container.classList.add('xt-ignore', 'xt-ignore-once')
          container.append(el)
        }
        // sticky clone
        let target = container.querySelector('.xt-clone')
        if (!target) {
          target = el.cloneNode(true)
          target.classList.add('xt-clone', 'xt-ignore')
          target.classList.remove('xt-ignore-once') // @FIX ignore once for mount when moving
          for (const elId of target.querySelectorAll('[id]')) {
            elId.setAttribute('id', elId.getAttribute('id') + '-clone')
          }
          for (const elName of target.querySelectorAll('[name]')) {
            elName.setAttribute('name', elName.getAttribute('name') + '-clone')
          }
          container.append(target)
        }
        self.targets.push(target)
        // sticky
        el.classList.add('xt-fixed', 'xt-sticky')
        if (options.sticky === 'absolute') {
          el.classList.add('xt-sticky-absolute')
        } else if (options.sticky === 'fixed') {
          el.classList.add('xt-sticky-fixed')
        } else if (options.sticky === 'fixed-always') {
          el.classList.add('xt-sticky-fixed-always')
        }
        if (target) {
          target.classList.add('xt-fixed', 'xt-sticky')
          if (options.sticky === 'absolute') {
            target.classList.add('xt-sticky-absolute')
          } else if (options.sticky === 'fixed') {
            target.classList.add('xt-sticky-fixed')
          } else if (options.sticky === 'fixed-always') {
            target.classList.add('xt-sticky-fixed-always')
          }
        }
      }
      // indicator
      if (el.classList.contains('scroll-indicator')) {
        const indicatorTrigger = Xt.createElement('<div class="xt-ignore xt-indicator xt-indicator-trigger"></div>')
        document.body.append(indicatorTrigger)
        const indicatorStart = Xt.createElement('<div class="xt-ignore xt-indicator xt-indicator-start"></div>')
        document.body.append(indicatorStart)
        const indicatorEnd = Xt.createElement('<div class="xt-ignore xt-indicator xt-indicator-end"></div>')
        document.body.append(indicatorEnd)
        const indicatorStartReal = Xt.createElement('<div class="xt-ignore xt-indicator xt-indicator-start-real"></div>')
        document.body.append(indicatorStartReal)
        const indicatorEndReal = Xt.createElement('<div class="xt-ignore xt-indicator xt-indicator-end-real"></div>')
        document.body.append(indicatorEndReal)
      }
    }
  }

  /**
   * init events
   */
  initEvents() {
    super.initEvents()
    const self = this
    const options = self.options
    // if browser doesn't support scroll
    if (!Xt.supportScroll) {
      // show all and block
      for (const el of self.elements) {
        self.eventOn(el, true)
        el.classList.add('xt-block')
      }
      // no events
      return
    }
    // event scroll and resize
    const scrollHandler = Xt.dataStorage.put(window, options.on + '/' + self.namespace, self.eventScrollHandler.bind(self).bind(self, false))
    const events = [...'scroll resize'.split(' ')]
    for (const event of events) {
      addEventListener(event, scrollHandler, { passive: true })
    }
    addEventListener('scroll.trigger.xt', scrollHandler)
    requestAnimationFrame(() => {
      self.eventScrollHandler()
    })
  }

  //
  // handler
  //

  /**
   * element on handler
   * @param {Event} e
   */
  eventScrollHandler(e = null) {
    const self = this
    Xt.eventDelay(
      e,
      self.object,
      () => {
        // handler
        self.eventScroll()
      },
      self.componentNamespace + 'Scroll'
    )
  }

  //
  // event
  //

  /**
   * window scroll
   */
  eventScroll() {
    const self = this
    const options = self.options
    // disabled
    if (self.disabled) {
      return
    }
    // vars
    let currentOn = 0
    let currentOff = 0
    const currentsOn = []
    const currentsOff = []
    const scrollingElement = document.scrollingElement
    const scrollHeight = scrollingElement.scrollHeight
    const scrollTop = scrollingElement.scrollTop
    const windowHeight = Xt.windowHeight
    const fallback = Xt.windowPercent(options.fallback)
    self.detail.distance = Xt.windowPercent(options.distance)
    self.detail.trigger = Xt.windowPercent(options.trigger)
    const max = self.detail.trigger + scrollHeight - window.innerHeight
    // loop
    for (const el of self.elements) {
      const tr = self.getTargets(el)[0]
      if (!el.classList.contains('xt-block') && Xt.visible(el) && tr.offsetParent) {
        // filter out document.documentElement
        // vars
        const elTop = tr.offsetParent.getBoundingClientRect().top + tr.offsetTop + scrollTop // we use parents to not include transforms animations
        const elHeight = tr.offsetHeight
        // size fix when position fixed
        if (options.sticky) {
          el.style.width = tr.offsetWidth + 'px'
        }
        // position
        self.detail.start = self.detail.startReal = elTop - windowHeight + Xt.windowPercent(options.start) + self.detail.distance
        self.detail.start = self.detail.start < self.detail.trigger ? self.detail.trigger : self.detail.start // limit fixes activation on page top
        self.detail.start = self.detail.start > max ? max - fallback : self.detail.start // limit fixes activation on page bottom
        self.detail.end = self.detail.endReal = options.end
          ? self.detail.start + Xt.windowPercent(options.end) + elHeight - self.detail.distance
          : elTop + elHeight + self.detail.trigger - self.detail.distance
        self.detail.end = self.detail.end < self.detail.start + fallback ? self.detail.start + fallback : self.detail.end // limit fixes deactivation on page top
        // ratio
        const position = scrollTop + self.detail.trigger - self.detail.start
        Xt.dataStorage.set(el, self.componentNamespace + 'Position', position)
        const total = self.detail.end - self.detail.start
        self.detail.ratio = Math.max(0, position) / total
        self.detail.ratio = self.detail.ratio > 0 ? self.detail.ratio : 0
        self.detail.ratio = self.detail.ratio < 1 ? self.detail.ratio : 1
        self.detail.ratioInverse = 1 - self.detail.ratio
        self.detail.ratioDouble = 1 - Math.abs((self.detail.ratio - 0.5) * 2)
        // @FIX fixes on page top || self.detail.start > self.detail.end
        if ((position >= 0 && position <= total) || self.detail.start > self.detail.end) {
          // inside
          const changed = self.checkOn(el)
          if (changed) {
            currentsOn.push(el)
            // activation
            Xt.dataStorage.set(el, self.componentNamespace + 'OnCount', currentOn)
            Xt.dataStorage.set(el, self.componentNamespace + 'OnTot', currentsOn.length)
            currentOn++
          }
        } else {
          // outside
          const changed = self.checkOff(el)
          el.classList.add('scroll-outside')
          if (changed) {
            el.classList.add('scroll-done')
            currentsOff.push(el)
            // deactivate
            Xt.dataStorage.set(el, self.componentNamespace + 'OffCount', currentOff)
            Xt.dataStorage.set(el, self.componentNamespace + 'OffTot', currentsOff.length)
            currentOff++
          }
        }
        // indicator
        if (el.classList.contains('scroll-indicator')) {
          const triggerEl = document.body.querySelector('.xt-indicator-trigger')
          triggerEl.style.top = self.detail.trigger + 'px'
          const startEl = document.body.querySelector('.xt-indicator-start')
          startEl.style.top = self.detail.start - scrollTop + 'px'
          const endEl = document.body.querySelector('.xt-indicator-end')
          endEl.style.top = self.detail.end - scrollTop + 'px'
          const startRealEl = document.body.querySelector('.xt-indicator-start-real')
          startRealEl.style.top = self.detail.startReal - scrollTop + 'px'
          const endRealEl = document.body.querySelector('.xt-indicator-end-real')
          endRealEl.style.top = self.detail.endReal - scrollTop + 'px'
        }
        cancelAnimationFrame(Xt.dataStorage.get(el, self.componentNamespace + 'ScrollDispatchFrame'))
        Xt.dataStorage.set(
          el,
          self.componentNamespace + 'ScrollDispatchFrame',
          requestAnimationFrame(() => {
            // disabled
            if (self.disabled) {
              return
            }
            // listener dispatch
            el.dispatchEvent(new CustomEvent('change.xt'))
          })
        )
      }
    }
    // direction
    self.inverse = self.detail.scrollTopOld > scrollTop
    self.detail.scrollTopOld = scrollTop
    // currents
    for (const el of currentsOn) {
      // event
      self.eventOn(el)
    }
    for (const el of currentsOff) {
      // event
      self.eventOff(el)
    }
  }

  //
}

//
// options
//

Scroll.componentName = 'xt-scroll'
Scroll.optionsDefault = {
  // scroll
  sticky: false,
  distance: 100,
  trigger: '100%',
  start: '100%',
  end: false,
  fallback: 0,
  // element
  elements: false,
  targets: false,
  // class
  class: 'fade fade-scroll',
  classIn: 'fade-in',
  classOut: 'fade-out',
  // quantity
  min: 0,
  max: 'Infinity',
  // event
  on: 'on.xt.scroll',
  // timing
  instant: true,
  // other
  aria: false,
}

//
// export
//

Xt.Scroll = Scroll

//
// observe
//

Xt.mount.push({
  matches: '[data-' + Scroll.componentName + ']',
  mount: (object) => {
    // vars

    const optionsMarkup = object.getAttribute('data-' + Xt.Scroll.componentName)
    const options = optionsMarkup ? JSON5.parse(optionsMarkup) : {}

    // init

    let self = new Xt.Scroll(object, options)

    // unmount

    const unmount = () => {
      self.destroy()
      self = null
    }
    return unmount
  },
})
