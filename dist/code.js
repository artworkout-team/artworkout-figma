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
        let sortedErrors = errors.sort((a, b) => a.level - b.level)
            .map((e) => {
            var _a, _b, _c, _d;
            let stepNumber = null;
            if (/GROUP|RECTANGLE|ELLIPSE|VECTOR|TEXT/.test((_a = e === null || e === void 0 ? void 0 : e.node) === null || _a === void 0 ? void 0 : _a.type)) {
                stepNumber = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(e.node) || Object(_util__WEBPACK_IMPORTED_MODULE_0__["getStepOrder"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(e.node, 'step'));
            }
            return {
                ignore: e.ignore,
                pageName: (_b = e.page) === null || _b === void 0 ? void 0 : _b.name,
                nodeName: (_c = e.node) === null || _c === void 0 ? void 0 : _c.name,
                nodeType: (_d = e.node) === null || _d === void 0 ? void 0 : _d.type,
                error: e.error,
                level: e.level,
                stepNumber,
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
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    const drawLineTag = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^draw-line/);
    fills.forEach((f) => {
        assert(f.visible, 'Fill must be visible', page, node);
        assert(f.type == 'SOLID' || !rgbt, 'Fill must be solid', page, node);
        assert((!/GRADIENT_LINEAR|GRADIENT_RADIAL|GRADIENT_ANGULAR|GRADIENT_DIAMOND/.test(f.type) || !rgbt), 'Fill must not be gradient', page, node);
        assert(!drawLineTag || !rgbt, 'Fills cant be used with draw-line tag', page, node);
        if (f.type === 'IMAGE') {
            assert(f.opacity == 1 || !rgbt, 'Image fill must not be opaque', page, node, ErrorLevel.INFO);
        }
    });
}
function lintStrokes(node, page, strokes) {
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    strokes.forEach((s) => {
        assert(s.visible, 'Stroke must be visible', page, node);
        assert(s.type == 'SOLID' || !rgbt, 'Stroke must be solid', page, node);
        if (s.type === 'IMAGE') {
            assert(s.opacity == 1 || !rgbt, 'Image stroke must be opaque', page, node, ErrorLevel.INFO);
        }
    });
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)) || !rgbt, `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR);
    assert(node.strokeAlign == 'CENTER' || !rgbt || !strokes.length, `Stroke align must be 'CENTER' but is '${String(node.strokeAlign)}'`, page, node, ErrorLevel.ERROR);
    assert(!strokes.length || node.strokeJoin == 'ROUND' || !rgbt, `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
}
const validVectorTags = /^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^[vV]ector$|^\d+$|^Ellipse$|^Rectangle$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$/;
function lintVector(page, node) {
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node);
    const rgbt = Object(_util__WEBPACK_IMPORTED_MODULE_0__["isRGBTemplate"])(node);
    const anim = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findTag"])(node, /^draw-line$|^blink$/) || Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(node, 'draw-line') || Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(node, 'blink');
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
    assert(!rgbt || !!anim, "Must have 'blink' or 'draw-line'", page, node); // every rgbt must have animation
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
    assert(node.opacity == 1, 'Must be opaque', page, node);
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
    const sf = step.findOne((n) => { var _a; return (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('rgb-template') || Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(n, 'rgb-template')) && ((_a = n.strokes) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    const ffs = step.findAll((n) => (Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes('rgb-template') || Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParentByTag"])(n, 'rgb-template')) && n.fills && n.fills[0]);
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
    return formatErrors();
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
    return formatErrors();
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
/*! exports provided: findAll, findLeafNodes, findParent, getNodeIndex, getCurrentLesson, getTags, findTag, addTag, findParentByTag, isResultStep, print, displayNotification, capitalize, getStepOrder, resizeUi, setStepOrder, getAllTree, descendants, isRGBTemplate */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUN0Q0EsT0FBTyxxQkFBcUIsR0FBRyxtQkFBTyxDQUFDLGtEQUFPOztBQUU5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxJQUFJO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsSUFBSTtBQUNQOzs7Ozs7Ozs7Ozs7QUNwQ0EsaUJBQWlCLG1CQUFPLENBQUMsd0RBQVU7QUFDbkMsT0FBTyxpQkFBaUIsR0FBRyxtQkFBTyxDQUFDLHdEQUFVOztBQUU3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSwyQ0FBMkMseUJBQXlCO0FBQ3BFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLGlDQUFpQztBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7Ozs7Ozs7Ozs7OztBQzNKQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDTztBQUNQLGtCQUFrQixVQUFVO0FBQzVCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7Ozs7O0FDNURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBeUQ7QUFDbUY7QUFDNUk7QUFDQSxXQUFXLHNDQUFzQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsV0FBVyxzQkFBc0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLG1FQUFpQjtBQUNyQjtBQUNBO0FBQ0EsU0FBUyxVQUFVO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDJEQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxjQUFjLE1BQU0sT0FBTztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLHVCQUF1QiwwREFBUTtBQUMvQixvQkFBb0IsMERBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDZEQUFlO0FBQzNDLFFBQVEsMERBQVk7QUFDcEI7QUFDQTtBQUNBLG1CQUFtQiw4REFBZ0I7QUFDbkMsa0JBQWtCLDBEQUFZO0FBQzlCO0FBQ0EsbURBQW1ELHFEQUFPO0FBQzFEO0FBQ0E7QUFDQSxRQUFRLDBEQUFZO0FBQ3BCLFFBQVEsMERBQVksc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDZEQUFlO0FBQ3RDLG1CQUFtQiw4REFBZ0I7QUFDbkMsbUJBQW1CLDJEQUFhO0FBQ2hDLHVCQUF1QiwwREFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSwyREFBYTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDLHFEQUFPO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG1FQUFpQjtBQUNyQjtBQUNPO0FBQ1A7QUFDQSw0Q0FBNEMscURBQU87QUFDbkQsMkNBQTJDLDBEQUFZO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDhEQUFnQjtBQUNuQyxrQkFBa0IsMERBQVk7QUFDOUIsMkJBQTJCLDBEQUFZO0FBQ3ZDO0FBQ0E7QUFDQSxRQUFRLDBEQUFZO0FBQ3BCO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN2UEE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUM2QztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTztBQUNQO0FBQ0E7QUFDQSxZQUFZLGlFQUFtQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsSUFBSTtBQUM5RDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELG1CQUFtQixLQUFLLG1CQUFtQixLQUFLLGNBQWM7QUFDckg7QUFDQTtBQUNBLGdCQUFnQixpRUFBbUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOzs7Ozs7Ozs7Ozs7O0FDcklBO0FBQUE7QUFBQTtBQUErQjtBQUNxQztBQUNwRTtBQUNBLGtDQUFrQyxxREFBTztBQUN6QztBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMscURBQU87QUFDbEQsSUFBSSxvREFBTTtBQUNWO0FBQ0EsNkNBQTZDLHFEQUFPLHlCQUF5QixxREFBTztBQUNwRiwyQ0FBMkMscURBQU87QUFDbEQsSUFBSSxvREFBTSxjQUFjLGlCQUFpQjtBQUN6QztBQUNBLG1CQUFtQixxREFBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFVBQVU7QUFDakM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSSxxREFBTztBQUNYO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJLHFEQUFPO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGtEQUFFO0FBQ0Ysa0RBQUUsa0NBQWtDLDhEQUFnQjs7Ozs7Ozs7Ozs7OztBQ3ZFcEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBa0I7QUFDRjtBQUNFO0FBQ0E7QUFDQztBQUNDO0FBQ3lEO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSw4REFBZ0I7QUFDcEIsQ0FBQztBQUNEO0FBQ0EsSUFBSSxnRUFBa0I7QUFDdEIsQ0FBQztBQUNEO0FBQ0EsSUFBSSwyREFBYSxxQkFBcUIsb0NBQW9DO0FBQzFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNsQkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDOEc7QUFDdkU7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxnQ0FBZ0M7QUFDMUI7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLDBEQUFZLFlBQVksMERBQVksQ0FBQyw2REFBZTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiwyREFBYTtBQUM5Qix3QkFBd0IscURBQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsaUJBQWlCLDJEQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCwwSEFBMEgsdUJBQXVCO0FBQ2pKLDhHQUE4Ryx5QkFBeUI7QUFDdkksOEdBQThHLHdCQUF3QjtBQUN0STtBQUNBO0FBQ0E7QUFDQSxlQUFlLHFEQUFPO0FBQ3RCLGlCQUFpQiwyREFBYTtBQUM5QixpQkFBaUIscURBQU8saUNBQWlDLDZEQUFlLHVCQUF1Qiw2REFBZTtBQUM5RztBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxJQUFJO0FBQ3RELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFO0FBQzVFO0FBQ0E7QUFDQTtBQUNBLGVBQWUscURBQU87QUFDdEI7QUFDQSxpREFBaUQsSUFBSTtBQUNyRCxLQUFLO0FBQ0wsaUJBQWlCLDJEQUFhO0FBQzlCLHdEQUF3RCw2REFBZTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSx5REFBVztBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixxREFBTztBQUN4QjtBQUNBLG9EQUFvRCxJQUFJO0FBQ3hELEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQThFLFVBQVU7QUFDeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHFEQUFPO0FBQ3hCO0FBQ0EsZ0RBQWdELElBQUk7QUFDcEQsNkVBQTZFLElBQUk7QUFDakYsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHlEQUFXO0FBQ3JDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxtSEFBbUgsUUFBUTtBQUMzSCxrSUFBa0kscUJBQXFCO0FBQ3ZKLDhFQUE4RSxHQUFHO0FBQ2pGO0FBQ0E7QUFDQSwyREFBMkQsaUJBQWlCO0FBQzVFLDJEQUEyRCxpQkFBaUI7QUFDNUUsdUNBQXVDLEVBQUU7QUFDekM7QUFDQSxvQ0FBb0MsUUFBUSxTQUFTLHFEQUFPLGdDQUFnQyw2REFBZSw4RkFBOEYsRUFBRTtBQUMzTSxxQ0FBcUMscURBQU8sZ0NBQWdDLDZEQUFlO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHVCQUF1QixxREFBTyxjQUFjLHFEQUFPO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLHFEQUFPO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxREFBTztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5REFBeUQsSUFBSTtBQUM3RDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixVQUFVLFdBQVc7QUFDNUM7QUFDQSxXQUFXLGNBQWMsTUFBTTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksMkRBQWEsUUFBUSxvQ0FBb0M7QUFDN0QsK0RBQStELFVBQVU7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLHlFQUF5RSxnQkFBZ0I7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELE9BQU87QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7Ozs7Ozs7Ozs7OztBQzlVQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWlCLFNBQUksSUFBSSxTQUFJO0FBQzdCLDJCQUEyQiwrREFBK0QsZ0JBQWdCLEVBQUUsRUFBRTtBQUM5RztBQUNBLG1DQUFtQyxNQUFNLDZCQUE2QixFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ2pHLGtDQUFrQyxNQUFNLGlDQUFpQyxFQUFFLFlBQVksV0FBVyxFQUFFO0FBQ3BHLCtCQUErQixxRkFBcUY7QUFDcEg7QUFDQSxLQUFLO0FBQ0w7QUFDK0I7QUFDWTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixXQUFXLEdBQUcsVUFBVSxPQUFPLHdEQUFVLGlDQUFpQyxFQUFFO0FBQzNHO0FBQ0E7QUFDQSxlQUFlLFdBQVcsT0FBTyx3REFBVSxrQ0FBa0M7QUFDN0Usc0JBQXNCLFdBQVc7QUFDakM7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsV0FBVyxHQUFHLFVBQVU7QUFDeEQ7QUFDQTtBQUNBLFVBQVUsZ0JBQWdCO0FBQzFCLGFBQWEsV0FBVztBQUN4QjtBQUNBO0FBQ0EsRUFBRSxNQUFNO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG1EQUFLO0FBQ1Q7QUFDQSxrREFBRTs7Ozs7Ozs7Ozs7OztBQy9HRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBNEM7QUFDb0M7QUFDaEY7QUFDQSxpQkFBaUIscURBQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixxREFBTztBQUM5QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsdUJBQXVCLGFBQWE7QUFDcEMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDdkM7QUFDQTtBQUNBLDBCQUEwQiwwQkFBMEI7QUFDcEQ7QUFDQTtBQUNBLGlCQUFpQiwyREFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxtQkFBbUIsOERBQWdCO0FBQ25DO0FBQ0EsZ0JBQWdCO0FBQ2hCLEtBQUs7QUFDTDtBQUNPO0FBQ1AsbUJBQW1CLDhEQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQSxZQUFZLDBEQUFZO0FBQ3hCO0FBQ0EsS0FBSztBQUNMO0FBQ087QUFDUCxvQkFBb0IsZ0VBQWdCO0FBQ3BDLG1CQUFtQiw4REFBZ0I7QUFDbkM7QUFDQSx3QkFBd0IscURBQU87QUFDL0IsOEJBQThCLDBEQUFZO0FBQzFDOzs7Ozs7Ozs7Ozs7O0FDbEVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFxQztBQUN1RTtBQUM1RztBQUNBLGlCQUFpQixxREFBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMscURBQU87QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscURBQU87QUFDOUI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHFEQUFPO0FBQ2hDLHFCQUFxQiwyREFBYTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix3QkFBd0IsbUJBQW1CLEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHdCQUF3QixtQkFBbUIsRUFBRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsd0JBQXdCLHFCQUFxQixFQUFFO0FBQ3hFO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix3QkFBd0IscUJBQXFCLEVBQUU7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyREFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixxREFBTztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEscURBQU87QUFDZjtBQUNBO0FBQ0E7QUFDQSxRQUFRLHFEQUFPO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELHFEQUFPO0FBQ3BFO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDZCQUE2QiwwREFBWTtBQUN6QywyREFBMkQsMERBQVk7QUFDdkU7QUFDQSxzQ0FBc0MsMERBQVk7QUFDbEQ7QUFDQTtBQUNBLFlBQVkscURBQU87QUFDbkI7QUFDQSwyQ0FBMkMsMERBQVk7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSxXQUFXLDBCQUEwQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QscURBQU87QUFDM0Q7QUFDQTtBQUNBLDhCQUE4QixxREFBTztBQUNyQyxJQUFJLG9EQUFJO0FBQ1I7QUFDQTtBQUNBLDRCQUE0QiwwREFBWTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxREFBTztBQUM1QjtBQUNBLG1CQUFtQixxREFBTztBQUMxQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msb0NBQW9DO0FBQzFFLENBQUM7QUFDRDtBQUNBO0FBQ0EsNEJBQTRCLHFEQUFPO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsTUFBTTtBQUM3QztBQUNBO0FBQ0EsdUNBQXVDLE9BQU87QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx5REFBVztBQUN2QjtBQUNBLHdDQUF3QyxxREFBTztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxNQUFNO0FBQ3JEO0FBQ0E7QUFDQSwrQ0FBK0MsT0FBTztBQUN0RDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFlBQVkseURBQVc7QUFDdkI7QUFDQSx3Q0FBd0MscURBQU87QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsOERBQWdCO0FBQ25DO0FBQ0EsZUFBZSxxREFBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGtCQUFrQjtBQUNqRDtBQUNBO0FBQ0Esd0JBQXdCLG9CQUFvQjtBQUM1QztBQUNBO0FBQ0Esd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBO0FBQ0EsZ0NBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsK0JBQStCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQUU7QUFDRixrREFBRTtBQUNLO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLG9DQUFvQztBQUNqRSxzQ0FBc0Msb0NBQW9DO0FBQzFFO0FBQ0E7QUFDTztBQUNQLG1CQUFtQiw4REFBZ0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msb0NBQW9DO0FBQzFFOzs7Ozs7Ozs7Ozs7O0FDMVRBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFpQztBQUMxQjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUCxJQUFJLG9EQUFJO0FBQ1I7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSx1REFBdUQsVUFBVTtBQUNqRSw4QkFBOEIsVUFBVTtBQUN4QztBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUM2RDtBQUNFO0FBQ0Q7QUFDRjtBQUMyQjtBQUN6QjtBQUNrQjtBQUNJO0FBQ3BGO0FBQ08sa0JBQWtCLHFFQUFlO0FBQ3hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLDBFQUFZO0FBQ2hCLElBQUksMEVBQVk7QUFDaEIsSUFBSSxtRUFBUTtBQUNaLElBQUksNkVBQWE7QUFDakIsSUFBSSwyRUFBVztBQUNmLElBQUksMkVBQVc7QUFDZixJQUFJLHFGQUFtQjtBQUN2QixJQUFJLHlFQUFZO0FBQ2hCLElBQUkseUVBQVk7QUFDaEIsSUFBSSx5RUFBWTtBQUNoQixJQUFJLG1FQUFTO0FBQ2IsSUFBSSx1RUFBVztBQUNmLElBQUkscUVBQVU7QUFDZCxJQUFJLCtFQUFnQjtBQUNwQixJQUFJLG1GQUFrQjtBQUN0QixJQUFJLHlFQUFhO0FBQ2pCLElBQUksaUVBQVE7QUFDWixJQUFJLHFFQUFVO0FBQ2QsSUFBSSwrREFBUTtBQUNaLENBQUM7QUFDRDtBQUNPLGNBQWMsaUVBQVcsR0FBRyIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9pbmRleC50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzLlBhcnNlRXJyb3IgPSBjbGFzcyBQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJQYXJzZSBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjcwMDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW52YWxpZFJlcXVlc3QgPSBjbGFzcyBJbnZhbGlkUmVxdWVzdCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBSZXF1ZXN0XCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NZXRob2ROb3RGb3VuZCA9IGNsYXNzIE1ldGhvZE5vdEZvdW5kIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJNZXRob2Qgbm90IGZvdW5kXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAxO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUGFyYW1zID0gY2xhc3MgSW52YWxpZFBhcmFtcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHN1cGVyKFwiSW52YWxpZCBwYXJhbXNcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDI7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludGVybmFsRXJyb3IgPSBjbGFzcyBJbnRlcm5hbEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnRlcm5hbCBlcnJvclwiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMztcbiAgfVxufTtcbiIsImNvbnN0IHsgc2V0dXAsIHNlbmRSZXF1ZXN0IH0gPSByZXF1aXJlKFwiLi9ycGNcIik7XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVVJQVBJID0gZnVuY3Rpb24gY3JlYXRlVUlBUEkobWV0aG9kcywgb3B0aW9ucykge1xuICBjb25zdCB0aW1lb3V0ID0gb3B0aW9ucyAmJiBvcHRpb25zLnRpbWVvdXQ7XG5cbiAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZVBsdWdpbkFQSSA9IGZ1bmN0aW9uIGNyZWF0ZVBsdWdpbkFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIGZpZ21hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgc2V0dXAobWV0aG9kcyk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMobWV0aG9kcykucmVkdWNlKChwcmV2LCBwKSA9PiB7XG4gICAgcHJldltwXSA9ICguLi5wYXJhbXMpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gbWV0aG9kc1twXSguLi5wYXJhbXMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZW5kUmVxdWVzdChwLCBwYXJhbXMsIHRpbWVvdXQpO1xuICAgIH07XG4gICAgcmV0dXJuIHByZXY7XG4gIH0sIHt9KTtcbn07XG4iLCJjb25zdCBSUENFcnJvciA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IHsgTWV0aG9kTm90Rm91bmQgfSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcblxubGV0IHNlbmRSYXc7XG5cbmlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZmlnbWEudWkub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IGhhbmRsZVJhdyhtZXNzYWdlKSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xufSBlbHNlIGlmICh0eXBlb2YgcGFyZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIG9ubWVzc2FnZSA9IGV2ZW50ID0+IGhhbmRsZVJhdyhldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpO1xuICBzZW5kUmF3ID0gbWVzc2FnZSA9PiBwYXJlbnQucG9zdE1lc3NhZ2UoeyBwbHVnaW5NZXNzYWdlOiBtZXNzYWdlIH0sIFwiKlwiKTtcbn1cblxubGV0IHJwY0luZGV4ID0gMDtcbmxldCBwZW5kaW5nID0ge307XG5cbmZ1bmN0aW9uIHNlbmRKc29uKHJlcSkge1xuICB0cnkge1xuICAgIHNlbmRSYXcocmVxKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXN1bHQoaWQsIHJlc3VsdCkge1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICByZXN1bHRcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRFcnJvcihpZCwgZXJyb3IpIHtcbiAgY29uc3QgZXJyb3JPYmplY3QgPSB7XG4gICAgY29kZTogZXJyb3IuY29kZSxcbiAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgIGRhdGE6IGVycm9yLmRhdGFcbiAgfTtcbiAgc2VuZEpzb24oe1xuICAgIGpzb25ycGM6IFwiMi4wXCIsXG4gICAgaWQsXG4gICAgZXJyb3I6IGVycm9yT2JqZWN0XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSYXcoZGF0YSkge1xuICB0cnkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBoYW5kbGVScGMoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zb2xlLmVycm9yKGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJwYyhqc29uKSB7XG4gIGlmICh0eXBlb2YganNvbi5pZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBqc29uLnJlc3VsdCAhPT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAganNvbi5lcnJvciB8fFxuICAgICAgdHlwZW9mIGpzb24ubWV0aG9kID09PSBcInVuZGVmaW5lZFwiXG4gICAgKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgIHNlbmRFcnJvcihcbiAgICAgICAgICBqc29uLmlkLFxuICAgICAgICAgIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgY2FsbGJhY2sgZm9yIFwiICsganNvbi5pZClcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrLnRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNhbGxiYWNrLnRpbWVvdXQpO1xuICAgICAgfVxuICAgICAgZGVsZXRlIHBlbmRpbmdbanNvbi5pZF07XG4gICAgICBjYWxsYmFjayhqc29uLmVycm9yLCBqc29uLnJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZVJlcXVlc3QoanNvbik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKTtcbiAgfVxufVxuXG5sZXQgbWV0aG9kcyA9IHt9O1xuXG5mdW5jdGlvbiBvblJlcXVlc3QobWV0aG9kLCBwYXJhbXMpIHtcbiAgaWYgKCFtZXRob2RzW21ldGhvZF0pIHtcbiAgICB0aHJvdyBuZXcgTWV0aG9kTm90Rm91bmQobWV0aG9kKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kc1ttZXRob2RdKC4uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU5vdGlmaWNhdGlvbihqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgb25SZXF1ZXN0KGpzb24ubWV0aG9kLCBqc29uLnBhcmFtcyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoanNvbikge1xuICBpZiAoIWpzb24ubWV0aG9kKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIG5ldyBSUENFcnJvci5JbnZhbGlkUmVxdWVzdChcIk1pc3NpbmcgbWV0aG9kXCIpKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbiAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXN1bHRcbiAgICAgICAgLnRoZW4ocmVzID0+IHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzKSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiBzZW5kRXJyb3IoanNvbi5pZCwgZXJyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbmRSZXN1bHQoanNvbi5pZCwgcmVzdWx0KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHNlbmRFcnJvcihqc29uLmlkLCBlcnIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnNldHVwID0gX21ldGhvZHMgPT4ge1xuICBPYmplY3QuYXNzaWduKG1ldGhvZHMsIF9tZXRob2RzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmROb3RpZmljYXRpb24gPSAobWV0aG9kLCBwYXJhbXMpID0+IHtcbiAgc2VuZEpzb24oeyBqc29ucnBjOiBcIjIuMFwiLCBtZXRob2QsIHBhcmFtcyB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKG1ldGhvZCwgcGFyYW1zLCB0aW1lb3V0KSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgaWQgPSBycGNJbmRleDtcbiAgICBjb25zdCByZXEgPSB7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zLCBpZCB9O1xuICAgIHJwY0luZGV4ICs9IDE7XG4gICAgY29uc3QgY2FsbGJhY2sgPSAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc3QganNFcnJvciA9IG5ldyBFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgIGpzRXJyb3IuY29kZSA9IGVyci5jb2RlO1xuICAgICAgICBqc0Vycm9yLmRhdGEgPSBlcnIuZGF0YTtcbiAgICAgICAgcmVqZWN0KGpzRXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgfTtcblxuICAgIC8vIHNldCBhIGRlZmF1bHQgdGltZW91dFxuICAgIGNhbGxiYWNrLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGRlbGV0ZSBwZW5kaW5nW2lkXTtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJSZXF1ZXN0IFwiICsgbWV0aG9kICsgXCIgdGltZWQgb3V0LlwiKSk7XG4gICAgfSwgdGltZW91dCB8fCAzMDAwKTtcblxuICAgIHBlbmRpbmdbaWRdID0gY2FsbGJhY2s7XG4gICAgc2VuZEpzb24ocmVxKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5SUENFcnJvciA9IFJQQ0Vycm9yO1xuIiwiY29uc3QgZXZlbnRIYW5kbGVycyA9IHt9O1xubGV0IGN1cnJlbnRJZCA9IDA7XG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IGlkID0gYCR7Y3VycmVudElkfWA7XG4gICAgY3VycmVudElkICs9IDE7XG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgZXZlbnRIYW5kbGVyc1tpZF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJldHVybiBvbihuYW1lLCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAoZG9uZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xuICAgID8gZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoW25hbWUsIC4uLmFyZ3NdKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgfSwgJyonKTtcbiAgICB9O1xuZnVuY3Rpb24gaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpIHtcbiAgICBmb3IgKGNvbnN0IGlkIGluIGV2ZW50SGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKGV2ZW50SGFuZGxlcnNbaWRdLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaWRdLmhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBmaWdtYS51aS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoLi4ucGFyYW1zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKChfYSA9IHBhcmFtc1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmpzb25ycGMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBwYXJhbXNbMF07XG4gICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICB9O1xufVxuZWxzZSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIFRPRE86IHZlcnkgZGlydHkgaGFjaywgbmVlZHMgZml4aW5nXG4gICAgICAgIGNvbnN0IGZhbGxiYWNrID0gd2luZG93Lm9ubWVzc2FnZTtcbiAgICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgICAgIGZhbGxiYWNrLmFwcGx5KHdpbmRvdywgcGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gcGFyYW1zWzBdO1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XG4gICAgICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfSwgMTAwKTtcbn1cbiIsImltcG9ydCB7IGdldFN0ZXBzLCB0YWdVbm9yZGVyZWRTdGVwcyB9IGZyb20gJy4vdHVuZS1ycGMnO1xuaW1wb3J0IHsgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3NvbiwgZmluZFBhcmVudEJ5VGFnLCBnZXROb2RlSW5kZXgsIGdldFRhZ3MsIGlzUmVzdWx0U3RlcCwgZ2V0U3RlcE9yZGVyLCBzZXRTdGVwT3JkZXIsIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGZvcm1hdE5vZGUobm9kZSwgcGFyYW1ldGVycykge1xuICAgIGNvbnN0IHsgbmFtZSwgeCwgeSwgd2lkdGggPSA0MCwgaGVpZ2h0ID0gNDAgfSA9IHBhcmFtZXRlcnM7XG4gICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICBub2RlLnggPSB4O1xuICAgIG5vZGUueSA9IHk7XG4gICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XG59XG5mdW5jdGlvbiBmaWxsU2VydmljZU5vZGVzKG5vZGUpIHtcbiAgICBub2RlLmZpbGxzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnU09MSUQnLFxuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICByOiAxOTYgLyAyNTUsXG4gICAgICAgICAgICAgICAgZzogMTk2IC8gMjU1LFxuICAgICAgICAgICAgICAgIGI6IDE5NiAvIDI1NSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXTtcbn1cbmZ1bmN0aW9uIHJlc2NhbGVJbWFnZU5vZGUobm9kZSwgcmVzaXplUGFyYW1zKSB7XG4gICAgY29uc3QgeyBtYXhXaWR0aCwgbWF4SGVpZ2h0IH0gPSByZXNpemVQYXJhbXM7XG4gICAgY29uc3QgaXNDb3JyZWN0U2l6ZSA9IG5vZGUud2lkdGggPD0gbWF4V2lkdGggJiYgbm9kZS5oZWlnaHQgPD0gbWF4SGVpZ2h0O1xuICAgIGNvbnN0IGlzQ29ycmVjdFR5cGUgPSBub2RlLnR5cGUgPT09ICdGUkFNRScgfHwgbm9kZS50eXBlID09PSAnUkVDVEFOR0xFJyB8fCBub2RlLnR5cGUgPT09ICdWRUNUT1InO1xuICAgIGlmIChpc0NvcnJlY3RUeXBlICYmICFpc0NvcnJlY3RTaXplKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gTWF0aC5taW4obWF4V2lkdGggLyBub2RlLndpZHRoLCBtYXhIZWlnaHQgLyBub2RlLmhlaWdodCk7XG4gICAgICAgIG5vZGUucmVzY2FsZShzY2FsZUZhY3Rvcik7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVzdWx0Tm9kZShub2RlKSB7XG4gICAgY29uc3QgcmVzdWx0UmVjdGFuZ2xlID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhyZXN1bHRSZWN0YW5nbGUpO1xuICAgIGNvbnN0IHRlbXBsYXRlR3JvdXAgPSBmaWdtYS5ncm91cChbcmVzdWx0UmVjdGFuZ2xlXSwgbm9kZSk7XG4gICAgdGVtcGxhdGVHcm91cC5uYW1lID0gJ3RlbXBsYXRlJztcbiAgICBjb25zdCByZXN1bHQgPSBmaWdtYS5ncm91cChbdGVtcGxhdGVHcm91cF0sIG5vZGUpO1xuICAgIGZvcm1hdE5vZGUocmVzdWx0LCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcsXG4gICAgICAgIHg6IDEwLFxuICAgICAgICB5OiA2MCxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMZXNzb24oKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbmFsSW1hZ2UgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgZm9ybWF0Tm9kZShsZXNzb24sIHtcbiAgICAgICAgbmFtZTogJ2xlc3NvbicsXG4gICAgICAgIHg6IC00NjEsXG4gICAgICAgIHk6IC01MTIsXG4gICAgICAgIHdpZHRoOiAxMzY2LFxuICAgICAgICBoZWlnaHQ6IDEwMjQsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbCwge1xuICAgICAgICBuYW1lOiAndGh1bWJuYWlsJyxcbiAgICAgICAgeDogLTkwMSxcbiAgICAgICAgeTogLTUxMixcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHN0ZXBcbiAgICBjb25zdCBzdGVwID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xuICAgIHN0ZXAubmFtZSA9ICdpbWFnZSc7XG4gICAgY29uc3QgcmVzaXplZEltYWdlID0gcmVzY2FsZUltYWdlTm9kZShvcmlnaW5hbEltYWdlLCB7XG4gICAgICAgIG1heFdpZHRoOiBsZXNzb24ud2lkdGggLSA4MyAqIDIsXG4gICAgICAgIG1heEhlaWdodDogbGVzc29uLmhlaWdodCAtIDEyICogMixcbiAgICB9KTtcbiAgICBjb25zdCBzdGVwSW5wdXQgPSBmaWdtYS5ncm91cChbc3RlcF0sIGxlc3Nvbik7XG4gICAgc3RlcElucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IGZpcnN0U3RlcCA9IGZpZ21hLmdyb3VwKFtzdGVwSW5wdXRdLCBsZXNzb24pO1xuICAgIGZvcm1hdE5vZGUoZmlyc3RTdGVwLCB7XG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLWJydXNoJyxcbiAgICAgICAgeDogKGxlc3Nvbi53aWR0aCAtIHJlc2l6ZWRJbWFnZS53aWR0aCkgLyAyLFxuICAgICAgICB5OiAobGVzc29uLmhlaWdodCAtIHJlc2l6ZWRJbWFnZS5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRJbWFnZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkSW1hZ2UuaGVpZ2h0LFxuICAgIH0pO1xuICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcbiAgICBjb25zdCB0aHVtYm5haWxJbWFnZSA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcbiAgICB0aHVtYm5haWxJbWFnZS5uYW1lID0gJ2ltYWdlJztcbiAgICBjb25zdCByZXNpemVkVGh1bWJuYWlsID0gcmVzY2FsZUltYWdlTm9kZSh0aHVtYm5haWxJbWFnZSwge1xuICAgICAgICBtYXhXaWR0aDogdGh1bWJuYWlsLndpZHRoIC0gMzUgKiAyLFxuICAgICAgICBtYXhIZWlnaHQ6IHRodW1ibmFpbC5oZWlnaHQgLSAzNSAqIDIsXG4gICAgfSk7XG4gICAgY29uc3QgdGh1bWJuYWlsR3JvdXAgPSBmaWdtYS5ncm91cChbdGh1bWJuYWlsSW1hZ2VdLCB0aHVtYm5haWwpO1xuICAgIGZvcm1hdE5vZGUodGh1bWJuYWlsR3JvdXAsIHtcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCBncm91cCcsXG4gICAgICAgIHg6ICh0aHVtYm5haWwud2lkdGggLSByZXNpemVkVGh1bWJuYWlsLndpZHRoKSAvIDIsXG4gICAgICAgIHk6ICh0aHVtYm5haWwuaGVpZ2h0IC0gcmVzaXplZFRodW1ibmFpbC5oZWlnaHQpIC8gMixcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRUaHVtYm5haWwud2lkdGgsXG4gICAgICAgIGhlaWdodDogcmVzaXplZFRodW1ibmFpbC5oZWlnaHQsXG4gICAgfSk7XG4gICAgLy8gQ3JlYXRlIHJlc3VsdFxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcbiAgICAvLyBDcmVhdGUgc2V0dGluZ3NcbiAgICBjb25zdCBzZXR0aW5nc0VsbGlwc2UgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XG4gICAgZmlsbFNlcnZpY2VOb2RlcyhzZXR0aW5nc0VsbGlwc2UpO1xuICAgIGZvcm1hdE5vZGUoc2V0dGluZ3NFbGxpcHNlLCB7XG4gICAgICAgIG5hbWU6ICdzZXR0aW5ncyBjYXB0dXJlLWNvbG9yIHpvb20tc2NhbGUtMiBvcmRlci1sYXllcnMnLFxuICAgICAgICB4OiAxMCxcbiAgICAgICAgeTogMTAsXG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHNldHRpbmdzRWxsaXBzZSk7XG4gICAgb3JpZ2luYWxJbWFnZS5yZW1vdmUoKTtcbiAgICB0YWdVbm9yZGVyZWRTdGVwcygpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5Q29sb3IoY29sb3IpIHtcbiAgICBsZXQgeyByLCBnLCBiIH0gPSBjb2xvcjtcbiAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcbiAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcbiAgICBiID0gTWF0aC5yb3VuZChiICogMjU1KTtcbiAgICByZXR1cm4gYHJnYigke3J9LCAke2d9LCAke2J9KWA7XG59XG5mdW5jdGlvbiBuYW1lTGVhZk5vZGVzKG5vZGVzKSB7XG4gICAgbGV0IGFsbFN0cm9rZXMgPSAhbm9kZXMuZmluZCgobm9kZSkgPT4gJ2ZpbGxzJyBpbiBub2RlICYmIG5vZGUuZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG5vZGUuZmlsbHMubGVuZ3RoID4gMCk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICBub2RlLm5hbWUgPVxuICAgICAgICAgICAgJ3JnYi10ZW1wbGF0ZSAnICsgKGFsbFN0cm9rZXMgJiYgbm9kZXMubGVuZ3RoID4gMyA/ICdkcmF3LWxpbmUnIDogJ2JsaW5rJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gbmFtZVN0ZXBOb2RlKHN0ZXApIHtcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHN0ZXApO1xuICAgIGxldCBmaWxscyA9IGxlYXZlcy5maWx0ZXIoKG4pID0+ICdmaWxscycgaW4gbiAmJiBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBuLmZpbGxzLmxlbmd0aCA+IDApO1xuICAgIGxldCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xuICAgIGxldCBtdWx0aXN0ZXBUeXBlID0gZmlsbHMubGVuZ3RoID4gMCA/ICdiZycgOiAnYnJ1c2gnO1xuICAgIGxldCBzdHJva2VXZWlnaHRzQXJyID0gc3Ryb2tlcy5tYXAoKG5vZGUpID0+IG5vZGVbJ3N0cm9rZVdlaWdodCddIHx8IDApO1xuICAgIGxldCBtYXhXZWlnaHQgPSBNYXRoLm1heCguLi5zdHJva2VXZWlnaHRzQXJyKTtcbiAgICBsZXQgd2VpZ2h0ID0gc3Ryb2tlcy5sZW5ndGggPiAwID8gbWF4V2VpZ2h0IDogMjU7XG4gICAgc3RlcC5uYW1lID0gYHN0ZXAgcy1tdWx0aXN0ZXAtJHttdWx0aXN0ZXBUeXBlfSBicy0ke3dlaWdodH1gO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RlcE5vZGUobm9kZSwgbm9kZXNBcnJheSwgaW5kZXgpIHtcbiAgICBpZiAoIW5vZGVzQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbmFtZUxlYWZOb2Rlcyhub2Rlc0FycmF5KTtcbiAgICBjb25zdCBpbnB1dCA9IGZpZ21hLmdyb3VwKG5vZGVzQXJyYXksIG5vZGUpO1xuICAgIGlucHV0Lm5hbWUgPSAnaW5wdXQnO1xuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBub2RlLCBpbmRleCk7XG4gICAgbmFtZVN0ZXBOb2RlKHN0ZXApO1xuICAgIHJldHVybiBzdGVwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExhc3RTdGVwT3JkZXIoKSB7XG4gICAgY29uc3Qgc3RlcHNPcmRlciA9IGdldFN0ZXBzKClcbiAgICAgICAgLm1hcCgocykgPT4gZ2V0U3RlcE9yZGVyKHMpKVxuICAgICAgICAuZmlsdGVyKChzKSA9PiBzICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBNYXRoLm1heCguLi5zdGVwc09yZGVyLCAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZVN0ZXAoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGNvbnN0IGxlYXZlcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+ICEoJ2NoaWxkcmVuJyBpbiBub2RlKSk7XG4gICAgaWYgKCFsZWF2ZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlyc3RQYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcbiAgICBpZiAoaXNSZXN1bHRTdGVwKGZpcnN0UGFyZW50U3RlcCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoZmlyc3RQYXJlbnRTdGVwKTtcbiAgICBjb25zdCBzdGVwID0gY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcbiAgICBjb25zdCByZXN1bHRTdGVwID0gbGVzc29uLmNoaWxkcmVuLmZpbmQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpKTtcbiAgICBjb25zdCBsYXN0U3RlcE9yZGVyID0gZ2V0TGFzdFN0ZXBPcmRlcigpO1xuICAgIGlmIChsYXN0U3RlcE9yZGVyID4gMCkge1xuICAgICAgICBzZXRTdGVwT3JkZXIocmVzdWx0U3RlcCwgbGFzdFN0ZXBPcmRlciArIDEpO1xuICAgICAgICBzZXRTdGVwT3JkZXIoc3RlcCwgbGFzdFN0ZXBPcmRlcik7IC8vIGxhc3Qgc3RlcCBiZWZvcmUgcmVzdWx0XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkVG9NYXAobWFwLCBrZXksIG5vZGUpIHtcbiAgICBpZiAoIW1hcC5oYXMoa2V5KSkge1xuICAgICAgICBtYXAuc2V0KGtleSwgW10pO1xuICAgIH1cbiAgICBtYXAuZ2V0KGtleSkucHVzaChub2RlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEJ5Q29sb3IoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGlmICghc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBhcmVudFN0ZXAgPSBmaW5kUGFyZW50QnlUYWcoc2VsZWN0aW9uWzBdLCAnc3RlcCcpO1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHBhcmVudFN0ZXApO1xuICAgIGlmICghcGFyZW50U3RlcCB8fCBpc1Jlc3VsdFN0ZXAocGFyZW50U3RlcCkgfHwgbGVhdmVzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGZpbGxzQnlDb2xvciA9IG5ldyBNYXAoKTtcbiAgICBsZXQgc3Ryb2tlc0J5Q29sb3IgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHVua25vd25Ob2RlcyA9IFtdO1xuICAgIGZpbmRMZWFmTm9kZXMocGFyZW50U3RlcCkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAoJ2ZpbGxzJyBpbiBuICYmXG4gICAgICAgICAgICBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJlxuICAgICAgICAgICAgbi5maWxscy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBuLmZpbGxzWzBdLnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgIGFkZFRvTWFwKGZpbGxzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5maWxsc1swXS5jb2xvciksIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCdzdHJva2VzJyBpbiBuICYmXG4gICAgICAgICAgICBuLnN0cm9rZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgbi5zdHJva2VzWzBdLnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgICAgIGFkZFRvTWFwKHN0cm9rZXNCeUNvbG9yLCBzdHJpbmdpZnlDb2xvcihuLnN0cm9rZXNbMF0uY29sb3IpLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHVua25vd25Ob2Rlcy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZm9yIChsZXQgZmlsbHMgb2YgZmlsbHNCeUNvbG9yLnZhbHVlcygpKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgZmlsbHMpO1xuICAgIH1cbiAgICBmb3IgKGxldCBzdHJva2VzIG9mIHN0cm9rZXNCeUNvbG9yLnZhbHVlcygpKSB7XG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3Nvbiwgc3Ryb2tlcyk7XG4gICAgfVxuICAgIGlmICh1bmtub3duTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHVua25vd25Ob2Rlcyk7XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgcmVzdWx0IGlzIGxvY2F0ZWQgYXQgdGhlIGVuZFxuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5jaGlsZHJlbi5maW5kKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQucmVtb3ZlKCk7XG4gICAgfVxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcbiAgICAvLyBSZW1vdmUgb3JpZ2luYWwgbm9kZSBpZiB0aGVyZSBhcmUgcmVtYWluc1xuICAgIGlmICghcGFyZW50U3RlcC5yZW1vdmVkKSB7XG4gICAgICAgIHBhcmVudFN0ZXAucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRhZ1Vub3JkZXJlZFN0ZXBzKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gam9pblN0ZXBzKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBjb25zdCBhbGxTdGVwcyA9IHNlbGVjdGlvbi5ldmVyeSgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKTtcbiAgICBjb25zdCBzdGVwcyA9IHNlbGVjdGlvbi5maWx0ZXIoKG4pID0+ICFpc1Jlc3VsdFN0ZXAobikpO1xuICAgIGlmICghYWxsU3RlcHMgfHwgc3RlcHMubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0Tm9kZXMgPSBzdGVwc1xuICAgICAgICAubWFwKChzdGVwKSA9PiBzdGVwLmNoaWxkcmVuLmZpbHRlcigobikgPT4gbi5uYW1lID09PSAnaW5wdXQnICYmIG4udHlwZSA9PT0gJ0dST1VQJykpXG4gICAgICAgIC5mbGF0KCk7XG4gICAgY29uc3QgbGVhdmVzID0gaW5wdXROb2Rlcy5tYXAoKG4pID0+IG4uY2hpbGRyZW4pLmZsYXQoKTtcbiAgICBjb25zdCBsZXNzb24gPSBnZXRDdXJyZW50TGVzc29uKCk7XG4gICAgY29uc3QgaW5kZXggPSBnZXROb2RlSW5kZXgoc3RlcHNbMF0pO1xuICAgIGNvbnN0IGZpcnN0U3RlcE9yZGVyID0gZ2V0U3RlcE9yZGVyKHN0ZXBzWzBdKTtcbiAgICBjb25zdCBqb2luZWRTdGVwID0gY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcbiAgICBpZiAoZmlyc3RTdGVwT3JkZXIpIHtcbiAgICAgICAgc2V0U3RlcE9yZGVyKGpvaW5lZFN0ZXAsIGZpcnN0U3RlcE9yZGVyKTtcbiAgICB9XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGRpc3BsYXlOb3RpZmljYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZmluZFRleHRzKHRleHRzKSB7XG4gICAgcmV0dXJuIHRleHRzXG4gICAgICAgIC5maW5kQWxsKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJylcbiAgICAgICAgLmZpbHRlcigobm9kZSkgPT4gbm9kZS52aXNpYmxlKTtcbn1cbmZ1bmN0aW9uIGdldFN0eWxlZFNlZ21lbnRzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoW1xuICAgICAgICAnZm9udFNpemUnLFxuICAgICAgICAnZm9udE5hbWUnLFxuICAgICAgICAnZm9udFdlaWdodCcsXG4gICAgICAgICd0ZXh0RGVjb3JhdGlvbicsXG4gICAgICAgICd0ZXh0Q2FzZScsXG4gICAgICAgICdsaW5lSGVpZ2h0JyxcbiAgICAgICAgJ2xldHRlclNwYWNpbmcnLFxuICAgICAgICAnZmlsbHMnLFxuICAgICAgICAndGV4dFN0eWxlSWQnLFxuICAgICAgICAnZmlsbFN0eWxlSWQnLFxuICAgICAgICAnbGlzdE9wdGlvbnMnLFxuICAgICAgICAnaW5kZW50YXRpb24nLFxuICAgICAgICAnaHlwZXJsaW5rJyxcbiAgICBdKTtcbn1cbmZ1bmN0aW9uIGVzY2FwZShzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpXG4gICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJylcbiAgICAgICAgLnJlcGxhY2UoL1xcfC9nLCAnXFxcXGwnKVxuICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpO1xufVxuY29uc3QgcmVwbGFjZW1lbnRzID0geyAnXFxcXFxcXFwnOiAnXFxcXCcsICdcXFxcbic6ICdcXG4nLCAnXFxcXFwiJzogJ1wiJywgJ1xcXFxsJzogJ3wnIH07XG5mdW5jdGlvbiB1bmVzY2FwZShzdHIpIHtcbiAgICBpZiAoc3RyLm1hdGNoKC9cXHwvKSB8fCBzdHIubWF0Y2goLyg/PCFcXFxcKVwiLykpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxcXChcXFxcfG58XCJ8bCkvZywgZnVuY3Rpb24gKHJlcGxhY2UpIHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VtZW50c1tyZXBsYWNlXTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldEZvcm1hdHRlZFRleHQobm9kZSkge1xuICAgIHJldHVybiBnZXRTdHlsZWRTZWdtZW50cyhub2RlKVxuICAgICAgICAubWFwKChzKSA9PiBlc2NhcGUocy5jaGFyYWN0ZXJzKSlcbiAgICAgICAgLmpvaW4oJ3wnKVxuICAgICAgICAudHJpbUVuZCgpO1xufVxuZnVuY3Rpb24gaW1wb3J0U3R5bGVkU2VnbWVudHMoc2VnbWVudFRleHRzLCBub2RlKSB7XG4gICAgLy8gdXBkYXRlIHNlZ21lbnRzIGluIHJldmVyc2Ugb3JkZXJcbiAgICBmb3IgKGxldCBpID0gc2VnbWVudFRleHRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnRUZXh0ID0gc2VnbWVudFRleHRzW2ldO1xuICAgICAgICBsZXQgc3R5bGVzID0gZ2V0U3R5bGVkU2VnbWVudHMobm9kZSk7XG4gICAgICAgIGlmIChzZWdtZW50VGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBub2RlLmluc2VydENoYXJhY3RlcnMoc3R5bGVzW2ldLmVuZCwgc2VnbWVudFRleHQsICdCRUZPUkUnKTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLmRlbGV0ZUNoYXJhY3RlcnMoc3R5bGVzW2ldLnN0YXJ0LCBzdHlsZXNbaV0uZW5kKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0VGV4dHMoKSB7XG4gICAgY29uc3QgdGV4dHMgPSBmaW5kVGV4dHMoZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIHJldHVybiAodGV4dHNcbiAgICAgICAgLm1hcCgobm9kZSkgPT4gZ2V0Rm9ybWF0dGVkVGV4dChub2RlKSlcbiAgICAgICAgLmZpbHRlcigoc3RyKSA9PiBzdHIubGVuZ3RoID4gMClcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcbiAgICAgICAgLmZpbHRlcigodiwgaSwgYSkgPT4gYS5pbmRleE9mKHYpID09PSBpKSk7XG59XG5mdW5jdGlvbiBsb2FkRm9udHModGV4dHMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBhbGxGb250cyA9IFtdO1xuICAgICAgICB0ZXh0cy5mb3JFYWNoKCh0eHQpID0+IHtcbiAgICAgICAgICAgIGdldFN0eWxlZFNlZ21lbnRzKHR4dCkubWFwKChzKSA9PiB7XG4gICAgICAgICAgICAgICAgYWxsRm9udHMucHVzaChzLmZvbnROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdW5pcXVlRm9udHMgPSBhbGxGb250cy5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT4gaW5kZXggPT09XG4gICAgICAgICAgICBzZWxmLmZpbmRJbmRleCgodCkgPT4gdC5mYW1pbHkgPT09IHZhbHVlLmZhbWlseSAmJiB0LnN0eWxlID09PSB2YWx1ZS5zdHlsZSkpO1xuICAgICAgICBmb3IgKGxldCBmb250IG9mIHVuaXF1ZUZvbnRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0VGV4dHModHJhbnNsYXRpb25zKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBkaXNwbGF5Tm90aWZpY2F0aW9uKCdFbXB0eSBpbnB1dCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRleHRzID0gZmluZFRleHRzKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgeWllbGQgbG9hZEZvbnRzKHRleHRzKTtcbiAgICAgICAgdGV4dHMuZm9yRWFjaCgodHh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRUZXh0ID0gZ2V0Rm9ybWF0dGVkVGV4dCh0eHQpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbnNbZm9ybWF0dGVkVGV4dF07XG4gICAgICAgICAgICBpZiAodHJhbnNsYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2U7XG4gICAgICAgICAgICBjb25zdCBvbGRTZWdtZW50cyA9IGZvcm1hdHRlZFRleHQuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NlZ21lbnRzID0gdHJhbnNsYXRpb24uc3BsaXQoJ3wnKS5tYXAoKHN0cikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHVuZXNjYXBlKHN0cik7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBgRmFpbGVkIHRvIHVuZXNjYXBlOiAke3N0cn1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IGRlbGV0ZSBhbGwgdGV4dFxuICAgICAgICAgICAgaWYgKG5ld1NlZ21lbnRzLmxlbmd0aCA9PT0gMSAmJiBuZXdTZWdtZW50c1swXSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB0eHQuY2hhcmFjdGVycyA9ICcnO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBzZWdtZW50cyBsZW5ndGggbWlzbWF0Y2hcbiAgICAgICAgICAgIGlmIChuZXdTZWdtZW50cy5sZW5ndGggIT09IG9sZFNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGBXcm9uZyBzZWdtZW50IGNvdW50ICgke25ld1NlZ21lbnRzLmxlbmd0aH0g4omgICR7b2xkU2VnbWVudHMubGVuZ3RofSk6ICR7Zm9ybWF0dGVkVGV4dH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlOb3RpZmljYXRpb24oZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGltcG9ydFN0eWxlZFNlZ21lbnRzKG5ld1NlZ21lbnRzLCB0eHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7IGFkZFRhZywgZmluZEFsbCwgZ2V0Q3VycmVudExlc3NvbiwgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBmb3JtYXRPcmRlcihsZXNzb24pIHtcbiAgICBpZiAobGVzc29uLmZpbmRDaGlsZCgobikgPT4gISFnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eby0vLnRlc3QodCkpKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRm91bmQgby10YWcuIGZvcm1hdE9yZGVyIGFib3J0LicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBzZXR0aW5ncyA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3NldHRpbmdzJykpO1xuICAgIGFkZFRhZyhzZXR0aW5ncywgJ29yZGVyLWxheWVycycpO1xuICAgIGNvbnN0IGxheWVyUmVnZXggPSAvXihzLW11bHRpc3RlcC1icnVzaC18cy1tdWx0aXN0ZXAtYmctKShcXGQrKSQvO1xuICAgIGNvbnN0IHN0ZXBzID0gbGVzc29uLmZpbmRDaGlsZHJlbigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpICYmICFnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gbGVzc29uLmZpbmRDaGlsZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpO1xuICAgIGFkZFRhZyhyZXN1bHQsIGBvLSR7c3RlcHMubGVuZ3RoICsgMX1gKTtcbiAgICBzdGVwcy5yZXZlcnNlKCkuZm9yRWFjaCgoc3RlcCwgb3JkZXIpID0+IHtcbiAgICAgICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgICAgICBjb25zdCBsYXllclRhZyA9IHRhZ3MuZmluZCgodCkgPT4gbGF5ZXJSZWdleC50ZXN0KHQpKTtcbiAgICAgICAgbGV0IGxheWVyID0gNDtcbiAgICAgICAgaWYgKGxheWVyVGFnKSB7XG4gICAgICAgICAgICBsYXllciA9IHBhcnNlSW50KGxheWVyUmVnZXguZXhlYyhsYXllclRhZylbMl0pO1xuICAgICAgICAgICAgdGFncyA9IHRhZ3MuZmlsdGVyKCh0KSA9PiAhbGF5ZXJSZWdleC50ZXN0KHQpKTtcbiAgICAgICAgICAgIHRhZ3Muc3BsaWNlKDEsIDAsIC9eKHMtbXVsdGlzdGVwLWJydXNofHMtbXVsdGlzdGVwLWJnKS8uZXhlYyhsYXllclRhZylbMV0pO1xuICAgICAgICB9XG4gICAgICAgIHN0ZXAuc2V0UGx1Z2luRGF0YSgnbGF5ZXInLCBKU09OLnN0cmluZ2lmeShsYXllcikpO1xuICAgICAgICB0YWdzLnB1c2goYG8tJHtvcmRlciArIDF9YCk7XG4gICAgICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbignICcpO1xuICAgIH0pO1xuICAgIGxldCBzb3J0ZWRTdGVwcyA9IHN0ZXBzLnNvcnQoKGEsIGIpID0+IEpTT04ucGFyc2UoYi5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSAtXG4gICAgICAgIEpTT04ucGFyc2UoYS5nZXRQbHVnaW5EYXRhKCdsYXllcicpKSk7XG4gICAgc29ydGVkU3RlcHMuZm9yRWFjaCgocykgPT4gbGVzc29uLmluc2VydENoaWxkKDEsIHMpKTtcbn1cbmZ1bmN0aW9uIGF1dG9Gb3JtYXQoKSB7XG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnVEhVTUJOQUlMUycpO1xuICAgIGlmICh0aHVtYlBhZ2UpIHtcbiAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHRodW1iUGFnZS5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgICAgIGlmIChwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJykgfHwgIXRodW1ibmFpbEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSB0aHVtYm5haWxGcmFtZS5jbG9uZSgpO1xuICAgICAgICAgICAgY2xvbmUucmVzaXplKDQwMCwgNDAwKTtcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSAndGh1bWJuYWlsJztcbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIGNvbnN0IG9sZExlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgaWYgKG9sZExlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICBvbGRMZXNzb25GcmFtZS5uYW1lID0gJ2xlc3Nvbic7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJyk7XG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBpZiAoIXRodW1ibmFpbEZyYW1lIHx8ICFsZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnggPSBsZXNzb25GcmFtZS54IC0gNDQwO1xuICAgICAgICB0aHVtYm5haWxGcmFtZS55ID0gbGVzc29uRnJhbWUueTtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnNldHRpbmdzLy50ZXN0KG5vZGUubmFtZSkpLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDEwO1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec3RlcCBzLW11bHRpc3RlcC1yZXN1bHQvLnRlc3Qobm9kZS5uYW1lKSkuZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBuLmNoaWxkcmVuWzBdLm5hbWUgPSAndGVtcGxhdGUnO1xuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSAnL2lnbm9yZSc7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSA2MDtcbiAgICB9KTtcbn1cbm9uKCdhdXRvRm9ybWF0JywgYXV0b0Zvcm1hdCk7XG5vbignZm9ybWF0T3JkZXInLCAoKSA9PiBmb3JtYXRPcmRlcihnZXRDdXJyZW50TGVzc29uKCkpKTtcbiIsImltcG9ydCAnLi9jcmVhdGUnO1xuaW1wb3J0ICcuL3R1bmUnO1xuaW1wb3J0ICcuL2Zvcm1hdCc7XG5pbXBvcnQgJy4vbGludGVyJztcbmltcG9ydCAnLi9wdWJsaXNoJztcbmltcG9ydCAnLi4vcnBjLWFwaSc7XG5pbXBvcnQgeyBjdXJyZW50UGFnZUNoYW5nZWQsIHNlbGVjdGlvbkNoYW5nZWQsIHVwZGF0ZURpc3BsYXkgfSBmcm9tICcuL3R1bmUnO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcbmZpZ21hLnVpLnJlc2l6ZSgzNDAsIDQ3MCk7XG5jb25zb2xlLmNsZWFyKCk7XG5maWdtYS5vbignc2VsZWN0aW9uY2hhbmdlJywgKCkgPT4ge1xuICAgIHNlbGVjdGlvbkNoYW5nZWQoKTtcbn0pO1xuZmlnbWEub24oJ2N1cnJlbnRwYWdlY2hhbmdlJywgKCkgPT4ge1xuICAgIGN1cnJlbnRQYWdlQ2hhbmdlZChmaWdtYS5jdXJyZW50UGFnZSk7XG59KTtcbnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6ICdhbGwnLCBzdGVwTnVtYmVyOiAxIH0pO1xufSwgMTUwMCk7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmltcG9ydCB7IGdldFRhZ3MsIGZpbmRBbGwsIGZpbmRUYWcsIGRlc2NlbmRhbnRzLCBnZXRTdGVwT3JkZXIsIGZpbmRQYXJlbnRCeVRhZywgaXNSR0JUZW1wbGF0ZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB1cGRhdGVEaXNwbGF5IH0gZnJvbSAnLi90dW5lJztcbmxldCBlcnJvcnMgPSBbXTtcbmxldCB6b29tU2NhbGUgPSAxO1xubGV0IG1heEJzID0gMTIuODtcbmxldCBvcmRlciA9ICdzdGVwcyc7XG5leHBvcnQgdmFyIEVycm9yTGV2ZWw7XG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJFUlJPUlwiXSA9IDBdID0gXCJFUlJPUlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xufSkoRXJyb3JMZXZlbCB8fCAoRXJyb3JMZXZlbCA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RXJyb3IoaW5kZXgpIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKChfYSA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYWdlKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzW2luZGV4XS5wYWdlO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAoKF9hID0gZXJyb3JzW2luZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5vZGUpIHtcbiAgICAgICAgICAgIGVycm9yc1tpbmRleF0ucGFnZS5zZWxlY3Rpb24gPSBbZXJyb3JzW2luZGV4XS5ub2RlXTtcbiAgICAgICAgfVxuICAgIH0sIDApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEVycm9ycygpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCBzYXZlZEVycm9ycyA9IHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ2Vycm9yc0ZvclByaW50Jyk7XG4gICAgICAgIGxldCBzb3J0ZWRFcnJvcnMgPSBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpXG4gICAgICAgICAgICAubWFwKChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgICAgICBsZXQgc3RlcE51bWJlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoL0dST1VQfFJFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KChfYSA9IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5ub2RlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBzdGVwTnVtYmVyID0gZ2V0U3RlcE9yZGVyKGUubm9kZSkgfHwgZ2V0U3RlcE9yZGVyKGZpbmRQYXJlbnRCeVRhZyhlLm5vZGUsICdzdGVwJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZ25vcmU6IGUuaWdub3JlLFxuICAgICAgICAgICAgICAgIHBhZ2VOYW1lOiAoX2IgPSBlLnBhZ2UpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5uYW1lLFxuICAgICAgICAgICAgICAgIG5vZGVOYW1lOiAoX2MgPSBlLm5vZGUpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5uYW1lLFxuICAgICAgICAgICAgICAgIG5vZGVUeXBlOiAoX2QgPSBlLm5vZGUpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC50eXBlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlLmVycm9yLFxuICAgICAgICAgICAgICAgIGxldmVsOiBlLmxldmVsLFxuICAgICAgICAgICAgICAgIHN0ZXBOdW1iZXIsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNhdmVkRXJyb3JzKSB7XG4gICAgICAgICAgICBzb3J0ZWRFcnJvcnMgPSBzb3J0ZWRFcnJvcnMubWFwKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2F2ZWRFcnJvciA9IHNhdmVkRXJyb3JzLmZpbmQoKHMpID0+IHMucGFnZU5hbWUgPT09IGUucGFnZU5hbWUgJiYgcy5ub2RlTmFtZSA9PT0gZS5ub2RlTmFtZSAmJiBzLmVycm9yID09PSBlLmVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAoc2F2ZWRFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBlLmlnbm9yZSA9IHNhdmVkRXJyb3IuaWdub3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdEVycm9yKDApO1xuICAgICAgICByZXR1cm4gc29ydGVkRXJyb3JzO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGlmICghdmFsKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZnVuY3Rpb24gZGVlcE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVlcE5vZGVzKG4pKTtcbn1cbmZ1bmN0aW9uIGxpbnRGaWxscyhub2RlLCBwYWdlLCBmaWxscykge1xuICAgIGNvbnN0IHJnYnQgPSBpc1JHQlRlbXBsYXRlKG5vZGUpO1xuICAgIGNvbnN0IGRyYXdMaW5lVGFnID0gZmluZFRhZyhub2RlLCAvXmRyYXctbGluZS8pO1xuICAgIGZpbGxzLmZvckVhY2goKGYpID0+IHtcbiAgICAgICAgYXNzZXJ0KGYudmlzaWJsZSwgJ0ZpbGwgbXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydChmLnR5cGUgPT0gJ1NPTElEJyB8fCAhcmdidCwgJ0ZpbGwgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQoKCEvR1JBRElFTlRfTElORUFSfEdSQURJRU5UX1JBRElBTHxHUkFESUVOVF9BTkdVTEFSfEdSQURJRU5UX0RJQU1PTkQvLnRlc3QoZi50eXBlKSB8fCAhcmdidCksICdGaWxsIG11c3Qgbm90IGJlIGdyYWRpZW50JywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGFzc2VydCghZHJhd0xpbmVUYWcgfHwgIXJnYnQsICdGaWxscyBjYW50IGJlIHVzZWQgd2l0aCBkcmF3LWxpbmUgdGFnJywgcGFnZSwgbm9kZSk7XG4gICAgICAgIGlmIChmLnR5cGUgPT09ICdJTUFHRScpIHtcbiAgICAgICAgICAgIGFzc2VydChmLm9wYWNpdHkgPT0gMSB8fCAhcmdidCwgJ0ltYWdlIGZpbGwgbXVzdCBub3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gbGludFN0cm9rZXMobm9kZSwgcGFnZSwgc3Ryb2tlcykge1xuICAgIGNvbnN0IHJnYnQgPSBpc1JHQlRlbXBsYXRlKG5vZGUpO1xuICAgIHN0cm9rZXMuZm9yRWFjaCgocykgPT4ge1xuICAgICAgICBhc3NlcnQocy52aXNpYmxlLCAnU3Ryb2tlIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBhc3NlcnQocy50eXBlID09ICdTT0xJRCcgfHwgIXJnYnQsICdTdHJva2UgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xuICAgICAgICBpZiAocy50eXBlID09PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICBhc3NlcnQocy5vcGFjaXR5ID09IDEgfHwgIXJnYnQsICdJbWFnZSBzdHJva2UgbXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCAvUk9VTkR8Tk9ORS8udGVzdChTdHJpbmcobm9kZS5zdHJva2VDYXApKSB8fCAhcmdidCwgYFN0cm9rZSBjYXBzIG11c3QgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUNhcCl9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuRVJST1IpO1xuICAgIGFzc2VydChub2RlLnN0cm9rZUFsaWduID09ICdDRU5URVInIHx8ICFyZ2J0IHx8ICFzdHJva2VzLmxlbmd0aCwgYFN0cm9rZSBhbGlnbiBtdXN0IGJlICdDRU5URVInIGJ1dCBpcyAnJHtTdHJpbmcobm9kZS5zdHJva2VBbGlnbil9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuRVJST1IpO1xuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgbm9kZS5zdHJva2VKb2luID09ICdST1VORCcgfHwgIXJnYnQsIGBTdHJva2Ugam9pbnMgc2hvdWxkIGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VKb2luKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbn1cbmNvbnN0IHZhbGlkVmVjdG9yVGFncyA9IC9eXFwvfF5kcmF3LWxpbmUkfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbGlwJHxeW3ZWXWVjdG9yJHxeXFxkKyR8XkVsbGlwc2UkfF5SZWN0YW5nbGUkfF5mbHktZnJvbS1ib3R0b20kfF5mbHktZnJvbS1sZWZ0JHxeZmx5LWZyb20tcmlnaHQkfF5hcHBlYXIkfF53aWdnbGUtXFxkKyQvO1xuZnVuY3Rpb24gbGludFZlY3RvcihwYWdlLCBub2RlKSB7XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIGNvbnN0IHJnYnQgPSBpc1JHQlRlbXBsYXRlKG5vZGUpO1xuICAgIGNvbnN0IGFuaW0gPSBmaW5kVGFnKG5vZGUsIC9eZHJhdy1saW5lJHxeYmxpbmskLykgfHwgZmluZFBhcmVudEJ5VGFnKG5vZGUsICdkcmF3LWxpbmUnKSB8fCBmaW5kUGFyZW50QnlUYWcobm9kZSwgJ2JsaW5rJyk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxIHx8ICFyZ2J0LCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KHZhbGlkVmVjdG9yVGFncy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgbGV0IGZpbGxzID0gbm9kZS5maWxscztcbiAgICBsZXQgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcztcbiAgICBhc3NlcnQoIWZpbGxzLmxlbmd0aCB8fCAhc3Ryb2tlcy5sZW5ndGggfHwgIXJnYnQsICdTaG91bGQgbm90IGhhdmUgZmlsbCtzdHJva2UnLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIGxpbnRTdHJva2VzKG5vZGUsIHBhZ2UsIHN0cm9rZXMpO1xuICAgIGxpbnRGaWxscyhub2RlLCBwYWdlLCBmaWxscyk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJyBvciAnZHJhdy1saW5lJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5jb25zdCB2YWxpZEdyb3VwVGFncyA9IC9eXFwvfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbHktZnJvbS1ib3R0b20kfF5mbHktZnJvbS1sZWZ0JHxeZmx5LWZyb20tcmlnaHQkfF5hcHBlYXIkfF53aWdnbGUtXFxkKyR8XmRyYXctbGluZSR8XlxcZCskfF5bZ0ddcm91cCQvO1xuZnVuY3Rpb24gbGludEdyb3VwKHBhZ2UsIG5vZGUpIHtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KHZhbGlkR3JvdXBUYWdzLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcmdidCA9IGlzUkdCVGVtcGxhdGUobm9kZSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpIHx8IGZpbmRQYXJlbnRCeVRhZyhub2RlLCAnYmxpbmsnKTtcbiAgICBhc3NlcnQoIS9CT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpLCAnTm90aWNlIEJPT0xFQU5fT1BFUkFUSU9OJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgXCJNdXN0IGhhdmUgJ2JsaW5rJ1wiLCBwYWdlLCBub2RlKTsgLy8gZXZlcnkgcmdidCBtdXN0IGhhdmUgYW5pbWF0aW9uXG59XG5mdW5jdGlvbiBsaW50SW5wdXQocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLm5hbWUgPT0gJ2lucHV0JywgXCJNdXN0IGJlICdpbnB1dCdcIiwgcGFnZSwgbm9kZSk7XG4gICAgZGVzY2VuZGFudHMobm9kZSkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZVwiLCBwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuY29uc3QgdmFsaWRTZXR0aW5nc1RhZ3MgPSAvXlxcL3xec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC87XG5mdW5jdGlvbiBsaW50U2V0dGluZ3MocGFnZSwgbm9kZSkge1xuICAgIHZhciBfYTtcbiAgICBhc3NlcnQobm9kZS50eXBlID09ICdFTExJUFNFJywgXCJNdXN0IGJlICdFTExJUFNFJyB0eXBlJ1wiLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQodmFsaWRTZXR0aW5nc1RhZ3MudGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xuICAgICAgICBvcmRlciA9ICdsYXllcnMnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb3JkZXIgPSAnc3RlcHMnO1xuICAgIH1cbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZSgnem9vbS1zY2FsZS0nLCAnJykpIHx8XG4gICAgICAgICcxJyk7XG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xufVxuY29uc3QgdmFsaWRTdGVwVGFncyA9IC9eXFwvfF5zdGVwJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwLWJydXNoJHxecy1jb250aW51ZSR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XmNsZWFyLWxheWVyLShcXGQrLD8pKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJHxeYWxsb3ctdW5kbyR8XnNoYXJlLWJ1dHRvbiR8XmNsZWFyLWJlZm9yZSQvO1xuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIGlmICghYXNzZXJ0KHN0ZXAudHlwZSA9PSAnR1JPVVAnLCBcIk11c3QgYmUgJ0dST1VQJyB0eXBlJ1wiLCBwYWdlLCBzdGVwKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChzdGVwLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCh2YWxpZFN0ZXBUYWdzLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgLy8gYXNzZXJ0KCEvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYmckLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgaXMgb2Jzb2xldGVgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgIH0pO1xuICAgIGNvbnN0IGJnID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJnJHxecy1tdWx0aXN0ZXAtYmctXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJydXNoID0gdGFncy5maW5kKChzKSA9PiAvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IHNzID0gcGFyc2VJbnQoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnNzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3NzLScsICcnKSk7XG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KChfYiA9IHRhZ3MuZmluZCgocykgPT4gL15icy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZXBsYWNlKCdicy0nLCAnJykpO1xuICAgIGNvbnN0IGJydXNoTmFtZSA9IChfYyA9IHRhZ3NcbiAgICAgICAgLmZpbmQoKHMpID0+IC9eYnJ1c2gtbmFtZS1cXHcrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZXBsYWNlKCdicnVzaC1uYW1lLScsICcnKTtcbiAgICBjb25zdCB0ZXJtaW5hbE5vZGVzID0gZGVzY2VuZGFudHMoc3RlcCkuZmlsdGVyKCh2KSA9PiB2WydjaGlsZHJlbiddID09IHVuZGVmaW5lZCk7XG4gICAgY29uc3QgbWF4U2l6ZSA9IHRlcm1pbmFsTm9kZXMucmVkdWNlKChhY2MsIHYpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGFjYywgdi53aWR0aCwgdi5oZWlnaHQpO1xuICAgIH0sIDApO1xuICAgIG1heEJzID0gTWF0aC5tYXgoYnMgPyBicyA6IG1heEJzLCBtYXhCcyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAyMCB8fCBtYXhTaXplIDw9IDEwMCwgYFNob3VsZCBub3QgdXNlIHNzPDIwIHdpdGggbG9uZyBsaW5lcy4gQ29uc2lkZXIgdXNpbmcgYmcgdGVtcGxhdGUuICR7bWF4U2l6ZX0+MTAwYCwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDIwIHx8IHRlcm1pbmFsTm9kZXMubGVuZ3RoIDw9IDgsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIHRvbyBtYW55IGxpbmVzLiBDb25zaWRlciB1c2luZyBiZyB0ZW1wbGF0ZS4gJHt0ZXJtaW5hbE5vZGVzLmxlbmd0aH0+OGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSAxMCB8fCBicnVzaE5hbWUgPT0gJ3BlbmNpbCcsIGBTaG91bGQgbm90IHVzZSBiczwxMC4gJHtic308MTBgLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsICdzcyBtdXN0IGJlID49IDE1JywgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFzcyB8fCAhYnMgfHwgc3MgPiBicywgJ3NzIG11c3QgYmUgPiBicycsIHBhZ2UsIHN0ZXApO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPD0gem9vbVNjYWxlICogMTIuOCwgYGJzIG11c3QgYmUgPD0gJHt6b29tU2NhbGUgKiAxMi44fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gJ2xheWVycycsIGAke299IG11c3QgYmUgdXNlZCBvbmx5IHdpdGggc2V0dGluZ3Mgb3JkZXItbGF5ZXJzYCwgcGFnZSwgc3RlcCk7XG4gICAgYXNzZXJ0KG9yZGVyICE9PSAnbGF5ZXJzJyB8fCAhIW8sICdNdXN0IGhhdmUgby1OIG9yZGVyIG51bWJlcicsIHBhZ2UsIHN0ZXApO1xuICAgIGNvbnN0IHNmID0gc3RlcC5maW5kT25lKChuKSA9PiB7IHZhciBfYTsgcmV0dXJuIChnZXRUYWdzKG4pLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSB8fCBmaW5kUGFyZW50QnlUYWcobiwgJ3JnYi10ZW1wbGF0ZScpKSAmJiAoKF9hID0gbi5zdHJva2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubGVuZ3RoKSA+IDA7IH0pO1xuICAgIGNvbnN0IGZmcyA9IHN0ZXAuZmluZEFsbCgobikgPT4gKGdldFRhZ3MobikuaW5jbHVkZXMoJ3JnYi10ZW1wbGF0ZScpIHx8IGZpbmRQYXJlbnRCeVRhZyhuLCAncmdiLXRlbXBsYXRlJykpICYmIG4uZmlsbHMgJiYgbi5maWxsc1swXSk7XG4gICAgY29uc3QgYmlnRmZzID0gZmZzLmZpbHRlcigobikgPT4gbi53aWR0aCA+IDI3IHx8IG4uaGVpZ2h0ID4gMjcpO1xuICAgIGNvbnN0IGZmID0gZmZzLmxlbmd0aCA+IDA7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgIXNmKSwgJ1Nob3VsZCBub3QgdXNlIGJnK3NzIChzdHJva2Ugbm90IHByZXNlbnQpJywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICBhc3NlcnQoIWJnIHx8IGZmLCBcImJnIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aG91dCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnJ1c2ggfHwgYmlnRmZzLmxlbmd0aCA9PSAwLCBcImJydXNoIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aCBmaWxsZWQtaW4gdmVjdG9ycyAoc2l6ZSA+IDI3KVwiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xuICAgIHN0ZXAuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAobi5uYW1lID09ICdpbnB1dCcpIHtcbiAgICAgICAgICAgIGxpbnRJbnB1dChwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuLm5hbWUgPT09ICd0ZW1wbGF0ZScpIHtcbiAgICAgICAgICAgIC8vIGxpbnQgdGVtcGxhdGVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdpbnB1dCcgb3IgJ3RlbXBsYXRlJ1wiLCBwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGJsaW5rTm9kZXMgPSBmaW5kQWxsKHN0ZXAsIChuKSA9PiBnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eYmxpbmskLy50ZXN0KHQpKSAhPT0gdW5kZWZpbmVkKS5mbGF0TWFwKGRlZXBOb2Rlcyk7XG4gICAgY29uc3QgZmlsbGVkTm9kZSA9IGJsaW5rTm9kZXMuZmluZCgobikgPT4gbi5maWxsc1swXSk7XG4gICAgYXNzZXJ0KGJsaW5rTm9kZXMubGVuZ3RoID09IDAgfHwgISFmaWxsZWROb2RlIHx8IGJsaW5rTm9kZXMubGVuZ3RoID4gMywgJ1Nob3VsZCB1c2UgZHJhdy1saW5lIGlmIDwgNCBsaW5lcycsIHBhZ2UsIGJsaW5rTm9kZXNbMF0sIEVycm9yTGV2ZWwuSU5GTyk7XG59XG5mdW5jdGlvbiBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDEzNjYgJiYgbm9kZS5oZWlnaHQgPT0gMTAyNCwgJ011c3QgYmUgMTM2NngxMDI0JywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCEhbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSksIFwiTXVzdCBoYXZlICdzLW11bHRpc3RlcC1yZXN1bHQnIGNoaWxkXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XG4gICAgbGV0IHNldHRpbmdzID0gbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aCgnc2V0dGluZ3MnKSk7XG4gICAgaWYgKHNldHRpbmdzKSB7XG4gICAgICAgIGxpbnRTZXR0aW5ncyhwYWdlLCBzZXR0aW5ncyk7XG4gICAgfVxuICAgIGxldCBvcmRlck51bWJlcnMgPSB7fTtcbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XG4gICAgICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZCA9IC9eby0oXFxkKykkLy5leGVjKHRhZyk7XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbyA9IGZvdW5kWzFdO1xuICAgICAgICAgICAgYXNzZXJ0KCFvcmRlck51bWJlcnNbb10sIGBNdXN0IGhhdmUgdW5pcXVlICR7dGFnfSB2YWx1ZXNgLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJOdW1iZXJzW29dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAoc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3N0ZXAnKSkge1xuICAgICAgICAgICAgbGludFN0ZXAocGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXN0ZXAubmFtZS5zdGFydHNXaXRoKCdzZXR0aW5ncycpKSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnc2V0dGluZ3MnIG9yICdzdGVwJ1wiLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBhc3NlcnQoXG4gICAgLy8gICBtYXhCcyA+ICh6b29tU2NhbGUgLSAxKSAqIDEyLjgsXG4gICAgLy8gICBgem9vbS1zY2FsZSAke3pvb21TY2FsZX0gbXVzdCBiZSAke01hdGguY2VpbChcbiAgICAvLyAgICAgbWF4QnMgLyAxMi44XG4gICAgLy8gICApfSBmb3IgbWF4IGJzICR7bWF4QnN9IHVzZWRgLFxuICAgIC8vICAgcGFnZSxcbiAgICAvLyAgIG5vZGVcbiAgICAvLyApXG59XG5mdW5jdGlvbiBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gNDAwICYmIG5vZGUuaGVpZ2h0ID09IDQwMCwgJ011c3QgYmUgNDAweDQwMCcsIHBhZ2UsIG5vZGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxpbnRQYWdlKGN1cnJlbnRQYWdlLCBhcHBlbmRFcnJvcnMpIHtcbiAgICBpZiAoIWFwcGVuZEVycm9ycykge1xuICAgICAgICBlcnJvcnMgPSBbXTtcbiAgICB9XG4gICAgY29uc3QgcGFnZSA9IGN1cnJlbnRQYWdlID8gY3VycmVudFBhZ2UgOiBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICBpZiAoL15cXC98XklOREVYJC8udGVzdChwYWdlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlRGlzcGxheShwYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICBpZiAoIWFzc2VydCgvXlthLXpcXC0wLTldKyQvLnRlc3QocGFnZS5uYW1lKSwgYFBhZ2UgbmFtZSAnJHtwYWdlLm5hbWV9JyBtdXN0IG1hdGNoIFthLXpcXFxcLTAtOV0rLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXmxlc3NvbiQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAnbGVzc29uJ1wiLCBwYWdlKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHBhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKG5vZGUubmFtZSA9PSAnbGVzc29uJykge1xuICAgICAgICAgICAgbGludFRhc2tGcmFtZShwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLm5hbWUgPT0gJ3RodW1ibmFpbCcpIHtcbiAgICAgICAgICAgIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoL15cXC8vLnRlc3Qobm9kZS5uYW1lKSwgXCJNdXN0IGJlICd0aHVtYm5haWwnIG9yICdsZXNzb24nLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5cIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0RXJyb3JzKCk7XG59XG5mdW5jdGlvbiBsaW50SW5kZXgocGFnZSkge1xuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsICdJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudCcsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcbiAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIHBhZ2UuY2hpbGRyZW5bMF0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxpbnRDb3Vyc2UoKSB7XG4gICAgZXJyb3JzID0gW107XG4gICAgYXNzZXJ0KC9eQ09VUlNFLVthLXpcXC0wLTldKyQvLnRlc3QoZmlnbWEucm9vdC5uYW1lKSwgYENvdXJzZSBuYW1lICcke2ZpZ21hLnJvb3QubmFtZX0nIG11c3QgbWF0Y2ggQ09VUlNFLVthLXpcXFxcLTAtOV0rYCk7XG4gICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZSA9PSAnSU5ERVgnKTtcbiAgICBpZiAoYXNzZXJ0KCEhaW5kZXgsIFwiTXVzdCBoYXZlICdJTkRFWCcgcGFnZVwiKSkge1xuICAgICAgICBsaW50SW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgICAvLyBmaW5kIGFsbCBub24tdW5pcXVlIG5hbWVkIHBhZ2VzXG4gICAgY29uc3Qgbm9uVW5pcXVlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maWx0ZXIoKHAsIGksIGEpID0+IGEuZmluZEluZGV4KChwMikgPT4gcDIubmFtZSA9PSBwLm5hbWUpICE9IGkpO1xuICAgIG5vblVuaXF1ZS5mb3JFYWNoKChwKSA9PiBhc3NlcnQoZmFsc2UsIGBQYWdlIG5hbWUgJyR7cC5uYW1lfScgbXVzdCBiZSB1bmlxdWVgLCBwKSk7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGxpbnRQYWdlKHBhZ2UsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0RXJyb3JzKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2F2ZUVycm9ycyhlcnJvcnNGb3JQcmludCkge1xuICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdlcnJvcnNGb3JQcmludCcsIGVycm9yc0ZvclByaW50KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgY2FwaXRhbGl6ZSwgcHJpbnQgfSBmcm9tICcuL3V0aWwnO1xuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBcInRhc2stbmFtZSAke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiID0gXCIke2NhcGl0YWxpemUocGFnZS5uYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRMZXNzb24ocGFnZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5pbmRleE9mKHBhZ2UpO1xuICAgICAgICBjb25zdCBsZXNzb25Ob2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ2xlc3NvbicpO1xuICAgICAgICBjb25zdCB0aHVtYm5haWxOb2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xuICAgICAgICBpZiAoIWxlc3Nvbk5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlID0geWllbGQgbGVzc29uTm9kZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICBmb3JtYXQ6ICdTVkcnLFxuICAgICAgICAgICAgLy8gc3ZnT3V0bGluZVRleHQ6IGZhbHNlLFxuICAgICAgICAgICAgc3ZnSWRBdHRyaWJ1dGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0aHVtYm5haWwgPSB5aWVsZCB0aHVtYm5haWxOb2RlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgICAgIGZvcm1hdDogJ1BORycsXG4gICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1dJRFRIJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogNjAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb3Vyc2VQYXRoOiBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgnQ09VUlNFLScsICcnKSxcbiAgICAgICAgICAgIHBhdGg6IHBhZ2UubmFtZSxcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICB0aHVtYm5haWwsXG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDb3Vyc2UoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgW2xlc3NvbnMsIHRodW1ibmFpbF0gPSB5aWVsZCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICBQcm9taXNlLmFsbChmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbHRlcigocGFnZSkgPT4gcGFnZS5uYW1lICE9ICdJTkRFWCcpXG4gICAgICAgICAgICAgICAgLm1hcCgocGFnZSkgPT4gZXhwb3J0TGVzc29uKHBhZ2UpKSksXG4gICAgICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuXG4gICAgICAgICAgICAgICAgLmZpbmQoKHBhZ2UpID0+IHBhZ2UubmFtZSA9PSAnSU5ERVgnKVxuICAgICAgICAgICAgICAgIC5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiAnUE5HJyxcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhdGg6IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKCdDT1VSU0UtJywgJycpLFxuICAgICAgICAgICAgbGVzc29ucyxcbiAgICAgICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcbiAgICBsZXQgc3dpZnRDb3Vyc2VOYW1lID0gY291cnNlTmFtZVxuICAgICAgICAuc3BsaXQoJy0nKVxuICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9XG4gICAgICAgIHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSAnJztcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tzICs9IGBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiwgcHJvOiB0cnVlKSxcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgIGxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXG4gICAgYXV0aG9yOiBSRVBMQUNFLFxuICAgIHRhc2tzOiBbXG4ke3Rhc2tzfSAgICBdKVxuYDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xuICAgIHByaW50KGNvZGUpO1xufVxub24oJ2dlbmVyYXRlQ29kZScsIGdlbmVyYXRlQ29kZSk7XG4iLCJpbXBvcnQgeyBnZXRMYXN0U3RlcE9yZGVyIH0gZnJvbSAnLi9jcmVhdGUnO1xuaW1wb3J0IHsgZ2V0VGFncywgZmluZExlYWZOb2RlcywgZ2V0Q3VycmVudExlc3Nvbiwgc2V0U3RlcE9yZGVyIH0gZnJvbSAnLi91dGlsJztcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xuICAgIGNvbnN0IG8gPSBwYXJzZUludChvdGFnLnJlcGxhY2UoJ28tJywgJycpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRQYWludENvbG9yKHBhaW50KSB7XG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcbiAgICAgICAgbGV0IHsgciwgZywgYiB9ID0gcGFpbnQuY29sb3I7XG4gICAgICAgIHIgPSBNYXRoLnJvdW5kKHIgKiAyNTUpO1xuICAgICAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcbiAgICAgICAgYiA9IE1hdGgucm91bmQoYiAqIDI1NSk7XG4gICAgICAgIHJldHVybiB7IHIsIGcsIGIsIGE6IDEgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IHI6IDE2NiwgZzogMTY2LCBiOiAxNjYsIGE6IDEgfTtcbiAgICB9XG59XG5mdW5jdGlvbiBkaXNwbGF5Q29sb3IoeyByLCBnLCBiLCBhIH0pIHtcbiAgICByZXR1cm4gYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgO1xufVxuZnVuY3Rpb24gZ2V0Q29sb3JzKG5vZGUpIHtcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAgfTsgLy8gdHJhbnNwYXJlbnQgPSBkZWZhdWx0IGNvbG9yXG4gICAgbGV0IGZpbGxzID0gZGVmYXVsdENvbG9yO1xuICAgIGxldCBzdHJva2VzID0gZGVmYXVsdENvbG9yO1xuICAgIGNvbnN0IGxlYWYgPSBmaW5kTGVhZk5vZGVzKG5vZGUpWzBdO1xuICAgIGlmICgnZmlsbHMnIGluIGxlYWYgJiYgbGVhZi5maWxscyAhPT0gZmlnbWEubWl4ZWQgJiYgbGVhZi5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpbGxzID0gZ2V0UGFpbnRDb2xvcihsZWFmLmZpbGxzWzBdKTtcbiAgICB9XG4gICAgaWYgKCdzdHJva2VzJyBpbiBsZWFmICYmIGxlYWYuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0cm9rZXMgPSBnZXRQYWludENvbG9yKGxlYWYuc3Ryb2tlc1swXSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGZpbGxzQ29sb3I6IGRpc3BsYXlDb2xvcihmaWxscyksXG4gICAgICAgIHN0cm9rZXNDb2xvcjogZGlzcGxheUNvbG9yKHN0cm9rZXMpLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcHMoKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHJldHVybiBzdGVwc0J5T3JkZXIobGVzc29uKS5tYXAoKHN0ZXApID0+IHtcbiAgICAgICAgcmV0dXJuIHsgaWQ6IHN0ZXAuaWQsIG5hbWU6IHN0ZXAubmFtZSwgY29sb3JzOiBnZXRDb2xvcnMoc3RlcCksIGxheWVyTnVtYmVyOiBsZXNzb24uY2hpbGRyZW4uaW5kZXhPZihzdGVwKSArIDEgfTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwc09yZGVyKHN0ZXBzKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgY29uc3QgcyA9IGxlc3Nvbi5maW5kT25lKChlbCkgPT4gZWwuaWQgPT0gc3RlcC5pZCk7XG4gICAgICAgIGlmIChzKSB7XG4gICAgICAgICAgICBzZXRTdGVwT3JkZXIocywgaSArIDEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gdGFnVW5vcmRlcmVkU3RlcHMoKSB7XG4gICAgbGV0IHN0YXJ0V2l0aCA9IGdldExhc3RTdGVwT3JkZXIoKSArIDE7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIHN0ZXBzQnlPcmRlcihsZXNzb24pXG4gICAgICAgIC5maWx0ZXIoKHMpID0+ICFnZXRUYWdzKHMpLnNvbWUoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkpXG4gICAgICAgIC5mb3JFYWNoKChzdGVwLCBpKSA9PiBzZXRTdGVwT3JkZXIoc3RlcCwgaSArIHN0YXJ0V2l0aCkpO1xufVxuIiwiaW1wb3J0IHsgZW1pdCwgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgZGVzY2VuZGFudHMsIGZpbmRMZWFmTm9kZXMsIGdldEN1cnJlbnRMZXNzb24sIGdldFN0ZXBPcmRlciwgZ2V0VGFncywgaXNSZXN1bHRTdGVwLCB9IGZyb20gJy4vdXRpbCc7XG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgb3RhZyA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKCdvLScpKSB8fCAnJztcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBnZXRUYWcoc3RlcCwgdGFnKSB7XG4gICAgY29uc3QgdiA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKHRhZykpO1xuICAgIHJldHVybiB2ID8gdi5yZXBsYWNlKHRhZywgJycpIDogbnVsbDtcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZWxldGVUbXAoKSB7XG4gICAgZmlnbWEuY3VycmVudFBhZ2VcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBlbC5uYW1lLnN0YXJ0c1dpdGgoJ3RtcC0nKSlcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XG59XG5sZXQgbGFzdE1vZGUgPSAnYWxsJztcbmxldCBsYXN0UGFnZTtcbmZ1bmN0aW9uIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApIHtcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRlbXBsYXRlID0gaW5wdXQuY2xvbmUoKTtcbiAgICB0ZW1wbGF0ZS5uYW1lID0gJ3RtcC10ZW1wbGF0ZSc7XG4gICAgdGVtcGxhdGVcbiAgICAgICAgLmZpbmRBbGwoKGVsKSA9PiBnZXRUYWdzKGVsKS5pbmNsdWRlcygncmdiLXRlbXBsYXRlJykpXG4gICAgICAgIC5tYXAoKGVsKSA9PiBmaW5kTGVhZk5vZGVzKGVsKSlcbiAgICAgICAgLmZsYXQoKVxuICAgICAgICAuZmlsdGVyKChlbCkgPT4gL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KGVsLnR5cGUpKVxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKGVsLnN0cm9rZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWwuc3Ryb2tlcyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSB9XTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRXZWlnaHQgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAzMCA6IDUwO1xuICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSkgfHwgZGVmYXVsdFdlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHBpbmsgPSBlbC5jbG9uZSgpO1xuICAgICAgICAgICAgcGluay5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgcGluay5zdHJva2VXZWlnaHQgPSAyO1xuICAgICAgICAgICAgcGluay5uYW1lID0gJ3BpbmsgJyArIGVsLm5hbWU7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChwaW5rKTtcbiAgICAgICAgICAgIC8vIGNsb25lIGVsZW1lbnQgaGVyZSBhbmQgZ2l2ZSBoaW0gdGhpbiBwaW5rIHN0cm9rZVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbC5maWxscyA9IFt7IHR5cGU6ICdTT0xJRCcsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICB0ZW1wbGF0ZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IGlucHV0LnJlbGF0aXZlVHJhbnNmb3JtO1xufVxuZnVuY3Rpb24gZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApIHtcbiAgICBjb25zdCBkZWZhdWx0QlMgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAxMi44IDogMTA7XG4gICAgY29uc3QgYnMgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSB8fCBkZWZhdWx0QlM7XG4gICAgY29uc3Qgc21hbGxMaW5lID0gZmlnbWEuY3JlYXRlTGluZSgpO1xuICAgIHNtYWxsTGluZS5uYW1lID0gJ3NtYWxsTGluZSc7XG4gICAgc21hbGxMaW5lLnJlc2l6ZSgzMDAsIDApO1xuICAgIHNtYWxsTGluZS5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMCwgZzogMC44LCBiOiAwIH0gfV07XG4gICAgc21hbGxMaW5lLnN0cm9rZVdlaWdodCA9IGJzIC8gMztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQ2FwID0gJ1JPVU5EJztcbiAgICBzbWFsbExpbmUuc3Ryb2tlQWxpZ24gPSAnQ0VOVEVSJztcbiAgICBzbWFsbExpbmUueSA9IHNtYWxsTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IG1lZGl1bUxpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBtZWRpdW1MaW5lLm5hbWUgPSAnbWVkaXVtTGluZSc7XG4gICAgbWVkaXVtTGluZS5vcGFjaXR5ID0gMC4yO1xuICAgIG1lZGl1bUxpbmUuc3Ryb2tlV2VpZ2h0ID0gYnM7XG4gICAgbWVkaXVtTGluZS55ID0gbWVkaXVtTGluZS5zdHJva2VXZWlnaHQgLyAyO1xuICAgIGNvbnN0IGJpZ0xpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcbiAgICBiaWdMaW5lLm5hbWUgPSAnYmlnTGluZSc7XG4gICAgYmlnTGluZS5vcGFjaXR5ID0gMC4xO1xuICAgIGJpZ0xpbmUuc3Ryb2tlV2VpZ2h0ID0gYnMgKyBNYXRoLnBvdyhicywgMS40KSAqIDAuODtcbiAgICBiaWdMaW5lLnkgPSBiaWdMaW5lLnN0cm9rZVdlaWdodCAvIDI7XG4gICAgY29uc3QgZ3JvdXAgPSBmaWdtYS5ncm91cChbYmlnTGluZSwgbWVkaXVtTGluZSwgc21hbGxMaW5lXSwgbGVzc29uLnBhcmVudCk7XG4gICAgZ3JvdXAubmFtZSA9ICd0bXAtYnMnO1xuICAgIGdyb3VwLnggPSBsZXNzb24ueDtcbiAgICBncm91cC55ID0gbGVzc29uLnkgLSA4MDtcbn1cbmZ1bmN0aW9uIGdldEJydXNoU2l6ZShzdGVwKSB7XG4gICAgY29uc3QgbGVhdmVzID0gZmluZExlYWZOb2RlcyhzdGVwKTtcbiAgICBjb25zdCBzdHJva2VzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ3N0cm9rZXMnIGluIG4gJiYgbi5zdHJva2VzLmxlbmd0aCA+IDApO1xuICAgIGNvbnN0IHN0cm9rZVdlaWdodHNBcnIgPSBzdHJva2VzLm1hcCgobm9kZSkgPT4gbm9kZVsnc3Ryb2tlV2VpZ2h0J10gfHwgMCk7XG4gICAgY29uc3QgbWF4V2VpZ2h0ID0gTWF0aC5tYXgoLi4uc3Ryb2tlV2VpZ2h0c0Fycik7XG4gICAgcmV0dXJuIHN0cm9rZXMubGVuZ3RoID4gMCA/IG1heFdlaWdodCA6IDI1O1xufVxuZnVuY3Rpb24gZ2V0Q2xlYXJMYXllck51bWJlcnMoc3RlcCkge1xuICAgIGNvbnN0IHByZWZpeCA9ICdjbGVhci1sYXllci0nO1xuICAgIGNvbnN0IGNsZWFyTGF5ZXJzU3RlcCA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0YWcpID0+IHRhZy5zdGFydHNXaXRoKHByZWZpeCkpO1xuICAgIGlmIChjbGVhckxheWVyc1N0ZXAubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgbGF5ZXJOdW1iZXJzID0gY2xlYXJMYXllcnNTdGVwWzBdXG4gICAgICAgIC5zbGljZShwcmVmaXgubGVuZ3RoKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKE51bWJlcik7XG4gICAgcmV0dXJuIGxheWVyTnVtYmVycztcbn1cbmZ1bmN0aW9uIHNob3dPbmx5UkdCVGVtcGxhdGUobm9kZSkge1xuICAgIGlmIChnZXRUYWdzKG5vZGUpLmluY2x1ZGVzKCdzZXR0aW5ncycpKSB7XG4gICAgICAgIG5vZGUudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChnZXRUYWdzKG5vZGUpLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSB8fCAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KG5vZGUudHlwZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIGlmICgvR1JPVVB8Qk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNob3dPbmx5UkdCVGVtcGxhdGUodik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdCh2LnR5cGUpICYmICFnZXRUYWdzKHYpLmluY2x1ZGVzKCdyZ2ItdGVtcGxhdGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHYudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjb2xsZWN0TGF5ZXJOdW1iZXJzVG9DbGVhcihsZXNzb24sIHN0ZXApIHtcbiAgICBjb25zdCBjdXJyZW50U3RlcE9yZGVyID0gZ2V0U3RlcE9yZGVyKHN0ZXApO1xuICAgIGNvbnN0IGxheWVyc1N0ZXBPcmRlclRhZ3MgPSBsZXNzb24uY2hpbGRyZW4ubWFwKChzKSA9PiBnZXRTdGVwT3JkZXIocykpO1xuICAgIGNvbnN0IGNsZWFyTGF5ZXJOdW1iZXJzID0gbGVzc29uLmNoaWxkcmVuLnJlZHVjZSgoYWNjLCBsYXllcikgPT4ge1xuICAgICAgICBpZiAobGF5ZXIudHlwZSAhPT0gJ0dST1VQJyB8fCBnZXRTdGVwT3JkZXIobGF5ZXIpID4gY3VycmVudFN0ZXBPcmRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2V0VGFncyhsYXllcikuaW5jbHVkZXMoJ2NsZWFyLWJlZm9yZScpKSB7XG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgc3RlcCBvcmRlciB0YWdzIGFuZCBjb252ZXJ0IHRvIGxheWVycyB0byBjbGVhclxuICAgICAgICAgICAgY29uc3Qgc3RlcHNUb0NsZWFyID0gWy4uLkFycmF5KGdldFN0ZXBPcmRlcihsYXllcikpLmtleXMoKV0uc2xpY2UoMSk7XG4gICAgICAgICAgICBzdGVwc1RvQ2xlYXIuZm9yRWFjaCgoc3RlcE9yZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxheWVyc1N0ZXBPcmRlclRhZ3MuaW5jbHVkZXMoc3RlcE9yZGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBhY2MuYWRkKGxheWVyc1N0ZXBPcmRlclRhZ3MuaW5kZXhPZihzdGVwT3JkZXIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXRDbGVhckxheWVyTnVtYmVycyhsYXllcikuZm9yRWFjaCgoaWR4KSA9PiBhY2MuYWRkKGlkeCkpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIG5ldyBTZXQoKSk7XG4gICAgcmV0dXJuIGNsZWFyTGF5ZXJOdW1iZXJzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGFnZSwgc2V0dGluZ3MpIHtcbiAgICBsYXN0UGFnZSA9IHBhZ2U7XG4gICAgbGFzdE1vZGUgPSBzZXR0aW5ncy5kaXNwbGF5TW9kZTtcbiAgICBjb25zdCB7IGRpc3BsYXlNb2RlLCBzdGVwTnVtYmVyIH0gPSBzZXR0aW5ncztcbiAgICBjb25zdCBsZXNzb24gPSBwYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcbiAgICBpZiAoIWxlc3Nvbikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzdGVwTnVtYmVyIC0gMV07XG4gICAgcGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XG4gICAgY29uc3Qgc3RlcENvdW50ID0gbGVzc29uLmNoaWxkcmVuLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKS5sZW5ndGg7XG4gICAgY29uc3QgbWF4U3Ryb2tlV2VpZ2h0ID0gZ2V0QnJ1c2hTaXplKHN0ZXApO1xuICAgIGNvbnN0IGJydXNoVHlwZSA9IGdldFRhZyhzdGVwLCAnYnJ1c2gtbmFtZS0nKSB8fCAnJztcbiAgICBsZXQgbGF5ZXJOdW1iZXJzVG9DbGVhciA9IGdldFRhZ3Moc3RlcCkuaW5jbHVkZXMoJ2NsZWFyLWJlZm9yZScpID8gWy4uLkFycmF5KHN0ZXBOdW1iZXIpLmtleXMoKV0uc2xpY2UoMSkgOiBnZXRDbGVhckxheWVyTnVtYmVycyhzdGVwKTtcbiAgICBlbWl0KCd1cGRhdGVGb3JtJywge1xuICAgICAgICBzaGFkb3dTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCAwLFxuICAgICAgICBicnVzaFNpemU6IHBhcnNlSW50KGdldFRhZyhzdGVwLCAnYnMtJykpIHx8IDAsXG4gICAgICAgIHN1Z2dlc3RlZEJydXNoU2l6ZTogaXNSZXN1bHRTdGVwKHN0ZXApID8gMCA6IG1heFN0cm9rZVdlaWdodCxcbiAgICAgICAgdGVtcGxhdGU6IGdldFRhZyhzdGVwLCAncy0nKSB8fCAwLFxuICAgICAgICBzdGVwQ291bnQsXG4gICAgICAgIHN0ZXBOdW1iZXIsXG4gICAgICAgIGRpc3BsYXlNb2RlLFxuICAgICAgICBjbGVhckJlZm9yZTogZ2V0VGFncyhzdGVwKS5pbmNsdWRlcygnY2xlYXItYmVmb3JlJyksXG4gICAgICAgIGNsZWFyTGF5ZXJzOiBsYXllck51bWJlcnNUb0NsZWFyLm1hcCgobikgPT4gbi50b1N0cmluZygpKSB8fCBbXSxcbiAgICAgICAgb3RoZXJUYWdzOiBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gdC5zdGFydHNXaXRoKCdzaGFyZS1idXR0b24nKSB8fFxuICAgICAgICAgICAgdC5zdGFydHNXaXRoKCdhbGxvdy11bmRvJykpIHx8IFtdLFxuICAgICAgICBicnVzaFR5cGUsXG4gICAgfSk7XG4gICAgZGVsZXRlVG1wKCk7XG4gICAgc3dpdGNoIChkaXNwbGF5TW9kZSkge1xuICAgICAgICBjYXNlICdhbGwnOlxuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnY3VycmVudCc6XG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIHN0ZXBzQnlPcmRlcihsZXNzb24pLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBpIDwgc3RlcE51bWJlcjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29sbGVjdExheWVyTnVtYmVyc1RvQ2xlYXIobGVzc29uLCBzdGVwKS5mb3JFYWNoKChpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuW2ldLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHNob3dPbmx5UkdCVGVtcGxhdGUoc3RlcCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgICAgIGRpc3BsYXlCcnVzaFNpemUobGVzc29uLCBzdGVwKTtcbiAgICAgICAgICAgIGRpc3BsYXlUZW1wbGF0ZShsZXNzb24sIHN0ZXApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdXBkYXRlRGlzcGxheShmaWdtYS5jdXJyZW50UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XG59LCAxNTAwKTtcbmZ1bmN0aW9uIGFkZEFuaW1hdGlvblRhZyhzdGVwLCB0YWcsIGRlbGF5LCByZXBlYXQpIHtcbiAgICBpZiAoKC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0udHlwZSkpKSB7XG4gICAgICAgIGxldCBzZWxlY3Rpb25UYWdzID0gZ2V0VGFncyhmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0pO1xuICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoJ3dpZ2dsZScpICYmICF0LnN0YXJ0c1dpdGgoJ2ZseS1mcm9tLScpICYmICF0LnN0YXJ0c1dpdGgoJ2FwcGVhcicpICYmICF0LnN0YXJ0c1dpdGgoJ2JsaW5rJykgJiYgIXQuc3RhcnRzV2l0aCgnZHJhdy1saW5lJykpO1xuICAgICAgICBzZWxlY3Rpb25UYWdzID0gc2VsZWN0aW9uVGFncy5maWx0ZXIoKHQpID0+ICEvZFxcZCsvLnRlc3QodCkgJiYgIS9yXFxkKy8udGVzdCh0KSk7XG4gICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaCh0YWcpO1xuICAgICAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKGBkJHtkZWxheX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzLnB1c2goYHIke3JlcGVhdH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXS5uYW1lID0gc2VsZWN0aW9uVGFncy5qb2luKCcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0ubmFtZSA9IHNlbGVjdGlvblRhZ3Muam9pbignICcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodGFnKSB7XG4gICAgICAgICAgICBkZXNjZW5kYW50cyhzdGVwKS5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdCh2LnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rpb25UYWdzID0gZ2V0VGFncyh2KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncyA9IHNlbGVjdGlvblRhZ3MuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKCd3aWdnbGUnKSAmJiAhdC5zdGFydHNXaXRoKCdmbHktZnJvbS0nKSAmJiAhdC5zdGFydHNXaXRoKCdhcHBlYXInKSAmJiAhdC5zdGFydHNXaXRoKCdibGluaycpICYmICF0LnN0YXJ0c1dpdGgoJ2RyYXctbGluZScpKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVGFncy5wdXNoKHRhZyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIS9kXFxkKy8udGVzdCh0KSAmJiAhL3JcXGQrLy50ZXN0KHQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25UYWdzLnB1c2goYGQke2RlbGF5fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MucHVzaChgciR7cmVwZWF0fWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHYubmFtZSA9IHNlbGVjdGlvblRhZ3Muam9pbignICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVzY2VuZGFudHMoc3RlcCkuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZWN0aW9uVGFncyA9IGdldFRhZ3Modik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnd2lnZ2xlJykgJiYgIXQuc3RhcnRzV2l0aCgnZmx5LWZyb20tJykgJiYgIXQuc3RhcnRzV2l0aCgnYXBwZWFyJykgJiYgIXQuc3RhcnRzV2l0aCgnYmxpbmsnKSAmJiAhdC5zdGFydHNXaXRoKCdkcmF3LWxpbmUnKSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblRhZ3MgPSBzZWxlY3Rpb25UYWdzLmZpbHRlcigodCkgPT4gIS9kXFxkKy8udGVzdCh0KSAmJiAhL3JcXGQrLy50ZXN0KHQpKTtcbiAgICAgICAgICAgICAgICAgICAgdi5uYW1lID0gc2VsZWN0aW9uVGFncy5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiB1cGRhdGVQcm9wcyhzZXR0aW5ncykge1xuICAgIGNvbnN0IGxlc3NvbiA9IGdldEN1cnJlbnRMZXNzb24oKTtcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc2V0dGluZ3Muc3RlcE51bWJlciAtIDFdO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoJ3NzLScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2JzLScpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ3MtJykgJiZcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnY2xlYXItbGF5ZXItJykgJiZcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnY2xlYXItYmVmb3JlJykgJiZcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnc2hhcmUtYnV0dG9uJykgJiZcbiAgICAgICAgIXQuc3RhcnRzV2l0aCgnYWxsb3ctdW5kbycpICYmXG4gICAgICAgICF0LnN0YXJ0c1dpdGgoJ2JydXNoLW5hbWUtJykpO1xuICAgIGlmIChzZXR0aW5ncy50ZW1wbGF0ZSkge1xuICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCBgcy0ke3NldHRpbmdzLnRlbXBsYXRlfWApO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3Muc2hhZG93U2l6ZSkge1xuICAgICAgICB0YWdzLnB1c2goYHNzLSR7c2V0dGluZ3Muc2hhZG93U2l6ZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmJydXNoU2l6ZSkge1xuICAgICAgICB0YWdzLnB1c2goYGJzLSR7c2V0dGluZ3MuYnJ1c2hTaXplfWApO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuYnJ1c2hUeXBlKSB7XG4gICAgICAgIHRhZ3MucHVzaChgYnJ1c2gtbmFtZS0ke3NldHRpbmdzLmJydXNoVHlwZX1gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmNsZWFyTGF5ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5jbGVhckJlZm9yZSkge1xuICAgICAgICAgICAgdGFncy5wdXNoKGBjbGVhci1sYXllci0ke3NldHRpbmdzLmNsZWFyTGF5ZXJzLmpvaW4oJywnKX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgdGFncy5wdXNoKCdjbGVhci1iZWZvcmUnKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLm90aGVyVGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdChzZXR0aW5ncy5vdGhlclRhZ3MpO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuYW5pbWF0aW9uVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYWRkQW5pbWF0aW9uVGFnKHN0ZXAsIHNldHRpbmdzLmFuaW1hdGlvblRhZywgc2V0dGluZ3MuZGVsYXksIHNldHRpbmdzLnJlcGVhdCk7XG4gICAgfVxuICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbignICcpO1xufVxub24oJ3VwZGF0ZURpc3BsYXknLCAoc2V0dGluZ3MpID0+IHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHNldHRpbmdzKSk7XG5vbigndXBkYXRlUHJvcHMnLCB1cGRhdGVQcm9wcyk7XG5leHBvcnQgZnVuY3Rpb24gY3VycmVudFBhZ2VDaGFuZ2VkKHBhZ2VOb2RlKSB7XG4gICAgaWYgKGZpZ21hICYmICFsYXN0UGFnZSkge1xuICAgICAgICBsYXN0UGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuICAgIH1cbiAgICB1cGRhdGVEaXNwbGF5KGxhc3RQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcbiAgICBsYXN0UGFnZSA9IHBhZ2VOb2RlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGlvbkNoYW5nZWQoKSB7XG4gICAgY29uc3QgbGVzc29uID0gZ2V0Q3VycmVudExlc3NvbigpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBpZiAoIXNlbGVjdGlvbiB8fFxuICAgICAgICAhbGVzc29uIHx8XG4gICAgICAgICFsZXNzb24uY2hpbGRyZW4uaW5jbHVkZXMoc2VsZWN0aW9uKSB8fFxuICAgICAgICBzZWxlY3Rpb24udHlwZSAhPT0gJ0dST1VQJykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdXBkYXRlIHN0ZXBcbiAgICBjb25zdCBzdGVwID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIGNvbnN0IHN0ZXBOdW1iZXIgPSBzdGVwc0J5T3JkZXIobGVzc29uKS5pbmRleE9mKHN0ZXApICsgMTtcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiBsYXN0TW9kZSwgc3RlcE51bWJlciB9KTtcbn1cbiIsImltcG9ydCB7IGVtaXQgfSBmcm9tICcuLi9ldmVudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICBhcnIucHVzaChub2RlKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KGNoaWxkcmVuLmZsYXRNYXAoKHApID0+IGZpbmRBbGwocCwgZikpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kTGVhZk5vZGVzKG5vZGUpIHtcbiAgICBpZiAoISgnY2hpbGRyZW4nIGluIG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBub2RlLmZpbmRBbGwoKG4pID0+ICEoJ2NoaWxkcmVuJyBpbiBuKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZFBhcmVudChub2RlLCBmKSB7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGlmIChub2RlLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudChub2RlLnBhcmVudCwgZik7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVJbmRleChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50LmNoaWxkcmVuLmZpbmRJbmRleCgobikgPT4gbi5pZCA9PT0gbm9kZS5pZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudExlc3NvbigpIHtcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT09ICdsZXNzb24nKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWdzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5uYW1lLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRUYWcobm9kZSwgdGFnKSB7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgcmV0dXJuIHRhZ3MuZmluZCgocykgPT4gdGFnLnRlc3QocykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRhZyhub2RlLCB0YWcpIHtcbiAgICBub2RlLm5hbWUgPSBnZXRUYWdzKG5vZGUpLmNvbmNhdChbdGFnXSkuam9pbignICcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnRCeVRhZyhub2RlLCB0YWcpIHtcbiAgICByZXR1cm4gZmluZFBhcmVudChub2RlLCAobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcyh0YWcpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1Jlc3VsdFN0ZXAobm9kZSkge1xuICAgIHJldHVybiBub2RlICYmIGdldFRhZ3Mobm9kZSkuaW5jbHVkZXMoJ3MtbXVsdGlzdGVwLXJlc3VsdCcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByaW50KHRleHQpIHtcbiAgICBlbWl0KCdwcmludCcsIHRleHQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlOb3RpZmljYXRpb24obWVzc2FnZSkge1xuICAgIGZpZ21hLm5vdGlmeShtZXNzYWdlKTtcbn1cbmV4cG9ydCBjb25zdCBjYXBpdGFsaXplID0gKHMpID0+IHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0ZXBPcmRlcihzdGVwKSB7XG4gICAgY29uc3Qgc3RlcE9yZGVyVGFnID0gL15vLShcXGQrKSQvO1xuICAgIGNvbnN0IHN0ZXBUYWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHRhZykgPT4gdGFnLm1hdGNoKHN0ZXBPcmRlclRhZykpO1xuICAgIGlmIChzdGVwVGFnKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoc3RlcFRhZy5tYXRjaChzdGVwT3JkZXJUYWcpWzFdKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gcmVzaXplVWkoaXNXaWRlKSB7XG4gICAgaWYgKGlzV2lkZSkge1xuICAgICAgICBmaWdtYS51aS5yZXNpemUoOTAwLCA0NzApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucmVzaXplKDM0MCwgNDcwKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0U3RlcE9yZGVyKHN0ZXAsIHN0ZXBPcmRlcikge1xuICAgIGdldFRhZ3Moc3RlcCkuc29tZSgodGFnKSA9PiAvXm8tXFxkKyQvLnRlc3QodGFnKSlcbiAgICAgICAgPyAoc3RlcC5uYW1lID0gc3RlcC5uYW1lLnJlcGxhY2UoL28tXFxkKy8sIGBvLSR7c3RlcE9yZGVyfWApKVxuICAgICAgICA6IChzdGVwLm5hbWUgKz0gYCBvLSR7c3RlcE9yZGVyfWApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFRyZWUobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gW25vZGUsIC4uLm5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZ2V0QWxsVHJlZShuKSldO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRlc2NlbmRhbnRzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBnZXRBbGxUcmVlKG4pKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1JHQlRlbXBsYXRlKG5vZGUpIHtcbiAgICByZXR1cm4gZmluZFRhZyhub2RlLCAvXnJnYi10ZW1wbGF0ZSQvKSB8fCBmaW5kUGFyZW50QnlUYWcobm9kZSwgJ3JnYi10ZW1wbGF0ZScpO1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBjcmVhdGVQbHVnaW5BUEksIGNyZWF0ZVVJQVBJIH0gZnJvbSAnZmlnbWEtanNvbnJwYyc7XG5pbXBvcnQgeyBleHBvcnRUZXh0cywgaW1wb3J0VGV4dHMgfSBmcm9tICcuL3BsdWdpbi9mb3JtYXQtcnBjJztcbmltcG9ydCB7IGV4cG9ydExlc3NvbiwgZXhwb3J0Q291cnNlIH0gZnJvbSAnLi9wbHVnaW4vcHVibGlzaCc7XG5pbXBvcnQgeyBnZXRTdGVwcywgc2V0U3RlcHNPcmRlciB9IGZyb20gJy4vcGx1Z2luL3R1bmUtcnBjJztcbmltcG9ydCB7IGNyZWF0ZUxlc3Nvbiwgc2VwYXJhdGVTdGVwLCBzcGxpdEJ5Q29sb3IsIGpvaW5TdGVwcywgfSBmcm9tICcuL3BsdWdpbi9jcmVhdGUnO1xuaW1wb3J0IHsgZGlzcGxheU5vdGlmaWNhdGlvbiwgcmVzaXplVWkgfSBmcm9tICcuL3BsdWdpbi91dGlsJztcbmltcG9ydCB7IGxpbnRQYWdlLCBsaW50Q291cnNlLCBzZWxlY3RFcnJvciwgc2F2ZUVycm9ycyB9IGZyb20gJy4vcGx1Z2luL2xpbnRlcic7XG5pbXBvcnQgeyBzZWxlY3Rpb25DaGFuZ2VkLCBjdXJyZW50UGFnZUNoYW5nZWQsIHVwZGF0ZURpc3BsYXkgfSBmcm9tICcuL3BsdWdpbi90dW5lJztcbi8vIEZpZ21hIHBsdWdpbiBtZXRob2RzXG5leHBvcnQgY29uc3QgcGx1Z2luQXBpID0gY3JlYXRlUGx1Z2luQVBJKHtcbiAgICBzZXRTZXNzaW9uVG9rZW4odG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3Nlc3Npb25Ub2tlbicsIHRva2VuKTtcbiAgICB9LFxuICAgIGdldFNlc3Npb25Ub2tlbigpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdzZXNzaW9uVG9rZW4nKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBleHBvcnRMZXNzb24sXG4gICAgZXhwb3J0Q291cnNlLFxuICAgIGdldFN0ZXBzLFxuICAgIHNldFN0ZXBzT3JkZXIsXG4gICAgZXhwb3J0VGV4dHMsXG4gICAgaW1wb3J0VGV4dHMsXG4gICAgZGlzcGxheU5vdGlmaWNhdGlvbixcbiAgICBjcmVhdGVMZXNzb24sXG4gICAgc2VwYXJhdGVTdGVwLFxuICAgIHNwbGl0QnlDb2xvcixcbiAgICBqb2luU3RlcHMsXG4gICAgc2VsZWN0RXJyb3IsXG4gICAgc2F2ZUVycm9ycyxcbiAgICBzZWxlY3Rpb25DaGFuZ2VkLFxuICAgIGN1cnJlbnRQYWdlQ2hhbmdlZCxcbiAgICB1cGRhdGVEaXNwbGF5LFxuICAgIGxpbnRQYWdlLFxuICAgIGxpbnRDb3Vyc2UsXG4gICAgcmVzaXplVWksXG59KTtcbi8vIEZpZ21hIFVJIGFwcCBtZXRob2RzXG5leHBvcnQgY29uc3QgdWlBcGkgPSBjcmVhdGVVSUFQSSh7fSk7XG4iXSwic291cmNlUm9vdCI6IiJ9