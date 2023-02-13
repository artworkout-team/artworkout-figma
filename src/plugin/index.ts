import './create'
import './tune'
import './format'
import './linter'
import './publish'
import '../rpc-api'
import { pluginApi } from '../rpc-api'

figma.showUI(__html__)
figma.ui.resize(340, 450)
console.clear()


figma.on('selectionchange', () => {
  pluginApi.selectionChanged()
})
figma.on('currentpagechange', () => {
  pluginApi.currentPageChanged(figma.currentPage)
})

setTimeout(() => {
  pluginApi.updateDisplay(figma.currentPage, { displayMode: 'all', stepNumber: 1 })
}, 1500)
