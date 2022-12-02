import { on } from '../events'
import { findParent } from './util'

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

function displayImage(node: PageNode, el: FrameNode | RectangleNode) {
  if (node.children[0].type === 'RECTANGLE') {
    el.fills = node.children[0].fills
  }
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

function limitImageSize(
  width: number,
  height: number
): { w: number; h: number } {
  let w = width
  let h = height
  if (height > 1000) {
    h = 1000
    w = width * (1000 / height)
  } else if (width > 1200) {
    w = 1200
    h = height * (1200 / width)
  }
  return { w, h }
}

function createLesson(node: PageNode) {
  figma.currentPage.name = 'image'
  if (node.children.length !== 1) {
    return
  }

  const originalImage = node.children[0]
  const isImage =
    originalImage.type === 'RECTANGLE' &&
    originalImage.fills[0].type === 'IMAGE'
  if (isImage) {
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
    const stepRectangle = figma.createRectangle()
    stepRectangle.name = 'image'
    displayImage(node, stepRectangle)
    const imageSize = limitImageSize(
      figma.currentPage.children[0].width,
      figma.currentPage.children[0].height
    )
    const inputStep = figma.group([stepRectangle], lesson)
    inputStep.name = 'input'
    const firstStep = figma.group([inputStep], lesson)
    formatNode(firstStep, {
      name: 'step s-multistep-image',
      x: (lesson.width - imageSize.w) / 2,
      y: (lesson.height - imageSize.h) / 2,
      width: imageSize.w,
      height: imageSize.h,
    })

    // Create thumbnail
    const thumbnailRectangle = figma.createRectangle()
    displayImage(node, thumbnailRectangle)
    thumbnailRectangle.name = 'image'
    const thumbnailGroup = figma.group([thumbnailRectangle], thumbnail)
    formatNode(thumbnailGroup, {
      name: 'thumbnail group',
      x: 49,
      y: 79,
      width: 302,
      height: 242,
    })

    // Create result
    const resultRectangle = figma.createRectangle()
    fillServiceNodes(resultRectangle)
    const templateGroup = figma.group([resultRectangle], lesson)
    templateGroup.name = 'template'
    const result = figma.group([templateGroup], lesson)
    formatNode(result, {
      name: 'step s-multistep-result',
      x: 10,
      y: 60,
    })

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
}

function separateStep(nodes: readonly SceneNode[]) {
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

on('createLesson', () => createLesson(figma.currentPage))
on('separateStep', () => separateStep(figma.currentPage.selection))
