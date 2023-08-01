<template>
 <!-- style="opacity: 0;" -->
  <div class="footFix">
      <div style="opacity: 0;">
        <el-breadcrumb separator=">">
          <!-- to为点击跳转 title为路由中的meta属性定义的标题 -->
          <el-breadcrumb-item
            v-for="(v, i) in breadList"
            :key="i"
            :to="v.meta.path"
            >{{ v.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>

      </div>
      <div>
        <svg-icon icon-class="icon_banben" class="textColor" />
        平台版本：<span class="textColor">1.0</span>
        <span style="margin-left:20px">
          <svg-icon icon-class="icon_shijian" class="textColor" />
          当前时间：{{time}}
        </span>
      </div>
  </div>
</template>

<script>
import { getNowTime } from "@/utils/common";
export default {
  data() {
    return {
      breadList: [],
      time: ""
    };
  },
  created() {
    this.getBreadcrumb();
  },

  mounted() {
    this.getTime();
  },
  watch: {
    $route() {
      document.querySelector(".footFix").style.display = 
                this.$route.path === "/home" ?
                "none" :
                "flex";
      this.getBreadcrumb();
    },
  },
  methods: {
    isHome(route) {
      return route.name === "home";
    },
    getBreadcrumb() {
      let matched = this.$route.matched;
      //如果不是首页
      if (!this.isHome(matched[0])) {
        matched = [].concat(matched);
      }
      this.breadList = matched;
      this.$nextTick(()=>{
        let num = this.$store.state.app.sidebarCollapse?'106px':'240px';
        document.querySelector(".footFix").style.width = `calc(100% - ${num})`;
      })
    },
    getTime(){
      setInterval(()=>{
        this.time = getNowTime()
      },1000)
    }

  },
};
</script>

<style lang="scss">
.footFix{
  height: 40px;
  position: fixed;
  bottom: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 0 16px;
  transition: all 0.35s ease-out;
}
</style>
