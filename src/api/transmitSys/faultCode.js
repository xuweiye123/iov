import request from '@/utils/request'
/**
 * 获取故障码
 * @param {*} data
 */
function getFaultCode(data) {
  return request(({
    url: 'faultCode/getFaultCode',
    method: 'post',
    data
  }))
}
/**
 * 新增故障码
 * @param {*} data
 */
function addFaultCode(data) {
  return request({
    url: 'faultCode/createFaultCode',
    method: 'POST',
    data
  })
}
/**
 * 修改故障码
 * @param {*} data
 */
function updateFaultCode(data) {
  return request({
    url: 'faultCode/updateFaultCode',
    method: 'PUT',
    data
  })
}
/**
 * 删除故障码
 * @param {*} data
 */
function deleteFaultCode(data) {
  return request({
    url: 'faultCode/deleteFaultCode',
    method: 'DELETE',
    data
  })
}

/**
 * 导出故障码
 * @param {*} data
 */
function exportFaultCode(data) {
  return request({
    url: '/faultCode/exportFaultCode',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getFaultCode,
  addFaultCode,
  updateFaultCode,
  deleteFaultCode,
  exportFaultCode
}
