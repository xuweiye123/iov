import request from '@/utils/request'
//获取诊断统计数据
function getDigTotalData() {
  return request({
    method: 'GET',
    url: 'home/getDigTotalData'
  })
}
//获取诊断报表分析数据
function getDigAnalysisInfo(data) {
  return request({
    method: 'GET',
    url: 'home/getDigAnalysisData',
    data
  })
}
//获取诊断Top数据
function getDigTop() {
  return request({
    method: 'GET',
    url: 'home/getDigTopData'
  })
}
export {
  getDigTotalData,
  getDigAnalysisInfo,
  getDigTop,
}
