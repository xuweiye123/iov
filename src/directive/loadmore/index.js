/*
 * @Descripttion: 
 * @version: 0.3.0
 * @Author: wangcan
 * @Date: 2020-12-31 17:55:10
 * @LastEditors: wangcan
 * @LastEditTime: 2021-01-04 09:42:34
 */



import loadmore from './loadmore'

const install = function (Vue) {
  Vue.directive('loadmore', loadmore)
}

loadmore.install = install
export default loadmore