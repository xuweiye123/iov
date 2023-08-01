import request from "@/utils/request";
//获取列表
function getData(data) {
	return request({
		url: "/carRemoteNumLog/getNumList",
		method: "post",
		data,
	});
}
export { getData };
