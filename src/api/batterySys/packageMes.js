import request from '@/utils/request'

/**
 * 获取电池包信息列表
 * @param data
 * @returns {AxiosPromise}
 */
function getList(data) {
    return request({
        url:'/psn/list',
        method:'post',
        data
    })
}

/**
 * 导出电池包信息
 * @param data
 * @returns {AxiosPromise}
 */
function exportPsnManager(data) {
    return request({
        url:'/psn/export',
        method:'post',
        data
    })
}

/**
 * 查看绑定电池模块信息
 * @param data
 * @returns {AxiosPromise}
 */
function lookDcmk(data) {
    return request({
        url:'/psn/msnrecord',
        method:'post',
        data
    })
}
/**
 * 查看绑定电池单体信息
 * @param data
 * @returns {AxiosPromise}
 */
function lookDcdt(data) {
    return request({
        url:'/psn/trcsnrecord',
        method:'post',
        data
    })
}
/**
 * 删除
 * @param {*} data 
 */
function dcbDel(data){
    return request({
      url: '/psn/delete',
      method: 'delete',
      data
    })
  }

  
/**
 * 根据电池包编码批量导出
 * @param {*} data 
 */
 function exportByPsnCodeList(data){
    return request({
        url:'/psn/exportByPsnCodeList',
        method:'post',
        responseType: 'arraybuffer',
        data
    })
  }

export {
    getList,
    exportPsnManager,
    lookDcmk,
    lookDcdt,
    dcbDel,
    exportByPsnCodeList
}