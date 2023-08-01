import request from '@/utils/request'
/**
 * 获取状态码列表
 * @param {*} data
 */
function getCodeList(data) {
    return request({
      url: '/errCode/getCodeList',
      method: 'post',
      data
    })
  }
 /**
 * 创建状态码信息
 * @param {*} data
 */
function createCodeInfo(data) {
    return request({
      url: '/errCode/createCodeInfo',
      method: 'post',
      data
    })
  }
/**
 * 编辑状态码信息
 * @param {*} data
 */
function updateCodeInfo(data) {
    return request({
      url: '/errCode/updateCodeInfo',
      method: 'put',
      data
    })
  }
/**
 * 删除状态码信息
 * @param {*} data
 */
function deleteCodeInfo(data) {
    return request({
      url: '/errCode/deleteCodeInfo',
      method: 'delete',
      data
    })
  }
export {
    getCodeList,
    createCodeInfo,
    updateCodeInfo,
    deleteCodeInfo
}