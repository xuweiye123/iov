import request from "@/utils/request";

/**
 * 获取月报title
 * @param {*} data
 */
function getTitleInfo(data) {
	return request({
		url: "month/getMonth",
		method: "post",
		data,
	});
}
/**
 * 获取页面数据
 * @param {*} data
 */
function getMonitorInfo(data) {
	return request({
		url: "get/monitorInfo",
		method: "post",
		data,
	});
}

/**
 * 打印
 * @param {*} data
 */
function savePic(data) {
	return request({
		url: "month/savePic",
		method: "post",
		data,
		async: true,
	});
}

/**
 * pdf下载
 * @param {*} data
 */
function downMonthDoc(data) {
	return request({
		url: "month/downMonth",
		method: "post",
		data,
	});
}
function getMonth(data) {
	return request({
		url: "/month/getMonth",
		method: "post",
		data,
	});
}

// 换电
function getReport(data) {
	return request({
		url: "/monthReplaceBattery/getReport",
		method: "post",
		data,
	});
}

export {
	// getList,
	getTitleInfo,
	getMonitorInfo,
	savePic,
	downMonthDoc,
	getMonth,
	getReport
};
