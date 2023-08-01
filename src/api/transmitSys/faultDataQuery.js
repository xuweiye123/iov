import request from "@/utils/request";

/**
 * 获取车企列表
 * @param {*} data
 */
function getFaultData(data) {
	return request({
		url: "/faultData/getFaultData",
		method: "post",
		data,
	});
}



export { getFaultData };
