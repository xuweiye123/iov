<template>
  <div class="app-container home-container">
    <div class="home-header">
      <div class="header-box" v-for="(i, index) in headerList" :key="index">
        <div class="box-left">
          <img
            style="height:100%;"
            :src="require('@/assets/images/transmitSys/' + i.image + '.png')"
          />
        </div>
        <div class="box-right">
          <div class="box-right_top">
            <div class="text_box text">
              {{ i.text }}
            </div>
          </div>
          <div class="box-right_bottom">
            <div class="text_box">
              <countTo
                :start-val="0"
                :end-val="i.value"
                :duration="3000"
                class="countTo"
                separator=","
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-bottom">
      <div class="home-bottom_left">
        <div class="home-bottom_left_content">
          <div class="home-bottom-box-title">
            <span>地方平台转发车辆</span>
          </div>
          <div id="charts" class="chartsBox"></div>
        </div>
      </div>
      <div class="home-bottom_right">
        <div class="home-bottom-box-title">
          <span>转发第三方当日流量</span>
        </div>
        <div class="home-bottom-box-list divScroll">
          <ul class="all-city-list">
            <li v-for="(item, index) in flowstatistics" :key="index">
              <p>{{ item.targetName }}</p>
              <p>{{ sizeConver(item.sendFlow) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { barCharts } from "@/utils/transmitEcharts";
import { conver } from "@/utils/sizeConversion";
// 首页接口数据只显示前一天的，页面都已经调好了

import {
  getStatisticsCount,
  getForwardCar,
  getStatisticsFlow,
} from "@/api/transmitSys/home.js";
import CountTo from "vue-count-to";
// import G2 from "@antv/g2";
// import Vue from "vue";
export default {
  name: "Home",
  components: { CountTo },
  data() {
    return {
      headerList: [
        { value: 0, text: "待配置", image: "home-pz" },
        { value: 0, text: "待检查", image: "home-jc" },
        { value: 0, text: "待转发", image: "home-zf" },
      ],
      flowstatistics: [
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
        // { targetName: "国家平台", sendFlow: 1.3 },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this._getStatisticsCount();
    this._getForwardCar();
    this._getStatisticsFlow();
    // this.barFaultCodeTopInit([], []);
  },
  methods: {
    _getStatisticsCount() {
      getStatisticsCount().then(({ data }) => {
        if (data.code === 0) {
          if (data.data) {
            this.headerList = [
              {
                value:
                  data.data && data.data.stayConfigCount
                    ? data.data.stayConfigCount
                    : 0,
                text: "待配置",
                image: "home-pz",
              },
              {
                value:
                  data.data && data.data.stayCheckCount
                    ? data.data.stayCheckCount
                    : 0,
                text: "待检查",
                image: "home-jc",
              },
              {
                value:
                  data.data && data.data.stayForwardCount
                    ? data.data.stayForwardCount
                    : 0,
                text: "待转发",
                image: "home-zf",
              },
            ];
          }
        }
      });
    },
    sizeConver(size) {
      return conver(size);
    },
    _getStatisticsFlow() {
      getStatisticsFlow().then(({ data }) => {
        if (data.code === 0) {
          if (data.data) {
            this.flowstatistics = data.data;
          }
        }
      });
    },
    _getForwardCar() {
      getForwardCar().then(({ data }) => {
        if (data.code === 0) {
          if (data.data) {
            let chartList = data.data;
            let xdata = chartList.map((item) => {
              return item.targetName;
            });
            let chartsdata = chartList.map((item) => {
              return item.carCount;
            });
            this.barFaultCodeTopInit(xdata, chartsdata);

            // console.log(this.chartsdata, this.xdata, "hhh");
          }
        }
      });
    },
    barFaultCodeTopInit(xdata, chartsdata) {
      // xdata = [
      //   "上海-新能源资质",
      //   "上海【国标】",
      //   "上海准入",
      //   "云南省【国标】",
      //   "云南能投【国标】",
      // ];
      // chartsdata = [1000, 1500, 3000, 2000, 1000];
      const Dom = document.getElementById("charts");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();
      const optionData = barCharts(xdata, chartsdata);
      myChart.setOption(optionData);
      this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          myChart.resize();
        });
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.home-container {
  .home-header {
    width: 100%;
    height: 19vh;
    display: flex;
    justify-content: space-between;
    .header-box {
      width: calc((100% - 40px) / 3);
      height: 19vh;
      background-color: #fff;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      .box-left {
        width: 50%;
        height: 19vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px 5px 5px 10px;
      }
      .box-right {
        width: 50%;
        height: 19vh;
        padding: 5px 10px 5px 5px;
        display: flex;
        flex-direction: column;
        .box-right_top {
          width: 100%;
          height: 40%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
        }
        .text_box {
          border-radius: 20px;
          height: 60%;
          width: 75%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .text {
          background: #f2f3f5;
          font-weight: 400;
          color: #262834;
          font-size: 2vh;
        }
        .box-right_bottom {
          width: 100%;
          height: 60%;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          .countTo {
            font-family: Roboto;
            font-weight: bold;
            color: #1e64dd;
            font-size: 4vh;
            margin-top: 1vh;
          }
        }
      }
    }
  }
  .home-bottom {
    width: 100%;
    height: calc(81vh - 180px);
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .home-bottom-box-title {
      height: 4vh;
      line-height: 4vh;
      // font-size: 2vh;
      font-weight: bold;
      color: #262834;
      font-family: Microsoft YaHei;
    }
    .home-bottom_left {
      width: 60%;
      height: calc(81vh - 180px);
      padding-right: 20px;
      .home-bottom_left_content {
        padding: 10px 15px 10px 15px;
        width: 100%;
        height: calc(81vh - 180px);
        border-radius: 4px;
        background-color: #fff;
        .chartsBox {
          height: calc(77vh - 200px);
          height: 100%;
          width: 100%;
        }
      }
    }
    .home-bottom_right {
      padding: 10px 15px 10px 15px;
      height: calc(81vh - 180px);
      width: 40%;
      // height: 100%;
      border-radius: 4px;
      background-color: #fff;
      .home-bottom-box-list {
        height: calc(77vh - 200px);
        overflow: scroll;
        overflow-x: hidden;
        .all-city-list {
          height: calc(77vh - 200px);
          margin: 0;
          padding-top: 5px;
          li {
            padding: 10px 0;
            display: flex;
            flex-direction: row;
            p {
              margin: 0;
              flex: 1;
              text-align: center;
              font-size: 12px;
              color: #595757;
            }
            &:nth-child(even) {
              background: #fff;
            }
            &:nth-child(odd) {
              background: #f2f3f5;
            }
          }
        }
      }
    }
  }
}
</style>
