Xt.init.push({ // on DOM ready and on content added to DOM
  matches: '.loader',
  fnc: loaderInit
});

function loaderInit(main, index) {

  // vars

  let time = 2000;
  CustomEase.create('easeIn', '.41,.1,.175,1');
  CustomEase.create('easeOut', '.77,0,.175,1');
  CustomEase.create('easeInOut', '.77,.0,.17,1');
  CSSPlugin.suffixMap.strokeDashoffset = "";

  // spinner

  function spinner() {
    let spinner = main.querySelector('.spinner circle:nth-child(2)');
    TweenMax.set(spinner, {strokeDashoffset: 1});
    TweenMax.to(spinner, time / 1000, {strokeDashoffset: 0, ease: 'easeInOut'});
  }
  setInterval(spinner, time);
  spinner();

}