import Vue from 'vue'
import Vuex from 'vuex'

const modules = {}
function importAll(r){
  r.keys().forEach(
    // (key) => modules.push(r(key).default)
    key => {
      if(r(key).default && r(key).default.state && r(key).default.state.keys){
        modules[r(key).default.state.keys] = r(key).default 
      }
    }
  );
}
importAll(require.context('./modules', true, /\.js/));

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ...modules
  },
  token:'',
  state: {
    isShowFootFixed: false,
    isShowMenuToggle: false,
  },
  getters: {
    sidebarCollapse: state => state.app.sidebarCollapse,
    language: state => state.app.language,
    size: state => state.app.size,
    token: state => state.user.token,
    sysSelected: state => state.user.sysSelected,
    sysSelectedEn: state => state.user.sysSelectedEn,
    // TODO
    userInfo: state => state.user.userInfo,
    // expiredInfo: state => state.user.expiredInfo,
    system: state => state.user.system,
    addRouters: state => state.permission.addRouters,
    realPermissionRouters: state => state.permission.realRouters,
    addRealRouters: state => state.permission.addRealRouters,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    roles: state => state.permission.roles,
    commontData: state => state.commontData,
    // toolBarButton: state=>state.toolBarButton.list
    firstRouter: state => state.permission.firstRouter,
    interfacePrefix: state => state.permission.interfacePrefix,
    activeName: state => state.theme.activeName,
  },
})

export default store
