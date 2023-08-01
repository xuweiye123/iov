import checkedFilterComponents from './index.vue'
const checkedFilter = {
  install: function(Vue) {
    Vue.component('checkedFilter', checkedFilterComponents)
  }
}
export default checkedFilter
