import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
		// url: "/fault/faultDisposalTime/getFaultDisposalTimeList",
		url: "/faultDisposalTime/getFaultDisposalTimeList",
		method: "post",
		data,
	});
}


/**
 * 编辑
 * @param {*} params
 */
function updateHandle(data) {
  return request({
		// url: "/fault/faultDisposalTime/updateFaultDisposalTime",
		url: "/faultDisposalTime/updateFaultDisposalTime",
		method: "put",
		data,
	});
}


export {
  getPageList,
  updateHandle,
}
