import request from '@/utils/request'

/**
 * 获取电池厂退役信息
 * @param data
 */
function getBatrecycsList(data) {
    return request({
        url:'/batretire/list',
        method: 'post',
        data
    })
}
/**
 * 导出电池厂退役信息
 * @param data
 */
function getBatrecycsExport(data) {
    return request({
        url:'/batretire/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
/**
 * 获取电池厂退役生命周期信息
 * @param data
 */
function getDcstyleList(data) {
    return request({
        url:'/historyrecord/getHistory',
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
        url:'/batretire/exportCheck',
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
        url:'/batretire/exportByCode',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}
export {
    getBatrecycsList,
    getBatrecycsExport,
    getDcstyleList,
    exportCheck,
    exportByCode
}