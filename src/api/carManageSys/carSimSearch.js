import request from '@/utils/request'

/**
 *获取车辆SIM卡查询数据
 * @param {*} data
 */
function getPageList(data) {
  return request({
    url: '/simQueryTask/getPageList',
    method: 'post',
    data
  })
}

/**
 *新建任务
 * @param {*} data
 */
function createSIMsearch(data) {
  return request({
    url: '/simQueryTask/create',
    method: 'post',
    data
  })
}

/**
 *删除任务
 * @param {*} data
 */
function deleteSIMsearch(data) {
  return request({
    url: '/simQueryTask/delete',
    method: 'delete',
    data
  })
}

/**
 *导出任务明细
 * @param {*} data
 */
function exportDetail(data) {
  return request({
    url: '/simQueryTask/exportDetail',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 选择车辆
 * @param {*} data 
 */
 function getChooseCar(data){
  return request({
    url: '/simQueryTask/getCanSelectedCarPageList',
    method: 'post',
    data
  })
}
export {
  getPageList,
  createSIMsearch,
  deleteSIMsearch,
  exportDetail,
  getChooseCar
}