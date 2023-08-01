<template>
  <div>
    <div class="car-number">
      <div class="cuntings-box">
        <i v-for="(item, index) in cunting" :key="index" :class="['cunting']">{{
          item
        }}</i>
      </div>
      <div class="df">
        <div v-for="(item, index) in numbers" :key="index">
          <span v-if="item == ','" :class="['numbers']">{{ item }}</span>
          <countTo
            v-else
            class="numbers"
            :startVal="0"
            :endVal="item * 1"
            :duration="4000"
          ></countTo>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from "vue-count-to";
export default {
  name: "carNum",
  props: {
    data: Number
  },
  components: {
    countTo
  },
  data() {
    return {
      cunt: ["千万", "百万", "十万", "万", "千", ""], // 空字符串是为了数字里面的逗号预留位置
      cunting: [],
      numbers: []
    };
  },
  mounted() {
    this.cuntFilter(this.data);
  },
  watch: {
    data() {
      this.cuntFilter(this.data);
    }
  },
  methods: {
    // 数字单位格式化
    cuntFilter(data) {
      const cunt = ["千万", "百万", "十万", "万", "千", ""];
      // 数字
      const val = data.toString();
      if (val.length > 3) {
        var result = [];
        var counter = 0;
        for (var i = val.length - 1; i >= 0; i--) {
          counter++;
          result.unshift(val[i]);
          if (!(counter % 3) && i != 0) {
            result.unshift(",");
          }
        }
        this.numbers = result;
      } else {
        this.numbers = val.split("");
      }
      // 单位
      if (val.length > 6) {
        cunt.splice(2, 0, "");
      }
      this.cunting = cunt.slice(
        cunt.length + 3 - this.numbers.length,
        cunt.length
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.numbers {
  font-family: "Roboto-Regular";
  display: inline-block;
  width: 4vh;
  text-align: center;
  font-size: 3.5vh;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
  border: 1px solid #112B5F;
}
.cunting {
  color: #5B759B;
  display: inline-block;
  width: 4vh;
  text-align: center;
  font-style: normal;
  border: 1px solid transparent;
}
.cuntings-box {
  margin: 0.2vh 0 0.2vh 0;
}
.df {
  display: flex;
}
</style>
