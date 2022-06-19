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
            pluginMessage: [name, ...args]
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
    figma.ui.onmessage = function ([name, ...args]) {
        invokeEventHandler(name, args);
    };
}
else {
    window.onmessage = function (event) {
        if (!Array.isArray(event.data.pluginMessage)) {
            return;
        }
        const [name, ...args] = event.data.pluginMessage;
        invokeEventHandler(name, args);
    };
}


/***/ }),

/***/ "./src/plugin/index.ts":
/*!*****************************!*\
  !*** ./src/plugin/index.ts ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _linter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./linter */ "./src/plugin/linter.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



figma.showUI(__html__);
figma.ui.resize(340, 450);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("separateStep", () => separateStep(figma.currentPage.selection));
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("exportCourse", exportCourse);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("generateCode", generateCode);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("autoFormat", autoFormat);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("selectError", _linter__WEBPACK_IMPORTED_MODULE_1__["selectError"]);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("updateDisplay", (settings) => updateDisplay(figma.currentPage, settings));
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("updateProps", updateProps);
figma.on("currentpagechange", () => {
    updateDisplay(lastPage, { displayMode: "all", stepNumber: 1 });
    updateDisplay(figma.currentPage, { displayMode: "all", stepNumber: 1 });
});
function getOrder(step) {
    let o = parseInt(Object(_util__WEBPACK_IMPORTED_MODULE_2__["getTags"])(step).find((t) => t.startsWith("o-")).replace("o-", ""));
    return isNaN(o) ? 9999 : o;
}
function getTag(step, tag) {
    const v = Object(_util__WEBPACK_IMPORTED_MODULE_2__["getTags"])(step).find((t) => t.startsWith(tag));
    return v ? v.replace(tag, "") : "0";
}
function stepsByOrder(lesson) {
    return lesson.children
        .filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_2__["getTags"])(n).includes("step"))
        .sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
}
function deleteTmp() {
    figma.currentPage.findAll((el) => el.name.startsWith("tmp-")).forEach((el) => el.remove());
}
let lastPage = figma.currentPage;
function updateDisplay(page, settings) {
    lastPage = page;
    const { displayMode, stepNumber } = settings;
    const lesson = page.children.find((el) => el.name == "lesson");
    const step = stepsByOrder(lesson)[stepNumber - 1];
    page.selection = [step];
    const stepCount = lesson.children.filter((n) => Object(_util__WEBPACK_IMPORTED_MODULE_2__["getTags"])(n).includes("step")).length;
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])("updateForm", { ss: parseInt(getTag(step, "ss-")), bs: parseInt(getTag(step, "bs-")), template: getTag(step, "s-"), stepCount, stepNumber, displayMode });
    switch (displayMode) {
        case "all":
            deleteTmp();
            lesson.children.forEach((step) => {
                step.visible = true;
            });
            break;
        case "current":
            deleteTmp();
            lesson.children.forEach((step) => {
                step.visible = false;
            });
            step.visible = true;
            break;
        case "previous":
            deleteTmp();
            stepsByOrder(lesson).forEach((step, i) => {
                step.visible = i < stepNumber ? true : false;
            });
            break;
        case "template":
            deleteTmp();
            lesson.children.forEach((step) => {
                step.visible = false;
            });
            const input = step.findChild((g) => g.name == "input");
            const template = input.clone();
            template.name = "tmp-template";
            // template.findAll((el) => el.type == "GROUP").forEach((el) => (figma as any).ungroup(el))
            template.findAll((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type)).forEach((el) => {
                if (el.strokes.length > 0) {
                    el.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }];
                    el.strokeWeight = parseInt(getTag(step, "ss-")) || 50;
                    const pink = el.clone();
                    pink.strokes = [{ type: "SOLID", color: { r: 1, g: 0, b: 1 } }];
                    pink.strokeWeight = 2;
                    pink.name = "pink " + el.name;
                    // template.insertChild(0, pink)
                    template.appendChild(pink);
                    // clone element here and give him thin pink stroke
                }
                if (el.fills.length > 0) {
                    el.fills = [{ type: "SOLID", color: { r: 0.1, g: 0, b: 1 } }];
                }
            });
            lesson.appendChild(template);
            template.x = input.absoluteTransform[0][2] - lesson.absoluteTransform[0][2];
            template.y = input.absoluteTransform[1][2] - lesson.absoluteTransform[1][2];
            break;
    }
}
updateDisplay(figma.currentPage, { displayMode: "all", stepNumber: 1 });
function updateProps(settings) {
    const lesson = figma.currentPage.children.find((el) => el.name == "lesson");
    const step = stepsByOrder(lesson)[settings.stepNumber - 1];
    // const ss = settings.ss || parseInt(getTag(step, "ss-"))
    // const bs = settings.bs || parseInt(getTag(step, "bs-"))
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_2__["getTags"])(step).filter((t) => !t.startsWith("ss-") && !t.startsWith("bs-"));
    if (settings.ss) {
        tags.push(`ss-${settings.ss}`);
    }
    if (settings.bs) {
        tags.push(`bs-${settings.bs}`);
    }
    // let tags = getTags(step).filter((t) => !t.startsWith("ss-") && !t.startsWith("bs-")).concat([`ss-${settings.ss}`, `bs-${settings.bs}`])
    step.name = tags.join(" ");
}
function separateStep(nodes) {
    const parentStep = Object(_util__WEBPACK_IMPORTED_MODULE_2__["findParent"])(nodes[0], (n) => n.name.startsWith("step"));
    const frame = parentStep.parent;
    const index = frame.children.findIndex((n) => n == parentStep);
    if (!parentStep) {
        return;
    }
    const input = figma.group(nodes, frame);
    input.name = "input";
    const newStep = figma.group([input], frame, index);
    newStep.name = parentStep.name;
}
function autoFormat() {
    const thumbPage = figma.root.children.find((p) => p.name.toUpperCase() == "THUMBNAILS");
    if (thumbPage) {
        figma.root.children.forEach((p) => {
            const thumbnailFrame = thumbPage.children.find((t) => t.name == p.name);
            if (p.children.find((t) => t.name == "thumbnail") || !thumbnailFrame) {
                return;
            }
            const clone = thumbnailFrame.clone();
            clone.name = "thumbnail";
            p.appendChild(clone);
        });
    }
    figma.root.children.forEach((p) => {
        const oldLessonFrame = p.children.find((t) => t.name == p.name);
        if (oldLessonFrame) {
            oldLessonFrame.name = "lesson";
        }
        const thumbnailFrame = p.children.find((t) => t.name == "thumbnail");
        const lessonFrame = p.children.find((t) => t.name == "lesson");
        if (!thumbnailFrame || !lessonFrame) {
            return;
        }
        thumbnailFrame.x = lessonFrame.x - 440;
        thumbnailFrame.y = lessonFrame.y;
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["findAll"])(figma.root, (node) => /^settings/.test(node.name))
        .forEach((n) => {
        n.resize(40, 40);
        n.x = 10;
        n.y = 10;
    });
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["findAll"])(figma.root, (node) => /^step s-multistep-result/.test(node.name))
        .forEach((n) => {
        n.children[0].name = "template";
        n.children[0].children[0].name = "/ignore";
        n.resize(40, 40);
        n.x = 10;
        n.y = 60;
    });
}
function generateCode() {
    const code = generateSwiftCode() + generateTranslationsCode();
    Object(_util__WEBPACK_IMPORTED_MODULE_2__["print"])(code);
}
function generateTranslationsCode() {
    const courseName = figma.root.name.replace(/COURSE-/, "");
    let swiftCourseName = courseName.split("-").map(_util__WEBPACK_IMPORTED_MODULE_2__["capitalize"]).join("");
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1);
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "INDEX") {
            continue;
        }
        tasks += `"task-name ${courseName}/${page.name}" = "${Object(_util__WEBPACK_IMPORTED_MODULE_2__["capitalize"])(page.name.split('-').join(" "))}";\n`;
    }
    return `
"course-name ${courseName}" = "${Object(_util__WEBPACK_IMPORTED_MODULE_2__["capitalize"])(courseName.split('-').join(" "))}";
"course-description ${courseName}" = "In this course:
    • 
    • 
    • ";
${tasks}
`;
}
function generateSwiftCode() {
    const courseName = figma.root.name.replace(/COURSE-/, "");
    let swiftCourseName = courseName.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1);
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "INDEX") {
            continue;
        }
        tasks += `        Task(path: "${courseName}/${page.name}", pro: true),\n`;
    }
    return `
let ${swiftCourseName} = Course(
    path: "${courseName}",
    tasks: [
${tasks}    ])
`;
}
function exportCourse() {
    return __awaiter(this, void 0, void 0, function* () {
        let lessons = [];
        let thumbnails = [];
        for (let page of figma.root.children) {
            if (page.name.toUpperCase() == "THUMBNAILS") {
                continue;
            }
            const lesson = page.children.find((f) => f.name == "lesson");
            const thumbnail = page.children.find((f) => f.name == "thumbnail");
            if (lesson) {
                const bytes = yield lesson.exportAsync({
                    format: "SVG",
                    // svgOutlineText: false,
                    svgIdAttribute: true,
                });
                const path = `${page.name}.svg`;
                lessons.push({ path, bytes });
            }
            if (thumbnail) {
                const bytes = yield thumbnail.exportAsync({
                    format: "PNG",
                    constraint: {
                        type: "WIDTH",
                        value: 600,
                    },
                });
                const path = `thumbnails/${page.name.toLowerCase()}.png`;
                thumbnails.push({ path, bytes });
            }
        }
        Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])("exportZip", { rootName: figma.root.name, lessons: lessons, thumbnails: thumbnails });
    });
}


/***/ }),

/***/ "./src/plugin/linter.ts":
/*!******************************!*\
  !*** ./src/plugin/linter.ts ***!
  \******************************/
/*! exports provided: errors, selectError, printErrors, lintCourse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "errors", function() { return errors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectError", function() { return selectError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printErrors", function() { return printErrors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lintCourse", function() { return lintCourse; });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/plugin/util.ts");


Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("lintCourse", () => {
    errors = [];
    lintCourse();
    printErrors();
});
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("lintPage", () => {
    errors = [];
    lintPage(figma.currentPage);
    printErrors();
});
let errors = [];
let zoomScale = 1;
let maxBs = 12.8;
let order = "steps";
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
        errors[0].page.selection = [errors[index].node];
    }
}
function printErrors() {
    errors.sort((a, b) => a.level - b.level);
    selectError(0);
    let text = errors.map((e) => { var _a, _b, _c; return `${ErrorLevel[e.level]}\t| ${e.error} | PAGE:${((_a = e.page) === null || _a === void 0 ? void 0 : _a.name) || ""} ${(_b = e.node) === null || _b === void 0 ? void 0 : _b.type}:${((_c = e.node) === null || _c === void 0 ? void 0 : _c.name) || ""}`; }).join("\n");
    text += "\nDone";
    Object(_util__WEBPACK_IMPORTED_MODULE_1__["print"])(text);
}
function assert(val, error, page, node, level = ErrorLevel.ERROR) {
    if (!val) {
        errors.push({ node, page, error, level });
    }
    return val;
}
function lintCourse() {
    assert(/^COURSE-[a-z\-0-9]+$/.test(figma.root.name), `Course name '${figma.root.name}' must match COURSE-[a-z\-0-9]+`);
    const index = figma.root.children.find((p) => p.name == "INDEX");
    if (assert(!!index, `Must have 'INDEX' page`)) {
        lintIndex(index);
    }
    for (let page of figma.root.children) {
        lintPage(page);
    }
}
function lintIndex(page) {
    if (!assert(page.children.length == 1, `Index page must contain exactly 1 element`, page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, `Must contain exactly 1 'thumbnail'`, page);
    lintThumbnail(page, page.children[0]);
}
function lintPage(page) {
    if (/^\/|^INDEX$/.test(page.name)) {
        return;
    }
    if (!assert(/^[a-z\-0-9]+$/.test(page.name), `Page name '${page.name}' must match [a-z\-0-9]+. Use slash to /ignore.`, page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, `Must contain exactly 1 'thumbnail'`, page);
    assert(page.children.filter((s) => /^lesson$/.test(s.name)).length == 1, `Must contain exactly 1 'lesson'`, page);
    for (let node of page.children) {
        if (node.name == "lesson") {
            lintTaskFrame(page, node);
        }
        else if (node.name == "thumbnail") {
            lintThumbnail(page, node);
        }
        else {
            assert(/^\//.test(node.name), `Must be 'thumbnail' or 'lesson'. Use slash to /ignore.`, page, node, ErrorLevel.WARN);
        }
    }
}
function lintThumbnail(page, node) {
    if (!assert(node.type == "FRAME", `Must be 'FRAME' type`, page, node)) {
        return;
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.width == 400 && node.height == 400, `Must be 400x400`, page, node);
}
function lintTaskFrame(page, node) {
    if (!assert(node.type == "FRAME", `Must be 'FRAME' type`, page, node)) {
        return;
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    assert(node.width == 1366 && node.height == 1024, `Must be 1366x1024`, page, node);
    let settings = node.children.find((n) => n.name.startsWith("settings"));
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
        if (step.name.startsWith("step")) {
            lintStep(page, step);
        }
        else if (!step.name.startsWith("settings")) {
            assert(false, `Must be 'settings' or 'step'`, page, step);
        }
    }
    assert(maxBs > (zoomScale - 1) * 12.8, `zoom-scale ${zoomScale} must be ${Math.ceil(maxBs / 12.8)} for max bs ${maxBs} used`, page, node);
}
function lintStep(page, node) {
    var _a, _b;
    if (!assert(node.type == "GROUP", `Must be 'GROUP' type'`, page, node)) {
        return;
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    tags.forEach((tag) => {
        assert(/^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-\d+$|^ss-\d+$|^bs-\d+$|^o-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
        // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);        
    });
    const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s));
    const brush = tags.find((s) => /^s-multistep-brush$|^s-multistep-brush-\d+$/.test(s));
    const ss = parseInt((_a = tags.find((s) => /^ss-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace("ss-", ""));
    const o = tags.find((s) => /^o-\d+$/.test(s));
    const bs = parseInt((_b = tags.find((s) => /^bs-\d+$/.test(s))) === null || _b === void 0 ? void 0 : _b.replace("bs-", ""));
    maxBs = Math.max(bs ? bs : maxBs, maxBs);
    assert(!(bg && ss), "Should not use bg+ss", page, node, ErrorLevel.INFO);
    assert(!ss || ss >= 15, "ss must be >= 15", page, node);
    assert(!ss || !bs || ss > bs, "ss must be > bs", page, node);
    assert(!bs || bs <= zoomScale * 12.8, `bs must be <= ${zoomScale * 12.8} for this zoom-scale`, page, node);
    assert(!bs || bs >= zoomScale * 0.44, `bs must be >= ${zoomScale * 0.44} for this zoom-scale`, page, node);
    assert(!o || order == "layers", `${o} must be used only with settings order-layers`, page, node);
    assert(order !== "layers" || !!o, `Must have o-N order number`, page, node);
    const ff = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findFirst"])(node, (n) => n.fills && n.fills[0]);
    assert(!bg || ff, "bg step shouldn't be used without filled-in vectors", page, node, ErrorLevel.INFO);
    assert(!brush || !ff, "brush step shouldn't be used with filled-in vectors", page, node, ErrorLevel.INFO);
    node.children.forEach((n) => {
        if (n.name == "input") {
            lintInput(page, n);
        }
        else if (n.name = "template") {
            // lint template
        }
        else {
            assert(false, "Must be 'input' or 'template'", page, n);
        }
    });
    const blinkNodes = Object(_util__WEBPACK_IMPORTED_MODULE_1__["findAll"])(node, (n) => Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(n).find((t) => /^blink$/.test(t)) !== undefined).flatMap(deepNodes);
    const filledNode = blinkNodes.find((n) => n.fills[0]);
    assert(blinkNodes.length == 0 || !!filledNode || blinkNodes.length > 3, `Should use draw-line if < 4 lines`, page, blinkNodes[0], ErrorLevel.INFO);
}
function deepNodes(node) {
    if (!node.children) {
        return [node];
    }
    return node.children.flatMap((n) => deepNodes(n));
}
function lintSettings(page, node) {
    var _a;
    assert(node.type == "ELLIPSE", `Must be 'ELLIPSE' type'`, page, node);
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    const tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    tags.forEach((tag) => {
        assert(/^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
    });
    if (tags.find((tag) => /^order-layers$/.test(tag))) {
        order = "layers";
    }
    else {
        order = "steps";
    }
    zoomScale = parseInt(((_a = tags.find((s) => /^zoom-scale-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace("zoom-scale-", "")) || "1");
    assert(zoomScale >= 1 && zoomScale <= 5, `Must be 1 <= zoom-scale <= 5 (${zoomScale})`, page, node);
}
function lintInput(page, node) {
    if (!assert(node.type == "GROUP", `Must be 'GROUP' type'`, page, node)) {
        return;
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    assert(node.name == "input", `Must be 'input'`, page, node);
    node.children.forEach((v) => {
        if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
            lintGroup(page, v);
        }
        else if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
            lintVector(page, v);
        }
        else {
            assert(false, `Must be 'GROUP/VECTOR/RECTANGLE/ELLIPSE/TEXT' type`, page, v);
        }
    });
}
function lintVector(page, node) {
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    assert(tags.length > 0, `Name must not be empty. Use slash to /ignore.`, page, node);
    tags.forEach((tag) => {
        assert(/^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node);
    });
    let fills = node.fills;
    let strokes = node.strokes;
    assert(!fills.length || !strokes.length, `Must not have fill+stroke`, page, node);
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)), `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR);
    assert(!strokes.length || node.strokeJoin == "ROUND", `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
    const rgbt = tags.find((s) => /^rgb-template$/.test(s));
    const anim = tags.find((s) => /^blink$|^draw-line$/.test(s));
    assert(!rgbt || !!anim, `Must have 'blink' or 'draw-line'`, page, node);
}
function lintGroup(page, node) {
    assert(!/BOOLEAN_OPERATION/.test(node.type), `Notice BOOLEAN_OPERATION`, page, node, ErrorLevel.INFO);
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    let tags = Object(_util__WEBPACK_IMPORTED_MODULE_1__["getTags"])(node);
    assert(tags.length > 0, `Name must not be empty. Use slash to /ignore.`, page, node);
    tags.forEach((tag) => {
        assert(/^blink$|^rgb-template$|^blink$|^d\d+$|^r\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
    });
    const rgbt = tags.find((s) => /^rgb-template$/.test(s));
    const anim = tags.find((s) => /^blink$/.test(s));
    assert(!rgbt || !!anim, `Must have 'blink'`, page, node);
}
// no hidden fill/stroke
// no effects


/***/ }),

/***/ "./src/plugin/util.ts":
/*!****************************!*\
  !*** ./src/plugin/util.ts ***!
  \****************************/
/*! exports provided: findAll, findParent, findFirst, getTags, print, capitalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findAll", function() { return findAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findParent", function() { return findParent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findFirst", function() { return findFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTags", function() { return getTags; });
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
function findFirst(node, f) {
    if (f(node)) {
        return node;
    }
    const children = node.children;
    if (children) {
        for (let p of children) {
            let found = findFirst(p, f);
            if (found)
                return found;
        }
    }
}
function getTags(node) {
    return node.name.split(" ").filter(Boolean);
}
function print(text) {
    figma.ui.resize(700, 400);
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])("print", text);
}
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vbGludGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNPO0FBQ1Asa0JBQWtCLFVBQVU7QUFDNUI7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7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QUFJO0FBQ3ROLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSxVQUFVO0FBQ3hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscURBQU87QUFDdEI7QUFDQTtBQUNBLGdHQUFnRyxJQUFJO0FBQ3BHLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxpSEFBaUgsdUJBQXVCO0FBQ3hJLHFHQUFxRyx3QkFBd0I7QUFDN0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscURBQU87QUFDdEI7QUFDQTtBQUNBLGlGQUFpRixJQUFJO0FBQ3JGLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsUEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFpQztBQUMxQjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBLElBQUksb0RBQUk7QUFDUjtBQUNPIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2luZGV4LnRzXCIpO1xuIiwiY29uc3QgZXZlbnRIYW5kbGVycyA9IHt9O1xubGV0IGN1cnJlbnRJZCA9IDA7XG5leHBvcnQgZnVuY3Rpb24gb24obmFtZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IGlkID0gYCR7Y3VycmVudElkfWA7XG4gICAgY3VycmVudElkICs9IDE7XG4gICAgZXZlbnRIYW5kbGVyc1tpZF0gPSB7IGhhbmRsZXIsIG5hbWUgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgZXZlbnRIYW5kbGVyc1tpZF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbmNlKG5hbWUsIGhhbmRsZXIpIHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIHJldHVybiBvbihuYW1lLCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAoZG9uZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IGVtaXQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJ1xuICAgID8gZnVuY3Rpb24gKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoW25hbWUsIC4uLmFyZ3NdKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXVxuICAgICAgICB9LCAnKicpO1xuICAgIH07XG5mdW5jdGlvbiBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncykge1xuICAgIGZvciAoY29uc3QgaWQgaW4gZXZlbnRIYW5kbGVycykge1xuICAgICAgICBpZiAoZXZlbnRIYW5kbGVyc1tpZF0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyc1tpZF0uaGFuZGxlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgIGZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChbbmFtZSwgLi4uYXJnc10pIHtcbiAgICAgICAgaW52b2tlRXZlbnRIYW5kbGVyKG5hbWUsIGFyZ3MpO1xuICAgIH07XG59XG5lbHNlIHtcbiAgICB3aW5kb3cub25tZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW25hbWUsIC4uLmFyZ3NdID0gZXZlbnQuZGF0YS5wbHVnaW5NZXNzYWdlO1xuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgfTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuaW1wb3J0IHsgZW1pdCwgb24gfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHsgc2VsZWN0RXJyb3IgfSBmcm9tICcuL2xpbnRlcic7XG5pbXBvcnQgeyBnZXRUYWdzLCBmaW5kQWxsLCBmaW5kUGFyZW50LCBjYXBpdGFsaXplLCBwcmludCB9IGZyb20gJy4vdXRpbCc7XG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkucmVzaXplKDM0MCwgNDUwKTtcbm9uKFwic2VwYXJhdGVTdGVwXCIsICgpID0+IHNlcGFyYXRlU3RlcChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pKTtcbm9uKFwiZXhwb3J0Q291cnNlXCIsIGV4cG9ydENvdXJzZSk7XG5vbihcImdlbmVyYXRlQ29kZVwiLCBnZW5lcmF0ZUNvZGUpO1xub24oXCJhdXRvRm9ybWF0XCIsIGF1dG9Gb3JtYXQpO1xub24oXCJzZWxlY3RFcnJvclwiLCBzZWxlY3RFcnJvcik7XG5vbihcInVwZGF0ZURpc3BsYXlcIiwgKHNldHRpbmdzKSA9PiB1cGRhdGVEaXNwbGF5KGZpZ21hLmN1cnJlbnRQYWdlLCBzZXR0aW5ncykpO1xub24oXCJ1cGRhdGVQcm9wc1wiLCB1cGRhdGVQcm9wcyk7XG5maWdtYS5vbihcImN1cnJlbnRwYWdlY2hhbmdlXCIsICgpID0+IHtcbiAgICB1cGRhdGVEaXNwbGF5KGxhc3RQYWdlLCB7IGRpc3BsYXlNb2RlOiBcImFsbFwiLCBzdGVwTnVtYmVyOiAxIH0pO1xuICAgIHVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IFwiYWxsXCIsIHN0ZXBOdW1iZXI6IDEgfSk7XG59KTtcbmZ1bmN0aW9uIGdldE9yZGVyKHN0ZXApIHtcbiAgICBsZXQgbyA9IHBhcnNlSW50KGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKFwiby1cIikpLnJlcGxhY2UoXCJvLVwiLCBcIlwiKSk7XG4gICAgcmV0dXJuIGlzTmFOKG8pID8gOTk5OSA6IG87XG59XG5mdW5jdGlvbiBnZXRUYWcoc3RlcCwgdGFnKSB7XG4gICAgY29uc3QgdiA9IGdldFRhZ3Moc3RlcCkuZmluZCgodCkgPT4gdC5zdGFydHNXaXRoKHRhZykpO1xuICAgIHJldHVybiB2ID8gdi5yZXBsYWNlKHRhZywgXCJcIikgOiBcIjBcIjtcbn1cbmZ1bmN0aW9uIHN0ZXBzQnlPcmRlcihsZXNzb24pIHtcbiAgICByZXR1cm4gbGVzc29uLmNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IGdldFRhZ3MobikuaW5jbHVkZXMoXCJzdGVwXCIpKVxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gZ2V0T3JkZXIoYSkgLSBnZXRPcmRlcihiKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGRlbGV0ZVRtcCgpIHtcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKChlbCkgPT4gZWwubmFtZS5zdGFydHNXaXRoKFwidG1wLVwiKSkuZm9yRWFjaCgoZWwpID0+IGVsLnJlbW92ZSgpKTtcbn1cbmxldCBsYXN0UGFnZSA9IGZpZ21hLmN1cnJlbnRQYWdlO1xuZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwYWdlLCBzZXR0aW5ncykge1xuICAgIGxhc3RQYWdlID0gcGFnZTtcbiAgICBjb25zdCB7IGRpc3BsYXlNb2RlLCBzdGVwTnVtYmVyIH0gPSBzZXR0aW5ncztcbiAgICBjb25zdCBsZXNzb24gPSBwYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09IFwibGVzc29uXCIpO1xuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzdGVwTnVtYmVyIC0gMV07XG4gICAgcGFnZS5zZWxlY3Rpb24gPSBbc3RlcF07XG4gICAgY29uc3Qgc3RlcENvdW50ID0gbGVzc29uLmNoaWxkcmVuLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcyhcInN0ZXBcIikpLmxlbmd0aDtcbiAgICBlbWl0KFwidXBkYXRlRm9ybVwiLCB7IHNzOiBwYXJzZUludChnZXRUYWcoc3RlcCwgXCJzcy1cIikpLCBiczogcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsIFwiYnMtXCIpKSwgdGVtcGxhdGU6IGdldFRhZyhzdGVwLCBcInMtXCIpLCBzdGVwQ291bnQsIHN0ZXBOdW1iZXIsIGRpc3BsYXlNb2RlIH0pO1xuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcbiAgICAgICAgY2FzZSBcImFsbFwiOlxuICAgICAgICAgICAgZGVsZXRlVG1wKCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY3VycmVudFwiOlxuICAgICAgICAgICAgZGVsZXRlVG1wKCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwcmV2aW91c1wiOlxuICAgICAgICAgICAgZGVsZXRlVG1wKCk7XG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gaSA8IHN0ZXBOdW1iZXIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidGVtcGxhdGVcIjpcbiAgICAgICAgICAgIGRlbGV0ZVRtcCgpO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBzdGVwLmZpbmRDaGlsZCgoZykgPT4gZy5uYW1lID09IFwiaW5wdXRcIik7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGlucHV0LmNsb25lKCk7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5uYW1lID0gXCJ0bXAtdGVtcGxhdGVcIjtcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlLmZpbmRBbGwoKGVsKSA9PiBlbC50eXBlID09IFwiR1JPVVBcIikuZm9yRWFjaCgoZWwpID0+IChmaWdtYSBhcyBhbnkpLnVuZ3JvdXAoZWwpKVxuICAgICAgICAgICAgdGVtcGxhdGUuZmluZEFsbCgoZWwpID0+IC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdChlbC50eXBlKSkuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0cm9rZXMgPSBbeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSB9XTtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsIFwic3MtXCIpKSB8fCA1MDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHBpbmsuc3Ryb2tlcyA9IFt7IHR5cGU6IFwiU09MSURcIiwgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHBpbmsubmFtZSA9IFwicGluayBcIiArIGVsLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBsYXRlLmluc2VydENoaWxkKDAsIHBpbmspXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICAgICAgICAgICAgICAvLyBjbG9uZSBlbGVtZW50IGhlcmUgYW5kIGdpdmUgaGltIHRoaW4gcGluayBzdHJva2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVsLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuZmlsbHMgPSBbeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIHRlbXBsYXRlLnggPSBpbnB1dC5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXSAtIGxlc3Nvbi5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXTtcbiAgICAgICAgICAgIHRlbXBsYXRlLnkgPSBpbnB1dC5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXSAtIGxlc3Nvbi5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbnVwZGF0ZURpc3BsYXkoZmlnbWEuY3VycmVudFBhZ2UsIHsgZGlzcGxheU1vZGU6IFwiYWxsXCIsIHN0ZXBOdW1iZXI6IDEgfSk7XG5mdW5jdGlvbiB1cGRhdGVQcm9wcyhzZXR0aW5ncykge1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09IFwibGVzc29uXCIpO1xuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzZXR0aW5ncy5zdGVwTnVtYmVyIC0gMV07XG4gICAgLy8gY29uc3Qgc3MgPSBzZXR0aW5ncy5zcyB8fCBwYXJzZUludChnZXRUYWcoc3RlcCwgXCJzcy1cIikpXG4gICAgLy8gY29uc3QgYnMgPSBzZXR0aW5ncy5icyB8fCBwYXJzZUludChnZXRUYWcoc3RlcCwgXCJicy1cIikpXG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aChcInNzLVwiKSAmJiAhdC5zdGFydHNXaXRoKFwiYnMtXCIpKTtcbiAgICBpZiAoc2V0dGluZ3Muc3MpIHtcbiAgICAgICAgdGFncy5wdXNoKGBzcy0ke3NldHRpbmdzLnNzfWApO1xuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuYnMpIHtcbiAgICAgICAgdGFncy5wdXNoKGBicy0ke3NldHRpbmdzLmJzfWApO1xuICAgIH1cbiAgICAvLyBsZXQgdGFncyA9IGdldFRhZ3Moc3RlcCkuZmlsdGVyKCh0KSA9PiAhdC5zdGFydHNXaXRoKFwic3MtXCIpICYmICF0LnN0YXJ0c1dpdGgoXCJicy1cIikpLmNvbmNhdChbYHNzLSR7c2V0dGluZ3Muc3N9YCwgYGJzLSR7c2V0dGluZ3MuYnN9YF0pXG4gICAgc3RlcC5uYW1lID0gdGFncy5qb2luKFwiIFwiKTtcbn1cbmZ1bmN0aW9uIHNlcGFyYXRlU3RlcChub2Rlcykge1xuICAgIGNvbnN0IHBhcmVudFN0ZXAgPSBmaW5kUGFyZW50KG5vZGVzWzBdLCAobikgPT4gbi5uYW1lLnN0YXJ0c1dpdGgoXCJzdGVwXCIpKTtcbiAgICBjb25zdCBmcmFtZSA9IHBhcmVudFN0ZXAucGFyZW50O1xuICAgIGNvbnN0IGluZGV4ID0gZnJhbWUuY2hpbGRyZW4uZmluZEluZGV4KChuKSA9PiBuID09IHBhcmVudFN0ZXApO1xuICAgIGlmICghcGFyZW50U3RlcCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXMsIGZyYW1lKTtcbiAgICBpbnB1dC5uYW1lID0gXCJpbnB1dFwiO1xuICAgIGNvbnN0IG5ld1N0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBmcmFtZSwgaW5kZXgpO1xuICAgIG5ld1N0ZXAubmFtZSA9IHBhcmVudFN0ZXAubmFtZTtcbn1cbmZ1bmN0aW9uIGF1dG9Gb3JtYXQoKSB7XG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSBcIlRIVU1CTkFJTFNcIik7XG4gICAgaWYgKHRodW1iUGFnZSkge1xuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gdGh1bWJQYWdlLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IFwidGh1bWJuYWlsXCIpIHx8ICF0aHVtYm5haWxGcmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGh1bWJuYWlsRnJhbWUuY2xvbmUoKTtcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSBcInRodW1ibmFpbFwiO1xuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICBpZiAob2xkTGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSBcImxlc3NvblwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gXCJ0aHVtYm5haWxcIik7XG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gXCJsZXNzb25cIik7XG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnkgPSBsZXNzb25GcmFtZS55O1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSlcbiAgICAgICAgLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDEwO1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec3RlcCBzLW11bHRpc3RlcC1yZXN1bHQvLnRlc3Qobm9kZS5uYW1lKSlcbiAgICAgICAgLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5jaGlsZHJlblswXS5uYW1lID0gXCJ0ZW1wbGF0ZVwiO1xuICAgICAgICBuLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLm5hbWUgPSBcIi9pZ25vcmVcIjtcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDYwO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVDb2RlKCkge1xuICAgIGNvbnN0IGNvZGUgPSBnZW5lcmF0ZVN3aWZ0Q29kZSgpICsgZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCk7XG4gICAgcHJpbnQoY29kZSk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVRyYW5zbGF0aW9uc0NvZGUoKSB7XG4gICAgY29uc3QgY291cnNlTmFtZSA9IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKC9DT1VSU0UtLywgXCJcIik7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWUuc3BsaXQoXCItXCIpLm1hcChjYXBpdGFsaXplKS5qb2luKFwiXCIpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9IHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSBgYDtcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09IFwiSU5ERVhcIikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGFza3MgKz0gYFwidGFzay1uYW1lICR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShwYWdlLm5hbWUuc3BsaXQoJy0nKS5qb2luKFwiIFwiKSl9XCI7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oXCIgXCIpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sIFwiXCIpO1xuICAgIGxldCBzd2lmdENvdXJzZU5hbWUgPSBjb3Vyc2VOYW1lLnNwbGl0KFwiLVwiKS5tYXAoKHMpID0+IHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpKS5qb2luKFwiXCIpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9IHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSBgYDtcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09IFwiSU5ERVhcIikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGFza3MgKz0gYCAgICAgICAgVGFzayhwYXRoOiBcIiR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIsIHBybzogdHJ1ZSksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbmxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXG4gICAgdGFza3M6IFtcbiR7dGFza3N9ICAgIF0pXG5gO1xufVxuZnVuY3Rpb24gZXhwb3J0Q291cnNlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCBsZXNzb25zID0gW107XG4gICAgICAgIGxldCB0aHVtYm5haWxzID0gW107XG4gICAgICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09IFwiVEhVTUJOQUlMU1wiKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsZXNzb24gPSBwYWdlLmNoaWxkcmVuLmZpbmQoKGYpID0+IGYubmFtZSA9PSBcImxlc3NvblwiKTtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbCA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09IFwidGh1bWJuYWlsXCIpO1xuICAgICAgICAgICAgaWYgKGxlc3Nvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0geWllbGQgbGVzc29uLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIlNWR1wiLFxuICAgICAgICAgICAgICAgICAgICAvLyBzdmdPdXRsaW5lVGV4dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHN2Z0lkQXR0cmlidXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBgJHtwYWdlLm5hbWV9LnN2Z2A7XG4gICAgICAgICAgICAgICAgbGVzc29ucy5wdXNoKHsgcGF0aCwgYnl0ZXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGh1bWJuYWlsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB5aWVsZCB0aHVtYm5haWwuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiUE5HXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiV0lEVEhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiA2MDAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGB0aHVtYm5haWxzLyR7cGFnZS5uYW1lLnRvTG93ZXJDYXNlKCl9LnBuZ2A7XG4gICAgICAgICAgICAgICAgdGh1bWJuYWlscy5wdXNoKHsgcGF0aCwgYnl0ZXMgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZW1pdChcImV4cG9ydFppcFwiLCB7IHJvb3ROYW1lOiBmaWdtYS5yb290Lm5hbWUsIGxlc3NvbnM6IGxlc3NvbnMsIHRodW1ibmFpbHM6IHRodW1ibmFpbHMgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5pbXBvcnQgeyBwcmludCwgZ2V0VGFncywgZmluZEFsbCwgZmluZEZpcnN0IH0gZnJvbSAnLi91dGlsJztcbm9uKFwibGludENvdXJzZVwiLCAoKSA9PiB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludENvdXJzZSgpO1xuICAgIHByaW50RXJyb3JzKCk7XG59KTtcbm9uKFwibGludFBhZ2VcIiwgKCkgPT4ge1xuICAgIGVycm9ycyA9IFtdO1xuICAgIGxpbnRQYWdlKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICBwcmludEVycm9ycygpO1xufSk7XG5leHBvcnQgbGV0IGVycm9ycyA9IFtdO1xubGV0IHpvb21TY2FsZSA9IDE7XG5sZXQgbWF4QnMgPSAxMi44O1xubGV0IG9yZGVyID0gXCJzdGVwc1wiO1xudmFyIEVycm9yTGV2ZWw7XG4oZnVuY3Rpb24gKEVycm9yTGV2ZWwpIHtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJFUlJPUlwiXSA9IDBdID0gXCJFUlJPUlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIldBUk5cIl0gPSAxXSA9IFwiV0FSTlwiO1xuICAgIEVycm9yTGV2ZWxbRXJyb3JMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xufSkoRXJyb3JMZXZlbCB8fCAoRXJyb3JMZXZlbCA9IHt9KSk7XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RXJyb3IoaW5kZXgpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICgoX2EgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFnZSkge1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IGVycm9yc1tpbmRleF0ucGFnZTtcbiAgICB9XG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1swXS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbaW5kZXhdLm5vZGVdO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludEVycm9ycygpIHtcbiAgICBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpO1xuICAgIHNlbGVjdEVycm9yKDApO1xuICAgIGxldCB0ZXh0ID0gZXJyb3JzLm1hcCgoZSkgPT4geyB2YXIgX2EsIF9iLCBfYzsgcmV0dXJuIGAke0Vycm9yTGV2ZWxbZS5sZXZlbF19XFx0fCAke2UuZXJyb3J9IHwgUEFHRTokeygoX2EgPSBlLnBhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lKSB8fCBcIlwifSAkeyhfYiA9IGUubm9kZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnR5cGV9OiR7KChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLm5hbWUpIHx8IFwiXCJ9YDsgfSkuam9pbihcIlxcblwiKTtcbiAgICB0ZXh0ICs9IFwiXFxuRG9uZVwiO1xuICAgIHByaW50KHRleHQpO1xufVxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGlmICghdmFsKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxpbnRDb3Vyc2UoKSB7XG4gICAgYXNzZXJ0KC9eQ09VUlNFLVthLXpcXC0wLTldKyQvLnRlc3QoZmlnbWEucm9vdC5uYW1lKSwgYENvdXJzZSBuYW1lICcke2ZpZ21hLnJvb3QubmFtZX0nIG11c3QgbWF0Y2ggQ09VUlNFLVthLXpcXC0wLTldK2ApO1xuICAgIGNvbnN0IGluZGV4ID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUgPT0gXCJJTkRFWFwiKTtcbiAgICBpZiAoYXNzZXJ0KCEhaW5kZXgsIGBNdXN0IGhhdmUgJ0lOREVYJyBwYWdlYCkpIHtcbiAgICAgICAgbGludEluZGV4KGluZGV4KTtcbiAgICB9XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGxpbnRQYWdlKHBhZ2UpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGxpbnRJbmRleChwYWdlKSB7XG4gICAgaWYgKCFhc3NlcnQocGFnZS5jaGlsZHJlbi5sZW5ndGggPT0gMSwgYEluZGV4IHBhZ2UgbXVzdCBjb250YWluIGV4YWN0bHkgMSBlbGVtZW50YCwgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgYE11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdgLCBwYWdlKTtcbiAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIHBhZ2UuY2hpbGRyZW5bMF0pO1xufVxuZnVuY3Rpb24gbGludFBhZ2UocGFnZSkge1xuICAgIGlmICgvXlxcL3xeSU5ERVgkLy50ZXN0KHBhZ2UubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFzc2VydCgvXlthLXpcXC0wLTldKyQvLnRlc3QocGFnZS5uYW1lKSwgYFBhZ2UgbmFtZSAnJHtwYWdlLm5hbWV9JyBtdXN0IG1hdGNoIFthLXpcXC0wLTldKy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9edGh1bWJuYWlsJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgYE11c3QgY29udGFpbiBleGFjdGx5IDEgJ3RodW1ibmFpbCdgLCBwYWdlKTtcbiAgICBhc3NlcnQocGFnZS5jaGlsZHJlbi5maWx0ZXIoKHMpID0+IC9ebGVzc29uJC8udGVzdChzLm5hbWUpKS5sZW5ndGggPT0gMSwgYE11c3QgY29udGFpbiBleGFjdGx5IDEgJ2xlc3NvbidgLCBwYWdlKTtcbiAgICBmb3IgKGxldCBub2RlIG9mIHBhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKG5vZGUubmFtZSA9PSBcImxlc3NvblwiKSB7XG4gICAgICAgICAgICBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5vZGUubmFtZSA9PSBcInRodW1ibmFpbFwiKSB7XG4gICAgICAgICAgICBsaW50VGh1bWJuYWlsKHBhZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KC9eXFwvLy50ZXN0KG5vZGUubmFtZSksIGBNdXN0IGJlICd0aHVtYm5haWwnIG9yICdsZXNzb24nLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gbGludFRodW1ibmFpbChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09IFwiRlJBTUVcIiwgYE11c3QgYmUgJ0ZSQU1FJyB0eXBlYCwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsIGBNdXN0IGJlIG9wYXF1ZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDQwMCAmJiBub2RlLmhlaWdodCA9PSA0MDAsIGBNdXN0IGJlIDQwMHg0MDBgLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRUYXNrRnJhbWUocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSBcIkZSQU1FXCIsIGBNdXN0IGJlICdGUkFNRScgdHlwZWAsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCBgTXVzdCBiZSB2aXNpYmxlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUud2lkdGggPT0gMTM2NiAmJiBub2RlLmhlaWdodCA9PSAxMDI0LCBgTXVzdCBiZSAxMzY2eDEwMjRgLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgc2V0dGluZ3MgPSBub2RlLmNoaWxkcmVuLmZpbmQoKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKFwic2V0dGluZ3NcIikpO1xuICAgIGlmIChzZXR0aW5ncykge1xuICAgICAgICBsaW50U2V0dGluZ3MocGFnZSwgc2V0dGluZ3MpO1xuICAgIH1cbiAgICBsZXQgb3JkZXJOdW1iZXJzID0ge307XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApO1xuICAgICAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm91bmQgPSAvXm8tKFxcZCspJC8uZXhlYyh0YWcpO1xuICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG8gPSBmb3VuZFsxXTtcbiAgICAgICAgICAgIGFzc2VydCghb3JkZXJOdW1iZXJzW29dLCBgTXVzdCBoYXZlIHVuaXF1ZSAke3RhZ30gdmFsdWVzYCwgcGFnZSwgc3RlcCk7XG4gICAgICAgICAgICBpZiAobykge1xuICAgICAgICAgICAgICAgIG9yZGVyTnVtYmVyc1tvXSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBzdGVwIG9mIG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHN0ZXAubmFtZS5zdGFydHNXaXRoKFwic3RlcFwiKSkge1xuICAgICAgICAgICAgbGludFN0ZXAocGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXN0ZXAubmFtZS5zdGFydHNXaXRoKFwic2V0dGluZ3NcIikpIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgYE11c3QgYmUgJ3NldHRpbmdzJyBvciAnc3RlcCdgLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3NlcnQobWF4QnMgPiAoem9vbVNjYWxlIC0gMSkgKiAxMi44LCBgem9vbS1zY2FsZSAke3pvb21TY2FsZX0gbXVzdCBiZSAke01hdGguY2VpbChtYXhCcyAvIDEyLjgpfSBmb3IgbWF4IGJzICR7bWF4QnN9IHVzZWRgLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRTdGVwKHBhZ2UsIG5vZGUpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSBcIkdST1VQXCIsIGBNdXN0IGJlICdHUk9VUCcgdHlwZSdgLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXnN0ZXAkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxecy1tdWx0aXN0ZXAtYmckfF5icnVzaC1uYW1lLVxcdyskfF5jbGVhci1sYXllci1cXGQrJHxec3MtXFxkKyR8XmJzLVxcZCskfF5vLVxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgICAgICAvLyBhc3NlcnQoIS9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1iZyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyBpcyBvYnNvbGV0ZWAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuV0FSTik7ICAgICAgICBcbiAgICB9KTtcbiAgICBjb25zdCBiZyA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1iZyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicnVzaCA9IHRhZ3MuZmluZCgocykgPT4gL15zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBzcyA9IHBhcnNlSW50KChfYSA9IHRhZ3MuZmluZCgocykgPT4gL15zcy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXBsYWNlKFwic3MtXCIsIFwiXCIpKTtcbiAgICBjb25zdCBvID0gdGFncy5maW5kKChzKSA9PiAvXm8tXFxkKyQvLnRlc3QocykpO1xuICAgIGNvbnN0IGJzID0gcGFyc2VJbnQoKF9iID0gdGFncy5maW5kKChzKSA9PiAvXmJzLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlcGxhY2UoXCJicy1cIiwgXCJcIikpO1xuICAgIG1heEJzID0gTWF0aC5tYXgoYnMgPyBicyA6IG1heEJzLCBtYXhCcyk7XG4gICAgYXNzZXJ0KCEoYmcgJiYgc3MpLCBcIlNob3VsZCBub3QgdXNlIGJnK3NzXCIsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KCFzcyB8fCBzcyA+PSAxNSwgXCJzcyBtdXN0IGJlID49IDE1XCIsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghc3MgfHwgIWJzIHx8IHNzID4gYnMsIFwic3MgbXVzdCBiZSA+IGJzXCIsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPD0gem9vbVNjYWxlICogMTIuOCwgYGJzIG11c3QgYmUgPD0gJHt6b29tU2NhbGUgKiAxMi44fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA+PSB6b29tU2NhbGUgKiAwLjQ0LCBgYnMgbXVzdCBiZSA+PSAke3pvb21TY2FsZSAqIDAuNDR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gXCJsYXllcnNcIiwgYCR7b30gbXVzdCBiZSB1c2VkIG9ubHkgd2l0aCBzZXR0aW5ncyBvcmRlci1sYXllcnNgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQob3JkZXIgIT09IFwibGF5ZXJzXCIgfHwgISFvLCBgTXVzdCBoYXZlIG8tTiBvcmRlciBudW1iZXJgLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCBmZiA9IGZpbmRGaXJzdChub2RlLCAobikgPT4gbi5maWxscyAmJiBuLmZpbGxzWzBdKTtcbiAgICBhc3NlcnQoIWJnIHx8IGZmLCBcImJnIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aG91dCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghYnJ1c2ggfHwgIWZmLCBcImJydXNoIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAobi5uYW1lID09IFwiaW5wdXRcIikge1xuICAgICAgICAgICAgbGludElucHV0KHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG4ubmFtZSA9IFwidGVtcGxhdGVcIikge1xuICAgICAgICAgICAgLy8gbGludCB0ZW1wbGF0ZVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBcIk11c3QgYmUgJ2lucHV0JyBvciAndGVtcGxhdGUnXCIsIHBhZ2UsIG4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgYmxpbmtOb2RlcyA9IGZpbmRBbGwobm9kZSwgKG4pID0+IGdldFRhZ3MobikuZmluZCgodCkgPT4gL15ibGluayQvLnRlc3QodCkpICE9PSB1bmRlZmluZWQpLmZsYXRNYXAoZGVlcE5vZGVzKTtcbiAgICBjb25zdCBmaWxsZWROb2RlID0gYmxpbmtOb2Rlcy5maW5kKChuKSA9PiBuLmZpbGxzWzBdKTtcbiAgICBhc3NlcnQoYmxpbmtOb2Rlcy5sZW5ndGggPT0gMCB8fCAhIWZpbGxlZE5vZGUgfHwgYmxpbmtOb2Rlcy5sZW5ndGggPiAzLCBgU2hvdWxkIHVzZSBkcmF3LWxpbmUgaWYgPCA0IGxpbmVzYCwgcGFnZSwgYmxpbmtOb2Rlc1swXSwgRXJyb3JMZXZlbC5JTkZPKTtcbn1cbmZ1bmN0aW9uIGRlZXBOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIHJldHVybiBbbm9kZV07XG4gICAgfVxuICAgIHJldHVybiBub2RlLmNoaWxkcmVuLmZsYXRNYXAoKG4pID0+IGRlZXBOb2RlcyhuKSk7XG59XG5mdW5jdGlvbiBsaW50U2V0dGluZ3MocGFnZSwgbm9kZSkge1xuICAgIHZhciBfYTtcbiAgICBhc3NlcnQobm9kZS50eXBlID09IFwiRUxMSVBTRVwiLCBgTXVzdCBiZSAnRUxMSVBTRScgdHlwZSdgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsIGBNdXN0IGJlIG9wYXF1ZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsIGBNdXN0IGJlIHZpc2libGVgLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15zZXR0aW5ncyR8XmNhcHR1cmUtY29sb3IkfF56b29tLXNjYWxlLVxcZCskfF5vcmRlci1sYXllcnMkfF5zLW11bHRpc3RlcC1iZy1cXGQrJHxecy1tdWx0aXN0ZXAtcmVzdWx0JHxecy1tdWx0aXN0ZXAkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxeYnJ1c2gtbmFtZS1cXHcrJHxec3MtXFxkKyR8XmJzLVxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGlmICh0YWdzLmZpbmQoKHRhZykgPT4gL15vcmRlci1sYXllcnMkLy50ZXN0KHRhZykpKSB7XG4gICAgICAgIG9yZGVyID0gXCJsYXllcnNcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9yZGVyID0gXCJzdGVwc1wiO1xuICAgIH1cbiAgICB6b29tU2NhbGUgPSBwYXJzZUludCgoKF9hID0gdGFncy5maW5kKChzKSA9PiAvXnpvb20tc2NhbGUtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZShcInpvb20tc2NhbGUtXCIsIFwiXCIpKSB8fCBcIjFcIik7XG4gICAgYXNzZXJ0KHpvb21TY2FsZSA+PSAxICYmIHpvb21TY2FsZSA8PSA1LCBgTXVzdCBiZSAxIDw9IHpvb20tc2NhbGUgPD0gNSAoJHt6b29tU2NhbGV9KWAsIHBhZ2UsIG5vZGUpO1xufVxuZnVuY3Rpb24gbGludElucHV0KHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gXCJHUk9VUFwiLCBgTXVzdCBiZSAnR1JPVVAnIHR5cGUnYCwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsIGBNdXN0IGJlIG9wYXF1ZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsIGBNdXN0IGJlIHZpc2libGVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS5uYW1lID09IFwiaW5wdXRcIiwgYE11c3QgYmUgJ2lucHV0J2AsIHBhZ2UsIG5vZGUpO1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBpZiAoL0dST1VQfEJPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SfFRFWFQvLnRlc3Qodi50eXBlKSkge1xuICAgICAgICAgICAgbGludFZlY3RvcihwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgYE11c3QgYmUgJ0dST1VQL1ZFQ1RPUi9SRUNUQU5HTEUvRUxMSVBTRS9URVhUJyB0eXBlYCwgcGFnZSwgdik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGxpbnRWZWN0b3IocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCBgTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eXFwvfF5kcmF3LWxpbmUkfF5ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmRcXGQrJHxeclxcZCskfF5mbGlwJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd24uIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGxldCBmaWxscyA9IG5vZGUuZmlsbHM7XG4gICAgbGV0IHN0cm9rZXMgPSBub2RlLnN0cm9rZXM7XG4gICAgYXNzZXJ0KCFmaWxscy5sZW5ndGggfHwgIXN0cm9rZXMubGVuZ3RoLCBgTXVzdCBub3QgaGF2ZSBmaWxsK3N0cm9rZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghc3Ryb2tlcy5sZW5ndGggfHwgL1JPVU5EfE5PTkUvLnRlc3QoU3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKSksIGBTdHJva2UgY2FwcyBtdXN0IGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VDYXApfSdgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLkVSUk9SKTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IG5vZGUuc3Ryb2tlSm9pbiA9PSBcIlJPVU5EXCIsIGBTdHJva2Ugam9pbnMgc2hvdWxkIGJlICdST1VORCcgYnV0IGFyZSAnJHtTdHJpbmcobm9kZS5zdHJva2VKb2luKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBjb25zdCByZ2J0ID0gdGFncy5maW5kKChzKSA9PiAvXnJnYi10ZW1wbGF0ZSQvLnRlc3QocykpO1xuICAgIGNvbnN0IGFuaW0gPSB0YWdzLmZpbmQoKHMpID0+IC9eYmxpbmskfF5kcmF3LWxpbmUkLy50ZXN0KHMpKTtcbiAgICBhc3NlcnQoIXJnYnQgfHwgISFhbmltLCBgTXVzdCBoYXZlICdibGluaycgb3IgJ2RyYXctbGluZSdgLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRHcm91cChwYWdlLCBub2RlKSB7XG4gICAgYXNzZXJ0KCEvQk9PTEVBTl9PUEVSQVRJT04vLnRlc3Qobm9kZS50eXBlKSwgYE5vdGljZSBCT09MRUFOX09QRVJBVElPTmAsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCBgTXVzdCBiZSB2aXNpYmxlYCwgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIGFzc2VydCh0YWdzLmxlbmd0aCA+IDAsIGBOYW1lIG11c3Qgbm90IGJlIGVtcHR5LiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15ibGluayR8XnJnYi10ZW1wbGF0ZSR8XmJsaW5rJHxeZFxcZCskfF5yXFxkKyQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duYCwgcGFnZSwgbm9kZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJC8udGVzdChzKSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgYE11c3QgaGF2ZSAnYmxpbmsnYCwgcGFnZSwgbm9kZSk7XG59XG4vLyBubyBoaWRkZW4gZmlsbC9zdHJva2Vcbi8vIG5vIGVmZmVjdHNcbiIsImltcG9ydCB7IGVtaXQgfSBmcm9tICcuLi9ldmVudHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICBhcnIucHVzaChub2RlKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KGNoaWxkcmVuLmZsYXRNYXAoKHApID0+IGZpbmRBbGwocCwgZikpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGFyZW50KG5vZGUsIGYpIHtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgaWYgKG5vZGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50KG5vZGUucGFyZW50LCBmKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZEZpcnN0KG5vZGUsIGYpIHtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBmb3IgKGxldCBwIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgICAgICBsZXQgZm91bmQgPSBmaW5kRmlyc3QocCwgZik7XG4gICAgICAgICAgICBpZiAoZm91bmQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZ3Mobm9kZSkge1xuICAgIHJldHVybiBub2RlLm5hbWUuc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmludCh0ZXh0KSB7XG4gICAgZmlnbWEudWkucmVzaXplKDcwMCwgNDAwKTtcbiAgICBlbWl0KFwicHJpbnRcIiwgdGV4dCk7XG59XG5leHBvcnQgY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=