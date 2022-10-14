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
