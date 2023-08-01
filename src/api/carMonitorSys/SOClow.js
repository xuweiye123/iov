import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/lowSocRemindingRuleSet/selectLowSocRuleSetPageList',
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
    url: '/lowSocRemindingRuleSet/createRule',
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
    url: '/lowSocRemindingRuleSet/editRule',
    method: 'put',
    data
  })
}

/**
 * 删除
 * @param {*} params
 */
function deleteHandle(data) {
  return request({
    url: '/lowSocRemindingRuleSet/deleteRule',
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
