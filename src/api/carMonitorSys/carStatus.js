import request from "@/utils/request";

/**
 * 获取车辆状态列表
 * @param {*} data
 */
function getCarStatus(data) {
	return request({
		url: "/carstatus/getCarStatusPageList",
		method: "post",
		data,
	});
}

/**
 * 导出
 * @param {*} data
 */
function exportCar(data) {
	return request({
		url: "/terminalfaulthit/export",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 获取WebSocket连接端口
 * @param {*} params
 */
function getWebSocket() {
	return request({
		url: "/map/getWsPort",
		method: "get",
	});
}

/**
 * 获取车辆基础数据
 * @param {*} params
 */
function getcarinfo(params) {
	return request({
		url: "/carstatus/getcarinfo",
		method: "get",
		params,
	});
}

/**
 * 获取车辆基础数据下半部分name
 * @param {*} params
 */
function getdbcvar(params) {
	return request({
		url: "/carstatus/getdbcvar",
		method: "get",
		params,
	});
}
/**
 * 导出车辆状态
 */
function exportCarStatus(data) {
	return request({
		url: "/carstatus/exportCarStatusList",
		method: "post",
		data,
	});
}
/**
 * 导出记录
 */
function getTaskRecordPageList(data) {
	return request({
		url: "/carstatus/getTaskRecordPageList",
		method: "post",
		data,
	});
}
/**
 * 删除导出记录
 */
function deleteTask(data) {
	return request({
		url: "/carstatus/deleteTask",
		method: "delete",
		data,
	});
}
/**
 * 下载导入结果
 * @param {*} data
 */
function downloadExcel(data) {
	return request({
		url: "/carstatus/exportCarToExcel",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 车辆信息导入查询
 * @param {*} data
 */
function importCarInfo(data) {
	return request({
		url: "/car/importCarInfo",
		method: "post",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		data,
	});
}
/**
 * 获取导入查询任务
 * @param {*} params
 */
function getCarInfoTasks(params) {
	return request({
		url: "/car/getCarInfoTasks",
		method: "get",
		params,
	});
}
export {
	getCarStatus,
	exportCar,
	getWebSocket,
	getcarinfo,
	getdbcvar,
	exportCarStatus,
	getTaskRecordPageList,
	deleteTask,
	downloadExcel,
	importCarInfo,
	getCarInfoTasks,
};
