import request from '@/utils/request'

/**
 * 获取任务
 * @param {*} data 
 */
function getTask(params){
  return request({
    url: '/batteryHistoryData/getTaskList',
    method: 'get',
    params
  })
}

/**
 * 添加任务
 * @param {*} data 
 */
function createTask(data){
  return request({
    url: '/batteryHistoryData/addTask',
    method: 'post',
    data
  })
}

/**
 * 删除任务
 * @param {*} data 
 */
function deleteTask(data){
  return request({
    url: '/batteryHistoryData/deleteTask',
    method: 'post',
    data
  })
}


/**
 * 选择电池编码
 * @param {*} data 
 */
function getBmsCode(params){
  return request({
    url: '/batteryHistoryData/getBmsCode',
    method: 'get',
    params
  })
}

/**
 * 获取任务详情
 */
function getTaskDetail(params){
  return request({
    url: '/batteryHistoryData/getTaskDetail',
    method: 'get',
    params
  })
}


export {
  getTask,
  createTask,
  deleteTask,
  getBmsCode,
  getTaskDetail,
}