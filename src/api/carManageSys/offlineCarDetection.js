import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/offlineCheck/getOfflinePageList',
    method: 'post',
    data
  })
}

// /**
//  * 导出
//  * @param {*} data
//  */
// function exportsData(data) {
//   return request({
//     url: '/offlineVehicle/exportOffLineVehicle',
//     method: 'post',
//     responseType: 'arraybuffer',
//     data
//   })
// }

/**
 * 故障信息
 * @param {*} data
 */
function selectTroubleRecordPageList(data) {
  return request({
    url: '/offlineCheck/selectFaultPageList',
    method: 'post',
    data
  })
}

/**
 * 保存
 * @param {*} data
 */
function saveMessage(data) {
  return request({
    url: '/offlineCheck/createOffline',
    method: 'post',
    data
  })
}

/**
 * 获取下拉框分页车辆(全部车辆)
 * @param {*} params
 */
function getComboxCarsPageList(params) {
	return request({
		url: "/common/getComboxCarsPageList",
		method: "get",
		params,
	});
}

export {
  getPageList,
  // exportsData,
  selectTroubleRecordPageList,
  saveMessage,
  getComboxCarsPageList
}
