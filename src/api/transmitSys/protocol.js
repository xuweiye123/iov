
import request from '@/utils/request'
/**
 * 获取协议
 * @param {*} data
 */
 function getProtocol(data) {
  return request({
    url: '/protocol/getProtocol',
    method: 'POST',
    data
  })
}
/**
 * 添加协议
 * @param {*} data
 */
function addProtocol(data) {
  return request({
    url: '/protocol/createProtocol',
    method: 'POST',
    data
  })
}
/**
 * 修改协议
 * @param {*} data
 */
function updateProtocol(data) {
  return request({
    url: '/protocol/updateProtocol',
    method: 'PUT',
    data
  })
}
/**
 * 删除协议
 * @param {*} data
 */
function deleteProtocol(data) {
  return request({
    url: '/protocol/deleteProtocol',
    method: 'DELETE',
    data
  })
}

/**
 * 导出协议
 * @param {*} data
 */
function exportProtocol(data) {
  return request({
    url: '/protocol/exportProtocol',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getProtocol,
  addProtocol,
  updateProtocol,
  deleteProtocol,
  exportProtocol
}
