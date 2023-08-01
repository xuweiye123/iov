<template>
    <div class="more-navigation">
      <keep-alive :include="cachedViews">
      <!-- 改变router-view中的key来刷新组件 -->
        <router-view :key="key"/>
      </keep-alive>
    </div>
</template>

<script>
  export default {
    name: 'MultilevelRouting',
    computed:{
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.fullPath
      },
    }
  }
</script>

<style scoped>

</style>