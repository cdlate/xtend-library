import { TweenMax } from 'gsap/TweenMax'
import { Xt } from 'xtend-library'

Xt.mount.push({
  matches: '.btn',
  mount: function (object) {

    // vars

    const easeLinear = Power0.easeNone
    const objectStyle = getComputedStyle(object)

    // methods

    function eventOn () {
      TweenMax.to(object, 0.5, { backgroundColor: objectStyle.getPropertyValue('--background--on').trim(), ease: easeLinear })
    }

    function eventOff () {
      TweenMax.to(object, 0.5, { backgroundColor: objectStyle.getPropertyValue('--background').trim(), ease: easeLinear })
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
