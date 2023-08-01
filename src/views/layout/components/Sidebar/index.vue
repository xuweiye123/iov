
<template>
  <el-scrollbar ref="scroll" wrap-class="scrollbar-wrapper">
    <!-- {{realPermissionRouters}} -->
    <el-menu
      :show-timeout="200"
      :default-openeds="defaultOpeneds"
      :default-active="$route.name"
      :collapse="sidebarCollapse"
      :unique-opened="false"
      mode="vertical"
      :class="sidebarCollapse?'app-left-menu small':'app-left-menu big'"
      @open="updateScroll"
      @close="updateScroll"
    >
      <sidebar-item v-for="route in realPermissionRouters" :key="route.name" :item="route" :base-path="route.name"/>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data(){
    return {
      defaultOpeneds: []
    }
  },
  watch: {
    //切换系统时，左菜单默认全折叠
    "$store.state.tagsView.visitedViews"(val){
      if( val.length==1 && val[0].name == 'home' ){
        this.defaultOpeneds = [];
      }
    },
  },
  computed: {
    ...mapGetters([
      'realPermissionRouters',
      'sidebarCollapse'
    ])
  },
   mounted(){
    // console.log('this.realPermissionRouters',this.realPermissionRouters)
  },
  created(){
  },
  methods: {
    updateScroll: function() {
      // 手动触发一下scroll的更新
      setTimeout(() => {
        this.$refs.scroll.update()
      }, 300)
    }
  }
}
</script>
<style lang="scss" scoped>
// ::v-deep .scrollbar-wrapper.el-scrollbar__wrap{
//   max-height: calc(100% - 135px);
// }
</style>
