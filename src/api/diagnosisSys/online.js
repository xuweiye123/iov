import request from '@/utils/request'
/**
 * 一键读取整车故障
 * @param {*} params 
 */
function readCarDTC(data){
    return request({
        url: 'onlineDiagnosis/readCarDTC',
        method: 'POST',
        data
    })
}
/**
 * 一键清除整车故障
 * @param {*} params 
 */
function clearCarDTC(data){
    return request({
        url: 'onlineDiagnosis/clearCarDTC',
        method: 'POST',
        data
    })
}
/**
 * 读取整车数据流
 * @param {*} params 
 */
function readCarStream(data){
    return request({
        url: 'onlineDiagnosis/readCarStream',
        method: 'POST',
        data
    })
}
/**
 * 写入零部件
 * @param {*} params 
 */
function writeData(data){
    return request({
        url: 'onlineDiagnosis/writeData',
        method: 'POST',
        data
    })
}
/**
 * 按控制器读取诊断信息
 * @param {*} params 
 */
function dxByECU(data){
    return request({
        url: 'onlineDiagnosis/dxByECU',
        method: 'POST',
        data
    })
}
/**
 * 输入输出控制
 * @param {*} params 
 */
function ioControl(data){
    return request({
        url: 'onlineDiagnosis/ioControl',
        method: 'POST',
        data
    })
}
/**
 * 读取诊断报告结果
 * @param {*} data 
 */
function printDxReport(data){
    return request({
        url: 'onlineDiagnosis/printDxReport',
        method: 'POST',
        data
    })
}

/**
 * 获取写入内容
 * @param {*} params 
 */
function getWriteList(data){  
    return request({
        url: 'onlineDiagnosis/getWriteList',
        method: 'post',
        data
    })
}
/**
 * 读取诊断服务
 * @param {*} params 
 */
function getReadList(data){
    return request({
        url: 'onlineDiagnosis/getReadList',
        method: 'POST',
        data
    })
} 
/**
 * 获取按控制器读取类型日志
 * @param {*} data 
 */
function getDxByEcuOperLog(data){
    return request({
        url: 'operLog/getDxByEcuOperLog',
        method: 'POST',
        data
    })
} 
/**
 * 导出按控制器读取诊断日志
 * @param {*} data 
 */
function exportDxByEcuOperLog(data){
    return request({
      url: '/operLog/exportDxByEcuOperLog',
      method: 'post',
      responseType: 'arraybuffer',
      data
    })
  }
/**
 * 打印诊断报告结果(导出)
 * @param {*} data 
 */
function exportDxReport(data){
    return request({
      url: '/onlineDiagnosis/exportDxReport',
      method: 'post',
      responseType: 'arraybuffer',
      data
    })
  }
/**
 * 读取ecu日志
 * @param {*} data
 */
 function sendOrder(data) {
    return request({
        url: 'readEcuLog/readLog',
        method: 'POST',
        data
    })
}

/**
 * 读取ecu日志
 * @param {*} data
 */
function getLogList(data) {
    return request({
        url: 'readEcuLog/getLogList',
        method: 'POST',
        data
    })
}
/**
 * 清除数据库数据
 */
function deleteLog() {
    return request({
        url: 'onlineDiagnosis/deleteLog',
        method: 'DELETE',
    })
}
/**
 * 请求版本信息下发
 */
function readVersion(data) {
    return request({
        url: 'onlineDiagnosis/readVersion',
        method: 'POST',
        data
    })
}
/**
 * 下发信息
 */
function getVersion(data) {
    return request({
        url: 'onlineDiagnosis/getVersion',
        method: 'POST',
        data
    })
}
/**
 * 一键读取软件版本号
 */
function readSoftwareVersion(data) {
    return request({
        url: 'onlineDiagnosis/readSoftwareVersion',
        method: 'POST',
        data
    })
}
/**
 * 一键读取硬件版本号
 */
function readHardwareVersion(data) {
    return request({
        url: 'onlineDiagnosis/readHardwareVersion',
        method: 'POST',
        data
    })
}
/**
 * 一键读取配置字
 */
function sendRead(data) {
    return request({
        url: 'onlineDiagnosis/sendRead',
        method: 'POST',
        data
    })
}
/**
 * 获取故障码解决方案
 */
function getFaultSolution(data) {
	return request({
		url: "/faultErrorCode/getFaultSolution",
		method: "POST",
		data,
	});
}
/**
 * 获取输出输入设置列表
 */
function getIoEquipment(data) {
	return request({
		url: "/onlineDiagnosis/getIoEquipment",
		method: "POST",
		data,
	});
}
export {
	readCarDTC,
	clearCarDTC,
	readCarStream,
	writeData,
	dxByECU,
	ioControl,
	printDxReport,
	getWriteList,
	getReadList,
	getDxByEcuOperLog,
	exportDxByEcuOperLog,
	exportDxReport,
	sendOrder,
	getLogList,
	deleteLog,
	readVersion,
	getVersion,
	readSoftwareVersion,
	readHardwareVersion,
	sendRead,
	getFaultSolution,
    getIoEquipment
};
