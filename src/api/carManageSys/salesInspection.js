import request from '@/utils/request'
/**
 * 获取
 * @param {*} data
 */
function getPagelist(data) {
  return request({
    url: '/afterSaleCheck/getCarInfo',
    method: 'post',
    data
  })
}


export {
  getPagelist,

}
