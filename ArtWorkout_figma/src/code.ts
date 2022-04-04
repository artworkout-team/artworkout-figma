figma.showUI(__html__);
figma.ui.resize(270, 150);

figma.ui.onmessage = async (msg) => {
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
};

function separateStep(nodes: readonly SceneNode[]) {
    const parentStep = findParent(nodes[0], (n) => n.name.startsWith("step"));
    const frame = parentStep.parent;
    const index = frame.children.findIndex((n) => n == parentStep);
    if (!parentStep) { return; }
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
        if(!thumbnailFrame || !lessonFrame) {
            return;
        }
        thumbnailFrame.x = lessonFrame.x - 440;
        thumbnailFrame.y = lessonFrame.y
    });
    findAll(figma.root, (node) => /^settings/.test(node.name))
    .forEach((n: GroupNode) => {
        n.resize(40, 40);
        n.x = 10;
        n.y = 10;
    });
    findAll(figma.root, (node) => /^step s-multistep-result/.test(node.name))
    .forEach((n: GroupNode) => {
        (n.children[0] as GroupNode).children[0].name = "/ignore";
        n.resize(40, 40);
        n.x = 10;
        n.y = 60;
    });
}

function findAll(node: BaseNode, f: (node: BaseNode)=>boolean) {
    let arr: BaseNode[] = [];
    if (f(node)) {
        arr.push(node);
    }
    const children = (node as any).children;
    if (children) {
        arr = arr.concat(children.flatMap((p) => findAll(p, f)));
    }
    return arr;
}

function findFirst(node: BaseNode, f: (node: BaseNode)=>boolean) {
    if (f(node)) {
        return node;
    }
    const children = (node as any).children;
    if (children) {
        for (let p of children) {
            let found = findFirst(p, f);
            if(found)
                return found;
        }
    }
}

function findParent(node: BaseNode, f: (node: BaseNode)=>boolean) {
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

function print(text: string) {
    figma.ui.resize(800, 600);
    figma.ui.postMessage({type: "print", text});
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function generateTranslationsCode() {
    const courseName = figma.root.name.replace(/COURSE-/, "");
    let swiftCourseName = courseName.split("-").map(capitalize).join("");
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1)
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "THUMBNAILS") {
            continue;
        }
        tasks+=`"task-name ${courseName}/${page.name}" = "${capitalize(page.name.split('-').join(" "))}";\n`;
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
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1)
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "THUMBNAILS") {
            continue;
        }
        tasks+=`        Task(path: "${courseName}/${page.name}"),\n`;
    }
    return `
let ${swiftCourseName} = Course(
    path: "${courseName}",
    tasks: [
${tasks}    ])
`;
}

async function exportFiles() {
    let lessons = [];
    let thumbnails = [];
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "THUMBNAILS") {
            continue;
        }
        const lesson = page.children.find((f) => f.name == "lesson");
        const thumbnail = page.children.find((f) => f.name == "thumbnail");
        if (lesson) {
            const bytes = await lesson.exportAsync({
                format: "SVG",
                svgOutlineText: false,
                svgIdAttribute: true,
            });
            const path = `${page.name}.svg`;
            lessons.push({path, bytes});
        }
        if (thumbnail) {
            const bytes = await thumbnail.exportAsync({
                format: "PNG",
                constraint: {
                    type: "WIDTH",
                    value: 600,
                },
            });
            const path = `thumbnails/${page.name.toLowerCase()}.png`;
            thumbnails.push({path, bytes});
        }
    }
    figma.ui.postMessage({type: "exportFiles", rootName: figma.root.name, lessons: lessons, thumbnails: thumbnails});
}

interface LintError {
    page?: PageNode;
    node?: SceneNode;
    error: string;
    level: ErrorLevel;
}

let errors: LintError[] = [];
let bsLimit = 12.8;
let order = "steps";

enum ErrorLevel {
    ERROR,
    WARN,
    INFO,
}

function printErrors() {
    errors.sort((a, b) => a.level - b.level);
    if(errors[0]?.page) {
        figma.currentPage = errors[0].page;
    }
    if(errors[0]?.node) {
            errors[0].page.selection = [errors[0].node];
    }
    let text = errors.map((e) => `${ErrorLevel[e.level]}\t| ${e.error} | PAGE:${e.page?.name || ""} ${e.node?.type}:${e.node?.name || ""}`).join("\n");
    text += "\nDone";
    print(text);
}

function assert(val: boolean, error: string, page?: PageNode, node?: SceneNode, level: ErrorLevel = ErrorLevel.ERROR) {
    if (!val) {
        errors.push({node, page, error, level});
    }
    return val
}

function lintCourse () {
    assert(/^COURSE-[a-z\-0-9]+$/.test(figma.root.name), `Course name '${figma.root.name}' must match COURSE-[a-z\-0-9]+`)
    const index = figma.root.children.find((p) => p.name == "INDEX");
    if(assert(!!index, `Must have 'INDEX' page`)) {
        lintIndex(index);
    }
    for (let page of figma.root.children) {
        lintPage(page);
    }
}

function lintIndex(page: PageNode) {
    if (!assert(page.children.length == 1, `Index page must contain exactly 1 element`, page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, `Must contain exactly 1 'thumbnail'`, page);
    lintThumbnail(page, page.children[0] as FrameNode);
}

function lintPage(page: PageNode) {
    if (/^\/|^INDEX$/.test(page.name)) { return; }
    if(!assert(/^[a-z\-0-9]+/.test(page.name), `Page name '${page.name}' must match [a-z\-0-9]+. Use slash to /ignore.`, page)) {
        return;
    }
    assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, `Must contain exactly 1 'thumbnail'`, page);
    assert(page.children.filter((s) => /^lesson$/.test(s.name)).length == 1, `Must contain exactly 1 'lesson'`, page);
    for (let node of page.children) {
        if (node.name == "lesson") {
            lintTaskFrame(page, node as FrameNode);
        } else if(node.name == "thumbnail") {
            lintThumbnail(page, node as FrameNode);
        } else {
            assert(/^\//.test(node.name), `Must be 'thumbnail' or 'lesson'. Use slash to /ignore.`, page, node, ErrorLevel.WARN);
        }
    }
}

function lintThumbnail(page: PageNode, node: FrameNode) {
    if (!assert(node.type == "FRAME", `Must be 'FRAME' type`, page, node)) {
        return
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.width == 400 && node.height == 400, `Must be 400x400`, page, node);
}

function lintTaskFrame(page: PageNode, node: FrameNode) {
    if (!assert(node.type == "FRAME", `Must be 'FRAME' type`, page, node)) {
        return
    }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    assert(node.width == 1366 && node.height == 1024, `Must be 1366x1024`, page, node);
    let settings = node.children.find((n) => n.name.startsWith("settings"));
    if (settings) {
        lintSettings(page, settings as EllipseNode);
    }
    let orderNumbers = {};
    for (let step of node.children) {
        const tags = getTags(step);
        tags.forEach((tag) => {
            const found = /^o-(d+)$/.exec(tag);
            if (!found) { return; }
            const o = found[1];
            assert(!orderNumbers[o], `Must have unique ${tag} values`, page, step)
            if (o) {
                orderNumbers[o] = 1;
            }
        })
    }
    for (let step of node.children) {
        if(step.name.startsWith("step")) {
            lintStep(page, step as GroupNode);
        } else if(!step.name.startsWith("settings")) {
            assert(false, `Must be 'settings' or 'step'`, page, step)
        }
    }
}

function lintStep(page: PageNode, node: GroupNode) {
    if(!assert(node.type == "GROUP", `Must be 'GROUP' type'`, page, node)) { return; }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    const tags = getTags(node);
    tags.forEach((tag) => {
        assert(/^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$|^o-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);
        // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);        
    });
    const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s));
    const ss = parseInt(tags.find((s) => /^ss-\d+$/.test(s))?.replace("ss-", ""));
    const o = tags.find((s) => /^o-\d+$/.test(s));
    const bs = parseInt(tags.find((s) => /^bs-\d+$/.test(s))?.replace("bs-", ""));
    assert(!(bg && ss), "Should not use bg+ss", page, node, ErrorLevel.INFO);
    assert(!ss || ss >= 15, "ss must be >= 15", page, node);
    assert(!ss || !bs || ss > bs, "ss must be > bs", page, node);
    assert(!bs || bs <= bsLimit, `bs must be <= ${bsLimit} for this zoom-scale`, page, node);
    assert(!o || order == "layers", `${o} must be used only with settings order-layers`, page, node);

    const ff = findFirst(node, (n: VectorNode) => n.fills && n.fills[0]);
    assert(!bg || ff, "bg step shouldn't be used without filled-in vectors", page, node, ErrorLevel.INFO);

    (node as GroupNode).children.forEach((n) =>{
        if (n.name = "input") {
            lintInput(page, n as GroupNode);
        } else if (n.name = "template") {
            // lint template
        } else {
            assert(false, "Must be 'input' or 'template'", page, n);
        }
    });
   
    const blinkNodes = findAll(node, (n) => getTags(n).find((t) => /^blink$/.test(t)) !== undefined).flatMap(deepNodes);
    const filledNode = blinkNodes.find((n) => (n as VectorNode).fills[0]);
    assert(blinkNodes.length == 0 || !!filledNode || blinkNodes.length > 3, `Should use draw-line if < 4 lines`, page, blinkNodes[0], ErrorLevel.INFO);
}

function deepNodes(node: GroupNode): SceneNode[] {
    if (!node.children) { return [node]; }
    return node.children.flatMap((n) => deepNodes(n as GroupNode));
}

function lintSettings(page: PageNode, node: EllipseNode) {
    assert(node.type == "ELLIPSE", `Must be 'ELLIPSE' type'`, page, node);
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    const tags = getTags(node);
    tags.forEach((tag) => {
        assert(/^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node);    
    });
    if (tags.find((tag) => /^order-layers$/.test(tag))) {
        order = "layers";
    } else {
        order = "steps";
    }

    const zs = parseInt(tags.find((s) => /^zoom-scale-\d+$/.test(s))?.replace("zoom-scale-", ""));
    assert(isNaN(zs) || zs > 1 && zs <= 5, `Must be 1 < zoom-scale <= 5 (${zs})`, page, node); 
    bsLimit = zs * 12.8;
}

function lintInput(page: PageNode, node: GroupNode) {
    if(!assert(node.type == "GROUP", `Must be 'GROUP' type'`, page, node)) { return; }
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    assert(node.name == "input", `Must be 'input'`, page, node);
    (node as GroupNode).children.forEach((v) =>{
        if (v.type == "GROUP") {
            lintGroup(page, v as GroupNode);
        } else if (/RECTANGLE|ELLIPSE|VECTOR/.test(v.type)) {
            lintVector(page, v as VectorNode);
        } else {
            assert(false, `Must be 'GROUP' or 'VECTOR' type`, page, v);
        }
    });
}

function getTags(node: BaseNode) {
    return node.name.split(" ").filter(Boolean);
}

function lintVector(page: PageNode, node: VectorNode) {
    assert(node.opacity == 1, `Must be opaque`, page, node);
    assert(node.visible, `Must be visible`, page, node);
    let tags = getTags(node);
    assert(tags.length > 0, `Name must not be empty. Use slash to /ignore.`, page, node);
    tags.forEach((tag) => {
        assert(/^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node);
    });
    let fills = node.fills as Paint[];
    let strokes = node.strokes;
    assert(!fills.length || !strokes.length, `Must not have fill+stroke`, page, node);
    assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)), `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR);
    assert(!strokes.length || node.strokeJoin == "ROUND", `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO);
    const rgbt = tags.find((s) => /^rgb-template$/.test(s));
    const anim = tags.find((s) => /^blink$|^draw-line$/.test(s));
    assert(!rgbt || !!anim, `Must have 'blink' or 'draw-line'`, page, node);
}

function lintGroup(page: PageNode, node: GroupNode) {
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
