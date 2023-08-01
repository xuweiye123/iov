import request from '@/utils/request'

/**
 * 获取诊断日志
 * @param {*} data 
 */
function getDxOperLog(data){
  return request({
    url: '/diagnosisLog/getDxOperLog',
    method: 'post',
    data
  })
}
/**
 * 导出诊断日志
 * @param {*} data 
 */
function exportDigLog(data){
  return request({
    url: '/diagnosisLog/exportDxOperLog',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}
/**
 * 获取诊断结果
 * @param {*} data 
 */
function getDxResult(params){
  return request({
    url: '/operLog/getDxResult',
    method: 'get',
    params
  })
}
function getDxResultDataStream(data){
  return request({
		url: "/diagnosisLog/getDxResultDataStream",
		method: "post",
		data,
	});
}
/**
 * 查看诊断命令
 * @param {*} data 
 */
function getDxProtocolJson(params){
  return request({
    url: '/diagnosisLog/getDxProtocolJson',
    method: 'get',
    params
  })
}
export {
  getDxOperLog,
  exportDigLog,
  getDxResult,
  getDxResultDataStream,
  getDxProtocolJson,
}