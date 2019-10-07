import { TweenMax } from 'gsap/TweenMax'
import { Xt } from 'xtend-library'
import { customProperties } from 'xtend-library/dist/test.js'

Xt.mount.push({
  matches: '.btn',
  mount: function (object) {

    // vars

    const easeLinear = Power0.easeNone
    const objectStyle = getComputedStyle(object)
    const objectStyleBackground = objectStyle.getPropertyValue('background-color')

    // methods

    function eventOn () {
      console.log(customProperties['--secondary']);
      TweenMax.to(object, 0.5, { backgroundColor: customProperties['--secondary'], ease: easeLinear })
    }

    function eventOff () {
      console.log(objectStyleBackground);
      TweenMax.to(object, 0.5, { backgroundColor: objectStyleBackground, ease: easeLinear })
    }

    // events

    object.addEventListener('mouseenter', eventOn);
    object.addEventListener('mouseleave', eventOff);
    object.addEventListener('focusin', eventOn);
    object.addEventListener('focusout', eventOff);
    object.addEventListener('click', eventOff);

    object.addEventListener('on.xt', eventOn);
    object.addEventListener('off.xt', eventOff);

  }
})
