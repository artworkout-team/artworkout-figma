import {emit, on} from '../events'
import {getTags} from './util'

function getOrder(step: SceneNode) {
  let o = parseInt(getTags(step).find((t) => t.startsWith('o-')) || ''.replace('o-', ''))
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

function updateDisplay(page: PageNode, settings: {displayMode: string, stepNumber: number}) {
  lastPage = page
  const {displayMode, stepNumber} = settings
  const lesson = page.children.find((el)=> el.name == 'lesson') as FrameNode
  if (!lesson) {
    return
  }
  const step = stepsByOrder(lesson)[stepNumber - 1] as GroupNode
  page.selection = [step]
  const stepCount = lesson.children.filter((n) => getTags(n).includes('step')).length
  emit('updateForm', {shadowSize: parseInt(getTag(step, 'ss-')), brushSize: parseInt(getTag(step, 'bs-')), template: getTag(step, 's-'), stepCount, stepNumber, displayMode})
  switch (displayMode) {
    case 'all':
      deleteTmp()
      lesson.children.forEach((step) => {
        step.visible = true
      })
      break

    case 'current':
      deleteTmp()
      lesson.children.forEach((step) => {
        step.visible = false
      })
      step.visible = true
      break

    case 'previous':
      deleteTmp()
      stepsByOrder(lesson).forEach((step, i) => {
        step.visible = i < stepNumber
      })
      break

    case 'template':
      deleteTmp()
      lesson.children.forEach((step) => {
        step.visible = false
      })

      const input = step.findChild((g) => g.name == 'input')
      const template = input.clone() as GroupNode
      template.name = 'tmp-template'
      // template.findAll((el) => el.type == "GROUP").forEach((el) => (figma as any).ungroup(el))
      template.findAll((el) => /RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(el.type)).forEach((el: VectorNode) => {
        if (el.strokes.length > 0) {
          el.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 1}}]
          const defaultWeight = getTag(step, 's-') == 'multistep-bg' ? 30 : 50
          el.strokeWeight = parseInt(getTag(step, 'ss-')) || defaultWeight
          const pink = el.clone()
          pink.strokes = [{type: 'SOLID', color: {r: 1, g: 0, b: 1}}]
          pink.strokeWeight = 2
          pink.name = 'pink ' + el.name
          // template.insertChild(0, pink)
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
      break
  }
}

setTimeout(() => {
  updateDisplay(figma.currentPage, {displayMode: 'all', stepNumber: 1})
}, 1000)

function updateProps(settings: {shadowSize: number, brushSize: number, stepNumber: number, template: string}) {
  const lesson = figma.currentPage.children.find((el)=> el.name == 'lesson') as FrameNode
  const step = stepsByOrder(lesson)[settings.stepNumber - 1] as GroupNode
  let tags = getTags(step).filter((t) => !t.startsWith('ss-') && !t.startsWith('bs-') && !t.startsWith('s-'))
  if (settings.template) { tags.splice(1, 0, `s-${settings.template}`) }
  if (settings.shadowSize) { tags.push(`ss-${settings.shadowSize}`) }
  if (settings.brushSize) { tags.push(`bs-${settings.brushSize}`) }

  step.name = tags.join(' ')
}


on('updateDisplay', (settings) => updateDisplay(figma.currentPage, settings))
on('updateProps', updateProps)
figma.on('currentpagechange', () => {
  updateDisplay(lastPage, {displayMode: 'all', stepNumber: 1})
  updateDisplay(figma.currentPage, {displayMode: 'all', stepNumber: 1})
})
