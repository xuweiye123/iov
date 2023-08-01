import request from "@/utils/request";
//获取图表
function getChartsList(data) {
	return request({
		url: "/carQueryLog/query",
		method: "post",
		data,
	});
}
//获取列表
function getPagelist(data) {
	return request({
		url: "/carQueryLog/queryByPage",
		method: "post",
		data,
	});
}
/**
 * 导出
 * @param {*} data
 */
function exportQueryLog(data) {
	return request({
		url: "/carQueryLog/exportQueryLog",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}
export { exportQueryLog, getPagelist, getChartsList };
