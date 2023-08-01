import request from "@/utils/request";
/**
 * 历史数据离线下载
 * @param {*} data
 */
function historicalDataExport(data) {
	return request({
		url: "/historyData/export",
		method: "post",
		data,
	});
}
/**
 * 获取数据类型消息类型
 * @param {*} data
 */
 function getAccessMsgType(data) {
	return request({
		url: "/common/getAccessMsgType",
		method: "get",
		data,
	});
}
/**
 * 获取车企列表
 * @param {*} data
 */
function GetCarMaker(data) {
	return request({
		url: "/carMaker/GetCarMaker",
		method: "post",
		data,
	});
}
function getExtractTask(data) {
	return request({
		url: "/extractTask/getExtractTask",
		method: "post",
		data,
	});
}
// '/extractTask/getExtractTask',
/**
 * 导出车企列表
 * @param {*} data
 */
function exportCarMaker(data) {
	return request({
		url: "/carMaker/exportCarMaker",
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}
/**
 * 导出车企列表
 * @param {*} data
 */
function forwardLogExport(data) {
	return request({
		url: "/forwardLog/export",
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}

/**
 * 导新增车辆抽取任务
 * @param {*} data
 */
function createRole(data) {
	return request({
		url: "/extractTask/createExtractTask",
		method: "post",
		data,
	});
}

/**
 * 修改车辆抽取任务
 * @param {*} data
 */
function updateRole(data) {
	return request({
		url: "/extractTask/updateExtractTask",
		method: "post",
		data,
	});
}

/**
 * 修改车辆抽取任务下拉协议列表
 * @param {*} data
 */

function getProtocolList() {
	return request({
		url: "common/getProtocolList",
		method: "get",
	});
}

/**
 * 车辆抽取任务删除
 * @param {*} data
 */

function deleteExtractTask(data) {
	return request({
		url: `/extractTask/deleteExtractTask`,
		// url: `/extractTask/deleteExtractTask`,
		method: "post",
		data,
	});
}

/**
 * 车辆抽取任务导出
 * @param {*} data
 */

function exportExtractTask(data) {
	return request({
		url: `/extractTask/exportExtractTask`,
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}

/**
 * 车辆抽取任务开启/关闭
 * @param {*} data
 */
function updateStatus(data) {
	return request({
		url: `/extractTask/updateStatus`,
		method: "post",
		data,
	});
}
/**
 * 获取选择的车辆id
 * @param {*} data
 */
function getTaskCar(data) {
	return request({
		url: `/extractTask/getTaskCar`,
		method: "post",
		data,
	});
}

/**
 * 获取选择的车辆id
 * @param {*} data
 */
function importTaskCar(data) {
	return request({
		url: `/extractTask/importTaskCar`,
		method: "post",
		data,
	});
}
/**
 * 获取转发日志
 * @param {*} data
 */
function getElkLogList(data) {
	return request({
		url: `/forwardLog/getElkLogList`,
		method: "post",
		data,
	});
}
/**
 * 获取转发日志链路
 * @param {*} data
 */
function getForwardLinkOption() {
	return request({
		url: "/common/getForwardLinkOption",
		method: "get",
	});
}
/**
 * 获取转发日志任务详情
 * @param {*} data
 */
function getForwardLinktaskList(data) {
	return request({
		url: "/forwardLog/taskList",
		method: "post",
		data,
	});
}
/**
 * 下载文件到本地
 * @param {*} data
 */
function getForwardDownload(data) {
	return request({
		url: "/minio/download",
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}
/**
 * 获取历史数据
 * @param {*} data
 */
function getHistoryData(data) {
	return request({
		url: "/historyData/getHistoryData",
		method: "post",
		data,
	});
}
/**
 * 获取历史数据列数据
 * @param {*} data
 */
function getHisDataParams(data) {
	return request({
		url: "/historyData/getHisDataParams",
		method: "get",
		data,
	});
}
/**
 * 获取转发链路
 * @param {*} data
 */
function getLinkList(id) {
	return request({
		url: `/forwardLink/getLinkList/${id}`,
		method: "get",
	});
}
/**
 * 校验任务名称是否存在
 * @param {*} data
 */
function extractTask(taskName,id) {
	return request({
		url: `/extractTask/verify/${taskName}/${id}`,
		method: "get",
	});
}
/**
 * 获取链路规则
 * @param {*} data
 */
function createExtractRule(data) {
	return request({
		url: "/ExtractRule/createExtractRule",
		method: "post",
		data,
	});
}
/**
 * 获取过滤规则下拉框
 * @param {*} data
 */
function getProtocolVariableOption() {
  return request({
    url: "common/getProtocolVariableOption",
    method: "get",
  });
}
/**
 * 获取g过滤规则
 * @param {*} data
 */
function getFileTerRule(data) {
	return request({
		url: "/filterRules/getFileTerRule",
		method: "post",
		data,
	});
}
export {
	getFileTerRule,
	getProtocolVariableOption,
	GetCarMaker,
	exportCarMaker,
	createRole,
	updateRole,
	getProtocolList,
	deleteExtractTask,
	exportExtractTask,
	updateStatus,
	getTaskCar,
	getExtractTask,
	importTaskCar,
	getElkLogList,
	getForwardLinkOption,
	forwardLogExport,
	getForwardLinktaskList,
	getForwardDownload,
	getHistoryData,
	getHisDataParams,
	historicalDataExport,
	getLinkList,
	extractTask,
	getAccessMsgType,
	createExtractRule,
};
