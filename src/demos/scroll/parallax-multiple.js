import { Xt } from 'xtend-library'
import 'xtend-library/src/extensions/scroll/scroll.js'

Xt.mount.push({
  matches: '.demo--parallax-multiple',
  mount: object => {
    // init

    let self = new Xt.Scroll(object, {
      distance: 0,
      sticky: 'absolute',
      trigger: '50%',
      start: '100%',
    })

    // unmount

    const unmount = () => {
      self.destroy()
      self = null
    }
    return unmount
  },
})
