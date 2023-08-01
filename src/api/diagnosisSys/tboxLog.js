import request from '@/utils/request'

/**
 * 获取日志列表
 * @param {*} data 
 */
function getlogUpload(data){
  return request({
    url: '/tboxLog/list',
    method: 'post',
    data
  })
}

/**
 * 获取车型
 * @param {*} data 
 */
 function getcarTypeName(data){
  return request({
    url: '/common/getSupportCarTypeList',
    method: 'get',
    data
  })
}

/**
 * 上传
 * @param {*} data 
 */
 function logUpload(data){
  return request({
    url: '/tboxLog/upload',
    method: 'post',
    data
  })
}

/**
 * 上传日志记录
 * @param {*} data 
 */
 function logList(data){
  return request({
    url: '/tboxLog/logList',
    method: 'post',
    data
  })
}

export {
  getlogUpload,
  getcarTypeName,
  logUpload,
  logList
}