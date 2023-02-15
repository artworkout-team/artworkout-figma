import { createPluginAPI, createUIAPI } from 'figma-jsonrpc'
import { exportTexts, importTexts } from './plugin/format-rpc'
import { exportLesson, exportCourse } from './plugin/publish'
import { getSteps, setStepOrder } from './plugin/tune-rpc'
import {
  createLesson,
  separateStep,
  splitByColor,
  joinSteps,
} from './plugin/create'
import { displayNotification } from './plugin/util'
import { lintPage, lintCourse, selectError, saveErrors, maximizeUi, minimizeUi } from './plugin/linter'
import { selectionChanged, currentPageChanged, updateDisplay } from './plugin/tune'
// Figma plugin methods
export const pluginApi = createPluginAPI({
  setSessionToken(token: string) {
    return figma.clientStorage.setAsync('sessionToken', token)
  },
  async getSessionToken() {
    return figma.clientStorage.getAsync('sessionToken')
  },
  exportLesson,
  exportCourse,
  getSteps,
  setStepOrder,
  exportTexts,
  importTexts,
  displayNotification,
  createLesson,
  separateStep,
  splitByColor,
  joinSteps,
  selectError,
  saveErrors,
  selectionChanged,
  currentPageChanged,
  updateDisplay,
  lintPage,
  lintCourse,
  maximizeUi,
  minimizeUi,
})

// Figma UI app methods
export const uiApi = createUIAPI({
})
