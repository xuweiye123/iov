import drawerComponents from './index.vue'
const appDrawer = {
  install: function(Vue) {
    Vue.component('appDrawer', drawerComponents)
  }
}
export default appDrawer
