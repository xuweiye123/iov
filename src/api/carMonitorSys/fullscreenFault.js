import request from '@/utils/request'

/**
 * 获取故障总数
 * @param {*} data 
 */
function getFaultCountSummary(){
  return request({
		// url: "/fault/mapfault/getFaultCountSummary",
		url: "/mapfault/getFaultCountSummary",
		method: "get",
	});
}

/**
 * 获取三级故障信息
 * @param {*} data 
 */
function get3LevelFaultPageList(params){
  return request({
		// url: "/fault/mapfault/get3LevelFaultPageList",
		url: "/mapfault/get3LevelFaultPageList",
		method: "get",
		params,
	});
}

/**
 * 获取故障列表信息
 * @param {*} data 
 */
function getFaultPageList(params){
  return request({
		// url: "/fault/mapfault/getFaultPageList",
		url: "/mapfault/getFaultPageList",
		method: "get",
		params,
	});
}

/**
 * 获取单车故障数据
 * @param {*} params 
 */
function getFaultCarInfo(params){
  return request({
		// url: "/fault/mapfault/getFaultCarInfo",
		url: "/mapfault/getFaultCarInfo",
		method: "get",
		params,
	});
}

/**
 * 城市故障车辆统计
 * @param {*} data 
 */
function getCityFaultCarCountList(params){
  return request({
		// url: "/fault/mapfault/getCityFaultCarCountList",
		url: "/mapfault/getCityFaultCarCountList",
		method: "get",
		params,
	});
}

/**
 * 车型故障车辆统计
 * @param {*} data 
 */
function getCarTypeFaultCountList(params){
  return request({
		// url: "/fault/mapfault/getCarTypeFaultCountList",
		url: "/mapfault/getCarTypeFaultCountList",
		method: "get",
		params,
	});
}

/**
 * 获取故障车辆数据
 * @param {*} data 
 */
function getCar(params){
  return request({
		// url: "/fault/mapfault/getFaultCarPageList",
		url: "/mapfault/getFaultCarPageList",
		method: "get",
		params,
	});
}
/**
 * 故障处理
 * @param {*} data 
 */
function disposalFault(data){
  return request({
		// url: "/fault/mapfault/disposalFault",
		url: "/mapfault/disposalFault",
		method: "post",
		data,
	});
}

/**
 * 导出故障列表信息
 * @param {*} data 
 */
function exportFaultList(data){
  return request({
		// url: "/fault/mapfault/exportFaultList",
		url: "/mapfault/exportFaultList",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}


export {
  getFaultCountSummary,
  get3LevelFaultPageList,
  getFaultPageList,
  getFaultCarInfo,
  getCityFaultCarCountList,
  getCarTypeFaultCountList,
  getCar,
  disposalFault,
  exportFaultList
}