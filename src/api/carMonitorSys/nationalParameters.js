import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/nationalStandardParameter/getPageList',
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
    url: '/nationalStandardParameter/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 新增
 * @param {*} params
 */
function createParam(data) {
  return request({
    url: '/nationalStandardParameter/create',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param {*} params
 */
function updateParam(data) {
  return request({
    url: '/nationalStandardParameter/update',
    method: 'put',
    data
  })
}

/**
 * 删除
 * @param {*} params
 */
function deleteParam(data) {
  return request({
    url: '/nationalStandardParameter/delete',
    method: 'delete',
    data
  })
}

export {
  getPageList,
  paramexports,
  createParam,
  updateParam,
  deleteParam
}
