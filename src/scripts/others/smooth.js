//////////////////////
// import
//////////////////////

import {Xt} from '../xtend';
import {Core} from '../core';

//////////////////////
// smooth
//////////////////////

class Smooth extends Core {

  /**
   * constructor
   * @param {Node|HTMLElement|EventTarget|Window} object Base node
   * @constructor
   */
  constructor(object) {
    super(object);
  }

}

//////////////////////
// option
//////////////////////

Smooth.componentName = 'xt-smooth';
Smooth.optionsDefault = {
  "class": "",
  "wheel": {
    "selector": "scrollingElement",
    "block": false,
    "limit": true,
    "transform": false,
    "horizontal": false,
    "factor": 1,
    "friction": "return delta / 9",
    "frictionLimit": 1.5
  }
};

//////////////////////
// export
//////////////////////

customElements.define(Smooth.componentName, Smooth);
export {Smooth};
