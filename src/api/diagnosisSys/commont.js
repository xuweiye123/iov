import request from '@/utils/request'

/**
 * 获取角色列表
 */
function getRoleList(){
  return request({
    url: '/common/getRoleList',
    method: 'get'
  })
}
/**
 * 获取公司列表
 */
function getCompanyList(){
  return request({
    url: '/common/getCompanyList',
    method: 'get'
  })
}

/**
 * 获取部门列表
 * @param {*} params 
 */
function getDepartmentList(params){
  return request({
    url: 'common/getDepartmentList',
    method: 'get',
    params
  })
}
/**
 * 获取岗位列表
 * @param {*} params 
 */
function getStationList(params){
  return request({
    url: 'common/getStationList',
    method: 'get',
    params
  })
}
/**
 * 获取页面按钮权限
 * @param {*} params 
 */
function getPageButton(params){
  return request({
    url: 'home/getPageButton',
    method: 'get',
    params
  })
}

/**
 * 
 * @param {获取ECU列表} data 
 */
function getECUList(data){
  return request({
      url: 'common/getEcuList',
      method: 'POST',
      data
  })
}

function getECUList2(data){
  return request({
      url: 'subsystem/getSubSystemEcuList',
      method: 'POST',
      data
  })
}

/**
 * 获取车型名称
 */
function getCarTypeList(){
  return request({
    url: 'common/getCarTypeList',
    method: 'get'
  })
}

/**
 * 获取平台支持车型
 */
function getSupportCarTypeList(){
  return request({
    url: 'common/getSupportCarTypeList',
    method: 'get'
  })
}

/**
 * 获取分系统列表
 */
function getSubSystemList(data){
  return request({
    url: 'common/getSubSystemList',
    method: 'post',
    data
  })
}

/**
 * 自定义配置导出Excel
 */
function exportExcel(data){
  return request({
    url: 'common/exportExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 获取项目代号列表
 */
function getBachCodeList(params){
  return request({
    url: '/common/getBachCodeList',
    method: 'get',
    params
  })
}
/**
 * 
 * @param {获取车辆列表} data 
 */
function getCarList(data){
  return request({
      url: 'common/getCurrentUserCarList',
      method: 'POST',
      data
  })
}

export {
  getRoleList,
  getCompanyList,
  getDepartmentList,
  getStationList,
  getPageButton,
  getECUList,
  getECUList2,
  getCarTypeList,
  getSubSystemList,
  getSupportCarTypeList,
  exportExcel,
  getBachCodeList,
  getCarList
}