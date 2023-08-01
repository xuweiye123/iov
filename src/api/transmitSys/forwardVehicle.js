import request from '@/utils/request'
/**
 * 获取一级转发目标平台
 */
function getForwardTargetLevel() {
  return request({
    url: 'forwardTask/getForwardTargetLevel',
    method: 'get'
  })
}

/**
 * 获取二级转发链路
 * @param {*} data
 */
function getForwardLinkLevel(params) {
  return request({
    url: 'forwardTask/getForwardLinkLevel',
    method: 'get',
    params
  })
}
/**
 * 获取转发车辆任务
 * @param {*} data
 */
function getForwardTask(data) {
  return request({
    url: 'forwardTask/getForwardTask',
    method: 'post',
    data
  })
}
/**
 * 编辑转发车辆任务
 * @param {*} data
 */
function updateForwardTask(data) {
  return request({
    url: 'forwardTask/updateForwardTask',
    method: 'post',
    data
  })
}
/**
 * 编辑转发车辆任务
 * @param {*} data
 */
 function getUploadTask(data) {
  return request({
    url: '/uploadTask/getUploadTask',
    method: 'post',
    data
  })
}

/**
 * 删除转发车辆任务
 * @param {*} data
 */
function deleteForwardTask(data) {
  return request({
    url: 'forwardTask/deleteForwardTask',
    method: 'post',
    data
  })
}
/**
 * 批量导入修改车辆状态importCarSetFlag
 * @param {*} data
 */
function importCarSetFlag(data) {
  return request({
    url: 'forwardTask/importCarSetFlag',
    method: 'put',
    data
  })
}
/**
 * 转发车辆导入列表
 * @param {*} data
 */
 function getUploadTaskList(data) {
  return request({
    url: 'forwardTask/getUploadTaskList',
    method: 'post',
    data
  })
}
/**
 * 导出
 * @param {*} data
 */
 function exportPost(data) {
  return request({
    url: 'forwardTask/leadOutCarInfo',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 导出
 * @param {*} data
 */
function exportForwardTask(data) {
  return request({
    url: '/forwardTask/exportForwardTask',
    method: 'post',
    data
  })
}

/**
 * 离线导出详情
 * @param {*} data
 */
function taskList(data) {
  return request({
    url: '/forwardLog/taskList',
    method: 'post',
    data
  })
}
/**
 * 下载文件到本地
 * @param {*} data
 */
function getForwardDownload(data) {
	return request({
		url: "/minio/download",
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}
export {
  getForwardTargetLevel,
  getForwardLinkLevel,
  getForwardTask,
  deleteForwardTask,
  updateForwardTask,
  getUploadTask,
  importCarSetFlag,
  getUploadTaskList,
  exportPost,
  exportForwardTask,
  taskList,
  getForwardDownload
}
