import vinSelectComponents from './index.vue'
const vinSelect = {
  install: function(Vue) {
    Vue.component('vinSelect', vinSelectComponents)
  }
}
export default vinSelect
