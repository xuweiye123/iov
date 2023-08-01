import dialogComponents from './index.vue'
const appDialog = {
  install: function(Vue) {
    Vue.component('appDialog', dialogComponents)
  }
}
export default appDialog
