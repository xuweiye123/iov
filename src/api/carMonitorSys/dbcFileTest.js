import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/dbcFileCheck/getPageList',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
function paramexports(data) {
  return request({
    url: '/dbcFileCheck/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 树
 * @param {*} params
 */
function getDbcTree(data) {
  return request({
    url: '/dbcFileCheck/getDbcTree',
    method: 'post',
    data
  })
}

/**
 * 检测结果
 * @param {*} params
 */
function getCheckResultPageList(data) {
  return request({
    url: '/dbcFileCheck/getCheckResultPageList',
    method: 'post',
    data
  })
}

/**
 * 重新检测
 * @param {*} params
 */
function autoCheckDBC(data) {
  return request({
    url: '/dbcFileCheck/autoCheckDbc',
    method: 'post',
    data
  })
}

/**
 * 审核
 * @param {*} params
 */
function approvalDbc(data) {
  return request({
    url: '/dbcFileCheck/approvalDbc',
    method: 'post',
    data
  })
}

/**
 * 查看车辆信息
 * @param {*} params
 */
function seeCarMessage(data) {
  return request({
    url: '/dbcFileCheck/getCarsOfDbcPageList',
    method: 'post',
    data
  })
}

export {
  getPageList,
  paramexports,
  getDbcTree,
  getCheckResultPageList,
  autoCheckDBC,
  approvalDbc,
  seeCarMessage
}
