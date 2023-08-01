import request from "@/utils/request";
/**
 * 获取故障码列表
 * @param {*} data
 */
function getFaultCodeList(data) {
	return request({
		url: "/faultErrorCode/getFaultCodeList",
		method: "post",
		data,
	});
}
/**
 * 创建故障码信息
 * @param {*} data
 */
function createFaultCode(data) {
	return request({
		url: "/faultErrorCode/createFaultCode",
		method: "post",
		data,
	});
}

/**
 * 获取ODX文件列表
 * @param {*} data 
 */
function getOdxList(data){
    return request({
        url: 'odx/getOdxList',
        method: 'POST',
        data
    })
}

/**
 * 编辑故障码信息
 * @param {*} data
 */
function updateFaultCode(data) {
	return request({
		url: "/faultErrorCode/updateFaultCode",
		method: "put",
		data,
	});
}
/**
 * 删除故障码信息
 * @param {*} data
 */
function deleteFaultCode(data) {
	return request({
		url: "/faultErrorCode/deleteFaultCode",
		method: "delete",
		data,
	});
}
/**
 * 导出失败原因
 * @param {*} data
 */
function exportErrorMessage(data) {
	return request({
		url: "/faultErrorCode/exportErrorMessage",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}
export {
	getFaultCodeList,
	createFaultCode,
	updateFaultCode,
	deleteFaultCode,
	exportErrorMessage,
	getOdxList
};
