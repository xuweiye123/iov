import request from '@/utils/request'

/**
 * 获取合格证信息列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/certificate/list',
        method:'post',
        data
    })
}
/**
 * 查看导出任务列表
 * @param data
 * @returns {AxiosPromise}
 */
function getExportTaskList(data) {
    return request({
        url:'/certificate/exportTaskList',
        method:'post',
        data
    })
}

/**
 * 查看导入任务列表
 * @param data
 * @returns {AxiosPromise}
 */
function getImportTaskList(data) {
    return request({
        url:'/certificate/importTaskList',
        method:'post',
        data
    })
}

/**
 * 导出合格证信息列表
 * @param data
 */
function exportConfigurator(data) {
    return request({
        url:'/certificate/export',
        method:'post',
        data
    })
}

/**
 * 导入合格证信息
 * @param data
 * @returns {AxiosPromise}
 */
function importConfigurator(data) {
    return request({
        url:'/certificate/import',
        method:'post',
        data
    })
}

/**
 * 批量删除导入任务列表
 * @param data
 * @returns {AxiosPromise}
 */
function deleteImportTask(data) {
    return request({
        url:'/certificate/importDelete',
        method:'delete',
        data
    })
}

/**
 * 批量删除导出任务列表
 * @param data
 * @returns {AxiosPromise}
 */
function deleteExportTask(data) {
    return request({
        url:'/certificate/exportDelete',
        method:'delete',
        data
    })
}


/**
 * 根据多个vin码批量导出合格证信息导出
 * @param data
 */
 function exportByVin(data) {
     return request({
         url:'/certificate/exportByVin',
         method:'post',
         responseType:'arraybuffer',
         data
     })
 }
 /**
 * 导出检验失败数据
 * @param data
 */
  function exportCheck(data) {
    return request({
        url:'/certificate/exportCheck',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}

export {
    getList,
    getExportTaskList,
    getImportTaskList,
    exportConfigurator,
    importConfigurator,
    deleteImportTask,
    deleteExportTask,
    exportByVin,
    exportCheck
}