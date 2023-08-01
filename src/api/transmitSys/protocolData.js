import request from '@/utils/request'
/**
 * 获取协议数据项
 * @param {*} data
 */
function getProtocolParam(data) {
  return request({
    url: 'protocolVariable/getProtocolVariable',
    method: 'POST',
    data
  })
}
/**
 * 添加协议数据项
 * @param {*} data
 */
function addProtocolParam(data) {
  return request({
    url: 'protocolVariable/createProtocolVariable',
    method: 'POST',
    data
  })
}
/**
 * 修改协议数据项
 * @param {*} data
 */
function updateProtocolParam(data) {
  return request({
    url: 'protocolVariable/updateProtocolVariable',
    method: 'PUT',
    data
  })
}
/**
 * 删除协议数据项
 * @param {*} data
 */
function deleteProtocolParam(data) {
  return request({
    url: 'protocolVariable/deleteProtocolVariable',
    method: 'DELETE',
    data
  })
}
/**
 * 导出协议数据项
 * @param {*} data
 */
function exportProtocolVariable(data) {
  return request({
    url: 'protocolVariable/exportProtocolVariable',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getProtocolParam,
  addProtocolParam,
  updateProtocolParam,
  deleteProtocolParam,
  exportProtocolVariable
}
