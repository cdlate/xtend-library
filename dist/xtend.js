/*! Xtend (https://getxtend.com/)
@copyright (c) 2017 - 2019 Riccardo Caroli
@license MIT (https://github.com/minimit/xtend-library/blob/master/LICENSE) */

// support explorer 12, firefox 38, opera 25, safari 10, chrome 38
//<!-- // https://browser-update.org/ -->
//<style>#buorg {visibility: visible}</style>
//<script>var $buoop = {required: {e: 12, f: 38, o: 25, s: 10, c: 38}, reminder: 0, no_permanent_hide: true, api: 2019.05};</script>
//<script src="//browser-update.org/update.min.js" defer></script>

// support old browsers ie11+
// ADD
// .browserslistrc ie >= 11
// import 'xtend-library/src/polyfill-old.js'

// POLYFILLS
// ADD
// https://cdnjs.cloudflare.com/ajax/libs/core-js/2.6.9/shim.min.js
// OR
// import 'core-js'
// import 'regenerator-runtime/runtime'

import {Xt} from 'xtend-library'
import 'xtend-library/src/xtend-core.js'

// export UMD

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global.Xt = factory());
}(this, function () { 'use strict';
  return Xt;
}));