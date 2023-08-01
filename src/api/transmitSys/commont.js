
import request from '@/utils/request'

/**
 * 获取页面按钮权限
 * @param {*} params
 */
function getPageButton(params) {
  return request({
    url: '/login/getmenubtns',
    method: 'get',
    params
  })
}
/**
 * 获取版本号
 * @param {*} params
 */
function getVersion(params) {
  return request({
    url: 'http://192.168.1.34:3000/mock/554/common/version',
    method: 'get',
    params
  })
}


/**
 * 文件下载 
 * @param {*} 
 */
function uploadDownFile(data) {
  return request({
    url: '/upgrade/fileDownload',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
/**
 * 模板下载 
 * @param {*} 
 */
function uploadDownTemplate(data) {
  return request({
    url: '/user/downloadExcel',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}


// *************************************************************
/**
 * 角色下拉框
 * @param {*} 
 */
 function dropRole() {
  return request({
    url: '/user/role/list',
    method: 'get',
  })
}


/**
 * 导出校验失败车辆
 * @param {*}  
 */
 function exportErrorCar(data){
  return request({
      url: `/task/exportCheckFailedCar`,
      method: 'post',
      data,
      responseType: 'arraybuffer'
  })
}

/**
 * 导出校验成功车辆
 * @param {*}  
 */
 function exportSuccessCar(data){
  return request({
      url: `/car/exportCar`,
      method: 'post',
      data,
      responseType: 'arraybuffer'
  })
}

/**
 * 导出任务校验成功车辆
 * @param {*}  
 */
 function exportSuccessTaskCar(data){
  return request({
      url: `/task/exportCheckSuccessCar`,
      method: 'post',
      data,
      responseType: 'arraybuffer'
  })
}

/**
 * 获取协议列表
 */
 function getProtocolList() {
  return request({
    url: 'common/getProtocolList',
    method: 'get'
  })
}
/**
 * 获取协议数据项列表
 * @param {*} data
 */
function getProtocolParamList(data) {
  return request({
    url: 'common/getProtocolVariableList',
    method: 'post',
    data
  })
}
/**
 * 获取协议插件列表
 */
 function getProtocolModuleList() {
		return request({
			url: "common/getProtocolModuleList",
			method: "get",
		});
 }
/**
 * 获取转发目标平台列表
 */
 function getForwardTargetList() {
  return request({
    url: 'common/getForwardTargetList',
    method: 'get'
  })
}

/**
 * 获取转发服务主机信息
 */
 function getServerList() {
  return request({
    url: 'forwardLink/getServerInfo',
    method: 'get'
  })
}

//链路
function getLinkIdList(data) {
  return request({
    url: 'forwardLog/getLinkIdList',
    method: 'post',
    data
  })
}
export {
  getPageButton,
  getVersion,
  uploadDownFile,
  uploadDownTemplate,
  // ***********************
  dropRole,
  exportErrorCar,
  exportSuccessCar,
  exportSuccessTaskCar,
  getProtocolList,
  getProtocolParamList,
  getProtocolModuleList,
  getForwardTargetList,
  getServerList,
  getLinkIdList
}
