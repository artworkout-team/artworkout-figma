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
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["print"])(text);
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
function lintFills(node, page, fills) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^rgb-template$/);
    fills.forEach((f) => {
        assert(f.visible, 'Fill must be visible', page, node);
        assert(!rgbt, 'Fill must be solid', page, node);
        let f1 = f;
        if (f.type === 'IMAGE') {
            assert(f.opacity == 1, 'Image fill must not be opaque', page, node);
        }
        if (f.type === 'SOLID') {
            assert(f1.color.r != 0 || f1.color.g != 0 || f1.color.b != 0, 'Fill color must not be black', page, node);
            assert(f1.color.r != 1 || f1.color.g != 1 || f1.color.b != 1, 'Fill color must not be white', page, node);
        }
    });
}
function lintStrokes(node, page, strokes) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^rgb-template$/);
    strokes.forEach((s) => {
        assert(s.visible, 'Stroke must be visible', page, node);
        assert(!rgbt, 'Stroke must be solid', page, node);
        if (s.type === 'IMAGE') {
            assert(s.opacity == 1, 'Image stroke must be opaque', page, node);
        }
        if (s.type === 'SOLID') {
            let s1 = s;
            assert(s1.color.r != 0 || s1.color.g != 0 || s1.color.b != 0, 'Stroke color must not be black', page, node);
            assert(s1.color.r != 1 || s1.color.g != 1 || s1.color.b != 1, 'Stroke color must not be white', page, node);
        }
    });
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)), `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR);
    assert(!strokes.length || node.strokeJoin == 'ROUND', `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
}
const validVectorTags = /^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^Vector$|^\d+$|^Ellipse$|^Rectangle$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$/;
function lintVector(page, node) {
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(validVectorTags.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node);
    });
    let fills = node.fills;
    let strokes = node.strokes;
    assert(!fills.length || !strokes.length, 'Should not have fill+stroke', page, node, ErrorLevel.WARN);
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^rgb-template$/);
    const anim = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^draw-line$|^blink$/);
    lintStrokes(node, page, strokes);
    lintFills(node, page, fills);
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
function collectLayerNumbersToClear(lesson, step) {
    const currentStepNumber = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepNumber"])(step);
    const layersStepNumbers = lesson.children.map((s) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepNumber"])(s));
    const clearLayerNumbers = lesson.children.reduce((acc, layer) => {
        if (layer.type !== 'GROUP' || Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepNumber"])(layer) > currentStepNumber) {
            return acc;
        }
        if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(layer).includes('clear-before')) {
            // calculate step numbers and convert to layers to clear
            const stepsToClear = [...Array(Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepNumber"])(layer)).keys()].slice(1);
            stepsToClear.forEach((stepNumber) => {
                if (layersStepNumbers.includes(stepNumber)) {
                    acc.add(layersStepNumbers.indexOf(stepNumber));
                }
            });
        }
        getClearLayerNumbers(layer).forEach((idx) => acc.add(idx));
        return acc;
    }, new Set());
    return clearLayerNumbers;
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
            collectLayerNumbersToClear(lesson, step).forEach((i) => {
                lesson.children[i].visible = false;
            });
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
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, findTag, addTag, findParentByTag, isResultStep, print, displayNotification, capitalize, getStepNumber */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isResultStep", function() { return isResultStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "print", function() { return print; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayNotification", function() { return displayNotification; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStepNumber", function() { return getStepNumber; });
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
function getStepNumber(step) {
    const stepOrderTag = /^o-(\d+)$/;
    const stepTag = getTags(step).find((tag) => tag.match(stepOrderTag));
    if (stepTag) {
        return Number(stepTag.match(stepOrderTag)[1]);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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QTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM5REE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDNkQ7QUFDRTtBQUNEO0FBQ0g7QUFDNEI7QUFDbkM7QUFDZ0M7QUFDQTtBQUNwRjtBQUNPLGtCQUFrQixxRUFBZTtBQUN4QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSwwRUFBWTtBQUNoQixJQUFJLDBFQUFZO0FBQ2hCLElBQUksbUVBQVE7QUFDWixJQUFJLDJFQUFZO0FBQ2hCLElBQUksMkVBQVc7QUFDZixJQUFJLDJFQUFXO0FBQ2YsSUFBSSxxRkFBbUI7QUFDdkIsSUFBSSx5RUFBWTtBQUNoQixJQUFJLHlFQUFZO0FBQ2hCLElBQUkseUVBQVk7QUFDaEIsSUFBSSxtRUFBUztBQUNiLElBQUkscUVBQVU7QUFDZCxJQUFJLHlFQUFZO0FBQ2hCLElBQUksdUVBQVc7QUFDZixJQUFJLHFFQUFVO0FBQ2QsSUFBSSwrRUFBZ0I7QUFDcEIsSUFBSSxtRkFBa0I7QUFDdEIsSUFBSSx5RUFBYTtBQUNqQixDQUFDO0FBQ0Q7QUFDTyxjQUFjLGlFQUFXLEdBQUciLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vaW5kZXgudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cy5QYXJzZUVycm9yID0gY2xhc3MgUGFyc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiUGFyc2UgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI3MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRSZXF1ZXN0ID0gY2xhc3MgSW52YWxpZFJlcXVlc3QgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgUmVxdWVzdFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuTWV0aG9kTm90Rm91bmQgPSBjbGFzcyBNZXRob2ROb3RGb3VuZCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiTWV0aG9kIG5vdCBmb3VuZFwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFBhcmFtcyA9IGNsYXNzIEludmFsaWRQYXJhbXMgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludmFsaWQgcGFyYW1zXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAyO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnRlcm5hbEVycm9yID0gY2xhc3MgSW50ZXJuYWxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW50ZXJuYWwgZXJyb3JcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDM7XG4gIH1cbn07XG4iLCJjb25zdCB7IHNldHVwLCBzZW5kUmVxdWVzdCB9ID0gcmVxdWlyZShcIi4vcnBjXCIpO1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVVSUFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVVJQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVQbHVnaW5BUEkgPSBmdW5jdGlvbiBjcmVhdGVQbHVnaW5BUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IG1ldGhvZHNbcF0oLi4ucGFyYW1zKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VuZFJlcXVlc3QocCwgcGFyYW1zLCB0aW1lb3V0KTtcbiAgICB9O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG59O1xuIiwiY29uc3QgUlBDRXJyb3IgPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5jb25zdCB7IE1ldGhvZE5vdEZvdW5kIH0gPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5cbmxldCBzZW5kUmF3O1xuXG5pZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIGZpZ21hLnVpLm9uKCdtZXNzYWdlJywgbWVzc2FnZSA9PiBoYW5kbGVSYXcobWVzc2FnZSkpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBmaWdtYS51aS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbn0gZWxzZSBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBvbm1lc3NhZ2UgPSBldmVudCA9PiBoYW5kbGVSYXcoZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogbWVzc2FnZSB9LCBcIipcIik7XG59XG5cbmxldCBycGNJbmRleCA9IDA7XG5sZXQgcGVuZGluZyA9IHt9O1xuXG5mdW5jdGlvbiBzZW5kSnNvbihyZXEpIHtcbiAgdHJ5IHtcbiAgICBzZW5kUmF3KHJlcSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kUmVzdWx0KGlkLCByZXN1bHQpIHtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgcmVzdWx0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZW5kRXJyb3IoaWQsIGVycm9yKSB7XG4gIGNvbnN0IGVycm9yT2JqZWN0ID0ge1xuICAgIGNvZGU6IGVycm9yLmNvZGUsXG4gICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSxcbiAgICBkYXRhOiBlcnJvci5kYXRhXG4gIH07XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIGVycm9yOiBlcnJvck9iamVjdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmF3KGRhdGEpIHtcbiAgdHJ5IHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaGFuZGxlUnBjKGRhdGEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgY29uc29sZS5lcnJvcihkYXRhKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVScGMoanNvbikge1xuICBpZiAodHlwZW9mIGpzb24uaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YganNvbi5yZXN1bHQgIT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgIGpzb24uZXJyb3IgfHxcbiAgICAgIHR5cGVvZiBqc29uLm1ldGhvZCA9PT0gXCJ1bmRlZmluZWRcIlxuICAgICkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBzZW5kRXJyb3IoXG4gICAgICAgICAganNvbi5pZCxcbiAgICAgICAgICBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIGNhbGxiYWNrIGZvciBcIiArIGpzb24uaWQpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjay50aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dChjYWxsYmFjay50aW1lb3V0KTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2pzb24uaWRdO1xuICAgICAgY2FsbGJhY2soanNvbi5lcnJvciwganNvbi5yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVSZXF1ZXN0KGpzb24pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVOb3RpZmljYXRpb24oanNvbik7XG4gIH1cbn1cblxubGV0IG1ldGhvZHMgPSB7fTtcblxuZnVuY3Rpb24gb25SZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XG4gIGlmICghbWV0aG9kc1ttZXRob2RdKSB7XG4gICAgdGhyb3cgbmV3IE1ldGhvZE5vdEZvdW5kKG1ldGhvZCk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXSguLi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVOb3RpZmljYXRpb24oanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBuZXcgUlBDRXJyb3IuSW52YWxpZFJlcXVlc3QoXCJNaXNzaW5nIG1ldGhvZFwiKSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmVzdWx0XG4gICAgICAgIC50aGVuKHJlcyA9PiBzZW5kUmVzdWx0KGpzb24uaWQsIHJlcykpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gc2VuZEVycm9yKGpzb24uaWQsIGVycikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZW5kUmVzdWx0KGpzb24uaWQsIHJlc3VsdCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXR1cCA9IF9tZXRob2RzID0+IHtcbiAgT2JqZWN0LmFzc2lnbihtZXRob2RzLCBfbWV0aG9kcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kTm90aWZpY2F0aW9uID0gKG1ldGhvZCwgcGFyYW1zKSA9PiB7XG4gIHNlbmRKc29uKHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IChtZXRob2QsIHBhcmFtcywgdGltZW91dCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGlkID0gcnBjSW5kZXg7XG4gICAgY29uc3QgcmVxID0geyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcywgaWQgfTtcbiAgICBycGNJbmRleCArPSAxO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnN0IGpzRXJyb3IgPSBuZXcgRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgICBqc0Vycm9yLmNvZGUgPSBlcnIuY29kZTtcbiAgICAgICAganNFcnJvci5kYXRhID0gZXJyLmRhdGE7XG4gICAgICAgIHJlamVjdChqc0Vycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgIH07XG5cbiAgICAvLyBzZXQgYSBkZWZhdWx0IHRpbWVvdXRcbiAgICBjYWxsYmFjay50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkZWxldGUgcGVuZGluZ1tpZF07XG4gICAgICByZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdCBcIiArIG1ldGhvZCArIFwiIHRpbWVkIG91dC5cIikpO1xuICAgIH0sIHRpbWVvdXQgfHwgMzAwMCk7XG5cbiAgICBwZW5kaW5nW2lkXSA9IGNhbGxiYWNrO1xuICAgIHNlbmRKc29uKHJlcSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuUlBDRXJyb3IgPSBSUENFcnJvcjtcbiIsImNvbnN0IGV2ZW50SGFuZGxlcnMgPSB7fTtcbmxldCBjdXJyZW50SWQgPSAwO1xuZXhwb3J0IGZ1bmN0aW9uIG9uKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBjb25zdCBpZCA9IGAke2N1cnJlbnRJZH1gO1xuICAgIGN1cnJlbnRJZCArPSAxO1xuICAgIGV2ZW50SGFuZGxlcnNbaWRdID0geyBoYW5kbGVyLCBuYW1lIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIGV2ZW50SGFuZGxlcnNbaWRdO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gb25jZShuYW1lLCBoYW5kbGVyKSB7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICByZXR1cm4gb24obmFtZSwgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKGRvbmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgaGFuZGxlciguLi5hcmdzKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBlbWl0ID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCdcbiAgICA/IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKFtuYW1lLCAuLi5hcmdzXSk7XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBwbHVnaW5NZXNzYWdlOiBbbmFtZSwgLi4uYXJnc10sXG4gICAgICAgIH0sICcqJyk7XG4gICAgfTtcbmZ1bmN0aW9uIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKSB7XG4gICAgZm9yIChjb25zdCBpZCBpbiBldmVudEhhbmRsZXJzKSB7XG4gICAgICAgIGlmIChldmVudEhhbmRsZXJzW2lkXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXJzW2lkXS5oYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICgoX2EgPSBwYXJhbXNbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5qc29ucnBjKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gcGFyYW1zWzBdO1xuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgfTtcbn1cbmVsc2Uge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiB2ZXJ5IGRpcnR5IGhhY2ssIG5lZWRzIGZpeGluZ1xuICAgICAgICBjb25zdCBmYWxsYmFjayA9IHdpbmRvdy5vbm1lc3NhZ2U7XG4gICAgICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgICAgICBmYWxsYmFjay5hcHBseSh3aW5kb3csIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IHBhcmFtc1swXTtcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlO1xuICAgICAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0sIDEwMCk7XG59XG4iLCJpbXBvcnQgeyBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uLCBmaW5kUGFyZW50QnlUYWcsIGdldE5vZGVJbmRleCwgZ2V0VGFncywgaXNSZXN1bHRTdGVwLCB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBmb3JtYXROb2RlKG5vZGUsIHBhcmFtZXRlcnMpIHtcbiAgICBjb25zdCB7IG5hbWUsIHgsIHksIHdpZHRoID0gNDAsIGhlaWdodCA9IDQwIH0gPSBwYXJhbWV0ZXJzO1xuICAgIG5vZGUubmFtZSA9IG5hbWU7XG4gICAgbm9kZS54ID0geDtcbiAgICBub2RlLnkgPSB5O1xuICAgIG5vZGUucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xufVxuZnVuY3Rpb24gZmlsbFNlcnZpY2VOb2Rlcyhub2RlKSB7XG4gICAgbm9kZS5maWxscyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgICAgcjogMTk2IC8gMjU1LFxuICAgICAgICAgICAgICAgIGc6IDE5NiAvIDI1NSxcbiAgICAgICAgICAgICAgICBiOiAxOTYgLyAyNTUsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIF07XG59XG5mdW5jdGlvbiByZXNjYWxlSW1hZ2VOb2RlKG5vZGUsIHJlc2l6ZVBhcmFtcykge1xuICAgIGNvbnN0IHsgbWF4V2lkdGgsIG1heEhlaWdodCB9ID0gcmVzaXplUGFyYW1zO1xuICAgIGNvbnN0IGlzQ29ycmVjdFNpemUgPSBub2RlLndpZHRoIDw9IG1heFdpZHRoICYmIG5vZGUuaGVpZ2h0IDw9IG1heEhlaWdodDtcbiAgICBjb25zdCBpc0NvcnJlY3RUeXBlID0gbm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScgfHwgbm9kZS50eXBlID09PSAnVkVDVE9SJztcbiAgICBpZiAoaXNDb3JyZWN0VHlwZSAmJiAhaXNDb3JyZWN0U2l6ZSkge1xuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IE1hdGgubWluKG1heFdpZHRoIC8gbm9kZS53aWR0aCwgbWF4SGVpZ2h0IC8gbm9kZS5oZWlnaHQpO1xuICAgICAgICBub2RlLnJlc2NhbGUoc2NhbGVGYWN0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlc3VsdE5vZGUobm9kZSkge1xuICAgIGNvbnN0IHJlc3VsdFJlY3RhbmdsZSA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgIGZpbGxTZXJ2aWNlTm9kZXMocmVzdWx0UmVjdGFuZ2xlKTtcbiAgICBjb25zdCB0ZW1wbGF0ZUdyb3VwID0gZmlnbWEuZ3JvdXAoW3Jlc3VsdFJlY3RhbmdsZV0sIG5vZGUpO1xuICAgIHRlbXBsYXRlR3JvdXAubmFtZSA9ICd0ZW1wbGF0ZSc7XG4gICAgY29uc3QgcmVzdWx0ID0gZmlnbWEuZ3JvdXAoW3RlbXBsYXRlR3JvdXBdLCBub2RlKTtcbiAgICBmb3JtYXROb2RlKHJlc3VsdCwge1xuICAgICAgICBuYW1lOiAnc3RlcCBzLW11bHRpc3RlcC1yZXN1bHQnLFxuICAgICAgICB4OiAxMCxcbiAgICAgICAgeTogNjAsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGVzc29uKCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvcmlnaW5hbEltYWdlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgIGZvcm1hdE5vZGUobGVzc29uLCB7XG4gICAgICAgIG5hbWU6ICdsZXNzb24nLFxuICAgICAgICB4OiAtNDYxLFxuICAgICAgICB5OiAtNTEyLFxuICAgICAgICB3aWR0aDogMTM2NixcbiAgICAgICAgaGVpZ2h0OiAxMDI0LFxuICAgIH0pO1xuICAgIGNvbnN0IHRodW1ibmFpbCA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgZm9ybWF0Tm9kZSh0aHVtYm5haWwsIHtcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCcsXG4gICAgICAgIHg6IC05MDEsXG4gICAgICAgIHk6IC01MTIsXG4gICAgICAgIHdpZHRoOiA0MDAsXG4gICAgICAgIGhlaWdodDogNDAwLFxuICAgIH0pO1xuICAgIC8vIENyZWF0ZSBzdGVwXG4gICAgY29uc3Qgc3RlcCA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcbiAgICBzdGVwLm5hbWUgPSAnaW1hZ2UnO1xuICAgIGNvbnN0IHJlc2l6ZWRJbWFnZSA9IHJlc2NhbGVJbWFnZU5vZGUob3JpZ2luYWxJbWFnZSwge1xuICAgICAgICBtYXhXaWR0aDogbGVzc29uLndpZHRoIC0gODMgKiAyLFxuICAgICAgICBtYXhIZWlnaHQ6IGxlc3Nvbi5oZWlnaHQgLSAxMiAqIDIsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RlcElucHV0ID0gZmlnbWEuZ3JvdXAoW3N0ZXBdLCBsZXNzb24pO1xuICAgIHN0ZXBJbnB1dC5uYW1lID0gJ2lucHV0JztcbiAgICBjb25zdCBmaXJzdFN0ZXAgPSBmaWdtYS5ncm91cChbc3RlcElucHV0XSwgbGVzc29uKTtcbiAgICBmb3JtYXROb2RlKGZpcnN0U3RlcCwge1xuICAgICAgICBuYW1lOiAnc3RlcCBzLW11bHRpc3RlcC1icnVzaCcsXG4gICAgICAgIHg6IChsZXNzb24ud2lkdGggLSByZXNpemVkSW1hZ2Uud2lkdGgpIC8gMixcbiAgICAgICAgeTogKGxlc3Nvbi5oZWlnaHQgLSByZXNpemVkSW1hZ2UuaGVpZ2h0KSAvIDIsXG4gICAgICAgIHdpZHRoOiByZXNpemVkSW1hZ2Uud2lkdGgsXG4gICAgICAgIGhlaWdodDogcmVzaXplZEltYWdlLmhlaWdodCxcbiAgICB9KTtcbiAgICAvLyBDcmVhdGUgdGh1bWJuYWlsXG4gICAgY29uc3QgdGh1bWJuYWlsSW1hZ2UgPSBvcmlnaW5hbEltYWdlLmNsb25lKCk7XG4gICAgdGh1bWJuYWlsSW1hZ2UubmFtZSA9ICdpbWFnZSc7XG4gICAgY29uc3QgcmVzaXplZFRodW1ibmFpbCA9IHJlc2NhbGVJbWFnZU5vZGUodGh1bWJuYWlsSW1hZ2UsIHtcbiAgICAgICAgbWF4V2lkdGg6IHRodW1ibmFpbC53aWR0aCAtIDM1ICogMixcbiAgICAgICAgbWF4SGVpZ2h0OiB0aHVtYm5haWwuaGVpZ2h0IC0gMzUgKiAyLFxuICAgIH0pO1xuICAgIGNvbnN0IHRodW1ibmFpbEdyb3VwID0gZmlnbWEuZ3JvdXAoW3RodW1ibmFpbEltYWdlXSwgdGh1bWJuYWlsKTtcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbEdyb3VwLCB7XG4gICAgICAgIG5hbWU6ICd0aHVtYm5haWwgZ3JvdXAnLFxuICAgICAgICB4OiAodGh1bWJuYWlsLndpZHRoIC0gcmVzaXplZFRodW1ibmFpbC53aWR0aCkgLyAyLFxuICAgICAgICB5OiAodGh1bWJuYWlsLmhlaWdodCAtIHJlc2l6ZWRUaHVtYm5haWwuaGVpZ2h0KSAvIDIsXG4gICAgICAgIHdpZHRoOiByZXNpemVkVGh1bWJuYWlsLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJlc2l6ZWRUaHVtYm5haWwuaGVpZ2h0LFxuICAgIH0pO1xuICAgIC8vIENyZWF0ZSByZXN1bHRcbiAgICBjcmVhdGVSZXN1bHROb2RlKGxlc3Nvbik7XG4gICAgLy8gQ3JlYXRlIHNldHRpbmdzXG4gICAgY29uc3Qgc2V0dGluZ3NFbGxpcHNlID0gZmlnbWEuY3JlYXRlRWxsaXBzZSgpO1xuICAgIGZpbGxTZXJ2aWNlTm9kZXMoc2V0dGluZ3NFbGxpcHNlKTtcbiAgICBmb3JtYXROb2RlKHNldHRpbmdzRWxsaXBzZSwge1xuICAgICAgICBuYW1lOiAnc2V0dGluZ3MgY2FwdHVyZS1jb2xvciB6b29tLXNjYWxlLTIgb3JkZXItbGF5ZXJzJyxcbiAgICAgICAgeDogMTAsXG4gICAgICAgIHk6IDEwLFxuICAgIH0pO1xuICAgIGxlc3Nvbi5hcHBlbmRDaGlsZChzZXR0aW5nc0VsbGlwc2UpO1xuICAgIG9yaWdpbmFsSW1hZ2UucmVtb3ZlKCk7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlDb2xvcihjb2xvcikge1xuICAgIGxldCB7IHIsIGcsIGIgfSA9IGNvbG9yO1xuICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xuICAgIGcgPSBNYXRoLnJvdW5kKGcgKiAyNTUpO1xuICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xuICAgIHJldHVybiBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYDtcbn1cbmZ1bmN0aW9uIG5hbWVMZWFmTm9kZXMobm9kZXMpIHtcbiAgICBsZXQgYWxsU3Ryb2tlcyA9ICFub2Rlcy5maW5kKChub2RlKSA9PiAnZmlsbHMnIGluIG5vZGUgJiYgbm9kZS5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbm9kZS5maWxscy5sZW5ndGggPiAwKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgIG5vZGUubmFtZSA9XG4gICAgICAgICAgICAncmdiLXRlbXBsYXRlICcgKyAoYWxsU3Ryb2tlcyAmJiBub2Rlcy5sZW5ndGggPiAzID8gJ2RyYXctbGluZScgOiAnYmxpbmsnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBuYW1lU3RlcE5vZGUoc3RlcCkge1xuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMoc3RlcCk7XG4gICAgbGV0IGZpbGxzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ2ZpbGxzJyBpbiBuICYmIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG4uZmlsbHMubGVuZ3RoID4gMCk7XG4gICAgbGV0IHN0cm9rZXMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCk7XG4gICAgbGV0IG11bHRpc3RlcFR5cGUgPSBmaWxscy5sZW5ndGggPiAwID8gJ2JnJyA6ICdicnVzaCc7XG4gICAgbGV0IHN0cm9rZVdlaWdodHNBcnIgPSBzdHJva2VzLm1hcCgobm9kZSkgPT4gbm9kZVsnc3Ryb2tlV2VpZ2h0J10gfHwgMCk7XG4gICAgbGV0IG1heFdlaWdodCA9IE1hdGgubWF4KC4uLnN0cm9rZVdlaWdodHNBcnIpO1xuICAgIGxldCB3ZWlnaHQgPSBzdHJva2VzLmxlbmd0aCA+IDAgPyBtYXhXZWlnaHQgOiAyNTtcbiAgICBzdGVwLm5hbWUgPSBgc3RlcCBzLW11bHRpc3RlcC0ke211bHRpc3RlcFR5cGV9IGJzLSR7d2VpZ2h0fWA7XG59XG5mdW5jdGlvbiBjcmVhdGVTdGVwTm9kZShub2RlLCBub2Rlc0FycmF5LCBpbmRleCkge1xuICAgIGlmICghbm9kZXNBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBuYW1lTGVhZk5vZGVzKG5vZGVzQXJyYXkpO1xuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXNBcnJheSwgbm9kZSk7XG4gICAgaW5wdXQubmFtZSA9ICdpbnB1dCc7XG4gICAgY29uc3Qgc3RlcCA9IGZpZ21hLmdyb3VwKFtpbnB1dF0sIG5vZGUsIGluZGV4KTtcbiAgICBuYW1lU3RlcE5vZGUoc3RlcCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VwYXJhdGVTdGVwKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBjb25zdCBsZWF2ZXMgPSBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiAhKCdjaGlsZHJlbicgaW4gbm9kZSkpO1xuICAgIGlmICghbGVhdmVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZpcnN0UGFyZW50U3RlcCA9IGZpbmRQYXJlbnRCeVRhZyhzZWxlY3Rpb25bMF0sICdzdGVwJyk7XG4gICAgaWYgKGlzUmVzdWx0U3RlcChmaXJzdFBhcmVudFN0ZXApKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGNvbnN0IGluZGV4ID0gZ2V0Tm9kZUluZGV4KGZpcnN0UGFyZW50U3RlcCk7XG4gICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcbn1cbmZ1bmN0aW9uIGFkZFRvTWFwKG1hcCwga2V5LCBub2RlKSB7XG4gICAgaWYgKCFtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgbWFwLnNldChrZXksIFtdKTtcbiAgICB9XG4gICAgbWFwLmdldChrZXkpLnB1c2gobm9kZSk7XG59XG5mdW5jdGlvbiByZXBsYWNlQ29sb3Iobm9kZXNCeUNvbG9yLCBvbGRDb2xvciwgbmV3Q29sb3IpIHtcbiAgICBjb25zdCBvbGRDb2xvcktleSA9IHN0cmluZ2lmeUNvbG9yKG9sZENvbG9yKTtcbiAgICBjb25zdCBuZXdDb2xvcktleSA9IHN0cmluZ2lmeUNvbG9yKG5ld0NvbG9yKTtcbiAgICBpZiAobm9kZXNCeUNvbG9yLmhhcyhvbGRDb2xvcktleSkpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlZENvbG9ycyA9IG5vZGVzQnlDb2xvci5nZXQob2xkQ29sb3JLZXkpLm1hcCgobikgPT4ge1xuICAgICAgICAgICAgaWYgKCdmaWxscycgaW4gbiAmJiBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBuLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBuLmZpbGxzID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG5ld0NvbG9yLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIG4uc3Ryb2tlcyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBuZXdDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH0pO1xuICAgICAgICBub2Rlc0J5Q29sb3Iuc2V0KG5ld0NvbG9yS2V5LCB1cGRhdGVkQ29sb3JzKTtcbiAgICAgICAgbm9kZXNCeUNvbG9yLmRlbGV0ZShvbGRDb2xvcktleSk7XG4gICAgfVxufVxuY29uc3QgYmxhY2sgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbmNvbnN0IG5lYXJCbGFjayA9IHsgcjogMjMgLyAyNTUsIGc6IDIzIC8gMjU1LCBiOiAyMyAvIDI1NSB9O1xuY29uc3Qgd2hpdGUgPSB7IHI6IDI1NSAvIDI1NSwgZzogMjU1IC8gMjU1LCBiOiAyNTUgLyAyNTUgfTtcbmNvbnN0IG5lYXJXaGl0ZSA9IHsgcjogMjM1IC8gMjU1LCBnOiAyMzUgLyAyNTUsIGI6IDIzNSAvIDI1NSB9O1xuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QnlDb2xvcigpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKCFzZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGFyZW50U3RlcCA9IGZpbmRQYXJlbnRCeVRhZyhzZWxlY3Rpb25bMF0sICdzdGVwJyk7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMocGFyZW50U3RlcCk7XG4gICAgaWYgKCFwYXJlbnRTdGVwIHx8IGlzUmVzdWx0U3RlcChwYXJlbnRTdGVwKSB8fCBsZWF2ZXMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgZmlsbHNCeUNvbG9yID0gbmV3IE1hcCgpO1xuICAgIGxldCBzdHJva2VzQnlDb2xvciA9IG5ldyBNYXAoKTtcbiAgICBsZXQgdW5rbm93bk5vZGVzID0gW107XG4gICAgZmluZExlYWZOb2RlcyhwYXJlbnRTdGVwKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmICgnZmlsbHMnIGluIG4gJiZcbiAgICAgICAgICAgIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmXG4gICAgICAgICAgICBuLmZpbGxzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIG4uZmlsbHNbMF0udHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgYWRkVG9NYXAoZmlsbHNCeUNvbG9yLCBzdHJpbmdpZnlDb2xvcihuLmZpbGxzWzBdLmNvbG9yKSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoJ3N0cm9rZXMnIGluIG4gJiZcbiAgICAgICAgICAgIG4uc3Ryb2tlcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBuLnN0cm9rZXNbMF0udHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgYWRkVG9NYXAoc3Ryb2tlc0J5Q29sb3IsIHN0cmluZ2lmeUNvbG9yKG4uc3Ryb2tlc1swXS5jb2xvciksIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdW5rbm93bk5vZGVzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBtYWtlIHN1cmUgY29sb3IgaXMgbm90IGJsYWNrIG9yIHdoaXRlXG4gICAgcmVwbGFjZUNvbG9yKGZpbGxzQnlDb2xvciwgYmxhY2ssIG5lYXJCbGFjayk7XG4gICAgcmVwbGFjZUNvbG9yKHN0cm9rZXNCeUNvbG9yLCBibGFjaywgbmVhckJsYWNrKTtcbiAgICByZXBsYWNlQ29sb3IoZmlsbHNCeUNvbG9yLCB3aGl0ZSwgbmVhcldoaXRlKTtcbiAgICByZXBsYWNlQ29sb3Ioc3Ryb2tlc0J5Q29sb3IsIHdoaXRlLCBuZWFyV2hpdGUpO1xuICAgIGZvciAobGV0IGZpbGxzIG9mIGZpbGxzQnlDb2xvci52YWx1ZXMoKSkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGZpbGxzKTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3Ryb2tlcyBvZiBzdHJva2VzQnlDb2xvci52YWx1ZXMoKSkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHN0cm9rZXMpO1xuICAgIH1cbiAgICBpZiAodW5rbm93bk5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCB1bmtub3duTm9kZXMpO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgdGhlIHJlc3VsdCBpcyBsb2NhdGVkIGF0IHRoZSBlbmRcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uY2hpbGRyZW4uZmluZCgobikgPT4gbi5uYW1lID09PSAnc3RlcCBzLW11bHRpc3RlcC1yZXN1bHQnKTtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5yZW1vdmUoKTtcbiAgICB9XG4gICAgY3JlYXRlUmVzdWx0Tm9kZShsZXNzb24pO1xuICAgIC8vIFJlbW92ZSBvcmlnaW5hbCBub2RlIGlmIHRoZXJlIGFyZSByZW1haW5zXG4gICAgaWYgKCFwYXJlbnRTdGVwLnJlbW92ZWQpIHtcbiAgICAgICAgcGFyZW50U3RlcC5yZW1vdmUoKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gam9pblN0ZXBzKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBjb25zdCBhbGxTdGVwcyA9IHNlbGVjdGlvbi5ldmVyeSgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKTtcbiAgICBjb25zdCBzdGVwcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG4pID0+ICFpc1Jlc3VsdFN0ZXAobikpO1xuICAgIGlmICghYWxsU3RlcHMgfHwgc3RlcHMubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0Tm9kZXMgPSBzdGVwc1xuICAgICAgICAubWFwKChzdGVwKSA9PiBzdGVwLmNoaWxkcmVuLmZpbHRlcigobikgPT4gbi5uYW1lID09PSAnaW5wdXQnICYmIG4udHlwZSA9PT0gJ0dST1VQJykpXG4gICAgICAgIC5mbGF0KCk7XG4gICAgY29uc3QgbGVhdmVzID0gaW5wdXROb2Rlcy5tYXAoKG4pID0+IG4uY2hpbGRyZW4pLmZsYXQoKTtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoc3RlcHNbMF0pO1xuICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgbGVhdmVzLCBpbmRleCk7XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGRpc3BsYXlOb3RpZmljYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZmluZFRleHRzKHRleHRzKSB7XG4gICAgcmV0dXJuIHRleHRzXG4gICAgICAgIC5maW5kQWxsKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJylcbiAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZS52aXNpYmxlKTtcbn1cbmZ1bmN0aW9uIGdldFN0eWxlZFNlZ21lbnRzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoW1xuICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAnZm9udE5hbWUnLFxuICAgICAgICAnZm9udFdlaWdodCcsXG4gICAgICAgICd0ZXh0RGVjb3JhdGlvbicsXG4gICAgICAgICd0ZXh0Q2FzZScsXG4gICAgICAgICdsaW5lSGVpZ2h0JyxcbiAgICAgICAgJ2xldHRlclNwYWNpbmcnLFxuICAgICAgICAnZmlsbHMnLFxuICAgICAgICAndGV4dFN0eWxlSWQnLFxuICAgICAgICAnZmlsbFN0eWxlSWQnLFxuICAgICAgICAnbGlzdE9wdGlvbnMnLFxuICAgICAgICAnaW5kZW50YXRpb24nLFxuICAgICAgICAnaHlwZXJsaW5rJyxcbiAgICBdKTtcbn1cbmZ1bmN0aW9uIGVzY2FwZShzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcbiAgICAgICAgLnJlcGxhY2UoL1xcfC9nLCAnXFxcXGwnKVxuICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpO1xufVxuY29uc3QgcmVwbGFjZW1lbnRzID0geyAnXFxcXFxcXFwnOiAnXFxcXCcsICdcXFxcbic6ICdcXG4nLCAnXFxcXFwiJzogJ1wiJywgJ1xcXFxsJzogJ3wnIH07XG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgICBpZiAoc3RyLm1hdGNoKC9cXHwvKSB8fCBzdHIubWF0Y2goLyg/PCFcXFxcKVwiLykpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXChcXFxcfG58XCJ8bCkvZywgZnVuY3Rpb24gKHJlcGxhY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1tyZXBsYWNlXTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEZvcm1hdHRlZFRleHQobm9kZSkge1xuICAgIHJldHVybiBnZXRTdHlsZWRTZWdtZW50cyhub2RlKVxuICAgICAgICAubWFwKChzKSA9PiBlc2NhcGUocy5jaGFyYWN0ZXJzKSlcbiAgICAgICAgLmpvaW4oJ3wnKVxuICAgICAgICAudHJpbUVuZCgpO1xufVxuZnVuY3Rpb24gaW1wb3J0U3R5bGVkU2VnbWVudHMoc2VnbWVudFRleHRzLCBub2RlKSB7XG4gICAgLy8gdXBkYXRlIHNlZ21lbnRzIGluIHJldmVyc2Ugb3JkZXJcbiAgICBmb3IgKGxldCBpID0gc2VnbWVudFRleHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnRUZXh0ID0gc2VnbWVudFRleHRzW2ldO1xuICAgICAgICBsZXQgc3R5bGVzID0gZ2V0U3R5bGVkU2VnbWVudHMobm9kZSk7XG4gICAgICAgIGlmIChzZWdtZW50VGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBub2RlLmluc2VydENoYXJhY3RlcnMoc3R5bGVzW2ldLmVuZCwgc2VnbWVudFRleHQsICdCRUZPUkUnKTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLmRlbGV0ZUNoYXJhY3RlcnMoc3R5bGVzW2ldLnN0YXJ0LCBzdHlsZXNbaV0uZW5kKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0VGV4dHMoKSB7XG4gICAgY29uc3QgdGV4dHMgPSBmaW5kVGV4dHMoZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIHJldHVybiAodGV4dHNcbiAgICAgICAgLm1hcCgobm9kZSkgPT4gZ2V0Rm9ybWF0dGVkVGV4dChub2RlKSlcbiAgICAgICAgLmZpbHRlcigoc3RyKSA9PiBzdHIubGVuZ3RoID4gMClcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcbiAgICAgICAgLmZpbHRlcigodiwgaSwgYSkgPT4gYS5pbmRleE9mKHYpID09PSBpKSk7XG59XG5mdW5jdGlvbiBsb2FkRm9udHModGV4dHMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBhbGxGb250cyA9IFtdO1xuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgIGdldFN0eWxlZFNlZ21lbnRzKHR4dCkubWFwKChzKSA9PiB7XG4gICAgICAgICAgICAgICAgYWxsRm9udHMucHVzaChzLmZvbnROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdW5pcXVlRm9udHMgPSBhbGxGb250cy5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT4gaW5kZXggPT09XG4gICAgICAgICAgICBzZWxmLmZpbmRJbmRleCgodCkgPT4gdC5mYW1pbHkgPT09IHZhbHVlLmZhbWlseSAmJiB0LnN0eWxlID09PSB2YWx1ZS5zdHlsZSkpO1xuICAgICAgICBmb3IgKGxldCBmb250IG9mIHVuaXF1ZUZvbnRzKSB7XG4gICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGZvbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0VGV4dHModHJhbnNsYXRpb25zKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBkaXNwbGF5Tm90aWZpY2F0aW9uKCdFbXB0eSBpbnB1dCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRleHRzID0gZmluZFRleHRzKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgeWllbGQgbG9hZEZvbnRzKHRleHRzKTtcbiAgICAgICAgdGV4dHMuZm9yRWFjaCgodHh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRUZXh0ID0gZ2V0Rm9ybWF0dGVkVGV4dCh0eHQpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbZm9ybWF0dGVkVGV4dF07XG4gICAgICAgICAgICBpZiAodHJhbnNsYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG4gICAgICAgICAgICBjb25zdCBvbGRTZWdtZW50cyA9IGZvcm1hdHRlZFRleHQuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NlZ21lbnRzID0gdHJhbnNsYXRpb24uc3BsaXQoJ3wnKS5tYXAoKHN0cikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHVuZXNjYXBlKHN0cik7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgRmFpbGVkIHRvIHVuZXNjYXBlOiAke3N0cn1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IGRlbGV0ZSBhbGwgdGV4dFxuICAgICAgICAgICAgaWYgKG5ld1NlZ21lbnRzLmxlbmd0aCA9PT0gMSAmJiBuZXdTZWdtZW50c1swXSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB0eHQuY2hhcmFjdGVycyA9ICcnO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBzZWdtZW50cyBsZW5ndGggbWlzbWF0Y2hcbiAgICAgICAgICAgIGlmIChuZXdTZWdtZW50cy5sZW5ndGggIT09IG9sZFNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBXcm9uZyBzZWdtZW50IGNvdW50ICgke25ld1NlZ21lbnRzLmxlbmd0aH0g4omgICR7b2xkU2VnbWVudHMubGVuZ3RofSk6ICR7Zm9ybWF0dGVkVGV4dH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlOb3RpZmljYXRpb24oZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGltcG9ydFN0eWxlZFNlZ21lbnRzKG5ld1NlZ21lbnRzLCB0eHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGFkZFRhZywgZmluZEFsbCwgZ2V0Q3VycmVudExlc3NvbiwgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBmb3JtYXRPcmRlcihsZXNzb24pIHtcbiAgICBpZiAobGVzc29uLmZpbmRDaGlsZCgobikgPT4gISFnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eby0vLnRlc3QodCkpKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRm91bmQgby10YWcuIGZvcm1hdE9yZGVyIGFib3J0LicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBzZXR0aW5ncyA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3NldHRpbmdzJykpO1xuICAgIGFkZFRhZyhzZXR0aW5ncywgJ29yZGVyLWxheWVycycpO1xuICAgIGNvbnN0IGxheWVyUmVnZXggPSAvXihzLW11bHRpc3RlcC1icnVzaC18cy1tdWx0aXN0ZXAtYmctKShcXGQrKSQvO1xuICAgIGNvbnN0IHN0ZXBzID0gbGVzc29uLmZpbmRDaGlsZHJlbigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpICYmICFnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xuICAgIGFkZFRhZyhyZXN1bHQsIGBvLSR7c3RlcHMubGVuZ3RoICsgMX1gKTtcbiAgICBzdGVwcy5yZXZlcnNlKCkuZm9yRWFjaCgoc3RlcCwgb3JkZXIpID0+IHtcbiAgICAgICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgICAgICBjb25zdCBsYXllclRhZyA9IHRhZ3MuZmluZCgodCkgPT4gbGF5ZXJSZWdleC50ZXN0KHQpKTtcbiAgICAgICAgbGV0IGxheWVyID0gNDtcbiAgICAgICAgaWYgKGxheWVyVGFnKSB7XG4gICAgICAgICAgICBsYXllciA9IHBhcnNlSW50KGxheWVyUmVnZXguZXhlYyhsYXllclRhZylbMl0pO1xuICAgICAgICAgICAgdGFncyA9IHRhZ3MuZmlsdGVyKCh0KSA9PiAhbGF5ZXJSZWdleC50ZXN0KHQpKTtcbiAgICAgICAgICAgIHRhZ3Muc3BsaWNlKDEsIDAsIC9eKHMtbXVsdGlzdGVwLWJydXNofHMtbXVsdGlzdGVwLWJnKS8uZXhlYyhsYXllclRhZylbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHN0ZXAuc2V0UGx1Z2luRGF0YSgnbGF5ZXInLCBKU09OLnN0cmluZ2lmeShsYXllcikpO1xuICAgICAgICB0YWdzLnB1c2goYG8tJHtvcmRlciArIDF9YCk7XG4gICAgICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbignICcpO1xuICAgIH0pO1xuICAgIGxldCBzb3J0ZWRTdGVwcyA9IHN0ZXBzLnNvcnQoKGEsIGIpID0+IEpTT04ucGFyc2UoYi5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSAtXG4gICAgICAgIEpTT04ucGFyc2UoYS5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSk7XG4gICAgc29ydGVkU3RlcHMuZm9yRWFjaCgocykgPT4gbGVzc29uLmluc2VydENoaWxkKDEsIHMpKTtcbn1cbmZ1bmN0aW9uIGF1dG9Gb3JtYXQoKSB7XG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnVEhVTUJOQUlMUycpO1xuICAgIGlmICh0aHVtYlBhZ2UpIHtcbiAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHRodW1iUGFnZS5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgICAgIGlmIChwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJykgfHwgIXRodW1ibmFpbEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSB0aHVtYm5haWxGcmFtZS5jbG9uZSgpO1xuICAgICAgICAgICAgY2xvbmUucmVzaXplKDQwMCwgNDAwKTtcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSAndGh1bWJuYWlsJztcbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIGNvbnN0IG9sZExlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgaWYgKG9sZExlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICBvbGRMZXNzb25GcmFtZS5uYW1lID0gJ2xlc3Nvbic7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJyk7XG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBpZiAoIXRodW1ibmFpbEZyYW1lIHx8ICFsZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnggPSBsZXNzb25GcmFtZS54IC0gNDQwO1xuICAgICAgICB0aHVtYm5haWxGcmFtZS55ID0gbGVzc29uRnJhbWUueTtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnNldHRpbmdzLy50ZXN0KG5vZGUubmFtZSkpLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDEwO1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec3RlcCBzLW11bHRpc3RlcC1yZXN1bHQvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLmNoaWxkcmVuWzBdLm5hbWUgPSAndGVtcGxhdGUnO1xuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSAnL2lnbm9yZSc7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSA2MDtcbiAgICB9KTtcbn1cbm9uKCdhdXRvRm9ybWF0JywgYXV0b0Zvcm1hdCk7XG5vbignZm9ybWF0T3JkZXInLCAoKSA9PiBmb3JtYXRPcmRlcihnZXRDdXJyZW50TGVzc29uKCkpKTtcbiIsImltcG9ydCAnLi9jcmVhdGUnO1xuaW1wb3J0ICcuL3R1bmUnO1xuaW1wb3J0ICcuL2Zvcm1hdCc7XG5pbXBvcnQgJy4vbGludGVyJztcbmltcG9ydCAnLi9wdWJsaXNoJztcbmltcG9ydCAnLi4vcnBjLWFwaSc7XG5pbXBvcnQgeyBwbHVnaW5BcGkgfSBmcm9tICcuLi9ycGMtYXBpJztcbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG5maWdtYS51aS5yZXNpemUoMzQwLCA0NTApO1xuY29uc29sZS5jbGVhcigpO1xuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsICgpID0+IHtcbiAgICBwbHVnaW5BcGkuc2VsZWN0aW9uQ2hhbmdlZCgpO1xufSk7XG5maWdtYS5vbignY3VycmVudHBhZ2VjaGFuZ2UnLCAoKSA9PiB7XG4gICAgcGx1Z2luQXBpLmN1cnJlbnRQYWdlQ2hhbmdlZChmaWdtYS5jdXJyZW50UGFnZSk7XG59KTtcbnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHBsdWdpbkFwaS51cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbn0sIDE1MDApO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBwcmludCwgZ2V0VGFncywgZmluZEFsbCwgZmluZFRhZyB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB1cGRhdGVEaXNwbGF5IH0gZnJvbSAnLi90dW5lJztcbmxldCBlcnJvcnMgPSBbXTtcbmxldCB6b29tU2NhbGUgPSAxO1xubGV0IG1heEJzID0gMTIuODtcbmxldCBvcmRlciA9ICdzdGVwcyc7XG5leHBvcnQgdmFyIEVycm9yTGV2ZWw7XG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJFUlJPUlwiXSA9IDBdID0gXCJFUlJPUlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xufSkoRXJyb3JMZXZlbCB8fCAoRXJyb3JMZXZlbCA9IHt9KSk7XG5leHBvcnQgdmFyIEVycm9yQ29sb3I7XG4oZnVuY3Rpb24gKEVycm9yQ29sb3IpIHtcbiAgICBFcnJvckNvbG9yW0Vycm9yQ29sb3JbXCIjZmYwMDAwXCJdID0gMF0gPSBcIiNmZjAwMDBcIjtcbiAgICBFcnJvckNvbG9yW0Vycm9yQ29sb3JbXCIjZmY5OTAwXCJdID0gMV0gPSBcIiNmZjk5MDBcIjtcbiAgICBFcnJvckNvbG9yW0Vycm9yQ29sb3JbXCIjMDBmZjAwXCJdID0gMl0gPSBcIiMwMGZmMDBcIjtcbn0pKEVycm9yQ29sb3IgfHwgKEVycm9yQ29sb3IgPSB7fSkpO1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEVycm9yKGluZGV4KSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAoKF9hID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhZ2UpIHtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBlcnJvcnNbaW5kZXhdLnBhZ2U7XG4gICAgfVxuICAgIC8vIHNldFRpbWVvdXQoKCkgPT4geyAvLyBjcmFzaGVzLCBwcm9iYWJseSBiZWNhdXNlIG9mIHNlbGVjdGlvbiBoYXBwZW5pbmcgZnJvbSB0aGUgRGlzcGxheUZvcm1cbiAgICBpZiAoKF9iID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5vZGUpIHtcbiAgICAgICAgZXJyb3JzW2luZGV4XS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbaW5kZXhdLm5vZGVdO1xuICAgIH1cbiAgICAvLyB9LCAwKVxufVxuZXhwb3J0IGZ1bmN0aW9uIHByaW50RXJyb3JzKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGZpZ21hLnVpLnJlc2l6ZSg3NTAsIDQwMCk7XG4gICAgICAgIGNvbnN0IHNhdmVkRXJyb3JzID0geWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnZXJyb3JzRm9yUHJpbnQnKTtcbiAgICAgICAgbGV0IHNvcnRlZEVycm9ycyA9IGVycm9ycy5zb3J0KChhLCBiKSA9PiBhLmxldmVsIC0gYi5sZXZlbClcbiAgICAgICAgICAgIC5tYXAoKGUpID0+IHtcbiAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZ25vcmU6IGUuaWdub3JlLFxuICAgICAgICAgICAgICAgIHBhZ2VOYW1lOiAoX2EgPSBlLnBhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lLFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAoX2IgPSBlLm5vZGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5uYW1lLFxuICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAoX2MgPSBlLm5vZGUpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy50eXBlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlLmVycm9yLFxuICAgICAgICAgICAgICAgIGxldmVsOiBlLmxldmVsLFxuICAgICAgICAgICAgICAgIGVycm9yQ29sb3I6IGUubGV2ZWwsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNhdmVkRXJyb3JzKSB7XG4gICAgICAgICAgICBzb3J0ZWRFcnJvcnMgPSBzb3J0ZWRFcnJvcnMubWFwKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWRFcnJvciA9IHNhdmVkRXJyb3JzLmZpbmQoKHMpID0+IHMucGFnZU5hbWUgPT09IGUucGFnZU5hbWUgJiYgcy5ub2RlTmFtZSA9PT0gZS5ub2RlTmFtZSAmJiBzLmVycm9yID09PSBlLmVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWRFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlLmlnbm9yZSA9IHNhdmVkRXJyb3IuaWdub3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0ZXh0ID0gZXJyb3JzXG4gICAgICAgICAgICAubWFwKChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIHJldHVybiBgJHtFcnJvckxldmVsW2UubGV2ZWxdfVxcdHwgJHtlLmVycm9yfSB8IFBBR0U6JHsoKF9hID0gZS5wYWdlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkgfHwgJyd9ICR7KF9iID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudHlwZX06JHsoKF9jID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MubmFtZSkgfHwgJyd9YDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICAgICAgdGV4dCArPSAnXFxuRG9uZSc7XG4gICAgICAgIHByaW50KHRleHQpO1xuICAgICAgICBzZWxlY3RFcnJvcigwKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhYmxlRXJyb3JzOiBzb3J0ZWRFcnJvcnMsXG4gICAgICAgICAgICB0ZXh0RXJyb3JzOiB0ZXh0LFxuICAgICAgICB9O1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGlmICghdmFsKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZnVuY3Rpb24gZGVlcE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVlcE5vZGVzKG4pKTtcbn1cbmZ1bmN0aW9uIGRlc2NlbmRhbnRzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIFtub2RlLCAuLi5ub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlc2NlbmRhbnRzKG4pKV07XG59XG5mdW5jdGlvbiBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZXNjZW5kYW50cyhuKSk7XG59XG5mdW5jdGlvbiBsaW50RmlsbHMobm9kZSwgcGFnZSwgZmlsbHMpIHtcbiAgICBjb25zdCByZ2J0ID0gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKTtcbiAgICBmaWxscy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgIGFzc2VydChmLnZpc2libGUsICdGaWxsIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoIXJnYnQsICdGaWxsIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgbGV0IGYxID0gZjtcbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgYXNzZXJ0KGYub3BhY2l0eSA9PSAxLCAnSW1hZ2UgZmlsbCBtdXN0IG5vdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZi50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAwIHx8IGYxLmNvbG9yLmcgIT0gMCB8fCBmMS5jb2xvci5iICE9IDAsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIGJsYWNrJywgcGFnZSwgbm9kZSk7XG4gICAgICAgICAgICBhc3NlcnQoZjEuY29sb3IuciAhPSAxIHx8IGYxLmNvbG9yLmcgIT0gMSB8fCBmMS5jb2xvci5iICE9IDEsICdGaWxsIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGxpbnRTdHJva2VzKG5vZGUsIHBhZ2UsIHN0cm9rZXMpIHtcbiAgICBjb25zdCByZ2J0ID0gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKTtcbiAgICBzdHJva2VzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgYXNzZXJ0KHMudmlzaWJsZSwgJ1N0cm9rZSBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KCFyZ2J0LCAnU3Ryb2tlIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgYXNzZXJ0KHMub3BhY2l0eSA9PSAxLCAnSW1hZ2Ugc3Ryb2tlIG11c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgbGV0IHMxID0gcztcbiAgICAgICAgICAgIGFzc2VydChzMS5jb2xvci5yICE9IDAgfHwgczEuY29sb3IuZyAhPSAwIHx8IHMxLmNvbG9yLmIgIT0gMCwgJ1N0cm9rZSBjb2xvciBtdXN0IG5vdCBiZSBibGFjaycsIHBhZ2UsIG5vZGUpO1xuICAgICAgICAgICAgYXNzZXJ0KHMxLmNvbG9yLnIgIT0gMSB8fCBzMS5jb2xvci5nICE9IDEgfHwgczEuY29sb3IuYiAhPSAxLCAnU3Ryb2tlIGNvbG9yIG11c3Qgbm90IGJlIHdoaXRlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IC9ST1VORHxOT05FLy50ZXN0KFN0cmluZyhub2RlLnN0cm9rZUNhcCkpLCBgU3Ryb2tlIGNhcHMgbXVzdCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gJ1JPVU5EJywgYFN0cm9rZSBqb2lucyBzaG91bGQgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUpvaW4pfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xufVxuY29uc3QgdmFsaWRWZWN0b3JUYWdzID0gL15cXC98XmRyYXctbGluZSR8XmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyR8XmZsaXAkfF5WZWN0b3IkfF5cXGQrJHxeRWxsaXBzZSR8XlJlY3RhbmdsZSR8XmZseS1mcm9tLWJvdHRvbSR8XmZseS1mcm9tLWxlZnQkfF5mbHktZnJvbS1yaWdodCR8XmFwcGVhciR8XndpZ2dsZS1cXGQrJC87XG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCh2YWxpZFZlY3RvclRhZ3MudGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XG4gICAgbGV0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXM7XG4gICAgYXNzZXJ0KCFmaWxscy5sZW5ndGggfHwgIXN0cm9rZXMubGVuZ3RoLCAnU2hvdWxkIG5vdCBoYXZlIGZpbGwrc3Ryb2tlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBjb25zdCByZ2J0ID0gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKTtcbiAgICBjb25zdCBhbmltID0gZmluZFRhZyhub2RlLCAvXmRyYXctbGluZSR8XmJsaW5rJC8pO1xuICAgIGxpbnRTdHJva2VzKG5vZGUsIHBhZ2UsIHN0cm9rZXMpO1xuICAgIGxpbnRGaWxscyhub2RlLCBwYWdlLCBmaWxscyk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJyBvciAnZHJhdy1saW5lJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydCghL0JPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KG5vZGUudHlwZSksICdOb3RpY2UgQk9PTEVBTl9PUEVSQVRJT04nLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eXFwvfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaydcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxufVxuZnVuY3Rpb24gbGludElucHV0KHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5uYW1lID09ICdpbnB1dCcsIFwiTXVzdCBiZSAnaW5wdXQnXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGRlc2NlbmRhbnRzV2l0aG91dFNlbGYobm9kZSkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gbGludFNldHRpbmdzKHBhZ2UsIG5vZGUpIHtcbiAgICB2YXIgX2E7XG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSAnRUxMSVBTRScsIFwiTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdcIiwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9ec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xuICAgICAgICBvcmRlciA9ICdsYXllcnMnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3JkZXIgPSAnc3RlcHMnO1xuICAgIH1cbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnem9vbS1zY2FsZS0nLCAnJykpIHx8XG4gICAgICAgICcxJyk7XG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGlmICghYXNzZXJ0KHN0ZXAudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBzdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChzdGVwLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xec3RlcCR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XmNsZWFyLWxheWVyLShcXGQrLD8pKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAvLyBhc3NlcnQoIS9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1iZyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyBpcyBvYnNvbGV0ZWAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgfSk7XG4gICAgY29uc3QgYmcgPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYmckfF5zLW11bHRpc3RlcC1iZy1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3QgYnJ1c2ggPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3Qgc3MgPSBwYXJzZUludCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9ec3MtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnc3MtJywgJycpKTtcbiAgICBjb25zdCBvID0gdGFncy5maW5kKChzKSA9PiAvXm8tXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoKF9iID0gdGFncy5maW5kKChzKSA9PiAvXmJzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoJ2JzLScsICcnKSk7XG4gICAgY29uc3QgYnJ1c2hOYW1lID0gKF9jID0gdGFnc1xuICAgICAgICAuZmluZCgocykgPT4gL15icnVzaC1uYW1lLVxcdyskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnJlcGxhY2UoJ2JydXNoLW5hbWUtJywgJycpO1xuICAgIGNvbnN0IHRlcm1pbmFsTm9kZXMgPSBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKHN0ZXApLmZpbHRlcigodikgPT4gdlsnY2hpbGRyZW4nXSA9PSB1bmRlZmluZWQpO1xuICAgIGNvbnN0IG1heFNpemUgPSB0ZXJtaW5hbE5vZGVzLnJlZHVjZSgoYWNjLCB2KSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHYud2lkdGgsIHYuaGVpZ2h0KTtcbiAgICB9LCAwKTtcbiAgICBtYXhCcyA9IE1hdGgubWF4KGJzID8gYnMgOiBtYXhCcywgbWF4QnMpO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMjAgfHwgbWF4U2l6ZSA8PSAxMDAsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIGxvbmcgbGluZXMuIENvbnNpZGVyIHVzaW5nIGJnIHRlbXBsYXRlLiAke21heFNpemV9PjEwMGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCB0ZXJtaW5hbE5vZGVzLmxlbmd0aCA8PSA4LCBgU2hvdWxkIG5vdCB1c2Ugc3M8MjAgd2l0aCB0b28gbWFueSBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7dGVybWluYWxOb2Rlcy5sZW5ndGh9PjhgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gMTAgfHwgYnJ1c2hOYW1lID09ICdwZW5jaWwnLCBgU2hvdWxkIG5vdCB1c2UgYnM8MTAuICR7YnN9PDEwYCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDE1LCAnc3MgbXVzdCBiZSA+PSAxNScsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghc3MgfHwgIWJzIHx8IHNzID4gYnMsICdzcyBtdXN0IGJlID4gYnMnLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzIDw9IHpvb21TY2FsZSAqIDEyLjgsIGBicyBtdXN0IGJlIDw9ICR7em9vbVNjYWxlICogMTIuOH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gem9vbVNjYWxlICogMC40NCwgYGJzIG11c3QgYmUgPj0gJHt6b29tU2NhbGUgKiAwLjQ0fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFvIHx8IG9yZGVyID09ICdsYXllcnMnLCBgJHtvfSBtdXN0IGJlIHVzZWQgb25seSB3aXRoIHNldHRpbmdzIG9yZGVyLWxheWVyc2AsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydChvcmRlciAhPT0gJ2xheWVycycgfHwgISFvLCAnTXVzdCBoYXZlIG8tTiBvcmRlciBudW1iZXInLCBwYWdlLCBzdGVwKTtcbiAgICBjb25zdCBzZiA9IHN0ZXAuZmluZE9uZSgobikgPT4geyB2YXIgX2E7IHJldHVybiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSAmJiAoKF9hID0gbi5zdHJva2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA+IDA7IH0pO1xuICAgIGNvbnN0IGZmcyA9IHN0ZXAuZmluZEFsbCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykgJiYgbi5maWxscyAmJiBuLmZpbGxzWzBdKTtcbiAgICBjb25zdCBiaWdGZnMgPSBmZnMuZmlsdGVyKChuKSA9PiBuLndpZHRoID4gMjcgfHwgbi5oZWlnaHQgPiAyNyk7XG4gICAgY29uc3QgZmYgPSBmZnMubGVuZ3RoID4gMDtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiBzZiksICdTaG91bGQgbm90IHVzZSBiZytzcyAoc3Ryb2tlIHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiAhc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBub3QgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLldBUk4pO1xuICAgIGFzc2VydCghYmcgfHwgZmYsIFwiYmcgc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRob3V0IGZpbGxlZC1pbiB2ZWN0b3JzXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFicnVzaCB8fCBiaWdGZnMubGVuZ3RoID09IDAsIFwiYnJ1c2ggc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRoIGZpbGxlZC1pbiB2ZWN0b3JzIChzaXplID4gMjcpXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgc3RlcC5jaGlsZHJlbi5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmIChuLm5hbWUgPT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgbGludElucHV0KHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG4ubmFtZSA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICAgICAgLy8gbGludCB0ZW1wbGF0ZVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ2lucHV0JyBvciAndGVtcGxhdGUnXCIsIHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgYmxpbmtOb2RlcyA9IGZpbmRBbGwoc3RlcCwgKG4pID0+IGdldFRhZ3MobikuZmluZCgodCkgPT4gL15ibGluayQvLnRlc3QodCkpICE9PSB1bmRlZmluZWQpLmZsYXRNYXAoZGVlcE5vZGVzKTtcbiAgICBjb25zdCBmaWxsZWROb2RlID0gYmxpbmtOb2Rlcy5maW5kKChuKSA9PiBuLmZpbGxzWzBdKTtcbiAgICBhc3NlcnQoYmxpbmtOb2Rlcy5sZW5ndGggPT0gMCB8fCAhIWZpbGxlZE5vZGUgfHwgYmxpbmtOb2Rlcy5sZW5ndGggPiAzLCAnU2hvdWxkIHVzZSBkcmF3LWxpbmUgaWYgPCA0IGxpbmVzJywgcGFnZSwgYmxpbmtOb2Rlc1swXSwgRXJyb3JMZXZlbC5JTkZPKTtcbn1cbmZ1bmN0aW9uIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnRlJBTUUnLCBcIk11c3QgYmUgJ0ZSQU1FJyB0eXBlXCIsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gMTM2NiAmJiBub2RlLmhlaWdodCA9PSAxMDI0LCAnTXVzdCBiZSAxMzY2eDEwMjQnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoISFub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKSwgXCJNdXN0IGhhdmUgJ3MtbXVsdGlzdGVwLXJlc3VsdCcgY2hpbGRcIiwgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHNldHRpbmdzID0gbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSk7XG4gICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgIGxpbnRTZXR0aW5ncyhwYWdlLCBzZXR0aW5ncyk7XG4gICAgfVxuICAgIGxldCBvcmRlck51bWJlcnMgPSB7fTtcbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IC9eby0oXFxkKykkLy5leGVjKHRhZyk7XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbyA9IGZvdW5kWzFdO1xuICAgICAgICAgICAgYXNzZXJ0KCFvcmRlck51bWJlcnNbb10sIGBNdXN0IGhhdmUgdW5pcXVlICR7dGFnfSB2YWx1ZXNgLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJOdW1iZXJzW29dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAoc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3N0ZXAnKSkge1xuICAgICAgICAgICAgbGludFN0ZXAocGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXN0ZXAubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnc2V0dGluZ3MnIG9yICdzdGVwJ1wiLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBhc3NlcnQoXG4gICAgLy8gICBtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsXG4gICAgLy8gICBgem9vbS1zY2FsZSAke3pvb21TY2FsZX0gbXVzdCBiZSAke01hdGguY2VpbChcbiAgICAvLyAgICAgbWF4QnMgLyAxMi44XG4gICAgLy8gICApfSBmb3IgbWF4IGJzICR7bWF4QnN9IHVzZWRgLFxuICAgIC8vICAgcGFnZSxcbiAgICAvLyAgIG5vZGVcbiAgICAvLyApXG59XG5mdW5jdGlvbiBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gNDAwICYmIG5vZGUuaGVpZ2h0ID09IDQwMCwgJ011c3QgYmUgNDAweDQwMCcsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludFBhZ2UoY3VycmVudFBhZ2UpIHtcbiAgICBjb25zdCBwYWdlID0gY3VycmVudFBhZ2UgPyBjdXJyZW50UGFnZSA6IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmICgvXlxcL3xeSU5ERVgkLy50ZXN0KHBhZ2UubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVEaXNwbGF5KHBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgIGlmICghYXNzZXJ0KC9eW2EtelxcLTAtOV0rJC8udGVzdChwYWdlLm5hbWUpLCBgUGFnZSBuYW1lICcke3BhZ2UubmFtZX0nIG11c3QgbWF0Y2ggW2EtelxcXFwtMC05XSsuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9ebGVzc29uJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICdsZXNzb24nXCIsIHBhZ2UpO1xuICAgIGZvciAobGV0IG5vZGUgb2YgcGFnZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAobm9kZS5uYW1lID09ICdsZXNzb24nKSB7XG4gICAgICAgICAgICBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUubmFtZSA9PSAndGh1bWJuYWlsJykge1xuICAgICAgICAgICAgbGludFRodW1ibmFpbChwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydCgvXlxcLy8udGVzdChub2RlLm5hbWUpLCBcIk11c3QgYmUgJ3RodW1ibmFpbCcgb3IgJ2xlc3NvbicuIFVzZSBzbGFzaCB0byAvaWdub3JlLlwiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gbGludEluZGV4KHBhZ2UpIHtcbiAgICBpZiAoIWFzc2VydChwYWdlLmNoaWxkcmVuLmxlbmd0aCA9PSAxLCAnSW5kZXggcGFnZSBtdXN0IGNvbnRhaW4gZXhhY3RseSAxIGVsZW1lbnQnLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XG4gICAgbGludFRodW1ibmFpbChwYWdlLCBwYWdlLmNoaWxkcmVuWzBdKTtcbn1cbmZ1bmN0aW9uIGxpbnRDb3Vyc2UoKSB7XG4gICAgYXNzZXJ0KC9eQ09VUlNFLVthLXpcXC0wLTldKyQvLnRlc3QoZmlnbWEucm9vdC5uYW1lKSwgYENvdXJzZSBuYW1lICcke2ZpZ21hLnJvb3QubmFtZX0nIG11c3QgbWF0Y2ggQ09VUlNFLVthLXpcXFxcLTAtOV0rYCk7XG4gICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZSA9PSAnSU5ERVgnKTtcbiAgICBpZiAoYXNzZXJ0KCEhaW5kZXgsIFwiTXVzdCBoYXZlICdJTkRFWCcgcGFnZVwiKSkge1xuICAgICAgICBsaW50SW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgICAvLyBmaW5kIGFsbCBub24tdW5pcXVlIG5hbWVkIHBhZ2VzXG4gICAgY29uc3Qgbm9uVW5pcXVlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maWx0ZXIoKHAsIGksIGEpID0+IGEuZmluZEluZGV4KChwMikgPT4gcDIubmFtZSA9PSBwLm5hbWUpICE9IGkpO1xuICAgIG5vblVuaXF1ZS5mb3JFYWNoKChwKSA9PiBhc3NlcnQoZmFsc2UsIGBQYWdlIG5hbWUgJyR7cC5uYW1lfScgbXVzdCBiZSB1bmlxdWVgLCBwKSk7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGxpbnRQYWdlKHBhZ2UpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBvbkxpbnRDb3Vyc2UoKSB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludENvdXJzZSgpO1xuICAgIHJldHVybiBwcmludEVycm9ycygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uTGludFBhZ2UoY3VycmVudFBhZ2UpIHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBsaW50UGFnZShjdXJyZW50UGFnZSk7XG4gICAgcmV0dXJuIHByaW50RXJyb3JzKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUVycm9ycyhlcnJvcnNGb3JQcmludCkge1xuICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdlcnJvcnNGb3JQcmludCcsIGVycm9yc0ZvclByaW50KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgcHJpbnQgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBcInRhc2stbmFtZSAke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiID0gXCIke2NhcGl0YWxpemUocGFnZS5uYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRMZXNzb24ocGFnZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5pbmRleE9mKHBhZ2UpO1xuICAgICAgICBjb25zdCBsZXNzb25Ob2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBjb25zdCB0aHVtYm5haWxOb2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xuICAgICAgICBpZiAoIWxlc3Nvbk5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlID0geWllbGQgbGVzc29uTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdTVkcnLFxuICAgICAgICAgICAgLy8gc3ZnT3V0bGluZVRleHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3ZnSWRBdHRyaWJ1dGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0aHVtYm5haWwgPSB5aWVsZCB0aHVtYm5haWxOb2RlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1dJRFRIJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3Vyc2VQYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIHBhdGg6IHBhZ2UubmFtZSxcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDb3Vyc2UoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgW2xlc3NvbnMsIHRodW1ibmFpbF0gPSB5aWVsZCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBQcm9taXNlLmFsbChmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocGFnZSkgPT4gcGFnZS5uYW1lICE9ICdJTkRFWCcpXG4gICAgICAgICAgICAgICAgLm1hcCgocGFnZSkgPT4gZXhwb3J0TGVzc29uKHBhZ2UpKSksXG4gICAgICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbmQoKHBhZ2UpID0+IHBhZ2UubmFtZSA9PSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnUE5HJyxcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKCdDT1VSU0UtJywgJycpLFxuICAgICAgICAgICAgbGVzc29ucyxcbiAgICAgICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgc3dpZnRDb3Vyc2VOYW1lID0gY291cnNlTmFtZVxuICAgICAgICAuc3BsaXQoJy0nKVxuICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9XG4gICAgICAgIHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiwgcHJvOiB0cnVlKSxcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgIGxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXG4gICAgYXV0aG9yOiBSRVBMQUNFLFxuICAgIHRhc2tzOiBbXG4ke3Rhc2tzfSAgICBdKVxuYDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xuICAgIHByaW50KGNvZGUpO1xufVxub24oJ2dlbmVyYXRlQ29kZScsIGdlbmVyYXRlQ29kZSk7XG4iLCJpbXBvcnQgeyBnZXRUYWdzLCBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRQYWludENvbG9yKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgbGV0IHsgciwgZywgYiB9ID0gcGFpbnQuY29sb3I7XG4gICAgICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xuICAgICAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcbiAgICAgICAgYiA9IE1hdGgucm91bmQoYiAqIDI1NSk7XG4gICAgICAgIHJldHVybiB7IHIsIGcsIGIsIGE6IDEgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IHI6IDE2NiwgZzogMTY2LCBiOiAxNjYsIGE6IDEgfTtcbiAgICB9XG59XG5mdW5jdGlvbiBkaXNwbGF5Q29sb3IoeyByLCBnLCBiLCBhIH0pIHtcbiAgICByZXR1cm4gYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgO1xufVxuZnVuY3Rpb24gZ2V0Q29sb3JzKG5vZGUpIHtcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAgfTsgLy8gdHJhbnNwYXJlbnQgPSBkZWZhdWx0IGNvbG9yXG4gICAgbGV0IGZpbGxzID0gZGVmYXVsdENvbG9yO1xuICAgIGxldCBzdHJva2VzID0gZGVmYXVsdENvbG9yO1xuICAgIGNvbnN0IGxlYWYgPSBmaW5kTGVhZk5vZGVzKG5vZGUpWzBdO1xuICAgIGlmICgnZmlsbHMnIGluIGxlYWYgJiYgbGVhZi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbGVhZi5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpbGxzID0gZ2V0UGFpbnRDb2xvcihsZWFmLmZpbGxzWzBdKTtcbiAgICB9XG4gICAgaWYgKCdzdHJva2VzJyBpbiBsZWFmICYmIGxlYWYuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cm9rZXMgPSBnZXRQYWludENvbG9yKGxlYWYuc3Ryb2tlc1swXSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbGxzQ29sb3I6IGRpc3BsYXlDb2xvcihmaWxscyksXG4gICAgICAgIHN0cm9rZXNDb2xvcjogZGlzcGxheUNvbG9yKHN0cm9rZXMpLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcHMoKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHJldHVybiBzdGVwc0J5T3JkZXIobGVzc29uKS5tYXAoKHN0ZXApID0+IHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IHN0ZXAuaWQsIG5hbWU6IHN0ZXAubmFtZSwgY29sb3JzOiBnZXRDb2xvcnMoc3RlcCkgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwT3JkZXIoc3RlcHMpIHtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgc3RlcHMuZm9yRWFjaCgoc3RlcCwgaSkgPT4ge1xuICAgICAgICBjb25zdCBzID0gbGVzc29uLmZpbmRPbmUoKGVsKSA9PiBlbC5pZCA9PSBzdGVwLmlkKTtcbiAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgIHMubmFtZSA9IHMubmFtZS5yZXBsYWNlKC9vLVxcZCsvLCAnby0nICsgKGkgKyAxKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IGVtaXQsIG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGZpbmRMZWFmTm9kZXMsIGdldEN1cnJlbnRMZXNzb24sIGdldFN0ZXBOdW1iZXIsIGdldFRhZ3MsIGlzUmVzdWx0U3RlcCwgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2V0T3JkZXIoc3RlcCkge1xuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xuICAgIHJldHVybiBpc05hTihvKSA/IDk5OTkgOiBvO1xufVxuZnVuY3Rpb24gZ2V0VGFnKHN0ZXAsIHRhZykge1xuICAgIGNvbnN0IHYgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCh0YWcpKTtcbiAgICByZXR1cm4gdiA/IHYucmVwbGFjZSh0YWcsICcnKSA6ICcwJztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZWxldGVUbXAoKSB7XG4gICAgZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBlbC5uYW1lLnN0YXJ0c1dpdGgoJ3RtcC0nKSlcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG59XG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcbmxldCBsYXN0UGFnZTtcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBnZXRUYWdzKGVsKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykpXG4gICAgICAgIC5tYXAoKGVsKSA9PiBmaW5kTGVhZk5vZGVzKGVsKSlcbiAgICAgICAgLmZsYXQoKVxuICAgICAgICAuZmlsdGVyKChlbCkgPT4gL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KGVsLnR5cGUpKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWwuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSB9XTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRXZWlnaHQgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAzMCA6IDUwO1xuICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgZGVmYXVsdFdlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHBpbmsgPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgcGluay5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgcGluay5zdHJva2VXZWlnaHQgPSAyO1xuICAgICAgICAgICAgcGluay5uYW1lID0gJ3BpbmsgJyArIGVsLm5hbWU7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChwaW5rKTtcbiAgICAgICAgICAgIC8vIGNsb25lIGVsZW1lbnQgaGVyZSBhbmQgZ2l2ZSBoaW0gdGhpbiBwaW5rIHN0cm9rZVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICB0ZW1wbGF0ZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IGlucHV0LnJlbGF0aXZlVHJhbnNmb3JtO1xufVxuZnVuY3Rpb24gZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApIHtcbiAgICBjb25zdCBkZWZhdWx0QlMgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAxMi44IDogMTA7XG4gICAgY29uc3QgYnMgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSB8fCBkZWZhdWx0QlM7XG4gICAgY29uc3Qgc21hbGxMaW5lID0gZmlnbWEuY3JlYXRlTGluZSgpO1xuICAgIHNtYWxsTGluZS5uYW1lID0gJ3NtYWxsTGluZSc7XG4gICAgc21hbGxMaW5lLnJlc2l6ZSgzMDAsIDApO1xuICAgIHNtYWxsTGluZS5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMC44LCBiOiAwIH0gfV07XG4gICAgc21hbGxMaW5lLnN0cm9rZVdlaWdodCA9IGJzIC8gMztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQ2FwID0gJ1JPVU5EJztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQWxpZ24gPSAnQ0VOVEVSJztcbiAgICBzbWFsbExpbmUueSA9IHNtYWxsTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IG1lZGl1bUxpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBtZWRpdW1MaW5lLm5hbWUgPSAnbWVkaXVtTGluZSc7XG4gICAgbWVkaXVtTGluZS5vcGFjaXR5ID0gMC4yO1xuICAgIG1lZGl1bUxpbmUuc3Ryb2tlV2VpZ2h0ID0gYnM7XG4gICAgbWVkaXVtTGluZS55ID0gbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IGJpZ0xpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBiaWdMaW5lLm5hbWUgPSAnYmlnTGluZSc7XG4gICAgYmlnTGluZS5vcGFjaXR5ID0gMC4xO1xuICAgIGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgKyBNYXRoLnBvdyhicywgMS40KSAqIDAuODtcbiAgICBiaWdMaW5lLnkgPSBiaWdMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbYmlnTGluZSwgbWVkaXVtTGluZSwgc21hbGxMaW5lXSwgbGVzc29uLnBhcmVudCk7XG4gICAgZ3JvdXAubmFtZSA9ICd0bXAtYnMnO1xuICAgIGdyb3VwLnggPSBsZXNzb24ueDtcbiAgICBncm91cC55ID0gbGVzc29uLnkgLSA4MDtcbn1cbmZ1bmN0aW9uIGdldEJydXNoU2l6ZShzdGVwKSB7XG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhzdGVwKTtcbiAgICBjb25zdCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xuICAgIGNvbnN0IHN0cm9rZVdlaWdodHNBcnIgPSBzdHJva2VzLm1hcCgobm9kZSkgPT4gbm9kZVsnc3Ryb2tlV2VpZ2h0J10gfHwgMCk7XG4gICAgY29uc3QgbWF4V2VpZ2h0ID0gTWF0aC5tYXgoLi4uc3Ryb2tlV2VpZ2h0c0Fycik7XG4gICAgcmV0dXJuIHN0cm9rZXMubGVuZ3RoID4gMCA/IG1heFdlaWdodCA6IDI1O1xufVxuZnVuY3Rpb24gZ2V0Q2xlYXJMYXllck51bWJlcnMoc3RlcCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICdjbGVhci1sYXllci0nO1xuICAgIGNvbnN0IGNsZWFyTGF5ZXJzU3RlcCA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0YWcpID0+IHRhZy5zdGFydHNXaXRoKHByZWZpeCkpO1xuICAgIGlmIChjbGVhckxheWVyc1N0ZXAubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgbGF5ZXJOdW1iZXJzID0gY2xlYXJMYXllcnNTdGVwWzBdXG4gICAgICAgIC5zbGljZShwcmVmaXgubGVuZ3RoKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKE51bWJlcik7XG4gICAgcmV0dXJuIGxheWVyTnVtYmVycztcbn1cbmZ1bmN0aW9uIGNvbGxlY3RMYXllck51bWJlcnNUb0NsZWFyKGxlc3Nvbiwgc3RlcCkge1xuICAgIGNvbnN0IGN1cnJlbnRTdGVwTnVtYmVyID0gZ2V0U3RlcE51bWJlcihzdGVwKTtcbiAgICBjb25zdCBsYXllcnNTdGVwTnVtYmVycyA9IGxlc3Nvbi5jaGlsZHJlbi5tYXAoKHMpID0+IGdldFN0ZXBOdW1iZXIocykpO1xuICAgIGNvbnN0IGNsZWFyTGF5ZXJOdW1iZXJzID0gbGVzc29uLmNoaWxkcmVuLnJlZHVjZSgoYWNjLCBsYXllcikgPT4ge1xuICAgICAgICBpZiAobGF5ZXIudHlwZSAhPT0gJ0dST1VQJyB8fCBnZXRTdGVwTnVtYmVyKGxheWVyKSA+IGN1cnJlbnRTdGVwTnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnZXRUYWdzKGxheWVyKS5pbmNsdWRlcygnY2xlYXItYmVmb3JlJykpIHtcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBzdGVwIG51bWJlcnMgYW5kIGNvbnZlcnQgdG8gbGF5ZXJzIHRvIGNsZWFyXG4gICAgICAgICAgICBjb25zdCBzdGVwc1RvQ2xlYXIgPSBbLi4uQXJyYXkoZ2V0U3RlcE51bWJlcihsYXllcikpLmtleXMoKV0uc2xpY2UoMSk7XG4gICAgICAgICAgICBzdGVwc1RvQ2xlYXIuZm9yRWFjaCgoc3RlcE51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsYXllcnNTdGVwTnVtYmVycy5pbmNsdWRlcyhzdGVwTnVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICBhY2MuYWRkKGxheWVyc1N0ZXBOdW1iZXJzLmluZGV4T2Yoc3RlcE51bWJlcikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGdldENsZWFyTGF5ZXJOdW1iZXJzKGxheWVyKS5mb3JFYWNoKChpZHgpID0+IGFjYy5hZGQoaWR4KSk7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgbmV3IFNldCgpKTtcbiAgICByZXR1cm4gY2xlYXJMYXllck51bWJlcnM7XG59XG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwYWdlLCBzZXR0aW5ncykge1xuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBsYXN0TW9kZSA9IHNldHRpbmdzLmRpc3BsYXlNb2RlO1xuICAgIGNvbnN0IHsgZGlzcGxheU1vZGUsIHN0ZXBOdW1iZXIgfSA9IHNldHRpbmdzO1xuICAgIGNvbnNvbGUubG9nKCdwYWdlJywgcGFnZSk7XG4gICAgY29uc3QgbGVzc29uID0gcGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgaWYgKCFsZXNzb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xuICAgIHBhZ2Uuc2VsZWN0aW9uID0gW3N0ZXBdO1xuICAgIGNvbnN0IHN0ZXBDb3VudCA9IGxlc3Nvbi5jaGlsZHJlbi5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSkubGVuZ3RoO1xuICAgIGNvbnN0IG1heFN0cm9rZVdlaWdodCA9IGdldEJydXNoU2l6ZShzdGVwKTtcbiAgICBlbWl0KCd1cGRhdGVGb3JtJywge1xuICAgICAgICBzaGFkb3dTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSxcbiAgICAgICAgYnJ1c2hTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSxcbiAgICAgICAgc3VnZ2VzdGVkQnJ1c2hTaXplOiBpc1Jlc3VsdFN0ZXAoc3RlcCkgPyAwIDogbWF4U3Ryb2tlV2VpZ2h0LFxuICAgICAgICB0ZW1wbGF0ZTogZ2V0VGFnKHN0ZXAsICdzLScpLFxuICAgICAgICBzdGVwQ291bnQsXG4gICAgICAgIHN0ZXBOdW1iZXIsXG4gICAgICAgIGRpc3BsYXlNb2RlLFxuICAgIH0pO1xuICAgIGRlbGV0ZVRtcCgpO1xuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcbiAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gaSA8IHN0ZXBOdW1iZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbGxlY3RMYXllck51bWJlcnNUb0NsZWFyKGxlc3Nvbiwgc3RlcCkuZm9yRWFjaCgoaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbltpXS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZW1wbGF0ZSc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVByb3BzKHNldHRpbmdzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzZXR0aW5ncy5zdGVwTnVtYmVyIC0gMV07XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnc3MtJykgJiYgIXQuc3RhcnRzV2l0aCgnYnMtJykgJiYgIXQuc3RhcnRzV2l0aCgncy0nKSk7XG4gICAgaWYgKHNldHRpbmdzLnRlbXBsYXRlKSB7XG4gICAgICAgIHRhZ3Muc3BsaWNlKDEsIDAsIGBzLSR7c2V0dGluZ3MudGVtcGxhdGV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5zaGFkb3dTaXplKSB7XG4gICAgICAgIHRhZ3MucHVzaChgc3MtJHtzZXR0aW5ncy5zaGFkb3dTaXplfWApO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuYnJ1c2hTaXplKSB7XG4gICAgICAgIHRhZ3MucHVzaChgYnMtJHtzZXR0aW5ncy5icnVzaFNpemV9YCk7XG4gICAgfVxuICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbignICcpO1xufVxub24oJ3VwZGF0ZURpc3BsYXknLCAoc2V0dGluZ3MpID0+IHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHNldHRpbmdzKSk7XG5vbigndXBkYXRlUHJvcHMnLCB1cGRhdGVQcm9wcyk7XG5leHBvcnQgZnVuY3Rpb24gY3VycmVudFBhZ2VDaGFuZ2VkKHBhZ2VOb2RlKSB7XG4gICAgaWYgKGZpZ21hICYmICFsYXN0UGFnZSkge1xuICAgICAgICBsYXN0UGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIH1cbiAgICB1cGRhdGVEaXNwbGF5KGxhc3RQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICBsYXN0UGFnZSA9IHBhZ2VOb2RlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZWQoKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBpZiAoIXNlbGVjdGlvbiB8fFxuICAgICAgICAhbGVzc29uIHx8XG4gICAgICAgICFsZXNzb24uY2hpbGRyZW4uaW5jbHVkZXMoc2VsZWN0aW9uKSB8fFxuICAgICAgICBzZWxlY3Rpb24udHlwZSAhPT0gJ0dST1VQJykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdXBkYXRlIHN0ZXBcbiAgICBjb25zdCBzdGVwID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGNvbnN0IHN0ZXBOdW1iZXIgPSBzdGVwc0J5T3JkZXIobGVzc29uKS5pbmRleE9mKHN0ZXApICsgMTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiBsYXN0TW9kZSwgc3RlcE51bWJlciB9KTtcbn1cbiIsImltcG9ydCB7IGVtaXQgfSBmcm9tICcuLi9ldmVudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICBhcnIucHVzaChub2RlKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KGNoaWxkcmVuLmZsYXRNYXAoKHApID0+IGZpbmRBbGwocCwgZikpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTGVhZk5vZGVzKG5vZGUpIHtcbiAgICBpZiAoISgnY2hpbGRyZW4nIGluIG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBub2RlLmZpbmRBbGwoKG4pID0+ICEoJ2NoaWxkcmVuJyBpbiBuKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudChub2RlLCBmKSB7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGlmIChub2RlLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudChub2RlLnBhcmVudCwgZik7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVJbmRleChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50LmNoaWxkcmVuLmZpbmRJbmRleCgobikgPT4gbi5pZCA9PT0gbm9kZS5pZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudExlc3NvbigpIHtcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT09ICdsZXNzb24nKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWdzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5uYW1lLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYWcobm9kZSwgdGFnKSB7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgcmV0dXJuIHRhZ3MuZmluZCgocykgPT4gdGFnLnRlc3QocykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRhZyhub2RlLCB0YWcpIHtcbiAgICBub2RlLm5hbWUgPSBnZXRUYWdzKG5vZGUpLmNvbmNhdChbdGFnXSkuam9pbignICcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnRCeVRhZyhub2RlLCB0YWcpIHtcbiAgICByZXR1cm4gZmluZFBhcmVudChub2RlLCAobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcyh0YWcpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1Jlc3VsdFN0ZXAobm9kZSkge1xuICAgIHJldHVybiBub2RlICYmIGdldFRhZ3Mobm9kZSkuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByaW50KHRleHQpIHtcbiAgICBmaWdtYS51aS5yZXNpemUoNzAwLCA0MDApO1xuICAgIGVtaXQoJ3ByaW50JywgdGV4dCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheU5vdGlmaWNhdGlvbihtZXNzYWdlKSB7XG4gICAgZmlnbWEubm90aWZ5KG1lc3NhZ2UpO1xufVxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSAocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcE51bWJlcihzdGVwKSB7XG4gICAgY29uc3Qgc3RlcE9yZGVyVGFnID0gL15vLShcXGQrKSQvO1xuICAgIGNvbnN0IHN0ZXBUYWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHRhZykgPT4gdGFnLm1hdGNoKHN0ZXBPcmRlclRhZykpO1xuICAgIGlmIChzdGVwVGFnKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoc3RlcFRhZy5tYXRjaChzdGVwT3JkZXJUYWcpWzFdKTtcbiAgICB9XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGNyZWF0ZVBsdWdpbkFQSSwgY3JlYXRlVUlBUEkgfSBmcm9tICdmaWdtYS1qc29ucnBjJztcbmltcG9ydCB7IGV4cG9ydFRleHRzLCBpbXBvcnRUZXh0cyB9IGZyb20gJy4vcGx1Z2luL2Zvcm1hdC1ycGMnO1xuaW1wb3J0IHsgZXhwb3J0TGVzc29uLCBleHBvcnRDb3Vyc2UgfSBmcm9tICcuL3BsdWdpbi9wdWJsaXNoJztcbmltcG9ydCB7IGdldFN0ZXBzLCBzZXRTdGVwT3JkZXIgfSBmcm9tICcuL3BsdWdpbi90dW5lLXJwYyc7XG5pbXBvcnQgeyBjcmVhdGVMZXNzb24sIHNlcGFyYXRlU3RlcCwgc3BsaXRCeUNvbG9yLCBqb2luU3RlcHMsIH0gZnJvbSAnLi9wbHVnaW4vY3JlYXRlJztcbmltcG9ydCB7IGRpc3BsYXlOb3RpZmljYXRpb24gfSBmcm9tICcuL3BsdWdpbi91dGlsJztcbmltcG9ydCB7IG9uTGludFBhZ2UsIG9uTGludENvdXJzZSwgc2VsZWN0RXJyb3IsIHNhdmVFcnJvcnMgfSBmcm9tICcuL3BsdWdpbi9saW50ZXInO1xuaW1wb3J0IHsgc2VsZWN0aW9uQ2hhbmdlZCwgY3VycmVudFBhZ2VDaGFuZ2VkLCB1cGRhdGVEaXNwbGF5IH0gZnJvbSAnLi9wbHVnaW4vdHVuZSc7XG4vLyBGaWdtYSBwbHVnaW4gbWV0aG9kc1xuZXhwb3J0IGNvbnN0IHBsdWdpbkFwaSA9IGNyZWF0ZVBsdWdpbkFQSSh7XG4gICAgc2V0U2Vzc2lvblRva2VuKHRva2VuKSB7XG4gICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdzZXNzaW9uVG9rZW4nLCB0b2tlbik7XG4gICAgfSxcbiAgICBnZXRTZXNzaW9uVG9rZW4oKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnc2Vzc2lvblRva2VuJyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZXhwb3J0TGVzc29uLFxuICAgIGV4cG9ydENvdXJzZSxcbiAgICBnZXRTdGVwcyxcbiAgICBzZXRTdGVwT3JkZXIsXG4gICAgZXhwb3J0VGV4dHMsXG4gICAgaW1wb3J0VGV4dHMsXG4gICAgZGlzcGxheU5vdGlmaWNhdGlvbixcbiAgICBjcmVhdGVMZXNzb24sXG4gICAgc2VwYXJhdGVTdGVwLFxuICAgIHNwbGl0QnlDb2xvcixcbiAgICBqb2luU3RlcHMsXG4gICAgb25MaW50UGFnZSxcbiAgICBvbkxpbnRDb3Vyc2UsXG4gICAgc2VsZWN0RXJyb3IsXG4gICAgc2F2ZUVycm9ycyxcbiAgICBzZWxlY3Rpb25DaGFuZ2VkLFxuICAgIGN1cnJlbnRQYWdlQ2hhbmdlZCxcbiAgICB1cGRhdGVEaXNwbGF5LFxufSk7XG4vLyBGaWdtYSBVSSBhcHAgbWV0aG9kc1xuZXhwb3J0IGNvbnN0IHVpQXBpID0gY3JlYXRlVUlBUEkoe30pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==