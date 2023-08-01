import request from '@/utils/request'
/**
 * 获取
 * @param {*} params
 */
function getData(params) {
	return request({
		url: "/monitor32960/getDataByVinNo",
		method: "get",
		params,
	});
}


export { getData };