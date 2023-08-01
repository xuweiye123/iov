import tableTemplate from './index.vue'
const appTable = {
  install: function(Vue) {
    Vue.component('appTable', tableTemplate)
  }
}
export default appTable
