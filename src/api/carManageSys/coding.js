import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getEquipmentPageList(params) {
  return request({
    url: '/equipment/getEquipmentList',
    method: 'get',
    params
  })
}

/**
 * 导出
 * @param {*} data
 */
function exportEquipmentNew(data) {
  return request({
    url: '/equipment/exportTask',
    method: 'post',
    data
  })
}


/**
 * 电池电机编码记录查询
 * @param {*} data
 */
function getBatteryCodeRecordList(params) {
  return request({
    url: '/bmsCodeChange/selectBatteryCodeRecordList',
    method: 'get',
    params
  })
}

/**
 * 导出
 * @param {*} data
 */
function exportBmscodechange(data) {
  return request({
    url: '/bmsCodeChange/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getEquipmentPageList,
  exportEquipmentNew,
  getBatteryCodeRecordList,
  exportBmscodechange
}
