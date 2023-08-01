import request from "@/utils/request";
import AES from "@/utils/AES.js";

//车窗开度控制
function carWindowControl(data) {
	return request({
		url: "/operation/sendCommand/carWindowControl",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 车门闭锁/解锁控制
 * @param {*} data
 */
function carDoorControl(data) {
	return request({
		url: "/operation/sendCommand/carDoorControl",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 空调开启/关闭控制
 * @param {*} data
 */
function airOpenControl(data) {
	return request({
		url: "/operation/sendCommand/airOpenControl",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 空调温度控制
 * @param {*} data
 */
function airTempControl(data) {
	return request({
		url: "/operation/sendCommand/airTempControl",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 座椅加热控制
 * @param {*} data
 */
function seatHeaterControl(data) {
	return request({
		url: "/operation/sendCommand/seatHeaterControl",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 寻车控制
 * @param {*} data
 */
function carSearchControl(data) {
	return request({
		url: "/operation/sendCommand/carSearchControl",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 查询车辆状态/查询TBOX
 * @param {*} data
 */
function carStatusSearch(data) {
	return request({
		url: "/operation/sendCommand/carStatusSearch",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 查询远控命令结果
 * @param {*} data
 */
function queryAnswerCommand(data) {
	return request({
		url: "/operation/queryAnswerCommand",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 查询车辆在线状态
 * @param {*} data
 */
function queryCarStatus(data) {
	return request({
		url: "/operation/queryCarStatus",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
/**
 * 查询车辆实时数据/查询数据库
 * @param {*} data
 */
function queryRealData(data) {
	// console.log(data,1267)
	return request({
		url: "/operation/queryRealData",
		method: "post",
		params:{...data.aesKey},  
		data:AES.encrypt({...data.dataBase},AES.generatekey(data.aesKey.time, data.aesKey.nonce, data.aesKey.accessKey))
	});
}
export { 
  carWindowControl, 
  carDoorControl,
  airOpenControl,
  airTempControl, 
  seatHeaterControl,
  carSearchControl,
  carStatusSearch,
  queryAnswerCommand,
  queryCarStatus,
  queryRealData,
};
