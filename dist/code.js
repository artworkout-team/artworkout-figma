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
    updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWlDO0FBQzFCO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBLElBQUksb0RBQUk7QUFDUjtBQUNPOzs7Ozs7Ozs7Ozs7O0FDOUJQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUM2RDtBQUNYO0FBQ1k7QUFDQztBQUMvRDtBQUNPLGtCQUFrQixxRUFBZTtBQUN4QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSwwRUFBWTtBQUNoQixJQUFJLDBFQUFZO0FBQ2hCLElBQUksMkVBQVk7QUFDaEIsSUFBSSwyRUFBWTtBQUNoQixJQUFJLDJFQUFXO0FBQ2YsQ0FBQztBQUNEO0FBQ08sY0FBYyxpRUFBVyxHQUFHIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2luZGV4LnRzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMuUGFyc2VFcnJvciA9IGNsYXNzIFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIlBhcnNlIGVycm9yXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNzAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUmVxdWVzdCA9IGNsYXNzIEludmFsaWRSZXF1ZXN0IGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnZhbGlkIFJlcXVlc3RcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLk1ldGhvZE5vdEZvdW5kID0gY2xhc3MgTWV0aG9kTm90Rm91bmQgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIk1ldGhvZCBub3QgZm91bmRcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDE7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRQYXJhbXMgPSBjbGFzcyBJbnZhbGlkUGFyYW1zIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnZhbGlkIHBhcmFtc1wiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW50ZXJuYWxFcnJvciA9IGNsYXNzIEludGVybmFsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludGVybmFsIGVycm9yXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAzO1xuICB9XG59O1xuIiwiY29uc3QgeyBzZXR1cCwgc2VuZFJlcXVlc3QgfSA9IHJlcXVpcmUoXCIuL3JwY1wiKTtcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlVUlBUEkgPSBmdW5jdGlvbiBjcmVhdGVVSUFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBtZXRob2RzW3BdKC4uLnBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHAsIHBhcmFtcywgdGltZW91dCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUGx1Z2luQVBJID0gZnVuY3Rpb24gY3JlYXRlUGx1Z2luQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBtZXRob2RzW3BdKC4uLnBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHAsIHBhcmFtcywgdGltZW91dCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xufTtcbiIsImNvbnN0IFJQQ0Vycm9yID0gcmVxdWlyZShcIi4vZXJyb3JzXCIpO1xuY29uc3QgeyBNZXRob2ROb3RGb3VuZCB9ID0gcmVxdWlyZShcIi4vZXJyb3JzXCIpO1xuXG5sZXQgc2VuZFJhdztcblxuaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBmaWdtYS51aS5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gaGFuZGxlUmF3KG1lc3NhZ2UpKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gZmlnbWEudWkucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG59IGVsc2UgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgb25tZXNzYWdlID0gZXZlbnQgPT4gaGFuZGxlUmF3KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IG1lc3NhZ2UgfSwgXCIqXCIpO1xufVxuXG5sZXQgcnBjSW5kZXggPSAwO1xubGV0IHBlbmRpbmcgPSB7fTtcblxuZnVuY3Rpb24gc2VuZEpzb24ocmVxKSB7XG4gIHRyeSB7XG4gICAgc2VuZFJhdyhyZXEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VuZFJlc3VsdChpZCwgcmVzdWx0KSB7XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIHJlc3VsdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VuZEVycm9yKGlkLCBlcnJvcikge1xuICBjb25zdCBlcnJvck9iamVjdCA9IHtcbiAgICBjb2RlOiBlcnJvci5jb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgZGF0YTogZXJyb3IuZGF0YVxuICB9O1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICBlcnJvcjogZXJyb3JPYmplY3RcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJhdyhkYXRhKSB7XG4gIHRyeSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGhhbmRsZVJwYyhkYXRhKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIGNvbnNvbGUuZXJyb3IoZGF0YSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlUnBjKGpzb24pIHtcbiAgaWYgKHR5cGVvZiBqc29uLmlkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYgKFxuICAgICAgdHlwZW9mIGpzb24ucmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICBqc29uLmVycm9yIHx8XG4gICAgICB0eXBlb2YganNvbi5tZXRob2QgPT09IFwidW5kZWZpbmVkXCJcbiAgICApIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gcGVuZGluZ1tqc29uLmlkXTtcbiAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgc2VuZEVycm9yKFxuICAgICAgICAgIGpzb24uaWQsXG4gICAgICAgICAgbmV3IFJQQ0Vycm9yLkludmFsaWRSZXF1ZXN0KFwiTWlzc2luZyBjYWxsYmFjayBmb3IgXCIgKyBqc29uLmlkKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoY2FsbGJhY2sudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoY2FsbGJhY2sudGltZW91dCk7XG4gICAgICB9XG4gICAgICBkZWxldGUgcGVuZGluZ1tqc29uLmlkXTtcbiAgICAgIGNhbGxiYWNrKGpzb24uZXJyb3IsIGpzb24ucmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlUmVxdWVzdChqc29uKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlTm90aWZpY2F0aW9uKGpzb24pO1xuICB9XG59XG5cbmxldCBtZXRob2RzID0ge307XG5cbmZ1bmN0aW9uIG9uUmVxdWVzdChtZXRob2QsIHBhcmFtcykge1xuICBpZiAoIW1ldGhvZHNbbWV0aG9kXSkge1xuICAgIHRocm93IG5ldyBNZXRob2ROb3RGb3VuZChtZXRob2QpO1xuICB9XG4gIHJldHVybiBtZXRob2RzW21ldGhvZF0oLi4ucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTm90aWZpY2F0aW9uKGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgbmV3IFJQQ0Vycm9yLkludmFsaWRSZXF1ZXN0KFwiTWlzc2luZyBtZXRob2RcIikpO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xuICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJlc3VsdFxuICAgICAgICAudGhlbihyZXMgPT4gc2VuZFJlc3VsdChqc29uLmlkLCByZXMpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHNlbmRFcnJvcihqc29uLmlkLCBlcnIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZFJlc3VsdChqc29uLmlkLCByZXN1bHQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIGVycik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuc2V0dXAgPSBfbWV0aG9kcyA9PiB7XG4gIE9iamVjdC5hc3NpZ24obWV0aG9kcywgX21ldGhvZHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc2VuZE5vdGlmaWNhdGlvbiA9IChtZXRob2QsIHBhcmFtcykgPT4ge1xuICBzZW5kSnNvbih7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc2VuZFJlcXVlc3QgPSAobWV0aG9kLCBwYXJhbXMsIHRpbWVvdXQpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBpZCA9IHJwY0luZGV4O1xuICAgIGNvbnN0IHJlcSA9IHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMsIGlkIH07XG4gICAgcnBjSW5kZXggKz0gMTtcbiAgICBjb25zdCBjYWxsYmFjayA9IChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zdCBqc0Vycm9yID0gbmV3IEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAganNFcnJvci5jb2RlID0gZXJyLmNvZGU7XG4gICAgICAgIGpzRXJyb3IuZGF0YSA9IGVyci5kYXRhO1xuICAgICAgICByZWplY3QoanNFcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICB9O1xuXG4gICAgLy8gc2V0IGEgZGVmYXVsdCB0aW1lb3V0XG4gICAgY2FsbGJhY2sudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGVsZXRlIHBlbmRpbmdbaWRdO1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlJlcXVlc3QgXCIgKyBtZXRob2QgKyBcIiB0aW1lZCBvdXQuXCIpKTtcbiAgICB9LCB0aW1lb3V0IHx8IDMwMDApO1xuXG4gICAgcGVuZGluZ1tpZF0gPSBjYWxsYmFjaztcbiAgICBzZW5kSnNvbihyZXEpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLlJQQ0Vycm9yID0gUlBDRXJyb3I7XG4iLCJjb25zdCBldmVudEhhbmRsZXJzID0ge307XG5sZXQgY3VycmVudElkID0gMDtcbmV4cG9ydCBmdW5jdGlvbiBvbihuYW1lLCBoYW5kbGVyKSB7XG4gICAgY29uc3QgaWQgPSBgJHtjdXJyZW50SWR9YDtcbiAgICBjdXJyZW50SWQgKz0gMTtcbiAgICBldmVudEhhbmRsZXJzW2lkXSA9IHsgaGFuZGxlciwgbmFtZSB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSBldmVudEhhbmRsZXJzW2lkXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uY2UobmFtZSwgaGFuZGxlcikge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgcmV0dXJuIG9uKG5hbWUsIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChkb25lID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGhhbmRsZXIoLi4uYXJncyk7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgZW1pdCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnXG4gICAgPyBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShbbmFtZSwgLi4uYXJnc10pO1xuICAgIH1cbiAgICA6IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgcGx1Z2luTWVzc2FnZTogW25hbWUsIC4uLmFyZ3NdLFxuICAgICAgICB9LCAnKicpO1xuICAgIH07XG5mdW5jdGlvbiBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncykge1xuICAgIGZvciAoY29uc3QgaWQgaW4gZXZlbnRIYW5kbGVycykge1xuICAgICAgICBpZiAoZXZlbnRIYW5kbGVyc1tpZF0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyc1tpZF0uaGFuZGxlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoKF9hID0gcGFyYW1zWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuanNvbnJwYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFtuYW1lLCAuLi5hcmdzXSA9IHBhcmFtc1swXTtcbiAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xuICAgIH07XG59XG5lbHNlIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogdmVyeSBkaXJ0eSBoYWNrLCBuZWVkcyBmaXhpbmdcbiAgICAgICAgY29uc3QgZmFsbGJhY2sgPSB3aW5kb3cub25tZXNzYWdlO1xuICAgICAgICB3aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xuICAgICAgICAgICAgZmFsbGJhY2suYXBwbHkod2luZG93LCBwYXJhbXMpO1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBwYXJhbXNbMF07XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFtuYW1lLCAuLi5hcmdzXSA9IGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZTtcbiAgICAgICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LCAxMDApO1xufVxuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgZmluZFBhcmVudCB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBzZXBhcmF0ZVN0ZXAobm9kZXMpIHtcbiAgICBjb25zdCBwYXJlbnRTdGVwID0gZmluZFBhcmVudChub2Rlc1swXSwgKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKCdzdGVwJykpO1xuICAgIGNvbnN0IGZyYW1lID0gcGFyZW50U3RlcC5wYXJlbnQ7XG4gICAgY29uc3QgaW5kZXggPSBmcmFtZS5jaGlsZHJlbi5maW5kSW5kZXgoKG4pID0+IG4gPT0gcGFyZW50U3RlcCk7XG4gICAgaWYgKCFwYXJlbnRTdGVwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXQgPSBmaWdtYS5ncm91cChub2RlcywgZnJhbWUpO1xuICAgIGlucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IG5ld1N0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBmcmFtZSwgaW5kZXgpO1xuICAgIG5ld1N0ZXAubmFtZSA9IHBhcmVudFN0ZXAubmFtZTtcbn1cbm9uKCdzZXBhcmF0ZVN0ZXAnLCAoKSA9PiBzZXBhcmF0ZVN0ZXAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSk7XG4iLCJleHBvcnQgZnVuY3Rpb24gZXhwb3J0VGV4dHMoKSB7XG4gICAgY29uc3QgdGV4dHMgPSBmaWdtYS5jdXJyZW50UGFnZVxuICAgICAgICAuZmluZEFsbCgobm9kZSkgPT4gbm9kZS50eXBlID09PSAnVEVYVCcpXG4gICAgICAgIC5maWx0ZXIoKG5vZGUpID0+IG5vZGUudmlzaWJsZSk7XG4gICAgcmV0dXJuICh0ZXh0c1xuICAgICAgICAubWFwKChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHRuID0gbm9kZTtcbiAgICAgICAgcmV0dXJuIHRuXG4gICAgICAgICAgICAuZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFtcbiAgICAgICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICAgICAnZm9udE5hbWUnLFxuICAgICAgICAgICAgJ2ZvbnRXZWlnaHQnLFxuICAgICAgICAgICAgJ3RleHREZWNvcmF0aW9uJyxcbiAgICAgICAgICAgICd0ZXh0Q2FzZScsXG4gICAgICAgICAgICAnbGluZUhlaWdodCcsXG4gICAgICAgICAgICAnbGV0dGVyU3BhY2luZycsXG4gICAgICAgICAgICAnZmlsbHMnLFxuICAgICAgICAgICAgJ3RleHRTdHlsZUlkJyxcbiAgICAgICAgICAgICdmaWxsU3R5bGVJZCcsXG4gICAgICAgICAgICAnbGlzdE9wdGlvbnMnLFxuICAgICAgICAgICAgJ2luZGVudGF0aW9uJyxcbiAgICAgICAgICAgICdoeXBlcmxpbmsnLFxuICAgICAgICBdKVxuICAgICAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyYWN0ZXJzKVxuICAgICAgICAgICAgLmpvaW4oJ1xcXFwnKVxuICAgICAgICAgICAgLnRyaW1FbmQoKTtcbiAgICB9KVxuICAgICAgICAvLyByZW1vdmUgYXJyYXkgZHVwbGljYXRlc1xuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcbn1cbiIsImltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGFkZFRhZywgZmluZEFsbCwgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBmb3JtYXRPcmRlcihsZXNzb24pIHtcbiAgICBpZiAobGVzc29uLmZpbmRDaGlsZCgobikgPT4gISFnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eby0vLnRlc3QodCkpKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRm91bmQgby10YWcuIGZvcm1hdE9yZGVyIGFib3J0LicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBzZXR0aW5ncyA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3NldHRpbmdzJykpO1xuICAgIGFkZFRhZyhzZXR0aW5ncywgJ29yZGVyLWxheWVycycpO1xuICAgIGNvbnN0IGxheWVyUmVnZXggPSAvXihzLW11bHRpc3RlcC1icnVzaC18cy1tdWx0aXN0ZXAtYmctKShcXGQrKSQvO1xuICAgIGNvbnN0IHN0ZXBzID0gbGVzc29uLmZpbmRDaGlsZHJlbigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpICYmICFnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xuICAgIGFkZFRhZyhyZXN1bHQsIGBvLSR7c3RlcHMubGVuZ3RoICsgMX1gKTtcbiAgICBzdGVwcy5yZXZlcnNlKCkuZm9yRWFjaCgoc3RlcCwgb3JkZXIpID0+IHtcbiAgICAgICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgICAgICBjb25zdCBsYXllclRhZyA9IHRhZ3MuZmluZCgodCkgPT4gbGF5ZXJSZWdleC50ZXN0KHQpKTtcbiAgICAgICAgbGV0IGxheWVyID0gNDtcbiAgICAgICAgaWYgKGxheWVyVGFnKSB7XG4gICAgICAgICAgICBsYXllciA9IHBhcnNlSW50KGxheWVyUmVnZXguZXhlYyhsYXllclRhZylbMl0pO1xuICAgICAgICAgICAgdGFncyA9IHRhZ3MuZmlsdGVyKCh0KSA9PiAhbGF5ZXJSZWdleC50ZXN0KHQpKTtcbiAgICAgICAgICAgIHRhZ3Muc3BsaWNlKDEsIDAsIC9eKHMtbXVsdGlzdGVwLWJydXNofHMtbXVsdGlzdGVwLWJnKS8uZXhlYyhsYXllclRhZylbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHN0ZXAuc2V0UGx1Z2luRGF0YSgnbGF5ZXInLCBKU09OLnN0cmluZ2lmeShsYXllcikpO1xuICAgICAgICB0YWdzLnB1c2goYG8tJHtvcmRlciArIDF9YCk7XG4gICAgICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbignICcpO1xuICAgIH0pO1xuICAgIGxldCBzb3J0ZWRTdGVwcyA9IHN0ZXBzLnNvcnQoKGEsIGIpID0+IEpTT04ucGFyc2UoYi5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSAtXG4gICAgICAgIEpTT04ucGFyc2UoYS5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSk7XG4gICAgc29ydGVkU3RlcHMuZm9yRWFjaCgocykgPT4gbGVzc29uLmluc2VydENoaWxkKDEsIHMpKTtcbn1cbmZ1bmN0aW9uIGF1dG9Gb3JtYXQoKSB7XG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnVEhVTUJOQUlMUycpO1xuICAgIGlmICh0aHVtYlBhZ2UpIHtcbiAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHRodW1iUGFnZS5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgICAgIGlmIChwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJykgfHwgIXRodW1ibmFpbEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSB0aHVtYm5haWxGcmFtZS5jbG9uZSgpO1xuICAgICAgICAgICAgY2xvbmUucmVzaXplKDQwMCwgNDAwKTtcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSAndGh1bWJuYWlsJztcbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIGNvbnN0IG9sZExlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgaWYgKG9sZExlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICBvbGRMZXNzb25GcmFtZS5uYW1lID0gJ2xlc3Nvbic7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJyk7XG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBpZiAoIXRodW1ibmFpbEZyYW1lIHx8ICFsZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnggPSBsZXNzb25GcmFtZS54IC0gNDQwO1xuICAgICAgICB0aHVtYm5haWxGcmFtZS55ID0gbGVzc29uRnJhbWUueTtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnNldHRpbmdzLy50ZXN0KG5vZGUubmFtZSkpLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDEwO1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec3RlcCBzLW11bHRpc3RlcC1yZXN1bHQvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLmNoaWxkcmVuWzBdLm5hbWUgPSAndGVtcGxhdGUnO1xuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSAnL2lnbm9yZSc7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSA2MDtcbiAgICB9KTtcbn1cbm9uKCdhdXRvRm9ybWF0JywgYXV0b0Zvcm1hdCk7XG5vbignZm9ybWF0T3JkZXInLCAoKSA9PiBmb3JtYXRPcmRlcihmaWdtYS5jdXJyZW50UGFnZS5maW5kQ2hpbGQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJykpKTtcbiIsImltcG9ydCAnLi9jcmVhdGUnO1xuaW1wb3J0ICcuL3R1bmUnO1xuaW1wb3J0ICcuL2Zvcm1hdCc7XG5pbXBvcnQgJy4vbGludGVyJztcbmltcG9ydCAnLi9wdWJsaXNoJztcbmltcG9ydCAnLi4vcnBjLWFwaSc7XG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkucmVzaXplKDM0MCwgNDUwKTtcbmNvbnNvbGUuY2xlYXIoKTtcbiIsImltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IHByaW50LCBnZXRUYWdzLCBmaW5kQWxsIH0gZnJvbSAnLi91dGlsJztcbmxldCBlcnJvcnMgPSBbXTtcbmxldCB6b29tU2NhbGUgPSAxO1xubGV0IG1heEJzID0gMTIuODtcbmxldCBvcmRlciA9ICdzdGVwcyc7XG52YXIgRXJyb3JMZXZlbDtcbihmdW5jdGlvbiAoRXJyb3JMZXZlbCkge1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIkVSUk9SXCJdID0gMF0gPSBcIkVSUk9SXCI7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiV0FSTlwiXSA9IDFdID0gXCJXQVJOXCI7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiSU5GT1wiXSA9IDJdID0gXCJJTkZPXCI7XG59KShFcnJvckxldmVsIHx8IChFcnJvckxldmVsID0ge30pKTtcbmZ1bmN0aW9uIHNlbGVjdEVycm9yKGluZGV4KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAoKF9hID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhZ2UpIHtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBlcnJvcnNbaW5kZXhdLnBhZ2U7XG4gICAgfVxuICAgIGlmICgoX2IgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iubm9kZSkge1xuICAgICAgICBlcnJvcnNbaW5kZXhdLnBhZ2Uuc2VsZWN0aW9uID0gW2Vycm9yc1tpbmRleF0ubm9kZV07XG4gICAgfVxufVxuZnVuY3Rpb24gcHJpbnRFcnJvcnMoKSB7XG4gICAgZXJyb3JzLnNvcnQoKGEsIGIpID0+IGEubGV2ZWwgLSBiLmxldmVsKTtcbiAgICBzZWxlY3RFcnJvcigwKTtcbiAgICBsZXQgdGV4dCA9IGVycm9yc1xuICAgICAgICAubWFwKChlKSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICByZXR1cm4gYCR7RXJyb3JMZXZlbFtlLmxldmVsXX1cXHR8ICR7ZS5lcnJvcn0gfCBQQUdFOiR7KChfYSA9IGUucGFnZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpIHx8ICcnfSAkeyhfYiA9IGUubm9kZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnR5cGV9OiR7KChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLm5hbWUpIHx8ICcnfWA7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuICAgIHRleHQgKz0gJ1xcbkRvbmUnO1xuICAgIHByaW50KHRleHQpO1xufVxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGlmICghdmFsKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZnVuY3Rpb24gZGVlcE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVlcE5vZGVzKG4pKTtcbn1cbmZ1bmN0aW9uIGRlc2NlbmRhbnRzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIFtub2RlLCAuLi5ub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlc2NlbmRhbnRzKG4pKV07XG59XG5mdW5jdGlvbiBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZXNjZW5kYW50cyhuKSk7XG59XG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xeZHJhdy1saW5lJHxeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJHxeZmxpcCR8XlZlY3RvciR8XlxcZCskfF5FbGxpcHNlJHxeUmVjdGFuZ2xlJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XG4gICAgbGV0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXM7XG4gICAgYXNzZXJ0KCFmaWxscy5sZW5ndGggfHwgIXN0cm9rZXMubGVuZ3RoLCAnU2hvdWxkIG5vdCBoYXZlIGZpbGwrc3Ryb2tlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBzdHJva2VzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgYXNzZXJ0KHMudmlzaWJsZSwgJ1N0cm9rZSBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KHMudHlwZSA9PSAnU09MSUQnLCAnU3Ryb2tlIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgbGV0IHMxID0gcztcbiAgICAgICAgYXNzZXJ0KHMxLmNvbG9yLnIgIT0gMCB8fCBzMS5jb2xvci5nICE9IDAgfHwgczEuY29sb3IuYiAhPSAwLCAnU3Ryb2tlIGNvbG9yIG11c3Qgbm90IGJlIGJsYWNrJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChzMS5jb2xvci5yICE9IDEgfHwgczEuY29sb3IuZyAhPSAxIHx8IHMxLmNvbG9yLmIgIT0gMSwgJ1N0cm9rZSBjb2xvciBtdXN0IG5vdCBiZSB3aGl0ZScsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGZpbGxzLmZvckVhY2goKGYpID0+IHtcbiAgICAgICAgYXNzZXJ0KGYudmlzaWJsZSwgJ0ZpbGwgbXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChmLnR5cGUgPT0gJ1NPTElEJywgJ0ZpbGwgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBsZXQgZjEgPSBmO1xuICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAwIHx8IGYxLmNvbG9yLmcgIT0gMCB8fCBmMS5jb2xvci5iICE9IDAsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIGJsYWNrJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChmMS5jb2xvci5yICE9IDEgfHwgZjEuY29sb3IuZyAhPSAxIHx8IGYxLmNvbG9yLmIgIT0gMSwgJ0ZpbGwgY29sb3IgbXVzdCBub3QgYmUgd2hpdGUnLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IC9ST1VORHxOT05FLy50ZXN0KFN0cmluZyhub2RlLnN0cm9rZUNhcCkpLCBgU3Ryb2tlIGNhcHMgbXVzdCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gJ1JPVU5EJywgYFN0cm9rZSBqb2lucyBzaG91bGQgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUpvaW4pfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayR8XmRyYXctbGluZSQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaycgb3IgJ2RyYXctbGluZSdcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxufVxuZnVuY3Rpb24gbGludEdyb3VwKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQoIS9CT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpLCAnTm90aWNlIEJPT0xFQU5fT1BFUkFUSU9OJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJC8udGVzdChzKSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5mdW5jdGlvbiBsaW50SW5wdXQocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLm5hbWUgPT0gJ2lucHV0JywgXCJNdXN0IGJlICdpbnB1dCdcIiwgcGFnZSwgbm9kZSk7XG4gICAgZGVzY2VuZGFudHNXaXRob3V0U2VsZihub2RlKS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIGlmICgvR1JPVVB8Qk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludEdyb3VwKHBhZ2UsIHYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdCh2LnR5cGUpKSB7XG4gICAgICAgICAgICBsaW50VmVjdG9yKHBhZ2UsIHYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ0dST1VQL1ZFQ1RPUi9SRUNUQU5HTEUvRUxMSVBTRS9URVhUJyB0eXBlXCIsIHBhZ2UsIHYpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBsaW50U2V0dGluZ3MocGFnZSwgbm9kZSkge1xuICAgIHZhciBfYTtcbiAgICBhc3NlcnQobm9kZS50eXBlID09ICdFTExJUFNFJywgXCJNdXN0IGJlICdFTExJUFNFJyB0eXBlJ1wiLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15zZXR0aW5ncyR8XmNhcHR1cmUtY29sb3IkfF56b29tLXNjYWxlLVxcZCskfF5vcmRlci1sYXllcnMkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxeYnJ1c2gtbmFtZS1cXHcrJHxec3MtXFxkKyR8XmJzLVxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGlmICh0YWdzLmZpbmQoKHRhZykgPT4gL15vcmRlci1sYXllcnMkLy50ZXN0KHRhZykpKSB7XG4gICAgICAgIG9yZGVyID0gJ2xheWVycyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvcmRlciA9ICdzdGVwcyc7XG4gICAgfVxuICAgIHpvb21TY2FsZSA9IHBhcnNlSW50KCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9eem9vbS1zY2FsZS1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKCd6b29tLXNjYWxlLScsICcnKSkgfHxcbiAgICAgICAgJzEnKTtcbiAgICBhc3NlcnQoem9vbVNjYWxlID49IDEgJiYgem9vbVNjYWxlIDw9IDUsIGBNdXN0IGJlIDEgPD0gem9vbS1zY2FsZSA8PSA1ICgke3pvb21TY2FsZX0pYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50U3RlcChwYWdlLCBzdGVwKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAoIWFzc2VydChzdGVwLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoc3RlcC5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydChzdGVwLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBzdGVwKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15cXC98XnN0ZXAkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxecy1tdWx0aXN0ZXAtYmckfF5icnVzaC1uYW1lLVxcdyskfF5jbGVhci1sYXllci1cXGQrJHxec3MtXFxkKyR8XmJzLVxcZCskfF5vLVxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgc3RlcCk7XG4gICAgICAgIC8vIGFzc2VydCghL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJnJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIGlzIG9ic29sZXRlYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICB9KTtcbiAgICBjb25zdCBiZyA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1iZyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicnVzaCA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBzcyA9IHBhcnNlSW50KChfYSA9IHRhZ3MuZmluZCgocykgPT4gL15zcy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKCdzcy0nLCAnJykpO1xuICAgIGNvbnN0IG8gPSB0YWdzLmZpbmQoKHMpID0+IC9eby1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3QgYnMgPSBwYXJzZUludCgoX2IgPSB0YWdzLmZpbmQoKHMpID0+IC9eYnMtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucmVwbGFjZSgnYnMtJywgJycpKTtcbiAgICBtYXhCcyA9IE1hdGgubWF4KGJzID8gYnMgOiBtYXhCcywgbWF4QnMpO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsICdzcyBtdXN0IGJlID49IDE1JywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFzcyB8fCAhYnMgfHwgc3MgPiBicywgJ3NzIG11c3QgYmUgPiBicycsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPD0gem9vbVNjYWxlICogMTIuOCwgYGJzIG11c3QgYmUgPD0gJHt6b29tU2NhbGUgKiAxMi44fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gJ2xheWVycycsIGAke299IG11c3QgYmUgdXNlZCBvbmx5IHdpdGggc2V0dGluZ3Mgb3JkZXItbGF5ZXJzYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KG9yZGVyICE9PSAnbGF5ZXJzJyB8fCAhIW8sICdNdXN0IGhhdmUgby1OIG9yZGVyIG51bWJlcicsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IGZmID0gc3RlcC5maW5kT25lKChuKSA9PiBuLmZpbGxzICYmIG4uZmlsbHNbMF0pO1xuICAgIGNvbnN0IHNmID0gc3RlcC5maW5kT25lKChuKSA9PiB7IHZhciBfYTsgcmV0dXJuICgoX2EgPSBuLnN0cm9rZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMDsgfSk7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgIXNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2Ugbm90IHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBhc3NlcnQoIWJnIHx8ICEhZmYsIFwiYmcgc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRob3V0IGZpbGxlZC1pbiB2ZWN0b3JzXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFicnVzaCB8fCAhZmYsIFwiYnJ1c2ggc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRoIGZpbGxlZC1pbiB2ZWN0b3JzXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgc3RlcC5jaGlsZHJlbi5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmIChuLm5hbWUgPT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgbGludElucHV0KHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG4ubmFtZSA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICAgICAgLy8gbGludCB0ZW1wbGF0ZVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ2lucHV0JyBvciAndGVtcGxhdGUnXCIsIHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgYmxpbmtOb2RlcyA9IGZpbmRBbGwoc3RlcCwgKG4pID0+IGdldFRhZ3MobikuZmluZCgodCkgPT4gL15ibGluayQvLnRlc3QodCkpICE9PSB1bmRlZmluZWQpLmZsYXRNYXAoZGVlcE5vZGVzKTtcbiAgICBjb25zdCBmaWxsZWROb2RlID0gYmxpbmtOb2Rlcy5maW5kKChuKSA9PiBuLmZpbGxzWzBdKTtcbiAgICBhc3NlcnQoYmxpbmtOb2Rlcy5sZW5ndGggPT0gMCB8fCAhIWZpbGxlZE5vZGUgfHwgYmxpbmtOb2Rlcy5sZW5ndGggPiAzLCAnU2hvdWxkIHVzZSBkcmF3LWxpbmUgaWYgPCA0IGxpbmVzJywgcGFnZSwgYmxpbmtOb2Rlc1swXSwgRXJyb3JMZXZlbC5JTkZPKTtcbn1cbmZ1bmN0aW9uIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnRlJBTUUnLCBcIk11c3QgYmUgJ0ZSQU1FJyB0eXBlXCIsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gMTM2NiAmJiBub2RlLmhlaWdodCA9PSAxMDI0LCAnTXVzdCBiZSAxMzY2eDEwMjQnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgc2V0dGluZ3MgPSBub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKTtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcbiAgICB9XG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShcXGQrKSQvLmV4ZWModGFnKTtcbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvID0gZm91bmRbMV07XG4gICAgICAgICAgICBhc3NlcnQoIW9yZGVyTnVtYmVyc1tvXSwgYE11c3QgaGF2ZSB1bmlxdWUgJHt0YWd9IHZhbHVlc2AsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBvcmRlck51bWJlcnNbb10gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKSB7XG4gICAgICAgICAgICBsaW50U3RlcChwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdzZXR0aW5ncycgb3IgJ3N0ZXAnXCIsIHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzc2VydChtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsIGB6b29tLXNjYWxlICR7em9vbVNjYWxlfSBtdXN0IGJlICR7TWF0aC5jZWlsKG1heEJzIC8gMTIuOCl9IGZvciBtYXggYnMgJHttYXhCc30gdXNlZGAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFRodW1ibmFpbChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDQwMCAmJiBub2RlLmhlaWdodCA9PSA0MDAsICdNdXN0IGJlIDQwMHg0MDAnLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRQYWdlKHBhZ2UpIHtcbiAgICBpZiAoL15cXC98XklOREVYJC8udGVzdChwYWdlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFxcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL15sZXNzb24kLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ2xlc3NvbidcIiwgcGFnZSk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBwYWdlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChub2RlLm5hbWUgPT0gJ2xlc3NvbicpIHtcbiAgICAgICAgICAgIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09ICd0aHVtYm5haWwnKSB7XG4gICAgICAgICAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KC9eXFwvLy50ZXN0KG5vZGUubmFtZSksIFwiTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBsaW50SW5kZXgocGFnZSkge1xuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsICdJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudCcsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcbiAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIHBhZ2UuY2hpbGRyZW5bMF0pO1xufVxuZnVuY3Rpb24gbGludENvdXJzZSgpIHtcbiAgICBhc3NlcnQoL15DT1VSU0UtW2EtelxcLTAtOV0rJC8udGVzdChmaWdtYS5yb290Lm5hbWUpLCBgQ291cnNlIG5hbWUgJyR7ZmlnbWEucm9vdC5uYW1lfScgbXVzdCBtYXRjaCBDT1VSU0UtW2EtelxcXFwtMC05XStgKTtcbiAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lID09ICdJTkRFWCcpO1xuICAgIGlmIChhc3NlcnQoISFpbmRleCwgXCJNdXN0IGhhdmUgJ0lOREVYJyBwYWdlXCIpKSB7XG4gICAgICAgIGxpbnRJbmRleChpbmRleCk7XG4gICAgfVxuICAgIC8vIGZpbmQgYWxsIG5vbi11bmlxdWUgbmFtZWQgcGFnZXNcbiAgICBjb25zdCBub25VbmlxdWUgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbHRlcigocCwgaSwgYSkgPT4gYS5maW5kSW5kZXgoKHAyKSA9PiBwMi5uYW1lID09IHAubmFtZSkgIT0gaSk7XG4gICAgbm9uVW5pcXVlLmZvckVhY2goKHApID0+IGFzc2VydChmYWxzZSwgYFBhZ2UgbmFtZSAnJHtwLm5hbWV9JyBtdXN0IGJlIHVuaXF1ZWAsIHApKTtcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgbGludFBhZ2UocGFnZSk7XG4gICAgfVxufVxub24oJ3NlbGVjdEVycm9yJywgc2VsZWN0RXJyb3IpO1xub24oJ2xpbnRDb3Vyc2UnLCAoKSA9PiB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludENvdXJzZSgpO1xuICAgIHByaW50RXJyb3JzKCk7XG59KTtcbm9uKCdsaW50UGFnZScsICgpID0+IHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBsaW50UGFnZShmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgcHJpbnRFcnJvcnMoKTtcbn0pO1xuLy8gbm8gaGlkZGVuIGZpbGwvc3Ryb2tlXG4vLyBubyBlZmZlY3RzXG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGNhcGl0YWxpemUsIHByaW50IH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgXCJ0YXNrLW5hbWUgJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKHBhZ2UubmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XG5cImNvdXJzZS1kZXNjcmlwdGlvbiAke2NvdXJzZU5hbWV9XCIgPSBcIkluIHRoaXMgY291cnNlOlxuICAgIOKAoiBcbiAgICDigKIgXG4gICAg4oCiIFwiO1xuJHt0YXNrc31cbmA7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TGVzc29uKHBhZ2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcbiAgICAgICAgY29uc3QgbGVzc29uTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgZm9ybWF0OiAnU1ZHJyxcbiAgICAgICAgICAgIC8vIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsID0geWllbGQgdGh1bWJuYWlsTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxuICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291cnNlUGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXG4gICAgICAgICAgICBwYXRoOiBwYWdlLm5hbWUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IFtsZXNzb25zLCB0aHVtYm5haWxdID0geWllbGQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5tYXAoKHBhZ2UpID0+IGV4cG9ydExlc3NvbihwYWdlKSkpLFxuICAgICAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maW5kKChwYWdlKSA9PiBwYWdlLm5hbWUgPT0gJ0lOREVYJylcbiAgICAgICAgICAgICAgICAuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIGxlc3NvbnMsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVN3aWZ0Q29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWVcbiAgICAgICAgLnNwbGl0KCctJylcbiAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICBzd2lmdENvdXJzZU5hbWUgPVxuICAgICAgICBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICBsZXQgJHtzd2lmdENvdXJzZU5hbWV9ID0gQ291cnNlKFxuICAgIHBhdGg6IFwiJHtjb3Vyc2VOYW1lfVwiLFxuICAgIGF1dGhvcjogUkVQTEFDRSxcbiAgICB0YXNrczogW1xuJHt0YXNrc30gICAgXSlcbmA7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKSB7XG4gICAgY29uc3QgY29kZSA9IGdlbmVyYXRlU3dpZnRDb2RlKCkgKyBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKTtcbiAgICBwcmludChjb2RlKTtcbn1cbm9uKCdnZW5lcmF0ZUNvZGUnLCBnZW5lcmF0ZUNvZGUpO1xuIiwiaW1wb3J0IHsgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBOb2RlcygpIHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgcmV0dXJuIHN0ZXBzQnlPcmRlcihsZXNzb24pLm1hcCgoc3RlcCkgPT4ge1xuICAgICAgICByZXR1cm4geyBpZDogc3RlcC5pZCwgbmFtZTogc3RlcC5uYW1lIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcE9yZGVyKHN0ZXBzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGxlc3Nvbi5maW5kT25lKChlbCkgPT4gZWwuaWQgPT0gc3RlcC5pZCk7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICBzLm5hbWUgPSBzLm5hbWUucmVwbGFjZSgvby1cXGQrLywgJ28tJyArIChpICsgMSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBlbWl0LCBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIGdldFRhZyhzdGVwLCB0YWcpIHtcbiAgICBjb25zdCB2ID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgodGFnKSk7XG4gICAgcmV0dXJuIHYgPyB2LnJlcGxhY2UodGFnLCAnJykgOiAnMCc7XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGVsZXRlVG1wKCkge1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlXG4gICAgICAgIC5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlKCkpO1xufVxubGV0IGxhc3RQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG5mdW5jdGlvbiBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKSB7XG4gICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgc3RlcC52aXNpYmxlID0gZmFsc2U7XG4gICAgfSk7XG4gICAgY29uc3QgaW5wdXQgPSBzdGVwLmZpbmRDaGlsZCgoZykgPT4gZy5uYW1lID09ICdpbnB1dCcpO1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGlucHV0LmNsb25lKCk7XG4gICAgdGVtcGxhdGUubmFtZSA9ICd0bXAtdGVtcGxhdGUnO1xuICAgIHRlbXBsYXRlXG4gICAgICAgIC5maW5kQWxsKChlbCkgPT4gL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KGVsLnR5cGUpKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWwuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSB9XTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRXZWlnaHQgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAzMCA6IDUwO1xuICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgZGVmYXVsdFdlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHBpbmsgPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgcGluay5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgcGluay5zdHJva2VXZWlnaHQgPSAyO1xuICAgICAgICAgICAgcGluay5uYW1lID0gJ3BpbmsgJyArIGVsLm5hbWU7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChwaW5rKTtcbiAgICAgICAgICAgIC8vIGNsb25lIGVsZW1lbnQgaGVyZSBhbmQgZ2l2ZSBoaW0gdGhpbiBwaW5rIHN0cm9rZVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICB0ZW1wbGF0ZS54ID0gaW5wdXQuYWJzb2x1dGVUcmFuc2Zvcm1bMF1bMl0gLSBsZXNzb24uYWJzb2x1dGVUcmFuc2Zvcm1bMF1bMl07XG4gICAgdGVtcGxhdGUueSA9IGlucHV0LmFic29sdXRlVHJhbnNmb3JtWzFdWzJdIC0gbGVzc29uLmFic29sdXRlVHJhbnNmb3JtWzFdWzJdO1xufVxuZnVuY3Rpb24gZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApIHtcbiAgICBjb25zdCBkZWZhdWx0QlMgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAxMi44IDogMTA7XG4gICAgY29uc3QgYnMgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSB8fCBkZWZhdWx0QlM7XG4gICAgY29uc3Qgc21hbGxMaW5lID0gZmlnbWEuY3JlYXRlTGluZSgpO1xuICAgIHNtYWxsTGluZS5uYW1lID0gJ3NtYWxsTGluZSc7XG4gICAgc21hbGxMaW5lLnJlc2l6ZSgzMDAsIDApO1xuICAgIHNtYWxsTGluZS5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMC44LCBiOiAwIH0gfV07XG4gICAgc21hbGxMaW5lLnN0cm9rZVdlaWdodCA9IGJzIC8gMztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQ2FwID0gJ1JPVU5EJztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQWxpZ24gPSAnQ0VOVEVSJztcbiAgICBzbWFsbExpbmUueSA9IHNtYWxsTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IGJpZ0xpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBiaWdMaW5lLm5hbWUgPSAnYmlnTGluZSc7XG4gICAgYmlnTGluZS5vcGFjaXR5ID0gMC4zO1xuICAgIGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgKyBNYXRoLnBvdyhicywgMS40KSAqIDAuODtcbiAgICBiaWdMaW5lLnkgPSBiaWdMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbYmlnTGluZSwgc21hbGxMaW5lXSwgbGVzc29uLnBhcmVudCk7XG4gICAgZ3JvdXAubmFtZSA9ICd0bXAtYnMnO1xuICAgIGdyb3VwLnggPSBsZXNzb24ueDtcbiAgICBncm91cC55ID0gbGVzc29uLnkgLSA4MDtcbn1cbmZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGFnZSwgc2V0dGluZ3MpIHtcbiAgICBsYXN0UGFnZSA9IHBhZ2U7XG4gICAgY29uc3QgeyBkaXNwbGF5TW9kZSwgc3RlcE51bWJlciB9ID0gc2V0dGluZ3M7XG4gICAgY29uc3QgbGVzc29uID0gcGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgaWYgKCFsZXNzb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xuICAgIHBhZ2Uuc2VsZWN0aW9uID0gW3N0ZXBdO1xuICAgIGNvbnN0IHN0ZXBDb3VudCA9IGxlc3Nvbi5jaGlsZHJlbi5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSkubGVuZ3RoO1xuICAgIGVtaXQoJ3VwZGF0ZUZvcm0nLCB7XG4gICAgICAgIHNoYWRvd1NpemU6IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnc3MtJykpLFxuICAgICAgICBicnVzaFNpemU6IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpLFxuICAgICAgICB0ZW1wbGF0ZTogZ2V0VGFnKHN0ZXAsICdzLScpLFxuICAgICAgICBzdGVwQ291bnQsXG4gICAgICAgIHN0ZXBOdW1iZXIsXG4gICAgICAgIGRpc3BsYXlNb2RlLFxuICAgIH0pO1xuICAgIGRlbGV0ZVRtcCgpO1xuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcbiAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gaSA8IHN0ZXBOdW1iZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZW1wbGF0ZSc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xufSwgMTUwMCk7XG5mdW5jdGlvbiB1cGRhdGVQcm9wcyhzZXR0aW5ncykge1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc2V0dGluZ3Muc3RlcE51bWJlciAtIDFdO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoJ3NzLScpICYmICF0LnN0YXJ0c1dpdGgoJ2JzLScpICYmICF0LnN0YXJ0c1dpdGgoJ3MtJykpO1xuICAgIGlmIChzZXR0aW5ncy50ZW1wbGF0ZSkge1xuICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCBgcy0ke3NldHRpbmdzLnRlbXBsYXRlfWApO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3Muc2hhZG93U2l6ZSkge1xuICAgICAgICB0YWdzLnB1c2goYHNzLSR7c2V0dGluZ3Muc2hhZG93U2l6ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmJydXNoU2l6ZSkge1xuICAgICAgICB0YWdzLnB1c2goYGJzLSR7c2V0dGluZ3MuYnJ1c2hTaXplfWApO1xuICAgIH1cbiAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcbn1cbm9uKCd1cGRhdGVEaXNwbGF5JywgKHNldHRpbmdzKSA9PiB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCBzZXR0aW5ncykpO1xub24oJ3VwZGF0ZVByb3BzJywgdXBkYXRlUHJvcHMpO1xuZmlnbWEub24oJ2N1cnJlbnRwYWdlY2hhbmdlJywgKCkgPT4ge1xuICAgIHVwZGF0ZURpc3BsYXkobGFzdFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xufSk7XG5maWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcbiAgICBjb25zdCBzdGVwID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGlmICghc3RlcCB8fCAhbGVzc29uIHx8ICFsZXNzb24uY2hpbGRyZW4uaW5jbHVkZXMoc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwTnVtYmVyID0gc3RlcHNCeU9yZGVyKGxlc3NvbikuaW5kZXhPZihzdGVwKSArIDE7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXIgfSk7XG59KTtcbiIsImltcG9ydCB7IGVtaXQgfSBmcm9tICcuLi9ldmVudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICBhcnIucHVzaChub2RlKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KGNoaWxkcmVuLmZsYXRNYXAoKHApID0+IGZpbmRBbGwocCwgZikpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGYpIHtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFncyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubmFtZS5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRUYWcobm9kZSwgdGFnKSB7XG4gICAgbm9kZS5uYW1lID0gZ2V0VGFncyhub2RlKS5jb25jYXQoW3RhZ10pLmpvaW4oJyAnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludCh0ZXh0KSB7XG4gICAgZmlnbWEudWkucmVzaXplKDcwMCwgNDAwKTtcbiAgICBlbWl0KCdwcmludCcsIHRleHQpO1xufVxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSAocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGNyZWF0ZVBsdWdpbkFQSSwgY3JlYXRlVUlBUEkgfSBmcm9tICdmaWdtYS1qc29ucnBjJztcbmltcG9ydCB7IGV4cG9ydFRleHRzIH0gZnJvbSAnLi9wbHVnaW4vZm9ybWF0LXJwYyc7XG5pbXBvcnQgeyBleHBvcnRMZXNzb24sIGV4cG9ydENvdXJzZSB9IGZyb20gJy4vcGx1Z2luL3B1Ymxpc2gnO1xuaW1wb3J0IHsgZ2V0U3RlcE5vZGVzLCBzZXRTdGVwT3JkZXIgfSBmcm9tICcuL3BsdWdpbi90dW5lLXJwYyc7XG4vLyBGaWdtYSBwbHVnaW4gbWV0aG9kc1xuZXhwb3J0IGNvbnN0IHBsdWdpbkFwaSA9IGNyZWF0ZVBsdWdpbkFQSSh7XG4gICAgc2V0U2Vzc2lvblRva2VuKHRva2VuKSB7XG4gICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdzZXNzaW9uVG9rZW4nLCB0b2tlbik7XG4gICAgfSxcbiAgICBnZXRTZXNzaW9uVG9rZW4oKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnc2Vzc2lvblRva2VuJyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZXhwb3J0TGVzc29uLFxuICAgIGV4cG9ydENvdXJzZSxcbiAgICBnZXRTdGVwTm9kZXMsXG4gICAgc2V0U3RlcE9yZGVyLFxuICAgIGV4cG9ydFRleHRzLFxufSk7XG4vLyBGaWdtYSBVSSBhcHAgbWV0aG9kc1xuZXhwb3J0IGNvbnN0IHVpQXBpID0gY3JlYXRlVUlBUEkoe30pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==