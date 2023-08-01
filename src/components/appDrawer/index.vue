<!--<app-drawer
    :visibles="visibles"
    :title="!isEdit? '新增角色':'编辑角色'"
    :width="45%"
    @close-drawer="closeDrawer"
    @ok-drawer="okDrawer"
    :loading="loading"
    :isDrawerFoot="true"
  >
    <div slot="drawerContent">
      
    </div>
  </app-drawer> -->
<template>
  <div>
    <el-drawer
      custom-class="drawerBox"
      v-if="visibles"
      :visible.sync="visibles"
      :append-to-body="true"
      :modal-append-to-body="false"
      :show-close="false"
      :wrapperClosable="wrapperClosable"
      :before-close="closeDrawer"
      :size="width"
    >
      <!-- 标题 -->
      <div slot="title" class="drawerHeader">
        <div style="display: flex; align-items: center;">
          <span class="title-style"></span>
          <span class="headerLeft">{{ title }}</span>
        </div>
        <div>
          <span v-if="isFull" class="iconFull" @click="handleFull">
            <i :class="isFulls?'iconfont icon-closeFullScreen':'iconfont icon-fullScreen'"></i>
          </span>
          <span @click="closeDrawer">
					  <i class="iconfont icon-close"></i>
          </span>
        </div>
      </div>


      <!-- body -->
      <div v-loading="loading" class="drawerBody divScroll">
        <!-- 内容插槽 -->
        <slot name="drawerContent"></slot>  
      </div>

      <!-- footer -->
      <div class="drawerFoot" v-if="isDrawerFoot">
        <slot name="footerButton">
          <span v-if="type=='footerSpecial'">
            <el-button v-waves @click="closeDrawer">{{ closeText }}</el-button>
            <el-button 
              v-waves 
              type="primary" 
              @click="okDrawer1"
              :loading="isOkButLoading"
              >{{ confirmText1 }}</el-button>
            <el-button 
              v-waves 
              type="primary" 
              @click="okDrawer"
              :loading="isOkButLoading"
              >{{ confirmText }}</el-button>
          </span>
          <span v-else>
            <el-button
              v-waves
              v-preventReClick
              type="default"
              @click="closeDrawer"
            >
            {{ closeText0 }}
              <!-- 取消 -->
            </el-button>
            <el-button
              v-waves
              v-preventReClick
              :loading="isOkButLoading"
              type="primary"
              @click="okDrawer"
            >
              <!-- 确定 -->
              {{ confirmText0 }}
            </el-button>
          </span>
        </slot>
      </div>
      <div :class="isMask?'mask':''"></div>
    </el-drawer>
  </div>

</template>

<script>
export default {
  name: "appDrawer",
  props: {
    visibles: {
      typeof: Boolean,
      default: false,
    },
    wrapperClosable: {//点击遮罩层是否能关闭抽屉
      typeof: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '50%',
    },
    title: {
      type: String,
      default: '标题',
    },
    loading: {//抽屉内容加载时loading效果
      typeof: Boolean,
      default: false,
    },
    isDrawerFoot: {//底部按钮是否需要展示
      typeof: Boolean,
      default: true,
    },
    isOkButLoading: {//底部确定按钮加载时是否禁用
      typeof: Boolean,
      default: false,
    },
    confirmText0:{
      type: String,
      default: '确 定',
    },
    confirmText:{
      type: String,
      default: '确 定',
    },
    confirmText1:{
      type: String,
      default: '确定&关闭',
    },
    closeText0:{
      type: String,
      default: '取 消',
    },
    closeText:{
      type: String,
      default: '取 消',
    },
    type:{
      type: String,
      default: '', //default: 'import'表示导入弹出层对应的按钮；default: ''表示普通的“关闭，保存”按钮
    },
    isFull:{
      typeof: Boolean,
      default: false,
    },
    isFulls:{
      typeof: Boolean,
      default: false,
    },
     isMask:{
      typeof: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isHover: false,
    };
  },
	watch: {
    visibles(e1) {
      if (e1) {
        this.$nextTick(()=>{
          this.$store.commit("app/setDisTooltip",true);
          if(document.querySelector('.el-drawer .el-table .el-table__fixed-right')){//当抽屉中也有表格且有操作列时
            this.$store.commit("app/setDisTooltip",false);
          }

					let headerHeight = 0;
					if(document.querySelector(".el-drawer__header")){
						headerHeight = document.querySelector(".el-drawer__header").offsetHeight + 20;//20为 drawer__header 的 margin-bottom
					}

					let footerHeight = 0;
					if(document.querySelector(".drawerFoot")){
						footerHeight = 50;
					}

					let dialogBodyHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px - 20px )`;
					document.querySelector(".drawerBody").style.maxHeight = dialogBodyHeight;
				})
      }else{
        this.$store.commit("app/setDisTooltip",false);
      }
    },
  },
  methods: {
    // 取消、关闭Drawer
    closeDrawer() {
      this.$emit("close-drawer")
    },
    // 确定按钮
    okDrawer() {
      this.$emit("ok-drawer")
    },
    // 确定按钮
    okDrawer1() {
      this.$emit("ok-drawer1")
    },
    // 全屏
    handleFull() {
      this.$emit("click-full")
    },
  },
};
</script>
<style lang="scss">
.drawerBox{
  // z-index: 2000;
  border-radius: 4px 0px 0px 0px;
  .drawerHeader{
    display: flex;
    justify-content: space-between;
    
    .headerLeft{
      font-size: 16px;
    }
    .headerRight{
      cursor: pointer;
      font-size: 16px;
    }
  }
  .el-drawer__body{
    padding: 0 20px;
  }
  .drawerFoot{
    position: absolute;
    bottom: 20px;
    left: calc(50% - 59px);
  }
}
.drawerBody{
  height: 100%;
}
.iconFull{
  cursor: pointer;
  margin-right: 20px;
}
.mask{
   position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.4);
}
</style>
