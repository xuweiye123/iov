import request from '@/utils/request'
/**
 * 获取链路状态
 * @param {*} data
 */
 function getForwardLinkStatusService(data) {
  return request({
    url: 'forwardLinkStatus/getForwardLinkStatusService',
    method: 'post',
    data
  })
}

/**
 * 导出链路状态任务
 * @param {*} data
 */
 function exportForwardLinkStatusService(data) {
  return request({
    url: 'forwardLinkStatus/exportForwardLinkStatusService',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getForwardLinkStatusService,
  exportForwardLinkStatusService
}
