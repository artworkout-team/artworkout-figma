/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/figma-jsonrpc/errors.js":
/*!**********************************************!*\
  !*** ./node_modules/figma-jsonrpc/errors.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports.ParseError = class ParseError extends Error {
  constructor(data) {
    super("Parse error");
    this.data = data;
    this.statusCode = -32700;
  }
};

module.exports.InvalidRequest = class InvalidRequest extends Error {
  constructor(data) {
    super("Invalid Request");
    this.data = data;
    this.statusCode = -32600;
  }
};

module.exports.MethodNotFound = class MethodNotFound extends Error {
  constructor(data) {
    super("Method not found");
    this.data = data;
    this.statusCode = -32601;
  }
};

module.exports.InvalidParams = class InvalidParams extends Error {
  constructor(data) {
    super("Invalid params");
    this.data = data;
    this.statusCode = -32602;
  }
};

module.exports.InternalError = class InternalError extends Error {
  constructor(data) {
    super("Internal error");
    this.data = data;
    this.statusCode = -32603;
  }
};


/***/ }),

/***/ "./node_modules/figma-jsonrpc/index.js":
/*!*********************************************!*\
  !*** ./node_modules/figma-jsonrpc/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const { setup, sendRequest } = __webpack_require__(/*! ./rpc */ "./node_modules/figma-jsonrpc/rpc.js");

module.exports.createUIAPI = function createUIAPI(methods, options) {
  const timeout = options && options.timeout;

  if (typeof parent !== "undefined") {
    setup(methods);
  }

  return Object.keys(methods).reduce((prev, p) => {
    prev[p] = (...params) => {
      if (typeof parent !== "undefined") {
        return Promise.resolve().then(() => methods[p](...params));
      }
      return sendRequest(p, params, timeout);
    };
    return prev;
  }, {});
};

module.exports.createPluginAPI = function createPluginAPI(methods, options) {
  const timeout = options && options.timeout;

  if (typeof figma !== "undefined") {
    setup(methods);
  }

  return Object.keys(methods).reduce((prev, p) => {
    prev[p] = (...params) => {
      if (typeof figma !== "undefined") {
        return Promise.resolve().then(() => methods[p](...params));
      }
      return sendRequest(p, params, timeout);
    };
    return prev;
  }, {});
};


/***/ }),

/***/ "./node_modules/figma-jsonrpc/rpc.js":
/*!*******************************************!*\
  !*** ./node_modules/figma-jsonrpc/rpc.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const RPCError = __webpack_require__(/*! ./errors */ "./node_modules/figma-jsonrpc/errors.js");
const { MethodNotFound } = __webpack_require__(/*! ./errors */ "./node_modules/figma-jsonrpc/errors.js");

let sendRaw;

if (typeof figma !== "undefined") {
  figma.ui.on('message', message => handleRaw(message));
  sendRaw = message => figma.ui.postMessage(message);
} else if (typeof parent !== "undefined") {
  onmessage = event => handleRaw(event.data.pluginMessage);
  sendRaw = message => parent.postMessage({ pluginMessage: message }, "*");
}

let rpcIndex = 0;
let pending = {};

function sendJson(req) {
  try {
    sendRaw(req);
  } catch (err) {
    console.error(err);
  }
}

function sendResult(id, result) {
  sendJson({
    jsonrpc: "2.0",
    id,
    result
  });
}

function sendError(id, error) {
  const errorObject = {
    code: error.code,
    message: error.message,
    data: error.data
  };
  sendJson({
    jsonrpc: "2.0",
    id,
    error: errorObject
  });
}

function handleRaw(data) {
  try {
    if (!data) {
      return;
    }
    handleRpc(data);
  } catch (err) {
    console.error(err);
    console.error(data);
  }
}

function handleRpc(json) {
  if (typeof json.id !== "undefined") {
    if (
      typeof json.result !== "undefined" ||
      json.error ||
      typeof json.method === "undefined"
    ) {
      const callback = pending[json.id];
      if (!callback) {
        sendError(
          json.id,
          new RPCError.InvalidRequest("Missing callback for " + json.id)
        );
        return;
      }
      if (callback.timeout) {
        clearTimeout(callback.timeout);
      }
      delete pending[json.id];
      callback(json.error, json.result);
    } else {
      handleRequest(json);
    }
  } else {
    handleNotification(json);
  }
}

let methods = {};

function onRequest(method, params) {
  if (!methods[method]) {
    throw new MethodNotFound(method);
  }
  return methods[method](...params);
}

function handleNotification(json) {
  if (!json.method) {
    return;
  }
  onRequest(json.method, json.params);
}

function handleRequest(json) {
  if (!json.method) {
    sendError(json.id, new RPCError.InvalidRequest("Missing method"));
    return;
  }
  try {
    const result = onRequest(json.method, json.params);
    if (result && typeof result.then === "function") {
      result
        .then(res => sendResult(json.id, res))
        .catch(err => sendError(json.id, err));
    } else {
      sendResult(json.id, result);
    }
  } catch (err) {
    sendError(json.id, err);
  }
}

module.exports.setup = _methods => {
  Object.assign(methods, _methods);
};

module.exports.sendNotification = (method, params) => {
  sendJson({ jsonrpc: "2.0", method, params });
};

module.exports.sendRequest = (method, params, timeout) => {
  return new Promise((resolve, reject) => {
    const id = rpcIndex;
    const req = { jsonrpc: "2.0", method, params, id };
    rpcIndex += 1;
    const callback = (err, result) => {
      if (err) {
        const jsError = new Error(err.message);
        jsError.code = err.code;
        jsError.data = err.data;
        reject(jsError);
        return;
      }
      resolve(result);
    };

    // set a default timeout
    callback.timeout = setTimeout(() => {
      delete pending[id];
      reject(new Error("Request " + method + " timed out."));
    }, timeout || 3000);

    pending[id] = callback;
    sendJson(req);
  });
};

module.exports.RPCError = RPCError;


/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "./node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = __webpack_require__(/*! ./lib/has */ "./node_modules/prop-types/lib/has.js");

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) { /**/ }
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
              'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "./node_modules/prop-types/lib/has.js":
/*!********************************************!*\
  !*** ./node_modules/prop-types/lib/has.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = Function.call.bind(Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/proxy-compare/dist/index.modern.js":
/*!*********************************************************!*\
  !*** ./node_modules/proxy-compare/dist/index.modern.js ***!
  \*********************************************************/
/*! exports provided: affectedToPathList, createProxy, getUntracked, isChanged, markToTrack, replaceNewProxy, trackMemo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "affectedToPathList", function() { return O; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createProxy", function() { return i; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUntracked", function() { return g; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isChanged", function() { return y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "markToTrack", function() { return b; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replaceNewProxy", function() { return w; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackMemo", function() { return u; });
const e=Symbol(),t=Symbol(),r=Symbol();let n=(e,t)=>new Proxy(e,t);const o=Object.getPrototypeOf,s=new WeakMap,c=e=>e&&(s.has(e)?s.get(e):o(e)===Object.prototype||o(e)===Array.prototype),l=e=>"object"==typeof e&&null!==e,a=new WeakMap,f=e=>e[r]||e,i=(s,l,p)=>{if(!c(s))return s;const y=f(s),u=(e=>Object.isFrozen(e)||Object.values(Object.getOwnPropertyDescriptors(e)).some(e=>!e.writable))(y);let g=p&&p.get(y);return g&&g[1].f===u||(g=((n,o)=>{const s={f:o};let c=!1;const l=(t,r)=>{if(!c){let o=s.a.get(n);o||(o=new Set,s.a.set(n,o)),r&&o.has(e)||o.add(t)}},a={get:(e,t)=>t===r?n:(l(t),i(e[t],s.a,s.c)),has:(e,r)=>r===t?(c=!0,s.a.delete(n),!0):(l(r),r in e),getOwnPropertyDescriptor:(e,t)=>(l(t,!0),Object.getOwnPropertyDescriptor(e,t)),ownKeys:t=>(l(e),Reflect.ownKeys(t))};return o&&(a.set=a.deleteProperty=()=>!1),[a,s]})(y,u),g[1].p=n(u?(e=>{let t=a.get(e);if(!t){if(Array.isArray(e))t=Array.from(e);else{const r=Object.getOwnPropertyDescriptors(e);Object.values(r).forEach(e=>{e.configurable=!0}),t=Object.create(o(e),r)}a.set(e,t)}return t})(y):y,g[0]),p&&p.set(y,g)),g[1].a=l,g[1].c=p,g[1].p},p=(e,t)=>{const r=Reflect.ownKeys(e),n=Reflect.ownKeys(t);return r.length!==n.length||r.some((e,t)=>e!==n[t])},y=(t,r,n,o)=>{if(Object.is(t,r))return!1;if(!l(t)||!l(r))return!0;const s=n.get(f(t));if(!s)return!0;if(o){const e=o.get(t);if(e&&e.n===r)return e.g;o.set(t,{n:r,g:!1})}let c=null;for(const l of s){const s=l===e?p(t,r):y(t[l],r[l],n,o);if(!0!==s&&!1!==s||(c=s),c)break}return null===c&&(c=!0),o&&o.set(t,{n:r,g:c}),c},u=e=>!!c(e)&&t in e,g=e=>c(e)&&e[r]||null,b=(e,t=!0)=>{s.set(e,t)},O=(e,t)=>{const r=[],n=new WeakSet,o=(e,s)=>{if(n.has(e))return;l(e)&&n.add(e);const c=l(e)&&t.get(f(e));c?c.forEach(t=>{o(e[t],s?[...s,t]:[t])}):s&&r.push(s)};return o(e),r},w=e=>{n=e};
//# sourceMappingURL=index.modern.mjs.map


/***/ }),

/***/ "./node_modules/react/cjs/react.development.js":
/*!*****************************************************!*\
  !*** ./node_modules/react/cjs/react.development.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.14.0
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var _assign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js");
var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ "./node_modules/prop-types/checkPropTypes.js");

var ReactVersion = '16.14.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  suspense: null
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
function describeComponentFrame (name, source, ownerName) {
  var sourceInfo = '';

  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, '');

    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        var match = path.match(BEFORE_SLASH_RE);

        if (match) {
          var pathBeforeSlash = match[1];

          if (pathBeforeSlash) {
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }

    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }

  return '\n    in ' + (name || 'Unknown') + sourceInfo;
}

var Resolved = 1;
function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName);
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return "Profiler";

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';

      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        return getComponentName(type.type);

      case REACT_BLOCK_TYPE:
        return getComponentName(type.render);

      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);

          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }

          break;
        }
    }
  }

  return null;
}

var ReactDebugCurrentFrame = {};
var currentlyValidatingElement = null;
function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = ''; // Add an extra top frame while an element is being validated

    if (currentlyValidatingElement) {
      var name = getComponentName(currentlyValidatingElement.type);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    } // Delegate to the injected renderer-specific implementation


    var impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

/**
 * Used by act() to track whether you're inside an act() scope.
 */
var IsSomeRendererActing = {
  current: false
};

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner,
  IsSomeRendererActing: IsSomeRendererActing,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    printWarning('warn', format, args);
  }
}
function error(format) {
  {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    printWarning('error', format, args);
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var hasExistingStack = args.length > 0 && typeof args[args.length - 1] === 'string' && args[args.length - 1].indexOf('\n    in') === 0;

    if (!hasExistingStack) {
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();

      if (stack !== '') {
        format += '%s';
        args = args.concat([stack]);
      }
    }

    var argsWithFormat = args.map(function (item) {
      return '' + item;
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      throw new Error(message);
    } catch (x) {}
  }
}

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + "." + callerName;

    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }

    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}
/**
 * This is the abstract API for an update queue.
 */


var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};

{
  Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */


function Component(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };

  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

        return undefined;
      }
    });
  };

  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

_assign(pureComponentPrototype, Component.prototype);

pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };

  {
    Object.seal(refObject);
  }

  return refObject;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    }
  };

  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
      var componentName = getComponentName(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://fb.me/react-strict-mode-string-ref', getComponentName(ReactCurrentOwner.current.type), config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */

function cloneElement(element, config, children) {
  if (!!(element === null || element === undefined)) {
    {
      throw Error( "React.cloneElement(...): The argument must be a React element, but you passed " + element + "." );
    }
  }

  var propName; // Original props are copied

  var props = _assign({}, element.props); // Reserved names are extracted


  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */


var didWarnAboutMaps = false;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];

function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;

  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}
/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */


function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;

      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }

    }
  }

  if (invokeCallback) {
    callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);

    if (typeof iteratorFn === 'function') {

      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          if (!didWarnAboutMaps) {
            warn('Using Maps as children is deprecated and will be removed in ' + 'a future major release. Consider converting children to ' + 'an array of keyed ReactElements instead.');
          }

          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;

      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';

      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }

      var childrenString = '' + children;

      {
        {
          throw Error( "Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + ")." + addendum );
        }
      }
    }
  }

  return subtreeCount;
}
/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */


function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}
/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */


function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;
  func.call(context, child, bookKeeping.count++);
}
/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */


function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;
  var mappedChild = func.call(context, child, bookKeeping.count++);

  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }

    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';

  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }

  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */


function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


function countChildren(children) {
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */


function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  if (!isValidElement(children)) {
    {
      throw Error( "React.Children.only expected to receive a single React element child." );
    }
  }

  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      if (calculateChangedBits !== null && typeof calculateChangedBits !== 'function') {
        error('createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits);
      }
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      }
    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function lazy(ctor) {
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };

  {
    // In production, this would just set it on the object.
    var defaultProps;
    var propTypes;
    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          defaultProps = newDefaultProps; // Match production behavior more closely:

          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          propTypes = newPropTypes; // Match production behavior more closely:

          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      if (render.length !== 0 && render.length !== 2) {
        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
      }
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }

  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;

  if (!(dispatcher !== null)) {
    {
      throw Error( "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem." );
    }
  }

  return dispatcher;
}

function useContext(Context, unstable_observedBits) {
  var dispatcher = resolveDispatcher();

  {
    if (unstable_observedBits !== undefined) {
      error('useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '');
    } // TODO: add a more generic warning for invalid values.


    if (Context._context !== undefined) {
      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.

      if (realContext.Consumer === Context) {
        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }

  return dispatcher.useContext(Context, unstable_observedBits);
}
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
function useEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function useLayoutEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
function useCallback(callback, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
function useMemo(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
function useImperativeHandle(ref, create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current.type);

    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }

  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }

  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }

  return '';
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

    if (parentName) {
      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
    }
  }

  return info;
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }

  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.

  var childOwner = '';

  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
  }

  setCurrentlyValidatingElement(element);

  {
    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }

  setCurrentlyValidatingElement(null);
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];

      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);

    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;

        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var name = getComponentName(type);
    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    setCurrentlyValidatingElement(fragment);
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        break;
      }
    }

    if (fragment.ref !== null) {
      error('Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }
}
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  if (!validType) {
    var info = '';

    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString;

    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = "<" + (getComponentName(type.type) || 'Unknown') + " />";
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    {
      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }
  }

  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.

  if (element == null) {
    return element;
  } // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)


  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
var didWarnAboutDeprecatedCreateFactory = false;
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;

  {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;

      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
    } // Legacy hook: remove it


    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);

  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }

  validatePropTypes(newElement);
  return newElement;
}

{

  try {
    var frozenObject = Object.freeze({});
    var testMap = new Map([[frozenObject, null]]);
    var testSet = new Set([frozenObject]); // This is necessary for Rollup to not consider these unused.
    // https://github.com/rollup/rollup/issues/1771
    // TODO: we can remove these if Rollup fixes the bug.

    testMap.set(0, 0);
    testSet.add(0);
  } catch (e) {
  }
}

var createElement$1 =  createElementWithValidation ;
var cloneElement$1 =  cloneElementWithValidation ;
var createFactory =  createFactoryWithValidation ;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray: toArray,
  only: onlyChild
};

exports.Children = Children;
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createFactory = createFactory;
exports.createRef = createRef;
exports.forwardRef = forwardRef;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useEffect = useEffect;
exports.useImperativeHandle = useImperativeHandle;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.version = ReactVersion;
  })();
}


/***/ }),

/***/ "./node_modules/react/index.js":
/*!*************************************!*\
  !*** ./node_modules/react/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "./node_modules/react/cjs/react.development.js");
}


/***/ }),

/***/ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
}
          var React = __webpack_require__(/*! react */ "./node_modules/react/index.js");

var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y // eslint-disable-line no-self-compare
  ;
}

var objectIs = typeof Object.is === 'function' ? Object.is : is;

// dispatch for CommonJS interop named imports.

var useState = React.useState,
    useEffect = React.useEffect,
    useLayoutEffect = React.useLayoutEffect,
    useDebugValue = React.useDebugValue;
var didWarnOld18Alpha = false;
var didWarnUncachedGetSnapshot = false; // Disclaimer: This shim breaks many of the rules of React, and only works
// because of a very particular set of implementation details and assumptions
// -- change any one of them and it will break. The most important assumption
// is that updates are always synchronous, because concurrent rendering is
// only available in versions of React that also have a built-in
// useSyncExternalStore API. And we only use this shim when the built-in API
// does not exist.
//
// Do not assume that the clever hacks used by this hook also work in general.
// The point of this shim is to replace the need for hacks by other libraries.

function useSyncExternalStore(subscribe, getSnapshot, // Note: The shim does not use getServerSnapshot, because pre-18 versions of
// React do not expose a way to check if we're hydrating. So users of the shim
// will need to track that themselves and return the correct value
// from `getSnapshot`.
getServerSnapshot) {
  {
    if (!didWarnOld18Alpha) {
      if (React.startTransition !== undefined) {
        didWarnOld18Alpha = true;

        error('You are using an outdated, pre-release alpha of React 18 that ' + 'does not support useSyncExternalStore. The ' + 'use-sync-external-store shim will not work correctly. Upgrade ' + 'to a newer pre-release.');
      }
    }
  } // Read the current snapshot from the store on every render. Again, this
  // breaks the rules of React, and only works here because of specific
  // implementation details, most importantly that updates are
  // always synchronous.


  var value = getSnapshot();

  {
    if (!didWarnUncachedGetSnapshot) {
      var cachedValue = getSnapshot();

      if (!objectIs(value, cachedValue)) {
        error('The result of getSnapshot should be cached to avoid an infinite loop');

        didWarnUncachedGetSnapshot = true;
      }
    }
  } // Because updates are synchronous, we don't queue them. Instead we force a
  // re-render whenever the subscribed state changes by updating an some
  // arbitrary useState hook. Then, during render, we call getSnapshot to read
  // the current value.
  //
  // Because we don't actually use the state returned by the useState hook, we
  // can save a bit of memory by storing other stuff in that slot.
  //
  // To implement the early bailout, we need to track some things on a mutable
  // object. Usually, we would put that in a useRef hook, but we can stash it in
  // our useState hook instead.
  //
  // To force a re-render, we call forceUpdate({inst}). That works because the
  // new object always fails an equality check.


  var _useState = useState({
    inst: {
      value: value,
      getSnapshot: getSnapshot
    }
  }),
      inst = _useState[0].inst,
      forceUpdate = _useState[1]; // Track the latest getSnapshot function with a ref. This needs to be updated
  // in the layout phase so we can access it during the tearing check that
  // happens on subscribe.


  useLayoutEffect(function () {
    inst.value = value;
    inst.getSnapshot = getSnapshot; // Whenever getSnapshot or subscribe changes, we need to check in the
    // commit phase if there was an interleaved mutation. In concurrent mode
    // this can happen all the time, but even in synchronous mode, an earlier
    // effect may have mutated the store.

    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({
        inst: inst
      });
    }
  }, [subscribe, value, getSnapshot]);
  useEffect(function () {
    // Check for changes right before subscribing. Subsequent changes will be
    // detected in the subscription handler.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({
        inst: inst
      });
    }

    var handleStoreChange = function () {
      // TODO: Because there is no cross-renderer API for batching updates, it's
      // up to the consumer of this library to wrap their subscription event
      // with unstable_batchedUpdates. Should we try to detect when this isn't
      // the case and print a warning in development?
      // The store changed. Check if the snapshot changed since the last time we
      // read from the store.
      if (checkIfSnapshotChanged(inst)) {
        // Force a re-render.
        forceUpdate({
          inst: inst
        });
      }
    }; // Subscribe to the store and return a clean-up function.


    return subscribe(handleStoreChange);
  }, [subscribe]);
  useDebugValue(value);
  return value;
}

function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  var prevValue = inst.value;

  try {
    var nextValue = latestGetSnapshot();
    return !objectIs(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}

function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
  // Note: The shim does not use getServerSnapshot, because pre-18 versions of
  // React do not expose a way to check if we're hydrating. So users of the shim
  // will need to track that themselves and return the correct value
  // from `getSnapshot`.
  return getSnapshot();
}

var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined');

var isServerEnvironment = !canUseDOM;

var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
var useSyncExternalStore$2 = React.useSyncExternalStore !== undefined ? React.useSyncExternalStore : shim;

exports.useSyncExternalStore = useSyncExternalStore$2;
          /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
}
        
  })();
}


/***/ }),

/***/ "./node_modules/use-sync-external-store/shim/index.js":
/*!************************************************************!*\
  !*** ./node_modules/use-sync-external-store/shim/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim.development.js */ "./node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js");
}


/***/ }),

/***/ "./node_modules/valtio/index.js":
/*!**************************************!*\
  !*** ./node_modules/valtio/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var react = __webpack_require__(/*! react */ "./node_modules/react/index.js");
var proxyCompare = __webpack_require__(/*! proxy-compare */ "./node_modules/proxy-compare/dist/index.modern.js");
var useSyncExternalStoreExports = __webpack_require__(/*! use-sync-external-store/shim */ "./node_modules/use-sync-external-store/shim/index.js");
var vanilla = __webpack_require__(/*! valtio/vanilla */ "./node_modules/valtio/vanilla.js");

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var useSyncExternalStoreExports__default = /*#__PURE__*/_interopDefaultLegacy(useSyncExternalStoreExports);

var useSyncExternalStore = useSyncExternalStoreExports__default["default"].useSyncExternalStore;

var useAffectedDebugValue = function useAffectedDebugValue(state, affected) {
  var pathList = react.useRef();
  react.useEffect(function () {
    pathList.current = proxyCompare.affectedToPathList(state, affected);
  });
  react.useDebugValue(pathList.current);
};

function useSnapshot(proxyObject, options) {
  var notifyInSync = options == null ? void 0 : options.sync;
  var lastSnapshot = react.useRef();
  var lastAffected = react.useRef();
  var inRender = true;
  var currSnapshot = useSyncExternalStore(react.useCallback(function (callback) {
    var unsub = vanilla.subscribe(proxyObject, callback, notifyInSync);
    callback();
    return unsub;
  }, [proxyObject, notifyInSync]), function () {
    var nextSnapshot = vanilla.snapshot(proxyObject);

    try {
      if (!inRender && lastSnapshot.current && lastAffected.current && !proxyCompare.isChanged(lastSnapshot.current, nextSnapshot, lastAffected.current, new WeakMap())) {
        return lastSnapshot.current;
      }
    } catch (e) {}

    return nextSnapshot;
  }, function () {
    return vanilla.snapshot(proxyObject);
  });
  inRender = false;
  var currAffected = new WeakMap();
  react.useEffect(function () {
    lastSnapshot.current = currSnapshot;
    lastAffected.current = currAffected;
  });

  if (true) {
    useAffectedDebugValue(currSnapshot, currAffected);
  }

  var proxyCache = react.useMemo(function () {
    return new WeakMap();
  }, []);
  return proxyCompare.createProxy(currSnapshot, currAffected, proxyCache);
}

Object.defineProperty(exports, 'getVersion', {
  enumerable: true,
  get: function () { return vanilla.getVersion; }
});
Object.defineProperty(exports, 'proxy', {
  enumerable: true,
  get: function () { return vanilla.proxy; }
});
Object.defineProperty(exports, 'ref', {
  enumerable: true,
  get: function () { return vanilla.ref; }
});
Object.defineProperty(exports, 'snapshot', {
  enumerable: true,
  get: function () { return vanilla.snapshot; }
});
Object.defineProperty(exports, 'subscribe', {
  enumerable: true,
  get: function () { return vanilla.subscribe; }
});
Object.defineProperty(exports, 'unstable_getHandler', {
  enumerable: true,
  get: function () { return vanilla.getHandler; }
});
exports.useSnapshot = useSnapshot;


/***/ }),

/***/ "./node_modules/valtio/vanilla.js":
/*!****************************************!*\
  !*** ./node_modules/valtio/vanilla.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var proxyCompare = __webpack_require__(/*! proxy-compare */ "./node_modules/proxy-compare/dist/index.modern.js");

var VERSION =  true ? Symbol('VERSION') : undefined;
var LISTENERS =  true ? Symbol('LISTENERS') : undefined;
var SNAPSHOT =  true ? Symbol('SNAPSHOT') : undefined;
var HANDLER =  true ? Symbol('HANDLER') : undefined;
var PROMISE_RESULT =  true ? Symbol('PROMISE_RESULT') : undefined;
var PROMISE_ERROR =  true ? Symbol('PROMISE_ERROR') : undefined;
var refSet = new WeakSet();
function ref(o) {
  refSet.add(o);
  return o;
}

var isObject = function isObject(x) {
  return typeof x === 'object' && x !== null;
};

var canProxy = function canProxy(x) {
  return isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer);
};

var proxyCache = new WeakMap();
var globalVersion = 1;
var snapshotCache = new WeakMap();
function proxy(initialObject) {
  if (initialObject === void 0) {
    initialObject = {};
  }

  if (!isObject(initialObject)) {
    throw new Error('object required');
  }

  var found = proxyCache.get(initialObject);

  if (found) {
    return found;
  }

  var version = globalVersion;
  var listeners = new Set();

  var notifyUpdate = function notifyUpdate(op, nextVersion) {
    if (nextVersion === void 0) {
      nextVersion = ++globalVersion;
    }

    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach(function (listener) {
        return listener(op, nextVersion);
      });
    }
  };

  var propListeners = new Map();

  var getPropListener = function getPropListener(prop) {
    var propListener = propListeners.get(prop);

    if (!propListener) {
      propListener = function propListener(op, nextVersion) {
        var newOp = [].concat(op);
        newOp[1] = [prop].concat(newOp[1]);
        notifyUpdate(newOp, nextVersion);
      };

      propListeners.set(prop, propListener);
    }

    return propListener;
  };

  var popPropListener = function popPropListener(prop) {
    var propListener = propListeners.get(prop);
    propListeners.delete(prop);
    return propListener;
  };

  var createSnapshot = function createSnapshot(target, receiver) {
    var cache = snapshotCache.get(receiver);

    if ((cache == null ? void 0 : cache[0]) === version) {
      return cache[1];
    }

    var snapshot = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    proxyCompare.markToTrack(snapshot, true);
    snapshotCache.set(receiver, [version, snapshot]);
    Reflect.ownKeys(target).forEach(function (key) {
      var value = Reflect.get(target, key, receiver);

      if (refSet.has(value)) {
        proxyCompare.markToTrack(value, false);
        snapshot[key] = value;
      } else if (value instanceof Promise) {
        if (PROMISE_RESULT in value) {
          snapshot[key] = value[PROMISE_RESULT];
        } else {
          var errorOrPromise = value[PROMISE_ERROR] || value;
          Object.defineProperty(snapshot, key, {
            get: function get() {
              if (PROMISE_RESULT in value) {
                return value[PROMISE_RESULT];
              }

              throw errorOrPromise;
            }
          });
        }
      } else if (value != null && value[LISTENERS]) {
        snapshot[key] = value[SNAPSHOT];
      } else {
        snapshot[key] = value;
      }
    });
    return Object.freeze(snapshot);
  };

  var baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  var handler = {
    get: function get(target, prop, receiver) {
      if (prop === VERSION) {
        return version;
      }

      if (prop === LISTENERS) {
        return listeners;
      }

      if (prop === SNAPSHOT) {
        return createSnapshot(target, receiver);
      }

      if (prop === HANDLER) {
        return handler;
      }

      return Reflect.get(target, prop, receiver);
    },
    deleteProperty: function deleteProperty(target, prop) {
      var prevValue = Reflect.get(target, prop);
      var childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];

      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }

      var deleted = Reflect.deleteProperty(target, prop);

      if (deleted) {
        notifyUpdate(['delete', [prop], prevValue]);
      }

      return deleted;
    },
    is: Object.is,
    canProxy: canProxy,
    set: function set(target, prop, value, receiver) {
      var _Object$getOwnPropert, _value;

      var hasPrevValue = Reflect.has(target, prop);
      var prevValue = Reflect.get(target, prop, receiver);

      if (hasPrevValue && this.is(prevValue, value)) {
        return true;
      }

      var childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];

      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }

      if (isObject(value)) {
        value = proxyCompare.getUntracked(value) || value;
      }

      var nextValue;

      if ((_Object$getOwnPropert = Object.getOwnPropertyDescriptor(target, prop)) != null && _Object$getOwnPropert.set) {
        nextValue = value;
      } else if (value instanceof Promise) {
        nextValue = value.then(function (v) {
          nextValue[PROMISE_RESULT] = v;
          notifyUpdate(['resolve', [prop], v]);
          return v;
        }).catch(function (e) {
          nextValue[PROMISE_ERROR] = e;
          notifyUpdate(['reject', [prop], e]);
        });
      } else if ((_value = value) != null && _value[LISTENERS]) {
        nextValue = value;
        nextValue[LISTENERS].add(getPropListener(prop));
      } else if (this.canProxy(value)) {
        nextValue = proxy(value);
        nextValue[LISTENERS].add(getPropListener(prop));
      } else {
        nextValue = value;
      }

      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(['set', [prop], value, prevValue]);
      return true;
    }
  };
  var proxyObject = new Proxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  Reflect.ownKeys(initialObject).forEach(function (key) {
    var desc = Object.getOwnPropertyDescriptor(initialObject, key);

    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = initialObject[key];
    }
  });
  return proxyObject;
}
function getVersion(proxyObject) {
  return isObject(proxyObject) ? proxyObject[VERSION] : undefined;
}
function subscribe(proxyObject, callback, notifyInSync) {
  if ( true && !(proxyObject != null && proxyObject[LISTENERS])) {
    console.warn('Please use proxy object');
  }

  var promise;
  var ops = [];

  var listener = function listener(op) {
    ops.push(op);

    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }

    if (!promise) {
      promise = Promise.resolve().then(function () {
        promise = undefined;
        callback(ops.splice(0));
      });
    }
  };

  proxyObject[LISTENERS].add(listener);
  return function () {
    proxyObject[LISTENERS].delete(listener);
  };
}
function snapshot(proxyObject) {
  if ( true && !(proxyObject != null && proxyObject[SNAPSHOT])) {
    console.warn('Please use proxy object');
  }

  return proxyObject[SNAPSHOT];
}
function getHandler(proxyObject) {
  if ( true && !(proxyObject != null && proxyObject[HANDLER])) {
    console.warn('Please use proxy object');
  }

  return proxyObject[HANDLER];
}

exports.getHandler = getHandler;
exports.getVersion = getVersion;
exports.proxy = proxy;
exports.ref = ref;
exports.snapshot = snapshot;
exports.subscribe = subscribe;


/***/ }),

/***/ "./src/app/models/MetaStore.ts":
/*!*************************************!*\
  !*** ./src/app/models/MetaStore.ts ***!
  \*************************************/
/*! exports provided: MetaFormStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetaFormStore", function() { return MetaFormStore; });
/* harmony import */ var valtio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! valtio */ "./node_modules/valtio/index.js");
/* harmony import */ var valtio__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(valtio__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _rpc_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../rpc-api */ "./src/rpc-api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let mutex = false;
const defaultMetaProps = {
    duration: "0",
    type: "",
};
const MetaFormStore = Object(valtio__WEBPACK_IMPORTED_MODULE_0__["proxy"])({
    metaProps: defaultMetaProps,
    setMetaProps(props) {
        return __awaiter(this, void 0, void 0, function* () {
            mutex = true;
            for (const key in props) {
                MetaFormStore.metaProps[key] = props[key];
            }
            setTimeout(() => {
                mutex = false;
            }, 10);
        });
    },
    setDefaultProps() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("CONTINUE CLEAR");
            MetaFormStore.setMetaProps(defaultMetaProps);
        });
    }
});
Object(valtio__WEBPACK_IMPORTED_MODULE_0__["subscribe"])(MetaFormStore.metaProps, () => __awaiter(void 0, void 0, void 0, function* () {
    if (!mutex) {
        yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["pluginApi"].setMetaTags(JSON.parse(JSON.stringify(MetaFormStore.metaProps)));
    }
}));


/***/ }),

/***/ "./src/app/models/TuneFormStore.ts":
/*!*****************************************!*\
  !*** ./src/app/models/TuneFormStore.ts ***!
  \*****************************************/
/*! exports provided: TuneFormStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TuneFormStore", function() { return TuneFormStore; });
/* harmony import */ var valtio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! valtio */ "./node_modules/valtio/index.js");
/* harmony import */ var valtio__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(valtio__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _rpc_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../rpc-api */ "./src/rpc-api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let mutex = false;
const TuneFormStore = Object(valtio__WEBPACK_IMPORTED_MODULE_0__["proxy"])({
    stepProps: {
        shadowSize: 0,
        brushSize: 0,
        suggestedBrushSize: 0,
        stepCount: 1,
        template: '',
        clearBefore: false,
        clearLayers: [],
        otherTags: [],
        brushType: '',
    },
    animationProps: {
        animationTag: undefined,
        delay: 0,
        repeat: 0,
    },
    stepNavigationProps: {
        stepNumber: 1,
        displayMode: 'all',
    },
    setAnimationTags(animationTag, delay, repeat) {
        return __awaiter(this, void 0, void 0, function* () {
            mutex = true;
            TuneFormStore.animationProps.animationTag = animationTag;
            TuneFormStore.animationProps.delay = delay;
            TuneFormStore.animationProps.repeat = repeat;
            setTimeout(() => {
                mutex = false;
            }, 10);
        });
    },
    updateProps(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            mutex = true;
            for (const key in settings) {
                TuneFormStore.stepProps[key] = settings[key];
            }
            setTimeout(() => {
                mutex = false;
            }, 10);
        });
    },
    setStepNavigationProps(stepNumber, displayMode) {
        return __awaiter(this, void 0, void 0, function* () {
            mutex = true;
            TuneFormStore.stepNavigationProps.stepNumber = stepNumber;
            TuneFormStore.stepNavigationProps.displayMode = displayMode;
            setTimeout(() => {
                mutex = false;
            }, 10);
        });
    },
});
Object(valtio__WEBPACK_IMPORTED_MODULE_0__["subscribe"])(TuneFormStore.stepProps, () => __awaiter(void 0, void 0, void 0, function* () {
    if (!mutex) {
        yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["pluginApi"].updateProps(Object.assign(Object.assign({}, JSON.parse(JSON.stringify(TuneFormStore.stepProps))), JSON.parse(JSON.stringify(TuneFormStore.animationProps))));
        yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["pluginApi"].updateDisplay(JSON.parse(JSON.stringify(TuneFormStore.stepNavigationProps)));
    }
}));
Object(valtio__WEBPACK_IMPORTED_MODULE_0__["subscribe"])(TuneFormStore.stepNavigationProps, () => {
    if (!mutex) {
        _rpc_api__WEBPACK_IMPORTED_MODULE_1__["pluginApi"].updateDisplay(JSON.parse(JSON.stringify(TuneFormStore.stepNavigationProps)));
    }
});
Object(valtio__WEBPACK_IMPORTED_MODULE_0__["subscribe"])(TuneFormStore.animationProps, () => {
    if (!mutex) {
        _rpc_api__WEBPACK_IMPORTED_MODULE_1__["pluginApi"].updateProps(Object.assign(Object.assign({}, JSON.parse(JSON.stringify(TuneFormStore.stepProps))), JSON.parse(JSON.stringify(TuneFormStore.animationProps))));
    }
});


/***/ }),

/***/ "./src/events.ts":
/*!***********************!*\
  !*** ./src/events.ts ***!
  \***********************/
/*! exports provided: on, once, emit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "once", function() { return once; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emit", function() { return emit; });
const eventHandlers = {};
let currentId = 0;
function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function () {
        delete eventHandlers[id];
    };
}
function once(name, handler) {
    let done = false;
    return on(name, function (...args) {
        if (done === true) {
            return;
        }
        done = true;
        handler(...args);
    });
}
const emit = typeof window === 'undefined'
    ? function (name, ...args) {
        figma.ui.postMessage([name, ...args]);
    }
    : function (name, ...args) {
        window.parent.postMessage({
            pluginMessage: [name, ...args],
        }, '*');
    };
function invokeEventHandler(name, args) {
    for (const id in eventHandlers) {
        if (eventHandlers[id].name === name) {
            eventHandlers[id].handler.apply(null, args);
        }
    }
}
if (typeof window === 'undefined') {
    figma.ui.onmessage = function (...params) {
        var _a;
        if ((_a = params[0]) === null || _a === void 0 ? void 0 : _a.jsonrpc) {
            return;
        }
        const [name, ...args] = params[0];
        invokeEventHandler(name, args);
    };
}
else {
    setTimeout(() => {
        // TODO: very dirty hack, needs fixing
        const fallback = window.onmessage;
        window.onmessage = function (...params) {
            fallback.apply(window, params);
            const event = params[0];
            if (!Array.isArray(event.data.pluginMessage)) {
                return;
            }
            const [name, ...args] = event.data.pluginMessage;
            invokeEventHandler(name, args);
        };
    }, 100);
}


/***/ }),

/***/ "./src/plugin/create.ts":
/*!******************************!*\
  !*** ./src/plugin/create.ts ***!
  \******************************/
/*! exports provided: createLesson, getLastStepOrder, separateStep, splitByColor, joinSteps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLesson", function() { return createLesson; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastStepOrder", function() { return getLastStepOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "separateStep", function() { return separateStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitByColor", function() { return splitByColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "joinSteps", function() { return joinSteps; });
/* harmony import */ var _tune_rpc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tune-rpc */ "./src/plugin/tune-rpc.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


function formatNode(node, parameters) {
    const { name, x, y, width = 40, height = 40 } = parameters;
    node.name = name;
    node.x = x;
    node.y = y;
    node.resize(width, height);
}
function fillServiceNodes(node) {
    node.fills = [
        {
            type: 'SOLID',
            color: {
                r: 196 / 255,
                g: 196 / 255,
                b: 196 / 255,
            },
        },
    ];
}
function rescaleImageNode(node, resizeParams) {
    const { maxWidth, maxHeight } = resizeParams;
    const isCorrectSize = node.width <= maxWidth && node.height <= maxHeight;
    const isCorrectType = node.type === 'FRAME' || node.type === 'RECTANGLE' || node.type === 'VECTOR';
    if (isCorrectType && !isCorrectSize) {
        const scaleFactor = Math.min(maxWidth / node.width, maxHeight / node.height);
        node.rescale(scaleFactor);
    }
    return node;
}
function createResultNode(node) {
    const resultRectangle = figma.createRectangle();
    fillServiceNodes(resultRectangle);
    const templateGroup = figma.group([resultRectangle], node);
    templateGroup.name = 'template';
    const result = figma.group([templateGroup], node);
    formatNode(result, {
        name: 'step s-multistep-result',
        x: 10,
        y: 60,
    });
}
function createLesson() {
    const node = figma.currentPage;
    if (node.children.length !== 1) {
        return;
    }
    const originalImage = node.children[0];
    const lesson = figma.createFrame();
    formatNode(lesson, {
        name: 'lesson',
        x: -461,
        y: -512,
        width: 1366,
        height: 1024,
    });
    const thumbnail = figma.createFrame();
    formatNode(thumbnail, {
        name: 'thumbnail',
        x: -901,
        y: -512,
        width: 400,
        height: 400,
    });
    // Create step
    const step = originalImage.clone();
    step.name = 'image';
    const resizedImage = rescaleImageNode(originalImage, {
        maxWidth: lesson.width - 83 * 2,
        maxHeight: lesson.height - 12 * 2,
    });
    const stepInput = figma.group([step], lesson);
    stepInput.name = 'input';
    const firstStep = figma.group([stepInput], lesson);
    formatNode(firstStep, {
        name: 'step s-multistep-brush',
        x: (lesson.width - resizedImage.width) / 2,
        y: (lesson.height - resizedImage.height) / 2,
        width: resizedImage.width,
        height: resizedImage.height,
    });
    // Create thumbnail
    const thumbnailImage = originalImage.clone();
    thumbnailImage.name = 'image';
    const resizedThumbnail = rescaleImageNode(thumbnailImage, {
        maxWidth: thumbnail.width - 35 * 2,
        maxHeight: thumbnail.height - 35 * 2,
    });
    const thumbnailGroup = figma.group([thumbnailImage], thumbnail);
    formatNode(thumbnailGroup, {
        name: 'thumbnail group',
        x: (thumbnail.width - resizedThumbnail.width) / 2,
        y: (thumbnail.height - resizedThumbnail.height) / 2,
        width: resizedThumbnail.width,
        height: resizedThumbnail.height,
    });
    // Create result
    createResultNode(lesson);
    // Create settings
    const settingsEllipse = figma.createEllipse();
    fillServiceNodes(settingsEllipse);
    formatNode(settingsEllipse, {
        name: `settings capture-color zoom-scale-2 order-layers`,
        x: 10,
        y: 10,
    });
    lesson.appendChild(settingsEllipse);
    originalImage.remove();
    Object(_tune_rpc__WEBPACK_IMPORTED_MODULE_0__["tagUnorderedSteps"])();
}
function stringifyColor(color) {
    let { r, g, b } = color;
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return `rgb(${r}, ${g}, ${b})`;
}
function nameLeafNodes(nodes) {
    let allStrokes = !nodes.find((node) => 'fills' in node && node.fills !== figma.mixed && node.fills.length > 0);
    for (let node of nodes) {
        node.name =
            'rgb-template ' + (allStrokes && nodes.length > 3 ? 'draw-line' : 'blink');
    }
}
function nameStepNode(step) {
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLeafNodes"])(step);
    let fills = leaves.filter((n) => 'fills' in n && n.fills !== figma.mixed && n.fills.length > 0);
    let strokes = leaves.filter((n) => 'strokes' in n && n.strokes.length > 0);
    let multistepType = fills.length > 0 ? 'bg' : 'brush';
    let strokeWeightsArr = strokes.map((node) => node['strokeWeight'] || 0);
    let maxWeight = Math.max(...strokeWeightsArr);
    let weight = strokes.length > 0 ? maxWeight : 25;
    step.name = `step s-multistep-${multistepType} bs-${weight}`;
}
function createStepNode(node, nodesArray, index) {
    if (!nodesArray.length) {
        return;
    }
    nameLeafNodes(nodesArray);
    const input = figma.group(nodesArray, node);
    input.name = 'input';
    const step = figma.group([input], node, index);
    nameStepNode(step);
    return step;
}
function getLastStepOrder() {
    const stepsOrder = Object(_tune_rpc__WEBPACK_IMPORTED_MODULE_0__["getSteps"])()
        .map((s) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepOrder"])(s))
        .filter((s) => s !== undefined);
    return Math.max(...stepsOrder, 0);
}
function separateStep() {
    const selection = figma.currentPage.selection;
    const leaves = selection.filter((node) => !('children' in node));
    if (!leaves.length) {
        return;
    }
    const firstParentStep = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findParentByTag"])(selection[0], 'step');
    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["isResultStep"])(firstParentStep)) {
        return;
    }
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    const index = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getNodeIndex"])(firstParentStep);
    const step = createStepNode(lesson, leaves, index);
    const resultStep = lesson.children.find((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('s-multistep-result'));
    const lastStepOrder = getLastStepOrder();
    if (lastStepOrder > 0) {
        Object(_util__WEBPACK_IMPORTED_MODULE_1__["setStepOrder"])(resultStep, lastStepOrder + 1);
        Object(_util__WEBPACK_IMPORTED_MODULE_1__["setStepOrder"])(step, lastStepOrder); // last step before result
    }
}
function addToMap(map, key, node) {
    if (!map.has(key)) {
        map.set(key, []);
    }
    map.get(key).push(node);
}
function splitByColor() {
    const selection = figma.currentPage.selection;
    if (!selection.length) {
        return;
    }
    const parentStep = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findParentByTag"])(selection[0], 'step');
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLeafNodes"])(parentStep);
    if (!parentStep || Object(_util__WEBPACK_IMPORTED_MODULE_1__["isResultStep"])(parentStep) || leaves.length <= 1) {
        return;
    }
    let fillsByColor = new Map();
    let strokesByColor = new Map();
    let unknownNodes = [];
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLeafNodes"])(parentStep).forEach((n) => {
        if ('fills' in n &&
            n.fills !== figma.mixed &&
            n.fills.length > 0 &&
            n.fills[0].type === 'SOLID') {
            addToMap(fillsByColor, stringifyColor(n.fills[0].color), n);
        }
        else if ('strokes' in n &&
            n.strokes.length > 0 &&
            n.strokes[0].type === 'SOLID') {
            addToMap(strokesByColor, stringifyColor(n.strokes[0].color), n);
        }
        else {
            unknownNodes.push(n);
        }
    });
    for (let fills of fillsByColor.values()) {
        createStepNode(lesson, fills);
    }
    for (let strokes of strokesByColor.values()) {
        createStepNode(lesson, strokes);
    }
    if (unknownNodes.length > 0) {
        createStepNode(lesson, unknownNodes);
    }
    // Make sure the result is located at the end
    const result = lesson.children.find((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('s-multistep-result'));
    if (result) {
        result.remove();
    }
    createResultNode(lesson);
    // Remove original node if there are remains
    if (!parentStep.removed) {
        parentStep.remove();
    }
    Object(_tune_rpc__WEBPACK_IMPORTED_MODULE_0__["tagUnorderedSteps"])();
}
function joinSteps() {
    const selection = figma.currentPage.selection;
    const allSteps = selection.every((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('step'));
    const steps = selection.filter((n) => !Object(_util__WEBPACK_IMPORTED_MODULE_1__["isResultStep"])(n));
    if (!allSteps || steps.length < 2) {
        return;
    }
    const inputNodes = steps
        .map((step) => step.children.filter((n) => n.name === 'input' && n.type === 'GROUP'))
        .flat();
    const leaves = inputNodes.map((n) => n.children).flat();
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    const index = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getNodeIndex"])(steps[0]);
    const firstStepOrder = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepOrder"])(steps[0]);
    const joinedStep = createStepNode(lesson, leaves, index);
    if (firstStepOrder) {
        Object(_util__WEBPACK_IMPORTED_MODULE_1__["setStepOrder"])(joinedStep, firstStepOrder);
    }
}


/***/ }),

/***/ "./src/plugin/format-rpc.ts":
/*!**********************************!*\
  !*** ./src/plugin/format-rpc.ts ***!
  \**********************************/
/*! exports provided: exportTexts, importTexts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportTexts", function() { return exportTexts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importTexts", function() { return importTexts; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
/* harmony import */ var _tune_rpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tune-rpc */ "./src/plugin/tune-rpc.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function findTextInCurrentLesson() {
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    return Object(_tune_rpc__WEBPACK_IMPORTED_MODULE_1__["stepsByOrder"])(lesson)
        .flatMap((step) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["findAll"])(step, (node) => node.type === 'TEXT'))
        .filter((node) => node.visible);
}
function getStyledSegments(node) {
    return node.getStyledTextSegments([
        'fontSize',
        'fontName',
        'fontWeight',
        'textDecoration',
        'textCase',
        'lineHeight',
        'letterSpacing',
        'fills',
        'textStyleId',
        'fillStyleId',
        'listOptions',
        'indentation',
        'hyperlink',
    ]);
}
function escape(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\|/g, '\\l')
        .replace(/\n/g, '\\n');
}
const replacements = { '\\\\': '\\', '\\n': '\n', '\\"': '"', '\\l': '|' };
function unescape(str) {
    if (str.match(/\|/) || str.match(/(?<!\\)"/)) {
        return null;
    }
    return str.replace(/\\(\\|n|"|l)/g, function (replace) {
        return replacements[replace];
    });
}
function getFormattedText(node) {
    return getStyledSegments(node)
        .map((s) => escape(s.characters))
        .join('|')
        .trimEnd();
}
function importStyledSegments(segmentTexts, node) {
    // update segments in reverse order
    for (let i = segmentTexts.length - 1; i >= 0; i--) {
        const segmentText = segmentTexts[i];
        let styles = getStyledSegments(node);
        if (segmentText.length > 0) {
            node.insertCharacters(styles[i].end, segmentText, 'BEFORE');
        }
        node.deleteCharacters(styles[i].start, styles[i].end);
    }
}
function exportTexts() {
    const texts = findTextInCurrentLesson();
    return (texts
        .map((node) => getFormattedText(node))
        .filter((str) => str.length > 0)
        // remove array duplicates
        .filter((v, i, a) => a.indexOf(v) === i));
}
function loadFonts(texts) {
    return __awaiter(this, void 0, void 0, function* () {
        const allFonts = [];
        texts.forEach((txt) => {
            getStyledSegments(txt).map((s) => {
                allFonts.push(s.fontName);
            });
        });
        const uniqueFonts = allFonts.filter((value, index, self) => index ===
            self.findIndex((t) => t.family === value.family && t.style === value.style));
        for (let font of uniqueFonts) {
            try {
                yield figma.loadFontAsync(font);
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}
function importTexts(translations) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Object.keys(translations).length === 0) {
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["displayNotification"])('Empty input');
            return;
        }
        const texts = findTextInCurrentLesson();
        yield loadFonts(texts);
        texts.forEach((txt) => {
            const formattedText = getFormattedText(txt);
            const translation = translations[formattedText];
            if (translation === undefined) {
                return;
            }
            let errorMessage;
            const oldSegments = formattedText.split('|');
            const newSegments = translation.split('|').map((str) => {
                const result = unescape(str);
                if (result === null) {
                    errorMessage = `Failed to unescape: ${str}`;
                }
                return result;
            });
            // special case: delete all text
            if (newSegments.length === 1 && newSegments[0] === '') {
                txt.characters = '';
                return;
            }
            // do not allow segments length mismatch
            if (newSegments.length !== oldSegments.length) {
                errorMessage = `Wrong segment count (${newSegments.length} ≠ ${oldSegments.length}): ${formattedText}`;
            }
            if (errorMessage) {
                Object(_util__WEBPACK_IMPORTED_MODULE_0__["displayNotification"])(errorMessage);
            }
            else {
                importStyledSegments(newSegments, txt);
            }
        });
    });
}


/***/ }),

/***/ "./src/plugin/format.ts":
/*!******************************!*\
  !*** ./src/plugin/format.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


function formatOrder(lesson) {
    if (lesson.findChild((n) => !!Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).find((t) => /^o-/.test(t)))) {
        console.log('Found o-tag. formatOrder abort.');
        return;
    }
    let settings = lesson.findChild((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('settings'));
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["addTag"])(settings, 'order-layers');
    const layerRegex = /^(s-multistep-brush-|s-multistep-bg-)(\d+)$/;
    const steps = lesson.findChildren((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('step') && !Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('s-multistep-result'));
    const result = lesson.findChild((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('s-multistep-result'));
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["addTag"])(result, `o-${steps.length + 1}`);
    steps.reverse().forEach((step, order) => {
        let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step);
        const layerTag = tags.find((t) => layerRegex.test(t));
        let layer = 4;
        if (layerTag) {
            layer = parseInt(layerRegex.exec(layerTag)[2]);
            tags = tags.filter((t) => !layerRegex.test(t));
            tags.splice(1, 0, /^(s-multistep-brush|s-multistep-bg)/.exec(layerTag)[1]);
        }
        step.setPluginData('layer', JSON.stringify(layer));
        tags.push(`o-${order + 1}`);
        step.name = tags.join(' ');
    });
    let sortedSteps = steps.sort((a, b) => JSON.parse(b.getPluginData('layer')) -
        JSON.parse(a.getPluginData('layer')));
    sortedSteps.forEach((s) => lesson.insertChild(1, s));
}
function autoFormat() {
    const thumbPage = figma.root.children.find((p) => p.name.toUpperCase() == 'THUMBNAILS');
    if (thumbPage) {
        figma.root.children.forEach((p) => {
            const thumbnailFrame = thumbPage.children.find((t) => t.name == p.name);
            if (p.children.find((t) => t.name == 'thumbnail') || !thumbnailFrame) {
                return;
            }
            const clone = thumbnailFrame.clone();
            clone.resize(400, 400);
            clone.name = 'thumbnail';
            p.appendChild(clone);
        });
    }
    figma.root.children.forEach((p) => {
        const oldLessonFrame = p.children.find((t) => t.name == p.name);
        if (oldLessonFrame) {
            oldLessonFrame.name = 'lesson';
        }
        const thumbnailFrame = p.children.find((t) => t.name == 'thumbnail');
        const lessonFrame = p.children.find((t) => t.name == 'lesson');
        if (!thumbnailFrame || !lessonFrame) {
            return;
        }
        thumbnailFrame.x = lessonFrame.x - 440;
        thumbnailFrame.y = lessonFrame.y;
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(figma.root, (node) => /^settings/.test(node.name)).forEach((n) => {
        n.resize(40, 40);
        n.x = 10;
        n.y = 10;
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(figma.root, (node) => node.type == 'TEXT').forEach((n) => {
        Object(_util__WEBPACK_IMPORTED_MODULE_1__["addTag"])(n, 'no-mirror');
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(figma.root, (node) => /^step s-multistep-result/.test(node.name)).forEach((n) => {
        n.children[0].name = 'template';
        n.children[0].children[0].name = '/ignore';
        n.resize(40, 40);
        n.x = 10;
        n.y = 60;
    });
}
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('autoFormat', autoFormat);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('formatOrder', () => formatOrder(Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])()));


/***/ }),

/***/ "./src/plugin/index.ts":
/*!*****************************!*\
  !*** ./src/plugin/index.ts ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create */ "./src/plugin/create.ts");
/* harmony import */ var _tune__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tune */ "./src/plugin/tune.ts");
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./format */ "./src/plugin/format.ts");
/* harmony import */ var _linter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./linter */ "./src/plugin/linter.ts");
/* harmony import */ var _publish__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./publish */ "./src/plugin/publish.ts");
/* harmony import */ var _rpc_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../rpc-api */ "./src/rpc-api.ts");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./meta */ "./src/plugin/meta.ts");








figma.showUI(__html__);
figma.ui.resize(340, 470);
console.clear();
figma.on('selectionchange', () => {
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["selectionChanged"])();
});
figma.on('currentpagechange', () => {
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["currentPageChanged"])();
    Object(_meta__WEBPACK_IMPORTED_MODULE_6__["setMetaTagsFromNodesToStore"])();
});
setTimeout(() => {
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["updateDisplay"])({ displayMode: 'all', stepNumber: 1 }, figma.currentPage);
}, 1500);


/***/ }),

/***/ "./src/plugin/linter.ts":
/*!******************************!*\
  !*** ./src/plugin/linter.ts ***!
  \******************************/
/*! exports provided: ErrorLevel, selectError, formatErrors, lintPage, lintCourse, saveErrors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorLevel", function() { return ErrorLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectError", function() { return selectError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatErrors", function() { return formatErrors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lintPage", function() { return lintPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lintCourse", function() { return lintCourse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveErrors", function() { return saveErrors; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
/* harmony import */ var _tune__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tune */ "./src/plugin/tune.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


let errors = [];
let zoomScale = 1;
let maxBs = 12.8;
let order = 'steps';
var ErrorLevel;
(function (ErrorLevel) {
    ErrorLevel[ErrorLevel["ERROR"] = 0] = "ERROR";
    ErrorLevel[ErrorLevel["WARN"] = 1] = "WARN";
    ErrorLevel[ErrorLevel["INFO"] = 2] = "INFO";
})(ErrorLevel || (ErrorLevel = {}));
function selectError(index) {
    var _a;
    if ((_a = errors[index]) === null || _a === void 0 ? void 0 : _a.page) {
        figma.currentPage = errors[index].page;
    }
    setTimeout(() => {
        var _a;
        if ((_a = errors[index]) === null || _a === void 0 ? void 0 : _a.node) {
            errors[index].page.selection = [errors[index].node];
        }
    }, 0);
}
function formatErrors() {
    return __awaiter(this, void 0, void 0, function* () {
        const savedErrors = yield figma.clientStorage.getAsync('errorsForPrint');
        let sortedErrors = errors
            .sort((a, b) => a.level - b.level)
            .map((e) => {
            var _a, _b, _c;
            const stepNumber = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(e.node, 'step')) || Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(e.node);
            return {
                ignore: e.ignore,
                pageName: (_a = e.page) === null || _a === void 0 ? void 0 : _a.name,
                nodeName: (_b = e.node) === null || _b === void 0 ? void 0 : _b.name,
                nodeType: (_c = e.node) === null || _c === void 0 ? void 0 : _c.type,
                error: e.error,
                level: e.level,
                stepNumber,
            };
        });
        if (savedErrors) {
            sortedErrors = sortedErrors.map((e) => {
                const savedError = savedErrors.find((s) => s.pageName === e.pageName &&
                    s.nodeName === e.nodeName &&
                    s.error === e.error);
                if (savedError) {
                    e.ignore = savedError.ignore;
                }
                return e;
            });
        }
        selectError(0);
        return sortedErrors;
    });
}
function assert(val, error, page, node, level = ErrorLevel.ERROR) {
    if (!val) {
        errors.push({ node, page, error, level });
    }
    return val;
}
function deepNodes(node) {
    if (!node.children) {
        return [node];
    }
    return node.children.flatMap((n) => deepNodes(n));
}
function countDisconnectedSegments(node) {
    if (!node.vectorNetwork)
        return false;
    const { segments } = node.vectorNetwork;
    const starts = segments.map((segment) => segment.start);
    const ends = segments.map((segment) => segment.end);
    const disconnectedStartSegments = starts.filter((startValue) => !ends.includes(startValue));
    const disconnectedEndSegments = ends.filter((endValue) => !starts.includes(endValue));
    const disconnectedSegmentsCount = disconnectedStartSegments.length + disconnectedEndSegments.length;
    return disconnectedSegmentsCount > 2;
}
function lintFills(node, page, fills) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    const drawLineTag = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^draw-line/);
    fills.forEach((f) => {
        assert(f.visible, 'Fill must be visible', page, node);
        assert(f.type == 'SOLID' || !rgbt, 'Fill must be solid', page, node);
        assert(!drawLineTag || !rgbt, 'Fills cant be used with draw-line tag', page, node);
        if (f.type === 'IMAGE') {
            assert(f.opacity == 1 || !rgbt, 'Image fill must be opaque', page, node, ErrorLevel.INFO);
        }
    });
}
function lintStrokes(node, page, strokes) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    const drawLineTag = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^draw-line/);
    strokes.forEach((s) => {
        assert(s.visible, 'Stroke must be visible', page, node);
        assert(s.type == 'SOLID' || !rgbt, 'Stroke must be solid', page, node);
        if (s.type === 'IMAGE') {
            assert(s.opacity == 1 || !rgbt, 'Image stroke must be opaque', page, node, ErrorLevel.INFO);
        }
    });
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)) || !rgbt, `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node);
    assert(node.strokeAlign == 'CENTER' || !rgbt || !strokes.length, `Stroke align must be 'CENTER' but is '${String(node.strokeAlign)}'`, page, node);
    assert(!strokes.length || node.strokeJoin == 'ROUND' || !rgbt, `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
    assert(!drawLineTag || !countDisconnectedSegments(node), 'Split vector or change animation', page, node);
}
const validVectorTags = /^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^[vV]ector$|^\d+$|^Ellipse$|^Rectangle$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$/;
function lintVector(page, node) {
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    const anim = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^draw-line$|^blink$/) ||
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(node, 'draw-line') ||
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(node, 'blink');
    assert(node.opacity == 1 || !rgbt, 'Must be opaque', page, node, ErrorLevel.INFO);
    assert(node.visible, 'Must be visible', page, node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(validVectorTags.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node);
    });
    let fills = node.fills;
    let strokes = node.strokes;
    assert(!fills.length || !strokes.length || !rgbt, 'Should not have fill+stroke', page, node, ErrorLevel.WARN);
    lintStrokes(node, page, strokes);
    lintFills(node, page, fills);
    assert(!rgbt || !!anim, "Must have 'blink' or 'draw-line'", page, node, ErrorLevel.ERROR); // every rgbt must have animation
}
const validGroupTags = /^\/|^blink$|^rgb-template$|^d\d+$|^r\d+$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$|^draw-line$|^\d+$|^[gG]roup$/;
function lintGroup(page, node) {
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    tags.forEach((tag) => {
        assert(validGroupTags.test(tag), `Tag '${tag}' unknown`, page, node);
    });
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    const anim = tags.find((s) => /^blink$/.test(s)) || Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(node, 'blink');
    assert(!/BOOLEAN_OPERATION/.test(node.type), 'Notice BOOLEAN_OPERATION', page, node, ErrorLevel.INFO);
    assert(node.opacity == 1, 'Must be opaque', page, node, ErrorLevel.WARN);
    assert(node.visible, 'Must be visible', page, node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    assert(!rgbt || !!anim, "Must have 'blink'", page, node); // every rgbt must have animation
}
function lintInput(page, node) {
    if (!assert(node.type == 'GROUP', "Must be 'GROUP' type'", page, node)) {
        return;
    }
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    assert(/^input$|^background$/.test(node.name), "Must be 'input'", page, node);
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["descendants"])(node).forEach((v) => {
        if (/GROUP|BOOLEAN_OPERATION|FRAME/.test(v.type)) {
            lintGroup(page, v);
        }
        else if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
            lintVector(page, v);
        }
        else {
            assert(false, "Must be 'FRAME/GROUP/VECTOR/RECTANGLE/ELLIPSE/TEXT' type", page, v);
        }
    });
}
const validSettingsTags = /^\/|^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$|^meta-duration-\d+$|^meta-type-\w+$/;
function lintSettings(page, node) {
    var _a;
    assert(node.type == 'ELLIPSE', "Must be 'ELLIPSE' type'", page, node);
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    tags.forEach((tag) => {
        assert(validSettingsTags.test(tag), `Tag '${tag}' unknown`, page, node);
    });
    if (tags.find((tag) => /^order-layers$/.test(tag))) {
        order = 'layers';
    }
    else {
        order = 'steps';
    }
    zoomScale = parseInt(((_a = tags.find((s) => /^zoom-scale-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace('zoom-scale-', '')) ||
        '1');
    assert(zoomScale >= 1 && zoomScale <= 5, `Must be 1 <= zoom-scale <= 5 (${zoomScale})`, page, node);
}
const validStepTags = /^\/|^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-continue$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-(\d+,?)+$|^ss-\d+$|^bs-\d+$|^o-\d+$|^allow-undo$|^share-button$|^clear-before$|^tool-picker-(true|false)$|^brush-color-[0-9a-fA-F]{8}$/;
function lintStep(page, step) {
    var _a, _b, _c;
    if (!assert(step.type == 'GROUP', "Must be 'GROUP' type'", page, step)) {
        return;
    }
    assert(step.opacity == 1, 'Must be opaque', page, step);
    assert(step.visible, 'Must be visible', page, step);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step);
    tags.forEach((tag) => {
        assert(validStepTags.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, step);
        // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);
    });
    const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s));
    const brush = tags.find((s) => /^s-multistep-brush$|^s-multistep-brush-\d+$/.test(s));
    const ss = parseInt((_a = tags.find((s) => /^ss-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace('ss-', ''));
    const o = tags.find((s) => /^o-\d+$/.test(s));
    const bs = parseInt((_b = tags.find((s) => /^bs-\d+$/.test(s))) === null || _b === void 0 ? void 0 : _b.replace('bs-', ''));
    const brushName = (_c = tags
        .find((s) => /^brush-name-\w+$/.test(s))) === null || _c === void 0 ? void 0 : _c.replace('brush-name-', '');
    const terminalNodes = Object(_util__WEBPACK_IMPORTED_MODULE_0__["descendants"])(step).filter((v) => v['children'] == undefined);
    const maxSize = terminalNodes.reduce((acc, v) => {
        return Math.max(acc, v.width, v.height);
    }, 0);
    maxBs = Math.max(bs ? bs : maxBs, maxBs);
    assert(!ss || ss >= 20 || maxSize <= 100, `Should not use ss<20 with long lines. Consider using bg template. ${maxSize}>100`, page, step, ErrorLevel.INFO);
    assert(!ss || ss >= 20 || terminalNodes.length <= 8, `Should not use ss<20 with too many lines. Consider using bg template. ${terminalNodes.length}>8`, page, step, ErrorLevel.INFO);
    assert(!bs || bs >= 10 || brushName == 'pencil', `Should not use bs<10. ${bs}<10`, page, step, ErrorLevel.INFO);
    assert(!ss || ss >= 15, 'ss must be >= 15', page, step);
    assert(!ss || !bs || ss > bs, 'ss must be > bs', page, step);
    assert(!bs || bs <= zoomScale * 12.8, `bs must be <= ${zoomScale * 12.8} for this zoom-scale`, page, step);
    assert(!bs || bs >= zoomScale * 0.44, `bs must be >= ${zoomScale * 0.44} for this zoom-scale`, page, step);
    assert(!o || order == 'layers', `${o} must be used only with settings order-layers`, page, step);
    assert(order !== 'layers' || !!o, 'Must have o-N order number', page, step);
    const sf = step.findOne((n) => {
        var _a;
        return (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('rgb-template') ||
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(n, 'rgb-template')) &&
            ((_a = n.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0;
    });
    const ffs = step.findAll((n) => (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('rgb-template') ||
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(n, 'rgb-template')) &&
        n.fills &&
        n.fills[0]);
    const bigFfs = ffs.filter((n) => n.width > 27 || n.height > 27);
    const ff = ffs.length > 0;
    assert(!(bg && ss && sf), 'Should not use bg+ss (stroke present)', page, step, ErrorLevel.INFO);
    assert(!(bg && ss && !sf), 'Should not use bg+ss (stroke not present)', page, step, ErrorLevel.WARN);
    assert(!bg || ff, "bg step shouldn't be used without filled-in vectors", page, step, ErrorLevel.INFO);
    assert(!brush || bigFfs.length == 0, "brush step shouldn't be used with filled-in vectors (size > 27)", page, step, ErrorLevel.INFO);
    step.children.forEach((n) => {
        if (/^input$|^background$/.test(n.name)) {
            lintInput(page, n);
        }
        else if (n.name === 'template') {
            // lint template
        }
        else {
            assert(false, "Must be 'input', 'background' or 'template'", page, n);
        }
    });
    const blinkNodes = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findAll"])(step, (n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).find((t) => /^blink$/.test(t)) !== undefined).flatMap(deepNodes);
    const filledNode = blinkNodes.find((n) => n.fills[0]);
    assert(blinkNodes.length == 0 || !!filledNode || blinkNodes.length > 3, 'Should use draw-line if < 4 lines', page, blinkNodes[0], ErrorLevel.INFO);
}
function lintTaskFrame(page, node) {
    if (!assert(node.type == 'FRAME', "Must be 'FRAME' type", page, node)) {
        return;
    }
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    assert(node.width == 1366 && node.height == 1024, 'Must be 1366x1024', page, node);
    assert(!!node.children.find((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('s-multistep-result')), "Must have 's-multistep-result' child", page, node, ErrorLevel.WARN);
    let settings = node.children.find((n) => n.name.startsWith('settings'));
    if (settings) {
        lintSettings(page, settings);
    }
    let orderNumbers = {};
    for (let step of node.children) {
        const tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step);
        tags.forEach((tag) => {
            const found = /^o-(\d+)$/.exec(tag);
            if (!found) {
                return;
            }
            const o = found[1];
            assert(!orderNumbers[o], `Must have unique ${tag} values`, page, step);
            if (o) {
                orderNumbers[o] = 1;
            }
        });
    }
    for (let step of node.children) {
        if (step.name.startsWith('step')) {
            lintStep(page, step);
        }
        else if (!step.name.startsWith('settings')) {
            assert(false, "Must be 'settings' or 'step'", page, step);
        }
    }
    // assert(
    //   maxBs > (zoomScale - 1) * 12.8,
    //   `zoom-scale ${zoomScale} must be ${Math.ceil(
    //     maxBs / 12.8
    //   )} for max bs ${maxBs} used`,
    //   page,
    //   node
    // )
}
function lintThumbnail(page, node) {
    if (!assert(node.type == 'FRAME', "Must be 'FRAME' type", page, node)) {
        return;
    }
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.width == 400 && node.height == 400, 'Must be 400x400', page, node);
}
function lintPage(currentPage, appendErrors) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!appendErrors) {
            errors = [];
            const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
            yield Object(_tune__WEBPACK_IMPORTED_MODULE_1__["deleteTmp"])();
            if (lesson) {
                Object(_tune__WEBPACK_IMPORTED_MODULE_1__["displayAll"])(lesson, true);
            }
        }
        const page = currentPage ? currentPage : figma.currentPage;
        if (/^\/|^INDEX$/.test(page.name)) {
            return;
        }
        Object(_tune__WEBPACK_IMPORTED_MODULE_1__["updateDisplay"])({ displayMode: 'all', stepNumber: 1 }, page);
        if (!assert(/^[a-z\-0-9]+$/.test(page.name), `Page name '${page.name}' must match [a-z\\-0-9]+. Use slash to /ignore.`, page)) {
            return;
        }
        assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, "Must contain exactly 1 'thumbnail'", page);
        assert(page.children.filter((s) => /^lesson$/.test(s.name)).length == 1, "Must contain exactly 1 'lesson'", page);
        for (let node of page.children) {
            if (node.name == 'lesson') {
                lintTaskFrame(page, node);
            }
            else if (node.name == 'thumbnail') {
                lintThumbnail(page, node);
            }
            else {
                assert(/^\//.test(node.name), "Must be 'thumbnail' or 'lesson'. Use slash to /ignore.", page, node, ErrorLevel.WARN);
            }
        }
        return formatErrors();
    });
}
function lintIndex(page) {
    if (!assert(page.children.length == 1, 'Index page must contain exactly 1 element', page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, "Must contain exactly 1 'thumbnail'", page);
    lintThumbnail(page, page.children[0]);
}
function lintCourse() {
    return __awaiter(this, void 0, void 0, function* () {
        errors = [];
        const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
        if (lesson) {
            Object(_tune__WEBPACK_IMPORTED_MODULE_1__["displayAll"])(lesson, true);
        }
        assert(/^COURSE-[a-z\-0-9]+$/.test(figma.root.name), `Course name '${figma.root.name}' must match COURSE-[a-z\\-0-9]+`);
        const index = figma.root.children.find((p) => p.name == 'INDEX');
        if (assert(!!index, "Must have 'INDEX' page")) {
            lintIndex(index);
        }
        // find all non-unique named pages
        const nonUnique = figma.root.children.filter((p, i, a) => a.findIndex((p2) => p2.name == p.name) != i);
        nonUnique.forEach((p) => assert(false, `Page name '${p.name}' must be unique`, p));
        for (let page of figma.root.children) {
            lintPage(page, true);
        }
        return formatErrors();
    });
}
function saveErrors(errorsForPrint) {
    return figma.clientStorage.setAsync('errorsForPrint', errorsForPrint);
}


/***/ }),

/***/ "./src/plugin/meta.ts":
/*!****************************!*\
  !*** ./src/plugin/meta.ts ***!
  \****************************/
/*! exports provided: getSettingsNode, setMetaTags, getMetaTags, setMetaTagsFromNodesToStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSettingsNode", function() { return getSettingsNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setMetaTags", function() { return setMetaTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMetaTags", function() { return getMetaTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setMetaTagsFromNodesToStore", function() { return setMetaTagsFromNodesToStore; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
/* harmony import */ var _rpc_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../rpc-api */ "./src/rpc-api.ts");


const getSettingsNode = (lesson) => {
    let objectToSearch = lesson;
    if (!objectToSearch) {
        objectToSearch = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    }
    return Object(_util__WEBPACK_IMPORTED_MODULE_0__["findChildrenByTag"])(objectToSearch, "settings")[0];
};
const setMetaTags = (metaProps) => {
    const settings = getSettingsNode();
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(settings).filter(tag => !tag.startsWith('meta-'));
    if (metaProps.type.startsWith("meta-"))
        tags.push(`${metaProps.type}`);
    if (metaProps.duration && metaProps.duration !== "0")
        tags.push(`meta-duration-${metaProps.duration}`);
    settings.name = tags.join(' ');
};
const getMetaTags = (lesson) => {
    const settings = getSettingsNode(lesson);
    let metaTags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(settings).filter(tag => tag.startsWith('meta-'));
    let metaObject = {};
    metaTags.forEach(el => {
        if (el.startsWith("meta-duration-")) {
            const duration = el.replace("meta-duration-", "");
            metaObject = Object.assign(Object.assign({}, metaObject), { duration: parseInt(duration) });
        }
        if (el.startsWith("meta-type-")) {
            metaObject = Object.assign(Object.assign({}, metaObject), { type: el });
        }
    });
    return metaObject;
};
const setMetaTagsFromNodesToStore = () => {
    var _a;
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    const metaTags = getMetaTags(lesson);
    const props = {
        type: metaTags.type || "",
        duration: ((_a = metaTags.duration) === null || _a === void 0 ? void 0 : _a.toString()) || ""
    };
    _rpc_api__WEBPACK_IMPORTED_MODULE_1__["uiApi"].setMetaProps(props);
};


/***/ }),

/***/ "./src/plugin/publish.ts":
/*!*******************************!*\
  !*** ./src/plugin/publish.ts ***!
  \*******************************/
/*! exports provided: exportLesson, exportCourse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportLesson", function() { return exportLesson; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportCourse", function() { return exportCourse; });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./meta */ "./src/plugin/meta.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



function generateTranslationsCode() {
    const courseName = figma.root.name.replace(/COURSE-/, '');
    let tasks = '';
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == 'INDEX') {
            continue;
        }
        tasks += `"task-name ${courseName}/${page.name}" = "${Object(_util__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(page.name.split('-').join(' '))}";\n`;
    }
    return `
"course-name ${courseName}" = "${Object(_util__WEBPACK_IMPORTED_MODULE_1__["capitalize"])(courseName.split('-').join(' '))}";
"course-description ${courseName}" = "In this course:
    • 
    • 
    • ";
${tasks}
`;
}
function prepareCourseForPublishing() {
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(figma.root, (node) => node.name.startsWith('tmp-')).forEach((node) => {
        node.remove();
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(figma.root, (node) => !!node).forEach((node) => {
        if ('visible' in node) {
            node.visible = true;
        }
    });
}
function exportLesson(page, outlineText) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!page) {
            page = figma.currentPage;
        }
        const index = figma.root.children.indexOf(page);
        const lessonNode = page.children.find((f) => f.name == 'lesson');
        const thumbnailNode = page.children.find((f) => f.name == 'thumbnail');
        if (!lessonNode) {
            return;
        }
        const file = yield lessonNode.exportAsync({
            format: 'SVG',
            svgOutlineText: outlineText,
            svgIdAttribute: true,
        });
        const thumbnail = yield thumbnailNode.exportAsync({
            format: 'PNG',
            constraint: {
                type: 'WIDTH',
                value: 600,
            },
        });
        const meta = Object(_meta__WEBPACK_IMPORTED_MODULE_2__["getMetaTags"])(lessonNode);
        console.log('META TAGS FOR LESSON', meta);
        const lessonObject = Object.assign({ coursePath: figma.root.name.replace('COURSE-', ''), path: page.name, file,
            thumbnail,
            index }, meta);
        console.log('LESSON OBJECT', lessonObject);
        return lessonObject;
    });
}
function exportCourse(outlineText) {
    return __awaiter(this, void 0, void 0, function* () {
        prepareCourseForPublishing();
        const [lessons, thumbnail] = yield Promise.all([
            Promise.all(figma.root.children
                .filter((page) => page.name != 'INDEX')
                .map((page) => exportLesson(page, outlineText))),
            figma.root.children
                .find((page) => page.name == 'INDEX')
                .exportAsync({
                format: 'PNG',
                constraint: {
                    type: 'WIDTH',
                    value: 600,
                },
            }),
        ]);
        return {
            path: figma.root.name.replace('COURSE-', ''),
            lessons,
            thumbnail,
        };
    });
}
function generateSwiftCode() {
    const courseName = figma.root.name.replace(/COURSE-/, '');
    let swiftCourseName = courseName
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
    swiftCourseName =
        swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1);
    let tasks = '';
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == 'INDEX') {
            continue;
        }
        tasks += `Task(path: "${courseName}/${page.name}", pro: true),\n`;
    }
    return `
    let ${swiftCourseName} = Course(
    path: "${courseName}",
    author: REPLACE,
    tasks: [
${tasks}    ])
`;
}
function generateCode() {
    const code = generateSwiftCode() + generateTranslationsCode();
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["print"])(code);
}
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('generateCode', generateCode);


/***/ }),

/***/ "./src/plugin/tune-rpc.ts":
/*!********************************!*\
  !*** ./src/plugin/tune-rpc.ts ***!
  \********************************/
/*! exports provided: stepsByOrder, getSteps, setStepsOrder, tagUnorderedSteps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stepsByOrder", function() { return stepsByOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSteps", function() { return getSteps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStepsOrder", function() { return setStepsOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tagUnorderedSteps", function() { return tagUnorderedSteps; });
/* harmony import */ var _create__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create */ "./src/plugin/create.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


function getOrder(step) {
    const otag = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).find((t) => t.startsWith('o-')) || '';
    const o = parseInt(otag.replace('o-', ''));
    return isNaN(o) ? 9999 : o;
}
function stepsByOrder(lesson) {
    return lesson.children
        .filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('step'))
        .sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
}
function getPaintColor(paint) {
    if (paint.type === 'SOLID') {
        let { r, g, b } = paint.color;
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        return { r, g, b, a: 1 };
    }
    else {
        return { r: 166, g: 166, b: 166, a: 1 };
    }
}
function displayColor({ r, g, b, a }) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function getColors(node) {
    const defaultColor = { r: 0, g: 0, b: 0, a: 0 }; // transparent = default color
    let fills = defaultColor;
    let strokes = defaultColor;
    const leaf = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLeafNodes"])(node)[0];
    if ('fills' in leaf && leaf.fills !== figma.mixed && leaf.fills.length > 0) {
        fills = getPaintColor(leaf.fills[0]);
    }
    if ('strokes' in leaf && leaf.strokes.length > 0) {
        strokes = getPaintColor(leaf.strokes[0]);
    }
    return {
        fillsColor: displayColor(fills),
        strokesColor: displayColor(strokes),
    };
}
function getSteps() {
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    return stepsByOrder(lesson).map((step) => {
        return {
            id: step.id,
            name: step.name,
            colors: getColors(step),
            layerNumber: lesson.children.indexOf(step) + 1,
        };
    });
}
function setStepsOrder(steps) {
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    steps.forEach((step, i) => {
        const s = lesson.findOne((el) => el.id == step.id);
        if (s) {
            Object(_util__WEBPACK_IMPORTED_MODULE_1__["setStepOrder"])(s, i + 1);
        }
    });
}
function tagUnorderedSteps() {
    let startWith = Object(_create__WEBPACK_IMPORTED_MODULE_0__["getLastStepOrder"])() + 1;
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    stepsByOrder(lesson)
        .filter((s) => !Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(s).some((t) => t.startsWith('o-')))
        .forEach((step, i) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["setStepOrder"])(step, i + startWith));
}


/***/ }),

/***/ "./src/plugin/tune.ts":
/*!****************************!*\
  !*** ./src/plugin/tune.ts ***!
  \****************************/
/*! exports provided: deleteTmp, displayAll, selectNextBrushStep, updateDisplay, updateProps, currentPageChanged, selectionChanged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTmp", function() { return deleteTmp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayAll", function() { return displayAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectNextBrushStep", function() { return selectNextBrushStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDisplay", function() { return updateDisplay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateProps", function() { return updateProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currentPageChanged", function() { return currentPageChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectionChanged", function() { return selectionChanged; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
/* harmony import */ var _rpc_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../rpc-api */ "./src/rpc-api.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function getOrder(step) {
    const otag = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).find((t) => t.startsWith('o-')) || '';
    const o = parseInt(otag.replace('o-', ''));
    return isNaN(o) ? 9999 : o;
}
function getTag(step, tag) {
    const v = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).find((t) => t.startsWith(tag));
    return v ? v.replace(tag, '') : null;
}
function stepsByOrder(lesson) {
    return lesson.children
        .filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('step'))
        .sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
}
function showOnlyRGBTemplate(node) {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node).includes('settings')) {
        node.visible = false;
        return;
    }
    if (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node).includes('rgb-template') &&
        /GROUP|BOOLEAN_OPERATION/.test(node.type)) {
        return;
    }
    node.children.forEach((v) => {
        if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
            return showOnlyRGBTemplate(v);
        }
        if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type) &&
            !Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(v).includes('rgb-template')) {
            return (v.visible = false);
        }
    });
}
let lastMode = 'all';
let lastPage = null;
let lastStepNumber = 1;
function deleteTmp(page) {
    const p = page || figma.currentPage;
    p.findAll((el) => el.name.startsWith('tmp-')).forEach((el) => el.remove());
}
function displayAllElements(lesson) {
    const l = lesson || figma.currentPage;
    l.findAll((el) => (el.visible = true));
}
function displayAll(lesson, setLastMode) {
    const currentLesson = lesson || Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    deleteTmp();
    currentLesson.children.forEach((step) => {
        step.visible = true;
    });
    if (setLastMode) {
        lastMode = 'all';
    }
}
function displayTemplate(lesson, step) {
    lesson.children.forEach((step) => {
        step.visible = false;
    });
    const input = step.findChild((g) => g.name == 'input');
    if (!input) {
        return;
    }
    let template = input.clone();
    template.name = 'tmp-template';
    template
        .findAll((el) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(el).includes('rgb-template'))
        .map((el) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(el))
        .flat()
        .filter((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type))
        .forEach((el) => {
        const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50;
        const ss = parseInt(getTag(step, 'ss-')) || defaultWeight;
        if (el.strokes.length > 0 && el.fills.length > 0) {
            const green = el.clone();
            green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }];
            green.strokeWeight += ss;
            green.name = 'rgb-template green ' + el.name;
            template.appendChild(green);
            green.relativeTransform = el.relativeTransform;
        }
        if (el.strokes.length > 0 && !el.fills.length) {
            const green = el.clone();
            green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }];
            green.strokeWeight = ss * 1.1;
            green.name = 'rgb-template green ' + el.name;
            template.appendChild(green);
            green.relativeTransform = el.relativeTransform;
        }
        if (el.fills.length > 0 && !el.strokes.length) {
            const green = el.clone();
            green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }];
            green.strokeWeight = ss;
            green.name = 'rgb-template green ' + el.name;
            template.appendChild(green);
            green.relativeTransform = el.relativeTransform;
        }
        if (el.strokes.length > 0) {
            const blue = el.clone();
            blue.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            blue.strokeWeight = ss;
            template.appendChild(blue);
            blue.relativeTransform = el.relativeTransform;
            const pink = el.clone();
            pink.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }];
            pink.strokeWeight = 2;
            pink.name = 'rgb-template pink ' + el.name;
            template.appendChild(pink);
            pink.relativeTransform = el.relativeTransform;
        }
        if (el.fills.length > 0) {
            const fillsBlue = el.clone();
            fillsBlue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            fillsBlue.name = 'rgb-template blue ' + el.name;
            template.appendChild(fillsBlue);
            fillsBlue.relativeTransform = el.relativeTransform;
        }
    });
    showOnlyRGBTemplate(template);
    lesson.appendChild(template);
    template.relativeTransform = input.relativeTransform;
    const templateGroup = step.findChild((g) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(g).includes('template'));
    if (templateGroup) {
        step.visible = true;
        input.visible = false;
        templateGroup.visible = true;
    }
}
function displayBrushSize(lesson, step) {
    const defaultBS = getTag(step, 's-') == 'multistep-bg' ? 12.8 : 10;
    const bs = parseInt(getTag(step, 'bs-')) || defaultBS;
    const smallLine = figma.createLine();
    smallLine.name = 'smallLine';
    smallLine.resize(300, 0);
    smallLine.strokes = [{ type: 'SOLID', color: { r: 0, g: 0.8, b: 0 } }];
    smallLine.strokeWeight = bs / 3;
    smallLine.strokeCap = 'ROUND';
    smallLine.strokeAlign = 'CENTER';
    smallLine.y = smallLine.strokeWeight / 2;
    const mediumLine = smallLine.clone();
    mediumLine.name = 'mediumLine';
    mediumLine.opacity = 0.2;
    mediumLine.strokeWeight = bs;
    mediumLine.y = mediumLine.strokeWeight / 2;
    const bigLine = smallLine.clone();
    bigLine.name = 'bigLine';
    bigLine.opacity = 0.1;
    bigLine.strokeWeight = bs + Math.pow(bs, 1.4) * 0.8;
    bigLine.y = bigLine.strokeWeight / 2;
    const group = figma.group([bigLine, mediumLine, smallLine], lesson.parent);
    group.name = 'tmp-bs';
    group.x = lesson.x;
    group.y = lesson.y - 80;
}
function getBrushSize(step) {
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(step);
    const strokes = leaves.filter((n) => 'strokes' in n && n.strokes.length > 0);
    const strokeWeightsArr = strokes.map((node) => node['strokeWeight'] || 0);
    const maxWeight = Math.max(...strokeWeightsArr);
    return strokes.length > 0 ? maxWeight : 25;
}
function getClearLayerNumbers(step) {
    const prefix = 'clear-layer-';
    const clearLayersStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).filter((tag) => tag.startsWith(prefix));
    if (clearLayersStep.length !== 1) {
        return [];
    }
    const layerNumbers = clearLayersStep[0]
        .slice(prefix.length)
        .split(',')
        .map(Number);
    return layerNumbers;
}
function collectLayerNumbersToClear(lesson, step) {
    const currentStepOrder = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(step);
    const layersStepOrderTags = lesson.children.map((s) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(s));
    const clearLayerNumbers = lesson.children.reduce((acc, layer) => {
        if (layer.type !== 'GROUP' || Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(layer) > currentStepOrder) {
            return acc;
        }
        if (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(layer).includes('clear-before')) {
            // calculate step order tags and convert to layers to clear
            const stepsToClear = [...Array(Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(layer)).keys()].slice(1);
            stepsToClear.forEach((stepOrder) => {
                if (layersStepOrderTags.includes(stepOrder)) {
                    acc.add(layersStepOrderTags.indexOf(stepOrder));
                }
            });
        }
        getClearLayerNumbers(layer).forEach((idx) => acc.add(idx));
        return acc;
    }, new Set());
    return clearLayerNumbers;
}
function selectNextBrushStep(stepNumber) {
    let lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    const page = figma.currentPage;
    if (!lesson) {
        return;
    }
    let step;
    let steps = stepsByOrder(lesson);
    const nextStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findNextBrushStep"])(steps.slice(stepNumber));
    if (nextStep) {
        figma.currentPage.selection = [nextStep];
        return;
    }
    const lessons = figma.root.children;
    step = lessons
        .slice(lessons.indexOf(lesson.parent) + 1)
        .reduce((accumulator, newLesson) => {
        if (accumulator) {
            return accumulator;
        }
        const lessonFrame = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLessonGroup"])(newLesson);
        if (!lessonFrame) {
            return null;
        }
        const newSteps = stepsByOrder(lessonFrame);
        const newNextStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findNextBrushStep"])(newSteps);
        if (newNextStep) {
            deleteTmp(page);
            figma.currentPage = newLesson;
            return newNextStep;
        }
        return null;
    }, null);
    if (step) {
        figma.currentPage.selection = [step];
    }
}
function updateDisplay(settings, page) {
    return __awaiter(this, void 0, void 0, function* () {
        page = page || figma.currentPage;
        lastMode = settings.displayMode;
        lastStepNumber = settings.stepNumber;
        const { displayMode, stepNumber } = settings;
        const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLessonGroup"])(page);
        if (!lesson) {
            return;
        }
        const step = stepsByOrder(lesson)[stepNumber - 1];
        page.selection = [step];
        const stepCount = lesson.children.filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('step')).length;
        const maxStrokeWeight = getBrushSize(step);
        const brushType = getTag(step, 'brush-name-') || '';
        let layerNumbersToClear = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).includes('clear-before')
            ? [...Array(stepNumber).keys()].slice(1)
            : getClearLayerNumbers(step);
        yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["uiApi"].updateUiProps({
            shadowSize: parseInt(getTag(step, 'ss-')) || 0,
            brushSize: parseInt(getTag(step, 'bs-')) || 0,
            suggestedBrushSize: Object(_util__WEBPACK_IMPORTED_MODULE_0__["isResultStep"])(step) ? 0 : maxStrokeWeight,
            template: getTag(step, 's-') || '0',
            stepCount,
            stepNumber,
            displayMode,
            clearBefore: Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).includes('clear-before'),
            clearLayers: layerNumbersToClear.map((n) => n.toString()) || [],
            otherTags: Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).filter((t) => t.startsWith('share-button') || t.startsWith('allow-undo')) || [],
            brushType,
        });
        yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["uiApi"].setStepNavigationProps(stepNumber, displayMode);
        deleteTmp();
        if (lastPage && lastPage != page) {
            displayAll(lastPage.children.find((el) => el.name == 'lesson'));
        }
        lastPage = page;
        displayAllElements(lesson);
        switch (displayMode) {
            case 'all':
                displayAll(lesson, true);
                break;
            case 'current':
                displayBrushSize(lesson, step);
                lesson.children.forEach((step) => {
                    step.visible = false;
                });
                step.visible = true;
                if (step.type === 'GROUP') {
                    const groupTemplate = step.findChild((g) => g.name == 'template');
                    if (groupTemplate) {
                        groupTemplate.visible = false;
                    }
                }
                break;
            case 'previous':
                displayBrushSize(lesson, step);
                stepsByOrder(lesson).forEach((step, i) => {
                    step.visible = i < stepNumber;
                });
                collectLayerNumbersToClear(lesson, step).forEach((i) => {
                    lesson.children[i].visible = false;
                });
                lesson.children.forEach((step) => showOnlyRGBTemplate(step));
                break;
            case 'template':
                displayBrushSize(lesson, step);
                displayTemplate(lesson, step);
                break;
        }
    });
}
function addAnimationTag(step, tag, delay, repeat) {
    if (figma.currentPage.selection) {
        let selectionTags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(figma.currentPage.selection[0]).filter((t) => {
            return !/^(wiggle|fly-from-|appear$|blink$|draw-line|[dr]-?\d+$)/g.test(t);
        });
        if (tag) {
            selectionTags.push(tag);
            if (delay) {
                selectionTags.push(`d${delay}`);
            }
            if (repeat) {
                selectionTags.push(`r${repeat}`);
            }
            figma.currentPage.selection[0].name = selectionTags.join(' ');
        }
        else {
            figma.currentPage.selection[0].name = selectionTags.join(' ');
        }
    }
}
function updateProps(settings) {
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    const step = stepsByOrder(lesson)[settings.stepNumber - 1];
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).filter((t) => !t.startsWith('ss-') &&
        !t.startsWith('bs-') &&
        !t.startsWith('s-') &&
        !t.startsWith('clear-layer-') &&
        !t.startsWith('clear-before') &&
        !t.startsWith('share-button') &&
        !t.startsWith('allow-undo') &&
        !t.startsWith('brush-name-'));
    if (settings.template) {
        tags.splice(1, 0, `s-${settings.template}`);
    }
    if (settings.shadowSize) {
        tags.push(`ss-${settings.shadowSize}`);
    }
    if (settings.brushSize) {
        tags.push(`bs-${settings.brushSize}`);
    }
    if (settings.brushType) {
        tags.push(`brush-name-${settings.brushType}`);
    }
    if (settings.clearLayers.length > 0) {
        if (!settings.clearBefore) {
            tags.push(`clear-layer-${settings.clearLayers.join(',')}`);
        }
    }
    if (settings.clearBefore) {
        tags.push('clear-before');
    }
    if (settings.otherTags.length > 0) {
        tags = tags.concat(settings.otherTags);
    }
    if (settings.animationTag !== undefined) {
        addAnimationTag(step, settings.animationTag, settings.delay, settings.repeat);
    }
    step.name = tags.join(' ');
}
function currentPageChanged() {
    const selection = figma.currentPage.selection[0];
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    if (!selection || !lesson || !lesson.children.includes(selection)) {
        updateDisplay({ displayMode: lastMode, stepNumber: 1 }, figma.currentPage);
        return;
    }
    const step = figma.currentPage.selection[0];
    const stepNumber = stepsByOrder(lesson).indexOf(step) + 1;
    updateDisplay({
        displayMode: lastMode,
        stepNumber: stepNumber || 1,
    }, figma.currentPage);
}
function selectionChanged() {
    return __awaiter(this, void 0, void 0, function* () {
        const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
        const selection = figma.currentPage.selection[0];
        if (selection || lesson || selection.type !== 'FRAME') {
            const tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(selection);
            const animationTags = tags.find((t) => /^wiggle|^fly-from-|^appear|^blink|^draw-line/.test(t));
            const delay = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getParamValue"])(tags, /^d-?(\d+)/);
            const repeat = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getParamValue"])(tags, /^r-?(\d+)/);
            yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["uiApi"].setAnimationTags(animationTags, delay, repeat);
            const parentStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(selection, 'step');
            const stepNumber = stepsByOrder(lesson).indexOf(parentStep) >= 0
                ? stepsByOrder(lesson).indexOf(parentStep) + 1
                : lastStepNumber;
            yield _rpc_api__WEBPACK_IMPORTED_MODULE_1__["uiApi"].setStepNavigationProps(stepNumber, lastMode);
        }
        if (!selection || !lesson || !lesson.children.includes(selection)) {
            return;
        }
        const step = figma.currentPage.selection[0];
        const stepNumber = stepsByOrder(lesson).indexOf(step) >= 0
            ? stepsByOrder(lesson).indexOf(step) + 1
            : lastStepNumber;
        updateDisplay({ displayMode: lastMode, stepNumber }, figma.currentPage);
    });
}


/***/ }),

/***/ "./src/plugin/util.ts":
/*!****************************!*\
  !*** ./src/plugin/util.ts ***!
  \****************************/
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, findTag, addTag, findParentByTag, findChildrenByTag, isResultStep, print, displayNotification, capitalize, getStepOrder, resizeUi, setStepOrder, getAllTree, descendants, findNextBrushStep, findLessonGroup, getParamValue, isRGBTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAll", function() { return findAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLeafNodes", function() { return findLeafNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findParent", function() { return findParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodeIndex", function() { return getNodeIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentLesson", function() { return getCurrentLesson; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTags", function() { return getTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findTag", function() { return findTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTag", function() { return addTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findParentByTag", function() { return findParentByTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findChildrenByTag", function() { return findChildrenByTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isResultStep", function() { return isResultStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "print", function() { return print; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayNotification", function() { return displayNotification; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStepOrder", function() { return getStepOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resizeUi", function() { return resizeUi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStepOrder", function() { return setStepOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllTree", function() { return getAllTree; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "descendants", function() { return descendants; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findNextBrushStep", function() { return findNextBrushStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLessonGroup", function() { return findLessonGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getParamValue", function() { return getParamValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRGBTemplate", function() { return isRGBTemplate; });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");

function findAll(node, f) {
    let arr = [];
    if (f(node)) {
        arr.push(node);
    }
    const children = node.children;
    if (children) {
        arr = arr.concat(children.flatMap((p) => findAll(p, f)));
    }
    return arr;
}
function findLeafNodes(node) {
    if (!('children' in node)) {
        return [node];
    }
    return node.findAll((n) => !('children' in n));
}
function findParent(node, f) {
    if (f(node)) {
        return node;
    }
    if (node === null || node === void 0 ? void 0 : node.parent) {
        return findParent(node.parent, f);
    }
}
function getNodeIndex(node) {
    return node.parent.children.findIndex((n) => n.id === node.id);
}
function getCurrentLesson() {
    return figma.currentPage.children.find((el) => el.name === 'lesson');
}
function getTags(node) {
    var _a;
    return (node === null || node === void 0 ? void 0 : node.name) ? (_a = node === null || node === void 0 ? void 0 : node.name) === null || _a === void 0 ? void 0 : _a.split(' ').filter(Boolean) : [];
}
function findTag(node, tag) {
    const tags = getTags(node);
    return tags.find((s) => tag.test(s));
}
function addTag(node, tag) {
    node.name = getTags(node).concat([tag]).join(' ');
}
function findParentByTag(node, tag) {
    return findParent(node, (n) => getTags(n).includes(tag));
}
function findChildrenByTag(node, tag) {
    const predicate = (n) => {
        return getTags(n).includes(tag);
    };
    return findAll(node, predicate);
}
function isResultStep(node) {
    return node && getTags(node).includes('s-multistep-result');
}
function print(text) {
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])('print', text);
}
function displayNotification(message) {
    figma.notify(message);
}
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function getStepOrder(step) {
    const stepOrderTag = /^o-(\d+)$/;
    const stepTag = getTags(step).find((tag) => tag.match(stepOrderTag));
    if (stepTag) {
        return Number(stepTag.match(stepOrderTag)[1]);
    }
}
function resizeUi(isWide) {
    if (isWide) {
        figma.ui.resize(900, 470);
    }
    else {
        figma.ui.resize(340, 470);
    }
}
function setStepOrder(step, stepOrder) {
    getTags(step).some((tag) => /^o-\d+$/.test(tag))
        ? (step.name = step.name.replace(/o-\d+/, `o-${stepOrder}`))
        : (step.name += ` o-${stepOrder}`);
}
function getAllTree(node) {
    if (!node.children) {
        return [node];
    }
    return [node, ...node.children.flatMap((n) => getAllTree(n))];
}
function descendants(node) {
    if (!node.children) {
        return [];
    }
    return node.children.flatMap((n) => getAllTree(n));
}
function findNextBrushStep(steps) {
    return steps.find((step) => {
        return getTags(step).includes('s-multistep-brush');
    });
}
function findLessonGroup(page) {
    return page.children.find((el) => el.name == 'lesson');
}
function getParamValue(el, pattern) {
    for (let cl of el) {
        const match = cl.match(pattern);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0;
}
function isRGBTemplate(node) {
    return findTag(node, /^rgb-template$/) || findParentByTag(node, 'rgb-template');
}


/***/ }),

/***/ "./src/rpc-api.ts":
/*!************************!*\
  !*** ./src/rpc-api.ts ***!
  \************************/
/*! exports provided: pluginApi, uiApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pluginApi", function() { return pluginApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uiApi", function() { return uiApi; });
/* harmony import */ var figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! figma-jsonrpc */ "./node_modules/figma-jsonrpc/index.js");
/* harmony import */ var figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _plugin_format_rpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugin/format-rpc */ "./src/plugin/format-rpc.ts");
/* harmony import */ var _plugin_publish__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plugin/publish */ "./src/plugin/publish.ts");
/* harmony import */ var _plugin_tune_rpc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugin/tune-rpc */ "./src/plugin/tune-rpc.ts");
/* harmony import */ var _plugin_create__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugin/create */ "./src/plugin/create.ts");
/* harmony import */ var _plugin_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugin/util */ "./src/plugin/util.ts");
/* harmony import */ var _plugin_linter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugin/linter */ "./src/plugin/linter.ts");
/* harmony import */ var _plugin_tune__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./plugin/tune */ "./src/plugin/tune.ts");
/* harmony import */ var _plugin_meta__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./plugin/meta */ "./src/plugin/meta.ts");
/* harmony import */ var _app_models_TuneFormStore__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app/models/TuneFormStore */ "./src/app/models/TuneFormStore.ts");
/* harmony import */ var _app_models_MetaStore__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app/models/MetaStore */ "./src/app/models/MetaStore.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











// Figma plugin methods
const pluginApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createPluginAPI"])({
    setSessionToken(token) {
        return figma.clientStorage.setAsync('sessionToken', token);
    },
    getSessionToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return figma.clientStorage.getAsync('sessionToken');
        });
    },
    exportLesson: _plugin_publish__WEBPACK_IMPORTED_MODULE_2__["exportLesson"],
    exportCourse: _plugin_publish__WEBPACK_IMPORTED_MODULE_2__["exportCourse"],
    getSteps: _plugin_tune_rpc__WEBPACK_IMPORTED_MODULE_3__["getSteps"],
    setStepsOrder: _plugin_tune_rpc__WEBPACK_IMPORTED_MODULE_3__["setStepsOrder"],
    exportTexts: _plugin_format_rpc__WEBPACK_IMPORTED_MODULE_1__["exportTexts"],
    importTexts: _plugin_format_rpc__WEBPACK_IMPORTED_MODULE_1__["importTexts"],
    displayNotification: _plugin_util__WEBPACK_IMPORTED_MODULE_5__["displayNotification"],
    createLesson: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["createLesson"],
    separateStep: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["separateStep"],
    splitByColor: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["splitByColor"],
    joinSteps: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["joinSteps"],
    selectError: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["selectError"],
    saveErrors: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["saveErrors"],
    selectionChanged: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["selectionChanged"],
    currentPageChanged: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["currentPageChanged"],
    updateDisplay: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["updateDisplay"],
    lintPage: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["lintPage"],
    lintCourse: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["lintCourse"],
    resizeUi: _plugin_util__WEBPACK_IMPORTED_MODULE_5__["resizeUi"],
    updateProps: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["updateProps"],
    setMetaTags: _plugin_meta__WEBPACK_IMPORTED_MODULE_8__["setMetaTags"],
    selectNextBrushStep: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["selectNextBrushStep"],
    displayAll: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["displayAll"],
}, { timeout: 1000000 });
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({
    setAnimationTags(animationTag, delay, repeat) {
        _app_models_TuneFormStore__WEBPACK_IMPORTED_MODULE_9__["TuneFormStore"].setAnimationTags(animationTag, delay, repeat);
    },
    updateUiProps(settings) {
        _app_models_TuneFormStore__WEBPACK_IMPORTED_MODULE_9__["TuneFormStore"].updateProps(settings);
    },
    setStepNavigationProps(stepNumber, displayMode) {
        _app_models_TuneFormStore__WEBPACK_IMPORTED_MODULE_9__["TuneFormStore"].setStepNavigationProps(stepNumber, displayMode);
    },
    setMetaProps(props) {
        _app_models_MetaStore__WEBPACK_IMPORTED_MODULE_10__["MetaFormStore"].setMetaProps(props);
    },
}, { timeout: 1000000 });


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9jaGVja1Byb3BUeXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL2hhcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJveHktY29tcGFyZS9kaXN0L2luZGV4Lm1vZGVybi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yZWFjdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUvY2pzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlLXNoaW0uZGV2ZWxvcG1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlL3NoaW0vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3ZhbHRpby9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdmFsdGlvL3ZhbmlsbGEuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9tb2RlbHMvTWV0YVN0b3JlLnRzIiwid2VicGFjazovLy8uL3NyYy9hcHAvbW9kZWxzL1R1bmVGb3JtU3RvcmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2NyZWF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC1ycGMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9mb3JtYXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2xpbnRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL21ldGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9wdWJsaXNoLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS1ycGMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi90dW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcnBjLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtR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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwRkFBMEYsYUFBYTtBQUN2RztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RkFBOEYsZUFBZTtBQUM3RztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLLEVBQUU7O0FBRVAsaURBQWlEO0FBQ2pEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw4TUFBOE07O0FBRTlNO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QixhQUFhLFVBQVU7QUFDdkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsV0FBVztBQUN4QixhQUFhLE9BQU87QUFDcEIsYUFBYSxVQUFVO0FBQ3ZCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXO0FBQ3hCLGFBQWEsT0FBTztBQUNwQixhQUFhLFVBQVU7QUFDdkIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSx5QkFBeUI7O0FBRXpCLDBCQUEwQjtBQUMxQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQjtBQUMzQjtBQUNBLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbURBQW1EOztBQUVuRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLFdBQVcsY0FB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QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssRUFBRTs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSx5Q0FBeUM7O0FBRXpDO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBLHlDQUF5QztBQUN6Qzs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sS0FBcUM7QUFDM0M7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLEtBQXFDO0FBQzNDO0FBQ0E7O0FBRUE7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QUFDWixJQUFJLHFFQUFXO0FBQ2YsSUFBSSxxRUFBVztBQUNmLElBQUkscUZBQW1CO0FBQ3ZCLElBQUksbUVBQVU7QUFDZCxDQUFDLEdBQUcsbUJBQW1CO0FBQ3ZCO0FBQ08sY0FBYyxpRUFBVztBQUNoQztBQUNBLFFBQVEsdUVBQWE7QUFDckIsS0FBSztBQUNMO0FBQ0EsUUFBUSx1RUFBYTtBQUNyQixLQUFLO0FBQ0w7QUFDQSxRQUFRLHVFQUFhO0FBQ3JCLEtBQUs7QUFDTDtBQUNBLFFBQVEsb0VBQWE7QUFDckIsS0FBSztBQUNMLENBQUMsR0FBRyxtQkFBbUIiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vaW5kZXgudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cy5QYXJzZUVycm9yID0gY2xhc3MgUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiUGFyc2UgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI3MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRSZXF1ZXN0ID0gY2xhc3MgSW52YWxpZFJlcXVlc3QgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgUmVxdWVzdFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuTWV0aG9kTm90Rm91bmQgPSBjbGFzcyBNZXRob2ROb3RGb3VuZCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiTWV0aG9kIG5vdCBmb3VuZFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFBhcmFtcyA9IGNsYXNzIEludmFsaWRQYXJhbXMgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgcGFyYW1zXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAyO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnRlcm5hbEVycm9yID0gY2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW50ZXJuYWwgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDM7XG4gIH1cbn07XG4iLCJjb25zdCB7IHNldHVwLCBzZW5kUmVxdWVzdCB9ID0gcmVxdWlyZShcIi4vcnBjXCIpO1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVVSUFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVVJQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbHVnaW5BUEkgPSBmdW5jdGlvbiBjcmVhdGVQbHVnaW5BUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuIiwiY29uc3QgUlBDRXJyb3IgPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5jb25zdCB7IE1ldGhvZE5vdEZvdW5kIH0gPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5cbmxldCBzZW5kUmF3O1xuXG5pZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIGZpZ21hLnVpLm9uKCdtZXNzYWdlJywgbWVzc2FnZSA9PiBoYW5kbGVSYXcobWVzc2FnZSkpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBmaWdtYS51aS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbn0gZWxzZSBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBvbm1lc3NhZ2UgPSBldmVudCA9PiBoYW5kbGVSYXcoZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogbWVzc2FnZSB9LCBcIipcIik7XG59XG5cbmxldCBycGNJbmRleCA9IDA7XG5sZXQgcGVuZGluZyA9IHt9O1xuXG5mdW5jdGlvbiBzZW5kSnNvbihyZXEpIHtcbiAgdHJ5IHtcbiAgICBzZW5kUmF3KHJlcSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kUmVzdWx0KGlkLCByZXN1bHQpIHtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgcmVzdWx0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZW5kRXJyb3IoaWQsIGVycm9yKSB7XG4gIGNvbnN0IGVycm9yT2JqZWN0ID0ge1xuICAgIGNvZGU6IGVycm9yLmNvZGUsXG4gICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICBkYXRhOiBlcnJvci5kYXRhXG4gIH07XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIGVycm9yOiBlcnJvck9iamVjdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmF3KGRhdGEpIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlUnBjKGRhdGEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgY29uc29sZS5lcnJvcihkYXRhKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVScGMoanNvbikge1xuICBpZiAodHlwZW9mIGpzb24uaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YganNvbi5yZXN1bHQgIT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgIGpzb24uZXJyb3IgfHxcbiAgICAgIHR5cGVvZiBqc29uLm1ldGhvZCA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBzZW5kRXJyb3IoXG4gICAgICAgICAganNvbi5pZCxcbiAgICAgICAgICBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIGNhbGxiYWNrIGZvciBcIiArIGpzb24uaWQpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjay50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dChjYWxsYmFjay50aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgY2FsbGJhY2soanNvbi5lcnJvciwganNvbi5yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVSZXF1ZXN0KGpzb24pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVOb3RpZmljYXRpb24oanNvbik7XG4gIH1cbn1cblxubGV0IG1ldGhvZHMgPSB7fTtcblxuZnVuY3Rpb24gb25SZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XG4gIGlmICghbWV0aG9kc1ttZXRob2RdKSB7XG4gICAgdGhyb3cgbmV3IE1ldGhvZE5vdEZvdW5kKG1ldGhvZCk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXSguLi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVOb3RpZmljYXRpb24oanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIG1ldGhvZFwiKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmVzdWx0XG4gICAgICAgIC50aGVuKHJlcyA9PiBzZW5kUmVzdWx0KGpzb24uaWQsIHJlcykpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gc2VuZEVycm9yKGpzb24uaWQsIGVycikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kUmVzdWx0KGpzb24uaWQsIHJlc3VsdCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXR1cCA9IF9tZXRob2RzID0+IHtcbiAgT2JqZWN0LmFzc2lnbihtZXRob2RzLCBfbWV0aG9kcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kTm90aWZpY2F0aW9uID0gKG1ldGhvZCwgcGFyYW1zKSA9PiB7XG4gIHNlbmRKc29uKHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChtZXRob2QsIHBhcmFtcywgdGltZW91dCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGlkID0gcnBjSW5kZXg7XG4gICAgY29uc3QgcmVxID0geyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcywgaWQgfTtcbiAgICBycGNJbmRleCArPSAxO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnN0IGpzRXJyb3IgPSBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgICBqc0Vycm9yLmNvZGUgPSBlcnIuY29kZTtcbiAgICAgICAganNFcnJvci5kYXRhID0gZXJyLmRhdGE7XG4gICAgICAgIHJlamVjdChqc0Vycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgIH07XG5cbiAgICAvLyBzZXQgYSBkZWZhdWx0IHRpbWVvdXRcbiAgICBjYWxsYmFjay50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWxldGUgcGVuZGluZ1tpZF07XG4gICAgICByZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdCBcIiArIG1ldGhvZCArIFwiIHRpbWVkIG91dC5cIikpO1xuICAgIH0sIHRpbWVvdXQgfHwgMzAwMCk7XG5cbiAgICBwZW5kaW5nW2lkXSA9IGNhbGxiYWNrO1xuICAgIHNlbmRKc29uKHJlcSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuUlBDRXJyb3IgPSBSUENFcnJvcjtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG4gIHZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcbiAgdmFyIGhhcyA9IHJlcXVpcmUoJy4vbGliL2hhcycpO1xuXG4gIHByaW50V2FybmluZyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgdGV4dDtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAvLyB0byBmaW5kIHRoZSBjYWxsc2l0ZSB0aGF0IGNhdXNlZCB0aGlzIHdhcm5pbmcgdG8gZmlyZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9IGNhdGNoICh4KSB7IC8qKi8gfVxuICB9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmIChoYXModHlwZVNwZWNzLCB0eXBlU3BlY05hbWUpKSB7XG4gICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgLy8gUHJvcCB0eXBlIHZhbGlkYXRpb24gbWF5IHRocm93LiBJbiBjYXNlIHRoZXkgZG8sIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgICAvLyBBZnRlciB0aGVzZSBoYXZlIGJlZW4gY2xlYW5lZCB1cCwgd2UnbGwgbGV0IHRoZW0gdGhyb3cuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYXMgd2l0aG91dCB0aGlzIHN0YXRlbWVudCBleGNlcHQgd2l0aCBhIGJldHRlciBtZXNzYWdlLlxuICAgICAgICAgIGlmICh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSBFcnJvcihcbiAgICAgICAgICAgICAgKGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJykgKyAnOiAnICsgbG9jYXRpb24gKyAnIHR5cGUgYCcgKyB0eXBlU3BlY05hbWUgKyAnYCBpcyBpbnZhbGlkOyAnICtcbiAgICAgICAgICAgICAgJ2l0IG11c3QgYmUgYSBmdW5jdGlvbiwgdXN1YWxseSBmcm9tIHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZSwgYnV0IHJlY2VpdmVkIGAnICsgdHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdICsgJ2AuJyArXG4gICAgICAgICAgICAgICdUaGlzIG9mdGVuIGhhcHBlbnMgYmVjYXVzZSBvZiB0eXBvcyBzdWNoIGFzIGBQcm9wVHlwZXMuZnVuY3Rpb25gIGluc3RlYWQgb2YgYFByb3BUeXBlcy5mdW5jYC4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXJyLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3IgJiYgIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgIChjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycpICsgJzogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICcgK1xuICAgICAgICAgICAgbG9jYXRpb24gKyAnIGAnICsgdHlwZVNwZWNOYW1lICsgJ2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICtcbiAgICAgICAgICAgICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAnICsgdHlwZW9mIGVycm9yICsgJy4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBoYXZlIGZvcmdvdHRlbiB0byBwYXNzIGFuIGFyZ3VtZW50IHRvIHRoZSB0eXBlIGNoZWNrZXIgJyArXG4gICAgICAgICAgICAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICtcbiAgICAgICAgICAgICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgICAvLyBPbmx5IG1vbml0b3IgdGhpcyBmYWlsdXJlIG9uY2UgYmVjYXVzZSB0aGVyZSB0ZW5kcyB0byBiZSBhIGxvdCBvZiB0aGVcbiAgICAgICAgICAvLyBzYW1lIGVycm9yLlxuICAgICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgICB2YXIgc3RhY2sgPSBnZXRTdGFjayA/IGdldFN0YWNrKCkgOiAnJztcblxuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdGYWlsZWQgJyArIGxvY2F0aW9uICsgJyB0eXBlOiAnICsgZXJyb3IubWVzc2FnZSArIChzdGFjayAhPSBudWxsID8gc3RhY2sgOiAnJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzZXRzIHdhcm5pbmcgY2FjaGUgd2hlbiB0ZXN0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlID0gZnVuY3Rpb24oKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgbG9nZ2VkVHlwZUZhaWx1cmVzID0ge307XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaGVja1Byb3BUeXBlcztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG4iLCJjb25zdCBlPVN5bWJvbCgpLHQ9U3ltYm9sKCkscj1TeW1ib2woKTtsZXQgbj0oZSx0KT0+bmV3IFByb3h5KGUsdCk7Y29uc3Qgbz1PYmplY3QuZ2V0UHJvdG90eXBlT2Yscz1uZXcgV2Vha01hcCxjPWU9PmUmJihzLmhhcyhlKT9zLmdldChlKTpvKGUpPT09T2JqZWN0LnByb3RvdHlwZXx8byhlKT09PUFycmF5LnByb3RvdHlwZSksbD1lPT5cIm9iamVjdFwiPT10eXBlb2YgZSYmbnVsbCE9PWUsYT1uZXcgV2Vha01hcCxmPWU9PmVbcl18fGUsaT0ocyxsLHApPT57aWYoIWMocykpcmV0dXJuIHM7Y29uc3QgeT1mKHMpLHU9KGU9Pk9iamVjdC5pc0Zyb3plbihlKXx8T2JqZWN0LnZhbHVlcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhlKSkuc29tZShlPT4hZS53cml0YWJsZSkpKHkpO2xldCBnPXAmJnAuZ2V0KHkpO3JldHVybiBnJiZnWzFdLmY9PT11fHwoZz0oKG4sbyk9Pntjb25zdCBzPXtmOm99O2xldCBjPSExO2NvbnN0IGw9KHQscik9PntpZighYyl7bGV0IG89cy5hLmdldChuKTtvfHwobz1uZXcgU2V0LHMuYS5zZXQobixvKSksciYmby5oYXMoZSl8fG8uYWRkKHQpfX0sYT17Z2V0OihlLHQpPT50PT09cj9uOihsKHQpLGkoZVt0XSxzLmEscy5jKSksaGFzOihlLHIpPT5yPT09dD8oYz0hMCxzLmEuZGVsZXRlKG4pLCEwKToobChyKSxyIGluIGUpLGdldE93blByb3BlcnR5RGVzY3JpcHRvcjooZSx0KT0+KGwodCwhMCksT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlLHQpKSxvd25LZXlzOnQ9PihsKGUpLFJlZmxlY3Qub3duS2V5cyh0KSl9O3JldHVybiBvJiYoYS5zZXQ9YS5kZWxldGVQcm9wZXJ0eT0oKT0+ITEpLFthLHNdfSkoeSx1KSxnWzFdLnA9bih1PyhlPT57bGV0IHQ9YS5nZXQoZSk7aWYoIXQpe2lmKEFycmF5LmlzQXJyYXkoZSkpdD1BcnJheS5mcm9tKGUpO2Vsc2V7Y29uc3Qgcj1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhlKTtPYmplY3QudmFsdWVzKHIpLmZvckVhY2goZT0+e2UuY29uZmlndXJhYmxlPSEwfSksdD1PYmplY3QuY3JlYXRlKG8oZSkscil9YS5zZXQoZSx0KX1yZXR1cm4gdH0pKHkpOnksZ1swXSkscCYmcC5zZXQoeSxnKSksZ1sxXS5hPWwsZ1sxXS5jPXAsZ1sxXS5wfSxwPShlLHQpPT57Y29uc3Qgcj1SZWZsZWN0Lm93bktleXMoZSksbj1SZWZsZWN0Lm93bktleXModCk7cmV0dXJuIHIubGVuZ3RoIT09bi5sZW5ndGh8fHIuc29tZSgoZSx0KT0+ZSE9PW5bdF0pfSx5PSh0LHIsbixvKT0+e2lmKE9iamVjdC5pcyh0LHIpKXJldHVybiExO2lmKCFsKHQpfHwhbChyKSlyZXR1cm4hMDtjb25zdCBzPW4uZ2V0KGYodCkpO2lmKCFzKXJldHVybiEwO2lmKG8pe2NvbnN0IGU9by5nZXQodCk7aWYoZSYmZS5uPT09cilyZXR1cm4gZS5nO28uc2V0KHQse246cixnOiExfSl9bGV0IGM9bnVsbDtmb3IoY29uc3QgbCBvZiBzKXtjb25zdCBzPWw9PT1lP3AodCxyKTp5KHRbbF0scltsXSxuLG8pO2lmKCEwIT09cyYmITEhPT1zfHwoYz1zKSxjKWJyZWFrfXJldHVybiBudWxsPT09YyYmKGM9ITApLG8mJm8uc2V0KHQse246cixnOmN9KSxjfSx1PWU9PiEhYyhlKSYmdCBpbiBlLGc9ZT0+YyhlKSYmZVtyXXx8bnVsbCxiPShlLHQ9ITApPT57cy5zZXQoZSx0KX0sTz0oZSx0KT0+e2NvbnN0IHI9W10sbj1uZXcgV2Vha1NldCxvPShlLHMpPT57aWYobi5oYXMoZSkpcmV0dXJuO2woZSkmJm4uYWRkKGUpO2NvbnN0IGM9bChlKSYmdC5nZXQoZihlKSk7Yz9jLmZvckVhY2godD0+e28oZVt0XSxzP1suLi5zLHRdOlt0XSl9KTpzJiZyLnB1c2gocyl9O3JldHVybiBvKGUpLHJ9LHc9ZT0+e249ZX07ZXhwb3J0e08gYXMgYWZmZWN0ZWRUb1BhdGhMaXN0LGkgYXMgY3JlYXRlUHJveHksZyBhcyBnZXRVbnRyYWNrZWQseSBhcyBpc0NoYW5nZWQsYiBhcyBtYXJrVG9UcmFjayx3IGFzIHJlcGxhY2VOZXdQcm94eSx1IGFzIHRyYWNrTWVtb307XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tb2Rlcm4ubWpzLm1hcFxuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi4xNC4wXG4gKiByZWFjdC5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJ3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMnKTtcblxudmFyIFJlYWN0VmVyc2lvbiA9ICcxNi4xNC4wJztcblxuLy8gVGhlIFN5bWJvbCB1c2VkIHRvIHRhZyB0aGUgUmVhY3RFbGVtZW50LWxpa2UgdHlwZXMuIElmIHRoZXJlIGlzIG5vIG5hdGl2ZSBTeW1ib2xcbi8vIG5vciBwb2x5ZmlsbCwgdGhlbiBhIHBsYWluIG51bWJlciBpcyB1c2VkIGZvciBwZXJmb3JtYW5jZS5cbnZhciBoYXNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3I7XG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3O1xudmFyIFJFQUNUX1BPUlRBTF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucG9ydGFsJykgOiAweGVhY2E7XG52YXIgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmZyYWdtZW50JykgOiAweGVhY2I7XG52YXIgUkVBQ1RfU1RSSUNUX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN0cmljdF9tb2RlJykgOiAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb2ZpbGVyJykgOiAweGVhZDI7XG52YXIgUkVBQ1RfUFJPVklERVJfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnByb3ZpZGVyJykgOiAweGVhY2Q7XG52YXIgUkVBQ1RfQ09OVEVYVF9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuY29udGV4dCcpIDogMHhlYWNlOyAvLyBUT0RPOiBXZSBkb24ndCB1c2UgQXN5bmNNb2RlIG9yIENvbmN1cnJlbnRNb2RlIGFueW1vcmUuIFRoZXkgd2VyZSB0ZW1wb3JhcnlcbnZhciBSRUFDVF9DT05DVVJSRU5UX01PREVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmNvbmN1cnJlbnRfbW9kZScpIDogMHhlYWNmO1xudmFyIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mb3J3YXJkX3JlZicpIDogMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5zdXNwZW5zZScpIDogMHhlYWQxO1xudmFyIFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnN1c3BlbnNlX2xpc3QnKSA6IDB4ZWFkODtcbnZhciBSRUFDVF9NRU1PX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykgOiAweGVhZDM7XG52YXIgUkVBQ1RfTEFaWV9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QubGF6eScpIDogMHhlYWQ0O1xudmFyIFJFQUNUX0JMT0NLX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5ibG9jaycpIDogMHhlYWQ5O1xudmFyIFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgPSBoYXNTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpIDogMHhlYWQ1O1xudmFyIFJFQUNUX1JFU1BPTkRFUl9UWVBFID0gaGFzU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QucmVzcG9uZGVyJykgOiAweGVhZDY7XG52YXIgUkVBQ1RfU0NPUEVfVFlQRSA9IGhhc1N5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LnNjb3BlJykgOiAweGVhZDc7XG52YXIgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5mdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgaWYgKG1heWJlSXRlcmFibGUgPT09IG51bGwgfHwgdHlwZW9mIG1heWJlSXRlcmFibGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgbWF5YmVJdGVyYXRvciA9IE1BWUJFX0lURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW01BWUJFX0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF07XG5cbiAgaWYgKHR5cGVvZiBtYXliZUl0ZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3I7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBkaXNwYXRjaGVyLlxuICovXG52YXIgUmVhY3RDdXJyZW50RGlzcGF0Y2hlciA9IHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAdHlwZSB7UmVhY3RDb21wb25lbnR9XG4gICAqL1xuICBjdXJyZW50OiBudWxsXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IGJhdGNoJ3MgY29uZmlndXJhdGlvbiBzdWNoIGFzIGhvdyBsb25nIGFuIHVwZGF0ZVxuICogc2hvdWxkIHN1c3BlbmQgZm9yIGlmIGl0IG5lZWRzIHRvLlxuICovXG52YXIgUmVhY3RDdXJyZW50QmF0Y2hDb25maWcgPSB7XG4gIHN1c3BlbnNlOiBudWxsXG59O1xuXG4vKipcbiAqIEtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50IG93bmVyLlxuICpcbiAqIFRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBjb21wb25lbnQgd2hvIHNob3VsZCBvd24gYW55IGNvbXBvbmVudHMgdGhhdCBhcmVcbiAqIGN1cnJlbnRseSBiZWluZyBjb25zdHJ1Y3RlZC5cbiAqL1xudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEB0eXBlIHtSZWFjdENvbXBvbmVudH1cbiAgICovXG4gIGN1cnJlbnQ6IG51bGxcbn07XG5cbnZhciBCRUZPUkVfU0xBU0hfUkUgPSAvXiguKilbXFxcXFxcL10vO1xuZnVuY3Rpb24gZGVzY3JpYmVDb21wb25lbnRGcmFtZSAobmFtZSwgc291cmNlLCBvd25lck5hbWUpIHtcbiAgdmFyIHNvdXJjZUluZm8gPSAnJztcblxuICBpZiAoc291cmNlKSB7XG4gICAgdmFyIHBhdGggPSBzb3VyY2UuZmlsZU5hbWU7XG4gICAgdmFyIGZpbGVOYW1lID0gcGF0aC5yZXBsYWNlKEJFRk9SRV9TTEFTSF9SRSwgJycpO1xuXG4gICAge1xuICAgICAgLy8gSW4gREVWLCBpbmNsdWRlIGNvZGUgZm9yIGEgY29tbW9uIHNwZWNpYWwgY2FzZTpcbiAgICAgIC8vIHByZWZlciBcImZvbGRlci9pbmRleC5qc1wiIGluc3RlYWQgb2YganVzdCBcImluZGV4LmpzXCIuXG4gICAgICBpZiAoL15pbmRleFxcLi8udGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgdmFyIG1hdGNoID0gcGF0aC5tYXRjaChCRUZPUkVfU0xBU0hfUkUpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgIHZhciBwYXRoQmVmb3JlU2xhc2ggPSBtYXRjaFsxXTtcblxuICAgICAgICAgIGlmIChwYXRoQmVmb3JlU2xhc2gpIHtcbiAgICAgICAgICAgIHZhciBmb2xkZXJOYW1lID0gcGF0aEJlZm9yZVNsYXNoLnJlcGxhY2UoQkVGT1JFX1NMQVNIX1JFLCAnJyk7XG4gICAgICAgICAgICBmaWxlTmFtZSA9IGZvbGRlck5hbWUgKyAnLycgKyBmaWxlTmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzb3VyY2VJbmZvID0gJyAoYXQgJyArIGZpbGVOYW1lICsgJzonICsgc291cmNlLmxpbmVOdW1iZXIgKyAnKSc7XG4gIH0gZWxzZSBpZiAob3duZXJOYW1lKSB7XG4gICAgc291cmNlSW5mbyA9ICcgKGNyZWF0ZWQgYnkgJyArIG93bmVyTmFtZSArICcpJztcbiAgfVxuXG4gIHJldHVybiAnXFxuICAgIGluICcgKyAobmFtZSB8fCAnVW5rbm93bicpICsgc291cmNlSW5mbztcbn1cblxudmFyIFJlc29sdmVkID0gMTtcbmZ1bmN0aW9uIHJlZmluZVJlc29sdmVkTGF6eUNvbXBvbmVudChsYXp5Q29tcG9uZW50KSB7XG4gIHJldHVybiBsYXp5Q29tcG9uZW50Ll9zdGF0dXMgPT09IFJlc29sdmVkID8gbGF6eUNvbXBvbmVudC5fcmVzdWx0IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0V3JhcHBlZE5hbWUob3V0ZXJUeXBlLCBpbm5lclR5cGUsIHdyYXBwZXJOYW1lKSB7XG4gIHZhciBmdW5jdGlvbk5hbWUgPSBpbm5lclR5cGUuZGlzcGxheU5hbWUgfHwgaW5uZXJUeXBlLm5hbWUgfHwgJyc7XG4gIHJldHVybiBvdXRlclR5cGUuZGlzcGxheU5hbWUgfHwgKGZ1bmN0aW9uTmFtZSAhPT0gJycgPyB3cmFwcGVyTmFtZSArIFwiKFwiICsgZnVuY3Rpb25OYW1lICsgXCIpXCIgOiB3cmFwcGVyTmFtZSk7XG59XG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUodHlwZSkge1xuICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgLy8gSG9zdCByb290LCB0ZXh0IG5vZGUgb3IganVzdCBpbnZhbGlkIHR5cGUuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB7XG4gICAgaWYgKHR5cGVvZiB0eXBlLnRhZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIGVycm9yKCdSZWNlaXZlZCBhbiB1bmV4cGVjdGVkIG9iamVjdCBpbiBnZXRDb21wb25lbnROYW1lKCkuICcgKyAnVGhpcyBpcyBsaWtlbHkgYSBidWcgaW4gUmVhY3QuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBudWxsO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0eXBlO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgcmV0dXJuICdGcmFnbWVudCc7XG5cbiAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgcmV0dXJuICdQb3J0YWwnO1xuXG4gICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgcmV0dXJuIFwiUHJvZmlsZXJcIjtcblxuICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgIHJldHVybiAnU3RyaWN0TW9kZSc7XG5cbiAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICByZXR1cm4gJ1N1c3BlbnNlJztcblxuICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgcmV0dXJuICdTdXNwZW5zZUxpc3QnO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB0eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHN3aXRjaCAodHlwZS4kJHR5cGVvZikge1xuICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgIHJldHVybiAnQ29udGV4dC5Db25zdW1lcic7XG5cbiAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgcmV0dXJuICdDb250ZXh0LlByb3ZpZGVyJztcblxuICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0V3JhcHBlZE5hbWUodHlwZSwgdHlwZS5yZW5kZXIsICdGb3J3YXJkUmVmJyk7XG5cbiAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZSh0eXBlLnR5cGUpO1xuXG4gICAgICBjYXNlIFJFQUNUX0JMT0NLX1RZUEU6XG4gICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lKHR5cGUucmVuZGVyKTtcblxuICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgdGhlbmFibGUgPSB0eXBlO1xuICAgICAgICAgIHZhciByZXNvbHZlZFRoZW5hYmxlID0gcmVmaW5lUmVzb2x2ZWRMYXp5Q29tcG9uZW50KHRoZW5hYmxlKTtcblxuICAgICAgICAgIGlmIChyZXNvbHZlZFRoZW5hYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0Q29tcG9uZW50TmFtZShyZXNvbHZlZFRoZW5hYmxlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG52YXIgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZSA9IHt9O1xudmFyIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gbnVsbDtcbmZ1bmN0aW9uIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KGVsZW1lbnQpIHtcbiAge1xuICAgIGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50ID0gZWxlbWVudDtcbiAgfVxufVxuXG57XG4gIC8vIFN0YWNrIGltcGxlbWVudGF0aW9uIGluamVjdGVkIGJ5IHRoZSBjdXJyZW50IHJlbmRlcmVyLlxuICBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjayA9IG51bGw7XG5cbiAgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGFjayA9ICcnOyAvLyBBZGQgYW4gZXh0cmEgdG9wIGZyYW1lIHdoaWxlIGFuIGVsZW1lbnQgaXMgYmVpbmcgdmFsaWRhdGVkXG5cbiAgICBpZiAoY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQpIHtcbiAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZShjdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudC50eXBlKTtcbiAgICAgIHZhciBvd25lciA9IGN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50Ll9vd25lcjtcbiAgICAgIHN0YWNrICs9IGRlc2NyaWJlQ29tcG9uZW50RnJhbWUobmFtZSwgY3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQuX3NvdXJjZSwgb3duZXIgJiYgZ2V0Q29tcG9uZW50TmFtZShvd25lci50eXBlKSk7XG4gICAgfSAvLyBEZWxlZ2F0ZSB0byB0aGUgaW5qZWN0ZWQgcmVuZGVyZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25cblxuXG4gICAgdmFyIGltcGwgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldEN1cnJlbnRTdGFjaztcblxuICAgIGlmIChpbXBsKSB7XG4gICAgICBzdGFjayArPSBpbXBsKCkgfHwgJyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYWN0KCkgdG8gdHJhY2sgd2hldGhlciB5b3UncmUgaW5zaWRlIGFuIGFjdCgpIHNjb3BlLlxuICovXG52YXIgSXNTb21lUmVuZGVyZXJBY3RpbmcgPSB7XG4gIGN1cnJlbnQ6IGZhbHNlXG59O1xuXG52YXIgUmVhY3RTaGFyZWRJbnRlcm5hbHMgPSB7XG4gIFJlYWN0Q3VycmVudERpc3BhdGNoZXI6IFJlYWN0Q3VycmVudERpc3BhdGNoZXIsXG4gIFJlYWN0Q3VycmVudEJhdGNoQ29uZmlnOiBSZWFjdEN1cnJlbnRCYXRjaENvbmZpZyxcbiAgUmVhY3RDdXJyZW50T3duZXI6IFJlYWN0Q3VycmVudE93bmVyLFxuICBJc1NvbWVSZW5kZXJlckFjdGluZzogSXNTb21lUmVuZGVyZXJBY3RpbmcsXG4gIC8vIFVzZWQgYnkgcmVuZGVyZXJzIHRvIGF2b2lkIGJ1bmRsaW5nIG9iamVjdC1hc3NpZ24gdHdpY2UgaW4gVU1EIGJ1bmRsZXM6XG4gIGFzc2lnbjogX2Fzc2lnblxufTtcblxue1xuICBfYXNzaWduKFJlYWN0U2hhcmVkSW50ZXJuYWxzLCB7XG4gICAgLy8gVGhlc2Ugc2hvdWxkIG5vdCBiZSBpbmNsdWRlZCBpbiBwcm9kdWN0aW9uLlxuICAgIFJlYWN0RGVidWdDdXJyZW50RnJhbWU6IFJlYWN0RGVidWdDdXJyZW50RnJhbWUsXG4gICAgLy8gU2hpbSBmb3IgUmVhY3QgRE9NIDE2LjAuMCB3aGljaCBzdGlsbCBkZXN0cnVjdHVyZWQgKGJ1dCBub3QgdXNlZCkgdGhpcy5cbiAgICAvLyBUT0RPOiByZW1vdmUgaW4gUmVhY3QgMTcuMC5cbiAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rOiB7fVxuICB9KTtcbn1cblxuLy8gYnkgY2FsbHMgdG8gdGhlc2UgbWV0aG9kcyBieSBhIEJhYmVsIHBsdWdpbi5cbi8vXG4vLyBJbiBQUk9EIChvciBpbiBwYWNrYWdlcyB3aXRob3V0IGFjY2VzcyB0byBSZWFjdCBpbnRlcm5hbHMpLFxuLy8gdGhleSBhcmUgbGVmdCBhcyB0aGV5IGFyZSBpbnN0ZWFkLlxuXG5mdW5jdGlvbiB3YXJuKGZvcm1hdCkge1xuICB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcHJpbnRXYXJuaW5nKCd3YXJuJywgZm9ybWF0LCBhcmdzKTtcbiAgfVxufVxuZnVuY3Rpb24gZXJyb3IoZm9ybWF0KSB7XG4gIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICBwcmludFdhcm5pbmcoJ2Vycm9yJywgZm9ybWF0LCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcmludFdhcm5pbmcobGV2ZWwsIGZvcm1hdCwgYXJncykge1xuICAvLyBXaGVuIGNoYW5naW5nIHRoaXMgbG9naWMsIHlvdSBtaWdodCB3YW50IHRvIGFsc29cbiAgLy8gdXBkYXRlIGNvbnNvbGVXaXRoU3RhY2tEZXYud3d3LmpzIGFzIHdlbGwuXG4gIHtcbiAgICB2YXIgaGFzRXhpc3RpbmdTdGFjayA9IGFyZ3MubGVuZ3RoID4gMCAmJiB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnc3RyaW5nJyAmJiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0uaW5kZXhPZignXFxuICAgIGluJykgPT09IDA7XG5cbiAgICBpZiAoIWhhc0V4aXN0aW5nU3RhY2spIHtcbiAgICAgIHZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbiAgICAgIHZhciBzdGFjayA9IFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuXG4gICAgICBpZiAoc3RhY2sgIT09ICcnKSB7XG4gICAgICAgIGZvcm1hdCArPSAnJXMnO1xuICAgICAgICBhcmdzID0gYXJncy5jb25jYXQoW3N0YWNrXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFyZ3NXaXRoRm9ybWF0ID0gYXJncy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiAnJyArIGl0ZW07XG4gICAgfSk7IC8vIENhcmVmdWw6IFJOIGN1cnJlbnRseSBkZXBlbmRzIG9uIHRoaXMgcHJlZml4XG5cbiAgICBhcmdzV2l0aEZvcm1hdC51bnNoaWZ0KCdXYXJuaW5nOiAnICsgZm9ybWF0KTsgLy8gV2UgaW50ZW50aW9uYWxseSBkb24ndCB1c2Ugc3ByZWFkIChvciAuYXBwbHkpIGRpcmVjdGx5IGJlY2F1c2UgaXRcbiAgICAvLyBicmVha3MgSUU5OiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzEzNjEwXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL25vLXByb2R1Y3Rpb24tbG9nZ2luZ1xuXG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZVtsZXZlbF0sIGNvbnNvbGUsIGFyZ3NXaXRoRm9ybWF0KTtcblxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH1cbn1cblxudmFyIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9O1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICB7XG4gICAgdmFyIF9jb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gX2NvbnN0cnVjdG9yICYmIChfY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgX2NvbnN0cnVjdG9yLm5hbWUpIHx8ICdSZWFjdENsYXNzJztcbiAgICB2YXIgd2FybmluZ0tleSA9IGNvbXBvbmVudE5hbWUgKyBcIi5cIiArIGNhbGxlck5hbWU7XG5cbiAgICBpZiAoZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXJyb3IoXCJDYW4ndCBjYWxsICVzIG9uIGEgY29tcG9uZW50IHRoYXQgaXMgbm90IHlldCBtb3VudGVkLiBcIiArICdUaGlzIGlzIGEgbm8tb3AsIGJ1dCBpdCBtaWdodCBpbmRpY2F0ZSBhIGJ1ZyBpbiB5b3VyIGFwcGxpY2F0aW9uLiAnICsgJ0luc3RlYWQsIGFzc2lnbiB0byBgdGhpcy5zdGF0ZWAgZGlyZWN0bHkgb3IgZGVmaW5lIGEgYHN0YXRlID0ge307YCAnICsgJ2NsYXNzIHByb3BlcnR5IHdpdGggdGhlIGRlc2lyZWQgc3RhdGUgaW4gdGhlICVzIGNvbXBvbmVudC4nLCBjYWxsZXJOYW1lLCBjb21wb25lbnROYW1lKTtcblxuICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSA9IHRydWU7XG4gIH1cbn1cbi8qKlxuICogVGhpcyBpcyB0aGUgYWJzdHJhY3QgQVBJIGZvciBhbiB1cGRhdGUgcXVldWUuXG4gKi9cblxuXG52YXIgUmVhY3ROb29wVXBkYXRlUXVldWUgPSB7XG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBvciBub3QgdGhpcyBjb21wb3NpdGUgY29tcG9uZW50IGlzIG1vdW50ZWQuXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHdlIHdhbnQgdG8gdGVzdC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBtb3VudGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqIEBwcm90ZWN0ZWRcbiAgICogQGZpbmFsXG4gICAqL1xuICBpc01vdW50ZWQ6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICAgKiBjZXJ0YWludHkgdGhhdCB3ZSBhcmUgKipub3QqKiBpbiBhIERPTSB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICAgKiBjb21wb25lbnQncyBzdGF0ZSBoYXMgY2hhbmdlZCBidXQgYHNldFN0YXRlYCB3YXMgbm90IGNhbGxlZC5cbiAgICpcbiAgICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICAgKiBgY29tcG9uZW50V2lsbFVwZGF0ZWAgYW5kIGBjb21wb25lbnREaWRVcGRhdGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBjb21wb25lbnQgaXMgdXBkYXRlZC5cbiAgICogQHBhcmFtIHs/c3RyaW5nfSBjYWxsZXJOYW1lIG5hbWUgb2YgdGhlIGNhbGxpbmcgZnVuY3Rpb24gaW4gdGhlIHB1YmxpYyBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZUZvcmNlVXBkYXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNhbGxiYWNrLCBjYWxsZXJOYW1lKSB7XG4gICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsICdmb3JjZVVwZGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgb3IgYHNldFN0YXRlYCB0byBtdXRhdGUgc3RhdGUuXG4gICAqIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAgICpcbiAgICogVGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgYHRoaXMuc3RhdGVgIHdpbGwgYmUgaW1tZWRpYXRlbHkgdXBkYXRlZCwgc29cbiAgICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb21wbGV0ZVN0YXRlIE5leHQgc3RhdGUuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gY2FsbGVyTmFtZSBuYW1lIG9mIHRoZSBjYWxsaW5nIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWMgQVBJLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVSZXBsYWNlU3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgY29tcGxldGVTdGF0ZSwgY2FsbGJhY2ssIGNhbGxlck5hbWUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3JlcGxhY2VTdGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gVGhpcyBvbmx5IGV4aXN0cyBiZWNhdXNlIF9wZW5kaW5nU3RhdGUgaXNcbiAgICogaW50ZXJuYWwuIFRoaXMgcHJvdmlkZXMgYSBtZXJnaW5nIHN0cmF0ZWd5IHRoYXQgaXMgbm90IGF2YWlsYWJsZSB0byBkZWVwXG4gICAqIHByb3BlcnRpZXMgd2hpY2ggaXMgY29uZnVzaW5nLiBUT0RPOiBFeHBvc2UgcGVuZGluZ1N0YXRlIG9yIGRvbid0IHVzZSBpdFxuICAgKiBkdXJpbmcgdGhlIG1lcmdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggc3RhdGUuXG4gICAqIEBwYXJhbSB7P2Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHVwZGF0ZWQuXG4gICAqIEBwYXJhbSB7P3N0cmluZ30gTmFtZSBvZiB0aGUgY2FsbGluZyBmdW5jdGlvbiBpbiB0aGUgcHVibGljIEFQSS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlU2V0U3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSwgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgY2FsbGVyTmFtZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnc2V0U3RhdGUnKTtcbiAgfVxufTtcblxudmFyIGVtcHR5T2JqZWN0ID0ge307XG5cbntcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG4vKipcbiAqIEJhc2UgY2xhc3MgaGVscGVycyBmb3IgdGhlIHVwZGF0aW5nIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICovXG5cblxuZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDsgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7IC8vIFdlIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgdXBkYXRlciBidXQgdGhlIHJlYWwgb25lIGdldHMgaW5qZWN0ZWQgYnkgdGhlXG4gIC8vIHJlbmRlcmVyLlxuXG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbkNvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCA9IHt9O1xuLyoqXG4gKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gQWx3YXlzIHVzZSB0aGlzIHRvIG11dGF0ZVxuICogc3RhdGUuIFlvdSBzaG91bGQgdHJlYXQgYHRoaXMuc3RhdGVgIGFzIGltbXV0YWJsZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICogYWNjZXNzaW5nIGB0aGlzLnN0YXRlYCBhZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kIG1heSByZXR1cm4gdGhlIG9sZCB2YWx1ZS5cbiAqXG4gKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBjYWxscyB0byBgc2V0U3RhdGVgIHdpbGwgcnVuIHN5bmNocm9ub3VzbHksXG4gKiBhcyB0aGV5IG1heSBldmVudHVhbGx5IGJlIGJhdGNoZWQgdG9nZXRoZXIuICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWxcbiAqIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIHRoZSBjYWxsIHRvIHNldFN0YXRlIGlzIGFjdHVhbGx5XG4gKiBjb21wbGV0ZWQuXG4gKlxuICogV2hlbiBhIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHRvIHNldFN0YXRlLCBpdCB3aWxsIGJlIGNhbGxlZCBhdCBzb21lIHBvaW50IGluXG4gKiB0aGUgZnV0dXJlIChub3Qgc3luY2hyb25vdXNseSkuIEl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHVwIHRvIGRhdGVcbiAqIGNvbXBvbmVudCBhcmd1bWVudHMgKHN0YXRlLCBwcm9wcywgY29udGV4dCkuIFRoZXNlIHZhbHVlcyBjYW4gYmUgZGlmZmVyZW50XG4gKiBmcm9tIHRoaXMuKiBiZWNhdXNlIHlvdXIgZnVuY3Rpb24gbWF5IGJlIGNhbGxlZCBhZnRlciByZWNlaXZlUHJvcHMgYnV0IGJlZm9yZVxuICogc2hvdWxkQ29tcG9uZW50VXBkYXRlLCBhbmQgdGhpcyBuZXcgc3RhdGUsIHByb3BzLCBhbmQgY29udGV4dCB3aWxsIG5vdCB5ZXQgYmVcbiAqIGFzc2lnbmVkIHRvIHRoaXMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R8ZnVuY3Rpb259IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgb3IgZnVuY3Rpb24gdG9cbiAqICAgICAgICBwcm9kdWNlIG5leHQgcGFydGlhbCBzdGF0ZSB0byBiZSBtZXJnZWQgd2l0aCBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICogQGZpbmFsXG4gKiBAcHJvdGVjdGVkXG4gKi9cblxuQ29tcG9uZW50LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrKSB7XG4gIGlmICghKHR5cGVvZiBwYXJ0aWFsU3RhdGUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBwYXJ0aWFsU3RhdGUgPT09ICdmdW5jdGlvbicgfHwgcGFydGlhbFN0YXRlID09IG51bGwpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwic2V0U3RhdGUoLi4uKTogdGFrZXMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcyB0byB1cGRhdGUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMuXCIgKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xufTtcbi8qKlxuICogRm9yY2VzIGFuIHVwZGF0ZS4gVGhpcyBzaG91bGQgb25seSBiZSBpbnZva2VkIHdoZW4gaXQgaXMga25vd24gd2l0aFxuICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gKlxuICogWW91IG1heSB3YW50IHRvIGNhbGwgdGhpcyB3aGVuIHlvdSBrbm93IHRoYXQgc29tZSBkZWVwZXIgYXNwZWN0IG9mIHRoZVxuICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gKlxuICogVGhpcyB3aWxsIG5vdCBpbnZva2UgYHNob3VsZENvbXBvbmVudFVwZGF0ZWAsIGJ1dCBpdCB3aWxsIGludm9rZVxuICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAqXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHVwZGF0ZSBpcyBjb21wbGV0ZS5cbiAqIEBmaW5hbFxuICogQHByb3RlY3RlZFxuICovXG5cblxuQ29tcG9uZW50LnByb3RvdHlwZS5mb3JjZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZUZvcmNlVXBkYXRlKHRoaXMsIGNhbGxiYWNrLCAnZm9yY2VVcGRhdGUnKTtcbn07XG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xuXG5cbntcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuXG4gIHZhciBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgaW5mbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2FybignJXMoLi4uKSBpcyBkZXByZWNhdGVkIGluIHBsYWluIEphdmFTY3JpcHQgUmVhY3QgY2xhc3Nlcy4gJXMnLCBpbmZvWzBdLCBpbmZvWzFdKTtcblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZvciAodmFyIGZuTmFtZSBpbiBkZXByZWNhdGVkQVBJcykge1xuICAgIGlmIChkZXByZWNhdGVkQVBJcy5oYXNPd25Qcm9wZXJ0eShmbk5hbWUpKSB7XG4gICAgICBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcoZm5OYW1lLCBkZXByZWNhdGVkQVBJc1tmbk5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gQ29tcG9uZW50RHVtbXkoKSB7fVxuXG5Db21wb25lbnREdW1teS5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuLyoqXG4gKiBDb252ZW5pZW5jZSBjb21wb25lbnQgd2l0aCBkZWZhdWx0IHNoYWxsb3cgZXF1YWxpdHkgY2hlY2sgZm9yIHNDVS5cbiAqL1xuXG5mdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDsgLy8gSWYgYSBjb21wb25lbnQgaGFzIHN0cmluZyByZWZzLCB3ZSB3aWxsIGFzc2lnbiBhIGRpZmZlcmVudCBvYmplY3QgbGF0ZXIuXG5cbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG59XG5cbnZhciBwdXJlQ29tcG9uZW50UHJvdG90eXBlID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbnB1cmVDb21wb25lbnRQcm90b3R5cGUuY29uc3RydWN0b3IgPSBQdXJlQ29tcG9uZW50OyAvLyBBdm9pZCBhbiBleHRyYSBwcm90b3R5cGUganVtcCBmb3IgdGhlc2UgbWV0aG9kcy5cblxuX2Fzc2lnbihwdXJlQ29tcG9uZW50UHJvdG90eXBlLCBDb21wb25lbnQucHJvdG90eXBlKTtcblxucHVyZUNvbXBvbmVudFByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbi8vIGFuIGltbXV0YWJsZSBvYmplY3Qgd2l0aCBhIHNpbmdsZSBtdXRhYmxlIHZhbHVlXG5mdW5jdGlvbiBjcmVhdGVSZWYoKSB7XG4gIHZhciByZWZPYmplY3QgPSB7XG4gICAgY3VycmVudDogbnVsbFxuICB9O1xuXG4gIHtcbiAgICBPYmplY3Quc2VhbChyZWZPYmplY3QpO1xuICB9XG5cbiAgcmV0dXJuIHJlZk9iamVjdDtcbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG52YXIgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24sIHNwZWNpYWxQcm9wUmVmV2FybmluZ1Nob3duLCBkaWRXYXJuQWJvdXRTdHJpbmdSZWZzO1xuXG57XG4gIGRpZFdhcm5BYm91dFN0cmluZ1JlZnMgPSB7fTtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRSZWYoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdyZWYnKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAncmVmJykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5yZWYgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaGFzVmFsaWRLZXkoY29uZmlnKSB7XG4gIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsICdrZXknKSkge1xuICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCAna2V5JykuZ2V0O1xuXG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZy5rZXkgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZGVmaW5lS2V5UHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAge1xuICAgICAgaWYgKCFzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93bikge1xuICAgICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biA9IHRydWU7XG5cbiAgICAgICAgZXJyb3IoJyVzOiBga2V5YCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9mYi5tZS9yZWFjdC1zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAge1xuICAgICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgICBzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93biA9IHRydWU7XG5cbiAgICAgICAgZXJyb3IoJyVzOiBgcmVmYCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0ICcgKyAnaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSAnICsgJ3ZhbHVlIHdpdGhpbiB0aGUgY2hpbGQgY29tcG9uZW50LCB5b3Ugc2hvdWxkIHBhc3MgaXQgYXMgYSBkaWZmZXJlbnQgJyArICdwcm9wLiAoaHR0cHM6Ly9mYi5tZS9yZWFjdC1zcGVjaWFsLXByb3BzKScsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgd2FybkFib3V0QWNjZXNzaW5nUmVmLmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAncmVmJywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nUmVmLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gd2FybklmU3RyaW5nUmVmQ2Fubm90QmVBdXRvQ29udmVydGVkKGNvbmZpZykge1xuICB7XG4gICAgaWYgKHR5cGVvZiBjb25maWcucmVmID09PSAnc3RyaW5nJyAmJiBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50ICYmIGNvbmZpZy5fX3NlbGYgJiYgUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5zdGF0ZU5vZGUgIT09IGNvbmZpZy5fX3NlbGYpIHtcbiAgICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0Q29tcG9uZW50TmFtZShSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LnR5cGUpO1xuXG4gICAgICBpZiAoIWRpZFdhcm5BYm91dFN0cmluZ1JlZnNbY29tcG9uZW50TmFtZV0pIHtcbiAgICAgICAgZXJyb3IoJ0NvbXBvbmVudCBcIiVzXCIgY29udGFpbnMgdGhlIHN0cmluZyByZWYgXCIlc1wiLiAnICsgJ1N1cHBvcnQgZm9yIHN0cmluZyByZWZzIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSBtYWpvciByZWxlYXNlLiAnICsgJ1RoaXMgY2FzZSBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBjb252ZXJ0ZWQgdG8gYW4gYXJyb3cgZnVuY3Rpb24uICcgKyAnV2UgYXNrIHlvdSB0byBtYW51YWxseSBmaXggdGhpcyBjYXNlIGJ5IHVzaW5nIHVzZVJlZigpIG9yIGNyZWF0ZVJlZigpIGluc3RlYWQuICcgKyAnTGVhcm4gbW9yZSBhYm91dCB1c2luZyByZWZzIHNhZmVseSBoZXJlOiAnICsgJ2h0dHBzOi8vZmIubWUvcmVhY3Qtc3RyaWN0LW1vZGUtc3RyaW5nLXJlZicsIGdldENvbXBvbmVudE5hbWUoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC50eXBlKSwgY29uZmlnLnJlZik7XG5cbiAgICAgICAgZGlkV2FybkFib3V0U3RyaW5nUmVmc1tjb21wb25lbnROYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCBub3Qgd29yay4gSW5zdGVhZCB0ZXN0ICQkdHlwZW9mIGZpZWxkIGFnYWluc3QgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIHRvIGNoZWNrXG4gKiBpZiBzb21ldGhpbmcgaXMgYSBSZWFjdCBFbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7Kn0gdHlwZVxuICogQHBhcmFtIHsqfSBwcm9wc1xuICogQHBhcmFtIHsqfSBrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcmVmXG4gKiBAcGFyYW0geyp9IG93bmVyXG4gKiBAcGFyYW0geyp9IHNlbGYgQSAqdGVtcG9yYXJ5KiBoZWxwZXIgdG8gZGV0ZWN0IHBsYWNlcyB3aGVyZSBgdGhpc2AgaXNcbiAqIGRpZmZlcmVudCBmcm9tIHRoZSBgb3duZXJgIHdoZW4gUmVhY3QuY3JlYXRlRWxlbWVudCBpcyBjYWxsZWQsIHNvIHRoYXQgd2VcbiAqIGNhbiB3YXJuLiBXZSB3YW50IHRvIGdldCByaWQgb2Ygb3duZXIgYW5kIHJlcGxhY2Ugc3RyaW5nIGByZWZgcyB3aXRoIGFycm93XG4gKiBmdW5jdGlvbnMsIGFuZCBhcyBsb25nIGFzIGB0aGlzYCBhbmQgb3duZXIgYXJlIHRoZSBzYW1lLCB0aGVyZSB3aWxsIGJlIG5vXG4gKiBjaGFuZ2UgaW4gYmVoYXZpb3IuXG4gKiBAcGFyYW0geyp9IHNvdXJjZSBBbiBhbm5vdGF0aW9uIG9iamVjdCAoYWRkZWQgYnkgYSB0cmFuc3BpbGVyIG9yIG90aGVyd2lzZSlcbiAqIGluZGljYXRpbmcgZmlsZW5hbWUsIGxpbmUgbnVtYmVyLCBhbmQvb3Igb3RoZXIgaW5mb3JtYXRpb24uXG4gKiBAaW50ZXJuYWxcbiAqL1xuXG5cbnZhciBSZWFjdEVsZW1lbnQgPSBmdW5jdGlvbiAodHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKSB7XG4gIHZhciBlbGVtZW50ID0ge1xuICAgIC8vIFRoaXMgdGFnIGFsbG93cyB1cyB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIGFzIGEgUmVhY3QgRWxlbWVudFxuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG4gICAgLy8gQnVpbHQtaW4gcHJvcGVydGllcyB0aGF0IGJlbG9uZyBvbiB0aGUgZWxlbWVudFxuICAgIHR5cGU6IHR5cGUsXG4gICAga2V5OiBrZXksXG4gICAgcmVmOiByZWYsXG4gICAgcHJvcHM6IHByb3BzLFxuICAgIC8vIFJlY29yZCB0aGUgY29tcG9uZW50IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGlzIGVsZW1lbnQuXG4gICAgX293bmVyOiBvd25lclxuICB9O1xuXG4gIHtcbiAgICAvLyBUaGUgdmFsaWRhdGlvbiBmbGFnIGlzIGN1cnJlbnRseSBtdXRhdGl2ZS4gV2UgcHV0IGl0IG9uXG4gICAgLy8gYW4gZXh0ZXJuYWwgYmFja2luZyBzdG9yZSBzbyB0aGF0IHdlIGNhbiBmcmVlemUgdGhlIHdob2xlIG9iamVjdC5cbiAgICAvLyBUaGlzIGNhbiBiZSByZXBsYWNlZCB3aXRoIGEgV2Vha01hcCBvbmNlIHRoZXkgYXJlIGltcGxlbWVudGVkIGluXG4gICAgLy8gY29tbW9ubHkgdXNlZCBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMuXG4gICAgZWxlbWVudC5fc3RvcmUgPSB7fTsgLy8gVG8gbWFrZSBjb21wYXJpbmcgUmVhY3RFbGVtZW50cyBlYXNpZXIgZm9yIHRlc3RpbmcgcHVycG9zZXMsIHdlIG1ha2VcbiAgICAvLyB0aGUgdmFsaWRhdGlvbiBmbGFnIG5vbi1lbnVtZXJhYmxlICh3aGVyZSBwb3NzaWJsZSwgd2hpY2ggc2hvdWxkXG4gICAgLy8gaW5jbHVkZSBldmVyeSBlbnZpcm9ubWVudCB3ZSBydW4gdGVzdHMgaW4pLCBzbyB0aGUgdGVzdCBmcmFtZXdvcmtcbiAgICAvLyBpZ25vcmVzIGl0LlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQuX3N0b3JlLCAndmFsaWRhdGVkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogZmFsc2VcbiAgICB9KTsgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBzZWxmXG4gICAgfSk7IC8vIFR3byBlbGVtZW50cyBjcmVhdGVkIGluIHR3byBkaWZmZXJlbnQgcGxhY2VzIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zb3VyY2UnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc291cmNlXG4gICAgfSk7XG5cbiAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgT2JqZWN0LmZyZWV6ZShlbGVtZW50LnByb3BzKTtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgb2YgdGhlIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI2NyZWF0ZWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KHR5cGUsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgdmFyIHByb3BOYW1lOyAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG5cbiAgdmFyIHByb3BzID0ge307XG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgcmVmID0gY29uZmlnLnJlZjtcblxuICAgICAge1xuICAgICAgICB3YXJuSWZTdHJpbmdSZWZDYW5ub3RCZUF1dG9Db252ZXJ0ZWQoY29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIHNlbGYgPSBjb25maWcuX19zZWxmID09PSB1bmRlZmluZWQgPyBudWxsIDogY29uZmlnLl9fc2VsZjtcbiAgICBzb3VyY2UgPSBjb25maWcuX19zb3VyY2UgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zb3VyY2U7IC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIGFyZSBhZGRlZCB0byBhIG5ldyBwcm9wcyBvYmplY3RcblxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9IC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG5cblxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcblxuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG5cbiAgICB7XG4gICAgICBpZiAoT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgICBPYmplY3QuZnJlZXplKGNoaWxkQXJyYXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByb3BzLmNoaWxkcmVuID0gY2hpbGRBcnJheTtcbiAgfSAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcblxuXG4gIGlmICh0eXBlICYmIHR5cGUuZGVmYXVsdFByb3BzKSB7XG4gICAgdmFyIGRlZmF1bHRQcm9wcyA9IHR5cGUuZGVmYXVsdFByb3BzO1xuXG4gICAgZm9yIChwcm9wTmFtZSBpbiBkZWZhdWx0UHJvcHMpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHtcbiAgICBpZiAoa2V5IHx8IHJlZikge1xuICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bicgOiB0eXBlO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQsIHByb3BzKTtcbn1cbmZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgdmFyIG5ld0VsZW1lbnQgPSBSZWFjdEVsZW1lbnQob2xkRWxlbWVudC50eXBlLCBuZXdLZXksIG9sZEVsZW1lbnQucmVmLCBvbGRFbGVtZW50Ll9zZWxmLCBvbGRFbGVtZW50Ll9zb3VyY2UsIG9sZEVsZW1lbnQuX293bmVyLCBvbGRFbGVtZW50LnByb3BzKTtcbiAgcmV0dXJuIG5ld0VsZW1lbnQ7XG59XG4vKipcbiAqIENsb25lIGFuZCByZXR1cm4gYSBuZXcgUmVhY3RFbGVtZW50IHVzaW5nIGVsZW1lbnQgYXMgdGhlIHN0YXJ0aW5nIHBvaW50LlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNjbG9uZWVsZW1lbnRcbiAqL1xuXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICBpZiAoISEoZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSB1bmRlZmluZWQpKSB7XG4gICAge1xuICAgICAgdGhyb3cgRXJyb3IoIFwiUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IFRoZSBhcmd1bWVudCBtdXN0IGJlIGEgUmVhY3QgZWxlbWVudCwgYnV0IHlvdSBwYXNzZWQgXCIgKyBlbGVtZW50ICsgXCIuXCIgKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcHJvcE5hbWU7IC8vIE9yaWdpbmFsIHByb3BzIGFyZSBjb3BpZWRcblxuICB2YXIgcHJvcHMgPSBfYXNzaWduKHt9LCBlbGVtZW50LnByb3BzKTsgLy8gUmVzZXJ2ZWQgbmFtZXMgYXJlIGV4dHJhY3RlZFxuXG5cbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7IC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG5cbiAgdmFyIHNlbGYgPSBlbGVtZW50Ll9zZWxmOyAvLyBTb3VyY2UgaXMgcHJlc2VydmVkIHNpbmNlIGNsb25lRWxlbWVudCBpcyB1bmxpa2VseSB0byBiZSB0YXJnZXRlZCBieSBhXG4gIC8vIHRyYW5zcGlsZXIsIGFuZCB0aGUgb3JpZ2luYWwgc291cmNlIGlzIHByb2JhYmx5IGEgYmV0dGVyIGluZGljYXRvciBvZiB0aGVcbiAgLy8gdHJ1ZSBvd25lci5cblxuICB2YXIgc291cmNlID0gZWxlbWVudC5fc291cmNlOyAvLyBPd25lciB3aWxsIGJlIHByZXNlcnZlZCwgdW5sZXNzIHJlZiBpcyBvdmVycmlkZGVuXG5cbiAgdmFyIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG5cbiAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIC8vIFNpbGVudGx5IHN0ZWFsIHRoZSByZWYgZnJvbSB0aGUgcGFyZW50LlxuICAgICAgcmVmID0gY29uZmlnLnJlZjtcbiAgICAgIG93bmVyID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudDtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH0gLy8gUmVtYWluaW5nIHByb3BlcnRpZXMgb3ZlcnJpZGUgZXhpc3RpbmcgcHJvcHNcblxuXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcblxuICAgIGlmIChlbGVtZW50LnR5cGUgJiYgZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcykge1xuICAgICAgZGVmYXVsdFByb3BzID0gZWxlbWVudC50eXBlLmRlZmF1bHRQcm9wcztcbiAgICB9XG5cbiAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiYgIVJFU0VSVkVEX1BST1BTLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICBpZiAoY29uZmlnW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkICYmIGRlZmF1bHRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gUmVzb2x2ZSBkZWZhdWx0IHByb3BzXG4gICAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gZGVmYXVsdFByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IC8vIENoaWxkcmVuIGNhbiBiZSBtb3JlIHRoYW4gb25lIGFyZ3VtZW50LCBhbmQgdGhvc2UgYXJlIHRyYW5zZmVycmVkIG9udG9cbiAgLy8gdGhlIG5ld2x5IGFsbG9jYXRlZCBwcm9wcyBvYmplY3QuXG5cblxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcblxuICBpZiAoY2hpbGRyZW5MZW5ndGggPT09IDEpIHtcbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB9IGVsc2UgaWYgKGNoaWxkcmVuTGVuZ3RoID4gMSkge1xuICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGlsZEFycmF5W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICB9XG5cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn1cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjaXN2YWxpZGVsZW1lbnRcbiAqIEBwYXJhbSB7P29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGBvYmplY3RgIGlzIGEgUmVhY3RFbGVtZW50LlxuICogQGZpbmFsXG4gKi9cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnQob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwgJiYgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG59XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuLyoqXG4gKiBFc2NhcGUgYW5kIHdyYXAga2V5IHNvIGl0IGlzIHNhZmUgdG8gdXNlIGFzIGEgcmVhY3RpZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgdG8gYmUgZXNjYXBlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIGVzY2FwZWQga2V5LlxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgdmFyIGVzY2FwZVJlZ2V4ID0gL1s9Ol0vZztcbiAgdmFyIGVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0nOiAnPTAnLFxuICAgICc6JzogJz0yJ1xuICB9O1xuICB2YXIgZXNjYXBlZFN0cmluZyA9ICgnJyArIGtleSkucmVwbGFjZShlc2NhcGVSZWdleCwgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgcmV0dXJuIGVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcbiAgcmV0dXJuICckJyArIGVzY2FwZWRTdHJpbmc7XG59XG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG5cbnZhciBkaWRXYXJuQWJvdXRNYXBzID0gZmFsc2U7XG52YXIgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nO1xuXG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gKCcnICsgdGV4dCkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuXG52YXIgUE9PTF9TSVpFID0gMTA7XG52YXIgdHJhdmVyc2VDb250ZXh0UG9vbCA9IFtdO1xuXG5mdW5jdGlvbiBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQobWFwUmVzdWx0LCBrZXlQcmVmaXgsIG1hcEZ1bmN0aW9uLCBtYXBDb250ZXh0KSB7XG4gIGlmICh0cmF2ZXJzZUNvbnRleHRQb29sLmxlbmd0aCkge1xuICAgIHZhciB0cmF2ZXJzZUNvbnRleHQgPSB0cmF2ZXJzZUNvbnRleHRQb29sLnBvcCgpO1xuICAgIHRyYXZlcnNlQ29udGV4dC5yZXN1bHQgPSBtYXBSZXN1bHQ7XG4gICAgdHJhdmVyc2VDb250ZXh0LmtleVByZWZpeCA9IGtleVByZWZpeDtcbiAgICB0cmF2ZXJzZUNvbnRleHQuZnVuYyA9IG1hcEZ1bmN0aW9uO1xuICAgIHRyYXZlcnNlQ29udGV4dC5jb250ZXh0ID0gbWFwQ29udGV4dDtcbiAgICB0cmF2ZXJzZUNvbnRleHQuY291bnQgPSAwO1xuICAgIHJldHVybiB0cmF2ZXJzZUNvbnRleHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdDogbWFwUmVzdWx0LFxuICAgICAga2V5UHJlZml4OiBrZXlQcmVmaXgsXG4gICAgICBmdW5jOiBtYXBGdW5jdGlvbixcbiAgICAgIGNvbnRleHQ6IG1hcENvbnRleHQsXG4gICAgICBjb3VudDogMFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVsZWFzZVRyYXZlcnNlQ29udGV4dCh0cmF2ZXJzZUNvbnRleHQpIHtcbiAgdHJhdmVyc2VDb250ZXh0LnJlc3VsdCA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5rZXlQcmVmaXggPSBudWxsO1xuICB0cmF2ZXJzZUNvbnRleHQuZnVuYyA9IG51bGw7XG4gIHRyYXZlcnNlQ29udGV4dC5jb250ZXh0ID0gbnVsbDtcbiAgdHJhdmVyc2VDb250ZXh0LmNvdW50ID0gMDtcblxuICBpZiAodHJhdmVyc2VDb250ZXh0UG9vbC5sZW5ndGggPCBQT09MX1NJWkUpIHtcbiAgICB0cmF2ZXJzZUNvbnRleHRQb29sLnB1c2godHJhdmVyc2VDb250ZXh0KTtcbiAgfVxufVxuLyoqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZVNvRmFyIE5hbWUgb2YgdGhlIGtleSBwYXRoIHNvIGZhci5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBpbnZva2Ugd2l0aCBlYWNoIGNoaWxkIGZvdW5kLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IFVzZWQgdG8gcGFzcyBpbmZvcm1hdGlvbiB0aHJvdWdob3V0IHRoZSB0cmF2ZXJzYWxcbiAqIHByb2Nlc3MuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCBuYW1lU29GYXIsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG5cbiAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIC8vIEFsbCBvZiB0aGUgYWJvdmUgYXJlIHBlcmNlaXZlZCBhcyBudWxsLlxuICAgIGNoaWxkcmVuID0gbnVsbDtcbiAgfVxuXG4gIHZhciBpbnZva2VDYWxsYmFjayA9IGZhbHNlO1xuXG4gIGlmIChjaGlsZHJlbiA9PT0gbnVsbCkge1xuICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBpbnZva2VDYWxsYmFjayA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBzd2l0Y2ggKGNoaWxkcmVuLiQkdHlwZW9mKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgICAgIGludm9rZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgaWYgKGludm9rZUNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodHJhdmVyc2VDb250ZXh0LCBjaGlsZHJlbiwgLy8gSWYgaXQncyB0aGUgb25seSBjaGlsZCwgdHJlYXQgdGhlIG5hbWUgYXMgaWYgaXQgd2FzIHdyYXBwZWQgaW4gYW4gYXJyYXlcbiAgICAvLyBzbyB0aGF0IGl0J3MgY29uc2lzdGVudCBpZiB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIGdyb3dzLlxuICAgIG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGRyZW4sIDApIDogbmFtZVNvRmFyKTtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBjaGlsZDtcbiAgdmFyIG5leHROYW1lO1xuICB2YXIgc3VidHJlZUNvdW50ID0gMDsgLy8gQ291bnQgb2YgY2hpbGRyZW4gZm91bmQgaW4gdGhlIGN1cnJlbnQgc3VidHJlZS5cblxuICB2YXIgbmV4dE5hbWVQcmVmaXggPSBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SIDogbmFtZVNvRmFyICsgU1VCU0VQQVJBVE9SO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBuZXh0TmFtZSA9IG5leHROYW1lUHJlZml4ICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkLCBpKTtcbiAgICAgIHN1YnRyZWVDb3VudCArPSB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZCwgbmV4dE5hbWUsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pO1xuXG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG5cbiAgICAgIHtcbiAgICAgICAgLy8gV2FybiBhYm91dCB1c2luZyBNYXBzIGFzIGNoaWxkcmVuXG4gICAgICAgIGlmIChpdGVyYXRvckZuID09PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgICAgaWYgKCFkaWRXYXJuQWJvdXRNYXBzKSB7XG4gICAgICAgICAgICB3YXJuKCdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIENvbnNpZGVyIGNvbnZlcnRpbmcgY2hpbGRyZW4gdG8gJyArICdhbiBhcnJheSBvZiBrZXllZCBSZWFjdEVsZW1lbnRzIGluc3RlYWQuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGlkV2FybkFib3V0TWFwcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKGNoaWxkcmVuKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGlpID0gMDtcblxuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGlpKyspO1xuICAgICAgICBzdWJ0cmVlQ291bnQgKz0gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGQsIG5leHROYW1lLCBjYWxsYmFjaywgdHJhdmVyc2VDb250ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICB2YXIgYWRkZW5kdW0gPSAnJztcblxuICAgICAge1xuICAgICAgICBhZGRlbmR1bSA9ICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICsgJ2luc3RlYWQuJyArIFJlYWN0RGVidWdDdXJyZW50RnJhbWUuZ2V0U3RhY2tBZGRlbmR1bSgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRyZW5TdHJpbmcgPSAnJyArIGNoaWxkcmVuO1xuXG4gICAgICB7XG4gICAgICAgIHtcbiAgICAgICAgICB0aHJvdyBFcnJvciggXCJPYmplY3RzIGFyZSBub3QgdmFsaWQgYXMgYSBSZWFjdCBjaGlsZCAoZm91bmQ6IFwiICsgKGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZykgKyBcIikuXCIgKyBhZGRlbmR1bSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1YnRyZWVDb3VudDtcbn1cbi8qKlxuICogVHJhdmVyc2VzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCwgYnV0XG4gKiBtaWdodCBhbHNvIGJlIHNwZWNpZmllZCB0aHJvdWdoIGF0dHJpYnV0ZXM6XG4gKlxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuLCAuLi4pYFxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmxlZnRQYW5lbENoaWxkcmVuLCAuLi4pYFxuICpcbiAqIFRoZSBgdHJhdmVyc2VDb250ZXh0YCBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGlzIHBhc3NlZCB0aHJvdWdoIHRoZVxuICogZW50aXJlIHRyYXZlcnNhbC4gSXQgY2FuIGJlIHVzZWQgdG8gc3RvcmUgYWNjdW11bGF0aW9ucyBvciBhbnl0aGluZyBlbHNlIHRoYXRcbiAqIHRoZSBjYWxsYmFjayBtaWdodCBmaW5kIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgb2JqZWN0LlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIFRvIGludm9rZSB1cG9uIHRyYXZlcnNpbmcgZWFjaCBjaGlsZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBDb250ZXh0IGZvciB0cmF2ZXJzYWwuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuSW1wbChjaGlsZHJlbiwgJycsIGNhbGxiYWNrLCB0cmF2ZXJzZUNvbnRleHQpO1xufVxuLyoqXG4gKiBHZW5lcmF0ZSBhIGtleSBzdHJpbmcgdGhhdCBpZGVudGlmaWVzIGEgY29tcG9uZW50IHdpdGhpbiBhIHNldC5cbiAqXG4gKiBAcGFyYW0geyp9IGNvbXBvbmVudCBBIGNvbXBvbmVudCB0aGF0IGNvdWxkIGNvbnRhaW4gYSBtYW51YWwga2V5LlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IEluZGV4IHRoYXQgaXMgdXNlZCBpZiBhIG1hbnVhbCBrZXkgaXMgbm90IHByb3ZpZGVkLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5cblxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50S2V5KGNvbXBvbmVudCwgaW5kZXgpIHtcbiAgLy8gRG8gc29tZSB0eXBlY2hlY2tpbmcgaGVyZSBzaW5jZSB3ZSBjYWxsIHRoaXMgYmxpbmRseS4gV2Ugd2FudCB0byBlbnN1cmVcbiAgLy8gdGhhdCB3ZSBkb24ndCBibG9jayBwb3RlbnRpYWwgZnV0dXJlIEVTIEFQSXMuXG4gIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSAnb2JqZWN0JyAmJiBjb21wb25lbnQgIT09IG51bGwgJiYgY29tcG9uZW50LmtleSAhPSBudWxsKSB7XG4gICAgLy8gRXhwbGljaXQga2V5XG4gICAgcmV0dXJuIGVzY2FwZShjb21wb25lbnQua2V5KTtcbiAgfSAvLyBJbXBsaWNpdCBrZXkgZGV0ZXJtaW5lZCBieSB0aGUgaW5kZXggaW4gdGhlIHNldFxuXG5cbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gZm9yRWFjaFNpbmdsZUNoaWxkKGJvb2tLZWVwaW5nLCBjaGlsZCwgbmFtZSkge1xuICB2YXIgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmMsXG4gICAgICBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcbiAgZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBib29rS2VlcGluZy5jb3VudCsrKTtcbn1cbi8qKlxuICogSXRlcmF0ZXMgdGhyb3VnaCBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmAuXG4gKlxuICogU2VlIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWFjdC1hcGkuaHRtbCNyZWFjdGNoaWxkcmVuZm9yZWFjaFxuICpcbiAqIFRoZSBwcm92aWRlZCBmb3JFYWNoRnVuYyhjaGlsZCwgaW5kZXgpIHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoXG4gKiBsZWFmIGNoaWxkLlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgY29udGFpbmVyLlxuICogQHBhcmFtIHtmdW5jdGlvbigqLCBpbnQpfSBmb3JFYWNoRnVuY1xuICogQHBhcmFtIHsqfSBmb3JFYWNoQ29udGV4dCBDb250ZXh0IGZvciBmb3JFYWNoQ29udGV4dC5cbiAqL1xuXG5cbmZ1bmN0aW9uIGZvckVhY2hDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KSB7XG4gIGlmIChjaGlsZHJlbiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IGdldFBvb2xlZFRyYXZlcnNlQ29udGV4dChudWxsLCBudWxsLCBmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoU2luZ2xlQ2hpbGQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIHJlbGVhc2VUcmF2ZXJzZUNvbnRleHQodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gbWFwU2luZ2xlQ2hpbGRJbnRvQ29udGV4dChib29rS2VlcGluZywgY2hpbGQsIGNoaWxkS2V5KSB7XG4gIHZhciByZXN1bHQgPSBib29rS2VlcGluZy5yZXN1bHQsXG4gICAgICBrZXlQcmVmaXggPSBib29rS2VlcGluZy5rZXlQcmVmaXgsXG4gICAgICBmdW5jID0gYm9va0tlZXBpbmcuZnVuYyxcbiAgICAgIGNvbnRleHQgPSBib29rS2VlcGluZy5jb250ZXh0O1xuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KG1hcHBlZENoaWxkKSkge1xuICAgIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwobWFwcGVkQ2hpbGQsIHJlc3VsdCwgY2hpbGRLZXksIGZ1bmN0aW9uIChjKSB7XG4gICAgICByZXR1cm4gYztcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtYXBwZWRDaGlsZCAhPSBudWxsKSB7XG4gICAgaWYgKGlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgbWFwcGVkQ2hpbGQgPSBjbG9uZUFuZFJlcGxhY2VLZXkobWFwcGVkQ2hpbGQsIC8vIEtlZXAgYm90aCB0aGUgKG1hcHBlZCkgYW5kIG9sZCBrZXlzIGlmIHRoZXkgZGlmZmVyLCBqdXN0IGFzXG4gICAgICAvLyB0cmF2ZXJzZUFsbENoaWxkcmVuIHVzZWQgdG8gZG8gZm9yIG9iamVjdHMgYXMgY2hpbGRyZW5cbiAgICAgIGtleVByZWZpeCArIChtYXBwZWRDaGlsZC5rZXkgJiYgKCFjaGlsZCB8fCBjaGlsZC5rZXkgIT09IG1hcHBlZENoaWxkLmtleSkgPyBlc2NhcGVVc2VyUHJvdmlkZWRLZXkobWFwcGVkQ2hpbGQua2V5KSArICcvJyA6ICcnKSArIGNoaWxkS2V5KTtcbiAgICB9XG5cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuXG4gIGlmIChwcmVmaXggIT0gbnVsbCkge1xuICAgIGVzY2FwZWRQcmVmaXggPSBlc2NhcGVVc2VyUHJvdmlkZWRLZXkocHJlZml4KSArICcvJztcbiAgfVxuXG4gIHZhciB0cmF2ZXJzZUNvbnRleHQgPSBnZXRQb29sZWRUcmF2ZXJzZUNvbnRleHQoYXJyYXksIGVzY2FwZWRQcmVmaXgsIGZ1bmMsIGNvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0LCB0cmF2ZXJzZUNvbnRleHQpO1xuICByZWxlYXNlVHJhdmVyc2VDb250ZXh0KHRyYXZlcnNlQ29udGV4dCk7XG59XG4vKipcbiAqIE1hcHMgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm1hcFxuICpcbiAqIFRoZSBwcm92aWRlZCBtYXBGdW5jdGlvbihjaGlsZCwga2V5LCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZ1bmMgVGhlIG1hcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBDb250ZXh0IGZvciBtYXBGdW5jdGlvbi5cbiAqIEByZXR1cm4ge29iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKi9cblxuXG5mdW5jdGlvbiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuYywgY29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jLCBjb250ZXh0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBjaGlsZHJlbiB0aGF0IGFyZSB0eXBpY2FsbHkgc3BlY2lmaWVkIGFzXG4gKiBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbmNvdW50XG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgY2hpbGRyZW4uXG4gKi9cblxuXG5mdW5jdGlvbiBjb3VudENoaWxkcmVuKGNoaWxkcmVuKSB7XG4gIHJldHVybiB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sIG51bGwpO1xufVxuLyoqXG4gKiBGbGF0dGVuIGEgY2hpbGRyZW4gb2JqZWN0ICh0eXBpY2FsbHkgc3BlY2lmaWVkIGFzIGBwcm9wcy5jaGlsZHJlbmApIGFuZFxuICogcmV0dXJuIGFuIGFycmF5IHdpdGggYXBwcm9wcmlhdGVseSByZS1rZXllZCBjaGlsZHJlbi5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9yZWFjdGpzLm9yZy9kb2NzL3JlYWN0LWFwaS5odG1sI3JlYWN0Y2hpbGRyZW50b2FycmF5XG4gKi9cblxuXG5mdW5jdGlvbiB0b0FycmF5KGNoaWxkcmVuKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgcmVzdWx0LCBudWxsLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQ7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBjaGlsZCBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4gYW5kIHZlcmlmaWVzIHRoYXQgdGhlcmVcbiAqIGlzIG9ubHkgb25lIGNoaWxkIGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFNlZSBodHRwczovL3JlYWN0anMub3JnL2RvY3MvcmVhY3QtYXBpLmh0bWwjcmVhY3RjaGlsZHJlbm9ubHlcbiAqXG4gKiBUaGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCBhIHNpbmdsZSBjaGlsZCBnZXRzXG4gKiBwYXNzZWQgd2l0aG91dCBhIHdyYXBwZXIsIGJ1dCB0aGUgcHVycG9zZSBvZiB0aGlzIGhlbHBlciBmdW5jdGlvbiBpcyB0b1xuICogYWJzdHJhY3QgYXdheSB0aGUgcGFydGljdWxhciBzdHJ1Y3R1cmUgb2YgY2hpbGRyZW4uXG4gKlxuICogQHBhcmFtIHs/b2JqZWN0fSBjaGlsZHJlbiBDaGlsZCBjb2xsZWN0aW9uIHN0cnVjdHVyZS5cbiAqIEByZXR1cm4ge1JlYWN0RWxlbWVudH0gVGhlIGZpcnN0IGFuZCBvbmx5IGBSZWFjdEVsZW1lbnRgIGNvbnRhaW5lZCBpbiB0aGVcbiAqIHN0cnVjdHVyZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIG9ubHlDaGlsZChjaGlsZHJlbikge1xuICBpZiAoIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcIlJlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLlwiICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDb250ZXh0KGRlZmF1bHRWYWx1ZSwgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpIHtcbiAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzID09PSB1bmRlZmluZWQpIHtcbiAgICBjYWxjdWxhdGVDaGFuZ2VkQml0cyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAge1xuICAgICAgaWYgKGNhbGN1bGF0ZUNoYW5nZWRCaXRzICE9PSBudWxsICYmIHR5cGVvZiBjYWxjdWxhdGVDaGFuZ2VkQml0cyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlcnJvcignY3JlYXRlQ29udGV4dDogRXhwZWN0ZWQgdGhlIG9wdGlvbmFsIHNlY29uZCBhcmd1bWVudCB0byBiZSBhICcgKyAnZnVuY3Rpb24uIEluc3RlYWQgcmVjZWl2ZWQ6ICVzJywgY2FsY3VsYXRlQ2hhbmdlZEJpdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBjb250ZXh0ID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9DT05URVhUX1RZUEUsXG4gICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjYWxjdWxhdGVDaGFuZ2VkQml0cyxcbiAgICAvLyBBcyBhIHdvcmthcm91bmQgdG8gc3VwcG9ydCBtdWx0aXBsZSBjb25jdXJyZW50IHJlbmRlcmVycywgd2UgY2F0ZWdvcml6ZVxuICAgIC8vIHNvbWUgcmVuZGVyZXJzIGFzIHByaW1hcnkgYW5kIG90aGVycyBhcyBzZWNvbmRhcnkuIFdlIG9ubHkgZXhwZWN0XG4gICAgLy8gdGhlcmUgdG8gYmUgdHdvIGNvbmN1cnJlbnQgcmVuZGVyZXJzIGF0IG1vc3Q6IFJlYWN0IE5hdGl2ZSAocHJpbWFyeSkgYW5kXG4gICAgLy8gRmFicmljIChzZWNvbmRhcnkpOyBSZWFjdCBET00gKHByaW1hcnkpIGFuZCBSZWFjdCBBUlQgKHNlY29uZGFyeSkuXG4gICAgLy8gU2Vjb25kYXJ5IHJlbmRlcmVycyBzdG9yZSB0aGVpciBjb250ZXh0IHZhbHVlcyBvbiBzZXBhcmF0ZSBmaWVsZHMuXG4gICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgLy8gVXNlZCB0byB0cmFjayBob3cgbWFueSBjb25jdXJyZW50IHJlbmRlcmVycyB0aGlzIGNvbnRleHQgY3VycmVudGx5XG4gICAgLy8gc3VwcG9ydHMgd2l0aGluIGluIGEgc2luZ2xlIHJlbmRlcmVyLiBTdWNoIGFzIHBhcmFsbGVsIHNlcnZlciByZW5kZXJpbmcuXG4gICAgX3RocmVhZENvdW50OiAwLFxuICAgIC8vIFRoZXNlIGFyZSBjaXJjdWxhclxuICAgIFByb3ZpZGVyOiBudWxsLFxuICAgIENvbnN1bWVyOiBudWxsXG4gIH07XG4gIGNvbnRleHQuUHJvdmlkZXIgPSB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX1BST1ZJREVSX1RZUEUsXG4gICAgX2NvbnRleHQ6IGNvbnRleHRcbiAgfTtcbiAgdmFyIGhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzID0gZmFsc2U7XG4gIHZhciBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IGZhbHNlO1xuXG4gIHtcbiAgICAvLyBBIHNlcGFyYXRlIG9iamVjdCwgYnV0IHByb3hpZXMgYmFjayB0byB0aGUgb3JpZ2luYWwgY29udGV4dCBvYmplY3QgZm9yXG4gICAgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIEl0IGhhcyBhIGRpZmZlcmVudCAkJHR5cGVvZiwgc28gd2UgY2FuIHByb3Blcmx5XG4gICAgLy8gd2FybiBmb3IgdGhlIGluY29ycmVjdCB1c2FnZSBvZiBDb250ZXh0IGFzIGEgQ29uc3VtZXIuXG4gICAgdmFyIENvbnN1bWVyID0ge1xuICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgIF9jb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2NhbGN1bGF0ZUNoYW5nZWRCaXRzOiBjb250ZXh0Ll9jYWxjdWxhdGVDaGFuZ2VkQml0c1xuICAgIH07IC8vICRGbG93Rml4TWU6IEZsb3cgY29tcGxhaW5zIGFib3V0IG5vdCBzZXR0aW5nIGEgdmFsdWUsIHdoaWNoIGlzIGludGVudGlvbmFsIGhlcmVcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENvbnN1bWVyLCB7XG4gICAgICBQcm92aWRlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdDb25zdW1lclByb3ZpZGVyKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nQ29uc3VtZXJQcm92aWRlciA9IHRydWU7XG5cbiAgICAgICAgICAgIGVycm9yKCdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuUHJvdmlkZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuUHJvdmlkZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuUHJvdmlkZXI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9Qcm92aWRlcikge1xuICAgICAgICAgIGNvbnRleHQuUHJvdmlkZXIgPSBfUHJvdmlkZXI7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBfY3VycmVudFZhbHVlOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll9jdXJyZW50VmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICBjb250ZXh0Ll9jdXJyZW50VmFsdWUgPSBfY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX2N1cnJlbnRWYWx1ZTI6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuX2N1cnJlbnRWYWx1ZTI7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKF9jdXJyZW50VmFsdWUyKSB7XG4gICAgICAgICAgY29udGV4dC5fY3VycmVudFZhbHVlMiA9IF9jdXJyZW50VmFsdWUyO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgX3RocmVhZENvdW50OiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0Ll90aHJlYWRDb3VudDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoX3RocmVhZENvdW50KSB7XG4gICAgICAgICAgY29udGV4dC5fdGhyZWFkQ291bnQgPSBfdGhyZWFkQ291bnQ7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDb25zdW1lcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoIWhhc1dhcm5lZEFib3V0VXNpbmdOZXN0ZWRDb250ZXh0Q29uc3VtZXJzKSB7XG4gICAgICAgICAgICBoYXNXYXJuZWRBYm91dFVzaW5nTmVzdGVkQ29udGV4dENvbnN1bWVycyA9IHRydWU7XG5cbiAgICAgICAgICAgIGVycm9yKCdSZW5kZXJpbmcgPENvbnRleHQuQ29uc3VtZXIuQ29uc3VtZXI+IGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIERpZCB5b3UgbWVhbiB0byByZW5kZXIgPENvbnRleHQuQ29uc3VtZXI+IGluc3RlYWQ/Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQuQ29uc3VtZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTsgLy8gJEZsb3dGaXhNZTogRmxvdyBjb21wbGFpbnMgYWJvdXQgbWlzc2luZyBwcm9wZXJ0aWVzIGJlY2F1c2UgaXQgZG9lc24ndCB1bmRlcnN0YW5kIGRlZmluZVByb3BlcnR5XG5cbiAgICBjb250ZXh0LkNvbnN1bWVyID0gQ29uc3VtZXI7XG4gIH1cblxuICB7XG4gICAgY29udGV4dC5fY3VycmVudFJlbmRlcmVyID0gbnVsbDtcbiAgICBjb250ZXh0Ll9jdXJyZW50UmVuZGVyZXIyID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0O1xufVxuXG5mdW5jdGlvbiBsYXp5KGN0b3IpIHtcbiAgdmFyIGxhenlUeXBlID0ge1xuICAgICQkdHlwZW9mOiBSRUFDVF9MQVpZX1RZUEUsXG4gICAgX2N0b3I6IGN0b3IsXG4gICAgLy8gUmVhY3QgdXNlcyB0aGVzZSBmaWVsZHMgdG8gc3RvcmUgdGhlIHJlc3VsdC5cbiAgICBfc3RhdHVzOiAtMSxcbiAgICBfcmVzdWx0OiBudWxsXG4gIH07XG5cbiAge1xuICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoaXMgd291bGQganVzdCBzZXQgaXQgb24gdGhlIG9iamVjdC5cbiAgICB2YXIgZGVmYXVsdFByb3BzO1xuICAgIHZhciBwcm9wVHlwZXM7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMobGF6eVR5cGUsIHtcbiAgICAgIGRlZmF1bHRQcm9wczoge1xuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBkZWZhdWx0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5ld0RlZmF1bHRQcm9wcykge1xuICAgICAgICAgIGVycm9yKCdSZWFjdC5sYXp5KC4uLik6IEl0IGlzIG5vdCBzdXBwb3J0ZWQgdG8gYXNzaWduIGBkZWZhdWx0UHJvcHNgIHRvICcgKyAnYSBsYXp5IGNvbXBvbmVudCBpbXBvcnQuIEVpdGhlciBzcGVjaWZ5IHRoZW0gd2hlcmUgdGhlIGNvbXBvbmVudCAnICsgJ2lzIGRlZmluZWQsIG9yIGNyZWF0ZSBhIHdyYXBwaW5nIGNvbXBvbmVudCBhcm91bmQgaXQuJyk7XG5cbiAgICAgICAgICBkZWZhdWx0UHJvcHMgPSBuZXdEZWZhdWx0UHJvcHM7IC8vIE1hdGNoIHByb2R1Y3Rpb24gYmVoYXZpb3IgbW9yZSBjbG9zZWx5OlxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGxhenlUeXBlLCAnZGVmYXVsdFByb3BzJywge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3BUeXBlcztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3UHJvcFR5cGVzKSB7XG4gICAgICAgICAgZXJyb3IoJ1JlYWN0LmxhenkoLi4uKTogSXQgaXMgbm90IHN1cHBvcnRlZCB0byBhc3NpZ24gYHByb3BUeXBlc2AgdG8gJyArICdhIGxhenkgY29tcG9uZW50IGltcG9ydC4gRWl0aGVyIHNwZWNpZnkgdGhlbSB3aGVyZSB0aGUgY29tcG9uZW50ICcgKyAnaXMgZGVmaW5lZCwgb3IgY3JlYXRlIGEgd3JhcHBpbmcgY29tcG9uZW50IGFyb3VuZCBpdC4nKTtcblxuICAgICAgICAgIHByb3BUeXBlcyA9IG5ld1Byb3BUeXBlczsgLy8gTWF0Y2ggcHJvZHVjdGlvbiBiZWhhdmlvciBtb3JlIGNsb3NlbHk6XG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobGF6eVR5cGUsICdwcm9wVHlwZXMnLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBsYXp5VHlwZTtcbn1cblxuZnVuY3Rpb24gZm9yd2FyZFJlZihyZW5kZXIpIHtcbiAge1xuICAgIGlmIChyZW5kZXIgIT0gbnVsbCAmJiByZW5kZXIuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkge1xuICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHJlY2VpdmVkIGEgYG1lbW9gICcgKyAnY29tcG9uZW50LiBJbnN0ZWFkIG9mIGZvcndhcmRSZWYobWVtbyguLi4pKSwgdXNlICcgKyAnbWVtbyhmb3J3YXJkUmVmKC4uLikpLicpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlbmRlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHdhcyBnaXZlbiAlcy4nLCByZW5kZXIgPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2YgcmVuZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlbmRlci5sZW5ndGggIT09IDAgJiYgcmVuZGVyLmxlbmd0aCAhPT0gMikge1xuICAgICAgICBlcnJvcignZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGFjY2VwdCBleGFjdGx5IHR3byBwYXJhbWV0ZXJzOiBwcm9wcyBhbmQgcmVmLiAlcycsIHJlbmRlci5sZW5ndGggPT09IDEgPyAnRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyPycgOiAnQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZW5kZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlbmRlci5kZWZhdWx0UHJvcHMgIT0gbnVsbCB8fCByZW5kZXIucHJvcFR5cGVzICE9IG51bGwpIHtcbiAgICAgICAgZXJyb3IoJ2ZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBkbyBub3Qgc3VwcG9ydCBwcm9wVHlwZXMgb3IgZGVmYXVsdFByb3BzLiAnICsgJ0RpZCB5b3UgYWNjaWRlbnRhbGx5IHBhc3MgYSBSZWFjdCBjb21wb25lbnQ/Jyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSxcbiAgICByZW5kZXI6IHJlbmRlclxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICByZXR1cm4gdHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IC8vIE5vdGU6IGl0cyB0eXBlb2YgbWlnaHQgYmUgb3RoZXIgdGhhbiAnc3ltYm9sJyBvciAnbnVtYmVyJyBpZiBpdCdzIGEgcG9seWZpbGwuXG4gIHR5cGUgPT09IFJFQUNUX0ZSQUdNRU5UX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfQ09OQ1VSUkVOVF9NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFIHx8IHR5cGVvZiB0eXBlID09PSAnb2JqZWN0JyAmJiB0eXBlICE9PSBudWxsICYmICh0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTUVNT19UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX1BST1ZJREVSX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRlVOREFNRU5UQUxfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9SRVNQT05ERVJfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9TQ09QRV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0JMT0NLX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBtZW1vKHR5cGUsIGNvbXBhcmUpIHtcbiAge1xuICAgIGlmICghaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpKSB7XG4gICAgICBlcnJvcignbWVtbzogVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBjb21wb25lbnQuIEluc3RlYWQgJyArICdyZWNlaXZlZDogJXMnLCB0eXBlID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGNvbXBhcmU6IGNvbXBhcmUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb21wYXJlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVEaXNwYXRjaGVyKCkge1xuICB2YXIgZGlzcGF0Y2hlciA9IFJlYWN0Q3VycmVudERpc3BhdGNoZXIuY3VycmVudDtcblxuICBpZiAoIShkaXNwYXRjaGVyICE9PSBudWxsKSkge1xuICAgIHtcbiAgICAgIHRocm93IEVycm9yKCBcIkludmFsaWQgaG9vayBjYWxsLiBIb29rcyBjYW4gb25seSBiZSBjYWxsZWQgaW5zaWRlIG9mIHRoZSBib2R5IG9mIGEgZnVuY3Rpb24gY29tcG9uZW50LiBUaGlzIGNvdWxkIGhhcHBlbiBmb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgcmVhc29uczpcXG4xLiBZb3UgbWlnaHQgaGF2ZSBtaXNtYXRjaGluZyB2ZXJzaW9ucyBvZiBSZWFjdCBhbmQgdGhlIHJlbmRlcmVyIChzdWNoIGFzIFJlYWN0IERPTSlcXG4yLiBZb3UgbWlnaHQgYmUgYnJlYWtpbmcgdGhlIFJ1bGVzIG9mIEhvb2tzXFxuMy4gWW91IG1pZ2h0IGhhdmUgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIFJlYWN0IGluIHRoZSBzYW1lIGFwcFxcblNlZSBodHRwczovL2ZiLm1lL3JlYWN0LWludmFsaWQtaG9vay1jYWxsIGZvciB0aXBzIGFib3V0IGhvdyB0byBkZWJ1ZyBhbmQgZml4IHRoaXMgcHJvYmxlbS5cIiApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkaXNwYXRjaGVyO1xufVxuXG5mdW5jdGlvbiB1c2VDb250ZXh0KENvbnRleHQsIHVuc3RhYmxlX29ic2VydmVkQml0cykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG5cbiAge1xuICAgIGlmICh1bnN0YWJsZV9vYnNlcnZlZEJpdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IoJ3VzZUNvbnRleHQoKSBzZWNvbmQgYXJndW1lbnQgaXMgcmVzZXJ2ZWQgZm9yIGZ1dHVyZSAnICsgJ3VzZSBpbiBSZWFjdC4gUGFzc2luZyBpdCBpcyBub3Qgc3VwcG9ydGVkLiAnICsgJ1lvdSBwYXNzZWQ6ICVzLiVzJywgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzLCB0eXBlb2YgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KGFyZ3VtZW50c1syXSkgPyAnXFxuXFxuRGlkIHlvdSBjYWxsIGFycmF5Lm1hcCh1c2VDb250ZXh0KT8gJyArICdDYWxsaW5nIEhvb2tzIGluc2lkZSBhIGxvb3AgaXMgbm90IHN1cHBvcnRlZC4gJyArICdMZWFybiBtb3JlIGF0IGh0dHBzOi8vZmIubWUvcnVsZXMtb2YtaG9va3MnIDogJycpO1xuICAgIH0gLy8gVE9ETzogYWRkIGEgbW9yZSBnZW5lcmljIHdhcm5pbmcgZm9yIGludmFsaWQgdmFsdWVzLlxuXG5cbiAgICBpZiAoQ29udGV4dC5fY29udGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgcmVhbENvbnRleHQgPSBDb250ZXh0Ll9jb250ZXh0OyAvLyBEb24ndCBkZWR1cGxpY2F0ZSBiZWNhdXNlIHRoaXMgbGVnaXRpbWF0ZWx5IGNhdXNlcyBidWdzXG4gICAgICAvLyBhbmQgbm9ib2R5IHNob3VsZCBiZSB1c2luZyB0aGlzIGluIGV4aXN0aW5nIGNvZGUuXG5cbiAgICAgIGlmIChyZWFsQ29udGV4dC5Db25zdW1lciA9PT0gQ29udGV4dCkge1xuICAgICAgICBlcnJvcignQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuQ29uc3VtZXIpIGlzIG5vdCBzdXBwb3J0ZWQsIG1heSBjYXVzZSBidWdzLCBhbmQgd2lsbCBiZSAnICsgJ3JlbW92ZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS4gRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfSBlbHNlIGlmIChyZWFsQ29udGV4dC5Qcm92aWRlciA9PT0gQ29udGV4dCkge1xuICAgICAgICBlcnJvcignQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuUHJvdmlkZXIpIGlzIG5vdCBzdXBwb3J0ZWQuICcgKyAnRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkPycpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUNvbnRleHQoQ29udGV4dCwgdW5zdGFibGVfb2JzZXJ2ZWRCaXRzKTtcbn1cbmZ1bmN0aW9uIHVzZVN0YXRlKGluaXRpYWxTdGF0ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVN0YXRlKGluaXRpYWxTdGF0ZSk7XG59XG5mdW5jdGlvbiB1c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VSZWR1Y2VyKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpO1xufVxuZnVuY3Rpb24gdXNlUmVmKGluaXRpYWxWYWx1ZSkge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZVJlZihpbml0aWFsVmFsdWUpO1xufVxuZnVuY3Rpb24gdXNlRWZmZWN0KGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUVmZmVjdChjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZUxheW91dEVmZmVjdChjcmVhdGUsIGRlcHMpO1xufVxuZnVuY3Rpb24gdXNlQ2FsbGJhY2soY2FsbGJhY2ssIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VDYWxsYmFjayhjYWxsYmFjaywgZGVwcyk7XG59XG5mdW5jdGlvbiB1c2VNZW1vKGNyZWF0ZSwgZGVwcykge1xuICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gIHJldHVybiBkaXNwYXRjaGVyLnVzZU1lbW8oY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGRlcHMpIHtcbiAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICByZXR1cm4gZGlzcGF0Y2hlci51c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBkZXBzKTtcbn1cbmZ1bmN0aW9uIHVzZURlYnVnVmFsdWUodmFsdWUsIGZvcm1hdHRlckZuKSB7XG4gIHtcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gICAgcmV0dXJuIGRpc3BhdGNoZXIudXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pO1xuICB9XG59XG5cbnZhciBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93bjtcblxue1xuICBwcm9wVHlwZXNNaXNzcGVsbFdhcm5pbmdTaG93biA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSB7XG4gIGlmIChSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lKFJlYWN0Q3VycmVudE93bmVyLmN1cnJlbnQudHlwZSk7XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuICdcXG5cXG5DaGVjayB0aGUgcmVuZGVyIG1ldGhvZCBvZiBgJyArIG5hbWUgKyAnYC4nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAnJztcbn1cblxuZnVuY3Rpb24gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW0oc291cmNlKSB7XG4gIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBmaWxlTmFtZSA9IHNvdXJjZS5maWxlTmFtZS5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJyk7XG4gICAgdmFyIGxpbmVOdW1iZXIgPSBzb3VyY2UubGluZU51bWJlcjtcbiAgICByZXR1cm4gJ1xcblxcbkNoZWNrIHlvdXIgY29kZSBhdCAnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJy4nO1xuICB9XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VJbmZvRXJyb3JBZGRlbmR1bUZvclByb3BzKGVsZW1lbnRQcm9wcykge1xuICBpZiAoZWxlbWVudFByb3BzICE9PSBudWxsICYmIGVsZW1lbnRQcm9wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGdldFNvdXJjZUluZm9FcnJvckFkZGVuZHVtKGVsZW1lbnRQcm9wcy5fX3NvdXJjZSk7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG4vKipcbiAqIFdhcm4gaWYgdGhlcmUncyBubyBrZXkgZXhwbGljaXRseSBzZXQgb24gZHluYW1pYyBhcnJheXMgb2YgY2hpbGRyZW4gb3JcbiAqIG9iamVjdCBrZXlzIGFyZSBub3QgdmFsaWQuIFRoaXMgYWxsb3dzIHVzIHRvIGtlZXAgdHJhY2sgb2YgY2hpbGRyZW4gYmV0d2VlblxuICogdXBkYXRlcy5cbiAqL1xuXG5cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgaWYgKCFpbmZvKSB7XG4gICAgdmFyIHBhcmVudE5hbWUgPSB0eXBlb2YgcGFyZW50VHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnRUeXBlIDogcGFyZW50VHlwZS5kaXNwbGF5TmFtZSB8fCBwYXJlbnRUeXBlLm5hbWU7XG5cbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgaW5mbyA9IFwiXFxuXFxuQ2hlY2sgdGhlIHRvcC1sZXZlbCByZW5kZXIgY2FsbCB1c2luZyA8XCIgKyBwYXJlbnROYW1lICsgXCI+LlwiO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmZvO1xufVxuLyoqXG4gKiBXYXJuIGlmIHRoZSBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbiBleHBsaWNpdCBrZXkgYXNzaWduZWQgdG8gaXQuXG4gKiBUaGlzIGVsZW1lbnQgaXMgaW4gYW4gYXJyYXkuIFRoZSBhcnJheSBjb3VsZCBncm93IGFuZCBzaHJpbmsgb3IgYmVcbiAqIHJlb3JkZXJlZC4gQWxsIGNoaWxkcmVuIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gdmFsaWRhdGVkIGFyZSByZXF1aXJlZCB0b1xuICogaGF2ZSBhIFwia2V5XCIgcHJvcGVydHkgYXNzaWduZWQgdG8gaXQuIEVycm9yIHN0YXR1c2VzIGFyZSBjYWNoZWQgc28gYSB3YXJuaW5nXG4gKiB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgdGhhdCByZXF1aXJlcyBhIGtleS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBlbGVtZW50J3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlRXhwbGljaXRLZXkoZWxlbWVudCwgcGFyZW50VHlwZSkge1xuICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZWxlbWVudC5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgdmFyIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8gPSBnZXRDdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvKHBhcmVudFR5cGUpO1xuXG4gIGlmIChvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBvd25lckhhc0tleVVzZVdhcm5pbmdbY3VycmVudENvbXBvbmVudEVycm9ySW5mb10gPSB0cnVlOyAvLyBVc3VhbGx5IHRoZSBjdXJyZW50IG93bmVyIGlzIHRoZSBvZmZlbmRlciwgYnV0IGlmIGl0IGFjY2VwdHMgY2hpbGRyZW4gYXMgYVxuICAvLyBwcm9wZXJ0eSwgaXQgbWF5IGJlIHRoZSBjcmVhdG9yIG9mIHRoZSBjaGlsZCB0aGF0J3MgcmVzcG9uc2libGUgZm9yXG4gIC8vIGFzc2lnbmluZyBpdCBhIGtleS5cblxuICB2YXIgY2hpbGRPd25lciA9ICcnO1xuXG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgY2hpbGRPd25lciA9IFwiIEl0IHdhcyBwYXNzZWQgYSBjaGlsZCBmcm9tIFwiICsgZ2V0Q29tcG9uZW50TmFtZShlbGVtZW50Ll9vd25lci50eXBlKSArIFwiLlwiO1xuICB9XG5cbiAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG5cbiAge1xuICAgIGVycm9yKCdFYWNoIGNoaWxkIGluIGEgbGlzdCBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLCBjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvLCBjaGlsZE93bmVyKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xufVxuLyoqXG4gKiBFbnN1cmUgdGhhdCBldmVyeSBlbGVtZW50IGVpdGhlciBpcyBwYXNzZWQgaW4gYSBzdGF0aWMgbG9jYXRpb24sIGluIGFuXG4gKiBhcnJheSB3aXRoIGFuIGV4cGxpY2l0IGtleXMgcHJvcGVydHkgZGVmaW5lZCwgb3IgaW4gYW4gb2JqZWN0IGxpdGVyYWxcbiAqIHdpdGggdmFsaWQga2V5IHByb3BlcnR5LlxuICpcbiAqIEBpbnRlcm5hbFxuICogQHBhcmFtIHtSZWFjdE5vZGV9IG5vZGUgU3RhdGljYWxseSBwYXNzZWQgY2hpbGQgb2YgYW55IHR5cGUuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgbm9kZSdzIHBhcmVudCdzIHR5cGUuXG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNoaWxkS2V5cyhub2RlLCBwYXJlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZVtpXTtcblxuICAgICAgaWYgKGlzVmFsaWRFbGVtZW50KGNoaWxkKSkge1xuICAgICAgICB2YWxpZGF0ZUV4cGxpY2l0S2V5KGNoaWxkLCBwYXJlbnRUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNWYWxpZEVsZW1lbnQobm9kZSkpIHtcbiAgICAvLyBUaGlzIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiBhIHZhbGlkIGxvY2F0aW9uLlxuICAgIGlmIChub2RlLl9zdG9yZSkge1xuICAgICAgbm9kZS5fc3RvcmUudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobm9kZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihub2RlKTtcblxuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gRW50cnkgaXRlcmF0b3JzIHVzZWQgdG8gcHJvdmlkZSBpbXBsaWNpdCBrZXlzLFxuICAgICAgLy8gYnV0IG5vdyB3ZSBwcmludCBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIHRoZW0gbGF0ZXIuXG4gICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gbm9kZS5lbnRyaWVzKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChub2RlKTtcbiAgICAgICAgdmFyIHN0ZXA7XG5cbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChpc1ZhbGlkRWxlbWVudChzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShzdGVwLnZhbHVlLCBwYXJlbnRUeXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiB2YWxpZGF0ZVByb3BUeXBlcyhlbGVtZW50KSB7XG4gIHtcbiAgICB2YXIgdHlwZSA9IGVsZW1lbnQudHlwZTtcblxuICAgIGlmICh0eXBlID09PSBudWxsIHx8IHR5cGUgPT09IHVuZGVmaW5lZCB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmFtZSA9IGdldENvbXBvbmVudE5hbWUodHlwZSk7XG4gICAgdmFyIHByb3BUeXBlcztcblxuICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcHJvcFR5cGVzID0gdHlwZS5wcm9wVHlwZXM7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcgJiYgKHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgfHwgLy8gTm90ZTogTWVtbyBvbmx5IGNoZWNrcyBvdXRlciBwcm9wcyBoZXJlLlxuICAgIC8vIElubmVyIHByb3BzIGFyZSBjaGVja2VkIGluIHRoZSByZWNvbmNpbGVyLlxuICAgIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSkpIHtcbiAgICAgIHByb3BUeXBlcyA9IHR5cGUucHJvcFR5cGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BUeXBlcykge1xuICAgICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZWxlbWVudCk7XG4gICAgICBjaGVja1Byb3BUeXBlcyhwcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsICdwcm9wJywgbmFtZSwgUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZS5nZXRTdGFja0FkZGVuZHVtKTtcbiAgICAgIHNldEN1cnJlbnRseVZhbGlkYXRpbmdFbGVtZW50KG51bGwpO1xuICAgIH0gZWxzZSBpZiAodHlwZS5Qcm9wVHlwZXMgIT09IHVuZGVmaW5lZCAmJiAhcHJvcFR5cGVzTWlzc3BlbGxXYXJuaW5nU2hvd24pIHtcbiAgICAgIHByb3BUeXBlc01pc3NwZWxsV2FybmluZ1Nob3duID0gdHJ1ZTtcblxuICAgICAgZXJyb3IoJ0NvbXBvbmVudCAlcyBkZWNsYXJlZCBgUHJvcFR5cGVzYCBpbnN0ZWFkIG9mIGBwcm9wVHlwZXNgLiBEaWQgeW91IG1pc3NwZWxsIHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50PycsIG5hbWUgfHwgJ1Vua25vd24nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHR5cGUuZ2V0RGVmYXVsdFByb3BzID09PSAnZnVuY3Rpb24nICYmICF0eXBlLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCkge1xuICAgICAgZXJyb3IoJ2dldERlZmF1bHRQcm9wcyBpcyBvbmx5IHVzZWQgb24gY2xhc3NpYyBSZWFjdC5jcmVhdGVDbGFzcyAnICsgJ2RlZmluaXRpb25zLiBVc2UgYSBzdGF0aWMgcHJvcGVydHkgbmFtZWQgYGRlZmF1bHRQcm9wc2AgaW5zdGVhZC4nKTtcbiAgICB9XG4gIH1cbn1cbi8qKlxuICogR2l2ZW4gYSBmcmFnbWVudCwgdmFsaWRhdGUgdGhhdCBpdCBjYW4gb25seSBiZSBwcm92aWRlZCB3aXRoIGZyYWdtZW50IHByb3BzXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZnJhZ21lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIHZhbGlkYXRlRnJhZ21lbnRQcm9wcyhmcmFnbWVudCkge1xuICB7XG4gICAgc2V0Q3VycmVudGx5VmFsaWRhdGluZ0VsZW1lbnQoZnJhZ21lbnQpO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZnJhZ21lbnQucHJvcHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcblxuICAgICAgaWYgKGtleSAhPT0gJ2NoaWxkcmVuJyAmJiBrZXkgIT09ICdrZXknKSB7XG4gICAgICAgIGVycm9yKCdJbnZhbGlkIHByb3AgYCVzYCBzdXBwbGllZCB0byBgUmVhY3QuRnJhZ21lbnRgLiAnICsgJ1JlYWN0LkZyYWdtZW50IGNhbiBvbmx5IGhhdmUgYGtleWAgYW5kIGBjaGlsZHJlbmAgcHJvcHMuJywga2V5KTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnJhZ21lbnQucmVmICE9PSBudWxsKSB7XG4gICAgICBlcnJvcignSW52YWxpZCBhdHRyaWJ1dGUgYHJlZmAgc3VwcGxpZWQgdG8gYFJlYWN0LkZyYWdtZW50YC4nKTtcbiAgICB9XG5cbiAgICBzZXRDdXJyZW50bHlWYWxpZGF0aW5nRWxlbWVudChudWxsKTtcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uKHR5cGUsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgdmFsaWRUeXBlID0gaXNWYWxpZEVsZW1lbnRUeXBlKHR5cGUpOyAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAvLyBzdWNjZWVkIGFuZCB0aGVyZSB3aWxsIGxpa2VseSBiZSBlcnJvcnMgaW4gcmVuZGVyLlxuXG4gIGlmICghdmFsaWRUeXBlKSB7XG4gICAgdmFyIGluZm8gPSAnJztcblxuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwgJiYgT2JqZWN0LmtleXModHlwZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICBpbmZvICs9ICcgWW91IGxpa2VseSBmb3Jnb3QgdG8gZXhwb3J0IHlvdXIgY29tcG9uZW50IGZyb20gdGhlIGZpbGUgJyArIFwiaXQncyBkZWZpbmVkIGluLCBvciB5b3UgbWlnaHQgaGF2ZSBtaXhlZCB1cCBkZWZhdWx0IGFuZCBuYW1lZCBpbXBvcnRzLlwiO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VJbmZvID0gZ2V0U291cmNlSW5mb0Vycm9yQWRkZW5kdW1Gb3JQcm9wcyhwcm9wcyk7XG5cbiAgICBpZiAoc291cmNlSW5mbykge1xuICAgICAgaW5mbyArPSBzb3VyY2VJbmZvO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvICs9IGdldERlY2xhcmF0aW9uRXJyb3JBZGRlbmR1bSgpO1xuICAgIH1cblxuICAgIHZhciB0eXBlU3RyaW5nO1xuXG4gICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSAnbnVsbCc7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHR5cGUpKSB7XG4gICAgICB0eXBlU3RyaW5nID0gJ2FycmF5JztcbiAgICB9IGVsc2UgaWYgKHR5cGUgIT09IHVuZGVmaW5lZCAmJiB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEUpIHtcbiAgICAgIHR5cGVTdHJpbmcgPSBcIjxcIiArIChnZXRDb21wb25lbnROYW1lKHR5cGUudHlwZSkgfHwgJ1Vua25vd24nKSArIFwiIC8+XCI7XG4gICAgICBpbmZvID0gJyBEaWQgeW91IGFjY2lkZW50YWxseSBleHBvcnQgYSBKU1ggbGl0ZXJhbCBpbnN0ZWFkIG9mIGEgY29tcG9uZW50Pyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVTdHJpbmcgPSB0eXBlb2YgdHlwZTtcbiAgICB9XG5cbiAgICB7XG4gICAgICBlcnJvcignUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBpcyBpbnZhbGlkIC0tIGV4cGVjdGVkIGEgc3RyaW5nIChmb3IgJyArICdidWlsdC1pbiBjb21wb25lbnRzKSBvciBhIGNsYXNzL2Z1bmN0aW9uIChmb3IgY29tcG9zaXRlICcgKyAnY29tcG9uZW50cykgYnV0IGdvdDogJXMuJXMnLCB0eXBlU3RyaW5nLCBpbmZvKTtcbiAgICB9XG4gIH1cblxuICB2YXIgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgLy8gVE9ETzogRHJvcCB0aGlzIHdoZW4gdGhlc2UgYXJlIG5vIGxvbmdlciBhbGxvd2VkIGFzIHRoZSB0eXBlIGFyZ3VtZW50LlxuXG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSAvLyBTa2lwIGtleSB3YXJuaW5nIGlmIHRoZSB0eXBlIGlzbid0IHZhbGlkIHNpbmNlIG91ciBrZXkgdmFsaWRhdGlvbiBsb2dpY1xuICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gIC8vIFdlIGRvbid0IHdhbnQgZXhjZXB0aW9uIGJlaGF2aW9yIHRvIGRpZmZlciBiZXR3ZWVuIGRldiBhbmQgcHJvZC5cbiAgLy8gKFJlbmRlcmluZyB3aWxsIHRocm93IHdpdGggYSBoZWxwZnVsIG1lc3NhZ2UgYW5kIGFzIHNvb24gYXMgdGhlIHR5cGUgaXNcbiAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuXG5cbiAgaWYgKHZhbGlkVHlwZSkge1xuICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0sIHR5cGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSB7XG4gICAgdmFsaWRhdGVGcmFnbWVudFByb3BzKGVsZW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG52YXIgZGlkV2FybkFib3V0RGVwcmVjYXRlZENyZWF0ZUZhY3RvcnkgPSBmYWxzZTtcbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXaXRoVmFsaWRhdGlvbih0eXBlKSB7XG4gIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uLmJpbmQobnVsbCwgdHlwZSk7XG4gIHZhbGlkYXRlZEZhY3RvcnkudHlwZSA9IHR5cGU7XG5cbiAge1xuICAgIGlmICghZGlkV2FybkFib3V0RGVwcmVjYXRlZENyZWF0ZUZhY3RvcnkpIHtcbiAgICAgIGRpZFdhcm5BYm91dERlcHJlY2F0ZWRDcmVhdGVGYWN0b3J5ID0gdHJ1ZTtcblxuICAgICAgd2FybignUmVhY3QuY3JlYXRlRmFjdG9yeSgpIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiAnICsgJ2EgZnV0dXJlIG1ham9yIHJlbGVhc2UuIENvbnNpZGVyIHVzaW5nIEpTWCAnICsgJ29yIHVzZSBSZWFjdC5jcmVhdGVFbGVtZW50KCkgZGlyZWN0bHkgaW5zdGVhZC4nKTtcbiAgICB9IC8vIExlZ2FjeSBob29rOiByZW1vdmUgaXRcblxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZhbGlkYXRlZEZhY3RvcnksICd0eXBlJywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2FybignRmFjdG9yeS50eXBlIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB0aGUgY2xhc3MgZGlyZWN0bHkgJyArICdiZWZvcmUgcGFzc2luZyBpdCB0byBjcmVhdGVGYWN0b3J5LicpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICB2YWx1ZTogdHlwZVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbn1cbmZ1bmN0aW9uIGNsb25lRWxlbWVudFdpdGhWYWxpZGF0aW9uKGVsZW1lbnQsIHByb3BzLCBjaGlsZHJlbikge1xuICB2YXIgbmV3RWxlbWVudCA9IGNsb25lRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICB9XG5cbiAgdmFsaWRhdGVQcm9wVHlwZXMobmV3RWxlbWVudCk7XG4gIHJldHVybiBuZXdFbGVtZW50O1xufVxuXG57XG5cbiAgdHJ5IHtcbiAgICB2YXIgZnJvemVuT2JqZWN0ID0gT2JqZWN0LmZyZWV6ZSh7fSk7XG4gICAgdmFyIHRlc3RNYXAgPSBuZXcgTWFwKFtbZnJvemVuT2JqZWN0LCBudWxsXV0pO1xuICAgIHZhciB0ZXN0U2V0ID0gbmV3IFNldChbZnJvemVuT2JqZWN0XSk7IC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBSb2xsdXAgdG8gbm90IGNvbnNpZGVyIHRoZXNlIHVudXNlZC5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTc3MVxuICAgIC8vIFRPRE86IHdlIGNhbiByZW1vdmUgdGhlc2UgaWYgUm9sbHVwIGZpeGVzIHRoZSBidWcuXG5cbiAgICB0ZXN0TWFwLnNldCgwLCAwKTtcbiAgICB0ZXN0U2V0LmFkZCgwKTtcbiAgfSBjYXRjaCAoZSkge1xuICB9XG59XG5cbnZhciBjcmVhdGVFbGVtZW50JDEgPSAgY3JlYXRlRWxlbWVudFdpdGhWYWxpZGF0aW9uIDtcbnZhciBjbG9uZUVsZW1lbnQkMSA9ICBjbG9uZUVsZW1lbnRXaXRoVmFsaWRhdGlvbiA7XG52YXIgY3JlYXRlRmFjdG9yeSA9ICBjcmVhdGVGYWN0b3J5V2l0aFZhbGlkYXRpb24gO1xudmFyIENoaWxkcmVuID0ge1xuICBtYXA6IG1hcENoaWxkcmVuLFxuICBmb3JFYWNoOiBmb3JFYWNoQ2hpbGRyZW4sXG4gIGNvdW50OiBjb3VudENoaWxkcmVuLFxuICB0b0FycmF5OiB0b0FycmF5LFxuICBvbmx5OiBvbmx5Q2hpbGRcbn07XG5cbmV4cG9ydHMuQ2hpbGRyZW4gPSBDaGlsZHJlbjtcbmV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuZXhwb3J0cy5GcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG5leHBvcnRzLlByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbmV4cG9ydHMuUHVyZUNvbXBvbmVudCA9IFB1cmVDb21wb25lbnQ7XG5leHBvcnRzLlN0cmljdE1vZGUgPSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xuZXhwb3J0cy5TdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG5leHBvcnRzLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEID0gUmVhY3RTaGFyZWRJbnRlcm5hbHM7XG5leHBvcnRzLmNsb25lRWxlbWVudCA9IGNsb25lRWxlbWVudCQxO1xuZXhwb3J0cy5jcmVhdGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDtcbmV4cG9ydHMuY3JlYXRlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQkMTtcbmV4cG9ydHMuY3JlYXRlRmFjdG9yeSA9IGNyZWF0ZUZhY3Rvcnk7XG5leHBvcnRzLmNyZWF0ZVJlZiA9IGNyZWF0ZVJlZjtcbmV4cG9ydHMuZm9yd2FyZFJlZiA9IGZvcndhcmRSZWY7XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50ID0gaXNWYWxpZEVsZW1lbnQ7XG5leHBvcnRzLmxhenkgPSBsYXp5O1xuZXhwb3J0cy5tZW1vID0gbWVtbztcbmV4cG9ydHMudXNlQ2FsbGJhY2sgPSB1c2VDYWxsYmFjaztcbmV4cG9ydHMudXNlQ29udGV4dCA9IHVzZUNvbnRleHQ7XG5leHBvcnRzLnVzZURlYnVnVmFsdWUgPSB1c2VEZWJ1Z1ZhbHVlO1xuZXhwb3J0cy51c2VFZmZlY3QgPSB1c2VFZmZlY3Q7XG5leHBvcnRzLnVzZUltcGVyYXRpdmVIYW5kbGUgPSB1c2VJbXBlcmF0aXZlSGFuZGxlO1xuZXhwb3J0cy51c2VMYXlvdXRFZmZlY3QgPSB1c2VMYXlvdXRFZmZlY3Q7XG5leHBvcnRzLnVzZU1lbW8gPSB1c2VNZW1vO1xuZXhwb3J0cy51c2VSZWR1Y2VyID0gdXNlUmVkdWNlcjtcbmV4cG9ydHMudXNlUmVmID0gdXNlUmVmO1xuZXhwb3J0cy51c2VTdGF0ZSA9IHVzZVN0YXRlO1xuZXhwb3J0cy52ZXJzaW9uID0gUmVhY3RWZXJzaW9uO1xuICB9KSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiB1c2Utc3luYy1leHRlcm5hbC1zdG9yZS1zaGltLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICd1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAqL1xuaWYgKFxuICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fICE9PSAndW5kZWZpbmVkJyAmJlxuICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdGFydCA9PT1cbiAgICAnZnVuY3Rpb24nXG4pIHtcbiAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdGFydChuZXcgRXJyb3IoKSk7XG59XG4gICAgICAgICAgdmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0gUmVhY3QuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQ7XG5cbmZ1bmN0aW9uIGVycm9yKGZvcm1hdCkge1xuICB7XG4gICAge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcHJpbnRXYXJuaW5nKCdlcnJvcicsIGZvcm1hdCwgYXJncyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHByaW50V2FybmluZyhsZXZlbCwgZm9ybWF0LCBhcmdzKSB7XG4gIC8vIFdoZW4gY2hhbmdpbmcgdGhpcyBsb2dpYywgeW91IG1pZ2h0IHdhbnQgdG8gYWxzb1xuICAvLyB1cGRhdGUgY29uc29sZVdpdGhTdGFja0Rldi53d3cuanMgYXMgd2VsbC5cbiAge1xuICAgIHZhciBSZWFjdERlYnVnQ3VycmVudEZyYW1lID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuUmVhY3REZWJ1Z0N1cnJlbnRGcmFtZTtcbiAgICB2YXIgc3RhY2sgPSBSZWFjdERlYnVnQ3VycmVudEZyYW1lLmdldFN0YWNrQWRkZW5kdW0oKTtcblxuICAgIGlmIChzdGFjayAhPT0gJycpIHtcbiAgICAgIGZvcm1hdCArPSAnJXMnO1xuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KFtzdGFja10pO1xuICAgIH0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWludGVybmFsL3NhZmUtc3RyaW5nLWNvZXJjaW9uXG5cblxuICAgIHZhciBhcmdzV2l0aEZvcm1hdCA9IGFyZ3MubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKGl0ZW0pO1xuICAgIH0pOyAvLyBDYXJlZnVsOiBSTiBjdXJyZW50bHkgZGVwZW5kcyBvbiB0aGlzIHByZWZpeFxuXG4gICAgYXJnc1dpdGhGb3JtYXQudW5zaGlmdCgnV2FybmluZzogJyArIGZvcm1hdCk7IC8vIFdlIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIHNwcmVhZCAob3IgLmFwcGx5KSBkaXJlY3RseSBiZWNhdXNlIGl0XG4gICAgLy8gYnJlYWtzIElFOTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8xMzYxMFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1pbnRlcm5hbC9uby1wcm9kdWN0aW9uLWxvZ2dpbmdcblxuICAgIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGVbbGV2ZWxdLCBjb25zb2xlLCBhcmdzV2l0aEZvcm1hdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBpbmxpbmVkIE9iamVjdC5pcyBwb2x5ZmlsbCB0byBhdm9pZCByZXF1aXJpbmcgY29uc3VtZXJzIHNoaXAgdGhlaXIgb3duXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAqL1xuZnVuY3Rpb24gaXMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geSAmJiAoeCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkpIHx8IHggIT09IHggJiYgeSAhPT0geSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxuICA7XG59XG5cbnZhciBvYmplY3RJcyA9IHR5cGVvZiBPYmplY3QuaXMgPT09ICdmdW5jdGlvbicgPyBPYmplY3QuaXMgOiBpcztcblxuLy8gZGlzcGF0Y2ggZm9yIENvbW1vbkpTIGludGVyb3AgbmFtZWQgaW1wb3J0cy5cblxudmFyIHVzZVN0YXRlID0gUmVhY3QudXNlU3RhdGUsXG4gICAgdXNlRWZmZWN0ID0gUmVhY3QudXNlRWZmZWN0LFxuICAgIHVzZUxheW91dEVmZmVjdCA9IFJlYWN0LnVzZUxheW91dEVmZmVjdCxcbiAgICB1c2VEZWJ1Z1ZhbHVlID0gUmVhY3QudXNlRGVidWdWYWx1ZTtcbnZhciBkaWRXYXJuT2xkMThBbHBoYSA9IGZhbHNlO1xudmFyIGRpZFdhcm5VbmNhY2hlZEdldFNuYXBzaG90ID0gZmFsc2U7IC8vIERpc2NsYWltZXI6IFRoaXMgc2hpbSBicmVha3MgbWFueSBvZiB0aGUgcnVsZXMgb2YgUmVhY3QsIGFuZCBvbmx5IHdvcmtzXG4vLyBiZWNhdXNlIG9mIGEgdmVyeSBwYXJ0aWN1bGFyIHNldCBvZiBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIGFuZCBhc3N1bXB0aW9uc1xuLy8gLS0gY2hhbmdlIGFueSBvbmUgb2YgdGhlbSBhbmQgaXQgd2lsbCBicmVhay4gVGhlIG1vc3QgaW1wb3J0YW50IGFzc3VtcHRpb25cbi8vIGlzIHRoYXQgdXBkYXRlcyBhcmUgYWx3YXlzIHN5bmNocm9ub3VzLCBiZWNhdXNlIGNvbmN1cnJlbnQgcmVuZGVyaW5nIGlzXG4vLyBvbmx5IGF2YWlsYWJsZSBpbiB2ZXJzaW9ucyBvZiBSZWFjdCB0aGF0IGFsc28gaGF2ZSBhIGJ1aWx0LWluXG4vLyB1c2VTeW5jRXh0ZXJuYWxTdG9yZSBBUEkuIEFuZCB3ZSBvbmx5IHVzZSB0aGlzIHNoaW0gd2hlbiB0aGUgYnVpbHQtaW4gQVBJXG4vLyBkb2VzIG5vdCBleGlzdC5cbi8vXG4vLyBEbyBub3QgYXNzdW1lIHRoYXQgdGhlIGNsZXZlciBoYWNrcyB1c2VkIGJ5IHRoaXMgaG9vayBhbHNvIHdvcmsgaW4gZ2VuZXJhbC5cbi8vIFRoZSBwb2ludCBvZiB0aGlzIHNoaW0gaXMgdG8gcmVwbGFjZSB0aGUgbmVlZCBmb3IgaGFja3MgYnkgb3RoZXIgbGlicmFyaWVzLlxuXG5mdW5jdGlvbiB1c2VTeW5jRXh0ZXJuYWxTdG9yZShzdWJzY3JpYmUsIGdldFNuYXBzaG90LCAvLyBOb3RlOiBUaGUgc2hpbSBkb2VzIG5vdCB1c2UgZ2V0U2VydmVyU25hcHNob3QsIGJlY2F1c2UgcHJlLTE4IHZlcnNpb25zIG9mXG4vLyBSZWFjdCBkbyBub3QgZXhwb3NlIGEgd2F5IHRvIGNoZWNrIGlmIHdlJ3JlIGh5ZHJhdGluZy4gU28gdXNlcnMgb2YgdGhlIHNoaW1cbi8vIHdpbGwgbmVlZCB0byB0cmFjayB0aGF0IHRoZW1zZWx2ZXMgYW5kIHJldHVybiB0aGUgY29ycmVjdCB2YWx1ZVxuLy8gZnJvbSBgZ2V0U25hcHNob3RgLlxuZ2V0U2VydmVyU25hcHNob3QpIHtcbiAge1xuICAgIGlmICghZGlkV2Fybk9sZDE4QWxwaGEpIHtcbiAgICAgIGlmIChSZWFjdC5zdGFydFRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkaWRXYXJuT2xkMThBbHBoYSA9IHRydWU7XG5cbiAgICAgICAgZXJyb3IoJ1lvdSBhcmUgdXNpbmcgYW4gb3V0ZGF0ZWQsIHByZS1yZWxlYXNlIGFscGhhIG9mIFJlYWN0IDE4IHRoYXQgJyArICdkb2VzIG5vdCBzdXBwb3J0IHVzZVN5bmNFeHRlcm5hbFN0b3JlLiBUaGUgJyArICd1c2Utc3luYy1leHRlcm5hbC1zdG9yZSBzaGltIHdpbGwgbm90IHdvcmsgY29ycmVjdGx5LiBVcGdyYWRlICcgKyAndG8gYSBuZXdlciBwcmUtcmVsZWFzZS4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gUmVhZCB0aGUgY3VycmVudCBzbmFwc2hvdCBmcm9tIHRoZSBzdG9yZSBvbiBldmVyeSByZW5kZXIuIEFnYWluLCB0aGlzXG4gIC8vIGJyZWFrcyB0aGUgcnVsZXMgb2YgUmVhY3QsIGFuZCBvbmx5IHdvcmtzIGhlcmUgYmVjYXVzZSBvZiBzcGVjaWZpY1xuICAvLyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzLCBtb3N0IGltcG9ydGFudGx5IHRoYXQgdXBkYXRlcyBhcmVcbiAgLy8gYWx3YXlzIHN5bmNocm9ub3VzLlxuXG5cbiAgdmFyIHZhbHVlID0gZ2V0U25hcHNob3QoKTtcblxuICB7XG4gICAgaWYgKCFkaWRXYXJuVW5jYWNoZWRHZXRTbmFwc2hvdCkge1xuICAgICAgdmFyIGNhY2hlZFZhbHVlID0gZ2V0U25hcHNob3QoKTtcblxuICAgICAgaWYgKCFvYmplY3RJcyh2YWx1ZSwgY2FjaGVkVmFsdWUpKSB7XG4gICAgICAgIGVycm9yKCdUaGUgcmVzdWx0IG9mIGdldFNuYXBzaG90IHNob3VsZCBiZSBjYWNoZWQgdG8gYXZvaWQgYW4gaW5maW5pdGUgbG9vcCcpO1xuXG4gICAgICAgIGRpZFdhcm5VbmNhY2hlZEdldFNuYXBzaG90ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gQmVjYXVzZSB1cGRhdGVzIGFyZSBzeW5jaHJvbm91cywgd2UgZG9uJ3QgcXVldWUgdGhlbS4gSW5zdGVhZCB3ZSBmb3JjZSBhXG4gIC8vIHJlLXJlbmRlciB3aGVuZXZlciB0aGUgc3Vic2NyaWJlZCBzdGF0ZSBjaGFuZ2VzIGJ5IHVwZGF0aW5nIGFuIHNvbWVcbiAgLy8gYXJiaXRyYXJ5IHVzZVN0YXRlIGhvb2suIFRoZW4sIGR1cmluZyByZW5kZXIsIHdlIGNhbGwgZ2V0U25hcHNob3QgdG8gcmVhZFxuICAvLyB0aGUgY3VycmVudCB2YWx1ZS5cbiAgLy9cbiAgLy8gQmVjYXVzZSB3ZSBkb24ndCBhY3R1YWxseSB1c2UgdGhlIHN0YXRlIHJldHVybmVkIGJ5IHRoZSB1c2VTdGF0ZSBob29rLCB3ZVxuICAvLyBjYW4gc2F2ZSBhIGJpdCBvZiBtZW1vcnkgYnkgc3RvcmluZyBvdGhlciBzdHVmZiBpbiB0aGF0IHNsb3QuXG4gIC8vXG4gIC8vIFRvIGltcGxlbWVudCB0aGUgZWFybHkgYmFpbG91dCwgd2UgbmVlZCB0byB0cmFjayBzb21lIHRoaW5ncyBvbiBhIG11dGFibGVcbiAgLy8gb2JqZWN0LiBVc3VhbGx5LCB3ZSB3b3VsZCBwdXQgdGhhdCBpbiBhIHVzZVJlZiBob29rLCBidXQgd2UgY2FuIHN0YXNoIGl0IGluXG4gIC8vIG91ciB1c2VTdGF0ZSBob29rIGluc3RlYWQuXG4gIC8vXG4gIC8vIFRvIGZvcmNlIGEgcmUtcmVuZGVyLCB3ZSBjYWxsIGZvcmNlVXBkYXRlKHtpbnN0fSkuIFRoYXQgd29ya3MgYmVjYXVzZSB0aGVcbiAgLy8gbmV3IG9iamVjdCBhbHdheXMgZmFpbHMgYW4gZXF1YWxpdHkgY2hlY2suXG5cblxuICB2YXIgX3VzZVN0YXRlID0gdXNlU3RhdGUoe1xuICAgIGluc3Q6IHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGdldFNuYXBzaG90OiBnZXRTbmFwc2hvdFxuICAgIH1cbiAgfSksXG4gICAgICBpbnN0ID0gX3VzZVN0YXRlWzBdLmluc3QsXG4gICAgICBmb3JjZVVwZGF0ZSA9IF91c2VTdGF0ZVsxXTsgLy8gVHJhY2sgdGhlIGxhdGVzdCBnZXRTbmFwc2hvdCBmdW5jdGlvbiB3aXRoIGEgcmVmLiBUaGlzIG5lZWRzIHRvIGJlIHVwZGF0ZWRcbiAgLy8gaW4gdGhlIGxheW91dCBwaGFzZSBzbyB3ZSBjYW4gYWNjZXNzIGl0IGR1cmluZyB0aGUgdGVhcmluZyBjaGVjayB0aGF0XG4gIC8vIGhhcHBlbnMgb24gc3Vic2NyaWJlLlxuXG5cbiAgdXNlTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBpbnN0LnZhbHVlID0gdmFsdWU7XG4gICAgaW5zdC5nZXRTbmFwc2hvdCA9IGdldFNuYXBzaG90OyAvLyBXaGVuZXZlciBnZXRTbmFwc2hvdCBvciBzdWJzY3JpYmUgY2hhbmdlcywgd2UgbmVlZCB0byBjaGVjayBpbiB0aGVcbiAgICAvLyBjb21taXQgcGhhc2UgaWYgdGhlcmUgd2FzIGFuIGludGVybGVhdmVkIG11dGF0aW9uLiBJbiBjb25jdXJyZW50IG1vZGVcbiAgICAvLyB0aGlzIGNhbiBoYXBwZW4gYWxsIHRoZSB0aW1lLCBidXQgZXZlbiBpbiBzeW5jaHJvbm91cyBtb2RlLCBhbiBlYXJsaWVyXG4gICAgLy8gZWZmZWN0IG1heSBoYXZlIG11dGF0ZWQgdGhlIHN0b3JlLlxuXG4gICAgaWYgKGNoZWNrSWZTbmFwc2hvdENoYW5nZWQoaW5zdCkpIHtcbiAgICAgIC8vIEZvcmNlIGEgcmUtcmVuZGVyLlxuICAgICAgZm9yY2VVcGRhdGUoe1xuICAgICAgICBpbnN0OiBpbnN0XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIFtzdWJzY3JpYmUsIHZhbHVlLCBnZXRTbmFwc2hvdF0pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIC8vIENoZWNrIGZvciBjaGFuZ2VzIHJpZ2h0IGJlZm9yZSBzdWJzY3JpYmluZy4gU3Vic2VxdWVudCBjaGFuZ2VzIHdpbGwgYmVcbiAgICAvLyBkZXRlY3RlZCBpbiB0aGUgc3Vic2NyaXB0aW9uIGhhbmRsZXIuXG4gICAgaWYgKGNoZWNrSWZTbmFwc2hvdENoYW5nZWQoaW5zdCkpIHtcbiAgICAgIC8vIEZvcmNlIGEgcmUtcmVuZGVyLlxuICAgICAgZm9yY2VVcGRhdGUoe1xuICAgICAgICBpbnN0OiBpbnN0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgaGFuZGxlU3RvcmVDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUT0RPOiBCZWNhdXNlIHRoZXJlIGlzIG5vIGNyb3NzLXJlbmRlcmVyIEFQSSBmb3IgYmF0Y2hpbmcgdXBkYXRlcywgaXQnc1xuICAgICAgLy8gdXAgdG8gdGhlIGNvbnN1bWVyIG9mIHRoaXMgbGlicmFyeSB0byB3cmFwIHRoZWlyIHN1YnNjcmlwdGlvbiBldmVudFxuICAgICAgLy8gd2l0aCB1bnN0YWJsZV9iYXRjaGVkVXBkYXRlcy4gU2hvdWxkIHdlIHRyeSB0byBkZXRlY3Qgd2hlbiB0aGlzIGlzbid0XG4gICAgICAvLyB0aGUgY2FzZSBhbmQgcHJpbnQgYSB3YXJuaW5nIGluIGRldmVsb3BtZW50P1xuICAgICAgLy8gVGhlIHN0b3JlIGNoYW5nZWQuIENoZWNrIGlmIHRoZSBzbmFwc2hvdCBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgd2VcbiAgICAgIC8vIHJlYWQgZnJvbSB0aGUgc3RvcmUuXG4gICAgICBpZiAoY2hlY2tJZlNuYXBzaG90Q2hhbmdlZChpbnN0KSkge1xuICAgICAgICAvLyBGb3JjZSBhIHJlLXJlbmRlci5cbiAgICAgICAgZm9yY2VVcGRhdGUoe1xuICAgICAgICAgIGluc3Q6IGluc3RcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTsgLy8gU3Vic2NyaWJlIHRvIHRoZSBzdG9yZSBhbmQgcmV0dXJuIGEgY2xlYW4tdXAgZnVuY3Rpb24uXG5cblxuICAgIHJldHVybiBzdWJzY3JpYmUoaGFuZGxlU3RvcmVDaGFuZ2UpO1xuICB9LCBbc3Vic2NyaWJlXSk7XG4gIHVzZURlYnVnVmFsdWUodmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSWZTbmFwc2hvdENoYW5nZWQoaW5zdCkge1xuICB2YXIgbGF0ZXN0R2V0U25hcHNob3QgPSBpbnN0LmdldFNuYXBzaG90O1xuICB2YXIgcHJldlZhbHVlID0gaW5zdC52YWx1ZTtcblxuICB0cnkge1xuICAgIHZhciBuZXh0VmFsdWUgPSBsYXRlc3RHZXRTbmFwc2hvdCgpO1xuICAgIHJldHVybiAhb2JqZWN0SXMocHJldlZhbHVlLCBuZXh0VmFsdWUpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVzZVN5bmNFeHRlcm5hbFN0b3JlJDEoc3Vic2NyaWJlLCBnZXRTbmFwc2hvdCwgZ2V0U2VydmVyU25hcHNob3QpIHtcbiAgLy8gTm90ZTogVGhlIHNoaW0gZG9lcyBub3QgdXNlIGdldFNlcnZlclNuYXBzaG90LCBiZWNhdXNlIHByZS0xOCB2ZXJzaW9ucyBvZlxuICAvLyBSZWFjdCBkbyBub3QgZXhwb3NlIGEgd2F5IHRvIGNoZWNrIGlmIHdlJ3JlIGh5ZHJhdGluZy4gU28gdXNlcnMgb2YgdGhlIHNoaW1cbiAgLy8gd2lsbCBuZWVkIHRvIHRyYWNrIHRoYXQgdGhlbXNlbHZlcyBhbmQgcmV0dXJuIHRoZSBjb3JyZWN0IHZhbHVlXG4gIC8vIGZyb20gYGdldFNuYXBzaG90YC5cbiAgcmV0dXJuIGdldFNuYXBzaG90KCk7XG59XG5cbnZhciBjYW5Vc2VET00gPSAhISh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgIT09ICd1bmRlZmluZWQnKTtcblxudmFyIGlzU2VydmVyRW52aXJvbm1lbnQgPSAhY2FuVXNlRE9NO1xuXG52YXIgc2hpbSA9IGlzU2VydmVyRW52aXJvbm1lbnQgPyB1c2VTeW5jRXh0ZXJuYWxTdG9yZSQxIDogdXNlU3luY0V4dGVybmFsU3RvcmU7XG52YXIgdXNlU3luY0V4dGVybmFsU3RvcmUkMiA9IFJlYWN0LnVzZVN5bmNFeHRlcm5hbFN0b3JlICE9PSB1bmRlZmluZWQgPyBSZWFjdC51c2VTeW5jRXh0ZXJuYWxTdG9yZSA6IHNoaW07XG5cbmV4cG9ydHMudXNlU3luY0V4dGVybmFsU3RvcmUgPSB1c2VTeW5jRXh0ZXJuYWxTdG9yZSQyO1xuICAgICAgICAgIC8qIGdsb2JhbCBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gKi9cbmlmIChcbiAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RvcCA9PT1cbiAgICAnZnVuY3Rpb24nXG4pIHtcbiAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdG9wKG5ldyBFcnJvcigpKTtcbn1cbiAgICAgICAgXG4gIH0pKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vY2pzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlLXNoaW0ucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vY2pzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlLXNoaW0uZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIHJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBwcm94eUNvbXBhcmUgPSByZXF1aXJlKCdwcm94eS1jb21wYXJlJyk7XG52YXIgdXNlU3luY0V4dGVybmFsU3RvcmVFeHBvcnRzID0gcmVxdWlyZSgndXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUvc2hpbScpO1xudmFyIHZhbmlsbGEgPSByZXF1aXJlKCd2YWx0aW8vdmFuaWxsYScpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcERlZmF1bHRMZWdhY3kgKGUpIHsgcmV0dXJuIGUgJiYgdHlwZW9mIGUgPT09ICdvYmplY3QnICYmICdkZWZhdWx0JyBpbiBlID8gZSA6IHsgJ2RlZmF1bHQnOiBlIH07IH1cblxudmFyIHVzZVN5bmNFeHRlcm5hbFN0b3JlRXhwb3J0c19fZGVmYXVsdCA9IC8qI19fUFVSRV9fKi9faW50ZXJvcERlZmF1bHRMZWdhY3kodXNlU3luY0V4dGVybmFsU3RvcmVFeHBvcnRzKTtcblxudmFyIHVzZVN5bmNFeHRlcm5hbFN0b3JlID0gdXNlU3luY0V4dGVybmFsU3RvcmVFeHBvcnRzX19kZWZhdWx0W1wiZGVmYXVsdFwiXS51c2VTeW5jRXh0ZXJuYWxTdG9yZTtcblxudmFyIHVzZUFmZmVjdGVkRGVidWdWYWx1ZSA9IGZ1bmN0aW9uIHVzZUFmZmVjdGVkRGVidWdWYWx1ZShzdGF0ZSwgYWZmZWN0ZWQpIHtcbiAgdmFyIHBhdGhMaXN0ID0gcmVhY3QudXNlUmVmKCk7XG4gIHJlYWN0LnVzZUVmZmVjdChmdW5jdGlvbiAoKSB7XG4gICAgcGF0aExpc3QuY3VycmVudCA9IHByb3h5Q29tcGFyZS5hZmZlY3RlZFRvUGF0aExpc3Qoc3RhdGUsIGFmZmVjdGVkKTtcbiAgfSk7XG4gIHJlYWN0LnVzZURlYnVnVmFsdWUocGF0aExpc3QuY3VycmVudCk7XG59O1xuXG5mdW5jdGlvbiB1c2VTbmFwc2hvdChwcm94eU9iamVjdCwgb3B0aW9ucykge1xuICB2YXIgbm90aWZ5SW5TeW5jID0gb3B0aW9ucyA9PSBudWxsID8gdm9pZCAwIDogb3B0aW9ucy5zeW5jO1xuICB2YXIgbGFzdFNuYXBzaG90ID0gcmVhY3QudXNlUmVmKCk7XG4gIHZhciBsYXN0QWZmZWN0ZWQgPSByZWFjdC51c2VSZWYoKTtcbiAgdmFyIGluUmVuZGVyID0gdHJ1ZTtcbiAgdmFyIGN1cnJTbmFwc2hvdCA9IHVzZVN5bmNFeHRlcm5hbFN0b3JlKHJlYWN0LnVzZUNhbGxiYWNrKGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB1bnN1YiA9IHZhbmlsbGEuc3Vic2NyaWJlKHByb3h5T2JqZWN0LCBjYWxsYmFjaywgbm90aWZ5SW5TeW5jKTtcbiAgICBjYWxsYmFjaygpO1xuICAgIHJldHVybiB1bnN1YjtcbiAgfSwgW3Byb3h5T2JqZWN0LCBub3RpZnlJblN5bmNdKSwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXh0U25hcHNob3QgPSB2YW5pbGxhLnNuYXBzaG90KHByb3h5T2JqZWN0KTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoIWluUmVuZGVyICYmIGxhc3RTbmFwc2hvdC5jdXJyZW50ICYmIGxhc3RBZmZlY3RlZC5jdXJyZW50ICYmICFwcm94eUNvbXBhcmUuaXNDaGFuZ2VkKGxhc3RTbmFwc2hvdC5jdXJyZW50LCBuZXh0U25hcHNob3QsIGxhc3RBZmZlY3RlZC5jdXJyZW50LCBuZXcgV2Vha01hcCgpKSkge1xuICAgICAgICByZXR1cm4gbGFzdFNuYXBzaG90LmN1cnJlbnQ7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge31cblxuICAgIHJldHVybiBuZXh0U25hcHNob3Q7XG4gIH0sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdmFuaWxsYS5zbmFwc2hvdChwcm94eU9iamVjdCk7XG4gIH0pO1xuICBpblJlbmRlciA9IGZhbHNlO1xuICB2YXIgY3VyckFmZmVjdGVkID0gbmV3IFdlYWtNYXAoKTtcbiAgcmVhY3QudXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBsYXN0U25hcHNob3QuY3VycmVudCA9IGN1cnJTbmFwc2hvdDtcbiAgICBsYXN0QWZmZWN0ZWQuY3VycmVudCA9IGN1cnJBZmZlY3RlZDtcbiAgfSk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIHVzZUFmZmVjdGVkRGVidWdWYWx1ZShjdXJyU25hcHNob3QsIGN1cnJBZmZlY3RlZCk7XG4gIH1cblxuICB2YXIgcHJveHlDYWNoZSA9IHJlYWN0LnVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgV2Vha01hcCgpO1xuICB9LCBbXSk7XG4gIHJldHVybiBwcm94eUNvbXBhcmUuY3JlYXRlUHJveHkoY3VyclNuYXBzaG90LCBjdXJyQWZmZWN0ZWQsIHByb3h5Q2FjaGUpO1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2dldFZlcnNpb24nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFuaWxsYS5nZXRWZXJzaW9uOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHJveHknLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFuaWxsYS5wcm94eTsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JlZicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2YW5pbGxhLnJlZjsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3NuYXBzaG90Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbmlsbGEuc25hcHNob3Q7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdzdWJzY3JpYmUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFuaWxsYS5zdWJzY3JpYmU7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1bnN0YWJsZV9nZXRIYW5kbGVyJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbmlsbGEuZ2V0SGFuZGxlcjsgfVxufSk7XG5leHBvcnRzLnVzZVNuYXBzaG90ID0gdXNlU25hcHNob3Q7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBwcm94eUNvbXBhcmUgPSByZXF1aXJlKCdwcm94eS1jb21wYXJlJyk7XG5cbnZhciBWRVJTSU9OID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gU3ltYm9sKCdWRVJTSU9OJykgOiBTeW1ib2woKTtcbnZhciBMSVNURU5FUlMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBTeW1ib2woJ0xJU1RFTkVSUycpIDogU3ltYm9sKCk7XG52YXIgU05BUFNIT1QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBTeW1ib2woJ1NOQVBTSE9UJykgOiBTeW1ib2woKTtcbnZhciBIQU5ETEVSID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gU3ltYm9sKCdIQU5ETEVSJykgOiBTeW1ib2woKTtcbnZhciBQUk9NSVNFX1JFU1VMVCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IFN5bWJvbCgnUFJPTUlTRV9SRVNVTFQnKSA6IFN5bWJvbCgpO1xudmFyIFBST01JU0VfRVJST1IgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyBTeW1ib2woJ1BST01JU0VfRVJST1InKSA6IFN5bWJvbCgpO1xudmFyIHJlZlNldCA9IG5ldyBXZWFrU2V0KCk7XG5mdW5jdGlvbiByZWYobykge1xuICByZWZTZXQuYWRkKG8pO1xuICByZXR1cm4gbztcbn1cblxudmFyIGlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG59O1xuXG52YXIgY2FuUHJveHkgPSBmdW5jdGlvbiBjYW5Qcm94eSh4KSB7XG4gIHJldHVybiBpc09iamVjdCh4KSAmJiAhcmVmU2V0Lmhhcyh4KSAmJiAoQXJyYXkuaXNBcnJheSh4KSB8fCAhKFN5bWJvbC5pdGVyYXRvciBpbiB4KSkgJiYgISh4IGluc3RhbmNlb2YgV2Vha01hcCkgJiYgISh4IGluc3RhbmNlb2YgV2Vha1NldCkgJiYgISh4IGluc3RhbmNlb2YgRXJyb3IpICYmICEoeCBpbnN0YW5jZW9mIE51bWJlcikgJiYgISh4IGluc3RhbmNlb2YgRGF0ZSkgJiYgISh4IGluc3RhbmNlb2YgU3RyaW5nKSAmJiAhKHggaW5zdGFuY2VvZiBSZWdFeHApICYmICEoeCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKTtcbn07XG5cbnZhciBwcm94eUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbnZhciBnbG9iYWxWZXJzaW9uID0gMTtcbnZhciBzbmFwc2hvdENhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHByb3h5KGluaXRpYWxPYmplY3QpIHtcbiAgaWYgKGluaXRpYWxPYmplY3QgPT09IHZvaWQgMCkge1xuICAgIGluaXRpYWxPYmplY3QgPSB7fTtcbiAgfVxuXG4gIGlmICghaXNPYmplY3QoaW5pdGlhbE9iamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29iamVjdCByZXF1aXJlZCcpO1xuICB9XG5cbiAgdmFyIGZvdW5kID0gcHJveHlDYWNoZS5nZXQoaW5pdGlhbE9iamVjdCk7XG5cbiAgaWYgKGZvdW5kKSB7XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgdmFyIHZlcnNpb24gPSBnbG9iYWxWZXJzaW9uO1xuICB2YXIgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG4gIHZhciBub3RpZnlVcGRhdGUgPSBmdW5jdGlvbiBub3RpZnlVcGRhdGUob3AsIG5leHRWZXJzaW9uKSB7XG4gICAgaWYgKG5leHRWZXJzaW9uID09PSB2b2lkIDApIHtcbiAgICAgIG5leHRWZXJzaW9uID0gKytnbG9iYWxWZXJzaW9uO1xuICAgIH1cblxuICAgIGlmICh2ZXJzaW9uICE9PSBuZXh0VmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IG5leHRWZXJzaW9uO1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcihvcCwgbmV4dFZlcnNpb24pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBwcm9wTGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuXG4gIHZhciBnZXRQcm9wTGlzdGVuZXIgPSBmdW5jdGlvbiBnZXRQcm9wTGlzdGVuZXIocHJvcCkge1xuICAgIHZhciBwcm9wTGlzdGVuZXIgPSBwcm9wTGlzdGVuZXJzLmdldChwcm9wKTtcblxuICAgIGlmICghcHJvcExpc3RlbmVyKSB7XG4gICAgICBwcm9wTGlzdGVuZXIgPSBmdW5jdGlvbiBwcm9wTGlzdGVuZXIob3AsIG5leHRWZXJzaW9uKSB7XG4gICAgICAgIHZhciBuZXdPcCA9IFtdLmNvbmNhdChvcCk7XG4gICAgICAgIG5ld09wWzFdID0gW3Byb3BdLmNvbmNhdChuZXdPcFsxXSk7XG4gICAgICAgIG5vdGlmeVVwZGF0ZShuZXdPcCwgbmV4dFZlcnNpb24pO1xuICAgICAgfTtcblxuICAgICAgcHJvcExpc3RlbmVycy5zZXQocHJvcCwgcHJvcExpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcExpc3RlbmVyO1xuICB9O1xuXG4gIHZhciBwb3BQcm9wTGlzdGVuZXIgPSBmdW5jdGlvbiBwb3BQcm9wTGlzdGVuZXIocHJvcCkge1xuICAgIHZhciBwcm9wTGlzdGVuZXIgPSBwcm9wTGlzdGVuZXJzLmdldChwcm9wKTtcbiAgICBwcm9wTGlzdGVuZXJzLmRlbGV0ZShwcm9wKTtcbiAgICByZXR1cm4gcHJvcExpc3RlbmVyO1xuICB9O1xuXG4gIHZhciBjcmVhdGVTbmFwc2hvdCA9IGZ1bmN0aW9uIGNyZWF0ZVNuYXBzaG90KHRhcmdldCwgcmVjZWl2ZXIpIHtcbiAgICB2YXIgY2FjaGUgPSBzbmFwc2hvdENhY2hlLmdldChyZWNlaXZlcik7XG5cbiAgICBpZiAoKGNhY2hlID09IG51bGwgPyB2b2lkIDAgOiBjYWNoZVswXSkgPT09IHZlcnNpb24pIHtcbiAgICAgIHJldHVybiBjYWNoZVsxXTtcbiAgICB9XG5cbiAgICB2YXIgc25hcHNob3QgPSBBcnJheS5pc0FycmF5KHRhcmdldCkgPyBbXSA6IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldCkpO1xuICAgIHByb3h5Q29tcGFyZS5tYXJrVG9UcmFjayhzbmFwc2hvdCwgdHJ1ZSk7XG4gICAgc25hcHNob3RDYWNoZS5zZXQocmVjZWl2ZXIsIFt2ZXJzaW9uLCBzbmFwc2hvdF0pO1xuICAgIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcblxuICAgICAgaWYgKHJlZlNldC5oYXModmFsdWUpKSB7XG4gICAgICAgIHByb3h5Q29tcGFyZS5tYXJrVG9UcmFjayh2YWx1ZSwgZmFsc2UpO1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICBpZiAoUFJPTUlTRV9SRVNVTFQgaW4gdmFsdWUpIHtcbiAgICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWVbUFJPTUlTRV9SRVNVTFRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBlcnJvck9yUHJvbWlzZSA9IHZhbHVlW1BST01JU0VfRVJST1JdIHx8IHZhbHVlO1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzbmFwc2hvdCwga2V5LCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgaWYgKFBST01JU0VfUkVTVUxUIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlW1BST01JU0VfUkVTVUxUXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRocm93IGVycm9yT3JQcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWVbTElTVEVORVJTXSkge1xuICAgICAgICBzbmFwc2hvdFtrZXldID0gdmFsdWVbU05BUFNIT1RdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc25hcHNob3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBPYmplY3QuZnJlZXplKHNuYXBzaG90KTtcbiAgfTtcblxuICB2YXIgYmFzZU9iamVjdCA9IEFycmF5LmlzQXJyYXkoaW5pdGlhbE9iamVjdCkgPyBbXSA6IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKGluaXRpYWxPYmplY3QpKTtcbiAgdmFyIGhhbmRsZXIgPSB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgaWYgKHByb3AgPT09IFZFUlNJT04pIHtcbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wID09PSBMSVNURU5FUlMpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3AgPT09IFNOQVBTSE9UKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVTbmFwc2hvdCh0YXJnZXQsIHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb3AgPT09IEhBTkRMRVIpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICB9LFxuICAgIGRlbGV0ZVByb3BlcnR5OiBmdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHtcbiAgICAgIHZhciBwcmV2VmFsdWUgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3ApO1xuICAgICAgdmFyIGNoaWxkTGlzdGVuZXJzID0gcHJldlZhbHVlID09IG51bGwgPyB2b2lkIDAgOiBwcmV2VmFsdWVbTElTVEVORVJTXTtcblxuICAgICAgaWYgKGNoaWxkTGlzdGVuZXJzKSB7XG4gICAgICAgIGNoaWxkTGlzdGVuZXJzLmRlbGV0ZShwb3BQcm9wTGlzdGVuZXIocHJvcCkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVsZXRlZCA9IFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcblxuICAgICAgaWYgKGRlbGV0ZWQpIHtcbiAgICAgICAgbm90aWZ5VXBkYXRlKFsnZGVsZXRlJywgW3Byb3BdLCBwcmV2VmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XG4gICAgfSxcbiAgICBpczogT2JqZWN0LmlzLFxuICAgIGNhblByb3h5OiBjYW5Qcm94eSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgdmFyIF9PYmplY3QkZ2V0T3duUHJvcGVydCwgX3ZhbHVlO1xuXG4gICAgICB2YXIgaGFzUHJldlZhbHVlID0gUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKTtcbiAgICAgIHZhciBwcmV2VmFsdWUgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcblxuICAgICAgaWYgKGhhc1ByZXZWYWx1ZSAmJiB0aGlzLmlzKHByZXZWYWx1ZSwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgY2hpbGRMaXN0ZW5lcnMgPSBwcmV2VmFsdWUgPT0gbnVsbCA/IHZvaWQgMCA6IHByZXZWYWx1ZVtMSVNURU5FUlNdO1xuXG4gICAgICBpZiAoY2hpbGRMaXN0ZW5lcnMpIHtcbiAgICAgICAgY2hpbGRMaXN0ZW5lcnMuZGVsZXRlKHBvcFByb3BMaXN0ZW5lcihwcm9wKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBwcm94eUNvbXBhcmUuZ2V0VW50cmFja2VkKHZhbHVlKSB8fCB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5leHRWYWx1ZTtcblxuICAgICAgaWYgKChfT2JqZWN0JGdldE93blByb3BlcnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCkpICE9IG51bGwgJiYgX09iamVjdCRnZXRPd25Qcm9wZXJ0LnNldCkge1xuICAgICAgICBuZXh0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIG5leHRWYWx1ZSA9IHZhbHVlLnRoZW4oZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICBuZXh0VmFsdWVbUFJPTUlTRV9SRVNVTFRdID0gdjtcbiAgICAgICAgICBub3RpZnlVcGRhdGUoWydyZXNvbHZlJywgW3Byb3BdLCB2XSk7XG4gICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgbmV4dFZhbHVlW1BST01JU0VfRVJST1JdID0gZTtcbiAgICAgICAgICBub3RpZnlVcGRhdGUoWydyZWplY3QnLCBbcHJvcF0sIGVdKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKChfdmFsdWUgPSB2YWx1ZSkgIT0gbnVsbCAmJiBfdmFsdWVbTElTVEVORVJTXSkge1xuICAgICAgICBuZXh0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgbmV4dFZhbHVlW0xJU1RFTkVSU10uYWRkKGdldFByb3BMaXN0ZW5lcihwcm9wKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY2FuUHJveHkodmFsdWUpKSB7XG4gICAgICAgIG5leHRWYWx1ZSA9IHByb3h5KHZhbHVlKTtcbiAgICAgICAgbmV4dFZhbHVlW0xJU1RFTkVSU10uYWRkKGdldFByb3BMaXN0ZW5lcihwcm9wKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCBuZXh0VmFsdWUsIHJlY2VpdmVyKTtcbiAgICAgIG5vdGlmeVVwZGF0ZShbJ3NldCcsIFtwcm9wXSwgdmFsdWUsIHByZXZWYWx1ZV0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuICB2YXIgcHJveHlPYmplY3QgPSBuZXcgUHJveHkoYmFzZU9iamVjdCwgaGFuZGxlcik7XG4gIHByb3h5Q2FjaGUuc2V0KGluaXRpYWxPYmplY3QsIHByb3h5T2JqZWN0KTtcbiAgUmVmbGVjdC5vd25LZXlzKGluaXRpYWxPYmplY3QpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbml0aWFsT2JqZWN0LCBrZXkpO1xuXG4gICAgaWYgKGRlc2MuZ2V0IHx8IGRlc2Muc2V0KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYmFzZU9iamVjdCwga2V5LCBkZXNjKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJveHlPYmplY3Rba2V5XSA9IGluaXRpYWxPYmplY3Rba2V5XTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcHJveHlPYmplY3Q7XG59XG5mdW5jdGlvbiBnZXRWZXJzaW9uKHByb3h5T2JqZWN0KSB7XG4gIHJldHVybiBpc09iamVjdChwcm94eU9iamVjdCkgPyBwcm94eU9iamVjdFtWRVJTSU9OXSA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIHN1YnNjcmliZShwcm94eU9iamVjdCwgY2FsbGJhY2ssIG5vdGlmeUluU3luYykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICEocHJveHlPYmplY3QgIT0gbnVsbCAmJiBwcm94eU9iamVjdFtMSVNURU5FUlNdKSkge1xuICAgIGNvbnNvbGUud2FybignUGxlYXNlIHVzZSBwcm94eSBvYmplY3QnKTtcbiAgfVxuXG4gIHZhciBwcm9taXNlO1xuICB2YXIgb3BzID0gW107XG5cbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gbGlzdGVuZXIob3ApIHtcbiAgICBvcHMucHVzaChvcCk7XG5cbiAgICBpZiAobm90aWZ5SW5TeW5jKSB7XG4gICAgICBjYWxsYmFjayhvcHMuc3BsaWNlKDApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXByb21pc2UpIHtcbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2FsbGJhY2sob3BzLnNwbGljZSgwKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcHJveHlPYmplY3RbTElTVEVORVJTXS5hZGQobGlzdGVuZXIpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHByb3h5T2JqZWN0W0xJU1RFTkVSU10uZGVsZXRlKGxpc3RlbmVyKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHNuYXBzaG90KHByb3h5T2JqZWN0KSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiYgIShwcm94eU9iamVjdCAhPSBudWxsICYmIHByb3h5T2JqZWN0W1NOQVBTSE9UXSkpIHtcbiAgICBjb25zb2xlLndhcm4oJ1BsZWFzZSB1c2UgcHJveHkgb2JqZWN0Jyk7XG4gIH1cblxuICByZXR1cm4gcHJveHlPYmplY3RbU05BUFNIT1RdO1xufVxuZnVuY3Rpb24gZ2V0SGFuZGxlcihwcm94eU9iamVjdCkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmICEocHJveHlPYmplY3QgIT0gbnVsbCAmJiBwcm94eU9iamVjdFtIQU5ETEVSXSkpIHtcbiAgICBjb25zb2xlLndhcm4oJ1BsZWFzZSB1c2UgcHJveHkgb2JqZWN0Jyk7XG4gIH1cblxuICByZXR1cm4gcHJveHlPYmplY3RbSEFORExFUl07XG59XG5cbmV4cG9ydHMuZ2V0SGFuZGxlciA9IGdldEhhbmRsZXI7XG5leHBvcnRzLmdldFZlcnNpb24gPSBnZXRWZXJzaW9uO1xuZXhwb3J0cy5wcm94eSA9IHByb3h5O1xuZXhwb3J0cy5yZWYgPSByZWY7XG5leHBvcnRzLnNuYXBzaG90ID0gc25hcHNob3Q7XG5leHBvcnRzLnN1YnNjcmliZSA9IHN1YnNjcmliZTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgcHJveHksIHN1YnNjcmliZSB9IGZyb20gJ3ZhbHRpbyc7XHJcbmltcG9ydCB7IHBsdWdpbkFwaSB9IGZyb20gXCIuLi8uLi9ycGMtYXBpXCI7XHJcbmxldCBtdXRleCA9IGZhbHNlO1xyXG5jb25zdCBkZWZhdWx0TWV0YVByb3BzID0ge1xyXG4gICAgZHVyYXRpb246IFwiMFwiLFxyXG4gICAgdHlwZTogXCJcIixcclxufTtcclxuZXhwb3J0IGNvbnN0IE1ldGFGb3JtU3RvcmUgPSBwcm94eSh7XHJcbiAgICBtZXRhUHJvcHM6IGRlZmF1bHRNZXRhUHJvcHMsXHJcbiAgICBzZXRNZXRhUHJvcHMocHJvcHMpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBtdXRleCA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICBNZXRhRm9ybVN0b3JlLm1ldGFQcm9wc1trZXldID0gcHJvcHNba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG11dGV4ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBzZXREZWZhdWx0UHJvcHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDT05USU5VRSBDTEVBUlwiKTtcclxuICAgICAgICAgICAgTWV0YUZvcm1TdG9yZS5zZXRNZXRhUHJvcHMoZGVmYXVsdE1ldGFQcm9wcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5zdWJzY3JpYmUoTWV0YUZvcm1TdG9yZS5tZXRhUHJvcHMsICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgaWYgKCFtdXRleCkge1xyXG4gICAgICAgIHlpZWxkIHBsdWdpbkFwaS5zZXRNZXRhVGFncyhKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE1ldGFGb3JtU3RvcmUubWV0YVByb3BzKSkpO1xyXG4gICAgfVxyXG59KSk7XHJcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgcHJveHksIHN1YnNjcmliZSB9IGZyb20gJ3ZhbHRpbyc7XHJcbmltcG9ydCB7IHBsdWdpbkFwaSB9IGZyb20gJy4uLy4uL3JwYy1hcGknO1xyXG5sZXQgbXV0ZXggPSBmYWxzZTtcclxuZXhwb3J0IGNvbnN0IFR1bmVGb3JtU3RvcmUgPSBwcm94eSh7XHJcbiAgICBzdGVwUHJvcHM6IHtcclxuICAgICAgICBzaGFkb3dTaXplOiAwLFxyXG4gICAgICAgIGJydXNoU2l6ZTogMCxcclxuICAgICAgICBzdWdnZXN0ZWRCcnVzaFNpemU6IDAsXHJcbiAgICAgICAgc3RlcENvdW50OiAxLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnJyxcclxuICAgICAgICBjbGVhckJlZm9yZTogZmFsc2UsXHJcbiAgICAgICAgY2xlYXJMYXllcnM6IFtdLFxyXG4gICAgICAgIG90aGVyVGFnczogW10sXHJcbiAgICAgICAgYnJ1c2hUeXBlOiAnJyxcclxuICAgIH0sXHJcbiAgICBhbmltYXRpb25Qcm9wczoge1xyXG4gICAgICAgIGFuaW1hdGlvblRhZzogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRlbGF5OiAwLFxyXG4gICAgICAgIHJlcGVhdDogMCxcclxuICAgIH0sXHJcbiAgICBzdGVwTmF2aWdhdGlvblByb3BzOiB7XHJcbiAgICAgICAgc3RlcE51bWJlcjogMSxcclxuICAgICAgICBkaXNwbGF5TW9kZTogJ2FsbCcsXHJcbiAgICB9LFxyXG4gICAgc2V0QW5pbWF0aW9uVGFncyhhbmltYXRpb25UYWcsIGRlbGF5LCByZXBlYXQpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBtdXRleCA9IHRydWU7XHJcbiAgICAgICAgICAgIFR1bmVGb3JtU3RvcmUuYW5pbWF0aW9uUHJvcHMuYW5pbWF0aW9uVGFnID0gYW5pbWF0aW9uVGFnO1xyXG4gICAgICAgICAgICBUdW5lRm9ybVN0b3JlLmFuaW1hdGlvblByb3BzLmRlbGF5ID0gZGVsYXk7XHJcbiAgICAgICAgICAgIFR1bmVGb3JtU3RvcmUuYW5pbWF0aW9uUHJvcHMucmVwZWF0ID0gcmVwZWF0O1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG11dGV4ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0sIDEwKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVQcm9wcyhzZXR0aW5ncykge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIG11dGV4ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIFR1bmVGb3JtU3RvcmUuc3RlcFByb3BzW2tleV0gPSBzZXR0aW5nc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbXV0ZXggPSBmYWxzZTtcclxuICAgICAgICAgICAgfSwgMTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNldFN0ZXBOYXZpZ2F0aW9uUHJvcHMoc3RlcE51bWJlciwgZGlzcGxheU1vZGUpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBtdXRleCA9IHRydWU7XHJcbiAgICAgICAgICAgIFR1bmVGb3JtU3RvcmUuc3RlcE5hdmlnYXRpb25Qcm9wcy5zdGVwTnVtYmVyID0gc3RlcE51bWJlcjtcclxuICAgICAgICAgICAgVHVuZUZvcm1TdG9yZS5zdGVwTmF2aWdhdGlvblByb3BzLmRpc3BsYXlNb2RlID0gZGlzcGxheU1vZGU7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbXV0ZXggPSBmYWxzZTtcclxuICAgICAgICAgICAgfSwgMTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxufSk7XHJcbnN1YnNjcmliZShUdW5lRm9ybVN0b3JlLnN0ZXBQcm9wcywgKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBpZiAoIW11dGV4KSB7XHJcbiAgICAgICAgeWllbGQgcGx1Z2luQXBpLnVwZGF0ZVByb3BzKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShUdW5lRm9ybVN0b3JlLnN0ZXBQcm9wcykpKSwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShUdW5lRm9ybVN0b3JlLmFuaW1hdGlvblByb3BzKSkpKTtcclxuICAgICAgICB5aWVsZCBwbHVnaW5BcGkudXBkYXRlRGlzcGxheShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFR1bmVGb3JtU3RvcmUuc3RlcE5hdmlnYXRpb25Qcm9wcykpKTtcclxuICAgIH1cclxufSkpO1xyXG5zdWJzY3JpYmUoVHVuZUZvcm1TdG9yZS5zdGVwTmF2aWdhdGlvblByb3BzLCAoKSA9PiB7XHJcbiAgICBpZiAoIW11dGV4KSB7XHJcbiAgICAgICAgcGx1Z2luQXBpLnVwZGF0ZURpc3BsYXkoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShUdW5lRm9ybVN0b3JlLnN0ZXBOYXZpZ2F0aW9uUHJvcHMpKSk7XHJcbiAgICB9XHJcbn0pO1xyXG5zdWJzY3JpYmUoVHVuZUZvcm1TdG9yZS5hbmltYXRpb25Qcm9wcywgKCkgPT4ge1xyXG4gICAgaWYgKCFtdXRleCkge1xyXG4gICAgICAgIHBsdWdpbkFwaS51cGRhdGVQcm9wcyhPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoVHVuZUZvcm1TdG9yZS5zdGVwUHJvcHMpKSksIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoVHVuZUZvcm1TdG9yZS5hbmltYXRpb25Qcm9wcykpKSk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJjb25zdCBldmVudEhhbmRsZXJzID0ge307XHJcbmxldCBjdXJyZW50SWQgPSAwO1xyXG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xyXG4gICAgY29uc3QgaWQgPSBgJHtjdXJyZW50SWR9YDtcclxuICAgIGN1cnJlbnRJZCArPSAxO1xyXG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZGVsZXRlIGV2ZW50SGFuZGxlcnNbaWRdO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gb25jZShuYW1lLCBoYW5kbGVyKSB7XHJcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIG9uKG5hbWUsIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKGRvbmUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb25lID0gdHJ1ZTtcclxuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xyXG4gICAgPyBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xyXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKFtuYW1lLCAuLi5hcmdzXSk7XHJcbiAgICB9XHJcbiAgICA6IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcclxuICAgICAgICB9LCAnKicpO1xyXG4gICAgfTtcclxuZnVuY3Rpb24gaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpIHtcclxuICAgIGZvciAoY29uc3QgaWQgaW4gZXZlbnRIYW5kbGVycykge1xyXG4gICAgICAgIGlmIChldmVudEhhbmRsZXJzW2lkXS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaWRdLmhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoKF9hID0gcGFyYW1zWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuanNvbnJwYykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IFtuYW1lLCAuLi5hcmdzXSA9IHBhcmFtc1swXTtcclxuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmVsc2Uge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gVE9ETzogdmVyeSBkaXJ0eSBoYWNrLCBuZWVkcyBmaXhpbmdcclxuICAgICAgICBjb25zdCBmYWxsYmFjayA9IHdpbmRvdy5vbm1lc3NhZ2U7XHJcbiAgICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcclxuICAgICAgICAgICAgZmFsbGJhY2suYXBwbHkod2luZG93LCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IHBhcmFtc1swXTtcclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XHJcbiAgICAgICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgfSwgMTAwKTtcclxufVxyXG4iLCJpbXBvcnQgeyBnZXRTdGVwcywgdGFnVW5vcmRlcmVkU3RlcHMgfSBmcm9tICcuL3R1bmUtcnBjJztcclxuaW1wb3J0IHsgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3NvbiwgZmluZFBhcmVudEJ5VGFnLCBnZXROb2RlSW5kZXgsIGdldFRhZ3MsIGlzUmVzdWx0U3RlcCwgZ2V0U3RlcE9yZGVyLCBzZXRTdGVwT3JkZXIsIH0gZnJvbSAnLi91dGlsJztcclxuZnVuY3Rpb24gZm9ybWF0Tm9kZShub2RlLCBwYXJhbWV0ZXJzKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHgsIHksIHdpZHRoID0gNDAsIGhlaWdodCA9IDQwIH0gPSBwYXJhbWV0ZXJzO1xyXG4gICAgbm9kZS5uYW1lID0gbmFtZTtcclxuICAgIG5vZGUueCA9IHg7XHJcbiAgICBub2RlLnkgPSB5O1xyXG4gICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XHJcbn1cclxuZnVuY3Rpb24gZmlsbFNlcnZpY2VOb2Rlcyhub2RlKSB7XHJcbiAgICBub2RlLmZpbGxzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcclxuICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICAgIHI6IDE5NiAvIDI1NSxcclxuICAgICAgICAgICAgICAgIGc6IDE5NiAvIDI1NSxcclxuICAgICAgICAgICAgICAgIGI6IDE5NiAvIDI1NSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgXTtcclxufVxyXG5mdW5jdGlvbiByZXNjYWxlSW1hZ2VOb2RlKG5vZGUsIHJlc2l6ZVBhcmFtcykge1xyXG4gICAgY29uc3QgeyBtYXhXaWR0aCwgbWF4SGVpZ2h0IH0gPSByZXNpemVQYXJhbXM7XHJcbiAgICBjb25zdCBpc0NvcnJlY3RTaXplID0gbm9kZS53aWR0aCA8PSBtYXhXaWR0aCAmJiBub2RlLmhlaWdodCA8PSBtYXhIZWlnaHQ7XHJcbiAgICBjb25zdCBpc0NvcnJlY3RUeXBlID0gbm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScgfHwgbm9kZS50eXBlID09PSAnVkVDVE9SJztcclxuICAgIGlmIChpc0NvcnJlY3RUeXBlICYmICFpc0NvcnJlY3RTaXplKSB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBNYXRoLm1pbihtYXhXaWR0aCAvIG5vZGUud2lkdGgsIG1heEhlaWdodCAvIG5vZGUuaGVpZ2h0KTtcclxuICAgICAgICBub2RlLnJlc2NhbGUoc2NhbGVGYWN0b3IpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUmVzdWx0Tm9kZShub2RlKSB7XHJcbiAgICBjb25zdCByZXN1bHRSZWN0YW5nbGUgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcclxuICAgIGZpbGxTZXJ2aWNlTm9kZXMocmVzdWx0UmVjdGFuZ2xlKTtcclxuICAgIGNvbnN0IHRlbXBsYXRlR3JvdXAgPSBmaWdtYS5ncm91cChbcmVzdWx0UmVjdGFuZ2xlXSwgbm9kZSk7XHJcbiAgICB0ZW1wbGF0ZUdyb3VwLm5hbWUgPSAndGVtcGxhdGUnO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gZmlnbWEuZ3JvdXAoW3RlbXBsYXRlR3JvdXBdLCBub2RlKTtcclxuICAgIGZvcm1hdE5vZGUocmVzdWx0LCB7XHJcbiAgICAgICAgbmFtZTogJ3N0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0JyxcclxuICAgICAgICB4OiAxMCxcclxuICAgICAgICB5OiA2MCxcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMZXNzb24oKSB7XHJcbiAgICBjb25zdCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2U7XHJcbiAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggIT09IDEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBvcmlnaW5hbEltYWdlID0gbm9kZS5jaGlsZHJlblswXTtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICBmb3JtYXROb2RlKGxlc3Nvbiwge1xyXG4gICAgICAgIG5hbWU6ICdsZXNzb24nLFxyXG4gICAgICAgIHg6IC00NjEsXHJcbiAgICAgICAgeTogLTUxMixcclxuICAgICAgICB3aWR0aDogMTM2NixcclxuICAgICAgICBoZWlnaHQ6IDEwMjQsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHRodW1ibmFpbCA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbCwge1xyXG4gICAgICAgIG5hbWU6ICd0aHVtYm5haWwnLFxyXG4gICAgICAgIHg6IC05MDEsXHJcbiAgICAgICAgeTogLTUxMixcclxuICAgICAgICB3aWR0aDogNDAwLFxyXG4gICAgICAgIGhlaWdodDogNDAwLFxyXG4gICAgfSk7XHJcbiAgICAvLyBDcmVhdGUgc3RlcFxyXG4gICAgY29uc3Qgc3RlcCA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcclxuICAgIHN0ZXAubmFtZSA9ICdpbWFnZSc7XHJcbiAgICBjb25zdCByZXNpemVkSW1hZ2UgPSByZXNjYWxlSW1hZ2VOb2RlKG9yaWdpbmFsSW1hZ2UsIHtcclxuICAgICAgICBtYXhXaWR0aDogbGVzc29uLndpZHRoIC0gODMgKiAyLFxyXG4gICAgICAgIG1heEhlaWdodDogbGVzc29uLmhlaWdodCAtIDEyICogMixcclxuICAgIH0pO1xyXG4gICAgY29uc3Qgc3RlcElucHV0ID0gZmlnbWEuZ3JvdXAoW3N0ZXBdLCBsZXNzb24pO1xyXG4gICAgc3RlcElucHV0Lm5hbWUgPSAnaW5wdXQnO1xyXG4gICAgY29uc3QgZmlyc3RTdGVwID0gZmlnbWEuZ3JvdXAoW3N0ZXBJbnB1dF0sIGxlc3Nvbik7XHJcbiAgICBmb3JtYXROb2RlKGZpcnN0U3RlcCwge1xyXG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLWJydXNoJyxcclxuICAgICAgICB4OiAobGVzc29uLndpZHRoIC0gcmVzaXplZEltYWdlLndpZHRoKSAvIDIsXHJcbiAgICAgICAgeTogKGxlc3Nvbi5oZWlnaHQgLSByZXNpemVkSW1hZ2UuaGVpZ2h0KSAvIDIsXHJcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRJbWFnZS53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHJlc2l6ZWRJbWFnZS5oZWlnaHQsXHJcbiAgICB9KTtcclxuICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcclxuICAgIGNvbnN0IHRodW1ibmFpbEltYWdlID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xyXG4gICAgdGh1bWJuYWlsSW1hZ2UubmFtZSA9ICdpbWFnZSc7XHJcbiAgICBjb25zdCByZXNpemVkVGh1bWJuYWlsID0gcmVzY2FsZUltYWdlTm9kZSh0aHVtYm5haWxJbWFnZSwge1xyXG4gICAgICAgIG1heFdpZHRoOiB0aHVtYm5haWwud2lkdGggLSAzNSAqIDIsXHJcbiAgICAgICAgbWF4SGVpZ2h0OiB0aHVtYm5haWwuaGVpZ2h0IC0gMzUgKiAyLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB0aHVtYm5haWxHcm91cCA9IGZpZ21hLmdyb3VwKFt0aHVtYm5haWxJbWFnZV0sIHRodW1ibmFpbCk7XHJcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbEdyb3VwLCB7XHJcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCBncm91cCcsXHJcbiAgICAgICAgeDogKHRodW1ibmFpbC53aWR0aCAtIHJlc2l6ZWRUaHVtYm5haWwud2lkdGgpIC8gMixcclxuICAgICAgICB5OiAodGh1bWJuYWlsLmhlaWdodCAtIHJlc2l6ZWRUaHVtYm5haWwuaGVpZ2h0KSAvIDIsXHJcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRUaHVtYm5haWwud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkVGh1bWJuYWlsLmhlaWdodCxcclxuICAgIH0pO1xyXG4gICAgLy8gQ3JlYXRlIHJlc3VsdFxyXG4gICAgY3JlYXRlUmVzdWx0Tm9kZShsZXNzb24pO1xyXG4gICAgLy8gQ3JlYXRlIHNldHRpbmdzXHJcbiAgICBjb25zdCBzZXR0aW5nc0VsbGlwc2UgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XHJcbiAgICBmaWxsU2VydmljZU5vZGVzKHNldHRpbmdzRWxsaXBzZSk7XHJcbiAgICBmb3JtYXROb2RlKHNldHRpbmdzRWxsaXBzZSwge1xyXG4gICAgICAgIG5hbWU6IGBzZXR0aW5ncyBjYXB0dXJlLWNvbG9yIHpvb20tc2NhbGUtMiBvcmRlci1sYXllcnNgLFxyXG4gICAgICAgIHg6IDEwLFxyXG4gICAgICAgIHk6IDEwLFxyXG4gICAgfSk7XHJcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQoc2V0dGluZ3NFbGxpcHNlKTtcclxuICAgIG9yaWdpbmFsSW1hZ2UucmVtb3ZlKCk7XHJcbiAgICB0YWdVbm9yZGVyZWRTdGVwcygpO1xyXG59XHJcbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbG9yKGNvbG9yKSB7XHJcbiAgICBsZXQgeyByLCBnLCBiIH0gPSBjb2xvcjtcclxuICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xyXG4gICAgZyA9IE1hdGgucm91bmQoZyAqIDI1NSk7XHJcbiAgICBiID0gTWF0aC5yb3VuZChiICogMjU1KTtcclxuICAgIHJldHVybiBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYDtcclxufVxyXG5mdW5jdGlvbiBuYW1lTGVhZk5vZGVzKG5vZGVzKSB7XHJcbiAgICBsZXQgYWxsU3Ryb2tlcyA9ICFub2Rlcy5maW5kKChub2RlKSA9PiAnZmlsbHMnIGluIG5vZGUgJiYgbm9kZS5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbm9kZS5maWxscy5sZW5ndGggPiAwKTtcclxuICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICBub2RlLm5hbWUgPVxyXG4gICAgICAgICAgICAncmdiLXRlbXBsYXRlICcgKyAoYWxsU3Ryb2tlcyAmJiBub2Rlcy5sZW5ndGggPiAzID8gJ2RyYXctbGluZScgOiAnYmxpbmsnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBuYW1lU3RlcE5vZGUoc3RlcCkge1xyXG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhzdGVwKTtcclxuICAgIGxldCBmaWxscyA9IGxlYXZlcy5maWx0ZXIoKG4pID0+ICdmaWxscycgaW4gbiAmJiBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBuLmZpbGxzLmxlbmd0aCA+IDApO1xyXG4gICAgbGV0IHN0cm9rZXMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCk7XHJcbiAgICBsZXQgbXVsdGlzdGVwVHlwZSA9IGZpbGxzLmxlbmd0aCA+IDAgPyAnYmcnIDogJ2JydXNoJztcclxuICAgIGxldCBzdHJva2VXZWlnaHRzQXJyID0gc3Ryb2tlcy5tYXAoKG5vZGUpID0+IG5vZGVbJ3N0cm9rZVdlaWdodCddIHx8IDApO1xyXG4gICAgbGV0IG1heFdlaWdodCA9IE1hdGgubWF4KC4uLnN0cm9rZVdlaWdodHNBcnIpO1xyXG4gICAgbGV0IHdlaWdodCA9IHN0cm9rZXMubGVuZ3RoID4gMCA/IG1heFdlaWdodCA6IDI1O1xyXG4gICAgc3RlcC5uYW1lID0gYHN0ZXAgcy1tdWx0aXN0ZXAtJHttdWx0aXN0ZXBUeXBlfSBicy0ke3dlaWdodH1gO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZVN0ZXBOb2RlKG5vZGUsIG5vZGVzQXJyYXksIGluZGV4KSB7XHJcbiAgICBpZiAoIW5vZGVzQXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbmFtZUxlYWZOb2Rlcyhub2Rlc0FycmF5KTtcclxuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXNBcnJheSwgbm9kZSk7XHJcbiAgICBpbnB1dC5uYW1lID0gJ2lucHV0JztcclxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBub2RlLCBpbmRleCk7XHJcbiAgICBuYW1lU3RlcE5vZGUoc3RlcCk7XHJcbiAgICByZXR1cm4gc3RlcDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFzdFN0ZXBPcmRlcigpIHtcclxuICAgIGNvbnN0IHN0ZXBzT3JkZXIgPSBnZXRTdGVwcygpXHJcbiAgICAgICAgLm1hcCgocykgPT4gZ2V0U3RlcE9yZGVyKHMpKVxyXG4gICAgICAgIC5maWx0ZXIoKHMpID0+IHMgIT09IHVuZGVmaW5lZCk7XHJcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4uc3RlcHNPcmRlciwgMCk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlU3RlcCgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcclxuICAgIGNvbnN0IGxlYXZlcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+ICEoJ2NoaWxkcmVuJyBpbiBub2RlKSk7XHJcbiAgICBpZiAoIWxlYXZlcy5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBmaXJzdFBhcmVudFN0ZXAgPSBmaW5kUGFyZW50QnlUYWcoc2VsZWN0aW9uWzBdLCAnc3RlcCcpO1xyXG4gICAgaWYgKGlzUmVzdWx0U3RlcChmaXJzdFBhcmVudFN0ZXApKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoZmlyc3RQYXJlbnRTdGVwKTtcclxuICAgIGNvbnN0IHN0ZXAgPSBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGxlYXZlcywgaW5kZXgpO1xyXG4gICAgY29uc3QgcmVzdWx0U3RlcCA9IGxlc3Nvbi5jaGlsZHJlbi5maW5kKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XHJcbiAgICBjb25zdCBsYXN0U3RlcE9yZGVyID0gZ2V0TGFzdFN0ZXBPcmRlcigpO1xyXG4gICAgaWYgKGxhc3RTdGVwT3JkZXIgPiAwKSB7XHJcbiAgICAgICAgc2V0U3RlcE9yZGVyKHJlc3VsdFN0ZXAsIGxhc3RTdGVwT3JkZXIgKyAxKTtcclxuICAgICAgICBzZXRTdGVwT3JkZXIoc3RlcCwgbGFzdFN0ZXBPcmRlcik7IC8vIGxhc3Qgc3RlcCBiZWZvcmUgcmVzdWx0XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYWRkVG9NYXAobWFwLCBrZXksIG5vZGUpIHtcclxuICAgIGlmICghbWFwLmhhcyhrZXkpKSB7XHJcbiAgICAgICAgbWFwLnNldChrZXksIFtdKTtcclxuICAgIH1cclxuICAgIG1hcC5nZXQoa2V5KS5wdXNoKG5vZGUpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEJ5Q29sb3IoKSB7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICBpZiAoIXNlbGVjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMocGFyZW50U3RlcCk7XHJcbiAgICBpZiAoIXBhcmVudFN0ZXAgfHwgaXNSZXN1bHRTdGVwKHBhcmVudFN0ZXApIHx8IGxlYXZlcy5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBmaWxsc0J5Q29sb3IgPSBuZXcgTWFwKCk7XHJcbiAgICBsZXQgc3Ryb2tlc0J5Q29sb3IgPSBuZXcgTWFwKCk7XHJcbiAgICBsZXQgdW5rbm93bk5vZGVzID0gW107XHJcbiAgICBmaW5kTGVhZk5vZGVzKHBhcmVudFN0ZXApLmZvckVhY2goKG4pID0+IHtcclxuICAgICAgICBpZiAoJ2ZpbGxzJyBpbiBuICYmXHJcbiAgICAgICAgICAgIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmXHJcbiAgICAgICAgICAgIG4uZmlsbHMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgICBuLmZpbGxzWzBdLnR5cGUgPT09ICdTT0xJRCcpIHtcclxuICAgICAgICAgICAgYWRkVG9NYXAoZmlsbHNCeUNvbG9yLCBzdHJpbmdpZnlDb2xvcihuLmZpbGxzWzBdLmNvbG9yKSwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCdzdHJva2VzJyBpbiBuICYmXHJcbiAgICAgICAgICAgIG4uc3Ryb2tlcy5sZW5ndGggPiAwICYmXHJcbiAgICAgICAgICAgIG4uc3Ryb2tlc1swXS50eXBlID09PSAnU09MSUQnKSB7XHJcbiAgICAgICAgICAgIGFkZFRvTWFwKHN0cm9rZXNCeUNvbG9yLCBzdHJpbmdpZnlDb2xvcihuLnN0cm9rZXNbMF0uY29sb3IpLCBuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHVua25vd25Ob2Rlcy5wdXNoKG4pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZm9yIChsZXQgZmlsbHMgb2YgZmlsbHNCeUNvbG9yLnZhbHVlcygpKSB7XHJcbiAgICAgICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBmaWxscyk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBzdHJva2VzIG9mIHN0cm9rZXNCeUNvbG9yLnZhbHVlcygpKSB7XHJcbiAgICAgICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBzdHJva2VzKTtcclxuICAgIH1cclxuICAgIGlmICh1bmtub3duTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgdW5rbm93bk5vZGVzKTtcclxuICAgIH1cclxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgcmVzdWx0IGlzIGxvY2F0ZWQgYXQgdGhlIGVuZFxyXG4gICAgY29uc3QgcmVzdWx0ID0gbGVzc29uLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICByZXN1bHQucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVSZXN1bHROb2RlKGxlc3Nvbik7XHJcbiAgICAvLyBSZW1vdmUgb3JpZ2luYWwgbm9kZSBpZiB0aGVyZSBhcmUgcmVtYWluc1xyXG4gICAgaWYgKCFwYXJlbnRTdGVwLnJlbW92ZWQpIHtcclxuICAgICAgICBwYXJlbnRTdGVwLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gICAgdGFnVW5vcmRlcmVkU3RlcHMoKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gam9pblN0ZXBzKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgY29uc3QgYWxsU3RlcHMgPSBzZWxlY3Rpb24uZXZlcnkoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSk7XHJcbiAgICBjb25zdCBzdGVwcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG4pID0+ICFpc1Jlc3VsdFN0ZXAobikpO1xyXG4gICAgaWYgKCFhbGxTdGVwcyB8fCBzdGVwcy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaW5wdXROb2RlcyA9IHN0ZXBzXHJcbiAgICAgICAgLm1hcCgoc3RlcCkgPT4gc3RlcC5jaGlsZHJlbi5maWx0ZXIoKG4pID0+IG4ubmFtZSA9PT0gJ2lucHV0JyAmJiBuLnR5cGUgPT09ICdHUk9VUCcpKVxyXG4gICAgICAgIC5mbGF0KCk7XHJcbiAgICBjb25zdCBsZWF2ZXMgPSBpbnB1dE5vZGVzLm1hcCgobikgPT4gbi5jaGlsZHJlbikuZmxhdCgpO1xyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoc3RlcHNbMF0pO1xyXG4gICAgY29uc3QgZmlyc3RTdGVwT3JkZXIgPSBnZXRTdGVwT3JkZXIoc3RlcHNbMF0pO1xyXG4gICAgY29uc3Qgam9pbmVkU3RlcCA9IGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgbGVhdmVzLCBpbmRleCk7XHJcbiAgICBpZiAoZmlyc3RTdGVwT3JkZXIpIHtcclxuICAgICAgICBzZXRTdGVwT3JkZXIoam9pbmVkU3RlcCwgZmlyc3RTdGVwT3JkZXIpO1xyXG4gICAgfVxyXG59XHJcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgZGlzcGxheU5vdGlmaWNhdGlvbiwgZmluZEFsbCwgZ2V0Q3VycmVudExlc3NvbiB9IGZyb20gJy4vdXRpbCc7XHJcbmltcG9ydCB7IHN0ZXBzQnlPcmRlciB9IGZyb20gJy4vdHVuZS1ycGMnO1xyXG5mdW5jdGlvbiBmaW5kVGV4dEluQ3VycmVudExlc3NvbigpIHtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIHJldHVybiBzdGVwc0J5T3JkZXIobGVzc29uKVxyXG4gICAgICAgIC5mbGF0TWFwKChzdGVwKSA9PiBmaW5kQWxsKHN0ZXAsIChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJykpXHJcbiAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZS52aXNpYmxlKTtcclxufVxyXG5mdW5jdGlvbiBnZXRTdHlsZWRTZWdtZW50cyhub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoW1xyXG4gICAgICAgICdmb250U2l6ZScsXHJcbiAgICAgICAgJ2ZvbnROYW1lJyxcclxuICAgICAgICAnZm9udFdlaWdodCcsXHJcbiAgICAgICAgJ3RleHREZWNvcmF0aW9uJyxcclxuICAgICAgICAndGV4dENhc2UnLFxyXG4gICAgICAgICdsaW5lSGVpZ2h0JyxcclxuICAgICAgICAnbGV0dGVyU3BhY2luZycsXHJcbiAgICAgICAgJ2ZpbGxzJyxcclxuICAgICAgICAndGV4dFN0eWxlSWQnLFxyXG4gICAgICAgICdmaWxsU3R5bGVJZCcsXHJcbiAgICAgICAgJ2xpc3RPcHRpb25zJyxcclxuICAgICAgICAnaW5kZW50YXRpb24nLFxyXG4gICAgICAgICdoeXBlcmxpbmsnLFxyXG4gICAgXSk7XHJcbn1cclxuZnVuY3Rpb24gZXNjYXBlKHN0cikge1xyXG4gICAgcmV0dXJuIHN0clxyXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXHJcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXHwvZywgJ1xcXFxsJylcclxuICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpO1xyXG59XHJcbmNvbnN0IHJlcGxhY2VtZW50cyA9IHsgJ1xcXFxcXFxcJzogJ1xcXFwnLCAnXFxcXG4nOiAnXFxuJywgJ1xcXFxcIic6ICdcIicsICdcXFxcbCc6ICd8JyB9O1xyXG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcclxuICAgIGlmIChzdHIubWF0Y2goL1xcfC8pIHx8IHN0ci5tYXRjaCgvKD88IVxcXFwpXCIvKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcKFxcXFx8bnxcInxsKS9nLCBmdW5jdGlvbiAocmVwbGFjZSkge1xyXG4gICAgICAgIHJldHVybiByZXBsYWNlbWVudHNbcmVwbGFjZV07XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRGb3JtYXR0ZWRUZXh0KG5vZGUpIHtcclxuICAgIHJldHVybiBnZXRTdHlsZWRTZWdtZW50cyhub2RlKVxyXG4gICAgICAgIC5tYXAoKHMpID0+IGVzY2FwZShzLmNoYXJhY3RlcnMpKVxyXG4gICAgICAgIC5qb2luKCd8JylcclxuICAgICAgICAudHJpbUVuZCgpO1xyXG59XHJcbmZ1bmN0aW9uIGltcG9ydFN0eWxlZFNlZ21lbnRzKHNlZ21lbnRUZXh0cywgbm9kZSkge1xyXG4gICAgLy8gdXBkYXRlIHNlZ21lbnRzIGluIHJldmVyc2Ugb3JkZXJcclxuICAgIGZvciAobGV0IGkgPSBzZWdtZW50VGV4dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICBjb25zdCBzZWdtZW50VGV4dCA9IHNlZ21lbnRUZXh0c1tpXTtcclxuICAgICAgICBsZXQgc3R5bGVzID0gZ2V0U3R5bGVkU2VnbWVudHMobm9kZSk7XHJcbiAgICAgICAgaWYgKHNlZ21lbnRUZXh0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbm9kZS5pbnNlcnRDaGFyYWN0ZXJzKHN0eWxlc1tpXS5lbmQsIHNlZ21lbnRUZXh0LCAnQkVGT1JFJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuZGVsZXRlQ2hhcmFjdGVycyhzdHlsZXNbaV0uc3RhcnQsIHN0eWxlc1tpXS5lbmQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRUZXh0cygpIHtcclxuICAgIGNvbnN0IHRleHRzID0gZmluZFRleHRJbkN1cnJlbnRMZXNzb24oKTtcclxuICAgIHJldHVybiAodGV4dHNcclxuICAgICAgICAubWFwKChub2RlKSA9PiBnZXRGb3JtYXR0ZWRUZXh0KG5vZGUpKVxyXG4gICAgICAgIC5maWx0ZXIoKHN0cikgPT4gc3RyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcclxuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcclxufVxyXG5mdW5jdGlvbiBsb2FkRm9udHModGV4dHMpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgYWxsRm9udHMgPSBbXTtcclxuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcclxuICAgICAgICAgICAgZ2V0U3R5bGVkU2VnbWVudHModHh0KS5tYXAoKHMpID0+IHtcclxuICAgICAgICAgICAgICAgIGFsbEZvbnRzLnB1c2gocy5mb250TmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHVuaXF1ZUZvbnRzID0gYWxsRm9udHMuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+IGluZGV4ID09PVxyXG4gICAgICAgICAgICBzZWxmLmZpbmRJbmRleCgodCkgPT4gdC5mYW1pbHkgPT09IHZhbHVlLmZhbWlseSAmJiB0LnN0eWxlID09PSB2YWx1ZS5zdHlsZSkpO1xyXG4gICAgICAgIGZvciAobGV0IGZvbnQgb2YgdW5pcXVlRm9udHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydFRleHRzKHRyYW5zbGF0aW9ucykge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LmtleXModHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZGlzcGxheU5vdGlmaWNhdGlvbignRW1wdHkgaW5wdXQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0ZXh0cyA9IGZpbmRUZXh0SW5DdXJyZW50TGVzc29uKCk7XHJcbiAgICAgICAgeWllbGQgbG9hZEZvbnRzKHRleHRzKTtcclxuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkVGV4dCA9IGdldEZvcm1hdHRlZFRleHQodHh0KTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbZm9ybWF0dGVkVGV4dF07XHJcbiAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcclxuICAgICAgICAgICAgY29uc3Qgb2xkU2VnbWVudHMgPSBmb3JtYXR0ZWRUZXh0LnNwbGl0KCd8Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NlZ21lbnRzID0gdHJhbnNsYXRpb24uc3BsaXQoJ3wnKS5tYXAoKHN0cikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdW5lc2NhcGUoc3RyKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgRmFpbGVkIHRvIHVuZXNjYXBlOiAke3N0cn1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogZGVsZXRlIGFsbCB0ZXh0XHJcbiAgICAgICAgICAgIGlmIChuZXdTZWdtZW50cy5sZW5ndGggPT09IDEgJiYgbmV3U2VnbWVudHNbMF0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB0eHQuY2hhcmFjdGVycyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBzZWdtZW50cyBsZW5ndGggbWlzbWF0Y2hcclxuICAgICAgICAgICAgaWYgKG5ld1NlZ21lbnRzLmxlbmd0aCAhPT0gb2xkU2VnbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgV3Jvbmcgc2VnbWVudCBjb3VudCAoJHtuZXdTZWdtZW50cy5sZW5ndGh9IOKJoCAke29sZFNlZ21lbnRzLmxlbmd0aH0pOiAke2Zvcm1hdHRlZFRleHR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5Tm90aWZpY2F0aW9uKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpbXBvcnRTdHlsZWRTZWdtZW50cyhuZXdTZWdtZW50cywgdHh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xyXG5pbXBvcnQgeyBhZGRUYWcsIGZpbmRBbGwsIGdldEN1cnJlbnRMZXNzb24sIGdldFRhZ3MgfSBmcm9tICcuL3V0aWwnO1xyXG5mdW5jdGlvbiBmb3JtYXRPcmRlcihsZXNzb24pIHtcclxuICAgIGlmIChsZXNzb24uZmluZENoaWxkKChuKSA9PiAhIWdldFRhZ3MobikuZmluZCgodCkgPT4gL15vLS8udGVzdCh0KSkpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0ZvdW5kIG8tdGFnLiBmb3JtYXRPcmRlciBhYm9ydC4nKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgc2V0dGluZ3MgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzZXR0aW5ncycpKTtcclxuICAgIGFkZFRhZyhzZXR0aW5ncywgJ29yZGVyLWxheWVycycpO1xyXG4gICAgY29uc3QgbGF5ZXJSZWdleCA9IC9eKHMtbXVsdGlzdGVwLWJydXNoLXxzLW11bHRpc3RlcC1iZy0pKFxcZCspJC87XHJcbiAgICBjb25zdCBzdGVwcyA9IGxlc3Nvbi5maW5kQ2hpbGRyZW4oKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSAmJiAhZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xyXG4gICAgYWRkVGFnKHJlc3VsdCwgYG8tJHtzdGVwcy5sZW5ndGggKyAxfWApO1xyXG4gICAgc3RlcHMucmV2ZXJzZSgpLmZvckVhY2goKHN0ZXAsIG9yZGVyKSA9PiB7XHJcbiAgICAgICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xyXG4gICAgICAgIGNvbnN0IGxheWVyVGFnID0gdGFncy5maW5kKCh0KSA9PiBsYXllclJlZ2V4LnRlc3QodCkpO1xyXG4gICAgICAgIGxldCBsYXllciA9IDQ7XHJcbiAgICAgICAgaWYgKGxheWVyVGFnKSB7XHJcbiAgICAgICAgICAgIGxheWVyID0gcGFyc2VJbnQobGF5ZXJSZWdleC5leGVjKGxheWVyVGFnKVsyXSk7XHJcbiAgICAgICAgICAgIHRhZ3MgPSB0YWdzLmZpbHRlcigodCkgPT4gIWxheWVyUmVnZXgudGVzdCh0KSk7XHJcbiAgICAgICAgICAgIHRhZ3Muc3BsaWNlKDEsIDAsIC9eKHMtbXVsdGlzdGVwLWJydXNofHMtbXVsdGlzdGVwLWJnKS8uZXhlYyhsYXllclRhZylbMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGVwLnNldFBsdWdpbkRhdGEoJ2xheWVyJywgSlNPTi5zdHJpbmdpZnkobGF5ZXIpKTtcclxuICAgICAgICB0YWdzLnB1c2goYG8tJHtvcmRlciArIDF9YCk7XHJcbiAgICAgICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XHJcbiAgICB9KTtcclxuICAgIGxldCBzb3J0ZWRTdGVwcyA9IHN0ZXBzLnNvcnQoKGEsIGIpID0+IEpTT04ucGFyc2UoYi5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSAtXHJcbiAgICAgICAgSlNPTi5wYXJzZShhLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpKTtcclxuICAgIHNvcnRlZFN0ZXBzLmZvckVhY2goKHMpID0+IGxlc3Nvbi5pbnNlcnRDaGlsZCgxLCBzKSk7XHJcbn1cclxuZnVuY3Rpb24gYXV0b0Zvcm1hdCgpIHtcclxuICAgIGNvbnN0IHRodW1iUGFnZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gJ1RIVU1CTkFJTFMnKTtcclxuICAgIGlmICh0aHVtYlBhZ2UpIHtcclxuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSB0aHVtYlBhZ2UuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJykgfHwgIXRodW1ibmFpbEZyYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSB0aHVtYm5haWxGcmFtZS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBjbG9uZS5yZXNpemUoNDAwLCA0MDApO1xyXG4gICAgICAgICAgICBjbG9uZS5uYW1lID0gJ3RodW1ibmFpbCc7XHJcbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2xvbmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xyXG4gICAgICAgIGlmIChvbGRMZXNzb25GcmFtZSkge1xyXG4gICAgICAgICAgICBvbGRMZXNzb25GcmFtZS5uYW1lID0gJ2xlc3Nvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xyXG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ2xlc3NvbicpO1xyXG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XHJcbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueSA9IGxlc3NvbkZyYW1lLnk7XHJcbiAgICB9KTtcclxuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xyXG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XHJcbiAgICAgICAgbi54ID0gMTA7XHJcbiAgICAgICAgbi55ID0gMTA7XHJcbiAgICB9KTtcclxuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IG5vZGUudHlwZSA9PSAnVEVYVCcpLmZvckVhY2goKG4pID0+IHtcclxuICAgICAgICBhZGRUYWcobiwgJ25vLW1pcnJvcicpO1xyXG4gICAgfSk7XHJcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnN0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0Ly50ZXN0KG5vZGUubmFtZSkpLmZvckVhY2goKG4pID0+IHtcclxuICAgICAgICBuLmNoaWxkcmVuWzBdLm5hbWUgPSAndGVtcGxhdGUnO1xyXG4gICAgICAgIG4uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0ubmFtZSA9ICcvaWdub3JlJztcclxuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xyXG4gICAgICAgIG4ueCA9IDEwO1xyXG4gICAgICAgIG4ueSA9IDYwO1xyXG4gICAgfSk7XHJcbn1cclxub24oJ2F1dG9Gb3JtYXQnLCBhdXRvRm9ybWF0KTtcclxub24oJ2Zvcm1hdE9yZGVyJywgKCkgPT4gZm9ybWF0T3JkZXIoZ2V0Q3VycmVudExlc3NvbigpKSk7XHJcbiIsImltcG9ydCAnLi9jcmVhdGUnO1xyXG5pbXBvcnQgJy4vdHVuZSc7XHJcbmltcG9ydCAnLi9mb3JtYXQnO1xyXG5pbXBvcnQgJy4vbGludGVyJztcclxuaW1wb3J0ICcuL3B1Ymxpc2gnO1xyXG5pbXBvcnQgJy4uL3JwYy1hcGknO1xyXG5pbXBvcnQgeyBjdXJyZW50UGFnZUNoYW5nZWQsIHNlbGVjdGlvbkNoYW5nZWQsIHVwZGF0ZURpc3BsYXkgfSBmcm9tICcuL3R1bmUnO1xyXG5pbXBvcnQgeyBzZXRNZXRhVGFnc0Zyb21Ob2Rlc1RvU3RvcmUgfSBmcm9tIFwiLi9tZXRhXCI7XHJcbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XHJcbmZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ3MCk7XHJcbmNvbnNvbGUuY2xlYXIoKTtcclxuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcclxuICAgIHNlbGVjdGlvbkNoYW5nZWQoKTtcclxufSk7XHJcbmZpZ21hLm9uKCdjdXJyZW50cGFnZWNoYW5nZScsICgpID0+IHtcclxuICAgIGN1cnJlbnRQYWdlQ2hhbmdlZCgpO1xyXG4gICAgc2V0TWV0YVRhZ3NGcm9tTm9kZXNUb1N0b3JlKCk7XHJcbn0pO1xyXG5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIHVwZGF0ZURpc3BsYXkoeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSwgZmlnbWEuY3VycmVudFBhZ2UpO1xyXG59LCAxNTAwKTtcclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBnZXRUYWdzLCBmaW5kQWxsLCBmaW5kVGFnLCBkZXNjZW5kYW50cywgZ2V0Q3VycmVudExlc3NvbiwgZ2V0U3RlcE9yZGVyLCBmaW5kUGFyZW50QnlUYWcsIGlzUkdCVGVtcGxhdGUsIH0gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0IHsgdXBkYXRlRGlzcGxheSwgZGlzcGxheUFsbCwgZGVsZXRlVG1wIH0gZnJvbSAnLi90dW5lJztcclxubGV0IGVycm9ycyA9IFtdO1xyXG5sZXQgem9vbVNjYWxlID0gMTtcclxubGV0IG1heEJzID0gMTIuODtcclxubGV0IG9yZGVyID0gJ3N0ZXBzJztcclxuZXhwb3J0IHZhciBFcnJvckxldmVsO1xyXG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcclxuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIkVSUk9SXCJdID0gMF0gPSBcIkVSUk9SXCI7XHJcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJXQVJOXCJdID0gMV0gPSBcIldBUk5cIjtcclxuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xyXG59KShFcnJvckxldmVsIHx8IChFcnJvckxldmVsID0ge30pKTtcclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEVycm9yKGluZGV4KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBpZiAoKF9hID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhZ2UpIHtcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IGVycm9yc1tpbmRleF0ucGFnZTtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoKF9hID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5vZGUpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2luZGV4XS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbaW5kZXhdLm5vZGVdO1xyXG4gICAgICAgIH1cclxuICAgIH0sIDApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRFcnJvcnMoKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IHNhdmVkRXJyb3JzID0geWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnZXJyb3JzRm9yUHJpbnQnKTtcclxuICAgICAgICBsZXQgc29ydGVkRXJyb3JzID0gZXJyb3JzXHJcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBhLmxldmVsIC0gYi5sZXZlbClcclxuICAgICAgICAgICAgLm1hcCgoZSkgPT4ge1xyXG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcclxuICAgICAgICAgICAgY29uc3Qgc3RlcE51bWJlciA9IGdldFN0ZXBPcmRlcihmaW5kUGFyZW50QnlUYWcoZS5ub2RlLCAnc3RlcCcpKSB8fCBnZXRTdGVwT3JkZXIoZS5ub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGlnbm9yZTogZS5pZ25vcmUsXHJcbiAgICAgICAgICAgICAgICBwYWdlTmFtZTogKF9hID0gZS5wYWdlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSxcclxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAoX2IgPSBlLm5vZGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5uYW1lLFxyXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6IChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZS5lcnJvcixcclxuICAgICAgICAgICAgICAgIGxldmVsOiBlLmxldmVsLFxyXG4gICAgICAgICAgICAgICAgc3RlcE51bWJlcixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoc2F2ZWRFcnJvcnMpIHtcclxuICAgICAgICAgICAgc29ydGVkRXJyb3JzID0gc29ydGVkRXJyb3JzLm1hcCgoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWRFcnJvciA9IHNhdmVkRXJyb3JzLmZpbmQoKHMpID0+IHMucGFnZU5hbWUgPT09IGUucGFnZU5hbWUgJiZcclxuICAgICAgICAgICAgICAgICAgICBzLm5vZGVOYW1lID09PSBlLm5vZGVOYW1lICYmXHJcbiAgICAgICAgICAgICAgICAgICAgcy5lcnJvciA9PT0gZS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWRFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGUuaWdub3JlID0gc2F2ZWRFcnJvci5pZ25vcmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdEVycm9yKDApO1xyXG4gICAgICAgIHJldHVybiBzb3J0ZWRFcnJvcnM7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnQodmFsLCBlcnJvciwgcGFnZSwgbm9kZSwgbGV2ZWwgPSBFcnJvckxldmVsLkVSUk9SKSB7XHJcbiAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbDtcclxufVxyXG5mdW5jdGlvbiBkZWVwTm9kZXMobm9kZSkge1xyXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlZXBOb2RlcyhuKSk7XHJcbn1cclxuZnVuY3Rpb24gY291bnREaXNjb25uZWN0ZWRTZWdtZW50cyhub2RlKSB7XHJcbiAgICBpZiAoIW5vZGUudmVjdG9yTmV0d29yaylcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICBjb25zdCB7IHNlZ21lbnRzIH0gPSBub2RlLnZlY3Rvck5ldHdvcms7XHJcbiAgICBjb25zdCBzdGFydHMgPSBzZWdtZW50cy5tYXAoKHNlZ21lbnQpID0+IHNlZ21lbnQuc3RhcnQpO1xyXG4gICAgY29uc3QgZW5kcyA9IHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgPT4gc2VnbWVudC5lbmQpO1xyXG4gICAgY29uc3QgZGlzY29ubmVjdGVkU3RhcnRTZWdtZW50cyA9IHN0YXJ0cy5maWx0ZXIoKHN0YXJ0VmFsdWUpID0+ICFlbmRzLmluY2x1ZGVzKHN0YXJ0VmFsdWUpKTtcclxuICAgIGNvbnN0IGRpc2Nvbm5lY3RlZEVuZFNlZ21lbnRzID0gZW5kcy5maWx0ZXIoKGVuZFZhbHVlKSA9PiAhc3RhcnRzLmluY2x1ZGVzKGVuZFZhbHVlKSk7XHJcbiAgICBjb25zdCBkaXNjb25uZWN0ZWRTZWdtZW50c0NvdW50ID0gZGlzY29ubmVjdGVkU3RhcnRTZWdtZW50cy5sZW5ndGggKyBkaXNjb25uZWN0ZWRFbmRTZWdtZW50cy5sZW5ndGg7XHJcbiAgICByZXR1cm4gZGlzY29ubmVjdGVkU2VnbWVudHNDb3VudCA+IDI7XHJcbn1cclxuZnVuY3Rpb24gbGludEZpbGxzKG5vZGUsIHBhZ2UsIGZpbGxzKSB7XHJcbiAgICBjb25zdCByZ2J0ID0gaXNSR0JUZW1wbGF0ZShub2RlKTtcclxuICAgIGNvbnN0IGRyYXdMaW5lVGFnID0gZmluZFRhZyhub2RlLCAvXmRyYXctbGluZS8pO1xyXG4gICAgZmlsbHMuZm9yRWFjaCgoZikgPT4ge1xyXG4gICAgICAgIGFzc2VydChmLnZpc2libGUsICdGaWxsIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGFzc2VydChmLnR5cGUgPT0gJ1NPTElEJyB8fCAhcmdidCwgJ0ZpbGwgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGFzc2VydCghZHJhd0xpbmVUYWcgfHwgIXJnYnQsICdGaWxscyBjYW50IGJlIHVzZWQgd2l0aCBkcmF3LWxpbmUgdGFnJywgcGFnZSwgbm9kZSk7XHJcbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ0lNQUdFJykge1xyXG4gICAgICAgICAgICBhc3NlcnQoZi5vcGFjaXR5ID09IDEgfHwgIXJnYnQsICdJbWFnZSBmaWxsIG11c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBsaW50U3Ryb2tlcyhub2RlLCBwYWdlLCBzdHJva2VzKSB7XHJcbiAgICBjb25zdCByZ2J0ID0gaXNSR0JUZW1wbGF0ZShub2RlKTtcclxuICAgIGNvbnN0IGRyYXdMaW5lVGFnID0gZmluZFRhZyhub2RlLCAvXmRyYXctbGluZS8pO1xyXG4gICAgc3Ryb2tlcy5mb3JFYWNoKChzKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0KHMudmlzaWJsZSwgJ1N0cm9rZSBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgICAgICBhc3NlcnQocy50eXBlID09ICdTT0xJRCcgfHwgIXJnYnQsICdTdHJva2UgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGlmIChzLnR5cGUgPT09ICdJTUFHRScpIHtcclxuICAgICAgICAgICAgYXNzZXJ0KHMub3BhY2l0eSA9PSAxIHx8ICFyZ2J0LCAnSW1hZ2Ugc3Ryb2tlIG11c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgL1JPVU5EfE5PTkUvLnRlc3QoU3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKSkgfHwgIXJnYnQsIGBTdHJva2UgY2FwcyBtdXN0IGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VDYXApfSdgLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLnN0cm9rZUFsaWduID09ICdDRU5URVInIHx8ICFyZ2J0IHx8ICFzdHJva2VzLmxlbmd0aCwgYFN0cm9rZSBhbGlnbiBtdXN0IGJlICdDRU5URVInIGJ1dCBpcyAnJHtTdHJpbmcobm9kZS5zdHJva2VBbGlnbil9J2AsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gJ1JPVU5EJyB8fCAhcmdidCwgYFN0cm9rZSBqb2lucyBzaG91bGQgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUpvaW4pfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgYXNzZXJ0KCFkcmF3TGluZVRhZyB8fCAhY291bnREaXNjb25uZWN0ZWRTZWdtZW50cyhub2RlKSwgJ1NwbGl0IHZlY3RvciBvciBjaGFuZ2UgYW5pbWF0aW9uJywgcGFnZSwgbm9kZSk7XHJcbn1cclxuY29uc3QgdmFsaWRWZWN0b3JUYWdzID0gL15cXC98XmRyYXctbGluZSR8XmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyR8XmZsaXAkfF5bdlZdZWN0b3IkfF5cXGQrJHxeRWxsaXBzZSR8XlJlY3RhbmdsZSR8XmZseS1mcm9tLWJvdHRvbSR8XmZseS1mcm9tLWxlZnQkfF5mbHktZnJvbS1yaWdodCR8XmFwcGVhciR8XndpZ2dsZS1cXGQrJC87XHJcbmZ1bmN0aW9uIGxpbnRWZWN0b3IocGFnZSwgbm9kZSkge1xyXG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xyXG4gICAgY29uc3QgcmdidCA9IGlzUkdCVGVtcGxhdGUobm9kZSk7XHJcbiAgICBjb25zdCBhbmltID0gZmluZFRhZyhub2RlLCAvXmRyYXctbGluZSR8XmJsaW5rJC8pIHx8XHJcbiAgICAgICAgZmluZFBhcmVudEJ5VGFnKG5vZGUsICdkcmF3LWxpbmUnKSB8fFxyXG4gICAgICAgIGZpbmRQYXJlbnRCeVRhZyhub2RlLCAnYmxpbmsnKTtcclxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSB8fCAhcmdidCwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsICdOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS4nLCBwYWdlLCBub2RlKTtcclxuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0KHZhbGlkVmVjdG9yVGFncy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XHJcbiAgICB9KTtcclxuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XHJcbiAgICBsZXQgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcztcclxuICAgIGFzc2VydCghZmlsbHMubGVuZ3RoIHx8ICFzdHJva2VzLmxlbmd0aCB8fCAhcmdidCwgJ1Nob3VsZCBub3QgaGF2ZSBmaWxsK3N0cm9rZScsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICBsaW50U3Ryb2tlcyhub2RlLCBwYWdlLCBzdHJva2VzKTtcclxuICAgIGxpbnRGaWxscyhub2RlLCBwYWdlLCBmaWxscyk7XHJcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuRVJST1IpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cclxufVxyXG5jb25zdCB2YWxpZEdyb3VwVGFncyA9IC9eXFwvfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbHktZnJvbS1ib3R0b20kfF5mbHktZnJvbS1sZWZ0JHxeZmx5LWZyb20tcmlnaHQkfF5hcHBlYXIkfF53aWdnbGUtXFxkKyR8XmRyYXctbGluZSR8XlxcZCskfF5bZ0ddcm91cCQvO1xyXG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xyXG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xyXG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcclxuICAgICAgICBhc3NlcnQodmFsaWRHcm91cFRhZ3MudGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgcmdidCA9IGlzUkdCVGVtcGxhdGUobm9kZSk7XHJcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJC8udGVzdChzKSkgfHwgZmluZFBhcmVudEJ5VGFnKG5vZGUsICdibGluaycpO1xyXG4gICAgYXNzZXJ0KCEvQk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qobm9kZS50eXBlKSwgJ05vdGljZSBCT09MRUFOX09QRVJBVElPTicsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cclxufVxyXG5mdW5jdGlvbiBsaW50SW5wdXQocGFnZSwgbm9kZSkge1xyXG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdHUk9VUCcsIFwiTXVzdCBiZSAnR1JPVVAnIHR5cGUnXCIsIHBhZ2UsIG5vZGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydCgvXmlucHV0JHxeYmFja2dyb3VuZCQvLnRlc3Qobm9kZS5uYW1lKSwgXCJNdXN0IGJlICdpbnB1dCdcIiwgcGFnZSwgbm9kZSk7XHJcbiAgICBkZXNjZW5kYW50cyhub2RlKS5mb3JFYWNoKCh2KSA9PiB7XHJcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTnxGUkFNRS8udGVzdCh2LnR5cGUpKSB7XHJcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcclxuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdGUkFNRS9HUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5jb25zdCB2YWxpZFNldHRpbmdzVGFncyA9IC9eXFwvfF5zZXR0aW5ncyR8XmNhcHR1cmUtY29sb3IkfF56b29tLXNjYWxlLVxcZCskfF5vcmRlci1sYXllcnMkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxeYnJ1c2gtbmFtZS1cXHcrJHxec3MtXFxkKyR8XmJzLVxcZCskfF5tZXRhLWR1cmF0aW9uLVxcZCskfF5tZXRhLXR5cGUtXFx3KyQvO1xyXG5mdW5jdGlvbiBsaW50U2V0dGluZ3MocGFnZSwgbm9kZSkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSAnRUxMSVBTRScsIFwiTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdcIiwgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XHJcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgIGFzc2VydCh2YWxpZFNldHRpbmdzVGFncy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xyXG4gICAgICAgIG9yZGVyID0gJ2xheWVycyc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBvcmRlciA9ICdzdGVwcyc7XHJcbiAgICB9XHJcbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnem9vbS1zY2FsZS0nLCAnJykpIHx8XHJcbiAgICAgICAgJzEnKTtcclxuICAgIGFzc2VydCh6b29tU2NhbGUgPj0gMSAmJiB6b29tU2NhbGUgPD0gNSwgYE11c3QgYmUgMSA8PSB6b29tLXNjYWxlIDw9IDUgKCR7em9vbVNjYWxlfSlgLCBwYWdlLCBub2RlKTtcclxufVxyXG5jb25zdCB2YWxpZFN0ZXBUYWdzID0gL15cXC98XnN0ZXAkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLWNvbnRpbnVlJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XnMtbXVsdGlzdGVwLWJnJHxeYnJ1c2gtbmFtZS1cXHcrJHxeY2xlYXItbGF5ZXItKFxcZCssPykrJHxec3MtXFxkKyR8XmJzLVxcZCskfF5vLVxcZCskfF5hbGxvdy11bmRvJHxec2hhcmUtYnV0dG9uJHxeY2xlYXItYmVmb3JlJHxedG9vbC1waWNrZXItKHRydWV8ZmFsc2UpJHxeYnJ1c2gtY29sb3ItWzAtOWEtZkEtRl17OH0kLztcclxuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xyXG4gICAgdmFyIF9hLCBfYiwgX2M7XHJcbiAgICBpZiAoIWFzc2VydChzdGVwLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgc3RlcCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQoc3RlcC5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIHN0ZXApO1xyXG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xyXG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XHJcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgIGFzc2VydCh2YWxpZFN0ZXBUYWdzLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBzdGVwKTtcclxuICAgICAgICAvLyBhc3NlcnQoIS9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1iZyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyBpcyBvYnNvbGV0ZWAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGJnID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJnJHxecy1tdWx0aXN0ZXAtYmctXFxkKyQvLnRlc3QocykpO1xyXG4gICAgY29uc3QgYnJ1c2ggPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJC8udGVzdChzKSk7XHJcbiAgICBjb25zdCBzcyA9IHBhcnNlSW50KChfYSA9IHRhZ3MuZmluZCgocykgPT4gL15zcy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKCdzcy0nLCAnJykpO1xyXG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcclxuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoKF9iID0gdGFncy5maW5kKChzKSA9PiAvXmJzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoJ2JzLScsICcnKSk7XHJcbiAgICBjb25zdCBicnVzaE5hbWUgPSAoX2MgPSB0YWdzXHJcbiAgICAgICAgLmZpbmQoKHMpID0+IC9eYnJ1c2gtbmFtZS1cXHcrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZXBsYWNlKCdicnVzaC1uYW1lLScsICcnKTtcclxuICAgIGNvbnN0IHRlcm1pbmFsTm9kZXMgPSBkZXNjZW5kYW50cyhzdGVwKS5maWx0ZXIoKHYpID0+IHZbJ2NoaWxkcmVuJ10gPT0gdW5kZWZpbmVkKTtcclxuICAgIGNvbnN0IG1heFNpemUgPSB0ZXJtaW5hbE5vZGVzLnJlZHVjZSgoYWNjLCB2KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGFjYywgdi53aWR0aCwgdi5oZWlnaHQpO1xyXG4gICAgfSwgMCk7XHJcbiAgICBtYXhCcyA9IE1hdGgubWF4KGJzID8gYnMgOiBtYXhCcywgbWF4QnMpO1xyXG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCBtYXhTaXplIDw9IDEwMCwgYFNob3VsZCBub3QgdXNlIHNzPDIwIHdpdGggbG9uZyBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7bWF4U2l6ZX0+MTAwYCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMjAgfHwgdGVybWluYWxOb2Rlcy5sZW5ndGggPD0gOCwgYFNob3VsZCBub3QgdXNlIHNzPDIwIHdpdGggdG9vIG1hbnkgbGluZXMuIENvbnNpZGVyIHVzaW5nIGJnIHRlbXBsYXRlLiAke3Rlcm1pbmFsTm9kZXMubGVuZ3RofT44YCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gMTAgfHwgYnJ1c2hOYW1lID09ICdwZW5jaWwnLCBgU2hvdWxkIG5vdCB1c2UgYnM8MTAuICR7YnN9PDEwYCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsICdzcyBtdXN0IGJlID49IDE1JywgcGFnZSwgc3RlcCk7XHJcbiAgICBhc3NlcnQoIXNzIHx8ICFicyB8fCBzcyA+IGJzLCAnc3MgbXVzdCBiZSA+IGJzJywgcGFnZSwgc3RlcCk7XHJcbiAgICBhc3NlcnQoIWJzIHx8IGJzIDw9IHpvb21TY2FsZSAqIDEyLjgsIGBicyBtdXN0IGJlIDw9ICR7em9vbVNjYWxlICogMTIuOH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xyXG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcclxuICAgIGFzc2VydCghbyB8fCBvcmRlciA9PSAnbGF5ZXJzJywgYCR7b30gbXVzdCBiZSB1c2VkIG9ubHkgd2l0aCBzZXR0aW5ncyBvcmRlci1sYXllcnNgLCBwYWdlLCBzdGVwKTtcclxuICAgIGFzc2VydChvcmRlciAhPT0gJ2xheWVycycgfHwgISFvLCAnTXVzdCBoYXZlIG8tTiBvcmRlciBudW1iZXInLCBwYWdlLCBzdGVwKTtcclxuICAgIGNvbnN0IHNmID0gc3RlcC5maW5kT25lKChuKSA9PiB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHJldHVybiAoZ2V0VGFncyhuKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykgfHxcclxuICAgICAgICAgICAgZmluZFBhcmVudEJ5VGFnKG4sICdyZ2ItdGVtcGxhdGUnKSkgJiZcclxuICAgICAgICAgICAgKChfYSA9IG4uc3Ryb2tlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBmZnMgPSBzdGVwLmZpbmRBbGwoKG4pID0+IChnZXRUYWdzKG4pLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSB8fFxyXG4gICAgICAgIGZpbmRQYXJlbnRCeVRhZyhuLCAncmdiLXRlbXBsYXRlJykpICYmXHJcbiAgICAgICAgbi5maWxscyAmJlxyXG4gICAgICAgIG4uZmlsbHNbMF0pO1xyXG4gICAgY29uc3QgYmlnRmZzID0gZmZzLmZpbHRlcigobikgPT4gbi53aWR0aCA+IDI3IHx8IG4uaGVpZ2h0ID4gMjcpO1xyXG4gICAgY29uc3QgZmYgPSBmZnMubGVuZ3RoID4gMDtcclxuICAgIGFzc2VydCghKGJnICYmIHNzICYmIHNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2UgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgIXNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2Ugbm90IHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5XQVJOKTtcclxuICAgIGFzc2VydCghYmcgfHwgZmYsIFwiYmcgc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRob3V0IGZpbGxlZC1pbiB2ZWN0b3JzXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQoIWJydXNoIHx8IGJpZ0Zmcy5sZW5ndGggPT0gMCwgXCJicnVzaCBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGggZmlsbGVkLWluIHZlY3RvcnMgKHNpemUgPiAyNylcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIHN0ZXAuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xyXG4gICAgICAgIGlmICgvXmlucHV0JHxeYmFja2dyb3VuZCQvLnRlc3Qobi5uYW1lKSkge1xyXG4gICAgICAgICAgICBsaW50SW5wdXQocGFnZSwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG4ubmFtZSA9PT0gJ3RlbXBsYXRlJykge1xyXG4gICAgICAgICAgICAvLyBsaW50IHRlbXBsYXRlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnaW5wdXQnLCAnYmFja2dyb3VuZCcgb3IgJ3RlbXBsYXRlJ1wiLCBwYWdlLCBuKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGJsaW5rTm9kZXMgPSBmaW5kQWxsKHN0ZXAsIChuKSA9PiBnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eYmxpbmskLy50ZXN0KHQpKSAhPT0gdW5kZWZpbmVkKS5mbGF0TWFwKGRlZXBOb2Rlcyk7XHJcbiAgICBjb25zdCBmaWxsZWROb2RlID0gYmxpbmtOb2Rlcy5maW5kKChuKSA9PiBuLmZpbGxzWzBdKTtcclxuICAgIGFzc2VydChibGlua05vZGVzLmxlbmd0aCA9PSAwIHx8ICEhZmlsbGVkTm9kZSB8fCBibGlua05vZGVzLmxlbmd0aCA+IDMsICdTaG91bGQgdXNlIGRyYXctbGluZSBpZiA8IDQgbGluZXMnLCBwYWdlLCBibGlua05vZGVzWzBdLCBFcnJvckxldmVsLklORk8pO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSkge1xyXG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gMTM2NiAmJiBub2RlLmhlaWdodCA9PSAxMDI0LCAnTXVzdCBiZSAxMzY2eDEwMjQnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydCghIW5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpLCBcIk11c3QgaGF2ZSAncy1tdWx0aXN0ZXAtcmVzdWx0JyBjaGlsZFwiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xyXG4gICAgbGV0IHNldHRpbmdzID0gbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSk7XHJcbiAgICBpZiAoc2V0dGluZ3MpIHtcclxuICAgICAgICBsaW50U2V0dGluZ3MocGFnZSwgc2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xyXG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XHJcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZm91bmQgPSAvXm8tKFxcZCspJC8uZXhlYyh0YWcpO1xyXG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbyA9IGZvdW5kWzFdO1xyXG4gICAgICAgICAgICBhc3NlcnQoIW9yZGVyTnVtYmVyc1tvXSwgYE11c3QgaGF2ZSB1bmlxdWUgJHt0YWd9IHZhbHVlc2AsIHBhZ2UsIHN0ZXApO1xyXG4gICAgICAgICAgICBpZiAobykge1xyXG4gICAgICAgICAgICAgICAgb3JkZXJOdW1iZXJzW29dID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgaWYgKHN0ZXAubmFtZS5zdGFydHNXaXRoKCdzdGVwJykpIHtcclxuICAgICAgICAgICAgbGludFN0ZXAocGFnZSwgc3RlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCFzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSkge1xyXG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnc2V0dGluZ3MnIG9yICdzdGVwJ1wiLCBwYWdlLCBzdGVwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBhc3NlcnQoXHJcbiAgICAvLyAgIG1heEJzID4gKHpvb21TY2FsZSAtIDEpICogMTIuOCxcclxuICAgIC8vICAgYHpvb20tc2NhbGUgJHt6b29tU2NhbGV9IG11c3QgYmUgJHtNYXRoLmNlaWwoXHJcbiAgICAvLyAgICAgbWF4QnMgLyAxMi44XHJcbiAgICAvLyAgICl9IGZvciBtYXggYnMgJHttYXhCc30gdXNlZGAsXHJcbiAgICAvLyAgIHBhZ2UsXHJcbiAgICAvLyAgIG5vZGVcclxuICAgIC8vIClcclxufVxyXG5mdW5jdGlvbiBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpIHtcclxuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnRlJBTUUnLCBcIk11c3QgYmUgJ0ZSQU1FJyB0eXBlXCIsIHBhZ2UsIG5vZGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLndpZHRoID09IDQwMCAmJiBub2RlLmhlaWdodCA9PSA0MDAsICdNdXN0IGJlIDQwMHg0MDAnLCBwYWdlLCBub2RlKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbGludFBhZ2UoY3VycmVudFBhZ2UsIGFwcGVuZEVycm9ycykge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBpZiAoIWFwcGVuZEVycm9ycykge1xyXG4gICAgICAgICAgICBlcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgICAgICAgICB5aWVsZCBkZWxldGVUbXAoKTtcclxuICAgICAgICAgICAgaWYgKGxlc3Nvbikge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheUFsbChsZXNzb24sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhZ2UgPSBjdXJyZW50UGFnZSA/IGN1cnJlbnRQYWdlIDogZmlnbWEuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgaWYgKC9eXFwvfF5JTkRFWCQvLnRlc3QocGFnZS5uYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwZGF0ZURpc3BsYXkoeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSwgcGFnZSk7XHJcbiAgICAgICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFxcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xyXG4gICAgICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL15sZXNzb24kLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ2xlc3NvbidcIiwgcGFnZSk7XHJcbiAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBwYWdlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLm5hbWUgPT0gJ2xlc3NvbicpIHtcclxuICAgICAgICAgICAgICAgIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09ICd0aHVtYm5haWwnKSB7XHJcbiAgICAgICAgICAgICAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KC9eXFwvLy50ZXN0KG5vZGUubmFtZSksIFwiTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZvcm1hdEVycm9ycygpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gbGludEluZGV4KHBhZ2UpIHtcclxuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsICdJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudCcsIHBhZ2UpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcclxuICAgIGxpbnRUaHVtYm5haWwocGFnZSwgcGFnZS5jaGlsZHJlblswXSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGxpbnRDb3Vyc2UoKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGVycm9ycyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgICAgICBpZiAobGVzc29uKSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlBbGwobGVzc29uLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXNzZXJ0KC9eQ09VUlNFLVthLXpcXC0wLTldKyQvLnRlc3QoZmlnbWEucm9vdC5uYW1lKSwgYENvdXJzZSBuYW1lICcke2ZpZ21hLnJvb3QubmFtZX0nIG11c3QgbWF0Y2ggQ09VUlNFLVthLXpcXFxcLTAtOV0rYCk7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZSA9PSAnSU5ERVgnKTtcclxuICAgICAgICBpZiAoYXNzZXJ0KCEhaW5kZXgsIFwiTXVzdCBoYXZlICdJTkRFWCcgcGFnZVwiKSkge1xyXG4gICAgICAgICAgICBsaW50SW5kZXgoaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmaW5kIGFsbCBub24tdW5pcXVlIG5hbWVkIHBhZ2VzXHJcbiAgICAgICAgY29uc3Qgbm9uVW5pcXVlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maWx0ZXIoKHAsIGksIGEpID0+IGEuZmluZEluZGV4KChwMikgPT4gcDIubmFtZSA9PSBwLm5hbWUpICE9IGkpO1xyXG4gICAgICAgIG5vblVuaXF1ZS5mb3JFYWNoKChwKSA9PiBhc3NlcnQoZmFsc2UsIGBQYWdlIG5hbWUgJyR7cC5uYW1lfScgbXVzdCBiZSB1bmlxdWVgLCBwKSk7XHJcbiAgICAgICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIGxpbnRQYWdlKHBhZ2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZm9ybWF0RXJyb3JzKCk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2F2ZUVycm9ycyhlcnJvcnNGb3JQcmludCkge1xyXG4gICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ2Vycm9yc0ZvclByaW50JywgZXJyb3JzRm9yUHJpbnQpO1xyXG59XHJcbiIsImltcG9ydCB7IGZpbmRDaGlsZHJlbkJ5VGFnLCBnZXRDdXJyZW50TGVzc29uLCBnZXRUYWdzIH0gZnJvbSBcIi4vdXRpbFwiO1xyXG5pbXBvcnQgeyB1aUFwaSB9IGZyb20gXCIuLi9ycGMtYXBpXCI7XHJcbmV4cG9ydCBjb25zdCBnZXRTZXR0aW5nc05vZGUgPSAobGVzc29uKSA9PiB7XHJcbiAgICBsZXQgb2JqZWN0VG9TZWFyY2ggPSBsZXNzb247XHJcbiAgICBpZiAoIW9iamVjdFRvU2VhcmNoKSB7XHJcbiAgICAgICAgb2JqZWN0VG9TZWFyY2ggPSBnZXRDdXJyZW50TGVzc29uKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmluZENoaWxkcmVuQnlUYWcob2JqZWN0VG9TZWFyY2gsIFwic2V0dGluZ3NcIilbMF07XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzZXRNZXRhVGFncyA9IChtZXRhUHJvcHMpID0+IHtcclxuICAgIGNvbnN0IHNldHRpbmdzID0gZ2V0U2V0dGluZ3NOb2RlKCk7XHJcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Moc2V0dGluZ3MpLmZpbHRlcih0YWcgPT4gIXRhZy5zdGFydHNXaXRoKCdtZXRhLScpKTtcclxuICAgIGlmIChtZXRhUHJvcHMudHlwZS5zdGFydHNXaXRoKFwibWV0YS1cIikpXHJcbiAgICAgICAgdGFncy5wdXNoKGAke21ldGFQcm9wcy50eXBlfWApO1xyXG4gICAgaWYgKG1ldGFQcm9wcy5kdXJhdGlvbiAmJiBtZXRhUHJvcHMuZHVyYXRpb24gIT09IFwiMFwiKVxyXG4gICAgICAgIHRhZ3MucHVzaChgbWV0YS1kdXJhdGlvbi0ke21ldGFQcm9wcy5kdXJhdGlvbn1gKTtcclxuICAgIHNldHRpbmdzLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGdldE1ldGFUYWdzID0gKGxlc3NvbikgPT4ge1xyXG4gICAgY29uc3Qgc2V0dGluZ3MgPSBnZXRTZXR0aW5nc05vZGUobGVzc29uKTtcclxuICAgIGxldCBtZXRhVGFncyA9IGdldFRhZ3Moc2V0dGluZ3MpLmZpbHRlcih0YWcgPT4gdGFnLnN0YXJ0c1dpdGgoJ21ldGEtJykpO1xyXG4gICAgbGV0IG1ldGFPYmplY3QgPSB7fTtcclxuICAgIG1ldGFUYWdzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGlmIChlbC5zdGFydHNXaXRoKFwibWV0YS1kdXJhdGlvbi1cIikpIHtcclxuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBlbC5yZXBsYWNlKFwibWV0YS1kdXJhdGlvbi1cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIG1ldGFPYmplY3QgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG1ldGFPYmplY3QpLCB7IGR1cmF0aW9uOiBwYXJzZUludChkdXJhdGlvbikgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbC5zdGFydHNXaXRoKFwibWV0YS10eXBlLVwiKSkge1xyXG4gICAgICAgICAgICBtZXRhT2JqZWN0ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBtZXRhT2JqZWN0KSwgeyB0eXBlOiBlbCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBtZXRhT2JqZWN0O1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2V0TWV0YVRhZ3NGcm9tTm9kZXNUb1N0b3JlID0gKCkgPT4ge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgY29uc3QgbWV0YVRhZ3MgPSBnZXRNZXRhVGFncyhsZXNzb24pO1xyXG4gICAgY29uc3QgcHJvcHMgPSB7XHJcbiAgICAgICAgdHlwZTogbWV0YVRhZ3MudHlwZSB8fCBcIlwiLFxyXG4gICAgICAgIGR1cmF0aW9uOiAoKF9hID0gbWV0YVRhZ3MuZHVyYXRpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b1N0cmluZygpKSB8fCBcIlwiXHJcbiAgICB9O1xyXG4gICAgdWlBcGkuc2V0TWV0YVByb3BzKHByb3BzKTtcclxufTtcclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IGNhcGl0YWxpemUsIGZpbmRBbGwsIHByaW50IH0gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0IHsgZ2V0TWV0YVRhZ3MgfSBmcm9tICcuL21ldGEnO1xyXG5mdW5jdGlvbiBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKSB7XHJcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XHJcbiAgICBsZXQgdGFza3MgPSAnJztcclxuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xyXG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXNrcyArPSBgXCJ0YXNrLW5hbWUgJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKHBhZ2UubmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XFxuYDtcclxuICAgIH1cclxuICAgIHJldHVybiBgXHJcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XHJcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XHJcbiAgICDigKIgXHJcbiAgICDigKIgXHJcbiAgICDigKIgXCI7XHJcbiR7dGFza3N9XHJcbmA7XHJcbn1cclxuZnVuY3Rpb24gcHJlcGFyZUNvdXJzZUZvclB1Ymxpc2hpbmcoKSB7XHJcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiBub2RlLm5hbWUuc3RhcnRzV2l0aCgndG1wLScpKS5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gISFub2RlKS5mb3JFYWNoKChub2RlKSA9PiB7XHJcbiAgICAgICAgaWYgKCd2aXNpYmxlJyBpbiBub2RlKSB7XHJcbiAgICAgICAgICAgIG5vZGUudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydExlc3NvbihwYWdlLCBvdXRsaW5lVGV4dCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBpZiAoIXBhZ2UpIHtcclxuICAgICAgICAgICAgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcclxuICAgICAgICBjb25zdCBsZXNzb25Ob2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ2xlc3NvbicpO1xyXG4gICAgICAgIGNvbnN0IHRodW1ibmFpbE5vZGUgPSBwYWdlLmNoaWxkcmVuLmZpbmQoKGYpID0+IGYubmFtZSA9PSAndGh1bWJuYWlsJyk7XHJcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xyXG4gICAgICAgICAgICBmb3JtYXQ6ICdTVkcnLFxyXG4gICAgICAgICAgICBzdmdPdXRsaW5lVGV4dDogb3V0bGluZVRleHQsXHJcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHRodW1ibmFpbCA9IHlpZWxkIHRodW1ibmFpbE5vZGUuZXhwb3J0QXN5bmMoe1xyXG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxyXG4gICAgICAgICAgICBjb25zdHJhaW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBtZXRhID0gZ2V0TWV0YVRhZ3MobGVzc29uTm9kZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ01FVEEgVEFHUyBGT1IgTEVTU09OJywgbWV0YSk7XHJcbiAgICAgICAgY29uc3QgbGVzc29uT2JqZWN0ID0gT2JqZWN0LmFzc2lnbih7IGNvdXJzZVBhdGg6IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKCdDT1VSU0UtJywgJycpLCBwYXRoOiBwYWdlLm5hbWUsIGZpbGUsXHJcbiAgICAgICAgICAgIHRodW1ibmFpbCxcclxuICAgICAgICAgICAgaW5kZXggfSwgbWV0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xFU1NPTiBPQkpFQ1QnLCBsZXNzb25PYmplY3QpO1xyXG4gICAgICAgIHJldHVybiBsZXNzb25PYmplY3Q7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKG91dGxpbmVUZXh0KSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHByZXBhcmVDb3Vyc2VGb3JQdWJsaXNoaW5nKCk7XHJcbiAgICAgICAgY29uc3QgW2xlc3NvbnMsIHRodW1ibmFpbF0gPSB5aWVsZCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKGZpZ21hLnJvb3QuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgocGFnZSkgPT4gZXhwb3J0TGVzc29uKHBhZ2UsIG91dGxpbmVUZXh0KSkpLFxyXG4gICAgICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICAuZmluZCgocGFnZSkgPT4gcGFnZS5uYW1lID09ICdJTkRFWCcpXHJcbiAgICAgICAgICAgICAgICAuZXhwb3J0QXN5bmMoe1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnUE5HJyxcclxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICBdKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcclxuICAgICAgICAgICAgbGVzc29ucyxcclxuICAgICAgICAgICAgdGh1bWJuYWlsLFxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZVN3aWZ0Q29kZSgpIHtcclxuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcclxuICAgIGxldCBzd2lmdENvdXJzZU5hbWUgPSBjb3Vyc2VOYW1lXHJcbiAgICAgICAgLnNwbGl0KCctJylcclxuICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSlcclxuICAgICAgICAuam9pbignJyk7XHJcbiAgICBzd2lmdENvdXJzZU5hbWUgPVxyXG4gICAgICAgIHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcclxuICAgIGxldCB0YXNrcyA9ICcnO1xyXG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhc2tzICs9IGBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiwgcHJvOiB0cnVlKSxcXG5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGBcclxuICAgIGxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXHJcbiAgICBwYXRoOiBcIiR7Y291cnNlTmFtZX1cIixcclxuICAgIGF1dGhvcjogUkVQTEFDRSxcclxuICAgIHRhc2tzOiBbXHJcbiR7dGFza3N9ICAgIF0pXHJcbmA7XHJcbn1cclxuZnVuY3Rpb24gZ2VuZXJhdGVDb2RlKCkge1xyXG4gICAgY29uc3QgY29kZSA9IGdlbmVyYXRlU3dpZnRDb2RlKCkgKyBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKTtcclxuICAgIHByaW50KGNvZGUpO1xyXG59XHJcbm9uKCdnZW5lcmF0ZUNvZGUnLCBnZW5lcmF0ZUNvZGUpO1xyXG4iLCJpbXBvcnQgeyBnZXRMYXN0U3RlcE9yZGVyIH0gZnJvbSAnLi9jcmVhdGUnO1xyXG5pbXBvcnQgeyBnZXRUYWdzLCBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uLCBzZXRTdGVwT3JkZXIgfSBmcm9tICcuL3V0aWwnO1xyXG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XHJcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xyXG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xyXG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcclxuICAgIHJldHVybiBsZXNzb24uY2hpbGRyZW5cclxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICByZXR1cm4gZ2V0T3JkZXIoYSkgLSBnZXRPcmRlcihiKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldFBhaW50Q29sb3IocGFpbnQpIHtcclxuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XHJcbiAgICAgICAgbGV0IHsgciwgZywgYiB9ID0gcGFpbnQuY29sb3I7XHJcbiAgICAgICAgciA9IE1hdGgucm91bmQociAqIDI1NSk7XHJcbiAgICAgICAgZyA9IE1hdGgucm91bmQoZyAqIDI1NSk7XHJcbiAgICAgICAgYiA9IE1hdGgucm91bmQoYiAqIDI1NSk7XHJcbiAgICAgICAgcmV0dXJuIHsgciwgZywgYiwgYTogMSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcjogMTY2LCBnOiAxNjYsIGI6IDE2NiwgYTogMSB9O1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGRpc3BsYXlDb2xvcih7IHIsIGcsIGIsIGEgfSkge1xyXG4gICAgcmV0dXJuIGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sICR7YX0pYDtcclxufVxyXG5mdW5jdGlvbiBnZXRDb2xvcnMobm9kZSkge1xyXG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwIH07IC8vIHRyYW5zcGFyZW50ID0gZGVmYXVsdCBjb2xvclxyXG4gICAgbGV0IGZpbGxzID0gZGVmYXVsdENvbG9yO1xyXG4gICAgbGV0IHN0cm9rZXMgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICBjb25zdCBsZWFmID0gZmluZExlYWZOb2Rlcyhub2RlKVswXTtcclxuICAgIGlmICgnZmlsbHMnIGluIGxlYWYgJiYgbGVhZi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbGVhZi5maWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZmlsbHMgPSBnZXRQYWludENvbG9yKGxlYWYuZmlsbHNbMF0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCdzdHJva2VzJyBpbiBsZWFmICYmIGxlYWYuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc3Ryb2tlcyA9IGdldFBhaW50Q29sb3IobGVhZi5zdHJva2VzWzBdKTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZmlsbHNDb2xvcjogZGlzcGxheUNvbG9yKGZpbGxzKSxcclxuICAgICAgICBzdHJva2VzQ29sb3I6IGRpc3BsYXlDb2xvcihzdHJva2VzKSxcclxuICAgIH07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBzKCkge1xyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgcmV0dXJuIHN0ZXBzQnlPcmRlcihsZXNzb24pLm1hcCgoc3RlcCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiBzdGVwLmlkLFxyXG4gICAgICAgICAgICBuYW1lOiBzdGVwLm5hbWUsXHJcbiAgICAgICAgICAgIGNvbG9yczogZ2V0Q29sb3JzKHN0ZXApLFxyXG4gICAgICAgICAgICBsYXllck51bWJlcjogbGVzc29uLmNoaWxkcmVuLmluZGV4T2Yoc3RlcCkgKyAxLFxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcHNPcmRlcihzdGVwcykge1xyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgc3RlcHMuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHMgPSBsZXNzb24uZmluZE9uZSgoZWwpID0+IGVsLmlkID09IHN0ZXAuaWQpO1xyXG4gICAgICAgIGlmIChzKSB7XHJcbiAgICAgICAgICAgIHNldFN0ZXBPcmRlcihzLCBpICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRhZ1Vub3JkZXJlZFN0ZXBzKCkge1xyXG4gICAgbGV0IHN0YXJ0V2l0aCA9IGdldExhc3RTdGVwT3JkZXIoKSArIDE7XHJcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XHJcbiAgICBzdGVwc0J5T3JkZXIobGVzc29uKVxyXG4gICAgICAgIC5maWx0ZXIoKHMpID0+ICFnZXRUYWdzKHMpLnNvbWUoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkpXHJcbiAgICAgICAgLmZvckVhY2goKHN0ZXAsIGkpID0+IHNldFN0ZXBPcmRlcihzdGVwLCBpICsgc3RhcnRXaXRoKSk7XHJcbn1cclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBmaW5kTGVhZk5vZGVzLCBmaW5kUGFyZW50QnlUYWcsIGdldEN1cnJlbnRMZXNzb24sIGdldFBhcmFtVmFsdWUsIGdldFN0ZXBPcmRlciwgZ2V0VGFncywgaXNSZXN1bHRTdGVwLCBmaW5kTmV4dEJydXNoU3RlcCwgZmluZExlc3Nvbkdyb3VwLCB9IGZyb20gJy4vdXRpbCc7XHJcbmltcG9ydCB7IHVpQXBpIH0gZnJvbSAnLi4vcnBjLWFwaSc7XHJcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcclxuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XHJcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XHJcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcclxufVxyXG5mdW5jdGlvbiBnZXRUYWcoc3RlcCwgdGFnKSB7XHJcbiAgICBjb25zdCB2ID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgodGFnKSk7XHJcbiAgICByZXR1cm4gdiA/IHYucmVwbGFjZSh0YWcsICcnKSA6IG51bGw7XHJcbn1cclxuZnVuY3Rpb24gc3RlcHNCeU9yZGVyKGxlc3Nvbikge1xyXG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxyXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcclxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gc2hvd09ubHlSR0JUZW1wbGF0ZShub2RlKSB7XHJcbiAgICBpZiAoZ2V0VGFncyhub2RlKS5pbmNsdWRlcygnc2V0dGluZ3MnKSkge1xyXG4gICAgICAgIG5vZGUudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChnZXRUYWdzKG5vZGUpLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSAmJlxyXG4gICAgICAgIC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCh2KSA9PiB7XHJcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdCh2LnR5cGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzaG93T25seVJHQlRlbXBsYXRlKHYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkgJiZcclxuICAgICAgICAgICAgIWdldFRhZ3ModikuaW5jbHVkZXMoJ3JnYi10ZW1wbGF0ZScpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodi52aXNpYmxlID0gZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmxldCBsYXN0TW9kZSA9ICdhbGwnO1xyXG5sZXQgbGFzdFBhZ2UgPSBudWxsO1xyXG5sZXQgbGFzdFN0ZXBOdW1iZXIgPSAxO1xyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlVG1wKHBhZ2UpIHtcclxuICAgIGNvbnN0IHAgPSBwYWdlIHx8IGZpZ21hLmN1cnJlbnRQYWdlO1xyXG4gICAgcC5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XHJcbn1cclxuZnVuY3Rpb24gZGlzcGxheUFsbEVsZW1lbnRzKGxlc3Nvbikge1xyXG4gICAgY29uc3QgbCA9IGxlc3NvbiB8fCBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgIGwuZmluZEFsbCgoZWwpID0+IChlbC52aXNpYmxlID0gdHJ1ZSkpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5QWxsKGxlc3Nvbiwgc2V0TGFzdE1vZGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRMZXNzb24gPSBsZXNzb24gfHwgZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgZGVsZXRlVG1wKCk7XHJcbiAgICBjdXJyZW50TGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcclxuICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoc2V0TGFzdE1vZGUpIHtcclxuICAgICAgICBsYXN0TW9kZSA9ICdhbGwnO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcclxuICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XHJcbiAgICAgICAgc3RlcC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGlucHV0ID0gc3RlcC5maW5kQ2hpbGQoKGcpID0+IGcubmFtZSA9PSAnaW5wdXQnKTtcclxuICAgIGlmICghaW5wdXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgdGVtcGxhdGUgPSBpbnB1dC5jbG9uZSgpO1xyXG4gICAgdGVtcGxhdGUubmFtZSA9ICd0bXAtdGVtcGxhdGUnO1xyXG4gICAgdGVtcGxhdGVcclxuICAgICAgICAuZmluZEFsbCgoZWwpID0+IGdldFRhZ3MoZWwpLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSlcclxuICAgICAgICAubWFwKChlbCkgPT4gZmluZExlYWZOb2RlcyhlbCkpXHJcbiAgICAgICAgLmZsYXQoKVxyXG4gICAgICAgIC5maWx0ZXIoKGVsKSA9PiAvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZWwudHlwZSkpXHJcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFdlaWdodCA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDMwIDogNTA7XHJcbiAgICAgICAgY29uc3Qgc3MgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCBkZWZhdWx0V2VpZ2h0O1xyXG4gICAgICAgIGlmIChlbC5zdHJva2VzLmxlbmd0aCA+IDAgJiYgZWwuZmlsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBncmVlbiA9IGVsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGdyZWVuLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAxLCBiOiAwIH0gfV07XHJcbiAgICAgICAgICAgIGdyZWVuLnN0cm9rZVdlaWdodCArPSBzcztcclxuICAgICAgICAgICAgZ3JlZW4ubmFtZSA9ICdyZ2ItdGVtcGxhdGUgZ3JlZW4gJyArIGVsLm5hbWU7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKGdyZWVuKTtcclxuICAgICAgICAgICAgZ3JlZW4ucmVsYXRpdmVUcmFuc2Zvcm0gPSBlbC5yZWxhdGl2ZVRyYW5zZm9ybTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCAmJiAhZWwuZmlsbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdyZWVuID0gZWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgZ3JlZW4uc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDEsIGI6IDAgfSB9XTtcclxuICAgICAgICAgICAgZ3JlZW4uc3Ryb2tlV2VpZ2h0ID0gc3MgKiAxLjE7XHJcbiAgICAgICAgICAgIGdyZWVuLm5hbWUgPSAncmdiLXRlbXBsYXRlIGdyZWVuICcgKyBlbC5uYW1lO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChncmVlbik7XHJcbiAgICAgICAgICAgIGdyZWVuLnJlbGF0aXZlVHJhbnNmb3JtID0gZWwucmVsYXRpdmVUcmFuc2Zvcm07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwICYmICFlbC5zdHJva2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBncmVlbiA9IGVsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGdyZWVuLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAxLCBiOiAwIH0gfV07XHJcbiAgICAgICAgICAgIGdyZWVuLnN0cm9rZVdlaWdodCA9IHNzO1xyXG4gICAgICAgICAgICBncmVlbi5uYW1lID0gJ3JnYi10ZW1wbGF0ZSBncmVlbiAnICsgZWwubmFtZTtcclxuICAgICAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQoZ3JlZW4pO1xyXG4gICAgICAgICAgICBncmVlbi5yZWxhdGl2ZVRyYW5zZm9ybSA9IGVsLnJlbGF0aXZlVHJhbnNmb3JtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJsdWUgPSBlbC5jbG9uZSgpO1xyXG4gICAgICAgICAgICBibHVlLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLCBiOiAxIH0gfV07XHJcbiAgICAgICAgICAgIGJsdWUuc3Ryb2tlV2VpZ2h0ID0gc3M7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKGJsdWUpO1xyXG4gICAgICAgICAgICBibHVlLnJlbGF0aXZlVHJhbnNmb3JtID0gZWwucmVsYXRpdmVUcmFuc2Zvcm07XHJcbiAgICAgICAgICAgIGNvbnN0IHBpbmsgPSBlbC5jbG9uZSgpO1xyXG4gICAgICAgICAgICBwaW5rLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAwLCBiOiAxIH0gfV07XHJcbiAgICAgICAgICAgIHBpbmsuc3Ryb2tlV2VpZ2h0ID0gMjtcclxuICAgICAgICAgICAgcGluay5uYW1lID0gJ3JnYi10ZW1wbGF0ZSBwaW5rICcgKyBlbC5uYW1lO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChwaW5rKTtcclxuICAgICAgICAgICAgcGluay5yZWxhdGl2ZVRyYW5zZm9ybSA9IGVsLnJlbGF0aXZlVHJhbnNmb3JtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuZmlsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxsc0JsdWUgPSBlbC5jbG9uZSgpO1xyXG4gICAgICAgICAgICBmaWxsc0JsdWUuZmlsbHMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLCBiOiAxIH0gfV07XHJcbiAgICAgICAgICAgIGZpbGxzQmx1ZS5uYW1lID0gJ3JnYi10ZW1wbGF0ZSBibHVlICcgKyBlbC5uYW1lO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChmaWxsc0JsdWUpO1xyXG4gICAgICAgICAgICBmaWxsc0JsdWUucmVsYXRpdmVUcmFuc2Zvcm0gPSBlbC5yZWxhdGl2ZVRyYW5zZm9ybTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHNob3dPbmx5UkdCVGVtcGxhdGUodGVtcGxhdGUpO1xyXG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcclxuICAgIHRlbXBsYXRlLnJlbGF0aXZlVHJhbnNmb3JtID0gaW5wdXQucmVsYXRpdmVUcmFuc2Zvcm07XHJcbiAgICBjb25zdCB0ZW1wbGF0ZUdyb3VwID0gc3RlcC5maW5kQ2hpbGQoKGcpID0+IGdldFRhZ3MoZykuaW5jbHVkZXMoJ3RlbXBsYXRlJykpO1xyXG4gICAgaWYgKHRlbXBsYXRlR3JvdXApIHtcclxuICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGlucHV0LnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0ZW1wbGF0ZUdyb3VwLnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKSB7XHJcbiAgICBjb25zdCBkZWZhdWx0QlMgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAxMi44IDogMTA7XHJcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IGRlZmF1bHRCUztcclxuICAgIGNvbnN0IHNtYWxsTGluZSA9IGZpZ21hLmNyZWF0ZUxpbmUoKTtcclxuICAgIHNtYWxsTGluZS5uYW1lID0gJ3NtYWxsTGluZSc7XHJcbiAgICBzbWFsbExpbmUucmVzaXplKDMwMCwgMCk7XHJcbiAgICBzbWFsbExpbmUuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDAuOCwgYjogMCB9IH1dO1xyXG4gICAgc21hbGxMaW5lLnN0cm9rZVdlaWdodCA9IGJzIC8gMztcclxuICAgIHNtYWxsTGluZS5zdHJva2VDYXAgPSAnUk9VTkQnO1xyXG4gICAgc21hbGxMaW5lLnN0cm9rZUFsaWduID0gJ0NFTlRFUic7XHJcbiAgICBzbWFsbExpbmUueSA9IHNtYWxsTGluZS5zdHJva2VXZWlnaHQgLyAyO1xyXG4gICAgY29uc3QgbWVkaXVtTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xyXG4gICAgbWVkaXVtTGluZS5uYW1lID0gJ21lZGl1bUxpbmUnO1xyXG4gICAgbWVkaXVtTGluZS5vcGFjaXR5ID0gMC4yO1xyXG4gICAgbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgPSBicztcclxuICAgIG1lZGl1bUxpbmUueSA9IG1lZGl1bUxpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcclxuICAgIGNvbnN0IGJpZ0xpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcclxuICAgIGJpZ0xpbmUubmFtZSA9ICdiaWdMaW5lJztcclxuICAgIGJpZ0xpbmUub3BhY2l0eSA9IDAuMTtcclxuICAgIGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgKyBNYXRoLnBvdyhicywgMS40KSAqIDAuODtcclxuICAgIGJpZ0xpbmUueSA9IGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcclxuICAgIGNvbnN0IGdyb3VwID0gZmlnbWEuZ3JvdXAoW2JpZ0xpbmUsIG1lZGl1bUxpbmUsIHNtYWxsTGluZV0sIGxlc3Nvbi5wYXJlbnQpO1xyXG4gICAgZ3JvdXAubmFtZSA9ICd0bXAtYnMnO1xyXG4gICAgZ3JvdXAueCA9IGxlc3Nvbi54O1xyXG4gICAgZ3JvdXAueSA9IGxlc3Nvbi55IC0gODA7XHJcbn1cclxuZnVuY3Rpb24gZ2V0QnJ1c2hTaXplKHN0ZXApIHtcclxuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMoc3RlcCk7XHJcbiAgICBjb25zdCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xyXG4gICAgY29uc3Qgc3Ryb2tlV2VpZ2h0c0FyciA9IHN0cm9rZXMubWFwKChub2RlKSA9PiBub2RlWydzdHJva2VXZWlnaHQnXSB8fCAwKTtcclxuICAgIGNvbnN0IG1heFdlaWdodCA9IE1hdGgubWF4KC4uLnN0cm9rZVdlaWdodHNBcnIpO1xyXG4gICAgcmV0dXJuIHN0cm9rZXMubGVuZ3RoID4gMCA/IG1heFdlaWdodCA6IDI1O1xyXG59XHJcbmZ1bmN0aW9uIGdldENsZWFyTGF5ZXJOdW1iZXJzKHN0ZXApIHtcclxuICAgIGNvbnN0IHByZWZpeCA9ICdjbGVhci1sYXllci0nO1xyXG4gICAgY29uc3QgY2xlYXJMYXllcnNTdGVwID0gZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHRhZykgPT4gdGFnLnN0YXJ0c1dpdGgocHJlZml4KSk7XHJcbiAgICBpZiAoY2xlYXJMYXllcnNTdGVwLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICAgIGNvbnN0IGxheWVyTnVtYmVycyA9IGNsZWFyTGF5ZXJzU3RlcFswXVxyXG4gICAgICAgIC5zbGljZShwcmVmaXgubGVuZ3RoKVxyXG4gICAgICAgIC5zcGxpdCgnLCcpXHJcbiAgICAgICAgLm1hcChOdW1iZXIpO1xyXG4gICAgcmV0dXJuIGxheWVyTnVtYmVycztcclxufVxyXG5mdW5jdGlvbiBjb2xsZWN0TGF5ZXJOdW1iZXJzVG9DbGVhcihsZXNzb24sIHN0ZXApIHtcclxuICAgIGNvbnN0IGN1cnJlbnRTdGVwT3JkZXIgPSBnZXRTdGVwT3JkZXIoc3RlcCk7XHJcbiAgICBjb25zdCBsYXllcnNTdGVwT3JkZXJUYWdzID0gbGVzc29uLmNoaWxkcmVuLm1hcCgocykgPT4gZ2V0U3RlcE9yZGVyKHMpKTtcclxuICAgIGNvbnN0IGNsZWFyTGF5ZXJOdW1iZXJzID0gbGVzc29uLmNoaWxkcmVuLnJlZHVjZSgoYWNjLCBsYXllcikgPT4ge1xyXG4gICAgICAgIGlmIChsYXllci50eXBlICE9PSAnR1JPVVAnIHx8IGdldFN0ZXBPcmRlcihsYXllcikgPiBjdXJyZW50U3RlcE9yZGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnZXRUYWdzKGxheWVyKS5pbmNsdWRlcygnY2xlYXItYmVmb3JlJykpIHtcclxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHN0ZXAgb3JkZXIgdGFncyBhbmQgY29udmVydCB0byBsYXllcnMgdG8gY2xlYXJcclxuICAgICAgICAgICAgY29uc3Qgc3RlcHNUb0NsZWFyID0gWy4uLkFycmF5KGdldFN0ZXBPcmRlcihsYXllcikpLmtleXMoKV0uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIHN0ZXBzVG9DbGVhci5mb3JFYWNoKChzdGVwT3JkZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXllcnNTdGVwT3JkZXJUYWdzLmluY2x1ZGVzKHN0ZXBPcmRlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY2MuYWRkKGxheWVyc1N0ZXBPcmRlclRhZ3MuaW5kZXhPZihzdGVwT3JkZXIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldENsZWFyTGF5ZXJOdW1iZXJzKGxheWVyKS5mb3JFYWNoKChpZHgpID0+IGFjYy5hZGQoaWR4KSk7XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIG5ldyBTZXQoKSk7XHJcbiAgICByZXR1cm4gY2xlYXJMYXllck51bWJlcnM7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE5leHRCcnVzaFN0ZXAoc3RlcE51bWJlcikge1xyXG4gICAgbGV0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIGNvbnN0IHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgIGlmICghbGVzc29uKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHN0ZXA7XHJcbiAgICBsZXQgc3RlcHMgPSBzdGVwc0J5T3JkZXIobGVzc29uKTtcclxuICAgIGNvbnN0IG5leHRTdGVwID0gZmluZE5leHRCcnVzaFN0ZXAoc3RlcHMuc2xpY2Uoc3RlcE51bWJlcikpO1xyXG4gICAgaWYgKG5leHRTdGVwKSB7XHJcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW25leHRTdGVwXTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBsZXNzb25zID0gZmlnbWEucm9vdC5jaGlsZHJlbjtcclxuICAgIHN0ZXAgPSBsZXNzb25zXHJcbiAgICAgICAgLnNsaWNlKGxlc3NvbnMuaW5kZXhPZihsZXNzb24ucGFyZW50KSArIDEpXHJcbiAgICAgICAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIG5ld0xlc3NvbikgPT4ge1xyXG4gICAgICAgIGlmIChhY2N1bXVsYXRvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gZmluZExlc3Nvbkdyb3VwKG5ld0xlc3Nvbik7XHJcbiAgICAgICAgaWYgKCFsZXNzb25GcmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbmV3U3RlcHMgPSBzdGVwc0J5T3JkZXIobGVzc29uRnJhbWUpO1xyXG4gICAgICAgIGNvbnN0IG5ld05leHRTdGVwID0gZmluZE5leHRCcnVzaFN0ZXAobmV3U3RlcHMpO1xyXG4gICAgICAgIGlmIChuZXdOZXh0U3RlcCkge1xyXG4gICAgICAgICAgICBkZWxldGVUbXAocGFnZSk7XHJcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gbmV3TGVzc29uO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3TmV4dFN0ZXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSwgbnVsbCk7XHJcbiAgICBpZiAoc3RlcCkge1xyXG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtzdGVwXTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShzZXR0aW5ncywgcGFnZSkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBwYWdlID0gcGFnZSB8fCBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgICAgICBsYXN0TW9kZSA9IHNldHRpbmdzLmRpc3BsYXlNb2RlO1xyXG4gICAgICAgIGxhc3RTdGVwTnVtYmVyID0gc2V0dGluZ3Muc3RlcE51bWJlcjtcclxuICAgICAgICBjb25zdCB7IGRpc3BsYXlNb2RlLCBzdGVwTnVtYmVyIH0gPSBzZXR0aW5ncztcclxuICAgICAgICBjb25zdCBsZXNzb24gPSBmaW5kTGVzc29uR3JvdXAocGFnZSk7XHJcbiAgICAgICAgaWYgKCFsZXNzb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xyXG4gICAgICAgIHBhZ2Uuc2VsZWN0aW9uID0gW3N0ZXBdO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBDb3VudCA9IGxlc3Nvbi5jaGlsZHJlbi5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSkubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG1heFN0cm9rZVdlaWdodCA9IGdldEJydXNoU2l6ZShzdGVwKTtcclxuICAgICAgICBjb25zdCBicnVzaFR5cGUgPSBnZXRUYWcoc3RlcCwgJ2JydXNoLW5hbWUtJykgfHwgJyc7XHJcbiAgICAgICAgbGV0IGxheWVyTnVtYmVyc1RvQ2xlYXIgPSBnZXRUYWdzKHN0ZXApLmluY2x1ZGVzKCdjbGVhci1iZWZvcmUnKVxyXG4gICAgICAgICAgICA/IFsuLi5BcnJheShzdGVwTnVtYmVyKS5rZXlzKCldLnNsaWNlKDEpXHJcbiAgICAgICAgICAgIDogZ2V0Q2xlYXJMYXllck51bWJlcnMoc3RlcCk7XHJcbiAgICAgICAgeWllbGQgdWlBcGkudXBkYXRlVWlQcm9wcyh7XHJcbiAgICAgICAgICAgIHNoYWRvd1NpemU6IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnc3MtJykpIHx8IDAsXHJcbiAgICAgICAgICAgIGJydXNoU2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdicy0nKSkgfHwgMCxcclxuICAgICAgICAgICAgc3VnZ2VzdGVkQnJ1c2hTaXplOiBpc1Jlc3VsdFN0ZXAoc3RlcCkgPyAwIDogbWF4U3Ryb2tlV2VpZ2h0LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogZ2V0VGFnKHN0ZXAsICdzLScpIHx8ICcwJyxcclxuICAgICAgICAgICAgc3RlcENvdW50LFxyXG4gICAgICAgICAgICBzdGVwTnVtYmVyLFxyXG4gICAgICAgICAgICBkaXNwbGF5TW9kZSxcclxuICAgICAgICAgICAgY2xlYXJCZWZvcmU6IGdldFRhZ3Moc3RlcCkuaW5jbHVkZXMoJ2NsZWFyLWJlZm9yZScpLFxyXG4gICAgICAgICAgICBjbGVhckxheWVyczogbGF5ZXJOdW1iZXJzVG9DbGVhci5tYXAoKG4pID0+IG4udG9TdHJpbmcoKSkgfHwgW10sXHJcbiAgICAgICAgICAgIG90aGVyVGFnczogZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHQpID0+IHQuc3RhcnRzV2l0aCgnc2hhcmUtYnV0dG9uJykgfHwgdC5zdGFydHNXaXRoKCdhbGxvdy11bmRvJykpIHx8IFtdLFxyXG4gICAgICAgICAgICBicnVzaFR5cGUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeWllbGQgdWlBcGkuc2V0U3RlcE5hdmlnYXRpb25Qcm9wcyhzdGVwTnVtYmVyLCBkaXNwbGF5TW9kZSk7XHJcbiAgICAgICAgZGVsZXRlVG1wKCk7XHJcbiAgICAgICAgaWYgKGxhc3RQYWdlICYmIGxhc3RQYWdlICE9IHBhZ2UpIHtcclxuICAgICAgICAgICAgZGlzcGxheUFsbChsYXN0UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXN0UGFnZSA9IHBhZ2U7XHJcbiAgICAgICAgZGlzcGxheUFsbEVsZW1lbnRzKGxlc3Nvbik7XHJcbiAgICAgICAgc3dpdGNoIChkaXNwbGF5TW9kZSkge1xyXG4gICAgICAgICAgICBjYXNlICdhbGwnOlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUFsbChsZXNzb24sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGVwLnR5cGUgPT09ICdHUk9VUCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cFRlbXBsYXRlID0gc3RlcC5maW5kQ2hpbGQoKGcpID0+IGcubmFtZSA9PSAndGVtcGxhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cFRlbXBsYXRlLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgc3RlcHNCeU9yZGVyKGxlc3NvbikuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGkgPCBzdGVwTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0TGF5ZXJOdW1iZXJzVG9DbGVhcihsZXNzb24sIHN0ZXApLmZvckVhY2goKGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXNzb24uY2hpbGRyZW5baV0udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4gc2hvd09ubHlSR0JUZW1wbGF0ZShzdGVwKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndGVtcGxhdGUnOlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRlbXBsYXRlKGxlc3Nvbiwgc3RlcCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBhZGRBbmltYXRpb25UYWcoc3RlcCwgdGFnLCBkZWxheSwgcmVwZWF0KSB7XHJcbiAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHNlbGVjdGlvblRhZ3MgPSBnZXRUYWdzKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXSkuZmlsdGVyKCh0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhL14od2lnZ2xlfGZseS1mcm9tLXxhcHBlYXIkfGJsaW5rJHxkcmF3LWxpbmV8W2RyXS0/XFxkKyQpL2cudGVzdCh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodGFnKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaCh0YWcpO1xyXG4gICAgICAgICAgICBpZiAoZGVsYXkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaChgZCR7ZGVsYXl9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlcGVhdCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKGByJHtyZXBlYXR9YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdLm5hbWUgPSBzZWxlY3Rpb25UYWdzLmpvaW4oJyAnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5uYW1lID0gc2VsZWN0aW9uVGFncy5qb2luKCcgJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQcm9wcyhzZXR0aW5ncykge1xyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3NldHRpbmdzLnN0ZXBOdW1iZXIgLSAxXTtcclxuICAgIGxldCB0YWdzID0gZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoJ3NzLScpICYmXHJcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnYnMtJykgJiZcclxuICAgICAgICAhdC5zdGFydHNXaXRoKCdzLScpICYmXHJcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnY2xlYXItbGF5ZXItJykgJiZcclxuICAgICAgICAhdC5zdGFydHNXaXRoKCdjbGVhci1iZWZvcmUnKSAmJlxyXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ3NoYXJlLWJ1dHRvbicpICYmXHJcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnYWxsb3ctdW5kbycpICYmXHJcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnYnJ1c2gtbmFtZS0nKSk7XHJcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcclxuICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCBgcy0ke3NldHRpbmdzLnRlbXBsYXRlfWApO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcclxuICAgICAgICB0YWdzLnB1c2goYHNzLSR7c2V0dGluZ3Muc2hhZG93U2l6ZX1gKTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcclxuICAgICAgICB0YWdzLnB1c2goYGJzLSR7c2V0dGluZ3MuYnJ1c2hTaXplfWApO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLmJydXNoVHlwZSkge1xyXG4gICAgICAgIHRhZ3MucHVzaChgYnJ1c2gtbmFtZS0ke3NldHRpbmdzLmJydXNoVHlwZX1gKTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5jbGVhckxheWVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5jbGVhckJlZm9yZSkge1xyXG4gICAgICAgICAgICB0YWdzLnB1c2goYGNsZWFyLWxheWVyLSR7c2V0dGluZ3MuY2xlYXJMYXllcnMuam9pbignLCcpfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5jbGVhckJlZm9yZSkge1xyXG4gICAgICAgIHRhZ3MucHVzaCgnY2xlYXItYmVmb3JlJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoc2V0dGluZ3Mub3RoZXJUYWdzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQoc2V0dGluZ3Mub3RoZXJUYWdzKTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5hbmltYXRpb25UYWcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGFkZEFuaW1hdGlvblRhZyhzdGVwLCBzZXR0aW5ncy5hbmltYXRpb25UYWcsIHNldHRpbmdzLmRlbGF5LCBzZXR0aW5ncy5yZXBlYXQpO1xyXG4gICAgfVxyXG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRQYWdlQ2hhbmdlZCgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIGlmICghc2VsZWN0aW9uIHx8ICFsZXNzb24gfHwgIWxlc3Nvbi5jaGlsZHJlbi5pbmNsdWRlcyhzZWxlY3Rpb24pKSB7XHJcbiAgICAgICAgdXBkYXRlRGlzcGxheSh7IGRpc3BsYXlNb2RlOiBsYXN0TW9kZSwgc3RlcE51bWJlcjogMSB9LCBmaWdtYS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc3RlcCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcclxuICAgIGNvbnN0IHN0ZXBOdW1iZXIgPSBzdGVwc0J5T3JkZXIobGVzc29uKS5pbmRleE9mKHN0ZXApICsgMTtcclxuICAgIHVwZGF0ZURpc3BsYXkoe1xyXG4gICAgICAgIGRpc3BsYXlNb2RlOiBsYXN0TW9kZSxcclxuICAgICAgICBzdGVwTnVtYmVyOiBzdGVwTnVtYmVyIHx8IDEsXHJcbiAgICB9LCBmaWdtYS5jdXJyZW50UGFnZSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZWQoKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgaWYgKHNlbGVjdGlvbiB8fCBsZXNzb24gfHwgc2VsZWN0aW9uLnR5cGUgIT09ICdGUkFNRScpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc2VsZWN0aW9uKTtcclxuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uVGFncyA9IHRhZ3MuZmluZCgodCkgPT4gL153aWdnbGV8XmZseS1mcm9tLXxeYXBwZWFyfF5ibGlua3xeZHJhdy1saW5lLy50ZXN0KHQpKTtcclxuICAgICAgICAgICAgY29uc3QgZGVsYXkgPSBnZXRQYXJhbVZhbHVlKHRhZ3MsIC9eZC0/KFxcZCspLyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcGVhdCA9IGdldFBhcmFtVmFsdWUodGFncywgL15yLT8oXFxkKykvKTtcclxuICAgICAgICAgICAgeWllbGQgdWlBcGkuc2V0QW5pbWF0aW9uVGFncyhhbmltYXRpb25UYWdzLCBkZWxheSwgcmVwZWF0KTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50U3RlcCA9IGZpbmRQYXJlbnRCeVRhZyhzZWxlY3Rpb24sICdzdGVwJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0ZXBOdW1iZXIgPSBzdGVwc0J5T3JkZXIobGVzc29uKS5pbmRleE9mKHBhcmVudFN0ZXApID49IDBcclxuICAgICAgICAgICAgICAgID8gc3RlcHNCeU9yZGVyKGxlc3NvbikuaW5kZXhPZihwYXJlbnRTdGVwKSArIDFcclxuICAgICAgICAgICAgICAgIDogbGFzdFN0ZXBOdW1iZXI7XHJcbiAgICAgICAgICAgIHlpZWxkIHVpQXBpLnNldFN0ZXBOYXZpZ2F0aW9uUHJvcHMoc3RlcE51bWJlciwgbGFzdE1vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNlbGVjdGlvbiB8fCAhbGVzc29uIHx8ICFsZXNzb24uY2hpbGRyZW4uaW5jbHVkZXMoc2VsZWN0aW9uKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgY29uc3Qgc3RlcE51bWJlciA9IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgPj0gMFxyXG4gICAgICAgICAgICA/IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgKyAxXHJcbiAgICAgICAgICAgIDogbGFzdFN0ZXBOdW1iZXI7XHJcbiAgICAgICAgdXBkYXRlRGlzcGxheSh7IGRpc3BsYXlNb2RlOiBsYXN0TW9kZSwgc3RlcE51bWJlciB9LCBmaWdtYS5jdXJyZW50UGFnZSk7XHJcbiAgICB9KTtcclxufVxyXG4iLCJpbXBvcnQgeyBlbWl0IH0gZnJvbSAnLi4vZXZlbnRzJztcclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xyXG4gICAgbGV0IGFyciA9IFtdO1xyXG4gICAgaWYgKGYobm9kZSkpIHtcclxuICAgICAgICBhcnIucHVzaChub2RlKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgIGlmIChjaGlsZHJlbikge1xyXG4gICAgICAgIGFyciA9IGFyci5jb25jYXQoY2hpbGRyZW4uZmxhdE1hcCgocCkgPT4gZmluZEFsbChwLCBmKSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFycjtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZExlYWZOb2Rlcyhub2RlKSB7XHJcbiAgICBpZiAoISgnY2hpbGRyZW4nIGluIG5vZGUpKSB7XHJcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLmZpbmRBbGwoKG4pID0+ICEoJ2NoaWxkcmVuJyBpbiBuKSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xyXG4gICAgaWYgKGYobm9kZSkpIHtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIGlmIChub2RlID09PSBudWxsIHx8IG5vZGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vZGUucGFyZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZS5wYXJlbnQsIGYpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlSW5kZXgobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUucGFyZW50LmNoaWxkcmVuLmZpbmRJbmRleCgobikgPT4gbi5pZCA9PT0gbm9kZS5pZCk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRMZXNzb24oKSB7XHJcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT09ICdsZXNzb24nKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFncyhub2RlKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICByZXR1cm4gKG5vZGUgPT09IG51bGwgfHwgbm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbm9kZS5uYW1lKSA/IChfYSA9IG5vZGUgPT09IG51bGwgfHwgbm9kZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbm9kZS5uYW1lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbikgOiBbXTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZFRhZyhub2RlLCB0YWcpIHtcclxuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xyXG4gICAgcmV0dXJuIHRhZ3MuZmluZCgocykgPT4gdGFnLnRlc3QocykpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUYWcobm9kZSwgdGFnKSB7XHJcbiAgICBub2RlLm5hbWUgPSBnZXRUYWdzKG5vZGUpLmNvbmNhdChbdGFnXSkuam9pbignICcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50QnlUYWcobm9kZSwgdGFnKSB7XHJcbiAgICByZXR1cm4gZmluZFBhcmVudChub2RlLCAobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcyh0YWcpKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZENoaWxkcmVuQnlUYWcobm9kZSwgdGFnKSB7XHJcbiAgICBjb25zdCBwcmVkaWNhdGUgPSAobikgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRUYWdzKG4pLmluY2x1ZGVzKHRhZyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZpbmRBbGwobm9kZSwgcHJlZGljYXRlKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNSZXN1bHRTdGVwKG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlICYmIGdldFRhZ3Mobm9kZSkuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBwcmludCh0ZXh0KSB7XHJcbiAgICBlbWl0KCdwcmludCcsIHRleHQpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5Tm90aWZpY2F0aW9uKG1lc3NhZ2UpIHtcclxuICAgIGZpZ21hLm5vdGlmeShtZXNzYWdlKTtcclxufVxyXG5leHBvcnQgY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBPcmRlcihzdGVwKSB7XHJcbiAgICBjb25zdCBzdGVwT3JkZXJUYWcgPSAvXm8tKFxcZCspJC87XHJcbiAgICBjb25zdCBzdGVwVGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0YWcpID0+IHRhZy5tYXRjaChzdGVwT3JkZXJUYWcpKTtcclxuICAgIGlmIChzdGVwVGFnKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihzdGVwVGFnLm1hdGNoKHN0ZXBPcmRlclRhZylbMV0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVVaShpc1dpZGUpIHtcclxuICAgIGlmIChpc1dpZGUpIHtcclxuICAgICAgICBmaWdtYS51aS5yZXNpemUoOTAwLCA0NzApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZmlnbWEudWkucmVzaXplKDM0MCwgNDcwKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcE9yZGVyKHN0ZXAsIHN0ZXBPcmRlcikge1xyXG4gICAgZ2V0VGFncyhzdGVwKS5zb21lKCh0YWcpID0+IC9eby1cXGQrJC8udGVzdCh0YWcpKVxyXG4gICAgICAgID8gKHN0ZXAubmFtZSA9IHN0ZXAubmFtZS5yZXBsYWNlKC9vLVxcZCsvLCBgby0ke3N0ZXBPcmRlcn1gKSlcclxuICAgICAgICA6IChzdGVwLm5hbWUgKz0gYCBvLSR7c3RlcE9yZGVyfWApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxUcmVlKG5vZGUpIHtcclxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIHJldHVybiBbbm9kZV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW25vZGUsIC4uLm5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZ2V0QWxsVHJlZShuKSldO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBkZXNjZW5kYW50cyhub2RlKSB7XHJcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBnZXRBbGxUcmVlKG4pKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZE5leHRCcnVzaFN0ZXAoc3RlcHMpIHtcclxuICAgIHJldHVybiBzdGVwcy5maW5kKChzdGVwKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldFRhZ3Moc3RlcCkuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLWJydXNoJyk7XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZExlc3Nvbkdyb3VwKHBhZ2UpIHtcclxuICAgIHJldHVybiBwYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW1WYWx1ZShlbCwgcGF0dGVybikge1xyXG4gICAgZm9yIChsZXQgY2wgb2YgZWwpIHtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IGNsLm1hdGNoKHBhdHRlcm4pO1xyXG4gICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobWF0Y2hbMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAwO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc1JHQlRlbXBsYXRlKG5vZGUpIHtcclxuICAgIHJldHVybiBmaW5kVGFnKG5vZGUsIC9ecmdiLXRlbXBsYXRlJC8pIHx8IGZpbmRQYXJlbnRCeVRhZyhub2RlLCAncmdiLXRlbXBsYXRlJyk7XHJcbn1cclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBjcmVhdGVQbHVnaW5BUEksIGNyZWF0ZVVJQVBJIH0gZnJvbSAnZmlnbWEtanNvbnJwYyc7XHJcbmltcG9ydCB7IGV4cG9ydFRleHRzLCBpbXBvcnRUZXh0cyB9IGZyb20gJy4vcGx1Z2luL2Zvcm1hdC1ycGMnO1xyXG5pbXBvcnQgeyBleHBvcnRMZXNzb24sIGV4cG9ydENvdXJzZSB9IGZyb20gJy4vcGx1Z2luL3B1Ymxpc2gnO1xyXG5pbXBvcnQgeyBnZXRTdGVwcywgc2V0U3RlcHNPcmRlciB9IGZyb20gJy4vcGx1Z2luL3R1bmUtcnBjJztcclxuaW1wb3J0IHsgY3JlYXRlTGVzc29uLCBzZXBhcmF0ZVN0ZXAsIHNwbGl0QnlDb2xvciwgam9pblN0ZXBzLCB9IGZyb20gJy4vcGx1Z2luL2NyZWF0ZSc7XHJcbmltcG9ydCB7IGRpc3BsYXlOb3RpZmljYXRpb24sIHJlc2l6ZVVpIH0gZnJvbSAnLi9wbHVnaW4vdXRpbCc7XHJcbmltcG9ydCB7IGxpbnRQYWdlLCBsaW50Q291cnNlLCBzZWxlY3RFcnJvciwgc2F2ZUVycm9ycyB9IGZyb20gJy4vcGx1Z2luL2xpbnRlcic7XHJcbmltcG9ydCB7IHNlbGVjdGlvbkNoYW5nZWQsIGN1cnJlbnRQYWdlQ2hhbmdlZCwgdXBkYXRlRGlzcGxheSwgdXBkYXRlUHJvcHMsIHNlbGVjdE5leHRCcnVzaFN0ZXAsIGRpc3BsYXlBbGwsIH0gZnJvbSAnLi9wbHVnaW4vdHVuZSc7XHJcbmltcG9ydCB7IHNldE1ldGFUYWdzIH0gZnJvbSAnLi9wbHVnaW4vbWV0YSc7XHJcbmltcG9ydCB7IFR1bmVGb3JtU3RvcmUgfSBmcm9tICcuL2FwcC9tb2RlbHMvVHVuZUZvcm1TdG9yZSc7XHJcbmltcG9ydCB7IE1ldGFGb3JtU3RvcmUgfSBmcm9tICcuL2FwcC9tb2RlbHMvTWV0YVN0b3JlJztcclxuLy8gRmlnbWEgcGx1Z2luIG1ldGhvZHNcclxuZXhwb3J0IGNvbnN0IHBsdWdpbkFwaSA9IGNyZWF0ZVBsdWdpbkFQSSh7XHJcbiAgICBzZXRTZXNzaW9uVG9rZW4odG9rZW4pIHtcclxuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnc2Vzc2lvblRva2VuJywgdG9rZW4pO1xyXG4gICAgfSxcclxuICAgIGdldFNlc3Npb25Ub2tlbigpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnc2Vzc2lvblRva2VuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZXhwb3J0TGVzc29uLFxyXG4gICAgZXhwb3J0Q291cnNlLFxyXG4gICAgZ2V0U3RlcHMsXHJcbiAgICBzZXRTdGVwc09yZGVyLFxyXG4gICAgZXhwb3J0VGV4dHMsXHJcbiAgICBpbXBvcnRUZXh0cyxcclxuICAgIGRpc3BsYXlOb3RpZmljYXRpb24sXHJcbiAgICBjcmVhdGVMZXNzb24sXHJcbiAgICBzZXBhcmF0ZVN0ZXAsXHJcbiAgICBzcGxpdEJ5Q29sb3IsXHJcbiAgICBqb2luU3RlcHMsXHJcbiAgICBzZWxlY3RFcnJvcixcclxuICAgIHNhdmVFcnJvcnMsXHJcbiAgICBzZWxlY3Rpb25DaGFuZ2VkLFxyXG4gICAgY3VycmVudFBhZ2VDaGFuZ2VkLFxyXG4gICAgdXBkYXRlRGlzcGxheSxcclxuICAgIGxpbnRQYWdlLFxyXG4gICAgbGludENvdXJzZSxcclxuICAgIHJlc2l6ZVVpLFxyXG4gICAgdXBkYXRlUHJvcHMsXHJcbiAgICBzZXRNZXRhVGFncyxcclxuICAgIHNlbGVjdE5leHRCcnVzaFN0ZXAsXHJcbiAgICBkaXNwbGF5QWxsLFxyXG59LCB7IHRpbWVvdXQ6IDEwMDAwMDAgfSk7XHJcbi8vIEZpZ21hIFVJIGFwcCBtZXRob2RzXHJcbmV4cG9ydCBjb25zdCB1aUFwaSA9IGNyZWF0ZVVJQVBJKHtcclxuICAgIHNldEFuaW1hdGlvblRhZ3MoYW5pbWF0aW9uVGFnLCBkZWxheSwgcmVwZWF0KSB7XHJcbiAgICAgICAgVHVuZUZvcm1TdG9yZS5zZXRBbmltYXRpb25UYWdzKGFuaW1hdGlvblRhZywgZGVsYXksIHJlcGVhdCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlVWlQcm9wcyhzZXR0aW5ncykge1xyXG4gICAgICAgIFR1bmVGb3JtU3RvcmUudXBkYXRlUHJvcHMoc2V0dGluZ3MpO1xyXG4gICAgfSxcclxuICAgIHNldFN0ZXBOYXZpZ2F0aW9uUHJvcHMoc3RlcE51bWJlciwgZGlzcGxheU1vZGUpIHtcclxuICAgICAgICBUdW5lRm9ybVN0b3JlLnNldFN0ZXBOYXZpZ2F0aW9uUHJvcHMoc3RlcE51bWJlciwgZGlzcGxheU1vZGUpO1xyXG4gICAgfSxcclxuICAgIHNldE1ldGFQcm9wcyhwcm9wcykge1xyXG4gICAgICAgIE1ldGFGb3JtU3RvcmUuc2V0TWV0YVByb3BzKHByb3BzKTtcclxuICAgIH0sXHJcbn0sIHsgdGltZW91dDogMTAwMDAwMCB9KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==