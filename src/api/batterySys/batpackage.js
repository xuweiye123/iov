import request from '@/utils/request'

/**
 * 获取电池包列表
 * @param data
 * @returns {AxiosPromise}
 */
function getCellPackList(data) {
    return request({
        url:'/batpackage/list',
        method:'post',
        data
    })
}

/**
 * 查看电池包详细信息
 * @param id
 * @returns {*}
 */
function getCellPack(id) {
    return request({
        url:`/batpackage/${id}`,
        method:'post'
    })
}

/**
 * 导出电池列表
 * @param data
 * @returns {AxiosPromise}
 */
function exportCellPack(data) {
    return request({
        url:'/batpackage/export',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}

/**
 * 查看模块厂商规格信息
 * @param data
 * @returns {AxiosPromise}
 */
function getSpecification(data) {
    return request({
        url:'/batpackage/modelbind',
        method:'post',
        data
    })
}

/**
 * 导入电池包列表
 * @param data
 */
function importCellPack(data) {
    return request({
        url:'/batpackage/import',
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
        url:'/batpackage/exportCheck',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
export {
    getCellPackList,
    getCellPack,
    exportCellPack,
    getSpecification,
    importCellPack,
    exportCheck
}