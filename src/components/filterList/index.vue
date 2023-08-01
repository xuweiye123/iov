
<!--
 * 使用示例
 *  <checked-Filter
 *    :show.sync="showfilter"
 *     :change="change"
 *     :list="tableList"
 *     scrollLine="5"
 *   />
 * 组件说明
 * height组件高度
 * by linlei 2019-08-09
 -->
<template>
  <div v-show="show" :style="{height: list.length > scrollLine ? ( lineHeight * scrollLine +'px'): (list.length * lineHeight +'px') }" class="checked-filter">
    <el-scrollbar style="height:100%;" wrap-class="default-scrollbar__wrap">
      <ul class="check-ul">
        <li v-for="(item,index) in list" :key="index" class="check-li">
          <el-checkbox 
          v-model="item.checked"
          @change="checked=>{let e=Object.assign(item,{checked}); return change(e)}">
            <span class="check-span">{{ item.value }}</span>
          </el-checkbox>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'CheckedFilter',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    change: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    scrollLine: {
      type: [Number,String],
      default: 5
    }
  },
  computed:{
    
  },
  data(){
    return {
      lineHeight: 35
    }
  },
  mounted() {
    // const dom = document.getElementById('app')
    const checkedDom = document.querySelector('.check-ul')
    const _this = this
    window.addEventListener('click', function(event) {
      const targetDom = event.target
      //（新） 判断targetDom(当前点击的元素)是否在checkedDom元素之内  若在checkedDom元素之内 就不隐藏  反之则隐藏
      if (checkedDom.contains(targetDom)) {
        return false
      }
      // 旧
      // if (_this.isParent(targetDom, checkedDom)) {
      //   return false
      // }
      _this.$emit('update:show', false)
    },false)
  },
  beforeDestroy(){
    window.removeEventListener('click', ()=>{});
  },
  methods: {
    // 旧
    // isParent(obj, parentObj) {
    //   while (obj !== undefined && obj != null && obj.tagName.toUpperCase() !== 'BODY') {
    //     if (obj === parentObj) {
    //       return true
    //     }
    //     obj = obj.parentNode
    //   }
    //   return false
    // }
  }

}
</script>

<style lang='scss' scoped>
*{
  padding: 0;
  margin: 0;
}
  .checked-filter{
   
    position:absolute;
    top: 33px;
    background: #fff;
    // border:1px solid #C0C4CC;
    // padding: 0 0 0 10px;
    z-index: 999999;
    right:5px;
    border-radius: 4px;
    // box-shadow: 0 2px 4px rgba(0,0,0,.12);

        border-color: rgba(0, 0, 0, 0.09);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    .check-ul{
      .check-li{
        padding:8px 10px;
        color: rgba(0, 0, 0, .65);
        .check-span{
          padding-right:15px;
        }
      }
    }

  }
</style>
