import request from '@/utils/request'
/**
 * 获取车辆换电信息
 * @param {*} data 
 */
function getchangecarList(data){
    return request({
      url: '/changecar/list',
      method: 'post',
      data
    })
  }
      /**
 * 导出车辆换电
 * @param {*} data 
 */
function exportchangecar(data){
    return request({
        url:'/changecar/export',
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
      url:'/changecar/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
  export{
    getchangecarList,
    exportchangecar,
    exportCheck
  }