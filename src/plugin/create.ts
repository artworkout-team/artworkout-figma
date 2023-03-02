import { getSteps, tagUnorderedSteps } from './tune-rpc'
import {
  findLeafNodes,
  getCurrentLesson,
  findParentByTag,
  getNodeIndex,
  getTags,
  isResultStep,
  getStepOrder,
  setStepOrder,
} from './util'

interface nodeParameters {
  name: string
  x: number
  y: number
  width?: number
  height?: number
}

function formatNode(
  node: FrameNode | GroupNode | RectangleNode | EllipseNode,
  parameters: nodeParameters
) {
  const { name, x, y, width = 40, height = 40 } = parameters
  node.name = name
  node.x = x
  node.y = y
  node.resize(width, height)
}

function fillServiceNodes(node: RectangleNode | EllipseNode) {
  node.fills = [
    {
      type: 'SOLID',
      color: {
        r: 196 / 255,
        g: 196 / 255,
        b: 196 / 255,
      },
    },
  ]
}

function rescaleImageNode(
  node: SceneNode,
  resizeParams: { maxWidth: number; maxHeight: number }
) {
  const { maxWidth, maxHeight } = resizeParams
  const isCorrectSize = node.width <= maxWidth && node.height <= maxHeight
  const isCorrectType =
    node.type === 'FRAME' || node.type === 'RECTANGLE' || node.type === 'VECTOR'
  if (isCorrectType && !isCorrectSize) {
    const scaleFactor = Math.min(maxWidth / node.width, maxHeight / node.height)
    node.rescale(scaleFactor)
  }
  return node
}

function createResultNode(node: FrameNode) {
  const resultRectangle = figma.createRectangle()
  fillServiceNodes(resultRectangle)
  const templateGroup = figma.group([resultRectangle], node)
  templateGroup.name = 'template'
  const result = figma.group([templateGroup], node)
  formatNode(result, {
    name: 'step s-multistep-result',
    x: 10,
    y: 60,
  })
}

export function createLesson() {
  const node: PageNode = figma.currentPage
  if (node.children.length !== 1) {
    return
  }

  const originalImage = node.children[0]
  const lesson = figma.createFrame()
  formatNode(lesson, {
    name: 'lesson',
    x: -461,
    y: -512,
    width: 1366,
    height: 1024,
  })

  const thumbnail = figma.createFrame()
  formatNode(thumbnail, {
    name: 'thumbnail',
    x: -901,
    y: -512,
    width: 400,
    height: 400,
  })

  // Create step
  const step = originalImage.clone()
  step.name = 'image'
  const resizedImage = rescaleImageNode(originalImage, {
    maxWidth: lesson.width - 83 * 2,
    maxHeight: lesson.height - 12 * 2,
  })
  const stepInput = figma.group([step], lesson)
  stepInput.name = 'input'
  const firstStep = figma.group([stepInput], lesson)
  formatNode(firstStep, {
    name: 'step s-multistep-brush',
    x: (lesson.width - resizedImage.width) / 2,
    y: (lesson.height - resizedImage.height) / 2,
    width: resizedImage.width,
    height: resizedImage.height,
  })

  // Create thumbnail
  const thumbnailImage = originalImage.clone()
  thumbnailImage.name = 'image'
  const resizedThumbnail = rescaleImageNode(thumbnailImage, {
    maxWidth: thumbnail.width - 35 * 2,
    maxHeight: thumbnail.height - 35 * 2,
  })
  const thumbnailGroup = figma.group([thumbnailImage], thumbnail)
  formatNode(thumbnailGroup, {
    name: 'thumbnail group',
    x: (thumbnail.width - resizedThumbnail.width) / 2,
    y: (thumbnail.height - resizedThumbnail.height) / 2,
    width: resizedThumbnail.width,
    height: resizedThumbnail.height,
  })

  // Create result
  createResultNode(lesson)

  // Create settings
  const settingsEllipse = figma.createEllipse()
  fillServiceNodes(settingsEllipse)
  formatNode(settingsEllipse, {
    name: 'settings capture-color zoom-scale-2 order-layers',
    x: 10,
    y: 10,
  })
  lesson.appendChild(settingsEllipse)

  originalImage.remove()
  tagUnorderedSteps()
}

function stringifyColor(color: RGB) {
  let { r, g, b } = color
  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)
  return `rgb(${r}, ${g}, ${b})`
}

function nameLeafNodes(nodes: SceneNode[]) {
  let allStrokes: boolean = !nodes.find(
    (node) =>
      'fills' in node && node.fills !== figma.mixed && node.fills.length > 0
  )
  for (let node of nodes) {
    node.name =
      'rgb-template ' + (allStrokes && nodes.length > 3 ? 'draw-line' : 'blink')
  }
}

function nameStepNode(step: GroupNode) {
  const leaves = findLeafNodes(step)
  let fills = leaves.filter(
    (n) => 'fills' in n && n.fills !== figma.mixed && n.fills.length > 0
  )
  let strokes = leaves.filter((n) => 'strokes' in n && n.strokes.length > 0)
  let multistepType = fills.length > 0 ? 'bg' : 'brush'
  let strokeWeightsArr = strokes.map((node) => node['strokeWeight'] || 0)
  let maxWeight = Math.max(...strokeWeightsArr)
  let weight: number = strokes.length > 0 ? maxWeight : 25
  step.name = `step s-multistep-${multistepType} bs-${weight}`
}

function createStepNode(
  node: FrameNode,
  nodesArray: SceneNode[],
  index?: number
) {
  if (!nodesArray.length) {
    return
  }
  nameLeafNodes(nodesArray)
  const input = figma.group(nodesArray, node)
  input.name = 'input'
  const step = figma.group([input], node, index)
  nameStepNode(step)
  return step
}

export function getLastStepOrder() {
  const stepsOrder = getSteps()
    .map((s) => getStepOrder(s))
    .filter((s) => s !== undefined)
  return Math.max(...stepsOrder, 0)
}

export function separateStep() {
  const selection = figma.currentPage.selection
  const leaves = selection.filter((node) => !('children' in node))
  if (!leaves.length) {
    return
  }
  const firstParentStep = findParentByTag(selection[0], 'step')
  if (isResultStep(firstParentStep)) {
    return
  }
  const lesson = getCurrentLesson()
  const index = getNodeIndex(firstParentStep)
  const step = createStepNode(lesson, leaves, index)
  const resultStep = lesson.children.find((n) =>
    getTags(n).includes('s-multistep-result')
  )
  const lastStepOrder = getLastStepOrder()
  if (lastStepOrder > 0) {
    setStepOrder(resultStep, lastStepOrder + 1)
    setStepOrder(step, lastStepOrder) // last step before result
  }
}

function addToMap(map: Map<string, SceneNode[]>, key: string, node: SceneNode) {
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key).push(node)
}

export function splitByColor() {
  const selection: readonly SceneNode[] = figma.currentPage.selection
  if (!selection.length) {
    return
  }
  const parentStep = findParentByTag(selection[0], 'step')
  const lesson = getCurrentLesson()
  const leaves = findLeafNodes(parentStep)
  if (!parentStep || isResultStep(parentStep) || leaves.length <= 1) {
    return
  }

  let fillsByColor: Map<string, SceneNode[]> = new Map<string, SceneNode[]>()
  let strokesByColor: Map<string, SceneNode[]> = new Map<string, SceneNode[]>()
  let unknownNodes: SceneNode[] = []

  findLeafNodes(parentStep).forEach((n: SceneNode) => {
    if (
      'fills' in n &&
      n.fills !== figma.mixed &&
      n.fills.length > 0 &&
      n.fills[0].type === 'SOLID'
    ) {
      addToMap(fillsByColor, stringifyColor(n.fills[0].color), n)
    } else if (
      'strokes' in n &&
      n.strokes.length > 0 &&
      n.strokes[0].type === 'SOLID'
    ) {
      addToMap(strokesByColor, stringifyColor(n.strokes[0].color), n)
    } else {
      unknownNodes.push(n)
    }
  })

  for (let fills of fillsByColor.values()) {
    createStepNode(lesson, fills)
  }
  for (let strokes of strokesByColor.values()) {
    createStepNode(lesson, strokes)
  }
  if (unknownNodes.length > 0) {
    createStepNode(lesson, unknownNodes)
  }

  // Make sure the result is located at the end
  const result = lesson.children.find((n) =>
    getTags(n).includes('s-multistep-result')
  )
  if (result) {
    result.remove()
  }
  createResultNode(lesson)

  // Remove original node if there are remains
  if (!parentStep.removed) {
    parentStep.remove()
  }

  tagUnorderedSteps()
}

export function joinSteps() {
  const selection = figma.currentPage.selection
  const allSteps = selection.every((n) => getTags(n).includes('step'))
  const steps = selection.filter((n) => !isResultStep(n))
  if (!allSteps || steps.length < 2) {
    return
  }
  const inputNodes = steps
    .map((step: GroupNode) =>
      step.children.filter((n) => n.name === 'input' && n.type === 'GROUP')
    )
    .flat() as GroupNode[]
  const leaves = inputNodes.map((n) => n.children).flat()
  const lesson = getCurrentLesson()
  const index = getNodeIndex(steps[0])
  const firstStepOrder = getStepOrder(steps[0])
  const joinedStep = createStepNode(lesson, leaves, index)
  if (firstStepOrder) {
    setStepOrder(joinedStep, firstStepOrder)
  }
}
