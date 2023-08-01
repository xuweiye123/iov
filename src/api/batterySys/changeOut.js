import request from '@/utils/request'
/**
 * 获取换电退役信息
 * @param {*} data 
 */
function getchangeretireList(data){
    return request({
      url: 'changeretire/list',
      method: 'post',
      data
    })
  }
      /**
 * 导出换电退役
 * @param {*} data 
 */
function exportchangeretire(data){
    return request({
        url:'/changeretire/export',
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
      url:'/changeretire/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}

/**
 * 根据电池包编码批量导出
 * @param {*} data 
 */
 function exportByCode(data){
  return request({
      url:'/changeretire/exportByCode',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
  export{
    getchangeretireList,
    exportchangeretire,
    exportCheck,
    exportByCode
  }