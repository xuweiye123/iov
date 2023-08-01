import request from '@/utils/request'

/**
 * 新增离线诊断配置
 * @param {*} data 
 */
function createConfig(data){
    return request({
        url: 'offlineConfig/createConfig',
        method: 'post',
        data
    })
}
/**
 * 编辑离线诊断配置
 * @param {*} data 
 */
function updateConfig(data){
    return request({
        url: 'offlineConfig/updateConfig',
        method: 'put',
        data
    })
}
/**
 * 删除离线诊断配置
 * @param {*} data 
 */
function deleteConfig(data){
    return request({
        url: 'offlineConfig/deleteConfig',
        method: 'delete',
        data
    })
}
/**
 * 获取离线诊断配置列表
 * @param {*} data 
 */
function getConfigList(data){
    return request({
        url: 'offlineConfig/getConfigList',
        method: 'post',
        data
    })
}
/**
 * 获取诊断配置服务列表
 * @param {*} data 
 */
function getConfigServiceList(data){
    return request({
        url: 'offlineConfig/getConfigServiceList',
        method: 'post',
        data
    })
}
/**
 * 导出离线诊断配置
 * @param {*} data 
 */
function exportConfig(data){
    return request({
        url: 'offlineConfig/exportConfig',
        method: 'post',
        responseType: 'arraybuffer',
        data
    })
}
export {
    createConfig,
    updateConfig,
    deleteConfig,
    getConfigList,
    getConfigServiceList,
    exportConfig
}