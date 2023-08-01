import request from "@/utils/request";

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
	return request({
		url: "/carRemoteResultLog/getList",
		method: "post",
		data,
	});
}

/**
 * 获取
 * @param {*} data
 */
function getCommandLogDownloadList(data) {
	return request({
		url: "/command/getCommandLogDownloadList",
		method: "post",
		data,
	});
}

/**
 * 下载
 * @param {*} data
 */
function setCommandLogDownload(data) {
	return request({
		url: "/command/setCommandLogDownload",
		method: "post",
		data,
	});
}

/**
 * 详情
 * @param {*} data
 */
function getCommandLogDetail(data) {
	return request({
		url: "/carRemoteResultLog/getListDetail",
		method: "post",
		data,
	});
}

/**
 * 列表导出
 * @param {*} data
 */
function exportCommandLogList(data) {
	return request({
		url: "/carRemoteResultLog/exportRemoteLog",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 详情导出
 * @param {*} data
 */
function exportCommandLogDetail(data) {
	return request({
		url: "/carRemoteResultLog/exportQueryLog",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

export {
	getPageList,
	getCommandLogDownloadList,
	setCommandLogDownload,
	getCommandLogDetail,
	exportCommandLogList,
	exportCommandLogDetail,
};
