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
function getStaCar() {
  return request({
    method: 'GET',
    url: '/desktop/getStaCar',
  })
}
// 获取总体数据
function getStaTotal() {
  return request({
		method: "GET",
		url: "/desktop/getStaTotal",
	});
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
function getStaFault(params) {
  return request({
    method: 'GET',
    url: '/desktop/getStaFault',
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
function getStaCharge(params) {
  return request({
    method: 'GET',
    url: '/desktop/getStaCharge',
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
// 首页6个echarts请求合并
function getHomePage() {
  return request({
		method: "GET",
		url: "/desktop/getHomePage",
	});
}
export {
	getStatisticsCount,
	getForwardCar,
	getStatisticsFlow,
	getStaCar,
	getStaTotal,
	getStaPart,
	getStaPartPie,
	getStaFault,
	getStafaultcode,
	getStaCharge,
	getStarealfault,
	getNowNews,
	getHomePage,
	version,
};