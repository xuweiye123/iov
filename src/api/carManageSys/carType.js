import request from '@/utils/request'

/**
 * 获取车型
 * @param {*} data 
 */
function getCarGroup(params){
  return request({
    url: '/carType/getCarTypeList',
    method: 'get',
    params
  })
}
/**
 * 添加车型
 * @param {*} data 
 */
function createCarGroup(data){
  return request({
    url: '/carType/createCarType',
    method: 'post',
    data
  })
}
/**
 * 编辑车辆
 * @param {*} data 
 */
function updateCarGroup(data){
  return request({
    url: '/carType/updateCarType',
    method: 'put',
    data
  })
}

/**
 * 删除车型
 * @param {*} params 
 */
function deteleCarGroup(data){
  return request({
    url: '/carType/deleteCarType',
    method: 'delete',
    data
  })
}
/**
 * 审核车型
 * @param {*} data 
 */
function approvalCarGroup(data){
  return request({
    url: '/carType/approvalType',
    method: 'post',
    data
  })
}
/**
 * 导出车型
 * @param {*} data 
 */
function exportCarGroup(data){
  return request({
    url: '/carType/exportCarType',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getCarGroup,
  createCarGroup,
  updateCarGroup,
  deteleCarGroup,
  approvalCarGroup,
  exportCarGroup
}