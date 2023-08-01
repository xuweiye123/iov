<template>
  <div>
    <div class="finishBox">
      <img
        :src="
          require(`@/assets/images/theme/${$store.state.theme.activeName}/finish.png`)
        "
        style="width:247px;height:142px;"
        alt=""
      />
      <div style="text-align: center;">
        <div class="topText">账户{{isEdit?'编辑':'新建'}}完成</div>
        <div style="color: #262834;">工作邮箱：<a>{{q.email}}</a>可以正常登录系统！</div>
      </div>
    </div>
    <div class="footerBut">
      <el-button
        v-waves
        v-preventReClick
        type="primary"
        @click="submit"
        :disabled="false"
      >完成</el-button>
    </div>
  </div>
</template>
<script>
// request
import {

} from '@/api/system/user'
import {
  
} from '@/api/system/role'

export default {
  // 组件名称
  name: 'step4',
  // 组件参数 接收来自父组件的数据
  props: {
    q:{
      type:Object,
    },
    isEdit: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      
    };
  },
  mounted(){

  },
  methods: {
    /**
     * @name: 完成
     * @param {*}
     */
    submit(){
      this.$emit('addUpdateClose');
    },
  }
};
</script>
<style lang="scss" scoped>
.finishBox{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 45px;
  .topText{
    font-size: 20px;
    margin-bottom: 14px;
    color: #262834;
    font-weight: bold;
  }
}
.footerBut{
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>
