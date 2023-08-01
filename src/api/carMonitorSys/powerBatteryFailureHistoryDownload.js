import request from '@/utils/request'

/**
 * 获取任务
 * @param {*} data 
 */
function getTask(data){
  return request({
		// url: "/fault/batteryFaultDown/getBatterFaultDownList",
		url: "/batteryFaultDown/getBatterFaultDownList",
		method: "post",
		data,
	});
}

/**
 * 添加任务
 * @param {*} data 
 */
function createTask(data){
  return request({
		// url: "/fault/batteryFaultDown/addTask",
		url: "/batteryFaultDown/addTask",
		method: "post",
		data,
	});
}


/**
 * 选择电池编码
 * @param {*} data 
 */
function getBmsCode(data){
  return request({
		// url: "/fault/batteryFaultDown/getBmsCodeList",
		url: "/batteryFaultDown/getBmsCodeList",
		method: "post",
		data,
	});
}

/**
 * 选择故障码
 * @param {*} data 
 */
function getFaultCode(data){
  return request({
		// url: "/fault/batteryFaultDown/getFaultCodeList",
		url: "/batteryFaultDown/getFaultCodeList",
		method: "post",
		data,
	});
}


/**
 * 获取任务详情
 */
function getTaskDetail(data){
  return request({
		// url: "/fault/batteryFaultDown/getDataFaultDetailList",
		url: "/batteryFaultDown/getDataFaultDetailList",
		method: "post",
		data,
	});
}


export {
  getTask,
  createTask,
  getBmsCode,
  getTaskDetail,
  getFaultCode
}