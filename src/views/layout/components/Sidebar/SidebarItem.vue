<!--

:class="{'submenu-title-noDropdown':!isNest}"
 v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"-->
<template>
  <div
    v-if="item.isShow&&item.children&&item.children.length>0"
    class="menu-wrapper"
  >
    <!-- 只有一级菜单的展示 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="onlyOneChild.name">
        <el-menu-item
          :index="onlyOneChild.name" class="erer-rerrr"
          :class="true ? 'submenu-title-noDropdown': ''"
        >
          <!-- <item
            v-if="$store.state.theme.activeName!='red'&&onlyOneChild"
            class="ml-10"
            :icon="`${$store.state.theme.activeName}_${onlyOneChild.icon||item.icon}${isActive(onlyOneChild.name) ? '_active' : ''}`"
            :title="item.menuName"
            :iconType="'j'"
          /> -->
          <!-- v-if="$store.state.theme.activeName=='red'&&onlyOneChild" -->
          <item
            v-if="onlyOneChild"
            class="ml-10"
            :icon="'iconfont icon-'+ onlyOneChild.icon||item.icon"
            :title="item.menuName"
            iconType="i"
          />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 用户权限管理-系统模块展示 -->
    <!-- <template v-else-if="item.name==='system'">
      <app-link v-for="(child,i) in item.children" :key="i" :to="child.name">
        <el-menu-item
          v-if="child&&child.isShow"
          :index="child.name" class="erer-rerrr"
          :class="true ? 'submenu-title-noDropdown': ''"
        >
          <item
            v-if="$store.state.theme.activeName!='red'&&child"
            class="ml-10"
            :icon="`${$store.state.theme.activeName}_${child.icon||item.icon}${isActive(child.name) ? '_active' : ''}`"
            :title="child.menuName"
            :iconType="'j'"
          />
             v-if="$store.state.theme.activeName=='red'&&child"
          <item
            v-if="child"
            class="ml-10"
            :icon="'iconfont icon-'+ child.icon||item.icon"
            :title="child.menuName"
            iconType="i"
          />
        </el-menu-item>
      </app-link>
    </template> -->

    <el-submenu
      v-else
      ref="submenu"
      :index="item.name"
    >
      <template slot="title">
        <!-- <item
          v-if="$store.state.theme.activeName!='red'&&item&&item.isShow"
          :icon="`${$store.state.theme.activeName}_${item.icon}${isActive(item.name) ? '_active' : ''}`"
          :title="item.menuName"
          :iconType="'j'"
        /> -->
        <!-- v-if="$store.state.theme.activeName=='red'&&item&&item.isShow" -->
        <item
            v-if="item&&item.isShow"
            class="ml-10"
            :icon="'iconfont icon-'+ item.icon"
            :title="item.menuName"
            iconType="i"
          />
      </template>

      <template v-for="child in item.children">
        <sidebar-item
          v-if="child.isShow&&child.children&&child.children.length>0"
          :key="child.name"
          :is-nest="true"
          :item="child"
          :base-path="child.name"
          class="nest-menu"
        />
        <app-link
          v-else
          :key="child.name"
          :to="child.name"
        >
          <el-menu-item
            v-if="child.isShow"
            :index="child.name"
          >
            <!-- <item
              v-if="$store.state.theme.activeName!='red'&&child"
              :iconType="'i'"
              :icon="`iconfont icon-${child.icon}`"
              :title="child.menuName"
            /> -->
            <item
              v-if="child"
              :iconType="'i'"
              :icon="child.icon?`iconfont icon-${child.icon}`:''"
              :title="child.menuName"
            />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
  <!-- <div
    v-else-if="item.isShow&&(!item.children||item.children===null||item.children.length===0)"
    class="menu-wrapper"
    >
      <app-link :to="item.name">
        <el-menu-item
          :index="item.name"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item
            v-if="item"
            class="ml-10"
            :icon="'iconfont '+ item.icon||item.icon"
            :title="item.menuName"
            iconType="i"
          />
        </el-menu-item>
      </app-link>
    </div> -->
</template>

<script>
import path from "path";
import { generateTitle } from "@/utils/i18n";
import { validateURL } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      onlyOneChild: null,
    };
  },
  created() {
  },
  mounted(){

  },
  methods: {
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter((item) => {
        if (!item.isShow) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      //首页显示
      if (showingChildren.length === 1 && showingChildren[0].onlyChild) {
        return true;
      }

      //首页显示 且 单个无Children菜单
      // if(showingChildren.length === 1){
      //   let arr = showingChildren[0].functionNames?showingChildren[0].functionNames.split("/"):[];
      //   if(
      //     showingChildren[0].onlyChild ||
      //     arr[arr.length-1] == arr[arr.length-2]
      //   ){
      //     return true;
      //   }
      // }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    isExternalLink(routePath) {
      return validateURL(routePath);
    },
    isActive(val){
      let arr = val.split('/')
      if( arr.length > 1 ){
        return arr[1] === this.$route.path.split('/')[2] ;
      }else{
        return val === this.$route.path.split('/')[1] ;
      }
    },
    isActiveChild(val){
        return val === this.$route.path.split('/')[2] ;
    },
    generateTitle,
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.submenu-title-noDropdown{
  .el-submenu__title{
    display: none;
   
  } 
  .el-menu{
    display: block !important;
  }
}
.collapse{
  .submenu-title-noDropdown{
  .el-submenu__title{
    display: block;
  }
}
}
</style>