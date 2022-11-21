import { getTags, findLeafNodes } from './util'

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
  switch (paint.type) {
    case 'SOLID': {
      const c = paint.color
      return { r: c.r * 255, g: c.g * 255, b: c.b * 255 }
    }
    default: {
      console.log(`Warning! Unsupported paint type ${paint.type}`)
      return { r: 166, g: 166, b: 166 }
    }
  }
}

function getColor(node: SceneNode) {
  let color = { r: 166, g: 166, b: 166 } // default color
  switch (node.type) {
    // TODO: check other cases
    case 'RECTANGLE':
    case 'POLYGON':
    case 'VECTOR': {
      if (node.fills !== figma.mixed && node.fills.length > 0) {
        color = getPaintColor(node.fills[0])
      } else if (node.strokes.length > 0) {
        color = getPaintColor(node.strokes[0])
      } else {
        console.log(`Warning! Unable to detect color of ${node.type} node`)
      }
      break
    }
    case 'GROUP': {
      const nodes = findLeafNodes(node)
      if (nodes.length > 0) {
        color = getColor(nodes[0])
      }
      break
    }
    default: {
      console.log(`Warning! Unsupported node type ${node.type}`)
      break
    }
  }
  return color
}

export function getStepNodes() {
  const lesson = figma.currentPage.children.find(
    (el) => el.name == 'lesson'
  ) as FrameNode
  return stepsByOrder(lesson).map((step) => {
    const c = getColor(step)
    return { id: step.id, name: step.name, color: `rgb(${c.r}, ${c.g}, ${c.b})` }
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
