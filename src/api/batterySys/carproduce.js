import request from '@/utils/request'
/**
 * 获取车辆生产信息
 * @param {*} data 
 */
function getCarproduceList(data){
    return request({
      url: 'carproduce/list',
      method: 'post',
      data
    })
  }
    /**
 * 导出错误信息
 * @param {*} data 
 */
function exportCheck(data){
  return request({
      url:'/carproduce/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
     /**
 * 导出车辆生产
 * @param {*} data 
 */
function exportCarproduce(data){
  return request({
      url:'/carproduce/export',
      method:'post',
      data
  })
}
    /**
 * 查看电池单体
 */
function lookcsnInfo(data){
    return request({
        url:'/carproduce/csnInfo',
        method:'post',
        data
    })
  }
    /**
 * 查看电池模块
 */
function lookmsnInfo(data){
    return request({
        url:'/carproduce/msnInfo',
        method:'post',
        data
    })
  }
    /**
 * 查看电池包
 */
function lookpsnInfo(data){
    return request({
        url:'/carproduce/psnInfo',
        method:'post',
        data
    })
  }
      /**
 * 查看车辆信息
 */
function lookcarInfo(data){
    return request({
        url:'/carproduce/carProduceInfo',
        method:'post',
        data
    })
  }
     /**
 * 解绑
 */
function ubindcar(data){
    return request({
        url:'/carproduce/ubind',
        method:'post',
        data
    })
  }

export {
    getCarproduceList,
    exportCarproduce,
    lookcsnInfo,
    lookmsnInfo,
    lookpsnInfo,
    ubindcar,
    lookcarInfo,
    exportCheck
}