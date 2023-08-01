import request from "@/utils/request";

/**
 * 获取车辆登入登出查询列表
 * @param {*} data
 */
function getCarLoginOut(data) {
	return request({
		url: "/carLoginOut/getCarLoginOut",
		method: "post",
		data,
	});
}

export { getCarLoginOut };
