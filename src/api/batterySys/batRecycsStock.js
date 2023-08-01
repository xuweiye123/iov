import request from '@/utils/request'

/**
 * 获取回收网点入库信息
 * @param data
 */
function getBatrecycsList(data) {
    return request({
        url:'/batrecycsstock/list',
        method: 'post',
        data
    })
}
/**
 * 导出回收网点入库信息
 * @param data
 */
function getBatrecycsExport(data) {
    return request({
        url:'/batrecycsstock/export',
        method: 'post',
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
        url:'/batrecycsstock/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
  /**
 * 根据多个电池编码批量导出
 * @param {*} data 
 */
 function exportByCode(data){
    return request({
        url:'/batrecycsstock/exportByCode',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
export {
    getBatrecycsList,
    getBatrecycsExport,
    exportCheck,
    exportByCode
}