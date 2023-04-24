import './create'
import './tune'
import './format'
import './linter'
import './publish'
import '../rpc-api'
import { currentPageChanged, selectionChanged, updateDisplay } from './tune'

figma.showUI(__html__)
figma.ui.resize(340, 470)
console.clear()


figma.on('selectionchange', () => {
  selectionChanged()
})
figma.on('currentpagechange', () => {
  currentPageChanged(figma.currentPage)
})

setTimeout(() => {
  updateDisplay( { displayMode: 'all', stepNumber: 1 }, figma.currentPage)
}, 1500)
