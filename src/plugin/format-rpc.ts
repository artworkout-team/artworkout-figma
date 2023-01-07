import { nearBlack } from './create'
import { findParentByTag, isResultStep, displayNotification } from './util'

export function exportTexts() {
  const texts = figma.currentPage
    .findAll((node) => node.type === 'TEXT')
    .filter((node) => node.visible)
  return (
    texts
      .map((node) => {
        const tn = node as TextNode
        return tn
          .getStyledTextSegments([
            'fontSize',
            'fontName',
            'fontWeight',
            'textDecoration',
            'textCase',
            'lineHeight',
            'letterSpacing',
            'fills',
            'textStyleId',
            'fillStyleId',
            'listOptions',
            'indentation',
            'hyperlink',
          ])
          .map((s) => s.characters)
          .join('\\')
          .trimEnd()
      })
      // remove array duplicates
      .filter((v, i, a) => a.indexOf(v) === i)
  )
}

export async function importTexts(strings: string[]) {
  const selection: readonly SceneNode[] = figma.currentPage.selection
  if (!selection.length) {
    return
  }
  const parentStep = findParentByTag(selection[0], 'step')
  if (!parentStep || isResultStep(parentStep)) {
    return
  }
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  const textNodes: TextNode[] = strings.map((string) => {
    const text = figma.createText()
    text.characters = string
    text.fontSize = 25
    text.fills = [{ type: 'SOLID', color: nearBlack }]
    return text
  })
  if (textNodes.length === 0) {
    displayNotification('Empty input')
    return
  }
  const input = figma.group(textNodes, parentStep)
  input.name = 'input'
  input.x = 100
  input.y = 100
  let offset: number = 0
  textNodes.forEach((node) => {
    node.x += offset
    node.y += offset
    offset += 50
  })
}
