import {
  findLeafNodes,
  findParentByTag,
  getCurrentLesson,
  getParamValue,
  getStepOrder,
  getTags,
  isResultStep,
} from './util'
import { uiApi } from '../rpc-api'

export interface formProps {
  shadowSize: number
  brushSize: number
  stepNumber: number
  template: string
  clearLayers: string[]
  clearBefore: boolean
  otherTags: string[]
  brushType: string
  animationTag?: string
  delay?: number
  repeat?: number
  suggestedBrushSize?: number
  stepCount?: number
  displayMode?: string
}

function getOrder(step: SceneNode) {
  const otag = getTags(step).find((t) => t.startsWith('o-')) || ''
  const o = parseInt(otag.replace('o-', ''))
  return isNaN(o) ? 9999 : o
}

function getTag(step, tag) {
  const v = getTags(step).find((t) => t.startsWith(tag))
  return v ? v.replace(tag, '') : null
}

function stepsByOrder(lesson: FrameNode) {
  return lesson.children
    .filter((n) => getTags(n).includes('step'))
    .sort((a, b) => {
      return getOrder(a) - getOrder(b)
    })
}

function deleteTmp() {
  figma.currentPage
    .findAll((el) => el.name.startsWith('tmp-'))
    .forEach((el) => el.remove())
}

let lastMode = 'all'
let lastPage: PageNode

function displayTemplate(lesson: FrameNode, step: GroupNode) {
  lesson.children.forEach((step) => {
    step.visible = false
  })

  const input = step.findChild((g) => g.name == 'input')
  if (!input) {
    return
  }
  const template = input.clone() as GroupNode
  template.name = 'tmp-template'
  template
    .findAll((el) => getTags(el).includes('rgb-template'))
    .map((el) => findLeafNodes(el))
    .flat()
    .filter((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type))
    .forEach((el: VectorNode) => {
      const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50
      const ss = parseInt(getTag(step, 'ss-')) || defaultWeight

      if (el.strokes.length > 0 && (el.fills as Paint[]).length > 0) {
        const green = el.clone()
        green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }]
        green.strokeWeight += ss
        template.appendChild(green)
      }

      if (el.strokes.length > 0 && !(el.fills as Paint[]).length) {
        const green = el.clone()
        green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }]
        green.strokeWeight = ss * 1.1
        template.appendChild(green)
      }
      if ((el.fills as Paint[]).length > 0 && !el.strokes.length) {
        const green = el.clone()
        green.strokes = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 } }]
        green.strokeWeight = ss
        template.appendChild(green)
      }
      if (el.strokes.length > 0) {
        const blue = el.clone()
        blue.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }]
        blue.strokeWeight = ss
        template.appendChild(blue)
        const pink = el.clone()
        pink.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }]
        pink.strokeWeight = 2
        pink.name = 'pink ' + el.name
        template.appendChild(pink)
      }
      if ((el.fills as Paint[]).length > 0) {
        const fillsBlue = el.clone()
        fillsBlue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }]
        template.appendChild(fillsBlue)
      }
    })
  lesson.appendChild(template)
  template.relativeTransform = input.relativeTransform
}

function displayBrushSize(lesson: FrameNode, step: GroupNode) {
  const defaultBS = getTag(step, 's-') == 'multistep-bg' ? 12.8 : 10
  const bs = parseInt(getTag(step, 'bs-')) || defaultBS
  const smallLine = figma.createLine()
  smallLine.name = 'smallLine'
  smallLine.resize(300, 0)
  smallLine.strokes = [{ type: 'SOLID', color: { r: 0, g: 0.8, b: 0 } }]
  smallLine.strokeWeight = bs / 3
  smallLine.strokeCap = 'ROUND'
  smallLine.strokeAlign = 'CENTER'
  smallLine.y = smallLine.strokeWeight / 2

  const mediumLine = smallLine.clone()
  mediumLine.name = 'mediumLine'
  mediumLine.opacity = 0.2
  mediumLine.strokeWeight = bs
  mediumLine.y = mediumLine.strokeWeight / 2

  const bigLine = smallLine.clone()
  bigLine.name = 'bigLine'
  bigLine.opacity = 0.1
  bigLine.strokeWeight = bs + Math.pow(bs, 1.4) * 0.8
  bigLine.y = bigLine.strokeWeight / 2

  const group = figma.group([bigLine, mediumLine, smallLine], lesson.parent)

  group.name = 'tmp-bs'
  group.x = lesson.x
  group.y = lesson.y - 80
}

function getBrushSize(step: GroupNode) {
  const leaves = findLeafNodes(step)
  const strokes = leaves.filter((n) => 'strokes' in n && n.strokes.length > 0)
  const strokeWeightsArr = strokes.map((node) => node['strokeWeight'] || 0)
  const maxWeight = Math.max(...strokeWeightsArr)
  return strokes.length > 0 ? maxWeight : 25
}

function getClearLayerNumbers(step: SceneNode): number[] {
  const prefix = 'clear-layer-'
  const clearLayersStep = getTags(step).filter((tag) => tag.startsWith(prefix))
  if (clearLayersStep.length !== 1) {
    return []
  }
  const layerNumbers = clearLayersStep[0]
    .slice(prefix.length)
    .split(',')
    .map(Number)
  return layerNumbers
}

function showOnlyRGBTemplate(node: GroupNode) {
  if (getTags(node).includes('settings')) {
    node.visible = false
    return
  }
  if (
    getTags(node).includes('rgb-template') ||
    /GROUP|BOOLEAN_OPERATION/.test(node.type)
  ) {
    return
  }
  node.children.forEach((v) => {
    if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
      return showOnlyRGBTemplate(v as GroupNode)
    }
    if (
      /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type) &&
      !getTags(v).includes('rgb-template')
    ) {
      return (v.visible = false)
    }
  })
}

function collectLayerNumbersToClear(lesson: FrameNode, step: GroupNode) {
  const currentStepOrder = getStepOrder(step)
  const layersStepOrderTags = lesson.children.map((s) => getStepOrder(s))
  const clearLayerNumbers = lesson.children.reduce((acc, layer) => {
    if (layer.type !== 'GROUP' || getStepOrder(layer) > currentStepOrder) {
      return acc
    }
    if (getTags(layer).includes('clear-before')) {
      // calculate step order tags and convert to layers to clear
      const stepsToClear = [...Array(getStepOrder(layer)).keys()].slice(1)
      stepsToClear.forEach((stepOrder) => {
        if (layersStepOrderTags.includes(stepOrder)) {
          acc.add(layersStepOrderTags.indexOf(stepOrder))
        }
      })
    }
    getClearLayerNumbers(layer).forEach((idx) => acc.add(idx))
    return acc
  }, new Set<number>())
  return clearLayerNumbers
}

export async function updateDisplay(
  settings: { displayMode: string; stepNumber: number },
  page?: PageNode
) {
  page = page || figma.currentPage
  lastPage = page
  lastMode = settings.displayMode
  const { displayMode, stepNumber } = settings
  const lesson = page.children.find((el) => el.name == 'lesson') as FrameNode
  if (!lesson) {
    return
  }
  const step = stepsByOrder(lesson)[stepNumber - 1] as GroupNode
  page.selection = [step]
  const stepCount = lesson.children.filter((n) =>
    getTags(n).includes('step')
  ).length
  const maxStrokeWeight = getBrushSize(step)
  const brushType = getTag(step, 'brush-name-') || ''
  let layerNumbersToClear = getTags(step).includes('clear-before')
    ? [...Array(stepNumber).keys()].slice(1)
    : getClearLayerNumbers(step)
  await uiApi.updateUiProps({
    shadowSize: parseInt(getTag(step, 'ss-')) || 0,
    brushSize: parseInt(getTag(step, 'bs-')) || 0,
    suggestedBrushSize: isResultStep(step) ? 0 : maxStrokeWeight,
    template: getTag(step, 's-') || '0',
    stepCount,
    stepNumber,
    displayMode,
    clearBefore: getTags(step).includes('clear-before'),
    clearLayers: layerNumbersToClear.map((n) => n.toString()) || [],
    otherTags:
      getTags(step).filter(
        (t) => t.startsWith('share-button') || t.startsWith('allow-undo')
      ) || [],
    brushType,
  })
  await uiApi.setStepNavigationProps(stepNumber, displayMode)
  deleteTmp()
  switch (displayMode) {
    case 'all':
      lesson.children.forEach((step) => {
        step.visible = true
      })
      break

    case 'current':
      displayBrushSize(lesson, step)
      lesson.children.forEach((step) => {
        step.visible = false
      })
      step.visible = true
      break

    case 'previous':
      displayBrushSize(lesson, step)
      stepsByOrder(lesson).forEach((step, i) => {
        step.visible = i < stepNumber
      })
      collectLayerNumbersToClear(lesson, step).forEach((i) => {
        lesson.children[i].visible = false
      })
      lesson.children.forEach((step) => showOnlyRGBTemplate(step as GroupNode))
      break

    case 'template':
      displayBrushSize(lesson, step)
      displayTemplate(lesson, step)
      break
  }
}

function addAnimationTag(
  step: GroupNode,
  tag: string,
  delay: number,
  repeat: number
) {
  if (figma.currentPage.selection) {
    let selectionTags = getTags(figma.currentPage.selection[0]).filter((t) => {
      return !/^(wiggle|fly-from-|appear$|blink$|draw-line|[dr]-?\d+$)/g.test(t)
    })
    if (tag) {
      selectionTags.push(tag)
      if (delay) {
        selectionTags.push(`d${delay}`)
      }
      if (repeat) {
        selectionTags.push(`r${repeat}`)
      }
      figma.currentPage.selection[0].name = selectionTags.join(' ')
    } else {
      figma.currentPage.selection[0].name = selectionTags.join(' ')
    }
  }
}

export function updateProps(settings: formProps) {
  const lesson = getCurrentLesson()

  const step = stepsByOrder(lesson)[settings.stepNumber - 1] as GroupNode
  let tags = getTags(step).filter(
    (t) =>
      !t.startsWith('ss-') &&
      !t.startsWith('bs-') &&
      !t.startsWith('s-') &&
      !t.startsWith('clear-layer-') &&
      !t.startsWith('clear-before') &&
      !t.startsWith('share-button') &&
      !t.startsWith('allow-undo') &&
      !t.startsWith('brush-name-')
  )
  if (settings.template) {
    tags.splice(1, 0, `s-${settings.template}`)
  }
  if (settings.shadowSize) {
    tags.push(`ss-${settings.shadowSize}`)
  }
  if (settings.brushSize) {
    tags.push(`bs-${settings.brushSize}`)
  }
  if (settings.brushType) {
    tags.push(`brush-name-${settings.brushType}`)
  }
  if (settings.clearLayers.length > 0) {
    if (!settings.clearBefore) {
      tags.push(`clear-layer-${settings.clearLayers.join(',')}`)
    }
  }
  if (settings.clearBefore) {
    tags.push('clear-before')
  }

  if (settings.otherTags.length > 0) {
    tags = tags.concat(settings.otherTags)
  }
  if (settings.animationTag !== undefined) {
    addAnimationTag(
      step,
      settings.animationTag,
      settings.delay,
      settings.repeat
    )
  }
  step.name = tags.join(' ')
}

export function currentPageChanged(pageNode: any) {
  if (figma && !lastPage) {
    lastPage = figma.currentPage
  }
  updateDisplay({ displayMode: 'all', stepNumber: 1 }, lastPage)
  updateDisplay({ displayMode: 'all', stepNumber: 1 })
  lastPage = pageNode
}

export async function selectionChanged() {
  const lesson = getCurrentLesson()
  const selection = figma.currentPage.selection[0]
  if (selection || lesson || selection.type !== 'FRAME') {
    const tags = getTags(selection)

    const animationTags = tags.find((t) =>
      /^wiggle|^fly-from-|^appear|^blink|^draw-line/.test(t)
    )
    const delay = getParamValue(tags, /^d-?(\d+)/)
    const repeat = getParamValue(tags, /^r-?(\d+)/)
    await uiApi.setAnimationTags(animationTags, delay, repeat)
    const parentStep = findParentByTag(selection, 'step')
    const stepNumber = stepsByOrder(lesson).indexOf(parentStep) + 1
    await uiApi.setStepNavigationProps(stepNumber, lastMode)
  }
  if (!selection || !lesson || !lesson.children.includes(selection)) {
    return
  }

  const step = figma.currentPage.selection[0] as GroupNode
  const stepNumber = stepsByOrder(lesson).indexOf(step) + 1
  updateDisplay({ displayMode: lastMode, stepNumber }, figma.currentPage)
}
