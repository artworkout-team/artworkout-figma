import {
  getTags,
  findLeafNodes,
  getCurrentLesson,
  findParentByTag,
  isResultStep,
} from './util'

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

function getPaintColor(paint: Paint): RGBA {
  if (paint.type === 'SOLID') {
    let { r, g, b }: RGB = paint.color
    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
    return { r, g, b, a: 1 }
  } else {
    return { r: 166, g: 166, b: 166, a: 1 }
  }
}

function displayColor({ r, g, b, a }: RGBA): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function getColors(node: GroupNode) {
  const defaultColor: RGBA = { r: 0, g: 0, b: 0, a: 0 } // transparent = default color
  let fills: RGBA = defaultColor
  let strokes: RGBA = defaultColor
  const leaf = findLeafNodes(node)[0]
  if ('fills' in leaf && leaf.fills !== figma.mixed && leaf.fills.length > 0) {
    fills = getPaintColor(leaf.fills[0])
  }
  if ('strokes' in leaf && leaf.strokes.length > 0) {
    strokes = getPaintColor(leaf.strokes[0])
  }
  return {
    fillsColor: displayColor(fills),
    strokesColor: displayColor(strokes),
  }
}

export function getSteps(): Step[] {
  const lesson = getCurrentLesson()
  return stepsByOrder(lesson).map((step: GroupNode) => {
    return { id: step.id, name: step.name, colors: getColors(step) }
  })
}

export function setStepOrder(steps: [{ id: string }]) {
  const lesson = getCurrentLesson()
  steps.forEach((step, i) => {
    const s = lesson.findOne((el) => el.id == step.id)
    if (s) {
      s.name = s.name.replace(/o-\d+/, 'o-' + (i + 1))
    }
  })
}

export function getBrushSize() {
  const selection = figma.currentPage.selection
  const parentStep = findParentByTag(selection[0], 'step')
  if (isResultStep(parentStep)) {
    return 0
  }
  const leaves = findLeafNodes(parentStep)
  let strokes = leaves.filter((n) => 'strokes' in n && n.strokes.length > 0)
  let strokeWeightsArr = strokes.map((node) => node['strokeWeight'] || 0)
  let maxWeight = Math.max(...strokeWeightsArr)
  return strokes.length > 0 ? maxWeight : 25
}
