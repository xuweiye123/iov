/*
 * @Descripttion: 
 * @version: 0.3.0
 * @Author: wangcan
 * @Date: 2021-01-04 09:41:54
 * @LastEditors: wangcan
 * @LastEditTime: 2021-01-04 09:43:18
 */


export default {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    // console.log(222222)
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    SELECTWRAP_DOM.addEventListener('scroll', function () {
      const CONDITION = this.scrollHeight - this.scrollTop -1<= this.clientHeight
      // console.log(SELECTWRAP_DOM,11111111,this.scrollHeight,this.scrollTop,this.clientHeight,CONDITION)
      if (CONDITION) {
        binding.value()
        console.log(11111111)
      }
    })
  }
}
