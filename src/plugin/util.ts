import { emit } from '../events'
import { Step } from './tune-rpc'

export function findAll(node: BaseNode, f: (node: BaseNode) => boolean) {
  let arr: BaseNode[] = []
  if (f(node)) {
    arr.push(node)
  }
  const children = (node as any).children
  if (children) {
    arr = arr.concat(children.flatMap((p) => findAll(p, f)))
  }
  return arr
}

export function findLeafNodes(node: BaseNode): SceneNode[] {
  if (!('children' in node)) {
    return [node]
  }
  return (node as GroupNode).findAll((n) => !('children' in n))
}

export function findParent(node: BaseNode, f: (node: BaseNode) => boolean) {
  if (f(node)) {
    return node
  }
  if (node?.parent) {
    return findParent(node.parent, f)
  }
}

export function getNodeIndex(node: BaseNode) {
  return node.parent.children.findIndex((n: BaseNode) => n.id === node.id)
}

export function getCurrentLesson() {
  return figma.currentPage.children.find(
    (el) => el.name === 'lesson'
  ) as FrameNode;
}

export function getTags(node: BaseNode | Step) {
  return node?.name ? node?.name?.split(' ').filter(Boolean) : []
}

export function findTag(node: BaseNode | Step, tag: RegExp) {
  const tags = getTags(node)
  return tags.find((s) => tag.test(s))
}

export function addTag(node: BaseNode, tag: string) {
  node.name = getTags(node).concat([tag]).join(' ')
}

export function findParentByTag(node: BaseNode, tag: string): GroupNode {
  return findParent(node, (n) => getTags(n).includes(tag))
}

export function findChildrenByTag(node: BaseNode, tag: string): BaseNode[] {
  const predicate = (n: BaseNode) => {
    return getTags(n).includes(tag)
  };
  return findAll(node, predicate);
}

export function isResultStep(node: BaseNode) {
  return node && getTags(node).includes('s-multistep-result')
}

export function print(text: string) {
  emit('print', text)
}

export function displayNotification(message: string) {
  figma.notify(message)
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function getStepOrder(step: SceneNode | Step): number {
  const stepOrderTag = /^o-(\d+)$/
  const stepTag = getTags(step).find((tag) => tag.match(stepOrderTag))
  if (stepTag) {
    return Number(stepTag.match(stepOrderTag)[1])
  }
}

export function resizeUi(isWide: boolean) {
  if (isWide) {
    figma.ui.resize(900, 470)
  } else {
    figma.ui.resize(340, 470)
  }
}

export function setStepOrder(step: SceneNode, stepOrder: number) {
  getTags(step).some((tag) => /^o-\d+$/.test(tag))
    ? (step.name = step.name.replace(/o-\d+/, `o-${stepOrder}`))
    : (step.name += ` o-${stepOrder}`)
}

export function getAllTree(node: GroupNode): SceneNode[] {
  if (!node.children) {
    return [node]
  }
  return [node, ...node.children.flatMap((n) => getAllTree(n as GroupNode))]
}

export function descendants(node: GroupNode): SceneNode[] {
  if (!node.children) {
    return []
  }
  return node.children.flatMap((n) => getAllTree(n as GroupNode))
}

export function findNextBrushStep(steps: SceneNode[]) {
  return steps.find((step) => {
    return getTags(step).includes('s-multistep-brush')
  })
}

export function findLessonGroup(page: PageNode) {
  return page.children.find((el) => el.name == 'lesson') as FrameNode
}

export function getParamValue(el, pattern) {
  for (let cl of el) {
    const match = cl.match(pattern)
    if (match) {
      return parseInt(match[1])
    }
  }
  return 0
}

export function isRGBTemplate(node: SceneNode) {
  return findTag(node, /^rgb-template$/) || findParentByTag(node, 'rgb-template')
}
