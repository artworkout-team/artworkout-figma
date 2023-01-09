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
/*! exports provided: createLesson, separateStep, splitByColor, joinSteps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLesson", function() { return createLesson; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "separateStep", function() { return separateStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitByColor", function() { return splitByColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "joinSteps", function() { return joinSteps; });
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
        name: 'settings capture-color zoom-scale-2 order-layers',
        x: 10,
        y: 10,
    });
    lesson.appendChild(settingsEllipse);
    originalImage.remove();
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
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(step);
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
}
function separateStep() {
    const selection = figma.currentPage.selection;
    const leaves = selection.filter((node) => !('children' in node));
    if (!leaves.length) {
        return;
    }
    const firstParentStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(selection[0], 'step');
    if (Object(_util__WEBPACK_IMPORTED_MODULE_0__["isResultStep"])(firstParentStep)) {
        return;
    }
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    const index = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getNodeIndex"])(firstParentStep);
    createStepNode(lesson, leaves, index);
}
function addToMap(map, key, node) {
    if (!map.has(key)) {
        map.set(key, []);
    }
    map.get(key).push(node);
}
function replaceColor(nodesByColor, oldColor, newColor) {
    const oldColorKey = stringifyColor(oldColor);
    const newColorKey = stringifyColor(newColor);
    if (nodesByColor.has(oldColorKey)) {
        const updatedColors = nodesByColor.get(oldColorKey).map((n) => {
            if ('fills' in n && n.fills !== figma.mixed && n.fills.length > 0) {
                n.fills = [
                    {
                        type: 'SOLID',
                        color: newColor,
                    },
                ];
            }
            else if ('strokes' in n && n.strokes.length > 0) {
                n.strokes = [
                    {
                        type: 'SOLID',
                        color: newColor,
                    },
                ];
            }
            return n;
        });
        nodesByColor.set(newColorKey, updatedColors);
        nodesByColor.delete(oldColorKey);
    }
}
const black = { r: 0, g: 0, b: 0 };
const nearBlack = { r: 23 / 255, g: 23 / 255, b: 23 / 255 };
const white = { r: 255 / 255, g: 255 / 255, b: 255 / 255 };
const nearWhite = { r: 235 / 255, g: 235 / 255, b: 235 / 255 };
function splitByColor() {
    const selection = figma.currentPage.selection;
    if (!selection.length) {
        return;
    }
    const parentStep = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(selection[0], 'step');
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(parentStep);
    if (!parentStep || Object(_util__WEBPACK_IMPORTED_MODULE_0__["isResultStep"])(parentStep) || leaves.length <= 1) {
        return;
    }
    let fillsByColor = new Map();
    let strokesByColor = new Map();
    let unknownNodes = [];
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(parentStep).forEach((n) => {
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
    // make sure color is not black or white
    replaceColor(fillsByColor, black, nearBlack);
    replaceColor(strokesByColor, black, nearBlack);
    replaceColor(fillsByColor, white, nearWhite);
    replaceColor(strokesByColor, white, nearWhite);
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
    // Remove original node if there are remains
    if (!parentStep.removed) {
        parentStep.remove();
    }
}
function joinSteps() {
    const selection = figma.currentPage.selection;
    const allSteps = selection.every((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('step'));
    const steps = selection.filter((n) => !Object(_util__WEBPACK_IMPORTED_MODULE_0__["isResultStep"])(n));
    if (!allSteps || steps.length < 2) {
        return;
    }
    const inputNodes = steps
        .map((step) => step.children.filter((n) => n.name === 'input' && n.type === 'GROUP'))
        .flat();
    const leaves = inputNodes.map((n) => n.children).flat();
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    const index = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getNodeIndex"])(steps[0]);
    createStepNode(lesson, leaves, index);
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
/* harmony import */ var _tune__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tune */ "./src/plugin/tune.ts");



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
    Object(_tune__WEBPACK_IMPORTED_MODULE_2__["updateDisplay"])(page, { displayMode: 'all', stepNumber: 1 });
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
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
    return stepsByOrder(lesson).map((step) => {
        return { id: step.id, name: step.name, colors: getColors(step) };
    });
}
function setStepOrder(steps) {
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getCurrentLesson"])();
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
/*! exports provided: updateDisplay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDisplay", function() { return updateDisplay; });
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
function getBrushSize(step) {
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLeafNodes"])(step);
    const strokes = leaves.filter((n) => 'strokes' in n && n.strokes.length > 0);
    const strokeWeightsArr = strokes.map((node) => node['strokeWeight'] || 0);
    const maxWeight = Math.max(...strokeWeightsArr);
    return strokes.length > 0 ? maxWeight : 25;
}
function getClearLayerNumbers(step) {
    const prefix = 'clear-layer-';
    const clearLayersStep = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).filter((tag) => tag.startsWith(prefix));
    if (clearLayersStep.length !== 1) {
        return [];
    }
    const layerNumbers = clearLayersStep[0]
        .slice(prefix.length)
        .split(',')
        .map(Number);
    return layerNumbers;
}
function getClearBeforeStep(step) {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).filter((tag) => tag.includes('clear-before')).length === 1) {
        return step;
    }
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
    const maxStrokeWeight = getBrushSize(step);
    const clearLayersStep = getClearLayerNumbers(step);
    const clearBeforeStep = getClearBeforeStep(step);
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])('updateForm', {
        shadowSize: parseInt(getTag(step, 'ss-')),
        brushSize: parseInt(getTag(step, 'bs-')),
        suggestedBrushSize: Object(_util__WEBPACK_IMPORTED_MODULE_1__["isResultStep"])(step) ? 0 : maxStrokeWeight,
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
            if (clearLayersStep.length > 0) {
                clearLayersStep.forEach((layer) => {
                    lesson.children[layer].visible = false;
                });
            }
            else if (clearBeforeStep) {
                lesson.children.forEach((layer, i) => {
                    layer.visible = i > lesson.children.indexOf(clearBeforeStep);
                });
            }
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
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
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
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
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
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, addTag, findParentByTag, isResultStep, print, capitalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAll", function() { return findAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLeafNodes", function() { return findLeafNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findParent", function() { return findParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNodeIndex", function() { return getNodeIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentLesson", function() { return getCurrentLesson; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTags", function() { return getTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTag", function() { return addTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findParentByTag", function() { return findParentByTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isResultStep", function() { return isResultStep; });
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
function getNodeIndex(node) {
    return node.parent.children.findIndex((n) => n.id === node.id);
}
function getCurrentLesson() {
    return figma.currentPage.children.find((el) => el.name === 'lesson');
}
function getTags(node) {
    return node.name.split(' ').filter(Boolean);
}
function addTag(node, tag) {
    node.name = getTags(node).concat([tag]).join(' ');
}
function findParentByTag(node, tag) {
    return findParent(node, (n) => getTags(n).includes(tag));
}
function isResultStep(node) {
    return node && getTags(node).includes('s-multistep-result');
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
    joinSteps: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["joinSteps"],
});
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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Q0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQO0FBQ0EsSUFBSSxvREFBSTtBQUNSO0FBQ087Ozs7Ozs7Ozs7Ozs7QUM3Q1A7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDNkQ7QUFDWDtBQUNZO0FBQ0g7QUFDNEI7QUFDdkY7QUFDTyxrQkFBa0IscUVBQWU7QUFDeEM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksMEVBQVk7QUFDaEIsSUFBSSwwRUFBWTtBQUNoQixJQUFJLG1FQUFRO0FBQ1osSUFBSSwyRUFBWTtBQUNoQixJQUFJLDJFQUFXO0FBQ2YsSUFBSSx5RUFBWTtBQUNoQixJQUFJLHlFQUFZO0FBQ2hCLElBQUkseUVBQVk7QUFDaEIsSUFBSSxtRUFBUztBQUNiLENBQUM7QUFDRDtBQUNPLGNBQWMsaUVBQVcsR0FBRyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9pbmRleC50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzLlBhcnNlRXJyb3IgPSBjbGFzcyBQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJQYXJzZSBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjcwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFJlcXVlc3QgPSBjbGFzcyBJbnZhbGlkUmVxdWVzdCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBSZXF1ZXN0XCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NZXRob2ROb3RGb3VuZCA9IGNsYXNzIE1ldGhvZE5vdEZvdW5kIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJNZXRob2Qgbm90IGZvdW5kXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAxO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUGFyYW1zID0gY2xhc3MgSW52YWxpZFBhcmFtcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBwYXJhbXNcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludGVybmFsRXJyb3IgPSBjbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnRlcm5hbCBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMztcbiAgfVxufTtcbiIsImNvbnN0IHsgc2V0dXAsIHNlbmRSZXF1ZXN0IH0gPSByZXF1aXJlKFwiLi9ycGNcIik7XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVVJQVBJID0gZnVuY3Rpb24gY3JlYXRlVUlBUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsdWdpbkFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbkFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG4iLCJjb25zdCBSUENFcnJvciA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IHsgTWV0aG9kTm90Rm91bmQgfSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcblxubGV0IHNlbmRSYXc7XG5cbmlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZmlnbWEudWkub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGhhbmRsZVJhdyhtZXNzYWdlKSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xufSBlbHNlIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIG9ubWVzc2FnZSA9IGV2ZW50ID0+IGhhbmRsZVJhdyhldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiBtZXNzYWdlIH0sIFwiKlwiKTtcbn1cblxubGV0IHJwY0luZGV4ID0gMDtcbmxldCBwZW5kaW5nID0ge307XG5cbmZ1bmN0aW9uIHNlbmRKc29uKHJlcSkge1xuICB0cnkge1xuICAgIHNlbmRSYXcocmVxKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXN1bHQoaWQsIHJlc3VsdCkge1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICByZXN1bHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRFcnJvcihpZCwgZXJyb3IpIHtcbiAgY29uc3QgZXJyb3JPYmplY3QgPSB7XG4gICAgY29kZTogZXJyb3IuY29kZSxcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgIGRhdGE6IGVycm9yLmRhdGFcbiAgfTtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgZXJyb3I6IGVycm9yT2JqZWN0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSYXcoZGF0YSkge1xuICB0cnkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVScGMoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJwYyhqc29uKSB7XG4gIGlmICh0eXBlb2YganNvbi5pZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBqc29uLnJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAganNvbi5lcnJvciB8fFxuICAgICAgdHlwZW9mIGpzb24ubWV0aG9kID09PSBcInVuZGVmaW5lZFwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHNlbmRFcnJvcihcbiAgICAgICAgICBqc29uLmlkLFxuICAgICAgICAgIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgY2FsbGJhY2sgZm9yIFwiICsganNvbi5pZClcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxiYWNrLnRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBjYWxsYmFjayhqc29uLmVycm9yLCBqc29uLnJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZVJlcXVlc3QoanNvbik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKTtcbiAgfVxufVxuXG5sZXQgbWV0aG9kcyA9IHt9O1xuXG5mdW5jdGlvbiBvblJlcXVlc3QobWV0aG9kLCBwYXJhbXMpIHtcbiAgaWYgKCFtZXRob2RzW21ldGhvZF0pIHtcbiAgICB0aHJvdyBuZXcgTWV0aG9kTm90Rm91bmQobWV0aG9kKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kc1ttZXRob2RdKC4uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgbWV0aG9kXCIpKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbiAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXN1bHRcbiAgICAgICAgLnRoZW4ocmVzID0+IHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBlcnIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnNldHVwID0gX21ldGhvZHMgPT4ge1xuICBPYmplY3QuYXNzaWduKG1ldGhvZHMsIF9tZXRob2RzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmROb3RpZmljYXRpb24gPSAobWV0aG9kLCBwYXJhbXMpID0+IHtcbiAgc2VuZEpzb24oeyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcyB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKG1ldGhvZCwgcGFyYW1zLCB0aW1lb3V0KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaWQgPSBycGNJbmRleDtcbiAgICBjb25zdCByZXEgPSB7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zLCBpZCB9O1xuICAgIHJwY0luZGV4ICs9IDE7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc3QganNFcnJvciA9IG5ldyBFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgIGpzRXJyb3IuY29kZSA9IGVyci5jb2RlO1xuICAgICAgICBqc0Vycm9yLmRhdGEgPSBlcnIuZGF0YTtcbiAgICAgICAgcmVqZWN0KGpzRXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgfTtcblxuICAgIC8vIHNldCBhIGRlZmF1bHQgdGltZW91dFxuICAgIGNhbGxiYWNrLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2lkXTtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0IFwiICsgbWV0aG9kICsgXCIgdGltZWQgb3V0LlwiKSk7XG4gICAgfSwgdGltZW91dCB8fCAzMDAwKTtcblxuICAgIHBlbmRpbmdbaWRdID0gY2FsbGJhY2s7XG4gICAgc2VuZEpzb24ocmVxKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5SUENFcnJvciA9IFJQQ0Vycm9yO1xuIiwiY29uc3QgZXZlbnRIYW5kbGVycyA9IHt9O1xyXG5sZXQgY3VycmVudElkID0gMDtcclxuZXhwb3J0IGZ1bmN0aW9uIG9uKG5hbWUsIGhhbmRsZXIpIHtcclxuICAgIGNvbnN0IGlkID0gYCR7Y3VycmVudElkfWA7XHJcbiAgICBjdXJyZW50SWQgKz0gMTtcclxuICAgIGV2ZW50SGFuZGxlcnNbaWRdID0geyBoYW5kbGVyLCBuYW1lIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRlbGV0ZSBldmVudEhhbmRsZXJzW2lkXTtcclxuICAgIH07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIG9uY2UobmFtZSwgaGFuZGxlcikge1xyXG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcclxuICAgIHJldHVybiBvbihuYW1lLCBmdW5jdGlvbiAoLi4uYXJncykge1xyXG4gICAgICAgIGlmIChkb25lID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9uZSA9IHRydWU7XHJcbiAgICAgICAgaGFuZGxlciguLi5hcmdzKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBjb25zdCBlbWl0ID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCdcclxuICAgID8gZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcclxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShbbmFtZSwgLi4uYXJnc10pO1xyXG4gICAgfVxyXG4gICAgOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xyXG4gICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICBwbHVnaW5NZXNzYWdlOiBbbmFtZSwgLi4uYXJnc10sXHJcbiAgICAgICAgfSwgJyonKTtcclxuICAgIH07XHJcbmZ1bmN0aW9uIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKSB7XHJcbiAgICBmb3IgKGNvbnN0IGlkIGluIGV2ZW50SGFuZGxlcnMpIHtcclxuICAgICAgICBpZiAoZXZlbnRIYW5kbGVyc1tpZF0ubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICBldmVudEhhbmRsZXJzW2lkXS5oYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgaWYgKChfYSA9IHBhcmFtc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmpzb25ycGMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBwYXJhbXNbMF07XHJcbiAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xyXG4gICAgfTtcclxufVxyXG5lbHNlIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIFRPRE86IHZlcnkgZGlydHkgaGFjaywgbmVlZHMgZml4aW5nXHJcbiAgICAgICAgY29uc3QgZmFsbGJhY2sgPSB3aW5kb3cub25tZXNzYWdlO1xyXG4gICAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XHJcbiAgICAgICAgICAgIGZhbGxiYWNrLmFwcGx5KHdpbmRvdywgcGFyYW1zKTtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBwYXJhbXNbMF07XHJcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlO1xyXG4gICAgICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XHJcbiAgICAgICAgfTtcclxuICAgIH0sIDEwMCk7XHJcbn1cclxuIiwiaW1wb3J0IHsgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3NvbiwgZmluZFBhcmVudEJ5VGFnLCBnZXROb2RlSW5kZXgsIGdldFRhZ3MsIGlzUmVzdWx0U3RlcCwgfSBmcm9tICcuL3V0aWwnO1xyXG5mdW5jdGlvbiBmb3JtYXROb2RlKG5vZGUsIHBhcmFtZXRlcnMpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgeCwgeSwgd2lkdGggPSA0MCwgaGVpZ2h0ID0gNDAgfSA9IHBhcmFtZXRlcnM7XHJcbiAgICBub2RlLm5hbWUgPSBuYW1lO1xyXG4gICAgbm9kZS54ID0geDtcclxuICAgIG5vZGUueSA9IHk7XHJcbiAgICBub2RlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxufVxyXG5mdW5jdGlvbiBmaWxsU2VydmljZU5vZGVzKG5vZGUpIHtcclxuICAgIG5vZGUuZmlsbHMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxyXG4gICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgcjogMTk2IC8gMjU1LFxyXG4gICAgICAgICAgICAgICAgZzogMTk2IC8gMjU1LFxyXG4gICAgICAgICAgICAgICAgYjogMTk2IC8gMjU1LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICBdO1xyXG59XHJcbmZ1bmN0aW9uIHJlc2NhbGVJbWFnZU5vZGUobm9kZSwgcmVzaXplUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG1heFdpZHRoLCBtYXhIZWlnaHQgfSA9IHJlc2l6ZVBhcmFtcztcclxuICAgIGNvbnN0IGlzQ29ycmVjdFNpemUgPSBub2RlLndpZHRoIDw9IG1heFdpZHRoICYmIG5vZGUuaGVpZ2h0IDw9IG1heEhlaWdodDtcclxuICAgIGNvbnN0IGlzQ29ycmVjdFR5cGUgPSBub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnUkVDVEFOR0xFJyB8fCBub2RlLnR5cGUgPT09ICdWRUNUT1InO1xyXG4gICAgaWYgKGlzQ29ycmVjdFR5cGUgJiYgIWlzQ29ycmVjdFNpemUpIHtcclxuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IE1hdGgubWluKG1heFdpZHRoIC8gbm9kZS53aWR0aCwgbWF4SGVpZ2h0IC8gbm9kZS5oZWlnaHQpO1xyXG4gICAgICAgIG5vZGUucmVzY2FsZShzY2FsZUZhY3Rvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVSZXN1bHROb2RlKG5vZGUpIHtcclxuICAgIGNvbnN0IHJlc3VsdFJlY3RhbmdsZSA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xyXG4gICAgZmlsbFNlcnZpY2VOb2RlcyhyZXN1bHRSZWN0YW5nbGUpO1xyXG4gICAgY29uc3QgdGVtcGxhdGVHcm91cCA9IGZpZ21hLmdyb3VwKFtyZXN1bHRSZWN0YW5nbGVdLCBub2RlKTtcclxuICAgIHRlbXBsYXRlR3JvdXAubmFtZSA9ICd0ZW1wbGF0ZSc7XHJcbiAgICBjb25zdCByZXN1bHQgPSBmaWdtYS5ncm91cChbdGVtcGxhdGVHcm91cF0sIG5vZGUpO1xyXG4gICAgZm9ybWF0Tm9kZShyZXN1bHQsIHtcclxuICAgICAgICBuYW1lOiAnc3RlcCBzLW11bHRpc3RlcC1yZXN1bHQnLFxyXG4gICAgICAgIHg6IDEwLFxyXG4gICAgICAgIHk6IDYwLFxyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxlc3NvbigpIHtcclxuICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG9yaWdpbmFsSW1hZ2UgPSBub2RlLmNoaWxkcmVuWzBdO1xyXG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgIGZvcm1hdE5vZGUobGVzc29uLCB7XHJcbiAgICAgICAgbmFtZTogJ2xlc3NvbicsXHJcbiAgICAgICAgeDogLTQ2MSxcclxuICAgICAgICB5OiAtNTEyLFxyXG4gICAgICAgIHdpZHRoOiAxMzY2LFxyXG4gICAgICAgIGhlaWdodDogMTAyNCxcclxuICAgIH0pO1xyXG4gICAgY29uc3QgdGh1bWJuYWlsID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcclxuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsLCB7XHJcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCcsXHJcbiAgICAgICAgeDogLTkwMSxcclxuICAgICAgICB5OiAtNTEyLFxyXG4gICAgICAgIHdpZHRoOiA0MDAsXHJcbiAgICAgICAgaGVpZ2h0OiA0MDAsXHJcbiAgICB9KTtcclxuICAgIC8vIENyZWF0ZSBzdGVwXHJcbiAgICBjb25zdCBzdGVwID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xyXG4gICAgc3RlcC5uYW1lID0gJ2ltYWdlJztcclxuICAgIGNvbnN0IHJlc2l6ZWRJbWFnZSA9IHJlc2NhbGVJbWFnZU5vZGUob3JpZ2luYWxJbWFnZSwge1xyXG4gICAgICAgIG1heFdpZHRoOiBsZXNzb24ud2lkdGggLSA4MyAqIDIsXHJcbiAgICAgICAgbWF4SGVpZ2h0OiBsZXNzb24uaGVpZ2h0IC0gMTIgKiAyLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBzdGVwSW5wdXQgPSBmaWdtYS5ncm91cChbc3RlcF0sIGxlc3Nvbik7XHJcbiAgICBzdGVwSW5wdXQubmFtZSA9ICdpbnB1dCc7XHJcbiAgICBjb25zdCBmaXJzdFN0ZXAgPSBmaWdtYS5ncm91cChbc3RlcElucHV0XSwgbGVzc29uKTtcclxuICAgIGZvcm1hdE5vZGUoZmlyc3RTdGVwLCB7XHJcbiAgICAgICAgbmFtZTogJ3N0ZXAgcy1tdWx0aXN0ZXAtYnJ1c2gnLFxyXG4gICAgICAgIHg6IChsZXNzb24ud2lkdGggLSByZXNpemVkSW1hZ2Uud2lkdGgpIC8gMixcclxuICAgICAgICB5OiAobGVzc29uLmhlaWdodCAtIHJlc2l6ZWRJbWFnZS5oZWlnaHQpIC8gMixcclxuICAgICAgICB3aWR0aDogcmVzaXplZEltYWdlLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDogcmVzaXplZEltYWdlLmhlaWdodCxcclxuICAgIH0pO1xyXG4gICAgLy8gQ3JlYXRlIHRodW1ibmFpbFxyXG4gICAgY29uc3QgdGh1bWJuYWlsSW1hZ2UgPSBvcmlnaW5hbEltYWdlLmNsb25lKCk7XHJcbiAgICB0aHVtYm5haWxJbWFnZS5uYW1lID0gJ2ltYWdlJztcclxuICAgIGNvbnN0IHJlc2l6ZWRUaHVtYm5haWwgPSByZXNjYWxlSW1hZ2VOb2RlKHRodW1ibmFpbEltYWdlLCB7XHJcbiAgICAgICAgbWF4V2lkdGg6IHRodW1ibmFpbC53aWR0aCAtIDM1ICogMixcclxuICAgICAgICBtYXhIZWlnaHQ6IHRodW1ibmFpbC5oZWlnaHQgLSAzNSAqIDIsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHRodW1ibmFpbEdyb3VwID0gZmlnbWEuZ3JvdXAoW3RodW1ibmFpbEltYWdlXSwgdGh1bWJuYWlsKTtcclxuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsR3JvdXAsIHtcclxuICAgICAgICBuYW1lOiAndGh1bWJuYWlsIGdyb3VwJyxcclxuICAgICAgICB4OiAodGh1bWJuYWlsLndpZHRoIC0gcmVzaXplZFRodW1ibmFpbC53aWR0aCkgLyAyLFxyXG4gICAgICAgIHk6ICh0aHVtYm5haWwuaGVpZ2h0IC0gcmVzaXplZFRodW1ibmFpbC5oZWlnaHQpIC8gMixcclxuICAgICAgICB3aWR0aDogcmVzaXplZFRodW1ibmFpbC53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHJlc2l6ZWRUaHVtYm5haWwuaGVpZ2h0LFxyXG4gICAgfSk7XHJcbiAgICAvLyBDcmVhdGUgcmVzdWx0XHJcbiAgICBjcmVhdGVSZXN1bHROb2RlKGxlc3Nvbik7XHJcbiAgICAvLyBDcmVhdGUgc2V0dGluZ3NcclxuICAgIGNvbnN0IHNldHRpbmdzRWxsaXBzZSA9IGZpZ21hLmNyZWF0ZUVsbGlwc2UoKTtcclxuICAgIGZpbGxTZXJ2aWNlTm9kZXMoc2V0dGluZ3NFbGxpcHNlKTtcclxuICAgIGZvcm1hdE5vZGUoc2V0dGluZ3NFbGxpcHNlLCB7XHJcbiAgICAgICAgbmFtZTogJ3NldHRpbmdzIGNhcHR1cmUtY29sb3Igem9vbS1zY2FsZS0yIG9yZGVyLWxheWVycycsXHJcbiAgICAgICAgeDogMTAsXHJcbiAgICAgICAgeTogMTAsXHJcbiAgICB9KTtcclxuICAgIGxlc3Nvbi5hcHBlbmRDaGlsZChzZXR0aW5nc0VsbGlwc2UpO1xyXG4gICAgb3JpZ2luYWxJbWFnZS5yZW1vdmUoKTtcclxufVxyXG5mdW5jdGlvbiBzdHJpbmdpZnlDb2xvcihjb2xvcikge1xyXG4gICAgbGV0IHsgciwgZywgYiB9ID0gY29sb3I7XHJcbiAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcclxuICAgIGcgPSBNYXRoLnJvdW5kKGcgKiAyNTUpO1xyXG4gICAgYiA9IE1hdGgucm91bmQoYiAqIDI1NSk7XHJcbiAgICByZXR1cm4gYHJnYigke3J9LCAke2d9LCAke2J9KWA7XHJcbn1cclxuZnVuY3Rpb24gbmFtZUxlYWZOb2Rlcyhub2Rlcykge1xyXG4gICAgbGV0IGFsbFN0cm9rZXMgPSAhbm9kZXMuZmluZCgobm9kZSkgPT4gJ2ZpbGxzJyBpbiBub2RlICYmIG5vZGUuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG5vZGUuZmlsbHMubGVuZ3RoID4gMCk7XHJcbiAgICBmb3IgKGxldCBub2RlIG9mIG5vZGVzKSB7XHJcbiAgICAgICAgbm9kZS5uYW1lID1cclxuICAgICAgICAgICAgJ3JnYi10ZW1wbGF0ZSAnICsgKGFsbFN0cm9rZXMgJiYgbm9kZXMubGVuZ3RoID4gMyA/ICdkcmF3LWxpbmUnIDogJ2JsaW5rJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbmFtZVN0ZXBOb2RlKHN0ZXApIHtcclxuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMoc3RlcCk7XHJcbiAgICBsZXQgZmlsbHMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnZmlsbHMnIGluIG4gJiYgbi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbi5maWxscy5sZW5ndGggPiAwKTtcclxuICAgIGxldCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xyXG4gICAgbGV0IG11bHRpc3RlcFR5cGUgPSBmaWxscy5sZW5ndGggPiAwID8gJ2JnJyA6ICdicnVzaCc7XHJcbiAgICBsZXQgc3Ryb2tlV2VpZ2h0c0FyciA9IHN0cm9rZXMubWFwKChub2RlKSA9PiBub2RlWydzdHJva2VXZWlnaHQnXSB8fCAwKTtcclxuICAgIGxldCBtYXhXZWlnaHQgPSBNYXRoLm1heCguLi5zdHJva2VXZWlnaHRzQXJyKTtcclxuICAgIGxldCB3ZWlnaHQgPSBzdHJva2VzLmxlbmd0aCA+IDAgPyBtYXhXZWlnaHQgOiAyNTtcclxuICAgIHN0ZXAubmFtZSA9IGBzdGVwIHMtbXVsdGlzdGVwLSR7bXVsdGlzdGVwVHlwZX0gYnMtJHt3ZWlnaHR9YDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGVTdGVwTm9kZShub2RlLCBub2Rlc0FycmF5LCBpbmRleCkge1xyXG4gICAgaWYgKCFub2Rlc0FycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIG5hbWVMZWFmTm9kZXMobm9kZXNBcnJheSk7XHJcbiAgICBjb25zdCBpbnB1dCA9IGZpZ21hLmdyb3VwKG5vZGVzQXJyYXksIG5vZGUpO1xyXG4gICAgaW5wdXQubmFtZSA9ICdpbnB1dCc7XHJcbiAgICBjb25zdCBzdGVwID0gZmlnbWEuZ3JvdXAoW2lucHV0XSwgbm9kZSwgaW5kZXgpO1xyXG4gICAgbmFtZVN0ZXBOb2RlKHN0ZXApO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZVN0ZXAoKSB7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICBjb25zdCBsZWF2ZXMgPSBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiAhKCdjaGlsZHJlbicgaW4gbm9kZSkpO1xyXG4gICAgaWYgKCFsZWF2ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZmlyc3RQYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcclxuICAgIGlmIChpc1Jlc3VsdFN0ZXAoZmlyc3RQYXJlbnRTdGVwKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIGNvbnN0IGluZGV4ID0gZ2V0Tm9kZUluZGV4KGZpcnN0UGFyZW50U3RlcCk7XHJcbiAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGxlYXZlcywgaW5kZXgpO1xyXG59XHJcbmZ1bmN0aW9uIGFkZFRvTWFwKG1hcCwga2V5LCBub2RlKSB7XHJcbiAgICBpZiAoIW1hcC5oYXMoa2V5KSkge1xyXG4gICAgICAgIG1hcC5zZXQoa2V5LCBbXSk7XHJcbiAgICB9XHJcbiAgICBtYXAuZ2V0KGtleSkucHVzaChub2RlKTtcclxufVxyXG5mdW5jdGlvbiByZXBsYWNlQ29sb3Iobm9kZXNCeUNvbG9yLCBvbGRDb2xvciwgbmV3Q29sb3IpIHtcclxuICAgIGNvbnN0IG9sZENvbG9yS2V5ID0gc3RyaW5naWZ5Q29sb3Iob2xkQ29sb3IpO1xyXG4gICAgY29uc3QgbmV3Q29sb3JLZXkgPSBzdHJpbmdpZnlDb2xvcihuZXdDb2xvcik7XHJcbiAgICBpZiAobm9kZXNCeUNvbG9yLmhhcyhvbGRDb2xvcktleSkpIHtcclxuICAgICAgICBjb25zdCB1cGRhdGVkQ29sb3JzID0gbm9kZXNCeUNvbG9yLmdldChvbGRDb2xvcktleSkubWFwKChuKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICgnZmlsbHMnIGluIG4gJiYgbi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbi5maWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBuLmZpbGxzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG5ld0NvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCdzdHJva2VzJyBpbiBuICYmIG4uc3Ryb2tlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBuLnN0cm9rZXMgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbmV3Q29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbm9kZXNCeUNvbG9yLnNldChuZXdDb2xvcktleSwgdXBkYXRlZENvbG9ycyk7XHJcbiAgICAgICAgbm9kZXNCeUNvbG9yLmRlbGV0ZShvbGRDb2xvcktleSk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgYmxhY2sgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuY29uc3QgbmVhckJsYWNrID0geyByOiAyMyAvIDI1NSwgZzogMjMgLyAyNTUsIGI6IDIzIC8gMjU1IH07XHJcbmNvbnN0IHdoaXRlID0geyByOiAyNTUgLyAyNTUsIGc6IDI1NSAvIDI1NSwgYjogMjU1IC8gMjU1IH07XHJcbmNvbnN0IG5lYXJXaGl0ZSA9IHsgcjogMjM1IC8gMjU1LCBnOiAyMzUgLyAyNTUsIGI6IDIzNSAvIDI1NSB9O1xyXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCeUNvbG9yKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xyXG4gICAgaWYgKCFzZWxlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyZW50U3RlcCA9IGZpbmRQYXJlbnRCeVRhZyhzZWxlY3Rpb25bMF0sICdzdGVwJyk7XHJcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XHJcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHBhcmVudFN0ZXApO1xyXG4gICAgaWYgKCFwYXJlbnRTdGVwIHx8IGlzUmVzdWx0U3RlcChwYXJlbnRTdGVwKSB8fCBsZWF2ZXMubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgZmlsbHNCeUNvbG9yID0gbmV3IE1hcCgpO1xyXG4gICAgbGV0IHN0cm9rZXNCeUNvbG9yID0gbmV3IE1hcCgpO1xyXG4gICAgbGV0IHVua25vd25Ob2RlcyA9IFtdO1xyXG4gICAgZmluZExlYWZOb2RlcyhwYXJlbnRTdGVwKS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgaWYgKCdmaWxscycgaW4gbiAmJlxyXG4gICAgICAgICAgICBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJlxyXG4gICAgICAgICAgICBuLmZpbGxzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgICAgbi5maWxsc1swXS50eXBlID09PSAnU09MSUQnKSB7XHJcbiAgICAgICAgICAgIGFkZFRvTWFwKGZpbGxzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5maWxsc1swXS5jb2xvciksIG4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgnc3Ryb2tlcycgaW4gbiAmJlxyXG4gICAgICAgICAgICBuLnN0cm9rZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgICBuLnN0cm9rZXNbMF0udHlwZSA9PT0gJ1NPTElEJykge1xyXG4gICAgICAgICAgICBhZGRUb01hcChzdHJva2VzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5zdHJva2VzWzBdLmNvbG9yKSwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB1bmtub3duTm9kZXMucHVzaChuKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIG1ha2Ugc3VyZSBjb2xvciBpcyBub3QgYmxhY2sgb3Igd2hpdGVcclxuICAgIHJlcGxhY2VDb2xvcihmaWxsc0J5Q29sb3IsIGJsYWNrLCBuZWFyQmxhY2spO1xyXG4gICAgcmVwbGFjZUNvbG9yKHN0cm9rZXNCeUNvbG9yLCBibGFjaywgbmVhckJsYWNrKTtcclxuICAgIHJlcGxhY2VDb2xvcihmaWxsc0J5Q29sb3IsIHdoaXRlLCBuZWFyV2hpdGUpO1xyXG4gICAgcmVwbGFjZUNvbG9yKHN0cm9rZXNCeUNvbG9yLCB3aGl0ZSwgbmVhcldoaXRlKTtcclxuICAgIGZvciAobGV0IGZpbGxzIG9mIGZpbGxzQnlDb2xvci52YWx1ZXMoKSkge1xyXG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgZmlsbHMpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgc3Ryb2tlcyBvZiBzdHJva2VzQnlDb2xvci52YWx1ZXMoKSkge1xyXG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3Nvbiwgc3Ryb2tlcyk7XHJcbiAgICB9XHJcbiAgICBpZiAodW5rbm93bk5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHVua25vd25Ob2Rlcyk7XHJcbiAgICB9XHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIHJlc3VsdCBpcyBsb2NhdGVkIGF0IHRoZSBlbmRcclxuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUgPT09ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC5yZW1vdmUoKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcclxuICAgIC8vIFJlbW92ZSBvcmlnaW5hbCBub2RlIGlmIHRoZXJlIGFyZSByZW1haW5zXHJcbiAgICBpZiAoIXBhcmVudFN0ZXAucmVtb3ZlZCkge1xyXG4gICAgICAgIHBhcmVudFN0ZXAucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5TdGVwcygpIHtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcclxuICAgIGNvbnN0IGFsbFN0ZXBzID0gc2VsZWN0aW9uLmV2ZXJ5KChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpO1xyXG4gICAgY29uc3Qgc3RlcHMgPSBzZWxlY3Rpb24uZmlsdGVyKChuKSA9PiAhaXNSZXN1bHRTdGVwKG4pKTtcclxuICAgIGlmICghYWxsU3RlcHMgfHwgc3RlcHMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGlucHV0Tm9kZXMgPSBzdGVwc1xyXG4gICAgICAgIC5tYXAoKHN0ZXApID0+IHN0ZXAuY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBuLm5hbWUgPT09ICdpbnB1dCcgJiYgbi50eXBlID09PSAnR1JPVVAnKSlcclxuICAgICAgICAuZmxhdCgpO1xyXG4gICAgY29uc3QgbGVhdmVzID0gaW5wdXROb2Rlcy5tYXAoKG4pID0+IG4uY2hpbGRyZW4pLmZsYXQoKTtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIGNvbnN0IGluZGV4ID0gZ2V0Tm9kZUluZGV4KHN0ZXBzWzBdKTtcclxuICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgbGVhdmVzLCBpbmRleCk7XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydFRleHRzKCkge1xyXG4gICAgY29uc3QgdGV4dHMgPSBmaWdtYS5jdXJyZW50UGFnZVxyXG4gICAgICAgIC5maW5kQWxsKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJylcclxuICAgICAgICAuZmlsdGVyKChub2RlKSA9PiBub2RlLnZpc2libGUpO1xyXG4gICAgcmV0dXJuICh0ZXh0c1xyXG4gICAgICAgIC5tYXAoKG5vZGUpID0+IHtcclxuICAgICAgICBjb25zdCB0biA9IG5vZGU7XHJcbiAgICAgICAgcmV0dXJuIHRuXHJcbiAgICAgICAgICAgIC5nZXRTdHlsZWRUZXh0U2VnbWVudHMoW1xyXG4gICAgICAgICAgICAnZm9udFNpemUnLFxyXG4gICAgICAgICAgICAnZm9udE5hbWUnLFxyXG4gICAgICAgICAgICAnZm9udFdlaWdodCcsXHJcbiAgICAgICAgICAgICd0ZXh0RGVjb3JhdGlvbicsXHJcbiAgICAgICAgICAgICd0ZXh0Q2FzZScsXHJcbiAgICAgICAgICAgICdsaW5lSGVpZ2h0JyxcclxuICAgICAgICAgICAgJ2xldHRlclNwYWNpbmcnLFxyXG4gICAgICAgICAgICAnZmlsbHMnLFxyXG4gICAgICAgICAgICAndGV4dFN0eWxlSWQnLFxyXG4gICAgICAgICAgICAnZmlsbFN0eWxlSWQnLFxyXG4gICAgICAgICAgICAnbGlzdE9wdGlvbnMnLFxyXG4gICAgICAgICAgICAnaW5kZW50YXRpb24nLFxyXG4gICAgICAgICAgICAnaHlwZXJsaW5rJyxcclxuICAgICAgICBdKVxyXG4gICAgICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJhY3RlcnMpXHJcbiAgICAgICAgICAgIC5qb2luKCdcXFxcJylcclxuICAgICAgICAgICAgLnRyaW1FbmQoKTtcclxuICAgIH0pXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcclxuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcclxufVxyXG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IGFkZFRhZywgZmluZEFsbCwgZ2V0Q3VycmVudExlc3NvbiwgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XHJcbmZ1bmN0aW9uIGZvcm1hdE9yZGVyKGxlc3Nvbikge1xyXG4gICAgaWYgKGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+ICEhZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXm8tLy50ZXN0KHQpKSkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRm91bmQgby10YWcuIGZvcm1hdE9yZGVyIGFib3J0LicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBzZXR0aW5ncyA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3NldHRpbmdzJykpO1xyXG4gICAgYWRkVGFnKHNldHRpbmdzLCAnb3JkZXItbGF5ZXJzJyk7XHJcbiAgICBjb25zdCBsYXllclJlZ2V4ID0gL14ocy1tdWx0aXN0ZXAtYnJ1c2gtfHMtbXVsdGlzdGVwLWJnLSkoXFxkKykkLztcclxuICAgIGNvbnN0IHN0ZXBzID0gbGVzc29uLmZpbmRDaGlsZHJlbigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpICYmICFnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XHJcbiAgICBhZGRUYWcocmVzdWx0LCBgby0ke3N0ZXBzLmxlbmd0aCArIDF9YCk7XHJcbiAgICBzdGVwcy5yZXZlcnNlKCkuZm9yRWFjaCgoc3RlcCwgb3JkZXIpID0+IHtcclxuICAgICAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCk7XHJcbiAgICAgICAgY29uc3QgbGF5ZXJUYWcgPSB0YWdzLmZpbmQoKHQpID0+IGxheWVyUmVnZXgudGVzdCh0KSk7XHJcbiAgICAgICAgbGV0IGxheWVyID0gNDtcclxuICAgICAgICBpZiAobGF5ZXJUYWcpIHtcclxuICAgICAgICAgICAgbGF5ZXIgPSBwYXJzZUludChsYXllclJlZ2V4LmV4ZWMobGF5ZXJUYWcpWzJdKTtcclxuICAgICAgICAgICAgdGFncyA9IHRhZ3MuZmlsdGVyKCh0KSA9PiAhbGF5ZXJSZWdleC50ZXN0KHQpKTtcclxuICAgICAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgL14ocy1tdWx0aXN0ZXAtYnJ1c2h8cy1tdWx0aXN0ZXAtYmcpLy5leGVjKGxheWVyVGFnKVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0ZXAuc2V0UGx1Z2luRGF0YSgnbGF5ZXInLCBKU09OLnN0cmluZ2lmeShsYXllcikpO1xyXG4gICAgICAgIHRhZ3MucHVzaChgby0ke29yZGVyICsgMX1gKTtcclxuICAgICAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHNvcnRlZFN0ZXBzID0gc3RlcHMuc29ydCgoYSwgYikgPT4gSlNPTi5wYXJzZShiLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpIC1cclxuICAgICAgICBKU09OLnBhcnNlKGEuZ2V0UGx1Z2luRGF0YSgnbGF5ZXInKSkpO1xyXG4gICAgc29ydGVkU3RlcHMuZm9yRWFjaCgocykgPT4gbGVzc29uLmluc2VydENoaWxkKDEsIHMpKTtcclxufVxyXG5mdW5jdGlvbiBhdXRvRm9ybWF0KCkge1xyXG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnVEhVTUJOQUlMUycpO1xyXG4gICAgaWYgKHRodW1iUGFnZSkge1xyXG4gICAgICAgIGZpZ21hLnJvb3QuY2hpbGRyZW4uZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHRodW1iUGFnZS5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGNsb25lLnJlc2l6ZSg0MDAsIDQwMCk7XHJcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSAndGh1bWJuYWlsJztcclxuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICBjb25zdCBvbGRMZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XHJcbiAgICAgICAgaWYgKG9sZExlc3NvbkZyYW1lKSB7XHJcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSAnbGVzc29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJyk7XHJcbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJyk7XHJcbiAgICAgICAgaWYgKCF0aHVtYm5haWxGcmFtZSB8fCAhbGVzc29uRnJhbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHVtYm5haWxGcmFtZS54ID0gbGVzc29uRnJhbWUueCAtIDQ0MDtcclxuICAgICAgICB0aHVtYm5haWxGcmFtZS55ID0gbGVzc29uRnJhbWUueTtcclxuICAgIH0pO1xyXG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zZXR0aW5ncy8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcclxuICAgICAgICBuLnggPSAxMDtcclxuICAgICAgICBuLnkgPSAxMDtcclxuICAgIH0pO1xyXG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zdGVwIHMtbXVsdGlzdGVwLXJlc3VsdC8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgbi5jaGlsZHJlblswXS5uYW1lID0gJ3RlbXBsYXRlJztcclxuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSAnL2lnbm9yZSc7XHJcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcclxuICAgICAgICBuLnggPSAxMDtcclxuICAgICAgICBuLnkgPSA2MDtcclxuICAgIH0pO1xyXG59XHJcbm9uKCdhdXRvRm9ybWF0JywgYXV0b0Zvcm1hdCk7XHJcbm9uKCdmb3JtYXRPcmRlcicsICgpID0+IGZvcm1hdE9yZGVyKGdldEN1cnJlbnRMZXNzb24oKSkpO1xyXG4iLCJpbXBvcnQgJy4vY3JlYXRlJztcclxuaW1wb3J0ICcuL3R1bmUnO1xyXG5pbXBvcnQgJy4vZm9ybWF0JztcclxuaW1wb3J0ICcuL2xpbnRlcic7XHJcbmltcG9ydCAnLi9wdWJsaXNoJztcclxuaW1wb3J0ICcuLi9ycGMtYXBpJztcclxuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcclxuZmlnbWEudWkucmVzaXplKDM0MCwgNDUwKTtcclxuY29uc29sZS5jbGVhcigpO1xyXG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IHByaW50LCBnZXRUYWdzLCBmaW5kQWxsIH0gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0IHsgdXBkYXRlRGlzcGxheSB9IGZyb20gJy4vdHVuZSc7XHJcbmxldCBlcnJvcnMgPSBbXTtcclxubGV0IHpvb21TY2FsZSA9IDE7XHJcbmxldCBtYXhCcyA9IDEyLjg7XHJcbmxldCBvcmRlciA9ICdzdGVwcyc7XHJcbnZhciBFcnJvckxldmVsO1xyXG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcclxuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIkVSUk9SXCJdID0gMF0gPSBcIkVSUk9SXCI7XHJcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJXQVJOXCJdID0gMV0gPSBcIldBUk5cIjtcclxuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xyXG59KShFcnJvckxldmVsIHx8IChFcnJvckxldmVsID0ge30pKTtcclxuZnVuY3Rpb24gc2VsZWN0RXJyb3IoaW5kZXgpIHtcclxuICAgIHZhciBfYSwgX2I7XHJcbiAgICBpZiAoKF9hID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhZ2UpIHtcclxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IGVycm9yc1tpbmRleF0ucGFnZTtcclxuICAgIH1cclxuICAgIC8vIHNldFRpbWVvdXQoKCkgPT4geyAvLyBjcmFzaGVzLCBwcm9iYWJseSBiZWNhdXNlIG9mIHNlbGVjdGlvbiBoYXBwZW5pbmcgZnJvbSB0aGUgRGlzcGxheUZvcm1cclxuICAgIGlmICgoX2IgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iubm9kZSkge1xyXG4gICAgICAgIGVycm9yc1tpbmRleF0ucGFnZS5zZWxlY3Rpb24gPSBbZXJyb3JzW2luZGV4XS5ub2RlXTtcclxuICAgIH1cclxuICAgIC8vIH0sIDApXHJcbn1cclxuZnVuY3Rpb24gcHJpbnRFcnJvcnMoKSB7XHJcbiAgICBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpO1xyXG4gICAgc2VsZWN0RXJyb3IoMCk7XHJcbiAgICBsZXQgdGV4dCA9IGVycm9yc1xyXG4gICAgICAgIC5tYXAoKGUpID0+IHtcclxuICAgICAgICB2YXIgX2EsIF9iLCBfYztcclxuICAgICAgICByZXR1cm4gYCR7RXJyb3JMZXZlbFtlLmxldmVsXX1cXHR8ICR7ZS5lcnJvcn0gfCBQQUdFOiR7KChfYSA9IGUucGFnZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpIHx8ICcnfSAkeyhfYiA9IGUubm9kZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnR5cGV9OiR7KChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLm5hbWUpIHx8ICcnfWA7XHJcbiAgICB9KVxyXG4gICAgICAgIC5qb2luKCdcXG4nKTtcclxuICAgIHRleHQgKz0gJ1xcbkRvbmUnO1xyXG4gICAgcHJpbnQodGV4dCk7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xyXG4gICAgaWYgKCF2YWwpIHtcclxuICAgICAgICBlcnJvcnMucHVzaCh7IG5vZGUsIHBhZ2UsIGVycm9yLCBsZXZlbCB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWw7XHJcbn1cclxuZnVuY3Rpb24gZGVlcE5vZGVzKG5vZGUpIHtcclxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIHJldHVybiBbbm9kZV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZWVwTm9kZXMobikpO1xyXG59XHJcbmZ1bmN0aW9uIGRlc2NlbmRhbnRzKG5vZGUpIHtcclxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIHJldHVybiBbbm9kZV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW25vZGUsIC4uLm5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVzY2VuZGFudHMobikpXTtcclxufVxyXG5mdW5jdGlvbiBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpIHtcclxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlc2NlbmRhbnRzKG4pKTtcclxufVxyXG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcclxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XHJcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XHJcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgIGFzc2VydCgvXlxcL3xeZHJhdy1saW5lJHxeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJHxeZmxpcCR8XlZlY3RvciR8XlxcZCskfF5FbGxpcHNlJHxeUmVjdGFuZ2xlJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgZmlsbHMgPSBub2RlLmZpbGxzO1xyXG4gICAgbGV0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXM7XHJcbiAgICBhc3NlcnQoIWZpbGxzLmxlbmd0aCB8fCAhc3Ryb2tlcy5sZW5ndGgsICdTaG91bGQgbm90IGhhdmUgZmlsbCtzdHJva2UnLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xyXG4gICAgc3Ryb2tlcy5mb3JFYWNoKChzKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0KHMudmlzaWJsZSwgJ1N0cm9rZSBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgICAgICBhc3NlcnQocy50eXBlID09ICdTT0xJRCcsICdTdHJva2UgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGxldCBzMSA9IHM7XHJcbiAgICAgICAgYXNzZXJ0KHMxLmNvbG9yLnIgIT0gMCB8fCBzMS5jb2xvci5nICE9IDAgfHwgczEuY29sb3IuYiAhPSAwLCAnU3Ryb2tlIGNvbG9yIG11c3Qgbm90IGJlIGJsYWNrJywgcGFnZSwgbm9kZSk7XHJcbiAgICAgICAgYXNzZXJ0KHMxLmNvbG9yLnIgIT0gMSB8fCBzMS5jb2xvci5nICE9IDEgfHwgczEuY29sb3IuYiAhPSAxLCAnU3Ryb2tlIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XHJcbiAgICB9KTtcclxuICAgIGZpbGxzLmZvckVhY2goKGYpID0+IHtcclxuICAgICAgICBhc3NlcnQoZi52aXNpYmxlLCAnRmlsbCBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgICAgICBhc3NlcnQoZi50eXBlID09ICdTT0xJRCcsICdGaWxsIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcclxuICAgICAgICBsZXQgZjEgPSBmO1xyXG4gICAgICAgIGFzc2VydChmMS5jb2xvci5yICE9IDAgfHwgZjEuY29sb3IuZyAhPSAwIHx8IGYxLmNvbG9yLmIgIT0gMCwgJ0ZpbGwgY29sb3IgbXVzdCBub3QgYmUgYmxhY2snLCBwYWdlLCBub2RlKTtcclxuICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAxIHx8IGYxLmNvbG9yLmcgIT0gMSB8fCBmMS5jb2xvci5iICE9IDEsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XHJcbiAgICB9KTtcclxuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgL1JPVU5EfE5PTkUvLnRlc3QoU3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKSksIGBTdHJva2UgY2FwcyBtdXN0IGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VDYXApfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLkVSUk9SKTtcclxuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgbm9kZS5zdHJva2VKb2luID09ICdST1VORCcsIGBTdHJva2Ugam9pbnMgc2hvdWxkIGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VKb2luKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XHJcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJHxeZHJhdy1saW5lJC8udGVzdChzKSk7XHJcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cclxufVxyXG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xyXG4gICAgYXNzZXJ0KCEvQk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qobm9kZS50eXBlKSwgJ05vdGljZSBCT09MRUFOX09QRVJBVElPTicsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xyXG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xyXG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcclxuICAgICAgICBhc3NlcnQoL15ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCByZ2J0ID0gdGFncy5maW5kKChzKSA9PiAvXnJnYi10ZW1wbGF0ZSQvLnRlc3QocykpO1xyXG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xyXG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXHJcbn1cclxuZnVuY3Rpb24gbGludElucHV0KHBhZ2UsIG5vZGUpIHtcclxuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBub2RlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS5uYW1lID09ICdpbnB1dCcsIFwiTXVzdCBiZSAnaW5wdXQnXCIsIHBhZ2UsIG5vZGUpO1xyXG4gICAgZGVzY2VuZGFudHNXaXRob3V0U2VsZihub2RlKS5mb3JFYWNoKCh2KSA9PiB7XHJcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdCh2LnR5cGUpKSB7XHJcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcclxuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBsaW50U2V0dGluZ3MocGFnZSwgbm9kZSkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSAnRUxMSVBTRScsIFwiTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdcIiwgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XHJcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgIGFzc2VydCgvXnNldHRpbmdzJHxeY2FwdHVyZS1jb2xvciR8Xnpvb20tc2NhbGUtXFxkKyR8Xm9yZGVyLWxheWVycyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5icnVzaC1uYW1lLVxcdyskfF5zcy1cXGQrJHxeYnMtXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XHJcbiAgICB9KTtcclxuICAgIGlmICh0YWdzLmZpbmQoKHRhZykgPT4gL15vcmRlci1sYXllcnMkLy50ZXN0KHRhZykpKSB7XHJcbiAgICAgICAgb3JkZXIgPSAnbGF5ZXJzJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG9yZGVyID0gJ3N0ZXBzJztcclxuICAgIH1cclxuICAgIHpvb21TY2FsZSA9IHBhcnNlSW50KCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9eem9vbS1zY2FsZS1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKCd6b29tLXNjYWxlLScsICcnKSkgfHxcclxuICAgICAgICAnMScpO1xyXG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRTdGVwKHBhZ2UsIHN0ZXApIHtcclxuICAgIHZhciBfYSwgX2IsIF9jO1xyXG4gICAgaWYgKCFhc3NlcnQoc3RlcC50eXBlID09ICdHUk9VUCcsIFwiTXVzdCBiZSAnR1JPVVAnIHR5cGUnXCIsIHBhZ2UsIHN0ZXApKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KHN0ZXAub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBzdGVwKTtcclxuICAgIGFzc2VydChzdGVwLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBzdGVwKTtcclxuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xyXG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcclxuICAgICAgICBhc3NlcnQoL15cXC98XnN0ZXAkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxecy1tdWx0aXN0ZXAtYmckfF5icnVzaC1uYW1lLVxcdyskfF5jbGVhci1sYXllci0oXFxkKyw/KSskfF5zcy1cXGQrJHxeYnMtXFxkKyR8Xm8tXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBzdGVwKTtcclxuICAgICAgICAvLyBhc3NlcnQoIS9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1iZyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyBpcyBvYnNvbGV0ZWAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGJnID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJnJHxecy1tdWx0aXN0ZXAtYmctXFxkKyQvLnRlc3QocykpO1xyXG4gICAgY29uc3QgYnJ1c2ggPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJC8udGVzdChzKSk7XHJcbiAgICBjb25zdCBzcyA9IHBhcnNlSW50KChfYSA9IHRhZ3MuZmluZCgocykgPT4gL15zcy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKCdzcy0nLCAnJykpO1xyXG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcclxuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoKF9iID0gdGFncy5maW5kKChzKSA9PiAvXmJzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoJ2JzLScsICcnKSk7XHJcbiAgICBjb25zdCBicnVzaE5hbWUgPSAoX2MgPSB0YWdzXHJcbiAgICAgICAgLmZpbmQoKHMpID0+IC9eYnJ1c2gtbmFtZS1cXHcrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZXBsYWNlKCdicnVzaC1uYW1lLScsICcnKTtcclxuICAgIGNvbnN0IHRlcm1pbmFsTm9kZXMgPSBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKHN0ZXApLmZpbHRlcigodikgPT4gdlsnY2hpbGRyZW4nXSA9PSB1bmRlZmluZWQpO1xyXG4gICAgY29uc3QgbWF4U2l6ZSA9IHRlcm1pbmFsTm9kZXMucmVkdWNlKChhY2MsIHYpID0+IHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoYWNjLCB2LndpZHRoLCB2LmhlaWdodCk7XHJcbiAgICB9LCAwKTtcclxuICAgIG1heEJzID0gTWF0aC5tYXgoYnMgPyBicyA6IG1heEJzLCBtYXhCcyk7XHJcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDIwIHx8IG1heFNpemUgPD0gMTAwLCBgU2hvdWxkIG5vdCB1c2Ugc3M8MjAgd2l0aCBsb25nIGxpbmVzLiBDb25zaWRlciB1c2luZyBiZyB0ZW1wbGF0ZS4gJHttYXhTaXplfT4xMDBgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCB0ZXJtaW5hbE5vZGVzLmxlbmd0aCA8PSA4LCBgU2hvdWxkIG5vdCB1c2Ugc3M8MjAgd2l0aCB0b28gbWFueSBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7dGVybWluYWxOb2Rlcy5sZW5ndGh9PjhgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSAxNSB8fCBicnVzaE5hbWUgPT0gJ3BlbmNpbCcsICdTaG91bGQgbm90IHVzZSBiczwxNScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDE1LCAnc3MgbXVzdCBiZSA+PSAxNScsIHBhZ2UsIHN0ZXApO1xyXG4gICAgYXNzZXJ0KCFzcyB8fCAhYnMgfHwgc3MgPiBicywgJ3NzIG11c3QgYmUgPiBicycsIHBhZ2UsIHN0ZXApO1xyXG4gICAgYXNzZXJ0KCFicyB8fCBicyA8PSB6b29tU2NhbGUgKiAxMi44LCBgYnMgbXVzdCBiZSA8PSAke3pvb21TY2FsZSAqIDEyLjh9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcclxuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gem9vbVNjYWxlICogMC40NCwgYGJzIG11c3QgYmUgPj0gJHt6b29tU2NhbGUgKiAwLjQ0fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XHJcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gJ2xheWVycycsIGAke299IG11c3QgYmUgdXNlZCBvbmx5IHdpdGggc2V0dGluZ3Mgb3JkZXItbGF5ZXJzYCwgcGFnZSwgc3RlcCk7XHJcbiAgICBhc3NlcnQob3JkZXIgIT09ICdsYXllcnMnIHx8ICEhbywgJ011c3QgaGF2ZSBvLU4gb3JkZXIgbnVtYmVyJywgcGFnZSwgc3RlcCk7XHJcbiAgICBjb25zdCBzZiA9IHN0ZXAuZmluZE9uZSgobikgPT4geyB2YXIgX2E7IHJldHVybiAoKF9hID0gbi5zdHJva2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA+IDA7IH0pO1xyXG4gICAgY29uc3QgZmZzID0gc3RlcC5maW5kQWxsKChuKSA9PiBuLmZpbGxzICYmIG4uZmlsbHNbMF0pO1xyXG4gICAgY29uc3QgYmlnRmZzID0gZmZzLmZpbHRlcigobikgPT4gbi53aWR0aCA+IDI3IHx8IG4uaGVpZ2h0ID4gMjcpO1xyXG4gICAgY29uc3QgZmYgPSBmZnMubGVuZ3RoID4gMDtcclxuICAgIGFzc2VydCghKGJnICYmIHNzICYmIHNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2UgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgIXNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2Ugbm90IHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5XQVJOKTtcclxuICAgIGFzc2VydCghYmcgfHwgZmYsIFwiYmcgc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRob3V0IGZpbGxlZC1pbiB2ZWN0b3JzXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQoIWJydXNoIHx8IGJpZ0Zmcy5sZW5ndGggPT0gMCwgXCJicnVzaCBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGggZmlsbGVkLWluIHZlY3RvcnMgKHNpemUgPiAyNylcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIHN0ZXAuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xyXG4gICAgICAgIGlmIChuLm5hbWUgPT0gJ2lucHV0Jykge1xyXG4gICAgICAgICAgICBsaW50SW5wdXQocGFnZSwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG4ubmFtZSA9PT0gJ3RlbXBsYXRlJykge1xyXG4gICAgICAgICAgICAvLyBsaW50IHRlbXBsYXRlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnaW5wdXQnIG9yICd0ZW1wbGF0ZSdcIiwgcGFnZSwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBibGlua05vZGVzID0gZmluZEFsbChzdGVwLCAobikgPT4gZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXmJsaW5rJC8udGVzdCh0KSkgIT09IHVuZGVmaW5lZCkuZmxhdE1hcChkZWVwTm9kZXMpO1xyXG4gICAgY29uc3QgZmlsbGVkTm9kZSA9IGJsaW5rTm9kZXMuZmluZCgobikgPT4gbi5maWxsc1swXSk7XHJcbiAgICBhc3NlcnQoYmxpbmtOb2Rlcy5sZW5ndGggPT0gMCB8fCAhIWZpbGxlZE5vZGUgfHwgYmxpbmtOb2Rlcy5sZW5ndGggPiAzLCAnU2hvdWxkIHVzZSBkcmF3LWxpbmUgaWYgPCA0IGxpbmVzJywgcGFnZSwgYmxpbmtOb2Rlc1swXSwgRXJyb3JMZXZlbC5JTkZPKTtcclxufVxyXG5mdW5jdGlvbiBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpIHtcclxuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnRlJBTUUnLCBcIk11c3QgYmUgJ0ZSQU1FJyB0eXBlXCIsIHBhZ2UsIG5vZGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLndpZHRoID09IDEzNjYgJiYgbm9kZS5oZWlnaHQgPT0gMTAyNCwgJ011c3QgYmUgMTM2NngxMDI0JywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQoISFub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKSwgXCJNdXN0IGhhdmUgJ3MtbXVsdGlzdGVwLXJlc3VsdCcgY2hpbGRcIiwgcGFnZSwgbm9kZSk7XHJcbiAgICBsZXQgc2V0dGluZ3MgPSBub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKTtcclxuICAgIGlmIChzZXR0aW5ncykge1xyXG4gICAgICAgIGxpbnRTZXR0aW5ncyhwYWdlLCBzZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBsZXQgb3JkZXJOdW1iZXJzID0ge307XHJcbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcclxuICAgICAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IC9eby0oXFxkKykkLy5leGVjKHRhZyk7XHJcbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBvID0gZm91bmRbMV07XHJcbiAgICAgICAgICAgIGFzc2VydCghb3JkZXJOdW1iZXJzW29dLCBgTXVzdCBoYXZlIHVuaXF1ZSAke3RhZ30gdmFsdWVzYCwgcGFnZSwgc3RlcCk7XHJcbiAgICAgICAgICAgIGlmIChvKSB7XHJcbiAgICAgICAgICAgICAgICBvcmRlck51bWJlcnNbb10gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAoc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3N0ZXAnKSkge1xyXG4gICAgICAgICAgICBsaW50U3RlcChwYWdlLCBzdGVwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIXN0ZXAubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKSB7XHJcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdzZXR0aW5ncycgb3IgJ3N0ZXAnXCIsIHBhZ2UsIHN0ZXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFzc2VydChtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsIGB6b29tLXNjYWxlICR7em9vbVNjYWxlfSBtdXN0IGJlICR7TWF0aC5jZWlsKG1heEJzIC8gMTIuOCl9IGZvciBtYXggYnMgJHttYXhCc30gdXNlZGAsIHBhZ2UsIG5vZGUpO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSkge1xyXG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gNDAwICYmIG5vZGUuaGVpZ2h0ID09IDQwMCwgJ011c3QgYmUgNDAweDQwMCcsIHBhZ2UsIG5vZGUpO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRQYWdlKHBhZ2UpIHtcclxuICAgIGlmICgvXlxcL3xeSU5ERVgkLy50ZXN0KHBhZ2UubmFtZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB1cGRhdGVEaXNwbGF5KHBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xyXG4gICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFxcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xyXG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXmxlc3NvbiQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAnbGVzc29uJ1wiLCBwYWdlKTtcclxuICAgIGZvciAobGV0IG5vZGUgb2YgcGFnZS5jaGlsZHJlbikge1xyXG4gICAgICAgIGlmIChub2RlLm5hbWUgPT0gJ2xlc3NvbicpIHtcclxuICAgICAgICAgICAgbGludFRhc2tGcmFtZShwYWdlLCBub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09ICd0aHVtYm5haWwnKSB7XHJcbiAgICAgICAgICAgIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhc3NlcnQoL15cXC8vLnRlc3Qobm9kZS5uYW1lKSwgXCJNdXN0IGJlICd0aHVtYm5haWwnIG9yICdsZXNzb24nLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5cIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbGludEluZGV4KHBhZ2UpIHtcclxuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsICdJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudCcsIHBhZ2UpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcclxuICAgIGxpbnRUaHVtYm5haWwocGFnZSwgcGFnZS5jaGlsZHJlblswXSk7XHJcbn1cclxuZnVuY3Rpb24gbGludENvdXJzZSgpIHtcclxuICAgIGFzc2VydCgvXkNPVVJTRS1bYS16XFwtMC05XSskLy50ZXN0KGZpZ21hLnJvb3QubmFtZSksIGBDb3Vyc2UgbmFtZSAnJHtmaWdtYS5yb290Lm5hbWV9JyBtdXN0IG1hdGNoIENPVVJTRS1bYS16XFxcXC0wLTldK2ApO1xyXG4gICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZSA9PSAnSU5ERVgnKTtcclxuICAgIGlmIChhc3NlcnQoISFpbmRleCwgXCJNdXN0IGhhdmUgJ0lOREVYJyBwYWdlXCIpKSB7XHJcbiAgICAgICAgbGludEluZGV4KGluZGV4KTtcclxuICAgIH1cclxuICAgIC8vIGZpbmQgYWxsIG5vbi11bmlxdWUgbmFtZWQgcGFnZXNcclxuICAgIGNvbnN0IG5vblVuaXF1ZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmlsdGVyKChwLCBpLCBhKSA9PiBhLmZpbmRJbmRleCgocDIpID0+IHAyLm5hbWUgPT0gcC5uYW1lKSAhPSBpKTtcclxuICAgIG5vblVuaXF1ZS5mb3JFYWNoKChwKSA9PiBhc3NlcnQoZmFsc2UsIGBQYWdlIG5hbWUgJyR7cC5uYW1lfScgbXVzdCBiZSB1bmlxdWVgLCBwKSk7XHJcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcclxuICAgICAgICBsaW50UGFnZShwYWdlKTtcclxuICAgIH1cclxufVxyXG5vbignc2VsZWN0RXJyb3InLCBzZWxlY3RFcnJvcik7XHJcbm9uKCdsaW50Q291cnNlJywgKCkgPT4ge1xyXG4gICAgZXJyb3JzID0gW107XHJcbiAgICBsaW50Q291cnNlKCk7XHJcbiAgICBwcmludEVycm9ycygpO1xyXG59KTtcclxub24oJ2xpbnRQYWdlJywgKCkgPT4ge1xyXG4gICAgZXJyb3JzID0gW107XHJcbiAgICBsaW50UGFnZShmaWdtYS5jdXJyZW50UGFnZSk7XHJcbiAgICBwcmludEVycm9ycygpO1xyXG59KTtcclxuLy8gbm8gaGlkZGVuIGZpbGwvc3Ryb2tlXHJcbi8vIG5vIGVmZmVjdHNcclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IGNhcGl0YWxpemUsIHByaW50IH0gZnJvbSAnLi91dGlsJztcclxuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xyXG4gICAgY29uc3QgY291cnNlTmFtZSA9IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKC9DT1VSU0UtLywgJycpO1xyXG4gICAgbGV0IHRhc2tzID0gJyc7XHJcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAocGFnZS5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gJ0lOREVYJykge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFza3MgKz0gYFwidGFzay1uYW1lICR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShwYWdlLm5hbWUuc3BsaXQoJy0nKS5qb2luKCcgJykpfVwiO1xcbmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYFxyXG5cImNvdXJzZS1uYW1lICR7Y291cnNlTmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKGNvdXJzZU5hbWUuc3BsaXQoJy0nKS5qb2luKCcgJykpfVwiO1xyXG5cImNvdXJzZS1kZXNjcmlwdGlvbiAke2NvdXJzZU5hbWV9XCIgPSBcIkluIHRoaXMgY291cnNlOlxyXG4gICAg4oCiIFxyXG4gICAg4oCiIFxyXG4gICAg4oCiIFwiO1xyXG4ke3Rhc2tzfVxyXG5gO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRMZXNzb24ocGFnZSkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBpZiAoIXBhZ2UpIHtcclxuICAgICAgICAgICAgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcclxuICAgICAgICBjb25zdCBsZXNzb25Ob2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ2xlc3NvbicpO1xyXG4gICAgICAgIGNvbnN0IHRodW1ibmFpbE5vZGUgPSBwYWdlLmNoaWxkcmVuLmZpbmQoKGYpID0+IGYubmFtZSA9PSAndGh1bWJuYWlsJyk7XHJcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xyXG4gICAgICAgICAgICBmb3JtYXQ6ICdTVkcnLFxyXG4gICAgICAgICAgICAvLyBzdmdPdXRsaW5lVGV4dDogZmFsc2UsXHJcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHRodW1ibmFpbCA9IHlpZWxkIHRodW1ibmFpbE5vZGUuZXhwb3J0QXN5bmMoe1xyXG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxyXG4gICAgICAgICAgICBjb25zdHJhaW50OiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjb3Vyc2VQYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcclxuICAgICAgICAgICAgcGF0aDogcGFnZS5uYW1lLFxyXG4gICAgICAgICAgICBmaWxlLFxyXG4gICAgICAgICAgICB0aHVtYm5haWwsXHJcbiAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBbbGVzc29ucywgdGh1bWJuYWlsXSA9IHlpZWxkIFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoZmlnbWEucm9vdC5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocGFnZSkgPT4gcGFnZS5uYW1lICE9ICdJTkRFWCcpXHJcbiAgICAgICAgICAgICAgICAubWFwKChwYWdlKSA9PiBleHBvcnRMZXNzb24ocGFnZSkpKSxcclxuICAgICAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLmZpbmQoKHBhZ2UpID0+IHBhZ2UubmFtZSA9PSAnSU5ERVgnKVxyXG4gICAgICAgICAgICAgICAgLmV4cG9ydEFzeW5jKHtcclxuICAgICAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXHJcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1dJRFRIJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXHJcbiAgICAgICAgICAgIGxlc3NvbnMsXHJcbiAgICAgICAgICAgIHRodW1ibmFpbCxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZ2VuZXJhdGVTd2lmdENvZGUoKSB7XHJcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XHJcbiAgICBsZXQgc3dpZnRDb3Vyc2VOYW1lID0gY291cnNlTmFtZVxyXG4gICAgICAgIC5zcGxpdCgnLScpXHJcbiAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpXHJcbiAgICAgICAgLmpvaW4oJycpO1xyXG4gICAgc3dpZnRDb3Vyc2VOYW1lID1cclxuICAgICAgICBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XHJcbiAgICBsZXQgdGFza3MgPSAnJztcclxuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xyXG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXNrcyArPSBgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcclxuICAgIH1cclxuICAgIHJldHVybiBgXHJcbiAgICBsZXQgJHtzd2lmdENvdXJzZU5hbWV9ID0gQ291cnNlKFxyXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXHJcbiAgICBhdXRob3I6IFJFUExBQ0UsXHJcbiAgICB0YXNrczogW1xyXG4ke3Rhc2tzfSAgICBdKVxyXG5gO1xyXG59XHJcbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcclxuICAgIGNvbnN0IGNvZGUgPSBnZW5lcmF0ZVN3aWZ0Q29kZSgpICsgZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCk7XHJcbiAgICBwcmludChjb2RlKTtcclxufVxyXG5vbignZ2VuZXJhdGVDb2RlJywgZ2VuZXJhdGVDb2RlKTtcclxuIiwiaW1wb3J0IHsgZ2V0VGFncywgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3NvbiB9IGZyb20gJy4vdXRpbCc7XHJcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcclxuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XHJcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XHJcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcclxufVxyXG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XHJcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXHJcbiAgICAgICAgLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKVxyXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRQYWludENvbG9yKHBhaW50KSB7XHJcbiAgICBpZiAocGFpbnQudHlwZSA9PT0gJ1NPTElEJykge1xyXG4gICAgICAgIGxldCB7IHIsIGcsIGIgfSA9IHBhaW50LmNvbG9yO1xyXG4gICAgICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xyXG4gICAgICAgIGcgPSBNYXRoLnJvdW5kKGcgKiAyNTUpO1xyXG4gICAgICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xyXG4gICAgICAgIHJldHVybiB7IHIsIGcsIGIsIGE6IDEgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IHI6IDE2NiwgZzogMTY2LCBiOiAxNjYsIGE6IDEgfTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBkaXNwbGF5Q29sb3IoeyByLCBnLCBiLCBhIH0pIHtcclxuICAgIHJldHVybiBgcmdiYSgke3J9LCAke2d9LCAke2J9LCAke2F9KWA7XHJcbn1cclxuZnVuY3Rpb24gZ2V0Q29sb3JzKG5vZGUpIHtcclxuICAgIGNvbnN0IGRlZmF1bHRDb2xvciA9IHsgcjogMCwgZzogMCwgYjogMCwgYTogMCB9OyAvLyB0cmFuc3BhcmVudCA9IGRlZmF1bHQgY29sb3JcclxuICAgIGxldCBmaWxscyA9IGRlZmF1bHRDb2xvcjtcclxuICAgIGxldCBzdHJva2VzID0gZGVmYXVsdENvbG9yO1xyXG4gICAgY29uc3QgbGVhZiA9IGZpbmRMZWFmTm9kZXMobm9kZSlbMF07XHJcbiAgICBpZiAoJ2ZpbGxzJyBpbiBsZWFmICYmIGxlYWYuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIGxlYWYuZmlsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZpbGxzID0gZ2V0UGFpbnRDb2xvcihsZWFmLmZpbGxzWzBdKTtcclxuICAgIH1cclxuICAgIGlmICgnc3Ryb2tlcycgaW4gbGVhZiAmJiBsZWFmLnN0cm9rZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHN0cm9rZXMgPSBnZXRQYWludENvbG9yKGxlYWYuc3Ryb2tlc1swXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZpbGxzQ29sb3I6IGRpc3BsYXlDb2xvcihmaWxscyksXHJcbiAgICAgICAgc3Ryb2tlc0NvbG9yOiBkaXNwbGF5Q29sb3Ioc3Ryb2tlcyksXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGVwcygpIHtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcclxuICAgIHJldHVybiBzdGVwc0J5T3JkZXIobGVzc29uKS5tYXAoKHN0ZXApID0+IHtcclxuICAgICAgICByZXR1cm4geyBpZDogc3RlcC5pZCwgbmFtZTogc3RlcC5uYW1lLCBjb2xvcnM6IGdldENvbG9ycyhzdGVwKSB9O1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0ZXBPcmRlcihzdGVwcykge1xyXG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xyXG4gICAgc3RlcHMuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHMgPSBsZXNzb24uZmluZE9uZSgoZWwpID0+IGVsLmlkID09IHN0ZXAuaWQpO1xyXG4gICAgICAgIGlmIChzKSB7XHJcbiAgICAgICAgICAgIHMubmFtZSA9IHMubmFtZS5yZXBsYWNlKC9vLVxcZCsvLCAnby0nICsgKGkgKyAxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgZW1pdCwgb24gfSBmcm9tICcuLi9ldmVudHMnO1xyXG5pbXBvcnQgeyBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uLCBnZXRUYWdzLCBpc1Jlc3VsdFN0ZXAgfSBmcm9tICcuL3V0aWwnO1xyXG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XHJcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xyXG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xyXG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XHJcbn1cclxuZnVuY3Rpb24gZ2V0VGFnKHN0ZXAsIHRhZykge1xyXG4gICAgY29uc3QgdiA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKHRhZykpO1xyXG4gICAgcmV0dXJuIHYgPyB2LnJlcGxhY2UodGFnLCAnJykgOiAnMCc7XHJcbn1cclxuZnVuY3Rpb24gc3RlcHNCeU9yZGVyKGxlc3Nvbikge1xyXG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxyXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcclxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZGVsZXRlVG1wKCkge1xyXG4gICAgZmlnbWEuY3VycmVudFBhZ2VcclxuICAgICAgICAuZmluZEFsbCgoZWwpID0+IGVsLm5hbWUuc3RhcnRzV2l0aCgndG1wLScpKVxyXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlKCkpO1xyXG59XHJcbmxldCBsYXN0UGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xyXG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcclxuZnVuY3Rpb24gZGlzcGxheVRlbXBsYXRlKGxlc3Nvbiwgc3RlcCkge1xyXG4gICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcclxuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgaW5wdXQgPSBzdGVwLmZpbmRDaGlsZCgoZykgPT4gZy5uYW1lID09ICdpbnB1dCcpO1xyXG4gICAgaWYgKCFpbnB1dCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcclxuICAgIHRlbXBsYXRlLm5hbWUgPSAndG1wLXRlbXBsYXRlJztcclxuICAgIHRlbXBsYXRlXHJcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiAvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZWwudHlwZSkpXHJcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBlbC5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0V2VpZ2h0ID0gZ2V0VGFnKHN0ZXAsICdzLScpID09ICdtdWx0aXN0ZXAtYmcnID8gMzAgOiA1MDtcclxuICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgZGVmYXVsdFdlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XHJcbiAgICAgICAgICAgIHBpbmsuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDEsIGc6IDAsIGI6IDEgfSB9XTtcclxuICAgICAgICAgICAgcGluay5zdHJva2VXZWlnaHQgPSAyO1xyXG4gICAgICAgICAgICBwaW5rLm5hbWUgPSAncGluayAnICsgZWwubmFtZTtcclxuICAgICAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQocGluayk7XHJcbiAgICAgICAgICAgIC8vIGNsb25lIGVsZW1lbnQgaGVyZSBhbmQgZ2l2ZSBoaW0gdGhpbiBwaW5rIHN0cm9rZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWwuZmlsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBlbC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcclxuICAgIHRlbXBsYXRlLnJlbGF0aXZlVHJhbnNmb3JtID0gaW5wdXQucmVsYXRpdmVUcmFuc2Zvcm07XHJcbn1cclxuZnVuY3Rpb24gZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApIHtcclxuICAgIGNvbnN0IGRlZmF1bHRCUyA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDEyLjggOiAxMDtcclxuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdicy0nKSkgfHwgZGVmYXVsdEJTO1xyXG4gICAgY29uc3Qgc21hbGxMaW5lID0gZmlnbWEuY3JlYXRlTGluZSgpO1xyXG4gICAgc21hbGxMaW5lLm5hbWUgPSAnc21hbGxMaW5lJztcclxuICAgIHNtYWxsTGluZS5yZXNpemUoMzAwLCAwKTtcclxuICAgIHNtYWxsTGluZS5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMC44LCBiOiAwIH0gfV07XHJcbiAgICBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgLyAzO1xyXG4gICAgc21hbGxMaW5lLnN0cm9rZUNhcCA9ICdST1VORCc7XHJcbiAgICBzbWFsbExpbmUuc3Ryb2tlQWxpZ24gPSAnQ0VOVEVSJztcclxuICAgIHNtYWxsTGluZS55ID0gc21hbGxMaW5lLnN0cm9rZVdlaWdodCAvIDI7XHJcbiAgICBjb25zdCBtZWRpdW1MaW5lID0gc21hbGxMaW5lLmNsb25lKCk7XHJcbiAgICBtZWRpdW1MaW5lLm5hbWUgPSAnbWVkaXVtTGluZSc7XHJcbiAgICBtZWRpdW1MaW5lLm9wYWNpdHkgPSAwLjI7XHJcbiAgICBtZWRpdW1MaW5lLnN0cm9rZVdlaWdodCA9IGJzO1xyXG4gICAgbWVkaXVtTGluZS55ID0gbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgLyAyO1xyXG4gICAgY29uc3QgYmlnTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xyXG4gICAgYmlnTGluZS5uYW1lID0gJ2JpZ0xpbmUnO1xyXG4gICAgYmlnTGluZS5vcGFjaXR5ID0gMC4xO1xyXG4gICAgYmlnTGluZS5zdHJva2VXZWlnaHQgPSBicyArIE1hdGgucG93KGJzLCAxLjQpICogMC44O1xyXG4gICAgYmlnTGluZS55ID0gYmlnTGluZS5zdHJva2VXZWlnaHQgLyAyO1xyXG4gICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbYmlnTGluZSwgbWVkaXVtTGluZSwgc21hbGxMaW5lXSwgbGVzc29uLnBhcmVudCk7XHJcbiAgICBncm91cC5uYW1lID0gJ3RtcC1icyc7XHJcbiAgICBncm91cC54ID0gbGVzc29uLng7XHJcbiAgICBncm91cC55ID0gbGVzc29uLnkgLSA4MDtcclxufVxyXG5mdW5jdGlvbiBnZXRCcnVzaFNpemUoc3RlcCkge1xyXG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhzdGVwKTtcclxuICAgIGNvbnN0IHN0cm9rZXMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCk7XHJcbiAgICBjb25zdCBzdHJva2VXZWlnaHRzQXJyID0gc3Ryb2tlcy5tYXAoKG5vZGUpID0+IG5vZGVbJ3N0cm9rZVdlaWdodCddIHx8IDApO1xyXG4gICAgY29uc3QgbWF4V2VpZ2h0ID0gTWF0aC5tYXgoLi4uc3Ryb2tlV2VpZ2h0c0Fycik7XHJcbiAgICByZXR1cm4gc3Ryb2tlcy5sZW5ndGggPiAwID8gbWF4V2VpZ2h0IDogMjU7XHJcbn1cclxuZnVuY3Rpb24gZ2V0Q2xlYXJMYXllck51bWJlcnMoc3RlcCkge1xyXG4gICAgY29uc3QgcHJlZml4ID0gJ2NsZWFyLWxheWVyLSc7XHJcbiAgICBjb25zdCBjbGVhckxheWVyc1N0ZXAgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodGFnKSA9PiB0YWcuc3RhcnRzV2l0aChwcmVmaXgpKTtcclxuICAgIGlmIChjbGVhckxheWVyc1N0ZXAubGVuZ3RoICE9PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbGF5ZXJOdW1iZXJzID0gY2xlYXJMYXllcnNTdGVwWzBdXHJcbiAgICAgICAgLnNsaWNlKHByZWZpeC5sZW5ndGgpXHJcbiAgICAgICAgLnNwbGl0KCcsJylcclxuICAgICAgICAubWFwKE51bWJlcik7XHJcbiAgICByZXR1cm4gbGF5ZXJOdW1iZXJzO1xyXG59XHJcbmZ1bmN0aW9uIGdldENsZWFyQmVmb3JlU3RlcChzdGVwKSB7XHJcbiAgICBpZiAoZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHRhZykgPT4gdGFnLmluY2x1ZGVzKCdjbGVhci1iZWZvcmUnKSkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ZXA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGFnZSwgc2V0dGluZ3MpIHtcclxuICAgIGxhc3RQYWdlID0gcGFnZTtcclxuICAgIGxhc3RNb2RlID0gc2V0dGluZ3MuZGlzcGxheU1vZGU7XHJcbiAgICBjb25zdCB7IGRpc3BsYXlNb2RlLCBzdGVwTnVtYmVyIH0gPSBzZXR0aW5ncztcclxuICAgIGNvbnN0IGxlc3NvbiA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xyXG4gICAgaWYgKCFsZXNzb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xyXG4gICAgcGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XHJcbiAgICBjb25zdCBzdGVwQ291bnQgPSBsZXNzb24uY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpLmxlbmd0aDtcclxuICAgIGNvbnN0IG1heFN0cm9rZVdlaWdodCA9IGdldEJydXNoU2l6ZShzdGVwKTtcclxuICAgIGNvbnN0IGNsZWFyTGF5ZXJzU3RlcCA9IGdldENsZWFyTGF5ZXJOdW1iZXJzKHN0ZXApO1xyXG4gICAgY29uc3QgY2xlYXJCZWZvcmVTdGVwID0gZ2V0Q2xlYXJCZWZvcmVTdGVwKHN0ZXApO1xyXG4gICAgZW1pdCgndXBkYXRlRm9ybScsIHtcclxuICAgICAgICBzaGFkb3dTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSxcclxuICAgICAgICBicnVzaFNpemU6IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpLFxyXG4gICAgICAgIHN1Z2dlc3RlZEJydXNoU2l6ZTogaXNSZXN1bHRTdGVwKHN0ZXApID8gMCA6IG1heFN0cm9rZVdlaWdodCxcclxuICAgICAgICB0ZW1wbGF0ZTogZ2V0VGFnKHN0ZXAsICdzLScpLFxyXG4gICAgICAgIHN0ZXBDb3VudCxcclxuICAgICAgICBzdGVwTnVtYmVyLFxyXG4gICAgICAgIGRpc3BsYXlNb2RlLFxyXG4gICAgfSk7XHJcbiAgICBkZWxldGVUbXAoKTtcclxuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcclxuICAgICAgICBjYXNlICdhbGwnOlxyXG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxyXG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XHJcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcclxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBpIDwgc3RlcE51bWJlcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChjbGVhckxheWVyc1N0ZXAubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJMYXllcnNTdGVwLmZvckVhY2goKGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuW2xheWVyXS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjbGVhckJlZm9yZVN0ZXApIHtcclxuICAgICAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChsYXllciwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxheWVyLnZpc2libGUgPSBpID4gbGVzc29uLmNoaWxkcmVuLmluZGV4T2YoY2xlYXJCZWZvcmVTdGVwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcclxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcclxufSwgMTUwMCk7XHJcbmZ1bmN0aW9uIHVwZGF0ZVByb3BzKHNldHRpbmdzKSB7XHJcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XHJcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc2V0dGluZ3Muc3RlcE51bWJlciAtIDFdO1xyXG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnc3MtJykgJiYgIXQuc3RhcnRzV2l0aCgnYnMtJykgJiYgIXQuc3RhcnRzV2l0aCgncy0nKSk7XHJcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcclxuICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCBgcy0ke3NldHRpbmdzLnRlbXBsYXRlfWApO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcclxuICAgICAgICB0YWdzLnB1c2goYHNzLSR7c2V0dGluZ3Muc2hhZG93U2l6ZX1gKTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcclxuICAgICAgICB0YWdzLnB1c2goYGJzLSR7c2V0dGluZ3MuYnJ1c2hTaXplfWApO1xyXG4gICAgfVxyXG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XHJcbn1cclxub24oJ3VwZGF0ZURpc3BsYXknLCAoc2V0dGluZ3MpID0+IHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHNldHRpbmdzKSk7XHJcbm9uKCd1cGRhdGVQcm9wcycsIHVwZGF0ZVByb3BzKTtcclxuZmlnbWEub24oJ2N1cnJlbnRwYWdlY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgdXBkYXRlRGlzcGxheShsYXN0UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XHJcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcclxufSk7XHJcbmZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XHJcbiAgICBpZiAoIXNlbGVjdGlvbiB8fFxyXG4gICAgICAgICFsZXNzb24gfHxcclxuICAgICAgICAhbGVzc29uLmNoaWxkcmVuLmluY2x1ZGVzKHNlbGVjdGlvbikgfHxcclxuICAgICAgICBzZWxlY3Rpb24udHlwZSAhPT0gJ0dST1VQJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vdXBkYXRlIHN0ZXBcclxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XHJcbiAgICBjb25zdCBzdGVwTnVtYmVyID0gc3RlcHNCeU9yZGVyKGxlc3NvbikuaW5kZXhPZihzdGVwKSArIDE7XHJcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiBsYXN0TW9kZSwgc3RlcE51bWJlciB9KTtcclxufSk7XHJcbiIsImltcG9ydCB7IGVtaXQgfSBmcm9tICcuLi9ldmVudHMnO1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZEFsbChub2RlLCBmKSB7XHJcbiAgICBsZXQgYXJyID0gW107XHJcbiAgICBpZiAoZihub2RlKSkge1xyXG4gICAgICAgIGFyci5wdXNoKG5vZGUpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgaWYgKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdChjaGlsZHJlbi5mbGF0TWFwKChwKSA9PiBmaW5kQWxsKHAsIGYpKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJyO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kTGVhZk5vZGVzKG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlLmZpbmRBbGwoKG4pID0+ICEoJ2NoaWxkcmVuJyBpbiBuKSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xyXG4gICAgaWYgKGYobm9kZSkpIHtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLnBhcmVudCkge1xyXG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZUluZGV4KG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlLnBhcmVudC5jaGlsZHJlbi5maW5kSW5kZXgoKG4pID0+IG4uaWQgPT09IG5vZGUuaWQpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50TGVzc29uKCkge1xyXG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09PSAnbGVzc29uJyk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZ3Mobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUubmFtZS5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gYWRkVGFnKG5vZGUsIHRhZykge1xyXG4gICAgbm9kZS5uYW1lID0gZ2V0VGFncyhub2RlKS5jb25jYXQoW3RhZ10pLmpvaW4oJyAnKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudEJ5VGFnKG5vZGUsIHRhZykge1xyXG4gICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZSwgKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXModGFnKSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzdWx0U3RlcChub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZSAmJiBnZXRUYWdzKG5vZGUpLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcHJpbnQodGV4dCkge1xyXG4gICAgZmlnbWEudWkucmVzaXplKDcwMCwgNDAwKTtcclxuICAgIGVtaXQoJ3ByaW50JywgdGV4dCk7XHJcbn1cclxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSAocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XHJcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgY3JlYXRlUGx1Z2luQVBJLCBjcmVhdGVVSUFQSSB9IGZyb20gJ2ZpZ21hLWpzb25ycGMnO1xyXG5pbXBvcnQgeyBleHBvcnRUZXh0cyB9IGZyb20gJy4vcGx1Z2luL2Zvcm1hdC1ycGMnO1xyXG5pbXBvcnQgeyBleHBvcnRMZXNzb24sIGV4cG9ydENvdXJzZSB9IGZyb20gJy4vcGx1Z2luL3B1Ymxpc2gnO1xyXG5pbXBvcnQgeyBnZXRTdGVwcywgc2V0U3RlcE9yZGVyIH0gZnJvbSAnLi9wbHVnaW4vdHVuZS1ycGMnO1xyXG5pbXBvcnQgeyBjcmVhdGVMZXNzb24sIHNlcGFyYXRlU3RlcCwgc3BsaXRCeUNvbG9yLCBqb2luU3RlcHMsIH0gZnJvbSAnLi9wbHVnaW4vY3JlYXRlJztcclxuLy8gRmlnbWEgcGx1Z2luIG1ldGhvZHNcclxuZXhwb3J0IGNvbnN0IHBsdWdpbkFwaSA9IGNyZWF0ZVBsdWdpbkFQSSh7XHJcbiAgICBzZXRTZXNzaW9uVG9rZW4odG9rZW4pIHtcclxuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnc2Vzc2lvblRva2VuJywgdG9rZW4pO1xyXG4gICAgfSxcclxuICAgIGdldFNlc3Npb25Ub2tlbigpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnc2Vzc2lvblRva2VuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZXhwb3J0TGVzc29uLFxyXG4gICAgZXhwb3J0Q291cnNlLFxyXG4gICAgZ2V0U3RlcHMsXHJcbiAgICBzZXRTdGVwT3JkZXIsXHJcbiAgICBleHBvcnRUZXh0cyxcclxuICAgIGNyZWF0ZUxlc3NvbixcclxuICAgIHNlcGFyYXRlU3RlcCxcclxuICAgIHNwbGl0QnlDb2xvcixcclxuICAgIGpvaW5TdGVwcyxcclxufSk7XHJcbi8vIEZpZ21hIFVJIGFwcCBtZXRob2RzXHJcbmV4cG9ydCBjb25zdCB1aUFwaSA9IGNyZWF0ZVVJQVBJKHt9KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==