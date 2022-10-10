import {emit, on} from '../events'
import {getTags} from './util'

function getOrder(step: SceneNode) {
  const otag = (getTags(step).find((t) => t.startsWith('o-')) || '')
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
  figma.currentPage.findAll((el) => el.name.startsWith('tmp-')).forEach((el) => el.remove())
}

let lastPage = figma.currentPage

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
  template.findAll((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type)).forEach((el: VectorNode) => {
    if (el.strokes.length > 0) {
      el.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 1}}]
      const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50
      el.strokeWeight = parseInt(getTag(step, 'ss-')) || defaultWeight
      const pink = el.clone()
      pink.strokes = [{type: 'SOLID', color: {r: 1, g: 0, b: 1}}]
      pink.strokeWeight = 2
      pink.name = 'pink ' + el.name
      template.appendChild(pink)
      // clone element here and give him thin pink stroke
    }
    if ((el.fills as Paint[]).length > 0) {
      el.fills = [{type: 'SOLID', color: {r: 0.1, g: 0, b: 1}}]
    }
  })
  lesson.appendChild(template)
  template.x = input.absoluteTransform[0][2] - lesson.absoluteTransform[0][2]
  template.y = input.absoluteTransform[1][2] - lesson.absoluteTransform[1][2]
}

function displayBrushSize(lesson: FrameNode, step: GroupNode) {
  const defaultBS = getTag(step, 's-') == 'multistep-bg' ? 12.8 : 10
  const bs = parseInt(getTag(step, 'bs-')) || defaultBS
  const smallLine = figma.createLine()
  smallLine.name = 'smallLine'
  smallLine.resize(300, 0)
  smallLine.strokes = [{type: 'SOLID', color: {r: 0, g: 0.8, b: 0}}]
  smallLine.strokeWeight = bs / 3
  smallLine.strokeCap = 'ROUND'
  smallLine.strokeAlign = 'CENTER'
  smallLine.y = smallLine.strokeWeight / 2

  const bigLine = smallLine.clone()
  bigLine.name = 'bigLine'
  bigLine.opacity = 0.3
  bigLine.strokeWeight = bs + Math.pow(bs, 1.4) * 0.8
  bigLine.y = bigLine.strokeWeight / 2

  const group = figma.group([bigLine, smallLine], lesson.parent)

  group.name = 'tmp-bs'
  group.x = lesson.x
  group.y = lesson.y - 80
}

function updateDisplay(page: PageNode, settings: {displayMode: string, stepNumber: number}) {
  lastPage = page
  const {displayMode, stepNumber} = settings
  const lesson = page.children.find((el) => el.name == 'lesson') as FrameNode
  if (!lesson) {
    return
  }
  const step = stepsByOrder(lesson)[stepNumber - 1] as GroupNode
  page.selection = [step]
  const stepCount = lesson.children.filter((n) => getTags(n).includes('step')).length
  emit('updateForm', {shadowSize: parseInt(getTag(step, 'ss-')), brushSize: parseInt(getTag(step, 'bs-')), template: getTag(step, 's-'), stepCount, stepNumber, displayMode})
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
  updateDisplay(figma.currentPage, {displayMode: 'all', stepNumber: 1})
}, 1500)

function updateProps(settings: {shadowSize: number, brushSize: number, stepNumber: number, template: string}) {
  const lesson = figma.currentPage.children.find((el) => el.name == 'lesson') as FrameNode
  const step = stepsByOrder(lesson)[settings.stepNumber - 1] as GroupNode
  let tags = getTags(step).filter((t) => !t.startsWith('ss-') && !t.startsWith('bs-') && !t.startsWith('s-'))
  if (settings.template) {tags.splice(1, 0, `s-${settings.template}`)}
  if (settings.shadowSize) {tags.push(`ss-${settings.shadowSize}`)}
  if (settings.brushSize) {tags.push(`bs-${settings.brushSize}`)}

  step.name = tags.join(' ')
}


on('updateDisplay', (settings) => updateDisplay(figma.currentPage, settings))
on('updateProps', updateProps)
figma.on('currentpagechange', () => {
  updateDisplay(lastPage, {displayMode: 'all', stepNumber: 1})
  updateDisplay(figma.currentPage, {displayMode: 'all', stepNumber: 1})
})
