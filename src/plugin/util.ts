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

export function findLeafNodes(node: GroupNode): SceneNode[] {
  return node.findAll((n) => !('children' in n))
}

export function findParent(node: BaseNode, f: (node: BaseNode) => boolean) {
  if (f(node)) {
    return node
  }
  if (node.parent) {
    return findParent(node.parent, f)
  }
}

export function getNodeIndex(node: BaseNode) {
  return node.parent.children.findIndex((n: BaseNode) => n.id === node.id)
}

export function findLesson() {
  return figma.currentPage.children.find(
    (el) => el.name === 'lesson'
  ) as FrameNode
}

export function getTags(node: BaseNode | Step) {
  return node.name.split(' ').filter(Boolean)
}

export function addTag(node: BaseNode, tag: string) {
  node.name = getTags(node).concat([tag]).join(' ')
}

export function findParentByTag(node: BaseNode, tag: string): GroupNode {
  return findParent(node, (n) => getTags(n).includes(tag))
}

export function isResultStep(node: BaseNode) {
  return node && getTags(node).includes('s-multistep-result')
}

export function print(text: string) {
  figma.ui.resize(700, 400)
  emit('print', text)
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
