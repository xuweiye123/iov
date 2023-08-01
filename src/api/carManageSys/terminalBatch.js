import request from '@/utils/request'

/**
 * 获取任务命令列表
 * @param {*} data
 */
function getBatchRemoteSettingPageList(params) {
  return request({
    url: '/terminalOperationTask/getBatchRemoteSettingList',
    method: 'get',
    params
  })
}

/**
 * 查看列表单条命令包参数
 * @param {*} params
 */
function getCommandParamById(params) {
  return request({
    url: '/terminalOperationTask/getCommandParamById',
    method: 'get',
    params
  })
}

/**
 * 查看任务详情
 * @param {*} params
 */
function getBatchRemoteSettingDetailsPageList(data) {
  return request({
    url: '/terminalOperationTask/getBatchRemoteSettingDetailsPageList',
    method: 'post',
    data
  })
}

/**
 * 获取命令包列表
 * @param {*} params
 */
function getCommandPacketPageList(params) {
  return request({
    url: '/terminalOperationTask/getCommandPacketPageList',
    method: 'get',
    params
  })
}

/**
 * 获取命令包数目
 * @param {*} params
 */
function getParamCount(params) {
  return request({
    url: '/terminalOperationTask/getParamCount',
    method: 'get',
    params
  })
}

/**
 * 添加任务
 * @param {*} params
 */
function createCommond(data) {
  return request({
    url: '/terminalOperationTask/create',
    method: 'post',
    data
  })
}

/**
 * 导出任务详情
 * @param {*} data 
 */
function exportTask(data){
  return request({
    url: '/terminalOperationTask/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getBatchRemoteSettingPageList,
  getCommandParamById,
  getBatchRemoteSettingDetailsPageList,
  getCommandPacketPageList,
  createCommond,
  getParamCount,
  exportTask
}