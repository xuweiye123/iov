import request from '@/utils/request'

/**
 * 获取终端
 */
function getTerminalList(data){
  return request({
    url: '/terminal/getTerminalList',
    method: 'post',
    data
  })
}
/**
 * 新增终端
 */
function createTerminalCode(data) { 
  return request({
    url: '/terminal/createTerminalCode',
    method: 'post',
    data
  })
}
/**
 * 编辑终端
 */
function updateTerminalCode(data){
  return request({
    url: '/terminal/updateTerminalCode',
    method: 'put',
    data
  })
}

/**
 * 删除终端
 */
function deleteTerminalCode(data){
  return request({
    url: '/terminal/deleteTerminalCode',
    method: 'delete',
    data
  })
}
// /**
//  * 获取终端绑定SIM卡
//  */
// function getTerminalToSim(data){
//   return request({
//     url: '/terminal/getTerminalToSim',
//     method: 'post',
//     data
//   })
// }

/**
 * 导出失败终端信息
 */
function exportCheckTerminal(data){
  return request({
    url: '/terminal/exportCheckTerminal',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

/**
 * 终端导入&SIM卡绑定
 */
function importSimToTerminal(){
  return request({
    url: '/terminal/importSimToTerminal',
    method: 'post',
  })
}

/**
 * 导出终端信息
 */
function exportTerminal(data){
  return request({
    url: '/terminal/exportTerminal',
    method: 'post',
    data
  })
}
/**
 * 查看绑定历史
 */
function getHistory(data){
  return request({
    url: '/terminal/getHistoryRecord',
    method: 'post',
    data
  })
}

export {
  getTerminalList,
  createTerminalCode,
  updateTerminalCode,
  deleteTerminalCode,
  // getTerminalToSim,
  exportCheckTerminal,
  importSimToTerminal,
  exportTerminal,
  getHistory
}