import request from '@/utils/request'
/**
 * 获取生产厂商信息
 * @param {*} data 
 */
function getsupplierList(data){
    return request({
      url: 'supplier/list',
      method: 'post',
      data
    })
  }
  /**
 * 新增厂商
 */
  function createSupplier(data){
      return request({
          url:'supplier/add',
          method:'post',
          data
      })
  }
   /**
 * 修改厂商
 */
  function updateSupplier(data){
    return request({
        url:'supplier/update',
        method:'put',
        data
    })
  }
   /**
 * 删除厂商
 */
  function deleteSupplier(data){
    return request({
        url:'supplier/delete',
        method:'delete',
        data
    })
  }
   /**
 * 导出厂商
 */
function exportSupplier(data){
    return request({
        url:'supplier/export',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }
  export {
    getsupplierList,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    exportSupplier
  }