
import Vue from 'vue'
import Router from 'vue-router'
// 多级菜单
import Layout from '@/views/layout'
// 公共页面
import MultilevelRouting from '@/components/multilevelRouting'
import { constantRouterMap } from './modules/constant'

Vue.use(Router)

/**
 * 通配路由
 * 如果匹配不到路由则跳转到404
 */
const wildcard = [
  { path: '*', redirect: '/404', isShow: 0 }
]

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  // scrollBehavior: () => ({ y: 0 }),
  scrollBehavior: (to,from, savedPosition) =>{
    // console.log(to,from, savedPosition,222)
    if(to.name=="fastEntry"){
      history.pushState(null, null, document.URL)
      return {y:0}
    }
  },
  routes: constantRouterMap
})


router.onError((error) => {
  console.error(error)
  const pattern = /Loading chunk/g
  // const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = $router.history.pending.fullPath
  if (isChunkLoadFailed && error.type === 'missing') {
    // const targetPath = $router.history.pending.fullPath
    $router.push(targetPath)
  }
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title == '今日故障警情') {
    document.title = to.meta.title
  }
  next()
})
export default router
export { constantRouterMap, wildcard }
