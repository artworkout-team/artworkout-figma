import {createPluginAPI, createUIAPI} from 'figma-jsonrpc'
import {exportLesson} from './plugin/publish'

// Figma plugin methods
export const pluginApi = createPluginAPI({
  setSessionToken(token: string) {
    return figma.clientStorage.setAsync('sessionToken', token)
  },
  async getSessionToken() {
    return figma.clientStorage.getAsync('sessionToken')
  },
  exportLesson,
})

// Figma UI app methods
export const uiApi = createUIAPI({
})
