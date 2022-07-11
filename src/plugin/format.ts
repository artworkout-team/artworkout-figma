import {on} from '../events'
import {addTag, findAll, getTags} from './util'

function formatOrder(lesson: FrameNode) {
  if (lesson.findChild((n) => !!getTags(n).find((t) => /^o-/.test(t)))) {
    console.log('Found o-tag. formatOrder abort.')
    return
  }
  let settings = lesson.findChild((n) => getTags(n).includes('settings'))
  addTag(settings, 'order-layers')
  const layerRegex = /^(s-multistep-brush-|s-multistep-bg-)(\d+)$/
  const steps = lesson.findChildren((n) => getTags(n).includes('step') && !getTags(n).includes('s-multistep-result'))
  const result = lesson.findChild((n) => getTags(n).includes('s-multistep-result'))
  addTag(result, `o-${steps.length + 1}`)
  steps
    .reverse().forEach((step, order) => {
      let tags = getTags(step)
      const layerTag = tags.find((t) => layerRegex.test(t))
      let layer = 4
      if(layerTag) {
        layer = parseInt(layerRegex.exec(layerTag)[2])
        tags = tags.filter((t) => !layerRegex.test(t))
        tags.splice(1, 0, /^(s-multistep-brush|s-multistep-bg)/.exec(layerTag)[1])
      }
      step.setPluginData('layer', JSON.stringify(layer))
      tags.push(`o-${order + 1}`)
      step.name = tags.join(' ')
    })
  let sortedSteps = steps.sort((a, b) => JSON.parse(b.getPluginData('layer')) - JSON.parse(a.getPluginData('layer')))
  sortedSteps.forEach((s) => lesson.insertChild(1, s))
}

function autoFormat() {
  const thumbPage = figma.root.children.find((p) => p.name.toUpperCase() == 'THUMBNAILS')
  if (thumbPage) {
    figma.root.children.forEach((p) => {
      const thumbnailFrame = thumbPage.children.find((t) => t.name == p.name)
      if (p.children.find((t) => t.name == 'thumbnail') || !thumbnailFrame) {
        return
      }
      const clone = thumbnailFrame.clone() as FrameNode
      clone.resize(400, 400)
      clone.name = 'thumbnail'
      p.appendChild(clone)
    })
  }
  figma.root.children.forEach((p) => {
    const oldLessonFrame = p.children.find((t) => t.name == p.name)
    if (oldLessonFrame) {
      oldLessonFrame.name = 'lesson'
    }
    const thumbnailFrame = p.children.find((t) => t.name == 'thumbnail')
    const lessonFrame = p.children.find((t) => t.name == 'lesson')
    if(!thumbnailFrame || !lessonFrame) {
      return
    }
    thumbnailFrame.x = lessonFrame.x - 440
    thumbnailFrame.y = lessonFrame.y
  })
  findAll(figma.root, (node) => /^settings/.test(node.name))
    .forEach((n: GroupNode) => {
      n.resize(40, 40)
      n.x = 10
      n.y = 10
    })
  findAll(figma.root, (node) => /^step s-multistep-result/.test(node.name))
    .forEach((n: GroupNode) => {
      n.children[0].name = 'template';
      (n.children[0] as GroupNode).children[0].name = '/ignore'
      n.resize(40, 40)
      n.x = 10
      n.y = 60
    })
}

on('autoFormat', autoFormat)
on('formatOrder', () => formatOrder(figma.currentPage.findChild((t) => t.name == 'lesson') as FrameNode))