
<template>
  <div class="theme">
    <el-tooltip :content="theme" effect="dark" placement="bottom">
      <div class="btn-icon iconBg" @click="dialogVisible = true">
        <i class="iconfont icon-huanfu"></i>
      </div>
    </el-tooltip>
    <app-dialog
      :visibles="dialogVisible"
      :title="theme"
      width="570px"
      @close-dialog="dialogVisible = false"
      class="ordinary"
    >
      <div slot="formContent">
        <theme-list />
      </div>
    </app-dialog>
  </div>
</template>

<script>
import ThemeList from './components/ThemeList'
export default {
  components: {
    ThemeList
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    theme() {
      return this._i18n.tc('navbar.theme')
    }
  }
}
</script>
<style scoped>
.theme {
  display: inline-block;
}

</style>

