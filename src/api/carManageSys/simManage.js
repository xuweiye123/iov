import request from '@/utils/request'
/**
 * 获取SIM卡
 * @param {*} data 
 */
function getSim(data){
  return request({
    url: '/sim/getSimList',
    method: 'post',
    data
  })
}

/**
 * 新增SIM卡
 * @param {*} data 
 */
function createSim(data){
  return request({
    url: '/sim/createSim',
    method: 'post',
    data
  })
}
/**
 * 编辑SIM卡
 * @param {*} data 
 */
function updateSim(data){
  return request({
    url: '/sim/updateSim',
    method: 'put',
    data
  })
}

/**
 * 删除SIM卡
 * @param {*} params 
 */
function deleteSim(data){
  return request({
    url: '/sim/deleteSim',
    method: 'delete',
    data
  })
}

/**
 * 流量查询
 * @param {*} params 
 */
function getDevice(params){
  return request({
    url: '/sim/getDevice',
    method: 'get',
    params
  })
}
/**
 * 导出SIM卡
 * @param {*} data 
 */
function exportSim(data){
  return request({
    url: '/sim/exportSim',
    method: 'post',
    data
  })
}
// /**
//  * 导出记录
//  * @param {*} data 
//  */
// function getexportDataPageList(data){
//   return request({
//     url: '/sim/getTaskRecordPageList',
//     method: 'post',
//     data
//   })
// }
// /**
//  * 删除导出记录
//  * @param {*} params 
//  */
// function deleteExportData(data){
//   return request({
//     url: '/sim/deleteSim',
//     method: 'delete',
//     data
//   })
// }

/**
 * 导出失败信息
 * @param {*} data 
 */
function exportCheckSim(data) {
  return request({
    url: '/sim/exportCheckSim',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
} 
export {
  getSim,
  createSim,
  updateSim,
  deleteSim,
  getDevice,
  exportSim,
  exportCheckSim,
  // getexportDataPageList,
  // deleteExportData
}