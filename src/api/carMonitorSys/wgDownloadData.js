import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/gatewayDataDownload/getGatewayDataDownloadList',
    method: 'post',
    data
  })
}

/**
 * 上传配置文件
 * @param {*} data
 */
function uploadConfigFile(data) {
  return request({
    url: '/gatewayDataDownload/uploadConfigFile',
    method: 'post',
    data
  })
}

/**
 * 获取配置上传记录列表
 * @param {*} data
 */
function getConfigUploadRecordList(data) {
  return request({
    url: '/gatewayDataDownload/getConfigUploadRecordList',
    method: 'post',
    data
  })
}

/**
 * 获取选择车辆
 * @param {*} data
 */
function getConfigCarList(data) {
  return request({
    url: '/gatewayDataDownload/getConfigCarList',
    method: 'post',
    data
  })
}

/**
 * 获取下载链接
 * @param {*} data
 */
function getDownLoadUrl(params) {
  return request({
    url: '/gatewayDataDownload/getDownLoadUrl',
    method: 'get',
    params
  })
}
export {
  getPageList,
  uploadConfigFile,
  getConfigUploadRecordList,
  getConfigCarList,
  getDownLoadUrl
}
