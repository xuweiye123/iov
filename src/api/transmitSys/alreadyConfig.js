import request from '@/utils/request'

/**
 * 获取已检查任务
 * @param {*} data
 */
function getAlreadyCheckTask(data) {
  return request({
    url: 'dbcTask/getAlreadyCheckTask',
    method: 'post',
    data
  })
}

/**
 * 导出已检查任务
 * @param {*} data
 */
function exportAlreadyCheckTask(data) {
  return request({
    url: '/dbcTask/exportAlreadyCheckTask',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 导出链路状态任务
 * @param {*} data
 */
 function exportLinkTask(data) {
  return request({
    url: '/forwardLinkStatus/exportForwardLinkStatusService',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getAlreadyCheckTask,
  exportAlreadyCheckTask,
  exportLinkTask,
}
