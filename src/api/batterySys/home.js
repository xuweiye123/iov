import request from '@/utils/request'
/**
 * 获取单车gps信息
 */
function getGPS(id) {
  return request({
    url: `/map/gps/${id}`,
    method: 'get'
  })
}
/**
 * 获取单车信息
 */
function getInfo(id) {
  return request({
    url: `/map/car/info/${id}`,
    method: 'get'
  })
}
/**
 * 获取获取所有车辆GPS信息
 */
function getAllGps() {
  return request({
    url: '/map/all/gps',
    method: 'get'
  })
}
/**
 * 获取统计数量
 */
function getStatisticsCount() {
  return request({
    url: '/home/getStatisticsCount',
    method: 'post'
  })
}
/**
 * 获取前五里程车辆
 */
function getMileageTop() {
    return request({
      url: '/home/getMileageTop',
      method: 'post'
    })
  }
  /**
 * 获取前五故障车辆
 */
function getFaultTop() {
    return request({
      url: '/home/getFaultTop',
      method: 'post'
    })
  }
/**
 * 获取前五驾驶行为平均分车辆
 */
function getAvgScoreTop() {
    return request({
      url: '/home/getAvgScoreTop',
      method: 'post'
    })
  }
  /**
 * 获取前五急加速次数车辆
 */
function getHarshAccelerationTop() {
    return request({
      url: '/home/getHarshAccelerationTop',
      method: 'post'
    })
  }
  /**
 * 获取前五急转弯次数车辆
 */
function getHarshTurnTop() {
    return request({
      url: '/home/getHarshTurnTop',
      method: 'post'
    })
  }
  /**
 * 获取前五急减速次数车辆
 */
function getHarshDecelerationTop() {
    return request({
      url: '/home/getHarshDecelerationTop',
      method: 'post'
    })
  }
    /**
 * 获取车辆生产信息统计+车辆维修信息统计
 */
function getCarStatis() {
  return request({
    url: '/home/getCarStatis',
    method: 'post'
  })
}
   /**
 * 电池退役信息统计
 */
function getRetireStatis() {
  return request({
    url: '/home/getRetireStatis',
    method: 'post'
  })
}
   /**
 * 回收网点电池信息统计
 */
function getRecycsStatis() {
  return request({
    url: '/home/getRecycsStatis',
    method: 'post'
  })
}
   /**
 * 车辆换电信息统计
 */
function getChangStatis() {
  return request({
    url: '/home/getChangStatis',
    method: 'post'
  })
}
   /**
 * 车型电池规格信息统计
 */
function getModuleStatis() {
  return request({
    url: '/home/getModuleStatis',
    method: 'post'
  })
}
  export{getCarStatis,getRetireStatis,getRecycsStatis,getChangStatis,getModuleStatis,getGPS,getInfo,getAllGps,getStatisticsCount,getMileageTop,getFaultTop,getAvgScoreTop,getHarshAccelerationTop,getHarshTurnTop,getHarshDecelerationTop}
