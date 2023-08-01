import request from "@/utils/request";
//获取列表
function getPagelist(params) {
	return request({
		url: "/travelData/getlist",
		method: "get",
		params,
	});
}
//获取图表
function getChartData(params) {
	return request({
		url: "/travelData/getChartData",
		method: "get",
		params,
	});
}
/**
 * 导出
 * @param {*} data
 */
function exportDetail(data) {
	return request({
		url: "/travelData/exportQueryList",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}
export { exportDetail, getPagelist, getChartData };
