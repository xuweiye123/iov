import request from '@/utils/request'
/**
 * 获取配置号信息
 * @param {*} data 
 */
function getConfigureList(data){
    return request({
      url: '/configure/list',
      method: 'post',
      data
    })
  }

/**
 * 新增配置号信息
 * @param {*} data 
 */
function configureAdd(data){
    return request({
      url: '/configure/create',
      method: 'post',
      data
    })
  }


/**
 * 删除配置号信息
 * @param {*} data 
 */
function configureDel(data){
    return request({
      url: '/configure/delete',
      method: 'delete',
      data
    })
  }
     /**
 * 导出配置号
 * @param {*} data 
 */
function exportConfigure(data){
  return request({
      url:'/configure/export',
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
      url:'/configure/exportCheck',
      method:'post',
      responseType: 'arraybuffer',
      data
  })
}
     /**
 * 导入配置号
 */
function importConfigure(data){
  return request({
      url:'/configure/import',
      method:'post',
      data
  })
}
    /**
 * 绑定
 */
function bind(data){
    return request({
        url:'/configure/bind',
        method:'post',
        data
    })
  }
      /**
 * 解绑
 */
function unbindConfig(data){
    return request({
        url:'/configure/unbind',
        method:'post',
        data
    })
  }
       /**
 * 获取电池包规格和未绑定电池包规格
 */
function bindPackage(data){
    return request({
        url:'/common/bindPackage',
        method:'post',
        data
    })
  }
       /**
 * 获取绑定电池包
 */
function bindPackages(data){
    return request({
        url:'/common/unbindPackage',
        method:'post',
        data
    })
  }
        /**
 * 获取车型公告号
 */
function getProductModule(data){
    return request({
        url:'/common/getProductModule',
        method:'get',
        data
    })
  }

          /**
 * 查看电池包厂商规格
 */
function getCell(data){
    return request({
        url:'/configure/SyBatPackage',
        method:'post',
        data
    })
  }
            /**
 * 查看电池包厂商规格
 */
function getPackage(data){
  return request({
      url:'/common/getPackage',
      method:'get',
      data
  })
}

  

export {
    getPackage,
    getConfigureList,
    configureAdd,
    configureDel,
    exportConfigure,
    importConfigure,
    bind,
    unbindConfig,
    bindPackage,
    getProductModule,
    bindPackages,
    getCell,
    exportCheck
}