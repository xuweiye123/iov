
import clearTableIndex from './clearTableIndex'

const install = function (Vue) {
  Vue.directive('clearTableIndex', clearTableIndex)
}

clearTableIndex.install = install
export default clearTableIndex