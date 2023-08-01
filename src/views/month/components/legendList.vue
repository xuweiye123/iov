<template>
  <div :class="isColumn ? 'dfcs' : 'df'">
    <div
      :class="`${isColumn ? 'mb1' : 'mr1'}`"
      v-for="(item, index) in list"
      :key="index"
    >
      <div v-if="isColumn" class="dfcs">
        <div class="dfc">
          <div class="Zdiv mr1" :style="{ background: item.bgColor }"></div>
          <div style="color:rgba(92, 124, 149, 1);">
            {{ item.title }}
          </div>
        </div>
        <!-- <div style="margin-left: 1.5vh;">{{ item.dataValue }}</div> -->
        <countTo
          style="margin-left: 1.5vh;"
          :startVal="0"
          separator=""
          :endVal="item.dataValue"
          :duration="4000"
        ></countTo>
      </div>
      <div v-else class="dfc">
        <div v-if="isBorder" class="Zdiv mr1" :style="{ border: item.border }"></div>
        <div v-else class="Zdiv mr1" :style="{ background: item.bgColor }"></div>
        <div>
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from "vue-count-to";
export default {
  name: "legendList",
  components: {
    countTo
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    isColumn: {
      type: Boolean,
      default: false
    },
    isBorder: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.Zdiv {
  width: 1vh;
  height: 1vh;
}
.dfc {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dfcs {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.df {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 1vh;
}
.mr1 {
  margin-right: .9vh;
}
.mb1 {
  margin-bottom: 0.5vh;
}
</style>
