import request from '@/utils/request'
/**
 * 获取换电出库信息
 * @param {*} data 
 */
function getchangeputList(data){
    return request({
      url: '/changeput/list',
      method: 'post',
      data
    })
  }
      /**
 * 导出换电出库
 * @param {*} data 
 */
function exportchangeput(data){
    return request({
        url:'/changeput/export',
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
      url:'/changeput/exportCheck',
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
      url:'/changeput/exportByCode',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}

/**
 * 导出车换电出库校验失败数据
 * @param {*} data 
 */
 function exportCheckCode(data){
  return request({
      url:'/changeput/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}

  export{
    getchangeputList,
    exportchangeput,
    exportCheck,
    exportByCode,
    exportCheckCode
  }