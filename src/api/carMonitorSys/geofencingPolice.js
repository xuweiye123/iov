import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getPagelist(data) {
  return request({
    url: '/geofenceAlarm/getAlarmRecordPageList',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
function exportCar(data) {
  return request({
    url: '/geofenceAlarm/exportAlarmRecord',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getPagelist,
  exportCar
}
