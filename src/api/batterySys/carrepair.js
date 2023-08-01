import request from '@/utils/request'
/**
 * 获取车辆生产信息
 * @param {*} data 
 */
function getCarserviceList(data){
    return request({
      url: '/carrepair/list',
      method: 'post',
      data
    })
  }
     /**
 * 导出车辆生产
 * @param {*} data 
 */
function exportCarservice(data){
  return request({
      url:'/carrepair/export',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
  /**
 * 导出错误信息
 * @param {*} data 
 */
function exportCheck(data){
  return request({
      url:'/carrepair/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
export {
    getCarserviceList,
    exportCarservice,
    exportCheck
}