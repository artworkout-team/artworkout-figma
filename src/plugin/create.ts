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

function createResult(node: PageNode | FrameNode) {
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
  createResult(node)

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

function initializeStructure(node: FrameNode, nodesArray: SceneNode[]) {
  const input = figma.group(nodesArray, node)
  input.name = 'input'
  const step = figma.group([input], node)
  step.name = 'step s-multistep brush'
  node.appendChild(step)
}

export function splitByColors() {
  const node: FrameNode = figma.currentPage.children[0] as FrameNode
  if (node.children[0].type !== 'GROUP') {
    return
  }

  let fillsByColor: Map<string, SceneNode[]> = new Map<string, SceneNode[]>()
  let strokesByColor: Map<string, SceneNode[]> = new Map<string, SceneNode[]>()
  let unknownNodes: SceneNode[] = []

  findLeafNodes(node.children[0] as GroupNode).forEach((n: SceneNode) => {
    if (n.type === 'VECTOR') {
      if (
        'fills' in n &&
        n.fills !== figma.mixed &&
        n.fills[0].type === 'SOLID'
      ) {
        const key = stringifyColor(n.fills[0].color)
        if (!fillsByColor.has(key)) {
          fillsByColor.set(key, [])
        }
        fillsByColor.get(key).push(n)
      } else if ('strokes' in n && n.strokes[0].type === 'SOLID') {
        const key = stringifyColor(n.strokes[0].color)
        if (!strokesByColor.has(key)) {
          strokesByColor.set(key, [])
        }
        strokesByColor.get(key).push(n)
      } else {
        unknownNodes.push(n)
      }
    } else {
      unknownNodes.push(n)
    }
  })

  if (fillsByColor.size > 0) {
    for (let fill of fillsByColor.values()) {
      initializeStructure(node, fill)
    }
  }
  if (strokesByColor.size > 0) {
    for (let stroke of strokesByColor.values()) {
      initializeStructure(node, stroke)
    }
    if (unknownNodes.length > 0) {
      initializeStructure(node, unknownNodes)
    }
  }

  // Make sure the result is located at the end
  const result = node.children.find((n) => n.name === 'step s-multistep-result')
  if (result) {
    result.remove()
  }
  createResult(node)

  // Remove original node
  node.children[0].remove()
}
