/**
 * 分页查询混入
 * 组件必须有一个listLoad方法用来加载列表数据
 */
import { _getNewPageButton } from '@/utils/getButton'
const getPageButton = {
  data: function() {
    return {
      authouizeList: [],
      headersLeftList:[],
      headersRightList:[],
      insideList:[]
    }
  },
  /**
   * 组件挂载自动查询
   */
  created() {
    if (!this.$options.doNotButton) {
      this.authouizeList = _getNewPageButton(this.$route.name).filter(item => item.isDisabled);
      
      // 表头左
      this.headersLeftList=this.authouizeList.filter(item => item.buttonPosition==1);
      // 表头右
      this.headersRightList=this.authouizeList.filter(item => item.buttonPosition==2);
      //表内
      this.insideList=this.authouizeList.filter(item => item.buttonPosition==3);
    }
  }
}
export {
  getPageButton
}
