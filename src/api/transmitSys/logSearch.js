import request from '@/utils/request'
/**
 * 获取数据类型消息类型
 * @param {*} data
 */
 function getAccessMsgType(data) {
	return request({
		url: "/common/getAccessMsgType",
		method: "get",
		data,
	});
}
/**
 * 导出车企列表
 * @param {*} data
 */
function forwardLogExport(data) {
	return request({
		url: "/forwardLog/export",
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}
/**
 * 修改车辆抽取任务下拉协议列表
 * @param {*} data
 */

function getProtocolList() {
	return request({
		url: "common/getProtocolList",
		method: "get",
	});
}
/**
 * 获取转发日志链路
 * @param {*} data
 */
function getForwardLinkOption() {
	return request({
		url: "/common/getForwardLinkOption",
		method: "get",
	});
}
/**
 * 获取转发日志
 * @param {*} data
 */
function getElkLogList(data) {
	return request({
		url: `/forwardLog/getElkLogList`,
		method: "post",
		data,
	});
}
/**
 * 查看报文tow
 * @param {*} data
 */
 function showMessage2(data) {
  return request({
    url: '/forwardLog/showMessage',
    method: 'POST',
    data
  })
}
//  
function taskList(data) {
  return request({
    url: 'forwardLog/taskList',
    method: 'POST',
    data
  })
}
/**
 * 获取转发日志任务详情
 * @param {*} data
 */
function getForwardLinktaskList(data) {
	return request({
		url: "/forwardLog/taskList",
		method: "post",
		data,
	});
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
	getAccessMsgType,
	forwardLogExport,
	getProtocolList,
	getForwardLinkOption,
	getElkLogList,
	taskList,
	showMessage2,
	getForwardLinktaskList,
	getForwardDownload,
};
