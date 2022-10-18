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
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


function separateStep(nodes) {
    const parentStep = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findParent"])(nodes[0], (n) => n.name.startsWith('step'));
    const frame = parentStep.parent;
    const index = frame.children.findIndex((n) => n == parentStep);
    if (!parentStep) {
        return;
    }
    const input = figma.group(nodes, frame);
    input.name = 'input';
    const newStep = figma.group([input], frame, index);
    newStep.name = parentStep.name;
}
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('separateStep', () => separateStep(figma.currentPage.selection));


/***/ }),

/***/ "./src/plugin/format-rpc.ts":
/*!**********************************!*\
  !*** ./src/plugin/format-rpc.ts ***!
  \**********************************/
/*! exports provided: exportTexts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportTexts", function() { return exportTexts; });
function exportTexts() {
    const texts = figma.currentPage
        .findAll((node) => node.type === 'TEXT')
        .filter((node) => node.visible);
    return (texts
        .map((node) => {
        const tn = node;
        return tn
            .getStyledTextSegments([
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
        ])
            .map((s) => s.characters)
            .join('\\')
            .trimEnd();
    })
        // remove array duplicates
        .filter((v, i, a) => a.indexOf(v) === i));
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
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(figma.root, (node) => /^step s-multistep-result/.test(node.name)).forEach((n) => {
        n.children[0].name = 'template';
        n.children[0].children[0].name = '/ignore';
        n.resize(40, 40);
        n.x = 10;
        n.y = 60;
    });
}
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('autoFormat', autoFormat);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('formatOrder', () => formatOrder(figma.currentPage.findChild((t) => t.name == 'lesson')));


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






figma.showUI(__html__);
figma.ui.resize(340, 450);
console.clear();


/***/ }),

/***/ "./src/plugin/linter.ts":
/*!******************************!*\
  !*** ./src/plugin/linter.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


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
    var _a, _b;
    if ((_a = errors[index]) === null || _a === void 0 ? void 0 : _a.page) {
        figma.currentPage = errors[index].page;
    }
    if ((_b = errors[index]) === null || _b === void 0 ? void 0 : _b.node) {
        errors[index].page.selection = [errors[index].node];
    }
}
function printErrors() {
    errors.sort((a, b) => a.level - b.level);
    selectError(0);
    let text = errors
        .map((e) => {
        var _a, _b, _c;
        return `${ErrorLevel[e.level]}\t| ${e.error} | PAGE:${((_a = e.page) === null || _a === void 0 ? void 0 : _a.name) || ''} ${(_b = e.node) === null || _b === void 0 ? void 0 : _b.type}:${((_c = e.node) === null || _c === void 0 ? void 0 : _c.name) || ''}`;
    })
        .join('\n');
    text += '\nDone';
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["print"])(text);
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
function descendants(node) {
    if (!node.children) {
        return [node];
    }
    return [node, ...node.children.flatMap((n) => descendants(n))];
}
function descendantsWithoutSelf(node) {
    if (!node.children) {
        return [];
    }
    return node.children.flatMap((n) => descendants(n));
}
function lintVector(page, node) {
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(/^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^Vector$|^\d+$|^Ellipse$|^Rectangle$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node);
    });
    let fills = node.fills;
    let strokes = node.strokes;
    assert(!fills.length || !strokes.length, 'Should not have fill+stroke', page, node, ErrorLevel.WARN);
    strokes.forEach((s) => {
        assert(s.visible, 'Stroke must be visible', page, node);
        assert(s.type == 'SOLID', 'Stroke must be solid', page, node);
        let s1 = s;
        assert(s1.color.r != 0 || s1.color.g != 0 || s1.color.b != 0, 'Stroke color must not be black', page, node);
        assert(s1.color.r != 1 || s1.color.g != 1 || s1.color.b != 1, 'Stroke color must not be white', page, node);
    });
    fills.forEach((f) => {
        assert(f.visible, 'Fill must be visible', page, node);
        assert(f.type == 'SOLID', 'Fill must be solid', page, node);
        let f1 = f;
        assert(f1.color.r != 0 || f1.color.g != 0 || f1.color.b != 0, 'Fill color must not be black', page, node);
        assert(f1.color.r != 1 || f1.color.g != 1 || f1.color.b != 1, 'Fill color must not be white', page, node);
    });
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)), `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR);
    assert(!strokes.length || node.strokeJoin == 'ROUND', `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
    const rgbt = tags.find((s) => /^rgb-template$/.test(s));
    const anim = tags.find((s) => /^blink$|^draw-line$/.test(s));
    assert(!rgbt || !!anim, "Must have 'blink' or 'draw-line'", page, node); // every rgbt must have animation
}
function lintGroup(page, node) {
    assert(!/BOOLEAN_OPERATION/.test(node.type), 'Notice BOOLEAN_OPERATION', page, node, ErrorLevel.INFO);
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(/^blink$|^rgb-template$|^d\d+$|^r\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
    });
    const rgbt = tags.find((s) => /^rgb-template$/.test(s));
    const anim = tags.find((s) => /^blink$/.test(s));
    assert(!rgbt || !!anim, "Must have 'blink'", page, node); // every rgbt must have animation
}
function lintInput(page, node) {
    if (!assert(node.type == 'GROUP', "Must be 'GROUP' type'", page, node)) {
        return;
    }
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    assert(node.name == 'input', "Must be 'input'", page, node);
    descendantsWithoutSelf(node).forEach((v) => {
        if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
            lintGroup(page, v);
        }
        else if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
            lintVector(page, v);
        }
        else {
            assert(false, "Must be 'GROUP/VECTOR/RECTANGLE/ELLIPSE/TEXT' type", page, v);
        }
    });
}
function lintSettings(page, node) {
    var _a;
    assert(node.type == 'ELLIPSE', "Must be 'ELLIPSE' type'", page, node);
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    tags.forEach((tag) => {
        assert(/^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
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
function lintStep(page, step) {
    var _a, _b;
    if (!assert(step.type == 'GROUP', "Must be 'GROUP' type'", page, step)) {
        return;
    }
    assert(step.opacity == 1, 'Must be opaque', page, step);
    assert(step.visible, 'Must be visible', page, step);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step);
    tags.forEach((tag) => {
        assert(/^\/|^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-\d+$|^ss-\d+$|^bs-\d+$|^o-\d+$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, step);
        // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);
    });
    const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s));
    const brush = tags.find((s) => /^s-multistep-brush$|^s-multistep-brush-\d+$/.test(s));
    const ss = parseInt((_a = tags.find((s) => /^ss-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace('ss-', ''));
    const o = tags.find((s) => /^o-\d+$/.test(s));
    const bs = parseInt((_b = tags.find((s) => /^bs-\d+$/.test(s))) === null || _b === void 0 ? void 0 : _b.replace('bs-', ''));
    maxBs = Math.max(bs ? bs : maxBs, maxBs);
    assert(!ss || ss >= 15, 'ss must be >= 15', page, step);
    assert(!ss || !bs || ss > bs, 'ss must be > bs', page, step);
    assert(!bs || bs <= zoomScale * 12.8, `bs must be <= ${zoomScale * 12.8} for this zoom-scale`, page, step);
    assert(!bs || bs >= zoomScale * 0.44, `bs must be >= ${zoomScale * 0.44} for this zoom-scale`, page, step);
    assert(!o || order == 'layers', `${o} must be used only with settings order-layers`, page, step);
    assert(order !== 'layers' || !!o, 'Must have o-N order number', page, step);
    const ff = step.findOne((n) => n.fills && n.fills[0]);
    const sf = step.findOne((n) => { var _a; return ((_a = n.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    assert(!(bg && ss && sf), 'Should not use bg+ss (stroke present)', page, step, ErrorLevel.INFO);
    assert(!(bg && ss && !sf), 'Should not use bg+ss (stroke not present)', page, step, ErrorLevel.WARN);
    assert(!bg || !!ff, "bg step shouldn't be used without filled-in vectors", page, step, ErrorLevel.INFO);
    assert(!brush || !ff, "brush step shouldn't be used with filled-in vectors", page, step, ErrorLevel.INFO);
    step.children.forEach((n) => {
        if (n.name == 'input') {
            lintInput(page, n);
        }
        else if (n.name === 'template') {
            // lint template
        }
        else {
            assert(false, "Must be 'input' or 'template'", page, n);
        }
    });
    const blinkNodes = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(step, (n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).find((t) => /^blink$/.test(t)) !== undefined).flatMap(deepNodes);
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
    assert(!!node.children.find((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('s-multistep-result')), "Must have 's-multistep-result' child", page, node);
    let settings = node.children.find((n) => n.name.startsWith('settings'));
    if (settings) {
        lintSettings(page, settings);
    }
    let orderNumbers = {};
    for (let step of node.children) {
        const tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step);
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
    assert(maxBs > (zoomScale - 1) * 12.8, `zoom-scale ${zoomScale} must be ${Math.ceil(maxBs / 12.8)} for max bs ${maxBs} used`, page, node);
}
function lintThumbnail(page, node) {
    if (!assert(node.type == 'FRAME', "Must be 'FRAME' type", page, node)) {
        return;
    }
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.width == 400 && node.height == 400, 'Must be 400x400', page, node);
}
function lintPage(page) {
    if (/^\/|^INDEX$/.test(page.name)) {
        return;
    }
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
}
function lintIndex(page) {
    if (!assert(page.children.length == 1, 'Index page must contain exactly 1 element', page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, "Must contain exactly 1 'thumbnail'", page);
    lintThumbnail(page, page.children[0]);
}
function lintCourse() {
    assert(/^COURSE-[a-z\-0-9]+$/.test(figma.root.name), `Course name '${figma.root.name}' must match COURSE-[a-z\\-0-9]+`);
    const index = figma.root.children.find((p) => p.name == 'INDEX');
    if (assert(!!index, "Must have 'INDEX' page")) {
        lintIndex(index);
    }
    // find all non-unique named pages
    const nonUnique = figma.root.children.filter((p, i, a) => a.findIndex((p2) => p2.name == p.name) != i);
    nonUnique.forEach((p) => assert(false, `Page name '${p.name}' must be unique`, p));
    for (let page of figma.root.children) {
        lintPage(page);
    }
}
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('selectError', selectError);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('lintCourse', () => {
    errors = [];
    lintCourse();
    printErrors();
});
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('lintPage', () => {
    errors = [];
    lintPage(figma.currentPage);
    printErrors();
});
// no hidden fill/stroke
// no effects


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
function exportLesson(page) {
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
            // svgOutlineText: false,
            svgIdAttribute: true,
        });
        const thumbnail = yield thumbnailNode.exportAsync({
            format: 'PNG',
            constraint: {
                type: 'WIDTH',
                value: 600,
            },
        });
        return {
            coursePath: figma.root.name.replace('COURSE-', ''),
            path: page.name,
            file,
            thumbnail,
            index,
        };
    });
}
function exportCourse() {
    return __awaiter(this, void 0, void 0, function* () {
        const [lessons, thumbnail] = yield Promise.all([
            Promise.all(figma.root.children
                .filter((page) => page.name != 'INDEX')
                .map((page) => exportLesson(page))),
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
/*! exports provided: getStepNodes, setStepOrder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStepNodes", function() { return getStepNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStepOrder", function() { return setStepOrder; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");

function getOrder(step) {
    const otag = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step).find((t) => t.startsWith('o-')) || '';
    const o = parseInt(otag.replace('o-', ''));
    return isNaN(o) ? 9999 : o;
}
function stepsByOrder(lesson) {
    return lesson.children
        .filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('step'))
        .sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
}
function getStepNodes() {
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson');
    return stepsByOrder(lesson).map((step) => {
        return { id: step.id, name: step.name };
    });
}
function setStepOrder(steps) {
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson');
    steps.forEach((step, i) => {
        const s = lesson.findOne((el) => el.id == step.id);
        if (s) {
            s.name = s.name.replace(/o-\d+/, 'o-' + (i + 1));
        }
    });
}


/***/ }),

/***/ "./src/plugin/tune.ts":
/*!****************************!*\
  !*** ./src/plugin/tune.ts ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


function getOrder(step) {
    const otag = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).find((t) => t.startsWith('o-')) || '';
    const o = parseInt(otag.replace('o-', ''));
    return isNaN(o) ? 9999 : o;
}
function getTag(step, tag) {
    const v = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).find((t) => t.startsWith(tag));
    return v ? v.replace(tag, '') : '0';
}
function stepsByOrder(lesson) {
    return lesson.children
        .filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('step'))
        .sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
}
function deleteTmp() {
    figma.currentPage
        .findAll((el) => el.name.startsWith('tmp-'))
        .forEach((el) => el.remove());
}
let lastPage = figma.currentPage;
let lastMode = 'all';
function displayTemplate(lesson, step) {
    lesson.children.forEach((step) => {
        step.visible = false;
    });
    const input = step.findChild((g) => g.name == 'input');
    if (!input) {
        return;
    }
    const template = input.clone();
    template.name = 'tmp-template';
    template
        .findAll((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type))
        .forEach((el) => {
        if (el.strokes.length > 0) {
            el.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50;
            el.strokeWeight = parseInt(getTag(step, 'ss-')) || defaultWeight;
            const pink = el.clone();
            pink.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }];
            pink.strokeWeight = 2;
            pink.name = 'pink ' + el.name;
            template.appendChild(pink);
            // clone element here and give him thin pink stroke
        }
        if (el.fills.length > 0) {
            el.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0, b: 1 } }];
        }
    });
    lesson.appendChild(template);
    template.x = input.absoluteTransform[0][2] - lesson.absoluteTransform[0][2];
    template.y = input.absoluteTransform[1][2] - lesson.absoluteTransform[1][2];
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
    const bigLine = smallLine.clone();
    bigLine.name = 'bigLine';
    bigLine.opacity = 0.3;
    bigLine.strokeWeight = bs + Math.pow(bs, 1.4) * 0.8;
    bigLine.y = bigLine.strokeWeight / 2;
    const group = figma.group([bigLine, smallLine], lesson.parent);
    group.name = 'tmp-bs';
    group.x = lesson.x;
    group.y = lesson.y - 80;
}
function updateDisplay(page, settings) {
    lastPage = page;
    lastMode = settings.displayMode;
    const { displayMode, stepNumber } = settings;
    const lesson = page.children.find((el) => el.name == 'lesson');
    if (!lesson) {
        return;
    }
    const step = stepsByOrder(lesson)[stepNumber - 1];
    page.selection = [step];
    const stepCount = lesson.children.filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('step')).length;
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])('updateForm', {
        shadowSize: parseInt(getTag(step, 'ss-')),
        brushSize: parseInt(getTag(step, 'bs-')),
        template: getTag(step, 's-'),
        stepCount,
        stepNumber,
        displayMode,
    });
    deleteTmp();
    switch (displayMode) {
        case 'all':
            lesson.children.forEach((step) => {
                step.visible = true;
            });
            break;
        case 'current':
            displayBrushSize(lesson, step);
            lesson.children.forEach((step) => {
                step.visible = false;
            });
            step.visible = true;
            break;
        case 'previous':
            displayBrushSize(lesson, step);
            stepsByOrder(lesson).forEach((step, i) => {
                step.visible = i < stepNumber;
            });
            break;
        case 'template':
            displayBrushSize(lesson, step);
            displayTemplate(lesson, step);
            break;
    }
}
setTimeout(() => {
    updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 });
}, 1500);
function updateProps(settings) {
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson');
    const step = stepsByOrder(lesson)[settings.stepNumber - 1];
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).filter((t) => !t.startsWith('ss-') && !t.startsWith('bs-') && !t.startsWith('s-'));
    if (settings.template) {
        tags.splice(1, 0, `s-${settings.template}`);
    }
    if (settings.shadowSize) {
        tags.push(`ss-${settings.shadowSize}`);
    }
    if (settings.brushSize) {
        tags.push(`bs-${settings.brushSize}`);
    }
    step.name = tags.join(' ');
}
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('updateDisplay', (settings) => updateDisplay(figma.currentPage, settings));
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])('updateProps', updateProps);
figma.on('currentpagechange', () => {
    updateDisplay(lastPage, { displayMode: 'all', stepNumber: 1 });
    updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 });
});
figma.on('selectionchange', () => {
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson');
    const step = figma.currentPage.selection[0];
    if (!step || !lesson || !lesson.children.includes(step)) {
        return;
    }
    const stepNumber = stepsByOrder(lesson).indexOf(step) + 1;
    updateDisplay(figma.currentPage, { displayMode: lastMode, stepNumber });
});


/***/ }),

/***/ "./src/plugin/util.ts":
/*!****************************!*\
  !*** ./src/plugin/util.ts ***!
  \****************************/
/*! exports provided: findAll, findParent, getTags, addTag, print, capitalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAll", function() { return findAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findParent", function() { return findParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTags", function() { return getTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTag", function() { return addTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "print", function() { return print; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
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
function findParent(node, f) {
    if (f(node)) {
        return node;
    }
    if (node.parent) {
        return findParent(node.parent, f);
    }
}
function getTags(node) {
    return node.name.split(' ').filter(Boolean);
}
function addTag(node, tag) {
    node.name = getTags(node).concat([tag]).join(' ');
}
function print(text) {
    figma.ui.resize(700, 400);
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])('print', text);
}
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);


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
    getStepNodes: _plugin_tune_rpc__WEBPACK_IMPORTED_MODULE_3__["getStepNodes"],
    setStepOrder: _plugin_tune_rpc__WEBPACK_IMPORTED_MODULE_3__["setStepOrder"],
    exportTexts: _plugin_format_rpc__WEBPACK_IMPORTED_MODULE_1__["exportTexts"],
});
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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Ozs7Ozs7Ozs7Ozs7O0FDM0pEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBaUM7QUFDMUI7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQO0FBQ0EsSUFBSSxvREFBSTtBQUNSO0FBQ087Ozs7Ozs7Ozs7Ozs7QUM5QlA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFpQixTQUFJLElBQUksU0FBSTtBQUM3QiwyQkFBMkIsK0RBQStELGdCQUFnQixFQUFFLEVBQUU7QUFDOUc7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IscUZBQXFGO0FBQ3BIO0FBQ0EsS0FBSztBQUNMO0FBQzZEO0FBQ1g7QUFDWTtBQUNDO0FBQy9EO0FBQ08sa0JBQWtCLHFFQUFlO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLDBFQUFZO0FBQ2hCLElBQUksMEVBQVk7QUFDaEIsSUFBSSwyRUFBWTtBQUNoQixJQUFJLDJFQUFZO0FBQ2hCLElBQUksMkVBQVc7QUFDZixDQUFDO0FBQ0Q7QUFDTyxjQUFjLGlFQUFXLEdBQUciLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vaW5kZXgudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cy5QYXJzZUVycm9yID0gY2xhc3MgUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiUGFyc2UgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI3MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRSZXF1ZXN0ID0gY2xhc3MgSW52YWxpZFJlcXVlc3QgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgUmVxdWVzdFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuTWV0aG9kTm90Rm91bmQgPSBjbGFzcyBNZXRob2ROb3RGb3VuZCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiTWV0aG9kIG5vdCBmb3VuZFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFBhcmFtcyA9IGNsYXNzIEludmFsaWRQYXJhbXMgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgcGFyYW1zXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAyO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnRlcm5hbEVycm9yID0gY2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW50ZXJuYWwgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDM7XG4gIH1cbn07XG4iLCJjb25zdCB7IHNldHVwLCBzZW5kUmVxdWVzdCB9ID0gcmVxdWlyZShcIi4vcnBjXCIpO1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVVSUFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVVJQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbHVnaW5BUEkgPSBmdW5jdGlvbiBjcmVhdGVQbHVnaW5BUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuIiwiY29uc3QgUlBDRXJyb3IgPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5jb25zdCB7IE1ldGhvZE5vdEZvdW5kIH0gPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5cbmxldCBzZW5kUmF3O1xuXG5pZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIGZpZ21hLnVpLm9uKCdtZXNzYWdlJywgbWVzc2FnZSA9PiBoYW5kbGVSYXcobWVzc2FnZSkpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBmaWdtYS51aS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbn0gZWxzZSBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBvbm1lc3NhZ2UgPSBldmVudCA9PiBoYW5kbGVSYXcoZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogbWVzc2FnZSB9LCBcIipcIik7XG59XG5cbmxldCBycGNJbmRleCA9IDA7XG5sZXQgcGVuZGluZyA9IHt9O1xuXG5mdW5jdGlvbiBzZW5kSnNvbihyZXEpIHtcbiAgdHJ5IHtcbiAgICBzZW5kUmF3KHJlcSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kUmVzdWx0KGlkLCByZXN1bHQpIHtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgcmVzdWx0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZW5kRXJyb3IoaWQsIGVycm9yKSB7XG4gIGNvbnN0IGVycm9yT2JqZWN0ID0ge1xuICAgIGNvZGU6IGVycm9yLmNvZGUsXG4gICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICBkYXRhOiBlcnJvci5kYXRhXG4gIH07XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIGVycm9yOiBlcnJvck9iamVjdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmF3KGRhdGEpIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlUnBjKGRhdGEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgY29uc29sZS5lcnJvcihkYXRhKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVScGMoanNvbikge1xuICBpZiAodHlwZW9mIGpzb24uaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YganNvbi5yZXN1bHQgIT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgIGpzb24uZXJyb3IgfHxcbiAgICAgIHR5cGVvZiBqc29uLm1ldGhvZCA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBzZW5kRXJyb3IoXG4gICAgICAgICAganNvbi5pZCxcbiAgICAgICAgICBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIGNhbGxiYWNrIGZvciBcIiArIGpzb24uaWQpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjay50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dChjYWxsYmFjay50aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgY2FsbGJhY2soanNvbi5lcnJvciwganNvbi5yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVSZXF1ZXN0KGpzb24pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVOb3RpZmljYXRpb24oanNvbik7XG4gIH1cbn1cblxubGV0IG1ldGhvZHMgPSB7fTtcblxuZnVuY3Rpb24gb25SZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XG4gIGlmICghbWV0aG9kc1ttZXRob2RdKSB7XG4gICAgdGhyb3cgbmV3IE1ldGhvZE5vdEZvdW5kKG1ldGhvZCk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXSguLi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVOb3RpZmljYXRpb24oanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIG1ldGhvZFwiKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmVzdWx0XG4gICAgICAgIC50aGVuKHJlcyA9PiBzZW5kUmVzdWx0KGpzb24uaWQsIHJlcykpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gc2VuZEVycm9yKGpzb24uaWQsIGVycikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kUmVzdWx0KGpzb24uaWQsIHJlc3VsdCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXR1cCA9IF9tZXRob2RzID0+IHtcbiAgT2JqZWN0LmFzc2lnbihtZXRob2RzLCBfbWV0aG9kcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kTm90aWZpY2F0aW9uID0gKG1ldGhvZCwgcGFyYW1zKSA9PiB7XG4gIHNlbmRKc29uKHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChtZXRob2QsIHBhcmFtcywgdGltZW91dCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGlkID0gcnBjSW5kZXg7XG4gICAgY29uc3QgcmVxID0geyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcywgaWQgfTtcbiAgICBycGNJbmRleCArPSAxO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnN0IGpzRXJyb3IgPSBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgICBqc0Vycm9yLmNvZGUgPSBlcnIuY29kZTtcbiAgICAgICAganNFcnJvci5kYXRhID0gZXJyLmRhdGE7XG4gICAgICAgIHJlamVjdChqc0Vycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgIH07XG5cbiAgICAvLyBzZXQgYSBkZWZhdWx0IHRpbWVvdXRcbiAgICBjYWxsYmFjay50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWxldGUgcGVuZGluZ1tpZF07XG4gICAgICByZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdCBcIiArIG1ldGhvZCArIFwiIHRpbWVkIG91dC5cIikpO1xuICAgIH0sIHRpbWVvdXQgfHwgMzAwMCk7XG5cbiAgICBwZW5kaW5nW2lkXSA9IGNhbGxiYWNrO1xuICAgIHNlbmRKc29uKHJlcSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuUlBDRXJyb3IgPSBSUENFcnJvcjtcbiIsImNvbnN0IGV2ZW50SGFuZGxlcnMgPSB7fTtcbmxldCBjdXJyZW50SWQgPSAwO1xuZXhwb3J0IGZ1bmN0aW9uIG9uKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBjb25zdCBpZCA9IGAke2N1cnJlbnRJZH1gO1xuICAgIGN1cnJlbnRJZCArPSAxO1xuICAgIGV2ZW50SGFuZGxlcnNbaWRdID0geyBoYW5kbGVyLCBuYW1lIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIGV2ZW50SGFuZGxlcnNbaWRdO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gb25jZShuYW1lLCBoYW5kbGVyKSB7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICByZXR1cm4gb24obmFtZSwgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKGRvbmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaGFuZGxlciguLi5hcmdzKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBlbWl0ID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCdcbiAgICA/IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKFtuYW1lLCAuLi5hcmdzXSk7XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBwbHVnaW5NZXNzYWdlOiBbbmFtZSwgLi4uYXJnc10sXG4gICAgICAgIH0sICcqJyk7XG4gICAgfTtcbmZ1bmN0aW9uIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKSB7XG4gICAgZm9yIChjb25zdCBpZCBpbiBldmVudEhhbmRsZXJzKSB7XG4gICAgICAgIGlmIChldmVudEhhbmRsZXJzW2lkXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXJzW2lkXS5oYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICgoX2EgPSBwYXJhbXNbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5qc29ucnBjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gcGFyYW1zWzBdO1xuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgfTtcbn1cbmVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiB2ZXJ5IGRpcnR5IGhhY2ssIG5lZWRzIGZpeGluZ1xuICAgICAgICBjb25zdCBmYWxsYmFjayA9IHdpbmRvdy5vbm1lc3NhZ2U7XG4gICAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgICAgICBmYWxsYmFjay5hcHBseSh3aW5kb3csIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IHBhcmFtc1swXTtcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlO1xuICAgICAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sIDEwMCk7XG59XG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBmaW5kUGFyZW50IH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIHNlcGFyYXRlU3RlcChub2Rlcykge1xuICAgIGNvbnN0IHBhcmVudFN0ZXAgPSBmaW5kUGFyZW50KG5vZGVzWzBdLCAobikgPT4gbi5uYW1lLnN0YXJ0c1dpdGgoJ3N0ZXAnKSk7XG4gICAgY29uc3QgZnJhbWUgPSBwYXJlbnRTdGVwLnBhcmVudDtcbiAgICBjb25zdCBpbmRleCA9IGZyYW1lLmNoaWxkcmVuLmZpbmRJbmRleCgobikgPT4gbiA9PSBwYXJlbnRTdGVwKTtcbiAgICBpZiAoIXBhcmVudFN0ZXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dCA9IGZpZ21hLmdyb3VwKG5vZGVzLCBmcmFtZSk7XG4gICAgaW5wdXQubmFtZSA9ICdpbnB1dCc7XG4gICAgY29uc3QgbmV3U3RlcCA9IGZpZ21hLmdyb3VwKFtpbnB1dF0sIGZyYW1lLCBpbmRleCk7XG4gICAgbmV3U3RlcC5uYW1lID0gcGFyZW50U3RlcC5uYW1lO1xufVxub24oJ3NlcGFyYXRlU3RlcCcsICgpID0+IHNlcGFyYXRlU3RlcChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pKTtcbiIsImV4cG9ydCBmdW5jdGlvbiBleHBvcnRUZXh0cygpIHtcbiAgICBjb25zdCB0ZXh0cyA9IGZpZ21hLmN1cnJlbnRQYWdlXG4gICAgICAgIC5maW5kQWxsKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJylcbiAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZS52aXNpYmxlKTtcbiAgICByZXR1cm4gKHRleHRzXG4gICAgICAgIC5tYXAoKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgdG4gPSBub2RlO1xuICAgICAgICByZXR1cm4gdG5cbiAgICAgICAgICAgIC5nZXRTdHlsZWRUZXh0U2VnbWVudHMoW1xuICAgICAgICAgICAgJ2ZvbnRTaXplJyxcbiAgICAgICAgICAgICdmb250TmFtZScsXG4gICAgICAgICAgICAnZm9udFdlaWdodCcsXG4gICAgICAgICAgICAndGV4dERlY29yYXRpb24nLFxuICAgICAgICAgICAgJ3RleHRDYXNlJyxcbiAgICAgICAgICAgICdsaW5lSGVpZ2h0JyxcbiAgICAgICAgICAgICdsZXR0ZXJTcGFjaW5nJyxcbiAgICAgICAgICAgICdmaWxscycsXG4gICAgICAgICAgICAndGV4dFN0eWxlSWQnLFxuICAgICAgICAgICAgJ2ZpbGxTdHlsZUlkJyxcbiAgICAgICAgICAgICdsaXN0T3B0aW9ucycsXG4gICAgICAgICAgICAnaW5kZW50YXRpb24nLFxuICAgICAgICAgICAgJ2h5cGVybGluaycsXG4gICAgICAgIF0pXG4gICAgICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJhY3RlcnMpXG4gICAgICAgICAgICAuam9pbignXFxcXCcpXG4gICAgICAgICAgICAudHJpbUVuZCgpO1xuICAgIH0pXG4gICAgICAgIC8vIHJlbW92ZSBhcnJheSBkdXBsaWNhdGVzXG4gICAgICAgIC5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSkpO1xufVxuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgYWRkVGFnLCBmaW5kQWxsLCBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE9yZGVyKGxlc3Nvbikge1xuICAgIGlmIChsZXNzb24uZmluZENoaWxkKChuKSA9PiAhIWdldFRhZ3MobikuZmluZCgodCkgPT4gL15vLS8udGVzdCh0KSkpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3VuZCBvLXRhZy4gZm9ybWF0T3JkZXIgYWJvcnQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHNldHRpbmdzID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc2V0dGluZ3MnKSk7XG4gICAgYWRkVGFnKHNldHRpbmdzLCAnb3JkZXItbGF5ZXJzJyk7XG4gICAgY29uc3QgbGF5ZXJSZWdleCA9IC9eKHMtbXVsdGlzdGVwLWJydXNoLXxzLW11bHRpc3RlcC1iZy0pKFxcZCspJC87XG4gICAgY29uc3Qgc3RlcHMgPSBsZXNzb24uZmluZENoaWxkcmVuKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykgJiYgIWdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgYWRkVGFnKHJlc3VsdCwgYG8tJHtzdGVwcy5sZW5ndGggKyAxfWApO1xuICAgIHN0ZXBzLnJldmVyc2UoKS5mb3JFYWNoKChzdGVwLCBvcmRlcikgPT4ge1xuICAgICAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIGNvbnN0IGxheWVyVGFnID0gdGFncy5maW5kKCh0KSA9PiBsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICBsZXQgbGF5ZXIgPSA0O1xuICAgICAgICBpZiAobGF5ZXJUYWcpIHtcbiAgICAgICAgICAgIGxheWVyID0gcGFyc2VJbnQobGF5ZXJSZWdleC5leGVjKGxheWVyVGFnKVsyXSk7XG4gICAgICAgICAgICB0YWdzID0gdGFncy5maWx0ZXIoKHQpID0+ICFsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgL14ocy1tdWx0aXN0ZXAtYnJ1c2h8cy1tdWx0aXN0ZXAtYmcpLy5leGVjKGxheWVyVGFnKVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RlcC5zZXRQbHVnaW5EYXRhKCdsYXllcicsIEpTT04uc3RyaW5naWZ5KGxheWVyKSk7XG4gICAgICAgIHRhZ3MucHVzaChgby0ke29yZGVyICsgMX1gKTtcbiAgICAgICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG4gICAgfSk7XG4gICAgbGV0IHNvcnRlZFN0ZXBzID0gc3RlcHMuc29ydCgoYSwgYikgPT4gSlNPTi5wYXJzZShiLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpIC1cbiAgICAgICAgSlNPTi5wYXJzZShhLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpKTtcbiAgICBzb3J0ZWRTdGVwcy5mb3JFYWNoKChzKSA9PiBsZXNzb24uaW5zZXJ0Q2hpbGQoMSwgcykpO1xufVxuZnVuY3Rpb24gYXV0b0Zvcm1hdCgpIHtcbiAgICBjb25zdCB0aHVtYlBhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZS50b1VwcGVyQ2FzZSgpID09ICdUSFVNQk5BSUxTJyk7XG4gICAgaWYgKHRodW1iUGFnZSkge1xuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gdGh1bWJQYWdlLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XG4gICAgICAgICAgICBjbG9uZS5yZXNpemUoNDAwLCA0MDApO1xuICAgICAgICAgICAgY2xvbmUubmFtZSA9ICd0aHVtYm5haWwnO1xuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICBpZiAob2xkTGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSAnbGVzc29uJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnkgPSBsZXNzb25GcmFtZS55O1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xuICAgICAgICBuLnggPSAxMDtcbiAgICAgICAgbi55ID0gMTA7XG4gICAgfSk7XG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zdGVwIHMtbXVsdGlzdGVwLXJlc3VsdC8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0ubmFtZSA9ICd0ZW1wbGF0ZSc7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0ubmFtZSA9ICcvaWdub3JlJztcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDYwO1xuICAgIH0pO1xufVxub24oJ2F1dG9Gb3JtYXQnLCBhdXRvRm9ybWF0KTtcbm9uKCdmb3JtYXRPcmRlcicsICgpID0+IGZvcm1hdE9yZGVyKGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRDaGlsZCgodCkgPT4gdC5uYW1lID09ICdsZXNzb24nKSkpO1xuIiwiaW1wb3J0ICcuL2NyZWF0ZSc7XG5pbXBvcnQgJy4vdHVuZSc7XG5pbXBvcnQgJy4vZm9ybWF0JztcbmltcG9ydCAnLi9saW50ZXInO1xuaW1wb3J0ICcuL3B1Ymxpc2gnO1xuaW1wb3J0ICcuLi9ycGMtYXBpJztcbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG5maWdtYS51aS5yZXNpemUoMzQwLCA0NTApO1xuY29uc29sZS5jbGVhcigpO1xuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgcHJpbnQsIGdldFRhZ3MsIGZpbmRBbGwgfSBmcm9tICcuL3V0aWwnO1xubGV0IGVycm9ycyA9IFtdO1xubGV0IHpvb21TY2FsZSA9IDE7XG5sZXQgbWF4QnMgPSAxMi44O1xubGV0IG9yZGVyID0gJ3N0ZXBzJztcbnZhciBFcnJvckxldmVsO1xuKGZ1bmN0aW9uIChFcnJvckxldmVsKSB7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiRVJST1JcIl0gPSAwXSA9IFwiRVJST1JcIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJXQVJOXCJdID0gMV0gPSBcIldBUk5cIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcbn0pKEVycm9yTGV2ZWwgfHwgKEVycm9yTGV2ZWwgPSB7fSkpO1xuZnVuY3Rpb24gc2VsZWN0RXJyb3IoaW5kZXgpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICgoX2EgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFnZSkge1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IGVycm9yc1tpbmRleF0ucGFnZTtcbiAgICB9XG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1tpbmRleF0ucGFnZS5zZWxlY3Rpb24gPSBbZXJyb3JzW2luZGV4XS5ub2RlXTtcbiAgICB9XG59XG5mdW5jdGlvbiBwcmludEVycm9ycygpIHtcbiAgICBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpO1xuICAgIHNlbGVjdEVycm9yKDApO1xuICAgIGxldCB0ZXh0ID0gZXJyb3JzXG4gICAgICAgIC5tYXAoKGUpID0+IHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIHJldHVybiBgJHtFcnJvckxldmVsW2UubGV2ZWxdfVxcdHwgJHtlLmVycm9yfSB8IFBBR0U6JHsoKF9hID0gZS5wYWdlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkgfHwgJyd9ICR7KF9iID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudHlwZX06JHsoKF9jID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MubmFtZSkgfHwgJyd9YDtcbiAgICB9KVxuICAgICAgICAuam9pbignXFxuJyk7XG4gICAgdGV4dCArPSAnXFxuRG9uZSc7XG4gICAgcHJpbnQodGV4dCk7XG59XG5mdW5jdGlvbiBhc3NlcnQodmFsLCBlcnJvciwgcGFnZSwgbm9kZSwgbGV2ZWwgPSBFcnJvckxldmVsLkVSUk9SKSB7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goeyBub2RlLCBwYWdlLCBlcnJvciwgbGV2ZWwgfSk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5mdW5jdGlvbiBkZWVwTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZWVwTm9kZXMobikpO1xufVxuZnVuY3Rpb24gZGVzY2VuZGFudHMobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gW25vZGUsIC4uLm5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVzY2VuZGFudHMobikpXTtcbn1cbmZ1bmN0aW9uIGRlc2NlbmRhbnRzV2l0aG91dFNlbGYobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlc2NlbmRhbnRzKG4pKTtcbn1cbmZ1bmN0aW9uIGxpbnRWZWN0b3IocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eXFwvfF5kcmF3LWxpbmUkfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbGlwJHxeVmVjdG9yJHxeXFxkKyR8XkVsbGlwc2UkfF5SZWN0YW5nbGUkLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgbGV0IGZpbGxzID0gbm9kZS5maWxscztcbiAgICBsZXQgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcztcbiAgICBhc3NlcnQoIWZpbGxzLmxlbmd0aCB8fCAhc3Ryb2tlcy5sZW5ndGgsICdTaG91bGQgbm90IGhhdmUgZmlsbCtzdHJva2UnLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIHN0cm9rZXMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBhc3NlcnQocy52aXNpYmxlLCAnU3Ryb2tlIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQocy50eXBlID09ICdTT0xJRCcsICdTdHJva2UgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBsZXQgczEgPSBzO1xuICAgICAgICBhc3NlcnQoczEuY29sb3IuciAhPSAwIHx8IHMxLmNvbG9yLmcgIT0gMCB8fCBzMS5jb2xvci5iICE9IDAsICdTdHJva2UgY29sb3IgbXVzdCBub3QgYmUgYmxhY2snLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KHMxLmNvbG9yLnIgIT0gMSB8fCBzMS5jb2xvci5nICE9IDEgfHwgczEuY29sb3IuYiAhPSAxLCAnU3Ryb2tlIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgZmlsbHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICBhc3NlcnQoZi52aXNpYmxlLCAnRmlsbCBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KGYudHlwZSA9PSAnU09MSUQnLCAnRmlsbCBtdXN0IGJlIHNvbGlkJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGxldCBmMSA9IGY7XG4gICAgICAgIGFzc2VydChmMS5jb2xvci5yICE9IDAgfHwgZjEuY29sb3IuZyAhPSAwIHx8IGYxLmNvbG9yLmIgIT0gMCwgJ0ZpbGwgY29sb3IgbXVzdCBub3QgYmUgYmxhY2snLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KGYxLmNvbG9yLnIgIT0gMSB8fCBmMS5jb2xvci5nICE9IDEgfHwgZjEuY29sb3IuYiAhPSAxLCAnRmlsbCBjb2xvciBtdXN0IG5vdCBiZSB3aGl0ZScsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgL1JPVU5EfE5PTkUvLnRlc3QoU3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKSksIGBTdHJva2UgY2FwcyBtdXN0IGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VDYXApfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLkVSUk9SKTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IG5vZGUuc3Ryb2tlSm9pbiA9PSAnUk9VTkQnLCBgU3Ryb2tlIGpvaW5zIHNob3VsZCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlSm9pbil9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJHxeZHJhdy1saW5lJC8udGVzdChzKSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJyBvciAnZHJhdy1saW5lJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydCghL0JPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KG5vZGUudHlwZSksICdOb3RpY2UgQk9PTEVBTl9PUEVSQVRJT04nLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBjb25zdCByZ2J0ID0gdGFncy5maW5kKChzKSA9PiAvXnJnYi10ZW1wbGF0ZSQvLnRlc3QocykpO1xuICAgIGNvbnN0IGFuaW0gPSB0YWdzLmZpbmQoKHMpID0+IC9eYmxpbmskLy50ZXN0KHMpKTtcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cbn1cbmZ1bmN0aW9uIGxpbnRJbnB1dChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdHUk9VUCcsIFwiTXVzdCBiZSAnR1JPVVAnIHR5cGUnXCIsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUubmFtZSA9PSAnaW5wdXQnLCBcIk11c3QgYmUgJ2lucHV0J1wiLCBwYWdlLCBub2RlKTtcbiAgICBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdCh2LnR5cGUpKSB7XG4gICAgICAgICAgICBsaW50R3JvdXAocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRWZWN0b3IocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnR1JPVVAvVkVDVE9SL1JFQ1RBTkdMRS9FTExJUFNFL1RFWFQnIHR5cGVcIiwgcGFnZSwgdik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGxpbnRTZXR0aW5ncyhwYWdlLCBub2RlKSB7XG4gICAgdmFyIF9hO1xuICAgIGFzc2VydChub2RlLnR5cGUgPT0gJ0VMTElQU0UnLCBcIk11c3QgYmUgJ0VMTElQU0UnIHR5cGUnXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXnNldHRpbmdzJHxeY2FwdHVyZS1jb2xvciR8Xnpvb20tc2NhbGUtXFxkKyR8Xm9yZGVyLWxheWVycyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5icnVzaC1uYW1lLVxcdyskfF5zcy1cXGQrJHxeYnMtXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgaWYgKHRhZ3MuZmluZCgodGFnKSA9PiAvXm9yZGVyLWxheWVycyQvLnRlc3QodGFnKSkpIHtcbiAgICAgICAgb3JkZXIgPSAnbGF5ZXJzJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9yZGVyID0gJ3N0ZXBzJztcbiAgICB9XG4gICAgem9vbVNjYWxlID0gcGFyc2VJbnQoKChfYSA9IHRhZ3MuZmluZCgocykgPT4gL156b29tLXNjYWxlLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3pvb20tc2NhbGUtJywgJycpKSB8fFxuICAgICAgICAnMScpO1xuICAgIGFzc2VydCh6b29tU2NhbGUgPj0gMSAmJiB6b29tU2NhbGUgPD0gNSwgYE11c3QgYmUgMSA8PSB6b29tLXNjYWxlIDw9IDUgKCR7em9vbVNjYWxlfSlgLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRTdGVwKHBhZ2UsIHN0ZXApIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICghYXNzZXJ0KHN0ZXAudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBzdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChzdGVwLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xec3RlcCR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XmNsZWFyLWxheWVyLVxcZCskfF5zcy1cXGQrJHxeYnMtXFxkKyR8Xm8tXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgLy8gYXNzZXJ0KCEvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYmckLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgaXMgb2Jzb2xldGVgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIH0pO1xuICAgIGNvbnN0IGJnID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJnJHxecy1tdWx0aXN0ZXAtYmctXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJydXNoID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IHNzID0gcGFyc2VJbnQoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnNzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3NzLScsICcnKSk7XG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KChfYiA9IHRhZ3MuZmluZCgocykgPT4gL15icy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZXBsYWNlKCdicy0nLCAnJykpO1xuICAgIG1heEJzID0gTWF0aC5tYXgoYnMgPyBicyA6IG1heEJzLCBtYXhCcyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAxNSwgJ3NzIG11c3QgYmUgPj0gMTUnLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIXNzIHx8ICFicyB8fCBzcyA+IGJzLCAnc3MgbXVzdCBiZSA+IGJzJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA8PSB6b29tU2NhbGUgKiAxMi44LCBgYnMgbXVzdCBiZSA8PSAke3pvb21TY2FsZSAqIDEyLjh9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzID49IHpvb21TY2FsZSAqIDAuNDQsIGBicyBtdXN0IGJlID49ICR7em9vbVNjYWxlICogMC40NH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghbyB8fCBvcmRlciA9PSAnbGF5ZXJzJywgYCR7b30gbXVzdCBiZSB1c2VkIG9ubHkgd2l0aCBzZXR0aW5ncyBvcmRlci1sYXllcnNgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQob3JkZXIgIT09ICdsYXllcnMnIHx8ICEhbywgJ011c3QgaGF2ZSBvLU4gb3JkZXIgbnVtYmVyJywgcGFnZSwgc3RlcCk7XG4gICAgY29uc3QgZmYgPSBzdGVwLmZpbmRPbmUoKG4pID0+IG4uZmlsbHMgJiYgbi5maWxsc1swXSk7XG4gICAgY29uc3Qgc2YgPSBzdGVwLmZpbmRPbmUoKG4pID0+IHsgdmFyIF9hOyByZXR1cm4gKChfYSA9IG4uc3Ryb2tlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwOyB9KTtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiBzZiksICdTaG91bGQgbm90IHVzZSBiZytzcyAoc3Ryb2tlIHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiAhc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBub3QgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLldBUk4pO1xuICAgIGFzc2VydCghYmcgfHwgISFmZiwgXCJiZyBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGhvdXQgZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIWJydXNoIHx8ICFmZiwgXCJicnVzaCBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGggZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBzdGVwLmNoaWxkcmVuLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgaWYgKG4ubmFtZSA9PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICBsaW50SW5wdXQocGFnZSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobi5uYW1lID09PSAndGVtcGxhdGUnKSB7XG4gICAgICAgICAgICAvLyBsaW50IHRlbXBsYXRlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnaW5wdXQnIG9yICd0ZW1wbGF0ZSdcIiwgcGFnZSwgbik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBibGlua05vZGVzID0gZmluZEFsbChzdGVwLCAobikgPT4gZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXmJsaW5rJC8udGVzdCh0KSkgIT09IHVuZGVmaW5lZCkuZmxhdE1hcChkZWVwTm9kZXMpO1xuICAgIGNvbnN0IGZpbGxlZE5vZGUgPSBibGlua05vZGVzLmZpbmQoKG4pID0+IG4uZmlsbHNbMF0pO1xuICAgIGFzc2VydChibGlua05vZGVzLmxlbmd0aCA9PSAwIHx8ICEhZmlsbGVkTm9kZSB8fCBibGlua05vZGVzLmxlbmd0aCA+IDMsICdTaG91bGQgdXNlIGRyYXctbGluZSBpZiA8IDQgbGluZXMnLCBwYWdlLCBibGlua05vZGVzWzBdLCBFcnJvckxldmVsLklORk8pO1xufVxuZnVuY3Rpb24gbGludFRhc2tGcmFtZShwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSAxMzY2ICYmIG5vZGUuaGVpZ2h0ID09IDEwMjQsICdNdXN0IGJlIDEzNjZ4MTAyNCcsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghIW5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpLCBcIk11c3QgaGF2ZSAncy1tdWx0aXN0ZXAtcmVzdWx0JyBjaGlsZFwiLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgc2V0dGluZ3MgPSBub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKTtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcbiAgICB9XG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShcXGQrKSQvLmV4ZWModGFnKTtcbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvID0gZm91bmRbMV07XG4gICAgICAgICAgICBhc3NlcnQoIW9yZGVyTnVtYmVyc1tvXSwgYE11c3QgaGF2ZSB1bmlxdWUgJHt0YWd9IHZhbHVlc2AsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBvcmRlck51bWJlcnNbb10gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKSB7XG4gICAgICAgICAgICBsaW50U3RlcChwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdzZXR0aW5ncycgb3IgJ3N0ZXAnXCIsIHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzc2VydChtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsIGB6b29tLXNjYWxlICR7em9vbVNjYWxlfSBtdXN0IGJlICR7TWF0aC5jZWlsKG1heEJzIC8gMTIuOCl9IGZvciBtYXggYnMgJHttYXhCc30gdXNlZGAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFRodW1ibmFpbChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDQwMCAmJiBub2RlLmhlaWdodCA9PSA0MDAsICdNdXN0IGJlIDQwMHg0MDAnLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRQYWdlKHBhZ2UpIHtcbiAgICBpZiAoL15cXC98XklOREVYJC8udGVzdChwYWdlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFxcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL15sZXNzb24kLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ2xlc3NvbidcIiwgcGFnZSk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBwYWdlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChub2RlLm5hbWUgPT0gJ2xlc3NvbicpIHtcbiAgICAgICAgICAgIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09ICd0aHVtYm5haWwnKSB7XG4gICAgICAgICAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KC9eXFwvLy50ZXN0KG5vZGUubmFtZSksIFwiTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBsaW50SW5kZXgocGFnZSkge1xuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsICdJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudCcsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcbiAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIHBhZ2UuY2hpbGRyZW5bMF0pO1xufVxuZnVuY3Rpb24gbGludENvdXJzZSgpIHtcbiAgICBhc3NlcnQoL15DT1VSU0UtW2EtelxcLTAtOV0rJC8udGVzdChmaWdtYS5yb290Lm5hbWUpLCBgQ291cnNlIG5hbWUgJyR7ZmlnbWEucm9vdC5uYW1lfScgbXVzdCBtYXRjaCBDT1VSU0UtW2EtelxcXFwtMC05XStgKTtcbiAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lID09ICdJTkRFWCcpO1xuICAgIGlmIChhc3NlcnQoISFpbmRleCwgXCJNdXN0IGhhdmUgJ0lOREVYJyBwYWdlXCIpKSB7XG4gICAgICAgIGxpbnRJbmRleChpbmRleCk7XG4gICAgfVxuICAgIC8vIGZpbmQgYWxsIG5vbi11bmlxdWUgbmFtZWQgcGFnZXNcbiAgICBjb25zdCBub25VbmlxdWUgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbHRlcigocCwgaSwgYSkgPT4gYS5maW5kSW5kZXgoKHAyKSA9PiBwMi5uYW1lID09IHAubmFtZSkgIT0gaSk7XG4gICAgbm9uVW5pcXVlLmZvckVhY2goKHApID0+IGFzc2VydChmYWxzZSwgYFBhZ2UgbmFtZSAnJHtwLm5hbWV9JyBtdXN0IGJlIHVuaXF1ZWAsIHApKTtcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgbGludFBhZ2UocGFnZSk7XG4gICAgfVxufVxub24oJ3NlbGVjdEVycm9yJywgc2VsZWN0RXJyb3IpO1xub24oJ2xpbnRDb3Vyc2UnLCAoKSA9PiB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludENvdXJzZSgpO1xuICAgIHByaW50RXJyb3JzKCk7XG59KTtcbm9uKCdsaW50UGFnZScsICgpID0+IHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBsaW50UGFnZShmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgcHJpbnRFcnJvcnMoKTtcbn0pO1xuLy8gbm8gaGlkZGVuIGZpbGwvc3Ryb2tlXG4vLyBubyBlZmZlY3RzXG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGNhcGl0YWxpemUsIHByaW50IH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgXCJ0YXNrLW5hbWUgJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKHBhZ2UubmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XG5cImNvdXJzZS1kZXNjcmlwdGlvbiAke2NvdXJzZU5hbWV9XCIgPSBcIkluIHRoaXMgY291cnNlOlxuICAgIOKAoiBcbiAgICDigKIgXG4gICAg4oCiIFwiO1xuJHt0YXNrc31cbmA7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TGVzc29uKHBhZ2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcbiAgICAgICAgY29uc3QgbGVzc29uTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgZm9ybWF0OiAnU1ZHJyxcbiAgICAgICAgICAgIC8vIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsID0geWllbGQgdGh1bWJuYWlsTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxuICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291cnNlUGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXG4gICAgICAgICAgICBwYXRoOiBwYWdlLm5hbWUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IFtsZXNzb25zLCB0aHVtYm5haWxdID0geWllbGQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5tYXAoKHBhZ2UpID0+IGV4cG9ydExlc3NvbihwYWdlKSkpLFxuICAgICAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maW5kKChwYWdlKSA9PiBwYWdlLm5hbWUgPT0gJ0lOREVYJylcbiAgICAgICAgICAgICAgICAuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIGxlc3NvbnMsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVN3aWZ0Q29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWVcbiAgICAgICAgLnNwbGl0KCctJylcbiAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICBzd2lmdENvdXJzZU5hbWUgPVxuICAgICAgICBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICBsZXQgJHtzd2lmdENvdXJzZU5hbWV9ID0gQ291cnNlKFxuICAgIHBhdGg6IFwiJHtjb3Vyc2VOYW1lfVwiLFxuICAgIGF1dGhvcjogUkVQTEFDRSxcbiAgICB0YXNrczogW1xuJHt0YXNrc30gICAgXSlcbmA7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKSB7XG4gICAgY29uc3QgY29kZSA9IGdlbmVyYXRlU3dpZnRDb2RlKCkgKyBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKTtcbiAgICBwcmludChjb2RlKTtcbn1cbm9uKCdnZW5lcmF0ZUNvZGUnLCBnZW5lcmF0ZUNvZGUpO1xuIiwiaW1wb3J0IHsgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBOb2RlcygpIHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgcmV0dXJuIHN0ZXBzQnlPcmRlcihsZXNzb24pLm1hcCgoc3RlcCkgPT4ge1xuICAgICAgICByZXR1cm4geyBpZDogc3RlcC5pZCwgbmFtZTogc3RlcC5uYW1lIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcE9yZGVyKHN0ZXBzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGxlc3Nvbi5maW5kT25lKChlbCkgPT4gZWwuaWQgPT0gc3RlcC5pZCk7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICBzLm5hbWUgPSBzLm5hbWUucmVwbGFjZSgvby1cXGQrLywgJ28tJyArIChpICsgMSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBlbWl0LCBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIGdldFRhZyhzdGVwLCB0YWcpIHtcbiAgICBjb25zdCB2ID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgodGFnKSk7XG4gICAgcmV0dXJuIHYgPyB2LnJlcGxhY2UodGFnLCAnJykgOiAnMCc7XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGVsZXRlVG1wKCkge1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlXG4gICAgICAgIC5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlKCkpO1xufVxubGV0IGxhc3RQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiAvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZWwudHlwZSkpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFdlaWdodCA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDMwIDogNTA7XG4gICAgICAgICAgICBlbC5zdHJva2VXZWlnaHQgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCBkZWZhdWx0V2VpZ2h0O1xuICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBwaW5rLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICBwaW5rLm5hbWUgPSAncGluayAnICsgZWwubmFtZTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICAgICAgLy8gY2xvbmUgZWxlbWVudCBoZXJlIGFuZCBnaXZlIGhpbSB0aGluIHBpbmsgc3Ryb2tlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMC4xLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgIHRlbXBsYXRlLnggPSBpbnB1dC5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXSAtIGxlc3Nvbi5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXTtcbiAgICB0ZW1wbGF0ZS55ID0gaW5wdXQuYWJzb2x1dGVUcmFuc2Zvcm1bMV1bMl0gLSBsZXNzb24uYWJzb2x1dGVUcmFuc2Zvcm1bMV1bMl07XG59XG5mdW5jdGlvbiBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCkge1xuICAgIGNvbnN0IGRlZmF1bHRCUyA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDEyLjggOiAxMDtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IGRlZmF1bHRCUztcbiAgICBjb25zdCBzbWFsbExpbmUgPSBmaWdtYS5jcmVhdGVMaW5lKCk7XG4gICAgc21hbGxMaW5lLm5hbWUgPSAnc21hbGxMaW5lJztcbiAgICBzbWFsbExpbmUucmVzaXplKDMwMCwgMCk7XG4gICAgc21hbGxMaW5lLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLjgsIGI6IDAgfSB9XTtcbiAgICBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgLyAzO1xuICAgIHNtYWxsTGluZS5zdHJva2VDYXAgPSAnUk9VTkQnO1xuICAgIHNtYWxsTGluZS5zdHJva2VBbGlnbiA9ICdDRU5URVInO1xuICAgIHNtYWxsTGluZS55ID0gc21hbGxMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgYmlnTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xuICAgIGJpZ0xpbmUubmFtZSA9ICdiaWdMaW5lJztcbiAgICBiaWdMaW5lLm9wYWNpdHkgPSAwLjM7XG4gICAgYmlnTGluZS5zdHJva2VXZWlnaHQgPSBicyArIE1hdGgucG93KGJzLCAxLjQpICogMC44O1xuICAgIGJpZ0xpbmUueSA9IGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcbiAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKFtiaWdMaW5lLCBzbWFsbExpbmVdLCBsZXNzb24ucGFyZW50KTtcbiAgICBncm91cC5uYW1lID0gJ3RtcC1icyc7XG4gICAgZ3JvdXAueCA9IGxlc3Nvbi54O1xuICAgIGdyb3VwLnkgPSBsZXNzb24ueSAtIDgwO1xufVxuZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwYWdlLCBzZXR0aW5ncykge1xuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBsYXN0TW9kZSA9IHNldHRpbmdzLmRpc3BsYXlNb2RlO1xuICAgIGNvbnN0IHsgZGlzcGxheU1vZGUsIHN0ZXBOdW1iZXIgfSA9IHNldHRpbmdzO1xuICAgIGNvbnN0IGxlc3NvbiA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIGlmICghbGVzc29uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3N0ZXBOdW1iZXIgLSAxXTtcbiAgICBwYWdlLnNlbGVjdGlvbiA9IFtzdGVwXTtcbiAgICBjb25zdCBzdGVwQ291bnQgPSBsZXNzb24uY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpLmxlbmd0aDtcbiAgICBlbWl0KCd1cGRhdGVGb3JtJywge1xuICAgICAgICBzaGFkb3dTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSxcbiAgICAgICAgYnJ1c2hTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSxcbiAgICAgICAgdGVtcGxhdGU6IGdldFRhZyhzdGVwLCAncy0nKSxcbiAgICAgICAgc3RlcENvdW50LFxuICAgICAgICBzdGVwTnVtYmVyLFxuICAgICAgICBkaXNwbGF5TW9kZSxcbiAgICB9KTtcbiAgICBkZWxldGVUbXAoKTtcbiAgICBzd2l0Y2ggKGRpc3BsYXlNb2RlKSB7XG4gICAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjdXJyZW50JzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgc3RlcHNCeU9yZGVyKGxlc3NvbikuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGkgPCBzdGVwTnVtYmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGVtcGxhdGUnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgZGlzcGxheVRlbXBsYXRlKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbn0sIDE1MDApO1xuZnVuY3Rpb24gdXBkYXRlUHJvcHMoc2V0dGluZ3MpIHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3NldHRpbmdzLnN0ZXBOdW1iZXIgLSAxXTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCdzcy0nKSAmJiAhdC5zdGFydHNXaXRoKCdicy0nKSAmJiAhdC5zdGFydHNXaXRoKCdzLScpKTtcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcbiAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgYHMtJHtzZXR0aW5ncy50ZW1wbGF0ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBzcy0ke3NldHRpbmdzLnNoYWRvd1NpemV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBicy0ke3NldHRpbmdzLmJydXNoU2l6ZX1gKTtcbiAgICB9XG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG59XG5vbigndXBkYXRlRGlzcGxheScsIChzZXR0aW5ncykgPT4gdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgc2V0dGluZ3MpKTtcbm9uKCd1cGRhdGVQcm9wcycsIHVwZGF0ZVByb3BzKTtcbmZpZ21hLm9uKCdjdXJyZW50cGFnZWNoYW5nZScsICgpID0+IHtcbiAgICB1cGRhdGVEaXNwbGF5KGxhc3RQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbn0pO1xuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgY29uc3Qgc3RlcCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBpZiAoIXN0ZXAgfHwgIWxlc3NvbiB8fCAhbGVzc29uLmNoaWxkcmVuLmluY2x1ZGVzKHN0ZXApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RlcE51bWJlciA9IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgKyAxO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IGxhc3RNb2RlLCBzdGVwTnVtYmVyIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBlbWl0IH0gZnJvbSAnLi4vZXZlbnRzJztcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQWxsKG5vZGUsIGYpIHtcbiAgICBsZXQgYXJyID0gW107XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgYXJyLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdChjaGlsZHJlbi5mbGF0TWFwKChwKSA9PiBmaW5kQWxsKHAsIGYpKSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudChub2RlLCBmKSB7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGlmIChub2RlLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudChub2RlLnBhcmVudCwgZik7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZ3Mobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5hbWUuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbik7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkVGFnKG5vZGUsIHRhZykge1xuICAgIG5vZGUubmFtZSA9IGdldFRhZ3Mobm9kZSkuY29uY2F0KFt0YWddKS5qb2luKCcgJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJpbnQodGV4dCkge1xuICAgIGZpZ21hLnVpLnJlc2l6ZSg3MDAsIDQwMCk7XG4gICAgZW1pdCgncHJpbnQnLCB0ZXh0KTtcbn1cbmV4cG9ydCBjb25zdCBjYXBpdGFsaXplID0gKHMpID0+IHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBjcmVhdGVQbHVnaW5BUEksIGNyZWF0ZVVJQVBJIH0gZnJvbSAnZmlnbWEtanNvbnJwYyc7XG5pbXBvcnQgeyBleHBvcnRUZXh0cyB9IGZyb20gJy4vcGx1Z2luL2Zvcm1hdC1ycGMnO1xuaW1wb3J0IHsgZXhwb3J0TGVzc29uLCBleHBvcnRDb3Vyc2UgfSBmcm9tICcuL3BsdWdpbi9wdWJsaXNoJztcbmltcG9ydCB7IGdldFN0ZXBOb2Rlcywgc2V0U3RlcE9yZGVyIH0gZnJvbSAnLi9wbHVnaW4vdHVuZS1ycGMnO1xuLy8gRmlnbWEgcGx1Z2luIG1ldGhvZHNcbmV4cG9ydCBjb25zdCBwbHVnaW5BcGkgPSBjcmVhdGVQbHVnaW5BUEkoe1xuICAgIHNldFNlc3Npb25Ub2tlbih0b2tlbikge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnc2Vzc2lvblRva2VuJywgdG9rZW4pO1xuICAgIH0sXG4gICAgZ2V0U2Vzc2lvblRva2VuKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGV4cG9ydExlc3NvbixcbiAgICBleHBvcnRDb3Vyc2UsXG4gICAgZ2V0U3RlcE5vZGVzLFxuICAgIHNldFN0ZXBPcmRlcixcbiAgICBleHBvcnRUZXh0cyxcbn0pO1xuLy8gRmlnbWEgVUkgYXBwIG1ldGhvZHNcbmV4cG9ydCBjb25zdCB1aUFwaSA9IGNyZWF0ZVVJQVBJKHt9KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=