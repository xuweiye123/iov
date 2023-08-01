

<!--
  Attributes:
    positon (Object,相对底部位置)
  methods:
    click-filter
    click-clear
  slot -
  可扩展其他按钮
-->
<template>
  <div :class="[customClass,'action-btn']" :style="{bottom:position.y +'px',right: position.x + 'px'}">
    <div v-show="isCollapse" class="search-collapse" @click="clickCollapse" style="margin-right: 20px;">
      <span>
        <!-- {{ !collapse ? '展开': '收起' }} -->
        <i :class="!collapse?'iconfont icon-down':'iconfont icon-up'" />
      </span>
    </div>
    <el-button :size="size" v-waves v-preventReClick type="primary" @click="filter" :disabled="isdisabled">
      <i class="iconfont icon-search" />
      查询
    </el-button>
    <el-button :size="size" v-show="showEmpty" v-waves v-preventReClick type="default" @click="clear" :disabled="isdisabled">
      <i class="iconfont icon-refresh" />
      重置
    </el-button>
    <slot>
    </slot>
    
  </div>
</template>

<script>
export default {
  name: 'SearchButton',
  props: {
    position: {
      type: Object,
      default: () => ({
        x: 10,
        y: 10
      })
    },
    customClass: {
      type: String,
      default: ''
    },
    showEmpty: {
      type: Boolean,
      default: true
    },
    isCollapse: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    isdisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapse: false
    }
  },
  methods: {
    filter() {
      this.$emit('click-filter')
    },
    clear() {
      this.$emit('click-clear')
    },
    clickCollapse() {
      this.collapse = !this.collapse
      this.$emit('click-collapse', this.collapse)
    }
  }
}
</script>

<style lang="scss" scoped>
  .action-btn {
    position: absolute;
    display: flex;
    .search-collapse{
      padding: 0 0 0 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span{
        font-size:12px
      }
    }
  }
</style>
