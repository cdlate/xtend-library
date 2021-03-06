import { Xt } from 'xtend-library'
import 'xtend-library/src/vars.js'
import 'xtend-library/src/extensions/slider/slider.js'
import 'xtend-library/src/addons/slider/navigation-sides.js'
import 'xtend-library/src/addons/animation/propagate-interaction.js'
import gsap from 'gsap'

/**
 * mouse events instead of click you can remove this
 */

Xt.mount.push({
  matches: '#iframe--sequential-megamenu-v1 #check-sequential-megamenu-v1',
  mount: (object) => {
    // mouse events instead of click

    const checkChange = () => {
      const component = document.querySelector('#iframe--sequential-megamenu-v1 body .megamenus')
      if (component) {
        const self = Xt.get('xt-drop', component)
        if (self) {
          if (object.checked) {
            self.options.on = 'mouseenter'
            self.options.off = 'mouseleave'
          } else {
            self.options.on = 'click'
            self.options.off = false
          }
          self.reinit()
        }
      }
    }

    object.addEventListener('change', checkChange)
  },
})

/**
 * .megamenus drops
 */

Xt.mount.push({
  matches: '#iframe--sequential-megamenu-v1 body .megamenus', // add your own selector instead of body to contain the code
  mount: (object) => {
    // vars

    const contentXOn = -40
    const contentXOff = -40
    const contentTime = Xt.vars.timeMedium
    const contentDelayOn = Xt.vars.timeTiny
    const contentEase = 'quint.out'

    const designTime = Xt.vars.timeLarge
    const designEase = 'expo.out'

    const innerTime = Xt.vars.timeLarge
    const innerEase = 'expo.out'

    // init

    let self = new Xt.Drop(object, {
      elements: '.megamenu_outer',
      targets: '.megamenu_outer > .drop',
      durationOn: Xt.vars.timeLarge,
      durationOff: Xt.vars.timeLarge,
      preventEvent: true,
      // on: 'mouseenter',
      // off: 'mouseleave',
      instant: true,
      zIndex: {
        targets: {
          start: 500,
          factor: -1,
        },
      },
    })

    // setup

    for (const tr of self.targets) {
      const inner = tr.querySelector('.drop-inner')
      gsap.set(inner, { height: 0 })
    }

    // on

    const eventOn = (e) => {
      const tr = e.target
      // useCapture delegation
      if (self.targets.includes(tr)) {
        // content
        const content = tr.querySelector('.drop-content')
        gsap.set(content, { x: contentXOn * self.direction, opacity: 0 })
        gsap.to(content, { x: 0, opacity: 1, duration: contentTime, delay: contentDelayOn, ease: contentEase })
        // design
        const design = tr.querySelector('.drop-design')
        const designOpacityCache = Xt.dataStorage.get(self.object, 'designOpacityCache') || 0
        gsap.set(design, { opacity: designOpacityCache })
        gsap.to(design, { opacity: 1, duration: designTime, ease: designEase }).eventCallback('onUpdate', () => {
          Xt.dataStorage.set(self.object, 'designOpacityCache', design.style.opacity)
        })
        // inner
        const inner = tr.querySelector('.drop-inner')
        gsap.set(inner, { height: '' })
        const innerHeight = inner.clientHeight
        const innerHeightCache = Xt.dataStorage.get(self.object, 'innerHeightCache') || 0
        gsap.set(inner, { height: innerHeightCache })
        gsap.to(inner, { height: innerHeight, duration: innerTime, ease: innerEase }).eventCallback('onUpdate', () => {
          Xt.dataStorage.set(self.object, 'innerHeightCache', inner.clientHeight)
        })
      }
    }

    self.object.addEventListener('on.xt', eventOn, true)

    // on

    const eventOff = (e) => {
      const tr = e.target
      // useCapture delegation
      if (self.targets.includes(tr)) {
        // eventOff after eventOn sequential interaction
        cancelAnimationFrame(Xt.dataStorage.get(self.object, 'dropMegamenusFrame'))
        Xt.dataStorage.set(
          self.object,
          'dropMegamenusFrame',
          requestAnimationFrame(() => {
            // when self.direction it's sequential interaction
            if (self.direction) {
              // content
              const content = tr.querySelector('.drop-content')
              gsap.to(content, { x: contentXOff * self.direction * -1, opacity: 0, duration: contentTime, ease: contentEase, overwrite: true })
              // design
              const design = tr.querySelector('.drop-design')
              gsap.set(design, { opacity: 0 })
            } else {
              // others
              for (const other of self.targets.filter((x) => x !== tr)) {
                // design
                const design = other.querySelector('.drop-design')
                gsap.set(design, { opacity: 0 })
                // inner
                const inner = other.querySelector('.drop-inner')
                gsap.set(inner, { height: 0 })
              }
              // content
              const content = tr.querySelector('.drop-content')
              gsap.to(content, { opacity: 0, duration: contentTime, ease: contentEase })
              // design
              const design = tr.querySelector('.drop-design')
              gsap.to(design, { opacity: 0, duration: designTime, ease: designEase }).eventCallback('onUpdate', () => {
                Xt.dataStorage.set(self.object, 'designOpacityCache', design.style.opacity)
              })
              // inner
              const inner = tr.querySelector('.drop-inner')
              const innerHeight = 0
              gsap.to(inner, { height: innerHeight, duration: innerTime, ease: innerEase }).eventCallback('onUpdate', () => {
                Xt.dataStorage.set(self.object, 'innerHeightCache', inner.clientHeight)
              })
            }
          })
        )
      }
    }

    self.object.addEventListener('off.xt', eventOff, true)

    // unmount

    const unmount = function () {
      self.destroy()
      self = null
    }
    return unmount
  },
})

/**
 * .megamenus line
 */

Xt.mount.push({
  matches: '.megamenus',
  mount: function (object) {
    // vars

    let lineFirst = true
    const btns = object.querySelectorAll('.btn_megamenus')
    const line = object.querySelector('.megamenus_line')

    const lineHeight = 4
    const lineTime = Xt.vars.timeSmall
    const lineEase = 'quint.out'

    // enter

    const eventEnter = (e) => {
      const el = e.target
      // raf fix not off on sequential
      cancelAnimationFrame(Xt.dataStorage.get(object, 'lineFrame'))
      // line
      const lineX = el.offsetLeft
      const lineY = el.getBoundingClientRect().top + el.offsetHeight
      const lineWidth = el.offsetWidth
      if (lineFirst) {
        gsap.set(line, { x: lineX, y: lineY, width: lineWidth, height: 0 })
        lineFirst = false
      }
      gsap.to(line, { x: lineX, y: lineY - lineHeight, width: lineWidth, height: lineHeight, opacity: 1, duration: lineTime, ease: lineEase })
    }

    for (const btn of btns) {
      btn.addEventListener('mouseenter', eventEnter, true)
    }

    // leave

    const eventLeave = function () {
      // eslint-disable-next-line no-invalid-this
      const el = this
      // eventEnter after eventLeave sequential interaction
      cancelAnimationFrame(Xt.dataStorage.get(object, 'lineFrame'))
      Xt.dataStorage.set(
        object,
        'lineFrame',
        requestAnimationFrame(() => {
          // not when drop is still open
          const dropBtnActive = object.querySelector('.megamenus .drop-container > .btn.active')
          if (!dropBtnActive) {
            // line
            const lineY = el.getBoundingClientRect().top + el.offsetHeight
            lineFirst = true
            gsap.to(line, { y: lineY, opacity: 0, duration: lineTime, ease: lineEase })
          } else {
            // line
            const lineX = dropBtnActive.offsetLeft
            const lineY = dropBtnActive.getBoundingClientRect().top + dropBtnActive.offsetHeight
            const lineWidth = dropBtnActive.offsetWidth
            gsap.to(line, { x: lineX, y: lineY - lineHeight, width: lineWidth, height: lineHeight, opacity: 1, duration: lineTime, ease: lineEase })
          }
        })
      )
    }

    for (const btn of btns) {
      btn.addEventListener('mouseleave', eventLeave, true)
      const drop = btn.closest('.drop-container')
      if (drop) {
        drop.addEventListener('off.xt', eventLeave.bind(btn), true)
      }
    }

    // unmount

    const unmount = function () {}
    return unmount
  },
})
