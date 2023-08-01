import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/carm407FaultTmp/selectBatteryAlarmList',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data
 */
function handleExports(data) {
  return request({
    url: '/carm407FaultTmp/exportRecod',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getPageList,
  handleExports,
}
