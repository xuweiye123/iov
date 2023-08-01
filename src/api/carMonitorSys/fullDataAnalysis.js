import request from "@/utils/request";
/**
 * 获取
 * @param {*} data
 */
function getList(data) {
	return request({
		url: "/downloadLog/list",
		method: "post",
		data,
	});
}

/**
 * 解析
 * @param {*} data
 */
function analysis(data) {
	return request({
		url: "/downloadLog/analysis",
		method: "post",
		data,
	});
}

export { getList, analysis };
