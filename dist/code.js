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
/*! exports provided: createLesson, separateStep, splitByColor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLesson", function() { return createLesson; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "separateStep", function() { return separateStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitByColor", function() { return splitByColor; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");

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
                r: 0.7686274647712708,
                g: 0.7686274647712708,
                b: 0.7686274647712708,
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
        name: 'settings capture-color zoom-scale-2 order-layers',
        x: 10,
        y: 10,
    });
    lesson.appendChild(settingsEllipse);
    originalImage.remove();
}
function separateStep() {
    const nodes = figma.currentPage.selection;
    const parentStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParent"])(nodes[0], (n) => n.name.startsWith('step'));
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
function stringifyColor(color) {
    let { r, g, b } = color;
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return `rgb(${r}, ${g}, ${b})`;
}
function createStepNode(node, nodesArray) {
    const input = figma.group(nodesArray, node);
    input.name = 'input';
    const step = figma.group([input], node);
    step.name = 'step s-multistep brush';
    node.appendChild(step);
}
function addToMap(map, key, node) {
    if (!map.has(key)) {
        map.set(key, []);
    }
    map.get(key).push(node);
}
function splitByColor() {
    const lesson = figma.currentPage.children.find((el) => el.name === 'lesson');
    if (lesson.children[0].type !== 'GROUP') {
        return;
    }
    let fillsByColor = new Map();
    let strokesByColor = new Map();
    let unknownNodes = [];
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(lesson.children[0]).forEach((n) => {
        if ('fills' in n &&
            n.fills !== figma.mixed &&
            n.fills[0].type === 'SOLID') {
            addToMap(fillsByColor, stringifyColor(n.fills[0].color), n);
        }
        else if ('strokes' in n && n.strokes[0].type === 'SOLID') {
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
    const result = lesson.children.find((n) => n.name === 'step s-multistep-result');
    if (result) {
        result.remove();
    }
    createResultNode(lesson);
    // Remove original node
    lesson.children[0].remove();
}


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
    // setTimeout(() => { // crashes, probably because of selection happening from the DisplayForm
    if ((_b = errors[index]) === null || _b === void 0 ? void 0 : _b.node) {
        errors[index].page.selection = [errors[index].node];
    }
    // }, 0)
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
    var _a, _b, _c;
    if (!assert(step.type == 'GROUP', "Must be 'GROUP' type'", page, step)) {
        return;
    }
    assert(step.opacity == 1, 'Must be opaque', page, step);
    assert(step.visible, 'Must be visible', page, step);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step);
    tags.forEach((tag) => {
        assert(/^\/|^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-(\d+,?)+$|^ss-\d+$|^bs-\d+$|^o-\d+$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, step);
        // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);
    });
    const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s));
    const brush = tags.find((s) => /^s-multistep-brush$|^s-multistep-brush-\d+$/.test(s));
    const ss = parseInt((_a = tags.find((s) => /^ss-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace('ss-', ''));
    const o = tags.find((s) => /^o-\d+$/.test(s));
    const bs = parseInt((_b = tags.find((s) => /^bs-\d+$/.test(s))) === null || _b === void 0 ? void 0 : _b.replace('bs-', ''));
    const brushName = (_c = tags
        .find((s) => /^brush-name-\w+$/.test(s))) === null || _c === void 0 ? void 0 : _c.replace('brush-name-', '');
    const terminalNodes = descendantsWithoutSelf(step).filter((v) => v['children'] == undefined);
    const maxSize = terminalNodes.reduce((acc, v) => {
        return Math.max(acc, v.width, v.height);
    }, 0);
    maxBs = Math.max(bs ? bs : maxBs, maxBs);
    assert(!ss || ss >= 20 || maxSize <= 100, `Should not use ss<20 with long lines. Consider using bg template. ${maxSize}>100`, page, step, ErrorLevel.INFO);
    assert(!ss || ss >= 20 || terminalNodes.length <= 8, `Should not use ss<20 with too many lines. Consider using bg template. ${terminalNodes.length}>8`, page, step, ErrorLevel.INFO);
    assert(!bs || bs >= 15 || brushName == 'pencil', 'Should not use bs<15', page, step, ErrorLevel.INFO);
    assert(!ss || ss >= 15, 'ss must be >= 15', page, step);
    assert(!ss || !bs || ss > bs, 'ss must be > bs', page, step);
    assert(!bs || bs <= zoomScale * 12.8, `bs must be <= ${zoomScale * 12.8} for this zoom-scale`, page, step);
    assert(!bs || bs >= zoomScale * 0.44, `bs must be >= ${zoomScale * 0.44} for this zoom-scale`, page, step);
    assert(!o || order == 'layers', `${o} must be used only with settings order-layers`, page, step);
    assert(order !== 'layers' || !!o, 'Must have o-N order number', page, step);
    const sf = step.findOne((n) => { var _a; return ((_a = n.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    const ffs = step.findAll((n) => n.fills && n.fills[0]);
    const bigFfs = ffs.filter((n) => n.width > 27 || n.height > 27);
    const ff = ffs.length > 0;
    assert(!(bg && ss && sf), 'Should not use bg+ss (stroke present)', page, step, ErrorLevel.INFO);
    assert(!(bg && ss && !sf), 'Should not use bg+ss (stroke not present)', page, step, ErrorLevel.WARN);
    assert(!bg || ff, "bg step shouldn't be used without filled-in vectors", page, step, ErrorLevel.INFO);
    assert(!brush || bigFfs.length == 0, "brush step shouldn't be used with filled-in vectors (size > 27)", page, step, ErrorLevel.INFO);
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
/*! exports provided: getSteps, setStepOrder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSteps", function() { return getSteps; });
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
    const leaf = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(node)[0];
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
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson');
    return stepsByOrder(lesson).map((step) => {
        return { id: step.id, name: step.name, colors: getColors(step) };
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
    template.relativeTransform = input.relativeTransform;
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
    const selection = figma.currentPage.selection[0];
    if (!selection ||
        !lesson ||
        !lesson.children.includes(selection) ||
        selection.type !== 'GROUP') {
        return;
    }
    //update step
    const step = figma.currentPage.selection[0];
    const stepNumber = stepsByOrder(lesson).indexOf(step) + 1;
    updateDisplay(figma.currentPage, { displayMode: lastMode, stepNumber });
});


/***/ }),

/***/ "./src/plugin/util.ts":
/*!****************************!*\
  !*** ./src/plugin/util.ts ***!
  \****************************/
/*! exports provided: findAll, findLeafNodes, findParent, getTags, addTag, print, capitalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAll", function() { return findAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLeafNodes", function() { return findLeafNodes; });
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
function findLeafNodes(node) {
    return node.findAll((n) => !('children' in n));
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
/* harmony import */ var _plugin_create__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugin/create */ "./src/plugin/create.ts");
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
    setStepOrder: _plugin_tune_rpc__WEBPACK_IMPORTED_MODULE_3__["setStepOrder"],
    exportTexts: _plugin_format_rpc__WEBPACK_IMPORTED_MODULE_1__["exportTexts"],
    createLesson: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["createLesson"],
    separateStep: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["separateStep"],
    splitByColor: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["splitByColor"],
});
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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QUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUM2RDtBQUNYO0FBQ1k7QUFDSDtBQUNnQjtBQUMzRTtBQUNPLGtCQUFrQixxRUFBZTtBQUN4QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSwwRUFBWTtBQUNoQixJQUFJLDBFQUFZO0FBQ2hCLElBQUksbUVBQVE7QUFDWixJQUFJLDJFQUFZO0FBQ2hCLElBQUksMkVBQVc7QUFDZixJQUFJLHlFQUFZO0FBQ2hCLElBQUkseUVBQVk7QUFDaEIsSUFBSSx5RUFBWTtBQUNoQixDQUFDO0FBQ0Q7QUFDTyxjQUFjLGlFQUFXLEdBQUciLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vaW5kZXgudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cy5QYXJzZUVycm9yID0gY2xhc3MgUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiUGFyc2UgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI3MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRSZXF1ZXN0ID0gY2xhc3MgSW52YWxpZFJlcXVlc3QgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgUmVxdWVzdFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuTWV0aG9kTm90Rm91bmQgPSBjbGFzcyBNZXRob2ROb3RGb3VuZCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiTWV0aG9kIG5vdCBmb3VuZFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFBhcmFtcyA9IGNsYXNzIEludmFsaWRQYXJhbXMgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgcGFyYW1zXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAyO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnRlcm5hbEVycm9yID0gY2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW50ZXJuYWwgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDM7XG4gIH1cbn07XG4iLCJjb25zdCB7IHNldHVwLCBzZW5kUmVxdWVzdCB9ID0gcmVxdWlyZShcIi4vcnBjXCIpO1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVVSUFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVVJQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbHVnaW5BUEkgPSBmdW5jdGlvbiBjcmVhdGVQbHVnaW5BUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuIiwiY29uc3QgUlBDRXJyb3IgPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5jb25zdCB7IE1ldGhvZE5vdEZvdW5kIH0gPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5cbmxldCBzZW5kUmF3O1xuXG5pZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIGZpZ21hLnVpLm9uKCdtZXNzYWdlJywgbWVzc2FnZSA9PiBoYW5kbGVSYXcobWVzc2FnZSkpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBmaWdtYS51aS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbn0gZWxzZSBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBvbm1lc3NhZ2UgPSBldmVudCA9PiBoYW5kbGVSYXcoZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogbWVzc2FnZSB9LCBcIipcIik7XG59XG5cbmxldCBycGNJbmRleCA9IDA7XG5sZXQgcGVuZGluZyA9IHt9O1xuXG5mdW5jdGlvbiBzZW5kSnNvbihyZXEpIHtcbiAgdHJ5IHtcbiAgICBzZW5kUmF3KHJlcSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kUmVzdWx0KGlkLCByZXN1bHQpIHtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgcmVzdWx0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZW5kRXJyb3IoaWQsIGVycm9yKSB7XG4gIGNvbnN0IGVycm9yT2JqZWN0ID0ge1xuICAgIGNvZGU6IGVycm9yLmNvZGUsXG4gICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICBkYXRhOiBlcnJvci5kYXRhXG4gIH07XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIGVycm9yOiBlcnJvck9iamVjdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmF3KGRhdGEpIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlUnBjKGRhdGEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgY29uc29sZS5lcnJvcihkYXRhKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVScGMoanNvbikge1xuICBpZiAodHlwZW9mIGpzb24uaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YganNvbi5yZXN1bHQgIT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgIGpzb24uZXJyb3IgfHxcbiAgICAgIHR5cGVvZiBqc29uLm1ldGhvZCA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBzZW5kRXJyb3IoXG4gICAgICAgICAganNvbi5pZCxcbiAgICAgICAgICBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIGNhbGxiYWNrIGZvciBcIiArIGpzb24uaWQpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjay50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dChjYWxsYmFjay50aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgY2FsbGJhY2soanNvbi5lcnJvciwganNvbi5yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVSZXF1ZXN0KGpzb24pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVOb3RpZmljYXRpb24oanNvbik7XG4gIH1cbn1cblxubGV0IG1ldGhvZHMgPSB7fTtcblxuZnVuY3Rpb24gb25SZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XG4gIGlmICghbWV0aG9kc1ttZXRob2RdKSB7XG4gICAgdGhyb3cgbmV3IE1ldGhvZE5vdEZvdW5kKG1ldGhvZCk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXSguLi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVOb3RpZmljYXRpb24oanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIG1ldGhvZFwiKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmVzdWx0XG4gICAgICAgIC50aGVuKHJlcyA9PiBzZW5kUmVzdWx0KGpzb24uaWQsIHJlcykpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gc2VuZEVycm9yKGpzb24uaWQsIGVycikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kUmVzdWx0KGpzb24uaWQsIHJlc3VsdCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXR1cCA9IF9tZXRob2RzID0+IHtcbiAgT2JqZWN0LmFzc2lnbihtZXRob2RzLCBfbWV0aG9kcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kTm90aWZpY2F0aW9uID0gKG1ldGhvZCwgcGFyYW1zKSA9PiB7XG4gIHNlbmRKc29uKHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChtZXRob2QsIHBhcmFtcywgdGltZW91dCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGlkID0gcnBjSW5kZXg7XG4gICAgY29uc3QgcmVxID0geyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcywgaWQgfTtcbiAgICBycGNJbmRleCArPSAxO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnN0IGpzRXJyb3IgPSBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgICBqc0Vycm9yLmNvZGUgPSBlcnIuY29kZTtcbiAgICAgICAganNFcnJvci5kYXRhID0gZXJyLmRhdGE7XG4gICAgICAgIHJlamVjdChqc0Vycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgIH07XG5cbiAgICAvLyBzZXQgYSBkZWZhdWx0IHRpbWVvdXRcbiAgICBjYWxsYmFjay50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWxldGUgcGVuZGluZ1tpZF07XG4gICAgICByZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdCBcIiArIG1ldGhvZCArIFwiIHRpbWVkIG91dC5cIikpO1xuICAgIH0sIHRpbWVvdXQgfHwgMzAwMCk7XG5cbiAgICBwZW5kaW5nW2lkXSA9IGNhbGxiYWNrO1xuICAgIHNlbmRKc29uKHJlcSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuUlBDRXJyb3IgPSBSUENFcnJvcjtcbiIsImNvbnN0IGV2ZW50SGFuZGxlcnMgPSB7fTtcbmxldCBjdXJyZW50SWQgPSAwO1xuZXhwb3J0IGZ1bmN0aW9uIG9uKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBjb25zdCBpZCA9IGAke2N1cnJlbnRJZH1gO1xuICAgIGN1cnJlbnRJZCArPSAxO1xuICAgIGV2ZW50SGFuZGxlcnNbaWRdID0geyBoYW5kbGVyLCBuYW1lIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIGV2ZW50SGFuZGxlcnNbaWRdO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gb25jZShuYW1lLCBoYW5kbGVyKSB7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICByZXR1cm4gb24obmFtZSwgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKGRvbmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaGFuZGxlciguLi5hcmdzKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBlbWl0ID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCdcbiAgICA/IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKFtuYW1lLCAuLi5hcmdzXSk7XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBwbHVnaW5NZXNzYWdlOiBbbmFtZSwgLi4uYXJnc10sXG4gICAgICAgIH0sICcqJyk7XG4gICAgfTtcbmZ1bmN0aW9uIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKSB7XG4gICAgZm9yIChjb25zdCBpZCBpbiBldmVudEhhbmRsZXJzKSB7XG4gICAgICAgIGlmIChldmVudEhhbmRsZXJzW2lkXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXJzW2lkXS5oYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICgoX2EgPSBwYXJhbXNbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5qc29ucnBjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gcGFyYW1zWzBdO1xuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgfTtcbn1cbmVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiB2ZXJ5IGRpcnR5IGhhY2ssIG5lZWRzIGZpeGluZ1xuICAgICAgICBjb25zdCBmYWxsYmFjayA9IHdpbmRvdy5vbm1lc3NhZ2U7XG4gICAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgICAgICBmYWxsYmFjay5hcHBseSh3aW5kb3csIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IHBhcmFtc1swXTtcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlO1xuICAgICAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sIDEwMCk7XG59XG4iLCJpbXBvcnQgeyBmaW5kUGFyZW50LCBmaW5kTGVhZk5vZGVzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE5vZGUobm9kZSwgcGFyYW1ldGVycykge1xuICAgIGNvbnN0IHsgbmFtZSwgeCwgeSwgd2lkdGggPSA0MCwgaGVpZ2h0ID0gNDAgfSA9IHBhcmFtZXRlcnM7XG4gICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICBub2RlLnggPSB4O1xuICAgIG5vZGUueSA9IHk7XG4gICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG59XG5mdW5jdGlvbiBmaWxsU2VydmljZU5vZGVzKG5vZGUpIHtcbiAgICBub2RlLmZpbGxzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICByOiAwLjc2ODYyNzQ2NDc3MTI3MDgsXG4gICAgICAgICAgICAgICAgZzogMC43Njg2Mjc0NjQ3NzEyNzA4LFxuICAgICAgICAgICAgICAgIGI6IDAuNzY4NjI3NDY0NzcxMjcwOCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXTtcbn1cbmZ1bmN0aW9uIHJlc2NhbGVJbWFnZU5vZGUobm9kZSwgcmVzaXplUGFyYW1zKSB7XG4gICAgY29uc3QgeyBtYXhXaWR0aCwgbWF4SGVpZ2h0IH0gPSByZXNpemVQYXJhbXM7XG4gICAgY29uc3QgaXNDb3JyZWN0U2l6ZSA9IG5vZGUud2lkdGggPD0gbWF4V2lkdGggJiYgbm9kZS5oZWlnaHQgPD0gbWF4SGVpZ2h0O1xuICAgIGNvbnN0IGlzQ29ycmVjdFR5cGUgPSBub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnUkVDVEFOR0xFJyB8fCBub2RlLnR5cGUgPT09ICdWRUNUT1InO1xuICAgIGlmIChpc0NvcnJlY3RUeXBlICYmICFpc0NvcnJlY3RTaXplKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gTWF0aC5taW4obWF4V2lkdGggLyBub2RlLndpZHRoLCBtYXhIZWlnaHQgLyBub2RlLmhlaWdodCk7XG4gICAgICAgIG5vZGUucmVzY2FsZShzY2FsZUZhY3Rvcik7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVzdWx0Tm9kZShub2RlKSB7XG4gICAgY29uc3QgcmVzdWx0UmVjdGFuZ2xlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhyZXN1bHRSZWN0YW5nbGUpO1xuICAgIGNvbnN0IHRlbXBsYXRlR3JvdXAgPSBmaWdtYS5ncm91cChbcmVzdWx0UmVjdGFuZ2xlXSwgbm9kZSk7XG4gICAgdGVtcGxhdGVHcm91cC5uYW1lID0gJ3RlbXBsYXRlJztcbiAgICBjb25zdCByZXN1bHQgPSBmaWdtYS5ncm91cChbdGVtcGxhdGVHcm91cF0sIG5vZGUpO1xuICAgIGZvcm1hdE5vZGUocmVzdWx0LCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcsXG4gICAgICAgIHg6IDEwLFxuICAgICAgICB5OiA2MCxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMZXNzb24oKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbmFsSW1hZ2UgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgZm9ybWF0Tm9kZShsZXNzb24sIHtcbiAgICAgICAgbmFtZTogJ2xlc3NvbicsXG4gICAgICAgIHg6IC00NjEsXG4gICAgICAgIHk6IC01MTIsXG4gICAgICAgIHdpZHRoOiAxMzY2LFxuICAgICAgICBoZWlnaHQ6IDEwMjQsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbCwge1xuICAgICAgICBuYW1lOiAndGh1bWJuYWlsJyxcbiAgICAgICAgeDogLTkwMSxcbiAgICAgICAgeTogLTUxMixcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHN0ZXBcbiAgICBjb25zdCBzdGVwID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xuICAgIHN0ZXAubmFtZSA9ICdpbWFnZSc7XG4gICAgY29uc3QgcmVzaXplZEltYWdlID0gcmVzY2FsZUltYWdlTm9kZShvcmlnaW5hbEltYWdlLCB7XG4gICAgICAgIG1heFdpZHRoOiBsZXNzb24ud2lkdGggLSA4MyAqIDIsXG4gICAgICAgIG1heEhlaWdodDogbGVzc29uLmhlaWdodCAtIDEyICogMixcbiAgICB9KTtcbiAgICBjb25zdCBzdGVwSW5wdXQgPSBmaWdtYS5ncm91cChbc3RlcF0sIGxlc3Nvbik7XG4gICAgc3RlcElucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IGZpcnN0U3RlcCA9IGZpZ21hLmdyb3VwKFtzdGVwSW5wdXRdLCBsZXNzb24pO1xuICAgIGZvcm1hdE5vZGUoZmlyc3RTdGVwLCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLWJydXNoJyxcbiAgICAgICAgeDogKGxlc3Nvbi53aWR0aCAtIHJlc2l6ZWRJbWFnZS53aWR0aCkgLyAyLFxuICAgICAgICB5OiAobGVzc29uLmhlaWdodCAtIHJlc2l6ZWRJbWFnZS5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRJbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkSW1hZ2UuaGVpZ2h0LFxuICAgIH0pO1xuICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcbiAgICBjb25zdCB0aHVtYm5haWxJbWFnZSA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcbiAgICB0aHVtYm5haWxJbWFnZS5uYW1lID0gJ2ltYWdlJztcbiAgICBjb25zdCByZXNpemVkVGh1bWJuYWlsID0gcmVzY2FsZUltYWdlTm9kZSh0aHVtYm5haWxJbWFnZSwge1xuICAgICAgICBtYXhXaWR0aDogdGh1bWJuYWlsLndpZHRoIC0gMzUgKiAyLFxuICAgICAgICBtYXhIZWlnaHQ6IHRodW1ibmFpbC5oZWlnaHQgLSAzNSAqIDIsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsR3JvdXAgPSBmaWdtYS5ncm91cChbdGh1bWJuYWlsSW1hZ2VdLCB0aHVtYm5haWwpO1xuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsR3JvdXAsIHtcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCBncm91cCcsXG4gICAgICAgIHg6ICh0aHVtYm5haWwud2lkdGggLSByZXNpemVkVGh1bWJuYWlsLndpZHRoKSAvIDIsXG4gICAgICAgIHk6ICh0aHVtYm5haWwuaGVpZ2h0IC0gcmVzaXplZFRodW1ibmFpbC5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRUaHVtYm5haWwud2lkdGgsXG4gICAgICAgIGhlaWdodDogcmVzaXplZFRodW1ibmFpbC5oZWlnaHQsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHJlc3VsdFxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcbiAgICAvLyBDcmVhdGUgc2V0dGluZ3NcbiAgICBjb25zdCBzZXR0aW5nc0VsbGlwc2UgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhzZXR0aW5nc0VsbGlwc2UpO1xuICAgIGZvcm1hdE5vZGUoc2V0dGluZ3NFbGxpcHNlLCB7XG4gICAgICAgIG5hbWU6ICdzZXR0aW5ncyBjYXB0dXJlLWNvbG9yIHpvb20tc2NhbGUtMiBvcmRlci1sYXllcnMnLFxuICAgICAgICB4OiAxMCxcbiAgICAgICAgeTogMTAsXG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHNldHRpbmdzRWxsaXBzZSk7XG4gICAgb3JpZ2luYWxJbWFnZS5yZW1vdmUoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZVN0ZXAoKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgY29uc3QgcGFyZW50U3RlcCA9IGZpbmRQYXJlbnQobm9kZXNbMF0sIChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKTtcbiAgICBjb25zdCBmcmFtZSA9IHBhcmVudFN0ZXAucGFyZW50O1xuICAgIGNvbnN0IGluZGV4ID0gZnJhbWUuY2hpbGRyZW4uZmluZEluZGV4KChuKSA9PiBuID09IHBhcmVudFN0ZXApO1xuICAgIGlmICghcGFyZW50U3RlcCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXMsIGZyYW1lKTtcbiAgICBpbnB1dC5uYW1lID0gJ2lucHV0JztcbiAgICBjb25zdCBuZXdTdGVwID0gZmlnbWEuZ3JvdXAoW2lucHV0XSwgZnJhbWUsIGluZGV4KTtcbiAgICBuZXdTdGVwLm5hbWUgPSBwYXJlbnRTdGVwLm5hbWU7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlDb2xvcihjb2xvcikge1xuICAgIGxldCB7IHIsIGcsIGIgfSA9IGNvbG9yO1xuICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xuICAgIGcgPSBNYXRoLnJvdW5kKGcgKiAyNTUpO1xuICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xuICAgIHJldHVybiBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0ZXBOb2RlKG5vZGUsIG5vZGVzQXJyYXkpIHtcbiAgICBjb25zdCBpbnB1dCA9IGZpZ21hLmdyb3VwKG5vZGVzQXJyYXksIG5vZGUpO1xuICAgIGlucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBub2RlKTtcbiAgICBzdGVwLm5hbWUgPSAnc3RlcCBzLW11bHRpc3RlcCBicnVzaCc7XG4gICAgbm9kZS5hcHBlbmRDaGlsZChzdGVwKTtcbn1cbmZ1bmN0aW9uIGFkZFRvTWFwKG1hcCwga2V5LCBub2RlKSB7XG4gICAgaWYgKCFtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgbWFwLnNldChrZXksIFtdKTtcbiAgICB9XG4gICAgbWFwLmdldChrZXkpLnB1c2gobm9kZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCeUNvbG9yKCkge1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09PSAnbGVzc29uJyk7XG4gICAgaWYgKGxlc3Nvbi5jaGlsZHJlblswXS50eXBlICE9PSAnR1JPVVAnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGZpbGxzQnlDb2xvciA9IG5ldyBNYXAoKTtcbiAgICBsZXQgc3Ryb2tlc0J5Q29sb3IgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHVua25vd25Ob2RlcyA9IFtdO1xuICAgIGZpbmRMZWFmTm9kZXMobGVzc29uLmNoaWxkcmVuWzBdKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmICgnZmlsbHMnIGluIG4gJiZcbiAgICAgICAgICAgIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmXG4gICAgICAgICAgICBuLmZpbGxzWzBdLnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgIGFkZFRvTWFwKGZpbGxzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5maWxsc1swXS5jb2xvciksIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCdzdHJva2VzJyBpbiBuICYmIG4uc3Ryb2tlc1swXS50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgICAgICBhZGRUb01hcChzdHJva2VzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5zdHJva2VzWzBdLmNvbG9yKSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1bmtub3duTm9kZXMucHVzaChuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGZvciAobGV0IGZpbGxzIG9mIGZpbGxzQnlDb2xvci52YWx1ZXMoKSkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGZpbGxzKTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3Ryb2tlcyBvZiBzdHJva2VzQnlDb2xvci52YWx1ZXMoKSkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHN0cm9rZXMpO1xuICAgIH1cbiAgICBpZiAodW5rbm93bk5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCB1bmtub3duTm9kZXMpO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgdGhlIHJlc3VsdCBpcyBsb2NhdGVkIGF0IHRoZSBlbmRcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uY2hpbGRyZW4uZmluZCgobikgPT4gbi5uYW1lID09PSAnc3RlcCBzLW11bHRpc3RlcC1yZXN1bHQnKTtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5yZW1vdmUoKTtcbiAgICB9XG4gICAgY3JlYXRlUmVzdWx0Tm9kZShsZXNzb24pO1xuICAgIC8vIFJlbW92ZSBvcmlnaW5hbCBub2RlXG4gICAgbGVzc29uLmNoaWxkcmVuWzBdLnJlbW92ZSgpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydFRleHRzKCkge1xuICAgIGNvbnN0IHRleHRzID0gZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKVxuICAgICAgICAuZmlsdGVyKChub2RlKSA9PiBub2RlLnZpc2libGUpO1xuICAgIHJldHVybiAodGV4dHNcbiAgICAgICAgLm1hcCgobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCB0biA9IG5vZGU7XG4gICAgICAgIHJldHVybiB0blxuICAgICAgICAgICAgLmdldFN0eWxlZFRleHRTZWdtZW50cyhbXG4gICAgICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAgICAgJ2ZvbnROYW1lJyxcbiAgICAgICAgICAgICdmb250V2VpZ2h0JyxcbiAgICAgICAgICAgICd0ZXh0RGVjb3JhdGlvbicsXG4gICAgICAgICAgICAndGV4dENhc2UnLFxuICAgICAgICAgICAgJ2xpbmVIZWlnaHQnLFxuICAgICAgICAgICAgJ2xldHRlclNwYWNpbmcnLFxuICAgICAgICAgICAgJ2ZpbGxzJyxcbiAgICAgICAgICAgICd0ZXh0U3R5bGVJZCcsXG4gICAgICAgICAgICAnZmlsbFN0eWxlSWQnLFxuICAgICAgICAgICAgJ2xpc3RPcHRpb25zJyxcbiAgICAgICAgICAgICdpbmRlbnRhdGlvbicsXG4gICAgICAgICAgICAnaHlwZXJsaW5rJyxcbiAgICAgICAgXSlcbiAgICAgICAgICAgIC5tYXAoKHMpID0+IHMuY2hhcmFjdGVycylcbiAgICAgICAgICAgIC5qb2luKCdcXFxcJylcbiAgICAgICAgICAgIC50cmltRW5kKCk7XG4gICAgfSlcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcbiAgICAgICAgLmZpbHRlcigodiwgaSwgYSkgPT4gYS5pbmRleE9mKHYpID09PSBpKSk7XG59XG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBhZGRUYWcsIGZpbmRBbGwsIGdldFRhZ3MgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZm9ybWF0T3JkZXIobGVzc29uKSB7XG4gICAgaWYgKGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+ICEhZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXm8tLy50ZXN0KHQpKSkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZvdW5kIG8tdGFnLiBmb3JtYXRPcmRlciBhYm9ydC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc2V0dGluZ3MgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzZXR0aW5ncycpKTtcbiAgICBhZGRUYWcoc2V0dGluZ3MsICdvcmRlci1sYXllcnMnKTtcbiAgICBjb25zdCBsYXllclJlZ2V4ID0gL14ocy1tdWx0aXN0ZXAtYnJ1c2gtfHMtbXVsdGlzdGVwLWJnLSkoXFxkKykkLztcbiAgICBjb25zdCBzdGVwcyA9IGxlc3Nvbi5maW5kQ2hpbGRyZW4oKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSAmJiAhZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBhZGRUYWcocmVzdWx0LCBgby0ke3N0ZXBzLmxlbmd0aCArIDF9YCk7XG4gICAgc3RlcHMucmV2ZXJzZSgpLmZvckVhY2goKHN0ZXAsIG9yZGVyKSA9PiB7XG4gICAgICAgIGxldCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgY29uc3QgbGF5ZXJUYWcgPSB0YWdzLmZpbmQoKHQpID0+IGxheWVyUmVnZXgudGVzdCh0KSk7XG4gICAgICAgIGxldCBsYXllciA9IDQ7XG4gICAgICAgIGlmIChsYXllclRhZykge1xuICAgICAgICAgICAgbGF5ZXIgPSBwYXJzZUludChsYXllclJlZ2V4LmV4ZWMobGF5ZXJUYWcpWzJdKTtcbiAgICAgICAgICAgIHRhZ3MgPSB0YWdzLmZpbHRlcigodCkgPT4gIWxheWVyUmVnZXgudGVzdCh0KSk7XG4gICAgICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCAvXihzLW11bHRpc3RlcC1icnVzaHxzLW11bHRpc3RlcC1iZykvLmV4ZWMobGF5ZXJUYWcpWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBzdGVwLnNldFBsdWdpbkRhdGEoJ2xheWVyJywgSlNPTi5zdHJpbmdpZnkobGF5ZXIpKTtcbiAgICAgICAgdGFncy5wdXNoKGBvLSR7b3JkZXIgKyAxfWApO1xuICAgICAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcbiAgICB9KTtcbiAgICBsZXQgc29ydGVkU3RlcHMgPSBzdGVwcy5zb3J0KChhLCBiKSA9PiBKU09OLnBhcnNlKGIuZ2V0UGx1Z2luRGF0YSgnbGF5ZXInKSkgLVxuICAgICAgICBKU09OLnBhcnNlKGEuZ2V0UGx1Z2luRGF0YSgnbGF5ZXInKSkpO1xuICAgIHNvcnRlZFN0ZXBzLmZvckVhY2goKHMpID0+IGxlc3Nvbi5pbnNlcnRDaGlsZCgxLCBzKSk7XG59XG5mdW5jdGlvbiBhdXRvRm9ybWF0KCkge1xuICAgIGNvbnN0IHRodW1iUGFnZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gJ1RIVU1CTkFJTFMnKTtcbiAgICBpZiAodGh1bWJQYWdlKSB7XG4gICAgICAgIGZpZ21hLnJvb3QuY2hpbGRyZW4uZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSB0aHVtYlBhZ2UuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XG4gICAgICAgICAgICBpZiAocC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ3RodW1ibmFpbCcpIHx8ICF0aHVtYm5haWxGcmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGh1bWJuYWlsRnJhbWUuY2xvbmUoKTtcbiAgICAgICAgICAgIGNsb25lLnJlc2l6ZSg0MDAsIDQwMCk7XG4gICAgICAgICAgICBjbG9uZS5uYW1lID0gJ3RodW1ibmFpbCc7XG4gICAgICAgICAgICBwLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZpZ21hLnJvb3QuY2hpbGRyZW4uZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBjb25zdCBvbGRMZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XG4gICAgICAgIGlmIChvbGRMZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgb2xkTGVzc29uRnJhbWUubmFtZSA9ICdsZXNzb24nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xuICAgICAgICBjb25zdCBsZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgaWYgKCF0aHVtYm5haWxGcmFtZSB8fCAhbGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aHVtYm5haWxGcmFtZS54ID0gbGVzc29uRnJhbWUueCAtIDQ0MDtcbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueSA9IGxlc3NvbkZyYW1lLnk7XG4gICAgfSk7XG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zZXR0aW5ncy8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSAxMDtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnN0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0Ly50ZXN0KG5vZGUubmFtZSkpLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5jaGlsZHJlblswXS5uYW1lID0gJ3RlbXBsYXRlJztcbiAgICAgICAgbi5jaGlsZHJlblswXS5jaGlsZHJlblswXS5uYW1lID0gJy9pZ25vcmUnO1xuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xuICAgICAgICBuLnggPSAxMDtcbiAgICAgICAgbi55ID0gNjA7XG4gICAgfSk7XG59XG5vbignYXV0b0Zvcm1hdCcsIGF1dG9Gb3JtYXQpO1xub24oJ2Zvcm1hdE9yZGVyJywgKCkgPT4gZm9ybWF0T3JkZXIoZmlnbWEuY3VycmVudFBhZ2UuZmluZENoaWxkKCh0KSA9PiB0Lm5hbWUgPT0gJ2xlc3NvbicpKSk7XG4iLCJpbXBvcnQgJy4vY3JlYXRlJztcbmltcG9ydCAnLi90dW5lJztcbmltcG9ydCAnLi9mb3JtYXQnO1xuaW1wb3J0ICcuL2xpbnRlcic7XG5pbXBvcnQgJy4vcHVibGlzaCc7XG5pbXBvcnQgJy4uL3JwYy1hcGknO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcbmZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ1MCk7XG5jb25zb2xlLmNsZWFyKCk7XG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBwcmludCwgZ2V0VGFncywgZmluZEFsbCB9IGZyb20gJy4vdXRpbCc7XG5sZXQgZXJyb3JzID0gW107XG5sZXQgem9vbVNjYWxlID0gMTtcbmxldCBtYXhCcyA9IDEyLjg7XG5sZXQgb3JkZXIgPSAnc3RlcHMnO1xudmFyIEVycm9yTGV2ZWw7XG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJFUlJPUlwiXSA9IDBdID0gXCJFUlJPUlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xufSkoRXJyb3JMZXZlbCB8fCAoRXJyb3JMZXZlbCA9IHt9KSk7XG5mdW5jdGlvbiBzZWxlY3RFcnJvcihpbmRleCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKChfYSA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYWdlKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzW2luZGV4XS5wYWdlO1xuICAgIH1cbiAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHsgLy8gY3Jhc2hlcywgcHJvYmFibHkgYmVjYXVzZSBvZiBzZWxlY3Rpb24gaGFwcGVuaW5nIGZyb20gdGhlIERpc3BsYXlGb3JtXG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1tpbmRleF0ucGFnZS5zZWxlY3Rpb24gPSBbZXJyb3JzW2luZGV4XS5ub2RlXTtcbiAgICB9XG4gICAgLy8gfSwgMClcbn1cbmZ1bmN0aW9uIHByaW50RXJyb3JzKCkge1xuICAgIGVycm9ycy5zb3J0KChhLCBiKSA9PiBhLmxldmVsIC0gYi5sZXZlbCk7XG4gICAgc2VsZWN0RXJyb3IoMCk7XG4gICAgbGV0IHRleHQgPSBlcnJvcnNcbiAgICAgICAgLm1hcCgoZSkgPT4ge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgcmV0dXJuIGAke0Vycm9yTGV2ZWxbZS5sZXZlbF19XFx0fCAke2UuZXJyb3J9IHwgUEFHRTokeygoX2EgPSBlLnBhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lKSB8fCAnJ30gJHsoX2IgPSBlLm5vZGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi50eXBlfTokeygoX2MgPSBlLm5vZGUpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5uYW1lKSB8fCAnJ31gO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICB0ZXh0ICs9ICdcXG5Eb25lJztcbiAgICBwcmludCh0ZXh0KTtcbn1cbmZ1bmN0aW9uIGFzc2VydCh2YWwsIGVycm9yLCBwYWdlLCBub2RlLCBsZXZlbCA9IEVycm9yTGV2ZWwuRVJST1IpIHtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgICBlcnJvcnMucHVzaCh7IG5vZGUsIHBhZ2UsIGVycm9yLCBsZXZlbCB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmZ1bmN0aW9uIGRlZXBOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlZXBOb2RlcyhuKSk7XG59XG5mdW5jdGlvbiBkZXNjZW5kYW50cyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBbbm9kZSwgLi4ubm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZXNjZW5kYW50cyhuKSldO1xufVxuZnVuY3Rpb24gZGVzY2VuZGFudHNXaXRob3V0U2VsZihub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVzY2VuZGFudHMobikpO1xufVxuZnVuY3Rpb24gbGludFZlY3RvcihwYWdlLCBub2RlKSB7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsICdOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS4nLCBwYWdlLCBub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15cXC98XmRyYXctbGluZSR8XmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyR8XmZsaXAkfF5WZWN0b3IkfF5cXGQrJHxeRWxsaXBzZSR8XlJlY3RhbmdsZSQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBsZXQgZmlsbHMgPSBub2RlLmZpbGxzO1xuICAgIGxldCBzdHJva2VzID0gbm9kZS5zdHJva2VzO1xuICAgIGFzc2VydCghZmlsbHMubGVuZ3RoIHx8ICFzdHJva2VzLmxlbmd0aCwgJ1Nob3VsZCBub3QgaGF2ZSBmaWxsK3N0cm9rZScsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgc3Ryb2tlcy5mb3JFYWNoKChzKSA9PiB7XG4gICAgICAgIGFzc2VydChzLnZpc2libGUsICdTdHJva2UgbXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChzLnR5cGUgPT0gJ1NPTElEJywgJ1N0cm9rZSBtdXN0IGJlIHNvbGlkJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGxldCBzMSA9IHM7XG4gICAgICAgIGFzc2VydChzMS5jb2xvci5yICE9IDAgfHwgczEuY29sb3IuZyAhPSAwIHx8IHMxLmNvbG9yLmIgIT0gMCwgJ1N0cm9rZSBjb2xvciBtdXN0IG5vdCBiZSBibGFjaycsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoczEuY29sb3IuciAhPSAxIHx8IHMxLmNvbG9yLmcgIT0gMSB8fCBzMS5jb2xvci5iICE9IDEsICdTdHJva2UgY29sb3IgbXVzdCBub3QgYmUgd2hpdGUnLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBmaWxscy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgIGFzc2VydChmLnZpc2libGUsICdGaWxsIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoZi50eXBlID09ICdTT0xJRCcsICdGaWxsIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgbGV0IGYxID0gZjtcbiAgICAgICAgYXNzZXJ0KGYxLmNvbG9yLnIgIT0gMCB8fCBmMS5jb2xvci5nICE9IDAgfHwgZjEuY29sb3IuYiAhPSAwLCAnRmlsbCBjb2xvciBtdXN0IG5vdCBiZSBibGFjaycsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAxIHx8IGYxLmNvbG9yLmcgIT0gMSB8fCBmMS5jb2xvci5iICE9IDEsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCAvUk9VTkR8Tk9ORS8udGVzdChTdHJpbmcobm9kZS5zdHJva2VDYXApKSwgYFN0cm9rZSBjYXBzIG11c3QgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUNhcCl9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuRVJST1IpO1xuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgbm9kZS5zdHJva2VKb2luID09ICdST1VORCcsIGBTdHJva2Ugam9pbnMgc2hvdWxkIGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VKb2luKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBjb25zdCByZ2J0ID0gdGFncy5maW5kKChzKSA9PiAvXnJnYi10ZW1wbGF0ZSQvLnRlc3QocykpO1xuICAgIGNvbnN0IGFuaW0gPSB0YWdzLmZpbmQoKHMpID0+IC9eYmxpbmskfF5kcmF3LWxpbmUkLy50ZXN0KHMpKTtcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cbn1cbmZ1bmN0aW9uIGxpbnRHcm91cChwYWdlLCBub2RlKSB7XG4gICAgYXNzZXJ0KCEvQk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qobm9kZS50eXBlKSwgJ05vdGljZSBCT09MRUFOX09QRVJBVElPTicsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsICdOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS4nLCBwYWdlLCBub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaydcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxufVxuZnVuY3Rpb24gbGludElucHV0KHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5uYW1lID09ICdpbnB1dCcsIFwiTXVzdCBiZSAnaW5wdXQnXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGRlc2NlbmRhbnRzV2l0aG91dFNlbGYobm9kZSkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gbGludFNldHRpbmdzKHBhZ2UsIG5vZGUpIHtcbiAgICB2YXIgX2E7XG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSAnRUxMSVBTRScsIFwiTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdcIiwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9ec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xuICAgICAgICBvcmRlciA9ICdsYXllcnMnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3JkZXIgPSAnc3RlcHMnO1xuICAgIH1cbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnem9vbS1zY2FsZS0nLCAnJykpIHx8XG4gICAgICAgICcxJyk7XG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGlmICghYXNzZXJ0KHN0ZXAudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBzdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChzdGVwLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xec3RlcCR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XmNsZWFyLWxheWVyLShcXGQrLD8pKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAvLyBhc3NlcnQoIS9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1iZyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyBpcyBvYnNvbGV0ZWAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgfSk7XG4gICAgY29uc3QgYmcgPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYmckfF5zLW11bHRpc3RlcC1iZy1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3QgYnJ1c2ggPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3Qgc3MgPSBwYXJzZUludCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9ec3MtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnc3MtJywgJycpKTtcbiAgICBjb25zdCBvID0gdGFncy5maW5kKChzKSA9PiAvXm8tXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoKF9iID0gdGFncy5maW5kKChzKSA9PiAvXmJzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoJ2JzLScsICcnKSk7XG4gICAgY29uc3QgYnJ1c2hOYW1lID0gKF9jID0gdGFnc1xuICAgICAgICAuZmluZCgocykgPT4gL15icnVzaC1uYW1lLVxcdyskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnJlcGxhY2UoJ2JydXNoLW5hbWUtJywgJycpO1xuICAgIGNvbnN0IHRlcm1pbmFsTm9kZXMgPSBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKHN0ZXApLmZpbHRlcigodikgPT4gdlsnY2hpbGRyZW4nXSA9PSB1bmRlZmluZWQpO1xuICAgIGNvbnN0IG1heFNpemUgPSB0ZXJtaW5hbE5vZGVzLnJlZHVjZSgoYWNjLCB2KSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHYud2lkdGgsIHYuaGVpZ2h0KTtcbiAgICB9LCAwKTtcbiAgICBtYXhCcyA9IE1hdGgubWF4KGJzID8gYnMgOiBtYXhCcywgbWF4QnMpO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMjAgfHwgbWF4U2l6ZSA8PSAxMDAsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIGxvbmcgbGluZXMuIENvbnNpZGVyIHVzaW5nIGJnIHRlbXBsYXRlLiAke21heFNpemV9PjEwMGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCB0ZXJtaW5hbE5vZGVzLmxlbmd0aCA8PSA4LCBgU2hvdWxkIG5vdCB1c2Ugc3M8MjAgd2l0aCB0b28gbWFueSBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7dGVybWluYWxOb2Rlcy5sZW5ndGh9PjhgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gMTUgfHwgYnJ1c2hOYW1lID09ICdwZW5jaWwnLCAnU2hvdWxkIG5vdCB1c2UgYnM8MTUnLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsICdzcyBtdXN0IGJlID49IDE1JywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFzcyB8fCAhYnMgfHwgc3MgPiBicywgJ3NzIG11c3QgYmUgPiBicycsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPD0gem9vbVNjYWxlICogMTIuOCwgYGJzIG11c3QgYmUgPD0gJHt6b29tU2NhbGUgKiAxMi44fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gJ2xheWVycycsIGAke299IG11c3QgYmUgdXNlZCBvbmx5IHdpdGggc2V0dGluZ3Mgb3JkZXItbGF5ZXJzYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KG9yZGVyICE9PSAnbGF5ZXJzJyB8fCAhIW8sICdNdXN0IGhhdmUgby1OIG9yZGVyIG51bWJlcicsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHNmID0gc3RlcC5maW5kT25lKChuKSA9PiB7IHZhciBfYTsgcmV0dXJuICgoX2EgPSBuLnN0cm9rZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMDsgfSk7XG4gICAgY29uc3QgZmZzID0gc3RlcC5maW5kQWxsKChuKSA9PiBuLmZpbGxzICYmIG4uZmlsbHNbMF0pO1xuICAgIGNvbnN0IGJpZ0ZmcyA9IGZmcy5maWx0ZXIoKG4pID0+IG4ud2lkdGggPiAyNyB8fCBuLmhlaWdodCA+IDI3KTtcbiAgICBjb25zdCBmZiA9IGZmcy5sZW5ndGggPiAwO1xuICAgIGFzc2VydCghKGJnICYmIHNzICYmIHNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2UgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghKGJnICYmIHNzICYmICFzZiksICdTaG91bGQgbm90IHVzZSBiZytzcyAoc3Ryb2tlIG5vdCBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgYXNzZXJ0KCFiZyB8fCBmZiwgXCJiZyBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGhvdXQgZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIWJydXNoIHx8IGJpZ0Zmcy5sZW5ndGggPT0gMCwgXCJicnVzaCBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGggZmlsbGVkLWluIHZlY3RvcnMgKHNpemUgPiAyNylcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBzdGVwLmNoaWxkcmVuLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgaWYgKG4ubmFtZSA9PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICBsaW50SW5wdXQocGFnZSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobi5uYW1lID09PSAndGVtcGxhdGUnKSB7XG4gICAgICAgICAgICAvLyBsaW50IHRlbXBsYXRlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnaW5wdXQnIG9yICd0ZW1wbGF0ZSdcIiwgcGFnZSwgbik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBibGlua05vZGVzID0gZmluZEFsbChzdGVwLCAobikgPT4gZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXmJsaW5rJC8udGVzdCh0KSkgIT09IHVuZGVmaW5lZCkuZmxhdE1hcChkZWVwTm9kZXMpO1xuICAgIGNvbnN0IGZpbGxlZE5vZGUgPSBibGlua05vZGVzLmZpbmQoKG4pID0+IG4uZmlsbHNbMF0pO1xuICAgIGFzc2VydChibGlua05vZGVzLmxlbmd0aCA9PSAwIHx8ICEhZmlsbGVkTm9kZSB8fCBibGlua05vZGVzLmxlbmd0aCA+IDMsICdTaG91bGQgdXNlIGRyYXctbGluZSBpZiA8IDQgbGluZXMnLCBwYWdlLCBibGlua05vZGVzWzBdLCBFcnJvckxldmVsLklORk8pO1xufVxuZnVuY3Rpb24gbGludFRhc2tGcmFtZShwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSAxMzY2ICYmIG5vZGUuaGVpZ2h0ID09IDEwMjQsICdNdXN0IGJlIDEzNjZ4MTAyNCcsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghIW5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpLCBcIk11c3QgaGF2ZSAncy1tdWx0aXN0ZXAtcmVzdWx0JyBjaGlsZFwiLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgc2V0dGluZ3MgPSBub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKTtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcbiAgICB9XG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShcXGQrKSQvLmV4ZWModGFnKTtcbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvID0gZm91bmRbMV07XG4gICAgICAgICAgICBhc3NlcnQoIW9yZGVyTnVtYmVyc1tvXSwgYE11c3QgaGF2ZSB1bmlxdWUgJHt0YWd9IHZhbHVlc2AsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBvcmRlck51bWJlcnNbb10gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKSB7XG4gICAgICAgICAgICBsaW50U3RlcChwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdzZXR0aW5ncycgb3IgJ3N0ZXAnXCIsIHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzc2VydChtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsIGB6b29tLXNjYWxlICR7em9vbVNjYWxlfSBtdXN0IGJlICR7TWF0aC5jZWlsKG1heEJzIC8gMTIuOCl9IGZvciBtYXggYnMgJHttYXhCc30gdXNlZGAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFRodW1ibmFpbChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDQwMCAmJiBub2RlLmhlaWdodCA9PSA0MDAsICdNdXN0IGJlIDQwMHg0MDAnLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRQYWdlKHBhZ2UpIHtcbiAgICBpZiAoL15cXC98XklOREVYJC8udGVzdChwYWdlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFxcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL15sZXNzb24kLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ2xlc3NvbidcIiwgcGFnZSk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBwYWdlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChub2RlLm5hbWUgPT0gJ2xlc3NvbicpIHtcbiAgICAgICAgICAgIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09ICd0aHVtYm5haWwnKSB7XG4gICAgICAgICAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KC9eXFwvLy50ZXN0KG5vZGUubmFtZSksIFwiTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBsaW50SW5kZXgocGFnZSkge1xuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsICdJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudCcsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcbiAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIHBhZ2UuY2hpbGRyZW5bMF0pO1xufVxuZnVuY3Rpb24gbGludENvdXJzZSgpIHtcbiAgICBhc3NlcnQoL15DT1VSU0UtW2EtelxcLTAtOV0rJC8udGVzdChmaWdtYS5yb290Lm5hbWUpLCBgQ291cnNlIG5hbWUgJyR7ZmlnbWEucm9vdC5uYW1lfScgbXVzdCBtYXRjaCBDT1VSU0UtW2EtelxcXFwtMC05XStgKTtcbiAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lID09ICdJTkRFWCcpO1xuICAgIGlmIChhc3NlcnQoISFpbmRleCwgXCJNdXN0IGhhdmUgJ0lOREVYJyBwYWdlXCIpKSB7XG4gICAgICAgIGxpbnRJbmRleChpbmRleCk7XG4gICAgfVxuICAgIC8vIGZpbmQgYWxsIG5vbi11bmlxdWUgbmFtZWQgcGFnZXNcbiAgICBjb25zdCBub25VbmlxdWUgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbHRlcigocCwgaSwgYSkgPT4gYS5maW5kSW5kZXgoKHAyKSA9PiBwMi5uYW1lID09IHAubmFtZSkgIT0gaSk7XG4gICAgbm9uVW5pcXVlLmZvckVhY2goKHApID0+IGFzc2VydChmYWxzZSwgYFBhZ2UgbmFtZSAnJHtwLm5hbWV9JyBtdXN0IGJlIHVuaXF1ZWAsIHApKTtcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgbGludFBhZ2UocGFnZSk7XG4gICAgfVxufVxub24oJ3NlbGVjdEVycm9yJywgc2VsZWN0RXJyb3IpO1xub24oJ2xpbnRDb3Vyc2UnLCAoKSA9PiB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludENvdXJzZSgpO1xuICAgIHByaW50RXJyb3JzKCk7XG59KTtcbm9uKCdsaW50UGFnZScsICgpID0+IHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBsaW50UGFnZShmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgcHJpbnRFcnJvcnMoKTtcbn0pO1xuLy8gbm8gaGlkZGVuIGZpbGwvc3Ryb2tlXG4vLyBubyBlZmZlY3RzXG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGNhcGl0YWxpemUsIHByaW50IH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgXCJ0YXNrLW5hbWUgJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKHBhZ2UubmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XG5cImNvdXJzZS1kZXNjcmlwdGlvbiAke2NvdXJzZU5hbWV9XCIgPSBcIkluIHRoaXMgY291cnNlOlxuICAgIOKAoiBcbiAgICDigKIgXG4gICAg4oCiIFwiO1xuJHt0YXNrc31cbmA7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TGVzc29uKHBhZ2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcbiAgICAgICAgY29uc3QgbGVzc29uTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgZm9ybWF0OiAnU1ZHJyxcbiAgICAgICAgICAgIC8vIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsID0geWllbGQgdGh1bWJuYWlsTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxuICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291cnNlUGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXG4gICAgICAgICAgICBwYXRoOiBwYWdlLm5hbWUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IFtsZXNzb25zLCB0aHVtYm5haWxdID0geWllbGQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5tYXAoKHBhZ2UpID0+IGV4cG9ydExlc3NvbihwYWdlKSkpLFxuICAgICAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maW5kKChwYWdlKSA9PiBwYWdlLm5hbWUgPT0gJ0lOREVYJylcbiAgICAgICAgICAgICAgICAuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIGxlc3NvbnMsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVN3aWZ0Q29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWVcbiAgICAgICAgLnNwbGl0KCctJylcbiAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICBzd2lmdENvdXJzZU5hbWUgPVxuICAgICAgICBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICBsZXQgJHtzd2lmdENvdXJzZU5hbWV9ID0gQ291cnNlKFxuICAgIHBhdGg6IFwiJHtjb3Vyc2VOYW1lfVwiLFxuICAgIGF1dGhvcjogUkVQTEFDRSxcbiAgICB0YXNrczogW1xuJHt0YXNrc30gICAgXSlcbmA7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKSB7XG4gICAgY29uc3QgY29kZSA9IGdlbmVyYXRlU3dpZnRDb2RlKCkgKyBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKTtcbiAgICBwcmludChjb2RlKTtcbn1cbm9uKCdnZW5lcmF0ZUNvZGUnLCBnZW5lcmF0ZUNvZGUpO1xuIiwiaW1wb3J0IHsgZ2V0VGFncywgZmluZExlYWZOb2RlcyB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0UGFpbnRDb2xvcihwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGxldCB7IHIsIGcsIGIgfSA9IHBhaW50LmNvbG9yO1xuICAgICAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcbiAgICAgICAgZyA9IE1hdGgucm91bmQoZyAqIDI1NSk7XG4gICAgICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xuICAgICAgICByZXR1cm4geyByLCBnLCBiLCBhOiAxIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyByOiAxNjYsIGc6IDE2NiwgYjogMTY2LCBhOiAxIH07XG4gICAgfVxufVxuZnVuY3Rpb24gZGlzcGxheUNvbG9yKHsgciwgZywgYiwgYSB9KSB7XG4gICAgcmV0dXJuIGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sICR7YX0pYDtcbn1cbmZ1bmN0aW9uIGdldENvbG9ycyhub2RlKSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwIH07IC8vIHRyYW5zcGFyZW50ID0gZGVmYXVsdCBjb2xvclxuICAgIGxldCBmaWxscyA9IGRlZmF1bHRDb2xvcjtcbiAgICBsZXQgc3Ryb2tlcyA9IGRlZmF1bHRDb2xvcjtcbiAgICBjb25zdCBsZWFmID0gZmluZExlYWZOb2Rlcyhub2RlKVswXTtcbiAgICBpZiAoJ2ZpbGxzJyBpbiBsZWFmICYmIGxlYWYuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIGxlYWYuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBmaWxscyA9IGdldFBhaW50Q29sb3IobGVhZi5maWxsc1swXSk7XG4gICAgfVxuICAgIGlmICgnc3Ryb2tlcycgaW4gbGVhZiAmJiBsZWFmLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJva2VzID0gZ2V0UGFpbnRDb2xvcihsZWFmLnN0cm9rZXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWxsc0NvbG9yOiBkaXNwbGF5Q29sb3IoZmlsbHMpLFxuICAgICAgICBzdHJva2VzQ29sb3I6IGRpc3BsYXlDb2xvcihzdHJva2VzKSxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBzKCkge1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcbiAgICByZXR1cm4gc3RlcHNCeU9yZGVyKGxlc3NvbikubWFwKChzdGVwKSA9PiB7XG4gICAgICAgIHJldHVybiB7IGlkOiBzdGVwLmlkLCBuYW1lOiBzdGVwLm5hbWUsIGNvbG9yczogZ2V0Q29sb3JzKHN0ZXApIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcE9yZGVyKHN0ZXBzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGxlc3Nvbi5maW5kT25lKChlbCkgPT4gZWwuaWQgPT0gc3RlcC5pZCk7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICBzLm5hbWUgPSBzLm5hbWUucmVwbGFjZSgvby1cXGQrLywgJ28tJyArIChpICsgMSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBlbWl0LCBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIGdldFRhZyhzdGVwLCB0YWcpIHtcbiAgICBjb25zdCB2ID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgodGFnKSk7XG4gICAgcmV0dXJuIHYgPyB2LnJlcGxhY2UodGFnLCAnJykgOiAnMCc7XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGVsZXRlVG1wKCkge1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlXG4gICAgICAgIC5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlKCkpO1xufVxubGV0IGxhc3RQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiAvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZWwudHlwZSkpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFdlaWdodCA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDMwIDogNTA7XG4gICAgICAgICAgICBlbC5zdHJva2VXZWlnaHQgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCBkZWZhdWx0V2VpZ2h0O1xuICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBwaW5rLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICBwaW5rLm5hbWUgPSAncGluayAnICsgZWwubmFtZTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICAgICAgLy8gY2xvbmUgZWxlbWVudCBoZXJlIGFuZCBnaXZlIGhpbSB0aGluIHBpbmsgc3Ryb2tlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMC4xLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgIHRlbXBsYXRlLnJlbGF0aXZlVHJhbnNmb3JtID0gaW5wdXQucmVsYXRpdmVUcmFuc2Zvcm07XG59XG5mdW5jdGlvbiBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCkge1xuICAgIGNvbnN0IGRlZmF1bHRCUyA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDEyLjggOiAxMDtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IGRlZmF1bHRCUztcbiAgICBjb25zdCBzbWFsbExpbmUgPSBmaWdtYS5jcmVhdGVMaW5lKCk7XG4gICAgc21hbGxMaW5lLm5hbWUgPSAnc21hbGxMaW5lJztcbiAgICBzbWFsbExpbmUucmVzaXplKDMwMCwgMCk7XG4gICAgc21hbGxMaW5lLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLjgsIGI6IDAgfSB9XTtcbiAgICBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgLyAzO1xuICAgIHNtYWxsTGluZS5zdHJva2VDYXAgPSAnUk9VTkQnO1xuICAgIHNtYWxsTGluZS5zdHJva2VBbGlnbiA9ICdDRU5URVInO1xuICAgIHNtYWxsTGluZS55ID0gc21hbGxMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgbWVkaXVtTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xuICAgIG1lZGl1bUxpbmUubmFtZSA9ICdtZWRpdW1MaW5lJztcbiAgICBtZWRpdW1MaW5lLm9wYWNpdHkgPSAwLjI7XG4gICAgbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgPSBicztcbiAgICBtZWRpdW1MaW5lLnkgPSBtZWRpdW1MaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgYmlnTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xuICAgIGJpZ0xpbmUubmFtZSA9ICdiaWdMaW5lJztcbiAgICBiaWdMaW5lLm9wYWNpdHkgPSAwLjE7XG4gICAgYmlnTGluZS5zdHJva2VXZWlnaHQgPSBicyArIE1hdGgucG93KGJzLCAxLjQpICogMC44O1xuICAgIGJpZ0xpbmUueSA9IGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcbiAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKFtiaWdMaW5lLCBtZWRpdW1MaW5lLCBzbWFsbExpbmVdLCBsZXNzb24ucGFyZW50KTtcbiAgICBncm91cC5uYW1lID0gJ3RtcC1icyc7XG4gICAgZ3JvdXAueCA9IGxlc3Nvbi54O1xuICAgIGdyb3VwLnkgPSBsZXNzb24ueSAtIDgwO1xufVxuZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwYWdlLCBzZXR0aW5ncykge1xuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBsYXN0TW9kZSA9IHNldHRpbmdzLmRpc3BsYXlNb2RlO1xuICAgIGNvbnN0IHsgZGlzcGxheU1vZGUsIHN0ZXBOdW1iZXIgfSA9IHNldHRpbmdzO1xuICAgIGNvbnN0IGxlc3NvbiA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgIGlmICghbGVzc29uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3N0ZXBOdW1iZXIgLSAxXTtcbiAgICBwYWdlLnNlbGVjdGlvbiA9IFtzdGVwXTtcbiAgICBjb25zdCBzdGVwQ291bnQgPSBsZXNzb24uY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpLmxlbmd0aDtcbiAgICBlbWl0KCd1cGRhdGVGb3JtJywge1xuICAgICAgICBzaGFkb3dTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSxcbiAgICAgICAgYnJ1c2hTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSxcbiAgICAgICAgdGVtcGxhdGU6IGdldFRhZyhzdGVwLCAncy0nKSxcbiAgICAgICAgc3RlcENvdW50LFxuICAgICAgICBzdGVwTnVtYmVyLFxuICAgICAgICBkaXNwbGF5TW9kZSxcbiAgICB9KTtcbiAgICBkZWxldGVUbXAoKTtcbiAgICBzd2l0Y2ggKGRpc3BsYXlNb2RlKSB7XG4gICAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjdXJyZW50JzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgc3RlcHNCeU9yZGVyKGxlc3NvbikuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGkgPCBzdGVwTnVtYmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGVtcGxhdGUnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgZGlzcGxheVRlbXBsYXRlKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbn0sIDE1MDApO1xuZnVuY3Rpb24gdXBkYXRlUHJvcHMoc2V0dGluZ3MpIHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3NldHRpbmdzLnN0ZXBOdW1iZXIgLSAxXTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCdzcy0nKSAmJiAhdC5zdGFydHNXaXRoKCdicy0nKSAmJiAhdC5zdGFydHNXaXRoKCdzLScpKTtcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcbiAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgYHMtJHtzZXR0aW5ncy50ZW1wbGF0ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBzcy0ke3NldHRpbmdzLnNoYWRvd1NpemV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBicy0ke3NldHRpbmdzLmJydXNoU2l6ZX1gKTtcbiAgICB9XG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG59XG5vbigndXBkYXRlRGlzcGxheScsIChzZXR0aW5ncykgPT4gdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgc2V0dGluZ3MpKTtcbm9uKCd1cGRhdGVQcm9wcycsIHVwZGF0ZVByb3BzKTtcbmZpZ21hLm9uKCdjdXJyZW50cGFnZWNoYW5nZScsICgpID0+IHtcbiAgICB1cGRhdGVEaXNwbGF5KGxhc3RQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbn0pO1xuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGlmICghc2VsZWN0aW9uIHx8XG4gICAgICAgICFsZXNzb24gfHxcbiAgICAgICAgIWxlc3Nvbi5jaGlsZHJlbi5pbmNsdWRlcyhzZWxlY3Rpb24pIHx8XG4gICAgICAgIHNlbGVjdGlvbi50eXBlICE9PSAnR1JPVVAnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy91cGRhdGUgc3RlcFxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgY29uc3Qgc3RlcE51bWJlciA9IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgKyAxO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IGxhc3RNb2RlLCBzdGVwTnVtYmVyIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBlbWl0IH0gZnJvbSAnLi4vZXZlbnRzJztcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQWxsKG5vZGUsIGYpIHtcbiAgICBsZXQgYXJyID0gW107XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgYXJyLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdChjaGlsZHJlbi5mbGF0TWFwKChwKSA9PiBmaW5kQWxsKHAsIGYpKSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZExlYWZOb2Rlcyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuZmluZEFsbCgobikgPT4gISgnY2hpbGRyZW4nIGluIG4pKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGYpIHtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFncyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubmFtZS5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRUYWcobm9kZSwgdGFnKSB7XG4gICAgbm9kZS5uYW1lID0gZ2V0VGFncyhub2RlKS5jb25jYXQoW3RhZ10pLmpvaW4oJyAnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludCh0ZXh0KSB7XG4gICAgZmlnbWEudWkucmVzaXplKDcwMCwgNDAwKTtcbiAgICBlbWl0KCdwcmludCcsIHRleHQpO1xufVxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSAocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGNyZWF0ZVBsdWdpbkFQSSwgY3JlYXRlVUlBUEkgfSBmcm9tICdmaWdtYS1qc29ucnBjJztcbmltcG9ydCB7IGV4cG9ydFRleHRzIH0gZnJvbSAnLi9wbHVnaW4vZm9ybWF0LXJwYyc7XG5pbXBvcnQgeyBleHBvcnRMZXNzb24sIGV4cG9ydENvdXJzZSB9IGZyb20gJy4vcGx1Z2luL3B1Ymxpc2gnO1xuaW1wb3J0IHsgZ2V0U3RlcHMsIHNldFN0ZXBPcmRlciB9IGZyb20gJy4vcGx1Z2luL3R1bmUtcnBjJztcbmltcG9ydCB7IGNyZWF0ZUxlc3Nvbiwgc2VwYXJhdGVTdGVwLCBzcGxpdEJ5Q29sb3IgfSBmcm9tICcuL3BsdWdpbi9jcmVhdGUnO1xuLy8gRmlnbWEgcGx1Z2luIG1ldGhvZHNcbmV4cG9ydCBjb25zdCBwbHVnaW5BcGkgPSBjcmVhdGVQbHVnaW5BUEkoe1xuICAgIHNldFNlc3Npb25Ub2tlbih0b2tlbikge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnc2Vzc2lvblRva2VuJywgdG9rZW4pO1xuICAgIH0sXG4gICAgZ2V0U2Vzc2lvblRva2VuKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGV4cG9ydExlc3NvbixcbiAgICBleHBvcnRDb3Vyc2UsXG4gICAgZ2V0U3RlcHMsXG4gICAgc2V0U3RlcE9yZGVyLFxuICAgIGV4cG9ydFRleHRzLFxuICAgIGNyZWF0ZUxlc3NvbixcbiAgICBzZXBhcmF0ZVN0ZXAsXG4gICAgc3BsaXRCeUNvbG9yLFxufSk7XG4vLyBGaWdtYSBVSSBhcHAgbWV0aG9kc1xuZXhwb3J0IGNvbnN0IHVpQXBpID0gY3JlYXRlVUlBUEkoe30pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==