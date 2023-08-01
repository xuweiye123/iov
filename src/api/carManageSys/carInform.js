import request from '@/utils/request'
/**
 * 获取车辆
 * @param {*} data
 */
function getCarPageList(params) {
  return request({
    url: '/car/getCarPageList',
    method: 'get',
    params
  })
}

/**
 * 获取导入查询任务
 * @param {*} data
 */
 function getCarInfoTasks(data) {
  return request({
    url: '/car/getCarInfoTasks',
    method: 'post',
    data
  })
}

/**
 * 车辆信息导入查询
 * @param {*} data
 */
 function importCarInfo(data) {
  return request({
    url: '/car/importCarInfo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
  },
    data
  })
}


/**
 * 新增车辆
 * @param {*} data
 */
function createCar(data) {
  return request({
    url: '/car/createCar',
    method: 'post',
    data
  })
}

/**
 * 编辑车辆
 * @param {*} data
 */
function updateCar(data) {
  return request({
    url: '/car/updateCar',
    method: 'put',
    data
  })
}

/**
 * 删除车辆
 * @param {*} data
 */
function deleteCar(data) {
  return request({
    url: '/car/deleteCar',
    method: 'delete',
    data
  })
}

/**
 * 获取车型
 */
function getCarTypeInfo() {
  return request({
    url: '/car/getCarTypeInfo',
    method: 'get'
  })
}
/**
 * 获取项目代号
 * @param {*} params
 */
function getBatchCodeInfo(params) {
  return request({
    url: '/car/getBatchCodeInfo',
    method: 'get',
    params
  })
}

/**
 * 获取车辆绑定终端
 */
function getCarToTerminal(data) {
  return request({
    url: '/car/getCarToTerminal',
    method: 'post',
    data
  })
}
/**
 * 获取产品型号
 */
function getProductInfo() {
  return request({
    url: '/car/getProductInfo',
    method: 'get'
  })
}
/**
 * 查看绑定终端历史
 */
function getCarHistory(data) {
  return request({
    url: '/car/getCarTerminalHistory',
    method: 'post',
    data
  })
}
/**
 * 新能源更换终端
 * @param {*} data
 */
function changeTerminal(data) {
  return request({
    url: '/car/changeTerminal',
    method: 'post',
    data
  })
}

/**
 * 导出车辆
 * @param {*} data
 */
function exportCar(data) {
  return request({
    url: '/car/exportCar',
    method: 'post',
    data
  })
}

/**
 * 导出车辆失败信息
 * @param {*} data
 */
function exportCheckCar(data) {
  return request({
    url: '/car/exportCheckCar',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 获取使用单位
 */
function getContactId() {
  return request({
    url: '/car/getCompanyInfo',
    method: 'get',
  })
}
/**
 * 下载导入结果
 * @param {*} data
 */
function downloadExcel(data) {
  return request({
    url: '/car/exportCarToExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 详情-获取终端/车机SIM信息
 */
 function getTerminalSim(data) {
  return request({
    url: '/car/getTerminalSim',
    method: 'post',
    data
  })
}

/**
 * 详情-获取部分字段
 */
 function getCarDetails(params) {
  return request({
    url: '/car/getCarDetails',
    method: 'get',
    params
  })
}

export {
  getCarPageList,
  createCar,
  updateCar,
  deleteCar,
  getCarTypeInfo,
  getBatchCodeInfo,
  getCarToTerminal,
  getProductInfo,
  getCarHistory,
  changeTerminal,
  exportCar,
  exportCheckCar,
  getContactId,
  downloadExcel,
  getCarInfoTasks,
  importCarInfo,
  getTerminalSim,
  getCarDetails
}
