
import { Message } from 'element-ui'
import { constantRouterMap, wildcard } from '@/router'
import { getRoutes } from '@/api/login'
import { getUserLanguage } from '@/utils/auth'
import { routerList } from '@/utils/routerList'
import Layout from '@/views/layout'
import MultilevelRouting from '@/components/multilevelRouting'

const lang = getUserLanguage()

// 处理权限菜单数据
function filterAsyncRoute(fullList, resultList, step) {
  let result = []
  for (let i = 0; i < fullList.length; i++) {
    const itemElement = fullList[i]
    let routerObject = null
    const childrenList = []
    // 路由类型过滤，用来标记不需要展示的路由，需要展示的路由才可以继续
    // if (!typeArray.includes(itemElement.type)) {
    //   continue
    // }
    //过滤掉禁用的路由
    if (!itemElement.isDisabled) {
      continue
    }
    //对当前执行步骤进行判断
    if(step == 1){//第一层级
      if(itemElement.functionType ==1){//第一层级&&菜单
        routerObject = {
          path: '/',
          name: itemElement['url'],
          menuName: itemElement['functionName'],
          icon: itemElement['icon'],
          isShow: itemElement['isShow'],
          functionNames: itemElement['functionNames'],
          functionType: itemElement['functionType'],
          permission: itemElement['permission'],
          level: 1,
          component: Layout,
          meta: {
            title: itemElement['functionName'],
            filePath: itemElement['filePath'],
            systemOne: itemElement['functionNames'].split('/')[0],
            interfacePrefix: itemElement['interfacePrefix'],
          },
          children: [
            {
              onlyChild: true,
              path: '/'+itemElement['url'],
              filePath: itemElement['filePath'],
              interfacePrefix: itemElement['interfacePrefix'],
              name: itemElement['url'],
              menuName: itemElement['functionName'],
              icon: itemElement['icon'],
              isShow: itemElement['isShow'],
              functionNames: itemElement['functionNames'],
              functionType: itemElement['functionType'],
              permission: itemElement['permission'],
              level: 1,
              component: resolve => require([`@/views/${itemElement.filePath}`], resolve),
              meta: {
                title: itemElement['functionName'],
                filePath: itemElement['filePath'],
                systemOne: itemElement['functionNames'].split('/')[0],
                interfacePrefix: itemElement['interfacePrefix'],
              },
              children: []
            }
          ]
        }
      }else{ //第一层级 路由
        routerObject = {
          path: '/'+itemElement['url'],
          name: itemElement['url'],
          menuName: itemElement['functionName'],
          icon: itemElement['icon'],
          isShow: itemElement['isShow'],
          functionNames: itemElement['functionNames'],
          functionType: itemElement['functionType'],
          permission: itemElement['permission'],
          level: 1,
          component: Layout,
          meta: {
            title: itemElement['functionName']
          },
          children: childrenList
        }
      }
    }else{ //第二级以上层级
      if(itemElement.functionType ==1){//菜单
        routerObject = {
          path: itemElement['url'],
          filePath: itemElement['filePath'],
          interfacePrefix: itemElement['interfacePrefix'],
          name: itemElement['url'],
          menuName: itemElement['functionName'],
          icon: itemElement['icon'],
          isShow: itemElement['isShow'],
          functionNames: itemElement['functionNames'],
          functionType: itemElement['functionType'],
          permission: itemElement['permission'],
          level: step,
          component: resolve => require([`@/views/${itemElement.filePath}`], resolve),
          meta: {
            title: itemElement['functionName'],
            filePath: itemElement['filePath'],
            systemOne: itemElement['functionNames'].split('/')[0],
            interfacePrefix: itemElement['interfacePrefix'],
          },
          children: []
        }
      }else{//路由
        routerObject = {
          path: itemElement['url'],
          name: itemElement['url'],
          menuName: itemElement['functionName'],
          icon: itemElement['icon'],
          isShow: itemElement['isShow'],
          functionNames: itemElement['functionNames'],
          functionType: itemElement['functionType'],
          permission: itemElement['permission'],
          level: step,
          component: MultilevelRouting,
          meta: {
            title: itemElement['functionName']
          },
          children: childrenList
        }
      }
    }
    const itemResult = []
    // //对主路由进行判断，满足条件则进行递归
    if (itemElement['children'] != null && itemElement['children'].length && itemElement['children'][0].functionType != 2) {
      filterAsyncRoute(itemElement['children'], itemResult, step + 1)
    }
    // 处理页面按钮
    if (itemElement['children'] != null && itemElement['children'].length && itemElement['children'][0].functionType == 2) {
      routerObject.button = itemElement.children
    }
    //将组装好的子路由信息插入数组
    for (let j = 0; j < itemResult.length; j++) {
      childrenList.push(itemResult[j])
    }
    //判断子路由数组长度
    if (childrenList.length === 0) {//不存在子路由
      if (step === 1) {//如果是主路由则删除第一个子路由，如果不删除则会出现一个空的父菜单
        // console.log('1',routerObject)
        if(routerObject.children&&routerObject.children.length>0){
          delete routerObject.children[0].children
        }
      } else {//如果是子路由，则删除子路由下的子路由，删除的这个子路由是空的，必须需要删除，否则也会出现一个空的菜单
        delete routerObject.children
      }
      // delete routerObject.children
    } else {//存在子路由
      if (step === 1) { // 如果是主路由，则添加meta和子路由列表
        // routerObject.meta = routerObject.children[0].meta
        routerObject.children = childrenList
        // console.log(routerObject)
      }
    }
    //插入组装好的数据
    resultList.push(routerObject)
    //插入最终完整的数据列表
    result.push(routerObject)
    
  }
  // console.log('asyncRoutes', result);
  return result
}

const permission = {
  state: {
    keys: 'permission',
    routers: constantRouterMap,
    addRoutersBefore: [],//用于保存原始菜单结构数据，便于切换系统展示左菜单
    addRouters: [],
    realRouters: constantRouterMap || [],
    addRealRouters: [],
    firstRouter:[],
    roles: [],
    interfacePrefix: "",
  },
  mutations: {
    // setFirstRouterName: (state, data) => {
    //   // console.log('setFirstRouterName', state);
    //   // console.log('setFirstRouterName', data);
    //   state.firstRouter = data
    // },
    setRoutes: (state, routes) => {
      state.addRouters = routes
      state.addRoutersBefore = JSON.parse(JSON.stringify(routes))
    },
    setLeftMenu: (state, routes) => {
      state.addRealRouters = routes
      state.realRouters = constantRouterMap.concat(routes)
    },
    setPermissionList: (state, permissionList) => {
      if (permissionList.length) {
        state.roles = permissionList;
      }
    },
    setInterfacePrefix: (state, data) => {
      // console.log('setInterfacePrefix', state, data);
      state.interfacePrefix = data;
    },
  },
  actions: {
    setInterface({ commit }, data) {
      commit('setInterfacePrefix', data)
    },
    getLeftMenu({ commit }, data) {
      commit('setLeftMenu', data.concat(wildcard))
    },
    getRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getRoutes().then(res => {
          if (res && res.data) {
            if(res.data.data&&res.data.data.length){
              let result = []
              commit('setPermissionList', res.data.data)
              let arr = JSON.parse(JSON.stringify(res.data.data));
              let arr2 = []
              arr.forEach((item) => {//将第一层系统过滤掉||第一层系统被禁用将整个系统过滤掉
                if(item.isDisabled && item.children && item.children.length > 0){
                  arr2.push(...item.children)
                }
              });

              let finalArr = filterAsyncRoute(arr2, result, 1).concat(wildcard);
              // if(this.getters.userInfo.loginName!=='developer'){//只有开发人员才能管理菜单
              //   finalArr.length&&finalArr.forEach((item,i)=>{
              //     if(item.name=="function"){
              //       finalArr.splice(i,1);
              //     }
              //   })
              // }
              commit('setRoutes', finalArr)
              // commit('setRoutes', filterAsyncRoute(res.data.data, result, 1).concat(wildcard))
            }
            resolve(res)
          } else {
            reject('异常：请求结果不存在');
          }
        })
        //无接口处理↓
        // let a = routerList()
        // let result = []
        // commit('setPermissionList', a)
        // let arr = JSON.parse(JSON.stringify(a));
        // let arr2 = []
        // arr.forEach((item) => {//将第一层系统过滤掉||第一层系统被禁用将整个系统过滤掉
        //   // if(item.isDisabled && item.children && item.children.length > 0){
        //   //   arr2.push(...item.children)
        //   // }
        //   if(item.isShow && item.children && item.children.length > 0){
        //     arr2.push(...item.children)
        //   }
        // });
        // commit('setRoutes', filterAsyncRoute(arr2, result, 1).concat(wildcard))
        // resolve()
        //无接口处理↑
      })
    }
  }
}
export default permission
