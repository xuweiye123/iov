import request from '@/utils/request'

/**
 * 获取待检查任务
 * @param {*} data
 */
function checkTask(data) {
  return request({
    url: 'dbcTask/getStayCheckTask',
    method: 'post',
    data
  })
}
/**
 * 审核or退回DBC配置
 * @param {*} data
 */
function approvalDbcTask(data) {
  return request({
    url: 'dbcTask/approvalDbcTask',
    method: 'post',
    data
  })
}
/**
 * 导出待检查任务
 * @param {*} data
 */
function exportStayCheckTask(data) {
  return request({
    url: '/dbcTask/exportStayCheckTask',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 获取DBC配置任务
 * @param {*} data
 */
 function getDbcTask(data) {
  return request({
    url: 'dbcTask/getStayConfigTask',
    method: 'post',
    data
  })
}
/**
 * 获取协议数据项树
 * @param {*} params
 */
function getProtocolVariable(params) {
  return request({
    url: 'dbcTask/getProtocolVariable',
    method: 'get',
    params
  })
}

/**
 * 获取DBC参数
 * @param {*} params
 */
function getDbcVariable(params) {
  return request({
    url: 'dbcTask/getDbcVariable',
    method: 'get',
    params
  })
}
/**
 * 获取故障码
 * @param {*} params
 */
function getFaultCode(params) {
  return request({
    url: 'dbcTask/getFaultCode',
    method: 'get',
    params
  })
}
/**
 * 获取DBC审核日志
 * @param {*} params
 */
function getDbcTaskLog(params) {
  return request({
    url: 'dbcTask/getDbcTaskLog',
    method: 'get',
    params
  })
}

/**
 * 获取协议数据项公式
 * @param {*} params
 */
function getProtocolFormula(params) {
  return request({
    url: 'dbcTask/getProtocolFormula',
    method: 'get',
    params
  })
}
/**
 * 获取DBC配置信息
 * @param {*} params
 */
function getDbcConfig(params) {
  return request({
    url: 'dbcTask/getDbcConfig',
    method: 'get',
    params
  })
}
/**
 * 保存or提交DBC配置
 * @param {*} data
 */
function setDbcTask(data) {
  return request({
    url: 'dbcTask/setDbcTask',
    method: 'post',
    data
  })
}

/**
 * 导出待配置任务
 * @param {*} data
 */
function exportStayConfigTask(data) {
  return request({
    url: '/dbcTask/exportStayConfigTask',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  checkTask,
  approvalDbcTask,
  exportStayCheckTask,
  getDbcTask,
  getProtocolVariable,
  getDbcVariable,
  getFaultCode,
  getDbcTaskLog,
  getProtocolFormula,
  getDbcConfig,
  setDbcTask,
  exportStayConfigTask
}
