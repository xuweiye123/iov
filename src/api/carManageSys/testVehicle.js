import request from '@/utils/request'

/**
 * 获取试验车
 * @param {*} data 
 */
function getVehiclecarList(params){
  return request({
    url: '/testCarHandle/getTestCarList',
    method: 'get',
    params
  })
}

/**
 * 车辆报废
 * @param {*} data 
 */
function deleteBind(data){
  return request({
    url: '/testCarHandle/scrappedCar',
    method: 'post',
    data
  })
}
/**
 * 商品车转换
 * @param {*} data 
 */
function changeVehiclecar(data){
  return request({
    url: '/testCarHandle/commercialCarConversion',
    method: 'post',
    data
  })
}

/**
 * 导出
 * @param {*} data 
 */
function exportVehicleCar(data){
  return request({
    url: '/testCarHandle/exportTestCar',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// /**
//  * 终端换绑
//  * @param {*} data 
//  */
// function replaceBindData(data){
//   return request({
//     url: '/car/changeTerminal',
//     method: 'post',
//     data
//   })
// }

/**
 * 解除绑定
 * @param {*} data 
 */
function unbindData(data){
  return request({
    url: '/car/unbindCar',
    method: 'post',
    data
  })
}

export {
  getVehiclecarList,
  deleteBind,
  changeVehiclecar,
  exportVehicleCar,
  // replaceBindData,
  unbindData
}