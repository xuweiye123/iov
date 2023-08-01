import vueLinetitleComponents from './index.vue'
const vueLinetitle = {
  install: function(Vue) {
    Vue.component('vueLinetitle', vueLinetitleComponents)
  }
}
export default vueLinetitle