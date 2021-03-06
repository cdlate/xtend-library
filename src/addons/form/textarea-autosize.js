import { Xt } from 'xtend-library'
import JSON5 from 'json5'

/**
 * TextareaAutosize
 */
class TextareaAutosize {
  /**
   * constructor
   * @param {Node|HTMLElement|EventTarget|Window} object Base node
   * @param {Object} optionsCustom User options
   * @constructor
   */
  constructor(object, optionsCustom = {}) {
    const self = this
    self.object = object
    self.optionsCustom = optionsCustom
    self.componentName = self.constructor.componentName
    Xt.destroyAndInit(self)
  }

  //
  // init
  //

  /**
   * init
   */
  init() {
    const self = this
    // options
    self.options = Xt.merge([self.constructor.optionsDefault, self.optionsCustom])
    // class
    self.object.classList.add('textarea-autosize')
    // key
    self.object.addEventListener('keydown', self.keychange.bind(self))
    self.object.addEventListener('keyup', self.keychange.bind(self))
    // form
    const form = self.object.closest('form')
    if (form) {
      form.addEventListener('reset', self.keychange.bind(self))
    }
    // initial
    self.keychange.bind(self)()
    // initialized class
    self.object.classList.add(self.componentName)
    // @FIX raf because after .xt custom listeners
    requestAnimationFrame(() => {
      // listener dispatch
      self.object.dispatchEvent(new CustomEvent('init.xt'))
    })
  }

  //
  // methods
  //

  /**
   * keychange
   */
  keychange() {
    const self = this
    self.object.style.height = '5px'
    self.object.style.height = self.object.scrollHeight + 'px' // fixes both safari RAF and form reset
    requestAnimationFrame(() => {
      self.object.style.height = '5px' // fixes both safari RAF and form reset
      self.object.style.height = self.object.scrollHeight + 'px'
    })
  }

  //
  // util
  //

  /**
   * destroy
   */
  destroy() {
    const self = this
    // class
    self.object.classList.remove('textarea-autosize')
    // remove events
    const form = self.object.closest('form')
    if (form) {
      form.removeEventListener('reset', self.keychange.bind(self))
    }
    self.object.removeEventListener('keydown', self.keychange.bind(self))
    self.object.removeEventListener('keyup', self.keychange.bind(self))
    // initialized class
    self.object.classList.remove(self.componentName)
    // set self
    Xt.remove(self.componentName, self.object)
    // listener dispatch
    self.object.dispatchEvent(new CustomEvent('destroy.xt'))
  }

  //
}

//
// options
//

TextareaAutosize.componentName = 'xt-textarea-autosize'
TextareaAutosize.optionsDefault = {}

//
// export
//

Xt.TextareaAutosize = TextareaAutosize

//
// observe
//

Xt.mount.push({
  matches: '[data-' + Xt.TextareaAutosize.componentName + ']',
  mount: (object) => {
    // vars

    const optionsMarkup = object.getAttribute('data-' + Xt.TextareaAutosize.componentName)
    const options = optionsMarkup ? JSON5.parse(optionsMarkup) : {}

    // init

    let self = new Xt.TextareaAutosize(object, options)

    // unmount

    const unmount = () => {
      self.destroy()
      self = null
    }
    return unmount
  },
})
