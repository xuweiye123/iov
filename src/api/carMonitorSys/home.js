import request from '@/utils/request'

/**
 * 版本号
 * @param {*} data 
 */
 function version(){
    return request({
        url: '/common/version',
        method: 'get',
    })
}
// 获取待配置,待检查和待转发
function getStatisticsCount() {
  return request({
    method: 'GET',
    url: '/home/getStatisticsCount'
  })
}
// 获取地方平台转发车辆
function getForwardCar() {
  return request({
    method: 'GET',
    url: '/home/getForwardCar'
  })
}

// 获取转发第三方当日流量
function getStatisticsFlow() {
  return request({
    method: 'GET',
    url: '/home/getStatisticsFlow'
  })
}

// 获取省份数据
function getstacar() {
  return request({
    method: 'GET',
    url: '/desktop/getstacar'
  })
}
// 获取总体数据
function getstatital() {
  return request({
    method: 'GET',
    url: '/desktop/getstatital'
  })
}
// 零部件故障统计
function getStaPart() {
  return request({
    method: 'GET',
    url: '/desktop/getStaPart'
  })
}
// 故障等级占比
function getStaPartPie() {
  return request({
    method: 'GET',
    url: '/desktop/getStaPartPie'
  })
}
// 故障车辆TOP5
function getStafault(params) {
  return request({
    method: 'GET',
    url: '/desktop/getStafault',
    params
  })
}
// 故障码TOP5
function getStafaultcode() {
  return request({
    method: 'GET',
    url: '/desktop/getStafaultcode'
  })
}
// 充电情况分布
function getStacharge(params) {
  return request({
    method: 'GET',
    url: '/desktop/getStacharge',
    params
  })
}
// 实时故障趋势
function getStarealfault() {
  return request({
    method: 'GET',
    url: '/desktop/getStarealfault'
  })
}
// 公告
function getNowNews() {
  return request({
    method: 'GET',
    url: '/news/getNowNews'
  })
}
export {
  getStatisticsCount,
  getForwardCar,
  getStatisticsFlow,
  getstacar,
  getstatital,
  getStaPart,
  getStaPartPie,
  getStafault,
  getStafaultcode,
  getStacharge,
  getStarealfault,
  getNowNews,
  version
}