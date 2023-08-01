import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getTerminalPageList(data) {
  return request({
    url: '/terminalAlterAudit/select',
    method: 'post',
    data
  })
}

/**
 * 新增
 * @param {*} data
 */
function create(data) {
  return request({
    url: '/terminalAlterAudit/create',
    method: 'post',
    data
  })
}
/**
 * 编辑
 * @param {*} data
 */
function update(data) {
  return request({
    url: '/terminalAlterAudit/update',
    method: 'put',
    data
  })
}

/**
 * 删除
 * @param {*} params
 */
function deleteHandle(data) {
  return request({
    url: '/terminalAlterAudit/delete',
    method: 'delete',
    data
  })
}

/**
 * 获取ICCID
 * @param {*} data
 */
function getNewSimPageList(data) {
  return request({
    url: '/terminalAlterAudit/findSIMPage',
    method: 'post',
    data
  })
}

/**
 * 获取终端
 * @param {*} data
 */
function getTerminal(data) {
  return request({
    url: '/terminalAlterAudit/findTerminalPage',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
function exportHandle(data) {
  return request({
    url: '/terminalAlterAudit/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 审核
 * @param {*} data
 */
function auditHandle(data) {
  return request({
    url: '/terminalAlterAudit/audit',
    method: 'post',
    data
  })
}

/**
 * 获取图片
 * @param {*} data
 */
function getImgList(data) {
  return request({
    url: '/terminalAlterAudit/getPictureList',
    method: 'post',
    data
  })
}

/**
 * 获取vin码列表
 * @param {*} data
 */
function getAuditCarPageList(data) {
  return request({
    url: '/terminalAlterAudit/getAuditCarPageList',
    method: 'post',
    data
  })
}

export {
  getTerminalPageList,
  create,
  update,
  deleteHandle,
  getNewSimPageList,
  exportHandle,
  auditHandle,
  getImgList,
  getAuditCarPageList,
  getTerminal
}
