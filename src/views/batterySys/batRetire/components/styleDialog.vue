<template>
  <div class="time-line">
    <el-timeline class="time-line-div">
      <el-timeline-item
        v-for="(activity, index) in testList"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.date"
        placement="top"
      >
        {{ activity.state }}
      </el-timeline-item>
    </el-timeline>
    <!-- <div v-for='item in testList' class='time-line-div' :key="item.time">
      <p>{{item.date}}</p>
      <p ref='circular'></p>
      <p>{{item.state}}</p>
    </div>
    <div class='img-dotted' ref='dotted'></div> -->
  </div>
</template>

<script>
import { getDcstyleList } from "@/api/batterySys/batRetire";
export default {
  name: "timeLine",
  data() {
    return {
      timeIndex: 2,
      testList: [],
    };
  },
  props: {
    data: {
      type: String,
    },
  },
  created() {
    const dcsdata = {
      batteryType: "电池包",
      code: this.data,
    };
    //获取生命周期
    getDcstyleList(dcsdata).then(({ data }) => {
      if (data.code === 0) {
        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].state === "produce") {
            data.data[i].state = "下线";
          } else if (data.data[i].state === "sales") {
            data.data[i].state = "车辆销售";
          } else if (data.data[i].state === "repair") {
            data.data[i].state = "返厂维修";
          } else if (data.data[i].state === "retire") {
            data.data[i].state = "电池退役";
          }
        }
        this.testList = data.data || [];
      }
    });
  },
  mounted() {
    // this.$refs.dotted.style.left = '106px'
  },
};
</script>

<style scoped>
.time-line {
  position: relative;
  width: 300px;
  margin: 0 auto;
}
</style>
