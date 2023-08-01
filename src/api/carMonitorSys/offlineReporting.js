import request from '@/utils/request'
/**
 * 获取列表
 * @param {*} data
 */
function getpagelist(data) {
  return request({
    url: '/onlineCarNum/selectTaskInfoPageList',
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
    url: '/onlineCarNum/createTask',
    method: 'post',
    data
  })
}

/**
 * 启用禁用
 * @param {*} params
 */
function isDisableHandle(data) {
  return request({
    url: '/onlineCarNum/isDisable',
    method: 'post',
    data
  })
}


/**
 * 查看任务车辆信息
 * @param {*} data
 */
function selectCarInfoPageList(data) {
  return request({
    url: '/onlineCarNum/selectCarInfoPageList',
    method: 'post',
    data
  })
}

/**
 * 查看任务详情
 * @param {*} data
 */
function selectTaskDetailsPageList(data) {
  return request({
    url: '/onlineCarNum/selectTaskDetailsPageList',
    method: 'post',
    data
  })
}

export {
  getpagelist,
  addHandle,
  isDisableHandle,
  selectCarInfoPageList,
  selectTaskDetailsPageList
}
