import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getPagelist(data) {
  return request({
    url: '/geofenceRules/getGeofenceAlarmRulesPageList',
    method: 'post',
    data
  })
}

/**
 * 删除
 * @param {*} data
 */
function deleteList(data) {
  return request({
    url: '/geofenceRules/delete',
    method: 'DELETE',
    data
  })
}

/**
 * 新增
 * @param {*} data
 */
function addHandle(data) {
  return request({
    url: '/geofenceRules/create',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param {*} data
 */
function updateHandle(data) {
  return request({
    url: '/geofenceRules/update',
    method: 'put',
    data
  })
}

/**
 * 获取设置车辆信息
 * @param {*} data
 */
function getCarPagelist(data) {
  return request({
    url: '/geofenceRulesCar/getEarCarsPageList',
    method: 'post',
    data
  })
}

/**
 * 删除设置车辆
 * @param {*} data
 */
function deleteSetCar(data) {
  return request({
    url: '/geofenceRulesCar/delete',
    method: 'DELETE',
    data
  })
}

/**
 * 获取可选车辆
 * @param {*} data
 */
function getSelectCarlist(data) {
  return request({
    url: '/geofenceRulesCar/getSelectCarsPageList',
    method: 'post',
    data
  })
}

/**
 * 确认添加车辆
 * @param {*} data
 */
function createSetCar(data) {
  return request({
    url: '/geofenceRulesCar/create',
    method: 'post',
    // timeout: 180000,
    data
  })
}

/**
 * 车辆明细
 * @param {*} data
 */
function getCarByMrulePageList(data) {
  return request({
    url: '/geofenceRules/getCarByRulePageList',
    method: 'post',
    data
  })
}

function exportFail(data){
  return request({
    url: '/geofenceRulesCar/exportCheckCar',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getPagelist,
  deleteList,
  addHandle,
  getCarPagelist,
  deleteSetCar,
  getSelectCarlist,
  createSetCar,
  getCarByMrulePageList,
  updateHandle,
  exportFail
}
