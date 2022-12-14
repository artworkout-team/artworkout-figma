import { findParent, findLeafNodes } from './util'

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
        r: 0.7686274647712708,
        g: 0.7686274647712708,
        b: 0.7686274647712708,
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
}

export function separateStep() {
  const nodes: readonly SceneNode[] = figma.currentPage.selection
  const parentStep = findParent(nodes[0], (n) => n.name.startsWith('step'))
  const frame = parentStep.parent
  const index = frame.children.findIndex((n) => n == parentStep)
  if (!parentStep) {
    return
  }
  const input = figma.group(nodes, frame)
  input.name = 'input'
  const newStep = figma.group([input], frame, index)
  newStep.name = parentStep.name
}

function stringifyColor(color: RGB) {
  let { r, g, b } = color
  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)
  return `rgb(${r}, ${g}, ${b})`
}

function createStepNode(node: FrameNode, nodesArray: SceneNode[]) {
  const input = figma.group(nodesArray, node)
  input.name = 'input'
  const step = figma.group([input], node)
  step.name = 'step s-multistep brush'
  node.appendChild(step)
}

function addToMap(map: Map<string, SceneNode[]>, key: string, node: SceneNode) {
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key).push(node)
}

export function splitByColor() {
  const lesson = figma.currentPage.children.find(
    (el) => el.name === 'lesson'
  ) as FrameNode
  if (lesson.children[0].type !== 'GROUP') {
    return
  }

  let fillsByColor: Map<string, SceneNode[]> = new Map<string, SceneNode[]>()
  let strokesByColor: Map<string, SceneNode[]> = new Map<string, SceneNode[]>()
  let unknownNodes: SceneNode[] = []

  findLeafNodes(lesson.children[0] as GroupNode).forEach((n: SceneNode) => {
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
  const result = lesson.children.find(
    (n) => n.name === 'step s-multistep-result'
  )
  if (result) {
    result.remove()
  }
  createResultNode(lesson)

  // Remove original node
  lesson.children[0].remove()
}
