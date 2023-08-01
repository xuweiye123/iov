import request from '@/utils/request'

/**
 * 查询里程信息
 * @param {*} params
 */
function getMileagePageList(params) {
	return request({
		url: "/mileageStatistics/getMileagePageList",
		method: "get",
		params,
	});
}

/**
 * 导出里程信息
 * @param {*} data
 */
function mileageExport(data) {
  return request({
    url: '/mileageStatistics/exportMileageList',
    method: 'post',
    data
  })
}

/**
 * odo--添加任务
 * @param {*} data
 */
function create(data) {
  return request({
		url: "/mileageHbase/create",
		method: "post",
		data,
	});
}

/**
 * odo--删除任务
 * @param {*} data
 */
function deleteTask(data) {
  return request({
		url: "/mileageHbase/delete",
		method: "post",
		data,
	});
}

/**
 * odo--获取任务列表
 * @param {*} params
 */
function getTask(params) {
	return request({
		url: "/mileageHbase/selectTask",
		method: "get",
		params,
	});
}

/**
 * odo--VIN下拉框
 * @param {*} params
 */
function selectVinNo(params) {
	return request({
		url: "/mileageHbase/selectVinNo",
		method: "get",
		params,
	});
}

/**
 * odo--单车查询
 * @param {*} params
 */
function getMileage(params) {
	return request({
		url: "/mileageHbase/getMileage",
		method: "get",
		params,
	});
}

/**
 * odo--任务详情
 * @param {*} data
 */
function selectDetail(params) {
	return request({
		url: "/mileageHbase/selectDetail",
		method: "get",
		params,
	});
}

/**
 * odo--导出任务详情
 * @param {*} data
 */
function exportDetail(data) {
  return request({
    url: '/mileageHbase/exportDetail',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 导出记录
 * @param {*} data
 */
function getTaskRecordPageList(data) {
  return request({
    url: '/mileageStatisticsNew/getTaskRecordPageList',
    method: 'post',
    data
  })
}
/**
 * 删除导出记录
 * @param {*} data
 */
function deleteDataTask(data) {
  return request({
    url: '/mileageStatisticsNew/deleteTask',
    method: 'delete',
    data
  })
}

/**
 * 下载导入结果
 * @param {*} data
 */
function downloadExcel(data) {
  return request({
    url: '/mileageStatistics/exportMileageToExcel',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 下载
 * @param {*} data 
 */
function getTaskid(data){
  return request({
    url: '/mileageHbase/exportDetail',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getMileagePageList,
  mileageExport,
  create,
  deleteTask,
  getTask,
  selectVinNo,
  getMileage,
  selectDetail,
  exportDetail,
  getTaskRecordPageList,
  deleteDataTask,
  downloadExcel,
  getTaskid
}

