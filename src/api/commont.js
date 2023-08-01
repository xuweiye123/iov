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
 * 导出失败车辆
 * @param {*}
 */
function exportFailCars(data) {
	return request({
		url: `/common/exportFailCars`,
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
 function getCarInfoTasks(params) {
	return request({
		url: "/car/getCarInfoTasks",
		method: "get",
		params,
	});
}

/**
 * 获取下拉框分页车辆(权限车辆)
 * @param {*} params
 */
function getComboxCarPageList(params) {
	return request({
		url: "/common/getComboxCarPageList",
		method: "get",
		params,
	});
}

/**
 * 获取下拉框分页车辆(全部车辆)
 * @param {*} params
 */
function getComboxAllCarPageList(params) {
	return request({
		url: "/common/getComboxAllCarPageList",
		method: "get",
		params,
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

/**
 * 获取项目代号列表
 */
function getBatchCodeInfo(params) {
	return request({
		url: "/car/getBatchCodeInfo",
		method: "get",
		params,
	});
}

/**
 * 故障服务获取多选车型名称列表
 */
 function getCarTypeListMultiple() {
	return request({
		// url: "/fault/car/getCarTypeInfo",
		url: "/car/getCarTypeInfo",
		method: "get",
	});
}
/**
 * 故障服务获取多选项目代号列表
 */
function getBatchCodeInfoMultiple(params) {
	return request({
		// url: "/fault/car/getBatchCodeInfo",
		url: "/car/getBatchCodeInfo",
		method: "get",
		params,
	});
}

/**
 * 获取所有项目代号
 */
function getBatchAll() {
	return request({
		url: "/car/getBatchAll",
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
 * 数字钥匙-通过vin码获取车型
 * @param {*} params
 */
function getCarTypeByVin(vin) {
  return request({
    url: `/carModel/getCarTypeByVin/${vin}`,
    method: 'get',
  })
}
/**
 * 数字钥匙-获取全部审核通过的车型
 * @param {*} params
 */
 function getAllCarType(params) {
	return request({
	  url: `/carType/getAllCarType`,
	  method: 'get',
	  params
	})
  }
  /**
 * 数字钥匙-根据车型名称获取所有关联的项目代号
 * @param {*} data
 */
 function getBatchByCarType(params) {
	return request({
	  url: `/carType/getBatchByCarType`,
	  method: 'get',
	  params
	})
}

 /**
 * 故障模块导出记录
 * @param {*} data
 */
	function faultGetTaskRecordPageList(params) {
		return request({
			// url: "/fault/common/getExportRecord",
			url: "/common/getExportRecord",
			method: "get",
			params,
		});
	}
	/**
	 * 故障模块删除导出记录
	 * @param {*} data
	 */
	function faultDeleteDataTask(data) {
		return request({
			// url: "/fault/common/deleteExportRecord",
			url: "/common/deleteExportRecord",
			method: "delete",
			data,
		});
	}
	
	/**
	 * 故障模块获取导入查询任务
	 * @param {*} params
	 */
	 function faultGetUploadTasks(params) {
		return request({
			// url: "/fault/common/getUploadTasks",
			url: "/common/getUploadTasks",
			method: "get",
			params,
		});
	}

// 根据字典项编号获取字典值
function getDicValueByCode(data){
  return request({
    url: '/dictionary/getDicValueByCode',
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
	exportFailCars,
	getTaskRecordPageList,
	deleteDataTask,
	getCarInfoTasks,
	getComboxCarPageList,
	getComboxAllCarPageList,
	getReGeoCode,
	getCarTypeList,
	getCarBatchList,
	getCarTypeListMultiple,
	getBatchCodeInfoMultiple,
	getBatchAll,
	getProvinceList,
	getCityList,
	getDistinctList,
	getyyCityList,
	getCompanyInfo,
	getAllStationList,
	getBatchCodeInfo,
	getCarTypeByVin,
	getAllCarType,
	getBatchByCarType,
	faultGetTaskRecordPageList,
	faultDeleteDataTask,
	faultGetUploadTasks,
	getDicValueByCode
};
