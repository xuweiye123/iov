<template>
  <div
    class="sysSeletBox"
  >
    <el-select
      class="heardInner"
      v-model="$store.state.user.sysSelected"
      @change="sysChange($event,1)"
      placeholder="服务列表"
    >
      <div slot="prefix">
        <i
          :class="`iconfont icon-${sysValueIcon} textColor`"
          style="position: relative; left: 3px;"
        ></i>
      </div>
      <el-option
        class="specialOption"
        v-for="(item,index) in sysLists"
        :key="index"
        :label="item.label"
        :value="item.label"
      >
        
        <div>
          <i :class="`iconfont icon-${item.icon}`"></i>
          <span style="font-size: 12px; margin-left: 12px;">{{item.label}}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { wildcard } from '@/router'

import {
  setSelectedSys,
  getSelectedSys,
} from '@/utils/auth'
import { routerListss } from '@/utils/routerList'
export default {
  name: "sysSelet",
  data() {
    return {
      enterSvg: false,
      sysValue: '',
      sysValueIcon: 'userCenterSys',
      routerList: this.$store.state.permission.addRoutersBefore,
      sysLists:[]
    };
  },
  props: {},
  computed: {},
  watch: {
    $route(to,from){
      // console.log(111,to)
      let name = to.meta.systemOne;
      let y = getSelectedSys()?getSelectedSys():'用户权限管理';
      // console.log(222,name,y)
      if(
        name &&
        y != name
      ){
        this.sysChange(name,2);
      }
    }
  },
  mounted() {
    this.sysLists = [];
    console.log('selectSystem--this.routerList',this.routerList,this.$store.getters.roles)

    this.$store.getters.roles.forEach((item)=>{
      if(item.isDisabled&&item.isShow){
        let obj = {};
        obj.value = item.url;
        obj.label = item.functionName;
        obj.icon = item.icon;
        this.sysLists.push(obj);
      }
    })

    //从cookie获取上一次选中的系统
    this.sysValue = getSelectedSys();
    if(
      this.sysValue &&
      this.sysLists.some((item)=>{return item.label==this.sysValue})
    ){
      this.sysChange(this.sysValue, 2);
    }else{
      //默认用户权限管理
      this.sysValue = '用户权限管理';
      let firstArr = this.routerList.filter((item)=>{return item.functionNames&&item.functionNames.indexOf('用户权限管理')!=-1});
      if(!firstArr.length){//没有用户权限管理的权限就默认第一项
        if(this.routerList.length){
          let name = this.routerList[0].functionNames?this.routerList[0].functionNames.split("/")[0]:'';
          firstArr = this.routerList.filter((item)=>{return item.functionNames&&item.functionNames.indexOf(name)!=-1});
          this.sysValue = name;
        }
      }
      this.$store.dispatch('getLeftMenu', firstArr);
    }
    this.$store.commit("setSysSelected",this.sysValue);
    setSelectedSys(this.sysValue);
  },
  methods: {
    /**
     * @name: 下拉选系统
     * @param {*}
     */
    sysChange(e,n){
      // console.log('sysChange', e, this.routerList)
      this.$store.commit("setSysSelected",e);
      setSelectedSys(e);
      this.sysLists.forEach((item,i)=>{
        if(item.label==e){
          this.sysValueIcon = item.icon;
        }
      })
      if(n==1){
      //   this.$store.dispatch("delAllViews");
        this.$router.push("/");
      }

      let arr = this.routerList.filter((item)=>{ return item.functionNames && item.functionNames.indexOf(e) != -1  });
      this.$store.dispatch('getLeftMenu', arr);
    }
  },
};
</script>
<style lang="scss" scoped>
.sysSeletBox {
  width: 156px;
   ::v-deep  .el-select .el-input{
    height: 52px;
  }
}
</style>
