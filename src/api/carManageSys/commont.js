import request from "@/utils/request";

/**
 * 获取页面按钮权限
 * @param {*} params
 */
function getPageButton(params) {
	return request({
		url: "/login/getmenubtns",
		method: "get",
		params,
	});
}

/**
 * 模板下载
 * @param {*}
 */
function uploadDownTemplate(data) {
	return request({
		url: "/user/downloadExcel",
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}

/**
 * 获取所有岗位列表
 */
function getAllStationList() {
  return request({
    url: '/common/getAllStationList',
    method: 'get'
  })
}

/**
 * 角色下拉框
 * @param {*}
 */
function dropRole() {
	return request({
		url: "/user/role/list",
		method: "get",
	});
}

/**
 * 导出校验失败车辆
 * @param {*}
 */
function exportErrorCar(data) {
	return request({
		url: `/task/exportCheckFailedCar`,
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}

/**
 * 导出校验成功车辆
 * @param {*}
 */
function exportSuccessCar(data) {
	return request({
		url: `/car/exportCar`,
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}

/**
 * 导出任务校验成功车辆
 * @param {*}
 */
function exportSuccessTaskCar(data) {
	return request({
		url: `/task/exportCheckSuccessCar`,
		method: "post",
		data,
		responseType: "arraybuffer",
	});
}

/**
 * 导出记录
 * @param {*} data
 */
function getTaskRecordPageList(params) {
	return request({
		url: "/common/getExportRecord",
		method: "get",
		params,
	});
}
/**
 * 删除导出记录
 * @param {*} data
 */
function deleteDataTask(data) {
	return request({
		url: "/common/deleteExportRecord",
		method: "delete",
		data,
	});
}

/**
 * 获取导入查询任务
 * @param {*} params
 */
 function getUploadTasks(params) {
	return request({
		url: "/common/getUploadTasks",
		method: "get",
		params,
	});
}

/**
 * 获取下拉框分页车辆
 * @param {*} params
 */
function getComboxCarPageList(data) {
	return request({
		url: "/common/getComboxCarPageList",
		method: "get",
		data,
	});
}

/**
 * 逆地理编码
 */
function getReGeoCode(params) {
	return request({
		url: "/common/getReGeoCode",
		method: "get",
		params,
	});
}

/**
 * 获取车型名称列表
 */
function getCarTypeList() {
	return request({
		url: "/car/getCarTypeInfo",
		method: "get",
	});
}
/**
 * 获取项目代号列表
 */
function getCarBatchList(params) {
	return request({
		url: "/common/getCarBatchList",
		method: "get",
		params,
	});
}

// /**
//  * 获取服务站
//  * @param {*} params
//  */
// function getServiceStationList() {
// 	return request({
// 		url: "/terminalAlterAudit/getServiceStationList",
// 		method: "get",
// 	});
// }

// /**
//  * 获取服务站
//  * @param {*} params
//  */
//  function getServiceStationList1() {
// 	return request({
// 		url: "/simAlterAudit/getServiceStationList",
// 		method: "get",
// 	});
// }

/**
 * 获取所有项目代号
 */
function getBatchAll() {
	return request({
		url: "/common/getBatchAll",
		method: "get",
	});
	}
 /**
	* 获取省列表
 */

function getProvinceList() {
  return request({
    url: '/common/getProvinceList',
    method: 'get'
  })
}

/**
 * 获取市列表
 */
function getCityList(params) {
  return request({
    url: '/common/getCityList',
    method: 'get',
    params
  })
}
/**
 * 获取区列表
 */
function getDistinctList(params) {
  return request({
    url: '/common/getDistinctList',
    method: 'get',
    params
  })
}

/**
 * 获取营运城市
 * @param {*} params
 */
 function getyyCityList() {
  return request({
    url: '/car/getCityList',
    method: 'get'
  })
}


/**
 * 获取单位
 * @param {*} params
 */
 function getCompanyInfo() {
  return request({
    url: '/contact/getCompanyInfo',
    method: 'get'
  })
}

/**
 * 获取SIM卡列表
 */
function getSimList(data){
  return request({
    url: '/common/getSim',
    method: 'post',
    data
  })
}
export {
	getPageButton,
	uploadDownTemplate,
	dropRole,
	exportErrorCar,
	exportSuccessCar,
	exportSuccessTaskCar,
	getTaskRecordPageList,
	deleteDataTask,
	getUploadTasks,
	getComboxCarPageList,
	getReGeoCode,
	getCarTypeList,
	getCarBatchList,
	// getServiceStationList,
	// getServiceStationList1,
	getBatchAll,
	getProvinceList,
	getCityList,
	getDistinctList,
	getyyCityList,
	getCompanyInfo,
	getAllStationList,
	getSimList
};
