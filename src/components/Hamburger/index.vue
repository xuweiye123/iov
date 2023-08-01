

<template>
  <div class="btn-icon menu-toggle" @click="toggleClick"  v-show="$store.isShowMenuToggle">
     <i
      class="iconfont"
      :class="isActive ? 'icon-zhankai': 'icon-shouqi'"
    ></i>
  </div>
</template>

<script>
export default {
  computed: {
    isActive() {
      return this.$store.state.app.sidebarCollapse
    }
  },
  methods: {
    toggleClick() {
      this.$store.dispatch('app/toggleSideBar')
      let num = this.$store.state.app.sidebarCollapse?'106px':'240px';
      document.querySelector(".footFix").style.width = `calc(100% - ${num})`;
    }
  }
}
</script>

