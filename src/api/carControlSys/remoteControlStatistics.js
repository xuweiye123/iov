import request from "@/utils/request";
//获取图表
function getPagelist(data) {
	return request({
		url: "/carRemoteLog/getList",
		method: "post",
		data,
	});
}
/**
 * 导出
 * @param {*} data
 */
function exportDetail(data) {
	return request({
		url: "/carRemoteLog/exportControlLog",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}
/**
 * 获取列表
 * @param {*} data
 */
 function getListPage(data) {
	return request({
		url: "/carRemoteLog/getListPage",
		method: "post",
		data,
	});
}
export { exportDetail, getPagelist, getListPage };
