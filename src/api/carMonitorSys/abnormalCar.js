import request from '@/utils/request'

/**
 * 获取列表
 * @param {*} params
 */
function getList(data) {
  return request({
    url: '/carException/list',
    method: 'post',
    data
  })
}

export {
  getList
}