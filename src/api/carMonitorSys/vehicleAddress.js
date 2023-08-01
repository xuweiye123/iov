import request from '@/utils/request'
/**
 * 获取列表
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/carAddress/list',
    method: 'post',
    data
  })
}

/**
 * 新增
 * @param {*} params
 */
function addHandle(data) {
  return request({
    url: '/carAddress/createTask',
    method: 'post',
    data
  })
}


/**
 * 删除
 * @param {*} data
 */
function deleteTask(data) {
  return request({
    url: '/carAddress/deleteTask',
    method: 'delete',
    data
  })
}


export {
  getPageList,
  addHandle,
  deleteTask
}
