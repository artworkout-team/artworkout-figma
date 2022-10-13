import {getTags} from './util'

function getOrder(step: SceneNode) {
    const otag = (getTags(step).find((t) => t.startsWith('o-')) || '')
    const o = parseInt(otag.replace('o-', ''))
    return isNaN(o) ? 9999 : o
}

function stepsByOrder(lesson: FrameNode) {
    return lesson.children
        .filter((n) => getTags(n).includes('step'))
        .sort((a, b) => {
            return getOrder(a) - getOrder(b)
        })
}

export function getStepNodes() {
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson') as FrameNode
    return stepsByOrder(lesson).map((step) => {
        return {id: step.id, name: step.name}
    })
}

export function setStepOrder(steps: [{id: string}]) {
    const lesson = figma.currentPage.children.find((el) => el.name == 'lesson') as FrameNode
    steps.forEach((step, i) => {
        const s = lesson.findOne((el) => el.id == step.id)
        if (s) {
            s.name = s.name.replace(/o-\d+/, 'o-' + (i + 1))
        }
    })
}
