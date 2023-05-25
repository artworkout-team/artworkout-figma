import {
  getTags,
  findAll,
  findTag,
  descendants,
  getCurrentLesson,
  getStepOrder,
  findParentByTag,
  isRGBTemplate,
} from './util'
import { updateDisplay, displayAll, deleteTmp } from './tune'

export interface LintError {
  ignore?: boolean
  page?: PageNode
  node?: SceneNode
  error: string
  level: ErrorLevel
  pageName?: string
  nodeName?: string
  nodeType?: string
  stepNumber?: number
}

let errors: LintError[] = []
let zoomScale = 1
let maxBs = 12.8
let order = 'steps'

export enum ErrorLevel {
  ERROR,
  WARN,
  INFO,
}

export function selectError(index: number) {
  if (errors[index]?.page) {
    figma.currentPage = errors[index].page
  }
  setTimeout(() => {
    if (errors[index]?.node) {
      errors[index].page.selection = [errors[index].node]
    }
  }, 0)
}

export async function formatErrors() {
  const savedErrors = await figma.clientStorage.getAsync('errorsForPrint')
  let sortedErrors = errors
    .sort((a, b) => a.level - b.level)
    .map((e) => {
      const stepNumber =
        getStepOrder(findParentByTag(e.node, 'step')) || getStepOrder(e.node)
      return {
        ignore: e.ignore,
        pageName: e.page?.name,
        nodeName: e.node?.name,
        nodeType: e.node?.type,
        error: e.error,
        level: e.level,
        stepNumber,
      } as LintError
    })
  if (savedErrors) {
    sortedErrors = sortedErrors.map((e) => {
      const savedError = savedErrors.find(
        (s) =>
          s.pageName === e.pageName &&
          s.nodeName === e.nodeName &&
          s.error === e.error
      )
      if (savedError) {
        e.ignore = savedError.ignore
      }
      return e
    })
  }
  selectError(0)
  return sortedErrors
}

function assert(
  val: boolean,
  error: string,
  page?: PageNode,
  node?: SceneNode,
  level: ErrorLevel = ErrorLevel.ERROR
) {
  if (!val) {
    errors.push({ node, page, error, level })
  }
  return val
}

function deepNodes(node: GroupNode): SceneNode[] {
  if (!node.children) {
    return [node]
  }
  return node.children.flatMap((n) => deepNodes(n as GroupNode))
}

function countDisconnectedSegments(node: VectorNode) {
  if (!node.vectorNetwork) return false
  const { segments } = node.vectorNetwork

  const starts = segments.map((segment) => segment.start)
  const ends = segments.map((segment) => segment.end)
  const disconnectedStartSegments = starts.filter(
    (startValue) => !ends.includes(startValue)
  )
  const disconnectedEndSegments = ends.filter(
    (endValue) => !starts.includes(endValue)
  )
  const disconnectedSegmentsCount =
    disconnectedStartSegments.length + disconnectedEndSegments.length

  return disconnectedSegmentsCount > 2
}

function lintFills(node: VectorNode, page: PageNode, fills: Paint[]) {
  const rgbt = isRGBTemplate(node)
  const drawLineTag = findTag(node, /^draw-line/)
  fills.forEach((f) => {
    assert(f.visible, 'Fill must be visible', page, node)
    assert(f.type == 'SOLID' || !rgbt, 'Fill must be solid', page, node)
    assert(
      !drawLineTag || !rgbt,
      'Fills cant be used with draw-line tag',
      page,
      node
    )
    if (f.type === 'IMAGE') {
      assert(
        f.opacity == 1 || !rgbt,
        'Image fill must be opaque',
        page,
        node,
        ErrorLevel.INFO
      )
    }
  })
}

function lintStrokes(node: VectorNode, page: PageNode, strokes: Paint[]) {
  const rgbt = isRGBTemplate(node)
  const drawLineTag = findTag(node, /^draw-line/)
  strokes.forEach((s) => {
    assert(s.visible, 'Stroke must be visible', page, node)
    assert(s.type == 'SOLID' || !rgbt, 'Stroke must be solid', page, node)
    if (s.type === 'IMAGE') {
      assert(
        s.opacity == 1 || !rgbt,
        'Image stroke must be opaque',
        page,
        node,
        ErrorLevel.INFO
      )
    }
  })

  assert(
    !strokes.length || /ROUND|NONE/.test(String(node.strokeCap)) || !rgbt,
    `Stroke caps must be 'ROUND' but are '${String(node.strokeCap)}'`,
    page,
    node
  )
  assert(
    node.strokeAlign == 'CENTER' || !rgbt || !strokes.length,
    `Stroke align must be 'CENTER' but is '${String(node.strokeAlign)}'`,
    page,
    node
  )
  assert(
    !strokes.length || node.strokeJoin == 'ROUND' || !rgbt,
    `Stroke joins should be 'ROUND' but are '${String(node.strokeJoin)}'`,
    page,
    node,
    ErrorLevel.INFO
  )
  assert(
    !drawLineTag || !countDisconnectedSegments(node),
    'Split vector or change animation',
    page,
    node
  )
}

const validVectorTags =
  /^\/|^draw-line$|^blink$|^rgb-template$|^d\d+$|^r\d+$|^flip$|^[vV]ector$|^\d+$|^Ellipse$|^Rectangle$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$/

function lintVector(page: PageNode, node: VectorNode) {
  let tags = getTags(node)
  const rgbt = isRGBTemplate(node)
  const anim =
    findTag(node, /^draw-line$|^blink$/) ||
    findParentByTag(node, 'draw-line') ||
    findParentByTag(node, 'blink')

  assert(
    node.opacity == 1 || !rgbt,
    'Must be opaque',
    page,
    node,
    ErrorLevel.INFO
  )
  assert(node.visible, 'Must be visible', page, node)

  assert(
    tags.length > 0,
    'Name must not be empty. Use slash to /ignore.',
    page,
    node
  )
  tags.forEach((tag) => {
    assert(
      validVectorTags.test(tag),
      `Tag '${tag}' unknown. Use slash to /ignore.`,
      page,
      node
    )
  })
  let fills = node.fills as Paint[]
  let strokes = node.strokes as Paint[]
  assert(
    !fills.length || !strokes.length || !rgbt,
    'Should not have fill+stroke',
    page,
    node,
    ErrorLevel.WARN
  )

  lintStrokes(node, page, strokes)
  lintFills(node, page, fills)

  assert(
    !rgbt || !!anim,
    "Must have 'blink' or 'draw-line'",
    page,
    node,
    ErrorLevel.ERROR
  ) // every rgbt must have animation
}

const validGroupTags =
  /^\/|^blink$|^rgb-template$|^d\d+$|^r\d+$|^fly-from-bottom$|^fly-from-left$|^fly-from-right$|^appear$|^wiggle-\d+$|^draw-line$|^\d+$|^[gG]roup$/

function lintGroup(page: PageNode, node: GroupNode) {
  let tags = getTags(node)
  tags.forEach((tag) => {
    assert(validGroupTags.test(tag), `Tag '${tag}' unknown`, page, node)
  })
  const rgbt = isRGBTemplate(node)
  const anim =
    tags.find((s) => /^blink$/.test(s)) || findParentByTag(node, 'blink')
  assert(
    !/BOOLEAN_OPERATION/.test(node.type),
    'Notice BOOLEAN_OPERATION',
    page,
    node,
    ErrorLevel.INFO
  )
  assert(node.opacity == 1, 'Must be opaque', page, node, ErrorLevel.WARN)
  assert(node.visible, 'Must be visible', page, node)
  assert(
    tags.length > 0,
    'Name must not be empty. Use slash to /ignore.',
    page,
    node
  )
  assert(!rgbt || !!anim, "Must have 'blink'", page, node) // every rgbt must have animation
}

function lintInput(page: PageNode, node: GroupNode) {
  if (!assert(node.type == 'GROUP', "Must be 'GROUP' type'", page, node)) {
    return
  }
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  assert(node.name == 'input', "Must be 'input'", page, node)
  descendants(node as GroupNode).forEach((v) => {
    if (/GROUP|BOOLEAN_OPERATION/.test(v.type)) {
      lintGroup(page, v as GroupNode)
    } else if (/RECTANGLE|ELLIPSE|VECTOR|TEXT/.test(v.type)) {
      lintVector(page, v as VectorNode)
    } else {
      assert(
        false,
        "Must be 'GROUP/VECTOR/RECTANGLE/ELLIPSE/TEXT' type",
        page,
        v
      )
    }
  })
}

const validSettingsTags =
  /^\/|^settings$|^capture-color$|^zoom-scale-\d+$|^order-layers$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep$|^s-multistep-brush-\d+$|^brush-name-\w+$|^ss-\d+$|^bs-\d+$/

function lintSettings(page: PageNode, node: EllipseNode) {
  assert(node.type == 'ELLIPSE', "Must be 'ELLIPSE' type'", page, node)
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  const tags = getTags(node)
  tags.forEach((tag) => {
    assert(validSettingsTags.test(tag), `Tag '${tag}' unknown`, page, node)
  })
  if (tags.find((tag) => /^order-layers$/.test(tag))) {
    order = 'layers'
  } else {
    order = 'steps'
  }

  zoomScale = parseInt(
    tags.find((s) => /^zoom-scale-\d+$/.test(s))?.replace('zoom-scale-', '') ||
      '1'
  )
  assert(
    zoomScale >= 1 && zoomScale <= 5,
    `Must be 1 <= zoom-scale <= 5 (${zoomScale})`,
    page,
    node
  )
}

const validStepTags =
  /^\/|^step$|^s-multistep-bg-\d+$|^s-multistep-result$|^s-multistep-brush$|^s-continue$|^s-multistep-brush-\d+$|^s-multistep-bg$|^brush-name-\w+$|^clear-layer-(\d+,?)+$|^ss-\d+$|^bs-\d+$|^o-\d+$|^allow-undo$|^share-button$|^clear-before$/

function lintStep(page: PageNode, step: GroupNode) {
  if (!assert(step.type == 'GROUP', "Must be 'GROUP' type'", page, step)) {
    return
  }
  assert(step.opacity == 1, 'Must be opaque', page, step)
  assert(step.visible, 'Must be visible', page, step)
  const tags = getTags(step)
  tags.forEach((tag) => {
    assert(
      validStepTags.test(tag),
      `Tag '${tag}' unknown. Use slash to /ignore.`,
      page,
      step
    )
    // assert(!/^s-multistep-brush$|^s-multistep-bg$/.test(tag), `Tag '${tag}' is obsolete`, page, node, ErrorLevel.WARN);
  })
  const bg = tags.find((s) => /^s-multistep-bg$|^s-multistep-bg-\d+$/.test(s))
  const brush = tags.find((s) =>
    /^s-multistep-brush$|^s-multistep-brush-\d+$/.test(s)
  )
  const ss = parseInt(tags.find((s) => /^ss-\d+$/.test(s))?.replace('ss-', ''))
  const o = tags.find((s) => /^o-\d+$/.test(s))
  const bs = parseInt(tags.find((s) => /^bs-\d+$/.test(s))?.replace('bs-', ''))
  const brushName = tags
    .find((s) => /^brush-name-\w+$/.test(s))
    ?.replace('brush-name-', '')
  const terminalNodes = descendants(step).filter(
    (v) => v['children'] == undefined
  )
  const maxSize = terminalNodes.reduce((acc, v) => {
    return Math.max(acc, v.width, v.height)
  }, 0)

  maxBs = Math.max(bs ? bs : maxBs, maxBs)
  assert(
    !ss || ss >= 20 || maxSize <= 100,
    `Should not use ss<20 with long lines. Consider using bg template. ${maxSize}>100`,
    page,
    step,
    ErrorLevel.INFO
  )
  assert(
    !ss || ss >= 20 || terminalNodes.length <= 8,
    `Should not use ss<20 with too many lines. Consider using bg template. ${terminalNodes.length}>8`,
    page,
    step,
    ErrorLevel.INFO
  )
  assert(
    !bs || bs >= 10 || brushName == 'pencil',
    `Should not use bs<10. ${bs}<10`,
    page,
    step,
    ErrorLevel.INFO
  )
  assert(!ss || ss >= 15, 'ss must be >= 15', page, step)
  assert(!ss || !bs || ss > bs, 'ss must be > bs', page, step)
  assert(
    !bs || bs <= zoomScale * 12.8,
    `bs must be <= ${zoomScale * 12.8} for this zoom-scale`,
    page,
    step
  )
  assert(
    !bs || bs >= zoomScale * 0.44,
    `bs must be >= ${zoomScale * 0.44} for this zoom-scale`,
    page,
    step
  )
  assert(
    !o || order == 'layers',
    `${o} must be used only with settings order-layers`,
    page,
    step
  )
  assert(order !== 'layers' || !!o, 'Must have o-N order number', page, step)

  const sf = step.findOne(
    (n: VectorNode) =>
      (getTags(n).includes('rgb-template') ||
        findParentByTag(n, 'rgb-template')) &&
      n.strokes?.length > 0
  )
  const ffs = step.findAll(
    (n: VectorNode) =>
      (getTags(n).includes('rgb-template') ||
        findParentByTag(n, 'rgb-template')) &&
      n.fills &&
      n.fills[0]
  )
  const bigFfs = ffs.filter((n: VectorNode) => n.width > 27 || n.height > 27)
  const ff = ffs.length > 0

  assert(
    !(bg && ss && sf),
    'Should not use bg+ss (stroke present)',
    page,
    step,
    ErrorLevel.INFO
  )
  assert(
    !(bg && ss && !sf),
    'Should not use bg+ss (stroke not present)',
    page,
    step,
    ErrorLevel.WARN
  )

  assert(
    !bg || ff,
    "bg step shouldn't be used without filled-in vectors",
    page,
    step,
    ErrorLevel.INFO
  )
  assert(
    !brush || bigFfs.length == 0,
    "brush step shouldn't be used with filled-in vectors (size > 27)",
    page,
    step,
    ErrorLevel.INFO
  )
  ;(step as GroupNode).children.forEach((n) => {
    if (n.name == 'input') {
      lintInput(page, n as GroupNode)
    } else if (n.name === 'template') {
      // lint template
    } else {
      assert(false, "Must be 'input' or 'template'", page, n)
    }
  })

  const blinkNodes = findAll(
    step,
    (n) => getTags(n).find((t) => /^blink$/.test(t)) !== undefined
  ).flatMap(deepNodes)
  const filledNode = blinkNodes.find((n) => (n as VectorNode).fills[0])
  assert(
    blinkNodes.length == 0 || !!filledNode || blinkNodes.length > 3,
    'Should use draw-line if < 4 lines',
    page,
    blinkNodes[0],
    ErrorLevel.INFO
  )
}

function lintTaskFrame(page: PageNode, node: FrameNode) {
  if (!assert(node.type == 'FRAME', "Must be 'FRAME' type", page, node)) {
    return
  }
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.visible, 'Must be visible', page, node)
  assert(
    node.width == 1366 && node.height == 1024,
    'Must be 1366x1024',
    page,
    node
  )
  assert(
    !!node.children.find((n) => getTags(n).includes('s-multistep-result')),
    "Must have 's-multistep-result' child",
    page,
    node,
    ErrorLevel.WARN
  )
  let settings = node.children.find((n) => n.name.startsWith('settings'))
  if (settings) {
    lintSettings(page, settings as EllipseNode)
  }
  let orderNumbers = {}
  for (let step of node.children) {
    const tags = getTags(step)
    tags.forEach((tag) => {
      const found = /^o-(\d+)$/.exec(tag)
      if (!found) {
        return
      }
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
      assert(false, "Must be 'settings' or 'step'", page, step)
    }
  }
  // assert(
  //   maxBs > (zoomScale - 1) * 12.8,
  //   `zoom-scale ${zoomScale} must be ${Math.ceil(
  //     maxBs / 12.8
  //   )} for max bs ${maxBs} used`,
  //   page,
  //   node
  // )
}

function lintThumbnail(page: PageNode, node: FrameNode) {
  if (!assert(node.type == 'FRAME', "Must be 'FRAME' type", page, node)) {
    return
  }
  assert(node.opacity == 1, 'Must be opaque', page, node)
  assert(node.width == 400 && node.height == 400, 'Must be 400x400', page, node)
}

export async function lintPage(
  currentPage?: PageNode | null,
  appendErrors?: boolean
) {
  if (!appendErrors) {
    errors = []
    const lesson = getCurrentLesson()
    await deleteTmp()
    if(lesson) {
      displayAll(lesson, true)
    }
  }
  const page = currentPage ? currentPage : figma.currentPage
  if (/^\/|^INDEX$/.test(page.name)) {
    return
  }
  updateDisplay({ displayMode: 'all', stepNumber: 1 }, page)
  if (
    !assert(
      /^[a-z\-0-9]+$/.test(page.name),
      `Page name '${page.name}' must match [a-z\\-0-9]+. Use slash to /ignore.`,
      page
    )
  ) {
    return
  }
  assert(
    page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1,
    "Must contain exactly 1 'thumbnail'",
    page
  )
  assert(
    page.children.filter((s) => /^lesson$/.test(s.name)).length == 1,
    "Must contain exactly 1 'lesson'",
    page
  )
  for (let node of page.children) {
    if (node.name == 'lesson') {
      lintTaskFrame(page, node as FrameNode)
    } else if (node.name == 'thumbnail') {
      lintThumbnail(page, node as FrameNode)
    } else {
      assert(
        /^\//.test(node.name),
        "Must be 'thumbnail' or 'lesson'. Use slash to /ignore.",
        page,
        node,
        ErrorLevel.WARN
      )
    }
  }
  return formatErrors()
}

function lintIndex(page: PageNode) {
  if (
    !assert(
      page.children.length == 1,
      'Index page must contain exactly 1 element',
      page
    )
  ) {
    return
  }
  assert(
    page.children.filter((s) => /^thumbnail$/.test(s.name)).length == 1,
    "Must contain exactly 1 'thumbnail'",
    page
  )
  lintThumbnail(page, page.children[0] as FrameNode)
}

export async function lintCourse() {
  errors = []
  const lesson = getCurrentLesson()
  if(lesson) {
    displayAll(lesson, true)
  }
  assert(
    /^COURSE-[a-z\-0-9]+$/.test(figma.root.name),
    `Course name '${figma.root.name}' must match COURSE-[a-z\\-0-9]+`
  )
  const index = figma.root.children.find((p) => p.name == 'INDEX')
  if (assert(!!index, "Must have 'INDEX' page")) {
    lintIndex(index)
  }
  // find all non-unique named pages
  const nonUnique = figma.root.children.filter(
    (p, i, a) => a.findIndex((p2) => p2.name == p.name) != i
  )
  nonUnique.forEach((p) =>
    assert(false, `Page name '${p.name}' must be unique`, p)
  )
  for (let page of figma.root.children) {
    lintPage(page, true)
  }
  return formatErrors()
}

export function saveErrors(errorsForPrint: LintError[]) {
  return figma.clientStorage.setAsync('errorsForPrint', errorsForPrint)
}
