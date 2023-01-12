import { displayNotification } from './util'

function findTexts(texts: PageNode) {
  return texts
    .findAll((node: SceneNode) => node.type === 'TEXT')
    .filter((node: TextNode) => node.visible)
}

function getStyledSegments(node: TextNode) {
  return node.getStyledTextSegments([
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
}

function escape(str: string) {
  return str
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\q')
    .replaceAll('|', '\\l')
    .replaceAll('\n', '\\n')
}

function unescape(str: string) {
  let strOut = ''
  for (var i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === '|' || c === '"') {
      // forbidden char
      return null
    } else if (c === '\\') {
      i++
      if (i < str.length) {
        const cNext = str[i]
        if (cNext === '\\') {
          strOut += '\\'
        } else if (cNext === 'q') {
          strOut += '"'
        } else if (cNext === 'l') {
          strOut += '|'
        } else if (cNext === 'n') {
          strOut += '\n'
        } else {
          // forbidden escaped symbol
          return null
        }
      } else {
        // unescaped slash at last position
        return null
      }
    } else {
      strOut += c
    }
  }
  return strOut
}

function getFormattedText(node: TextNode) {
  return getStyledSegments(node)
    .map((s) => escape(s.characters))
    .join('|')
    .trimEnd()
}

function importStyledSegments(segmentTexts: string[], node: TextNode) {
  // update segments in reverse order
  for (let i = segmentTexts.length - 1; i >= 0; i--) {
    const segmentText = segmentTexts[i]
    let styles = getStyledSegments(node)
    if (segmentText.length > 0) {
      node.insertCharacters(styles[i].end, segmentText, 'BEFORE')
    }
    node.deleteCharacters(styles[i].start, styles[i].end)
  }
}

export function exportTexts() {
  const texts = findTexts(figma.currentPage)

  return (
    texts
      .map((node: TextNode) => getFormattedText(node))
      .filter((str) => str.length > 0)
      // remove array duplicates
      .filter((v, i, a) => a.indexOf(v) === i)
  )
}

export async function importTexts(translations: {}) {
  if (Object.keys(translations).length === 0) {
    displayNotification('Empty input')
    return
  }

  const texts = findTexts(figma.currentPage)
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Montserrat', style: 'Regular' })
  texts.forEach((txt: TextNode) => {
    const formattedText = getFormattedText(txt)
    const translation: string = translations[formattedText]
    if (translation !== undefined) {
      let errorMessage: string
      const oldSegments = formattedText.split('|')
      const newSegments = translation.split('|').map((str) => {
        const result = unescape(str)
        if (result === null) {
          errorMessage = `Failed to unescape: ${str}`
        }
        return result
      })
      // special case: delete all text
      if (newSegments.length === 1 && newSegments[0] === '') {
        txt.characters = ''
        return
      }
      // do not allow segments length mismatch
      if (newSegments.length !== oldSegments.length) {
        errorMessage = `Segment count mismatch: expected ${oldSegments.length}, got ${newSegments.length}`
      }
      if (errorMessage) {
        displayNotification(errorMessage)
      } else {
        importStyledSegments(newSegments, txt)
      }
    }
  })
}
