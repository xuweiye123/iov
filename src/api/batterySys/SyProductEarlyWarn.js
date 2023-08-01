import request from '@/utils/request'

/**
 * 获取生产信息预警列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/earlywarn/product/list',
        method:'post',
        data
    })
}

/**
 * 导出生产信息预警列表
 * @param data
 * @returns {AxiosPromise}
 */
function exportProductEarlyWarn(data) {
    return request({
        url:'/earlywarn/product/export',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}

/**
 * 根据多个vin码批量导出生产信息预警
 * @param data
 */
 function exportByProductVin(data) {
    return request({
        url:'/earlywarn/exportByProductVin',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}

export {
    getList,
    exportProductEarlyWarn,
    exportByProductVin
}