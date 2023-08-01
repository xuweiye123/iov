<template>
  <div class="box divScroll">
    <p class="pTitle">基础数据管理</p>
    <ul>
      <li v-for="(item,i) in list.slice(0,3)" :key="i" @click="sysChange(item.label)">
        <img :src="require(`@/assets/images/${item.value}.png`)" >
        <p>{{item.label}}</p>
      </li>
    </ul>
    <p class="pTitle" style="padding-top: 20px;">业务平台服务</p>
    <ul>
      <li v-for="(item,i) in list.slice(3,8)" :key="i" @click="sysChange(item.label)">
        <img :src="require(`@/assets/images/${item.value}.png`)" >
        <p>{{item.label}}</p>
      </li>
    </ul>
    <div class="modle"></div>
  </div>

</template>
<script>


import { setSelectedSys } from '@/utils/auth'

// 辅助函数
export default {
	name: "fastEntry",
	data() {
		return {
      list: [
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
		};
	},

	methods: {
		/**
     * @name: 选系统
     * @param {*}
     */
    sysChange(e){
			if(
				this.$store.getters.roles.every((item)=>{ return item.isDisabled&&item.isShow&&item.functionName!=e})
			){
				this.$message.warning({
						message: "无权限",
						duration: 2 * 1000,
				});
				return false;
			}

      //有权限
      this.$store.commit("setSysSelected",e);
      setSelectedSys(e);
     
      this.$store.dispatch("delAllViews");
      this.$router.push("/");

      let arr = this.$store.state.permission.addRoutersBefore.filter((item)=>{ return item.functionNames && item.functionNames.indexOf(e) != -1  });
      this.$store.dispatch('getLeftMenu', arr);
    }
	}
};
</script>

<style lang="scss" scoped>
.box{
  position: fixed;
  overflow: auto;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 40px;
  z-index: 999;
  background: #F6F8FA;
  padding: 30px 20px 0 60px;
  box-shadow: 0px -2px 1px 1px rgb(231 233 238 / 45%);
  .pTitle{
    color: #262834;
    font-size: 16px;
  }
  .modle{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 200px;
    height: 40px;
    background: #F6F8FA;
  }
}
ul{
	display: flex;
  margin-left: -30px;
  width: 100%;
	li{
    max-width: calc(25% - 60px);
    min-width: 170px;
    height: calc(46vh - 110px);
    min-height: 170px;
    margin: 2vh 30px;
		background: #fff;
		text-align: center;
		cursor: pointer;
    border-radius: 4px;
    img{
      max-width: 100%;
      height: calc(100% - 50px);
      padding: 15px;
    }
    p{
      padding: 15px 0;
      border-top: 1px solid #EAECF3;
      color: #262834;
      font-size: 14px;
    }
    &:hover{
      box-shadow: 0px 10px 18px 0px rgba(221,224,230,0.6);
      img{
        transform: scale(1.03);
      }
      p{
        color: #1E64DD;
      }
    }
	}
}

</style>
