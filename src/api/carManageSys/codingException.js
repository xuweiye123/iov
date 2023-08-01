import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getRepeatcoderecordTmpPageList(params) {
  return request({
    url: '/repeatCodeRecordTmp/getRepeatCodeList',
    method: 'get',
    params
  })
}

/**
 * 导出
 * @param {*} data
 */
function exportInfo(data) {
  return request({
    url: '/repeatCodeRecordTmp/export',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export {
  getRepeatcoderecordTmpPageList,
  exportInfo
}
