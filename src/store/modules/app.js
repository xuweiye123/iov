import { createDb, setApp, getApp } from '@/utils/lfStore'
import { setUserLanguage } from '@/utils/auth'
const defaults = {
  animation: true,
  sidebarCollapse: false,
  language: 'zh',
  size: 'small'
}
const app = {
  namespaced: true,
  state: {
    keys: 'app',
    isDisTooltip: false,//解决操作列tooltip插件问题（抽屉打开，tooltip不消失的问题）
    ...defaults
  },
  mutations: {
    toggleSideBar(state) {
      var collapse = !state.sidebarCollapse
      state.sidebarCollapse = collapse
      defaults.sidebarCollapse = collapse
    },
    setSideBar(state, collapse) {
      state.sidebarCollapse = collapse
      defaults.sidebarCollapse = collapse
    },
    setLanguage(state, language) {
      state.language = language
      setUserLanguage(language)
      
      defaults.language = language
    },
    setSize(state, size) {
      state.size = size
      defaults.size = size
    },
    setDisTooltip(state, bool) {
      state.isDisTooltip = bool
    }
  },
  actions: {
    load({ commit, dispatch, rootGetters }) {
      createDb(rootGetters.userid)
      return new Promise(async resolve => {
        const app = await getApp()
        if (app) {
          const { sidebarCollapse } = app
          commit('setSideBar', sidebarCollapse)
          // commit('setLanguage', language)
          // commit('setSize', size)
        }
        await dispatch('theme/load', null, { root: true })
        resolve()
      })
    },
    toggleSideBar({ commit }) {
      commit('toggleSideBar')
      return setApp(defaults)
    },
    setSideBar({ commit }, sidebarCollapse) {
      commit('setSideBar', sidebarCollapse)
      return setApp(defaults)
    },
    setLanguage({ commit }, language) {
      commit('setLanguage', language)
      return setApp(defaults)
    },
    setSize({ commit }, size) {
      commit('setSize', size)
      return setApp(defaults)
    }
  }
}
export default app
