import request from '@/utils/request'
/**
 * 获取支持车型列表
 * @param {*} data
 */
function getList(data) {
  return request({
    url: '/carType/getList',
    method: 'post',
    data
  })
}  
/**
 * 创建支持车型
 * @param {*} data
 */
function createSupportCarType(data) {
  return request({
    url: '/carType/createSupportCarType',
    method: 'post',
    data
  })
}
/**
 * 编辑支持车型
 * @param {*} data
 */
function updateSupportCarType(data) {
  return request({
    url: '/carType/NoFileUpdateSupportCarTypePdx',
    method: 'post',
    data
  })
}
/**
 * 删除支持车型
 * @param {*} data
 */
function deleteSupportCarType(data) {
  return request({
    url: '/carType/deleteSupportCarType',
    method: 'delete',
    data
  })
}
/**
 * 获取pdx
 * @param {*} data
 */
 function getExportResultList(data) {
  return request({
    url: '/carType/getExportResultList',
    method: 'post',
    data
  })
}

export {
  getList,
  createSupportCarType,
  updateSupportCarType,
  deleteSupportCarType,
  getExportResultList
}
