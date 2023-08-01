import request from "@/utils/request";

/**
 * 获取充电明细列表
 * @param {*} data
 */
function getChargeDetailsPageList(data) {
	return request({
		url: "/chargeDetails/getChargeDetailsPageList",
		method: "post",
		data,
	});
}

/**
 * 导出充电明细列表
 * @param {*} data
 */
function exportChargeDetails(data) {
	return request({
		url: "/chargeDetails/export",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 充电热力图
 */
function getChargeManageCollect() {
	return request({
		url: "/chargeDetails/getChargeManageCollect",
		method: "post",
	});
}
export {
	getChargeDetailsPageList,
	exportChargeDetails,
	getChargeManageCollect,
};
