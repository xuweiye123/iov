import request from "@/utils/request";

/**
 * 获取TBOX诊断日志列表
 * @param {*} data
 */
function getTboxLogList(data) {
	return request({
		url: "/tboxLog/getTboxLogList",
		method: "post",
		data,
	});
}

/**
 * 获取TBOX诊断日志列表-详情
 * @param {*} data
 */
function readLogList(data) {
	return request({
		url: "/tboxLog/read",
		method: "post",
		data,
	});
}

/**
 * 获取车型
 * @param {*} data 
 */
 function getcarTypeName(data){
  return request({
    url: '/common/getSupportCarTypeList',
    method: 'get',
    data
  })
}
export { getTboxLogList, readLogList, getcarTypeName };
