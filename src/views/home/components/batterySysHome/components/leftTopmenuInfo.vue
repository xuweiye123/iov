<template>
  <div class="lefttop">
    <img
      :src="require(`@/assets/images/theme/${activeName}/${icon}`)"
      width="auto"
      class="flexbottom"
      alt=""
    />
    <div class="bread-value flexbottom">{{ value }}</div>
    <div class="bread-text flexbottom">{{ text }}</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "leftTopmenuinfo",
  props: {
    text: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // imgUrl:require("@/assets/images/home/"+self.activeName+'_'+self.icon)
    };
  },
  computed: {
    ...mapGetters(["activeName"]),
  },
};
</script>
<style lang="scss" scoped>
.lefttop {
  height: 100%;
  padding: 10px 10px;
  align-items: center;
  box-sizing: border-box;
  text-align: center;
  img {
    height: 42%;
  }
}
.flexbottom {
  margin-bottom: 5px;
}
.bread-value {
  font-size: 18px;
  font-weight: bold;
  color: #1E64DD;;
}
.bread-text {
  font-size: 12px;
  font-weight: 400;
  color: #595757;
  display: inline;
  white-space: nowrap;
}
</style>
