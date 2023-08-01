import request from '@/utils/request'
/**
 * 获取公式
 * @param {*} data
 */
function getFormula(data) {
  return request({
    url: 'protocolFormula/getProtocolFormula',
    method: 'POST',
    data
  })
}
/**
 * 新增公式
 * @param {*} data
 */
function addFormula(data) {
  return request({
    url: 'protocolFormula/createProtocolFormula',
    method: 'POST',
    data
  })
}
/**
 * 修改公式
 * @param {*} data
 */
function updateFormula(data) {
  return request({
    url: 'protocolFormula/updateProtocolFormula',
    method: 'PUT',
    data
  })
}
/**
 * 删除公式
 * @param {*} data
 */
function deleteFormula(data) {
  return request({
    url: 'protocolFormula/deleteProtocolFormula',
    method: 'DELETE',
    data
  })
}
/**
 * 导出协议公式
 * @param {*} data
 */
function exportProtocolFormula(data) {
  return request({
    url: 'protocolFormula/exportProtocolFormula',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getFormula,
  addFormula,
  updateFormula,
  deleteFormula,
  exportProtocolFormula
}
