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
        name: 'settings capture-color zoom-scale-2 order-layers',
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
        .filter((node) => node.visible)
        .reverse();
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







figma.showUI(__html__);
figma.ui.resize(340, 470);
console.clear();
figma.on('selectionchange', () => {
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["selectionChanged"])();
});
figma.on('currentpagechange', () => {
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["currentPageChanged"])(figma.currentPage);
});
setTimeout(() => {
    Object(_tune__WEBPACK_IMPORTED_MODULE_1__["updateDisplay"])(figma.currentPage, { displayMode: 'all', stepNumber: 1 });
}, 1500);


/***/ }),

/***/ "./src/plugin/linter.ts":
/*!******************************!*\
  !*** ./src/plugin/linter.ts ***!
  \******************************/
/*! exports provided: ErrorLevel, selectError, printErrors, lintPage, lintCourse, saveErrors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorLevel", function() { return ErrorLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectError", function() { return selectError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printErrors", function() { return printErrors; });
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
function lintFills(node, page, fills) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^rgb-template$/);
    fills.forEach((f) => {
        assert(f.visible, 'Fill must be visible', page, node);
        assert(f.type == 'SOLID' || !rgbt, 'Fill must be solid', page, node);
        if (f.type === 'IMAGE') {
            assert(f.opacity == 1, 'Image fill must not be opaque', page, node);
        }
    });
}
function lintStrokes(node, page, strokes) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^rgb-template$/);
    strokes.forEach((s) => {
        assert(s.visible, 'Stroke must be visible', page, node);
        assert(s.type == 'SOLID' || !rgbt, 'Stroke must be solid', page, node);
        if (s.type === 'IMAGE') {
            assert(s.opacity == 1, 'Image stroke must be opaque', page, node);
        }
    });
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)), `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR);
    assert(!strokes.length || node.strokeJoin == 'ROUND', `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
}
const validVectorTags = /^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^[vV]ector$|^\d+$|^Ellipse$|^Rectangle$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$/;
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
const validGroupTags = /^\/|^blink$|^rgb-template$|^d\d+$|^r\d+$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$|^draw-line$|^\d+$|^[gG]roup$/;
function lintGroup(page, node) {
    assert(!/BOOLEAN_OPERATION/.test(node.type), 'Notice BOOLEAN_OPERATION', page, node, ErrorLevel.INFO);
    assert(node.opacity == 1, 'Must be opaque', page, node);
    assert(node.visible, 'Must be visible', page, node);
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node);
    tags.forEach((tag) => {
        assert(validGroupTags.test(tag), `Tag '${tag}' unknown`, page, node);
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
    Object(_util__WEBPACK_IMPORTED_MODULE_0__["descendants"])(node).forEach((v) => {
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
const validSettingsTags = /^\/|^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/;
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
const validStepTags = /^\/|^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-continue$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-(\d+,?)+$|^ss-\d+$|^bs-\d+$|^o-\d+$|^allow-undo$|^share-button$|^clear-before$/;
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
function lintPage(currentPage, appendErrors) {
    if (!appendErrors) {
        errors = [];
    }
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
    return printErrors();
}
function lintIndex(page) {
    if (!assert(page.children.length == 1, 'Index page must contain exactly 1 element', page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, "Must contain exactly 1 'thumbnail'", page);
    lintThumbnail(page, page.children[0]);
}
function lintCourse() {
    errors = [];
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
/*! exports provided: getSteps, setStepsOrder, tagUnorderedSteps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
        return { id: step.id, name: step.name, colors: getColors(step), layerNumber: lesson.children.indexOf(step) + 1 };
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
    return v ? v.replace(tag, '') : null;
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
        const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50;
        const ss = parseInt(getTag(step, 'ss-')) || defaultWeight;
        if (el.strokes.length > 0 && el.fills.length > 0) {
            const green = el.clone();
            green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }];
            green.strokeWeight += ss;
            template.appendChild(green);
        }
        if (el.strokes.length > 0 && !el.fills.length) {
            const green = el.clone();
            green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }];
            green.strokeWeight = ss * 1.1;
            template.appendChild(green);
        }
        if (el.fills.length > 0 && !el.strokes.length) {
            const green = el.clone();
            green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }];
            green.strokeWeight = ss;
            template.appendChild(green);
        }
        if (el.strokes.length > 0) {
            const blue = el.clone();
            blue.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            blue.strokeWeight = ss;
            template.appendChild(blue);
            const pink = el.clone();
            pink.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }];
            pink.strokeWeight = 2;
            pink.name = 'pink ' + el.name;
            template.appendChild(pink);
        }
        if (el.fills.length > 0) {
            const fillsBlue = el.clone();
            fillsBlue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }];
            template.appendChild(fillsBlue);
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
function showOnlyRGBTemplate(node) {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node).includes('settings')) {
        node.visible = false;
        return;
    }
    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node).includes('rgb-template') || (/GROUP|BOOLEAN_OPERATION/.test(node.type))) {
        return;
    }
    node.children.forEach((v) => {
        if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
            return showOnlyRGBTemplate(v);
        }
        if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type) && !Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(v).includes('rgb-template')) {
            return v.visible = false;
        }
    });
}
function collectLayerNumbersToClear(lesson, step) {
    const currentStepOrder = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepOrder"])(step);
    const layersStepOrderTags = lesson.children.map((s) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepOrder"])(s));
    const clearLayerNumbers = lesson.children.reduce((acc, layer) => {
        if (layer.type !== 'GROUP' || Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepOrder"])(layer) > currentStepOrder) {
            return acc;
        }
        if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(layer).includes('clear-before')) {
            // calculate step order tags and convert to layers to clear
            const stepsToClear = [...Array(Object(_util__WEBPACK_IMPORTED_MODULE_1__["getStepOrder"])(layer)).keys()].slice(1);
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
    const brushType = getTag(step, 'brush-name-') || '';
    let layerNumbersToClear = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).includes('clear-before') ? [...Array(stepNumber).keys()].slice(1) : getClearLayerNumbers(step);
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])('updateForm', {
        shadowSize: parseInt(getTag(step, 'ss-')) || 0,
        brushSize: parseInt(getTag(step, 'bs-')) || 0,
        suggestedBrushSize: Object(_util__WEBPACK_IMPORTED_MODULE_1__["isResultStep"])(step) ? 0 : maxStrokeWeight,
        template: getTag(step, 's-') || 0,
        stepCount,
        stepNumber,
        displayMode,
        clearBefore: Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).includes('clear-before'),
        clearLayers: layerNumbersToClear.map((n) => n.toString()) || [],
        otherTags: Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).filter((t) => t.startsWith('share-button') ||
            t.startsWith('allow-undo')) || [],
        brushType,
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
            lesson.children.forEach((step) => showOnlyRGBTemplate(step));
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
function addAnimationTag(step, tag, delay, repeat) {
    if ((/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(figma.currentPage.selection[0].type))) {
        let selectionTags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(figma.currentPage.selection[0]);
        selectionTags = selectionTags.filter((t) => !t.startsWith('wiggle') && !t.startsWith('fly-from-') && !t.startsWith('appear') && !t.startsWith('blink') && !t.startsWith('draw-line'));
        selectionTags = selectionTags.filter((t) => !/d\d+/.test(t) && !/r\d+/.test(t));
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
    else {
        if (tag) {
            Object(_util__WEBPACK_IMPORTED_MODULE_1__["descendants"])(step).forEach((v) => {
                if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
                    let selectionTags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(v);
                    selectionTags = selectionTags.filter((t) => !t.startsWith('wiggle') && !t.startsWith('fly-from-') && !t.startsWith('appear') && !t.startsWith('blink') && !t.startsWith('draw-line'));
                    selectionTags.push(tag);
                    selectionTags = selectionTags.filter((t) => !/d\d+/.test(t) && !/r\d+/.test(t));
                    if (delay) {
                        selectionTags.push(`d${delay}`);
                    }
                    if (repeat) {
                        selectionTags.push(`r${repeat}`);
                    }
                    v.name = selectionTags.join(' ');
                }
            });
        }
        else {
            Object(_util__WEBPACK_IMPORTED_MODULE_1__["descendants"])(step).forEach((v) => {
                if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
                    let selectionTags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(v);
                    selectionTags = selectionTags.filter((t) => !t.startsWith('wiggle') && !t.startsWith('fly-from-') && !t.startsWith('appear') && !t.startsWith('blink') && !t.startsWith('draw-line'));
                    selectionTags = selectionTags.filter((t) => !/d\d+/.test(t) && !/r\d+/.test(t));
                    v.name = selectionTags.join(' ');
                }
            });
        }
    }
}
function updateProps(settings) {
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    const step = stepsByOrder(lesson)[settings.stepNumber - 1];
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).filter((t) => !t.startsWith('ss-') &&
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
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, findTag, addTag, findParentByTag, isResultStep, print, displayNotification, capitalize, getStepOrder, resizeUi, setStepOrder, getAllTree, descendants */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStepOrder", function() { return getStepOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resizeUi", function() { return resizeUi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setStepOrder", function() { return setStepOrder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllTree", function() { return getAllTree; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "descendants", function() { return descendants; });
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
});
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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QUFDRDtBQUNPLGNBQWMsaUVBQVcsR0FBRyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9pbmRleC50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzLlBhcnNlRXJyb3IgPSBjbGFzcyBQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJQYXJzZSBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjcwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFJlcXVlc3QgPSBjbGFzcyBJbnZhbGlkUmVxdWVzdCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBSZXF1ZXN0XCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NZXRob2ROb3RGb3VuZCA9IGNsYXNzIE1ldGhvZE5vdEZvdW5kIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJNZXRob2Qgbm90IGZvdW5kXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAxO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUGFyYW1zID0gY2xhc3MgSW52YWxpZFBhcmFtcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBwYXJhbXNcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludGVybmFsRXJyb3IgPSBjbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnRlcm5hbCBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMztcbiAgfVxufTtcbiIsImNvbnN0IHsgc2V0dXAsIHNlbmRSZXF1ZXN0IH0gPSByZXF1aXJlKFwiLi9ycGNcIik7XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVVJQVBJID0gZnVuY3Rpb24gY3JlYXRlVUlBUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsdWdpbkFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbkFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG4iLCJjb25zdCBSUENFcnJvciA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IHsgTWV0aG9kTm90Rm91bmQgfSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcblxubGV0IHNlbmRSYXc7XG5cbmlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZmlnbWEudWkub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGhhbmRsZVJhdyhtZXNzYWdlKSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xufSBlbHNlIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIG9ubWVzc2FnZSA9IGV2ZW50ID0+IGhhbmRsZVJhdyhldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiBtZXNzYWdlIH0sIFwiKlwiKTtcbn1cblxubGV0IHJwY0luZGV4ID0gMDtcbmxldCBwZW5kaW5nID0ge307XG5cbmZ1bmN0aW9uIHNlbmRKc29uKHJlcSkge1xuICB0cnkge1xuICAgIHNlbmRSYXcocmVxKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXN1bHQoaWQsIHJlc3VsdCkge1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICByZXN1bHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRFcnJvcihpZCwgZXJyb3IpIHtcbiAgY29uc3QgZXJyb3JPYmplY3QgPSB7XG4gICAgY29kZTogZXJyb3IuY29kZSxcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgIGRhdGE6IGVycm9yLmRhdGFcbiAgfTtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgZXJyb3I6IGVycm9yT2JqZWN0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSYXcoZGF0YSkge1xuICB0cnkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVScGMoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJwYyhqc29uKSB7XG4gIGlmICh0eXBlb2YganNvbi5pZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBqc29uLnJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAganNvbi5lcnJvciB8fFxuICAgICAgdHlwZW9mIGpzb24ubWV0aG9kID09PSBcInVuZGVmaW5lZFwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHNlbmRFcnJvcihcbiAgICAgICAgICBqc29uLmlkLFxuICAgICAgICAgIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgY2FsbGJhY2sgZm9yIFwiICsganNvbi5pZClcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxiYWNrLnRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBjYWxsYmFjayhqc29uLmVycm9yLCBqc29uLnJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZVJlcXVlc3QoanNvbik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKTtcbiAgfVxufVxuXG5sZXQgbWV0aG9kcyA9IHt9O1xuXG5mdW5jdGlvbiBvblJlcXVlc3QobWV0aG9kLCBwYXJhbXMpIHtcbiAgaWYgKCFtZXRob2RzW21ldGhvZF0pIHtcbiAgICB0aHJvdyBuZXcgTWV0aG9kTm90Rm91bmQobWV0aG9kKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kc1ttZXRob2RdKC4uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgbWV0aG9kXCIpKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbiAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXN1bHRcbiAgICAgICAgLnRoZW4ocmVzID0+IHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBlcnIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnNldHVwID0gX21ldGhvZHMgPT4ge1xuICBPYmplY3QuYXNzaWduKG1ldGhvZHMsIF9tZXRob2RzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmROb3RpZmljYXRpb24gPSAobWV0aG9kLCBwYXJhbXMpID0+IHtcbiAgc2VuZEpzb24oeyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcyB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKG1ldGhvZCwgcGFyYW1zLCB0aW1lb3V0KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaWQgPSBycGNJbmRleDtcbiAgICBjb25zdCByZXEgPSB7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zLCBpZCB9O1xuICAgIHJwY0luZGV4ICs9IDE7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc3QganNFcnJvciA9IG5ldyBFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgIGpzRXJyb3IuY29kZSA9IGVyci5jb2RlO1xuICAgICAgICBqc0Vycm9yLmRhdGEgPSBlcnIuZGF0YTtcbiAgICAgICAgcmVqZWN0KGpzRXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgfTtcblxuICAgIC8vIHNldCBhIGRlZmF1bHQgdGltZW91dFxuICAgIGNhbGxiYWNrLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2lkXTtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0IFwiICsgbWV0aG9kICsgXCIgdGltZWQgb3V0LlwiKSk7XG4gICAgfSwgdGltZW91dCB8fCAzMDAwKTtcblxuICAgIHBlbmRpbmdbaWRdID0gY2FsbGJhY2s7XG4gICAgc2VuZEpzb24ocmVxKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5SUENFcnJvciA9IFJQQ0Vycm9yO1xuIiwiY29uc3QgZXZlbnRIYW5kbGVycyA9IHt9O1xubGV0IGN1cnJlbnRJZCA9IDA7XG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IGlkID0gYCR7Y3VycmVudElkfWA7XG4gICAgY3VycmVudElkICs9IDE7XG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgZXZlbnRIYW5kbGVyc1tpZF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJldHVybiBvbihuYW1lLCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAoZG9uZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xuICAgID8gZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoW25hbWUsIC4uLmFyZ3NdKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgfSwgJyonKTtcbiAgICB9O1xuZnVuY3Rpb24gaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpIHtcbiAgICBmb3IgKGNvbnN0IGlkIGluIGV2ZW50SGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKGV2ZW50SGFuZGxlcnNbaWRdLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaWRdLmhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKChfYSA9IHBhcmFtc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmpzb25ycGMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBwYXJhbXNbMF07XG4gICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICB9O1xufVxuZWxzZSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIFRPRE86IHZlcnkgZGlydHkgaGFjaywgbmVlZHMgZml4aW5nXG4gICAgICAgIGNvbnN0IGZhbGxiYWNrID0gd2luZG93Lm9ubWVzc2FnZTtcbiAgICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgICAgIGZhbGxiYWNrLmFwcGx5KHdpbmRvdywgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gcGFyYW1zWzBdO1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XG4gICAgICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSwgMTAwKTtcbn1cbiIsImltcG9ydCB7IGdldFN0ZXBzLCB0YWdVbm9yZGVyZWRTdGVwcyB9IGZyb20gJy4vdHVuZS1ycGMnO1xuaW1wb3J0IHsgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3NvbiwgZmluZFBhcmVudEJ5VGFnLCBnZXROb2RlSW5kZXgsIGdldFRhZ3MsIGlzUmVzdWx0U3RlcCwgZ2V0U3RlcE9yZGVyLCBzZXRTdGVwT3JkZXIsIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE5vZGUobm9kZSwgcGFyYW1ldGVycykge1xuICAgIGNvbnN0IHsgbmFtZSwgeCwgeSwgd2lkdGggPSA0MCwgaGVpZ2h0ID0gNDAgfSA9IHBhcmFtZXRlcnM7XG4gICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICBub2RlLnggPSB4O1xuICAgIG5vZGUueSA9IHk7XG4gICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG59XG5mdW5jdGlvbiBmaWxsU2VydmljZU5vZGVzKG5vZGUpIHtcbiAgICBub2RlLmZpbGxzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICByOiAxOTYgLyAyNTUsXG4gICAgICAgICAgICAgICAgZzogMTk2IC8gMjU1LFxuICAgICAgICAgICAgICAgIGI6IDE5NiAvIDI1NSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXTtcbn1cbmZ1bmN0aW9uIHJlc2NhbGVJbWFnZU5vZGUobm9kZSwgcmVzaXplUGFyYW1zKSB7XG4gICAgY29uc3QgeyBtYXhXaWR0aCwgbWF4SGVpZ2h0IH0gPSByZXNpemVQYXJhbXM7XG4gICAgY29uc3QgaXNDb3JyZWN0U2l6ZSA9IG5vZGUud2lkdGggPD0gbWF4V2lkdGggJiYgbm9kZS5oZWlnaHQgPD0gbWF4SGVpZ2h0O1xuICAgIGNvbnN0IGlzQ29ycmVjdFR5cGUgPSBub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnUkVDVEFOR0xFJyB8fCBub2RlLnR5cGUgPT09ICdWRUNUT1InO1xuICAgIGlmIChpc0NvcnJlY3RUeXBlICYmICFpc0NvcnJlY3RTaXplKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gTWF0aC5taW4obWF4V2lkdGggLyBub2RlLndpZHRoLCBtYXhIZWlnaHQgLyBub2RlLmhlaWdodCk7XG4gICAgICAgIG5vZGUucmVzY2FsZShzY2FsZUZhY3Rvcik7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVzdWx0Tm9kZShub2RlKSB7XG4gICAgY29uc3QgcmVzdWx0UmVjdGFuZ2xlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhyZXN1bHRSZWN0YW5nbGUpO1xuICAgIGNvbnN0IHRlbXBsYXRlR3JvdXAgPSBmaWdtYS5ncm91cChbcmVzdWx0UmVjdGFuZ2xlXSwgbm9kZSk7XG4gICAgdGVtcGxhdGVHcm91cC5uYW1lID0gJ3RlbXBsYXRlJztcbiAgICBjb25zdCByZXN1bHQgPSBmaWdtYS5ncm91cChbdGVtcGxhdGVHcm91cF0sIG5vZGUpO1xuICAgIGZvcm1hdE5vZGUocmVzdWx0LCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcsXG4gICAgICAgIHg6IDEwLFxuICAgICAgICB5OiA2MCxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMZXNzb24oKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbmFsSW1hZ2UgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgZm9ybWF0Tm9kZShsZXNzb24sIHtcbiAgICAgICAgbmFtZTogJ2xlc3NvbicsXG4gICAgICAgIHg6IC00NjEsXG4gICAgICAgIHk6IC01MTIsXG4gICAgICAgIHdpZHRoOiAxMzY2LFxuICAgICAgICBoZWlnaHQ6IDEwMjQsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbCwge1xuICAgICAgICBuYW1lOiAndGh1bWJuYWlsJyxcbiAgICAgICAgeDogLTkwMSxcbiAgICAgICAgeTogLTUxMixcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHN0ZXBcbiAgICBjb25zdCBzdGVwID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xuICAgIHN0ZXAubmFtZSA9ICdpbWFnZSc7XG4gICAgY29uc3QgcmVzaXplZEltYWdlID0gcmVzY2FsZUltYWdlTm9kZShvcmlnaW5hbEltYWdlLCB7XG4gICAgICAgIG1heFdpZHRoOiBsZXNzb24ud2lkdGggLSA4MyAqIDIsXG4gICAgICAgIG1heEhlaWdodDogbGVzc29uLmhlaWdodCAtIDEyICogMixcbiAgICB9KTtcbiAgICBjb25zdCBzdGVwSW5wdXQgPSBmaWdtYS5ncm91cChbc3RlcF0sIGxlc3Nvbik7XG4gICAgc3RlcElucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IGZpcnN0U3RlcCA9IGZpZ21hLmdyb3VwKFtzdGVwSW5wdXRdLCBsZXNzb24pO1xuICAgIGZvcm1hdE5vZGUoZmlyc3RTdGVwLCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLWJydXNoJyxcbiAgICAgICAgeDogKGxlc3Nvbi53aWR0aCAtIHJlc2l6ZWRJbWFnZS53aWR0aCkgLyAyLFxuICAgICAgICB5OiAobGVzc29uLmhlaWdodCAtIHJlc2l6ZWRJbWFnZS5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRJbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkSW1hZ2UuaGVpZ2h0LFxuICAgIH0pO1xuICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcbiAgICBjb25zdCB0aHVtYm5haWxJbWFnZSA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcbiAgICB0aHVtYm5haWxJbWFnZS5uYW1lID0gJ2ltYWdlJztcbiAgICBjb25zdCByZXNpemVkVGh1bWJuYWlsID0gcmVzY2FsZUltYWdlTm9kZSh0aHVtYm5haWxJbWFnZSwge1xuICAgICAgICBtYXhXaWR0aDogdGh1bWJuYWlsLndpZHRoIC0gMzUgKiAyLFxuICAgICAgICBtYXhIZWlnaHQ6IHRodW1ibmFpbC5oZWlnaHQgLSAzNSAqIDIsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsR3JvdXAgPSBmaWdtYS5ncm91cChbdGh1bWJuYWlsSW1hZ2VdLCB0aHVtYm5haWwpO1xuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsR3JvdXAsIHtcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCBncm91cCcsXG4gICAgICAgIHg6ICh0aHVtYm5haWwud2lkdGggLSByZXNpemVkVGh1bWJuYWlsLndpZHRoKSAvIDIsXG4gICAgICAgIHk6ICh0aHVtYm5haWwuaGVpZ2h0IC0gcmVzaXplZFRodW1ibmFpbC5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRUaHVtYm5haWwud2lkdGgsXG4gICAgICAgIGhlaWdodDogcmVzaXplZFRodW1ibmFpbC5oZWlnaHQsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHJlc3VsdFxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcbiAgICAvLyBDcmVhdGUgc2V0dGluZ3NcbiAgICBjb25zdCBzZXR0aW5nc0VsbGlwc2UgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhzZXR0aW5nc0VsbGlwc2UpO1xuICAgIGZvcm1hdE5vZGUoc2V0dGluZ3NFbGxpcHNlLCB7XG4gICAgICAgIG5hbWU6ICdzZXR0aW5ncyBjYXB0dXJlLWNvbG9yIHpvb20tc2NhbGUtMiBvcmRlci1sYXllcnMnLFxuICAgICAgICB4OiAxMCxcbiAgICAgICAgeTogMTAsXG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHNldHRpbmdzRWxsaXBzZSk7XG4gICAgb3JpZ2luYWxJbWFnZS5yZW1vdmUoKTtcbiAgICB0YWdVbm9yZGVyZWRTdGVwcygpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5Q29sb3IoY29sb3IpIHtcbiAgICBsZXQgeyByLCBnLCBiIH0gPSBjb2xvcjtcbiAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcbiAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcbiAgICBiID0gTWF0aC5yb3VuZChiICogMjU1KTtcbiAgICByZXR1cm4gYHJnYigke3J9LCAke2d9LCAke2J9KWA7XG59XG5mdW5jdGlvbiBuYW1lTGVhZk5vZGVzKG5vZGVzKSB7XG4gICAgbGV0IGFsbFN0cm9rZXMgPSAhbm9kZXMuZmluZCgobm9kZSkgPT4gJ2ZpbGxzJyBpbiBub2RlICYmIG5vZGUuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG5vZGUuZmlsbHMubGVuZ3RoID4gMCk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICBub2RlLm5hbWUgPVxuICAgICAgICAgICAgJ3JnYi10ZW1wbGF0ZSAnICsgKGFsbFN0cm9rZXMgJiYgbm9kZXMubGVuZ3RoID4gMyA/ICdkcmF3LWxpbmUnIDogJ2JsaW5rJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbmFtZVN0ZXBOb2RlKHN0ZXApIHtcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHN0ZXApO1xuICAgIGxldCBmaWxscyA9IGxlYXZlcy5maWx0ZXIoKG4pID0+ICdmaWxscycgaW4gbiAmJiBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBuLmZpbGxzLmxlbmd0aCA+IDApO1xuICAgIGxldCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xuICAgIGxldCBtdWx0aXN0ZXBUeXBlID0gZmlsbHMubGVuZ3RoID4gMCA/ICdiZycgOiAnYnJ1c2gnO1xuICAgIGxldCBzdHJva2VXZWlnaHRzQXJyID0gc3Ryb2tlcy5tYXAoKG5vZGUpID0+IG5vZGVbJ3N0cm9rZVdlaWdodCddIHx8IDApO1xuICAgIGxldCBtYXhXZWlnaHQgPSBNYXRoLm1heCguLi5zdHJva2VXZWlnaHRzQXJyKTtcbiAgICBsZXQgd2VpZ2h0ID0gc3Ryb2tlcy5sZW5ndGggPiAwID8gbWF4V2VpZ2h0IDogMjU7XG4gICAgc3RlcC5uYW1lID0gYHN0ZXAgcy1tdWx0aXN0ZXAtJHttdWx0aXN0ZXBUeXBlfSBicy0ke3dlaWdodH1gO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RlcE5vZGUobm9kZSwgbm9kZXNBcnJheSwgaW5kZXgpIHtcbiAgICBpZiAoIW5vZGVzQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbmFtZUxlYWZOb2Rlcyhub2Rlc0FycmF5KTtcbiAgICBjb25zdCBpbnB1dCA9IGZpZ21hLmdyb3VwKG5vZGVzQXJyYXksIG5vZGUpO1xuICAgIGlucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBub2RlLCBpbmRleCk7XG4gICAgbmFtZVN0ZXBOb2RlKHN0ZXApO1xuICAgIHJldHVybiBzdGVwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExhc3RTdGVwT3JkZXIoKSB7XG4gICAgY29uc3Qgc3RlcHNPcmRlciA9IGdldFN0ZXBzKClcbiAgICAgICAgLm1hcCgocykgPT4gZ2V0U3RlcE9yZGVyKHMpKVxuICAgICAgICAuZmlsdGVyKChzKSA9PiBzICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBNYXRoLm1heCguLi5zdGVwc09yZGVyLCAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZVN0ZXAoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGNvbnN0IGxlYXZlcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+ICEoJ2NoaWxkcmVuJyBpbiBub2RlKSk7XG4gICAgaWYgKCFsZWF2ZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlyc3RQYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcbiAgICBpZiAoaXNSZXN1bHRTdGVwKGZpcnN0UGFyZW50U3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoZmlyc3RQYXJlbnRTdGVwKTtcbiAgICBjb25zdCBzdGVwID0gY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcbiAgICBjb25zdCByZXN1bHRTdGVwID0gbGVzc29uLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBjb25zdCBsYXN0U3RlcE9yZGVyID0gZ2V0TGFzdFN0ZXBPcmRlcigpO1xuICAgIGlmIChsYXN0U3RlcE9yZGVyID4gMCkge1xuICAgICAgICBzZXRTdGVwT3JkZXIocmVzdWx0U3RlcCwgbGFzdFN0ZXBPcmRlciArIDEpO1xuICAgICAgICBzZXRTdGVwT3JkZXIoc3RlcCwgbGFzdFN0ZXBPcmRlcik7IC8vIGxhc3Qgc3RlcCBiZWZvcmUgcmVzdWx0XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkVG9NYXAobWFwLCBrZXksIG5vZGUpIHtcbiAgICBpZiAoIW1hcC5oYXMoa2V5KSkge1xuICAgICAgICBtYXAuc2V0KGtleSwgW10pO1xuICAgIH1cbiAgICBtYXAuZ2V0KGtleSkucHVzaChub2RlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEJ5Q29sb3IoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGlmICghc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudFN0ZXAgPSBmaW5kUGFyZW50QnlUYWcoc2VsZWN0aW9uWzBdLCAnc3RlcCcpO1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHBhcmVudFN0ZXApO1xuICAgIGlmICghcGFyZW50U3RlcCB8fCBpc1Jlc3VsdFN0ZXAocGFyZW50U3RlcCkgfHwgbGVhdmVzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGZpbGxzQnlDb2xvciA9IG5ldyBNYXAoKTtcbiAgICBsZXQgc3Ryb2tlc0J5Q29sb3IgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHVua25vd25Ob2RlcyA9IFtdO1xuICAgIGZpbmRMZWFmTm9kZXMocGFyZW50U3RlcCkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAoJ2ZpbGxzJyBpbiBuICYmXG4gICAgICAgICAgICBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJlxuICAgICAgICAgICAgbi5maWxscy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBuLmZpbGxzWzBdLnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgIGFkZFRvTWFwKGZpbGxzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5maWxsc1swXS5jb2xvciksIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCdzdHJva2VzJyBpbiBuICYmXG4gICAgICAgICAgICBuLnN0cm9rZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgbi5zdHJva2VzWzBdLnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgIGFkZFRvTWFwKHN0cm9rZXNCeUNvbG9yLCBzdHJpbmdpZnlDb2xvcihuLnN0cm9rZXNbMF0uY29sb3IpLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVua25vd25Ob2Rlcy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZm9yIChsZXQgZmlsbHMgb2YgZmlsbHNCeUNvbG9yLnZhbHVlcygpKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgZmlsbHMpO1xuICAgIH1cbiAgICBmb3IgKGxldCBzdHJva2VzIG9mIHN0cm9rZXNCeUNvbG9yLnZhbHVlcygpKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3Nvbiwgc3Ryb2tlcyk7XG4gICAgfVxuICAgIGlmICh1bmtub3duTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHVua25vd25Ob2Rlcyk7XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgcmVzdWx0IGlzIGxvY2F0ZWQgYXQgdGhlIGVuZFxuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5jaGlsZHJlbi5maW5kKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQucmVtb3ZlKCk7XG4gICAgfVxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcbiAgICAvLyBSZW1vdmUgb3JpZ2luYWwgbm9kZSBpZiB0aGVyZSBhcmUgcmVtYWluc1xuICAgIGlmICghcGFyZW50U3RlcC5yZW1vdmVkKSB7XG4gICAgICAgIHBhcmVudFN0ZXAucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRhZ1Vub3JkZXJlZFN0ZXBzKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gam9pblN0ZXBzKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBjb25zdCBhbGxTdGVwcyA9IHNlbGVjdGlvbi5ldmVyeSgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKTtcbiAgICBjb25zdCBzdGVwcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG4pID0+ICFpc1Jlc3VsdFN0ZXAobikpO1xuICAgIGlmICghYWxsU3RlcHMgfHwgc3RlcHMubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0Tm9kZXMgPSBzdGVwc1xuICAgICAgICAubWFwKChzdGVwKSA9PiBzdGVwLmNoaWxkcmVuLmZpbHRlcigobikgPT4gbi5uYW1lID09PSAnaW5wdXQnICYmIG4udHlwZSA9PT0gJ0dST1VQJykpXG4gICAgICAgIC5mbGF0KCk7XG4gICAgY29uc3QgbGVhdmVzID0gaW5wdXROb2Rlcy5tYXAoKG4pID0+IG4uY2hpbGRyZW4pLmZsYXQoKTtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoc3RlcHNbMF0pO1xuICAgIGNvbnN0IGZpcnN0U3RlcE9yZGVyID0gZ2V0U3RlcE9yZGVyKHN0ZXBzWzBdKTtcbiAgICBjb25zdCBqb2luZWRTdGVwID0gY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcbiAgICBpZiAoZmlyc3RTdGVwT3JkZXIpIHtcbiAgICAgICAgc2V0U3RlcE9yZGVyKGpvaW5lZFN0ZXAsIGZpcnN0U3RlcE9yZGVyKTtcbiAgICB9XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGRpc3BsYXlOb3RpZmljYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZmluZFRleHRzKHRleHRzKSB7XG4gICAgcmV0dXJuIHRleHRzXG4gICAgICAgIC5maW5kQWxsKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJylcbiAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZS52aXNpYmxlKVxuICAgICAgICAucmV2ZXJzZSgpO1xufVxuZnVuY3Rpb24gZ2V0U3R5bGVkU2VnbWVudHMobm9kZSkge1xuICAgIHJldHVybiBub2RlLmdldFN0eWxlZFRleHRTZWdtZW50cyhbXG4gICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICdmb250TmFtZScsXG4gICAgICAgICdmb250V2VpZ2h0JyxcbiAgICAgICAgJ3RleHREZWNvcmF0aW9uJyxcbiAgICAgICAgJ3RleHRDYXNlJyxcbiAgICAgICAgJ2xpbmVIZWlnaHQnLFxuICAgICAgICAnbGV0dGVyU3BhY2luZycsXG4gICAgICAgICdmaWxscycsXG4gICAgICAgICd0ZXh0U3R5bGVJZCcsXG4gICAgICAgICdmaWxsU3R5bGVJZCcsXG4gICAgICAgICdsaXN0T3B0aW9ucycsXG4gICAgICAgICdpbmRlbnRhdGlvbicsXG4gICAgICAgICdoeXBlcmxpbmsnLFxuICAgIF0pO1xufVxuZnVuY3Rpb24gZXNjYXBlKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuICAgICAgICAucmVwbGFjZSgvXFx8L2csICdcXFxcbCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyk7XG59XG5jb25zdCByZXBsYWNlbWVudHMgPSB7ICdcXFxcXFxcXCc6ICdcXFxcJywgJ1xcXFxuJzogJ1xcbicsICdcXFxcXCInOiAnXCInLCAnXFxcXGwnOiAnfCcgfTtcbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICAgIGlmIChzdHIubWF0Y2goL1xcfC8pIHx8IHN0ci5tYXRjaCgvKD88IVxcXFwpXCIvKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcKFxcXFx8bnxcInxsKS9nLCBmdW5jdGlvbiAocmVwbGFjZSkge1xuICAgICAgICByZXR1cm4gcmVwbGFjZW1lbnRzW3JlcGxhY2VdO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVGV4dChub2RlKSB7XG4gICAgcmV0dXJuIGdldFN0eWxlZFNlZ21lbnRzKG5vZGUpXG4gICAgICAgIC5tYXAoKHMpID0+IGVzY2FwZShzLmNoYXJhY3RlcnMpKVxuICAgICAgICAuam9pbignfCcpXG4gICAgICAgIC50cmltRW5kKCk7XG59XG5mdW5jdGlvbiBpbXBvcnRTdHlsZWRTZWdtZW50cyhzZWdtZW50VGV4dHMsIG5vZGUpIHtcbiAgICAvLyB1cGRhdGUgc2VnbWVudHMgaW4gcmV2ZXJzZSBvcmRlclxuICAgIGZvciAobGV0IGkgPSBzZWdtZW50VGV4dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3Qgc2VnbWVudFRleHQgPSBzZWdtZW50VGV4dHNbaV07XG4gICAgICAgIGxldCBzdHlsZXMgPSBnZXRTdHlsZWRTZWdtZW50cyhub2RlKTtcbiAgICAgICAgaWYgKHNlZ21lbnRUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG5vZGUuaW5zZXJ0Q2hhcmFjdGVycyhzdHlsZXNbaV0uZW5kLCBzZWdtZW50VGV4dCwgJ0JFRk9SRScpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuZGVsZXRlQ2hhcmFjdGVycyhzdHlsZXNbaV0uc3RhcnQsIHN0eWxlc1tpXS5lbmQpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRUZXh0cygpIHtcbiAgICBjb25zdCB0ZXh0cyA9IGZpbmRUZXh0cyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgcmV0dXJuICh0ZXh0c1xuICAgICAgICAubWFwKChub2RlKSA9PiBnZXRGb3JtYXR0ZWRUZXh0KG5vZGUpKVxuICAgICAgICAuZmlsdGVyKChzdHIpID0+IHN0ci5sZW5ndGggPiAwKVxuICAgICAgICAvLyByZW1vdmUgYXJyYXkgZHVwbGljYXRlc1xuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcbn1cbmZ1bmN0aW9uIGxvYWRGb250cyh0ZXh0cykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGFsbEZvbnRzID0gW107XG4gICAgICAgIHRleHRzLmZvckVhY2goKHR4dCkgPT4ge1xuICAgICAgICAgICAgZ2V0U3R5bGVkU2VnbWVudHModHh0KS5tYXAoKHMpID0+IHtcbiAgICAgICAgICAgICAgICBhbGxGb250cy5wdXNoKHMuZm9udE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB1bmlxdWVGb250cyA9IGFsbEZvbnRzLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PiBpbmRleCA9PT1cbiAgICAgICAgICAgIHNlbGYuZmluZEluZGV4KCh0KSA9PiB0LmZhbWlseSA9PT0gdmFsdWUuZmFtaWx5ICYmIHQuc3R5bGUgPT09IHZhbHVlLnN0eWxlKSk7XG4gICAgICAgIGZvciAobGV0IGZvbnQgb2YgdW5pcXVlRm9udHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRUZXh0cyh0cmFuc2xhdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRpc3BsYXlOb3RpZmljYXRpb24oJ0VtcHR5IGlucHV0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGV4dHMgPSBmaW5kVGV4dHMoZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICB5aWVsZCBsb2FkRm9udHModGV4dHMpO1xuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFRleHQgPSBnZXRGb3JtYXR0ZWRUZXh0KHR4dCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1tmb3JtYXR0ZWRUZXh0XTtcbiAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcbiAgICAgICAgICAgIGNvbnN0IG9sZFNlZ21lbnRzID0gZm9ybWF0dGVkVGV4dC5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgY29uc3QgbmV3U2VnbWVudHMgPSB0cmFuc2xhdGlvbi5zcGxpdCgnfCcpLm1hcCgoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdW5lc2NhcGUoc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBGYWlsZWQgdG8gdW5lc2NhcGU6ICR7c3RyfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogZGVsZXRlIGFsbCB0ZXh0XG4gICAgICAgICAgICBpZiAobmV3U2VnbWVudHMubGVuZ3RoID09PSAxICYmIG5ld1NlZ21lbnRzWzBdID09PSAnJykge1xuICAgICAgICAgICAgICAgIHR4dC5jaGFyYWN0ZXJzID0gJyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG8gbm90IGFsbG93IHNlZ21lbnRzIGxlbmd0aCBtaXNtYXRjaFxuICAgICAgICAgICAgaWYgKG5ld1NlZ21lbnRzLmxlbmd0aCAhPT0gb2xkU2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFdyb25nIHNlZ21lbnQgY291bnQgKCR7bmV3U2VnbWVudHMubGVuZ3RofSDiiaAgJHtvbGRTZWdtZW50cy5sZW5ndGh9KTogJHtmb3JtYXR0ZWRUZXh0fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheU5vdGlmaWNhdGlvbihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW1wb3J0U3R5bGVkU2VnbWVudHMobmV3U2VnbWVudHMsIHR4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgYWRkVGFnLCBmaW5kQWxsLCBnZXRDdXJyZW50TGVzc29uLCBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE9yZGVyKGxlc3Nvbikge1xuICAgIGlmIChsZXNzb24uZmluZENoaWxkKChuKSA9PiAhIWdldFRhZ3MobikuZmluZCgodCkgPT4gL15vLS8udGVzdCh0KSkpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3VuZCBvLXRhZy4gZm9ybWF0T3JkZXIgYWJvcnQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHNldHRpbmdzID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc2V0dGluZ3MnKSk7XG4gICAgYWRkVGFnKHNldHRpbmdzLCAnb3JkZXItbGF5ZXJzJyk7XG4gICAgY29uc3QgbGF5ZXJSZWdleCA9IC9eKHMtbXVsdGlzdGVwLWJydXNoLXxzLW11bHRpc3RlcC1iZy0pKFxcZCspJC87XG4gICAgY29uc3Qgc3RlcHMgPSBsZXNzb24uZmluZENoaWxkcmVuKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykgJiYgIWdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgYWRkVGFnKHJlc3VsdCwgYG8tJHtzdGVwcy5sZW5ndGggKyAxfWApO1xuICAgIHN0ZXBzLnJldmVyc2UoKS5mb3JFYWNoKChzdGVwLCBvcmRlcikgPT4ge1xuICAgICAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIGNvbnN0IGxheWVyVGFnID0gdGFncy5maW5kKCh0KSA9PiBsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICBsZXQgbGF5ZXIgPSA0O1xuICAgICAgICBpZiAobGF5ZXJUYWcpIHtcbiAgICAgICAgICAgIGxheWVyID0gcGFyc2VJbnQobGF5ZXJSZWdleC5leGVjKGxheWVyVGFnKVsyXSk7XG4gICAgICAgICAgICB0YWdzID0gdGFncy5maWx0ZXIoKHQpID0+ICFsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgL14ocy1tdWx0aXN0ZXAtYnJ1c2h8cy1tdWx0aXN0ZXAtYmcpLy5leGVjKGxheWVyVGFnKVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RlcC5zZXRQbHVnaW5EYXRhKCdsYXllcicsIEpTT04uc3RyaW5naWZ5KGxheWVyKSk7XG4gICAgICAgIHRhZ3MucHVzaChgby0ke29yZGVyICsgMX1gKTtcbiAgICAgICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG4gICAgfSk7XG4gICAgbGV0IHNvcnRlZFN0ZXBzID0gc3RlcHMuc29ydCgoYSwgYikgPT4gSlNPTi5wYXJzZShiLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpIC1cbiAgICAgICAgSlNPTi5wYXJzZShhLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpKTtcbiAgICBzb3J0ZWRTdGVwcy5mb3JFYWNoKChzKSA9PiBsZXNzb24uaW5zZXJ0Q2hpbGQoMSwgcykpO1xufVxuZnVuY3Rpb24gYXV0b0Zvcm1hdCgpIHtcbiAgICBjb25zdCB0aHVtYlBhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZS50b1VwcGVyQ2FzZSgpID09ICdUSFVNQk5BSUxTJyk7XG4gICAgaWYgKHRodW1iUGFnZSkge1xuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gdGh1bWJQYWdlLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XG4gICAgICAgICAgICBjbG9uZS5yZXNpemUoNDAwLCA0MDApO1xuICAgICAgICAgICAgY2xvbmUubmFtZSA9ICd0aHVtYm5haWwnO1xuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICBpZiAob2xkTGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSAnbGVzc29uJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnkgPSBsZXNzb25GcmFtZS55O1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xuICAgICAgICBuLnggPSAxMDtcbiAgICAgICAgbi55ID0gMTA7XG4gICAgfSk7XG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gbm9kZS50eXBlID09ICdURVhUJykuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBhZGRUYWcobiwgJ25vLW1pcnJvcicpO1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec3RlcCBzLW11bHRpc3RlcC1yZXN1bHQvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLmNoaWxkcmVuWzBdLm5hbWUgPSAndGVtcGxhdGUnO1xuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSAnL2lnbm9yZSc7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSA2MDtcbiAgICB9KTtcbn1cbm9uKCdhdXRvRm9ybWF0JywgYXV0b0Zvcm1hdCk7XG5vbignZm9ybWF0T3JkZXInLCAoKSA9PiBmb3JtYXRPcmRlcihnZXRDdXJyZW50TGVzc29uKCkpKTtcbiIsImltcG9ydCAnLi9jcmVhdGUnO1xuaW1wb3J0ICcuL3R1bmUnO1xuaW1wb3J0ICcuL2Zvcm1hdCc7XG5pbXBvcnQgJy4vbGludGVyJztcbmltcG9ydCAnLi9wdWJsaXNoJztcbmltcG9ydCAnLi4vcnBjLWFwaSc7XG5pbXBvcnQgeyBjdXJyZW50UGFnZUNoYW5nZWQsIHNlbGVjdGlvbkNoYW5nZWQsIHVwZGF0ZURpc3BsYXkgfSBmcm9tICcuL3R1bmUnO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcbmZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ3MCk7XG5jb25zb2xlLmNsZWFyKCk7XG5maWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xuICAgIHNlbGVjdGlvbkNoYW5nZWQoKTtcbn0pO1xuZmlnbWEub24oJ2N1cnJlbnRwYWdlY2hhbmdlJywgKCkgPT4ge1xuICAgIGN1cnJlbnRQYWdlQ2hhbmdlZChmaWdtYS5jdXJyZW50UGFnZSk7XG59KTtcbnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xufSwgMTUwMCk7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGdldFRhZ3MsIGZpbmRBbGwsIGZpbmRUYWcsIGRlc2NlbmRhbnRzIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IHVwZGF0ZURpc3BsYXkgfSBmcm9tICcuL3R1bmUnO1xubGV0IGVycm9ycyA9IFtdO1xubGV0IHpvb21TY2FsZSA9IDE7XG5sZXQgbWF4QnMgPSAxMi44O1xubGV0IG9yZGVyID0gJ3N0ZXBzJztcbmV4cG9ydCB2YXIgRXJyb3JMZXZlbDtcbihmdW5jdGlvbiAoRXJyb3JMZXZlbCkge1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIkVSUk9SXCJdID0gMF0gPSBcIkVSUk9SXCI7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiV0FSTlwiXSA9IDFdID0gXCJXQVJOXCI7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiSU5GT1wiXSA9IDJdID0gXCJJTkZPXCI7XG59KShFcnJvckxldmVsIHx8IChFcnJvckxldmVsID0ge30pKTtcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RFcnJvcihpbmRleCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKChfYSA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYWdlKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzW2luZGV4XS5wYWdlO1xuICAgIH1cbiAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHsgLy8gY3Jhc2hlcywgcHJvYmFibHkgYmVjYXVzZSBvZiBzZWxlY3Rpb24gaGFwcGVuaW5nIGZyb20gdGhlIERpc3BsYXlGb3JtXG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1tpbmRleF0ucGFnZS5zZWxlY3Rpb24gPSBbZXJyb3JzW2luZGV4XS5ub2RlXTtcbiAgICB9XG4gICAgLy8gfSwgMClcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludEVycm9ycygpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBzYXZlZEVycm9ycyA9IHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ2Vycm9yc0ZvclByaW50Jyk7XG4gICAgICAgIGxldCBzb3J0ZWRFcnJvcnMgPSBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpXG4gICAgICAgICAgICAubWFwKChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWdub3JlOiBlLmlnbm9yZSxcbiAgICAgICAgICAgICAgICBwYWdlTmFtZTogKF9hID0gZS5wYWdlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSxcbiAgICAgICAgICAgICAgICBub2RlTmFtZTogKF9iID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubmFtZSxcbiAgICAgICAgICAgICAgICBub2RlVHlwZTogKF9jID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MudHlwZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZS5lcnJvcixcbiAgICAgICAgICAgICAgICBsZXZlbDogZS5sZXZlbCxcbiAgICAgICAgICAgICAgICBlcnJvckNvbG9yOiBlLmxldmVsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzYXZlZEVycm9ycykge1xuICAgICAgICAgICAgc29ydGVkRXJyb3JzID0gc29ydGVkRXJyb3JzLm1hcCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhdmVkRXJyb3IgPSBzYXZlZEVycm9ycy5maW5kKChzKSA9PiBzLnBhZ2VOYW1lID09PSBlLnBhZ2VOYW1lICYmIHMubm9kZU5hbWUgPT09IGUubm9kZU5hbWUgJiYgcy5lcnJvciA9PT0gZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgaWYgKHNhdmVkRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5pZ25vcmUgPSBzYXZlZEVycm9yLmlnbm9yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWxlY3RFcnJvcigwKTtcbiAgICAgICAgcmV0dXJuIHNvcnRlZEVycm9ycztcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGFzc2VydCh2YWwsIGVycm9yLCBwYWdlLCBub2RlLCBsZXZlbCA9IEVycm9yTGV2ZWwuRVJST1IpIHtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgICBlcnJvcnMucHVzaCh7IG5vZGUsIHBhZ2UsIGVycm9yLCBsZXZlbCB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmZ1bmN0aW9uIGRlZXBOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlZXBOb2RlcyhuKSk7XG59XG5mdW5jdGlvbiBsaW50RmlsbHMobm9kZSwgcGFnZSwgZmlsbHMpIHtcbiAgICBjb25zdCByZ2J0ID0gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKTtcbiAgICBmaWxscy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICAgIGFzc2VydChmLnZpc2libGUsICdGaWxsIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoZi50eXBlID09ICdTT0xJRCcgfHwgIXJnYnQsICdGaWxsIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgaWYgKGYudHlwZSA9PT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgYXNzZXJ0KGYub3BhY2l0eSA9PSAxLCAnSW1hZ2UgZmlsbCBtdXN0IG5vdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gbGludFN0cm9rZXMobm9kZSwgcGFnZSwgc3Ryb2tlcykge1xuICAgIGNvbnN0IHJnYnQgPSBmaW5kVGFnKG5vZGUsIC9ecmdiLXRlbXBsYXRlJC8pO1xuICAgIHN0cm9rZXMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBhc3NlcnQocy52aXNpYmxlLCAnU3Ryb2tlIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQocy50eXBlID09ICdTT0xJRCcgfHwgIXJnYnQsICdTdHJva2UgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBpZiAocy50eXBlID09PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICBhc3NlcnQocy5vcGFjaXR5ID09IDEsICdJbWFnZSBzdHJva2UgbXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgL1JPVU5EfE5PTkUvLnRlc3QoU3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKSksIGBTdHJva2UgY2FwcyBtdXN0IGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VDYXApfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLkVSUk9SKTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IG5vZGUuc3Ryb2tlSm9pbiA9PSAnUk9VTkQnLCBgU3Ryb2tlIGpvaW5zIHNob3VsZCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlSm9pbil9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG59XG5jb25zdCB2YWxpZFZlY3RvclRhZ3MgPSAvXlxcL3xeZHJhdy1saW5lJHxeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJHxeZmxpcCR8Xlt2Vl1lY3RvciR8XlxcZCskfF5FbGxpcHNlJHxeUmVjdGFuZ2xlJHxeZmx5LWZyb20tYm90dG9tJHxeZmx5LWZyb20tbGVmdCR8XmZseS1mcm9tLXJpZ2h0JHxeYXBwZWFyJHxed2lnZ2xlLVxcZCskLztcbmZ1bmN0aW9uIGxpbnRWZWN0b3IocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KHZhbGlkVmVjdG9yVGFncy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgbGV0IGZpbGxzID0gbm9kZS5maWxscztcbiAgICBsZXQgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcztcbiAgICBhc3NlcnQoIWZpbGxzLmxlbmd0aCB8fCAhc3Ryb2tlcy5sZW5ndGgsICdTaG91bGQgbm90IGhhdmUgZmlsbCtzdHJva2UnLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIGNvbnN0IHJnYnQgPSBmaW5kVGFnKG5vZGUsIC9ecmdiLXRlbXBsYXRlJC8pO1xuICAgIGNvbnN0IGFuaW0gPSBmaW5kVGFnKG5vZGUsIC9eZHJhdy1saW5lJHxeYmxpbmskLyk7XG4gICAgbGludFN0cm9rZXMobm9kZSwgcGFnZSwgc3Ryb2tlcyk7XG4gICAgbGludEZpbGxzKG5vZGUsIHBhZ2UsIGZpbGxzKTtcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cbn1cbmNvbnN0IHZhbGlkR3JvdXBUYWdzID0gL15cXC98XmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyR8XmZseS1mcm9tLWJvdHRvbSR8XmZseS1mcm9tLWxlZnQkfF5mbHktZnJvbS1yaWdodCR8XmFwcGVhciR8XndpZ2dsZS1cXGQrJHxeZHJhdy1saW5lJHxeXFxkKyR8XltnR11yb3VwJC87XG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydCghL0JPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KG5vZGUudHlwZSksICdOb3RpY2UgQk9PTEVBTl9PUEVSQVRJT04nLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KHZhbGlkR3JvdXBUYWdzLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJC8udGVzdChzKSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5mdW5jdGlvbiBsaW50SW5wdXQocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLm5hbWUgPT0gJ2lucHV0JywgXCJNdXN0IGJlICdpbnB1dCdcIiwgcGFnZSwgbm9kZSk7XG4gICAgZGVzY2VuZGFudHMobm9kZSkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuY29uc3QgdmFsaWRTZXR0aW5nc1RhZ3MgPSAvXlxcL3xec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC87XG5mdW5jdGlvbiBsaW50U2V0dGluZ3MocGFnZSwgbm9kZSkge1xuICAgIHZhciBfYTtcbiAgICBhc3NlcnQobm9kZS50eXBlID09ICdFTExJUFNFJywgXCJNdXN0IGJlICdFTExJUFNFJyB0eXBlJ1wiLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQodmFsaWRTZXR0aW5nc1RhZ3MudGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xuICAgICAgICBvcmRlciA9ICdsYXllcnMnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3JkZXIgPSAnc3RlcHMnO1xuICAgIH1cbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnem9vbS1zY2FsZS0nLCAnJykpIHx8XG4gICAgICAgICcxJyk7XG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xufVxuY29uc3QgdmFsaWRTdGVwVGFncyA9IC9eXFwvfF5zdGVwJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwLWJydXNoJHxecy1jb250aW51ZSR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XmNsZWFyLWxheWVyLShcXGQrLD8pKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJHxeYWxsb3ctdW5kbyR8XnNoYXJlLWJ1dHRvbiR8XmNsZWFyLWJlZm9yZSQvO1xuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGlmICghYXNzZXJ0KHN0ZXAudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBzdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChzdGVwLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCh2YWxpZFN0ZXBUYWdzLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgLy8gYXNzZXJ0KCEvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYmckLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgaXMgb2Jzb2xldGVgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIH0pO1xuICAgIGNvbnN0IGJnID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJnJHxecy1tdWx0aXN0ZXAtYmctXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJydXNoID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IHNzID0gcGFyc2VJbnQoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnNzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3NzLScsICcnKSk7XG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KChfYiA9IHRhZ3MuZmluZCgocykgPT4gL15icy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZXBsYWNlKCdicy0nLCAnJykpO1xuICAgIGNvbnN0IGJydXNoTmFtZSA9IChfYyA9IHRhZ3NcbiAgICAgICAgLmZpbmQoKHMpID0+IC9eYnJ1c2gtbmFtZS1cXHcrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZXBsYWNlKCdicnVzaC1uYW1lLScsICcnKTtcbiAgICBjb25zdCB0ZXJtaW5hbE5vZGVzID0gZGVzY2VuZGFudHMoc3RlcCkuZmlsdGVyKCh2KSA9PiB2WydjaGlsZHJlbiddID09IHVuZGVmaW5lZCk7XG4gICAgY29uc3QgbWF4U2l6ZSA9IHRlcm1pbmFsTm9kZXMucmVkdWNlKChhY2MsIHYpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGFjYywgdi53aWR0aCwgdi5oZWlnaHQpO1xuICAgIH0sIDApO1xuICAgIG1heEJzID0gTWF0aC5tYXgoYnMgPyBicyA6IG1heEJzLCBtYXhCcyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCBtYXhTaXplIDw9IDEwMCwgYFNob3VsZCBub3QgdXNlIHNzPDIwIHdpdGggbG9uZyBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7bWF4U2l6ZX0+MTAwYCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDIwIHx8IHRlcm1pbmFsTm9kZXMubGVuZ3RoIDw9IDgsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIHRvbyBtYW55IGxpbmVzLiBDb25zaWRlciB1c2luZyBiZyB0ZW1wbGF0ZS4gJHt0ZXJtaW5hbE5vZGVzLmxlbmd0aH0+OGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSAxMCB8fCBicnVzaE5hbWUgPT0gJ3BlbmNpbCcsIGBTaG91bGQgbm90IHVzZSBiczwxMC4gJHtic308MTBgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsICdzcyBtdXN0IGJlID49IDE1JywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFzcyB8fCAhYnMgfHwgc3MgPiBicywgJ3NzIG11c3QgYmUgPiBicycsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPD0gem9vbVNjYWxlICogMTIuOCwgYGJzIG11c3QgYmUgPD0gJHt6b29tU2NhbGUgKiAxMi44fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gJ2xheWVycycsIGAke299IG11c3QgYmUgdXNlZCBvbmx5IHdpdGggc2V0dGluZ3Mgb3JkZXItbGF5ZXJzYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KG9yZGVyICE9PSAnbGF5ZXJzJyB8fCAhIW8sICdNdXN0IGhhdmUgby1OIG9yZGVyIG51bWJlcicsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHNmID0gc3RlcC5maW5kT25lKChuKSA9PiB7IHZhciBfYTsgcmV0dXJuIGdldFRhZ3MobikuaW5jbHVkZXMoJ3JnYi10ZW1wbGF0ZScpICYmICgoX2EgPSBuLnN0cm9rZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMDsgfSk7XG4gICAgY29uc3QgZmZzID0gc3RlcC5maW5kQWxsKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSAmJiBuLmZpbGxzICYmIG4uZmlsbHNbMF0pO1xuICAgIGNvbnN0IGJpZ0ZmcyA9IGZmcy5maWx0ZXIoKG4pID0+IG4ud2lkdGggPiAyNyB8fCBuLmhlaWdodCA+IDI3KTtcbiAgICBjb25zdCBmZiA9IGZmcy5sZW5ndGggPiAwO1xuICAgIGFzc2VydCghKGJnICYmIHNzICYmIHNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2UgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghKGJnICYmIHNzICYmICFzZiksICdTaG91bGQgbm90IHVzZSBiZytzcyAoc3Ryb2tlIG5vdCBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgYXNzZXJ0KCFiZyB8fCBmZiwgXCJiZyBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGhvdXQgZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIWJydXNoIHx8IGJpZ0Zmcy5sZW5ndGggPT0gMCwgXCJicnVzaCBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGggZmlsbGVkLWluIHZlY3RvcnMgKHNpemUgPiAyNylcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBzdGVwLmNoaWxkcmVuLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgaWYgKG4ubmFtZSA9PSAnaW5wdXQnKSB7XG4gICAgICAgICAgICBsaW50SW5wdXQocGFnZSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobi5uYW1lID09PSAndGVtcGxhdGUnKSB7XG4gICAgICAgICAgICAvLyBsaW50IHRlbXBsYXRlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnaW5wdXQnIG9yICd0ZW1wbGF0ZSdcIiwgcGFnZSwgbik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBibGlua05vZGVzID0gZmluZEFsbChzdGVwLCAobikgPT4gZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXmJsaW5rJC8udGVzdCh0KSkgIT09IHVuZGVmaW5lZCkuZmxhdE1hcChkZWVwTm9kZXMpO1xuICAgIGNvbnN0IGZpbGxlZE5vZGUgPSBibGlua05vZGVzLmZpbmQoKG4pID0+IG4uZmlsbHNbMF0pO1xuICAgIGFzc2VydChibGlua05vZGVzLmxlbmd0aCA9PSAwIHx8ICEhZmlsbGVkTm9kZSB8fCBibGlua05vZGVzLmxlbmd0aCA+IDMsICdTaG91bGQgdXNlIGRyYXctbGluZSBpZiA8IDQgbGluZXMnLCBwYWdlLCBibGlua05vZGVzWzBdLCBFcnJvckxldmVsLklORk8pO1xufVxuZnVuY3Rpb24gbGludFRhc2tGcmFtZShwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSAxMzY2ICYmIG5vZGUuaGVpZ2h0ID09IDEwMjQsICdNdXN0IGJlIDEzNjZ4MTAyNCcsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghIW5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpLCBcIk11c3QgaGF2ZSAncy1tdWx0aXN0ZXAtcmVzdWx0JyBjaGlsZFwiLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgc2V0dGluZ3MgPSBub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKTtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcbiAgICB9XG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShcXGQrKSQvLmV4ZWModGFnKTtcbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvID0gZm91bmRbMV07XG4gICAgICAgICAgICBhc3NlcnQoIW9yZGVyTnVtYmVyc1tvXSwgYE11c3QgaGF2ZSB1bmlxdWUgJHt0YWd9IHZhbHVlc2AsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBvcmRlck51bWJlcnNbb10gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKSB7XG4gICAgICAgICAgICBsaW50U3RlcChwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdzZXR0aW5ncycgb3IgJ3N0ZXAnXCIsIHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGFzc2VydChcbiAgICAvLyAgIG1heEJzID4gKHpvb21TY2FsZSAtIDEpICogMTIuOCxcbiAgICAvLyAgIGB6b29tLXNjYWxlICR7em9vbVNjYWxlfSBtdXN0IGJlICR7TWF0aC5jZWlsKFxuICAgIC8vICAgICBtYXhCcyAvIDEyLjhcbiAgICAvLyAgICl9IGZvciBtYXggYnMgJHttYXhCc30gdXNlZGAsXG4gICAgLy8gICBwYWdlLFxuICAgIC8vICAgbm9kZVxuICAgIC8vIClcbn1cbmZ1bmN0aW9uIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnRlJBTUUnLCBcIk11c3QgYmUgJ0ZSQU1FJyB0eXBlXCIsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSA0MDAgJiYgbm9kZS5oZWlnaHQgPT0gNDAwLCAnTXVzdCBiZSA0MDB4NDAwJywgcGFnZSwgbm9kZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbGludFBhZ2UoY3VycmVudFBhZ2UsIGFwcGVuZEVycm9ycykge1xuICAgIGlmICghYXBwZW5kRXJyb3JzKSB7XG4gICAgICAgIGVycm9ycyA9IFtdO1xuICAgIH1cbiAgICBjb25zdCBwYWdlID0gY3VycmVudFBhZ2UgPyBjdXJyZW50UGFnZSA6IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmICgvXlxcL3xeSU5ERVgkLy50ZXN0KHBhZ2UubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVEaXNwbGF5KHBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgIGlmICghYXNzZXJ0KC9eW2EtelxcLTAtOV0rJC8udGVzdChwYWdlLm5hbWUpLCBgUGFnZSBuYW1lICcke3BhZ2UubmFtZX0nIG11c3QgbWF0Y2ggW2EtelxcXFwtMC05XSsuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9ebGVzc29uJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICdsZXNzb24nXCIsIHBhZ2UpO1xuICAgIGZvciAobGV0IG5vZGUgb2YgcGFnZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAobm9kZS5uYW1lID09ICdsZXNzb24nKSB7XG4gICAgICAgICAgICBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUubmFtZSA9PSAndGh1bWJuYWlsJykge1xuICAgICAgICAgICAgbGludFRodW1ibmFpbChwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydCgvXlxcLy8udGVzdChub2RlLm5hbWUpLCBcIk11c3QgYmUgJ3RodW1ibmFpbCcgb3IgJ2xlc3NvbicuIFVzZSBzbGFzaCB0byAvaWdub3JlLlwiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcmludEVycm9ycygpO1xufVxuZnVuY3Rpb24gbGludEluZGV4KHBhZ2UpIHtcbiAgICBpZiAoIWFzc2VydChwYWdlLmNoaWxkcmVuLmxlbmd0aCA9PSAxLCAnSW5kZXggcGFnZSBtdXN0IGNvbnRhaW4gZXhhY3RseSAxIGVsZW1lbnQnLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XG4gICAgbGludFRodW1ibmFpbChwYWdlLCBwYWdlLmNoaWxkcmVuWzBdKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBsaW50Q291cnNlKCkge1xuICAgIGVycm9ycyA9IFtdO1xuICAgIGFzc2VydCgvXkNPVVJTRS1bYS16XFwtMC05XSskLy50ZXN0KGZpZ21hLnJvb3QubmFtZSksIGBDb3Vyc2UgbmFtZSAnJHtmaWdtYS5yb290Lm5hbWV9JyBtdXN0IG1hdGNoIENPVVJTRS1bYS16XFxcXC0wLTldK2ApO1xuICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUgPT0gJ0lOREVYJyk7XG4gICAgaWYgKGFzc2VydCghIWluZGV4LCBcIk11c3QgaGF2ZSAnSU5ERVgnIHBhZ2VcIikpIHtcbiAgICAgICAgbGludEluZGV4KGluZGV4KTtcbiAgICB9XG4gICAgLy8gZmluZCBhbGwgbm9uLXVuaXF1ZSBuYW1lZCBwYWdlc1xuICAgIGNvbnN0IG5vblVuaXF1ZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmlsdGVyKChwLCBpLCBhKSA9PiBhLmZpbmRJbmRleCgocDIpID0+IHAyLm5hbWUgPT0gcC5uYW1lKSAhPSBpKTtcbiAgICBub25VbmlxdWUuZm9yRWFjaCgocCkgPT4gYXNzZXJ0KGZhbHNlLCBgUGFnZSBuYW1lICcke3AubmFtZX0nIG11c3QgYmUgdW5pcXVlYCwgcCkpO1xuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBsaW50UGFnZShwYWdlLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHByaW50RXJyb3JzKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUVycm9ycyhlcnJvcnNGb3JQcmludCkge1xuICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdlcnJvcnNGb3JQcmludCcsIGVycm9yc0ZvclByaW50KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgcHJpbnQgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBcInRhc2stbmFtZSAke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiID0gXCIke2NhcGl0YWxpemUocGFnZS5uYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRMZXNzb24ocGFnZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5pbmRleE9mKHBhZ2UpO1xuICAgICAgICBjb25zdCBsZXNzb25Ob2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBjb25zdCB0aHVtYm5haWxOb2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xuICAgICAgICBpZiAoIWxlc3Nvbk5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlID0geWllbGQgbGVzc29uTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdTVkcnLFxuICAgICAgICAgICAgLy8gc3ZnT3V0bGluZVRleHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3ZnSWRBdHRyaWJ1dGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0aHVtYm5haWwgPSB5aWVsZCB0aHVtYm5haWxOb2RlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1dJRFRIJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3Vyc2VQYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIHBhdGg6IHBhZ2UubmFtZSxcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDb3Vyc2UoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgW2xlc3NvbnMsIHRodW1ibmFpbF0gPSB5aWVsZCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBQcm9taXNlLmFsbChmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocGFnZSkgPT4gcGFnZS5uYW1lICE9ICdJTkRFWCcpXG4gICAgICAgICAgICAgICAgLm1hcCgocGFnZSkgPT4gZXhwb3J0TGVzc29uKHBhZ2UpKSksXG4gICAgICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbmQoKHBhZ2UpID0+IHBhZ2UubmFtZSA9PSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnUE5HJyxcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKCdDT1VSU0UtJywgJycpLFxuICAgICAgICAgICAgbGVzc29ucyxcbiAgICAgICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgc3dpZnRDb3Vyc2VOYW1lID0gY291cnNlTmFtZVxuICAgICAgICAuc3BsaXQoJy0nKVxuICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9XG4gICAgICAgIHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiwgcHJvOiB0cnVlKSxcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgIGxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXG4gICAgYXV0aG9yOiBSRVBMQUNFLFxuICAgIHRhc2tzOiBbXG4ke3Rhc2tzfSAgICBdKVxuYDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xuICAgIHByaW50KGNvZGUpO1xufVxub24oJ2dlbmVyYXRlQ29kZScsIGdlbmVyYXRlQ29kZSk7XG4iLCJpbXBvcnQgeyBnZXRMYXN0U3RlcE9yZGVyIH0gZnJvbSAnLi9jcmVhdGUnO1xuaW1wb3J0IHsgZ2V0VGFncywgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3Nvbiwgc2V0U3RlcE9yZGVyIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRQYWludENvbG9yKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgbGV0IHsgciwgZywgYiB9ID0gcGFpbnQuY29sb3I7XG4gICAgICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xuICAgICAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcbiAgICAgICAgYiA9IE1hdGgucm91bmQoYiAqIDI1NSk7XG4gICAgICAgIHJldHVybiB7IHIsIGcsIGIsIGE6IDEgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IHI6IDE2NiwgZzogMTY2LCBiOiAxNjYsIGE6IDEgfTtcbiAgICB9XG59XG5mdW5jdGlvbiBkaXNwbGF5Q29sb3IoeyByLCBnLCBiLCBhIH0pIHtcbiAgICByZXR1cm4gYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgO1xufVxuZnVuY3Rpb24gZ2V0Q29sb3JzKG5vZGUpIHtcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAgfTsgLy8gdHJhbnNwYXJlbnQgPSBkZWZhdWx0IGNvbG9yXG4gICAgbGV0IGZpbGxzID0gZGVmYXVsdENvbG9yO1xuICAgIGxldCBzdHJva2VzID0gZGVmYXVsdENvbG9yO1xuICAgIGNvbnN0IGxlYWYgPSBmaW5kTGVhZk5vZGVzKG5vZGUpWzBdO1xuICAgIGlmICgnZmlsbHMnIGluIGxlYWYgJiYgbGVhZi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbGVhZi5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpbGxzID0gZ2V0UGFpbnRDb2xvcihsZWFmLmZpbGxzWzBdKTtcbiAgICB9XG4gICAgaWYgKCdzdHJva2VzJyBpbiBsZWFmICYmIGxlYWYuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cm9rZXMgPSBnZXRQYWludENvbG9yKGxlYWYuc3Ryb2tlc1swXSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbGxzQ29sb3I6IGRpc3BsYXlDb2xvcihmaWxscyksXG4gICAgICAgIHN0cm9rZXNDb2xvcjogZGlzcGxheUNvbG9yKHN0cm9rZXMpLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcHMoKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHJldHVybiBzdGVwc0J5T3JkZXIobGVzc29uKS5tYXAoKHN0ZXApID0+IHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IHN0ZXAuaWQsIG5hbWU6IHN0ZXAubmFtZSwgY29sb3JzOiBnZXRDb2xvcnMoc3RlcCksIGxheWVyTnVtYmVyOiBsZXNzb24uY2hpbGRyZW4uaW5kZXhPZihzdGVwKSArIDEgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwc09yZGVyKHN0ZXBzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGxlc3Nvbi5maW5kT25lKChlbCkgPT4gZWwuaWQgPT0gc3RlcC5pZCk7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICBzZXRTdGVwT3JkZXIocywgaSArIDEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gdGFnVW5vcmRlcmVkU3RlcHMoKSB7XG4gICAgbGV0IHN0YXJ0V2l0aCA9IGdldExhc3RTdGVwT3JkZXIoKSArIDE7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHN0ZXBzQnlPcmRlcihsZXNzb24pXG4gICAgICAgIC5maWx0ZXIoKHMpID0+ICFnZXRUYWdzKHMpLnNvbWUoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkpXG4gICAgICAgIC5mb3JFYWNoKChzdGVwLCBpKSA9PiBzZXRTdGVwT3JkZXIoc3RlcCwgaSArIHN0YXJ0V2l0aCkpO1xufVxuIiwiaW1wb3J0IHsgZW1pdCwgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgZGVzY2VuZGFudHMsIGZpbmRMZWFmTm9kZXMsIGdldEN1cnJlbnRMZXNzb24sIGdldFN0ZXBPcmRlciwgZ2V0VGFncywgaXNSZXN1bHRTdGVwLCB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBnZXRUYWcoc3RlcCwgdGFnKSB7XG4gICAgY29uc3QgdiA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKHRhZykpO1xuICAgIHJldHVybiB2ID8gdi5yZXBsYWNlKHRhZywgJycpIDogbnVsbDtcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZWxldGVUbXAoKSB7XG4gICAgZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBlbC5uYW1lLnN0YXJ0c1dpdGgoJ3RtcC0nKSlcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG59XG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcbmxldCBsYXN0UGFnZTtcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBnZXRUYWdzKGVsKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykpXG4gICAgICAgIC5tYXAoKGVsKSA9PiBmaW5kTGVhZk5vZGVzKGVsKSlcbiAgICAgICAgLmZsYXQoKVxuICAgICAgICAuZmlsdGVyKChlbCkgPT4gL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KGVsLnR5cGUpKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgY29uc3QgZGVmYXVsdFdlaWdodCA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDMwIDogNTA7XG4gICAgICAgIGNvbnN0IHNzID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgZGVmYXVsdFdlaWdodDtcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCAmJiBlbC5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBncmVlbiA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBncmVlbi5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMSwgYjogMCB9IH1dO1xuICAgICAgICAgICAgZ3JlZW4uc3Ryb2tlV2VpZ2h0ICs9IHNzO1xuICAgICAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQoZ3JlZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5zdHJva2VzLmxlbmd0aCA+IDAgJiYgIWVsLmZpbGxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZ3JlZW4gPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZ3JlZW4uc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDEsIGI6IDAgfSB9XTtcbiAgICAgICAgICAgIGdyZWVuLnN0cm9rZVdlaWdodCA9IHNzICogMS4xO1xuICAgICAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQoZ3JlZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwICYmICFlbC5zdHJva2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZ3JlZW4gPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZ3JlZW4uc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDEsIGI6IDAgfSB9XTtcbiAgICAgICAgICAgIGdyZWVuLnN0cm9rZVdlaWdodCA9IHNzO1xuICAgICAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQoZ3JlZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5zdHJva2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJsdWUgPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgYmx1ZS5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgYmx1ZS5zdHJva2VXZWlnaHQgPSBzcztcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKGJsdWUpO1xuICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBwaW5rLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICBwaW5rLm5hbWUgPSAncGluayAnICsgZWwubmFtZTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxsc0JsdWUgPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgZmlsbHNCbHVlLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQoZmlsbHNCbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGxlc3Nvbi5hcHBlbmRDaGlsZCh0ZW1wbGF0ZSk7XG4gICAgdGVtcGxhdGUucmVsYXRpdmVUcmFuc2Zvcm0gPSBpbnB1dC5yZWxhdGl2ZVRyYW5zZm9ybTtcbn1cbmZ1bmN0aW9uIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKSB7XG4gICAgY29uc3QgZGVmYXVsdEJTID0gZ2V0VGFnKHN0ZXAsICdzLScpID09ICdtdWx0aXN0ZXAtYmcnID8gMTIuOCA6IDEwO1xuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdicy0nKSkgfHwgZGVmYXVsdEJTO1xuICAgIGNvbnN0IHNtYWxsTGluZSA9IGZpZ21hLmNyZWF0ZUxpbmUoKTtcbiAgICBzbWFsbExpbmUubmFtZSA9ICdzbWFsbExpbmUnO1xuICAgIHNtYWxsTGluZS5yZXNpemUoMzAwLCAwKTtcbiAgICBzbWFsbExpbmUuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDAuOCwgYjogMCB9IH1dO1xuICAgIHNtYWxsTGluZS5zdHJva2VXZWlnaHQgPSBicyAvIDM7XG4gICAgc21hbGxMaW5lLnN0cm9rZUNhcCA9ICdST1VORCc7XG4gICAgc21hbGxMaW5lLnN0cm9rZUFsaWduID0gJ0NFTlRFUic7XG4gICAgc21hbGxMaW5lLnkgPSBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcbiAgICBjb25zdCBtZWRpdW1MaW5lID0gc21hbGxMaW5lLmNsb25lKCk7XG4gICAgbWVkaXVtTGluZS5uYW1lID0gJ21lZGl1bUxpbmUnO1xuICAgIG1lZGl1bUxpbmUub3BhY2l0eSA9IDAuMjtcbiAgICBtZWRpdW1MaW5lLnN0cm9rZVdlaWdodCA9IGJzO1xuICAgIG1lZGl1bUxpbmUueSA9IG1lZGl1bUxpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcbiAgICBjb25zdCBiaWdMaW5lID0gc21hbGxMaW5lLmNsb25lKCk7XG4gICAgYmlnTGluZS5uYW1lID0gJ2JpZ0xpbmUnO1xuICAgIGJpZ0xpbmUub3BhY2l0eSA9IDAuMTtcbiAgICBiaWdMaW5lLnN0cm9rZVdlaWdodCA9IGJzICsgTWF0aC5wb3coYnMsIDEuNCkgKiAwLjg7XG4gICAgYmlnTGluZS55ID0gYmlnTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IGdyb3VwID0gZmlnbWEuZ3JvdXAoW2JpZ0xpbmUsIG1lZGl1bUxpbmUsIHNtYWxsTGluZV0sIGxlc3Nvbi5wYXJlbnQpO1xuICAgIGdyb3VwLm5hbWUgPSAndG1wLWJzJztcbiAgICBncm91cC54ID0gbGVzc29uLng7XG4gICAgZ3JvdXAueSA9IGxlc3Nvbi55IC0gODA7XG59XG5mdW5jdGlvbiBnZXRCcnVzaFNpemUoc3RlcCkge1xuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMoc3RlcCk7XG4gICAgY29uc3Qgc3Ryb2tlcyA9IGxlYXZlcy5maWx0ZXIoKG4pID0+ICdzdHJva2VzJyBpbiBuICYmIG4uc3Ryb2tlcy5sZW5ndGggPiAwKTtcbiAgICBjb25zdCBzdHJva2VXZWlnaHRzQXJyID0gc3Ryb2tlcy5tYXAoKG5vZGUpID0+IG5vZGVbJ3N0cm9rZVdlaWdodCddIHx8IDApO1xuICAgIGNvbnN0IG1heFdlaWdodCA9IE1hdGgubWF4KC4uLnN0cm9rZVdlaWdodHNBcnIpO1xuICAgIHJldHVybiBzdHJva2VzLmxlbmd0aCA+IDAgPyBtYXhXZWlnaHQgOiAyNTtcbn1cbmZ1bmN0aW9uIGdldENsZWFyTGF5ZXJOdW1iZXJzKHN0ZXApIHtcbiAgICBjb25zdCBwcmVmaXggPSAnY2xlYXItbGF5ZXItJztcbiAgICBjb25zdCBjbGVhckxheWVyc1N0ZXAgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodGFnKSA9PiB0YWcuc3RhcnRzV2l0aChwcmVmaXgpKTtcbiAgICBpZiAoY2xlYXJMYXllcnNTdGVwLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IGxheWVyTnVtYmVycyA9IGNsZWFyTGF5ZXJzU3RlcFswXVxuICAgICAgICAuc2xpY2UocHJlZml4Lmxlbmd0aClcbiAgICAgICAgLnNwbGl0KCcsJylcbiAgICAgICAgLm1hcChOdW1iZXIpO1xuICAgIHJldHVybiBsYXllck51bWJlcnM7XG59XG5mdW5jdGlvbiBzaG93T25seVJHQlRlbXBsYXRlKG5vZGUpIHtcbiAgICBpZiAoZ2V0VGFncyhub2RlKS5pbmNsdWRlcygnc2V0dGluZ3MnKSkge1xuICAgICAgICBub2RlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZ2V0VGFncyhub2RlKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykgfHwgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzaG93T25seVJHQlRlbXBsYXRlKHYpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSAmJiAhZ2V0VGFncyh2KS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB2LnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gY29sbGVjdExheWVyTnVtYmVyc1RvQ2xlYXIobGVzc29uLCBzdGVwKSB7XG4gICAgY29uc3QgY3VycmVudFN0ZXBPcmRlciA9IGdldFN0ZXBPcmRlcihzdGVwKTtcbiAgICBjb25zdCBsYXllcnNTdGVwT3JkZXJUYWdzID0gbGVzc29uLmNoaWxkcmVuLm1hcCgocykgPT4gZ2V0U3RlcE9yZGVyKHMpKTtcbiAgICBjb25zdCBjbGVhckxheWVyTnVtYmVycyA9IGxlc3Nvbi5jaGlsZHJlbi5yZWR1Y2UoKGFjYywgbGF5ZXIpID0+IHtcbiAgICAgICAgaWYgKGxheWVyLnR5cGUgIT09ICdHUk9VUCcgfHwgZ2V0U3RlcE9yZGVyKGxheWVyKSA+IGN1cnJlbnRTdGVwT3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdldFRhZ3MobGF5ZXIpLmluY2x1ZGVzKCdjbGVhci1iZWZvcmUnKSkge1xuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHN0ZXAgb3JkZXIgdGFncyBhbmQgY29udmVydCB0byBsYXllcnMgdG8gY2xlYXJcbiAgICAgICAgICAgIGNvbnN0IHN0ZXBzVG9DbGVhciA9IFsuLi5BcnJheShnZXRTdGVwT3JkZXIobGF5ZXIpKS5rZXlzKCldLnNsaWNlKDEpO1xuICAgICAgICAgICAgc3RlcHNUb0NsZWFyLmZvckVhY2goKHN0ZXBPcmRlcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsYXllcnNTdGVwT3JkZXJUYWdzLmluY2x1ZGVzKHN0ZXBPcmRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjLmFkZChsYXllcnNTdGVwT3JkZXJUYWdzLmluZGV4T2Yoc3RlcE9yZGVyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0Q2xlYXJMYXllck51bWJlcnMobGF5ZXIpLmZvckVhY2goKGlkeCkgPT4gYWNjLmFkZChpZHgpKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBuZXcgU2V0KCkpO1xuICAgIHJldHVybiBjbGVhckxheWVyTnVtYmVycztcbn1cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KHBhZ2UsIHNldHRpbmdzKSB7XG4gICAgbGFzdFBhZ2UgPSBwYWdlO1xuICAgIGxhc3RNb2RlID0gc2V0dGluZ3MuZGlzcGxheU1vZGU7XG4gICAgY29uc3QgeyBkaXNwbGF5TW9kZSwgc3RlcE51bWJlciB9ID0gc2V0dGluZ3M7XG4gICAgY29uc3QgbGVzc29uID0gcGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgaWYgKCFsZXNzb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xuICAgIHBhZ2Uuc2VsZWN0aW9uID0gW3N0ZXBdO1xuICAgIGNvbnN0IHN0ZXBDb3VudCA9IGxlc3Nvbi5jaGlsZHJlbi5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSkubGVuZ3RoO1xuICAgIGNvbnN0IG1heFN0cm9rZVdlaWdodCA9IGdldEJydXNoU2l6ZShzdGVwKTtcbiAgICBjb25zdCBicnVzaFR5cGUgPSBnZXRUYWcoc3RlcCwgJ2JydXNoLW5hbWUtJykgfHwgJyc7XG4gICAgbGV0IGxheWVyTnVtYmVyc1RvQ2xlYXIgPSBnZXRUYWdzKHN0ZXApLmluY2x1ZGVzKCdjbGVhci1iZWZvcmUnKSA/IFsuLi5BcnJheShzdGVwTnVtYmVyKS5rZXlzKCldLnNsaWNlKDEpIDogZ2V0Q2xlYXJMYXllck51bWJlcnMoc3RlcCk7XG4gICAgZW1pdCgndXBkYXRlRm9ybScsIHtcbiAgICAgICAgc2hhZG93U2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgMCxcbiAgICAgICAgYnJ1c2hTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSB8fCAwLFxuICAgICAgICBzdWdnZXN0ZWRCcnVzaFNpemU6IGlzUmVzdWx0U3RlcChzdGVwKSA/IDAgOiBtYXhTdHJva2VXZWlnaHQsXG4gICAgICAgIHRlbXBsYXRlOiBnZXRUYWcoc3RlcCwgJ3MtJykgfHwgMCxcbiAgICAgICAgc3RlcENvdW50LFxuICAgICAgICBzdGVwTnVtYmVyLFxuICAgICAgICBkaXNwbGF5TW9kZSxcbiAgICAgICAgY2xlYXJCZWZvcmU6IGdldFRhZ3Moc3RlcCkuaW5jbHVkZXMoJ2NsZWFyLWJlZm9yZScpLFxuICAgICAgICBjbGVhckxheWVyczogbGF5ZXJOdW1iZXJzVG9DbGVhci5tYXAoKG4pID0+IG4udG9TdHJpbmcoKSkgfHwgW10sXG4gICAgICAgIG90aGVyVGFnczogZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHQpID0+IHQuc3RhcnRzV2l0aCgnc2hhcmUtYnV0dG9uJykgfHxcbiAgICAgICAgICAgIHQuc3RhcnRzV2l0aCgnYWxsb3ctdW5kbycpKSB8fCBbXSxcbiAgICAgICAgYnJ1c2hUeXBlLFxuICAgIH0pO1xuICAgIGRlbGV0ZVRtcCgpO1xuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcbiAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gaSA8IHN0ZXBOdW1iZXI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbGxlY3RMYXllck51bWJlcnNUb0NsZWFyKGxlc3Nvbiwgc3RlcCkuZm9yRWFjaCgoaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbltpXS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiBzaG93T25seVJHQlRlbXBsYXRlKHN0ZXApKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZW1wbGF0ZSc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xufSwgMTUwMCk7XG5mdW5jdGlvbiBhZGRBbmltYXRpb25UYWcoc3RlcCwgdGFnLCBkZWxheSwgcmVwZWF0KSB7XG4gICAgaWYgKCgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdLnR5cGUpKSkge1xuICAgICAgICBsZXQgc2VsZWN0aW9uVGFncyA9IGdldFRhZ3MoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgc2VsZWN0aW9uVGFncyA9IHNlbGVjdGlvblRhZ3MuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCd3aWdnbGUnKSAmJiAhdC5zdGFydHNXaXRoKCdmbHktZnJvbS0nKSAmJiAhdC5zdGFydHNXaXRoKCdhcHBlYXInKSAmJiAhdC5zdGFydHNXaXRoKCdibGluaycpICYmICF0LnN0YXJ0c1dpdGgoJ2RyYXctbGluZScpKTtcbiAgICAgICAgc2VsZWN0aW9uVGFncyA9IHNlbGVjdGlvblRhZ3MuZmlsdGVyKCh0KSA9PiAhL2RcXGQrLy50ZXN0KHQpICYmICEvclxcZCsvLnRlc3QodCkpO1xuICAgICAgICBpZiAodGFnKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25UYWdzLnB1c2godGFnKTtcbiAgICAgICAgICAgIGlmIChkZWxheSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaChgZCR7ZGVsYXl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKGByJHtyZXBlYXR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0ubmFtZSA9IHNlbGVjdGlvblRhZ3Muam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdLm5hbWUgPSBzZWxlY3Rpb25UYWdzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgZGVzY2VuZGFudHMoc3RlcCkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0aW9uVGFncyA9IGdldFRhZ3Modik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnd2lnZ2xlJykgJiYgIXQuc3RhcnRzV2l0aCgnZmx5LWZyb20tJykgJiYgIXQuc3RhcnRzV2l0aCgnYXBwZWFyJykgJiYgIXQuc3RhcnRzV2l0aCgnYmxpbmsnKSAmJiAhdC5zdGFydHNXaXRoKCdkcmF3LWxpbmUnKSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaCh0YWcpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICEvZFxcZCsvLnRlc3QodCkgJiYgIS9yXFxkKy8udGVzdCh0KSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKGBkJHtkZWxheX1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzLnB1c2goYHIke3JlcGVhdH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2Lm5hbWUgPSBzZWxlY3Rpb25UYWdzLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlc2NlbmRhbnRzKHN0ZXApLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvblRhZ3MgPSBnZXRUYWdzKHYpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoJ3dpZ2dsZScpICYmICF0LnN0YXJ0c1dpdGgoJ2ZseS1mcm9tLScpICYmICF0LnN0YXJ0c1dpdGgoJ2FwcGVhcicpICYmICF0LnN0YXJ0c1dpdGgoJ2JsaW5rJykgJiYgIXQuc3RhcnRzV2l0aCgnZHJhdy1saW5lJykpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICEvZFxcZCsvLnRlc3QodCkgJiYgIS9yXFxkKy8udGVzdCh0KSk7XG4gICAgICAgICAgICAgICAgICAgIHYubmFtZSA9IHNlbGVjdGlvblRhZ3Muam9pbignICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlUHJvcHMoc2V0dGluZ3MpIHtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3NldHRpbmdzLnN0ZXBOdW1iZXIgLSAxXTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCdzcy0nKSAmJlxuICAgICAgICAhdC5zdGFydHNXaXRoKCdicy0nKSAmJlxuICAgICAgICAhdC5zdGFydHNXaXRoKCdzLScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2NsZWFyLWxheWVyLScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2NsZWFyLWJlZm9yZScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ3NoYXJlLWJ1dHRvbicpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2FsbG93LXVuZG8nKSAmJlxuICAgICAgICAhdC5zdGFydHNXaXRoKCdicnVzaC1uYW1lLScpKTtcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcbiAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgYHMtJHtzZXR0aW5ncy50ZW1wbGF0ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBzcy0ke3NldHRpbmdzLnNoYWRvd1NpemV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBicy0ke3NldHRpbmdzLmJydXNoU2l6ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmJydXNoVHlwZSkge1xuICAgICAgICB0YWdzLnB1c2goYGJydXNoLW5hbWUtJHtzZXR0aW5ncy5icnVzaFR5cGV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5jbGVhckxheWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICghc2V0dGluZ3MuY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgICAgIHRhZ3MucHVzaChgY2xlYXItbGF5ZXItJHtzZXR0aW5ncy5jbGVhckxheWVycy5qb2luKCcsJyl9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmNsZWFyQmVmb3JlKSB7XG4gICAgICAgIHRhZ3MucHVzaCgnY2xlYXItYmVmb3JlJyk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5vdGhlclRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQoc2V0dGluZ3Mub3RoZXJUYWdzKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmFuaW1hdGlvblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFkZEFuaW1hdGlvblRhZyhzdGVwLCBzZXR0aW5ncy5hbmltYXRpb25UYWcsIHNldHRpbmdzLmRlbGF5LCBzZXR0aW5ncy5yZXBlYXQpO1xuICAgIH1cbiAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcbn1cbm9uKCd1cGRhdGVEaXNwbGF5JywgKHNldHRpbmdzKSA9PiB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCBzZXR0aW5ncykpO1xub24oJ3VwZGF0ZVByb3BzJywgdXBkYXRlUHJvcHMpO1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRQYWdlQ2hhbmdlZChwYWdlTm9kZSkge1xuICAgIGlmIChmaWdtYSAmJiAhbGFzdFBhZ2UpIHtcbiAgICAgICAgbGFzdFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICB9XG4gICAgdXBkYXRlRGlzcGxheShsYXN0UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG4gICAgbGFzdFBhZ2UgPSBwYWdlTm9kZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3Rpb25DaGFuZ2VkKCkge1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgaWYgKCFzZWxlY3Rpb24gfHxcbiAgICAgICAgIWxlc3NvbiB8fFxuICAgICAgICAhbGVzc29uLmNoaWxkcmVuLmluY2x1ZGVzKHNlbGVjdGlvbikgfHxcbiAgICAgICAgc2VsZWN0aW9uLnR5cGUgIT09ICdHUk9VUCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL3VwZGF0ZSBzdGVwXG4gICAgY29uc3Qgc3RlcCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBjb25zdCBzdGVwTnVtYmVyID0gc3RlcHNCeU9yZGVyKGxlc3NvbikuaW5kZXhPZihzdGVwKSArIDE7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogbGFzdE1vZGUsIHN0ZXBOdW1iZXIgfSk7XG59XG4iLCJpbXBvcnQgeyBlbWl0IH0gZnJvbSAnLi4vZXZlbnRzJztcbmV4cG9ydCBmdW5jdGlvbiBmaW5kQWxsKG5vZGUsIGYpIHtcbiAgICBsZXQgYXJyID0gW107XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgYXJyLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdChjaGlsZHJlbi5mbGF0TWFwKChwKSA9PiBmaW5kQWxsKHAsIGYpKSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZExlYWZOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCEoJ2NoaWxkcmVuJyBpbiBub2RlKSkge1xuICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5maW5kQWxsKChuKSA9PiAhKCdjaGlsZHJlbicgaW4gbikpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZS5wYXJlbnQsIGYpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlSW5kZXgobm9kZSkge1xuICAgIHJldHVybiBub2RlLnBhcmVudC5jaGlsZHJlbi5maW5kSW5kZXgoKG4pID0+IG4uaWQgPT09IG5vZGUuaWQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRMZXNzb24oKSB7XG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09PSAnbGVzc29uJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFncyhub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubmFtZS5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVGFnKG5vZGUsIHRhZykge1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIHJldHVybiB0YWdzLmZpbmQoKHMpID0+IHRhZy50ZXN0KHMpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRUYWcobm9kZSwgdGFnKSB7XG4gICAgbm9kZS5uYW1lID0gZ2V0VGFncyhub2RlKS5jb25jYXQoW3RhZ10pLmpvaW4oJyAnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50QnlUYWcobm9kZSwgdGFnKSB7XG4gICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZSwgKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXModGFnKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNSZXN1bHRTdGVwKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAmJiBnZXRUYWdzKG5vZGUpLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludCh0ZXh0KSB7XG4gICAgZW1pdCgncHJpbnQnLCB0ZXh0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5Tm90aWZpY2F0aW9uKG1lc3NhZ2UpIHtcbiAgICBmaWdtYS5ub3RpZnkobWVzc2FnZSk7XG59XG5leHBvcnQgY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGVwT3JkZXIoc3RlcCkge1xuICAgIGNvbnN0IHN0ZXBPcmRlclRhZyA9IC9eby0oXFxkKykkLztcbiAgICBjb25zdCBzdGVwVGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0YWcpID0+IHRhZy5tYXRjaChzdGVwT3JkZXJUYWcpKTtcbiAgICBpZiAoc3RlcFRhZykge1xuICAgICAgICByZXR1cm4gTnVtYmVyKHN0ZXBUYWcubWF0Y2goc3RlcE9yZGVyVGFnKVsxXSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZVVpKGlzV2lkZSkge1xuICAgIGlmIChpc1dpZGUpIHtcbiAgICAgICAgZmlnbWEudWkucmVzaXplKDkwMCwgNDcwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ3MCk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0ZXBPcmRlcihzdGVwLCBzdGVwT3JkZXIpIHtcbiAgICBnZXRUYWdzKHN0ZXApLnNvbWUoKHRhZykgPT4gL15vLVxcZCskLy50ZXN0KHRhZykpXG4gICAgICAgID8gKHN0ZXAubmFtZSA9IHN0ZXAubmFtZS5yZXBsYWNlKC9vLVxcZCsvLCBgby0ke3N0ZXBPcmRlcn1gKSlcbiAgICAgICAgOiAoc3RlcC5uYW1lICs9IGAgby0ke3N0ZXBPcmRlcn1gKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxUcmVlKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIFtub2RlLCAuLi5ub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGdldEFsbFRyZWUobikpXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZXNjZW5kYW50cyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZ2V0QWxsVHJlZShuKSk7XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGNyZWF0ZVBsdWdpbkFQSSwgY3JlYXRlVUlBUEkgfSBmcm9tICdmaWdtYS1qc29ucnBjJztcbmltcG9ydCB7IGV4cG9ydFRleHRzLCBpbXBvcnRUZXh0cyB9IGZyb20gJy4vcGx1Z2luL2Zvcm1hdC1ycGMnO1xuaW1wb3J0IHsgZXhwb3J0TGVzc29uLCBleHBvcnRDb3Vyc2UgfSBmcm9tICcuL3BsdWdpbi9wdWJsaXNoJztcbmltcG9ydCB7IGdldFN0ZXBzLCBzZXRTdGVwc09yZGVyIH0gZnJvbSAnLi9wbHVnaW4vdHVuZS1ycGMnO1xuaW1wb3J0IHsgY3JlYXRlTGVzc29uLCBzZXBhcmF0ZVN0ZXAsIHNwbGl0QnlDb2xvciwgam9pblN0ZXBzLCB9IGZyb20gJy4vcGx1Z2luL2NyZWF0ZSc7XG5pbXBvcnQgeyBkaXNwbGF5Tm90aWZpY2F0aW9uLCByZXNpemVVaSB9IGZyb20gJy4vcGx1Z2luL3V0aWwnO1xuaW1wb3J0IHsgbGludFBhZ2UsIGxpbnRDb3Vyc2UsIHNlbGVjdEVycm9yLCBzYXZlRXJyb3JzIH0gZnJvbSAnLi9wbHVnaW4vbGludGVyJztcbmltcG9ydCB7IHNlbGVjdGlvbkNoYW5nZWQsIGN1cnJlbnRQYWdlQ2hhbmdlZCwgdXBkYXRlRGlzcGxheSB9IGZyb20gJy4vcGx1Z2luL3R1bmUnO1xuLy8gRmlnbWEgcGx1Z2luIG1ldGhvZHNcbmV4cG9ydCBjb25zdCBwbHVnaW5BcGkgPSBjcmVhdGVQbHVnaW5BUEkoe1xuICAgIHNldFNlc3Npb25Ub2tlbih0b2tlbikge1xuICAgICAgICByZXR1cm4gZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnc2Vzc2lvblRva2VuJywgdG9rZW4pO1xuICAgIH0sXG4gICAgZ2V0U2Vzc2lvblRva2VuKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGV4cG9ydExlc3NvbixcbiAgICBleHBvcnRDb3Vyc2UsXG4gICAgZ2V0U3RlcHMsXG4gICAgc2V0U3RlcHNPcmRlcixcbiAgICBleHBvcnRUZXh0cyxcbiAgICBpbXBvcnRUZXh0cyxcbiAgICBkaXNwbGF5Tm90aWZpY2F0aW9uLFxuICAgIGNyZWF0ZUxlc3NvbixcbiAgICBzZXBhcmF0ZVN0ZXAsXG4gICAgc3BsaXRCeUNvbG9yLFxuICAgIGpvaW5TdGVwcyxcbiAgICBzZWxlY3RFcnJvcixcbiAgICBzYXZlRXJyb3JzLFxuICAgIHNlbGVjdGlvbkNoYW5nZWQsXG4gICAgY3VycmVudFBhZ2VDaGFuZ2VkLFxuICAgIHVwZGF0ZURpc3BsYXksXG4gICAgbGludFBhZ2UsXG4gICAgbGludENvdXJzZSxcbiAgICByZXNpemVVaSxcbn0pO1xuLy8gRmlnbWEgVUkgYXBwIG1ldGhvZHNcbmV4cG9ydCBjb25zdCB1aUFwaSA9IGNyZWF0ZVVJQVBJKHt9KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=