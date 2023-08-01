import request from "@/utils/request";

/**
 * 获取换电明细列表
 * @param {*} data
 */
function getPageList(data) {
	return request({
		url: "/changePower/list",
		method: "post",
		data,
	});
}

/**
 * 导出换电明细列表
 * @param {*} data
 */
function exportDetails(data) {
	return request({
		url: "/changePower/export",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 换电热力图
 */
function getCityChangeHot() {
	return request({
		url: "/changePower/getCityChangeHot",
		method: "get",
	});
}

/**
 * 换电过程
 */
function getChangeProcess(data) {
	return request({
		url: "/changePower/getChangeProcess",
		method: "post",
		data
	});
}

export {
	getPageList,
	exportDetails,
	getCityChangeHot,
	getChangeProcess
};
