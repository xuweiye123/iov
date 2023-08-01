<template>
  <el-tabs v-model="tabsActiveName" class="themeTabs">
    <el-tab-pane label="" name="first">
      <div v-for="(item,index) in list" :key="index" class="themeTabsList">
        <div class="themename" :class="activeName === item.name?'active':''" @click="handleSelectTheme(item.name)">
          <div :class="item.name" class="theme-preview" />
          <svg-icon icon-class="okTheme" class="themeicon-ok" />
        </div>
        <div class="themetitle">
          {{ item.title }}
        </div>
      </div>
    </el-tab-pane>
    <!-- <el-tab-pane label="节日模式" name="second">
      <div v-for="(item,index) in list" v-if="index > 6" :key="index" class="themeTabsList">
        <div class="themename" :class="activeName === item.name?'active':''" @click="handleSelectTheme(item.name)">
          <div :class="item.name" class="theme-preview" />
          <svg-icon icon-class="okTheme" class="themeicon-ok" />
        </div>
        <div class="themetitle">
          {{ item.title }}
        </div>
      </div>
    </el-tab-pane> -->
  </el-tabs>
  <!-- <el-table size="mini" :data="list" v-bind="table">
    <el-table-column prop="title" align="center" width="160" />
    <el-table-column label="预览" width="120">
      <div slot-scope="scope" :class="scope.row.name" class="theme-preview" />
    </el-table-column>
    <el-table-column prop="address" align="center">
      <template slot-scope="scope">
        <el-button v-if="activeName === scope.row.name" type="success" icon="el-icon-check" round>
          已激活
        </el-button>
        <el-button v-else round @click="handleSelectTheme(scope.row.name)">
          使用
        </el-button>
      </template>
    </el-table-column>
  </el-table> -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SetTheme from '@/utils/setTheme'
export default {
  data() {
    return {
      tabsActiveName: 'first',
      table: {
        showHeader: false,
        border: true
      }
    }
  },

  computed: {
    ...mapState('theme', [
      'list',
      'activeName'
    ])
  },
  created() {
    console.log(this.list,2222)
  },
  methods: {
    ...mapActions('theme', [
      'set'
    ]),
    handleSelectTheme(name) {
      /* let myColor = this.list[1].color
      const index = this.list.findIndex(item => item.name === name)
      if (index > -1) {
        myColor = this.list[index].color
      }
      new SetTheme(myColor) */
      this.set(name)
      // this.set(name)
    }
  }
}
</script>
<style scoped>
::v-deep .el-tabs__nav-wrap {
  height: 0 !important;
	line-height: 0 !important;
}
::v-deep .svg-icon{
  font-size: 25px;
}
</style>
