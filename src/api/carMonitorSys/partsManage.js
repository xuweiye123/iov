import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getCarPart(data) {
  return request({
		// url: "/fault/carPart/getCarPart",
		url: "/carPart/getCarPart",
		method: "post",
		data,
	});
}

/**
 * 新增
 * @param {*} data
 */
function createCarPart(data) {
  return request({
		// url: "/fault/carPart/createCarPart",
		url: "/carPart/createCarPart",
		method: "post",
		data,
	});
}
/**
 * 编辑
 * @param {*} data
 */
function updateCarPart(data) {
  return request({
		// url: "/fault/carPart/updateCarPart",
		url: "/carPart/updateCarPart",
		method: "put",
		data,
	});
}

/**
 * 删除
 * @param {*} params
 */
function deleteCarPart(data) {
  return request({
		// url: "/fault/carPart/deleteCarPart",
		url: "/carPart/deleteCarPart",
		method: "delete",
		data,
	});
}

export {
  getCarPart,
  createCarPart,
  updateCarPart,
  deleteCarPart
}
