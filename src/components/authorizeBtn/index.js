import authorizeComponents from './index.vue'
const appAuthorizeButton = {
  install: function(Vue) {
    Vue.component('appAuthorizeButton', authorizeComponents)
  }
}
export default appAuthorizeButton
