import { Xt } from 'xtend-library'
import 'xtend-library/src/extensions/scroll/scroll.js'
import gsap from 'gsap'

Xt.mount.push({
  matches: '.demo--parallax-3',
  mount: object => {
    // init

    let self = new Xt.Scroll(object, {
      start: '100%',
      end: '100%',
      trigger: '50%',
    })

    // change

    const eventChange = e => {
      const element = e.target
      gsap.set(element, { opacity: self.detail.ratio })
    }

    for (const el of self.elements) {
      el.addEventListener('change.xt', eventChange)
    }

    // unmount

    const unmount = () => {
      self.destroy()
      self = null
    }
    return unmount
  },
})
