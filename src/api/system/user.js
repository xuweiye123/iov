
import request from '@/utils/request'
/**
 * 获取用户 
 * @param {*} data 
 */
function getUser(data){
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}
/**
 * 新增用户
 * @param {*} data 
 */
function createUser(data){
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

/**
 * 编辑用户
 * @param {} data 
 * @returns 
 */
function updateUser(obj){
  return request({
    url:`/user/${obj.id}`,
    method:'put',
    data:obj.data
  })
}


/**
 * 移除用户
 * @param {*} data 
 */
function deleteUser(data){
  return request({
    url: `/user/${data.userId}`,
    method: 'delete',
    data
  })
}
/**
 * 查看用户功能菜单权限
 * TODO
 * @param {*} data 
 */
function getRightMenu(userId){
  return request({
    url: `/user/queryAccountPermission/${userId}`,
    method: 'get',
    userId
  })
}

/**
 * 启用用户
 * TODO
 * request body 为空  obj里的id对应UserList里的userId
 * @param {*} data 
 * @returns 
 */
function enableUser(obj){
  return request({
    url: `/user/enable/${obj.userId}`,
    method:'post',
    data:obj.data
  })
}

/**
 * 禁用用户
 * TODO
 * request body 为空  obj里的id对应UserList里的userId
 * @param {*} data 
 * @returns 
 */
function disableUser(obj){
  return request({
    url:`/user/disable/${obj.userId}`,
    method:'post',
    data:obj.data
  })
}

/**
 * 解锁用户
 * TODO
 * request body 为空
 * @param {} data 
 * @returns 
 */
function unlockUser(obj){
  return request({
    url:`/user/unlocked/${obj.userId}`,
    method:'post',
    data:obj.data
  })
}

/**
 * 锁定用户
 * TODO
 * request body 为空
 * @param {} data 
 * @returns 
 */
 function lockUser(obj){
  return request({
    url:`/user/locked/${obj.userId}`,
    method:'post',
    data:obj.data
  })
}

/**
 * 重置密码
 * TODO
 * request body 为空
 * @param {} data 
 * @returns 
 */
 function resetUserPwd(id){
  return request({
    url:`/user/resetPwd/${id}`,
    method:'post',
  })
}

/**
 * 用户名校验
 * TODO
 * @param {*} data 
 */
 function checkUserLoginName(data) {
		return request({
			url: "/user/checkUserLoginName",
			method: "POST",
			data,
		});
 }

/**
 * 用户手机号码校验
 * TODO
 * @param {*} data 
 */
 function checkUserMobile(data) {
  return request({
    url: '/user/checkUserMobile',
    method: 'POST',
    data
  })
}


/**
 * 用户邮箱校验
 * TODO
 * @param {*} data 
 */
 function checkUserEmail(data) {
  return request({
    url: '/user/checkUserEmail',
    method: 'POST',
    data
  })
}


/**
 * 根据邮箱获取用户
 * TODO
 * @param {*} data 
 */
 function getUserByLoginName(data) {
  return request({
    url: '/user/getUserByLoginName',
    method: 'POST',
    data
  })
}


/**
 * 多选角色合并菜单权限
 * TODO
 * @param {*} data 
 */
 function getRoleFunctionByRole(data) {
  return request({
    url: '/role/getRoleFunctionByRole',
    method: 'POST',
    data
  })
}

/**
 * 多选邮箱合并菜单权限
 * TODO
 * @param {*} data 
 */
 function getRoleFunctionByUser(data) {
  return request({
    url: '/role/getRoleFunctionByUser',
    method: 'POST',
    data
  })
}



/**
 * step2-分配用户角色
 * TODO
 * @param {*} data 
 */
 function setUserRole(data) {
  return request({
    url: '/user/setUserRole',
    method: 'POST',
    data
  })
}


/**
 * step3-获取车型列表
 * TODO
 * @param {*} data 
 */
 function getCarType() {
  return request({
    url: '/user/getCarType',
    method: 'get'
  })
}
/**
 * step3-根据车型获取项目代号列表
 * TODO
 * @param {*} data 
 */
 function getBatchByCarType(params) {
  return request({
    url: '/user/getBatchByCarType',
    method: 'get',
    params
  })
}
/**
 * step3-获取项目信息
 * TODO
 * @param {*} data 
 */
 function getBatchList(data) {
  return request({
    url: '/user/getBatchList',
    method: 'POST',
    data
  })
}



/**
 * step3-获取车辆信息
 * TODO
 * @param {*} data 
 */
 function getCarList(data) {
  return request({
    url: '/user/getCarList',
    method: 'POST',
    data
  })
}

/**
 * step3-分配用户项目和车辆
 * TODO
 * @param {*} data 
 */
 function setUserBatchAndCar(data) {
  return request({
    url: '/user/setUserBatchAndCar',
    method: 'POST',
    data
  })
}


//忘记密码功能
/**
 * 忘记密码邮箱验证
 * TODO
 * @param {*} data 
 */
 function emailVerify(data) {
  return request({
    url: '/login/emailVerify',
    method: 'POST',
    data
  })
}

/**
 * 忘记密码-修改密码
 * TODO
 * @param {*} data 
 */
 function emailVerifyCode(data) {
  return request({
    url: '/login/emailVerifyCode',
    method: 'POST',
    data
  })
}

export {
  getUser,
  createUser,
  deleteUser,
  getRightMenu,
  updateUser,
  enableUser,
  disableUser,
  unlockUser,
  lockUser,
  resetUserPwd,
  checkUserLoginName,
  checkUserMobile,
  checkUserEmail,
  getUserByLoginName,
  getRoleFunctionByRole,
  getRoleFunctionByUser,
  setUserRole,
  getCarType,
  getBatchByCarType,
  getBatchList,
  getCarList,
  setUserBatchAndCar,
  emailVerify,
  emailVerifyCode,
}