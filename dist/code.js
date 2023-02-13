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
/*! exports provided: exportTexts, importTexts */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportTexts", function() { return exportTexts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importTexts", function() { return importTexts; });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function findTexts(texts) {
    return texts
        .findAll((node) => node.type === 'TEXT')
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
    const texts = findTexts(figma.currentPage);
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
            yield figma.loadFontAsync(font);
        }
    });
}
function importTexts(translations) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Object.keys(translations).length === 0) {
            Object(_util__WEBPACK_IMPORTED_MODULE_0__["displayNotification"])('Empty input');
            return;
        }
        const texts = findTexts(figma.currentPage);
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
figma.on('selectionchange', () => {
    _rpc_api__WEBPACK_IMPORTED_MODULE_5__["pluginApi"].selectionChanged();
});
figma.on('currentpagechange', () => {
    _rpc_api__WEBPACK_IMPORTED_MODULE_5__["pluginApi"].currentPageChanged(figma.currentPage);
});
setTimeout(() => {
    _rpc_api__WEBPACK_IMPORTED_MODULE_5__["pluginApi"].updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 });
}, 1500);


/***/ }),

/***/ "./src/plugin/linter.ts":
/*!******************************!*\
  !*** ./src/plugin/linter.ts ***!
  \******************************/
/*! exports provided: ErrorLevel, ErrorColor, selectError, printErrors, onLintCourse, onLintPage, saveErrors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorLevel", function() { return ErrorLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorColor", function() { return ErrorColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectError", function() { return selectError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printErrors", function() { return printErrors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onLintCourse", function() { return onLintCourse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onLintPage", function() { return onLintPage; });
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
var ErrorColor;
(function (ErrorColor) {
    ErrorColor[ErrorColor["#ff0000"] = 0] = "#ff0000";
    ErrorColor[ErrorColor["#ff9900"] = 1] = "#ff9900";
    ErrorColor[ErrorColor["#00ff00"] = 2] = "#00ff00";
})(ErrorColor || (ErrorColor = {}));
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
    return __awaiter(this, void 0, void 0, function* () {
        figma.ui.resize(750, 400);
        const savedErrors = yield figma.clientStorage.getAsync('errorsForPrint');
        let sortedErrors = errors.sort((a, b) => a.level - b.level)
            .map((e) => {
            var _a, _b, _c;
            return {
                ignore: e.ignore,
                pageName: (_a = e.page) === null || _a === void 0 ? void 0 : _a.name,
                nodeName: (_b = e.node) === null || _b === void 0 ? void 0 : _b.name,
                nodeType: (_c = e.node) === null || _c === void 0 ? void 0 : _c.type,
                error: e.error,
                level: e.level,
                errorColor: e.level,
            };
        });
        if (savedErrors) {
            sortedErrors = sortedErrors.map((e) => {
                const savedError = savedErrors.find((s) => s.pageName === e.pageName && s.nodeName === e.nodeName && s.error === e.error);
                if (savedError) {
                    e.ignore = savedError.ignore;
                }
                return e;
            });
        }
        let text = errors
            .map((e) => {
            var _a, _b, _c;
            return `${ErrorLevel[e.level]}\t| ${e.error} | PAGE:${((_a = e.page) === null || _a === void 0 ? void 0 : _a.name) || ''} ${(_b = e.node) === null || _b === void 0 ? void 0 : _b.type}:${((_c = e.node) === null || _c === void 0 ? void 0 : _c.name) || ''}`;
        })
            .join('\n');
        text += '\nDone';
        selectError(0);
        return {
            tableErrors: sortedErrors,
            textErrors: text,
        };
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
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(/^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^Vector$|^\d+$|^Ellipse$|^Rectangle$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node);
    });
    let fills = node.fills;
    let strokes = node.strokes;
    assert(!fills.length || !strokes.length, 'Should not have fill+stroke', page, node, ErrorLevel.WARN);
    strokes.forEach((s) => {
        if (s.type !== 'SOLID')
            return;
        assert(s.visible, 'Stroke must be visible', page, node);
        assert(s.type == 'SOLID', 'Stroke must be solid', page, node);
        let s1 = s;
        assert(s1.color.r != 0 || s1.color.g != 0 || s1.color.b != 0, 'Stroke color must not be black', page, node);
        assert(s1.color.r != 1 || s1.color.g != 1 || s1.color.b != 1, 'Stroke color must not be white', page, node);
    });
    fills.forEach((f) => {
        if (f.type !== 'SOLID')
            return;
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
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(/^\/|^blink$|^rgb-template$|^d\d+$|^r\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
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
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
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
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(step);
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
    assert(!bs || bs >= 10 || brushName == 'pencil', `Should not use bs<10. ${bs}<10`, page, step, ErrorLevel.INFO);
    assert(!ss || ss >= 15, 'ss must be >= 15', page, step);
    assert(!ss || !bs || ss > bs, 'ss must be > bs', page, step);
    assert(!bs || bs <= zoomScale * 12.8, `bs must be <= ${zoomScale * 12.8} for this zoom-scale`, page, step);
    assert(!bs || bs >= zoomScale * 0.44, `bs must be >= ${zoomScale * 0.44} for this zoom-scale`, page, step);
    assert(!o || order == 'layers', `${o} must be used only with settings order-layers`, page, step);
    assert(order !== 'layers' || !!o, 'Must have o-N order number', page, step);
    const sf = step.findOne((n) => { var _a; return Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('rgb-template') && ((_a = n.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    const ffs = step.findAll((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('rgb-template') && n.fills && n.fills[0]);
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
    assert(!!node.children.find((n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('s-multistep-result')), "Must have 's-multistep-result' child", page, node);
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
function lintPage(currentPage) {
    const page = currentPage ? currentPage : figma.currentPage;
    if (/^\/|^INDEX$/.test(page.name)) {
        return;
    }
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["updateDisplay"])(page, { displayMode: 'all', stepNumber: 1 });
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
function onLintCourse() {
    errors = [];
    lintCourse();
    return printErrors();
}
function onLintPage(currentPage) {
    errors = [];
    lintPage(currentPage);
    return printErrors();
}
function saveErrors(errorsForPrint) {
    return figma.clientStorage.setAsync('errorsForPrint', errorsForPrint);
}


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
/*! exports provided: updateDisplay, currentPageChanged, selectionChanged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateDisplay", function() { return updateDisplay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currentPageChanged", function() { return currentPageChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectionChanged", function() { return selectionChanged; });
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
let lastMode = 'all';
let lastPage;
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
        .findAll((el) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(el).includes('rgb-template'))
        .map((el) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLeafNodes"])(el))
        .flat()
        .filter((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type))
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
    console.log('page', page);
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
function currentPageChanged(pageNode) {
    if (figma && !lastPage) {
        lastPage = figma.currentPage;
    }
    updateDisplay(lastPage, { displayMode: 'all', stepNumber: 1 });
    updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 });
    lastPage = pageNode;
}
function selectionChanged() {
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
}


/***/ }),

/***/ "./src/plugin/util.ts":
/*!****************************!*\
  !*** ./src/plugin/util.ts ***!
  \****************************/
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, addTag, findParentByTag, isResultStep, print, displayNotification, capitalize */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayNotification", function() { return displayNotification; });
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
    if (!('children' in node)) {
        return [node];
    }
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
function displayNotification(message) {
    figma.notify(message);
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
/* harmony import */ var _plugin_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugin/util */ "./src/plugin/util.ts");
/* harmony import */ var _plugin_linter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./plugin/linter */ "./src/plugin/linter.ts");
/* harmony import */ var _plugin_tune__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./plugin/tune */ "./src/plugin/tune.ts");
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
    importTexts: _plugin_format_rpc__WEBPACK_IMPORTED_MODULE_1__["importTexts"],
    displayNotification: _plugin_util__WEBPACK_IMPORTED_MODULE_5__["displayNotification"],
    createLesson: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["createLesson"],
    separateStep: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["separateStep"],
    splitByColor: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["splitByColor"],
    joinSteps: _plugin_create__WEBPACK_IMPORTED_MODULE_4__["joinSteps"],
    onLintPage: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["onLintPage"],
    onLintCourse: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["onLintCourse"],
    selectError: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["selectError"],
    saveErrors: _plugin_linter__WEBPACK_IMPORTED_MODULE_6__["saveErrors"],
    selectionChanged: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["selectionChanged"],
    currentPageChanged: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["currentPageChanged"],
    updateDisplay: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["updateDisplay"],
});
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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SDtBQUM0QjtBQUNuQztBQUNnQztBQUNBO0FBQ3BGO0FBQ08sa0JBQWtCLHFFQUFlO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLDBFQUFZO0FBQ2hCLElBQUksMEVBQVk7QUFDaEIsSUFBSSxtRUFBUTtBQUNaLElBQUksMkVBQVk7QUFDaEIsSUFBSSwyRUFBVztBQUNmLElBQUksMkVBQVc7QUFDZixJQUFJLHFGQUFtQjtBQUN2QixJQUFJLHlFQUFZO0FBQ2hCLElBQUkseUVBQVk7QUFDaEIsSUFBSSx5RUFBWTtBQUNoQixJQUFJLG1FQUFTO0FBQ2IsSUFBSSxxRUFBVTtBQUNkLElBQUkseUVBQVk7QUFDaEIsSUFBSSx1RUFBVztBQUNmLElBQUkscUVBQVU7QUFDZCxJQUFJLCtFQUFnQjtBQUNwQixJQUFJLG1GQUFrQjtBQUN0QixJQUFJLHlFQUFhO0FBQ2pCLENBQUM7QUFDRDtBQUNPLGNBQWMsaUVBQVcsR0FBRyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9pbmRleC50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzLlBhcnNlRXJyb3IgPSBjbGFzcyBQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJQYXJzZSBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjcwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFJlcXVlc3QgPSBjbGFzcyBJbnZhbGlkUmVxdWVzdCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBSZXF1ZXN0XCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NZXRob2ROb3RGb3VuZCA9IGNsYXNzIE1ldGhvZE5vdEZvdW5kIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJNZXRob2Qgbm90IGZvdW5kXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAxO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUGFyYW1zID0gY2xhc3MgSW52YWxpZFBhcmFtcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBwYXJhbXNcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludGVybmFsRXJyb3IgPSBjbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnRlcm5hbCBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMztcbiAgfVxufTtcbiIsImNvbnN0IHsgc2V0dXAsIHNlbmRSZXF1ZXN0IH0gPSByZXF1aXJlKFwiLi9ycGNcIik7XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVVJQVBJID0gZnVuY3Rpb24gY3JlYXRlVUlBUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsdWdpbkFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbkFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG4iLCJjb25zdCBSUENFcnJvciA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IHsgTWV0aG9kTm90Rm91bmQgfSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcblxubGV0IHNlbmRSYXc7XG5cbmlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZmlnbWEudWkub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGhhbmRsZVJhdyhtZXNzYWdlKSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xufSBlbHNlIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIG9ubWVzc2FnZSA9IGV2ZW50ID0+IGhhbmRsZVJhdyhldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiBtZXNzYWdlIH0sIFwiKlwiKTtcbn1cblxubGV0IHJwY0luZGV4ID0gMDtcbmxldCBwZW5kaW5nID0ge307XG5cbmZ1bmN0aW9uIHNlbmRKc29uKHJlcSkge1xuICB0cnkge1xuICAgIHNlbmRSYXcocmVxKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXN1bHQoaWQsIHJlc3VsdCkge1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICByZXN1bHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRFcnJvcihpZCwgZXJyb3IpIHtcbiAgY29uc3QgZXJyb3JPYmplY3QgPSB7XG4gICAgY29kZTogZXJyb3IuY29kZSxcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgIGRhdGE6IGVycm9yLmRhdGFcbiAgfTtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgZXJyb3I6IGVycm9yT2JqZWN0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSYXcoZGF0YSkge1xuICB0cnkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVScGMoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJwYyhqc29uKSB7XG4gIGlmICh0eXBlb2YganNvbi5pZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBqc29uLnJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAganNvbi5lcnJvciB8fFxuICAgICAgdHlwZW9mIGpzb24ubWV0aG9kID09PSBcInVuZGVmaW5lZFwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHNlbmRFcnJvcihcbiAgICAgICAgICBqc29uLmlkLFxuICAgICAgICAgIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgY2FsbGJhY2sgZm9yIFwiICsganNvbi5pZClcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxiYWNrLnRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBjYWxsYmFjayhqc29uLmVycm9yLCBqc29uLnJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZVJlcXVlc3QoanNvbik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKTtcbiAgfVxufVxuXG5sZXQgbWV0aG9kcyA9IHt9O1xuXG5mdW5jdGlvbiBvblJlcXVlc3QobWV0aG9kLCBwYXJhbXMpIHtcbiAgaWYgKCFtZXRob2RzW21ldGhvZF0pIHtcbiAgICB0aHJvdyBuZXcgTWV0aG9kTm90Rm91bmQobWV0aG9kKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kc1ttZXRob2RdKC4uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgbWV0aG9kXCIpKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbiAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXN1bHRcbiAgICAgICAgLnRoZW4ocmVzID0+IHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBlcnIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnNldHVwID0gX21ldGhvZHMgPT4ge1xuICBPYmplY3QuYXNzaWduKG1ldGhvZHMsIF9tZXRob2RzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmROb3RpZmljYXRpb24gPSAobWV0aG9kLCBwYXJhbXMpID0+IHtcbiAgc2VuZEpzb24oeyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcyB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKG1ldGhvZCwgcGFyYW1zLCB0aW1lb3V0KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaWQgPSBycGNJbmRleDtcbiAgICBjb25zdCByZXEgPSB7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zLCBpZCB9O1xuICAgIHJwY0luZGV4ICs9IDE7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc3QganNFcnJvciA9IG5ldyBFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgIGpzRXJyb3IuY29kZSA9IGVyci5jb2RlO1xuICAgICAgICBqc0Vycm9yLmRhdGEgPSBlcnIuZGF0YTtcbiAgICAgICAgcmVqZWN0KGpzRXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgfTtcblxuICAgIC8vIHNldCBhIGRlZmF1bHQgdGltZW91dFxuICAgIGNhbGxiYWNrLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2lkXTtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0IFwiICsgbWV0aG9kICsgXCIgdGltZWQgb3V0LlwiKSk7XG4gICAgfSwgdGltZW91dCB8fCAzMDAwKTtcblxuICAgIHBlbmRpbmdbaWRdID0gY2FsbGJhY2s7XG4gICAgc2VuZEpzb24ocmVxKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5SUENFcnJvciA9IFJQQ0Vycm9yO1xuIiwiY29uc3QgZXZlbnRIYW5kbGVycyA9IHt9O1xubGV0IGN1cnJlbnRJZCA9IDA7XG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IGlkID0gYCR7Y3VycmVudElkfWA7XG4gICAgY3VycmVudElkICs9IDE7XG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgZXZlbnRIYW5kbGVyc1tpZF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJldHVybiBvbihuYW1lLCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAoZG9uZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xuICAgID8gZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoW25hbWUsIC4uLmFyZ3NdKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgfSwgJyonKTtcbiAgICB9O1xuZnVuY3Rpb24gaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpIHtcbiAgICBmb3IgKGNvbnN0IGlkIGluIGV2ZW50SGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKGV2ZW50SGFuZGxlcnNbaWRdLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaWRdLmhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKChfYSA9IHBhcmFtc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmpzb25ycGMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBwYXJhbXNbMF07XG4gICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICB9O1xufVxuZWxzZSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIFRPRE86IHZlcnkgZGlydHkgaGFjaywgbmVlZHMgZml4aW5nXG4gICAgICAgIGNvbnN0IGZhbGxiYWNrID0gd2luZG93Lm9ubWVzc2FnZTtcbiAgICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgICAgIGZhbGxiYWNrLmFwcGx5KHdpbmRvdywgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gcGFyYW1zWzBdO1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XG4gICAgICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSwgMTAwKTtcbn1cbiIsImltcG9ydCB7IGZpbmRMZWFmTm9kZXMsIGdldEN1cnJlbnRMZXNzb24sIGZpbmRQYXJlbnRCeVRhZywgZ2V0Tm9kZUluZGV4LCBnZXRUYWdzLCBpc1Jlc3VsdFN0ZXAsIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE5vZGUobm9kZSwgcGFyYW1ldGVycykge1xuICAgIGNvbnN0IHsgbmFtZSwgeCwgeSwgd2lkdGggPSA0MCwgaGVpZ2h0ID0gNDAgfSA9IHBhcmFtZXRlcnM7XG4gICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICBub2RlLnggPSB4O1xuICAgIG5vZGUueSA9IHk7XG4gICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG59XG5mdW5jdGlvbiBmaWxsU2VydmljZU5vZGVzKG5vZGUpIHtcbiAgICBub2RlLmZpbGxzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICByOiAxOTYgLyAyNTUsXG4gICAgICAgICAgICAgICAgZzogMTk2IC8gMjU1LFxuICAgICAgICAgICAgICAgIGI6IDE5NiAvIDI1NSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXTtcbn1cbmZ1bmN0aW9uIHJlc2NhbGVJbWFnZU5vZGUobm9kZSwgcmVzaXplUGFyYW1zKSB7XG4gICAgY29uc3QgeyBtYXhXaWR0aCwgbWF4SGVpZ2h0IH0gPSByZXNpemVQYXJhbXM7XG4gICAgY29uc3QgaXNDb3JyZWN0U2l6ZSA9IG5vZGUud2lkdGggPD0gbWF4V2lkdGggJiYgbm9kZS5oZWlnaHQgPD0gbWF4SGVpZ2h0O1xuICAgIGNvbnN0IGlzQ29ycmVjdFR5cGUgPSBub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnUkVDVEFOR0xFJyB8fCBub2RlLnR5cGUgPT09ICdWRUNUT1InO1xuICAgIGlmIChpc0NvcnJlY3RUeXBlICYmICFpc0NvcnJlY3RTaXplKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gTWF0aC5taW4obWF4V2lkdGggLyBub2RlLndpZHRoLCBtYXhIZWlnaHQgLyBub2RlLmhlaWdodCk7XG4gICAgICAgIG5vZGUucmVzY2FsZShzY2FsZUZhY3Rvcik7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVzdWx0Tm9kZShub2RlKSB7XG4gICAgY29uc3QgcmVzdWx0UmVjdGFuZ2xlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhyZXN1bHRSZWN0YW5nbGUpO1xuICAgIGNvbnN0IHRlbXBsYXRlR3JvdXAgPSBmaWdtYS5ncm91cChbcmVzdWx0UmVjdGFuZ2xlXSwgbm9kZSk7XG4gICAgdGVtcGxhdGVHcm91cC5uYW1lID0gJ3RlbXBsYXRlJztcbiAgICBjb25zdCByZXN1bHQgPSBmaWdtYS5ncm91cChbdGVtcGxhdGVHcm91cF0sIG5vZGUpO1xuICAgIGZvcm1hdE5vZGUocmVzdWx0LCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcsXG4gICAgICAgIHg6IDEwLFxuICAgICAgICB5OiA2MCxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMZXNzb24oKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbmFsSW1hZ2UgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgZm9ybWF0Tm9kZShsZXNzb24sIHtcbiAgICAgICAgbmFtZTogJ2xlc3NvbicsXG4gICAgICAgIHg6IC00NjEsXG4gICAgICAgIHk6IC01MTIsXG4gICAgICAgIHdpZHRoOiAxMzY2LFxuICAgICAgICBoZWlnaHQ6IDEwMjQsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbCwge1xuICAgICAgICBuYW1lOiAndGh1bWJuYWlsJyxcbiAgICAgICAgeDogLTkwMSxcbiAgICAgICAgeTogLTUxMixcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHN0ZXBcbiAgICBjb25zdCBzdGVwID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xuICAgIHN0ZXAubmFtZSA9ICdpbWFnZSc7XG4gICAgY29uc3QgcmVzaXplZEltYWdlID0gcmVzY2FsZUltYWdlTm9kZShvcmlnaW5hbEltYWdlLCB7XG4gICAgICAgIG1heFdpZHRoOiBsZXNzb24ud2lkdGggLSA4MyAqIDIsXG4gICAgICAgIG1heEhlaWdodDogbGVzc29uLmhlaWdodCAtIDEyICogMixcbiAgICB9KTtcbiAgICBjb25zdCBzdGVwSW5wdXQgPSBmaWdtYS5ncm91cChbc3RlcF0sIGxlc3Nvbik7XG4gICAgc3RlcElucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IGZpcnN0U3RlcCA9IGZpZ21hLmdyb3VwKFtzdGVwSW5wdXRdLCBsZXNzb24pO1xuICAgIGZvcm1hdE5vZGUoZmlyc3RTdGVwLCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLWJydXNoJyxcbiAgICAgICAgeDogKGxlc3Nvbi53aWR0aCAtIHJlc2l6ZWRJbWFnZS53aWR0aCkgLyAyLFxuICAgICAgICB5OiAobGVzc29uLmhlaWdodCAtIHJlc2l6ZWRJbWFnZS5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRJbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkSW1hZ2UuaGVpZ2h0LFxuICAgIH0pO1xuICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcbiAgICBjb25zdCB0aHVtYm5haWxJbWFnZSA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcbiAgICB0aHVtYm5haWxJbWFnZS5uYW1lID0gJ2ltYWdlJztcbiAgICBjb25zdCByZXNpemVkVGh1bWJuYWlsID0gcmVzY2FsZUltYWdlTm9kZSh0aHVtYm5haWxJbWFnZSwge1xuICAgICAgICBtYXhXaWR0aDogdGh1bWJuYWlsLndpZHRoIC0gMzUgKiAyLFxuICAgICAgICBtYXhIZWlnaHQ6IHRodW1ibmFpbC5oZWlnaHQgLSAzNSAqIDIsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsR3JvdXAgPSBmaWdtYS5ncm91cChbdGh1bWJuYWlsSW1hZ2VdLCB0aHVtYm5haWwpO1xuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsR3JvdXAsIHtcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCBncm91cCcsXG4gICAgICAgIHg6ICh0aHVtYm5haWwud2lkdGggLSByZXNpemVkVGh1bWJuYWlsLndpZHRoKSAvIDIsXG4gICAgICAgIHk6ICh0aHVtYm5haWwuaGVpZ2h0IC0gcmVzaXplZFRodW1ibmFpbC5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRUaHVtYm5haWwud2lkdGgsXG4gICAgICAgIGhlaWdodDogcmVzaXplZFRodW1ibmFpbC5oZWlnaHQsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHJlc3VsdFxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcbiAgICAvLyBDcmVhdGUgc2V0dGluZ3NcbiAgICBjb25zdCBzZXR0aW5nc0VsbGlwc2UgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhzZXR0aW5nc0VsbGlwc2UpO1xuICAgIGZvcm1hdE5vZGUoc2V0dGluZ3NFbGxpcHNlLCB7XG4gICAgICAgIG5hbWU6ICdzZXR0aW5ncyBjYXB0dXJlLWNvbG9yIHpvb20tc2NhbGUtMiBvcmRlci1sYXllcnMnLFxuICAgICAgICB4OiAxMCxcbiAgICAgICAgeTogMTAsXG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHNldHRpbmdzRWxsaXBzZSk7XG4gICAgb3JpZ2luYWxJbWFnZS5yZW1vdmUoKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbG9yKGNvbG9yKSB7XG4gICAgbGV0IHsgciwgZywgYiB9ID0gY29sb3I7XG4gICAgciA9IE1hdGgucm91bmQociAqIDI1NSk7XG4gICAgZyA9IE1hdGgucm91bmQoZyAqIDI1NSk7XG4gICAgYiA9IE1hdGgucm91bmQoYiAqIDI1NSk7XG4gICAgcmV0dXJuIGByZ2IoJHtyfSwgJHtnfSwgJHtifSlgO1xufVxuZnVuY3Rpb24gbmFtZUxlYWZOb2Rlcyhub2Rlcykge1xuICAgIGxldCBhbGxTdHJva2VzID0gIW5vZGVzLmZpbmQoKG5vZGUpID0+ICdmaWxscycgaW4gbm9kZSAmJiBub2RlLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBub2RlLmZpbGxzLmxlbmd0aCA+IDApO1xuICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgbm9kZS5uYW1lID1cbiAgICAgICAgICAgICdyZ2ItdGVtcGxhdGUgJyArIChhbGxTdHJva2VzICYmIG5vZGVzLmxlbmd0aCA+IDMgPyAnZHJhdy1saW5lJyA6ICdibGluaycpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG5hbWVTdGVwTm9kZShzdGVwKSB7XG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhzdGVwKTtcbiAgICBsZXQgZmlsbHMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnZmlsbHMnIGluIG4gJiYgbi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbi5maWxscy5sZW5ndGggPiAwKTtcbiAgICBsZXQgc3Ryb2tlcyA9IGxlYXZlcy5maWx0ZXIoKG4pID0+ICdzdHJva2VzJyBpbiBuICYmIG4uc3Ryb2tlcy5sZW5ndGggPiAwKTtcbiAgICBsZXQgbXVsdGlzdGVwVHlwZSA9IGZpbGxzLmxlbmd0aCA+IDAgPyAnYmcnIDogJ2JydXNoJztcbiAgICBsZXQgc3Ryb2tlV2VpZ2h0c0FyciA9IHN0cm9rZXMubWFwKChub2RlKSA9PiBub2RlWydzdHJva2VXZWlnaHQnXSB8fCAwKTtcbiAgICBsZXQgbWF4V2VpZ2h0ID0gTWF0aC5tYXgoLi4uc3Ryb2tlV2VpZ2h0c0Fycik7XG4gICAgbGV0IHdlaWdodCA9IHN0cm9rZXMubGVuZ3RoID4gMCA/IG1heFdlaWdodCA6IDI1O1xuICAgIHN0ZXAubmFtZSA9IGBzdGVwIHMtbXVsdGlzdGVwLSR7bXVsdGlzdGVwVHlwZX0gYnMtJHt3ZWlnaHR9YDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0ZXBOb2RlKG5vZGUsIG5vZGVzQXJyYXksIGluZGV4KSB7XG4gICAgaWYgKCFub2Rlc0FycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIG5hbWVMZWFmTm9kZXMobm9kZXNBcnJheSk7XG4gICAgY29uc3QgaW5wdXQgPSBmaWdtYS5ncm91cChub2Rlc0FycmF5LCBub2RlKTtcbiAgICBpbnB1dC5uYW1lID0gJ2lucHV0JztcbiAgICBjb25zdCBzdGVwID0gZmlnbWEuZ3JvdXAoW2lucHV0XSwgbm9kZSwgaW5kZXgpO1xuICAgIG5hbWVTdGVwTm9kZShzdGVwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZVN0ZXAoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGNvbnN0IGxlYXZlcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+ICEoJ2NoaWxkcmVuJyBpbiBub2RlKSk7XG4gICAgaWYgKCFsZWF2ZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlyc3RQYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcbiAgICBpZiAoaXNSZXN1bHRTdGVwKGZpcnN0UGFyZW50U3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoZmlyc3RQYXJlbnRTdGVwKTtcbiAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGxlYXZlcywgaW5kZXgpO1xufVxuZnVuY3Rpb24gYWRkVG9NYXAobWFwLCBrZXksIG5vZGUpIHtcbiAgICBpZiAoIW1hcC5oYXMoa2V5KSkge1xuICAgICAgICBtYXAuc2V0KGtleSwgW10pO1xuICAgIH1cbiAgICBtYXAuZ2V0KGtleSkucHVzaChub2RlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VDb2xvcihub2Rlc0J5Q29sb3IsIG9sZENvbG9yLCBuZXdDb2xvcikge1xuICAgIGNvbnN0IG9sZENvbG9yS2V5ID0gc3RyaW5naWZ5Q29sb3Iob2xkQ29sb3IpO1xuICAgIGNvbnN0IG5ld0NvbG9yS2V5ID0gc3RyaW5naWZ5Q29sb3IobmV3Q29sb3IpO1xuICAgIGlmIChub2Rlc0J5Q29sb3IuaGFzKG9sZENvbG9yS2V5KSkge1xuICAgICAgICBjb25zdCB1cGRhdGVkQ29sb3JzID0gbm9kZXNCeUNvbG9yLmdldChvbGRDb2xvcktleSkubWFwKChuKSA9PiB7XG4gICAgICAgICAgICBpZiAoJ2ZpbGxzJyBpbiBuICYmIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG4uZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIG4uZmlsbHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogbmV3Q29sb3IsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCdzdHJva2VzJyBpbiBuICYmIG4uc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbi5zdHJva2VzID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG5ld0NvbG9yLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfSk7XG4gICAgICAgIG5vZGVzQnlDb2xvci5zZXQobmV3Q29sb3JLZXksIHVwZGF0ZWRDb2xvcnMpO1xuICAgICAgICBub2Rlc0J5Q29sb3IuZGVsZXRlKG9sZENvbG9yS2V5KTtcbiAgICB9XG59XG5jb25zdCBibGFjayA9IHsgcjogMCwgZzogMCwgYjogMCB9O1xuY29uc3QgbmVhckJsYWNrID0geyByOiAyMyAvIDI1NSwgZzogMjMgLyAyNTUsIGI6IDIzIC8gMjU1IH07XG5jb25zdCB3aGl0ZSA9IHsgcjogMjU1IC8gMjU1LCBnOiAyNTUgLyAyNTUsIGI6IDI1NSAvIDI1NSB9O1xuY29uc3QgbmVhcldoaXRlID0geyByOiAyMzUgLyAyNTUsIGc6IDIzNSAvIDI1NSwgYjogMjM1IC8gMjU1IH07XG5leHBvcnQgZnVuY3Rpb24gc3BsaXRCeUNvbG9yKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoIXNlbGVjdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhwYXJlbnRTdGVwKTtcbiAgICBpZiAoIXBhcmVudFN0ZXAgfHwgaXNSZXN1bHRTdGVwKHBhcmVudFN0ZXApIHx8IGxlYXZlcy5sZW5ndGggPD0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBmaWxsc0J5Q29sb3IgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHN0cm9rZXNCeUNvbG9yID0gbmV3IE1hcCgpO1xuICAgIGxldCB1bmtub3duTm9kZXMgPSBbXTtcbiAgICBmaW5kTGVhZk5vZGVzKHBhcmVudFN0ZXApLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgaWYgKCdmaWxscycgaW4gbiAmJlxuICAgICAgICAgICAgbi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiZcbiAgICAgICAgICAgIG4uZmlsbHMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgbi5maWxsc1swXS50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgICAgICBhZGRUb01hcChmaWxsc0J5Q29sb3IsIHN0cmluZ2lmeUNvbG9yKG4uZmlsbHNbMF0uY29sb3IpLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgnc3Ryb2tlcycgaW4gbiAmJlxuICAgICAgICAgICAgbi5zdHJva2VzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIG4uc3Ryb2tlc1swXS50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgICAgICBhZGRUb01hcChzdHJva2VzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5zdHJva2VzWzBdLmNvbG9yKSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB1bmtub3duTm9kZXMucHVzaChuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIG1ha2Ugc3VyZSBjb2xvciBpcyBub3QgYmxhY2sgb3Igd2hpdGVcbiAgICByZXBsYWNlQ29sb3IoZmlsbHNCeUNvbG9yLCBibGFjaywgbmVhckJsYWNrKTtcbiAgICByZXBsYWNlQ29sb3Ioc3Ryb2tlc0J5Q29sb3IsIGJsYWNrLCBuZWFyQmxhY2spO1xuICAgIHJlcGxhY2VDb2xvcihmaWxsc0J5Q29sb3IsIHdoaXRlLCBuZWFyV2hpdGUpO1xuICAgIHJlcGxhY2VDb2xvcihzdHJva2VzQnlDb2xvciwgd2hpdGUsIG5lYXJXaGl0ZSk7XG4gICAgZm9yIChsZXQgZmlsbHMgb2YgZmlsbHNCeUNvbG9yLnZhbHVlcygpKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgZmlsbHMpO1xuICAgIH1cbiAgICBmb3IgKGxldCBzdHJva2VzIG9mIHN0cm9rZXNCeUNvbG9yLnZhbHVlcygpKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3Nvbiwgc3Ryb2tlcyk7XG4gICAgfVxuICAgIGlmICh1bmtub3duTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHVua25vd25Ob2Rlcyk7XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgcmVzdWx0IGlzIGxvY2F0ZWQgYXQgdGhlIGVuZFxuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUgPT09ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0LnJlbW92ZSgpO1xuICAgIH1cbiAgICBjcmVhdGVSZXN1bHROb2RlKGxlc3Nvbik7XG4gICAgLy8gUmVtb3ZlIG9yaWdpbmFsIG5vZGUgaWYgdGhlcmUgYXJlIHJlbWFpbnNcbiAgICBpZiAoIXBhcmVudFN0ZXAucmVtb3ZlZCkge1xuICAgICAgICBwYXJlbnRTdGVwLnJlbW92ZSgpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBqb2luU3RlcHMoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGNvbnN0IGFsbFN0ZXBzID0gc2VsZWN0aW9uLmV2ZXJ5KChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpO1xuICAgIGNvbnN0IHN0ZXBzID0gc2VsZWN0aW9uLmZpbHRlcigobikgPT4gIWlzUmVzdWx0U3RlcChuKSk7XG4gICAgaWYgKCFhbGxTdGVwcyB8fCBzdGVwcy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXROb2RlcyA9IHN0ZXBzXG4gICAgICAgIC5tYXAoKHN0ZXApID0+IHN0ZXAuY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBuLm5hbWUgPT09ICdpbnB1dCcgJiYgbi50eXBlID09PSAnR1JPVVAnKSlcbiAgICAgICAgLmZsYXQoKTtcbiAgICBjb25zdCBsZWF2ZXMgPSBpbnB1dE5vZGVzLm1hcCgobikgPT4gbi5jaGlsZHJlbikuZmxhdCgpO1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBpbmRleCA9IGdldE5vZGVJbmRleChzdGVwc1swXSk7XG4gICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgZGlzcGxheU5vdGlmaWNhdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBmaW5kVGV4dHModGV4dHMpIHtcbiAgICByZXR1cm4gdGV4dHNcbiAgICAgICAgLmZpbmRBbGwoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKVxuICAgICAgICAuZmlsdGVyKChub2RlKSA9PiBub2RlLnZpc2libGUpO1xufVxuZnVuY3Rpb24gZ2V0U3R5bGVkU2VnbWVudHMobm9kZSkge1xuICAgIHJldHVybiBub2RlLmdldFN0eWxlZFRleHRTZWdtZW50cyhbXG4gICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICdmb250TmFtZScsXG4gICAgICAgICdmb250V2VpZ2h0JyxcbiAgICAgICAgJ3RleHREZWNvcmF0aW9uJyxcbiAgICAgICAgJ3RleHRDYXNlJyxcbiAgICAgICAgJ2xpbmVIZWlnaHQnLFxuICAgICAgICAnbGV0dGVyU3BhY2luZycsXG4gICAgICAgICdmaWxscycsXG4gICAgICAgICd0ZXh0U3R5bGVJZCcsXG4gICAgICAgICdmaWxsU3R5bGVJZCcsXG4gICAgICAgICdsaXN0T3B0aW9ucycsXG4gICAgICAgICdpbmRlbnRhdGlvbicsXG4gICAgICAgICdoeXBlcmxpbmsnLFxuICAgIF0pO1xufVxuZnVuY3Rpb24gZXNjYXBlKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuICAgICAgICAucmVwbGFjZSgvXFx8L2csICdcXFxcbCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyk7XG59XG5jb25zdCByZXBsYWNlbWVudHMgPSB7ICdcXFxcXFxcXCc6ICdcXFxcJywgJ1xcXFxuJzogJ1xcbicsICdcXFxcXCInOiAnXCInLCAnXFxcXGwnOiAnfCcgfTtcbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICAgIGlmIChzdHIubWF0Y2goL1xcfC8pIHx8IHN0ci5tYXRjaCgvKD88IVxcXFwpXCIvKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcKFxcXFx8bnxcInxsKS9nLCBmdW5jdGlvbiAocmVwbGFjZSkge1xuICAgICAgICByZXR1cm4gcmVwbGFjZW1lbnRzW3JlcGxhY2VdO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVGV4dChub2RlKSB7XG4gICAgcmV0dXJuIGdldFN0eWxlZFNlZ21lbnRzKG5vZGUpXG4gICAgICAgIC5tYXAoKHMpID0+IGVzY2FwZShzLmNoYXJhY3RlcnMpKVxuICAgICAgICAuam9pbignfCcpXG4gICAgICAgIC50cmltRW5kKCk7XG59XG5mdW5jdGlvbiBpbXBvcnRTdHlsZWRTZWdtZW50cyhzZWdtZW50VGV4dHMsIG5vZGUpIHtcbiAgICAvLyB1cGRhdGUgc2VnbWVudHMgaW4gcmV2ZXJzZSBvcmRlclxuICAgIGZvciAobGV0IGkgPSBzZWdtZW50VGV4dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3Qgc2VnbWVudFRleHQgPSBzZWdtZW50VGV4dHNbaV07XG4gICAgICAgIGxldCBzdHlsZXMgPSBnZXRTdHlsZWRTZWdtZW50cyhub2RlKTtcbiAgICAgICAgaWYgKHNlZ21lbnRUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG5vZGUuaW5zZXJ0Q2hhcmFjdGVycyhzdHlsZXNbaV0uZW5kLCBzZWdtZW50VGV4dCwgJ0JFRk9SRScpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuZGVsZXRlQ2hhcmFjdGVycyhzdHlsZXNbaV0uc3RhcnQsIHN0eWxlc1tpXS5lbmQpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRUZXh0cygpIHtcbiAgICBjb25zdCB0ZXh0cyA9IGZpbmRUZXh0cyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgcmV0dXJuICh0ZXh0c1xuICAgICAgICAubWFwKChub2RlKSA9PiBnZXRGb3JtYXR0ZWRUZXh0KG5vZGUpKVxuICAgICAgICAuZmlsdGVyKChzdHIpID0+IHN0ci5sZW5ndGggPiAwKVxuICAgICAgICAvLyByZW1vdmUgYXJyYXkgZHVwbGljYXRlc1xuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcbn1cbmZ1bmN0aW9uIGxvYWRGb250cyh0ZXh0cykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGFsbEZvbnRzID0gW107XG4gICAgICAgIHRleHRzLmZvckVhY2goKHR4dCkgPT4ge1xuICAgICAgICAgICAgZ2V0U3R5bGVkU2VnbWVudHModHh0KS5tYXAoKHMpID0+IHtcbiAgICAgICAgICAgICAgICBhbGxGb250cy5wdXNoKHMuZm9udE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB1bmlxdWVGb250cyA9IGFsbEZvbnRzLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PiBpbmRleCA9PT1cbiAgICAgICAgICAgIHNlbGYuZmluZEluZGV4KCh0KSA9PiB0LmZhbWlseSA9PT0gdmFsdWUuZmFtaWx5ICYmIHQuc3R5bGUgPT09IHZhbHVlLnN0eWxlKSk7XG4gICAgICAgIGZvciAobGV0IGZvbnQgb2YgdW5pcXVlRm9udHMpIHtcbiAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRUZXh0cyh0cmFuc2xhdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRpc3BsYXlOb3RpZmljYXRpb24oJ0VtcHR5IGlucHV0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGV4dHMgPSBmaW5kVGV4dHMoZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICB5aWVsZCBsb2FkRm9udHModGV4dHMpO1xuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFRleHQgPSBnZXRGb3JtYXR0ZWRUZXh0KHR4dCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1tmb3JtYXR0ZWRUZXh0XTtcbiAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcbiAgICAgICAgICAgIGNvbnN0IG9sZFNlZ21lbnRzID0gZm9ybWF0dGVkVGV4dC5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgY29uc3QgbmV3U2VnbWVudHMgPSB0cmFuc2xhdGlvbi5zcGxpdCgnfCcpLm1hcCgoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdW5lc2NhcGUoc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBGYWlsZWQgdG8gdW5lc2NhcGU6ICR7c3RyfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogZGVsZXRlIGFsbCB0ZXh0XG4gICAgICAgICAgICBpZiAobmV3U2VnbWVudHMubGVuZ3RoID09PSAxICYmIG5ld1NlZ21lbnRzWzBdID09PSAnJykge1xuICAgICAgICAgICAgICAgIHR4dC5jaGFyYWN0ZXJzID0gJyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG8gbm90IGFsbG93IHNlZ21lbnRzIGxlbmd0aCBtaXNtYXRjaFxuICAgICAgICAgICAgaWYgKG5ld1NlZ21lbnRzLmxlbmd0aCAhPT0gb2xkU2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFdyb25nIHNlZ21lbnQgY291bnQgKCR7bmV3U2VnbWVudHMubGVuZ3RofSDiiaAgJHtvbGRTZWdtZW50cy5sZW5ndGh9KTogJHtmb3JtYXR0ZWRUZXh0fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheU5vdGlmaWNhdGlvbihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW1wb3J0U3R5bGVkU2VnbWVudHMobmV3U2VnbWVudHMsIHR4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgYWRkVGFnLCBmaW5kQWxsLCBnZXRDdXJyZW50TGVzc29uLCBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE9yZGVyKGxlc3Nvbikge1xuICAgIGlmIChsZXNzb24uZmluZENoaWxkKChuKSA9PiAhIWdldFRhZ3MobikuZmluZCgodCkgPT4gL15vLS8udGVzdCh0KSkpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3VuZCBvLXRhZy4gZm9ybWF0T3JkZXIgYWJvcnQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHNldHRpbmdzID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc2V0dGluZ3MnKSk7XG4gICAgYWRkVGFnKHNldHRpbmdzLCAnb3JkZXItbGF5ZXJzJyk7XG4gICAgY29uc3QgbGF5ZXJSZWdleCA9IC9eKHMtbXVsdGlzdGVwLWJydXNoLXxzLW11bHRpc3RlcC1iZy0pKFxcZCspJC87XG4gICAgY29uc3Qgc3RlcHMgPSBsZXNzb24uZmluZENoaWxkcmVuKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykgJiYgIWdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgYWRkVGFnKHJlc3VsdCwgYG8tJHtzdGVwcy5sZW5ndGggKyAxfWApO1xuICAgIHN0ZXBzLnJldmVyc2UoKS5mb3JFYWNoKChzdGVwLCBvcmRlcikgPT4ge1xuICAgICAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIGNvbnN0IGxheWVyVGFnID0gdGFncy5maW5kKCh0KSA9PiBsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICBsZXQgbGF5ZXIgPSA0O1xuICAgICAgICBpZiAobGF5ZXJUYWcpIHtcbiAgICAgICAgICAgIGxheWVyID0gcGFyc2VJbnQobGF5ZXJSZWdleC5leGVjKGxheWVyVGFnKVsyXSk7XG4gICAgICAgICAgICB0YWdzID0gdGFncy5maWx0ZXIoKHQpID0+ICFsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgL14ocy1tdWx0aXN0ZXAtYnJ1c2h8cy1tdWx0aXN0ZXAtYmcpLy5leGVjKGxheWVyVGFnKVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RlcC5zZXRQbHVnaW5EYXRhKCdsYXllcicsIEpTT04uc3RyaW5naWZ5KGxheWVyKSk7XG4gICAgICAgIHRhZ3MucHVzaChgby0ke29yZGVyICsgMX1gKTtcbiAgICAgICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG4gICAgfSk7XG4gICAgbGV0IHNvcnRlZFN0ZXBzID0gc3RlcHMuc29ydCgoYSwgYikgPT4gSlNPTi5wYXJzZShiLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpIC1cbiAgICAgICAgSlNPTi5wYXJzZShhLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpKTtcbiAgICBzb3J0ZWRTdGVwcy5mb3JFYWNoKChzKSA9PiBsZXNzb24uaW5zZXJ0Q2hpbGQoMSwgcykpO1xufVxuZnVuY3Rpb24gYXV0b0Zvcm1hdCgpIHtcbiAgICBjb25zdCB0aHVtYlBhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZS50b1VwcGVyQ2FzZSgpID09ICdUSFVNQk5BSUxTJyk7XG4gICAgaWYgKHRodW1iUGFnZSkge1xuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gdGh1bWJQYWdlLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XG4gICAgICAgICAgICBjbG9uZS5yZXNpemUoNDAwLCA0MDApO1xuICAgICAgICAgICAgY2xvbmUubmFtZSA9ICd0aHVtYm5haWwnO1xuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICBpZiAob2xkTGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSAnbGVzc29uJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnkgPSBsZXNzb25GcmFtZS55O1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xuICAgICAgICBuLnggPSAxMDtcbiAgICAgICAgbi55ID0gMTA7XG4gICAgfSk7XG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zdGVwIHMtbXVsdGlzdGVwLXJlc3VsdC8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0ubmFtZSA9ICd0ZW1wbGF0ZSc7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0ubmFtZSA9ICcvaWdub3JlJztcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDYwO1xuICAgIH0pO1xufVxub24oJ2F1dG9Gb3JtYXQnLCBhdXRvRm9ybWF0KTtcbm9uKCdmb3JtYXRPcmRlcicsICgpID0+IGZvcm1hdE9yZGVyKGdldEN1cnJlbnRMZXNzb24oKSkpO1xuIiwiaW1wb3J0ICcuL2NyZWF0ZSc7XG5pbXBvcnQgJy4vdHVuZSc7XG5pbXBvcnQgJy4vZm9ybWF0JztcbmltcG9ydCAnLi9saW50ZXInO1xuaW1wb3J0ICcuL3B1Ymxpc2gnO1xuaW1wb3J0ICcuLi9ycGMtYXBpJztcbmltcG9ydCB7IHBsdWdpbkFwaSB9IGZyb20gJy4uL3JwYy1hcGknO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcbmZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ1MCk7XG5jb25zb2xlLmNsZWFyKCk7XG5maWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xuICAgIHBsdWdpbkFwaS5zZWxlY3Rpb25DaGFuZ2VkKCk7XG59KTtcbmZpZ21hLm9uKCdjdXJyZW50cGFnZWNoYW5nZScsICgpID0+IHtcbiAgICBwbHVnaW5BcGkuY3VycmVudFBhZ2VDaGFuZ2VkKGZpZ21hLmN1cnJlbnRQYWdlKTtcbn0pO1xuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgcGx1Z2luQXBpLnVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xufSwgMTUwMCk7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGdldFRhZ3MsIGZpbmRBbGwgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgdXBkYXRlRGlzcGxheSB9IGZyb20gJy4vdHVuZSc7XG5sZXQgZXJyb3JzID0gW107XG5sZXQgem9vbVNjYWxlID0gMTtcbmxldCBtYXhCcyA9IDEyLjg7XG5sZXQgb3JkZXIgPSAnc3RlcHMnO1xuZXhwb3J0IHZhciBFcnJvckxldmVsO1xuKGZ1bmN0aW9uIChFcnJvckxldmVsKSB7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiRVJST1JcIl0gPSAwXSA9IFwiRVJST1JcIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJXQVJOXCJdID0gMV0gPSBcIldBUk5cIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcbn0pKEVycm9yTGV2ZWwgfHwgKEVycm9yTGV2ZWwgPSB7fSkpO1xuZXhwb3J0IHZhciBFcnJvckNvbG9yO1xuKGZ1bmN0aW9uIChFcnJvckNvbG9yKSB7XG4gICAgRXJyb3JDb2xvcltFcnJvckNvbG9yW1wiI2ZmMDAwMFwiXSA9IDBdID0gXCIjZmYwMDAwXCI7XG4gICAgRXJyb3JDb2xvcltFcnJvckNvbG9yW1wiI2ZmOTkwMFwiXSA9IDFdID0gXCIjZmY5OTAwXCI7XG4gICAgRXJyb3JDb2xvcltFcnJvckNvbG9yW1wiIzAwZmYwMFwiXSA9IDJdID0gXCIjMDBmZjAwXCI7XG59KShFcnJvckNvbG9yIHx8IChFcnJvckNvbG9yID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RFcnJvcihpbmRleCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKChfYSA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYWdlKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzW2luZGV4XS5wYWdlO1xuICAgIH1cbiAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHsgLy8gY3Jhc2hlcywgcHJvYmFibHkgYmVjYXVzZSBvZiBzZWxlY3Rpb24gaGFwcGVuaW5nIGZyb20gdGhlIERpc3BsYXlGb3JtXG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1tpbmRleF0ucGFnZS5zZWxlY3Rpb24gPSBbZXJyb3JzW2luZGV4XS5ub2RlXTtcbiAgICB9XG4gICAgLy8gfSwgMClcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludEVycm9ycygpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBmaWdtYS51aS5yZXNpemUoNzUwLCA0MDApO1xuICAgICAgICBjb25zdCBzYXZlZEVycm9ycyA9IHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ2Vycm9yc0ZvclByaW50Jyk7XG4gICAgICAgIGxldCBzb3J0ZWRFcnJvcnMgPSBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpXG4gICAgICAgICAgICAubWFwKChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWdub3JlOiBlLmlnbm9yZSxcbiAgICAgICAgICAgICAgICBwYWdlTmFtZTogKF9hID0gZS5wYWdlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSxcbiAgICAgICAgICAgICAgICBub2RlTmFtZTogKF9iID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubmFtZSxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogKF9jID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MudHlwZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZS5lcnJvcixcbiAgICAgICAgICAgICAgICBsZXZlbDogZS5sZXZlbCxcbiAgICAgICAgICAgICAgICBlcnJvckNvbG9yOiBlLmxldmVsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzYXZlZEVycm9ycykge1xuICAgICAgICAgICAgc29ydGVkRXJyb3JzID0gc29ydGVkRXJyb3JzLm1hcCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkRXJyb3IgPSBzYXZlZEVycm9ycy5maW5kKChzKSA9PiBzLnBhZ2VOYW1lID09PSBlLnBhZ2VOYW1lICYmIHMubm9kZU5hbWUgPT09IGUubm9kZU5hbWUgJiYgcy5lcnJvciA9PT0gZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5pZ25vcmUgPSBzYXZlZEVycm9yLmlnbm9yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdGV4dCA9IGVycm9yc1xuICAgICAgICAgICAgLm1hcCgoZSkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICByZXR1cm4gYCR7RXJyb3JMZXZlbFtlLmxldmVsXX1cXHR8ICR7ZS5lcnJvcn0gfCBQQUdFOiR7KChfYSA9IGUucGFnZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpIHx8ICcnfSAkeyhfYiA9IGUubm9kZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnR5cGV9OiR7KChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLm5hbWUpIHx8ICcnfWA7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgICAgIHRleHQgKz0gJ1xcbkRvbmUnO1xuICAgICAgICBzZWxlY3RFcnJvcigwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhYmxlRXJyb3JzOiBzb3J0ZWRFcnJvcnMsXG4gICAgICAgICAgICB0ZXh0RXJyb3JzOiB0ZXh0LFxuICAgICAgICB9O1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGlmICghdmFsKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZnVuY3Rpb24gZGVlcE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVlcE5vZGVzKG4pKTtcbn1cbmZ1bmN0aW9uIGRlc2NlbmRhbnRzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIFtub2RlLCAuLi5ub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlc2NlbmRhbnRzKG4pKV07XG59XG5mdW5jdGlvbiBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZXNjZW5kYW50cyhuKSk7XG59XG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xeZHJhdy1saW5lJHxeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJHxeZmxpcCR8XlZlY3RvciR8XlxcZCskfF5FbGxpcHNlJHxeUmVjdGFuZ2xlJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XG4gICAgbGV0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXM7XG4gICAgYXNzZXJ0KCFmaWxscy5sZW5ndGggfHwgIXN0cm9rZXMubGVuZ3RoLCAnU2hvdWxkIG5vdCBoYXZlIGZpbGwrc3Ryb2tlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBzdHJva2VzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgaWYgKHMudHlwZSAhPT0gJ1NPTElEJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXNzZXJ0KHMudmlzaWJsZSwgJ1N0cm9rZSBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KHMudHlwZSA9PSAnU09MSUQnLCAnU3Ryb2tlIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgbGV0IHMxID0gcztcbiAgICAgICAgYXNzZXJ0KHMxLmNvbG9yLnIgIT0gMCB8fCBzMS5jb2xvci5nICE9IDAgfHwgczEuY29sb3IuYiAhPSAwLCAnU3Ryb2tlIGNvbG9yIG11c3Qgbm90IGJlIGJsYWNrJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChzMS5jb2xvci5yICE9IDEgfHwgczEuY29sb3IuZyAhPSAxIHx8IHMxLmNvbG9yLmIgIT0gMSwgJ1N0cm9rZSBjb2xvciBtdXN0IG5vdCBiZSB3aGl0ZScsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGZpbGxzLmZvckVhY2goKGYpID0+IHtcbiAgICAgICAgaWYgKGYudHlwZSAhPT0gJ1NPTElEJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgYXNzZXJ0KGYudmlzaWJsZSwgJ0ZpbGwgbXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChmLnR5cGUgPT0gJ1NPTElEJywgJ0ZpbGwgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBsZXQgZjEgPSBmO1xuICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAwIHx8IGYxLmNvbG9yLmcgIT0gMCB8fCBmMS5jb2xvci5iICE9IDAsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIGJsYWNrJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChmMS5jb2xvci5yICE9IDEgfHwgZjEuY29sb3IuZyAhPSAxIHx8IGYxLmNvbG9yLmIgIT0gMSwgJ0ZpbGwgY29sb3IgbXVzdCBub3QgYmUgd2hpdGUnLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IC9ST1VORHxOT05FLy50ZXN0KFN0cmluZyhub2RlLnN0cm9rZUNhcCkpLCBgU3Ryb2tlIGNhcHMgbXVzdCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gJ1JPVU5EJywgYFN0cm9rZSBqb2lucyBzaG91bGQgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUpvaW4pfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayR8XmRyYXctbGluZSQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaycgb3IgJ2RyYXctbGluZSdcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxufVxuZnVuY3Rpb24gbGludEdyb3VwKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQoIS9CT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpLCAnTm90aWNlIEJPT0xFQU5fT1BFUkFUSU9OJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBjb25zdCByZ2J0ID0gdGFncy5maW5kKChzKSA9PiAvXnJnYi10ZW1wbGF0ZSQvLnRlc3QocykpO1xuICAgIGNvbnN0IGFuaW0gPSB0YWdzLmZpbmQoKHMpID0+IC9eYmxpbmskLy50ZXN0KHMpKTtcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cbn1cbmZ1bmN0aW9uIGxpbnRJbnB1dChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdHUk9VUCcsIFwiTXVzdCBiZSAnR1JPVVAnIHR5cGUnXCIsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUubmFtZSA9PSAnaW5wdXQnLCBcIk11c3QgYmUgJ2lucHV0J1wiLCBwYWdlLCBub2RlKTtcbiAgICBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdCh2LnR5cGUpKSB7XG4gICAgICAgICAgICBsaW50R3JvdXAocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRWZWN0b3IocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnR1JPVVAvVkVDVE9SL1JFQ1RBTkdMRS9FTExJUFNFL1RFWFQnIHR5cGVcIiwgcGFnZSwgdik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGxpbnRTZXR0aW5ncyhwYWdlLCBub2RlKSB7XG4gICAgdmFyIF9hO1xuICAgIGFzc2VydChub2RlLnR5cGUgPT0gJ0VMTElQU0UnLCBcIk11c3QgYmUgJ0VMTElQU0UnIHR5cGUnXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXnNldHRpbmdzJHxeY2FwdHVyZS1jb2xvciR8Xnpvb20tc2NhbGUtXFxkKyR8Xm9yZGVyLWxheWVycyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5icnVzaC1uYW1lLVxcdyskfF5zcy1cXGQrJHxeYnMtXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgaWYgKHRhZ3MuZmluZCgodGFnKSA9PiAvXm9yZGVyLWxheWVycyQvLnRlc3QodGFnKSkpIHtcbiAgICAgICAgb3JkZXIgPSAnbGF5ZXJzJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9yZGVyID0gJ3N0ZXBzJztcbiAgICB9XG4gICAgem9vbVNjYWxlID0gcGFyc2VJbnQoKChfYSA9IHRhZ3MuZmluZCgocykgPT4gL156b29tLXNjYWxlLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3pvb20tc2NhbGUtJywgJycpKSB8fFxuICAgICAgICAnMScpO1xuICAgIGFzc2VydCh6b29tU2NhbGUgPj0gMSAmJiB6b29tU2NhbGUgPD0gNSwgYE11c3QgYmUgMSA8PSB6b29tLXNjYWxlIDw9IDUgKCR7em9vbVNjYWxlfSlgLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRTdGVwKHBhZ2UsIHN0ZXApIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBpZiAoIWFzc2VydChzdGVwLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoc3RlcC5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydChzdGVwLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBzdGVwKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15cXC98XnN0ZXAkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxecy1tdWx0aXN0ZXAtYmckfF5icnVzaC1uYW1lLVxcdyskfF5jbGVhci1sYXllci0oXFxkKyw/KSskfF5zcy1cXGQrJHxeYnMtXFxkKyR8Xm8tXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgLy8gYXNzZXJ0KCEvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYmckLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgaXMgb2Jzb2xldGVgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIH0pO1xuICAgIGNvbnN0IGJnID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJnJHxecy1tdWx0aXN0ZXAtYmctXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJydXNoID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IHNzID0gcGFyc2VJbnQoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnNzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3NzLScsICcnKSk7XG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KChfYiA9IHRhZ3MuZmluZCgocykgPT4gL15icy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZXBsYWNlKCdicy0nLCAnJykpO1xuICAgIGNvbnN0IGJydXNoTmFtZSA9IChfYyA9IHRhZ3NcbiAgICAgICAgLmZpbmQoKHMpID0+IC9eYnJ1c2gtbmFtZS1cXHcrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZXBsYWNlKCdicnVzaC1uYW1lLScsICcnKTtcbiAgICBjb25zdCB0ZXJtaW5hbE5vZGVzID0gZGVzY2VuZGFudHNXaXRob3V0U2VsZihzdGVwKS5maWx0ZXIoKHYpID0+IHZbJ2NoaWxkcmVuJ10gPT0gdW5kZWZpbmVkKTtcbiAgICBjb25zdCBtYXhTaXplID0gdGVybWluYWxOb2Rlcy5yZWR1Y2UoKGFjYywgdikgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoYWNjLCB2LndpZHRoLCB2LmhlaWdodCk7XG4gICAgfSwgMCk7XG4gICAgbWF4QnMgPSBNYXRoLm1heChicyA/IGJzIDogbWF4QnMsIG1heEJzKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDIwIHx8IG1heFNpemUgPD0gMTAwLCBgU2hvdWxkIG5vdCB1c2Ugc3M8MjAgd2l0aCBsb25nIGxpbmVzLiBDb25zaWRlciB1c2luZyBiZyB0ZW1wbGF0ZS4gJHttYXhTaXplfT4xMDBgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMjAgfHwgdGVybWluYWxOb2Rlcy5sZW5ndGggPD0gOCwgYFNob3VsZCBub3QgdXNlIHNzPDIwIHdpdGggdG9vIG1hbnkgbGluZXMuIENvbnNpZGVyIHVzaW5nIGJnIHRlbXBsYXRlLiAke3Rlcm1pbmFsTm9kZXMubGVuZ3RofT44YCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzID49IDEwIHx8IGJydXNoTmFtZSA9PSAncGVuY2lsJywgYFNob3VsZCBub3QgdXNlIGJzPDEwLiAke2JzfTwxMGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAxNSwgJ3NzIG11c3QgYmUgPj0gMTUnLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIXNzIHx8ICFicyB8fCBzcyA+IGJzLCAnc3MgbXVzdCBiZSA+IGJzJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA8PSB6b29tU2NhbGUgKiAxMi44LCBgYnMgbXVzdCBiZSA8PSAke3pvb21TY2FsZSAqIDEyLjh9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzID49IHpvb21TY2FsZSAqIDAuNDQsIGBicyBtdXN0IGJlID49ICR7em9vbVNjYWxlICogMC40NH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghbyB8fCBvcmRlciA9PSAnbGF5ZXJzJywgYCR7b30gbXVzdCBiZSB1c2VkIG9ubHkgd2l0aCBzZXR0aW5ncyBvcmRlci1sYXllcnNgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQob3JkZXIgIT09ICdsYXllcnMnIHx8ICEhbywgJ011c3QgaGF2ZSBvLU4gb3JkZXIgbnVtYmVyJywgcGFnZSwgc3RlcCk7XG4gICAgY29uc3Qgc2YgPSBzdGVwLmZpbmRPbmUoKG4pID0+IHsgdmFyIF9hOyByZXR1cm4gZ2V0VGFncyhuKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykgJiYgKChfYSA9IG4uc3Ryb2tlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwOyB9KTtcbiAgICBjb25zdCBmZnMgPSBzdGVwLmZpbmRBbGwoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3JnYi10ZW1wbGF0ZScpICYmIG4uZmlsbHMgJiYgbi5maWxsc1swXSk7XG4gICAgY29uc3QgYmlnRmZzID0gZmZzLmZpbHRlcigobikgPT4gbi53aWR0aCA+IDI3IHx8IG4uaGVpZ2h0ID4gMjcpO1xuICAgIGNvbnN0IGZmID0gZmZzLmxlbmd0aCA+IDA7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgIXNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2Ugbm90IHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBhc3NlcnQoIWJnIHx8IGZmLCBcImJnIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aG91dCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnJ1c2ggfHwgYmlnRmZzLmxlbmd0aCA9PSAwLCBcImJydXNoIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aCBmaWxsZWQtaW4gdmVjdG9ycyAoc2l6ZSA+IDI3KVwiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIHN0ZXAuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAobi5uYW1lID09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgIGxpbnRJbnB1dChwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuLm5hbWUgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgICAgICAgIC8vIGxpbnQgdGVtcGxhdGVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdpbnB1dCcgb3IgJ3RlbXBsYXRlJ1wiLCBwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGJsaW5rTm9kZXMgPSBmaW5kQWxsKHN0ZXAsIChuKSA9PiBnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eYmxpbmskLy50ZXN0KHQpKSAhPT0gdW5kZWZpbmVkKS5mbGF0TWFwKGRlZXBOb2Rlcyk7XG4gICAgY29uc3QgZmlsbGVkTm9kZSA9IGJsaW5rTm9kZXMuZmluZCgobikgPT4gbi5maWxsc1swXSk7XG4gICAgYXNzZXJ0KGJsaW5rTm9kZXMubGVuZ3RoID09IDAgfHwgISFmaWxsZWROb2RlIHx8IGJsaW5rTm9kZXMubGVuZ3RoID4gMywgJ1Nob3VsZCB1c2UgZHJhdy1saW5lIGlmIDwgNCBsaW5lcycsIHBhZ2UsIGJsaW5rTm9kZXNbMF0sIEVycm9yTGV2ZWwuSU5GTyk7XG59XG5mdW5jdGlvbiBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDEzNjYgJiYgbm9kZS5oZWlnaHQgPT0gMTAyNCwgJ011c3QgYmUgMTM2NngxMDI0JywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCEhbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSksIFwiTXVzdCBoYXZlICdzLW11bHRpc3RlcC1yZXN1bHQnIGNoaWxkXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCBzZXR0aW5ncyA9IG5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gbi5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpO1xuICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICBsaW50U2V0dGluZ3MocGFnZSwgc2V0dGluZ3MpO1xuICAgIH1cbiAgICBsZXQgb3JkZXJOdW1iZXJzID0ge307XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgICAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSAvXm8tKFxcZCspJC8uZXhlYyh0YWcpO1xuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG8gPSBmb3VuZFsxXTtcbiAgICAgICAgICAgIGFzc2VydCghb3JkZXJOdW1iZXJzW29dLCBgTXVzdCBoYXZlIHVuaXF1ZSAke3RhZ30gdmFsdWVzYCwgcGFnZSwgc3RlcCk7XG4gICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIG9yZGVyTnVtYmVyc1tvXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHN0ZXAubmFtZS5zdGFydHNXaXRoKCdzdGVwJykpIHtcbiAgICAgICAgICAgIGxpbnRTdGVwKHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSkge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ3NldHRpbmdzJyBvciAnc3RlcCdcIiwgcGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gYXNzZXJ0KFxuICAgIC8vICAgbWF4QnMgPiAoem9vbVNjYWxlIC0gMSkgKiAxMi44LFxuICAgIC8vICAgYHpvb20tc2NhbGUgJHt6b29tU2NhbGV9IG11c3QgYmUgJHtNYXRoLmNlaWwoXG4gICAgLy8gICAgIG1heEJzIC8gMTIuOFxuICAgIC8vICAgKX0gZm9yIG1heCBicyAke21heEJzfSB1c2VkYCxcbiAgICAvLyAgIHBhZ2UsXG4gICAgLy8gICBub2RlXG4gICAgLy8gKVxufVxuZnVuY3Rpb24gbGludFRodW1ibmFpbChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDQwMCAmJiBub2RlLmhlaWdodCA9PSA0MDAsICdNdXN0IGJlIDQwMHg0MDAnLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRQYWdlKGN1cnJlbnRQYWdlKSB7XG4gICAgY29uc3QgcGFnZSA9IGN1cnJlbnRQYWdlID8gY3VycmVudFBhZ2UgOiBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICBpZiAoL15cXC98XklOREVYJC8udGVzdChwYWdlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlRGlzcGxheShwYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICBpZiAoIWFzc2VydCgvXlthLXpcXC0wLTldKyQvLnRlc3QocGFnZS5uYW1lKSwgYFBhZ2UgbmFtZSAnJHtwYWdlLm5hbWV9JyBtdXN0IG1hdGNoIFthLXpcXFxcLTAtOV0rLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXmxlc3NvbiQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAnbGVzc29uJ1wiLCBwYWdlKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHBhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKG5vZGUubmFtZSA9PSAnbGVzc29uJykge1xuICAgICAgICAgICAgbGludFRhc2tGcmFtZShwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLm5hbWUgPT0gJ3RodW1ibmFpbCcpIHtcbiAgICAgICAgICAgIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoL15cXC8vLnRlc3Qobm9kZS5uYW1lKSwgXCJNdXN0IGJlICd0aHVtYm5haWwnIG9yICdsZXNzb24nLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5cIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGxpbnRJbmRleChwYWdlKSB7XG4gICAgaWYgKCFhc3NlcnQocGFnZS5jaGlsZHJlbi5sZW5ndGggPT0gMSwgJ0luZGV4IHBhZ2UgbXVzdCBjb250YWluIGV4YWN0bHkgMSBlbGVtZW50JywgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xuICAgIGxpbnRUaHVtYm5haWwocGFnZSwgcGFnZS5jaGlsZHJlblswXSk7XG59XG5mdW5jdGlvbiBsaW50Q291cnNlKCkge1xuICAgIGFzc2VydCgvXkNPVVJTRS1bYS16XFwtMC05XSskLy50ZXN0KGZpZ21hLnJvb3QubmFtZSksIGBDb3Vyc2UgbmFtZSAnJHtmaWdtYS5yb290Lm5hbWV9JyBtdXN0IG1hdGNoIENPVVJTRS1bYS16XFxcXC0wLTldK2ApO1xuICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUgPT0gJ0lOREVYJyk7XG4gICAgaWYgKGFzc2VydCghIWluZGV4LCBcIk11c3QgaGF2ZSAnSU5ERVgnIHBhZ2VcIikpIHtcbiAgICAgICAgbGludEluZGV4KGluZGV4KTtcbiAgICB9XG4gICAgLy8gZmluZCBhbGwgbm9uLXVuaXF1ZSBuYW1lZCBwYWdlc1xuICAgIGNvbnN0IG5vblVuaXF1ZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmlsdGVyKChwLCBpLCBhKSA9PiBhLmZpbmRJbmRleCgocDIpID0+IHAyLm5hbWUgPT0gcC5uYW1lKSAhPSBpKTtcbiAgICBub25VbmlxdWUuZm9yRWFjaCgocCkgPT4gYXNzZXJ0KGZhbHNlLCBgUGFnZSBuYW1lICcke3AubmFtZX0nIG11c3QgYmUgdW5pcXVlYCwgcCkpO1xuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBsaW50UGFnZShwYWdlKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gb25MaW50Q291cnNlKCkge1xuICAgIGVycm9ycyA9IFtdO1xuICAgIGxpbnRDb3Vyc2UoKTtcbiAgICByZXR1cm4gcHJpbnRFcnJvcnMoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbkxpbnRQYWdlKGN1cnJlbnRQYWdlKSB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludFBhZ2UoY3VycmVudFBhZ2UpO1xuICAgIHJldHVybiBwcmludEVycm9ycygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVFcnJvcnMoZXJyb3JzRm9yUHJpbnQpIHtcbiAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnZXJyb3JzRm9yUHJpbnQnLCBlcnJvcnNGb3JQcmludCk7XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGNhcGl0YWxpemUsIHByaW50IH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgXCJ0YXNrLW5hbWUgJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKHBhZ2UubmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oJyAnKSl9XCI7XG5cImNvdXJzZS1kZXNjcmlwdGlvbiAke2NvdXJzZU5hbWV9XCIgPSBcIkluIHRoaXMgY291cnNlOlxuICAgIOKAoiBcbiAgICDigKIgXG4gICAg4oCiIFwiO1xuJHt0YXNrc31cbmA7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TGVzc29uKHBhZ2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcbiAgICAgICAgY29uc3QgbGVzc29uTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgZm9ybWF0OiAnU1ZHJyxcbiAgICAgICAgICAgIC8vIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsID0geWllbGQgdGh1bWJuYWlsTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxuICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291cnNlUGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXG4gICAgICAgICAgICBwYXRoOiBwYWdlLm5hbWUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IFtsZXNzb25zLCB0aHVtYm5haWxdID0geWllbGQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5tYXAoKHBhZ2UpID0+IGV4cG9ydExlc3NvbihwYWdlKSkpLFxuICAgICAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maW5kKChwYWdlKSA9PiBwYWdlLm5hbWUgPT0gJ0lOREVYJylcbiAgICAgICAgICAgICAgICAuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIGxlc3NvbnMsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVN3aWZ0Q29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWVcbiAgICAgICAgLnNwbGl0KCctJylcbiAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICBzd2lmdENvdXJzZU5hbWUgPVxuICAgICAgICBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICBsZXQgJHtzd2lmdENvdXJzZU5hbWV9ID0gQ291cnNlKFxuICAgIHBhdGg6IFwiJHtjb3Vyc2VOYW1lfVwiLFxuICAgIGF1dGhvcjogUkVQTEFDRSxcbiAgICB0YXNrczogW1xuJHt0YXNrc30gICAgXSlcbmA7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKSB7XG4gICAgY29uc3QgY29kZSA9IGdlbmVyYXRlU3dpZnRDb2RlKCkgKyBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKTtcbiAgICBwcmludChjb2RlKTtcbn1cbm9uKCdnZW5lcmF0ZUNvZGUnLCBnZW5lcmF0ZUNvZGUpO1xuIiwiaW1wb3J0IHsgZ2V0VGFncywgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3NvbiB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0UGFpbnRDb2xvcihwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGxldCB7IHIsIGcsIGIgfSA9IHBhaW50LmNvbG9yO1xuICAgICAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcbiAgICAgICAgZyA9IE1hdGgucm91bmQoZyAqIDI1NSk7XG4gICAgICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xuICAgICAgICByZXR1cm4geyByLCBnLCBiLCBhOiAxIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyByOiAxNjYsIGc6IDE2NiwgYjogMTY2LCBhOiAxIH07XG4gICAgfVxufVxuZnVuY3Rpb24gZGlzcGxheUNvbG9yKHsgciwgZywgYiwgYSB9KSB7XG4gICAgcmV0dXJuIGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sICR7YX0pYDtcbn1cbmZ1bmN0aW9uIGdldENvbG9ycyhub2RlKSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwIH07IC8vIHRyYW5zcGFyZW50ID0gZGVmYXVsdCBjb2xvclxuICAgIGxldCBmaWxscyA9IGRlZmF1bHRDb2xvcjtcbiAgICBsZXQgc3Ryb2tlcyA9IGRlZmF1bHRDb2xvcjtcbiAgICBjb25zdCBsZWFmID0gZmluZExlYWZOb2Rlcyhub2RlKVswXTtcbiAgICBpZiAoJ2ZpbGxzJyBpbiBsZWFmICYmIGxlYWYuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIGxlYWYuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBmaWxscyA9IGdldFBhaW50Q29sb3IobGVhZi5maWxsc1swXSk7XG4gICAgfVxuICAgIGlmICgnc3Ryb2tlcycgaW4gbGVhZiAmJiBsZWFmLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJva2VzID0gZ2V0UGFpbnRDb2xvcihsZWFmLnN0cm9rZXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWxsc0NvbG9yOiBkaXNwbGF5Q29sb3IoZmlsbHMpLFxuICAgICAgICBzdHJva2VzQ29sb3I6IGRpc3BsYXlDb2xvcihzdHJva2VzKSxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBzKCkge1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICByZXR1cm4gc3RlcHNCeU9yZGVyKGxlc3NvbikubWFwKChzdGVwKSA9PiB7XG4gICAgICAgIHJldHVybiB7IGlkOiBzdGVwLmlkLCBuYW1lOiBzdGVwLm5hbWUsIGNvbG9yczogZ2V0Q29sb3JzKHN0ZXApIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcE9yZGVyKHN0ZXBzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGxlc3Nvbi5maW5kT25lKChlbCkgPT4gZWwuaWQgPT0gc3RlcC5pZCk7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICBzLm5hbWUgPSBzLm5hbWUucmVwbGFjZSgvby1cXGQrLywgJ28tJyArIChpICsgMSkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBlbWl0LCBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uLCBnZXRUYWdzLCBpc1Jlc3VsdFN0ZXAgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2V0T3JkZXIoc3RlcCkge1xuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xuICAgIHJldHVybiBpc05hTihvKSA/IDk5OTkgOiBvO1xufVxuZnVuY3Rpb24gZ2V0VGFnKHN0ZXAsIHRhZykge1xuICAgIGNvbnN0IHYgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCh0YWcpKTtcbiAgICByZXR1cm4gdiA/IHYucmVwbGFjZSh0YWcsICcnKSA6ICcwJztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZWxldGVUbXAoKSB7XG4gICAgZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBlbC5uYW1lLnN0YXJ0c1dpdGgoJ3RtcC0nKSlcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG59XG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcbmxldCBsYXN0UGFnZTtcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBnZXRUYWdzKGVsKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykpXG4gICAgICAgIC5tYXAoKGVsKSA9PiBmaW5kTGVhZk5vZGVzKGVsKSlcbiAgICAgICAgLmZsYXQoKVxuICAgICAgICAuZmlsdGVyKChlbCkgPT4gL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KGVsLnR5cGUpKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWwuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSB9XTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRXZWlnaHQgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAzMCA6IDUwO1xuICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgZGVmYXVsdFdlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHBpbmsgPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgcGluay5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgcGluay5zdHJva2VXZWlnaHQgPSAyO1xuICAgICAgICAgICAgcGluay5uYW1lID0gJ3BpbmsgJyArIGVsLm5hbWU7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChwaW5rKTtcbiAgICAgICAgICAgIC8vIGNsb25lIGVsZW1lbnQgaGVyZSBhbmQgZ2l2ZSBoaW0gdGhpbiBwaW5rIHN0cm9rZVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICB0ZW1wbGF0ZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IGlucHV0LnJlbGF0aXZlVHJhbnNmb3JtO1xufVxuZnVuY3Rpb24gZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApIHtcbiAgICBjb25zdCBkZWZhdWx0QlMgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAxMi44IDogMTA7XG4gICAgY29uc3QgYnMgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSB8fCBkZWZhdWx0QlM7XG4gICAgY29uc3Qgc21hbGxMaW5lID0gZmlnbWEuY3JlYXRlTGluZSgpO1xuICAgIHNtYWxsTGluZS5uYW1lID0gJ3NtYWxsTGluZSc7XG4gICAgc21hbGxMaW5lLnJlc2l6ZSgzMDAsIDApO1xuICAgIHNtYWxsTGluZS5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMC44LCBiOiAwIH0gfV07XG4gICAgc21hbGxMaW5lLnN0cm9rZVdlaWdodCA9IGJzIC8gMztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQ2FwID0gJ1JPVU5EJztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQWxpZ24gPSAnQ0VOVEVSJztcbiAgICBzbWFsbExpbmUueSA9IHNtYWxsTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IG1lZGl1bUxpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBtZWRpdW1MaW5lLm5hbWUgPSAnbWVkaXVtTGluZSc7XG4gICAgbWVkaXVtTGluZS5vcGFjaXR5ID0gMC4yO1xuICAgIG1lZGl1bUxpbmUuc3Ryb2tlV2VpZ2h0ID0gYnM7XG4gICAgbWVkaXVtTGluZS55ID0gbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IGJpZ0xpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBiaWdMaW5lLm5hbWUgPSAnYmlnTGluZSc7XG4gICAgYmlnTGluZS5vcGFjaXR5ID0gMC4xO1xuICAgIGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgKyBNYXRoLnBvdyhicywgMS40KSAqIDAuODtcbiAgICBiaWdMaW5lLnkgPSBiaWdMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbYmlnTGluZSwgbWVkaXVtTGluZSwgc21hbGxMaW5lXSwgbGVzc29uLnBhcmVudCk7XG4gICAgZ3JvdXAubmFtZSA9ICd0bXAtYnMnO1xuICAgIGdyb3VwLnggPSBsZXNzb24ueDtcbiAgICBncm91cC55ID0gbGVzc29uLnkgLSA4MDtcbn1cbmZ1bmN0aW9uIGdldEJydXNoU2l6ZShzdGVwKSB7XG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhzdGVwKTtcbiAgICBjb25zdCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xuICAgIGNvbnN0IHN0cm9rZVdlaWdodHNBcnIgPSBzdHJva2VzLm1hcCgobm9kZSkgPT4gbm9kZVsnc3Ryb2tlV2VpZ2h0J10gfHwgMCk7XG4gICAgY29uc3QgbWF4V2VpZ2h0ID0gTWF0aC5tYXgoLi4uc3Ryb2tlV2VpZ2h0c0Fycik7XG4gICAgcmV0dXJuIHN0cm9rZXMubGVuZ3RoID4gMCA/IG1heFdlaWdodCA6IDI1O1xufVxuZnVuY3Rpb24gZ2V0Q2xlYXJMYXllck51bWJlcnMoc3RlcCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICdjbGVhci1sYXllci0nO1xuICAgIGNvbnN0IGNsZWFyTGF5ZXJzU3RlcCA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0YWcpID0+IHRhZy5zdGFydHNXaXRoKHByZWZpeCkpO1xuICAgIGlmIChjbGVhckxheWVyc1N0ZXAubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgbGF5ZXJOdW1iZXJzID0gY2xlYXJMYXllcnNTdGVwWzBdXG4gICAgICAgIC5zbGljZShwcmVmaXgubGVuZ3RoKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKE51bWJlcik7XG4gICAgcmV0dXJuIGxheWVyTnVtYmVycztcbn1cbmZ1bmN0aW9uIGdldENsZWFyQmVmb3JlU3RlcChzdGVwKSB7XG4gICAgaWYgKGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0YWcpID0+IHRhZy5pbmNsdWRlcygnY2xlYXItYmVmb3JlJykpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gc3RlcDtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwYWdlLCBzZXR0aW5ncykge1xuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBsYXN0TW9kZSA9IHNldHRpbmdzLmRpc3BsYXlNb2RlO1xuICAgIGNvbnN0IHsgZGlzcGxheU1vZGUsIHN0ZXBOdW1iZXIgfSA9IHNldHRpbmdzO1xuICAgIGNvbnNvbGUubG9nKCdwYWdlJywgcGFnZSk7XG4gICAgY29uc3QgbGVzc29uID0gcGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgaWYgKCFsZXNzb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xuICAgIHBhZ2Uuc2VsZWN0aW9uID0gW3N0ZXBdO1xuICAgIGNvbnN0IHN0ZXBDb3VudCA9IGxlc3Nvbi5jaGlsZHJlbi5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSkubGVuZ3RoO1xuICAgIGNvbnN0IG1heFN0cm9rZVdlaWdodCA9IGdldEJydXNoU2l6ZShzdGVwKTtcbiAgICBjb25zdCBjbGVhckxheWVyc1N0ZXAgPSBnZXRDbGVhckxheWVyTnVtYmVycyhzdGVwKTtcbiAgICBjb25zdCBjbGVhckJlZm9yZVN0ZXAgPSBnZXRDbGVhckJlZm9yZVN0ZXAoc3RlcCk7XG4gICAgZW1pdCgndXBkYXRlRm9ybScsIHtcbiAgICAgICAgc2hhZG93U2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSksXG4gICAgICAgIGJydXNoU2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdicy0nKSksXG4gICAgICAgIHN1Z2dlc3RlZEJydXNoU2l6ZTogaXNSZXN1bHRTdGVwKHN0ZXApID8gMCA6IG1heFN0cm9rZVdlaWdodCxcbiAgICAgICAgdGVtcGxhdGU6IGdldFRhZyhzdGVwLCAncy0nKSxcbiAgICAgICAgc3RlcENvdW50LFxuICAgICAgICBzdGVwTnVtYmVyLFxuICAgICAgICBkaXNwbGF5TW9kZSxcbiAgICB9KTtcbiAgICBkZWxldGVUbXAoKTtcbiAgICBzd2l0Y2ggKGRpc3BsYXlNb2RlKSB7XG4gICAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjdXJyZW50JzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgc3RlcHNCeU9yZGVyKGxlc3NvbikuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGkgPCBzdGVwTnVtYmVyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY2xlYXJMYXllcnNTdGVwLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjbGVhckxheWVyc1N0ZXAuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuW2xheWVyXS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjbGVhckJlZm9yZVN0ZXApIHtcbiAgICAgICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgobGF5ZXIsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIudmlzaWJsZSA9IGkgPiBsZXNzb24uY2hpbGRyZW4uaW5kZXhPZihjbGVhckJlZm9yZVN0ZXApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlUHJvcHMoc2V0dGluZ3MpIHtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3NldHRpbmdzLnN0ZXBOdW1iZXIgLSAxXTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCdzcy0nKSAmJiAhdC5zdGFydHNXaXRoKCdicy0nKSAmJiAhdC5zdGFydHNXaXRoKCdzLScpKTtcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcbiAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgYHMtJHtzZXR0aW5ncy50ZW1wbGF0ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBzcy0ke3NldHRpbmdzLnNoYWRvd1NpemV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBicy0ke3NldHRpbmdzLmJydXNoU2l6ZX1gKTtcbiAgICB9XG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG59XG5vbigndXBkYXRlRGlzcGxheScsIChzZXR0aW5ncykgPT4gdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgc2V0dGluZ3MpKTtcbm9uKCd1cGRhdGVQcm9wcycsIHVwZGF0ZVByb3BzKTtcbmV4cG9ydCBmdW5jdGlvbiBjdXJyZW50UGFnZUNoYW5nZWQocGFnZU5vZGUpIHtcbiAgICBpZiAoZmlnbWEgJiYgIWxhc3RQYWdlKSB7XG4gICAgICAgIGxhc3RQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG4gICAgfVxuICAgIHVwZGF0ZURpc3BsYXkobGFzdFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgIGxhc3RQYWdlID0gcGFnZU5vZGU7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlZCgpIHtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGlmICghc2VsZWN0aW9uIHx8XG4gICAgICAgICFsZXNzb24gfHxcbiAgICAgICAgIWxlc3Nvbi5jaGlsZHJlbi5pbmNsdWRlcyhzZWxlY3Rpb24pIHx8XG4gICAgICAgIHNlbGVjdGlvbi50eXBlICE9PSAnR1JPVVAnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy91cGRhdGUgc3RlcFxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgY29uc3Qgc3RlcE51bWJlciA9IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgKyAxO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IGxhc3RNb2RlLCBzdGVwTnVtYmVyIH0pO1xufVxuIiwiaW1wb3J0IHsgZW1pdCB9IGZyb20gJy4uL2V2ZW50cyc7XG5leHBvcnQgZnVuY3Rpb24gZmluZEFsbChub2RlLCBmKSB7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIGFyci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgIGFyciA9IGFyci5jb25jYXQoY2hpbGRyZW4uZmxhdE1hcCgocCkgPT4gZmluZEFsbChwLCBmKSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMZWFmTm9kZXMobm9kZSkge1xuICAgIGlmICghKCdjaGlsZHJlbicgaW4gbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuZmluZEFsbCgobikgPT4gISgnY2hpbGRyZW4nIGluIG4pKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGYpIHtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZUluZGV4KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5wYXJlbnQuY2hpbGRyZW4uZmluZEluZGV4KChuKSA9PiBuLmlkID09PSBub2RlLmlkKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50TGVzc29uKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PT0gJ2xlc3NvbicpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZ3Mobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5hbWUuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbik7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkVGFnKG5vZGUsIHRhZykge1xuICAgIG5vZGUubmFtZSA9IGdldFRhZ3Mobm9kZSkuY29uY2F0KFt0YWddKS5qb2luKCcgJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudEJ5VGFnKG5vZGUsIHRhZykge1xuICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUsIChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKHRhZykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzdWx0U3RlcChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgZ2V0VGFncyhub2RlKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0Jyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJpbnQodGV4dCkge1xuICAgIGZpZ21hLnVpLnJlc2l6ZSg3MDAsIDQwMCk7XG4gICAgZW1pdCgncHJpbnQnLCB0ZXh0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5Tm90aWZpY2F0aW9uKG1lc3NhZ2UpIHtcbiAgICBmaWdtYS5ub3RpZnkobWVzc2FnZSk7XG59XG5leHBvcnQgY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgY3JlYXRlUGx1Z2luQVBJLCBjcmVhdGVVSUFQSSB9IGZyb20gJ2ZpZ21hLWpzb25ycGMnO1xuaW1wb3J0IHsgZXhwb3J0VGV4dHMsIGltcG9ydFRleHRzIH0gZnJvbSAnLi9wbHVnaW4vZm9ybWF0LXJwYyc7XG5pbXBvcnQgeyBleHBvcnRMZXNzb24sIGV4cG9ydENvdXJzZSB9IGZyb20gJy4vcGx1Z2luL3B1Ymxpc2gnO1xuaW1wb3J0IHsgZ2V0U3RlcHMsIHNldFN0ZXBPcmRlciB9IGZyb20gJy4vcGx1Z2luL3R1bmUtcnBjJztcbmltcG9ydCB7IGNyZWF0ZUxlc3Nvbiwgc2VwYXJhdGVTdGVwLCBzcGxpdEJ5Q29sb3IsIGpvaW5TdGVwcywgfSBmcm9tICcuL3BsdWdpbi9jcmVhdGUnO1xuaW1wb3J0IHsgZGlzcGxheU5vdGlmaWNhdGlvbiB9IGZyb20gJy4vcGx1Z2luL3V0aWwnO1xuaW1wb3J0IHsgb25MaW50UGFnZSwgb25MaW50Q291cnNlLCBzZWxlY3RFcnJvciwgc2F2ZUVycm9ycyB9IGZyb20gJy4vcGx1Z2luL2xpbnRlcic7XG5pbXBvcnQgeyBzZWxlY3Rpb25DaGFuZ2VkLCBjdXJyZW50UGFnZUNoYW5nZWQsIHVwZGF0ZURpc3BsYXkgfSBmcm9tICcuL3BsdWdpbi90dW5lJztcbi8vIEZpZ21hIHBsdWdpbiBtZXRob2RzXG5leHBvcnQgY29uc3QgcGx1Z2luQXBpID0gY3JlYXRlUGx1Z2luQVBJKHtcbiAgICBzZXRTZXNzaW9uVG9rZW4odG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicsIHRva2VuKTtcbiAgICB9LFxuICAgIGdldFNlc3Npb25Ub2tlbigpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdzZXNzaW9uVG9rZW4nKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleHBvcnRMZXNzb24sXG4gICAgZXhwb3J0Q291cnNlLFxuICAgIGdldFN0ZXBzLFxuICAgIHNldFN0ZXBPcmRlcixcbiAgICBleHBvcnRUZXh0cyxcbiAgICBpbXBvcnRUZXh0cyxcbiAgICBkaXNwbGF5Tm90aWZpY2F0aW9uLFxuICAgIGNyZWF0ZUxlc3NvbixcbiAgICBzZXBhcmF0ZVN0ZXAsXG4gICAgc3BsaXRCeUNvbG9yLFxuICAgIGpvaW5TdGVwcyxcbiAgICBvbkxpbnRQYWdlLFxuICAgIG9uTGludENvdXJzZSxcbiAgICBzZWxlY3RFcnJvcixcbiAgICBzYXZlRXJyb3JzLFxuICAgIHNlbGVjdGlvbkNoYW5nZWQsXG4gICAgY3VycmVudFBhZ2VDaGFuZ2VkLFxuICAgIHVwZGF0ZURpc3BsYXksXG59KTtcbi8vIEZpZ21hIFVJIGFwcCBtZXRob2RzXG5leHBvcnQgY29uc3QgdWlBcGkgPSBjcmVhdGVVSUFQSSh7fSk7XG4iXSwic291cmNlUm9vdCI6IiJ9