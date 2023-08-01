
<template>
  <div class="app-screen">
    <div
      :class="classObj"
      class="app-wrapper app-layout"
    >
      <!-- 头部 -->
      <div class="app-header app-layout">
        <i
          class="app-logo"
          style="text-align: center; display: flex;"
        >
        <img
          v-for="(item,index) of list"
          :key="index"
          :src="require(`@/assets/images/logo_in_${item.value}.png`)"
          alt=""
          v-show="$store.state.user.sysSelectedEn == item.value"
          style="margin-right: 12px; cursor: pointer;"
          @click="fastEn"
        />
        <!-- <span style="font-weight: bold;">智能车云平台</span> -->
        </i>
        <div class="app-header-right rightClass">
          <hamburger />
          <div class="app-breadcrumb el-breadcrumb" />
          <!-- <app-map v-show="isShowMap"  class="can-hover" /> -->
          <!-- <select-system style="margin-right: 10px;" /> -->

          <!-- <el-tooltip content="功能导航" effect="dark" >
            <div class="btn-icon iconBg" @click="navigationFc">
              <i class="iconfont icon-navigationFunction"></i>
            </div>
          </el-tooltip>
          <theme class="can-hover" style="margin:0 10px;" /> -->
          <div @click="clickJump(item)" v-for="(item,index) in fastEntryArr" :key="index" v-show="$store.state.user.sysSelectedEn == 'fastEntry'" class="jumpPlatform" style="padding: 0 8px;margin-right: 10px;">
            <i :class='"iconfont icon-"+item.icon' style="margin-right:5px"></i>
            {{ item.menuName }}
          </div>
          <div @click="clickJump(item)" v-for="(item,index1) in carManageSysArr" :key="index1+'0'" v-show="$store.state.user.sysSelectedEn == 'carManageSys'" class="jumpPlatform" style="padding: 0 8px;margin-right: 10px;">
            <i :class='"iconfont icon-"+item.icon' style="margin-right:5px"></i>
            {{ item.menuName }}
          </div>
          <headersetting />
        </div>
      </div>
      <!-- 布局 -->
      <div class="app-body app-layout">
        <sidebar :class="[$store.state.app.language,'app-sidebar']" />
        <div class="app-main-wrapper app-layout">
          <tags-view />
          <app-main />
          <foot-fixed v-show="$store.isShowFootFixed" />

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Sidebar, AppMain, TagsView, footFixed } from "./components";
import Hamburger from "@/components/Hamburger";
import Headersetting from "@/components/HeaderSetting";
import selectSystem from "@/components/selectSystem";
import Theme from "@/components/Theme";
import {
  setSelectedSys,
  getSelectedSys
} from '@/utils/auth'
// import AppMap from '@/components/map'
import { mapGetters } from "vuex";
// import { getPageButton } from "@/mixins/getButton";
export default {
  name: "Layout",
  components: {
    Hamburger,
    Headersetting,
    selectSystem,
    Sidebar,
    AppMain,
    TagsView,
    footFixed,
    Theme,
    // AppMap
  },
  data() {
    return {
      sysValue: '',
      searchActive: false,
      isShowMap:false,
      list: [
        {
          value: "fastEntry",
          label: "快速入口",
        },
        {
          value: "userCenterSys",
          label: "用户权限管理",
        }, 
        {
          value: "transmitSys",
          label: "数据转发管理",
        },
        {
          value:"carManageSys",
          label:"汽车管理",
        },
        {
          value:"carMonitorSys",
          label:"远程监控服务",
        },
        {
          value:"diagnosisSys",
          label:"远程诊断服务",
        },
        {
          value:"carControlSys",
          label:"远程控制服务",
        },
        {
          value:"batterySys",
          label:"电池溯源服务",
        }
      ],
      fastEntryArr:[],
      carManageSysArr:[],
    };
  },
  mounted(){
    //从cookie获取上一次选中的系统
    this.sysValue = getSelectedSys();
    if(
      this.sysValue &&
      this.$store.getters.roles.some((item)=>{return item.isDisabled&&item.isShow&&item.functionName==this.sysValue})
    ){
      let arr = this.$store.state.permission.addRoutersBefore.filter((item)=>{ return item.functionNames && item.functionNames.indexOf(this.sysValue) != -1  });
      this.$store.dispatch('getLeftMenu', arr);
    }else{
      this.sysValue = '快速入口'
    }

    this.$store.commit("setSysSelected",this.sysValue);
    setSelectedSys(this.sysValue);
    console.log(this.$store.state.user.sysSelectedEn);
    // console.log(this.authouize,typeof(this.authouize),11,this.isShowMap)
    // this.authouize.forEach(i => {
    //   if(i.url=="fullScreen" && i.isShow=='1'){
    //       this.isShowMap=true
    //   }
    // });
    this.fastEntryArr = this.$store.state.permission.addRouters.map((item)=>{
				if(
          item.name == 'certificateAssets'
					|| item.name == 'ota'
					|| item.name == 'electricalInspection'
				){
					return item
				}
			}).filter(d=>d);
      this.carManageSysArr = this.$store.state.permission.addRouters.map((item)=>{
				if(
					item.name == 'digitalKey'
				){
					return item
				}
			}).filter(d=>d);
  },
  computed: {
    animation() {
      return this.$store.state.app.animation;
    },
    sidebarCollapse() {
      return this.$store.state.app.sidebarCollapse;
    },
    authouize() { 
      return this.$store.getters.roles
    },

    classObj() {
      return {
        animation: this.animation,
        collapse: this.sidebarCollapse,
        "search-active": this.searchActive,
      };
    },
    ...mapGetters(["addRealRouters"]),
  },
  watch: {
		$route: {
			handler: function(val) {
        document.querySelector(".btn-icon.menu-toggle").style.display = val.name == "fastEntry"?'none':'block';
			},
			deep: true,
		},
  },
  methods: {
    clickJump(item){
      console.log(item,123)
      if(item.permission){
        window.name = "jumpAddress";
			  window.open(item.permission, "jumpAddresss");
      }
    },
    navigationFc(){
      this.$router.push({ name: 'navigationAll' });
    },
    fastEn(){
      this.$store.commit("setSysSelected",'快速入口');
      setSelectedSys('快速入口');
      this.$router.push({ name: 'fastEntry' });
    },
  },
};
</script>
<style lang="scss">
// 注册主题
@import "@/styles/theme/register.scss";
.app-logo{
  margin: 0 24px 0 20px;
  img{
    // margin: 18px 5px 0 0;    
    height: 32px;
  }
  span{
    font-style: normal;
    font-size: 24px;
  }
}
.rightClass{
  display: flex;
  align-items:center;
}
</style>
