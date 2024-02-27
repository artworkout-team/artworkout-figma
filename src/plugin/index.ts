import './create'
import './tune'
import './format'
import './linter'
import './publish'
import '../rpc-api'
import { currentPageChanged, selectionChanged, updateDisplay } from './tune'
import { setMetaTagsFromNodesToStore } from './meta'

figma.showUI(__html__)
figma.ui.resize(340, 470)
console.clear()


figma.on('selectionchange', () => {
  selectionChanged()
})
figma.on('currentpagechange', () => {
  currentPageChanged()
  setMetaTagsFromNodesToStore()
})

setTimeout(() => {
  updateDisplay( { displayMode: 'all', stepNumber: 1 }, figma.currentPage)
  setMetaTagsFromNodesToStore()
}, 1500)
