import request from '@/utils/request'

/**
 * 获取电池模块信息列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/msn/list',
        method:'post',
        data
    })
}

/**
 * 导出电池模块信息
 * @param data
 * @returns {AxiosPromise}
 */
function exportMsnManager(data) {
    return request({
        url:'/msn/export',
        method:'post',
        data
    })
}
/**
 * 导入电池模块信息
 */
function importMsnManager() {
    return request({
        url:'/msn/import',
        method:'post'
    })
}

/**
 * 查看绑定电池单体信息(电池模块信息)
 * @param data
 * @returns {AxiosPromise}
 */
function lookDetail(data) {
    return request({
        url:'/msn/csnrecord',
        method:'post',
        data
    })
}

/**
 * 删除电池模块信息
 * @param data
 * @returns {AxiosPromise}
 */
function deleteMsnManager(data) {
    return request({
        url:'/msn/delete',
        method:'delete',
        data
    })
}
 /**
 * 导出错误信息
 * @param {*} data 
 */
function exportCheck(data){
    return request({
        url:'/msn/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }

  /**
 * 根据电池包编码批量导出
 * @param {*} data 
 */
 function exportByMsnCodeList(data){
    return request({
        url:'/msn/exportByMsnCodeList',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }

export {
    getList,
    exportMsnManager,
    importMsnManager,
    lookDetail,
    deleteMsnManager,
    exportCheck,
    exportByMsnCodeList
}