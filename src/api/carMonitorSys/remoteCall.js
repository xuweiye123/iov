import request from '@/utils/request'

/**
 * 查询CAN报文车辆列表
 * @param {*} data
 */
function getDownloadTaskPageList(params) {
  return request({
    url: '/canFileDownload/list',
    method: 'get',
    params
  })
}

/**
 * 获取CAN报文目录
 * @param {*} data
 */
function getCanFile(data) {
  return request({
    url: '/canFileDownload/create',
    method: 'post',
    data
  })
}

/**
 * 立即更新
 * @param {*} data
 */
function resetDownloadTask(data) {
  return request({
    url: '/canFileDownload/reset',
    method: 'post',
    data
  })
}

/**
 * 查询CAN报文文件下载列表
 * @param {*} data
 */
function getDownloadTaskByCarPageList(params) {
  return request({
    url: '/canFileDownload/getDownloadTaskByCarPageList',
    method: 'get',
    params
  })
}

/**
 * 下载文件
 * @param {*} data
 */
function getCanFileByCarIdPageList(params) {
  return request({
    url: '/canFileDownload/list/file',
    method: 'get',
    params
  })
}

/**
 * 下载文件
 * @param {*} data
 */
function createCanFileTask(data) {
  return request({
    url: '/canFileDownload/create/file',
    method: 'post',
    data
  })
}

/**
 * 查看下载明细
 * @param {*} data
 */
function getDownloadDetailByCarIdPageList(params) {
  return request({
    url: '/canFileDownload/list/detail',
    method: 'get',
    params
  })
}

/**
 * 获取vin下拉框分页车辆
 * @param {*} params
 */
function getVinSelectPageList(data) {
  return request({
    url: '/canFileDownload/getChooseCarList',
    method: 'post',
    data
  })
}

export {
  getDownloadTaskPageList,
  getCanFile,
  resetDownloadTask,
  getDownloadTaskByCarPageList,
  getCanFileByCarIdPageList,
  createCanFileTask,
  getDownloadDetailByCarIdPageList,
  getVinSelectPageList
}