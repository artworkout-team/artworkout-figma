import Parse from 'parse'
import {proxy} from 'valtio'
import {pluginApi} from '../../rpc-api'

export const userStore = proxy({
  user: null,
  error: null,
  isLoading: false,
  async loadUser() {
    userStore.user = await Parse.User.become(await pluginApi.getSessionToken())
  },
  async login(username: string, password: string) {
    userStore.isLoading = true
    userStore.error = null
    try {
      const user = await Parse.User.logIn(username, password)
      userStore.user = user
      pluginApi.setSessionToken(user.getSessionToken())
    } catch (error) {
      userStore.error = error
    } finally {
      userStore.isLoading = false
    }
  },
})
