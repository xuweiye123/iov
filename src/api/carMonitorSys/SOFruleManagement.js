import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/batAlarmRuleSet/selectAlarmList',
    method: 'post',
    data
  })
}


/**
 * 新增
 * @param {*} params
 */
function createHandle(data) {
  return request({
    url: '/batAlarmRuleSet/createRule',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param {*} params
 */
function updateHandle(data) {
  return request({
		url: "/batAlarmRuleSet/updateRule",
		method: "put",
		data,
	});
}

/**
 * 删除
 * @param {*} params
 */
function deleteHandle(data) {
  return request({
    url: '/batAlarmRuleSet/deleteRule',
    method: 'delete',
    data
  })
}

export {
  getPageList,
  createHandle,
  updateHandle,
  deleteHandle
}
