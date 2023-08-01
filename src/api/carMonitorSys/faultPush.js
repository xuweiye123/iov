import request from "@/utils/request";
/**
 * 获取列表
 * @param {*} data
 */
function getPageList(data) {
	return request({
		// url: "/fault/tmpFaultPush/getTaskList",
		url: "/tmpFaultPush/getTaskList",
		method: "post",
		data,
	});
}

/**
 * 新增
 * @param {*} params
 */
function addHandle(data) {
	return request({
		// url: "/fault/tmpFaultPush/create",
		url: "/tmpFaultPush/create",
		method: "post",
		data,
	});
}

/**
 * 编辑
 * @param {*} params
 */
function editHandle(data) {
	return request({
		// url: "/fault/tmpFaultPush/update",
		url: "/tmpFaultPush/update",
		method: "put",
		data,
	});
}

/**
 * 获取故障码列表
 * @param {*} data
 */
function getChooseFaultCode(data) {
	return request({
		// url: "/fault/tmpFaultPush/getFaultCodeCanSelect",
		url: "/tmpFaultPush/getFaultCodeCanSelect",
		method: "post",
		data,
	});
}

/**
 * 配置故障码和故障车辆
 * @param {*} data
 */
function setFaultCodeCar(data) {
	return request({
		// url: "/fault/faultDetail/create",
		url: "/faultDetail/create",
		method: "post",
		data,
	});
}

/**
 * 获取故障规则
 * @param {*} data
 */
function getChooseFaultRule(data) {
	return request({
		// url: "/fault/tmpFaultPush/getFaultRull",
		url: "/tmpFaultPush/getFaultRull",
		method: "post",
		data,
	});
}

/**
 * 配置故障码规则
 * @param {*} data
 */
function setFaultRule(data) {
	return request({
		// url: "/fault/faultRuleDetail/create",
		url: "/faultRuleDetail/create",
		method: "post",
		data,
	});
}

/**
 * 获取车辆
 * @param {*} data
 */
function getChooseFaultCar(data) {
	return request({
		// url: "/fault/tmpFaultPush/getCarCanSelect",
		url: "/tmpFaultPush/getCarCanSelect",
		method: "post",
		data,
	});
}

/**
 * 获取日志
 * @param {*} data
 */
function getSeePushLog(data) {
	return request({
		// url: "/fault/tmpFaultPush/getFaultPushLog",
		url: "/tmpFaultPush/getFaultPushLog",
		method: "post",
		data,
	});
}

/**
 * 导出
 * @param {*} data
 */
function exportLog(data) {
	return request({
		// url: "/fault/tmpFaultPush/exportFaultPushLog",
		url: "/tmpFaultPush/exportFaultPushLog",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 获取已选故障码列表
 * @param {*} data
 */
function getLookFaultCode(data) {
	return request({
		// url: "/fault/tmpFaultPush/getFaultCodeSelected",
		url: "/tmpFaultPush/getFaultCodeSelected",
		method: "post",
		data,
	});
}

/**
 * 删除已选故障码列表
 * @param {*} params
 */
function deleteFaultCode(data) {
	return request({
		// url: "/fault/faultDetail/deleteFaultCode",
		url: "/faultDetail/deleteFaultCode",
		method: "delete",
		data,
	});
}

/**
 * 获取已选故障规则列表
 * @param {*} data
 */
function getLookFaultRule(data) {
	return request({
		// url: "/fault/tmpFaultPush/getFaultSelectedRull",
		url: "/tmpFaultPush/getFaultSelectedRull",
		method: "post",
		data,
	});
}

/**
 * 删除已选故障规则列表
 * @param {*} params
 */
function deleteFaultRule(data) {
	return request({
		// url: "/fault/faultRuleDetail/delete",
		url: "/faultRuleDetail/delete",
		method: "delete",
		data,
	});
}

/**
 * 获取已选故障码车辆
 * @param {*} data
 */
function getlookFaultCar(data) {
	return request({
		// url: "/fault/tmpFaultPush/getCarSelected",
		url: "/tmpFaultPush/getCarSelected",
		method: "post",
		data,
	});
}

/**
 * 删除已选故障码车辆
 * @param {*} params
 */
function deleteFaultcar(data) {
	return request({
		// url: "/fault/faultDetail/delete",
		url: "/faultDetail/delete",
		method: "delete",
		data,
	});
}

export {
	getPageList,
	addHandle,
	editHandle,
	getChooseFaultCode,
	setFaultCodeCar,
	getChooseFaultRule,
	setFaultRule,
	exportLog,
	getChooseFaultCar,
	getSeePushLog,
	getLookFaultCode,
	deleteFaultCode,
	getLookFaultRule,
	deleteFaultRule,
	getlookFaultCar,
	deleteFaultcar,
};
