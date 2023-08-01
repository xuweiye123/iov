import request from '@/utils/request'
/**
 * 在线诊断操作数据列表
 * @param {*} data 
 */
function getList(data) {
    return request({
      url: '/onlineDiagonsisReport/getDiagonsisList',
      method: 'post',
      data
    })
  }

/**
 * 导出在线诊断操作数据列表
 * @param {*} data 
 */
function exportDiagonsis(data) {
  return request({
    url: '/onlineDiagonsisReport/exportDiagonsis',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 获取分系统
 * @param {*} data 
 */
function getSystem(data) {
  return request({
    url: '/failureReason/getSystemList',
    method: 'post',
    data
  })
}

/**
 * 获取车型
 * @param {*} data 
 */
function getCarmoel(data) {
  return request({
    url: '/failureReason/getCarModelList',
    method: 'post',
    data
  })
}

/**
 * 获取失败原因
 * @param {*} data 
 */
function getError(data) {
  return request({
    url: '/failureReason/getErrorList',
    method: 'post',
    data
  })
}
/**
 * 导出失败原因
 * @param {*} data 
 */
function exporterror(data) {
  return request({
    url: '/failureReason/exportError',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 车型诊断统计
 * @param {*} data 
 */
function getCarModelList(data) {
  return request({
    url: '/vehicleTypeDiagnosis/getCarModelList',
    method: 'post',
    data
  })
}


/**
 * 导出车型诊断统计
 * @param {*} data 
 */
function exportCarModel(data) {
  return request({
    url: '/vehicleTypeDiagnosis/exportCarModel',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 车型诊断统计
 * @param {*} data 
 */
function getEcuList(data) {
  return request({
    url: '/report/getEcuList',
    method: 'post',
    data
  })
}
/**
 * 导出车型诊断统计
 * @param {*} data 
 */
function exportEcu(data) {
  return request({
    url: '/report/exportEcu',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 车辆在线诊断统计
 * @param {*} data 
 */
function getOnlineCarList(data) {
  return request({
    url: '/VehicleOnlineDiagnosis/getOnlineCarList',
    method: 'post',
    data
  })
}
/**
 * 导出车辆在线诊断统计
 * @param {*} data 
 */
function exportOnlineCar(data) {
  return request({
    url: '/VehicleOnlineDiagnosis/exportOnlineCar',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 故障码频率统计
 * @param {*} data 
 */
function getFaultRateList(data) {
  return request({
    url: '/faultRate/getFaultRateList',
    method: 'post',
    data
  })
}
/**
 * 导出车型诊断统计
 * @param {*} data 
 */
function exportFaultRate(data) {
  return request({
    url: '/report/exportFaultRate',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 车型诊断统计
 * @param {*} data 
 */
function getFaultMonitorList(data) {
  return request({
    url: '/report/getFaultMonitorList',
    method: 'post',
    data
  })
}
/**
 * 导出车型诊断统计
 * @param {*} data 
 */
function exportFaultMonitor(data) {
  return request({
    url: '/report/exportFaultMonitor',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 基础控制器信息
 * @param {*} data 
 */
function getBaseControllerInfoList(data) {
  return request({
    url: '/report/getBaseControllerInfoList',
    method: 'post',
    data
  })
}
/**
 * 基础控制器信息
 * @param {*} data 
 */
function getSbuTaskList(data) {
  return request({
    url: '/report/getSbuTaskList',
    method: 'post',
    data
  })
}
/**
 * 基础控制器信息
 * @param {*} data 
 */
function getDataInfoList(data) {
  return request({
    url: '/report/getDataInfoList',
    method: 'post',
    data
  })
}
/**
 * 导出基础信息
 * @param {*} data 
 */
function exportDataInfo(data) {
  return request({
    url: '/report/exportDataInfo',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 添加任务
 * @param {*} data 
 */
function InserTaskInfo(data) {
  return request({
    url: '/report/InserTaskInfo',
    method: 'post',
    data
  })
}
/**
 * del任务
 * @param {*} data 
 */
function delTask(data) {
  return request({
    url: '/report/delTask',
    method: 'post',
    data
  })
}
/**
 * 下载VIN模板文件
 */
function downloadTemplate(){
  return request({
    url: '/report/downloadTemplate',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
/**
 * 下载VIN模板文件
 */
function downloadTemplate_base(){
  return request({
    url: '/report/downloadTemplate_base',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
export {
    getList,
    getSystem,
    getCarmoel,
    getError,
    exporterror,
    exportDiagonsis,
    getCarModelList,
    exportCarModel,
    getEcuList,
    exportEcu,
    getOnlineCarList,
    exportOnlineCar,
    getFaultRateList,
    exportFaultRate,
    getFaultMonitorList,
    exportFaultMonitor,
    downloadTemplate,
    getBaseControllerInfoList,
    InserTaskInfo,
    delTask,
    downloadTemplate_base,
    getSbuTaskList,
    getDataInfoList,
    exportDataInfo
}
