import request from '@/utils/request'

/**
 * 获取车辆销售信息列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/carsales/list',
        method:'post',
        data
    })
}
  /**
 * 导出错误信息
 * @param {*} data 
 */
function exportCheck(data){
    return request({
        url:'/carsales/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }

/**
 * 导出车辆销售信息
 * @param data
 * @returns {AxiosPromise}
 */
function exportCarSales(data) {
    return request({
        url:'/carsales/export',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}
export {
    getList,
    exportCarSales,
    exportCheck
}