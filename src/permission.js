import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {
	getToken,
	getUserLanguage,
  getSelectedSys,
  setSelectedSys,
} from "@/utils/auth"; // getToken from cookie
import i18n from './lang'
import { routerMap, wildcard } from '@/router'
// import Layout from '@/views/layout'
// const immutable = require('immutable')
NProgress.configure({ showSpinner: false })// NProgress Configuration


const whiteList = [
	"/login",
	"/500",
	"/404",
	"/auth-redirect",
	"/reviewInfo",
  '/internalLogin',
  '/uuapLogin',
];// no redirect whitelist

// 此处全部转为2级菜单缓存
function getNewAddRouters(data, parentItem) {
  data.forEach((item) => {
    // debugger;
    if (item.children && item.children.length) {
      if (item.level === 2) {
        // console.log('删除'+item.name+'索引'+index)
        for (let i = 0; i < item.children.length; i++) {
          parentItem.children = [...parentItem.children, ...[item.children[i]]]
        }
        const index = parentItem.children.findIndex(v => v.name === item.name)
        if (index > -1) {
          parentItem.children.splice(index, 1)
        }
      }
      getNewAddRouters(item.children, item)
    }
  })
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if(to.path === '/internalLogin'){
    localStorage.setItem('internalLogin', 1)
  }
  if(to.path === '/login'){
    localStorage.setItem('internalLogin', 0)
  }
  let toPath = localStorage.internalLogin == 1 ? '/internalLogin' : '/login'
  if (getToken()) { // determine if there has token
    // if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === toPath) {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else if (to.path === '/500') {
      next()
      NProgress.done()
    }
    else {
      window.s = store
      window.r = router
      if (!store.state.user.loginName) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('getUserInfo').then(res => { // 拉取user_info
          //theme
          const p1 = store.dispatch('app/load')
          // 动态拉取路由表
          const p2 = store.dispatch('getRoutes')
          Promise.all([p1, p2]).then(() => {
            router.app.$ELEMENT.size = store.state.app.size
            // 缓存页面左侧栏数据，用于导航，tagview，button
            const pageLeftRouter = JSON.parse(JSON.stringify(store.getters.addRouters))
            store.dispatch('getLeftMenu', pageLeftRouter)
            // 添加路由
            let realAddRoutes = [...store.getters.addRouters]
            getNewAddRouters(realAddRoutes, realAddRoutes[0])
            router.addRoutes(realAddRoutes)
            let selectedSys = getSelectedSys();
            if (selectedSys) {
              if (selectedSys == "快速入口") {
                next({ path: "/fastEntry" });
              } else {
                if(to.path == "/monthfull"){
                  next({ path: "/monthfull" }); 
                }else{
                  store.dispatch("delAllViews");
                  next({ path: "/" }); 
                }
              }
            } else {
              next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }
          }).catch(() => {
          })
        }).catch((err) => {
          store.dispatch('fedLogout').then(() => {
            Message.warning(err || '验证失败，请重新登录')
            next({ path: '/' })
          })
        })
      } else {
        if(to.path === "/fastEntry"){
          setSelectedSys('快速入口');
          store.commit("setSysSelected", "快速入口");
        }
        store.isShowFootFixed = to.path === "/home" ? false : true;
        store.isShowMenuToggle = to.path === "/fastEntry" ? false : true;
        next()
      }
    }
  }
  else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
    } else {
      next(`${toPath}?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
  store.dispatch('setInterface',to.meta.interfacePrefix?to.meta.interfacePrefix:'/api/system')

  store.commit('app/setLanguage', getUserLanguage())
  i18n.locale = getUserLanguage()
  document.title = '智能车云平台'
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
