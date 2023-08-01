import request from '@/utils/request'

/**
 * 获取车辆实名认证列表
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/realNameResult/selectRealNameResultList',
    method: 'post',
    data
  })
}

/**
 * 获取联通实名认证列表
 * @param {*} data
 */
 function getCarRealist(data) {
  return request({
    url: '/realNameOwner/getPageList',
    method: 'post',
    data
  })
}

/**
 * 车辆导出
 * @param {*} data
 */
function exportsData(data) {
  return request({
    url: '/realNameResult/exportRecord',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 导出
 * @param {*} data
 */
 function exportData(data) {
  return request({
    url: '/realNameOwner/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getPageList,
  exportsData,
  exportData,
  getCarRealist,

}
