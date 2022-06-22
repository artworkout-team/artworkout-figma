import {on} from '../events'
import {findParent} from './util'

on("separateStep", () => separateStep(figma.currentPage.selection))

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
