import {on} from '../events'
import {findAll} from './util'

on("autoFormat", autoFormat)

export function autoFormat() {
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