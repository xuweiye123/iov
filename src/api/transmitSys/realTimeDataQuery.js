import request from "@/utils/request";

/**
 * 获取incom信息列表
 * @param {*} data
 */
function getRealData(data) {
	return request({
		url: "/realData/getRealData",
		method: "post",
		data,
	});
}
export {
  getRealData

};
