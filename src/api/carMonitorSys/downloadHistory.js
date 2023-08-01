import request from '@/utils/request'

/**
 * 获取任务
 * @param {*} data 
 */
function getTask(data){
  return request({
    url: '/historyData/getTask',
    method: 'post',
    data
  })
}

/**
 * 添加任务
 * @param {*} data 
 */
function createTask(data){
  return request({
    url: '/historyData/createTask',
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
    url: '/historyData/deleteTask',
    method: 'delete',
    data
  })
}

/**
 * 设置任务
 * @param {*} data 
 */
function setTask(data){
  return request({
    url: '/historyData/setTask',
    method: 'post',
    data
  })
}


/**
 * 选择车辆
 * @param {*} data 
 */
function getChooseCar(data){
  return request({
    url: '/historyData/getChooseCar',
    method: 'post',
    data
  })
}

/**
 * 选择参数
 */
function getChooseDbcVariables(data){
  return request({
    url: '/historyData/getChooseDbcVariables',
    method: 'post',
    data
  })
}


/**
 * 获取任务详情
 */
function getTaskDetail(data){
  return request({
    url: '/historyData/getTaskDetail',
    method: 'post',
    data
  })
}

/**
 * 打包
 */
function setTaskPack(data){
  return request({
    url: '/historyData/setTaskPack',
    method: 'post',
    data
  })
}


export {
  getTask,
  createTask,
  deleteTask,
  setTask,
  getChooseCar,
  getChooseDbcVariables,
  getTaskDetail,
  setTaskPack
}
