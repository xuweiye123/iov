import request from '@/utils/request'

/**
 * 获取电池信息预警列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/earlywarn/list',
        method:'post',
        data
    })
}

/**
 * 导出电池信息预警列表
 * @param data
 * @returns {AxiosPromise}
 */
function exportBatEarlyWarn(data) {
    return request({
        url:'/earlywarn/export',
        method:'post',
        data
    })
}

  /**
 * 根据多个vin码批量导出电池信息预警
 * @param data
 */
 function exportByVin(data) {
    return request({
        url:'/earlywarn/exportByVin',
        method:'post',
        responseType:'arraybuffer',
        data
    })
}

export {
    getList,
    exportBatEarlyWarn,
    exportByVin
}