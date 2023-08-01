import request from '@/utils/request'
/**
 * 获取产品型号信息
 * @param {*} data 
 */
function getProductmodelList(data){
    return request({
      url: 'model/list',
      method: 'post',
      data
    })
  }

/**
 * 新增产型号信息
 * @param {*} data 
 */
function ProductmodelAdd(data){
    return request({
      url: '/model/create',
      method: 'post',
      data
    })
  }


/**
 * 修改产品型号信息
 * @param {*} data 
 */
function ProductmodelUpdate(data){
    return request({
      url: '/model/update',
      method: 'put',
      data
    })
  }

/**
 * 删除产品型号信息
 * @param {*} data 
 */
function ProductmodelDel(data){
    return request({
      url: '/model/delete',
      method: 'delete',
      data
    })
  }
     /**
 * 导出产品型号
 * @param {*} data 
 */
function exportProductmodel(data){
  return request({
      url:'/model/export',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
    /**
 * 导出错误信息
 * @param {*} data 
 */
function exportCheck(data){
  return request({
      url:'/model/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
     /**
 * 导入产品型号
 */
function importProductmodel(data){
  return request({
      url:'/model/import',
      method:'post',
      data
  })
}
     /**
 * 开通状态
 */
function isOper(data){
  return request({
      url:'model/isOper',
      method:'post',
      data
  })
}

export {
    getProductmodelList,
    ProductmodelAdd,
    ProductmodelUpdate,
    ProductmodelDel,
    exportProductmodel,
    importProductmodel,
    isOper,
    exportCheck
}