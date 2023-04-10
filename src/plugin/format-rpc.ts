import { displayNotification } from './util'

function findTexts(texts: PageNode) {
  return texts
    .findAll((node: SceneNode) => node.type === 'TEXT')
    .filter((node: TextNode) => node.visible)
    .reverse()
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
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\|/g, '\\l')
    .replace(/\n/g, '\\n')
}

const replacements = { '\\\\': '\\', '\\n': '\n', '\\"': '"', '\\l': '|' }

function unescape(str: string) {
  if (str.match(/\|/) || str.match(/(?<!\\)"/)) {
    return null
  }

  return str.replace(/\\(\\|n|"|l)/g, function (replace) {
    return replacements[replace]
  })
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

async function loadFonts(texts: TextNode[]) {
  const allFonts: { family: string; style: string }[] = []
  texts.forEach((txt) => {
    getStyledSegments(txt).map((s) => {
      allFonts.push(s.fontName)
    })
  })
  const uniqueFonts = allFonts.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) => t.family === value.family && t.style === value.style
      )
  )
  for (let font of uniqueFonts) {
    try {
      await figma.loadFontAsync(font)
    } catch (e) {
      console.log(e)
    }
  }
}

export async function importTexts(translations: {}) {
  if (Object.keys(translations).length === 0) {
    displayNotification('Empty input')
    return
  }

  const texts = findTexts(figma.currentPage)
  await loadFonts(texts as TextNode[])
  texts.forEach((txt: TextNode) => {
    const formattedText = getFormattedText(txt)
    const translation: string = translations[formattedText]
    if (translation === undefined) {
      return
    }
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
      errorMessage = `Wrong segment count (${newSegments.length} ≠ ${oldSegments.length}): ${formattedText}`
    }
    if (errorMessage) {
      displayNotification(errorMessage)
    } else {
      importStyledSegments(newSegments, txt)
    }
  })
}
