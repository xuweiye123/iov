
import request from '@/utils/request'
// 获取验证码 (股份平台)
function getCheckCode(params){
  return request({
    url: `/sys/randomImage/${params}`,
    method: 'get',
  })
}
// 登录 (股份平台)
function sharesPlatformLogin(loginName, loginPwd, verification, checkKey) {
	const Base64 = require("js-base64").Base64;
	const data = {
		username: Base64.encode(loginName),
		password: Base64.encode(loginPwd),
		checkKey,
		captcha: verification,
	};
	return request({
		url: "/sys/login",
		method: "POST",
		data,
	});
}

/**
 * 获取验证码
 */
function getVerifyCode(){
  return request({
    url: '/login/getVerifyCode',
    method: 'post'
  })
}

/**
 * 登录
 * @param {*} loginName
 * @param {*} loginPwd
 */
function login(loginName, loginPwd, verifyToken, verifyCode, system) {
  let data = {}
  if (system === 'newEnergyPlatform') {
    data = {
			loginname: window.btoa(loginName),
			loginpwd: window.btoa(loginPwd),
			verifyToken,
			verifyCode,
		};
  } else { 
    data = {
			loginName: window.btoa(loginName),
			loginPwd: window.btoa(loginPwd),
			verifyToken,
			verifyCode,
		};
  }
  return request({
    url: '/login/login',
    method: 'POST',
    data
  })
}
/**
 * 修改密码
 * @param {*} data 
 */
function changedpwd(data){
  return request({
    url: '/login/changedPwd',
    method: 'put',
    data
  })
}

/**
 * 90天密码过期
 * @param {*} data 
 */
// function passwordValidity() {
// 	return request({
// 		url: "/user/current/passwordValidity",
// 		method: "get",
// 	});
// }

/**
 * 90天密码过期，修改密码
 * @param {*} data 
 */
function overdueChangedPwd(data) {
	return request({
		url: "/login/overdueChangedPwd",
		method: "put",
		data,
	});
}
function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
/**
 * @name: 用户信息
 * @param {*}
 */
function getUserInfo() {
  return request({
    url: '/user/current/info',
    method: 'get'
  })
}

/**
 * @name: 退出登录
 * @param {*}
 */
 function logOut(ticket,appkey) {
   const data = {
     ticket:ticket,
     uuapAppKey:appkey
   }
  return request({
    url: '/login/logout',
    // url:'http://192.168.1.34:3000/mock/356/login/logout',
    method: 'post',
    data
  })
}


/**
 * 获取用户权限菜单
 */
function getRoutes() {
  return request({
    url: '/user/current/function',
    method: 'get'
  })
}

/**
 * 发送短信验证码
 * @param {*} data 
 */
 function sendPhoneCode(data){
  return request({
    url: '/login/sendPhoneCode',
    method: 'post',
    data
  })
}

/**
 * 提交短信验证码并登录
 * @param {*} data 
 */
 function submitPhoneCode(loginName, loginPwd, emailCode){
  const data = {
    loginName: window.btoa(loginName),
    loginPwd: window.btoa(loginPwd),
    emailCode: emailCode,
  }
  return request({
    url: '/login/submitPhoneCode',
    method: 'post',
    data
  })
}

/**
 * UAPP登录
 * @param {*} data 
 */
function loginSession(data){
  return request({
    url: '/login/sso',
    method: 'post',
    data
  })
}

export {
	getCheckCode,
	login,
	changedpwd,
  // passwordValidity,
	overdueChangedPwd,
	logout,
	getUserInfo,
	getRoutes,
	logOut,
	sendPhoneCode,
	submitPhoneCode,
	sharesPlatformLogin,
	getVerifyCode,
  loginSession
};
