import { emit, on } from '../events'
import { findLesson, getTags } from './util'

function getOrder(step: SceneNode) {
  const otag = getTags(step).find((t) => t.startsWith('o-')) || ''
  const o = parseInt(otag.replace('o-', ''))
  return isNaN(o) ? 9999 : o
}

function getTag(step, tag) {
  const v = getTags(step).find((t) => t.startsWith(tag))
  return v ? v.replace(tag, '') : '0'
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

let lastPage = figma.currentPage
let lastMode = 'all'

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
    .findAll((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type))
    .forEach((el: VectorNode) => {
      if (el.strokes.length > 0) {
        el.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1 } }]
        const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50
        el.strokeWeight = parseInt(getTag(step, 'ss-')) || defaultWeight
        const pink = el.clone()
        pink.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }]
        pink.strokeWeight = 2
        pink.name = 'pink ' + el.name
        template.appendChild(pink)
        // clone element here and give him thin pink stroke
      }
      if ((el.fills as Paint[]).length > 0) {
        el.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0, b: 1 } }]
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

function updateDisplay(
  page: PageNode,
  settings: { displayMode: string; stepNumber: number }
) {
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
  emit('updateForm', {
    shadowSize: parseInt(getTag(step, 'ss-')),
    brushSize: parseInt(getTag(step, 'bs-')),
    template: getTag(step, 's-'),
    stepCount,
    stepNumber,
    displayMode,
  })
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
      break

    case 'template':
      displayBrushSize(lesson, step)
      displayTemplate(lesson, step)
      break
  }
}

setTimeout(() => {
  updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 })
}, 1500)

function updateProps(settings: {
  shadowSize: number
  brushSize: number
  stepNumber: number
  template: string
}) {
  const lesson = findLesson()
  const step = stepsByOrder(lesson)[settings.stepNumber - 1] as GroupNode
  let tags = getTags(step).filter(
    (t) => !t.startsWith('ss-') && !t.startsWith('bs-') && !t.startsWith('s-')
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

  step.name = tags.join(' ')
}

on('updateDisplay', (settings) => updateDisplay(figma.currentPage, settings))
on('updateProps', updateProps)
figma.on('currentpagechange', () => {
  updateDisplay(lastPage, { displayMode: 'all', stepNumber: 1 })
  updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 })
})
figma.on('selectionchange', () => {
  const lesson = findLesson()
  const selection = figma.currentPage.selection[0]
  if (
    !selection ||
    !lesson ||
    !lesson.children.includes(selection) ||
    selection.type !== 'GROUP'
  ) {
    return
  }
  //update step
  const step = figma.currentPage.selection[0] as GroupNode
  const stepNumber = stepsByOrder(lesson).indexOf(step) + 1
  updateDisplay(figma.currentPage, { displayMode: lastMode, stepNumber })
})
