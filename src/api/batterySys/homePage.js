import request from '@/utils/request'

/**
 * 国家平台同步
 * @param {*} data
 */
function getsynccount(data) {
  return request({
    url: '/countrysync/list',
    method: 'post',
    data
  })
}

export {
    getsynccount
}
