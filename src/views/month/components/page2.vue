<template>
  <div class="content-page page2">
    <div class="top">
      <div class="top-left">
        <div class="top-left-item">
          <small-header :title="'各时间段充电时长统计'"> </small-header>
          <legend-list
            :isBorder="true"
            :list="chargingTimesList"
            style="width:100%;height:5%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="chargingLineChartOne" style="height:26vh;width:100%;"></div>
        </div>
        <div class="top-left-item">
          <small-header :title="'各时间段充电次数统计'"> </small-header>
          <legend-list
            :isBorder="true"
            :list="chargingFrequencyList"
            style="width:100%;height:5%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="chargingLineChartTwo" style="height:26vh;width:100%;"></div>
        </div>
        <div class="top-left-bottom">
          <small-header :title="'本月日均充电时长及充电次数'"> </small-header>
          <legend-list
            :list="chargingList"
            style="width:100%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
        </div>
      </div>
      <div class="top-content">
        <div class="center-title" style="height:3vh;">
          <div style="width:1.6vh;height:1.6vh;margin-right:1vh" class="dfc">
            <img
              style="width:100%;height:100%;"
              src="../../../assets/month/sanjiao.png"
            />
          </div>
          <span class="fontB">充电热力图</span>
        </div>
        <!-- <h3 class="center-title"><svg-icon icon-class="bt-month"/> 充电热力图</h3> -->
        <div class="mapBox">
          <div id="mapCharts" class="mapCharts"></div>
        </div>
      </div>
      <div class="top-right">
        <div class="top-right-item">
          <small-header :title="'车型日均充电时长及充电次数'"> </small-header>
          <legend-list
            :list="chargingList"
            style="width:100%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="chargingBarChartOne" style="height:15.5vh;width:100%;"></div>
        </div>
        <div class="top-right-item">
          <small-header :title="'开始充电SOC分布占比'"> </small-header>
          <legend-list
            :list="monthList"
            style="width:100%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="chargingBarChartTwo" style="height:15.5vh;width:100%;"></div>
        </div>
        <div class="top-right-item">
          <small-header :title="'结束充电SOC分布占比'"> </small-header>
          <legend-list
            :list="monthList"
            style="width:100%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="chargingBarChartThree" style="height:17vh;width:100%;"></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div id="chargingLineCharts" style="height:100%;width:100%;"></div>
    </div>
  </div>
</template>

<script>
import { chinaJSON } from "@/utils/chinaJSON";
import smallHeader from "./smallHeader";
import legendList from "./legendList";
import {
  mapCharts,
  chargingLineChartOne,
  chargingLineChartTwo,
  chargingBarChartOne,
  chargingBarChartTwo,
  chargingLineCharts,
} from "@/charts/page2";

import { getMonth } from "@/api/month/page1";
export default {
  name: "Page2",
  components: { smallHeader, legendList },
  props: {
    load: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chargingTimesList: [
        { title: "快充充电时长", border: "1px solid #00F7FF" },
        { title: "慢充充电时长", border: "1px dashed #007EFF" },
      ],
      chargingFrequencyList: [
        { title: "快充充电次数", border: "1px solid #00F7FF" },
        { title: "慢充充电次数", border: "1px dashed #007EFF" },
      ],
      chargingList: [
        {
          title: "充电时长",
          bgColor: "#00F7FF",
        },
        {
          title: "充电次数",
          bgColor: "#007EFF",
        },
      ],
      monthList: [
        {
          title: "上月",
          bgColor: "#00F7FF",
        },
        {
          title: "本月",
          bgColor: "#007EFF",
        },
      ],
      legendColors: ["#00F7FF", "#007EFF"],
    };
  },
  watch: {
    load(e1) {
      // e1为true时，表示第一次进入此页面
      if (e1) {
        this.getMonthinfo();
      }
    },
  },
  methods: {
    getMonthinfo() {
      getMonth({ type: "ChargeInfo" })
        .then(({ data }) => {
          if (data.code === 0) {
            // 各时间段充电时长、充电次数统计
            let chargingLineData =
              data.data && data.data.list1 ? JSON.parse(data.data.list1) : {};
            // 各时间段充电时长统计
            this.chargingLineChartOne(chargingLineData);
            // 各时间段充电次数统计
            this.chargingLineChartTwo(chargingLineData);

            // 本月日均充电时长及充电次数
            let chargCharts =
              data.data && data.data.list5 ? JSON.parse(data.data.list5) : {};
            this.chargingLineCharts(chargCharts);

            let chargMapCharts =
              data.data && data.data.list6 ? JSON.parse(data.data.list6) : [];
            // 充电热力图
            this.mapCharts(chargMapCharts);

            // 车型日均充电时长及充电次数
            let chargingBar =
              data.data && data.data.list2 ? JSON.parse(data.data.list2) : {};
            this.chargingBarChartOne(chargingBar);

            // 开始充电SOC分布占比、结束充电SOC分布占比
            let BarChartTwoData1 =
              data.data && data.data.list3 ? JSON.parse(data.data.list3) : {}; //本月
            let BarChartTwoData2 =
              data.data && data.data.list4 ? JSON.parse(data.data.list4) : {}; //上月
            // 开始充电SOC分布占比
            this.chargingBarChartTwo(BarChartTwoData1, BarChartTwoData2);
            // 结束充电SOC分布占比
            this.chargingBarChartThree(BarChartTwoData1, BarChartTwoData2);
          }
        })
        .catch(() => {});
    },

    // 中间地图
    mapCharts(data) {
      const Dom = document.getElementById("mapCharts");
      const myChart = this.$echarts.init(Dom);
      // var data=[
      // 	{
      // 		startLat:31.89,
      //     chargeType : 0,
      //     startLon:121.15
      // 	},
      // 	{
      // 		startLat :31.89,
      //     chargeType : 1,
      //     startLon : 109.781327
      // 	},
      // 	{
      // 		startLat : 24.46,
      //     chargeType : 0,
      //     startLon :118.1
      // 	},
      // 	]
      let dataList = data.map((i) => {
        return Object.assign(
          {},
          { value: [i.startLon, i.startLat, i.chargeType] }
        );
      });
      // console.log(data,145,dataList)
      const optionData = mapCharts(dataList);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //左一 各时间段充电时长统计分布
    chargingLineChartOne(data) {
      const Dom = document.getElementById("chargingLineChartOne");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let nameList = this.chargingTimesList.map((item) => item.title);
      let colors = ["#00F7FF", "#007EFF"];
      let xData = [];
      let yData1 = [];
      let yData2 = [];
      for (const key in data) {
        xData.push(data[key].name);
        yData1.push(data[key].quickTime);
        yData2.push(data[key].notQuickTime);
      }
      //  xData = [1,2,3,4];
      //  yData1 =[100,200,150,200];
      //  yData2 =[200,230,100,180];
      const optionData = chargingLineChartOne(
        nameList,
        colors,
        xData,
        yData1,
        yData2
      );
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //左二 各时间段充电次数统计分布
    chargingLineChartTwo(data) {
      const Dom = document.getElementById("chargingLineChartTwo");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let nameList = this.chargingFrequencyList.map((item) => item.title);
      let colors = ["#00F7FF", "#007EFF"];
      let xData = [];
      let yData1 = [];
      let yData2 = [];
      for (const key in data) {
        xData.push(data[key].name);
        yData1.push(data[key].quickCount);
        yData2.push(data[key].notQuickCount);
      }
      //  xData = [1,2,3,4];
      //  yData1 =[100,200,150,200];
      //  yData2 =[200,230,100,150];
      const optionData = chargingLineChartTwo(
        nameList,
        colors,
        xData,
        yData1,
        yData2
      );
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //右一 车型日均充电时长及充电次数
    chargingBarChartOne(data) {
      const Dom = document.getElementById("chargingBarChartOne");
      const myChart = this.$echarts.init(Dom);
      let xData = [];
      let yData = [[], []];
      for (const key in data) {
        xData.push(data[key].carTypeName);
        yData[0].push(data[key].minute);
        yData[1].push(data[key].num);
      }
      //  xData = [1,2,3,4];
      //  yData =[[100,200,150,200],[200,230,100,150]];
      const optionData = chargingBarChartOne(xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //右二 开始充电SOC分布占比
    chargingBarChartTwo(data1, data2) {
      const Dom = document.getElementById("chargingBarChartTwo");
      const myChart = this.$echarts.init(Dom);
      let xData = [];
      let yData = [[], []]; //开始充电SOC分布占比
      for (const key in data1) {
        xData.push(data1[key].name);
        yData[1].push(data1[key].startSocRate);
      }
      for (const key in data2) {
        yData[0].push(data2[key].startSocRate);
      }
      // xData = [1,2,3,4];
      // yData =[[100,200,150,200],[200,230,100,150]];
      const optionData = chargingBarChartTwo(xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //右二 结束充电SOC分布占比
    chargingBarChartThree(data1, data2) {
      const Dom = document.getElementById("chargingBarChartThree");
      const myChart = this.$echarts.init(Dom);
      let xData = [];
      let yData = [[], []]; //结束充电SOC分布占比

      for (const key in data1) {
        xData.push(data1[key].name);
        yData[1].push(data1[key].endSocRate);
      }
      for (const key in data2) {
        yData[0].push(data2[key].endSocRate);
      }
      // xData = [1,2,3,4];
      // yData =[[100,200,150,200],[200,230,100,150]];
      const optionData = chargingBarChartTwo(xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 底部充电折线图
    chargingLineCharts(data) {
      const Dom = document.getElementById("chargingLineCharts");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let legendData = ["充电时长", "充电次数"];
      let xData = [];
      let yData = [[], []];
      for (const key in data) {
        xData.push(data[key].chargeTime);
        yData[1].push(data[key].count);
        yData[0].push(data[key].time);
      }
      // xData = [1,2,3,4,5,6,7,8,9,10];
      // yData =[[100,200,150,200,200,230,100,150,200,122],[200,230,100,150,100,200,150,200,200,230,]];
      let textColor = "rgba(92, 124, 149, 1)";
      const optionData = chargingLineCharts(
        legendData,
        this.legendColors,
        xData,
        yData,
        textColor
      );
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.top {
  display: flex;
  align-content: space-between;
  height: 66vh;
  .top-left {
    height: 66vh;
    width: 25%;
    .top-left-item {
      height: 31vh;
      width: 100%;
    }
    .top-left-bottom {
      height: 4vh;
    }
  }
  .top-content {
    height: 66vh;
    width: 50%;
    position: relative;
    padding: 2vh;
    // h3{
    //   height: 3vh;
    //   display: inline-block;
    // }
    .center-title {
      position: absolute;
      top: 3vh;
      left: 8vh;
      display: flex;
      justify-content: center;
      align-items: center;
      // font-size: 2vh;
      // font-family: SourceHanSansCN-Bold;
      // font-weight: bold;
      // padding:0 50px;
      // .svg-icon{
      //   vertical-align:0;
      // }
      .fontB {
        font-size: 2.1vh;
        font-family: SourceHanSansCN-Bold;
        font-weight: bold;
        color: #ffffff;
      }
      .dfc {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .mapBox {
      width: 100%;
      padding: 3vh 3vw 1vh 3vw;
      height: 62vh;
    }
    .mapCharts {
      height: 63vh;
      width: 100%;
      background: url("../../../assets/month/map-bg.png") no-repeat center
        center;
      background-size: 100% auto;
    }
  }
  .top-right {
    height: 66vh;
    width: 25%;
    .top-right-item {
      height: 22vh;
      width: 100%;
    }
  }
}
.bottom {
  height: 21vh;
}
</style>
