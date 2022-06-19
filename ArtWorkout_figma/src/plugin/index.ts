import {emit, on, once} from '../events'
import {selectError} from './linter'
import {getTags, findAll, findParent, capitalize, print} from './util'

figma.showUI(__html__);
figma.ui.resize(340, 450);

on("separateStep", () => separateStep(figma.currentPage.selection))
on("exportCourse", exportCourse)
on("generateCode", generateCode)
on("autoFormat", autoFormat)
on("selectError", selectError)
on("updateDisplay", (settings) => updateDisplay(figma.currentPage, settings))
on("updateProps", updateProps)
figma.on("currentpagechange", () => {
    updateDisplay(lastPage, {displayMode: "all", stepNumber: 1})
    updateDisplay(figma.currentPage, {displayMode: "all", stepNumber: 1})
})

function getOrder(step: SceneNode) {
    let o = parseInt(getTags(step).find((t) => t.startsWith("o-")).replace("o-", ""))
    return isNaN(o) ? 9999 : o
}

function getTag(step, tag) {
    const v = getTags(step).find((t) => t.startsWith(tag))
    return v ? v.replace(tag, "") : "0"
}

function stepsByOrder(lesson: FrameNode) {
    return lesson.children
    .filter((n) => getTags(n).includes("step"))
    .sort((a, b) => {
        return getOrder(a) - getOrder(b)
    })
}

function deleteTmp() {
    figma.currentPage.findAll((el) => el.name.startsWith("tmp-")).forEach((el) => el.remove());
}

let lastPage = figma.currentPage

function updateDisplay(page: PageNode, settings: {displayMode: string, stepNumber: number}) {
    lastPage = page
    const {displayMode, stepNumber} = settings
    const lesson = page.children.find((el)=> el.name == "lesson") as FrameNode
    const step = stepsByOrder(lesson)[stepNumber - 1] as GroupNode
    page.selection = [step]
    const stepCount = lesson.children.filter((n) => getTags(n).includes("step")).length
    emit("updateForm", {shadowSize: parseInt(getTag(step, "ss-")), brushSize: parseInt(getTag(step, "bs-")), template: getTag(step, "s-"), stepCount, stepNumber, displayMode})
    switch (displayMode) {
        case "all":
            deleteTmp();
            lesson.children.forEach((step) => {
                step.visible = true
            })
            break;

        case "current":
            deleteTmp();
            lesson.children.forEach((step) => {
                step.visible = false
            })
            step.visible = true
            break;

        case "previous":
            deleteTmp();
            stepsByOrder(lesson).forEach((step, i) => {
                step.visible = i < stepNumber ? true : false
            })
            break;

        case "template":
            deleteTmp();
            lesson.children.forEach((step) => {
                step.visible = false
            })
            const input = step.findChild((g) => g.name == "input")
            const template = input.clone() as GroupNode
            template.name = "tmp-template"
            // template.findAll((el) => el.type == "GROUP").forEach((el) => (figma as any).ungroup(el))
            template.findAll((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type)).forEach((el: VectorNode) => {
                if (el.strokes.length > 0) {
                    el.strokes = [{type: "SOLID", color: {r: 0, g: 0, b: 1}}]
                    const defaultWeight = getTag(step, "s-") == "multistep-bg" ? 30 : 50
                    el.strokeWeight = parseInt(getTag(step, "ss-")) || defaultWeight
                    const pink = el.clone()
                    pink.strokes = [{type: "SOLID", color: {r: 1, g: 0, b: 1}}]
                    pink.strokeWeight = 2
                    pink.name = "pink " + el.name
                    // template.insertChild(0, pink)
                    template.appendChild(pink)
                    // clone element here and give him thin pink stroke
                }
                if ((el.fills as Paint[]).length > 0) {
                    el.fills = [{type: "SOLID", color: {r: 0.1, g: 0, b: 1}}]
                }
            })
            lesson.appendChild(template)
            template.x = input.absoluteTransform[0][2] - lesson.absoluteTransform[0][2]
            template.y = input.absoluteTransform[1][2] - lesson.absoluteTransform[1][2]
            break;
    }
}

updateDisplay(figma.currentPage, {displayMode: "all", stepNumber: 1})

function updateProps(settings: {shadowSize: number, brushSize: number, stepNumber: number, template: string}) {
    const lesson = figma.currentPage.children.find((el)=> el.name == "lesson") as FrameNode
    const step = stepsByOrder(lesson)[settings.stepNumber - 1] as GroupNode
    let tags = getTags(step).filter((t) => !t.startsWith("ss-") && !t.startsWith("bs-") && !t.startsWith("s-"))
    if (settings.template) { tags.splice(1, 0, `s-${settings.template}`) }
    if (settings.shadowSize) { tags.push(`ss-${settings.shadowSize}`) }
    if (settings.brushSize) { tags.push(`bs-${settings.brushSize}`) }

    step.name = tags.join(" ")
}

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
        n.children[0].name = "template";
        (n.children[0] as GroupNode).children[0].name = "/ignore";
        n.resize(40, 40);
        n.x = 10;
        n.y = 60;
    });
}

function generateCode() {
    const code = generateSwiftCode() + generateTranslationsCode();
    print(code);
}

function generateTranslationsCode() {
    const courseName = figma.root.name.replace(/COURSE-/, "");
    let swiftCourseName = courseName.split("-").map(capitalize).join("");
    swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1)
    let tasks = ``;
    for (let page of figma.root.children) {
        if (page.name.toUpperCase() == "INDEX") {
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
        if (page.name.toUpperCase() == "INDEX") {
            continue;
        }
        tasks+=`        Task(path: "${courseName}/${page.name}", pro: true),\n`;
    }
    return `
let ${swiftCourseName} = Course(
    path: "${courseName}",
    tasks: [
${tasks}    ])
`;
}

async function exportCourse() {
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
                // svgOutlineText: false,
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
    emit("exportZip", {rootName: figma.root.name, lessons: lessons, thumbnails: thumbnails});
}
