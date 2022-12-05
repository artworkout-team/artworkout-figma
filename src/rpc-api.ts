import { createPluginAPI, createUIAPI } from 'figma-jsonrpc'
import { exportTexts } from './plugin/format-rpc'
import { exportLesson, exportCourse } from './plugin/publish'
import { getSteps, setStepOrder } from './plugin/tune-rpc'
import { createLesson, separateStep } from './plugin/create'

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
  createLesson,
  separateStep,
})

// Figma UI app methods
export const uiApi = createUIAPI({})
