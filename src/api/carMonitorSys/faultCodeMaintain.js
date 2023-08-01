import request from '@/utils/request'

/**
 * 获取故障码
 * @param {*} data
 */
function getFaultCode(data) {
  return request({
		// url: "/fault/faultCode/getFaultCode",
		url: "/faultCode/getFaultCode",
		method: "post",
		data,
	});
}
/**
 * 新增故障码
 * @param {*} data
 */
function createFaultCode(data) {
  return request({
		// url: "/fault/faultCode/create",
		url: "/faultCode/create",
		method: "post",
		data,
	});
}

/**
 * 编辑故障码
 * @param {*} data
 */
function updateFaultCode(data) {
  return request({
		// url: "/fault/faultCode/update",
		url: "/faultCode/update",
		method: "put",
		data,
	});
}
/**
 * 删除故障码
 * @param {*} data
 */
function deleteFaultCode(data) {
  return request({
		// url: "/fault/faultCode/delete",
		url: "/faultCode/delete",
		method: "delete",
		data,
	});
}

/**
 * 导出车型
 * @param {*} data
 */
function exportFaultCode(data) {
  return request({
		// url: "/fault/faultCode/exportFaultCode",
		url: "/faultCode/exportFaultCode",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 获取零部件
 * @param {*} data
 */
function getCarPartList() {
  return request({
		// url: "/fault/carPart/getCarPartList",
		url: "/carPart/getCarPartList",
		method: "get",
	});
}

export {
  getFaultCode,
  createFaultCode,
  updateFaultCode,
  deleteFaultCode,
  getCarPartList,
  exportFaultCode
}
