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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
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

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.ts");
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
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("autoFormat", autoFormat);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("selectError", selectError);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("updateDisplay", updateDisplay);
Object(_events__WEBPACK_IMPORTED_MODULE_0__["on"])("updateTags", updateTags);
function getOrder(step) {
    let o = parseInt(getTags(step).find((t) => t.startsWith("o-")).replace("o-", ""));
    return isNaN(o) ? 9999 : o;
}
function getTag(step, tag) {
    const v = getTags(step).find((t) => t.startsWith(tag));
    return v ? v.replace(tag, "") : "0";
}
function stepsByOrder(lesson) {
    return lesson.children
        .filter((n) => getTags(n).includes("step"))
        .sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
}
function deleteTmp() {
    figma.currentPage.findAll((el) => el.name.startsWith("tmp-")).forEach((el) => el.remove());
}
function updateDisplay(settings) {
    const { displayMode, stepNumber } = settings;
    const lesson = figma.currentPage.children.find((el) => el.name == "lesson");
    const step = stepsByOrder(lesson)[stepNumber - 1];
    figma.currentPage.selection = [step];
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])("updateTags", { ss: parseInt(getTag(step, "ss-")), bs: parseInt(getTag(step, "bs-")) });
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
function updateTags(settings) {
    const lesson = figma.currentPage.children.find((el) => el.name == "lesson");
    const step = stepsByOrder(lesson)[settings.stepNumber - 1];
    // const ss = settings.ss || parseInt(getTag(step, "ss-"))
    // const bs = settings.bs || parseInt(getTag(step, "bs-"))
    let tags = getTags(step).filter((t) => !t.startsWith("ss-") && !t.startsWith("bs-"));
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
    const parentStep = findParent(nodes[0], (n) => n.name.startsWith("step"));
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
    findAll(figma.root, (node) => /^settings/.test(node.name))
        .forEach((n) => {
        n.resize(40, 40);
        n.x = 10;
        n.y = 10;
    });
    findAll(figma.root, (node) => /^step s-multistep-result/.test(node.name))
        .forEach((n) => {
        n.children[0].name = "template";
        n.children[0].children[0].name = "/ignore";
        n.resize(40, 40);
        n.x = 10;
        n.y = 60;
    });
}
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
function findParent(node, f) {
    if (f(node)) {
        return node;
    }
    if (node.parent) {
        return findParent(node.parent, f);
    }
}
function generateCode() {
    const code = generateSwiftCode() + generateTranslationsCode();
    print(code);
}
function print(text) {
    figma.ui.resize(700, 400);
    Object(_events__WEBPACK_IMPORTED_MODULE_0__["emit"])("print", text);
}
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function generateTranslationsCode() {
    const courseName = figma.root.name.replace(/COURSE-/, "");
    let swiftCourseName = courseName.split("-").map(capitalize).join("");
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1);
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "INDEX") {
            continue;
        }
        tasks += `"task-name ${courseName}/${page.name}" = "${capitalize(page.name.split('-').join(" "))}";\n`;
    }
    return `
"course-name ${courseName}" = "${capitalize(courseName.split('-').join(" "))}";
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
    print(text);
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
        const tags = getTags(step);
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
    const tags = getTags(node);
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
    const ff = findFirst(node, (n) => n.fills && n.fills[0]);
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
    const blinkNodes = findAll(node, (n) => getTags(n).find((t) => /^blink$/.test(t)) !== undefined).flatMap(deepNodes);
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
    const tags = getTags(node);
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
function getTags(node) {
    return node.name.split(" ").filter(Boolean);
}
function lintVector(page, node) {
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    let tags = getTags(node);
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
    let tags = getTags(node);
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDTztBQUNQLGtCQUFrQixVQUFVO0FBQzVCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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SSxxR0FBcUcsd0JBQXdCO0FBQzdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRkFBaUYsSUFBSTtBQUNyRixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvcGx1Z2luL2NvbnRyb2xsZXIudHNcIik7XG4iLCJjb25zdCBldmVudEhhbmRsZXJzID0ge307XG5sZXQgY3VycmVudElkID0gMDtcbmV4cG9ydCBmdW5jdGlvbiBvbihuYW1lLCBoYW5kbGVyKSB7XG4gICAgY29uc3QgaWQgPSBgJHtjdXJyZW50SWR9YDtcbiAgICBjdXJyZW50SWQgKz0gMTtcbiAgICBldmVudEhhbmRsZXJzW2lkXSA9IHsgaGFuZGxlciwgbmFtZSB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSBldmVudEhhbmRsZXJzW2lkXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uY2UobmFtZSwgaGFuZGxlcikge1xuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgcmV0dXJuIG9uKG5hbWUsIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGlmIChkb25lID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIGhhbmRsZXIoLi4uYXJncyk7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgZW1pdCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnXG4gICAgPyBmdW5jdGlvbiAobmFtZSwgLi4uYXJncykge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShbbmFtZSwgLi4uYXJnc10pO1xuICAgIH1cbiAgICA6IGZ1bmN0aW9uIChuYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgcGx1Z2luTWVzc2FnZTogW25hbWUsIC4uLmFyZ3NdXG4gICAgICAgIH0sICcqJyk7XG4gICAgfTtcbmZ1bmN0aW9uIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKSB7XG4gICAgZm9yIChjb25zdCBpZCBpbiBldmVudEhhbmRsZXJzKSB7XG4gICAgICAgIGlmIChldmVudEhhbmRsZXJzW2lkXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICBldmVudEhhbmRsZXJzW2lkXS5oYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKFtuYW1lLCAuLi5hcmdzXSkge1xuICAgICAgICBpbnZva2VFdmVudEhhbmRsZXIobmFtZSwgYXJncyk7XG4gICAgfTtcbn1cbmVsc2Uge1xuICAgIHdpbmRvdy5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbbmFtZSwgLi4uYXJnc10gPSBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2U7XG4gICAgICAgIGludm9rZUV2ZW50SGFuZGxlcihuYW1lLCBhcmdzKTtcbiAgICB9O1xufVxuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBlbWl0LCBvbiB9IGZyb20gJy4uL2V2ZW50cyc7XG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkucmVzaXplKDM0MCwgNDUwKTtcbm9uKFwic2VwYXJhdGVTdGVwXCIsICgpID0+IHNlcGFyYXRlU3RlcChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pKTtcbm9uKFwiZXhwb3J0Q291cnNlXCIsIGV4cG9ydENvdXJzZSk7XG5vbihcImdlbmVyYXRlQ29kZVwiLCBnZW5lcmF0ZUNvZGUpO1xub24oXCJsaW50Q291cnNlXCIsICgpID0+IHtcbiAgICBlcnJvcnMgPSBbXTtcbiAgICBsaW50Q291cnNlKCk7XG4gICAgcHJpbnRFcnJvcnMoKTtcbn0pO1xub24oXCJsaW50UGFnZVwiLCAoKSA9PiB7XG4gICAgZXJyb3JzID0gW107XG4gICAgbGludFBhZ2UoZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIHByaW50RXJyb3JzKCk7XG59KTtcbm9uKFwiYXV0b0Zvcm1hdFwiLCBhdXRvRm9ybWF0KTtcbm9uKFwic2VsZWN0RXJyb3JcIiwgc2VsZWN0RXJyb3IpO1xub24oXCJ1cGRhdGVEaXNwbGF5XCIsIHVwZGF0ZURpc3BsYXkpO1xub24oXCJ1cGRhdGVUYWdzXCIsIHVwZGF0ZVRhZ3MpO1xuZnVuY3Rpb24gZ2V0T3JkZXIoc3RlcCkge1xuICAgIGxldCBvID0gcGFyc2VJbnQoZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgoXCJvLVwiKSkucmVwbGFjZShcIm8tXCIsIFwiXCIpKTtcbiAgICByZXR1cm4gaXNOYU4obykgPyA5OTk5IDogbztcbn1cbmZ1bmN0aW9uIGdldFRhZyhzdGVwLCB0YWcpIHtcbiAgICBjb25zdCB2ID0gZ2V0VGFncyhzdGVwKS5maW5kKCh0KSA9PiB0LnN0YXJ0c1dpdGgodGFnKSk7XG4gICAgcmV0dXJuIHYgPyB2LnJlcGxhY2UodGFnLCBcIlwiKSA6IFwiMFwiO1xufVxuZnVuY3Rpb24gc3RlcHNCeU9yZGVyKGxlc3Nvbikge1xuICAgIHJldHVybiBsZXNzb24uY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigobikgPT4gZ2V0VGFncyhuKS5pbmNsdWRlcyhcInN0ZXBcIikpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRPcmRlcihhKSAtIGdldE9yZGVyKGIpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGVsZXRlVG1wKCkge1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwoKGVsKSA9PiBlbC5uYW1lLnN0YXJ0c1dpdGgoXCJ0bXAtXCIpKS5mb3JFYWNoKChlbCkgPT4gZWwucmVtb3ZlKCkpO1xufVxuZnVuY3Rpb24gdXBkYXRlRGlzcGxheShzZXR0aW5ncykge1xuICAgIGNvbnN0IHsgZGlzcGxheU1vZGUsIHN0ZXBOdW1iZXIgfSA9IHNldHRpbmdzO1xuICAgIGNvbnN0IGxlc3NvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuLmZpbmQoKGVsKSA9PiBlbC5uYW1lID09IFwibGVzc29uXCIpO1xuICAgIGNvbnN0IHN0ZXAgPSBzdGVwc0J5T3JkZXIobGVzc29uKVtzdGVwTnVtYmVyIC0gMV07XG4gICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW3N0ZXBdO1xuICAgIGVtaXQoXCJ1cGRhdGVUYWdzXCIsIHsgc3M6IHBhcnNlSW50KGdldFRhZyhzdGVwLCBcInNzLVwiKSksIGJzOiBwYXJzZUludChnZXRUYWcoc3RlcCwgXCJicy1cIikpIH0pO1xuICAgIHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcbiAgICAgICAgY2FzZSBcImFsbFwiOlxuICAgICAgICAgICAgZGVsZXRlVG1wKCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY3VycmVudFwiOlxuICAgICAgICAgICAgZGVsZXRlVG1wKCk7XG4gICAgICAgICAgICBsZXNzb24uY2hpbGRyZW4uZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0ZXAudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGVwLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwcmV2aW91c1wiOlxuICAgICAgICAgICAgZGVsZXRlVG1wKCk7XG4gICAgICAgICAgICBzdGVwc0J5T3JkZXIobGVzc29uKS5mb3JFYWNoKChzdGVwLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgc3RlcC52aXNpYmxlID0gaSA8IHN0ZXBOdW1iZXIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidGVtcGxhdGVcIjpcbiAgICAgICAgICAgIGRlbGV0ZVRtcCgpO1xuICAgICAgICAgICAgbGVzc29uLmNoaWxkcmVuLmZvckVhY2goKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBzdGVwLmZpbmRDaGlsZCgoZykgPT4gZy5uYW1lID09IFwiaW5wdXRcIik7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGlucHV0LmNsb25lKCk7XG4gICAgICAgICAgICB0ZW1wbGF0ZS5uYW1lID0gXCJ0bXAtdGVtcGxhdGVcIjtcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlLmZpbmRBbGwoKGVsKSA9PiBlbC50eXBlID09IFwiR1JPVVBcIikuZm9yRWFjaCgoZWwpID0+IChmaWdtYSBhcyBhbnkpLnVuZ3JvdXAoZWwpKVxuICAgICAgICAgICAgdGVtcGxhdGUuZmluZEFsbCgoZWwpID0+IC9SRUNUQU5HTEV8RUxMSVBTRXxWRUNUT1J8VEVYVC8udGVzdChlbC50eXBlKSkuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuc3Ryb2tlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsLnN0cm9rZXMgPSBbeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiB7IHI6IDAsIGc6IDAsIGI6IDEgfSB9XTtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3Ryb2tlV2VpZ2h0ID0gcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsIFwic3MtXCIpKSB8fCA1MDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGluayA9IGVsLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIHBpbmsuc3Ryb2tlcyA9IFt7IHR5cGU6IFwiU09MSURcIiwgY29sb3I6IHsgcjogMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgICAgICAgICBwaW5rLnN0cm9rZVdlaWdodCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHBpbmsubmFtZSA9IFwicGluayBcIiArIGVsLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRlbXBsYXRlLmluc2VydENoaWxkKDAsIHBpbmspXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLmFwcGVuZENoaWxkKHBpbmspO1xuICAgICAgICAgICAgICAgICAgICAvLyBjbG9uZSBlbGVtZW50IGhlcmUgYW5kIGdpdmUgaGltIHRoaW4gcGluayBzdHJva2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVsLmZpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZWwuZmlsbHMgPSBbeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiB7IHI6IDAuMSwgZzogMCwgYjogMSB9IH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGVzc29uLmFwcGVuZENoaWxkKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIHRlbXBsYXRlLnggPSBpbnB1dC5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXSAtIGxlc3Nvbi5hYnNvbHV0ZVRyYW5zZm9ybVswXVsyXTtcbiAgICAgICAgICAgIHRlbXBsYXRlLnkgPSBpbnB1dC5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXSAtIGxlc3Nvbi5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVRhZ3Moc2V0dGluZ3MpIHtcbiAgICBjb25zdCBsZXNzb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbi5maW5kKChlbCkgPT4gZWwubmFtZSA9PSBcImxlc3NvblwiKTtcbiAgICBjb25zdCBzdGVwID0gc3RlcHNCeU9yZGVyKGxlc3Nvbilbc2V0dGluZ3Muc3RlcE51bWJlciAtIDFdO1xuICAgIC8vIGNvbnN0IHNzID0gc2V0dGluZ3Muc3MgfHwgcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsIFwic3MtXCIpKVxuICAgIC8vIGNvbnN0IGJzID0gc2V0dGluZ3MuYnMgfHwgcGFyc2VJbnQoZ2V0VGFnKHN0ZXAsIFwiYnMtXCIpKVxuICAgIGxldCB0YWdzID0gZ2V0VGFncyhzdGVwKS5maWx0ZXIoKHQpID0+ICF0LnN0YXJ0c1dpdGgoXCJzcy1cIikgJiYgIXQuc3RhcnRzV2l0aChcImJzLVwiKSk7XG4gICAgaWYgKHNldHRpbmdzLnNzKSB7XG4gICAgICAgIHRhZ3MucHVzaChgc3MtJHtzZXR0aW5ncy5zc31gKTtcbiAgICB9XG4gICAgaWYgKHNldHRpbmdzLmJzKSB7XG4gICAgICAgIHRhZ3MucHVzaChgYnMtJHtzZXR0aW5ncy5ic31gKTtcbiAgICB9XG4gICAgLy8gbGV0IHRhZ3MgPSBnZXRUYWdzKHN0ZXApLmZpbHRlcigodCkgPT4gIXQuc3RhcnRzV2l0aChcInNzLVwiKSAmJiAhdC5zdGFydHNXaXRoKFwiYnMtXCIpKS5jb25jYXQoW2Bzcy0ke3NldHRpbmdzLnNzfWAsIGBicy0ke3NldHRpbmdzLmJzfWBdKVxuICAgIHN0ZXAubmFtZSA9IHRhZ3Muam9pbihcIiBcIik7XG59XG5mdW5jdGlvbiBzZXBhcmF0ZVN0ZXAobm9kZXMpIHtcbiAgICBjb25zdCBwYXJlbnRTdGVwID0gZmluZFBhcmVudChub2Rlc1swXSwgKG4pID0+IG4ubmFtZS5zdGFydHNXaXRoKFwic3RlcFwiKSk7XG4gICAgY29uc3QgZnJhbWUgPSBwYXJlbnRTdGVwLnBhcmVudDtcbiAgICBjb25zdCBpbmRleCA9IGZyYW1lLmNoaWxkcmVuLmZpbmRJbmRleCgobikgPT4gbiA9PSBwYXJlbnRTdGVwKTtcbiAgICBpZiAoIXBhcmVudFN0ZXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnB1dCA9IGZpZ21hLmdyb3VwKG5vZGVzLCBmcmFtZSk7XG4gICAgaW5wdXQubmFtZSA9IFwiaW5wdXRcIjtcbiAgICBjb25zdCBuZXdTdGVwID0gZmlnbWEuZ3JvdXAoW2lucHV0XSwgZnJhbWUsIGluZGV4KTtcbiAgICBuZXdTdGVwLm5hbWUgPSBwYXJlbnRTdGVwLm5hbWU7XG59XG5mdW5jdGlvbiBhdXRvRm9ybWF0KCkge1xuICAgIGNvbnN0IHRodW1iUGFnZSA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUSFVNQk5BSUxTXCIpO1xuICAgIGlmICh0aHVtYlBhZ2UpIHtcbiAgICAgICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHRodW1iUGFnZS5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgICAgIGlmIChwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBcInRodW1ibmFpbFwiKSB8fCAhdGh1bWJuYWlsRnJhbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRodW1ibmFpbEZyYW1lLmNsb25lKCk7XG4gICAgICAgICAgICBjbG9uZS5uYW1lID0gXCJ0aHVtYm5haWxcIjtcbiAgICAgICAgICAgIHAuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmlnbWEucm9vdC5jaGlsZHJlbi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgIGNvbnN0IG9sZExlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gcC5uYW1lKTtcbiAgICAgICAgaWYgKG9sZExlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICBvbGRMZXNzb25GcmFtZS5uYW1lID0gXCJsZXNzb25cIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aHVtYm5haWxGcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IFwidGh1bWJuYWlsXCIpO1xuICAgICAgICBjb25zdCBsZXNzb25GcmFtZSA9IHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IFwibGVzc29uXCIpO1xuICAgICAgICBpZiAoIXRodW1ibmFpbEZyYW1lIHx8ICFsZXNzb25GcmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnggPSBsZXNzb25GcmFtZS54IC0gNDQwO1xuICAgICAgICB0aHVtYm5haWxGcmFtZS55ID0gbGVzc29uRnJhbWUueTtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnNldHRpbmdzLy50ZXN0KG5vZGUubmFtZSkpXG4gICAgICAgIC5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSAxMDtcbiAgICB9KTtcbiAgICBmaW5kQWxsKGZpZ21hLnJvb3QsIChub2RlKSA9PiAvXnN0ZXAgcy1tdWx0aXN0ZXAtcmVzdWx0Ly50ZXN0KG5vZGUubmFtZSkpXG4gICAgICAgIC5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIG4uY2hpbGRyZW5bMF0ubmFtZSA9IFwidGVtcGxhdGVcIjtcbiAgICAgICAgbi5jaGlsZHJlblswXS5jaGlsZHJlblswXS5uYW1lID0gXCIvaWdub3JlXCI7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSA2MDtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICBhcnIucHVzaChub2RlKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KGNoaWxkcmVuLmZsYXRNYXAoKHApID0+IGZpbmRBbGwocCwgZikpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn1cbmZ1bmN0aW9uIGZpbmRGaXJzdChub2RlLCBmKSB7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgcCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gZmluZEZpcnN0KHAsIGYpO1xuICAgICAgICAgICAgaWYgKGZvdW5kKVxuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZS5wYXJlbnQsIGYpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xuICAgIHByaW50KGNvZGUpO1xufVxuZnVuY3Rpb24gcHJpbnQodGV4dCkge1xuICAgIGZpZ21hLnVpLnJlc2l6ZSg3MDAsIDQwMCk7XG4gICAgZW1pdChcInByaW50XCIsIHRleHQpO1xufVxuY29uc3QgY2FwaXRhbGl6ZSA9IChzKSA9PiBzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zbGljZSgxKTtcbmZ1bmN0aW9uIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpIHtcbiAgICBjb25zdCBjb3Vyc2VOYW1lID0gZmlnbWEucm9vdC5uYW1lLnJlcGxhY2UoL0NPVVJTRS0vLCBcIlwiKTtcbiAgICBsZXQgc3dpZnRDb3Vyc2VOYW1lID0gY291cnNlTmFtZS5zcGxpdChcIi1cIikubWFwKGNhcGl0YWxpemUpLmpvaW4oXCJcIik7XG4gICAgc3dpZnRDb3Vyc2VOYW1lID0gc3dpZnRDb3Vyc2VOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgc3dpZnRDb3Vyc2VOYW1lLnNsaWNlKDEpO1xuICAgIGxldCB0YXNrcyA9IGBgO1xuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBpZiAocGFnZS5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJJTkRFWFwiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgXCJ0YXNrLW5hbWUgJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiA9IFwiJHtjYXBpdGFsaXplKHBhZ2UubmFtZS5zcGxpdCgnLScpLmpvaW4oXCIgXCIpKX1cIjtcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxuXCJjb3Vyc2UtbmFtZSAke2NvdXJzZU5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShjb3Vyc2VOYW1lLnNwbGl0KCctJykuam9pbihcIiBcIikpfVwiO1xuXCJjb3Vyc2UtZGVzY3JpcHRpb24gJHtjb3Vyc2VOYW1lfVwiID0gXCJJbiB0aGlzIGNvdXJzZTpcbiAgICDigKIgXG4gICAg4oCiIFxuICAgIOKAoiBcIjtcbiR7dGFza3N9XG5gO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVTd2lmdENvZGUoKSB7XG4gICAgY29uc3QgY291cnNlTmFtZSA9IGZpZ21hLnJvb3QubmFtZS5yZXBsYWNlKC9DT1VSU0UtLywgXCJcIik7XG4gICAgbGV0IHN3aWZ0Q291cnNlTmFtZSA9IGNvdXJzZU5hbWUuc3BsaXQoXCItXCIpLm1hcCgocykgPT4gcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc2xpY2UoMSkpLmpvaW4oXCJcIik7XG4gICAgc3dpZnRDb3Vyc2VOYW1lID0gc3dpZnRDb3Vyc2VOYW1lLmNoYXJBdCgwKS50b0xvd2VyQ2FzZSgpICsgc3dpZnRDb3Vyc2VOYW1lLnNsaWNlKDEpO1xuICAgIGxldCB0YXNrcyA9IGBgO1xuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBpZiAocGFnZS5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJJTkRFWFwiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgICAgICAgICBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiwgcHJvOiB0cnVlKSxcXG5gO1xuICAgIH1cbiAgICByZXR1cm4gYFxubGV0ICR7c3dpZnRDb3Vyc2VOYW1lfSA9IENvdXJzZShcbiAgICBwYXRoOiBcIiR7Y291cnNlTmFtZX1cIixcbiAgICB0YXNrczogW1xuJHt0YXNrc30gICAgXSlcbmA7XG59XG5mdW5jdGlvbiBleHBvcnRDb3Vyc2UoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IGxlc3NvbnMgPSBbXTtcbiAgICAgICAgbGV0IHRodW1ibmFpbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocGFnZS5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUSFVNQk5BSUxTXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxlc3NvbiA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09IFwibGVzc29uXCIpO1xuICAgICAgICAgICAgY29uc3QgdGh1bWJuYWlsID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gXCJ0aHVtYm5haWxcIik7XG4gICAgICAgICAgICBpZiAobGVzc29uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB5aWVsZCBsZXNzb24uZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiU1ZHXCIsXG4gICAgICAgICAgICAgICAgICAgIC8vIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3ZnSWRBdHRyaWJ1dGU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGAke3BhZ2UubmFtZX0uc3ZnYDtcbiAgICAgICAgICAgICAgICBsZXNzb25zLnB1c2goeyBwYXRoLCBieXRlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aHVtYm5haWwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBieXRlcyA9IHlpZWxkIHRodW1ibmFpbC5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJXSURUSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gYHRodW1ibmFpbHMvJHtwYWdlLm5hbWUudG9Mb3dlckNhc2UoKX0ucG5nYDtcbiAgICAgICAgICAgICAgICB0aHVtYm5haWxzLnB1c2goeyBwYXRoLCBieXRlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbWl0KFwiZXhwb3J0WmlwXCIsIHsgcm9vdE5hbWU6IGZpZ21hLnJvb3QubmFtZSwgbGVzc29uczogbGVzc29ucywgdGh1bWJuYWlsczogdGh1bWJuYWlscyB9KTtcbiAgICB9KTtcbn1cbmxldCBlcnJvcnMgPSBbXTtcbmxldCB6b29tU2NhbGUgPSAxO1xubGV0IG1heEJzID0gMTIuODtcbmxldCBvcmRlciA9IFwic3RlcHNcIjtcbnZhciBFcnJvckxldmVsO1xuKGZ1bmN0aW9uIChFcnJvckxldmVsKSB7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiRVJST1JcIl0gPSAwXSA9IFwiRVJST1JcIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJXQVJOXCJdID0gMV0gPSBcIldBUk5cIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcbn0pKEVycm9yTGV2ZWwgfHwgKEVycm9yTGV2ZWwgPSB7fSkpO1xuZnVuY3Rpb24gc2VsZWN0RXJyb3IoaW5kZXgpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGlmICgoX2EgPSBlcnJvcnNbaW5kZXhdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFnZSkge1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZSA9IGVycm9yc1tpbmRleF0ucGFnZTtcbiAgICB9XG4gICAgaWYgKChfYiA9IGVycm9yc1tpbmRleF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1swXS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbaW5kZXhdLm5vZGVdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHByaW50RXJyb3JzKCkge1xuICAgIGVycm9ycy5zb3J0KChhLCBiKSA9PiBhLmxldmVsIC0gYi5sZXZlbCk7XG4gICAgc2VsZWN0RXJyb3IoMCk7XG4gICAgbGV0IHRleHQgPSBlcnJvcnMubWFwKChlKSA9PiB7IHZhciBfYSwgX2IsIF9jOyByZXR1cm4gYCR7RXJyb3JMZXZlbFtlLmxldmVsXX1cXHR8ICR7ZS5lcnJvcn0gfCBQQUdFOiR7KChfYSA9IGUucGFnZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5hbWUpIHx8IFwiXCJ9ICR7KF9iID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudHlwZX06JHsoKF9jID0gZS5ub2RlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MubmFtZSkgfHwgXCJcIn1gOyB9KS5qb2luKFwiXFxuXCIpO1xuICAgIHRleHQgKz0gXCJcXG5Eb25lXCI7XG4gICAgcHJpbnQodGV4dCk7XG59XG5mdW5jdGlvbiBhc3NlcnQodmFsLCBlcnJvciwgcGFnZSwgbm9kZSwgbGV2ZWwgPSBFcnJvckxldmVsLkVSUk9SKSB7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgICAgZXJyb3JzLnB1c2goeyBub2RlLCBwYWdlLCBlcnJvciwgbGV2ZWwgfSk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5mdW5jdGlvbiBsaW50Q291cnNlKCkge1xuICAgIGFzc2VydCgvXkNPVVJTRS1bYS16XFwtMC05XSskLy50ZXN0KGZpZ21hLnJvb3QubmFtZSksIGBDb3Vyc2UgbmFtZSAnJHtmaWdtYS5yb290Lm5hbWV9JyBtdXN0IG1hdGNoIENPVVJTRS1bYS16XFwtMC05XStgKTtcbiAgICBjb25zdCBpbmRleCA9IGZpZ21hLnJvb3QuY2hpbGRyZW4uZmluZCgocCkgPT4gcC5uYW1lID09IFwiSU5ERVhcIik7XG4gICAgaWYgKGFzc2VydCghIWluZGV4LCBgTXVzdCBoYXZlICdJTkRFWCcgcGFnZWApKSB7XG4gICAgICAgIGxpbnRJbmRleChpbmRleCk7XG4gICAgfVxuICAgIGZvciAobGV0IHBhZ2Ugb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBsaW50UGFnZShwYWdlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBsaW50SW5kZXgocGFnZSkge1xuICAgIGlmICghYXNzZXJ0KHBhZ2UuY2hpbGRyZW4ubGVuZ3RoID09IDEsIGBJbmRleCBwYWdlIG11c3QgY29udGFpbiBleGFjdGx5IDEgZWxlbWVudGAsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIGBNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnYCwgcGFnZSk7XG4gICAgbGludFRodW1ibmFpbChwYWdlLCBwYWdlLmNoaWxkcmVuWzBdKTtcbn1cbmZ1bmN0aW9uIGxpbnRQYWdlKHBhZ2UpIHtcbiAgICBpZiAoL15cXC98XklOREVYJC8udGVzdChwYWdlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhc3NlcnQoL15bYS16XFwtMC05XSskLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFwtMC05XSsuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIGBNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnYCwgcGFnZSk7XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXmxlc3NvbiQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIGBNdXN0IGNvbnRhaW4gZXhhY3RseSAxICdsZXNzb24nYCwgcGFnZSk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBwYWdlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChub2RlLm5hbWUgPT0gXCJsZXNzb25cIikge1xuICAgICAgICAgICAgbGludFRhc2tGcmFtZShwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLm5hbWUgPT0gXCJ0aHVtYm5haWxcIikge1xuICAgICAgICAgICAgbGludFRodW1ibmFpbChwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydCgvXlxcLy8udGVzdChub2RlLm5hbWUpLCBgTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSBcIkZSQU1FXCIsIGBNdXN0IGJlICdGUkFNRScgdHlwZWAsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSA0MDAgJiYgbm9kZS5oZWlnaHQgPT0gNDAwLCBgTXVzdCBiZSA0MDB4NDAwYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gXCJGUkFNRVwiLCBgTXVzdCBiZSAnRlJBTUUnIHR5cGVgLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDEzNjYgJiYgbm9kZS5oZWlnaHQgPT0gMTAyNCwgYE11c3QgYmUgMTM2NngxMDI0YCwgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHNldHRpbmdzID0gbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aChcInNldHRpbmdzXCIpKTtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcbiAgICB9XG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShcXGQrKSQvLmV4ZWModGFnKTtcbiAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvID0gZm91bmRbMV07XG4gICAgICAgICAgICBhc3NlcnQoIW9yZGVyTnVtYmVyc1tvXSwgYE11c3QgaGF2ZSB1bmlxdWUgJHt0YWd9IHZhbHVlc2AsIHBhZ2UsIHN0ZXApO1xuICAgICAgICAgICAgaWYgKG8pIHtcbiAgICAgICAgICAgICAgICBvcmRlck51bWJlcnNbb10gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yIChsZXQgc3RlcCBvZiBub2RlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChzdGVwLm5hbWUuc3RhcnRzV2l0aChcInN0ZXBcIikpIHtcbiAgICAgICAgICAgIGxpbnRTdGVwKHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzdGVwLm5hbWUuc3RhcnRzV2l0aChcInNldHRpbmdzXCIpKSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIGBNdXN0IGJlICdzZXR0aW5ncycgb3IgJ3N0ZXAnYCwgcGFnZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXNzZXJ0KG1heEJzID4gKHpvb21TY2FsZSAtIDEpICogMTIuOCwgYHpvb20tc2NhbGUgJHt6b29tU2NhbGV9IG11c3QgYmUgJHtNYXRoLmNlaWwobWF4QnMgLyAxMi44KX0gZm9yIG1heCBicyAke21heEJzfSB1c2VkYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50U3RlcChwYWdlLCBub2RlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gXCJHUk9VUFwiLCBgTXVzdCBiZSAnR1JPVVAnIHR5cGUnYCwgcGFnZSwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsIGBNdXN0IGJlIG9wYXF1ZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsIGBNdXN0IGJlIHZpc2libGVgLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICB0YWdzLmZvckVhY2goKHRhZykgPT4ge1xuICAgICAgICBhc3NlcnQoL15zdGVwJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XnMtbXVsdGlzdGVwLWJnJHxeYnJ1c2gtbmFtZS1cXHcrJHxeY2xlYXItbGF5ZXItXFxkKyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICAgICAgLy8gYXNzZXJ0KCEvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYmckLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgaXMgb2Jzb2xldGVgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pOyAgICAgICAgXG4gICAgfSk7XG4gICAgY29uc3QgYmcgPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYmckfF5zLW11bHRpc3RlcC1iZy1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3QgYnJ1c2ggPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYnJ1c2gkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3Qgc3MgPSBwYXJzZUludCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9ec3MtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZShcInNzLVwiLCBcIlwiKSk7XG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KChfYiA9IHRhZ3MuZmluZCgocykgPT4gL15icy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZXBsYWNlKFwiYnMtXCIsIFwiXCIpKTtcbiAgICBtYXhCcyA9IE1hdGgubWF4KGJzID8gYnMgOiBtYXhCcywgbWF4QnMpO1xuICAgIGFzc2VydCghKGJnICYmIHNzKSwgXCJTaG91bGQgbm90IHVzZSBiZytzc1wiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydCghc3MgfHwgc3MgPj0gMTUsIFwic3MgbXVzdCBiZSA+PSAxNVwiLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoIXNzIHx8ICFicyB8fCBzcyA+IGJzLCBcInNzIG11c3QgYmUgPiBic1wiLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoIWJzIHx8IGJzIDw9IHpvb21TY2FsZSAqIDEyLjgsIGBicyBtdXN0IGJlIDw9ICR7em9vbVNjYWxlICogMTIuOH0gZm9yIHRoaXMgem9vbS1zY2FsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydCghYnMgfHwgYnMgPj0gem9vbVNjYWxlICogMC40NCwgYGJzIG11c3QgYmUgPj0gJHt6b29tU2NhbGUgKiAwLjQ0fSBmb3IgdGhpcyB6b29tLXNjYWxlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCFvIHx8IG9yZGVyID09IFwibGF5ZXJzXCIsIGAke299IG11c3QgYmUgdXNlZCBvbmx5IHdpdGggc2V0dGluZ3Mgb3JkZXItbGF5ZXJzYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG9yZGVyICE9PSBcImxheWVyc1wiIHx8ICEhbywgYE11c3QgaGF2ZSBvLU4gb3JkZXIgbnVtYmVyYCwgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgZmYgPSBmaW5kRmlyc3Qobm9kZSwgKG4pID0+IG4uZmlsbHMgJiYgbi5maWxsc1swXSk7XG4gICAgYXNzZXJ0KCFiZyB8fCBmZiwgXCJiZyBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGhvdXQgZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIWJydXNoIHx8ICFmZiwgXCJicnVzaCBzdGVwIHNob3VsZG4ndCBiZSB1c2VkIHdpdGggZmlsbGVkLWluIHZlY3RvcnNcIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgaWYgKG4ubmFtZSA9PSBcImlucHV0XCIpIHtcbiAgICAgICAgICAgIGxpbnRJbnB1dChwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuLm5hbWUgPSBcInRlbXBsYXRlXCIpIHtcbiAgICAgICAgICAgIC8vIGxpbnQgdGVtcGxhdGVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydChmYWxzZSwgXCJNdXN0IGJlICdpbnB1dCcgb3IgJ3RlbXBsYXRlJ1wiLCBwYWdlLCBuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGJsaW5rTm9kZXMgPSBmaW5kQWxsKG5vZGUsIChuKSA9PiBnZXRUYWdzKG4pLmZpbmQoKHQpID0+IC9eYmxpbmskLy50ZXN0KHQpKSAhPT0gdW5kZWZpbmVkKS5mbGF0TWFwKGRlZXBOb2Rlcyk7XG4gICAgY29uc3QgZmlsbGVkTm9kZSA9IGJsaW5rTm9kZXMuZmluZCgobikgPT4gbi5maWxsc1swXSk7XG4gICAgYXNzZXJ0KGJsaW5rTm9kZXMubGVuZ3RoID09IDAgfHwgISFmaWxsZWROb2RlIHx8IGJsaW5rTm9kZXMubGVuZ3RoID4gMywgYFNob3VsZCB1c2UgZHJhdy1saW5lIGlmIDwgNCBsaW5lc2AsIHBhZ2UsIGJsaW5rTm9kZXNbMF0sIEVycm9yTGV2ZWwuSU5GTyk7XG59XG5mdW5jdGlvbiBkZWVwTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gW25vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5jaGlsZHJlbi5mbGF0TWFwKChuKSA9PiBkZWVwTm9kZXMobikpO1xufVxuZnVuY3Rpb24gbGludFNldHRpbmdzKHBhZ2UsIG5vZGUpIHtcbiAgICB2YXIgX2E7XG4gICAgYXNzZXJ0KG5vZGUudHlwZSA9PSBcIkVMTElQU0VcIiwgYE11c3QgYmUgJ0VMTElQU0UnIHR5cGUnYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCBgTXVzdCBiZSB2aXNpYmxlYCwgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9ec2V0dGluZ3MkfF5jYXB0dXJlLWNvbG9yJHxeem9vbS1zY2FsZS1cXGQrJHxeb3JkZXItbGF5ZXJzJHxecy1tdWx0aXN0ZXAtYmctXFxkKyR8XnMtbXVsdGlzdGVwLXJlc3VsdCR8XnMtbXVsdGlzdGVwJHxecy1tdWx0aXN0ZXAtYnJ1c2gtXFxkKyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBpZiAodGFncy5maW5kKCh0YWcpID0+IC9eb3JkZXItbGF5ZXJzJC8udGVzdCh0YWcpKSkge1xuICAgICAgICBvcmRlciA9IFwibGF5ZXJzXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvcmRlciA9IFwic3RlcHNcIjtcbiAgICB9XG4gICAgem9vbVNjYWxlID0gcGFyc2VJbnQoKChfYSA9IHRhZ3MuZmluZCgocykgPT4gL156b29tLXNjYWxlLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoXCJ6b29tLXNjYWxlLVwiLCBcIlwiKSkgfHwgXCIxXCIpO1xuICAgIGFzc2VydCh6b29tU2NhbGUgPj0gMSAmJiB6b29tU2NhbGUgPD0gNSwgYE11c3QgYmUgMSA8PSB6b29tLXNjYWxlIDw9IDUgKCR7em9vbVNjYWxlfSlgLCBwYWdlLCBub2RlKTtcbn1cbmZ1bmN0aW9uIGxpbnRJbnB1dChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09IFwiR1JPVVBcIiwgYE11c3QgYmUgJ0dST1VQJyB0eXBlJ2AsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCBgTXVzdCBiZSB2aXNpYmxlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUubmFtZSA9PSBcImlucHV0XCIsIGBNdXN0IGJlICdpbnB1dCdgLCBwYWdlLCBub2RlKTtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgaWYgKC9HUk9VUHxCT09MRUFOX09QRVJBVElPTi8udGVzdCh2LnR5cGUpKSB7XG4gICAgICAgICAgICBsaW50R3JvdXAocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL1JFQ1RBTkdMRXxFTExJUFNFfFZFQ1RPUnxURVhULy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRWZWN0b3IocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIGBNdXN0IGJlICdHUk9VUC9WRUNUT1IvUkVDVEFOR0xFL0VMTElQU0UvVEVYVCcgdHlwZWAsIHBhZ2UsIHYpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRUYWdzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5uYW1lLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbik7XG59XG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsIGBNdXN0IGJlIG9wYXF1ZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsIGBNdXN0IGJlIHZpc2libGVgLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgYE5hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xeZHJhdy1saW5lJHxeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJHxeZmxpcCQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBsZXQgZmlsbHMgPSBub2RlLmZpbGxzO1xuICAgIGxldCBzdHJva2VzID0gbm9kZS5zdHJva2VzO1xuICAgIGFzc2VydCghZmlsbHMubGVuZ3RoIHx8ICFzdHJva2VzLmxlbmd0aCwgYE11c3Qgbm90IGhhdmUgZmlsbCtzdHJva2VgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IC9ST1VORHxOT05FLy50ZXN0KFN0cmluZyhub2RlLnN0cm9rZUNhcCkpLCBgU3Ryb2tlIGNhcHMgbXVzdCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gXCJST1VORFwiLCBgU3Ryb2tlIGpvaW5zIHNob3VsZCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlSm9pbil9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJHxeZHJhdy1saW5lJC8udGVzdChzKSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgYE11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydCghL0JPT0xFQU5fT1BFUkFUSU9OLy50ZXN0KG5vZGUudHlwZSksIGBOb3RpY2UgQk9PTEVBTl9PUEVSQVRJT05gLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCBgTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5ibGluayR8XmRcXGQrJHxeclxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIGBNdXN0IGhhdmUgJ2JsaW5rJ2AsIHBhZ2UsIG5vZGUpO1xufVxuLy8gbm8gaGlkZGVuIGZpbGwvc3Ryb2tlXG4vLyBubyBlZmZlY3RzXG4iXSwic291cmNlUm9vdCI6IiJ9