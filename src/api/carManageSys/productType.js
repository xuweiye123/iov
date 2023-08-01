import request from '@/utils/request'

/**
 * 获取产品型号
 */
function getProduct(params){
  return request({
    url: '/productType/getProductList',
    method: 'get',
    params
  })
}
/**
 * 新增产品型号
 */
function createProduct(data){
  return request({
    url: '/productType/createProductType',
    method: 'post',
    data
  })
}
/**
 *编辑产品型号 
 */
function updateProduct(data){
  return request({
    url: '/productType/updateProductType',
    method: 'put',
    data
  })
}
/**
 * 删除产品型号
 */
function deletePruduct(data){
  return request({
    url: '/productType/deleteProduct',
    method: 'delete',
    data
  })
}
// /**
//  * 获取字典项
//  * @param {*} params 
//  */
// function getDictionaryInfo(params){
//   return request({
//     url: '/productType/getDictionaryInfo',
//     method: 'get',
//     params
//   })
// }
/**
 * 查看详情
 * @param {*} params 
 */
function getDetails(params){
  return request({
    url: '/productType/getDetails',
    method: 'get',
    params
  })
}
/**
 * 审核
 * @param {*} data 
 */
function approval(data){
  return  request({
    url: '/productType/approval',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data 
 */
function exportProductType(data){
  return request({
    url: '/productType/exportProduct',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
export {
  getProduct,
  createProduct,
  updateProduct,
  deletePruduct,
  // getDictionaryInfo,
  getDetails,
  approval,
  exportProductType
}