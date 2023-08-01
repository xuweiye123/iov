import request from '@/utils/request'
/**
 * 获取分系统
 * @param {*} data 
 */
function getSubsystem(data){
    return request({
        url: 'subsystem/getSubsystem',
        method: 'POST',
        data
    })
}
/**
 * 编辑分系统
 * @param {*} data 
 */
function updateSubsystem(data){
    return request({
        url: 'subsystem/updateSubsystem',
        method: 'PUT',
        data
    })
}
/**
 * 新增分系统
 * @param {*} data 
 */
function createSubsystem(data){
    return request({
        url: 'subsystem/createSubsystem',
        method: 'POST',
        data
    })
}
/**
 * 删除分系统
 * @param {*} data 
 */
function deleteSubsystem(data){
    return request({
        url: 'subsystem/deleteSubsystem',
        method: 'DELETE',
        data
    })
}
/**
 * 以模板添加分系统
 * @param {*} data 
 */
function createByTemplate(data){
    return request({
        url: '/subsystem/createByTemplate',
        method: 'POST',
        data
    })
}

export {
    getSubsystem,
    updateSubsystem,
    createSubsystem,
    deleteSubsystem,
    createByTemplate
}