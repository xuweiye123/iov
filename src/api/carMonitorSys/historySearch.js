import request from '@/utils/request'

/**
 * 获取任务
 * @param {*} data 
 */
function getTask(data){
  return request({
		// url: "/fault/hitFaultDataDownload/getTaskPageList",
		url: "/hitFaultDataDownload/getTaskPageList",
		method: "post",
		data,
	});
}

/**
 * 添加任务
 * @param {*} data 
 */
function createTask(data){
  return request({
		// url: "/fault/hitFaultDataDownload/createTask",
		url: "/hitFaultDataDownload/createTask",
		method: "post",
		data,
	});
}

/**
 * 删除任务
 * @param {*} data 
 */
function deleteTask(data){
  return request({
		// url: "/fault/hitFaultDataDownload/deleteTask",
		url: "/hitFaultDataDownload/deleteTask",
		method: "post",
		data,
	});
}

/**
 * 设置任务
 * @param {*} data 
 */
function setTask(data){
  return request({
		// url: "/fault/hitFaultDataDownload/setTaskLevel",
		url: "/hitFaultDataDownload/setTaskLevel",
		method: "post",
		data,
	});
}

/**
 * 获取任务详情
 */
function getTaskDetail(data){
  return request({
		// url: "/fault/hitFaultDataDownload/getTaskDetail",
		url: "/hitFaultDataDownload/getTaskDetail",
		method: "post",
		data,
	});
}

/**
 * 导出
 */
 function exportHandle(data){
  return request({
		// url: "/fault/hitFaultDataDownload/exportToExcel",
		url: "/hitFaultDataDownload/exportToExcel",
		method: "post",
		responseType: "arraybuffer",
		data,
	});
}


export {
  getTask,
  createTask,
  deleteTask,
  setTask,
  getTaskDetail,
  exportHandle
}