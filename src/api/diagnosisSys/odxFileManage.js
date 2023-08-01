import request from '@/utils/request'
/**
 * ODX文件解析
 * @param {*} data 
 */
function odxAnalysis(data){
    return request({
        url: 'odx/odxAnalysis',
        method: 'POST',
        data
    })
}
/**
 * 获取ODX文件列表
 * @param {*} data 
 */
function getOdxList(data){
    return request({
        url: 'odx/getOdxList',
        method: 'POST',
        data
    })
}
/**
 * 创建ODX文件数据
 * @param {*} data 
 */
function createOdxData(data){
    return request({
        url: 'odx/createOdxData',
        method: 'post',
        data
    })
}
/**
 * 更新ODX文件信息
 * @param {*} data 
 */
function updateOdxData(data){
    return request({
        url: 'odx/updateOdxData',
        method: 'POST',
        data
    })
}
/**
 * 获取ODX文件数据
 * @param {*} data 
 */
function getOdxData(params){
    return request({
        url: 'odx/getOdxData',
        method: 'GET',
        params
    })
}
/**
 * 删除ODX文件信息
 * @param {*} data 
 */
function deleteOdxData(data){
    return request({
        url: 'odx/deleteOdxData',
        method: 'delete',
        data
    })
}

export {
    odxAnalysis,
    getOdxList,
    createOdxData,
    updateOdxData,
    getOdxData,
    deleteOdxData
}