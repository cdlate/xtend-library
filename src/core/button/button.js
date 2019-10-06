import { TweenMax } from 'gsap/TweenMax'
import BezierEasing from 'bezier-easing'
import { Xt } from 'xtend-library'

import {customProperties} from 'xtend-library/dist/xtend-vars.js'

Xt.mount.push({
  matches: '.btn',
  mount: function (object) {

    // vars

    const easeLinear = Power0.easeNone

    // methods

    function eventOn () {
      TweenMax.to(object, 0.5, { backgroundColor: customProperties['--test'], ease: easeLinear })
    }

    function eventOff () {
      TweenMax.to(object, 0.5, { backgroundColor: customProperties['--primary'], ease: easeLinear })
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
