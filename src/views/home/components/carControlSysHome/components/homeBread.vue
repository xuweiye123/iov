<template>
  <div class="outside" v-loading="listLoading">
    <div class="piece">
      <div class="piece_left">
        <div class="left">
          <div class="text">
            <div class="round"></div>
            使用总数
          </div>
          <div>
            <countTo
              :start-val="0"
              :end-val="queryRemoteCountData.TotalUsage"
              :duration="3000"
              class="number"
              separator=","
            />
          </div>
        </div>
      </div>
      <div class="piece_right">
        <img
          style="width:72%;"
          :src="
            require('@/assets/images/theme/' + activeName + '/totalUsage.png')
          "
        />
      </div>
    </div>
    <div class="piece">
      <div class="piece_left">
        <div class="left">
          <div class="text">
            <div class="round"></div>
            远程控制
          </div>
          <div>
            <countTo
              :start-val="0"
              :end-val="queryRemoteCountData.controlSum"
              :duration="3000"
              class="number"
              separator=","
            />
          </div>
        </div>
      </div>
      <div class="piece_right" style="padding-right:3vh;">
        <div id="breadEcharts" class="breadEcharts"></div>
      </div>
    </div>
    <div class="piece">
      <div class="piece_left">
        <div class="left">
          <div class="text">
            <div class="round"></div>
            远程设置
          </div>
          <div>
            <countTo
              :start-val="0"
              :end-val="queryRemoteCountData.setSum"
              :duration="3000"
              class="number"
              separator=","
            />
          </div>
        </div>
      </div>
      <div class="piece_right" style="padding-right:3vh;">
        <div id="breadEcharts1" class="breadEcharts"></div>
      </div>
    </div>
    <div class="piece">
      <div class="piece_left">
        <div class="left">
          <div class="text">
            <div class="round"></div>
            状态查询
          </div>
          <div>
            <countTo
              :start-val="0"
              :end-val="queryRemoteCountData.querySum"
              :duration="3000"
              class="number"
              separator=","
            />
          </div>
        </div>
      </div>
      <div class="piece_right" style="padding-right:3vh;">
        <div id="breadEcharts2" class="breadEcharts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CountTo from "vue-count-to";
import { PieCharts } from "@/utils/homeEcharts";

import { queryRemoteCount } from "@/api/carControlSys/carControlSysHome";
export default {
  name: "HomeBread",
  components: { CountTo },
  data() {
    return {
      listLoading: false,
      queryRemoteCountData: {
        controlSum: 0,
        querySum: 0,
        setSum: 0,
        TotalUsage: 0,
      },
    };
  },
  computed: {
    ...mapState("theme", ["activeName"]),
  },
  watch: {
    // "$store.state.theme.activeName": function(val) {
    //   if (val) {
    //     if (this.$route.name == "home") {
    //       this._queryRemoteCount();
    //     }
    //   }
    // },
    // "$store.state.app.sidebarCollapse": function() {
    //   if (this.$route.name == "home") {
    //     this._queryRemoteCount();
    //   }
    // },
    // $route: {
    //   handler: function(val) {
    //     if (val.name == "home") {
    //       this._queryRemoteCount();
    //     }
    //   },
    //   deep: true,
    // },
  },
  mounted() {
    this._queryRemoteCount();
  },
  methods: {
    _queryRemoteCount() {
      this.listLoading = true;
      queryRemoteCount()
        .then(({ data }) => {
          if (data.code == 0) {
            let obj = data.data || {};
            let { controlSum = 0, querySum = 0, setSum = 0 } = obj;
            this.queryRemoteCountData.controlSum = +controlSum;
            this.queryRemoteCountData.querySum = +querySum;
            this.queryRemoteCountData.setSum = +setSum;
            this.queryRemoteCountData.TotalUsage =
              this.queryRemoteCountData.controlSum +
              this.queryRemoteCountData.querySum +
              this.queryRemoteCountData.setSum;
            let count1, count2, count3;
            if (
              this.queryRemoteCountData.TotalUsage &&
              this.queryRemoteCountData.TotalUsage != 0
            ) {
              count1 = controlSum / this.queryRemoteCountData.TotalUsage;
              count2 = setSum / this.queryRemoteCountData.TotalUsage;
              count3 = querySum / this.queryRemoteCountData.TotalUsage;
            } else {
              this.queryRemoteCountData.TotalUsage = 0;
              count1 = 0;
              count2 = 0;
              count3 = 0;
            }
            // console.log(count1, count2, count3,"ko");
            this._PieCharts(parseInt(count1 * 100));
            this._PieCharts1(parseInt(count2 * 100));
            this._PieCharts2(parseInt(count3 * 100));
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    _PieCharts(dataValue) {
      const Dom = document.getElementById("breadEcharts");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();

      const optionData = PieCharts(dataValue, "#1E64DD");
      myChart.setOption(optionData);
      this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          myChart.resize();
        });
      });
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });
    },
    _PieCharts1(dataValue) {
      const Dom = document.getElementById("breadEcharts1");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();

      const optionData = PieCharts(dataValue, "#2EBEFF");
      myChart.setOption(optionData);
      this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          myChart.resize();
        });
      });
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });
    },
    _PieCharts2(dataValue) {
      const Dom = document.getElementById("breadEcharts2");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();

      const optionData = PieCharts(dataValue, "#FFC826");
      myChart.setOption(optionData);
      this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          myChart.resize();
        });
      });
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.outside {
  width: 100%;
  height: 19vh;
  display: flex;
  justify-content: space-between;
}
.piece {
  background-color: #fff;
  border-radius: 4px;
  height: 19vh;
  width: calc((100% - 3vh) / 4);
  display: flex;
  justify-content: space-between;
}

.piece_left {
  width: 60%;
  height: 19vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  display: flex;
  flex-direction: column;
  .text {
    font-weight: 400;
    color: #262834;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
    font-size: 2vh;
    .round {
      background-color: #1e64dd;
      border-radius: 50%;
      height: 1.2vh;
      width: 1.2vh;
      margin-right: 1.5vh;
    }
  }
  .number {
    font-size: 4vh;
    font-weight: 400;
    color: #262834;
    margin-left: 2.7vh;
  }
}
.piece_right {
  width: 40%;
  height: 19vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.breadEcharts {
  width: 100%;
  height: 19vh;
}
</style>
