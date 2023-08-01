<template>
  <div class="home-card">
    <div class="home-card-box-title">
      <!-- <svg-icon :icon-class="iconName" /> -->
      {{ titleLeft }}
    </div>
    <div class="box-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeCard",
  props: {
    iconName: {
      type: String,
      default: "",
    },
    titleLeft: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.home-card {
  border-radius: 4px;
  //  background: #202934;

  .home-card-box-title {
    height: 40px;
    line-height: 40px;

    padding: 0 10px;
    p {
      &.box-title {
        font-size: 15px;
        display: inline-block;
        vertical-align: middle;
      }
      &.box-title-left {
        font-weight: bold;
      }
      &.box-title-right {
        float: right;
        font-size: 12px;
        color: #0fa5f6;
        margin-top: 5px;
        cursor: pointer;
      }
    }
  }
  .box-content {
    height: calc(100% - 40px);
    div {
      height: 100%;
    }
  }
}
</style>
