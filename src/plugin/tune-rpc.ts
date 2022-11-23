import { getTags, findLeafNodes } from './util'

export interface Step {
  id: string
  name: string
  colors: {
    fillsColor: string
    strokesColor: string
  }
}

function getOrder(step: SceneNode) {
  const otag = getTags(step).find((t) => t.startsWith('o-')) || ''
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

function getPaintColor(paint: Paint) {
  if (paint.type === 'SOLID') {
    const { r, g, b } = paint.color
    return { r: r * 255, g: g * 255, b: b * 255, a: 1 }
  } else {
    return { r: 166, g: 166, b: 166, a: 1 }
  }
}

function getColors(node: GroupNode) {
  let defaultColor = { r: 0, g: 0, b: 0, a: 0 } // transparent = default color
  let fills: { r: number, g: number, b: number, a: number } = defaultColor
  let strokes: { r: number, g: number, b: number, a: number } = defaultColor
  const leaf = findLeafNodes(node)[0]
  if ('fills' in leaf && leaf.fills !== figma.mixed && leaf.fills.length > 0) {
    fills = getPaintColor(leaf.fills[0])
  }
  if ('strokes' in leaf && leaf.strokes.length > 0) {
    strokes = getPaintColor(leaf.strokes[0])
  }
  return {
    fillsColor: displayColor(fills),
    strokesColor: displayColor(strokes)
  }
}

function displayColor(color: { r: number, g: number, b: number, a: number }): string {
  const { r, g, b, a } = color
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function getSteps(): Step[] {
  const lesson = figma.currentPage.children.find(
    (el) => el.name == 'lesson'
  ) as FrameNode
  return stepsByOrder(lesson).map((step: GroupNode) => {
    return { id: step.id, name: step.name, colors: getColors(step) }
  })
}

export function setStepOrder(steps: [{ id: string }]) {
  const lesson = figma.currentPage.children.find(
    (el) => el.name == 'lesson'
  ) as FrameNode
  steps.forEach((step, i) => {
    const s = lesson.findOne((el) => el.id == step.id)
    if (s) {
      s.name = s.name.replace(/o-\d+/, 'o-' + (i + 1))
    }
  })
}
