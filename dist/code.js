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
        //updateDisplay(page, { displayMode: 'all', stepNumber: 1, nextBrushStep: false })
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
        return printErrors();
    });
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
        prepareCourseForPublishing();
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
        return { id: step.id, name: step.name, colors: getColors(step) };
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
/*! exports provided: deleteTmp, displayAll, selectNextBrushStep, updateDisplay, currentPageChanged, selectionChanged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTmp", function() { return deleteTmp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayAll", function() { return displayAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectNextBrushStep", function() { return selectNextBrushStep; });
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
let lastMode = 'all';
let lastPage = null;
function deleteTmp(page) {
    const p = page || figma.currentPage;
    p.findAll((el) => el.name.startsWith('tmp-')).forEach((el) => el.remove());
}
function displayAll(lesson, setLastMode) {
    const currentLesson = lesson || Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
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
function showOnlyRGBTemplate(node) {
    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node).includes('settings')) {
        node.visible = false;
        return;
    }
    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node).includes('rgb-template') ||
        /GROUP|BOOLEAN_OPERATION/.test(node.type)) {
        return;
    }
    node.children.forEach((v) => {
        if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
            return showOnlyRGBTemplate(v);
        }
        if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type) &&
            !Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(v).includes('rgb-template')) {
            return (v.visible = false);
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
function selectNextBrushStep(stepNumber) {
    let lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    const page = figma.currentPage;
    if (!lesson) {
        return;
    }
    let step;
    let steps = stepsByOrder(lesson);
    const nextStep = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findNextBrushStep"])(steps.slice(stepNumber));
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
        const lessonFrame = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLessonGroup"])(newLesson);
        if (!lessonFrame) {
            return null;
        }
        const newSteps = stepsByOrder(lessonFrame);
        const newNextStep = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findNextBrushStep"])(newSteps);
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
function updateDisplay(page, settings) {
    lastMode = settings.displayMode;
    const { displayMode, stepNumber } = settings;
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findLessonGroup"])(page);
    if (!lesson) {
        return;
    }
    const step = stepsByOrder(lesson)[stepNumber - 1];
    page.selection = [step];
    const stepCount = lesson.children.filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).includes('step')).length;
    const maxStrokeWeight = getBrushSize(step);
    const brushType = getTag(step, 'brush-name-') || '';
    let layerNumbersToClear = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).includes('clear-before')
        ? [...Array(stepNumber).keys()].slice(1)
        : getClearLayerNumbers(step);
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
        otherTags: Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(step).filter((t) => t.startsWith('share-button') || t.startsWith('allow-undo')) || [],
        brushType,
    });
    deleteTmp();
    if (lastPage && lastPage != page) {
        displayAll(lastPage.children.find((el) => el.name == 'lesson'));
    }
    lastPage = page;
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
    if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(figma.currentPage.selection[0].type)) {
        let selectionTags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(figma.currentPage.selection[0]);
        selectionTags = selectionTags.filter((t) => !t.startsWith('wiggle') &&
            !t.startsWith('fly-from-') &&
            !t.startsWith('appear') &&
            !t.startsWith('blink') &&
            !t.startsWith('draw-line'));
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
                    selectionTags = selectionTags.filter((t) => !t.startsWith('wiggle') &&
                        !t.startsWith('fly-from-') &&
                        !t.startsWith('appear') &&
                        !t.startsWith('blink') &&
                        !t.startsWith('draw-line'));
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
                    selectionTags = selectionTags.filter((t) => !t.startsWith('wiggle') &&
                        !t.startsWith('fly-from-') &&
                        !t.startsWith('appear') &&
                        !t.startsWith('blink') &&
                        !t.startsWith('draw-line'));
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
function currentPageChanged() {
    const selection = figma.currentPage.selection[0];
    const lesson = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getCurrentLesson"])();
    if (!selection || !lesson || !lesson.children.includes(selection)) {
        updateDisplay(figma.currentPage, { displayMode: lastMode, stepNumber: 1 });
        return;
    }
    const step = figma.currentPage.selection[0];
    const stepNumber = stepsByOrder(lesson).indexOf(step) + 1;
    updateDisplay(figma.currentPage, {
        displayMode: lastMode,
        stepNumber: stepNumber || 1,
    });
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
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, findTag, addTag, findParentByTag, isResultStep, print, displayNotification, capitalize, getStepOrder, resizeUi, setStepOrder, getAllTree, descendants, findNextBrushStep, findLessonGroup */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findNextBrushStep", function() { return findNextBrushStep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findLessonGroup", function() { return findLessonGroup; });
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
function findNextBrushStep(steps) {
    return steps.find((step) => {
        return getTags(step).includes('s-multistep-brush');
    });
}
function findLessonGroup(page) {
    return page.children.find((el) => el.name == 'lesson');
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
    selectNextBrushStep: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["selectNextBrushStep"],
    displayAll: _plugin_tune__WEBPACK_IMPORTED_MODULE_7__["displayAll"],
});
// Figma UI app methods
const uiApi = Object(figma_jsonrpc__WEBPACK_IMPORTED_MODULE_0__["createUIAPI"])({});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUM2RDtBQUNFO0FBQ0Q7QUFDRjtBQUMyQjtBQUN6QjtBQUNrQjtBQUNzQztBQUN0SDtBQUNPLGtCQUFrQixxRUFBZTtBQUN4QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSwwRUFBWTtBQUNoQixJQUFJLDBFQUFZO0FBQ2hCLElBQUksbUVBQVE7QUFDWixJQUFJLDZFQUFhO0FBQ2pCLElBQUksMkVBQVc7QUFDZixJQUFJLDJFQUFXO0FBQ2YsSUFBSSxxRkFBbUI7QUFDdkIsSUFBSSx5RUFBWTtBQUNoQixJQUFJLHlFQUFZO0FBQ2hCLElBQUkseUVBQVk7QUFDaEIsSUFBSSxtRUFBUztBQUNiLElBQUksdUVBQVc7QUFDZixJQUFJLHFFQUFVO0FBQ2QsSUFBSSwrRUFBZ0I7QUFDcEIsSUFBSSxtRkFBa0I7QUFDdEIsSUFBSSx5RUFBYTtBQUNqQixJQUFJLGlFQUFRO0FBQ1osSUFBSSxxRUFBVTtBQUNkLElBQUksK0RBQVE7QUFDWixJQUFJLHFGQUFtQjtBQUN2QixJQUFJLG1FQUFVO0FBQ2QsQ0FBQztBQUNEO0FBQ08sY0FBYyxpRUFBVyxHQUFHIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2luZGV4LnRzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMuUGFyc2VFcnJvciA9IGNsYXNzIFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIlBhcnNlIGVycm9yXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNzAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUmVxdWVzdCA9IGNsYXNzIEludmFsaWRSZXF1ZXN0IGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnZhbGlkIFJlcXVlc3RcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLk1ldGhvZE5vdEZvdW5kID0gY2xhc3MgTWV0aG9kTm90Rm91bmQgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIk1ldGhvZCBub3QgZm91bmRcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDE7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRQYXJhbXMgPSBjbGFzcyBJbnZhbGlkUGFyYW1zIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnZhbGlkIHBhcmFtc1wiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW50ZXJuYWxFcnJvciA9IGNsYXNzIEludGVybmFsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludGVybmFsIGVycm9yXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAzO1xuICB9XG59O1xuIiwiY29uc3QgeyBzZXR1cCwgc2VuZFJlcXVlc3QgfSA9IHJlcXVpcmUoXCIuL3JwY1wiKTtcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlVUlBUEkgPSBmdW5jdGlvbiBjcmVhdGVVSUFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBtZXRob2RzW3BdKC4uLnBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHAsIHBhcmFtcywgdGltZW91dCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUGx1Z2luQVBJID0gZnVuY3Rpb24gY3JlYXRlUGx1Z2luQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBtZXRob2RzW3BdKC4uLnBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHAsIHBhcmFtcywgdGltZW91dCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xufTtcbiIsImNvbnN0IFJQQ0Vycm9yID0gcmVxdWlyZShcIi4vZXJyb3JzXCIpO1xuY29uc3QgeyBNZXRob2ROb3RGb3VuZCB9ID0gcmVxdWlyZShcIi4vZXJyb3JzXCIpO1xuXG5sZXQgc2VuZFJhdztcblxuaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBmaWdtYS51aS5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gaGFuZGxlUmF3KG1lc3NhZ2UpKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gZmlnbWEudWkucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG59IGVsc2UgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgb25tZXNzYWdlID0gZXZlbnQgPT4gaGFuZGxlUmF3KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IG1lc3NhZ2UgfSwgXCIqXCIpO1xufVxuXG5sZXQgcnBjSW5kZXggPSAwO1xubGV0IHBlbmRpbmcgPSB7fTtcblxuZnVuY3Rpb24gc2VuZEpzb24ocmVxKSB7XG4gIHRyeSB7XG4gICAgc2VuZFJhdyhyZXEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VuZFJlc3VsdChpZCwgcmVzdWx0KSB7XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIHJlc3VsdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VuZEVycm9yKGlkLCBlcnJvcikge1xuICBjb25zdCBlcnJvck9iamVjdCA9IHtcbiAgICBjb2RlOiBlcnJvci5jb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgZGF0YTogZXJyb3IuZGF0YVxuICB9O1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICBlcnJvcjogZXJyb3JPYmplY3RcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJhdyhkYXRhKSB7XG4gIHRyeSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGhhbmRsZVJwYyhkYXRhKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIGNvbnNvbGUuZXJyb3IoZGF0YSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlUnBjKGpzb24pIHtcbiAgaWYgKHR5cGVvZiBqc29uLmlkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYgKFxuICAgICAgdHlwZW9mIGpzb24ucmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICBqc29uLmVycm9yIHx8XG4gICAgICB0eXBlb2YganNvbi5tZXRob2QgPT09IFwidW5kZWZpbmVkXCJcbiAgICApIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gcGVuZGluZ1tqc29uLmlkXTtcbiAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgc2VuZEVycm9yKFxuICAgICAgICAgIGpzb24uaWQsXG4gICAgICAgICAgbmV3IFJQQ0Vycm9yLkludmFsaWRSZXF1ZXN0KFwiTWlzc2luZyBjYWxsYmFjayBmb3IgXCIgKyBqc29uLmlkKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoY2FsbGJhY2sudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoY2FsbGJhY2sudGltZW91dCk7XG4gICAgICB9XG4gICAgICBkZWxldGUgcGVuZGluZ1tqc29uLmlkXTtcbiAgICAgIGNhbGxiYWNrKGpzb24uZXJyb3IsIGpzb24ucmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlUmVxdWVzdChqc29uKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlTm90aWZpY2F0aW9uKGpzb24pO1xuICB9XG59XG5cbmxldCBtZXRob2RzID0ge307XG5cbmZ1bmN0aW9uIG9uUmVxdWVzdChtZXRob2QsIHBhcmFtcykge1xuICBpZiAoIW1ldGhvZHNbbWV0aG9kXSkge1xuICAgIHRocm93IG5ldyBNZXRob2ROb3RGb3VuZChtZXRob2QpO1xuICB9XG4gIHJldHVybiBtZXRob2RzW21ldGhvZF0oLi4ucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTm90aWZpY2F0aW9uKGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgbmV3IFJQQ0Vycm9yLkludmFsaWRSZXF1ZXN0KFwiTWlzc2luZyBtZXRob2RcIikpO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xuICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJlc3VsdFxuICAgICAgICAudGhlbihyZXMgPT4gc2VuZFJlc3VsdChqc29uLmlkLCByZXMpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHNlbmRFcnJvcihqc29uLmlkLCBlcnIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZFJlc3VsdChqc29uLmlkLCByZXN1bHQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIGVycik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuc2V0dXAgPSBfbWV0aG9kcyA9PiB7XG4gIE9iamVjdC5hc3NpZ24obWV0aG9kcywgX21ldGhvZHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc2VuZE5vdGlmaWNhdGlvbiA9IChtZXRob2QsIHBhcmFtcykgPT4ge1xuICBzZW5kSnNvbih7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc2VuZFJlcXVlc3QgPSAobWV0aG9kLCBwYXJhbXMsIHRpbWVvdXQpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBpZCA9IHJwY0luZGV4O1xuICAgIGNvbnN0IHJlcSA9IHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMsIGlkIH07XG4gICAgcnBjSW5kZXggKz0gMTtcbiAgICBjb25zdCBjYWxsYmFjayA9IChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zdCBqc0Vycm9yID0gbmV3IEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAganNFcnJvci5jb2RlID0gZXJyLmNvZGU7XG4gICAgICAgIGpzRXJyb3IuZGF0YSA9IGVyci5kYXRhO1xuICAgICAgICByZWplY3QoanNFcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICB9O1xuXG4gICAgLy8gc2V0IGEgZGVmYXVsdCB0aW1lb3V0XG4gICAgY2FsbGJhY2sudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGVsZXRlIHBlbmRpbmdbaWRdO1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlJlcXVlc3QgXCIgKyBtZXRob2QgKyBcIiB0aW1lZCBvdXQuXCIpKTtcbiAgICB9LCB0aW1lb3V0IHx8IDMwMDApO1xuXG4gICAgcGVuZGluZ1tpZF0gPSBjYWxsYmFjaztcbiAgICBzZW5kSnNvbihyZXEpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLlJQQ0Vycm9yID0gUlBDRXJyb3I7XG4iLCJjb25zdCBldmVudEhhbmRsZXJzID0ge307XG5sZXQgY3VycmVudElkID0gMDtcbmV4cG9ydCBmdW5jdGlvbiBvbihuYW1lLCBoYW5kbGVyKSB7XG4gICAgY29uc3QgaWQgPSBgJHtjdXJyZW50SWR9YDtcbiAgICBjdXJyZW50SWQgKz0gMTtcbiAgICBldmVudEhhbmRsZXJzW2lkXSA9IHsgaGFuZGxlciwgbmFtZSB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSBldmVudEhhbmRsZXJzW2lkXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uY2UobmFtZSwgaGFuZGxlcikge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgcmV0dXJuIG9uKG5hbWUsIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChkb25lID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGhhbmRsZXIoLi4uYXJncyk7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgZW1pdCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnXG4gICAgPyBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShbbmFtZSwgLi4uYXJnc10pO1xuICAgIH1cbiAgICA6IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgcGx1Z2luTWVzc2FnZTogW25hbWUsIC4uLmFyZ3NdLFxuICAgICAgICB9LCAnKicpO1xuICAgIH07XG5mdW5jdGlvbiBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncykge1xuICAgIGZvciAoY29uc3QgaWQgaW4gZXZlbnRIYW5kbGVycykge1xuICAgICAgICBpZiAoZXZlbnRIYW5kbGVyc1tpZF0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyc1tpZF0uaGFuZGxlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoKF9hID0gcGFyYW1zWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuanNvbnJwYykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFtuYW1lLCAuLi5hcmdzXSA9IHBhcmFtc1swXTtcbiAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xuICAgIH07XG59XG5lbHNlIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogdmVyeSBkaXJ0eSBoYWNrLCBuZWVkcyBmaXhpbmdcbiAgICAgICAgY29uc3QgZmFsbGJhY2sgPSB3aW5kb3cub25tZXNzYWdlO1xuICAgICAgICB3aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xuICAgICAgICAgICAgZmFsbGJhY2suYXBwbHkod2luZG93LCBwYXJhbXMpO1xuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBwYXJhbXNbMF07XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IFtuYW1lLCAuLi5hcmdzXSA9IGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZTtcbiAgICAgICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9LCAxMDApO1xufVxuIiwiaW1wb3J0IHsgZ2V0U3RlcHMsIHRhZ1Vub3JkZXJlZFN0ZXBzIH0gZnJvbSAnLi90dW5lLXJwYyc7XG5pbXBvcnQgeyBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uLCBmaW5kUGFyZW50QnlUYWcsIGdldE5vZGVJbmRleCwgZ2V0VGFncywgaXNSZXN1bHRTdGVwLCBnZXRTdGVwT3JkZXIsIHNldFN0ZXBPcmRlciwgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZm9ybWF0Tm9kZShub2RlLCBwYXJhbWV0ZXJzKSB7XG4gICAgY29uc3QgeyBuYW1lLCB4LCB5LCB3aWR0aCA9IDQwLCBoZWlnaHQgPSA0MCB9ID0gcGFyYW1ldGVycztcbiAgICBub2RlLm5hbWUgPSBuYW1lO1xuICAgIG5vZGUueCA9IHg7XG4gICAgbm9kZS55ID0geTtcbiAgICBub2RlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbn1cbmZ1bmN0aW9uIGZpbGxTZXJ2aWNlTm9kZXMobm9kZSkge1xuICAgIG5vZGUuZmlsbHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICAgIHI6IDE5NiAvIDI1NSxcbiAgICAgICAgICAgICAgICBnOiAxOTYgLyAyNTUsXG4gICAgICAgICAgICAgICAgYjogMTk2IC8gMjU1LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICBdO1xufVxuZnVuY3Rpb24gcmVzY2FsZUltYWdlTm9kZShub2RlLCByZXNpemVQYXJhbXMpIHtcbiAgICBjb25zdCB7IG1heFdpZHRoLCBtYXhIZWlnaHQgfSA9IHJlc2l6ZVBhcmFtcztcbiAgICBjb25zdCBpc0NvcnJlY3RTaXplID0gbm9kZS53aWR0aCA8PSBtYXhXaWR0aCAmJiBub2RlLmhlaWdodCA8PSBtYXhIZWlnaHQ7XG4gICAgY29uc3QgaXNDb3JyZWN0VHlwZSA9IG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyB8fCBub2RlLnR5cGUgPT09ICdSRUNUQU5HTEUnIHx8IG5vZGUudHlwZSA9PT0gJ1ZFQ1RPUic7XG4gICAgaWYgKGlzQ29ycmVjdFR5cGUgJiYgIWlzQ29ycmVjdFNpemUpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBNYXRoLm1pbihtYXhXaWR0aCAvIG5vZGUud2lkdGgsIG1heEhlaWdodCAvIG5vZGUuaGVpZ2h0KTtcbiAgICAgICAgbm9kZS5yZXNjYWxlKHNjYWxlRmFjdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG59XG5mdW5jdGlvbiBjcmVhdGVSZXN1bHROb2RlKG5vZGUpIHtcbiAgICBjb25zdCByZXN1bHRSZWN0YW5nbGUgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICBmaWxsU2VydmljZU5vZGVzKHJlc3VsdFJlY3RhbmdsZSk7XG4gICAgY29uc3QgdGVtcGxhdGVHcm91cCA9IGZpZ21hLmdyb3VwKFtyZXN1bHRSZWN0YW5nbGVdLCBub2RlKTtcbiAgICB0ZW1wbGF0ZUdyb3VwLm5hbWUgPSAndGVtcGxhdGUnO1xuICAgIGNvbnN0IHJlc3VsdCA9IGZpZ21hLmdyb3VwKFt0ZW1wbGF0ZUdyb3VwXSwgbm9kZSk7XG4gICAgZm9ybWF0Tm9kZShyZXN1bHQsIHtcbiAgICAgICAgbmFtZTogJ3N0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0JyxcbiAgICAgICAgeDogMTAsXG4gICAgICAgIHk6IDYwLFxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxlc3NvbigpIHtcbiAgICBjb25zdCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2U7XG4gICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb3JpZ2luYWxJbWFnZSA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgY29uc3QgbGVzc29uID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICBmb3JtYXROb2RlKGxlc3Nvbiwge1xuICAgICAgICBuYW1lOiAnbGVzc29uJyxcbiAgICAgICAgeDogLTQ2MSxcbiAgICAgICAgeTogLTUxMixcbiAgICAgICAgd2lkdGg6IDEzNjYsXG4gICAgICAgIGhlaWdodDogMTAyNCxcbiAgICB9KTtcbiAgICBjb25zdCB0aHVtYm5haWwgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsLCB7XG4gICAgICAgIG5hbWU6ICd0aHVtYm5haWwnLFxuICAgICAgICB4OiAtOTAxLFxuICAgICAgICB5OiAtNTEyLFxuICAgICAgICB3aWR0aDogNDAwLFxuICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICB9KTtcbiAgICAvLyBDcmVhdGUgc3RlcFxuICAgIGNvbnN0IHN0ZXAgPSBvcmlnaW5hbEltYWdlLmNsb25lKCk7XG4gICAgc3RlcC5uYW1lID0gJ2ltYWdlJztcbiAgICBjb25zdCByZXNpemVkSW1hZ2UgPSByZXNjYWxlSW1hZ2VOb2RlKG9yaWdpbmFsSW1hZ2UsIHtcbiAgICAgICAgbWF4V2lkdGg6IGxlc3Nvbi53aWR0aCAtIDgzICogMixcbiAgICAgICAgbWF4SGVpZ2h0OiBsZXNzb24uaGVpZ2h0IC0gMTIgKiAyLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0ZXBJbnB1dCA9IGZpZ21hLmdyb3VwKFtzdGVwXSwgbGVzc29uKTtcbiAgICBzdGVwSW5wdXQubmFtZSA9ICdpbnB1dCc7XG4gICAgY29uc3QgZmlyc3RTdGVwID0gZmlnbWEuZ3JvdXAoW3N0ZXBJbnB1dF0sIGxlc3Nvbik7XG4gICAgZm9ybWF0Tm9kZShmaXJzdFN0ZXAsIHtcbiAgICAgICAgbmFtZTogJ3N0ZXAgcy1tdWx0aXN0ZXAtYnJ1c2gnLFxuICAgICAgICB4OiAobGVzc29uLndpZHRoIC0gcmVzaXplZEltYWdlLndpZHRoKSAvIDIsXG4gICAgICAgIHk6IChsZXNzb24uaGVpZ2h0IC0gcmVzaXplZEltYWdlLmhlaWdodCkgLyAyLFxuICAgICAgICB3aWR0aDogcmVzaXplZEltYWdlLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJlc2l6ZWRJbWFnZS5oZWlnaHQsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHRodW1ibmFpbFxuICAgIGNvbnN0IHRodW1ibmFpbEltYWdlID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xuICAgIHRodW1ibmFpbEltYWdlLm5hbWUgPSAnaW1hZ2UnO1xuICAgIGNvbnN0IHJlc2l6ZWRUaHVtYm5haWwgPSByZXNjYWxlSW1hZ2VOb2RlKHRodW1ibmFpbEltYWdlLCB7XG4gICAgICAgIG1heFdpZHRoOiB0aHVtYm5haWwud2lkdGggLSAzNSAqIDIsXG4gICAgICAgIG1heEhlaWdodDogdGh1bWJuYWlsLmhlaWdodCAtIDM1ICogMixcbiAgICB9KTtcbiAgICBjb25zdCB0aHVtYm5haWxHcm91cCA9IGZpZ21hLmdyb3VwKFt0aHVtYm5haWxJbWFnZV0sIHRodW1ibmFpbCk7XG4gICAgZm9ybWF0Tm9kZSh0aHVtYm5haWxHcm91cCwge1xuICAgICAgICBuYW1lOiAndGh1bWJuYWlsIGdyb3VwJyxcbiAgICAgICAgeDogKHRodW1ibmFpbC53aWR0aCAtIHJlc2l6ZWRUaHVtYm5haWwud2lkdGgpIC8gMixcbiAgICAgICAgeTogKHRodW1ibmFpbC5oZWlnaHQgLSByZXNpemVkVGh1bWJuYWlsLmhlaWdodCkgLyAyLFxuICAgICAgICB3aWR0aDogcmVzaXplZFRodW1ibmFpbC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkVGh1bWJuYWlsLmhlaWdodCxcbiAgICB9KTtcbiAgICAvLyBDcmVhdGUgcmVzdWx0XG4gICAgY3JlYXRlUmVzdWx0Tm9kZShsZXNzb24pO1xuICAgIC8vIENyZWF0ZSBzZXR0aW5nc1xuICAgIGNvbnN0IHNldHRpbmdzRWxsaXBzZSA9IGZpZ21hLmNyZWF0ZUVsbGlwc2UoKTtcbiAgICBmaWxsU2VydmljZU5vZGVzKHNldHRpbmdzRWxsaXBzZSk7XG4gICAgZm9ybWF0Tm9kZShzZXR0aW5nc0VsbGlwc2UsIHtcbiAgICAgICAgbmFtZTogJ3NldHRpbmdzIGNhcHR1cmUtY29sb3Igem9vbS1zY2FsZS0yIG9yZGVyLWxheWVycycsXG4gICAgICAgIHg6IDEwLFxuICAgICAgICB5OiAxMCxcbiAgICB9KTtcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQoc2V0dGluZ3NFbGxpcHNlKTtcbiAgICBvcmlnaW5hbEltYWdlLnJlbW92ZSgpO1xuICAgIHRhZ1Vub3JkZXJlZFN0ZXBzKCk7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlDb2xvcihjb2xvcikge1xuICAgIGxldCB7IHIsIGcsIGIgfSA9IGNvbG9yO1xuICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xuICAgIGcgPSBNYXRoLnJvdW5kKGcgKiAyNTUpO1xuICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xuICAgIHJldHVybiBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYDtcbn1cbmZ1bmN0aW9uIG5hbWVMZWFmTm9kZXMobm9kZXMpIHtcbiAgICBsZXQgYWxsU3Ryb2tlcyA9ICFub2Rlcy5maW5kKChub2RlKSA9PiAnZmlsbHMnIGluIG5vZGUgJiYgbm9kZS5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbm9kZS5maWxscy5sZW5ndGggPiAwKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgIG5vZGUubmFtZSA9XG4gICAgICAgICAgICAncmdiLXRlbXBsYXRlICcgKyAoYWxsU3Ryb2tlcyAmJiBub2Rlcy5sZW5ndGggPiAzID8gJ2RyYXctbGluZScgOiAnYmxpbmsnKTtcbiAgICB9XG59XG5mdW5jdGlvbiBuYW1lU3RlcE5vZGUoc3RlcCkge1xuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMoc3RlcCk7XG4gICAgbGV0IGZpbGxzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ2ZpbGxzJyBpbiBuICYmIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG4uZmlsbHMubGVuZ3RoID4gMCk7XG4gICAgbGV0IHN0cm9rZXMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCk7XG4gICAgbGV0IG11bHRpc3RlcFR5cGUgPSBmaWxscy5sZW5ndGggPiAwID8gJ2JnJyA6ICdicnVzaCc7XG4gICAgbGV0IHN0cm9rZVdlaWdodHNBcnIgPSBzdHJva2VzLm1hcCgobm9kZSkgPT4gbm9kZVsnc3Ryb2tlV2VpZ2h0J10gfHwgMCk7XG4gICAgbGV0IG1heFdlaWdodCA9IE1hdGgubWF4KC4uLnN0cm9rZVdlaWdodHNBcnIpO1xuICAgIGxldCB3ZWlnaHQgPSBzdHJva2VzLmxlbmd0aCA+IDAgPyBtYXhXZWlnaHQgOiAyNTtcbiAgICBzdGVwLm5hbWUgPSBgc3RlcCBzLW11bHRpc3RlcC0ke211bHRpc3RlcFR5cGV9IGJzLSR7d2VpZ2h0fWA7XG59XG5mdW5jdGlvbiBjcmVhdGVTdGVwTm9kZShub2RlLCBub2Rlc0FycmF5LCBpbmRleCkge1xuICAgIGlmICghbm9kZXNBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBuYW1lTGVhZk5vZGVzKG5vZGVzQXJyYXkpO1xuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXNBcnJheSwgbm9kZSk7XG4gICAgaW5wdXQubmFtZSA9ICdpbnB1dCc7XG4gICAgY29uc3Qgc3RlcCA9IGZpZ21hLmdyb3VwKFtpbnB1dF0sIG5vZGUsIGluZGV4KTtcbiAgICBuYW1lU3RlcE5vZGUoc3RlcCk7XG4gICAgcmV0dXJuIHN0ZXA7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0TGFzdFN0ZXBPcmRlcigpIHtcbiAgICBjb25zdCBzdGVwc09yZGVyID0gZ2V0U3RlcHMoKVxuICAgICAgICAubWFwKChzKSA9PiBnZXRTdGVwT3JkZXIocykpXG4gICAgICAgIC5maWx0ZXIoKHMpID0+IHMgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIE1hdGgubWF4KC4uLnN0ZXBzT3JkZXIsIDApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlcGFyYXRlU3RlcCgpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgY29uc3QgbGVhdmVzID0gc2VsZWN0aW9uLmZpbHRlcigobm9kZSkgPT4gISgnY2hpbGRyZW4nIGluIG5vZGUpKTtcbiAgICBpZiAoIWxlYXZlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmaXJzdFBhcmVudFN0ZXAgPSBmaW5kUGFyZW50QnlUYWcoc2VsZWN0aW9uWzBdLCAnc3RlcCcpO1xuICAgIGlmIChpc1Jlc3VsdFN0ZXAoZmlyc3RQYXJlbnRTdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBpbmRleCA9IGdldE5vZGVJbmRleChmaXJzdFBhcmVudFN0ZXApO1xuICAgIGNvbnN0IHN0ZXAgPSBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGxlYXZlcywgaW5kZXgpO1xuICAgIGNvbnN0IHJlc3VsdFN0ZXAgPSBsZXNzb24uY2hpbGRyZW4uZmluZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xuICAgIGNvbnN0IGxhc3RTdGVwT3JkZXIgPSBnZXRMYXN0U3RlcE9yZGVyKCk7XG4gICAgaWYgKGxhc3RTdGVwT3JkZXIgPiAwKSB7XG4gICAgICAgIHNldFN0ZXBPcmRlcihyZXN1bHRTdGVwLCBsYXN0U3RlcE9yZGVyICsgMSk7XG4gICAgICAgIHNldFN0ZXBPcmRlcihzdGVwLCBsYXN0U3RlcE9yZGVyKTsgLy8gbGFzdCBzdGVwIGJlZm9yZSByZXN1bHRcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRUb01hcChtYXAsIGtleSwgbm9kZSkge1xuICAgIGlmICghbWFwLmhhcyhrZXkpKSB7XG4gICAgICAgIG1hcC5zZXQoa2V5LCBbXSk7XG4gICAgfVxuICAgIG1hcC5nZXQoa2V5KS5wdXNoKG5vZGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QnlDb2xvcigpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKCFzZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGFyZW50U3RlcCA9IGZpbmRQYXJlbnRCeVRhZyhzZWxlY3Rpb25bMF0sICdzdGVwJyk7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGNvbnN0IGxlYXZlcyA9IGZpbmRMZWFmTm9kZXMocGFyZW50U3RlcCk7XG4gICAgaWYgKCFwYXJlbnRTdGVwIHx8IGlzUmVzdWx0U3RlcChwYXJlbnRTdGVwKSB8fCBsZWF2ZXMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgZmlsbHNCeUNvbG9yID0gbmV3IE1hcCgpO1xuICAgIGxldCBzdHJva2VzQnlDb2xvciA9IG5ldyBNYXAoKTtcbiAgICBsZXQgdW5rbm93bk5vZGVzID0gW107XG4gICAgZmluZExlYWZOb2RlcyhwYXJlbnRTdGVwKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmICgnZmlsbHMnIGluIG4gJiZcbiAgICAgICAgICAgIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmXG4gICAgICAgICAgICBuLmZpbGxzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIG4uZmlsbHNbMF0udHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgYWRkVG9NYXAoZmlsbHNCeUNvbG9yLCBzdHJpbmdpZnlDb2xvcihuLmZpbGxzWzBdLmNvbG9yKSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoJ3N0cm9rZXMnIGluIG4gJiZcbiAgICAgICAgICAgIG4uc3Ryb2tlcy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBuLnN0cm9rZXNbMF0udHlwZSA9PT0gJ1NPTElEJykge1xuICAgICAgICAgICAgYWRkVG9NYXAoc3Ryb2tlc0J5Q29sb3IsIHN0cmluZ2lmeUNvbG9yKG4uc3Ryb2tlc1swXS5jb2xvciksIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdW5rbm93bk5vZGVzLnB1c2gobik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBmb3IgKGxldCBmaWxscyBvZiBmaWxsc0J5Q29sb3IudmFsdWVzKCkpIHtcbiAgICAgICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBmaWxscyk7XG4gICAgfVxuICAgIGZvciAobGV0IHN0cm9rZXMgb2Ygc3Ryb2tlc0J5Q29sb3IudmFsdWVzKCkpIHtcbiAgICAgICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBzdHJva2VzKTtcbiAgICB9XG4gICAgaWYgKHVua25vd25Ob2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgdW5rbm93bk5vZGVzKTtcbiAgICB9XG4gICAgLy8gTWFrZSBzdXJlIHRoZSByZXN1bHQgaXMgbG9jYXRlZCBhdCB0aGUgZW5kXG4gICAgY29uc3QgcmVzdWx0ID0gbGVzc29uLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHJlc3VsdC5yZW1vdmUoKTtcbiAgICB9XG4gICAgY3JlYXRlUmVzdWx0Tm9kZShsZXNzb24pO1xuICAgIC8vIFJlbW92ZSBvcmlnaW5hbCBub2RlIGlmIHRoZXJlIGFyZSByZW1haW5zXG4gICAgaWYgKCFwYXJlbnRTdGVwLnJlbW92ZWQpIHtcbiAgICAgICAgcGFyZW50U3RlcC5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGFnVW5vcmRlcmVkU3RlcHMoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBqb2luU3RlcHMoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGNvbnN0IGFsbFN0ZXBzID0gc2VsZWN0aW9uLmV2ZXJ5KChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpO1xuICAgIGNvbnN0IHN0ZXBzID0gc2VsZWN0aW9uLmZpbHRlcigobikgPT4gIWlzUmVzdWx0U3RlcChuKSk7XG4gICAgaWYgKCFhbGxTdGVwcyB8fCBzdGVwcy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5wdXROb2RlcyA9IHN0ZXBzXG4gICAgICAgIC5tYXAoKHN0ZXApID0+IHN0ZXAuY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBuLm5hbWUgPT09ICdpbnB1dCcgJiYgbi50eXBlID09PSAnR1JPVVAnKSlcbiAgICAgICAgLmZsYXQoKTtcbiAgICBjb25zdCBsZWF2ZXMgPSBpbnB1dE5vZGVzLm1hcCgobikgPT4gbi5jaGlsZHJlbikuZmxhdCgpO1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBpbmRleCA9IGdldE5vZGVJbmRleChzdGVwc1swXSk7XG4gICAgY29uc3QgZmlyc3RTdGVwT3JkZXIgPSBnZXRTdGVwT3JkZXIoc3RlcHNbMF0pO1xuICAgIGNvbnN0IGpvaW5lZFN0ZXAgPSBjcmVhdGVTdGVwTm9kZShsZXNzb24sIGxlYXZlcywgaW5kZXgpO1xuICAgIGlmIChmaXJzdFN0ZXBPcmRlcikge1xuICAgICAgICBzZXRTdGVwT3JkZXIoam9pbmVkU3RlcCwgZmlyc3RTdGVwT3JkZXIpO1xuICAgIH1cbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgZGlzcGxheU5vdGlmaWNhdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBmaW5kVGV4dHModGV4dHMpIHtcbiAgICByZXR1cm4gdGV4dHNcbiAgICAgICAgLmZpbmRBbGwoKG5vZGUpID0+IG5vZGUudHlwZSA9PT0gJ1RFWFQnKVxuICAgICAgICAuZmlsdGVyKChub2RlKSA9PiBub2RlLnZpc2libGUpO1xufVxuZnVuY3Rpb24gZ2V0U3R5bGVkU2VnbWVudHMobm9kZSkge1xuICAgIHJldHVybiBub2RlLmdldFN0eWxlZFRleHRTZWdtZW50cyhbXG4gICAgICAgICdmb250U2l6ZScsXG4gICAgICAgICdmb250TmFtZScsXG4gICAgICAgICdmb250V2VpZ2h0JyxcbiAgICAgICAgJ3RleHREZWNvcmF0aW9uJyxcbiAgICAgICAgJ3RleHRDYXNlJyxcbiAgICAgICAgJ2xpbmVIZWlnaHQnLFxuICAgICAgICAnbGV0dGVyU3BhY2luZycsXG4gICAgICAgICdmaWxscycsXG4gICAgICAgICd0ZXh0U3R5bGVJZCcsXG4gICAgICAgICdmaWxsU3R5bGVJZCcsXG4gICAgICAgICdsaXN0T3B0aW9ucycsXG4gICAgICAgICdpbmRlbnRhdGlvbicsXG4gICAgICAgICdoeXBlcmxpbmsnLFxuICAgIF0pO1xufVxuZnVuY3Rpb24gZXNjYXBlKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKVxuICAgICAgICAucmVwbGFjZSgvXFx8L2csICdcXFxcbCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyk7XG59XG5jb25zdCByZXBsYWNlbWVudHMgPSB7ICdcXFxcXFxcXCc6ICdcXFxcJywgJ1xcXFxuJzogJ1xcbicsICdcXFxcXCInOiAnXCInLCAnXFxcXGwnOiAnfCcgfTtcbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICAgIGlmIChzdHIubWF0Y2goL1xcfC8pIHx8IHN0ci5tYXRjaCgvKD88IVxcXFwpXCIvKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXFxcKFxcXFx8bnxcInxsKS9nLCBmdW5jdGlvbiAocmVwbGFjZSkge1xuICAgICAgICByZXR1cm4gcmVwbGFjZW1lbnRzW3JlcGxhY2VdO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkVGV4dChub2RlKSB7XG4gICAgcmV0dXJuIGdldFN0eWxlZFNlZ21lbnRzKG5vZGUpXG4gICAgICAgIC5tYXAoKHMpID0+IGVzY2FwZShzLmNoYXJhY3RlcnMpKVxuICAgICAgICAuam9pbignfCcpXG4gICAgICAgIC50cmltRW5kKCk7XG59XG5mdW5jdGlvbiBpbXBvcnRTdHlsZWRTZWdtZW50cyhzZWdtZW50VGV4dHMsIG5vZGUpIHtcbiAgICAvLyB1cGRhdGUgc2VnbWVudHMgaW4gcmV2ZXJzZSBvcmRlclxuICAgIGZvciAobGV0IGkgPSBzZWdtZW50VGV4dHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3Qgc2VnbWVudFRleHQgPSBzZWdtZW50VGV4dHNbaV07XG4gICAgICAgIGxldCBzdHlsZXMgPSBnZXRTdHlsZWRTZWdtZW50cyhub2RlKTtcbiAgICAgICAgaWYgKHNlZ21lbnRUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG5vZGUuaW5zZXJ0Q2hhcmFjdGVycyhzdHlsZXNbaV0uZW5kLCBzZWdtZW50VGV4dCwgJ0JFRk9SRScpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuZGVsZXRlQ2hhcmFjdGVycyhzdHlsZXNbaV0uc3RhcnQsIHN0eWxlc1tpXS5lbmQpO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRUZXh0cygpIHtcbiAgICBjb25zdCB0ZXh0cyA9IGZpbmRUZXh0cyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgcmV0dXJuICh0ZXh0c1xuICAgICAgICAubWFwKChub2RlKSA9PiBnZXRGb3JtYXR0ZWRUZXh0KG5vZGUpKVxuICAgICAgICAuZmlsdGVyKChzdHIpID0+IHN0ci5sZW5ndGggPiAwKVxuICAgICAgICAvLyByZW1vdmUgYXJyYXkgZHVwbGljYXRlc1xuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcbn1cbmZ1bmN0aW9uIGxvYWRGb250cyh0ZXh0cykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IGFsbEZvbnRzID0gW107XG4gICAgICAgIHRleHRzLmZvckVhY2goKHR4dCkgPT4ge1xuICAgICAgICAgICAgZ2V0U3R5bGVkU2VnbWVudHModHh0KS5tYXAoKHMpID0+IHtcbiAgICAgICAgICAgICAgICBhbGxGb250cy5wdXNoKHMuZm9udE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB1bmlxdWVGb250cyA9IGFsbEZvbnRzLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PiBpbmRleCA9PT1cbiAgICAgICAgICAgIHNlbGYuZmluZEluZGV4KCh0KSA9PiB0LmZhbWlseSA9PT0gdmFsdWUuZmFtaWx5ICYmIHQuc3R5bGUgPT09IHZhbHVlLnN0eWxlKSk7XG4gICAgICAgIGZvciAobGV0IGZvbnQgb2YgdW5pcXVlRm9udHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRUZXh0cyh0cmFuc2xhdGlvbnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGRpc3BsYXlOb3RpZmljYXRpb24oJ0VtcHR5IGlucHV0Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGV4dHMgPSBmaW5kVGV4dHMoZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICB5aWVsZCBsb2FkRm9udHModGV4dHMpO1xuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFRleHQgPSBnZXRGb3JtYXR0ZWRUZXh0KHR4dCk7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHRyYW5zbGF0aW9uc1tmb3JtYXR0ZWRUZXh0XTtcbiAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTtcbiAgICAgICAgICAgIGNvbnN0IG9sZFNlZ21lbnRzID0gZm9ybWF0dGVkVGV4dC5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgY29uc3QgbmV3U2VnbWVudHMgPSB0cmFuc2xhdGlvbi5zcGxpdCgnfCcpLm1hcCgoc3RyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdW5lc2NhcGUoc3RyKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBGYWlsZWQgdG8gdW5lc2NhcGU6ICR7c3RyfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogZGVsZXRlIGFsbCB0ZXh0XG4gICAgICAgICAgICBpZiAobmV3U2VnbWVudHMubGVuZ3RoID09PSAxICYmIG5ld1NlZ21lbnRzWzBdID09PSAnJykge1xuICAgICAgICAgICAgICAgIHR4dC5jaGFyYWN0ZXJzID0gJyc7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG8gbm90IGFsbG93IHNlZ21lbnRzIGxlbmd0aCBtaXNtYXRjaFxuICAgICAgICAgICAgaWYgKG5ld1NlZ21lbnRzLmxlbmd0aCAhPT0gb2xkU2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gYFdyb25nIHNlZ21lbnQgY291bnQgKCR7bmV3U2VnbWVudHMubGVuZ3RofSDiiaAgJHtvbGRTZWdtZW50cy5sZW5ndGh9KTogJHtmb3JtYXR0ZWRUZXh0fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgZGlzcGxheU5vdGlmaWNhdGlvbihlcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW1wb3J0U3R5bGVkU2VnbWVudHMobmV3U2VnbWVudHMsIHR4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgYWRkVGFnLCBmaW5kQWxsLCBnZXRDdXJyZW50TGVzc29uLCBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE9yZGVyKGxlc3Nvbikge1xuICAgIGlmIChsZXNzb24uZmluZENoaWxkKChuKSA9PiAhIWdldFRhZ3MobikuZmluZCgodCkgPT4gL15vLS8udGVzdCh0KSkpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdGb3VuZCBvLXRhZy4gZm9ybWF0T3JkZXIgYWJvcnQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHNldHRpbmdzID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc2V0dGluZ3MnKSk7XG4gICAgYWRkVGFnKHNldHRpbmdzLCAnb3JkZXItbGF5ZXJzJyk7XG4gICAgY29uc3QgbGF5ZXJSZWdleCA9IC9eKHMtbXVsdGlzdGVwLWJydXNoLXxzLW11bHRpc3RlcC1iZy0pKFxcZCspJC87XG4gICAgY29uc3Qgc3RlcHMgPSBsZXNzb24uZmluZENoaWxkcmVuKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykgJiYgIWdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgYWRkVGFnKHJlc3VsdCwgYG8tJHtzdGVwcy5sZW5ndGggKyAxfWApO1xuICAgIHN0ZXBzLnJldmVyc2UoKS5mb3JFYWNoKChzdGVwLCBvcmRlcikgPT4ge1xuICAgICAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIGNvbnN0IGxheWVyVGFnID0gdGFncy5maW5kKCh0KSA9PiBsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICBsZXQgbGF5ZXIgPSA0O1xuICAgICAgICBpZiAobGF5ZXJUYWcpIHtcbiAgICAgICAgICAgIGxheWVyID0gcGFyc2VJbnQobGF5ZXJSZWdleC5leGVjKGxheWVyVGFnKVsyXSk7XG4gICAgICAgICAgICB0YWdzID0gdGFncy5maWx0ZXIoKHQpID0+ICFsYXllclJlZ2V4LnRlc3QodCkpO1xuICAgICAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgL14ocy1tdWx0aXN0ZXAtYnJ1c2h8cy1tdWx0aXN0ZXAtYmcpLy5leGVjKGxheWVyVGFnKVsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RlcC5zZXRQbHVnaW5EYXRhKCdsYXllcicsIEpTT04uc3RyaW5naWZ5KGxheWVyKSk7XG4gICAgICAgIHRhZ3MucHVzaChgby0ke29yZGVyICsgMX1gKTtcbiAgICAgICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XG4gICAgfSk7XG4gICAgbGV0IHNvcnRlZFN0ZXBzID0gc3RlcHMuc29ydCgoYSwgYikgPT4gSlNPTi5wYXJzZShiLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpIC1cbiAgICAgICAgSlNPTi5wYXJzZShhLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpKTtcbiAgICBzb3J0ZWRTdGVwcy5mb3JFYWNoKChzKSA9PiBsZXNzb24uaW5zZXJ0Q2hpbGQoMSwgcykpO1xufVxuZnVuY3Rpb24gYXV0b0Zvcm1hdCgpIHtcbiAgICBjb25zdCB0aHVtYlBhZ2UgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZS50b1VwcGVyQ2FzZSgpID09ICdUSFVNQk5BSUxTJyk7XG4gICAgaWYgKHRodW1iUGFnZSkge1xuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gdGh1bWJQYWdlLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XG4gICAgICAgICAgICBjbG9uZS5yZXNpemUoNDAwLCA0MDApO1xuICAgICAgICAgICAgY2xvbmUubmFtZSA9ICd0aHVtYm5haWwnO1xuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICBpZiAob2xkTGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSAnbGVzc29uJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJyk7XG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnkgPSBsZXNzb25GcmFtZS55O1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLnJlc2l6ZSg0MCwgNDApO1xuICAgICAgICBuLnggPSAxMDtcbiAgICAgICAgbi55ID0gMTA7XG4gICAgfSk7XG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zdGVwIHMtbXVsdGlzdGVwLXJlc3VsdC8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0ubmFtZSA9ICd0ZW1wbGF0ZSc7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0ubmFtZSA9ICcvaWdub3JlJztcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDYwO1xuICAgIH0pO1xufVxub24oJ2F1dG9Gb3JtYXQnLCBhdXRvRm9ybWF0KTtcbm9uKCdmb3JtYXRPcmRlcicsICgpID0+IGZvcm1hdE9yZGVyKGdldEN1cnJlbnRMZXNzb24oKSkpO1xuIiwiaW1wb3J0ICcuL2NyZWF0ZSc7XG5pbXBvcnQgJy4vdHVuZSc7XG5pbXBvcnQgJy4vZm9ybWF0JztcbmltcG9ydCAnLi9saW50ZXInO1xuaW1wb3J0ICcuL3B1Ymxpc2gnO1xuaW1wb3J0ICcuLi9ycGMtYXBpJztcbmltcG9ydCB7IGN1cnJlbnRQYWdlQ2hhbmdlZCwgc2VsZWN0aW9uQ2hhbmdlZCwgdXBkYXRlRGlzcGxheSB9IGZyb20gJy4vdHVuZSc7XG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkucmVzaXplKDM0MCwgNDcwKTtcbmNvbnNvbGUuY2xlYXIoKTtcbmZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XG4gICAgc2VsZWN0aW9uQ2hhbmdlZCgpO1xufSk7XG5maWdtYS5vbignY3VycmVudHBhZ2VjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY3VycmVudFBhZ2VDaGFuZ2VkKGZpZ21hLmN1cnJlbnRQYWdlKTtcbn0pO1xuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG59LCAxNTAwKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgZ2V0VGFncywgZmluZEFsbCwgZmluZFRhZywgZGVzY2VuZGFudHMsIGdldEN1cnJlbnRMZXNzb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgZGVsZXRlVG1wLCBkaXNwbGF5QWxsIH0gZnJvbSAnLi90dW5lJztcbmxldCBlcnJvcnMgPSBbXTtcbmxldCB6b29tU2NhbGUgPSAxO1xubGV0IG1heEJzID0gMTIuODtcbmxldCBvcmRlciA9ICdzdGVwcyc7XG5leHBvcnQgdmFyIEVycm9yTGV2ZWw7XG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJFUlJPUlwiXSA9IDBdID0gXCJFUlJPUlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xufSkoRXJyb3JMZXZlbCB8fCAoRXJyb3JMZXZlbCA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RXJyb3IoaW5kZXgpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICgoX2EgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFnZSkge1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IGVycm9yc1tpbmRleF0ucGFnZTtcbiAgICB9XG4gICAgLy8gc2V0VGltZW91dCgoKSA9PiB7IC8vIGNyYXNoZXMsIHByb2JhYmx5IGJlY2F1c2Ugb2Ygc2VsZWN0aW9uIGhhcHBlbmluZyBmcm9tIHRoZSBEaXNwbGF5Rm9ybVxuICAgIGlmICgoX2IgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iubm9kZSkge1xuICAgICAgICBlcnJvcnNbaW5kZXhdLnBhZ2Uuc2VsZWN0aW9uID0gW2Vycm9yc1tpbmRleF0ubm9kZV07XG4gICAgfVxuICAgIC8vIH0sIDApXG59XG5leHBvcnQgZnVuY3Rpb24gcHJpbnRFcnJvcnMoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3Qgc2F2ZWRFcnJvcnMgPSB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdlcnJvcnNGb3JQcmludCcpO1xuICAgICAgICBsZXQgc29ydGVkRXJyb3JzID0gZXJyb3JzLnNvcnQoKGEsIGIpID0+IGEubGV2ZWwgLSBiLmxldmVsKVxuICAgICAgICAgICAgLm1hcCgoZSkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlnbm9yZTogZS5pZ25vcmUsXG4gICAgICAgICAgICAgICAgcGFnZU5hbWU6IChfYSA9IGUucGFnZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUsXG4gICAgICAgICAgICAgICAgbm9kZU5hbWU6IChfYiA9IGUubm9kZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5hbWUsXG4gICAgICAgICAgICAgICAgbm9kZVR5cGU6IChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnR5cGUsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGUuZXJyb3IsXG4gICAgICAgICAgICAgICAgbGV2ZWw6IGUubGV2ZWwsXG4gICAgICAgICAgICAgICAgZXJyb3JDb2xvcjogZS5sZXZlbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc2F2ZWRFcnJvcnMpIHtcbiAgICAgICAgICAgIHNvcnRlZEVycm9ycyA9IHNvcnRlZEVycm9ycy5tYXAoKGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzYXZlZEVycm9yID0gc2F2ZWRFcnJvcnMuZmluZCgocykgPT4gcy5wYWdlTmFtZSA9PT0gZS5wYWdlTmFtZSAmJiBzLm5vZGVOYW1lID09PSBlLm5vZGVOYW1lICYmIHMuZXJyb3IgPT09IGUuZXJyb3IpO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGUuaWdub3JlID0gc2F2ZWRFcnJvci5pZ25vcmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZWN0RXJyb3IoMCk7XG4gICAgICAgIHJldHVybiBzb3J0ZWRFcnJvcnM7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBhc3NlcnQodmFsLCBlcnJvciwgcGFnZSwgbm9kZSwgbGV2ZWwgPSBFcnJvckxldmVsLkVSUk9SKSB7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goeyBub2RlLCBwYWdlLCBlcnJvciwgbGV2ZWwgfSk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5mdW5jdGlvbiBkZWVwTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZWVwTm9kZXMobikpO1xufVxuZnVuY3Rpb24gbGludEZpbGxzKG5vZGUsIHBhZ2UsIGZpbGxzKSB7XG4gICAgY29uc3QgcmdidCA9IGZpbmRUYWcobm9kZSwgL15yZ2ItdGVtcGxhdGUkLyk7XG4gICAgZmlsbHMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgICBhc3NlcnQoZi52aXNpYmxlLCAnRmlsbCBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KGYudHlwZSA9PSAnU09MSUQnIHx8ICFyZ2J0LCAnRmlsbCBtdXN0IGJlIHNvbGlkJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGlmIChmLnR5cGUgPT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgIGFzc2VydChmLm9wYWNpdHkgPT0gMSwgJ0ltYWdlIGZpbGwgbXVzdCBub3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGxpbnRTdHJva2VzKG5vZGUsIHBhZ2UsIHN0cm9rZXMpIHtcbiAgICBjb25zdCByZ2J0ID0gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKTtcbiAgICBzdHJva2VzLmZvckVhY2goKHMpID0+IHtcbiAgICAgICAgYXNzZXJ0KHMudmlzaWJsZSwgJ1N0cm9rZSBtdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgYXNzZXJ0KHMudHlwZSA9PSAnU09MSUQnIHx8ICFyZ2J0LCAnU3Ryb2tlIG11c3QgYmUgc29saWQnLCBwYWdlLCBub2RlKTtcbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgYXNzZXJ0KHMub3BhY2l0eSA9PSAxLCAnSW1hZ2Ugc3Ryb2tlIG11c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IC9ST1VORHxOT05FLy50ZXN0KFN0cmluZyhub2RlLnN0cm9rZUNhcCkpLCBgU3Ryb2tlIGNhcHMgbXVzdCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gJ1JPVU5EJywgYFN0cm9rZSBqb2lucyBzaG91bGQgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUpvaW4pfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xufVxuY29uc3QgdmFsaWRWZWN0b3JUYWdzID0gL15cXC98XmRyYXctbGluZSR8XmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyR8XmZsaXAkfF5bdlZdZWN0b3IkfF5cXGQrJHxeRWxsaXBzZSR8XlJlY3RhbmdsZSR8XmZseS1mcm9tLWJvdHRvbSR8XmZseS1mcm9tLWxlZnQkfF5mbHktZnJvbS1yaWdodCR8XmFwcGVhciR8XndpZ2dsZS1cXGQrJC87XG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCh2YWxpZFZlY3RvclRhZ3MudGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XG4gICAgbGV0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXM7XG4gICAgYXNzZXJ0KCFmaWxscy5sZW5ndGggfHwgIXN0cm9rZXMubGVuZ3RoLCAnU2hvdWxkIG5vdCBoYXZlIGZpbGwrc3Ryb2tlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBjb25zdCByZ2J0ID0gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKTtcbiAgICBjb25zdCBhbmltID0gZmluZFRhZyhub2RlLCAvXmRyYXctbGluZSR8XmJsaW5rJC8pO1xuICAgIGxpbnRTdHJva2VzKG5vZGUsIHBhZ2UsIHN0cm9rZXMpO1xuICAgIGxpbnRGaWxscyhub2RlLCBwYWdlLCBmaWxscyk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJyBvciAnZHJhdy1saW5lJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5jb25zdCB2YWxpZEdyb3VwVGFncyA9IC9eXFwvfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbHktZnJvbS1ib3R0b20kfF5mbHktZnJvbS1sZWZ0JHxeZmx5LWZyb20tcmlnaHQkfF5hcHBlYXIkfF53aWdnbGUtXFxkKyR8XmRyYXctbGluZSR8XlxcZCskfF5bZ0ddcm91cCQvO1xuZnVuY3Rpb24gbGludEdyb3VwKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQoIS9CT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpLCAnTm90aWNlIEJPT0xFQU5fT1BFUkFUSU9OJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgJ05hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLicsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCh2YWxpZEdyb3VwVGFncy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaydcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxufVxuZnVuY3Rpb24gbGludElucHV0KHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5uYW1lID09ICdpbnB1dCcsIFwiTXVzdCBiZSAnaW5wdXQnXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGRlc2NlbmRhbnRzKG5vZGUpLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdCh2LnR5cGUpKSB7XG4gICAgICAgICAgICBsaW50R3JvdXAocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRWZWN0b3IocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnR1JPVVAvVkVDVE9SL1JFQ1RBTkdMRS9FTExJUFNFL1RFWFQnIHR5cGVcIiwgcGFnZSwgdik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmNvbnN0IHZhbGlkU2V0dGluZ3NUYWdzID0gL15cXC98XnNldHRpbmdzJHxeY2FwdHVyZS1jb2xvciR8Xnpvb20tc2NhbGUtXFxkKyR8Xm9yZGVyLWxheWVycyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5icnVzaC1uYW1lLVxcdyskfF5zcy1cXGQrJHxeYnMtXFxkKyQvO1xuZnVuY3Rpb24gbGludFNldHRpbmdzKHBhZ2UsIG5vZGUpIHtcbiAgICB2YXIgX2E7XG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSAnRUxMSVBTRScsIFwiTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdcIiwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KHZhbGlkU2V0dGluZ3NUYWdzLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgaWYgKHRhZ3MuZmluZCgodGFnKSA9PiAvXm9yZGVyLWxheWVycyQvLnRlc3QodGFnKSkpIHtcbiAgICAgICAgb3JkZXIgPSAnbGF5ZXJzJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9yZGVyID0gJ3N0ZXBzJztcbiAgICB9XG4gICAgem9vbVNjYWxlID0gcGFyc2VJbnQoKChfYSA9IHRhZ3MuZmluZCgocykgPT4gL156b29tLXNjYWxlLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3pvb20tc2NhbGUtJywgJycpKSB8fFxuICAgICAgICAnMScpO1xuICAgIGFzc2VydCh6b29tU2NhbGUgPj0gMSAmJiB6b29tU2NhbGUgPD0gNSwgYE11c3QgYmUgMSA8PSB6b29tLXNjYWxlIDw9IDUgKCR7em9vbVNjYWxlfSlgLCBwYWdlLCBub2RlKTtcbn1cbmNvbnN0IHZhbGlkU3RlcFRhZ3MgPSAvXlxcL3xec3RlcCR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaCR8XnMtY29udGludWUkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxecy1tdWx0aXN0ZXAtYmckfF5icnVzaC1uYW1lLVxcdyskfF5jbGVhci1sYXllci0oXFxkKyw/KSskfF5zcy1cXGQrJHxeYnMtXFxkKyR8Xm8tXFxkKyR8XmFsbG93LXVuZG8kfF5zaGFyZS1idXR0b24kfF5jbGVhci1iZWZvcmUkLztcbmZ1bmN0aW9uIGxpbnRTdGVwKHBhZ2UsIHN0ZXApIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBpZiAoIWFzc2VydChzdGVwLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgc3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQoc3RlcC5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydChzdGVwLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBzdGVwKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQodmFsaWRTdGVwVGFncy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgc3RlcCk7XG4gICAgICAgIC8vIGFzc2VydCghL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJnJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIGlzIG9ic29sZXRlYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICB9KTtcbiAgICBjb25zdCBiZyA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1iZyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicnVzaCA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBzcyA9IHBhcnNlSW50KChfYSA9IHRhZ3MuZmluZCgocykgPT4gL15zcy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKCdzcy0nLCAnJykpO1xuICAgIGNvbnN0IG8gPSB0YWdzLmZpbmQoKHMpID0+IC9eby1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3QgYnMgPSBwYXJzZUludCgoX2IgPSB0YWdzLmZpbmQoKHMpID0+IC9eYnMtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucmVwbGFjZSgnYnMtJywgJycpKTtcbiAgICBjb25zdCBicnVzaE5hbWUgPSAoX2MgPSB0YWdzXG4gICAgICAgIC5maW5kKChzKSA9PiAvXmJydXNoLW5hbWUtXFx3KyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MucmVwbGFjZSgnYnJ1c2gtbmFtZS0nLCAnJyk7XG4gICAgY29uc3QgdGVybWluYWxOb2RlcyA9IGRlc2NlbmRhbnRzKHN0ZXApLmZpbHRlcigodikgPT4gdlsnY2hpbGRyZW4nXSA9PSB1bmRlZmluZWQpO1xuICAgIGNvbnN0IG1heFNpemUgPSB0ZXJtaW5hbE5vZGVzLnJlZHVjZSgoYWNjLCB2KSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHYud2lkdGgsIHYuaGVpZ2h0KTtcbiAgICB9LCAwKTtcbiAgICBtYXhCcyA9IE1hdGgubWF4KGJzID8gYnMgOiBtYXhCcywgbWF4QnMpO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMjAgfHwgbWF4U2l6ZSA8PSAxMDAsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIGxvbmcgbGluZXMuIENvbnNpZGVyIHVzaW5nIGJnIHRlbXBsYXRlLiAke21heFNpemV9PjEwMGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCB0ZXJtaW5hbE5vZGVzLmxlbmd0aCA8PSA4LCBgU2hvdWxkIG5vdCB1c2Ugc3M8MjAgd2l0aCB0b28gbWFueSBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7dGVybWluYWxOb2Rlcy5sZW5ndGh9PjhgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gMTAgfHwgYnJ1c2hOYW1lID09ICdwZW5jaWwnLCBgU2hvdWxkIG5vdCB1c2UgYnM8MTAuICR7YnN9PDEwYCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDE1LCAnc3MgbXVzdCBiZSA+PSAxNScsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghc3MgfHwgIWJzIHx8IHNzID4gYnMsICdzcyBtdXN0IGJlID4gYnMnLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzIDw9IHpvb21TY2FsZSAqIDEyLjgsIGBicyBtdXN0IGJlIDw9ICR7em9vbVNjYWxlICogMTIuOH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gem9vbVNjYWxlICogMC40NCwgYGJzIG11c3QgYmUgPj0gJHt6b29tU2NhbGUgKiAwLjQ0fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFvIHx8IG9yZGVyID09ICdsYXllcnMnLCBgJHtvfSBtdXN0IGJlIHVzZWQgb25seSB3aXRoIHNldHRpbmdzIG9yZGVyLWxheWVyc2AsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydChvcmRlciAhPT0gJ2xheWVycycgfHwgISFvLCAnTXVzdCBoYXZlIG8tTiBvcmRlciBudW1iZXInLCBwYWdlLCBzdGVwKTtcbiAgICBjb25zdCBzZiA9IHN0ZXAuZmluZE9uZSgobikgPT4geyB2YXIgX2E7IHJldHVybiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSAmJiAoKF9hID0gbi5zdHJva2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA+IDA7IH0pO1xuICAgIGNvbnN0IGZmcyA9IHN0ZXAuZmluZEFsbCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykgJiYgbi5maWxscyAmJiBuLmZpbGxzWzBdKTtcbiAgICBjb25zdCBiaWdGZnMgPSBmZnMuZmlsdGVyKChuKSA9PiBuLndpZHRoID4gMjcgfHwgbi5oZWlnaHQgPiAyNyk7XG4gICAgY29uc3QgZmYgPSBmZnMubGVuZ3RoID4gMDtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiBzZiksICdTaG91bGQgbm90IHVzZSBiZytzcyAoc3Ryb2tlIHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiAhc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBub3QgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLldBUk4pO1xuICAgIGFzc2VydCghYmcgfHwgZmYsIFwiYmcgc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRob3V0IGZpbGxlZC1pbiB2ZWN0b3JzXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFicnVzaCB8fCBiaWdGZnMubGVuZ3RoID09IDAsIFwiYnJ1c2ggc3RlcCBzaG91bGRuJ3QgYmUgdXNlZCB3aXRoIGZpbGxlZC1pbiB2ZWN0b3JzIChzaXplID4gMjcpXCIsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgc3RlcC5jaGlsZHJlbi5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIGlmIChuLm5hbWUgPT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgbGludElucHV0KHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG4ubmFtZSA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICAgICAgLy8gbGludCB0ZW1wbGF0ZVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ2lucHV0JyBvciAndGVtcGxhdGUnXCIsIHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgYmxpbmtOb2RlcyA9IGZpbmRBbGwoc3RlcCwgKG4pID0+IGdldFRhZ3MobikuZmluZCgodCkgPT4gL15ibGluayQvLnRlc3QodCkpICE9PSB1bmRlZmluZWQpLmZsYXRNYXAoZGVlcE5vZGVzKTtcbiAgICBjb25zdCBmaWxsZWROb2RlID0gYmxpbmtOb2Rlcy5maW5kKChuKSA9PiBuLmZpbGxzWzBdKTtcbiAgICBhc3NlcnQoYmxpbmtOb2Rlcy5sZW5ndGggPT0gMCB8fCAhIWZpbGxlZE5vZGUgfHwgYmxpbmtOb2Rlcy5sZW5ndGggPiAzLCAnU2hvdWxkIHVzZSBkcmF3LWxpbmUgaWYgPCA0IGxpbmVzJywgcGFnZSwgYmxpbmtOb2Rlc1swXSwgRXJyb3JMZXZlbC5JTkZPKTtcbn1cbmZ1bmN0aW9uIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnRlJBTUUnLCBcIk11c3QgYmUgJ0ZSQU1FJyB0eXBlXCIsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gMTM2NiAmJiBub2RlLmhlaWdodCA9PSAxMDI0LCAnTXVzdCBiZSAxMzY2eDEwMjQnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoISFub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKSwgXCJNdXN0IGhhdmUgJ3MtbXVsdGlzdGVwLXJlc3VsdCcgY2hpbGRcIiwgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHNldHRpbmdzID0gbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSk7XG4gICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgIGxpbnRTZXR0aW5ncyhwYWdlLCBzZXR0aW5ncyk7XG4gICAgfVxuICAgIGxldCBvcmRlck51bWJlcnMgPSB7fTtcbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IC9eby0oXFxkKykkLy5leGVjKHRhZyk7XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbyA9IGZvdW5kWzFdO1xuICAgICAgICAgICAgYXNzZXJ0KCFvcmRlck51bWJlcnNbb10sIGBNdXN0IGhhdmUgdW5pcXVlICR7dGFnfSB2YWx1ZXNgLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJOdW1iZXJzW29dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAoc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3N0ZXAnKSkge1xuICAgICAgICAgICAgbGludFN0ZXAocGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXN0ZXAubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnc2V0dGluZ3MnIG9yICdzdGVwJ1wiLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBhc3NlcnQoXG4gICAgLy8gICBtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsXG4gICAgLy8gICBgem9vbS1zY2FsZSAke3pvb21TY2FsZX0gbXVzdCBiZSAke01hdGguY2VpbChcbiAgICAvLyAgICAgbWF4QnMgLyAxMi44XG4gICAgLy8gICApfSBmb3IgbWF4IGJzICR7bWF4QnN9IHVzZWRgLFxuICAgIC8vICAgcGFnZSxcbiAgICAvLyAgIG5vZGVcbiAgICAvLyApXG59XG5mdW5jdGlvbiBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gNDAwICYmIG5vZGUuaGVpZ2h0ID09IDQwMCwgJ011c3QgYmUgNDAweDQwMCcsIHBhZ2UsIG5vZGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxpbnRQYWdlKGN1cnJlbnRQYWdlLCBhcHBlbmRFcnJvcnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIWFwcGVuZEVycm9ycykge1xuICAgICAgICAgICAgZXJyb3JzID0gW107XG4gICAgICAgICAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgICAgICAgICB5aWVsZCBkZWxldGVUbXAoKTtcbiAgICAgICAgICAgIGlmIChsZXNzb24pIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5QWxsKGxlc3NvbiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFnZSA9IGN1cnJlbnRQYWdlID8gY3VycmVudFBhZ2UgOiBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAgICAgaWYgKC9eXFwvfF5JTkRFWCQvLnRlc3QocGFnZS5uYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vdXBkYXRlRGlzcGxheShwYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSwgbmV4dEJydXNoU3RlcDogZmFsc2UgfSlcbiAgICAgICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFxcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnXCIsIHBhZ2UpO1xuICAgICAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9ebGVzc29uJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgXCJNdXN0IGNvbnRhaW4gZXhhY3RseSAxICdsZXNzb24nXCIsIHBhZ2UpO1xuICAgICAgICBmb3IgKGxldCBub2RlIG9mIHBhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5hbWUgPT0gJ2xlc3NvbicpIHtcbiAgICAgICAgICAgICAgICBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5uYW1lID09ICd0aHVtYm5haWwnKSB7XG4gICAgICAgICAgICAgICAgbGludFRodW1ibmFpbChwYWdlLCBub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFzc2VydCgvXlxcLy8udGVzdChub2RlLm5hbWUpLCBcIk11c3QgYmUgJ3RodW1ibmFpbCcgb3IgJ2xlc3NvbicuIFVzZSBzbGFzaCB0byAvaWdub3JlLlwiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmludEVycm9ycygpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbGludEluZGV4KHBhZ2UpIHtcbiAgICBpZiAoIWFzc2VydChwYWdlLmNoaWxkcmVuLmxlbmd0aCA9PSAxLCAnSW5kZXggcGFnZSBtdXN0IGNvbnRhaW4gZXhhY3RseSAxIGVsZW1lbnQnLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XG4gICAgbGludFRodW1ibmFpbChwYWdlLCBwYWdlLmNoaWxkcmVuWzBdKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBsaW50Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGVycm9ycyA9IFtdO1xuICAgICAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgICAgIGlmIChsZXNzb24pIHtcbiAgICAgICAgICAgIGRpc3BsYXlBbGwobGVzc29uLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBhc3NlcnQoL15DT1VSU0UtW2EtelxcLTAtOV0rJC8udGVzdChmaWdtYS5yb290Lm5hbWUpLCBgQ291cnNlIG5hbWUgJyR7ZmlnbWEucm9vdC5uYW1lfScgbXVzdCBtYXRjaCBDT1VSU0UtW2EtelxcXFwtMC05XStgKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZSA9PSAnSU5ERVgnKTtcbiAgICAgICAgaWYgKGFzc2VydCghIWluZGV4LCBcIk11c3QgaGF2ZSAnSU5ERVgnIHBhZ2VcIikpIHtcbiAgICAgICAgICAgIGxpbnRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZmluZCBhbGwgbm9uLXVuaXF1ZSBuYW1lZCBwYWdlc1xuICAgICAgICBjb25zdCBub25VbmlxdWUgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbHRlcigocCwgaSwgYSkgPT4gYS5maW5kSW5kZXgoKHAyKSA9PiBwMi5uYW1lID09IHAubmFtZSkgIT0gaSk7XG4gICAgICAgIG5vblVuaXF1ZS5mb3JFYWNoKChwKSA9PiBhc3NlcnQoZmFsc2UsIGBQYWdlIG5hbWUgJyR7cC5uYW1lfScgbXVzdCBiZSB1bmlxdWVgLCBwKSk7XG4gICAgICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICAgICAgbGludFBhZ2UocGFnZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByaW50RXJyb3JzKCk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUVycm9ycyhlcnJvcnNGb3JQcmludCkge1xuICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdlcnJvcnNGb3JQcmludCcsIGVycm9yc0ZvclByaW50KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgZmluZEFsbCwgcHJpbnQgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBcInRhc2stbmFtZSAke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiID0gXCIke2NhcGl0YWxpemUocGFnZS5uYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmZ1bmN0aW9uIHByZXBhcmVDb3Vyc2VGb3JQdWJsaXNoaW5nKCkge1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IG5vZGUubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAhIW5vZGUpLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKCd2aXNpYmxlJyBpbiBub2RlKSB7XG4gICAgICAgICAgICBub2RlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TGVzc29uKHBhZ2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uaW5kZXhPZihwYWdlKTtcbiAgICAgICAgY29uc3QgbGVzc29uTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICdsZXNzb24nKTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICd0aHVtYm5haWwnKTtcbiAgICAgICAgaWYgKCFsZXNzb25Ob2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxlc3Nvbk5vZGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgZm9ybWF0OiAnU1ZHJyxcbiAgICAgICAgICAgIC8vIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsID0geWllbGQgdGh1bWJuYWlsTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxuICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY291cnNlUGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXG4gICAgICAgICAgICBwYXRoOiBwYWdlLm5hbWUsXG4gICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHByZXBhcmVDb3Vyc2VGb3JQdWJsaXNoaW5nKCk7XG4gICAgICAgIGNvbnN0IFtsZXNzb25zLCB0aHVtYm5haWxdID0geWllbGQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5tYXAoKHBhZ2UpID0+IGV4cG9ydExlc3NvbihwYWdlKSkpLFxuICAgICAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlblxuICAgICAgICAgICAgICAgIC5maW5kKChwYWdlKSA9PiBwYWdlLm5hbWUgPT0gJ0lOREVYJylcbiAgICAgICAgICAgICAgICAuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnV0lEVEgnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIGxlc3NvbnMsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVN3aWZ0Q29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCAnJyk7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWVcbiAgICAgICAgLnNwbGl0KCctJylcbiAgICAgICAgLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpXG4gICAgICAgIC5qb2luKCcnKTtcbiAgICBzd2lmdENvdXJzZU5hbWUgPVxuICAgICAgICBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XG4gICAgbGV0IHRhc2tzID0gJyc7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnSU5ERVgnKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICBsZXQgJHtzd2lmdENvdXJzZU5hbWV9ID0gQ291cnNlKFxuICAgIHBhdGg6IFwiJHtjb3Vyc2VOYW1lfVwiLFxuICAgIGF1dGhvcjogUkVQTEFDRSxcbiAgICB0YXNrczogW1xuJHt0YXNrc30gICAgXSlcbmA7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKSB7XG4gICAgY29uc3QgY29kZSA9IGdlbmVyYXRlU3dpZnRDb2RlKCkgKyBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKTtcbiAgICBwcmludChjb2RlKTtcbn1cbm9uKCdnZW5lcmF0ZUNvZGUnLCBnZW5lcmF0ZUNvZGUpO1xuIiwiaW1wb3J0IHsgZ2V0TGFzdFN0ZXBPcmRlciB9IGZyb20gJy4vY3JlYXRlJztcbmltcG9ydCB7IGdldFRhZ3MsIGZpbmRMZWFmTm9kZXMsIGdldEN1cnJlbnRMZXNzb24sIHNldFN0ZXBPcmRlciB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0UGFpbnRDb2xvcihwYWludCkge1xuICAgIGlmIChwYWludC50eXBlID09PSAnU09MSUQnKSB7XG4gICAgICAgIGxldCB7IHIsIGcsIGIgfSA9IHBhaW50LmNvbG9yO1xuICAgICAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcbiAgICAgICAgZyA9IE1hdGgucm91bmQoZyAqIDI1NSk7XG4gICAgICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xuICAgICAgICByZXR1cm4geyByLCBnLCBiLCBhOiAxIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyByOiAxNjYsIGc6IDE2NiwgYjogMTY2LCBhOiAxIH07XG4gICAgfVxufVxuZnVuY3Rpb24gZGlzcGxheUNvbG9yKHsgciwgZywgYiwgYSB9KSB7XG4gICAgcmV0dXJuIGByZ2JhKCR7cn0sICR7Z30sICR7Yn0sICR7YX0pYDtcbn1cbmZ1bmN0aW9uIGdldENvbG9ycyhub2RlKSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwIH07IC8vIHRyYW5zcGFyZW50ID0gZGVmYXVsdCBjb2xvclxuICAgIGxldCBmaWxscyA9IGRlZmF1bHRDb2xvcjtcbiAgICBsZXQgc3Ryb2tlcyA9IGRlZmF1bHRDb2xvcjtcbiAgICBjb25zdCBsZWFmID0gZmluZExlYWZOb2Rlcyhub2RlKVswXTtcbiAgICBpZiAoJ2ZpbGxzJyBpbiBsZWFmICYmIGxlYWYuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIGxlYWYuZmlsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBmaWxscyA9IGdldFBhaW50Q29sb3IobGVhZi5maWxsc1swXSk7XG4gICAgfVxuICAgIGlmICgnc3Ryb2tlcycgaW4gbGVhZiAmJiBsZWFmLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBzdHJva2VzID0gZ2V0UGFpbnRDb2xvcihsZWFmLnN0cm9rZXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBmaWxsc0NvbG9yOiBkaXNwbGF5Q29sb3IoZmlsbHMpLFxuICAgICAgICBzdHJva2VzQ29sb3I6IGRpc3BsYXlDb2xvcihzdHJva2VzKSxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBzKCkge1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICByZXR1cm4gc3RlcHNCeU9yZGVyKGxlc3NvbikubWFwKChzdGVwKSA9PiB7XG4gICAgICAgIHJldHVybiB7IGlkOiBzdGVwLmlkLCBuYW1lOiBzdGVwLm5hbWUsIGNvbG9yczogZ2V0Q29sb3JzKHN0ZXApIH07XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcHNPcmRlcihzdGVwcykge1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBzdGVwcy5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IHMgPSBsZXNzb24uZmluZE9uZSgoZWwpID0+IGVsLmlkID09IHN0ZXAuaWQpO1xuICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgc2V0U3RlcE9yZGVyKHMsIGkgKyAxKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRhZ1Vub3JkZXJlZFN0ZXBzKCkge1xuICAgIGxldCBzdGFydFdpdGggPSBnZXRMYXN0U3RlcE9yZGVyKCkgKyAxO1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBzdGVwc0J5T3JkZXIobGVzc29uKVxuICAgICAgICAuZmlsdGVyKChzKSA9PiAhZ2V0VGFncyhzKS5zb21lKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpKVxuICAgICAgICAuZm9yRWFjaCgoc3RlcCwgaSkgPT4gc2V0U3RlcE9yZGVyKHN0ZXAsIGkgKyBzdGFydFdpdGgpKTtcbn1cbiIsImltcG9ydCB7IGVtaXQsIG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGRlc2NlbmRhbnRzLCBmaW5kTGVhZk5vZGVzLCBnZXRDdXJyZW50TGVzc29uLCBnZXRTdGVwT3JkZXIsIGdldFRhZ3MsIGlzUmVzdWx0U3RlcCwgZmluZE5leHRCcnVzaFN0ZXAsIGZpbmRMZXNzb25Hcm91cCwgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2V0T3JkZXIoc3RlcCkge1xuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xuICAgIHJldHVybiBpc05hTihvKSA/IDk5OTkgOiBvO1xufVxuZnVuY3Rpb24gZ2V0VGFnKHN0ZXAsIHRhZykge1xuICAgIGNvbnN0IHYgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCh0YWcpKTtcbiAgICByZXR1cm4gdiA/IHYucmVwbGFjZSh0YWcsICcnKSA6IG51bGw7XG59XG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxuICAgICAgICAuZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxubGV0IGxhc3RNb2RlID0gJ2FsbCc7XG5sZXQgbGFzdFBhZ2UgPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVRtcChwYWdlKSB7XG4gICAgY29uc3QgcCA9IHBhZ2UgfHwgZmlnbWEuY3VycmVudFBhZ2U7XG4gICAgcC5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheUFsbChsZXNzb24sIHNldExhc3RNb2RlKSB7XG4gICAgY29uc3QgY3VycmVudExlc3NvbiA9IGxlc3NvbiB8fCBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgZGVsZXRlVG1wKCk7XG4gICAgY3VycmVudExlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgfSk7XG4gICAgaWYgKHNldExhc3RNb2RlKSB7XG4gICAgICAgIGxhc3RNb2RlID0gJ2FsbCc7XG4gICAgfVxufVxuZnVuY3Rpb24gZGlzcGxheVRlbXBsYXRlKGxlc3Nvbiwgc3RlcCkge1xuICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XG4gICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGNvbnN0IGlucHV0ID0gc3RlcC5maW5kQ2hpbGQoKGcpID0+IGcubmFtZSA9PSAnaW5wdXQnKTtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGVtcGxhdGUgPSBpbnB1dC5jbG9uZSgpO1xuICAgIHRlbXBsYXRlLm5hbWUgPSAndG1wLXRlbXBsYXRlJztcbiAgICB0ZW1wbGF0ZVxuICAgICAgICAuZmluZEFsbCgoZWwpID0+IGdldFRhZ3MoZWwpLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSlcbiAgICAgICAgLm1hcCgoZWwpID0+IGZpbmRMZWFmTm9kZXMoZWwpKVxuICAgICAgICAuZmxhdCgpXG4gICAgICAgIC5maWx0ZXIoKGVsKSA9PiAvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3QoZWwudHlwZSkpXG4gICAgICAgIC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFdlaWdodCA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDMwIDogNTA7XG4gICAgICAgICAgICBlbC5zdHJva2VXZWlnaHQgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCBkZWZhdWx0V2VpZ2h0O1xuICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICBwaW5rLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICBwaW5rLm5hbWUgPSAncGluayAnICsgZWwubmFtZTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICAgICAgLy8gY2xvbmUgZWxlbWVudCBoZXJlIGFuZCBnaXZlIGhpbSB0aGluIHBpbmsgc3Ryb2tlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMC4xLCBnOiAwLCBiOiAxIH0gfV07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xuICAgIHRlbXBsYXRlLnJlbGF0aXZlVHJhbnNmb3JtID0gaW5wdXQucmVsYXRpdmVUcmFuc2Zvcm07XG59XG5mdW5jdGlvbiBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCkge1xuICAgIGNvbnN0IGRlZmF1bHRCUyA9IGdldFRhZyhzdGVwLCAncy0nKSA9PSAnbXVsdGlzdGVwLWJnJyA/IDEyLjggOiAxMDtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IGRlZmF1bHRCUztcbiAgICBjb25zdCBzbWFsbExpbmUgPSBmaWdtYS5jcmVhdGVMaW5lKCk7XG4gICAgc21hbGxMaW5lLm5hbWUgPSAnc21hbGxMaW5lJztcbiAgICBzbWFsbExpbmUucmVzaXplKDMwMCwgMCk7XG4gICAgc21hbGxMaW5lLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLjgsIGI6IDAgfSB9XTtcbiAgICBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgLyAzO1xuICAgIHNtYWxsTGluZS5zdHJva2VDYXAgPSAnUk9VTkQnO1xuICAgIHNtYWxsTGluZS5zdHJva2VBbGlnbiA9ICdDRU5URVInO1xuICAgIHNtYWxsTGluZS55ID0gc21hbGxMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgbWVkaXVtTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xuICAgIG1lZGl1bUxpbmUubmFtZSA9ICdtZWRpdW1MaW5lJztcbiAgICBtZWRpdW1MaW5lLm9wYWNpdHkgPSAwLjI7XG4gICAgbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgPSBicztcbiAgICBtZWRpdW1MaW5lLnkgPSBtZWRpdW1MaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgYmlnTGluZSA9IHNtYWxsTGluZS5jbG9uZSgpO1xuICAgIGJpZ0xpbmUubmFtZSA9ICdiaWdMaW5lJztcbiAgICBiaWdMaW5lLm9wYWNpdHkgPSAwLjE7XG4gICAgYmlnTGluZS5zdHJva2VXZWlnaHQgPSBicyArIE1hdGgucG93KGJzLCAxLjQpICogMC44O1xuICAgIGJpZ0xpbmUueSA9IGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcbiAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKFtiaWdMaW5lLCBtZWRpdW1MaW5lLCBzbWFsbExpbmVdLCBsZXNzb24ucGFyZW50KTtcbiAgICBncm91cC5uYW1lID0gJ3RtcC1icyc7XG4gICAgZ3JvdXAueCA9IGxlc3Nvbi54O1xuICAgIGdyb3VwLnkgPSBsZXNzb24ueSAtIDgwO1xufVxuZnVuY3Rpb24gZ2V0QnJ1c2hTaXplKHN0ZXApIHtcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHN0ZXApO1xuICAgIGNvbnN0IHN0cm9rZXMgPSBsZWF2ZXMuZmlsdGVyKChuKSA9PiAnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCk7XG4gICAgY29uc3Qgc3Ryb2tlV2VpZ2h0c0FyciA9IHN0cm9rZXMubWFwKChub2RlKSA9PiBub2RlWydzdHJva2VXZWlnaHQnXSB8fCAwKTtcbiAgICBjb25zdCBtYXhXZWlnaHQgPSBNYXRoLm1heCguLi5zdHJva2VXZWlnaHRzQXJyKTtcbiAgICByZXR1cm4gc3Ryb2tlcy5sZW5ndGggPiAwID8gbWF4V2VpZ2h0IDogMjU7XG59XG5mdW5jdGlvbiBnZXRDbGVhckxheWVyTnVtYmVycyhzdGVwKSB7XG4gICAgY29uc3QgcHJlZml4ID0gJ2NsZWFyLWxheWVyLSc7XG4gICAgY29uc3QgY2xlYXJMYXllcnNTdGVwID0gZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHRhZykgPT4gdGFnLnN0YXJ0c1dpdGgocHJlZml4KSk7XG4gICAgaWYgKGNsZWFyTGF5ZXJzU3RlcC5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBsYXllck51bWJlcnMgPSBjbGVhckxheWVyc1N0ZXBbMF1cbiAgICAgICAgLnNsaWNlKHByZWZpeC5sZW5ndGgpXG4gICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAoTnVtYmVyKTtcbiAgICByZXR1cm4gbGF5ZXJOdW1iZXJzO1xufVxuZnVuY3Rpb24gc2hvd09ubHlSR0JUZW1wbGF0ZShub2RlKSB7XG4gICAgaWYgKGdldFRhZ3Mobm9kZSkuaW5jbHVkZXMoJ3NldHRpbmdzJykpIHtcbiAgICAgICAgbm9kZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGdldFRhZ3Mobm9kZSkuaW5jbHVkZXMoJ3JnYi10ZW1wbGF0ZScpIHx8XG4gICAgICAgIC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIGlmICgvR1JPVVB8Qk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNob3dPbmx5UkdCVGVtcGxhdGUodik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdCh2LnR5cGUpICYmXG4gICAgICAgICAgICAhZ2V0VGFncyh2KS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAodi52aXNpYmxlID0gZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjb2xsZWN0TGF5ZXJOdW1iZXJzVG9DbGVhcihsZXNzb24sIHN0ZXApIHtcbiAgICBjb25zdCBjdXJyZW50U3RlcE9yZGVyID0gZ2V0U3RlcE9yZGVyKHN0ZXApO1xuICAgIGNvbnN0IGxheWVyc1N0ZXBPcmRlclRhZ3MgPSBsZXNzb24uY2hpbGRyZW4ubWFwKChzKSA9PiBnZXRTdGVwT3JkZXIocykpO1xuICAgIGNvbnN0IGNsZWFyTGF5ZXJOdW1iZXJzID0gbGVzc29uLmNoaWxkcmVuLnJlZHVjZSgoYWNjLCBsYXllcikgPT4ge1xuICAgICAgICBpZiAobGF5ZXIudHlwZSAhPT0gJ0dST1VQJyB8fCBnZXRTdGVwT3JkZXIobGF5ZXIpID4gY3VycmVudFN0ZXBPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2V0VGFncyhsYXllcikuaW5jbHVkZXMoJ2NsZWFyLWJlZm9yZScpKSB7XG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgc3RlcCBvcmRlciB0YWdzIGFuZCBjb252ZXJ0IHRvIGxheWVycyB0byBjbGVhclxuICAgICAgICAgICAgY29uc3Qgc3RlcHNUb0NsZWFyID0gWy4uLkFycmF5KGdldFN0ZXBPcmRlcihsYXllcikpLmtleXMoKV0uc2xpY2UoMSk7XG4gICAgICAgICAgICBzdGVwc1RvQ2xlYXIuZm9yRWFjaCgoc3RlcE9yZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxheWVyc1N0ZXBPcmRlclRhZ3MuaW5jbHVkZXMoc3RlcE9yZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBhY2MuYWRkKGxheWVyc1N0ZXBPcmRlclRhZ3MuaW5kZXhPZihzdGVwT3JkZXIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXRDbGVhckxheWVyTnVtYmVycyhsYXllcikuZm9yRWFjaCgoaWR4KSA9PiBhY2MuYWRkKGlkeCkpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIG5ldyBTZXQoKSk7XG4gICAgcmV0dXJuIGNsZWFyTGF5ZXJOdW1iZXJzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE5leHRCcnVzaFN0ZXAoc3RlcE51bWJlcikge1xuICAgIGxldCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmICghbGVzc29uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHN0ZXA7XG4gICAgbGV0IHN0ZXBzID0gc3RlcHNCeU9yZGVyKGxlc3Nvbik7XG4gICAgY29uc3QgbmV4dFN0ZXAgPSBmaW5kTmV4dEJydXNoU3RlcChzdGVwcy5zbGljZShzdGVwTnVtYmVyKSk7XG4gICAgaWYgKG5leHRTdGVwKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtuZXh0U3RlcF07XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGVzc29ucyA9IGZpZ21hLnJvb3QuY2hpbGRyZW47XG4gICAgc3RlcCA9IGxlc3NvbnNcbiAgICAgICAgLnNsaWNlKGxlc3NvbnMuaW5kZXhPZihsZXNzb24ucGFyZW50KSArIDEpXG4gICAgICAgIC5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBuZXdMZXNzb24pID0+IHtcbiAgICAgICAgaWYgKGFjY3VtdWxhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBmaW5kTGVzc29uR3JvdXAobmV3TGVzc29uKTtcbiAgICAgICAgaWYgKCFsZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3U3RlcHMgPSBzdGVwc0J5T3JkZXIobGVzc29uRnJhbWUpO1xuICAgICAgICBjb25zdCBuZXdOZXh0U3RlcCA9IGZpbmROZXh0QnJ1c2hTdGVwKG5ld1N0ZXBzKTtcbiAgICAgICAgaWYgKG5ld05leHRTdGVwKSB7XG4gICAgICAgICAgICBkZWxldGVUbXAocGFnZSk7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IG5ld0xlc3NvbjtcbiAgICAgICAgICAgIHJldHVybiBuZXdOZXh0U3RlcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LCBudWxsKTtcbiAgICBpZiAoc3RlcCkge1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGFnZSwgc2V0dGluZ3MpIHtcbiAgICBsYXN0TW9kZSA9IHNldHRpbmdzLmRpc3BsYXlNb2RlO1xuICAgIGNvbnN0IHsgZGlzcGxheU1vZGUsIHN0ZXBOdW1iZXIgfSA9IHNldHRpbmdzO1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpbmRMZXNzb25Hcm91cChwYWdlKTtcbiAgICBpZiAoIWxlc3Nvbikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzdGVwTnVtYmVyIC0gMV07XG4gICAgcGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XG4gICAgY29uc3Qgc3RlcENvdW50ID0gbGVzc29uLmNoaWxkcmVuLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKS5sZW5ndGg7XG4gICAgY29uc3QgbWF4U3Ryb2tlV2VpZ2h0ID0gZ2V0QnJ1c2hTaXplKHN0ZXApO1xuICAgIGNvbnN0IGJydXNoVHlwZSA9IGdldFRhZyhzdGVwLCAnYnJ1c2gtbmFtZS0nKSB8fCAnJztcbiAgICBsZXQgbGF5ZXJOdW1iZXJzVG9DbGVhciA9IGdldFRhZ3Moc3RlcCkuaW5jbHVkZXMoJ2NsZWFyLWJlZm9yZScpXG4gICAgICAgID8gWy4uLkFycmF5KHN0ZXBOdW1iZXIpLmtleXMoKV0uc2xpY2UoMSlcbiAgICAgICAgOiBnZXRDbGVhckxheWVyTnVtYmVycyhzdGVwKTtcbiAgICBlbWl0KCd1cGRhdGVGb3JtJywge1xuICAgICAgICBzaGFkb3dTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCAwLFxuICAgICAgICBicnVzaFNpemU6IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IDAsXG4gICAgICAgIHN1Z2dlc3RlZEJydXNoU2l6ZTogaXNSZXN1bHRTdGVwKHN0ZXApID8gMCA6IG1heFN0cm9rZVdlaWdodCxcbiAgICAgICAgdGVtcGxhdGU6IGdldFRhZyhzdGVwLCAncy0nKSB8fCAwLFxuICAgICAgICBzdGVwQ291bnQsXG4gICAgICAgIHN0ZXBOdW1iZXIsXG4gICAgICAgIGRpc3BsYXlNb2RlLFxuICAgICAgICBjbGVhckJlZm9yZTogZ2V0VGFncyhzdGVwKS5pbmNsdWRlcygnY2xlYXItYmVmb3JlJyksXG4gICAgICAgIGNsZWFyTGF5ZXJzOiBsYXllck51bWJlcnNUb0NsZWFyLm1hcCgobikgPT4gbi50b1N0cmluZygpKSB8fCBbXSxcbiAgICAgICAgb3RoZXJUYWdzOiBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gdC5zdGFydHNXaXRoKCdzaGFyZS1idXR0b24nKSB8fCB0LnN0YXJ0c1dpdGgoJ2FsbG93LXVuZG8nKSkgfHwgW10sXG4gICAgICAgIGJydXNoVHlwZSxcbiAgICB9KTtcbiAgICBkZWxldGVUbXAoKTtcbiAgICBpZiAobGFzdFBhZ2UgJiYgbGFzdFBhZ2UgIT0gcGFnZSkge1xuICAgICAgICBkaXNwbGF5QWxsKGxhc3RQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKSk7XG4gICAgfVxuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBzd2l0Y2ggKGRpc3BsYXlNb2RlKSB7XG4gICAgICAgIGNhc2UgJ2FsbCc6XG4gICAgICAgICAgICBkaXNwbGF5QWxsKGxlc3NvbiwgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3VycmVudCc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIHN0ZXBzQnlPcmRlcihsZXNzb24pLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBpIDwgc3RlcE51bWJlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29sbGVjdExheWVyTnVtYmVyc1RvQ2xlYXIobGVzc29uLCBzdGVwKS5mb3JFYWNoKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuW2ldLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHNob3dPbmx5UkdCVGVtcGxhdGUoc3RlcCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG59LCAxNTAwKTtcbmZ1bmN0aW9uIGFkZEFuaW1hdGlvblRhZyhzdGVwLCB0YWcsIGRlbGF5LCByZXBlYXQpIHtcbiAgICBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS50eXBlKSkge1xuICAgICAgICBsZXQgc2VsZWN0aW9uVGFncyA9IGdldFRhZ3MoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgc2VsZWN0aW9uVGFncyA9IHNlbGVjdGlvblRhZ3MuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCd3aWdnbGUnKSAmJlxuICAgICAgICAgICAgIXQuc3RhcnRzV2l0aCgnZmx5LWZyb20tJykgJiZcbiAgICAgICAgICAgICF0LnN0YXJ0c1dpdGgoJ2FwcGVhcicpICYmXG4gICAgICAgICAgICAhdC5zdGFydHNXaXRoKCdibGluaycpICYmXG4gICAgICAgICAgICAhdC5zdGFydHNXaXRoKCdkcmF3LWxpbmUnKSk7XG4gICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIS9kXFxkKy8udGVzdCh0KSAmJiAhL3JcXGQrLy50ZXN0KHQpKTtcbiAgICAgICAgaWYgKHRhZykge1xuICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKHRhZyk7XG4gICAgICAgICAgICBpZiAoZGVsYXkpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzLnB1c2goYGQke2RlbGF5fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaChgciR7cmVwZWF0fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdLm5hbWUgPSBzZWxlY3Rpb25UYWdzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5uYW1lID0gc2VsZWN0aW9uVGFncy5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgIGRlc2NlbmRhbnRzKHN0ZXApLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvblRhZ3MgPSBnZXRUYWdzKHYpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoJ3dpZ2dsZScpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdC5zdGFydHNXaXRoKCdmbHktZnJvbS0nKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXQuc3RhcnRzV2l0aCgnYXBwZWFyJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0LnN0YXJ0c1dpdGgoJ2JsaW5rJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0LnN0YXJ0c1dpdGgoJ2RyYXctbGluZScpKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKHRhZyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIS9kXFxkKy8udGVzdCh0KSAmJiAhL3JcXGQrLy50ZXN0KHQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzLnB1c2goYGQke2RlbGF5fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaChgciR7cmVwZWF0fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHYubmFtZSA9IHNlbGVjdGlvblRhZ3Muam9pbignICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVzY2VuZGFudHMoc3RlcCkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0aW9uVGFncyA9IGdldFRhZ3Modik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnd2lnZ2xlJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0LnN0YXJ0c1dpdGgoJ2ZseS1mcm9tLScpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhdC5zdGFydHNXaXRoKCdhcHBlYXInKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXQuc3RhcnRzV2l0aCgnYmxpbmsnKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIXQuc3RhcnRzV2l0aCgnZHJhdy1saW5lJykpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICEvZFxcZCsvLnRlc3QodCkgJiYgIS9yXFxkKy8udGVzdCh0KSk7XG4gICAgICAgICAgICAgICAgICAgIHYubmFtZSA9IHNlbGVjdGlvblRhZ3Muam9pbignICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlUHJvcHMoc2V0dGluZ3MpIHtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3Qgc3RlcCA9IHN0ZXBzQnlPcmRlcihsZXNzb24pW3NldHRpbmdzLnN0ZXBOdW1iZXIgLSAxXTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCdzcy0nKSAmJlxuICAgICAgICAhdC5zdGFydHNXaXRoKCdicy0nKSAmJlxuICAgICAgICAhdC5zdGFydHNXaXRoKCdzLScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2NsZWFyLWxheWVyLScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2NsZWFyLWJlZm9yZScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ3NoYXJlLWJ1dHRvbicpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2FsbG93LXVuZG8nKSAmJlxuICAgICAgICAhdC5zdGFydHNXaXRoKCdicnVzaC1uYW1lLScpKTtcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcbiAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgYHMtJHtzZXR0aW5ncy50ZW1wbGF0ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBzcy0ke3NldHRpbmdzLnNoYWRvd1NpemV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcbiAgICAgICAgdGFncy5wdXNoKGBicy0ke3NldHRpbmdzLmJydXNoU2l6ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmJydXNoVHlwZSkge1xuICAgICAgICB0YWdzLnB1c2goYGJydXNoLW5hbWUtJHtzZXR0aW5ncy5icnVzaFR5cGV9YCk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5jbGVhckxheWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICghc2V0dGluZ3MuY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgICAgIHRhZ3MucHVzaChgY2xlYXItbGF5ZXItJHtzZXR0aW5ncy5jbGVhckxheWVycy5qb2luKCcsJyl9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmNsZWFyQmVmb3JlKSB7XG4gICAgICAgIHRhZ3MucHVzaCgnY2xlYXItYmVmb3JlJyk7XG4gICAgfVxuICAgIGlmIChzZXR0aW5ncy5vdGhlclRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQoc2V0dGluZ3Mub3RoZXJUYWdzKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmFuaW1hdGlvblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFkZEFuaW1hdGlvblRhZyhzdGVwLCBzZXR0aW5ncy5hbmltYXRpb25UYWcsIHNldHRpbmdzLmRlbGF5LCBzZXR0aW5ncy5yZXBlYXQpO1xuICAgIH1cbiAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcbn1cbm9uKCd1cGRhdGVEaXNwbGF5JywgKHNldHRpbmdzKSA9PiB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCBzZXR0aW5ncykpO1xub24oJ3VwZGF0ZVByb3BzJywgdXBkYXRlUHJvcHMpO1xuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRQYWdlQ2hhbmdlZCgpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGlmICghc2VsZWN0aW9uIHx8ICFsZXNzb24gfHwgIWxlc3Nvbi5jaGlsZHJlbi5pbmNsdWRlcyhzZWxlY3Rpb24pKSB7XG4gICAgICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IGxhc3RNb2RlLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgY29uc3Qgc3RlcE51bWJlciA9IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgKyAxO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHtcbiAgICAgICAgZGlzcGxheU1vZGU6IGxhc3RNb2RlLFxuICAgICAgICBzdGVwTnVtYmVyOiBzdGVwTnVtYmVyIHx8IDEsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0aW9uQ2hhbmdlZCgpIHtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGlmICghc2VsZWN0aW9uIHx8XG4gICAgICAgICFsZXNzb24gfHxcbiAgICAgICAgIWxlc3Nvbi5jaGlsZHJlbi5pbmNsdWRlcyhzZWxlY3Rpb24pIHx8XG4gICAgICAgIHNlbGVjdGlvbi50eXBlICE9PSAnR1JPVVAnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy91cGRhdGUgc3RlcFxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgY29uc3Qgc3RlcE51bWJlciA9IHN0ZXBzQnlPcmRlcihsZXNzb24pLmluZGV4T2Yoc3RlcCkgKyAxO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IGxhc3RNb2RlLCBzdGVwTnVtYmVyIH0pO1xufVxuIiwiaW1wb3J0IHsgZW1pdCB9IGZyb20gJy4uL2V2ZW50cyc7XG5leHBvcnQgZnVuY3Rpb24gZmluZEFsbChub2RlLCBmKSB7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIGFyci5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICAgIGFyciA9IGFyci5jb25jYXQoY2hpbGRyZW4uZmxhdE1hcCgocCkgPT4gZmluZEFsbChwLCBmKSkpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRMZWFmTm9kZXMobm9kZSkge1xuICAgIGlmICghKCdjaGlsZHJlbicgaW4gbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuZmluZEFsbCgobikgPT4gISgnY2hpbGRyZW4nIGluIG4pKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGYpIHtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZUluZGV4KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5wYXJlbnQuY2hpbGRyZW4uZmluZEluZGV4KChuKSA9PiBuLmlkID09PSBub2RlLmlkKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50TGVzc29uKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PT0gJ2xlc3NvbicpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZ3Mobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5hbWUuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbik7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFRhZyhub2RlLCB0YWcpIHtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICByZXR1cm4gdGFncy5maW5kKChzKSA9PiB0YWcudGVzdChzKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkVGFnKG5vZGUsIHRhZykge1xuICAgIG5vZGUubmFtZSA9IGdldFRhZ3Mobm9kZSkuY29uY2F0KFt0YWddKS5qb2luKCcgJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudEJ5VGFnKG5vZGUsIHRhZykge1xuICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUsIChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKHRhZykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVzdWx0U3RlcChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgJiYgZ2V0VGFncyhub2RlKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0Jyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJpbnQodGV4dCkge1xuICAgIGVtaXQoJ3ByaW50JywgdGV4dCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheU5vdGlmaWNhdGlvbihtZXNzYWdlKSB7XG4gICAgZmlnbWEubm90aWZ5KG1lc3NhZ2UpO1xufVxuZXhwb3J0IGNvbnN0IGNhcGl0YWxpemUgPSAocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBzdGVwT3JkZXJUYWcgPSAvXm8tKFxcZCspJC87XG4gICAgY29uc3Qgc3RlcFRhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodGFnKSA9PiB0YWcubWF0Y2goc3RlcE9yZGVyVGFnKSk7XG4gICAgaWYgKHN0ZXBUYWcpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihzdGVwVGFnLm1hdGNoKHN0ZXBPcmRlclRhZylbMV0pO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiByZXNpemVVaShpc1dpZGUpIHtcbiAgICBpZiAoaXNXaWRlKSB7XG4gICAgICAgIGZpZ21hLnVpLnJlc2l6ZSg5MDAsIDQ3MCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5yZXNpemUoMzQwLCA0NzApO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwT3JkZXIoc3RlcCwgc3RlcE9yZGVyKSB7XG4gICAgZ2V0VGFncyhzdGVwKS5zb21lKCh0YWcpID0+IC9eby1cXGQrJC8udGVzdCh0YWcpKVxuICAgICAgICA/IChzdGVwLm5hbWUgPSBzdGVwLm5hbWUucmVwbGFjZSgvby1cXGQrLywgYG8tJHtzdGVwT3JkZXJ9YCkpXG4gICAgICAgIDogKHN0ZXAubmFtZSArPSBgIG8tJHtzdGVwT3JkZXJ9YCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsVHJlZShub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBbbm9kZSwgLi4ubm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBnZXRBbGxUcmVlKG4pKV07XG59XG5leHBvcnQgZnVuY3Rpb24gZGVzY2VuZGFudHMobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGdldEFsbFRyZWUobikpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmROZXh0QnJ1c2hTdGVwKHN0ZXBzKSB7XG4gICAgcmV0dXJuIHN0ZXBzLmZpbmQoKHN0ZXApID0+IHtcbiAgICAgICAgcmV0dXJuIGdldFRhZ3Moc3RlcCkuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLWJydXNoJyk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZExlc3Nvbkdyb3VwKHBhZ2UpIHtcbiAgICByZXR1cm4gcGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGNyZWF0ZVBsdWdpbkFQSSwgY3JlYXRlVUlBUEkgfSBmcm9tICdmaWdtYS1qc29ucnBjJztcbmltcG9ydCB7IGV4cG9ydFRleHRzLCBpbXBvcnRUZXh0cyB9IGZyb20gJy4vcGx1Z2luL2Zvcm1hdC1ycGMnO1xuaW1wb3J0IHsgZXhwb3J0TGVzc29uLCBleHBvcnRDb3Vyc2UgfSBmcm9tICcuL3BsdWdpbi9wdWJsaXNoJztcbmltcG9ydCB7IGdldFN0ZXBzLCBzZXRTdGVwc09yZGVyIH0gZnJvbSAnLi9wbHVnaW4vdHVuZS1ycGMnO1xuaW1wb3J0IHsgY3JlYXRlTGVzc29uLCBzZXBhcmF0ZVN0ZXAsIHNwbGl0QnlDb2xvciwgam9pblN0ZXBzLCB9IGZyb20gJy4vcGx1Z2luL2NyZWF0ZSc7XG5pbXBvcnQgeyBkaXNwbGF5Tm90aWZpY2F0aW9uLCByZXNpemVVaSB9IGZyb20gJy4vcGx1Z2luL3V0aWwnO1xuaW1wb3J0IHsgbGludFBhZ2UsIGxpbnRDb3Vyc2UsIHNlbGVjdEVycm9yLCBzYXZlRXJyb3JzIH0gZnJvbSAnLi9wbHVnaW4vbGludGVyJztcbmltcG9ydCB7IHNlbGVjdGlvbkNoYW5nZWQsIGN1cnJlbnRQYWdlQ2hhbmdlZCwgdXBkYXRlRGlzcGxheSwgc2VsZWN0TmV4dEJydXNoU3RlcCwgZGlzcGxheUFsbCwgfSBmcm9tICcuL3BsdWdpbi90dW5lJztcbi8vIEZpZ21hIHBsdWdpbiBtZXRob2RzXG5leHBvcnQgY29uc3QgcGx1Z2luQXBpID0gY3JlYXRlUGx1Z2luQVBJKHtcbiAgICBzZXRTZXNzaW9uVG9rZW4odG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicsIHRva2VuKTtcbiAgICB9LFxuICAgIGdldFNlc3Npb25Ub2tlbigpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdzZXNzaW9uVG9rZW4nKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleHBvcnRMZXNzb24sXG4gICAgZXhwb3J0Q291cnNlLFxuICAgIGdldFN0ZXBzLFxuICAgIHNldFN0ZXBzT3JkZXIsXG4gICAgZXhwb3J0VGV4dHMsXG4gICAgaW1wb3J0VGV4dHMsXG4gICAgZGlzcGxheU5vdGlmaWNhdGlvbixcbiAgICBjcmVhdGVMZXNzb24sXG4gICAgc2VwYXJhdGVTdGVwLFxuICAgIHNwbGl0QnlDb2xvcixcbiAgICBqb2luU3RlcHMsXG4gICAgc2VsZWN0RXJyb3IsXG4gICAgc2F2ZUVycm9ycyxcbiAgICBzZWxlY3Rpb25DaGFuZ2VkLFxuICAgIGN1cnJlbnRQYWdlQ2hhbmdlZCxcbiAgICB1cGRhdGVEaXNwbGF5LFxuICAgIGxpbnRQYWdlLFxuICAgIGxpbnRDb3Vyc2UsXG4gICAgcmVzaXplVWksXG4gICAgc2VsZWN0TmV4dEJydXNoU3RlcCxcbiAgICBkaXNwbGF5QWxsLFxufSk7XG4vLyBGaWdtYSBVSSBhcHAgbWV0aG9kc1xuZXhwb3J0IGNvbnN0IHVpQXBpID0gY3JlYXRlVUlBUEkoe30pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==