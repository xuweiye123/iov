import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/offlineCheck/getOffLineCarDetection',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
function exportsData(data) {
  return request({
    url: '/offlineCheck/exportOffLineCar',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getPageList,
  exportsData
}
