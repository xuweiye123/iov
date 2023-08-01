import request from '@/utils/request'
// 获取待配置,待检查和待转发
function getStatisticsCount() {
  return request({
    method: 'GET',
    url: 'home/getStatisticsCount'
  })
}
// 获取地方平台转发车辆
function getForwardCar() {
  return request({
    method: 'GET',
    url: 'home/getForwardCar'
  })
}

// 获取转发第三方当日流量
function getStatisticsFlow() {
  return request({
    method: 'GET',
    url: 'home/getStatisticsFlow'
  })
}

export {
  getStatisticsCount,
  getForwardCar,
  getStatisticsFlow,
}
