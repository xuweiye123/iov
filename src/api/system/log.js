
import request from '@/utils/request'

/**
 * 获取用户登录日志 
 */
function getLoginLog(data){
  return request({
    url: '/loginLog/getLoginLog',
    method: 'post',
    data
  })
}

/**
 * 获取操作日志 
 */
 function getOperatingLog(data){
  return request({
    url: '/operatingLog/getOperatingLog',
    method: 'post',
    data
  })
}

/**
 * 获取用户生命周期日志 
 */
 function getLifecycleLog(data){
  return request({
    url: '/userLifecycleLog/getLifecycleLog',
    method: 'post',
    data
  })
}

/**
 * 获取用户生命周期日志类型 
 */
 function getLogType(){
  return request({
    url: '/userLifecycleLog/getLogType',
    method: 'get'
  })
}


export {
  getLoginLog,
  getOperatingLog,
  getLifecycleLog,
  getLogType
}
