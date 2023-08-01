import request from '@/utils/request'
/**
 * 获取转发链路
 * @param {*} data
 */
function getForwardLink(data) {
  return request({
    url: 'forwardLink/getForwardLink',
    method: 'post',
    data
  })
}
/**
 * 添加转发链路
 * @param {*} data
 */
function createForwardLink(data) {
  return request({
    url: 'forwardLink/createForwardLink',
    method: 'post',
    data
  })
}
/**
 * 编辑转发链路
 * @param {*} data
 */
function updateForwardLink(data) {
  return request({
    url: 'forwardLink/updateForwardLink',
    method: 'put',
    data
  })
}
/**
 * 删除转发链路
 * @param {*} data
 */
function deleteForwardLink(data) {
  return request({
    url: 'forwardLink/deleteForwardLink',
    method: 'DELETE',
    data
  })
}
/**
 * 导出转发链路
 * @param {*} data
 */
function exportForwardLink(data) {
  return request({
    url: 'forwardLink/exportForwardLink',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 获取车辆
 * @param {*} data
 */
function getCar(data) {
  return request({
    url: 'forwardLink/getCar',
    method: 'post',
    data
  })
}
/**
 * 校验车辆
 * @param {*} data
 */
function checkCar(data) {
  return request({
    url: 'forwardLink/checkCar',
    method: 'post',
    data
  })
}

/**
 * 导出校验失败车辆
 * @param {*} data
 */
function exportCheckCar(data) {
  return request({
    url: 'forwardLink/exportCheckCar',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 添加转发车辆任务
 * @param {*} data
 */
function createForwardTask(data) {
  return request({
    url: 'forwardTask/createForwardTask',
    method: 'post',
    data
  })
}
/**
 * 编辑链路过滤脚本
 * @param {*} data
 */
function updateLinkScript(data) {
  return request({
    url: 'forwardLink/updateLinkScript',
    method: 'post',
    data
  })
}
export {
  getForwardLink,
  createForwardLink,
  updateForwardLink,
  deleteForwardLink,
  exportForwardLink,
  getCar,
  checkCar,
  exportCheckCar,
  createForwardTask,
  updateLinkScript,
}
