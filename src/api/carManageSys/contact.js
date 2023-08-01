import request from '@/utils/request'

/**
 * 获取
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/contact/getContactPageList',
    method: 'post',
    data
  })
}

/**
 * 新增
 * @param {*} params
 */
function createContact(data) {
  return request({
    url: '/contact/createContact',
    method: 'post',
    data
  })
}

/**
 * 编辑
 * @param {*} params
 */
function updateContact(data) {
  return request({
    url: '/contact/updateContact',
    method: 'put',
    data
  })
}

/**
 * 删除
 * @param {*} params
 */
function deleteContact(data) {
  return request({
    url: '/contact/deleteContact',
    method: 'delete',
    data
  })
}

export {
  getPageList,
  createContact,
  updateContact,
  deleteContact
}
