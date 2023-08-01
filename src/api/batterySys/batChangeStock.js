import request from '@/utils/request'
/**
 * 获取换电入库信息
 * @param {*} data 
 */
function getchangestockList(data){
    return request({
      url: '/changestock/list',
      method: 'post',
      data
    })
  }
      /**
 * 导出换电入库
 * @param {*} data 
 */
function exportchangestock(data){
    return request({
        url:'/changestock/export',
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
      url:'/changestock/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
  /**
 * 根据多个vin码批量导出换电库存信息
 * @param data
 */
   function exportByVin(data) {
    return request({
        url:'/changestock/exportByVin',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}
  export{
    getchangestockList,
    exportchangestock,
    exportCheck,
    exportByVin
  }