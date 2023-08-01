import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/lowSocRemindingRuleSet/selectAlarmRuleRecordList',
    method: 'post',
    data
  })
}

/**
 * 获取报警类型下列表
 * @param {*} data
 */
function selectAlarmTypeList() {
  return request({
    url: '/lowSocRemindingRuleSet/selectAlarmTypeList',
    method: 'get'
  })
}

/**
 * 导出
 * @param {*} data
 */
function handleExports(data) {
  return request({
    url: '/lowSocRemindingRuleSet/exportRecord',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getPageList,
  selectAlarmTypeList,
  handleExports,
}
