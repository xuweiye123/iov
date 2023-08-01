import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getList(params) {
  return request({
    url: '/interface/getInterfaceList',
    method: 'get',
    params
  })
}

/**
 * 新增
 * @param {*} data
 */
function create(data) {
  return request({
    url: '/interface/create',
    method: 'post',
    data
  })
}
/**
 * 编辑
 * @param {*} data
 */
function update(data) {
  return request({
    url: '/interface/update',
    method: 'put',
    data
  })
}

/**
 * 删除
 * @param {*} params
 */
function deleteInterface(data) {
  return request({
    url: '/interface/delete',
    method: 'delete',
    data
  })
}

/**
 * 启用接口
 * @param {*} data 
 * @returns 
 */
 function enableInterface(data){
  return request({
    url: `/interface/enable`,
    method:'post',
    data
  })
}

/**
 * 禁用接口
 * @param {*} data 
 * @returns 
 */
function disableInterface(data){
  return request({
    // url:`/user/disable/${data.userId}`,
    url:`/interface/disabled`,
    method:'post',
    data
  })
}


export {
  getList,
  create,
  update,
  deleteInterface,
  enableInterface,
  disableInterface
}
