import request from '@/utils/request'

/**
 * 获取转发目标平台
 * @param {*} data
 */
function getForwardTarget(data) {
	return request({
		url: "forwardTarget/getForwardTarget",
		method: "post",
		data,
	});
}
/**
 * 添加转发目标平台
 * @param {*} data
 */
function createForwardTarget(data) {
  return request({
    url: 'forwardTarget/createForwardTarget',
    method: 'post',
    data
  })
}
/**
 * 编辑转发目标平台
 * @param {*} data
 */
function updateForwardTarget(data) {
  return request({
    url: 'forwardTarget/updateForwardTarget',
    method: 'put',
    data
  })
}
/**
 * 删除转发目标平台
 * @param {*} data
 */
function deleteForwardTarget(data) {
  return request({
    url: 'forwardTarget/deleteForwardTarget',
    method: 'delete',
    data
  })
}
/**
 * 获取协议数据项树
 * @param {*} data
 */
function getProtocolVariable(params) {
  return request({
    url: 'forwardTarget/getProtocolVariable',
    method: 'get',
    params
  })
}
/**
 * 获取不转发协议数据项
 * @param {*} params
 */
function getExcludeVariable(params) {
  return request({
    url: 'forwardTarget/getExcludeVariable',
    method: 'get',
    params
  })
}
/**
 * 设置不转发协议数据项
 * @param {*} data
 */
function setExcludeVariable(data) {
  return request({
    url: 'forwardTarget/setExcludeVariable',
    method: 'post',
    data
  })
}
/**
 * 导出转发目标平台
 * @param {*} data
 */
function exportForwardTarget(data) {
  return request({
    url: '/forwardTarget/exportForwardTarget',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getForwardTarget,
  createForwardTarget,
  updateForwardTarget,
  deleteForwardTarget,
  getProtocolVariable,
  getExcludeVariable,
  setExcludeVariable,
  exportForwardTarget
}
