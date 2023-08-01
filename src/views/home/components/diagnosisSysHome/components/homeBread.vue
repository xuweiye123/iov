<template>
  <div class="bread-list bread-list-top1" v-if="index === 4">
    <div class="item-left" v-for="(tItem, tIndex) in text" :key="'t' + tIndex">
      <i :class="`iconfont icon-${iconName[tIndex]}`"></i>
      <i class="bread-list-text" style="margin-left:10px;">{{ tItem }}</i>
      <i class="item-right">{{ value[tIndex] }}</i>
    </div>
  </div>
  <div class="bread-list bread-list-top" v-else>
    <div class="bread-list-top-left bread2">
      <p class="bread-text">{{ text[0] }}</p>
      <countTo
        :start-val="0"
        :end-val="value[1] || 0"
        :duration="3000"
        class="countTo"
        separator=","
      />
    </div>
    <div class="bread-img">
      <img :src="require('@/assets/images/diagnosisSys/' + img + '.png')" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CountTo from "vue-count-to";
export default {
  name: "HomeBread",
  components: { CountTo },
  props: {
    text: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    iconName: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 1,
    },
    img: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["activeName"]),
  },
};
</script>
<style lang="scss" scoped>
// .list-color1{
//   background: -webkit-linear-gradient(left, #3EBCFB, #4BEBD6);
// }
// .list-color2{
//   background: -webkit-linear-gradient(left, #6C81FE, #32BBF8);
// }
// .list-color3{
//   background: -webkit-linear-gradient(left, #E07FEA, #777AF9);
// }
// .list-color4{
//   background: -webkit-linear-gradient(left, #31BDF8, #6B81FE);
// }

.bread-list {
  width: 24%;
  border-radius: 10px;
  height: 100%;
}
.bread-text {
  border-radius: 10px;
  padding: 0 10px;
  line-height: 20px;
  margin-bottom: 10px;
}
.bread-list-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  .bread-list-top-left {
    color: #fff;
    .countTo {
      font-size: 28px;
      margin-left: 10px;
    }
  }
  .bread-img {
    flex: 1;
    text-align: right;
    margin-right: 10px;
    height: 100%;
    img {
      height: 96%;
    }
  }
  .bread2 {
    padding: 0 10px;
  }
}
// .bread-background-image{
//   background-size: 28%;

// }
.bread-list-top1 {
  padding: 1vh 2vh;
}
.item-left {
  height: calc(100% / 3 - 5px);
  padding: 0 15px;
  margin: 5px 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  // svg{
  //   margin-top: 5px;
  // }

  i {
    // margin-top: 5px;
    font-style: normal;
    display: inline-block;
    // line-height: calc(100% / 3 - 5px);
  }
  .item-right {
    // margin: 11px 0 11px 75px;
    text-align: right;
    // width: 90px;
    flex: 1;
    // float: right;
  }
}
.bread-no-item {
  // padding: 16px 15px 24px;
}
.bread-item {
  padding-left: 15px;
}
</style>
