import request from "@/utils/request";

/**
 *获取列表
 * @param {*} params
 */
function getPagelist(params) {
	return request({
		url: "/CarTravelData/getlist",
		method: "get",
		params,
	});
}

/**
 *获取行程
 * @param {*} data
 */
// function getAipDrivinglogList(params) {
// 	return request({
// 		url: "/CarTravelData/getTripDataList",
// 		method: "get",
// 		params,
// 	});
// }

/**
 *获取充电
 * @param {*} data
 */
// function getChargingpushLogList(params) {
// 	return request({
// 		url: "/CarTravelData/getChargeDataList",
// 		method: "get",
// 		params,
// 	});
// }

/**
 * 导出
 * @param {*} data
 */
function exportData1(data) {
	return request({
		url: "/CarTravelData/exportQueryList",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 导出
 * @param {*} data
 */
// function exportData2(data) {
// 	return request({
// 		url: "/CarTravelData/exportTripList",
// 		method: "post",
// 		responseType: "arraybuffer",
// 		data,
// 	});
// }

/**
 * 导出
 * @param {*} data
 */
// function exportData3(data) {
// 	return request({
// 		url: "/CarTravelData/exportChagreList",
// 		method: "post",
// 		responseType: "arraybuffer",
// 		data,
// 	});
// }

/**
 * 查看详情
 * @param {*} params
 */
function getDrivingBehaviorDetail(params) {
	return request({
		url: "/CarTravelData/getDrivingBehaviorDetail",
		method: "get",
		params,
	});
}

export {
	getPagelist,
	// getAipDrivinglogList,
	// getChargingpushLogList,
	exportData1,
	// exportData2,
	// exportData3,
	getDrivingBehaviorDetail,
};
