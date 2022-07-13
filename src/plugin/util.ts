import {emit} from '../events'

// eslint-disable-next-line no-unused-vars
export function findAll(node: BaseNode, f: (node: BaseNode)=>boolean) {
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

export function findParent(node: BaseNode, f: (node: BaseNode)=>boolean) {
  if (f(node)) {
    return node
  }
  if (node.parent) {
    return findParent(node.parent, f)
  }
}

export function findFirst(node: BaseNode, f: (node: BaseNode)=>boolean) {
  if (f(node)) {
    return node
  }
  const children = (node as any).children
  if (children) {
    for (let p of children) {
      let found = findFirst(p, f)
      if(found)
        return found
    }
  }
}

export function getTags(node: BaseNode) {
  return node.name.split(' ').filter(Boolean)
}

export function addTag(node: BaseNode, tag: string) {
  node.name = getTags(node).concat([tag]).join(' ')
}

export function print(text: string) {
  figma.ui.resize(700, 400)
  emit('print', text)
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
