import request from '@/utils/request'

function getTargetFlowStatistics(data) {
  return request({
    url: '/flowStatistic/getTargetFlowStatistics',
    method: 'post',
    data
  })
}
function getLinkFlowStatistics(data) {
  return request({
    url: '/flowStatistic/getLinkFlowStatistics',
    method: 'post',
    data
  })
}
function exTargetFlowStatistics(data) {
  return request({
    url: '/flowStatistic/exTargetFlowStatistics',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getTargetFlowStatistics,
  exTargetFlowStatistics,
  getLinkFlowStatistics
}
