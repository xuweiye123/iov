
import { Message } from 'element-ui'
import {
	login,
	getUserInfo,
	// logOut,
  logout,
	submitPhoneCode,
  // passwordValidity,
	sharesPlatformLogin,
  loginSession
} from "@/api/login";
import {
  getToken,
  setToken,
  removeToken,
  setMapInterface,
} from '@/utils/auth'
import Cookies from 'js-cookie'
import store from '@/store'
import { reject, resolve } from 'core-js/fn/promise'
const user = {
  state: {
    keys: 'user',
    token: getToken(),
    userid: '',
    loginName: '',
    isInternal:0,
    userName: '',
    sysSelected: '快速入口',
    sysSelectedEn: 'fastEntry',
    name: '',
    //将roles移至permission.js
    // roles: [],
    userInfo: {},
    firstRouterName: '',
    // expiredInfo:{},
    uuapAppKey: '',//uuap认证appkey
    uuapAuthUrl: '',//uuap认证地址
  },
  mutations: {
    setToken: (state, token) => {
      state.token = token
    },
    setMapInterface: (state,mapInterface) => {
      state.mapInterface = mapInterface
      setMapInterface(mapInterface)
    },
    setSysSelected: (state, sysSelected) => {
      state.sysSelected = sysSelected
      if(sysSelected){
        let arr = store.getters.roles.filter((item)=>{return item.functionName===sysSelected})
        state.sysSelectedEn = arr.length>0 ? arr[0].url : 'fastEntry'
      }else{
        state.sysSelectedEn = 'fastEntry'
      }

    },
    setInfo: (state, data) => {
      if (data) {
        // state.loginName = data.loginName
        // state.loginName = data.email?data.email.split('@')[0]:''
        state.loginName = data.loginName?data.loginName:''
        state.isInternal = data.isInternal?data.isInternal:0
        state.userName = data.userName?data.userName:''  
        state.userInfo = {...data}
      }else{
        state.loginName = ''
        state.isInternal = 0
        state.userName = ''
        state.userInfo = {}
      }
    },
    // setExpired: (state, data) => {
    //   if (data) {
    //     state.expiredInfo = {...data}
    //   }else{
    //     state.expiredInfo = {}
    //   }
    // },
    setUuapAppKey: (state, data) => {
      state.uuapAppKey = data
    },
    setUuapAuthUrl: (state, data) => {
      state.uuapAuthUrl = data
    }
  },
  actions: {
    login({ commit }, { loginName, loginPwd, verifyToken, verifyCode }) {
      const name = loginName.trim()
      return new Promise((resolve, reject) => {
        login(name, loginPwd,verifyToken,verifyCode)
          .then(({ data }) => {
            const result = data.data;
            if (data.data) {
              commit("setToken", result.accessToken);
              setToken(result.accessToken);
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      
        //无接口处理↓
        // commit('setToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTBhZTUwNDEtN2QyNy00NjFlLWJlZGItNDcxOWM4MGU2ODJhIiwiZXhwIjoxNjU3Mjg2OTc2LCJpYXQiOjE2NTcyNTgxNzZ9.1OPnhb_OjtV8Ii-MpffY6ueKtkLdmu0znlvGti9Mfgg')
        // setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTBhZTUwNDEtN2QyNy00NjFlLWJlZGItNDcxOWM4MGU2ODJhIiwiZXhwIjoxNjU3Mjg2OTc2LCJpYXQiOjE2NTcyNTgxNzZ9.1OPnhb_OjtV8Ii-MpffY6ueKtkLdmu0znlvGti9Mfgg')
        // resolve()
        //无接口处理↑
      })
    },
    //短信验证登录
    msgCheckLogin({ commit }, { loginName, loginPwd, emailCode }) {
      const name = loginName.trim()
      return new Promise((resolve, reject) => {
        submitPhoneCode(name, loginPwd, emailCode).then(({ data }) => {
          const result = data.data
          if(data.data){
            commit('setToken', result.accessToken)
            setToken(result.accessToken)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
        
        //无接口处理↓
        // commit('setToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTBhZTUwNDEtN2QyNy00NjFlLWJlZGItNDcxOWM4MGU2ODJhIiwiZXhwIjoxNjU3Mjg2OTc2LCJpYXQiOjE2NTcyNTgxNzZ9.1OPnhb_OjtV8Ii-MpffY6ueKtkLdmu0znlvGti9Mfgg')
        // setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTBhZTUwNDEtN2QyNy00NjFlLWJlZGItNDcxOWM4MGU2ODJhIiwiZXhwIjoxNjU3Mjg2OTc2LCJpYXQiOjE2NTcyNTgxNzZ9.1OPnhb_OjtV8Ii-MpffY6ueKtkLdmu0znlvGti9Mfgg')
        // resolve()
        //无接口处理↑
      })
    },
    logout({ state,commit }) {
      return new Promise((resolve,reject) => {
        logout().then(({data})=>{
          if(data.code ===0){
            commit('setToken', '')
            removeToken()
            if(localStorage.internalLogin == 1){
              setTimeout(() => {
                let locationUrl = window.location.origin + '/#/internalLogin';
                let uuapAppKey = state.uuapAppKey;
                let uuapAuthUrl = state.uuapAuthUrl;
                //pToken 存在于baidu.com（baidu-int.com）域名下，cookie的名字为UUAP_P_TOKEN，线下环境统一为UUAP_P_TOKEN_OFFLINE
                window.location.href = `${uuapAuthUrl}/logout?uuapAppKey=${uuapAppKey}&service=${encodeURIComponent(
                  locationUrl
                )}&version=v2`;
              }, 500);
            }else{
              location.reload();
            }
            resolve()
          }
        }).catch(error =>{
           reject(error)
        })
      })
    },
    logoutOffline({ state,commit }) {
      return new Promise((resolve,reject) => {
            commit('setToken', '')
            removeToken()
            setTimeout(() => {
              let locationUrl = window.location.origin + '/#/internalLogin';
              let uuapAppKey = state.uuapAppKey;
              let uuapAuthUrl = state.uuapAuthUrl;
              //pToken 存在于baidu.com（baidu-int.com）域名下，cookie的名字为UUAP_P_TOKEN，线下环境统一为UUAP_P_TOKEN_OFFLINE
              window.location.href = `${uuapAuthUrl}/logout?uuapAppKey=${uuapAppKey}&service=${encodeURIComponent(
                locationUrl
              )}&version=v2`;
            }, 500);
            resolve()
          })
    },
    fedLogout({ commit }) {
      return new Promise(resolve => {
        commit('setToken', '')
        removeToken()
        location.reload();
        resolve()
      })
    },
    getUserInfo({ commit }) {
      return new Promise(resolve => {
        getUserInfo().then(res => {
          // 获取用户信息 TODO
          commit('setInfo', res.data.data)
          resolve()
        }).catch(err => {
          // console.log('1111')
        })

        //无接口处理↓
        // let b = {
        //   "userId": "2b890a2c-ad8d-4cbe-8c3f-f01adac0e5ae",
        //   "loginName": "admin",
        //   "realName": "admin",
        //   "isDisabled": 1,
        //   "isLocked": 1,
        //   "lastChangedPwdTime": "2022-04-21 16:56:41",
        //   "lastChangedPwdDay": "34",
        //   "roles": [
        //       "e4d4dfcc-7ae4-48dd-9b4b-b571a7979c42"
        //   ]
        // }
        // commit('setInfo', b)
        // resolve()
        //无接口处理↑

      })
    },
    // passwordValidity({ commit }) {
    //   return new Promise(resolve => {
    //     passwordValidity().then(res => {
    //       // 获取用户信息 TODO
    //       // console.log(res,123)
    //       // commit('setExpired', res.data.data)
    //       resolve()
    //     }).catch(err => {
    //       // console.log('1111')
    //     })

    //   })
    // },
    //UUAP登录
    uuapLogin({ commit }, obj) {
      return new Promise((resolve, reject) => {
        loginSession(obj).then(({ data }) => {
          const result = data.data
          if(data.data){
            commit('setToken', result.accessToken)
            setToken(result.accessToken)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
        
        //无接口处理↓
        // commit('setToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTBhZTUwNDEtN2QyNy00NjFlLWJlZGItNDcxOWM4MGU2ODJhIiwiZXhwIjoxNjU3Mjg2OTc2LCJpYXQiOjE2NTcyNTgxNzZ9.1OPnhb_OjtV8Ii-MpffY6ueKtkLdmu0znlvGti9Mfgg')
        // setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiOTBhZTUwNDEtN2QyNy00NjFlLWJlZGItNDcxOWM4MGU2ODJhIiwiZXhwIjoxNjU3Mjg2OTc2LCJpYXQiOjE2NTcyNTgxNzZ9.1OPnhb_OjtV8Ii-MpffY6ueKtkLdmu0znlvGti9Mfgg')
        // resolve()
        //无接口处理↑
      })
    },
  }
}
export default user
