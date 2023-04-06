import { createPluginAPI, createUIAPI } from 'figma-jsonrpc'
import { exportTexts, importTexts } from './plugin/format-rpc'
import { exportLesson, exportCourse } from './plugin/publish'
import { getSteps, setStepsOrder } from './plugin/tune-rpc'
import {
  createLesson,
  separateStep,
  splitByColor,
  joinSteps,
} from './plugin/create'
import { displayNotification, resizeUi } from './plugin/util'
import { lintPage, lintCourse, selectError, saveErrors } from './plugin/linter'
import { selectionChanged, currentPageChanged, updateDisplay, updateProps, formProps } from './plugin/tune'
import { TuneFormStore } from './app/models/TuneFormStore'

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
  setStepsOrder,
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
  resizeUi,
  updateProps,
})

// Figma UI app methods
export const uiApi = createUIAPI({
  setAnimationTags(animationTag: string, delay: number, repeat: number) {
    TuneFormStore.setAnimationTags(animationTag, delay, repeat)
  },
  updateUiProps(settings: formProps) {
    TuneFormStore.updateProps(settings)
  },
  setStepNavigationProps(stepNumber: number, displayMode: string) {
    TuneFormStore.setStepNavigationProps(stepNumber, displayMode)
  },
})
