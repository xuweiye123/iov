import request from "@/utils/request";
// 远程控制首页使用次数
function queryRemoteCount(params) {
  return request({
    method: 'GET',
    url: '/home/queryRemoteCount',
    params
  })
}
// TOP渠道
function getRemoteChannel() {
  return request({
    method: 'post',
    url: '/home/getRemoteChannel',
  })
}
// 远程控制首页查询当天书简短远控次数
function queryControlSumToday(params) {
  return request({
    method: 'GET',
    url: '/home/queryControlSumToday',
    params
  })
}
// 远程控制首页查询六种控制类型操作次数
function queryRemoteTypeSum(params) {
  return request({
    method: 'GET',
    url: '/home/queryRemoteTypeSum',
    params
  })
}
export {queryRemoteCount,queryRemoteTypeSum,queryControlSumToday,getRemoteChannel};
