import request from '@/utils/request'
/**
 * 获取协议插件
 * @param {*} data
 */
function getProtocolModule(data) {
  return request({
    url: 'protocolModule/getProtocolModule',
    method: 'POST',
    data
  })
}
/**
 * 添加协议插件
 * @param {*} data
 */
function createProtocolModule(data) {
  return request({
    url: 'protocolModule/createProtocolModule',
    method: 'POST',
    data
  })
}
/**
 * 编辑协议插件
 * @param {*} data
 */
function updateProtocolModule(data) {
  return request({
    url: 'protocolModule/updateProtocolModule',
    method: 'PUT',
    data
  })
}
/**
 * 删除协议插件
 * @param {*} data
 */
function deleteProtocolModule(data) {
  return request({
    url: 'protocolModule/deleteProtocolModule',
    method: 'DELETE',
    data
  })
}
/**
 * 导出协议插件
 * @param {*} data
 */
function exportProtocolModule(data) {
  return request({
    url: '/protocolModule/exportProtocolModule',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getProtocolModule,
  createProtocolModule,
  updateProtocolModule,
  deleteProtocolModule,
  exportProtocolModule
}
