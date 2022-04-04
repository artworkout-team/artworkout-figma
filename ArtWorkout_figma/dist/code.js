/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__);
figma.ui.resize(270, 150);
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    switch (msg.type) {
        case 'separateStep':
            separateStep(figma.currentPage.selection);
            break;
        case 'exportFiles':
            exportFiles();
            break;
        case 'generateCode':
            generateCode();
            break;
        case 'lintCourse':
            errors = [];
            lintCourse();
            printErrors();
            break;
        case 'lintPage':
            errors = [];
            lintPage(figma.currentPage);
            printErrors();
            break;
        case 'autoFormat':
            autoFormat();
            break;
    }
});
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
    figma.ui.resize(800, 600);
    figma.ui.postMessage({ type: "print", text });
}
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function generateTranslationsCode() {
    const courseName = figma.root.name.replace(/COURSE-/, "");
    let swiftCourseName = courseName.split("-").map(capitalize).join("");
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1);
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "THUMBNAILS") {
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
        if (page.name.toUpperCase() == "THUMBNAILS") {
            continue;
        }
        tasks += `        Task(path: "${courseName}/${page.name}"),\n`;
    }
    return `
let ${swiftCourseName} = Course(
    path: "${courseName}",
    tasks: [
${tasks}    ])
`;
}
function exportFiles() {
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
                    svgOutlineText: false,
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
        figma.ui.postMessage({ type: "exportFiles", rootName: figma.root.name, lessons: lessons, thumbnails: thumbnails });
    });
}
let errors = [];
let bsLimit = 12.8;
let order = "steps";
var ErrorLevel;
(function (ErrorLevel) {
    ErrorLevel[ErrorLevel["ERROR"] = 0] = "ERROR";
    ErrorLevel[ErrorLevel["WARN"] = 1] = "WARN";
    ErrorLevel[ErrorLevel["INFO"] = 2] = "INFO";
})(ErrorLevel || (ErrorLevel = {}));
function printErrors() {
    var _a, _b;
    errors.sort((a, b) => a.level - b.level);
    if ((_a = errors[0]) === null || _a === void 0 ? void 0 : _a.page) {
        figma.currentPage = errors[0].page;
    }
    if ((_b = errors[0]) === null || _b === void 0 ? void 0 : _b.node) {
        errors[0].page.selection = [errors[0].node];
    }
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
    if (!assert(/^[a-z\-0-9]+/.test(page.name), `Page name '${page.name}' must match [a-z\-0-9]+. Use slash to /ignore.`, page)) {
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
            const found = /^o-(d+)$/.exec(tag);
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
        assert(/^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$|^o-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
        // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);        
    });
    const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s));
    const ss = parseInt((_a = tags.find((s) => /^ss-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace("ss-", ""));
    const o = tags.find((s) => /^o-\d+$/.test(s));
    const bs = parseInt((_b = tags.find((s) => /^bs-\d+$/.test(s))) === null || _b === void 0 ? void 0 : _b.replace("bs-", ""));
    assert(!(bg && ss), "Should not use bg+ss", page, node, ErrorLevel.INFO);
    assert(!ss || ss >= 15, "ss must be >= 15", page, node);
    assert(!ss || !bs || ss > bs, "ss must be > bs", page, node);
    assert(!bs || bs <= bsLimit, `bs must be <= ${bsLimit} for this zoom-scale`, page, node);
    assert(!o || order == "layers", `${o} must be used only with settings order-layers`, page, node);
    const ff = findFirst(node, (n) => n.fills && n.fills[0]);
    assert(!bg || ff, "bg step shouldn't be used without filled-in vectors", page, node, ErrorLevel.INFO);
    node.children.forEach((n) => {
        if (n.name = "input") {
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
        assert(/^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
    });
    if (tags.find((tag) => /^order-layers$/.test(tag))) {
        order = "layers";
    }
    else {
        order = "steps";
    }
    const zs = parseInt((_a = tags.find((s) => /^zoom-scale-\d+$/.test(s))) === null || _a === void 0 ? void 0 : _a.replace("zoom-scale-", ""));
    assert(isNaN(zs) || zs > 1 && zs <= 5, `Must be 1 < zoom-scale <= 5 (${zs})`, page, node);
    bsLimit = zs * 12.8;
}
function lintInput(page, node) {
    if (!assert(node.type == "GROUP", `Must be 'GROUP' type'`, page, node)) {
        return;
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    assert(node.name == "input", `Must be 'input'`, page, node);
    node.children.forEach((v) => {
        if (v.type == "GROUP") {
            lintGroup(page, v);
        }
        else if (/RECTANGLE|ELLIPSE|VECTOR/.test(v.type)) {
            lintVector(page, v);
        }
        else {
            assert(false, `Must be 'GROUP' or 'VECTOR' type`, page, v);
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

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/code.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0EsaUhBQWlILHVCQUF1QjtBQUN4SSxxR0FBcUcsd0JBQXdCO0FBQzdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGLElBQUk7QUFDckYsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUV6YUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0FydFdvcmtvdXQvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9BcnRXb3Jrb3V0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQXJ0V29ya291dC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQXJ0V29ya291dC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkucmVzaXplKDI3MCwgMTUwKTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3NlcGFyYXRlU3RlcCc6XG4gICAgICAgICAgICBzZXBhcmF0ZVN0ZXAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHBvcnRGaWxlcyc6XG4gICAgICAgICAgICBleHBvcnRGaWxlcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dlbmVyYXRlQ29kZSc6XG4gICAgICAgICAgICBnZW5lcmF0ZUNvZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdsaW50Q291cnNlJzpcbiAgICAgICAgICAgIGVycm9ycyA9IFtdO1xuICAgICAgICAgICAgbGludENvdXJzZSgpO1xuICAgICAgICAgICAgcHJpbnRFcnJvcnMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdsaW50UGFnZSc6XG4gICAgICAgICAgICBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIGxpbnRQYWdlKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgICAgIHByaW50RXJyb3JzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYXV0b0Zvcm1hdCc6XG4gICAgICAgICAgICBhdXRvRm9ybWF0KCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcbmZ1bmN0aW9uIHNlcGFyYXRlU3RlcChub2Rlcykge1xuICAgIGNvbnN0IHBhcmVudFN0ZXAgPSBmaW5kUGFyZW50KG5vZGVzWzBdLCAobikgPT4gbi5uYW1lLnN0YXJ0c1dpdGgoXCJzdGVwXCIpKTtcbiAgICBjb25zdCBmcmFtZSA9IHBhcmVudFN0ZXAucGFyZW50O1xuICAgIGNvbnN0IGluZGV4ID0gZnJhbWUuY2hpbGRyZW4uZmluZEluZGV4KChuKSA9PiBuID09IHBhcmVudFN0ZXApO1xuICAgIGlmICghcGFyZW50U3RlcCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlucHV0ID0gZmlnbWEuZ3JvdXAobm9kZXMsIGZyYW1lKTtcbiAgICBpbnB1dC5uYW1lID0gXCJpbnB1dFwiO1xuICAgIGNvbnN0IG5ld1N0ZXAgPSBmaWdtYS5ncm91cChbaW5wdXRdLCBmcmFtZSwgaW5kZXgpO1xuICAgIG5ld1N0ZXAubmFtZSA9IHBhcmVudFN0ZXAubmFtZTtcbn1cbmZ1bmN0aW9uIGF1dG9Gb3JtYXQoKSB7XG4gICAgY29uc3QgdGh1bWJQYWdlID0gZmlnbWEucm9vdC5jaGlsZHJlbi5maW5kKChwKSA9PiBwLm5hbWUudG9VcHBlckNhc2UoKSA9PSBcIlRIVU1CTkFJTFNcIik7XG4gICAgaWYgKHRodW1iUGFnZSkge1xuICAgICAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gdGh1bWJQYWdlLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICAgICAgaWYgKHAuY2hpbGRyZW4uZmluZCgodCkgPT4gdC5uYW1lID09IFwidGh1bWJuYWlsXCIpIHx8ICF0aHVtYm5haWxGcmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGh1bWJuYWlsRnJhbWUuY2xvbmUoKTtcbiAgICAgICAgICAgIGNsb25lLm5hbWUgPSBcInRodW1ibmFpbFwiO1xuICAgICAgICAgICAgcC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaWdtYS5yb290LmNoaWxkcmVuLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgY29uc3Qgb2xkTGVzc29uRnJhbWUgPSBwLmNoaWxkcmVuLmZpbmQoKHQpID0+IHQubmFtZSA9PSBwLm5hbWUpO1xuICAgICAgICBpZiAob2xkTGVzc29uRnJhbWUpIHtcbiAgICAgICAgICAgIG9sZExlc3NvbkZyYW1lLm5hbWUgPSBcImxlc3NvblwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRodW1ibmFpbEZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gXCJ0aHVtYm5haWxcIik7XG4gICAgICAgIGNvbnN0IGxlc3NvbkZyYW1lID0gcC5jaGlsZHJlbi5maW5kKCh0KSA9PiB0Lm5hbWUgPT0gXCJsZXNzb25cIik7XG4gICAgICAgIGlmICghdGh1bWJuYWlsRnJhbWUgfHwgIWxlc3NvbkZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGh1bWJuYWlsRnJhbWUueCA9IGxlc3NvbkZyYW1lLnggLSA0NDA7XG4gICAgICAgIHRodW1ibmFpbEZyYW1lLnkgPSBsZXNzb25GcmFtZS55O1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec2V0dGluZ3MvLnRlc3Qobm9kZS5uYW1lKSlcbiAgICAgICAgLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5yZXNpemUoNDAsIDQwKTtcbiAgICAgICAgbi54ID0gMTA7XG4gICAgICAgIG4ueSA9IDEwO1xuICAgIH0pO1xuICAgIGZpbmRBbGwoZmlnbWEucm9vdCwgKG5vZGUpID0+IC9ec3RlcCBzLW11bHRpc3RlcC1yZXN1bHQvLnRlc3Qobm9kZS5uYW1lKSlcbiAgICAgICAgLmZvckVhY2goKG4pID0+IHtcbiAgICAgICAgbi5jaGlsZHJlblswXS5jaGlsZHJlblswXS5uYW1lID0gXCIvaWdub3JlXCI7XG4gICAgICAgIG4ucmVzaXplKDQwLCA0MCk7XG4gICAgICAgIG4ueCA9IDEwO1xuICAgICAgICBuLnkgPSA2MDtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRBbGwobm9kZSwgZikge1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBpZiAoZihub2RlKSkge1xuICAgICAgICBhcnIucHVzaChub2RlKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBhcnIgPSBhcnIuY29uY2F0KGNoaWxkcmVuLmZsYXRNYXAoKHApID0+IGZpbmRBbGwocCwgZikpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn1cbmZ1bmN0aW9uIGZpbmRGaXJzdChub2RlLCBmKSB7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgcCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gZmluZEZpcnN0KHAsIGYpO1xuICAgICAgICAgICAgaWYgKGZvdW5kKVxuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGZpbmRQYXJlbnQobm9kZSwgZikge1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBpZiAobm9kZS5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRQYXJlbnQobm9kZS5wYXJlbnQsIGYpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdlbmVyYXRlQ29kZSgpIHtcbiAgICBjb25zdCBjb2RlID0gZ2VuZXJhdGVTd2lmdENvZGUoKSArIGdlbmVyYXRlVHJhbnNsYXRpb25zQ29kZSgpO1xuICAgIHByaW50KGNvZGUpO1xufVxuZnVuY3Rpb24gcHJpbnQodGV4dCkge1xuICAgIGZpZ21hLnVpLnJlc2l6ZSg4MDAsIDYwMCk7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcInByaW50XCIsIHRleHQgfSk7XG59XG5jb25zdCBjYXBpdGFsaXplID0gKHMpID0+IHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuZnVuY3Rpb24gZ2VuZXJhdGVUcmFuc2xhdGlvbnNDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sIFwiXCIpO1xuICAgIGxldCBzd2lmdENvdXJzZU5hbWUgPSBjb3Vyc2VOYW1lLnNwbGl0KFwiLVwiKS5tYXAoY2FwaXRhbGl6ZSkuam9pbihcIlwiKTtcbiAgICBzd2lmdENvdXJzZU5hbWUgPSBzd2lmdENvdXJzZU5hbWUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzd2lmdENvdXJzZU5hbWUuc2xpY2UoMSk7XG4gICAgbGV0IHRhc2tzID0gYGA7XG4gICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUudG9VcHBlckNhc2UoKSA9PSBcIlRIVU1CTkFJTFNcIikge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGFza3MgKz0gYFwidGFzay1uYW1lICR7Y291cnNlTmFtZX0vJHtwYWdlLm5hbWV9XCIgPSBcIiR7Y2FwaXRhbGl6ZShwYWdlLm5hbWUuc3BsaXQoJy0nKS5qb2luKFwiIFwiKSl9XCI7XFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcblwiY291cnNlLW5hbWUgJHtjb3Vyc2VOYW1lfVwiID0gXCIke2NhcGl0YWxpemUoY291cnNlTmFtZS5zcGxpdCgnLScpLmpvaW4oXCIgXCIpKX1cIjtcblwiY291cnNlLWRlc2NyaXB0aW9uICR7Y291cnNlTmFtZX1cIiA9IFwiSW4gdGhpcyBjb3Vyc2U6XG4gICAg4oCiIFxuICAgIOKAoiBcbiAgICDigKIgXCI7XG4ke3Rhc2tzfVxuYDtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlU3dpZnRDb2RlKCkge1xuICAgIGNvbnN0IGNvdXJzZU5hbWUgPSBmaWdtYS5yb290Lm5hbWUucmVwbGFjZSgvQ09VUlNFLS8sIFwiXCIpO1xuICAgIGxldCBzd2lmdENvdXJzZU5hbWUgPSBjb3Vyc2VOYW1lLnNwbGl0KFwiLVwiKS5tYXAoKHMpID0+IHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpKS5qb2luKFwiXCIpO1xuICAgIHN3aWZ0Q291cnNlTmFtZSA9IHN3aWZ0Q291cnNlTmFtZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHN3aWZ0Q291cnNlTmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdGFza3MgPSBgYDtcbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZS50b1VwcGVyQ2FzZSgpID09IFwiVEhVTUJOQUlMU1wiKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrcyArPSBgICAgICAgICBUYXNrKHBhdGg6IFwiJHtjb3Vyc2VOYW1lfS8ke3BhZ2UubmFtZX1cIiksXFxuYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbmxldCAke3N3aWZ0Q291cnNlTmFtZX0gPSBDb3Vyc2UoXG4gICAgcGF0aDogXCIke2NvdXJzZU5hbWV9XCIsXG4gICAgdGFza3M6IFtcbiR7dGFza3N9ICAgIF0pXG5gO1xufVxuZnVuY3Rpb24gZXhwb3J0RmlsZXMoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IGxlc3NvbnMgPSBbXTtcbiAgICAgICAgbGV0IHRodW1ibmFpbHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAocGFnZS5uYW1lLnRvVXBwZXJDYXNlKCkgPT0gXCJUSFVNQk5BSUxTXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxlc3NvbiA9IHBhZ2UuY2hpbGRyZW4uZmluZCgoZikgPT4gZi5uYW1lID09IFwibGVzc29uXCIpO1xuICAgICAgICAgICAgY29uc3QgdGh1bWJuYWlsID0gcGFnZS5jaGlsZHJlbi5maW5kKChmKSA9PiBmLm5hbWUgPT0gXCJ0aHVtYm5haWxcIik7XG4gICAgICAgICAgICBpZiAobGVzc29uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB5aWVsZCBsZXNzb24uZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiU1ZHXCIsXG4gICAgICAgICAgICAgICAgICAgIHN2Z091dGxpbmVUZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3ZnSWRBdHRyaWJ1dGU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IGAke3BhZ2UubmFtZX0uc3ZnYDtcbiAgICAgICAgICAgICAgICBsZXNzb25zLnB1c2goeyBwYXRoLCBieXRlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aHVtYm5haWwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBieXRlcyA9IHlpZWxkIHRodW1ibmFpbC5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJXSURUSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDYwMCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoID0gYHRodW1ibmFpbHMvJHtwYWdlLm5hbWUudG9Mb3dlckNhc2UoKX0ucG5nYDtcbiAgICAgICAgICAgICAgICB0aHVtYm5haWxzLnB1c2goeyBwYXRoLCBieXRlcyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwiZXhwb3J0RmlsZXNcIiwgcm9vdE5hbWU6IGZpZ21hLnJvb3QubmFtZSwgbGVzc29uczogbGVzc29ucywgdGh1bWJuYWlsczogdGh1bWJuYWlscyB9KTtcbiAgICB9KTtcbn1cbmxldCBlcnJvcnMgPSBbXTtcbmxldCBic0xpbWl0ID0gMTIuODtcbmxldCBvcmRlciA9IFwic3RlcHNcIjtcbnZhciBFcnJvckxldmVsO1xuKGZ1bmN0aW9uIChFcnJvckxldmVsKSB7XG4gICAgRXJyb3JMZXZlbFtFcnJvckxldmVsW1wiRVJST1JcIl0gPSAwXSA9IFwiRVJST1JcIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJXQVJOXCJdID0gMV0gPSBcIldBUk5cIjtcbiAgICBFcnJvckxldmVsW0Vycm9yTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcbn0pKEVycm9yTGV2ZWwgfHwgKEVycm9yTGV2ZWwgPSB7fSkpO1xuZnVuY3Rpb24gcHJpbnRFcnJvcnMoKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBlcnJvcnMuc29ydCgoYSwgYikgPT4gYS5sZXZlbCAtIGIubGV2ZWwpO1xuICAgIGlmICgoX2EgPSBlcnJvcnNbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYWdlKSB7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZXJyb3JzWzBdLnBhZ2U7XG4gICAgfVxuICAgIGlmICgoX2IgPSBlcnJvcnNbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5ub2RlKSB7XG4gICAgICAgIGVycm9yc1swXS5wYWdlLnNlbGVjdGlvbiA9IFtlcnJvcnNbMF0ubm9kZV07XG4gICAgfVxuICAgIGxldCB0ZXh0ID0gZXJyb3JzLm1hcCgoZSkgPT4geyB2YXIgX2EsIF9iLCBfYzsgcmV0dXJuIGAke0Vycm9yTGV2ZWxbZS5sZXZlbF19XFx0fCAke2UuZXJyb3J9IHwgUEFHRTokeygoX2EgPSBlLnBhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uYW1lKSB8fCBcIlwifSAkeyhfYiA9IGUubm9kZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnR5cGV9OiR7KChfYyA9IGUubm9kZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLm5hbWUpIHx8IFwiXCJ9YDsgfSkuam9pbihcIlxcblwiKTtcbiAgICB0ZXh0ICs9IFwiXFxuRG9uZVwiO1xuICAgIHByaW50KHRleHQpO1xufVxuZnVuY3Rpb24gYXNzZXJ0KHZhbCwgZXJyb3IsIHBhZ2UsIG5vZGUsIGxldmVsID0gRXJyb3JMZXZlbC5FUlJPUikge1xuICAgIGlmICghdmFsKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKHsgbm9kZSwgcGFnZSwgZXJyb3IsIGxldmVsIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZnVuY3Rpb24gbGludENvdXJzZSgpIHtcbiAgICBhc3NlcnQoL15DT1VSU0UtW2EtelxcLTAtOV0rJC8udGVzdChmaWdtYS5yb290Lm5hbWUpLCBgQ291cnNlIG5hbWUgJyR7ZmlnbWEucm9vdC5uYW1lfScgbXVzdCBtYXRjaCBDT1VSU0UtW2EtelxcLTAtOV0rYCk7XG4gICAgY29uc3QgaW5kZXggPSBmaWdtYS5yb290LmNoaWxkcmVuLmZpbmQoKHApID0+IHAubmFtZSA9PSBcIklOREVYXCIpO1xuICAgIGlmIChhc3NlcnQoISFpbmRleCwgYE11c3QgaGF2ZSAnSU5ERVgnIHBhZ2VgKSkge1xuICAgICAgICBsaW50SW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgICBmb3IgKGxldCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgbGludFBhZ2UocGFnZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gbGludEluZGV4KHBhZ2UpIHtcbiAgICBpZiAoIWFzc2VydChwYWdlLmNoaWxkcmVuLmxlbmd0aCA9PSAxLCBgSW5kZXggcGFnZSBtdXN0IGNvbnRhaW4gZXhhY3RseSAxIGVsZW1lbnRgLCBwYWdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChwYWdlLmNoaWxkcmVuLmZpbHRlcigocykgPT4gL150aHVtYm5haWwkLy50ZXN0KHMubmFtZSkpLmxlbmd0aCA9PSAxLCBgTXVzdCBjb250YWluIGV4YWN0bHkgMSAndGh1bWJuYWlsJ2AsIHBhZ2UpO1xuICAgIGxpbnRUaHVtYm5haWwocGFnZSwgcGFnZS5jaGlsZHJlblswXSk7XG59XG5mdW5jdGlvbiBsaW50UGFnZShwYWdlKSB7XG4gICAgaWYgKC9eXFwvfF5JTkRFWCQvLnRlc3QocGFnZS5uYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYXNzZXJ0KC9eW2EtelxcLTAtOV0rLy50ZXN0KHBhZ2UubmFtZSksIGBQYWdlIG5hbWUgJyR7cGFnZS5uYW1lfScgbXVzdCBtYXRjaCBbYS16XFwtMC05XSsuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXnRodW1ibmFpbCQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIGBNdXN0IGNvbnRhaW4gZXhhY3RseSAxICd0aHVtYm5haWwnYCwgcGFnZSk7XG4gICAgYXNzZXJ0KHBhZ2UuY2hpbGRyZW4uZmlsdGVyKChzKSA9PiAvXmxlc3NvbiQvLnRlc3Qocy5uYW1lKSkubGVuZ3RoID09IDEsIGBNdXN0IGNvbnRhaW4gZXhhY3RseSAxICdsZXNzb24nYCwgcGFnZSk7XG4gICAgZm9yIChsZXQgbm9kZSBvZiBwYWdlLmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChub2RlLm5hbWUgPT0gXCJsZXNzb25cIikge1xuICAgICAgICAgICAgbGludFRhc2tGcmFtZShwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLm5hbWUgPT0gXCJ0aHVtYm5haWxcIikge1xuICAgICAgICAgICAgbGludFRodW1ibmFpbChwYWdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzc2VydCgvXlxcLy8udGVzdChub2RlLm5hbWUpLCBgTXVzdCBiZSAndGh1bWJuYWlsJyBvciAnbGVzc29uJy4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5XQVJOKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGxpbnRUaHVtYm5haWwocGFnZSwgbm9kZSkge1xuICAgIGlmICghYXNzZXJ0KG5vZGUudHlwZSA9PSBcIkZSQU1FXCIsIGBNdXN0IGJlICdGUkFNRScgdHlwZWAsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS53aWR0aCA9PSA0MDAgJiYgbm9kZS5oZWlnaHQgPT0gNDAwLCBgTXVzdCBiZSA0MDB4NDAwYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50VGFza0ZyYW1lKHBhZ2UsIG5vZGUpIHtcbiAgICBpZiAoIWFzc2VydChub2RlLnR5cGUgPT0gXCJGUkFNRVwiLCBgTXVzdCBiZSAnRlJBTUUnIHR5cGVgLCBwYWdlLCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLndpZHRoID09IDEzNjYgJiYgbm9kZS5oZWlnaHQgPT0gMTAyNCwgYE11c3QgYmUgMTM2NngxMDI0YCwgcGFnZSwgbm9kZSk7XG4gICAgbGV0IHNldHRpbmdzID0gbm9kZS5jaGlsZHJlbi5maW5kKChuKSA9PiBuLm5hbWUuc3RhcnRzV2l0aChcInNldHRpbmdzXCIpKTtcbiAgICBpZiAoc2V0dGluZ3MpIHtcbiAgICAgICAgbGludFNldHRpbmdzKHBhZ2UsIHNldHRpbmdzKTtcbiAgICB9XG4gICAgbGV0IG9yZGVyTnVtYmVycyA9IHt9O1xuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0YWdzID0gZ2V0VGFncyhzdGVwKTtcbiAgICAgICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gL15vLShkKykkLy5leGVjKHRhZyk7XG4gICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbyA9IGZvdW5kWzFdO1xuICAgICAgICAgICAgYXNzZXJ0KCFvcmRlck51bWJlcnNbb10sIGBNdXN0IGhhdmUgdW5pcXVlICR7dGFnfSB2YWx1ZXNgLCBwYWdlLCBzdGVwKTtcbiAgICAgICAgICAgIGlmIChvKSB7XG4gICAgICAgICAgICAgICAgb3JkZXJOdW1iZXJzW29dID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAobGV0IHN0ZXAgb2Ygbm9kZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAoc3RlcC5uYW1lLnN0YXJ0c1dpdGgoXCJzdGVwXCIpKSB7XG4gICAgICAgICAgICBsaW50U3RlcChwYWdlLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghc3RlcC5uYW1lLnN0YXJ0c1dpdGgoXCJzZXR0aW5nc1wiKSkge1xuICAgICAgICAgICAgYXNzZXJ0KGZhbHNlLCBgTXVzdCBiZSAnc2V0dGluZ3MnIG9yICdzdGVwJ2AsIHBhZ2UsIHN0ZXApO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gbGludFN0ZXAocGFnZSwgbm9kZSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09IFwiR1JPVVBcIiwgYE11c3QgYmUgJ0dST1VQJyB0eXBlJ2AsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCBgTXVzdCBiZSB2aXNpYmxlYCwgcGFnZSwgbm9kZSk7XG4gICAgY29uc3QgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9ec3RlcCR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaCR8XnMtbXVsdGlzdGVwLWJydXNoLVxcZCskfF5zLW11bHRpc3RlcC1iZyR8XmJydXNoLW5hbWUtXFx3KyR8XnNzLVxcZCskfF5icy1cXGQrJHxeby1cXGQrJC8udGVzdCh0YWcpLCBgVGFnICcke3RhZ30nIHVua25vd25gLCBwYWdlLCBub2RlKTtcbiAgICAgICAgLy8gYXNzZXJ0KCEvXnMtbXVsdGlzdGVwLWJydXNoJHxecy1tdWx0aXN0ZXAtYmckLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgaXMgb2Jzb2xldGVgLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLldBUk4pOyAgICAgICAgXG4gICAgfSk7XG4gICAgY29uc3QgYmcgPSB0YWdzLmZpbmQoKHMpID0+IC9ecy1tdWx0aXN0ZXAtYmckfF5zLW11bHRpc3RlcC1iZy1cXGQrJC8udGVzdChzKSk7XG4gICAgY29uc3Qgc3MgPSBwYXJzZUludCgoX2EgPSB0YWdzLmZpbmQoKHMpID0+IC9ec3MtXFxkKyQvLnRlc3QocykpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVwbGFjZShcInNzLVwiLCBcIlwiKSk7XG4gICAgY29uc3QgbyA9IHRhZ3MuZmluZCgocykgPT4gL15vLVxcZCskLy50ZXN0KHMpKTtcbiAgICBjb25zdCBicyA9IHBhcnNlSW50KChfYiA9IHRhZ3MuZmluZCgocykgPT4gL15icy1cXGQrJC8udGVzdChzKSkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5yZXBsYWNlKFwiYnMtXCIsIFwiXCIpKTtcbiAgICBhc3NlcnQoIShiZyAmJiBzcyksIFwiU2hvdWxkIG5vdCB1c2UgYmcrc3NcIiwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5JTkZPKTtcbiAgICBhc3NlcnQoIXNzIHx8IHNzID49IDE1LCBcInNzIG11c3QgYmUgPj0gMTVcIiwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCFzcyB8fCAhYnMgfHwgc3MgPiBicywgXCJzcyBtdXN0IGJlID4gYnNcIiwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KCFicyB8fCBicyA8PSBic0xpbWl0LCBgYnMgbXVzdCBiZSA8PSAke2JzTGltaXR9IGZvciB0aGlzIHpvb20tc2NhbGVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoIW8gfHwgb3JkZXIgPT0gXCJsYXllcnNcIiwgYCR7b30gbXVzdCBiZSB1c2VkIG9ubHkgd2l0aCBzZXR0aW5ncyBvcmRlci1sYXllcnNgLCBwYWdlLCBub2RlKTtcbiAgICBjb25zdCBmZiA9IGZpbmRGaXJzdChub2RlLCAobikgPT4gbi5maWxscyAmJiBuLmZpbGxzWzBdKTtcbiAgICBhc3NlcnQoIWJnIHx8IGZmLCBcImJnIHN0ZXAgc2hvdWxkbid0IGJlIHVzZWQgd2l0aG91dCBmaWxsZWQtaW4gdmVjdG9yc1wiLCBwYWdlLCBub2RlLCBFcnJvckxldmVsLklORk8pO1xuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgobikgPT4ge1xuICAgICAgICBpZiAobi5uYW1lID0gXCJpbnB1dFwiKSB7XG4gICAgICAgICAgICBsaW50SW5wdXQocGFnZSwgbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobi5uYW1lID0gXCJ0ZW1wbGF0ZVwiKSB7XG4gICAgICAgICAgICAvLyBsaW50IHRlbXBsYXRlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIFwiTXVzdCBiZSAnaW5wdXQnIG9yICd0ZW1wbGF0ZSdcIiwgcGFnZSwgbik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBibGlua05vZGVzID0gZmluZEFsbChub2RlLCAobikgPT4gZ2V0VGFncyhuKS5maW5kKCh0KSA9PiAvXmJsaW5rJC8udGVzdCh0KSkgIT09IHVuZGVmaW5lZCkuZmxhdE1hcChkZWVwTm9kZXMpO1xuICAgIGNvbnN0IGZpbGxlZE5vZGUgPSBibGlua05vZGVzLmZpbmQoKG4pID0+IG4uZmlsbHNbMF0pO1xuICAgIGFzc2VydChibGlua05vZGVzLmxlbmd0aCA9PSAwIHx8ICEhZmlsbGVkTm9kZSB8fCBibGlua05vZGVzLmxlbmd0aCA+IDMsIGBTaG91bGQgdXNlIGRyYXctbGluZSBpZiA8IDQgbGluZXNgLCBwYWdlLCBibGlua05vZGVzWzBdLCBFcnJvckxldmVsLklORk8pO1xufVxuZnVuY3Rpb24gZGVlcE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIFtub2RlXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuY2hpbGRyZW4uZmxhdE1hcCgobikgPT4gZGVlcE5vZGVzKG4pKTtcbn1cbmZ1bmN0aW9uIGxpbnRTZXR0aW5ncyhwYWdlLCBub2RlKSB7XG4gICAgdmFyIF9hO1xuICAgIGFzc2VydChub2RlLnR5cGUgPT0gXCJFTExJUFNFXCIsIGBNdXN0IGJlICdFTExJUFNFJyB0eXBlJ2AsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGNvbnN0IHRhZ3MgPSBnZXRUYWdzKG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXnNldHRpbmdzJHxeY2FwdHVyZS1jb2xvciR8Xnpvb20tc2NhbGUtXFxkKyR8Xm9yZGVyLWxheWVycyR8XnMtbXVsdGlzdGVwLWJnLVxcZCskfF5zLW11bHRpc3RlcC1yZXN1bHQkfF5zLW11bHRpc3RlcC1icnVzaC1cXGQrJHxeYnJ1c2gtbmFtZS1cXHcrJHxec3MtXFxkKyR8XmJzLVxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGlmICh0YWdzLmZpbmQoKHRhZykgPT4gL15vcmRlci1sYXllcnMkLy50ZXN0KHRhZykpKSB7XG4gICAgICAgIG9yZGVyID0gXCJsYXllcnNcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9yZGVyID0gXCJzdGVwc1wiO1xuICAgIH1cbiAgICBjb25zdCB6cyA9IHBhcnNlSW50KChfYSA9IHRhZ3MuZmluZCgocykgPT4gL156b29tLXNjYWxlLVxcZCskLy50ZXN0KHMpKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlcGxhY2UoXCJ6b29tLXNjYWxlLVwiLCBcIlwiKSk7XG4gICAgYXNzZXJ0KGlzTmFOKHpzKSB8fCB6cyA+IDEgJiYgenMgPD0gNSwgYE11c3QgYmUgMSA8IHpvb20tc2NhbGUgPD0gNSAoJHt6c30pYCwgcGFnZSwgbm9kZSk7XG4gICAgYnNMaW1pdCA9IHpzICogMTIuODtcbn1cbmZ1bmN0aW9uIGxpbnRJbnB1dChwYWdlLCBub2RlKSB7XG4gICAgaWYgKCFhc3NlcnQobm9kZS50eXBlID09IFwiR1JPVVBcIiwgYE11c3QgYmUgJ0dST1VQJyB0eXBlJ2AsIHBhZ2UsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXNzZXJ0KG5vZGUub3BhY2l0eSA9PSAxLCBgTXVzdCBiZSBvcGFxdWVgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQobm9kZS52aXNpYmxlLCBgTXVzdCBiZSB2aXNpYmxlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUubmFtZSA9PSBcImlucHV0XCIsIGBNdXN0IGJlICdpbnB1dCdgLCBwYWdlLCBub2RlKTtcbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKHYpID0+IHtcbiAgICAgICAgaWYgKHYudHlwZSA9PSBcIkdST1VQXCIpIHtcbiAgICAgICAgICAgIGxpbnRHcm91cChwYWdlLCB2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvUkVDVEFOR0xFfEVMTElQU0V8VkVDVE9SLy50ZXN0KHYudHlwZSkpIHtcbiAgICAgICAgICAgIGxpbnRWZWN0b3IocGFnZSwgdik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3NlcnQoZmFsc2UsIGBNdXN0IGJlICdHUk9VUCcgb3IgJ1ZFQ1RPUicgdHlwZWAsIHBhZ2UsIHYpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRUYWdzKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5uYW1lLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbik7XG59XG5mdW5jdGlvbiBsaW50VmVjdG9yKHBhZ2UsIG5vZGUpIHtcbiAgICBhc3NlcnQobm9kZS5vcGFjaXR5ID09IDEsIGBNdXN0IGJlIG9wYXF1ZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGFzc2VydChub2RlLnZpc2libGUsIGBNdXN0IGJlIHZpc2libGVgLCBwYWdlLCBub2RlKTtcbiAgICBsZXQgdGFncyA9IGdldFRhZ3Mobm9kZSk7XG4gICAgYXNzZXJ0KHRhZ3MubGVuZ3RoID4gMCwgYE5hbWUgbXVzdCBub3QgYmUgZW1wdHkuIFVzZSBzbGFzaCB0byAvaWdub3JlLmAsIHBhZ2UsIG5vZGUpO1xuICAgIHRhZ3MuZm9yRWFjaCgodGFnKSA9PiB7XG4gICAgICAgIGFzc2VydCgvXlxcL3xeZHJhdy1saW5lJHxeYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5kXFxkKyR8XnJcXGQrJHxeZmxpcCQvLnRlc3QodGFnKSwgYFRhZyAnJHt0YWd9JyB1bmtub3duLiBVc2Ugc2xhc2ggdG8gL2lnbm9yZS5gLCBwYWdlLCBub2RlKTtcbiAgICB9KTtcbiAgICBsZXQgZmlsbHMgPSBub2RlLmZpbGxzO1xuICAgIGxldCBzdHJva2VzID0gbm9kZS5zdHJva2VzO1xuICAgIGFzc2VydCghZmlsbHMubGVuZ3RoIHx8ICFzdHJva2VzLmxlbmd0aCwgYE11c3Qgbm90IGhhdmUgZmlsbCtzdHJva2VgLCBwYWdlLCBub2RlKTtcbiAgICBhc3NlcnQoIXN0cm9rZXMubGVuZ3RoIHx8IC9ST1VORHxOT05FLy50ZXN0KFN0cmluZyhub2RlLnN0cm9rZUNhcCkpLCBgU3Ryb2tlIGNhcHMgbXVzdCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlQ2FwKX0nYCwgcGFnZSwgbm9kZSwgRXJyb3JMZXZlbC5FUlJPUik7XG4gICAgYXNzZXJ0KCFzdHJva2VzLmxlbmd0aCB8fCBub2RlLnN0cm9rZUpvaW4gPT0gXCJST1VORFwiLCBgU3Ryb2tlIGpvaW5zIHNob3VsZCBiZSAnUk9VTkQnIGJ1dCBhcmUgJyR7U3RyaW5nKG5vZGUuc3Ryb2tlSm9pbil9J2AsIHBhZ2UsIG5vZGUsIEVycm9yTGV2ZWwuSU5GTyk7XG4gICAgY29uc3QgcmdidCA9IHRhZ3MuZmluZCgocykgPT4gL15yZ2ItdGVtcGxhdGUkLy50ZXN0KHMpKTtcbiAgICBjb25zdCBhbmltID0gdGFncy5maW5kKChzKSA9PiAvXmJsaW5rJHxeZHJhdy1saW5lJC8udGVzdChzKSk7XG4gICAgYXNzZXJ0KCFyZ2J0IHx8ICEhYW5pbSwgYE11c3QgaGF2ZSAnYmxpbmsnIG9yICdkcmF3LWxpbmUnYCwgcGFnZSwgbm9kZSk7XG59XG5mdW5jdGlvbiBsaW50R3JvdXAocGFnZSwgbm9kZSkge1xuICAgIGFzc2VydChub2RlLm9wYWNpdHkgPT0gMSwgYE11c3QgYmUgb3BhcXVlYCwgcGFnZSwgbm9kZSk7XG4gICAgYXNzZXJ0KG5vZGUudmlzaWJsZSwgYE11c3QgYmUgdmlzaWJsZWAsIHBhZ2UsIG5vZGUpO1xuICAgIGxldCB0YWdzID0gZ2V0VGFncyhub2RlKTtcbiAgICBhc3NlcnQodGFncy5sZW5ndGggPiAwLCBgTmFtZSBtdXN0IG5vdCBiZSBlbXB0eS4gVXNlIHNsYXNoIHRvIC9pZ25vcmUuYCwgcGFnZSwgbm9kZSk7XG4gICAgdGFncy5mb3JFYWNoKCh0YWcpID0+IHtcbiAgICAgICAgYXNzZXJ0KC9eYmxpbmskfF5yZ2ItdGVtcGxhdGUkfF5ibGluayR8XmRcXGQrJHxeclxcZCskLy50ZXN0KHRhZyksIGBUYWcgJyR7dGFnfScgdW5rbm93bmAsIHBhZ2UsIG5vZGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJnYnQgPSB0YWdzLmZpbmQoKHMpID0+IC9ecmdiLXRlbXBsYXRlJC8udGVzdChzKSk7XG4gICAgY29uc3QgYW5pbSA9IHRhZ3MuZmluZCgocykgPT4gL15ibGluayQvLnRlc3QocykpO1xuICAgIGFzc2VydCghcmdidCB8fCAhIWFuaW0sIGBNdXN0IGhhdmUgJ2JsaW5rJ2AsIHBhZ2UsIG5vZGUpO1xufVxuLy8gbm8gaGlkZGVuIGZpbGwvc3Ryb2tlXG4vLyBubyBlZmZlY3RzXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==