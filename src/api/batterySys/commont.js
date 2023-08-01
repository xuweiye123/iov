import request from '@/utils/request'

/**
 * 获取车型名称列表
 */
function getCarTypeList() {
  return request({
    url: '/common/getCarTypeList',
    method: 'get'
  })
}
/**
 * 获取区列表
 */
function getDistinctList(params) {
  return request({
    url: '/common/getDistinctList',
    method: 'get',
    params
  })
}




/**
 * 获取页面按钮权限
 * @param {*} params
 */
function getPageButton(params) {
  return request({
    url: '/menu/getmenubtns',
    method: 'get',
    params
  })
}

/**
 * 获取菜单
 */
function getMenu() {
  return request({
    url: 'common/getMenu',
    method: 'get'
  })
}
/**
 * 获取公司列表
 */
function getCompanyList() {
  return request({
    url: 'common/getCompanyList',
    method: 'get'
  })
}
/**
 * 根据公司id获取部门列表
 * @param {*} params
 */
function getDepartmentList(params) {
  return request({
    url: 'common/getDepartmentList',
    method: 'get',
    params
  })
}
/**
 *   根据部门id获取岗位列表
 * @param {*} params
 */
function getStationList(params) {
  return request({
    url: 'common/getStationList',
    method: 'get',
    params
  })
}



/**
 * 逆地理编码
 */
function getReGeoCode(params) {
  return request({
    url: '/common/getReGeoCode',
    method: 'get',
    params
  })
}


/**
 * 获取下拉框分页车辆
 * @param {*} params
 */
function getComboxCarPageList(data) {
  return request({
    url: '/common/getComboxCarPageList',
    method: 'post',
    data
  })
}



/**
 * 获取下拉框司机列表
 * @param {*} params
 */
function getDriversList(params) {
  return request({
    url: '/common/drivers',
    method: 'get',
    params
  })
}

/**
 * 获取下拉框司机列表
 * @param {*} params
 */
function getUserList(params) {
  return request({
    url: '/common/staffs',
    method: 'get',
    params
  })
}
/**
 * 获取区域
 */
function getArea(){
  return request({
    url: '/common/area',
    method: 'get'
  })
}

/**
 * 获取车型
 */
function getModel() {
  return request({
    url: '/common/model',
    method: 'get'
  })
}
/**
 * APP用户手机号检索
 */
function getMobileList(params) {
  return request({
    url: '/appUser/mobile',
    method: 'get',
    params
  })
}

/**
 * 导出VIN失败数据
 * @param {*} data 
 */
 function exportCarCheck(data){
  return request({
      url:'/checkcommon/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}

/**
 * 根据VIN批量导出
 * @param {*} data 
 */
 function exportByVin(data){
  return request({
      url:'/checkcommon/exportByVin',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
export {
  getCarTypeList,
  getDistinctList,
  getCompanyList,
  getDepartmentList,
  getStationList,
  getMenu,
  getPageButton,
  getReGeoCode,
  getComboxCarPageList,
  getDriversList,
  getUserList,
  getArea,
  getModel,
  getMobileList,
  exportCarCheck,
  exportByVin
}
