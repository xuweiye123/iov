import request from '@/utils/request'

/**
 * 获取电池模块型号
 * @param data
 * @returns {AxiosPromise}
 */
function getCellModuleList(data) {
    return request({
        url:'/batmodule/list',
        method:'post',
        data
    })
}

/**
 * 查看模块详细信息
 * @param data
 * @returns {AxiosPromise}
 */
function getCellModule(id) {
    return request({
        url:`/batmodule/${id}`,
        method:'post'
    })
}

/**
 * 导出模块列表
 * @param data
 * @returns {AxiosPromise}
 */
function exportCellModule(data) {
    return request({
        url:'/batmodule/export',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}

/**
 * 导入电池模块
 * @param data
 */
function importCellModule(data) {
    return request({
        url:'/batmodule/import',
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
        url:'/batmodule/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
export {
    getCellModuleList,
    getCellModule,
    exportCellModule,
    importCellModule,
    exportCheck
}