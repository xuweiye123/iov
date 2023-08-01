// import { setTheme, getTheme } from '@/utils/lfStore'
import SetTheme from '@/utils/setTheme'
import i18n from '@/lang'
import { getUserLanguage, setTheme, getTheme,removeTheme } from '@/utils/auth'
i18n.locale = getUserLanguage() 
const themeList = [
  {
    title: '北汽蓝',
    color: '#0097E0 ',
    name: 'blue'
  },
  

]
const defaultTheme = themeList[0].name
// const defaultTheme = 'red'
const theme = {
  namespaced: true,
  state: {
    keys: 'theme',
    list: themeList,
    activeName: defaultTheme
  },
  getters: {
    activeSetting(state) {
     
      return state.list.find(theme => theme.name === state.activeName)
    }
  },
  mutations: {
    set(state, theme) {
      state.activeName = theme || defaultTheme
      setTheme(state.activeName)
      document.body.className = `theme-${state.activeName}`
      console.log(document.body.className,"document.body.className")
    }
  },
  actions: {
    load({ commit }) {
      return new Promise(async resolve => {
        let theme = await getTheme()
        if(theme !='blue'){
          theme = defaultTheme
          // removeTheme()
        }
        /* const index = themeList.findIndex(item => item.name === theme)
        let myColor = '#00a0e9'
        if (index > -1) {
          myColor = themeList[index].color
        }
        new SetTheme(myColor) */
        commit('set', theme)
        resolve()
      })
    },
    set({ commit }, theme) {
      commit('set', theme)
    }
  }
}
export default theme
