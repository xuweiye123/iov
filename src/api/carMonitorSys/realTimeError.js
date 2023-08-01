import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getRealTimeFaultPageList(params) {
  return request({
		// url: "/fault/terminalFaultTmp/getRealTimeFaultPageList",
		url: "/terminalFaultTmp/getRealTimeFaultPageList",
		method: "get",
		params,
	});
}

/**
 * 导出
 * @param {*} data
 */
// function exportCar(data) {
//   return request({
//     url: '/terminalfaulttmp/export',
//     method: 'post',
//     responseType: 'arraybuffer',
//     data
//   })
// }

/**
 * 导出
 * @param {*} data
 */
function exportToExcel(data) {
  return request({
		// url: "/fault/terminalFaultTmp/exportRealTimeFaultList",
		url: "/terminalFaultTmp/exportRealTimeFaultList",
		method: "post",
		data,
	});
}

/**
 * 导出记录查询
 * @param {*} data
 */
function getTaskFaultPageList(data) {
  return request({
		// url: "/fault/terminalfaulttmp/getTaskFaultPageList",
		url: "/terminalfaulttmp/getTaskFaultPageList",
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
		// url: "/fault/terminalfaulttmp/deleteTask",
		url: "/terminalfaulttmp/deleteTask",
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
		// url: "/fault/terminalFaultTmp/exportCarToExcel",
		url: "/terminalFaultTmp/exportCarToExcel",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}



export {
  getRealTimeFaultPageList,
  // exportCar,
  downloadExcel,
  exportToExcel,
  getTaskFaultPageList,
  deleteTask
}
