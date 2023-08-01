import request from '@/utils/request'

/**
 * 查询命令包列表
 * @param {*} data
 */
function getCommandPacketPageList(params) {
  return request({
    url: '/terminalCommandPacket/getCommandPacketPageList',
    method: 'get',
    params
  })
}

/**
 * 查看单条命令包信息
 * @param {*} data
 */
function getEditCommandParamById(params) {
  return request({
    url: '/terminalCommandPacket/getEditCommandParamById',
    method: 'get',
    params
  })
}

/**
 * 获取命令参数列表
 * @param {*} data
 */
function getCommandParam() {
  return request({
    url: '/terminalCommandPacket/getCommandParam',
    method: 'get'
  })
}

/**
 * 新增命令包
 * @param {*} data
 */
function createCommand(data) {
  return request({
    url: '/terminalCommandPacket/create',
    method: 'post',
    data
  })
}

export {
  getCommandPacketPageList,
  getEditCommandParamById,
  getCommandParam,
  createCommand
}