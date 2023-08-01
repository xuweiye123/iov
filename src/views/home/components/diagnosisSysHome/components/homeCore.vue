<template>
  <div class="home-card">
    <div class="box-tips">
      <p>
        <span class="title-center">{{ titleCenter }}：</span>
        <span :class="['compare-count', 'count-color' + index]">{{
          compareCount
        }}</span>
      </p>
      <div>
        <span class="compare-content">{{ compareContent }}</span>
        <i
          :class="`iconfont icon-${iconNameriseorfall}`"
          style="font-size: 12px !important;margin-left: 5px;"
        />
        <span
          :class="['compare-percent', compare < 0 ? 'jt-down' : 'jt-slode']"
          >{{ comparePercent }}</span
        >
      </div>
    </div>
    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: "HomeCard",
  props: {
    compareCount: {
      type: Number,
      default: 0,
    },
    comparePercent: {
      type: String,
      default: "",
    },
    compareContent: {
      type: String,
      default: "",
    },
    titleCenter: {
      type: String,
      default: "",
    },
    iconNameriseorfall: {
      type: String,
      default: "",
    },
    compare: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      activeClass: 1,
    };
  },
  methods: {
    getMore() {
      this.$emit("click-more");
    },
    getInfo(index) {
      this.activeClass = index;
      this.$emit("click-type", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.count-color1 {
  color: #07b0fc;
}
.count-color2 {
  color: #1e64dd;
}
.count-color3 {
  color: #1fe0a3;
}
.count-color4 {
  color: #ffab26;
}
p {
  margin: 0;
}
.home-card {
  position: relative;
  float: left;
  width: 24%;
  height: 100%;
  border-right: 1px solid #F2F3F5;
  // margin-right: 10px;
  .box-tips {
    padding-left: 10px;
    line-height: 28px;
    // width: 100%;
    // height: 100px;
    // padding-top: 15px;
    svg {
      font-size: 12px;
      position: relative;
      top: 0;
    }
    p {
      span {
        // &.title-center{
        //     // color: #515c60;
        //     font-size: 13px;
        // }
        &.compare-count {
          vertical-align: sub;
          font-size: 20px;
        }
      }
    }
    span {
      &.compare-percent {
        font-size: 12px;
        margin-left: 5px;
        margin-right: 20px;
      }
      &.compare-blue {
        color: #599aff;
      }
      &.compare-red {
        color: #e8534e;
      }
      &.compare-content {
        color: #9da4a9;
        font-size: 12px;
      }
    }
  }
}

.home-card:last-child {
  margin-right: 0;
  width: 25%;
  border:none;
}
</style>
