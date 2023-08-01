import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function gethistoryfaultpagelist(params) {
	return request({
		// url: "/fault/terminalFaultHit/getHistoryFaultPageList",
		url: "/terminalFaultHit/getHistoryFaultPageList",
		method: "get",
		params,
	});
}

/**
 * 导出
 * @param {*} data
 */
function exportCar(data) {
  return request({
		// url: "/fault/terminalfaulthit/export",
		url: "/terminalfaulthit/export",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

/**
 * 导出记录
 * @param {*} data
 */
function exportHitToExcel(data) {
  return request({
		// url: "/fault/terminalFaultHit/exportHistoryFaultList",
		url: "/terminalFaultHit/exportHistoryFaultList",
		method: "post",
		data,
	});
}

/**
 * 导出记录查询
 * @param {*} data
 */
function getTaskRecordPageList(data) {
  return request({
		// url: "/fault/terminalfaulthit/getTaskRecordPageList",
		url: "/terminalfaulthit/getTaskRecordPageList",
		method: "post",
		data,
	});
}

/**
 * 导出记录删除
 * @param {*} data
 */
function deleteTask(data) {
  return request({
		// url: "/fault/terminalfaulthit/deleteTask",
		url: "/terminalfaulthit/deleteTask",
		method: "delete",
		data,
	});
}

/**
 * 下载导入结果
 * @param {*} data
 */
function downloadExcel(data) {
  return request({
		// url: "/fault/terminalfaulthit/exportCarToExcel",
		url: "/terminalfaulthit/exportCarToExcel",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}

export {
  gethistoryfaultpagelist,
  exportCar,
  downloadExcel,
  exportHitToExcel,
  getTaskRecordPageList,
  deleteTask
}
