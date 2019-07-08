import {TweenMax} from "gsap/TweenMax";
import BezierEasing from "bezier-easing";

/**
 * .loader
 */

(function () {

  // vars

  let time = 2000;
  let easeInOut = new Ease(BezierEasing(.68, .13, .25, 1));

  let loader = document.querySelector('.loader');

  // timeout

  function loaderTimeout() {
    let filler = loader.querySelectorAll('.filler span:nth-child(2)');
    loader.dataset.loaderActive = loader.dataset.loaderActive === 'true' ? 'false' : 'true';
    if (loader.dataset.loaderActive === 'true') {
      loader.classList.add('active');
      loader.classList.remove('out');
      TweenMax.set(filler, {width: 0});
      TweenMax.to(filler, time / 1000, {width: '100%', ease: easeInOut});
      setTimeout(loaderTimeout, time);
    } else {
      loader.classList.remove('active');
      loader.classList.add('out');
      Xt.animTimeout(loader, loaderTimeout);
    }
  }

  loaderTimeout();

})();
