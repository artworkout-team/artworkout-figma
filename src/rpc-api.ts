import {createPluginAPI, createUIAPI} from 'figma-jsonrpc'
import {exportLesson, exportCourse} from './plugin/publish'

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
})

// Figma UI app methods
export const uiApi = createUIAPI({
})
