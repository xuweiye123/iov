import request from '@/utils/request'

/**
 * 获取导入生产信息列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/productinfo/list',
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
        url:'/productinfo/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
/**
 * 导入生产信息列表
 */
function importporductinfo(data) {
    return request({
        url:'/productinfo/import',
        method:'post',
        data
    })
}

/**
 * 导出生产信息列表
 * @param data
 * @returns {AxiosPromise}
 */
function exportproductinfo(data) {
    return request({
        url:'/productinfo/export',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}
export {
    getList,
    importporductinfo,
    exportproductinfo,
    exportCheck
}