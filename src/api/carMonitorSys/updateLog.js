import request from '@/utils/request'

/**
 * 获取平台版本
 * @param {*} data 
 */
 function getPlatformVersion(params){
  return request({
    url: '/platformVersion/list',
    method: 'get',
    params
  })
}

/**
   * 新增平台版本
   */
 function addVersion(data){
  return request({
    url: '/platformVersion/create',
    method: 'post',
    data
  })
}
/**
 * 编辑平台版本
 */
   function updateVersion(data){
      return request({
        url: `/platformVersion/update`,
        method: 'put',
        data
      })
    }
 /**
 * 删除平台版本
 */
   function deleteVersion(data){
      return request({
        url: `/platformVersion/delete`,
        method: 'delete',
        data
      })
    }
    
export {
  getPlatformVersion,
  addVersion,
  updateVersion,
  deleteVersion,
}
