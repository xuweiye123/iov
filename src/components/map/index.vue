<template>
  <!-- <div class="theme"> -->
  <!-- <el-tooltip :content="theme" effect="dark" placement="bottom">
      <div class="btn-icon" @click="toMap">
        <svg-icon :style="{color: $store.state.theme.activeName==='block'? '#b1d3fb': '#fff',}" icon-class="map" class="svg-map" style="font-size:24px!important;" />
      </div>
    </el-tooltip> -->
  <div class="btn-icon" @click="toMap" style="padding-bottom:5px;">
    <svg-icon icon-class="map" class="svg-map" style="font-size:16px!important;color: #fff;"/>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {
      src:''
    }
  },
  computed: {
    // theme() {
    //   return '全屏地图'
    // }
  },
  methods: {
    toMap() {
      // const url = '/map/index.html'
      // window.open(url)
      window.name = 'bjevCloudUI';
      window.open('/map/index.html', 'bjevCloudScreen');
    }
  }
}
</script>
<style lang="scss">

</style>

