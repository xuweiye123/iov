import appSearchButtonComponents from './index.vue'
const appSearchButton = {
  install: function(Vue) {
    Vue.component('appSearchButton', appSearchButtonComponents)
  }
}
export default appSearchButton
