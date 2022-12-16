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
    let strokeWeightsArr = strokes.map((node) => {
        return node['strokeWeight'] || 0;
    });
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
function isResultStep(node) {
    return node && Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(node).includes('s-multistep-result');
}
function findParentByTag(node, tag) {
    return Object(_util__WEBPACK_IMPORTED_MODULE_0__["findParent"])(node, (n) => Object(_util__WEBPACK_IMPORTED_MODULE_0__["getTags"])(n).includes(tag));
}
function getNodeIndex(node) {
    return node.parent.children.findIndex((n) => n.id === node.id);
}
function separateStep() {
    const selection = figma.currentPage.selection;
    const leaves = selection.filter((node) => !('children' in node));
    if (!leaves.length) {
        return;
    }
    const firstParentStep = findParentByTag(selection[0], 'step');
    if (isResultStep(firstParentStep)) {
        return;
    }
    const lesson = firstParentStep.parent;
    const index = getNodeIndex(firstParentStep);
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
    const parentStep = findParentByTag(selection[0], 'step');
    const lesson = parentStep.parent;
    const leaves = Object(_util__WEBPACK_IMPORTED_MODULE_0__["findLeafNodes"])(parentStep);
    if (!parentStep || isResultStep(parentStep) || leaves.length <= 1) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpZ21hLWpzb25ycGMvZXJyb3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maWdtYS1qc29ucnBjL3JwYy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRzLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vY3JlYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZm9ybWF0LXJwYy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2Zvcm1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vcHVibGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3R1bmUtcnBjLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdHVuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3V0aWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JwYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNB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ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2luZGV4LnRzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMuUGFyc2VFcnJvciA9IGNsYXNzIFBhcnNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIlBhcnNlIGVycm9yXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNzAwO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5JbnZhbGlkUmVxdWVzdCA9IGNsYXNzIEludmFsaWRSZXF1ZXN0IGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnZhbGlkIFJlcXVlc3RcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDA7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLk1ldGhvZE5vdEZvdW5kID0gY2xhc3MgTWV0aG9kTm90Rm91bmQgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIk1ldGhvZCBub3QgZm91bmRcIik7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnN0YXR1c0NvZGUgPSAtMzI2MDE7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkludmFsaWRQYXJhbXMgPSBjbGFzcyBJbnZhbGlkUGFyYW1zIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoXCJJbnZhbGlkIHBhcmFtc1wiKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuc3RhdHVzQ29kZSA9IC0zMjYwMjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuSW50ZXJuYWxFcnJvciA9IGNsYXNzIEludGVybmFsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICBzdXBlcihcIkludGVybmFsIGVycm9yXCIpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5zdGF0dXNDb2RlID0gLTMyNjAzO1xuICB9XG59O1xuIiwiY29uc3QgeyBzZXR1cCwgc2VuZFJlcXVlc3QgfSA9IHJlcXVpcmUoXCIuL3JwY1wiKTtcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlVUlBUEkgPSBmdW5jdGlvbiBjcmVhdGVVSUFQSShtZXRob2RzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zICYmIG9wdGlvbnMudGltZW91dDtcblxuICBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHNldHVwKG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKG1ldGhvZHMpLnJlZHVjZSgocHJldiwgcCkgPT4ge1xuICAgIHByZXZbcF0gPSAoLi4ucGFyYW1zKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBtZXRob2RzW3BdKC4uLnBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHAsIHBhcmFtcywgdGltZW91dCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlUGx1Z2luQVBJID0gZnVuY3Rpb24gY3JlYXRlUGx1Z2luQVBJKG1ldGhvZHMsIG9wdGlvbnMpIHtcbiAgY29uc3QgdGltZW91dCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aW1lb3V0O1xuXG4gIGlmICh0eXBlb2YgZmlnbWEgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBzZXR1cChtZXRob2RzKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXRob2RzKS5yZWR1Y2UoKHByZXYsIHApID0+IHtcbiAgICBwcmV2W3BdID0gKC4uLnBhcmFtcykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBtZXRob2RzW3BdKC4uLnBhcmFtcykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KHAsIHBhcmFtcywgdGltZW91dCk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJldjtcbiAgfSwge30pO1xufTtcbiIsImNvbnN0IFJQQ0Vycm9yID0gcmVxdWlyZShcIi4vZXJyb3JzXCIpO1xuY29uc3QgeyBNZXRob2ROb3RGb3VuZCB9ID0gcmVxdWlyZShcIi4vZXJyb3JzXCIpO1xuXG5sZXQgc2VuZFJhdztcblxuaWYgKHR5cGVvZiBmaWdtYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICBmaWdtYS51aS5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gaGFuZGxlUmF3KG1lc3NhZ2UpKTtcbiAgc2VuZFJhdyA9IG1lc3NhZ2UgPT4gZmlnbWEudWkucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG59IGVsc2UgaWYgKHR5cGVvZiBwYXJlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgb25tZXNzYWdlID0gZXZlbnQgPT4gaGFuZGxlUmF3KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSk7XG4gIHNlbmRSYXcgPSBtZXNzYWdlID0+IHBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbk1lc3NhZ2U6IG1lc3NhZ2UgfSwgXCIqXCIpO1xufVxuXG5sZXQgcnBjSW5kZXggPSAwO1xubGV0IHBlbmRpbmcgPSB7fTtcblxuZnVuY3Rpb24gc2VuZEpzb24ocmVxKSB7XG4gIHRyeSB7XG4gICAgc2VuZFJhdyhyZXEpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VuZFJlc3VsdChpZCwgcmVzdWx0KSB7XG4gIHNlbmRKc29uKHtcbiAgICBqc29ucnBjOiBcIjIuMFwiLFxuICAgIGlkLFxuICAgIHJlc3VsdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2VuZEVycm9yKGlkLCBlcnJvcikge1xuICBjb25zdCBlcnJvck9iamVjdCA9IHtcbiAgICBjb2RlOiBlcnJvci5jb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgZGF0YTogZXJyb3IuZGF0YVxuICB9O1xuICBzZW5kSnNvbih7XG4gICAganNvbnJwYzogXCIyLjBcIixcbiAgICBpZCxcbiAgICBlcnJvcjogZXJyb3JPYmplY3RcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJhdyhkYXRhKSB7XG4gIHRyeSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGhhbmRsZVJwYyhkYXRhKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIGNvbnNvbGUuZXJyb3IoZGF0YSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlUnBjKGpzb24pIHtcbiAgaWYgKHR5cGVvZiBqc29uLmlkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYgKFxuICAgICAgdHlwZW9mIGpzb24ucmVzdWx0ICE9PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICBqc29uLmVycm9yIHx8XG4gICAgICB0eXBlb2YganNvbi5tZXRob2QgPT09IFwidW5kZWZpbmVkXCJcbiAgICApIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gcGVuZGluZ1tqc29uLmlkXTtcbiAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgc2VuZEVycm9yKFxuICAgICAgICAgIGpzb24uaWQsXG4gICAgICAgICAgbmV3IFJQQ0Vycm9yLkludmFsaWRSZXF1ZXN0KFwiTWlzc2luZyBjYWxsYmFjayBmb3IgXCIgKyBqc29uLmlkKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoY2FsbGJhY2sudGltZW91dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoY2FsbGJhY2sudGltZW91dCk7XG4gICAgICB9XG4gICAgICBkZWxldGUgcGVuZGluZ1tqc29uLmlkXTtcbiAgICAgIGNhbGxiYWNrKGpzb24uZXJyb3IsIGpzb24ucmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlUmVxdWVzdChqc29uKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlTm90aWZpY2F0aW9uKGpzb24pO1xuICB9XG59XG5cbmxldCBtZXRob2RzID0ge307XG5cbmZ1bmN0aW9uIG9uUmVxdWVzdChtZXRob2QsIHBhcmFtcykge1xuICBpZiAoIW1ldGhvZHNbbWV0aG9kXSkge1xuICAgIHRocm93IG5ldyBNZXRob2ROb3RGb3VuZChtZXRob2QpO1xuICB9XG4gIHJldHVybiBtZXRob2RzW21ldGhvZF0oLi4ucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTm90aWZpY2F0aW9uKGpzb24pIHtcbiAgaWYgKCFqc29uLm1ldGhvZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBvblJlcXVlc3QoanNvbi5tZXRob2QsIGpzb24ucGFyYW1zKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChqc29uKSB7XG4gIGlmICghanNvbi5tZXRob2QpIHtcbiAgICBzZW5kRXJyb3IoanNvbi5pZCwgbmV3IFJQQ0Vycm9yLkludmFsaWRSZXF1ZXN0KFwiTWlzc2luZyBtZXRob2RcIikpO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IG9uUmVxdWVzdChqc29uLm1ldGhvZCwganNvbi5wYXJhbXMpO1xuICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdC50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJlc3VsdFxuICAgICAgICAudGhlbihyZXMgPT4gc2VuZFJlc3VsdChqc29uLmlkLCByZXMpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHNlbmRFcnJvcihqc29uLmlkLCBlcnIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZFJlc3VsdChqc29uLmlkLCByZXN1bHQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgc2VuZEVycm9yKGpzb24uaWQsIGVycik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuc2V0dXAgPSBfbWV0aG9kcyA9PiB7XG4gIE9iamVjdC5hc3NpZ24obWV0aG9kcywgX21ldGhvZHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc2VuZE5vdGlmaWNhdGlvbiA9IChtZXRob2QsIHBhcmFtcykgPT4ge1xuICBzZW5kSnNvbih7IGpzb25ycGM6IFwiMi4wXCIsIG1ldGhvZCwgcGFyYW1zIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc2VuZFJlcXVlc3QgPSAobWV0aG9kLCBwYXJhbXMsIHRpbWVvdXQpID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBpZCA9IHJwY0luZGV4O1xuICAgIGNvbnN0IHJlcSA9IHsganNvbnJwYzogXCIyLjBcIiwgbWV0aG9kLCBwYXJhbXMsIGlkIH07XG4gICAgcnBjSW5kZXggKz0gMTtcbiAgICBjb25zdCBjYWxsYmFjayA9IChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zdCBqc0Vycm9yID0gbmV3IEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAganNFcnJvci5jb2RlID0gZXJyLmNvZGU7XG4gICAgICAgIGpzRXJyb3IuZGF0YSA9IGVyci5kYXRhO1xuICAgICAgICByZWplY3QoanNFcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICB9O1xuXG4gICAgLy8gc2V0IGEgZGVmYXVsdCB0aW1lb3V0XG4gICAgY2FsbGJhY2sudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGVsZXRlIHBlbmRpbmdbaWRdO1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlJlcXVlc3QgXCIgKyBtZXRob2QgKyBcIiB0aW1lZCBvdXQuXCIpKTtcbiAgICB9LCB0aW1lb3V0IHx8IDMwMDApO1xuXG4gICAgcGVuZGluZ1tpZF0gPSBjYWxsYmFjaztcbiAgICBzZW5kSnNvbihyZXEpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLlJQQ0Vycm9yID0gUlBDRXJyb3I7XG4iLCJjb25zdCBldmVudEhhbmRsZXJzID0ge307XHJcbmxldCBjdXJyZW50SWQgPSAwO1xyXG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xyXG4gICAgY29uc3QgaWQgPSBgJHtjdXJyZW50SWR9YDtcclxuICAgIGN1cnJlbnRJZCArPSAxO1xyXG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZGVsZXRlIGV2ZW50SGFuZGxlcnNbaWRdO1xyXG4gICAgfTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gb25jZShuYW1lLCBoYW5kbGVyKSB7XHJcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIG9uKG5hbWUsIGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKGRvbmUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb25lID0gdHJ1ZTtcclxuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xyXG4gICAgPyBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xyXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKFtuYW1lLCAuLi5hcmdzXSk7XHJcbiAgICB9XHJcbiAgICA6IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcclxuICAgICAgICB9LCAnKicpO1xyXG4gICAgfTtcclxuZnVuY3Rpb24gaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpIHtcclxuICAgIGZvciAoY29uc3QgaWQgaW4gZXZlbnRIYW5kbGVycykge1xyXG4gICAgICAgIGlmIChldmVudEhhbmRsZXJzW2lkXS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgIGV2ZW50SGFuZGxlcnNbaWRdLmhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKC4uLnBhcmFtcykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoKF9hID0gcGFyYW1zWzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuanNvbnJwYykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IFtuYW1lLCAuLi5hcmdzXSA9IHBhcmFtc1swXTtcclxuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XHJcbiAgICB9O1xyXG59XHJcbmVsc2Uge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gVE9ETzogdmVyeSBkaXJ0eSBoYWNrLCBuZWVkcyBmaXhpbmdcclxuICAgICAgICBjb25zdCBmYWxsYmFjayA9IHdpbmRvdy5vbm1lc3NhZ2U7XHJcbiAgICAgICAgd2luZG93Lm9ubWVzc2FnZSA9IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcclxuICAgICAgICAgICAgZmFsbGJhY2suYXBwbHkod2luZG93LCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IHBhcmFtc1swXTtcclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XHJcbiAgICAgICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgfSwgMTAwKTtcclxufVxyXG4iLCJpbXBvcnQgeyBmaW5kUGFyZW50LCBmaW5kTGVhZk5vZGVzLCBnZXRUYWdzIH0gZnJvbSAnLi91dGlsJztcclxuZnVuY3Rpb24gZm9ybWF0Tm9kZShub2RlLCBwYXJhbWV0ZXJzKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHgsIHksIHdpZHRoID0gNDAsIGhlaWdodCA9IDQwIH0gPSBwYXJhbWV0ZXJzO1xyXG4gICAgbm9kZS5uYW1lID0gbmFtZTtcclxuICAgIG5vZGUueCA9IHg7XHJcbiAgICBub2RlLnkgPSB5O1xyXG4gICAgbm9kZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XHJcbn1cclxuZnVuY3Rpb24gZmlsbFNlcnZpY2VOb2Rlcyhub2RlKSB7XHJcbiAgICBub2RlLmZpbGxzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcclxuICAgICAgICAgICAgY29sb3I6IHtcclxuICAgICAgICAgICAgICAgIHI6IDAuNzY4NjI3NDY0NzcxMjcwOCxcclxuICAgICAgICAgICAgICAgIGc6IDAuNzY4NjI3NDY0NzcxMjcwOCxcclxuICAgICAgICAgICAgICAgIGI6IDAuNzY4NjI3NDY0NzcxMjcwOCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgXTtcclxufVxyXG5mdW5jdGlvbiByZXNjYWxlSW1hZ2VOb2RlKG5vZGUsIHJlc2l6ZVBhcmFtcykge1xyXG4gICAgY29uc3QgeyBtYXhXaWR0aCwgbWF4SGVpZ2h0IH0gPSByZXNpemVQYXJhbXM7XHJcbiAgICBjb25zdCBpc0NvcnJlY3RTaXplID0gbm9kZS53aWR0aCA8PSBtYXhXaWR0aCAmJiBub2RlLmhlaWdodCA8PSBtYXhIZWlnaHQ7XHJcbiAgICBjb25zdCBpc0NvcnJlY3RUeXBlID0gbm9kZS50eXBlID09PSAnRlJBTUUnIHx8IG5vZGUudHlwZSA9PT0gJ1JFQ1RBTkdMRScgfHwgbm9kZS50eXBlID09PSAnVkVDVE9SJztcclxuICAgIGlmIChpc0NvcnJlY3RUeXBlICYmICFpc0NvcnJlY3RTaXplKSB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBNYXRoLm1pbihtYXhXaWR0aCAvIG5vZGUud2lkdGgsIG1heEhlaWdodCAvIG5vZGUuaGVpZ2h0KTtcclxuICAgICAgICBub2RlLnJlc2NhbGUoc2NhbGVGYWN0b3IpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUmVzdWx0Tm9kZShub2RlKSB7XHJcbiAgICBjb25zdCByZXN1bHRSZWN0YW5nbGUgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcclxuICAgIGZpbGxTZXJ2aWNlTm9kZXMocmVzdWx0UmVjdGFuZ2xlKTtcclxuICAgIGNvbnN0IHRlbXBsYXRlR3JvdXAgPSBmaWdtYS5ncm91cChbcmVzdWx0UmVjdGFuZ2xlXSwgbm9kZSk7XHJcbiAgICB0ZW1wbGF0ZUdyb3VwLm5hbWUgPSAndGVtcGxhdGUnO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gZmlnbWEuZ3JvdXAoW3RlbXBsYXRlR3JvdXBdLCBub2RlKTtcclxuICAgIGZvcm1hdE5vZGUocmVzdWx0LCB7XHJcbiAgICAgICAgbmFtZTogJ3N0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0JyxcclxuICAgICAgICB4OiAxMCxcclxuICAgICAgICB5OiA2MCxcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMZXNzb24oKSB7XHJcbiAgICBjb25zdCBub2RlID0gZmlnbWEuY3VycmVudFBhZ2U7XHJcbiAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggIT09IDEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBvcmlnaW5hbEltYWdlID0gbm9kZS5jaGlsZHJlblswXTtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICBmb3JtYXROb2RlKGxlc3Nvbiwge1xyXG4gICAgICAgIG5hbWU6ICdsZXNzb24nLFxyXG4gICAgICAgIHg6IC00NjEsXHJcbiAgICAgICAgeTogLTUxMixcclxuICAgICAgICB3aWR0aDogMTM2NixcclxuICAgICAgICBoZWlnaHQ6IDEwMjQsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHRodW1ibmFpbCA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XHJcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbCwge1xyXG4gICAgICAgIG5hbWU6ICd0aHVtYm5haWwnLFxyXG4gICAgICAgIHg6IC05MDEsXHJcbiAgICAgICAgeTogLTUxMixcclxuICAgICAgICB3aWR0aDogNDAwLFxyXG4gICAgICAgIGhlaWdodDogNDAwLFxyXG4gICAgfSk7XHJcbiAgICAvLyBDcmVhdGUgc3RlcFxyXG4gICAgY29uc3Qgc3RlcCA9IG9yaWdpbmFsSW1hZ2UuY2xvbmUoKTtcclxuICAgIHN0ZXAubmFtZSA9ICdpbWFnZSc7XHJcbiAgICBjb25zdCByZXNpemVkSW1hZ2UgPSByZXNjYWxlSW1hZ2VOb2RlKG9yaWdpbmFsSW1hZ2UsIHtcclxuICAgICAgICBtYXhXaWR0aDogbGVzc29uLndpZHRoIC0gODMgKiAyLFxyXG4gICAgICAgIG1heEhlaWdodDogbGVzc29uLmhlaWdodCAtIDEyICogMixcclxuICAgIH0pO1xyXG4gICAgY29uc3Qgc3RlcElucHV0ID0gZmlnbWEuZ3JvdXAoW3N0ZXBdLCBsZXNzb24pO1xyXG4gICAgc3RlcElucHV0Lm5hbWUgPSAnaW5wdXQnO1xyXG4gICAgY29uc3QgZmlyc3RTdGVwID0gZmlnbWEuZ3JvdXAoW3N0ZXBJbnB1dF0sIGxlc3Nvbik7XHJcbiAgICBmb3JtYXROb2RlKGZpcnN0U3RlcCwge1xyXG4gICAgICAgIG5hbWU6ICdzdGVwIHMtbXVsdGlzdGVwLWJydXNoJyxcclxuICAgICAgICB4OiAobGVzc29uLndpZHRoIC0gcmVzaXplZEltYWdlLndpZHRoKSAvIDIsXHJcbiAgICAgICAgeTogKGxlc3Nvbi5oZWlnaHQgLSByZXNpemVkSW1hZ2UuaGVpZ2h0KSAvIDIsXHJcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRJbWFnZS53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHJlc2l6ZWRJbWFnZS5oZWlnaHQsXHJcbiAgICB9KTtcclxuICAgIC8vIENyZWF0ZSB0aHVtYm5haWxcclxuICAgIGNvbnN0IHRodW1ibmFpbEltYWdlID0gb3JpZ2luYWxJbWFnZS5jbG9uZSgpO1xyXG4gICAgdGh1bWJuYWlsSW1hZ2UubmFtZSA9ICdpbWFnZSc7XHJcbiAgICBjb25zdCByZXNpemVkVGh1bWJuYWlsID0gcmVzY2FsZUltYWdlTm9kZSh0aHVtYm5haWxJbWFnZSwge1xyXG4gICAgICAgIG1heFdpZHRoOiB0aHVtYm5haWwud2lkdGggLSAzNSAqIDIsXHJcbiAgICAgICAgbWF4SGVpZ2h0OiB0aHVtYm5haWwuaGVpZ2h0IC0gMzUgKiAyLFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCB0aHVtYm5haWxHcm91cCA9IGZpZ21hLmdyb3VwKFt0aHVtYm5haWxJbWFnZV0sIHRodW1ibmFpbCk7XHJcbiAgICBmb3JtYXROb2RlKHRodW1ibmFpbEdyb3VwLCB7XHJcbiAgICAgICAgbmFtZTogJ3RodW1ibmFpbCBncm91cCcsXHJcbiAgICAgICAgeDogKHRodW1ibmFpbC53aWR0aCAtIHJlc2l6ZWRUaHVtYm5haWwud2lkdGgpIC8gMixcclxuICAgICAgICB5OiAodGh1bWJuYWlsLmhlaWdodCAtIHJlc2l6ZWRUaHVtYm5haWwuaGVpZ2h0KSAvIDIsXHJcbiAgICAgICAgd2lkdGg6IHJlc2l6ZWRUaHVtYm5haWwud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiByZXNpemVkVGh1bWJuYWlsLmhlaWdodCxcclxuICAgIH0pO1xyXG4gICAgLy8gQ3JlYXRlIHJlc3VsdFxyXG4gICAgY3JlYXRlUmVzdWx0Tm9kZShsZXNzb24pO1xyXG4gICAgLy8gQ3JlYXRlIHNldHRpbmdzXHJcbiAgICBjb25zdCBzZXR0aW5nc0VsbGlwc2UgPSBmaWdtYS5jcmVhdGVFbGxpcHNlKCk7XHJcbiAgICBmaWxsU2VydmljZU5vZGVzKHNldHRpbmdzRWxsaXBzZSk7XHJcbiAgICBmb3JtYXROb2RlKHNldHRpbmdzRWxsaXBzZSwge1xyXG4gICAgICAgIG5hbWU6ICdzZXR0aW5ncyBjYXB0dXJlLWNvbG9yIHpvb20tc2NhbGUtMiBvcmRlci1sYXllcnMnLFxyXG4gICAgICAgIHg6IDEwLFxyXG4gICAgICAgIHk6IDEwLFxyXG4gICAgfSk7XHJcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQoc2V0dGluZ3NFbGxpcHNlKTtcclxuICAgIG9yaWdpbmFsSW1hZ2UucmVtb3ZlKCk7XHJcbn1cclxuZnVuY3Rpb24gc3RyaW5naWZ5Q29sb3IoY29sb3IpIHtcclxuICAgIGxldCB7IHIsIGcsIGIgfSA9IGNvbG9yO1xyXG4gICAgciA9IE1hdGgucm91bmQociAqIDI1NSk7XHJcbiAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcclxuICAgIGIgPSBNYXRoLnJvdW5kKGIgKiAyNTUpO1xyXG4gICAgcmV0dXJuIGByZ2IoJHtyfSwgJHtnfSwgJHtifSlgO1xyXG59XHJcbmZ1bmN0aW9uIG5hbWVMZWFmTm9kZXMobm9kZXMpIHtcclxuICAgIGxldCBhbGxTdHJva2VzID0gIW5vZGVzLmZpbmQoKG5vZGUpID0+ICdmaWxscycgaW4gbm9kZSAmJiBub2RlLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBub2RlLmZpbGxzLmxlbmd0aCA+IDApO1xyXG4gICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICAgIG5vZGUubmFtZSA9XHJcbiAgICAgICAgICAgICdyZ2ItdGVtcGxhdGUgJyArIChhbGxTdHJva2VzICYmIG5vZGVzLmxlbmd0aCA+IDMgPyAnZHJhdy1saW5lJyA6ICdibGluaycpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5hbWVTdGVwTm9kZShzdGVwKSB7XHJcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHN0ZXApO1xyXG4gICAgbGV0IGZpbGxzID0gbGVhdmVzLmZpbHRlcigobikgPT4gJ2ZpbGxzJyBpbiBuICYmIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG4uZmlsbHMubGVuZ3RoID4gMCk7XHJcbiAgICBsZXQgc3Ryb2tlcyA9IGxlYXZlcy5maWx0ZXIoKG4pID0+ICdzdHJva2VzJyBpbiBuICYmIG4uc3Ryb2tlcy5sZW5ndGggPiAwKTtcclxuICAgIGxldCBtdWx0aXN0ZXBUeXBlID0gZmlsbHMubGVuZ3RoID4gMCA/ICdiZycgOiAnYnJ1c2gnO1xyXG4gICAgbGV0IHN0cm9rZVdlaWdodHNBcnIgPSBzdHJva2VzLm1hcCgobm9kZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBub2RlWydzdHJva2VXZWlnaHQnXSB8fCAwO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgbWF4V2VpZ2h0ID0gTWF0aC5tYXgoLi4uc3Ryb2tlV2VpZ2h0c0Fycik7XHJcbiAgICBsZXQgd2VpZ2h0ID0gc3Ryb2tlcy5sZW5ndGggPiAwID8gbWF4V2VpZ2h0IDogMjU7XHJcbiAgICBzdGVwLm5hbWUgPSBgc3RlcCBzLW11bHRpc3RlcC0ke211bHRpc3RlcFR5cGV9IGJzLSR7d2VpZ2h0fWA7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlU3RlcE5vZGUobm9kZSwgbm9kZXNBcnJheSwgaW5kZXgpIHtcclxuICAgIGlmICghbm9kZXNBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBuYW1lTGVhZk5vZGVzKG5vZGVzQXJyYXkpO1xyXG4gICAgY29uc3QgaW5wdXQgPSBmaWdtYS5ncm91cChub2Rlc0FycmF5LCBub2RlKTtcclxuICAgIGlucHV0Lm5hbWUgPSAnaW5wdXQnO1xyXG4gICAgY29uc3Qgc3RlcCA9IGZpZ21hLmdyb3VwKFtpbnB1dF0sIG5vZGUsIGluZGV4KTtcclxuICAgIG5hbWVTdGVwTm9kZShzdGVwKTtcclxufVxyXG5mdW5jdGlvbiBpc1Jlc3VsdFN0ZXAobm9kZSkge1xyXG4gICAgcmV0dXJuIG5vZGUgJiYgZ2V0VGFncyhub2RlKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0Jyk7XHJcbn1cclxuZnVuY3Rpb24gZmluZFBhcmVudEJ5VGFnKG5vZGUsIHRhZykge1xyXG4gICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZSwgKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXModGFnKSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0Tm9kZUluZGV4KG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlLnBhcmVudC5jaGlsZHJlbi5maW5kSW5kZXgoKG4pID0+IG4uaWQgPT09IG5vZGUuaWQpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzZXBhcmF0ZVN0ZXAoKSB7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XHJcbiAgICBjb25zdCBsZWF2ZXMgPSBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiAhKCdjaGlsZHJlbicgaW4gbm9kZSkpO1xyXG4gICAgaWYgKCFsZWF2ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZmlyc3RQYXJlbnRTdGVwID0gZmluZFBhcmVudEJ5VGFnKHNlbGVjdGlvblswXSwgJ3N0ZXAnKTtcclxuICAgIGlmIChpc1Jlc3VsdFN0ZXAoZmlyc3RQYXJlbnRTdGVwKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGxlc3NvbiA9IGZpcnN0UGFyZW50U3RlcC5wYXJlbnQ7XHJcbiAgICBjb25zdCBpbmRleCA9IGdldE5vZGVJbmRleChmaXJzdFBhcmVudFN0ZXApO1xyXG4gICAgY3JlYXRlU3RlcE5vZGUobGVzc29uLCBsZWF2ZXMsIGluZGV4KTtcclxufVxyXG5mdW5jdGlvbiBhZGRUb01hcChtYXAsIGtleSwgbm9kZSkge1xyXG4gICAgaWYgKCFtYXAuaGFzKGtleSkpIHtcclxuICAgICAgICBtYXAuc2V0KGtleSwgW10pO1xyXG4gICAgfVxyXG4gICAgbWFwLmdldChrZXkpLnB1c2gobm9kZSk7XHJcbn1cclxuZnVuY3Rpb24gcmVwbGFjZUNvbG9yKG5vZGVzQnlDb2xvciwgb2xkQ29sb3IsIG5ld0NvbG9yKSB7XHJcbiAgICBjb25zdCBvbGRDb2xvcktleSA9IHN0cmluZ2lmeUNvbG9yKG9sZENvbG9yKTtcclxuICAgIGNvbnN0IG5ld0NvbG9yS2V5ID0gc3RyaW5naWZ5Q29sb3IobmV3Q29sb3IpO1xyXG4gICAgaWYgKG5vZGVzQnlDb2xvci5oYXMob2xkQ29sb3JLZXkpKSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZENvbG9ycyA9IG5vZGVzQnlDb2xvci5nZXQob2xkQ29sb3JLZXkpLm1hcCgobikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoJ2ZpbGxzJyBpbiBuICYmIG4uZmlsbHMgIT09IGZpZ21hLm1peGVkICYmIG4uZmlsbHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbi5maWxscyA9IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdTT0xJRCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBuZXdDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgnc3Ryb2tlcycgaW4gbiAmJiBuLnN0cm9rZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbi5zdHJva2VzID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1NPTElEJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IG5ld0NvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5vZGVzQnlDb2xvci5zZXQobmV3Q29sb3JLZXksIHVwZGF0ZWRDb2xvcnMpO1xyXG4gICAgICAgIG5vZGVzQnlDb2xvci5kZWxldGUob2xkQ29sb3JLZXkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IGJsYWNrID0geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbmNvbnN0IG5lYXJCbGFjayA9IHsgcjogMjMgLyAyNTUsIGc6IDIzIC8gMjU1LCBiOiAyMyAvIDI1NSB9O1xyXG5jb25zdCB3aGl0ZSA9IHsgcjogMjU1IC8gMjU1LCBnOiAyNTUgLyAyNTUsIGI6IDI1NSAvIDI1NSB9O1xyXG5jb25zdCBuZWFyV2hpdGUgPSB7IHI6IDIzNSAvIDI1NSwgZzogMjM1IC8gMjU1LCBiOiAyMzUgLyAyNTUgfTtcclxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QnlDb2xvcigpIHtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcclxuICAgIGlmICghc2VsZWN0aW9uLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHBhcmVudFN0ZXAgPSBmaW5kUGFyZW50QnlUYWcoc2VsZWN0aW9uWzBdLCAnc3RlcCcpO1xyXG4gICAgY29uc3QgbGVzc29uID0gcGFyZW50U3RlcC5wYXJlbnQ7XHJcbiAgICBjb25zdCBsZWF2ZXMgPSBmaW5kTGVhZk5vZGVzKHBhcmVudFN0ZXApO1xyXG4gICAgaWYgKCFwYXJlbnRTdGVwIHx8IGlzUmVzdWx0U3RlcChwYXJlbnRTdGVwKSB8fCBsZWF2ZXMubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgZmlsbHNCeUNvbG9yID0gbmV3IE1hcCgpO1xyXG4gICAgbGV0IHN0cm9rZXNCeUNvbG9yID0gbmV3IE1hcCgpO1xyXG4gICAgbGV0IHVua25vd25Ob2RlcyA9IFtdO1xyXG4gICAgZmluZExlYWZOb2RlcyhwYXJlbnRTdGVwKS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgaWYgKCdmaWxscycgaW4gbiAmJlxyXG4gICAgICAgICAgICBuLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJlxyXG4gICAgICAgICAgICBuLmZpbGxzLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgICAgbi5maWxsc1swXS50eXBlID09PSAnU09MSUQnKSB7XHJcbiAgICAgICAgICAgIGFkZFRvTWFwKGZpbGxzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5maWxsc1swXS5jb2xvciksIG4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgnc3Ryb2tlcycgaW4gbiAmJlxyXG4gICAgICAgICAgICBuLnN0cm9rZXMubGVuZ3RoID4gMCAmJlxyXG4gICAgICAgICAgICBuLnN0cm9rZXNbMF0udHlwZSA9PT0gJ1NPTElEJykge1xyXG4gICAgICAgICAgICBhZGRUb01hcChzdHJva2VzQnlDb2xvciwgc3RyaW5naWZ5Q29sb3Iobi5zdHJva2VzWzBdLmNvbG9yKSwgbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB1bmtub3duTm9kZXMucHVzaChuKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIG1ha2Ugc3VyZSBjb2xvciBpcyBub3QgYmxhY2sgb3Igd2hpdGVcclxuICAgIHJlcGxhY2VDb2xvcihmaWxsc0J5Q29sb3IsIGJsYWNrLCBuZWFyQmxhY2spO1xyXG4gICAgcmVwbGFjZUNvbG9yKHN0cm9rZXNCeUNvbG9yLCBibGFjaywgbmVhckJsYWNrKTtcclxuICAgIHJlcGxhY2VDb2xvcihmaWxsc0J5Q29sb3IsIHdoaXRlLCBuZWFyV2hpdGUpO1xyXG4gICAgcmVwbGFjZUNvbG9yKHN0cm9rZXNCeUNvbG9yLCB3aGl0ZSwgbmVhcldoaXRlKTtcclxuICAgIGZvciAobGV0IGZpbGxzIG9mIGZpbGxzQnlDb2xvci52YWx1ZXMoKSkge1xyXG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3NvbiwgZmlsbHMpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgc3Ryb2tlcyBvZiBzdHJva2VzQnlDb2xvci52YWx1ZXMoKSkge1xyXG4gICAgICAgIGNyZWF0ZVN0ZXBOb2RlKGxlc3Nvbiwgc3Ryb2tlcyk7XHJcbiAgICB9XHJcbiAgICBpZiAodW5rbm93bk5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjcmVhdGVTdGVwTm9kZShsZXNzb24sIHVua25vd25Ob2Rlcyk7XHJcbiAgICB9XHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIHJlc3VsdCBpcyBsb2NhdGVkIGF0IHRoZSBlbmRcclxuICAgIGNvbnN0IHJlc3VsdCA9IGxlc3Nvbi5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUgPT09ICdzdGVwIHMtbXVsdGlzdGVwLXJlc3VsdCcpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIHJlc3VsdC5yZW1vdmUoKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZVJlc3VsdE5vZGUobGVzc29uKTtcclxuICAgIC8vIFJlbW92ZSBvcmlnaW5hbCBub2RlIGlmIHRoZXJlIGFyZSByZW1haW5zXHJcbiAgICBpZiAoIXBhcmVudFN0ZXAucmVtb3ZlZCkge1xyXG4gICAgICAgIHBhcmVudFN0ZXAucmVtb3ZlKCk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydFRleHRzKCkge1xyXG4gICAgY29uc3QgdGV4dHMgPSBmaWdtYS5jdXJyZW50UGFnZVxyXG4gICAgICAgIC5maW5kQWxsKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJylcclxuICAgICAgICAuZmlsdGVyKChub2RlKSA9PiBub2RlLnZpc2libGUpO1xyXG4gICAgcmV0dXJuICh0ZXh0c1xyXG4gICAgICAgIC5tYXAoKG5vZGUpID0+IHtcclxuICAgICAgICBjb25zdCB0biA9IG5vZGU7XHJcbiAgICAgICAgcmV0dXJuIHRuXHJcbiAgICAgICAgICAgIC5nZXRTdHlsZWRUZXh0U2VnbWVudHMoW1xyXG4gICAgICAgICAgICAnZm9udFNpemUnLFxyXG4gICAgICAgICAgICAnZm9udE5hbWUnLFxyXG4gICAgICAgICAgICAnZm9udFdlaWdodCcsXHJcbiAgICAgICAgICAgICd0ZXh0RGVjb3JhdGlvbicsXHJcbiAgICAgICAgICAgICd0ZXh0Q2FzZScsXHJcbiAgICAgICAgICAgICdsaW5lSGVpZ2h0JyxcclxuICAgICAgICAgICAgJ2xldHRlclNwYWNpbmcnLFxyXG4gICAgICAgICAgICAnZmlsbHMnLFxyXG4gICAgICAgICAgICAndGV4dFN0eWxlSWQnLFxyXG4gICAgICAgICAgICAnZmlsbFN0eWxlSWQnLFxyXG4gICAgICAgICAgICAnbGlzdE9wdGlvbnMnLFxyXG4gICAgICAgICAgICAnaW5kZW50YXRpb24nLFxyXG4gICAgICAgICAgICAnaHlwZXJsaW5rJyxcclxuICAgICAgICBdKVxyXG4gICAgICAgICAgICAubWFwKChzKSA9PiBzLmNoYXJhY3RlcnMpXHJcbiAgICAgICAgICAgIC5qb2luKCdcXFxcJylcclxuICAgICAgICAgICAgLnRyaW1FbmQoKTtcclxuICAgIH0pXHJcbiAgICAgICAgLy8gcmVtb3ZlIGFycmF5IGR1cGxpY2F0ZXNcclxuICAgICAgICAuZmlsdGVyKCh2LCBpLCBhKSA9PiBhLmluZGV4T2YodikgPT09IGkpKTtcclxufVxyXG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IGFkZFRhZywgZmluZEFsbCwgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XHJcbmZ1bmN0aW9uIGZvcm1hdE9yZGVyKGxlc3Nvbikge1xyXG4gICAgaWYgKGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+ICEhZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXm8tLy50ZXN0KHQpKSkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRm91bmQgby10YWcuIGZvcm1hdE9yZGVyIGFib3J0LicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBzZXR0aW5ncyA9IGxlc3Nvbi5maW5kQ2hpbGQoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3NldHRpbmdzJykpO1xyXG4gICAgYWRkVGFnKHNldHRpbmdzLCAnb3JkZXItbGF5ZXJzJyk7XHJcbiAgICBjb25zdCBsYXllclJlZ2V4ID0gL14ocy1tdWx0aXN0ZXAtYnJ1c2gtfHMtbXVsdGlzdGVwLWJnLSkoXFxkKykkLztcclxuICAgIGNvbnN0IHN0ZXBzID0gbGVzc29uLmZpbmRDaGlsZHJlbigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpICYmICFnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBsZXNzb24uZmluZENoaWxkKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzLW11bHRpc3RlcC1yZXN1bHQnKSk7XHJcbiAgICBhZGRUYWcocmVzdWx0LCBgby0ke3N0ZXBzLmxlbmd0aCArIDF9YCk7XHJcbiAgICBzdGVwcy5yZXZlcnNlKCkuZm9yRWFjaCgoc3RlcCwgb3JkZXIpID0+IHtcclxuICAgICAgICBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCk7XHJcbiAgICAgICAgY29uc3QgbGF5ZXJUYWcgPSB0YWdzLmZpbmQoKHQpID0+IGxheWVyUmVnZXgudGVzdCh0KSk7XHJcbiAgICAgICAgbGV0IGxheWVyID0gNDtcclxuICAgICAgICBpZiAobGF5ZXJUYWcpIHtcclxuICAgICAgICAgICAgbGF5ZXIgPSBwYXJzZUludChsYXllclJlZ2V4LmV4ZWMobGF5ZXJUYWcpWzJdKTtcclxuICAgICAgICAgICAgdGFncyA9IHRhZ3MuZmlsdGVyKCh0KSA9PiAhbGF5ZXJSZWdleC50ZXN0KHQpKTtcclxuICAgICAgICAgICAgdGFncy5zcGxpY2UoMSwgMCwgL14ocy1tdWx0aXN0ZXAtYnJ1c2h8cy1tdWx0aXN0ZXAtYmcpLy5leGVjKGxheWVyVGFnKVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0ZXAuc2V0UGx1Z2luRGF0YSgnbGF5ZXInLCBKU09OLnN0cmluZ2lmeShsYXllcikpO1xyXG4gICAgICAgIHRhZ3MucHVzaChgby0ke29yZGVyICsgMX1gKTtcclxuICAgICAgICBzdGVwLm5hbWUgPSB0YWdzLmpvaW4oJyAnKTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHNvcnRlZFN0ZXBzID0gc3RlcHMuc29ydCgoYSwgYikgPT4gSlNPTi5wYXJzZShiLmdldFBsdWdpbkRhdGEoJ2xheWVyJykpIC1cclxuICAgICAgICBKU09OLnBhcnNlKGEuZ2V0UGx1Z2luRGF0YSgnbGF5ZXInKSkpO1xyXG4gICAgc29ydGVkU3RlcHMuZm9yRWFjaCgocykgPT4gbGVzc29uLmluc2VydENoaWxkKDEsIHMpKTtcclxufVxyXG5mdW5jdGlvbiBhdXRvRm9ybWF0KCkge1xyXG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSAnVEhVTUJOQUlMUycpO1xyXG4gICAgaWYgKHRodW1iUGFnZSkge1xyXG4gICAgICAgIGZpZ21hLnJvb3QuY2hpbGRyZW4uZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHRodW1iUGFnZS5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09ICd0aHVtYm5haWwnKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGNsb25lLnJlc2l6ZSg0MDAsIDQwMCk7XHJcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSAndGh1bWJuYWlsJztcclxuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICBjb25zdCBvbGRMZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IHAubmFtZSk7XHJcbiAgICAgICAgaWYgKG9sZExlc3NvbkZyYW1lKSB7XHJcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSAnbGVzc29uJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAndGh1bWJuYWlsJyk7XHJcbiAgICAgICAgY29uc3QgbGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSAnbGVzc29uJyk7XHJcbiAgICAgICAgaWYgKCF0aHVtYm5haWxGcmFtZSB8fCAhbGVzc29uRnJhbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHVtYm5haWxGcmFtZS54ID0gbGVzc29uRnJhbWUueCAtIDQ0MDtcclxuICAgICAgICB0aHVtYm5haWxGcmFtZS55ID0gbGVzc29uRnJhbWUueTtcclxuICAgIH0pO1xyXG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zZXR0aW5ncy8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcclxuICAgICAgICBuLnggPSAxMDtcclxuICAgICAgICBuLnkgPSAxMDtcclxuICAgIH0pO1xyXG4gICAgZmluZEFsbChmaWdtYS5yb290LCAobm9kZSkgPT4gL15zdGVwIHMtbXVsdGlzdGVwLXJlc3VsdC8udGVzdChub2RlLm5hbWUpKS5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgbi5jaGlsZHJlblswXS5uYW1lID0gJ3RlbXBsYXRlJztcclxuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSAnL2lnbm9yZSc7XHJcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcclxuICAgICAgICBuLnggPSAxMDtcclxuICAgICAgICBuLnkgPSA2MDtcclxuICAgIH0pO1xyXG59XHJcbm9uKCdhdXRvRm9ybWF0JywgYXV0b0Zvcm1hdCk7XHJcbm9uKCdmb3JtYXRPcmRlcicsICgpID0+IGZvcm1hdE9yZGVyKGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRDaGlsZCgodCkgPT4gdC5uYW1lID09ICdsZXNzb24nKSkpO1xyXG4iLCJpbXBvcnQgJy4vY3JlYXRlJztcclxuaW1wb3J0ICcuL3R1bmUnO1xyXG5pbXBvcnQgJy4vZm9ybWF0JztcclxuaW1wb3J0ICcuL2xpbnRlcic7XHJcbmltcG9ydCAnLi9wdWJsaXNoJztcclxuaW1wb3J0ICcuLi9ycGMtYXBpJztcclxuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcclxuZmlnbWEudWkucmVzaXplKDM0MCwgNDUwKTtcclxuY29uc29sZS5jbGVhcigpO1xyXG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XHJcbmltcG9ydCB7IHByaW50LCBnZXRUYWdzLCBmaW5kQWxsIH0gZnJvbSAnLi91dGlsJztcclxubGV0IGVycm9ycyA9IFtdO1xyXG5sZXQgem9vbVNjYWxlID0gMTtcclxubGV0IG1heEJzID0gMTIuODtcclxubGV0IG9yZGVyID0gJ3N0ZXBzJztcclxudmFyIEVycm9yTGV2ZWw7XHJcbihmdW5jdGlvbiAoRXJyb3JMZXZlbCkge1xyXG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiRVJST1JcIl0gPSAwXSA9IFwiRVJST1JcIjtcclxuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xyXG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiSU5GT1wiXSA9IDJdID0gXCJJTkZPXCI7XHJcbn0pKEVycm9yTGV2ZWwgfHwgKEVycm9yTGV2ZWwgPSB7fSkpO1xyXG5mdW5jdGlvbiBzZWxlY3RFcnJvcihpbmRleCkge1xyXG4gICAgdmFyIF9hLCBfYjtcclxuICAgIGlmICgoX2EgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFnZSkge1xyXG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzW2luZGV4XS5wYWdlO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0VGltZW91dCgoKSA9PiB7IC8vIGNyYXNoZXMsIHByb2JhYmx5IGJlY2F1c2Ugb2Ygc2VsZWN0aW9uIGhhcHBlbmluZyBmcm9tIHRoZSBEaXNwbGF5Rm9ybVxyXG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XHJcbiAgICAgICAgZXJyb3JzW2luZGV4XS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbaW5kZXhdLm5vZGVdO1xyXG4gICAgfVxyXG4gICAgLy8gfSwgMClcclxufVxyXG5mdW5jdGlvbiBwcmludEVycm9ycygpIHtcclxuICAgIGVycm9ycy5zb3J0KChhLCBiKSA9PiBhLmxldmVsIC0gYi5sZXZlbCk7XHJcbiAgICBzZWxlY3RFcnJvcigwKTtcclxuICAgIGxldCB0ZXh0ID0gZXJyb3JzXHJcbiAgICAgICAgLm1hcCgoZSkgPT4ge1xyXG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xyXG4gICAgICAgIHJldHVybiBgJHtFcnJvckxldmVsW2UubGV2ZWxdfVxcdHwgJHtlLmVycm9yfSB8IFBBR0U6JHsoKF9hID0gZS5wYWdlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubmFtZSkgfHwgJyd9ICR7KF9iID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudHlwZX06JHsoKF9jID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MubmFtZSkgfHwgJyd9YDtcclxuICAgIH0pXHJcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xyXG4gICAgdGV4dCArPSAnXFxuRG9uZSc7XHJcbiAgICBwcmludCh0ZXh0KTtcclxufVxyXG5mdW5jdGlvbiBhc3NlcnQodmFsLCBlcnJvciwgcGFnZSwgbm9kZSwgbGV2ZWwgPSBFcnJvckxldmVsLkVSUk9SKSB7XHJcbiAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbDtcclxufVxyXG5mdW5jdGlvbiBkZWVwTm9kZXMobm9kZSkge1xyXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcclxuICAgIH1cclxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlZXBOb2RlcyhuKSk7XHJcbn1cclxuZnVuY3Rpb24gZGVzY2VuZGFudHMobm9kZSkge1xyXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcclxuICAgIH1cclxuICAgIHJldHVybiBbbm9kZSwgLi4ubm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZXNjZW5kYW50cyhuKSldO1xyXG59XHJcbmZ1bmN0aW9uIGRlc2NlbmRhbnRzV2l0aG91dFNlbGYobm9kZSkge1xyXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVzY2VuZGFudHMobikpO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRWZWN0b3IocGFnZSwgbm9kZSkge1xyXG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcclxuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsICdOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS4nLCBwYWdlLCBub2RlKTtcclxuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0KC9eXFwvfF5kcmF3LWxpbmUkfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbGlwJHxeVmVjdG9yJHxeXFxkKyR8XkVsbGlwc2UkfF5SZWN0YW5nbGUkLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bi4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XHJcbiAgICB9KTtcclxuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XHJcbiAgICBsZXQgc3Ryb2tlcyA9IG5vZGUuc3Ryb2tlcztcclxuICAgIGFzc2VydCghZmlsbHMubGVuZ3RoIHx8ICFzdHJva2VzLmxlbmd0aCwgJ1Nob3VsZCBub3QgaGF2ZSBmaWxsK3N0cm9rZScsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICBzdHJva2VzLmZvckVhY2goKHMpID0+IHtcclxuICAgICAgICBhc3NlcnQocy52aXNpYmxlLCAnU3Ryb2tlIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGFzc2VydChzLnR5cGUgPT0gJ1NPTElEJywgJ1N0cm9rZSBtdXN0IGJlIHNvbGlkJywgcGFnZSwgbm9kZSk7XHJcbiAgICAgICAgbGV0IHMxID0gcztcclxuICAgICAgICBhc3NlcnQoczEuY29sb3IuciAhPSAwIHx8IHMxLmNvbG9yLmcgIT0gMCB8fCBzMS5jb2xvci5iICE9IDAsICdTdHJva2UgY29sb3IgbXVzdCBub3QgYmUgYmxhY2snLCBwYWdlLCBub2RlKTtcclxuICAgICAgICBhc3NlcnQoczEuY29sb3IuciAhPSAxIHx8IHMxLmNvbG9yLmcgIT0gMSB8fCBzMS5jb2xvci5iICE9IDEsICdTdHJva2UgY29sb3IgbXVzdCBub3QgYmUgd2hpdGUnLCBwYWdlLCBub2RlKTtcclxuICAgIH0pO1xyXG4gICAgZmlsbHMuZm9yRWFjaCgoZikgPT4ge1xyXG4gICAgICAgIGFzc2VydChmLnZpc2libGUsICdGaWxsIG11c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGFzc2VydChmLnR5cGUgPT0gJ1NPTElEJywgJ0ZpbGwgbXVzdCBiZSBzb2xpZCcsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGxldCBmMSA9IGY7XHJcbiAgICAgICAgYXNzZXJ0KGYxLmNvbG9yLnIgIT0gMCB8fCBmMS5jb2xvci5nICE9IDAgfHwgZjEuY29sb3IuYiAhPSAwLCAnRmlsbCBjb2xvciBtdXN0IG5vdCBiZSBibGFjaycsIHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIGFzc2VydChmMS5jb2xvci5yICE9IDEgfHwgZjEuY29sb3IuZyAhPSAxIHx8IGYxLmNvbG9yLmIgIT0gMSwgJ0ZpbGwgY29sb3IgbXVzdCBub3QgYmUgd2hpdGUnLCBwYWdlLCBub2RlKTtcclxuICAgIH0pO1xyXG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCAvUk9VTkR8Tk9ORS8udGVzdChTdHJpbmcobm9kZS5zdHJva2VDYXApKSwgYFN0cm9rZSBjYXBzIG11c3QgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUNhcCl9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuRVJST1IpO1xyXG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gJ1JPVU5EJywgYFN0cm9rZSBqb2lucyBzaG91bGQgYmUgJ1JPVU5EJyBidXQgYXJlICcke1N0cmluZyhub2RlLnN0cm9rZUpvaW4pfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcclxuICAgIGNvbnN0IGFuaW0gPSB0YWdzLmZpbmQoKHMpID0+IC9eYmxpbmskfF5kcmF3LWxpbmUkLy50ZXN0KHMpKTtcclxuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIFwiTXVzdCBoYXZlICdibGluaycgb3IgJ2RyYXctbGluZSdcIiwgcGFnZSwgbm9kZSk7IC8vIGV2ZXJ5IHJnYnQgbXVzdCBoYXZlIGFuaW1hdGlvblxyXG59XHJcbmZ1bmN0aW9uIGxpbnRHcm91cChwYWdlLCBub2RlKSB7XHJcbiAgICBhc3NlcnQoIS9CT09MRUFOX09QRVJBVElPTi8udGVzdChub2RlLnR5cGUpLCAnTm90aWNlIEJPT0xFQU5fT1BFUkFUSU9OJywgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XHJcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCAnTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuJywgcGFnZSwgbm9kZSk7XHJcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgIGFzc2VydCgvXmJsaW5rJHxecmdiLXRlbXBsYXRlJHxeZFxcZCskfF5yXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XHJcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJC8udGVzdChzKSk7XHJcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBcIk11c3QgaGF2ZSAnYmxpbmsnXCIsIHBhZ2UsIG5vZGUpOyAvLyBldmVyeSByZ2J0IG11c3QgaGF2ZSBhbmltYXRpb25cclxufVxyXG5mdW5jdGlvbiBsaW50SW5wdXQocGFnZSwgbm9kZSkge1xyXG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdHUk9VUCcsIFwiTXVzdCBiZSAnR1JPVVAnIHR5cGUnXCIsIHBhZ2UsIG5vZGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCAnTXVzdCBiZSBvcGFxdWUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLnZpc2libGUsICdNdXN0IGJlIHZpc2libGUnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLm5hbWUgPT0gJ2lucHV0JywgXCJNdXN0IGJlICdpbnB1dCdcIiwgcGFnZSwgbm9kZSk7XHJcbiAgICBkZXNjZW5kYW50c1dpdGhvdXRTZWxmKG5vZGUpLmZvckVhY2goKHYpID0+IHtcclxuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcclxuICAgICAgICAgICAgbGludEdyb3VwKHBhZ2UsIHYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xyXG4gICAgICAgICAgICBsaW50VmVjdG9yKHBhZ2UsIHYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ0dST1VQL1ZFQ1RPUi9SRUNUQU5HTEUvRUxMSVBTRS9URVhUJyB0eXBlXCIsIHBhZ2UsIHYpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRTZXR0aW5ncyhwYWdlLCBub2RlKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBhc3NlcnQobm9kZS50eXBlID09ICdFTExJUFNFJywgXCJNdXN0IGJlICdFTExJUFNFJyB0eXBlJ1wiLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCAnTXVzdCBiZSB2aXNpYmxlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcclxuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0KC9ec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcclxuICAgIH0pO1xyXG4gICAgaWYgKHRhZ3MuZmluZCgodGFnKSA9PiAvXm9yZGVyLWxheWVycyQvLnRlc3QodGFnKSkpIHtcclxuICAgICAgICBvcmRlciA9ICdsYXllcnMnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgb3JkZXIgPSAnc3RlcHMnO1xyXG4gICAgfVxyXG4gICAgem9vbVNjYWxlID0gcGFyc2VJbnQoKChfYSA9IHRhZ3MuZmluZCgocykgPT4gL156b29tLXNjYWxlLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3pvb20tc2NhbGUtJywgJycpKSB8fFxyXG4gICAgICAgICcxJyk7XHJcbiAgICBhc3NlcnQoem9vbVNjYWxlID49IDEgJiYgem9vbVNjYWxlIDw9IDUsIGBNdXN0IGJlIDEgPD0gem9vbS1zY2FsZSA8PSA1ICgke3pvb21TY2FsZX0pYCwgcGFnZSwgbm9kZSk7XHJcbn1cclxuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgc3RlcCkge1xyXG4gICAgdmFyIF9hLCBfYiwgX2M7XHJcbiAgICBpZiAoIWFzc2VydChzdGVwLnR5cGUgPT0gJ0dST1VQJywgXCJNdXN0IGJlICdHUk9VUCcgdHlwZSdcIiwgcGFnZSwgc3RlcCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQoc3RlcC5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIHN0ZXApO1xyXG4gICAgYXNzZXJ0KHN0ZXAudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIHN0ZXApO1xyXG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Moc3RlcCk7XHJcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xyXG4gICAgICAgIGFzc2VydCgvXlxcL3xec3RlcCR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XmNsZWFyLWxheWVyLShcXGQrLD8pKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIHN0ZXApO1xyXG4gICAgICAgIC8vIGFzc2VydCghL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJnJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIGlzIG9ic29sZXRlYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcclxuICAgIH0pO1xyXG4gICAgY29uc3QgYmcgPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYmckfF5zLW11bHRpc3RlcC1iZy1cXGQrJC8udGVzdChzKSk7XHJcbiAgICBjb25zdCBicnVzaCA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskLy50ZXN0KHMpKTtcclxuICAgIGNvbnN0IHNzID0gcGFyc2VJbnQoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnNzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoJ3NzLScsICcnKSk7XHJcbiAgICBjb25zdCBvID0gdGFncy5maW5kKChzKSA9PiAvXm8tXFxkKyQvLnRlc3QocykpO1xyXG4gICAgY29uc3QgYnMgPSBwYXJzZUludCgoX2IgPSB0YWdzLmZpbmQoKHMpID0+IC9eYnMtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucmVwbGFjZSgnYnMtJywgJycpKTtcclxuICAgIGNvbnN0IGJydXNoTmFtZSA9IChfYyA9IHRhZ3NcclxuICAgICAgICAuZmluZCgocykgPT4gL15icnVzaC1uYW1lLVxcdyskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnJlcGxhY2UoJ2JydXNoLW5hbWUtJywgJycpO1xyXG4gICAgY29uc3QgdGVybWluYWxOb2RlcyA9IGRlc2NlbmRhbnRzV2l0aG91dFNlbGYoc3RlcCkuZmlsdGVyKCh2KSA9PiB2WydjaGlsZHJlbiddID09IHVuZGVmaW5lZCk7XHJcbiAgICBjb25zdCBtYXhTaXplID0gdGVybWluYWxOb2Rlcy5yZWR1Y2UoKGFjYywgdikgPT4ge1xyXG4gICAgICAgIHJldHVybiBNYXRoLm1heChhY2MsIHYud2lkdGgsIHYuaGVpZ2h0KTtcclxuICAgIH0sIDApO1xyXG4gICAgbWF4QnMgPSBNYXRoLm1heChicyA/IGJzIDogbWF4QnMsIG1heEJzKTtcclxuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMjAgfHwgbWF4U2l6ZSA8PSAxMDAsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIGxvbmcgbGluZXMuIENvbnNpZGVyIHVzaW5nIGJnIHRlbXBsYXRlLiAke21heFNpemV9PjEwMGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDIwIHx8IHRlcm1pbmFsTm9kZXMubGVuZ3RoIDw9IDgsIGBTaG91bGQgbm90IHVzZSBzczwyMCB3aXRoIHRvbyBtYW55IGxpbmVzLiBDb25zaWRlciB1c2luZyBiZyB0ZW1wbGF0ZS4gJHt0ZXJtaW5hbE5vZGVzLmxlbmd0aH0+OGAsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQoIWJzIHx8IGJzID49IDE1IHx8IGJydXNoTmFtZSA9PSAncGVuY2lsJywgJ1Nob3VsZCBub3QgdXNlIGJzPDE1JywgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsICdzcyBtdXN0IGJlID49IDE1JywgcGFnZSwgc3RlcCk7XHJcbiAgICBhc3NlcnQoIXNzIHx8ICFicyB8fCBzcyA+IGJzLCAnc3MgbXVzdCBiZSA+IGJzJywgcGFnZSwgc3RlcCk7XHJcbiAgICBhc3NlcnQoIWJzIHx8IGJzIDw9IHpvb21TY2FsZSAqIDEyLjgsIGBicyBtdXN0IGJlIDw9ICR7em9vbVNjYWxlICogMTIuOH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIHN0ZXApO1xyXG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBzdGVwKTtcclxuICAgIGFzc2VydCghbyB8fCBvcmRlciA9PSAnbGF5ZXJzJywgYCR7b30gbXVzdCBiZSB1c2VkIG9ubHkgd2l0aCBzZXR0aW5ncyBvcmRlci1sYXllcnNgLCBwYWdlLCBzdGVwKTtcclxuICAgIGFzc2VydChvcmRlciAhPT0gJ2xheWVycycgfHwgISFvLCAnTXVzdCBoYXZlIG8tTiBvcmRlciBudW1iZXInLCBwYWdlLCBzdGVwKTtcclxuICAgIGNvbnN0IHNmID0gc3RlcC5maW5kT25lKChuKSA9PiB7IHZhciBfYTsgcmV0dXJuICgoX2EgPSBuLnN0cm9rZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMDsgfSk7XHJcbiAgICBjb25zdCBmZnMgPSBzdGVwLmZpbmRBbGwoKG4pID0+IG4uZmlsbHMgJiYgbi5maWxsc1swXSk7XHJcbiAgICBjb25zdCBiaWdGZnMgPSBmZnMuZmlsdGVyKChuKSA9PiBuLndpZHRoID4gMjcgfHwgbi5oZWlnaHQgPiAyNyk7XHJcbiAgICBjb25zdCBmZiA9IGZmcy5sZW5ndGggPiAwO1xyXG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MgJiYgc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBwcmVzZW50KScsIHBhZ2UsIHN0ZXAsIEVycm9yTGV2ZWwuSU5GTyk7XHJcbiAgICBhc3NlcnQoIShiZyAmJiBzcyAmJiAhc2YpLCAnU2hvdWxkIG5vdCB1c2UgYmcrc3MgKHN0cm9rZSBub3QgcHJlc2VudCknLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLldBUk4pO1xyXG4gICAgYXNzZXJ0KCFiZyB8fCBmZiwgXCJiZyBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGhvdXQgZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgc3RlcCwgRXJyb3JMZXZlbC5JTkZPKTtcclxuICAgIGFzc2VydCghYnJ1c2ggfHwgYmlnRmZzLmxlbmd0aCA9PSAwLCBcImJydXNoIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aCBmaWxsZWQtaW4gdmVjdG9ycyAoc2l6ZSA+IDI3KVwiLCBwYWdlLCBzdGVwLCBFcnJvckxldmVsLklORk8pO1xyXG4gICAgc3RlcC5jaGlsZHJlbi5mb3JFYWNoKChuKSA9PiB7XHJcbiAgICAgICAgaWYgKG4ubmFtZSA9PSAnaW5wdXQnKSB7XHJcbiAgICAgICAgICAgIGxpbnRJbnB1dChwYWdlLCBuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobi5uYW1lID09PSAndGVtcGxhdGUnKSB7XHJcbiAgICAgICAgICAgIC8vIGxpbnQgdGVtcGxhdGVcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdpbnB1dCcgb3IgJ3RlbXBsYXRlJ1wiLCBwYWdlLCBuKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGJsaW5rTm9kZXMgPSBmaW5kQWxsKHN0ZXAsIChuKSA9PiBnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eYmxpbmskLy50ZXN0KHQpKSAhPT0gdW5kZWZpbmVkKS5mbGF0TWFwKGRlZXBOb2Rlcyk7XHJcbiAgICBjb25zdCBmaWxsZWROb2RlID0gYmxpbmtOb2Rlcy5maW5kKChuKSA9PiBuLmZpbGxzWzBdKTtcclxuICAgIGFzc2VydChibGlua05vZGVzLmxlbmd0aCA9PSAwIHx8ICEhZmlsbGVkTm9kZSB8fCBibGlua05vZGVzLmxlbmd0aCA+IDMsICdTaG91bGQgdXNlIGRyYXctbGluZSBpZiA8IDQgbGluZXMnLCBwYWdlLCBibGlua05vZGVzWzBdLCBFcnJvckxldmVsLklORk8pO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSkge1xyXG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09ICdGUkFNRScsIFwiTXVzdCBiZSAnRlJBTUUnIHR5cGVcIiwgcGFnZSwgbm9kZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsICdNdXN0IGJlIG9wYXF1ZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgJ011c3QgYmUgdmlzaWJsZScsIHBhZ2UsIG5vZGUpO1xyXG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gMTM2NiAmJiBub2RlLmhlaWdodCA9PSAxMDI0LCAnTXVzdCBiZSAxMzY2eDEwMjQnLCBwYWdlLCBub2RlKTtcclxuICAgIGFzc2VydCghIW5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygncy1tdWx0aXN0ZXAtcmVzdWx0JykpLCBcIk11c3QgaGF2ZSAncy1tdWx0aXN0ZXAtcmVzdWx0JyBjaGlsZFwiLCBwYWdlLCBub2RlKTtcclxuICAgIGxldCBzZXR0aW5ncyA9IG5vZGUuY2hpbGRyZW4uZmluZCgobikgPT4gbi5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpO1xyXG4gICAgaWYgKHNldHRpbmdzKSB7XHJcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcclxuICAgIH1cclxuICAgIGxldCBvcmRlck51bWJlcnMgPSB7fTtcclxuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xyXG4gICAgICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShcXGQrKSQvLmV4ZWModGFnKTtcclxuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG8gPSBmb3VuZFsxXTtcclxuICAgICAgICAgICAgYXNzZXJ0KCFvcmRlck51bWJlcnNbb10sIGBNdXN0IGhhdmUgdW5pcXVlICR7dGFnfSB2YWx1ZXNgLCBwYWdlLCBzdGVwKTtcclxuICAgICAgICAgICAgaWYgKG8pIHtcclxuICAgICAgICAgICAgICAgIG9yZGVyTnVtYmVyc1tvXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgIGlmIChzdGVwLm5hbWUuc3RhcnRzV2l0aCgnc3RlcCcpKSB7XHJcbiAgICAgICAgICAgIGxpbnRTdGVwKHBhZ2UsIHN0ZXApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghc3RlcC5uYW1lLnN0YXJ0c1dpdGgoJ3NldHRpbmdzJykpIHtcclxuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ3NldHRpbmdzJyBvciAnc3RlcCdcIiwgcGFnZSwgc3RlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXNzZXJ0KG1heEJzID4gKHpvb21TY2FsZSAtIDEpICogMTIuOCwgYHpvb20tc2NhbGUgJHt6b29tU2NhbGV9IG11c3QgYmUgJHtNYXRoLmNlaWwobWF4QnMgLyAxMi44KX0gZm9yIG1heCBicyAke21heEJzfSB1c2VkYCwgcGFnZSwgbm9kZSk7XHJcbn1cclxuZnVuY3Rpb24gbGludFRodW1ibmFpbChwYWdlLCBub2RlKSB7XHJcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gJ0ZSQU1FJywgXCJNdXN0IGJlICdGUkFNRScgdHlwZVwiLCBwYWdlLCBub2RlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgJ011c3QgYmUgb3BhcXVlJywgcGFnZSwgbm9kZSk7XHJcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSA0MDAgJiYgbm9kZS5oZWlnaHQgPT0gNDAwLCAnTXVzdCBiZSA0MDB4NDAwJywgcGFnZSwgbm9kZSk7XHJcbn1cclxuZnVuY3Rpb24gbGludFBhZ2UocGFnZSkge1xyXG4gICAgaWYgKC9eXFwvfF5JTkRFWCQvLnRlc3QocGFnZS5uYW1lKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghYXNzZXJ0KC9eW2EtelxcLTAtOV0rJC8udGVzdChwYWdlLm5hbWUpLCBgUGFnZSBuYW1lICcke3BhZ2UubmFtZX0nIG11c3QgbWF0Y2ggW2EtelxcXFwtMC05XSsuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIFwiTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ1wiLCBwYWdlKTtcclxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL15sZXNzb24kLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ2xlc3NvbidcIiwgcGFnZSk7XHJcbiAgICBmb3IgKGxldCBub2RlIG9mIHBhZ2UuY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAobm9kZS5uYW1lID09ICdsZXNzb24nKSB7XHJcbiAgICAgICAgICAgIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG5vZGUubmFtZSA9PSAndGh1bWJuYWlsJykge1xyXG4gICAgICAgICAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYXNzZXJ0KC9eXFwvLy50ZXN0KG5vZGUubmFtZSksIFwiTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGxpbnRJbmRleChwYWdlKSB7XHJcbiAgICBpZiAoIWFzc2VydChwYWdlLmNoaWxkcmVuLmxlbmd0aCA9PSAxLCAnSW5kZXggcGFnZSBtdXN0IGNvbnRhaW4gZXhhY3RseSAxIGVsZW1lbnQnLCBwYWdlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBcIk11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdcIiwgcGFnZSk7XHJcbiAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIHBhZ2UuY2hpbGRyZW5bMF0pO1xyXG59XHJcbmZ1bmN0aW9uIGxpbnRDb3Vyc2UoKSB7XHJcbiAgICBhc3NlcnQoL15DT1VSU0UtW2EtelxcLTAtOV0rJC8udGVzdChmaWdtYS5yb290Lm5hbWUpLCBgQ291cnNlIG5hbWUgJyR7ZmlnbWEucm9vdC5uYW1lfScgbXVzdCBtYXRjaCBDT1VSU0UtW2EtelxcXFwtMC05XStgKTtcclxuICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUgPT0gJ0lOREVYJyk7XHJcbiAgICBpZiAoYXNzZXJ0KCEhaW5kZXgsIFwiTXVzdCBoYXZlICdJTkRFWCcgcGFnZVwiKSkge1xyXG4gICAgICAgIGxpbnRJbmRleChpbmRleCk7XHJcbiAgICB9XHJcbiAgICAvLyBmaW5kIGFsbCBub24tdW5pcXVlIG5hbWVkIHBhZ2VzXHJcbiAgICBjb25zdCBub25VbmlxdWUgPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbHRlcigocCwgaSwgYSkgPT4gYS5maW5kSW5kZXgoKHAyKSA9PiBwMi5uYW1lID09IHAubmFtZSkgIT0gaSk7XHJcbiAgICBub25VbmlxdWUuZm9yRWFjaCgocCkgPT4gYXNzZXJ0KGZhbHNlLCBgUGFnZSBuYW1lICcke3AubmFtZX0nIG11c3QgYmUgdW5pcXVlYCwgcCkpO1xyXG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgbGludFBhZ2UocGFnZSk7XHJcbiAgICB9XHJcbn1cclxub24oJ3NlbGVjdEVycm9yJywgc2VsZWN0RXJyb3IpO1xyXG5vbignbGludENvdXJzZScsICgpID0+IHtcclxuICAgIGVycm9ycyA9IFtdO1xyXG4gICAgbGludENvdXJzZSgpO1xyXG4gICAgcHJpbnRFcnJvcnMoKTtcclxufSk7XHJcbm9uKCdsaW50UGFnZScsICgpID0+IHtcclxuICAgIGVycm9ycyA9IFtdO1xyXG4gICAgbGludFBhZ2UoZmlnbWEuY3VycmVudFBhZ2UpO1xyXG4gICAgcHJpbnRFcnJvcnMoKTtcclxufSk7XHJcbi8vIG5vIGhpZGRlbiBmaWxsL3N0cm9rZVxyXG4vLyBubyBlZmZlY3RzXHJcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgb24gfSBmcm9tICcuLi9ldmVudHMnO1xyXG5pbXBvcnQgeyBjYXBpdGFsaXplLCBwcmludCB9IGZyb20gJy4vdXRpbCc7XHJcbmZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpIHtcclxuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sICcnKTtcclxuICAgIGxldCB0YXNrcyA9ICcnO1xyXG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09ICdJTkRFWCcpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhc2tzICs9IGBcInRhc2stbmFtZSAke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiID0gXCIke2NhcGl0YWxpemUocGFnZS5uYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcXG5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGBcclxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbignICcpKX1cIjtcclxuXCJjb3Vyc2UtZGVzY3JpcHRpb24gJHtjb3Vyc2VOYW1lfVwiID0gXCJJbiB0aGlzIGNvdXJzZTpcclxuICAgIOKAoiBcclxuICAgIOKAoiBcclxuICAgIOKAoiBcIjtcclxuJHt0YXNrc31cclxuYDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0TGVzc29uKHBhZ2UpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgaWYgKCFwYWdlKSB7XHJcbiAgICAgICAgICAgIHBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmluZGV4T2YocGFnZSk7XHJcbiAgICAgICAgY29uc3QgbGVzc29uTm9kZSA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09ICdsZXNzb24nKTtcclxuICAgICAgICBjb25zdCB0aHVtYm5haWxOb2RlID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gJ3RodW1ibmFpbCcpO1xyXG4gICAgICAgIGlmICghbGVzc29uTm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZpbGUgPSB5aWVsZCBsZXNzb25Ob2RlLmV4cG9ydEFzeW5jKHtcclxuICAgICAgICAgICAgZm9ybWF0OiAnU1ZHJyxcclxuICAgICAgICAgICAgLy8gc3ZnT3V0bGluZVRleHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdmdJZEF0dHJpYnV0ZTogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCB0aHVtYm5haWwgPSB5aWVsZCB0aHVtYm5haWxOb2RlLmV4cG9ydEFzeW5jKHtcclxuICAgICAgICAgICAgZm9ybWF0OiAnUE5HJyxcclxuICAgICAgICAgICAgY29uc3RyYWludDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1dJRFRIJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY291cnNlUGF0aDogZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoJ0NPVVJTRS0nLCAnJyksXHJcbiAgICAgICAgICAgIHBhdGg6IHBhZ2UubmFtZSxcclxuICAgICAgICAgICAgZmlsZSxcclxuICAgICAgICAgICAgdGh1bWJuYWlsLFxyXG4gICAgICAgICAgICBpbmRleCxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydENvdXJzZSgpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgY29uc3QgW2xlc3NvbnMsIHRodW1ibmFpbF0gPSB5aWVsZCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKGZpZ21hLnJvb3QuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKHBhZ2UpID0+IHBhZ2UubmFtZSAhPSAnSU5ERVgnKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgocGFnZSkgPT4gZXhwb3J0TGVzc29uKHBhZ2UpKSksXHJcbiAgICAgICAgICAgIGZpZ21hLnJvb3QuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5maW5kKChwYWdlKSA9PiBwYWdlLm5hbWUgPT0gJ0lOREVYJylcclxuICAgICAgICAgICAgICAgIC5leHBvcnRBc3luYyh7XHJcbiAgICAgICAgICAgICAgICBmb3JtYXQ6ICdQTkcnLFxyXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdXSURUSCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pLFxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBhdGg6IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKCdDT1VSU0UtJywgJycpLFxyXG4gICAgICAgICAgICBsZXNzb25zLFxyXG4gICAgICAgICAgICB0aHVtYm5haWwsXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xyXG4gICAgY29uc3QgY291cnNlTmFtZSA9IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKC9DT1VSU0UtLywgJycpO1xyXG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWVcclxuICAgICAgICAuc3BsaXQoJy0nKVxyXG4gICAgICAgIC5tYXAoKHMpID0+IHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpKVxyXG4gICAgICAgIC5qb2luKCcnKTtcclxuICAgIHN3aWZ0Q291cnNlTmFtZSA9XHJcbiAgICAgICAgc3dpZnRDb3Vyc2VOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgc3dpZnRDb3Vyc2VOYW1lLnNsaWNlKDEpO1xyXG4gICAgbGV0IHRhc2tzID0gJyc7XHJcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAocGFnZS5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gJ0lOREVYJykge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFza3MgKz0gYFRhc2socGF0aDogXCIke2NvdXJzZU5hbWV9LyR7cGFnZS5uYW1lfVwiLCBwcm86IHRydWUpLFxcbmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYFxyXG4gICAgbGV0ICR7c3dpZnRDb3Vyc2VOYW1lfSA9IENvdXJzZShcclxuICAgIHBhdGg6IFwiJHtjb3Vyc2VOYW1lfVwiLFxyXG4gICAgYXV0aG9yOiBSRVBMQUNFLFxyXG4gICAgdGFza3M6IFtcclxuJHt0YXNrc30gICAgXSlcclxuYDtcclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZUNvZGUoKSB7XHJcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xyXG4gICAgcHJpbnQoY29kZSk7XHJcbn1cclxub24oJ2dlbmVyYXRlQ29kZScsIGdlbmVyYXRlQ29kZSk7XHJcbiIsImltcG9ydCB7IGdldFRhZ3MsIGZpbmRMZWFmTm9kZXMgfSBmcm9tICcuL3V0aWwnO1xyXG5mdW5jdGlvbiBnZXRPcmRlcihzdGVwKSB7XHJcbiAgICBjb25zdCBvdGFnID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoJ28tJykpIHx8ICcnO1xyXG4gICAgY29uc3QgbyA9IHBhcnNlSW50KG90YWcucmVwbGFjZSgnby0nLCAnJykpO1xyXG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XHJcbn1cclxuZnVuY3Rpb24gc3RlcHNCeU9yZGVyKGxlc3Nvbikge1xyXG4gICAgcmV0dXJuIGxlc3Nvbi5jaGlsZHJlblxyXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoJ3N0ZXAnKSlcclxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0UGFpbnRDb2xvcihwYWludCkge1xyXG4gICAgaWYgKHBhaW50LnR5cGUgPT09ICdTT0xJRCcpIHtcclxuICAgICAgICBsZXQgeyByLCBnLCBiIH0gPSBwYWludC5jb2xvcjtcclxuICAgICAgICByID0gTWF0aC5yb3VuZChyICogMjU1KTtcclxuICAgICAgICBnID0gTWF0aC5yb3VuZChnICogMjU1KTtcclxuICAgICAgICBiID0gTWF0aC5yb3VuZChiICogMjU1KTtcclxuICAgICAgICByZXR1cm4geyByLCBnLCBiLCBhOiAxIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4geyByOiAxNjYsIGc6IDE2NiwgYjogMTY2LCBhOiAxIH07XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZGlzcGxheUNvbG9yKHsgciwgZywgYiwgYSB9KSB7XHJcbiAgICByZXR1cm4gYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgO1xyXG59XHJcbmZ1bmN0aW9uIGdldENvbG9ycyhub2RlKSB7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAgfTsgLy8gdHJhbnNwYXJlbnQgPSBkZWZhdWx0IGNvbG9yXHJcbiAgICBsZXQgZmlsbHMgPSBkZWZhdWx0Q29sb3I7XHJcbiAgICBsZXQgc3Ryb2tlcyA9IGRlZmF1bHRDb2xvcjtcclxuICAgIGNvbnN0IGxlYWYgPSBmaW5kTGVhZk5vZGVzKG5vZGUpWzBdO1xyXG4gICAgaWYgKCdmaWxscycgaW4gbGVhZiAmJiBsZWFmLmZpbGxzICE9PSBmaWdtYS5taXhlZCAmJiBsZWFmLmZpbGxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmaWxscyA9IGdldFBhaW50Q29sb3IobGVhZi5maWxsc1swXSk7XHJcbiAgICB9XHJcbiAgICBpZiAoJ3N0cm9rZXMnIGluIGxlYWYgJiYgbGVhZi5zdHJva2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBzdHJva2VzID0gZ2V0UGFpbnRDb2xvcihsZWFmLnN0cm9rZXNbMF0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBmaWxsc0NvbG9yOiBkaXNwbGF5Q29sb3IoZmlsbHMpLFxyXG4gICAgICAgIHN0cm9rZXNDb2xvcjogZGlzcGxheUNvbG9yKHN0cm9rZXMpLFxyXG4gICAgfTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3RlcHMoKSB7XHJcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XHJcbiAgICByZXR1cm4gc3RlcHNCeU9yZGVyKGxlc3NvbikubWFwKChzdGVwKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHsgaWQ6IHN0ZXAuaWQsIG5hbWU6IHN0ZXAubmFtZSwgY29sb3JzOiBnZXRDb2xvcnMoc3RlcCkgfTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRTdGVwT3JkZXIoc3RlcHMpIHtcclxuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09ICdsZXNzb24nKTtcclxuICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHtcclxuICAgICAgICBjb25zdCBzID0gbGVzc29uLmZpbmRPbmUoKGVsKSA9PiBlbC5pZCA9PSBzdGVwLmlkKTtcclxuICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgICBzLm5hbWUgPSBzLm5hbWUucmVwbGFjZSgvby1cXGQrLywgJ28tJyArIChpICsgMSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbiIsImltcG9ydCB7IGVtaXQsIG9uIH0gZnJvbSAnLi4vZXZlbnRzJztcclxuaW1wb3J0IHsgZ2V0VGFncyB9IGZyb20gJy4vdXRpbCc7XHJcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcclxuICAgIGNvbnN0IG90YWcgPSBnZXRUYWdzKHN0ZXApLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aCgnby0nKSkgfHwgJyc7XHJcbiAgICBjb25zdCBvID0gcGFyc2VJbnQob3RhZy5yZXBsYWNlKCdvLScsICcnKSk7XHJcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcclxufVxyXG5mdW5jdGlvbiBnZXRUYWcoc3RlcCwgdGFnKSB7XHJcbiAgICBjb25zdCB2ID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgodGFnKSk7XHJcbiAgICByZXR1cm4gdiA/IHYucmVwbGFjZSh0YWcsICcnKSA6ICcwJztcclxufVxyXG5mdW5jdGlvbiBzdGVwc0J5T3JkZXIobGVzc29uKSB7XHJcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXHJcbiAgICAgICAgLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcygnc3RlcCcpKVxyXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldE9yZGVyKGEpIC0gZ2V0T3JkZXIoYik7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBkZWxldGVUbXAoKSB7XHJcbiAgICBmaWdtYS5jdXJyZW50UGFnZVxyXG4gICAgICAgIC5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKCd0bXAtJykpXHJcbiAgICAgICAgLmZvckVhY2goKGVsKSA9PiBlbC5yZW1vdmUoKSk7XHJcbn1cclxubGV0IGxhc3RQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XHJcbmxldCBsYXN0TW9kZSA9ICdhbGwnO1xyXG5mdW5jdGlvbiBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKSB7XHJcbiAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xyXG4gICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBpbnB1dCA9IHN0ZXAuZmluZENoaWxkKChnKSA9PiBnLm5hbWUgPT0gJ2lucHV0Jyk7XHJcbiAgICBpZiAoIWlucHV0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdGVtcGxhdGUgPSBpbnB1dC5jbG9uZSgpO1xyXG4gICAgdGVtcGxhdGUubmFtZSA9ICd0bXAtdGVtcGxhdGUnO1xyXG4gICAgdGVtcGxhdGVcclxuICAgICAgICAuZmluZEFsbCgoZWwpID0+IC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdChlbC50eXBlKSlcclxuICAgICAgICAuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGVsLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLCBiOiAxIH0gfV07XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRXZWlnaHQgPSBnZXRUYWcoc3RlcCwgJ3MtJykgPT0gJ211bHRpc3RlcC1iZycgPyAzMCA6IDUwO1xyXG4gICAgICAgICAgICBlbC5zdHJva2VXZWlnaHQgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ3NzLScpKSB8fCBkZWZhdWx0V2VpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCBwaW5rID0gZWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgcGluay5zdHJva2VzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xyXG4gICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XHJcbiAgICAgICAgICAgIHBpbmsubmFtZSA9ICdwaW5rICcgKyBlbC5uYW1lO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChwaW5rKTtcclxuICAgICAgICAgICAgLy8gY2xvbmUgZWxlbWVudCBoZXJlIGFuZCBnaXZlIGhpbSB0aGluIHBpbmsgc3Ryb2tlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbC5maWxscy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGVsLmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHsgcjogMC4xLCBnOiAwLCBiOiAxIH0gfV07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBsZXNzb24uYXBwZW5kQ2hpbGQodGVtcGxhdGUpO1xyXG4gICAgdGVtcGxhdGUucmVsYXRpdmVUcmFuc2Zvcm0gPSBpbnB1dC5yZWxhdGl2ZVRyYW5zZm9ybTtcclxufVxyXG5mdW5jdGlvbiBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCkge1xyXG4gICAgY29uc3QgZGVmYXVsdEJTID0gZ2V0VGFnKHN0ZXAsICdzLScpID09ICdtdWx0aXN0ZXAtYmcnID8gMTIuOCA6IDEwO1xyXG4gICAgY29uc3QgYnMgPSBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSB8fCBkZWZhdWx0QlM7XHJcbiAgICBjb25zdCBzbWFsbExpbmUgPSBmaWdtYS5jcmVhdGVMaW5lKCk7XHJcbiAgICBzbWFsbExpbmUubmFtZSA9ICdzbWFsbExpbmUnO1xyXG4gICAgc21hbGxMaW5lLnJlc2l6ZSgzMDAsIDApO1xyXG4gICAgc21hbGxMaW5lLnN0cm9rZXMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAwLCBnOiAwLjgsIGI6IDAgfSB9XTtcclxuICAgIHNtYWxsTGluZS5zdHJva2VXZWlnaHQgPSBicyAvIDM7XHJcbiAgICBzbWFsbExpbmUuc3Ryb2tlQ2FwID0gJ1JPVU5EJztcclxuICAgIHNtYWxsTGluZS5zdHJva2VBbGlnbiA9ICdDRU5URVInO1xyXG4gICAgc21hbGxMaW5lLnkgPSBzbWFsbExpbmUuc3Ryb2tlV2VpZ2h0IC8gMjtcclxuICAgIGNvbnN0IG1lZGl1bUxpbmUgPSBzbWFsbExpbmUuY2xvbmUoKTtcclxuICAgIG1lZGl1bUxpbmUubmFtZSA9ICdtZWRpdW1MaW5lJztcclxuICAgIG1lZGl1bUxpbmUub3BhY2l0eSA9IDAuMjtcclxuICAgIG1lZGl1bUxpbmUuc3Ryb2tlV2VpZ2h0ID0gYnM7XHJcbiAgICBtZWRpdW1MaW5lLnkgPSBtZWRpdW1MaW5lLnN0cm9rZVdlaWdodCAvIDI7XHJcbiAgICBjb25zdCBiaWdMaW5lID0gc21hbGxMaW5lLmNsb25lKCk7XHJcbiAgICBiaWdMaW5lLm5hbWUgPSAnYmlnTGluZSc7XHJcbiAgICBiaWdMaW5lLm9wYWNpdHkgPSAwLjE7XHJcbiAgICBiaWdMaW5lLnN0cm9rZVdlaWdodCA9IGJzICsgTWF0aC5wb3coYnMsIDEuNCkgKiAwLjg7XHJcbiAgICBiaWdMaW5lLnkgPSBiaWdMaW5lLnN0cm9rZVdlaWdodCAvIDI7XHJcbiAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKFtiaWdMaW5lLCBtZWRpdW1MaW5lLCBzbWFsbExpbmVdLCBsZXNzb24ucGFyZW50KTtcclxuICAgIGdyb3VwLm5hbWUgPSAndG1wLWJzJztcclxuICAgIGdyb3VwLnggPSBsZXNzb24ueDtcclxuICAgIGdyb3VwLnkgPSBsZXNzb24ueSAtIDgwO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGFnZSwgc2V0dGluZ3MpIHtcclxuICAgIGxhc3RQYWdlID0gcGFnZTtcclxuICAgIGxhc3RNb2RlID0gc2V0dGluZ3MuZGlzcGxheU1vZGU7XHJcbiAgICBjb25zdCB7IGRpc3BsYXlNb2RlLCBzdGVwTnVtYmVyIH0gPSBzZXR0aW5ncztcclxuICAgIGNvbnN0IGxlc3NvbiA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZWwpID0+IGVsLm5hbWUgPT0gJ2xlc3NvbicpO1xyXG4gICAgaWYgKCFsZXNzb24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc3RlcE51bWJlciAtIDFdO1xyXG4gICAgcGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XHJcbiAgICBjb25zdCBzdGVwQ291bnQgPSBsZXNzb24uY2hpbGRyZW4uZmlsdGVyKChuKSA9PiBnZXRUYWdzKG4pLmluY2x1ZGVzKCdzdGVwJykpLmxlbmd0aDtcclxuICAgIGVtaXQoJ3VwZGF0ZUZvcm0nLCB7XHJcbiAgICAgICAgc2hhZG93U2l6ZTogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsICdzcy0nKSksXHJcbiAgICAgICAgYnJ1c2hTaXplOiBwYXJzZUludChnZXRUYWcoc3RlcCwgJ2JzLScpKSxcclxuICAgICAgICB0ZW1wbGF0ZTogZ2V0VGFnKHN0ZXAsICdzLScpLFxyXG4gICAgICAgIHN0ZXBDb3VudCxcclxuICAgICAgICBzdGVwTnVtYmVyLFxyXG4gICAgICAgIGRpc3BsYXlNb2RlLFxyXG4gICAgfSk7XHJcbiAgICBkZWxldGVUbXAoKTtcclxuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcclxuICAgICAgICBjYXNlICdhbGwnOlxyXG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxyXG4gICAgICAgICAgICBkaXNwbGF5QnJ1c2hTaXplKGxlc3Nvbiwgc3RlcCk7XHJcbiAgICAgICAgICAgIGxlc3Nvbi5jaGlsZHJlbi5mb3JFYWNoKChzdGVwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcclxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBpIDwgc3RlcE51bWJlcjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcclxuICAgICAgICAgICAgZGlzcGxheUJydXNoU2l6ZShsZXNzb24sIHN0ZXApO1xyXG4gICAgICAgICAgICBkaXNwbGF5VGVtcGxhdGUobGVzc29uLCBzdGVwKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn1cclxuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcclxufSwgMTUwMCk7XHJcbmZ1bmN0aW9uIHVwZGF0ZVByb3BzKHNldHRpbmdzKSB7XHJcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XHJcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc2V0dGluZ3Muc3RlcE51bWJlciAtIDFdO1xyXG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aCgnc3MtJykgJiYgIXQuc3RhcnRzV2l0aCgnYnMtJykgJiYgIXQuc3RhcnRzV2l0aCgncy0nKSk7XHJcbiAgICBpZiAoc2V0dGluZ3MudGVtcGxhdGUpIHtcclxuICAgICAgICB0YWdzLnNwbGljZSgxLCAwLCBgcy0ke3NldHRpbmdzLnRlbXBsYXRlfWApO1xyXG4gICAgfVxyXG4gICAgaWYgKHNldHRpbmdzLnNoYWRvd1NpemUpIHtcclxuICAgICAgICB0YWdzLnB1c2goYHNzLSR7c2V0dGluZ3Muc2hhZG93U2l6ZX1gKTtcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5icnVzaFNpemUpIHtcclxuICAgICAgICB0YWdzLnB1c2goYGJzLSR7c2V0dGluZ3MuYnJ1c2hTaXplfWApO1xyXG4gICAgfVxyXG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKCcgJyk7XHJcbn1cclxub24oJ3VwZGF0ZURpc3BsYXknLCAoc2V0dGluZ3MpID0+IHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHNldHRpbmdzKSk7XHJcbm9uKCd1cGRhdGVQcm9wcycsIHVwZGF0ZVByb3BzKTtcclxuZmlnbWEub24oJ2N1cnJlbnRwYWdlY2hhbmdlJywgKCkgPT4ge1xyXG4gICAgdXBkYXRlRGlzcGxheShsYXN0UGFnZSwgeyBkaXNwbGF5TW9kZTogJ2FsbCcsIHN0ZXBOdW1iZXI6IDEgfSk7XHJcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiAnYWxsJywgc3RlcE51bWJlcjogMSB9KTtcclxufSk7XHJcbmZpZ21hLm9uKCdzZWxlY3Rpb25jaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSAnbGVzc29uJyk7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XHJcbiAgICBpZiAoIXNlbGVjdGlvbiB8fFxyXG4gICAgICAgICFsZXNzb24gfHxcclxuICAgICAgICAhbGVzc29uLmNoaWxkcmVuLmluY2x1ZGVzKHNlbGVjdGlvbikgfHxcclxuICAgICAgICBzZWxlY3Rpb24udHlwZSAhPT0gJ0dST1VQJykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vdXBkYXRlIHN0ZXBcclxuICAgIGNvbnN0IHN0ZXAgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XHJcbiAgICBjb25zdCBzdGVwTnVtYmVyID0gc3RlcHNCeU9yZGVyKGxlc3NvbikuaW5kZXhPZihzdGVwKSArIDE7XHJcbiAgICB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCB7IGRpc3BsYXlNb2RlOiBsYXN0TW9kZSwgc3RlcE51bWJlciB9KTtcclxufSk7XHJcbiIsImltcG9ydCB7IGVtaXQgfSBmcm9tICcuLi9ldmVudHMnO1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZEFsbChub2RlLCBmKSB7XHJcbiAgICBsZXQgYXJyID0gW107XHJcbiAgICBpZiAoZihub2RlKSkge1xyXG4gICAgICAgIGFyci5wdXNoKG5vZGUpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgaWYgKGNoaWxkcmVuKSB7XHJcbiAgICAgICAgYXJyID0gYXJyLmNvbmNhdChjaGlsZHJlbi5mbGF0TWFwKChwKSA9PiBmaW5kQWxsKHAsIGYpKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJyO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kTGVhZk5vZGVzKG5vZGUpIHtcclxuICAgIHJldHVybiBub2RlLmZpbmRBbGwoKG4pID0+ICEoJ2NoaWxkcmVuJyBpbiBuKSk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xyXG4gICAgaWYgKGYobm9kZSkpIHtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIGlmIChub2RlLnBhcmVudCkge1xyXG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFncyhub2RlKSB7XHJcbiAgICByZXR1cm4gbm9kZS5uYW1lLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRUYWcobm9kZSwgdGFnKSB7XHJcbiAgICBub2RlLm5hbWUgPSBnZXRUYWdzKG5vZGUpLmNvbmNhdChbdGFnXSkuam9pbignICcpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBwcmludCh0ZXh0KSB7XHJcbiAgICBmaWdtYS51aS5yZXNpemUoNzAwLCA0MDApO1xyXG4gICAgZW1pdCgncHJpbnQnLCB0ZXh0KTtcclxufVxyXG5leHBvcnQgY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcclxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBjcmVhdGVQbHVnaW5BUEksIGNyZWF0ZVVJQVBJIH0gZnJvbSAnZmlnbWEtanNvbnJwYyc7XHJcbmltcG9ydCB7IGV4cG9ydFRleHRzIH0gZnJvbSAnLi9wbHVnaW4vZm9ybWF0LXJwYyc7XHJcbmltcG9ydCB7IGV4cG9ydExlc3NvbiwgZXhwb3J0Q291cnNlIH0gZnJvbSAnLi9wbHVnaW4vcHVibGlzaCc7XHJcbmltcG9ydCB7IGdldFN0ZXBzLCBzZXRTdGVwT3JkZXIgfSBmcm9tICcuL3BsdWdpbi90dW5lLXJwYyc7XHJcbmltcG9ydCB7IGNyZWF0ZUxlc3Nvbiwgc2VwYXJhdGVTdGVwLCBzcGxpdEJ5Q29sb3IgfSBmcm9tICcuL3BsdWdpbi9jcmVhdGUnO1xyXG4vLyBGaWdtYSBwbHVnaW4gbWV0aG9kc1xyXG5leHBvcnQgY29uc3QgcGx1Z2luQXBpID0gY3JlYXRlUGx1Z2luQVBJKHtcclxuICAgIHNldFNlc3Npb25Ub2tlbih0b2tlbikge1xyXG4gICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdzZXNzaW9uVG9rZW4nLCB0b2tlbik7XHJcbiAgICB9LFxyXG4gICAgZ2V0U2Vzc2lvblRva2VuKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdzZXNzaW9uVG9rZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBleHBvcnRMZXNzb24sXHJcbiAgICBleHBvcnRDb3Vyc2UsXHJcbiAgICBnZXRTdGVwcyxcclxuICAgIHNldFN0ZXBPcmRlcixcclxuICAgIGV4cG9ydFRleHRzLFxyXG4gICAgY3JlYXRlTGVzc29uLFxyXG4gICAgc2VwYXJhdGVTdGVwLFxyXG4gICAgc3BsaXRCeUNvbG9yLFxyXG59KTtcclxuLy8gRmlnbWEgVUkgYXBwIG1ldGhvZHNcclxuZXhwb3J0IGNvbnN0IHVpQXBpID0gY3JlYXRlVUlBUEkoe30pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9