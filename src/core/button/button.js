import { TweenMax } from 'gsap/TweenMax'
import BezierEasing from 'bezier-easing'
import { Xt } from 'xtend-library'

Xt.mount.push({
  matches: '.btn',
  mount: function (object) {

    // vars

    const easeLinear = Power0.easeNone

    // methods

    function eventOn () {
      const style = getComputedStyle(object)
      console.log(style.getPropertyValue('--background--on'))
      TweenMax.to(object, 0.5, { backgroundColor: style.getPropertyValue('--background--on'), ease: easeLinear })
    }

    function eventOff () {
      const style = getComputedStyle(object)
      console.log(style.getPropertyValue('--background'))
      TweenMax.to(object, 0.5, { backgroundColor: style.getPropertyValue('--background'), ease: easeLinear })
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
