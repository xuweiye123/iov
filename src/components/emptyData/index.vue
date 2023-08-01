<!--
 * @Descripttion: 
 * @version: Do not Edit
 * @Author: shimh
 * @Date: 2020-12-25 14:47:12
 * @LastEditors: shimh
 * @LastEditTime: 2021-06-08 17:12:16
-->

<template>
  <div
    v-if="visibles"
    class="empty-chart"
  >
    <i class="iconfont icon-kong"></i>
    <p>{{info}}</p>
  </div>
</template>
<script>
export default {
  name: "emptyData",
  data() {
    return {};
  },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    info: {
      type: String,
      default: "暂无数据",
    },
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.empty-chart {
  text-align: center;
  min-height: 40vh;
  padding-top: 10vh;

  i {
    font-size: 60px;
    color: rgba(0, 0, 0, 0.2);
  }

  p {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
