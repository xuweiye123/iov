import appSearchComponents from './index.vue'
const appSearch = {
  install: function(Vue) {
    Vue.component('appSearch', appSearchComponents)
  }
}
export default appSearch
