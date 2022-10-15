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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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Ozs7QUN6SkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFpQztBQUMxQjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQSxJQUFJLG9EQUFJO0FBQ1I7QUFDTzs7Ozs7Ozs7Ozs7OztBQzlCUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDNkQ7QUFDWDtBQUNZO0FBQ0M7QUFDL0Q7QUFDTyxrQkFBa0IscUVBQWU7QUFDeEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksMEVBQVk7QUFDaEIsSUFBSSwwRUFBWTtBQUNoQixJQUFJLDJFQUFZO0FBQ2hCLElBQUksMkVBQVk7QUFDaEIsSUFBSSwyRUFBVztBQUNmLENBQUM7QUFDRDtBQUNPLGNBQWMsaUVBQVcsR0FBRyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9pbmRleC50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzLlBhcnNlRXJyb3IgPSBjbGFzcyBQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJQYXJzZSBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjcwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFJlcXVlc3QgPSBjbGFzcyBJbnZhbGlkUmVxdWVzdCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBSZXF1ZXN0XCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NZXRob2ROb3RGb3VuZCA9IGNsYXNzIE1ldGhvZE5vdEZvdW5kIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJNZXRob2Qgbm90IGZvdW5kXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAxO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUGFyYW1zID0gY2xhc3MgSW52YWxpZFBhcmFtcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBwYXJhbXNcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludGVybmFsRXJyb3IgPSBjbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnRlcm5hbCBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMztcbiAgfVxufTtcbiIsImNvbnN0IHsgc2V0dXAsIHNlbmRSZXF1ZXN0IH0gPSByZXF1aXJlKFwiLi9ycGNcIik7XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVVJQVBJID0gZnVuY3Rpb24gY3JlYXRlVUlBUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsdWdpbkFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbkFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG4iLCJjb25zdCBSUENFcnJvciA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IHsgTWV0aG9kTm90Rm91bmQgfSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcblxubGV0IHNlbmRSYXc7XG5cbmlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZmlnbWEudWkub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGhhbmRsZVJhdyhtZXNzYWdlKSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xufSBlbHNlIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIG9ubWVzc2FnZSA9IGV2ZW50ID0+IGhhbmRsZVJhdyhldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiBtZXNzYWdlIH0sIFwiKlwiKTtcbn1cblxubGV0IHJwY0luZGV4ID0gMDtcbmxldCBwZW5kaW5nID0ge307XG5cbmZ1bmN0aW9uIHNlbmRKc29uKHJlcSkge1xuICB0cnkge1xuICAgIHNlbmRSYXcocmVxKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXN1bHQoaWQsIHJlc3VsdCkge1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICByZXN1bHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRFcnJvcihpZCwgZXJyb3IpIHtcbiAgY29uc3QgZXJyb3JPYmplY3QgPSB7XG4gICAgY29kZTogZXJyb3IuY29kZSxcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgIGRhdGE6IGVycm9yLmRhdGFcbiAgfTtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgZXJyb3I6IGVycm9yT2JqZWN0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSYXcoZGF0YSkge1xuICB0cnkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVScGMoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJwYyhqc29uKSB7XG4gIGlmICh0eXBlb2YganNvbi5pZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBqc29uLnJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAganNvbi5lcnJvciB8fFxuICAgICAgdHlwZW9mIGpzb24ubWV0aG9kID09PSBcInVuZGVmaW5lZFwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHNlbmRFcnJvcihcbiAgICAgICAgICBqc29uLmlkLFxuICAgICAgICAgIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgY2FsbGJhY2sgZm9yIFwiICsganNvbi5pZClcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxiYWNrLnRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBjYWxsYmFjayhqc29uLmVycm9yLCBqc29uLnJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZVJlcXVlc3QoanNvbik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKTtcbiAgfVxufVxuXG5sZXQgbWV0aG9kcyA9IHt9O1xuXG5mdW5jdGlvbiBvblJlcXVlc3QobWV0aG9kLCBwYXJhbXMpIHtcbiAgaWYgKCFtZXRob2RzW21ldGhvZF0pIHtcbiAgICB0aHJvdyBuZXcgTWV0aG9kTm90Rm91bmQobWV0aG9kKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kc1ttZXRob2RdKC4uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgbWV0aG9kXCIpKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbiAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXN1bHRcbiAgICAgICAgLnRoZW4ocmVzID0+IHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBlcnIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnNldHVwID0gX21ldGhvZHMgPT4ge1xuICBPYmplY3QuYXNzaWduKG1ldGhvZHMsIF9tZXRob2RzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmROb3RpZmljYXRpb24gPSAobWV0aG9kLCBwYXJhbXMpID0+IHtcbiAgc2VuZEpzb24oeyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcyB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKG1ldGhvZCwgcGFyYW1zLCB0aW1lb3V0KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaWQgPSBycGNJbmRleDtcbiAgICBjb25zdCByZXEgPSB7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zLCBpZCB9O1xuICAgIHJwY0luZGV4ICs9IDE7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc3QganNFcnJvciA9IG5ldyBFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgIGpzRXJyb3IuY29kZSA9IGVyci5jb2RlO1xuICAgICAgICBqc0Vycm9yLmRhdGEgPSBlcnIuZGF0YTtcbiAgICAgICAgcmVqZWN0KGpzRXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgfTtcblxuICAgIC8vIHNldCBhIGRlZmF1bHQgdGltZW91dFxuICAgIGNhbGxiYWNrLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2lkXTtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0IFwiICsgbWV0aG9kICsgXCIgdGltZWQgb3V0LlwiKSk7XG4gICAgfSwgdGltZW91dCB8fCAzMDAwKTtcblxuICAgIHBlbmRpbmdbaWRdID0gY2FsbGJhY2s7XG4gICAgc2VuZEpzb24ocmVxKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5SUENFcnJvciA9IFJQQ0Vycm9yO1xuIiwiY29uc3QgZXZlbnRIYW5kbGVycyA9IHt9O1xubGV0IGN1cnJlbnRJZCA9IDA7XG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IGlkID0gYCR7Y3VycmVudElkfWA7XG4gICAgY3VycmVudElkICs9IDE7XG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgZXZlbnRIYW5kbGVyc1tpZF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJldHVybiBvbihuYW1lLCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAoZG9uZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xuICAgID8gZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoW25hbWUsIC4uLmFyZ3NdKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgfSwgJyonKTtcbiAgICB9O1xuZnVuY3Rpb24gaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpIHtcbiAgICBmb3IgKGNvbnN0IGlkIGluIGV2ZW50SGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKGV2ZW50SGFuZGxlcnNbaWRdLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaWRdLmhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKChfYSA9IHBhcmFtc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmpzb25ycGMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBwYXJhbXNbMF07XG4gICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICB9O1xufVxuZWxzZSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIFRPRE86IHZlcnkgZGlydHkgaGFjaywgbmVlZHMgZml4aW5nXG4gICAgICAgIGNvbnN0IGZhbGxiYWNrID0gd2luZG93Lm9ubWVzc2FnZTtcbiAgICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgICAgIGZhbGxiYWNrLmFwcGx5KHdpbmRvdywgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gcGFyYW1zWzBdO1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XG4gICAgICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSwgMTAwKTtcbn1cbiIsImltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGZpbmRQYXJlbnQgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gc2VwYXJhdGVTdGVwKG5vZGVzKSB7XG4gICAgY29uc3QgcGFyZW50U3RlcCA9IGZpbmRQYXJlbnQobm9kZXNbMF0sIChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKTtcbiAgICBjb25zdCBmcmFtZSA9IHBhcmVudFN0ZXAucGFyZW50O1xuICAgIGNvbnN0IGluZGV4ID0gZnJhbWUuY2hpbGRyZW4uZmluZEluZGV4KChuKSA9PiBuID09IHBhcmVudFN0ZXApO1xuICAgIGlmICghcGFyZW50U3RlcCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXMsIGZyYW1lKTtcbiAgICBpbnB1dC5uYW1lID0gJ2lucHV0JztcbiAgICBjb25zdCBuZXdTdGVwID0gZmlnbWEuZ3JvdXAoW2lucHV0XSwgZnJhbWUsIGluZGV4KTtcbiAgICBuZXdTdGVwLm5hbWUgPSBwYXJlbnRTdGVwLm5hbWU7XG59XG5vbignc2VwYXJhdGVTdGVwJywgKCkgPT4gc2VwYXJhdGVTdGVwKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbikpO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydFRleHRzKCkge1xuICAgIGNvbnN0IHRleHRzID0gZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKVxuICAgICAgICAuZmlsdGVyKChub2RlKSA9PiBub2RlLnZpc2libGUpO1xuICAgIHJldHVybiAodGV4dHNcbiAgICAgICAgLm1hcCgobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCB0biA9IG5vZGU7XG4gICAgICAgIHJldHVybiB0blxuICAgICAgICAgICAgLmdldFN0eWxlZFRleHRTZWdtZW50cyhbXG4gICAgICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAgICAgJ2ZvbnROYW1lJyxcbiAgICAgICAgICAgICdmb250V2VpZ2h0JyxcbiAgICAgICAgICAgICd0ZXh0RGVjb3JhdGlvbicsXG4gICAgICAgICAgICAndGV4dENhc2UnLFxuICAgICAgICAgICAgJ2xpbmVIZWlnaHQnLFxuICAgICAgICAgICAgJ2xldHRlclNwYWNpbmcnLFxuICAgICAgICAgICAgJ2ZpbGxzJyxcbiAgICAgICAgICAgICd0ZXh0U3R5bGVJZCcsXG4gICAgICAgICAgICAnZmlsbFN0eWxlSWQnLFxuICAgICAgICAgICAgJ2xpc3RPcHRpb25zJyxcbiAgICAgICAgICAgICdpbmRlbnRhdGlvbicsXG4gICAgICAgICAgICAnaHlwZXJsaW5rJyxcbiAgICAgICAgXSlcbiAgICAgICAgICAgIC5tYXAoKHMpID0+IHMuY2hhcmFjdGVycylcbiAgICAgICAgICAgIC5qb2luKCdcXFxcJylcbiAgICAgICAgICAgIC50cmltRW5kKCk7XG4gICAgfSlcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcbiAgICAgICAgLmZpbHRlcigodiwgaSwgYSkgPT4gYS5pbmRleE9mKHYpID09PSBpKSk7XG59XG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBhZGRUYWcsIGZpbmRBbGwsIGdldFRhZ3MgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZm9ybWF0T3JkZXIobGVzc29uKSB7XG4gICAgaWYgKGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+ICEhZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXm8tLy50ZXN0KHQpKSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZvdW5kIG8tdGFnLiBmb3JtYXRPcmRlciBhYm9ydC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc2V0dGluZ3MgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzZXR0aW5ncycpKTtcbiAgICBhZGRUYWcoc2V0dGluZ3MsICdvcmRlci1sYXllcnMnKTtcbiAgICBjb25zdCBsYXllclJlZ2V4ID0gL14ocy1tdWx0aXN0ZXAtYnJ1c2gtfHMtbXVsdGlzdGVwLWJnLSkoXFxkKykkLztcbiAgICBjb25zdCBzdGVwcyA9IGxlc3Nvbi5maW5kQ2hpbGRyZW4oKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSAmJiAhZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBhZGRUYWcocmVzdWx0LCBgby0ke3N0ZXBzLmxlbmd0aCArIDF9YCk7XG4gICAgc3RlcHMucmV2ZXJzZSgpLmZvckVhY2goKHN0ZXAsIG9yZGVyKSA9PiB7XG4gICAgICAgIGxldCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgY29uc3QgbGF5ZXJUYWcgPSB0YWdzLmZpbmQoKHQpID0+IGxheWVyUmVnZXgudGVzdCh0KSk7XG4gICAgICAgIGxldCBsYXllciA9IDQ7XG4gICAgICAgIGlmIChsYXllclRhZykge1xuICAgICAgICAgICAgbGF5ZXIgPSBwYXJzZUludChsYXllclJlZ2V4LmV4ZWMobGF5ZXJUYWcpWzJdKTtcbiAgICAgICAgICAgIHRhZ3MgPSB0YWdzLmZpbHRlcigodCkgPT4gIWxheWVyUmVnZXgudGVzdCh0KSk7XG4gICAgICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCAvXihzLW11bHRpc3RlcC1icnVzaHxzLW11bHRpc3RlcC1iZykvLmV4ZWMobGF5ZXJUYWcpWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBzdGVwLnNldFBsdWdpbkRhdGEoJ2xheWVyJywgSlNPTi5zdHJpbmdpZnkobGF5ZXIpKTtcbiAgICAgICAgdGFncy5wdXNoKGBvLSR7b3JkZXIgKyAxfWApO1xuICAgICAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcbiAgICB9KTtcbiAgICBsZXQgc29ydGVkU3RlcHMgPSBzdGVwcy5zb3J0KChhLCBiKSA9PiBKU09OLnBhcnNlKGIuZ2V0UGx1Z2luRGF0YSgnbGF5ZXInKSkgLVxuICAgICAgICBKU09OLnBhcnNlKGEuZ2V0UGx1Z2luRGF0YSgnbGF5ZXInKSkpO1xuICAgIHNvcnRlZFN0ZXBzLmZvckVhY2goKHMpID0+IGxlc3Nvbi5pbnNlcnRDaGlsZCgxLCBzKSk7XG59XG5mdW5jdGlvbiBhdXRvRm9ybWF0KCkge1xuICAgIGNvbnN0IHRodW1iUGFnZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gJ1RIVU1CTkFJTFMnKTtcbiAgICBpZiAodGh1bWJQYWdlKSB7XG4gICAgICAgIGZpZ21hLnJvb3QuY2hpbGRyZW4uZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSB0aHVtYlBhZ2UuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XG4gICAgICAgICAgICBpZiAocC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ3RodW1ibmFpbCcpIHx8ICF0aHVtYm5haWxGcmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGh1bWJuYWlsRnJhbWUuY2xvbmUoKTtcbiAgICAgICAgICAgIGNsb25lLnJlc2l6ZSg0MDAsIDQwMCk7XG4gICAgICAgICAgICBjbG9uZS5uYW1lID0gJ3RodW1ibmFpbCc7XG4gICAgICAgICAgICBwLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZpZ21hLnJvb3QuY2hpbGRyZW4uZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBjb25zdCBvbGRMZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XG4gICAgICAgIGlmIChvbGRMZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgb2xkTGVzc29uRnJhbWUubmFtZSA9ICdsZXNzb24nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xuICAgICAgICBjb25zdCBsZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgaWYgKCF0aHVtYm5haWxGcmFtZSB8fCAhbGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aHVtYm5haWxGcmFtZS54ID0gbGVzc29uRnJhbWUueCAtIDQ0MDtcbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueSA9IGxlc3NvbkZyYW1lLnk7XG4gICAgfSk7XG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zZXR0aW5ncy8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSAxMDtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnN0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0Ly50ZXN0KG5vZGUubmFtZSkpLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5jaGlsZHJlblswXS5uYW1lID0gJ3RlbXBsYXRlJztcbiAgICAgICAgbi5jaGlsZHJlblswXS5jaGlsZHJlblswXS5uYW1lID0gJy9pZ25vcmUnO1xuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xuICAgICAgICBuLnggPSAxMDtcbiAgICAgICAgbi55ID0gNjA7XG4gICAgfSk7XG59XG5vbignYXV0b0Zvcm1hdCcsIGF1dG9Gb3JtYXQpO1xub24oJ2Zvcm1hdE9yZGVyJywgKCkgPT4gZm9ybWF0T3JkZXIoZmlnbWEuY3VycmVudFBhZ2UuZmluZENoaWxkKCh0KSA9PiB0Lm5hbWUgPT0gJ2xlc3NvbicpKSk7XG4iLCJpbXBvcnQgJy4vY3JlYXRlJztcbmltcG9ydCAnLi90dW5lJztcbmltcG9ydCAnLi9mb3JtYXQnO1xuaW1wb3J0ICcuL2xpbnRlcic7XG5pbXBvcnQgJy4vcHVibGlzaCc7XG5pbXBvcnQgJy4uL3JwYy1hcGknO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcbmZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ1MCk7XG5jb25zb2xlLmNsZWFyKCk7XG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBwcmludCwgZ2V0VGFncywgZmluZEFsbCB9IGZyb20gJy4vdXRpbCc7XG5sZXQgZXJyb3JzID0gW107XG5sZXQgem9vbVNjYWxlID0gMTtcbmxldCBtYXhCcyA9IDEyLjg7XG5sZXQgb3JkZXIgPSAnc3RlcHMnO1xudmFyIEVycm9yTGV2ZWw7XG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJFUlJPUlwiXSA9IDBdID0gXCJFUlJPUlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xufSkoRXJyb3JMZXZlbCB8fCAoRXJyb3JMZXZlbCA9IHt9KSk7XG5mdW5jdGlvbiBzZWxlY3RFcnJvcihpbmRleCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKChfYSA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYWdlKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzW2luZGV4XS5wYWdlO1xuICAgIH1cbiAgICBpZiAoKF9iID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5vZGUpIHtcbiAgICAgICAgZXJyb3JzW2luZGV4XS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbaW5kZXhdLm5vZGVdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHByaW50RXJyb3JzKCkge1xuICAgIGVycm9ycy5zb3J0KChhLCBiKSA9PiBhLmxldmVsIC0gYi5sZXZlbCk7XG4gICAgc2VsZWN0RXJyb3IoMCk7XG4gICAgbGV0IHRleHQgPSBlcnJvcnNcbiAgICAgICAgLm1hcCgoZSkgPT4ge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgcmV0dXJuIGAke0Vycm9yTGV2ZWxbZS5sZXZlbF19XFx0fCAke2UuZXJyb3J9IHwgUEFHRTokeygoX2EgPSBlLnBhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lKSB8fCAnJ30gJHsoX2IgPSBlLm5vZGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi50eXBlfTokeygoX2MgPSBlLm5vZGUpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5uYW1lKSB8fCAnJ31gO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICB0ZXh0ICs9ICdcXG5Eb25lJztcbiAgICBwcmludCh0ZXh0KTtcbn1cbmZ1bmN0aW9uIGFzc2VydCh2YWwsIGVycm9yLCBwYWdlLCBub2RlLCBsZXZlbCA9IEVycm9yTGV2ZWwuRVJST1IpIHtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgICBlcnJvcnMucHVzaCh7IG5vZGUsIHBhZ2UsIGVycm9yLCBsZXZlbCB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmZ1bmN0aW9uIGRlZXBOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlZXBOb2RlcyhuKSk7XG59XG5mdW5jdGlvbiBkZXNjZW5kYW50cyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBbbm9kZSwgLi4ubm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZXNjZW5kYW50cyhuKSldO1xufVxuZnVuY3Rpb24gZGVzY2VuZGFudHNXaXRob3V0U2VsZihub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVzY2VuZGFudHMobikpO1xufVxuZnVuY3Rpb24gbGludFZlY3RvcihwYWdlLCBub2RlKSB7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsICdOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS4nLCBwYWdlLCBub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15cXC98XmRyYXctbGluZSR8XmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyR8XmZsaXAkfF5WZWN0b3IkfF5cXGQrJHxeRWxsaXBzZSR8XlJlY3RhbmdsZSQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBsZXQgZmlsbHMgPSBub2RlLmZpbGxzO1xuICAgIGxldCBzdHJva2VzID0gbm9kZS5zdHJva2VzO1xuICAgIGFzc2VydCghZmlsbHMubGVuZ3RoIHx8ICFzdHJva2VzLmxlbmd0aCwgJ1Nob3VsZCBub3QgaGF2ZSBmaWxsK3N0cm9rZScsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgc3Ryb2tlcy5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgIGFzc2VydChzLnZpc2libGUsICdTdHJva2UgbXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChzLnR5cGUgPT0gJ1NPTElEJywgJ1N0cm9rZSBtdXN0IGJlIHNvbGlkJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGxldCBzMSA9IHM7XG4gICAgICAgIGFzc2VydChzMS5jb2xvci5yICE9IDAgfHwgczEuY29sb3IuZyAhPSAwIHx8IHMxLmNvbG9yLmIgIT0gMCwgJ1N0cm9rZSBjb2xvciBtdXN0IG5vdCBiZSBibGFjaycsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoczEuY29sb3IuciAhPSAxIHx8IHMxLmNvbG9yLmcgIT0gMSB8fCBzMS5jb2xvci5iICE9IDEsICdTdHJva2UgY29sb3IgbXVzdCBub3QgYmUgd2hpdGUnLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBmaWxscy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgIGFzc2VydChmLnZpc2libGUsICdGaWxsIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoZi50eXBlID09ICdTT0xJRCcsICdGaWxsIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgbGV0IGYxID0gZjtcbiAgICAgICAgYXNzZXJ0KGYxLmNvbG9yLnIgIT0gMCB8fCBmMS5jb2xvci5nICE9IDAgfHwgZjEuY29sb3IuYiAhPSAwLCAnRmlsbCBjb2xvciBtdXN0IG5vdCBiZSBibGFjaycsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAxIHx8IGYxLmNvbG9yLmcgIT0gMSB8fCBmMS5jb2xvci5iICE9IDEsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCAvUk9VTkR8Tk9ORS8udGVzdChTdHJpbmcobm9kZS5zdHJva2VDYXApKSwgYFN0cm9rZSBjYXBzIG11c3QgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUNhcCl9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuRVJST1IpO1xuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgbm9kZS5zdHJva2VKb2luID09ICdST1VORCcsIGBTdHJva2Ugam9pbnMgc2hvdWxkIGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VKb2luKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBjb25zdCByZ2J0ID0gdGFncy5maW5kKChzKSA9PiAvXnJnYi10ZW1wbGF0ZSQvLnRlc3QocykpO1xuICAgIGNvbnN0IGFuaW0gPSB0YWdzLmZpbmQoKHMpID0+IC9eYmxpbmskfF5kcmF3LWxpbmUkLy50ZXN0KHMpKTtcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cbn1cbmZ1bmN0aW9uIGxpbnRHcm91cChwYWdlLCBub2RlKSB7XG4gICAgYXNzZXJ0KCEvQk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qobm9kZS50eXBlKSwgJ05vdGljZSBCT09MRUFOX09QRVJBVElPTicsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsICdOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS4nLCBwYWdlLCBub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaydcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxufVxuZnVuY3Rpb24gbGludElucHV0KHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5uYW1lID09ICdpbnB1dCcsIFwiTXVzdCBiZSAnaW5wdXQnXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGRlc2NlbmRhbnRzV2l0aG91dFNlbGYobm9kZSkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gbGludFNldHRpbmdzKHBhZ2UsIG5vZGUpIHtcbiAgICB2YXIgX2E7XG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSAnRUxMSVBTRScsIFwiTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdcIiwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9ec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xuICAgICAgICBvcmRlciA9ICdsYXllcnMnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3JkZXIgPSAnc3RlcHMnO1xuICAgIH1cbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnem9vbS1zY2FsZS0nLCAnJykpIHx8XG4gICAgICAgICcxJyk7XG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKCFhc3NlcnQoc3RlcC50eXBlID09ICdHUk9VUCcsIFwiTXVzdCBiZSAnR1JPVVAnIHR5cGUnXCIsIHBhZ2UsIHN0ZXApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHN0ZXAub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoc3RlcC52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgc3RlcCk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eXFwvfF5zdGVwJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XnMtbXVsdGlzdGVwLWJnJHxeYnJ1c2gtbmFtZS1cXHcrJHxeY2xlYXItbGF5ZXItXFxkKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAvLyBhc3NlcnQoIS9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1iZyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyBpcyBvYnNvbGV0ZWAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgfSk7XG4gICAgY29uc3QgYmcgPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYmckfF5zLW11bHRpc3RlcC1iZy1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3QgYnJ1c2ggPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3Qgc3MgPSBwYXJzZUludCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9ec3MtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnc3MtJywgJycpKTtcbiAgICBjb25zdCBvID0gdGFncy5maW5kKChzKSA9PiAvXm8tXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoKF9iID0gdGFncy5maW5kKChzKSA9PiAvXmJzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoJ2JzLScsICcnKSk7XG4gICAgbWF4QnMgPSBNYXRoLm1heChicyA/IGJzIDogbWF4QnMsIG1heEJzKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDE1LCAnc3MgbXVzdCBiZSA+PSAxNScsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghc3MgfHwgIWJzIHx8IHNzID4gYnMsICdzcyBtdXN0IGJlID4gYnMnLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzIDw9IHpvb21TY2FsZSAqIDEyLjgsIGBicyBtdXN0IGJlIDw9ICR7em9vbVNjYWxlICogMTIuOH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gem9vbVNjYWxlICogMC40NCwgYGJzIG11c3QgYmUgPj0gJHt6b29tU2NhbGUgKiAwLjQ0fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFvIHx8IG9yZGVyID09ICdsYXllcnMnLCBgJHtvfSBtdXN0IGJlIHVzZWQgb25seSB3aXRoIHNldHRpbmdzIG9yZGVyLWxheWVyc2AsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydChvcmRlciAhPT0gJ2xheWVycycgfHwgISFvLCAnTXVzdCBoYXZlIG8tTiBvcmRlciBudW1iZXInLCBwYWdlLCBzdGVwKTtcbiAgICBjb25zdCBmZiA9IHN0ZXAuZmluZE9uZSgobikgPT4gbi5maWxscyAmJiBuLmZpbGxzWzBdKTtcbiAgICBjb25zdCBzZiA9IHN0ZXAuZmluZE9uZSgobikgPT4geyB2YXIgX2E7IHJldHVybiAoKF9hID0gbi5zdHJva2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA+IDA7IH0pO1xuICAgIGFzc2VydCghKGJnICYmIHNzICYmIHNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2UgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghKGJnICYmIHNzICYmICFzZiksICdTaG91bGQgbm90IHVzZSBiZytzcyAoc3Ryb2tlIG5vdCBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgYXNzZXJ0KCFiZyB8fCAhIWZmLCBcImJnIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aG91dCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnJ1c2ggfHwgIWZmLCBcImJydXNoIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIHN0ZXAuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAobi5uYW1lID09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgIGxpbnRJbnB1dChwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuLm5hbWUgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgICAgICAgIC8vIGxpbnQgdGVtcGxhdGVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdpbnB1dCcgb3IgJ3RlbXBsYXRlJ1wiLCBwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGJsaW5rTm9kZXMgPSBmaW5kQWxsKHN0ZXAsIChuKSA9PiBnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eYmxpbmskLy50ZXN0KHQpKSAhPT0gdW5kZWZpbmVkKS5mbGF0TWFwKGRlZXBOb2Rlcyk7XG4gICAgY29uc3QgZmlsbGVkTm9kZSA9IGJsaW5rTm9kZXMuZmluZCgobikgPT4gbi5maWxsc1swXSk7XG4gICAgYXNzZXJ0KGJsaW5rTm9kZXMubGVuZ3RoID09IDAgfHwgISFmaWxsZWROb2RlIHx8IGJsaW5rTm9kZXMubGVuZ3RoID4gMywgJ1Nob3VsZCB1c2UgZHJhdy1saW5lIGlmIDwgNCBsaW5lcycsIHBhZ2UsIGJsaW5rTm9kZXNbMF0sIEVycm9yTGV2ZWwuSU5GTyk7XG59XG5mdW5jdGlvbiBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDEzNjYgJiYgbm9kZS5oZWlnaHQgPT0gMTAyNCwgJ011c3QgYmUgMTM2NngxMDI0JywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCEhbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSksIFwiTXVzdCBoYXZlICdzLW11bHRpc3RlcC1yZXN1bHQnIGNoaWxkXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCBzZXR0aW5ncyA9IG5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gbi5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpO1xuICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICBsaW50U2V0dGluZ3MocGFnZSwgc2V0dGluZ3MpO1xuICAgIH1cbiAgICBsZXQgb3JkZXJOdW1iZXJzID0ge307XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgICAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSAvXm8tKFxcZCspJC8uZXhlYyh0YWcpO1xuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG8gPSBmb3VuZFsxXTtcbiAgICAgICAgICAgIGFzc2VydCghb3JkZXJOdW1iZXJzW29dLCBgTXVzdCBoYXZlIHVuaXF1ZSAke3RhZ30gdmFsdWVzYCwgcGFnZSwgc3RlcCk7XG4gICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIG9yZGVyTnVtYmVyc1tvXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHN0ZXAubmFtZS5zdGFydHNXaXRoKCdzdGVwJykpIHtcbiAgICAgICAgICAgIGxpbnRTdGVwKHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSkge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ3NldHRpbmdzJyBvciAnc3RlcCdcIiwgcGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXNzZXJ0KG1heEJzID4gKHpvb21TY2FsZSAtIDEpICogMTIuOCwgYHpvb20tc2NhbGUgJHt6b29tU2NhbGV9IG11c3QgYmUgJHtNYXRoLmNlaWwobWF4QnMgLyAxMi44KX0gZm9yIG1heCBicyAke21heEJzfSB1c2VkYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gNDAwICYmIG5vZGUuaGVpZ2h0ID09IDQwMCwgJ011c3QgYmUgNDAweDQwMCcsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFBhZ2UocGFnZSkge1xuICAgIGlmICgvXlxcL3xeSU5ERVgkLy50ZXN0KHBhZ2UubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFzc2VydCgvXlthLXpcXC0wLTldKyQvLnRlc3QocGFnZS5uYW1lKSwgYFBhZ2UgbmFtZSAnJHtwYWdlLm5hbWV9JyBtdXN0IG1hdGNoIFthLXpcXFxcLTAtOV0rLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXmxlc3NvbiQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAnbGVzc29uJ1wiLCBwYWdlKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHBhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKG5vZGUubmFtZSA9PSAnbGVzc29uJykge1xuICAgICAgICAgICAgbGludFRhc2tGcmFtZShwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLm5hbWUgPT0gJ3RodW1ibmFpbCcpIHtcbiAgICAgICAgICAgIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoL15cXC8vLnRlc3Qobm9kZS5uYW1lKSwgXCJNdXN0IGJlICd0aHVtYm5haWwnIG9yICdsZXNzb24nLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5cIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGxpbnRJbmRleChwYWdlKSB7XG4gICAgaWYgKCFhc3NlcnQocGFnZS5jaGlsZHJlbi5sZW5ndGggPT0gMSwgJ0luZGV4IHBhZ2UgbXVzdCBjb250YWluIGV4YWN0bHkgMSBlbGVtZW50JywgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xuICAgIGxpbnRUaHVtYm5haWwocGFnZSwgcGFnZS5jaGlsZHJlblswXSk7XG59XG5mdW5jdGlvbiBsaW50Q291cnNlKCkge1xuICAgIGFzc2VydCgvXkNPVVJTRS1bYS16XFwtMC05XSskLy50ZXN0KGZpZ21hLnJvb3QubmFtZSksIGBDb3Vyc2UgbmFtZSAnJHtmaWdtYS5yb290Lm5hbWV9JyBtdXN0IG1hdGNoIENPVVJTRS1bYS16XFxcXC0wLTldK2ApO1xuICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUgPT0gJ0lOREVYJyk7XG4gICAgaWYgKGFzc2VydCghIWluZGV4LCBcIk11c3QgaGF2ZSAnSU5ERVgnIHBhZ2VcIikpIHtcbiAgICAgICAgbGludEluZGV4KGluZGV4KTtcbiAgICB9XG4gICAgLy8gZmluZCBhbGwgbm9uLXVuaXF1ZSBuYW1lZCBwYWdlc1xuICAgIGNvbnN0IG5vblVuaXF1ZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmlsdGVyKChwLCBpLCBhKSA9PiBhLmZpbmRJbmRleCgocDIpID0+IHAyLm5hbWUgPT0gcC5uYW1lKSAhPSBpKTtcbiAgICBub25VbmlxdWUuZm9yRWFjaCgocCkgPT4gYXNzZXJ0KGZhbHNlLCBgUGFnZSBuYW1lICcke3AubmFtZX0nIG11c3QgYmUgdW5pcXVlYCwgcCkpO1xuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBsaW50UGFnZShwYWdlKTtcbiAgICB9XG59XG5vbignc2VsZWN0RXJyb3InLCBzZWxlY3RFcnJvcik7XG5vbignbGludENvdXJzZScsICgpID0+IHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBsaW50Q291cnNlKCk7XG4gICAgcHJpbnRFcnJvcnMoKTtcbn0pO1xub24oJ2xpbnRQYWdlJywgKCkgPT4ge1xuICAgIGVycm9ycyA9IFtdO1xuICAgIGxpbnRQYWdlKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICBwcmludEVycm9ycygpO1xufSk7XG4vLyBubyBoaWRkZW4gZmlsbC9zdHJva2Vcbi8vIG5vIGVmZmVjdHNcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgcHJpbnQgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBcInRhc2stbmFtZSAke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiID0gXCIke2NhcGl0YWxpemUocGFnZS5uYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRMZXNzb24ocGFnZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5pbmRleE9mKHBhZ2UpO1xuICAgICAgICBjb25zdCBsZXNzb25Ob2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBjb25zdCB0aHVtYm5haWxOb2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xuICAgICAgICBpZiAoIWxlc3Nvbk5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlID0geWllbGQgbGVzc29uTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdTVkcnLFxuICAgICAgICAgICAgLy8gc3ZnT3V0bGluZVRleHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3ZnSWRBdHRyaWJ1dGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0aHVtYm5haWwgPSB5aWVsZCB0aHVtYm5haWxOb2RlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1dJRFRIJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3Vyc2VQYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIHBhdGg6IHBhZ2UubmFtZSxcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDb3Vyc2UoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgW2xlc3NvbnMsIHRodW1ibmFpbF0gPSB5aWVsZCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBQcm9taXNlLmFsbChmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocGFnZSkgPT4gcGFnZS5uYW1lICE9ICdJTkRFWCcpXG4gICAgICAgICAgICAgICAgLm1hcCgocGFnZSkgPT4gZXhwb3J0TGVzc29uKHBhZ2UpKSksXG4gICAgICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbmQoKHBhZ2UpID0+IHBhZ2UubmFtZSA9PSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnUE5HJyxcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKCdDT1VSU0UtJywgJycpLFxuICAgICAgICAgICAgbGVzc29ucyxcbiAgICAgICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgc3dpZnRDb3Vyc2VOYW1lID0gY291cnNlTmFtZVxuICAgICAgICAuc3BsaXQoJy0nKVxuICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9XG4gICAgICAgIHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiwgcHJvOiB0cnVlKSxcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgIGxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXG4gICAgYXV0aG9yOiBSRVBMQUNFLFxuICAgIHRhc2tzOiBbXG4ke3Rhc2tzfSAgICBdKVxuYDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xuICAgIHByaW50KGNvZGUpO1xufVxub24oJ2dlbmVyYXRlQ29kZScsIGdlbmVyYXRlQ29kZSk7XG4iLCJpbXBvcnQgeyBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcE5vZGVzKCkge1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcbiAgICByZXR1cm4gc3RlcHNCeU9yZGVyKGxlc3NvbikubWFwKChzdGVwKSA9PiB7XG4gICAgICAgIHJldHVybiB7IGlkOiBzdGVwLmlkLCBuYW1lOiBzdGVwLm5hbWUgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwT3JkZXIoc3RlcHMpIHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgc3RlcHMuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xuICAgICAgICBjb25zdCBzID0gbGVzc29uLmZpbmRPbmUoKGVsKSA9PiBlbC5pZCA9PSBzdGVwLmlkKTtcbiAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgIHMubmFtZSA9IHMubmFtZS5yZXBsYWNlKC9vLVxcZCsvLCAnby0nICsgKGkgKyAxKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IGVtaXQsIG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGdldFRhZ3MgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2V0T3JkZXIoc3RlcCkge1xuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xuICAgIHJldHVybiBpc05hTihvKSA/IDk5OTkgOiBvO1xufVxuZnVuY3Rpb24gZ2V0VGFnKHN0ZXAsIHRhZykge1xuICAgIGNvbnN0IHYgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCh0YWcpKTtcbiAgICByZXR1cm4gdiA/IHYucmVwbGFjZSh0YWcsICcnKSA6ICcwJztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZWxldGVUbXAoKSB7XG4gICAgZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBlbC5uYW1lLnN0YXJ0c1dpdGgoJ3RtcC0nKSlcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG59XG5sZXQgbGFzdFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiAvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZWwudHlwZSkpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFdlaWdodCA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDMwIDogNTA7XG4gICAgICAgICAgICBlbC5zdHJva2VXZWlnaHQgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCBkZWZhdWx0V2VpZ2h0O1xuICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBwaW5rLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICBwaW5rLm5hbWUgPSAncGluayAnICsgZWwubmFtZTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICAgICAgLy8gY2xvbmUgZWxlbWVudCBoZXJlIGFuZCBnaXZlIGhpbSB0aGluIHBpbmsgc3Ryb2tlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMC4xLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgIHRlbXBsYXRlLnggPSBpbnB1dC5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXSAtIGxlc3Nvbi5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXTtcbiAgICB0ZW1wbGF0ZS55ID0gaW5wdXQuYWJzb2x1dGVUcmFuc2Zvcm1bMV1bMl0gLSBsZXNzb24uYWJzb2x1dGVUcmFuc2Zvcm1bMV1bMl07XG59XG5mdW5jdGlvbiBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCkge1xuICAgIGNvbnN0IGRlZmF1bHRCUyA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDEyLjggOiAxMDtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IGRlZmF1bHRCUztcbiAgICBjb25zdCBzbWFsbExpbmUgPSBmaWdtYS5jcmVhdGVMaW5lKCk7XG4gICAgc21hbGxMaW5lLm5hbWUgPSAnc21hbGxMaW5lJztcbiAgICBzbWFsbExpbmUucmVzaXplKDMwMCwgMCk7XG4gICAgc21hbGxMaW5lLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLjgsIGI6IDAgfSB9XTtcbiAgICBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgLyAzO1xuICAgIHNtYWxsTGluZS5zdHJva2VDYXAgPSAnUk9VTkQnO1xuICAgIHNtYWxsTGluZS5zdHJva2VBbGlnbiA9ICdDRU5URVInO1xuICAgIHNtYWxsTGluZS55ID0gc21hbGxMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgYmlnTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xuICAgIGJpZ0xpbmUubmFtZSA9ICdiaWdMaW5lJztcbiAgICBiaWdMaW5lLm9wYWNpdHkgPSAwLjM7XG4gICAgYmlnTGluZS5zdHJva2VXZWlnaHQgPSBicyArIE1hdGgucG93KGJzLCAxLjQpICogMC44O1xuICAgIGJpZ0xpbmUueSA9IGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcbiAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKFtiaWdMaW5lLCBzbWFsbExpbmVdLCBsZXNzb24ucGFyZW50KTtcbiAgICBncm91cC5uYW1lID0gJ3RtcC1icyc7XG4gICAgZ3JvdXAueCA9IGxlc3Nvbi54O1xuICAgIGdyb3VwLnkgPSBsZXNzb24ueSAtIDgwO1xufVxuZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwYWdlLCBzZXR0aW5ncykge1xuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBjb25zdCB7IGRpc3BsYXlNb2RlLCBzdGVwTnVtYmVyIH0gPSBzZXR0aW5ncztcbiAgICBjb25zdCBsZXNzb24gPSBwYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcbiAgICBpZiAoIWxlc3Nvbikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzdGVwTnVtYmVyIC0gMV07XG4gICAgcGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XG4gICAgY29uc3Qgc3RlcENvdW50ID0gbGVzc29uLmNoaWxkcmVuLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKS5sZW5ndGg7XG4gICAgZW1pdCgndXBkYXRlRm9ybScsIHtcbiAgICAgICAgc2hhZG93U2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSksXG4gICAgICAgIGJydXNoU2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdicy0nKSksXG4gICAgICAgIHRlbXBsYXRlOiBnZXRUYWcoc3RlcCwgJ3MtJyksXG4gICAgICAgIHN0ZXBDb3VudCxcbiAgICAgICAgc3RlcE51bWJlcixcbiAgICAgICAgZGlzcGxheU1vZGUsXG4gICAgfSk7XG4gICAgZGVsZXRlVG1wKCk7XG4gICAgc3dpdGNoIChkaXNwbGF5TW9kZSkge1xuICAgICAgICBjYXNlICdhbGwnOlxuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3VycmVudCc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIHN0ZXBzQnlPcmRlcihsZXNzb24pLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBpIDwgc3RlcE51bWJlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG59LCAxNTAwKTtcbmZ1bmN0aW9uIHVwZGF0ZVByb3BzKHNldHRpbmdzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzZXR0aW5ncy5zdGVwTnVtYmVyIC0gMV07XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnc3MtJykgJiYgIXQuc3RhcnRzV2l0aCgnYnMtJykgJiYgIXQuc3RhcnRzV2l0aCgncy0nKSk7XG4gICAgaWYgKHNldHRpbmdzLnRlbXBsYXRlKSB7XG4gICAgICAgIHRhZ3Muc3BsaWNlKDEsIDAsIGBzLSR7c2V0dGluZ3MudGVtcGxhdGV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5zaGFkb3dTaXplKSB7XG4gICAgICAgIHRhZ3MucHVzaChgc3MtJHtzZXR0aW5ncy5zaGFkb3dTaXplfWApO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuYnJ1c2hTaXplKSB7XG4gICAgICAgIHRhZ3MucHVzaChgYnMtJHtzZXR0aW5ncy5icnVzaFNpemV9YCk7XG4gICAgfVxuICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbignICcpO1xufVxub24oJ3VwZGF0ZURpc3BsYXknLCAoc2V0dGluZ3MpID0+IHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHNldHRpbmdzKSk7XG5vbigndXBkYXRlUHJvcHMnLCB1cGRhdGVQcm9wcyk7XG5maWdtYS5vbignY3VycmVudHBhZ2VjaGFuZ2UnLCAoKSA9PiB7XG4gICAgdXBkYXRlRGlzcGxheShsYXN0UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG59KTtcbmZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgaWYgKCFzdGVwIHx8ICFsZXNzb24gfHwgIWxlc3Nvbi5jaGlsZHJlbi5pbmNsdWRlcyhzdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0ZXBOdW1iZXIgPSBzdGVwc0J5T3JkZXIobGVzc29uKS5pbmRleE9mKHN0ZXApICsgMTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlciB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgZW1pdCB9IGZyb20gJy4uL2V2ZW50cyc7XG5leHBvcnQgZnVuY3Rpb24gZmluZEFsbChub2RlLCBmKSB7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIGFyci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgIGFyciA9IGFyci5jb25jYXQoY2hpbGRyZW4uZmxhdE1hcCgocCkgPT4gZmluZEFsbChwLCBmKSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZS5wYXJlbnQsIGYpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWdzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5uYW1lLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRhZyhub2RlLCB0YWcpIHtcbiAgICBub2RlLm5hbWUgPSBnZXRUYWdzKG5vZGUpLmNvbmNhdChbdGFnXSkuam9pbignICcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByaW50KHRleHQpIHtcbiAgICBmaWdtYS51aS5yZXNpemUoNzAwLCA0MDApO1xuICAgIGVtaXQoJ3ByaW50JywgdGV4dCk7XG59XG5leHBvcnQgY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgY3JlYXRlUGx1Z2luQVBJLCBjcmVhdGVVSUFQSSB9IGZyb20gJ2ZpZ21hLWpzb25ycGMnO1xuaW1wb3J0IHsgZXhwb3J0VGV4dHMgfSBmcm9tICcuL3BsdWdpbi9mb3JtYXQtcnBjJztcbmltcG9ydCB7IGV4cG9ydExlc3NvbiwgZXhwb3J0Q291cnNlIH0gZnJvbSAnLi9wbHVnaW4vcHVibGlzaCc7XG5pbXBvcnQgeyBnZXRTdGVwTm9kZXMsIHNldFN0ZXBPcmRlciB9IGZyb20gJy4vcGx1Z2luL3R1bmUtcnBjJztcbi8vIEZpZ21hIHBsdWdpbiBtZXRob2RzXG5leHBvcnQgY29uc3QgcGx1Z2luQXBpID0gY3JlYXRlUGx1Z2luQVBJKHtcbiAgICBzZXRTZXNzaW9uVG9rZW4odG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicsIHRva2VuKTtcbiAgICB9LFxuICAgIGdldFNlc3Npb25Ub2tlbigpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdzZXNzaW9uVG9rZW4nKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleHBvcnRMZXNzb24sXG4gICAgZXhwb3J0Q291cnNlLFxuICAgIGdldFN0ZXBOb2RlcyxcbiAgICBzZXRTdGVwT3JkZXIsXG4gICAgZXhwb3J0VGV4dHMsXG59KTtcbi8vIEZpZ21hIFVJIGFwcCBtZXRob2RzXG5leHBvcnQgY29uc3QgdWlBcGkgPSBjcmVhdGVVSUFQSSh7fSk7XG4iXSwic291cmNlUm9vdCI6IiJ9