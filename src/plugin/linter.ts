import {on} from '../events'
import {print, getTags, findAll} from './util'

interface LintError {
  page?: PageNode;
  node?: SceneNode;
  error: string;
  level: ErrorLevel;
}

let errors: LintError[] = []
let zoomScale = 1
let maxBs = 12.8
let order = 'steps'

enum ErrorLevel {
  ERROR,
  WARN,
  INFO,
}

function selectError(index: number) {
  if (errors[index]?.page) {
    figma.currentPage = errors[index].page
  }

  console.log("''")
  if (errors[index]?.node) {
    errors[0].page.selection = [errors[index].node]
  }
}

function printErrors() {
  errors.sort((a, b) => a.level - b.level)
  selectError(0)
  let text = errors.map((e) => `${ErrorLevel[e.level]}\t| ${e.error} | PAGE:${e.page?.name || ''} ${e.node?.type}:${e.node?.name || ''}`).join('\n')
  text += '\nDone'
  print(text)
}

function assert(val: boolean, error: string, page?: PageNode, node?: SceneNode, level: ErrorLevel = ErrorLevel.ERROR) {
  if (!val) {
    errors.push({node, page, error, level})
  }
  return val
}

function lintVector(page: PageNode, node: VectorNode) {
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  let tags = getTags(node)
  assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node)
  tags.forEach((tag) => {
    assert(/^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$/.test(tag), `Tag '${tag}' unknown. Use slash to /ignore.`, page, node)
  })
  let fills = node.fills as Paint[]
  let strokes = node.strokes
  assert(!fills.length || !strokes.length, 'Must not have fill+stroke', page, node)
  assert(!strokes.length || /ROUND|NONE/.test(String(node.strokeCap)), `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`, page, node, ErrorLevel.ERROR)
  assert(!strokes.length || node.strokeJoin == 'ROUND', `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`, page, node, ErrorLevel.INFO)
  const rgbt = tags.find((s) => /^rgb-template$/.test(s))
  const anim = tags.find((s) => /^blink$|^draw-line$/.test(s))
  assert(!rgbt || !!anim, 'Must have \'blink\' or \'draw-line\'', page, node)
}

function lintGroup(page: PageNode, node: GroupNode) {
  assert(!/BOOLEAN_OPERATION/.test(node.type), 'Notice BOOLEAN_OPERATION', page, node, ErrorLevel.INFO)
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  let tags = getTags(node)
  assert(tags.length > 0, 'Name must not be empty. Use slash to /ignore.', page, node)
  tags.forEach((tag) => {
    assert(/^blink$|^rgb-template$|^d\d+$|^r\d+$/.test(tag), `Tag '${tag}' unknown`, page, node)
  })
  const rgbt = tags.find((s) => /^rgb-template$/.test(s))
  const anim = tags.find((s) => /^blink$/.test(s))
  assert(!rgbt || !!anim, 'Must have \'blink\'', page, node)
}

function lintInput(page: PageNode, node: GroupNode) {
  if (!assert(node.type == 'GROUP', 'Must be \'GROUP\' type\'', page, node)) {return }
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  assert(node.name == 'input', 'Must be \'input\'', page, node);
  (node as GroupNode).children.forEach((v) => {
    if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
      lintGroup(page, v as GroupNode)
    } else if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
      lintVector(page, v as VectorNode)
    } else {
      assert(false, 'Must be \'GROUP/VECTOR/RECTANGLE/ELLIPSE/TEXT\' type', page, v)
    }
  })
}

function lintSettings(page: PageNode, node: EllipseNode) {
  assert(node.type == 'ELLIPSE', 'Must be \'ELLIPSE\' type\'', page, node)
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  const tags = getTags(node)
  tags.forEach((tag) => {
    assert(/^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/.test(tag), `Tag '${tag}' unknown`, page, node)
  })
  if (tags.find((tag) => /^order-layers$/.test(tag))) {
    order = 'layers'
  } else {
    order = 'steps'
  }

  zoomScale = parseInt(tags.find((s) => /^zoom-scale-\d+$/.test(s))?.replace('zoom-scale-', '') || '1')
  assert(zoomScale >= 1 && zoomScale <= 5, `Must be 1 <= zoom-scale <= 5 (${zoomScale})`, page, node)
}

function deepNodes(node: GroupNode): SceneNode[] {
  if (!node.children) {return [node]}
  return node.children.flatMap((n) => deepNodes(n as GroupNode))
}

function lintStep(page: PageNode, step: GroupNode) {
  if (!assert(step.type == 'GROUP', 'Must be \'GROUP\' type\'', page, step)) {return }
  assert(step.opacity == 1, 'Must be opaque', page, step)
  assert(step.visible, 'Must be visible', page, step)
  const tags = getTags(step)
  tags.forEach((tag) => {
    assert(/^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-\d+$|^ss-\d+$|^bs-\d+$|^o-\d+$/.test(tag), `Tag '${tag}' unknown`, page, step)
    // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);
  })
  const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s))
  const brush = tags.find((s) => /^s-multistep-brush$|^s-multistep-brush-\d+$/.test(s))
  const ss = parseInt(tags.find((s) => /^ss-\d+$/.test(s))?.replace('ss-', ''))
  const o = tags.find((s) => /^o-\d+$/.test(s))
  const bs = parseInt(tags.find((s) => /^bs-\d+$/.test(s))?.replace('bs-', ''))
  maxBs = Math.max(bs ? bs : maxBs, maxBs)
  assert(!ss || ss >= 15, 'ss must be >= 15', page, step)
  assert(!ss || !bs || ss > bs, 'ss must be > bs', page, step)
  assert(!bs || bs <= zoomScale * 12.8, `bs must be <= ${zoomScale * 12.8} for this zoom-scale`, page, step)
  assert(!bs || bs >= zoomScale * 0.44, `bs must be >= ${zoomScale * 0.44} for this zoom-scale`, page, step)
  assert(!o || order == 'layers', `${o} must be used only with settings order-layers`, page, step)
  assert(order !== 'layers' || !!o, 'Must have o-N order number', page, step)

  const ff = step.findOne((n: VectorNode) => n.fills && n.fills[0])
  const sf = step.findOne((n: VectorNode) => n.strokes?.length > 0)

  assert(!(bg && ss && sf), 'Should not use bg+ss (stroke found)', page, step, ErrorLevel.INFO)
  assert(!(bg && ss && !sf), 'Should not use bg+ss (stroke not found)', page, step, ErrorLevel.WARN)

  assert(!bg || !!ff, "bg step shouldn't be used without filled-in vectors", page, step, ErrorLevel.INFO)
  assert(!brush || !ff, "brush step shouldn't be used with filled-in vectors", page, step, ErrorLevel.INFO);

  (step as GroupNode).children.forEach((n) => {
    if (n.name == 'input') {
      lintInput(page, n as GroupNode)
    } else if (n.name === 'template') {
      // lint template
    } else {
      assert(false, "Must be 'input' or 'template'", page, n)
    }
  })

  const blinkNodes = findAll(step, (n) => getTags(n).find((t) => /^blink$/.test(t)) !== undefined).flatMap(deepNodes)
  const filledNode = blinkNodes.find((n) => (n as VectorNode).fills[0])
  assert(blinkNodes.length == 0 || !!filledNode || blinkNodes.length > 3, 'Should use draw-line if < 4 lines', page, blinkNodes[0], ErrorLevel.INFO)
}

function lintTaskFrame(page: PageNode, node: FrameNode) {
  if (!assert(node.type == 'FRAME', 'Must be \'FRAME\' type', page, node)) {
    return
  }
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  assert(node.width == 1366 && node.height == 1024, 'Must be 1366x1024', page, node)
  let settings = node.children.find((n) => n.name.startsWith('settings'))
  if (settings) {
    lintSettings(page, settings as EllipseNode)
  }
  let orderNumbers = {}
  for (let step of node.children) {
    const tags = getTags(step)
    tags.forEach((tag) => {
      const found = /^o-(\d+)$/.exec(tag)
      if (!found) {return }
      const o = found[1]
      assert(!orderNumbers[o], `Must have unique ${tag} values`, page, step)
      if (o) {
        orderNumbers[o] = 1
      }
    })
  }
  for (let step of node.children) {
    if (step.name.startsWith('step')) {
      lintStep(page, step as GroupNode)
    } else if (!step.name.startsWith('settings')) {
      assert(false, 'Must be \'settings\' or \'step\'', page, step)
    }
  }
  assert(maxBs > (zoomScale - 1) * 12.8, `zoom-scale ${zoomScale} must be ${Math.ceil(maxBs / 12.8)} for max bs ${maxBs} used`, page, node)
}

function lintThumbnail(page: PageNode, node: FrameNode) {
  if (!assert(node.type == 'FRAME', 'Must be \'FRAME\' type', page, node)) {
    return
  }
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.width == 400 && node.height == 400, 'Must be 400x400', page, node)
}

function lintPage(page: PageNode) {
  if (/^\/|^INDEX$/.test(page.name)) {return }
  if (!assert(/^[a-z\-0-9]+$/.test(page.name), `Page name '${page.name}' must match [a-z\\-0-9]+. Use slash to /ignore.`, page)) {
    return
  }
  assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, 'Must contain exactly 1 \'thumbnail\'', page)
  assert(page.children.filter((s) => /^lesson$/.test(s.name)).length == 1, 'Must contain exactly 1 \'lesson\'', page)
  for (let node of page.children) {
    if (node.name == 'lesson') {
      lintTaskFrame(page, node as FrameNode)
    } else if (node.name == 'thumbnail') {
      lintThumbnail(page, node as FrameNode)
    } else {
      assert(/^\//.test(node.name), 'Must be \'thumbnail\' or \'lesson\'. Use slash to /ignore.', page, node, ErrorLevel.WARN)
    }
  }
}

function lintIndex(page: PageNode) {
  if (!assert(page.children.length == 1, 'Index page must contain exactly 1 element', page)) {
    return
  }
  assert(page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1, 'Must contain exactly 1 \'thumbnail\'', page)
  lintThumbnail(page, page.children[0] as FrameNode)
}

function lintCourse() {
  assert(/^COURSE-[a-z\-0-9]+$/.test(figma.root.name), `Course name '${figma.root.name}' must match COURSE-[a-z\\-0-9]+`)
  const index = figma.root.children.find((p) => p.name == 'INDEX')
  if (assert(!!index, 'Must have \'INDEX\' page')) {
    lintIndex(index)
  }
  for (let page of figma.root.children) {
    lintPage(page)
  }
}

on('selectError', selectError)
on('lintCourse', () => {
  errors = []
  lintCourse()
  printErrors()
})
on('lintPage', () => {
  errors = []
  lintPage(figma.currentPage)
  printErrors()
})

// no hidden fill/stroke
// no effects
