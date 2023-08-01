<template>
  <div class="js-system-user app-container">
    <div class="navigationAllDivBox" v-loading="loading">
      <!-- <h2>网站地图</h2> -->
      <div class="divTree divScroll">
          <!-- :style="{width: `calc(90% / ${treeData.length})`}" -->
        <div
          v-for="(item,index) in treeData"
          :key="index"
          :style="{minWidth: '200px',width: '200px'}"
        >
          <div class="topTitle">
            {{item.functionName}}
          </div>

            <!-- @node-click="nodeClick" -->
          <el-tree
            ref="tree"
            class="tree-line divScroll"
            :data="[item]"
            node-key="functionId"
            :default-expand-all="true"
            :expand-on-click-node="true"
            :props="defaultProps"
            style="height: calc(100vh - 223px); margin-bottom: 20px; padding-bottom:5px;"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ data }"
            >
              <span v-if="data.functionType===1">
                <span>
                  <el-tag type="info" effect="dark" @click="nodeClick(data)">
                    {{ data.functionName }}
                  </el-tag>
                </span>
              </span>
              <span v-else>
                <span>{{ data.functionName }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 混入

// utils
import { isValue } from "@/utils/common";
import { setSelectedSys } from '@/utils/auth'


// request


// 辅助函数
export default {
  name: "navigationAll",
  mixins: [
    
  ],
  data() {
    return {
      treeData: [],
      loading: false,
      defaultProps: {
        children: "children",
        label: "functionName",
      },
    };
  },
  watch: {},
  filters: {
    
  },
  computed: {
    
  },
  mounted() {
    this.treeData = JSON.parse(JSON.stringify(this.$store.getters.roles))
    this.detNoItem(this.treeData);
  },
  methods: {
    detNoItem(arr){
      if(isValue(arr)){
        for (var i = arr.length - 1; i >= 0; i--) {
          if(
            arr[i].isShow == 0 ||
            arr[i].isDisabled == 0 ||
            arr[i].functionType == 2
          ) {
            arr.splice(i, 1);
          }else {
            this.detNoItem(arr[i].children);
          }
        }
      }
    },
    nodeClick(data){
      if(data.functionType==1){
        // let name = data.functionNames ? data.functionNames.split("/")[0] : '';
        // console.log('name','data.url',name,data.url)
        //除了用户权限管理、全屏、月报、日报,左侧菜单不用改变
        // if( 
        //   name !== '用户权限管理' &&
        //   data.url !== "screenMap" &&
        //   data.url !== 'month' &&
        //   data.url !== 'dailyOperations'
        // ){
        //   console.log('除了用户权限管理、全屏、月报、日报')
        //   let firstArr = this.$store.state.permission.addRoutersBefore.filter((item)=>{return item.functionNames&&item.functionNames.indexOf(name)!=-1});
        //   this.$store.dispatch('getLeftMenu', firstArr);
        //   this.$store.dispatch("delAllViews");
        // }

        if (data.url == "screenMap") {
          // console.log(this.$store,123,this.$store.getters.interfacePrefix)
          this.$store.commit("setMapInterface", this.$store.getters.interfacePrefix);
          window.name = "bjevCloudUIMap";
          window.open("/map/index.html", "bjevCloudScreen");
        }else if(data.url == 'month'){
          let routeUrl = this.$router.resolve({
            path: "/monthfull",
          });
          window.name = 'yunkongUI';
          window.open(routeUrl.href, 'yuebaoUI');
        }else{
          this.$router.push({ name: data.url });
          // this.$store.commit("setSysSelected",name);
          // setSelectedSys(name);
        }
        
        // else if (data.url == "dailyOperations") {
        //   let routeUrl = this.$router.resolve({
				// 	  path: "/dailyOperations",
        //   });
        //   window.name = "bjevDailyOperationsCloudUI";
        //   window.open(routeUrl.href, "bjevdailyOperations");
        // }
        // else if (data.url == "mapGridStatistics") {
				//   let routeUrl = this.$router.resolve({
				//   	path: "/mapGridStatistics",
				//   });
				//   window.name = "bjevmapGridStatisticsCloudUI";
				//   window.open(routeUrl.href, "bjevmapGridStatistics");
			  // }
        
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.navigationAllDivBox{
  border-radius: 4px;
  // margin: 0 11px;
  // h2{
  //   text-align: center;
  //   padding: 12px;
  //   margin: 0;
  // }
  .divTree{
    display: flex;
    justify-content: space-around;
    // justify-content: flex-start;
    flex-wrap: wrap;
    max-height: calc(100vh - 168px);
    overflow: auto;
  }
  .topTitle{
    text-align: center;
    line-height: 32px;
    margin: 0px 0px 2px 0px;
    background-color: #fff;
    color: #262834;
    border-radius: 4px;
  }
}
.tree-line{
  background-color: #fff;
  border-radius: 4px;
  ::v-deep .el-tree-node {
    position: relative;
    padding-left: 8px; // 缩进量
  }
  ::v-deep .el-tree-node__content {
      height: 32px;
      padding-left: 0px !important;
      background: transparent !important;
      &:hover{
        background: transparent !important;
      }
  }
  // .el-tree-node.is-current > .el-tree-node__content
  ::v-deep .el-tree-node__children {
    padding-left: 8px; // 缩进量
  }

  // 竖线
  ::v-deep .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -1px;
    top: -24px;
    border-width: 1px;
    border-left: 1px dashed #6F757B;
  }
  // 当前层最后一个节点的竖线高度固定
  ::v-deep .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  ::v-deep .el-tree-node::after {
    content: "";
    width: 6px;
    height: 20px;
    position: absolute;
    left: 0px;
    top: 15px;
    border-width: 1px;
    border-top: 1px dashed #6F757B;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  ::v-deep & > .el-tree-node::after {
    border-top: none;
  }
  ::v-deep & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  ::v-deep .el-tree-node__expand-icon{
    &::before {
      content: "\e663";
      font-family: "iconfont" !important;
    }
    font-size: 5px;
    // background: #6F757B;
    // color: #fff;
    margin-right: 5px;
    padding: 2px;
    // 叶子节点（无子节点）
    &.is-leaf{
      padding-left: 5px;
      display: none;
      & +.el-tree-node__label{
          margin-left: 10px;
      }
      
    }
    &.expanded{
      transform: unset;
      &::before {
        content: "\e665";
        font-family: "iconfont" !important;
      }
    }
  }
}
</style>
