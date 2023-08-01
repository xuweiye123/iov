import request from '@/utils/request'

/**
 * 获取回收网点退役信息
 * @param data
 */
function getBatrecycsList(data) {
    return request({
        url:'/batrecycs/list',
        method: 'post',
        data
    })
}
/**
 * 导出回收网点退役信息
 * @param data
 */
function getBatrecycsExport(data) {
    return request({
        url:'/batrecycs/export',
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
        url:'/batrecycs/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
  /**
 * 根据多个电池编码批量导出
 * @param data
 */
 function exportByCode(data) {
    return request({
        url:'/batrecycs/exportByCode',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}
export {
    getBatrecycsList,
    getBatrecycsExport,
    exportCheck,
    exportByCode
}