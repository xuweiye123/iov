import request from '@/utils/request'

/**
 * 获取单体电池信息
 * @param data
 */
function getCellList(data) {
    return request({
        url: '/batcell/list',
        method: 'post',
        data
    })
}

/**
 * 获取单体详细信息
 * @param id
 * @returns {AxiosPromise}
 */
function getCell(id) {
    return request({
        url: `/batcell/${id}`,
        method: 'post'
    })
}

/**
 * 导出单体电池
 * @param data
 * @returns {AxiosPromise}
 */
function exportCell(data) {
    return request({
        url: '/batcell/export',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

/**
 * 导入单体电池
 * @param data
 * @returns {AxiosPromise}
 */
function importCell(data) {
    return request({
        url: '/batcell/import',
        method: 'post',
        data
    })
}

/**
 * 导出错误信息
 * @param {*} data 
 */
function exportCheck(data) {
    return request({
        url: '/batcell/exportCheck',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}

export {
    getCellList,
    getCell,
    exportCell,
    importCell,
    exportCheck,
}