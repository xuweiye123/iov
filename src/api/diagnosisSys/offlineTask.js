import request from "@/utils/request";

/**
 * 获取离线任务列表
 * @param {*} data
 */
function getTaskList(data) {
	return request({
		url: "offTask/getTaskList",
		method: "post",
		data,
	});
}
/**
 * 获取子任务列表
 * @param {*} data
 */
function getSubTaskList(data) {
	return request({
		url: "offTask/getSubTaskList",
		method: "post",
		data,
	});
}
/**
 * 新增离线任务
 * @param {*} data
 */
function createTask(data) {
	return request({
		url: "offTask/createTask",
		method: "post",
		data,
	});
}
/**
 * 删除离线任务
 * @param {*} data
 */
function deleteTask(data) {
	return request({
		url: "offTask/deleteTask",
		method: "delete",
		data,
	});
}
/**
 * 获取诊断结果配置信息
 * @param {*} data
 */
function getConfigData(data) {
	return request({
		url: "offTask/getConfigData",
		method: "post",
		data,
	});
}
/**
 * 获取离线诊断结果
 * @param {*} data
 */
function getResult(data) {
	return request({
		url: "offTask/getDigResult",
		method: "post",
		data,
	});
}
/**
 * 下载离线诊断配置模板文件
 */
function downloadTemplate() {
	return request({
		url: "/offlineConfig/downloadTemplate",
		method: "get",
		responseType: "arraybuffer",
	});
}

export {
	getTaskList,
	getSubTaskList,
	createTask,
	deleteTask,
	getConfigData,
	getResult,
	downloadTemplate,
};
