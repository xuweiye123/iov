<template>
  <div class="content-page page1">
    <div class="content">
      <div class="top_content df">
        <div class="left_content dfcc_column">
          <div class="left_content_center df_column">
            <small-header :title="'月度活跃数'">
              <div slot="right">
                <span style="color: #7E96BA;">辆</span>
              </div>
            </small-header>
            <car-num :data="mileageTotal"></car-num>
          </div>
          <div class="left_content_top">
            <small-header :title="'月度活跃率'"> </small-header>
            <div class="appTon df_a">
              <div style="width:30%;height:100%" id="ringCharts"></div>
              <div style="width:68%;height:100%" class="dfcc_column">
                <div class="df_a" style="margin-bottom:1vh;width:100%">
                  <div>月度活跃环比(辆)</div>
                  <countTo
                    class="boldFont"
                    :startVal="0"
                    :endVal="activeInfoData.monthActiveCount"
                    :duration="2000"
                  ></countTo>
                </div>
                <div
                  style="height: 25px;width: 100%;border: 1px solid #112B5F;border-radius: 4px;overflow: hidden;"
                  id="batteryCharts1"
                ></div>
              </div>
            </div>
          </div>
          <div class="left_content_bottom df_column">
            <small-header :title="'日均活跃率'"> </small-header>
            <div class="appTon df_a">
              <div style="width:30%;height:100%" id="liquidFill"></div>
              <div style="width:68%;height:100%" class="dfcc_column">
                <div class="df_a" style="margin-bottom:1vh;width:100%">
                  <div>日均活跃数(辆)</div>
                  <countTo
                    class="boldFont"
                    :startVal="0"
                    :endVal="activeInfoData.dayActiveCount"
                    :duration="2000"
                  ></countTo>
                </div>
                <div
                  style="height: 25px;width: 100%;border: 1px solid #0D3A52;border-radius: 4px;overflow: hidden;"
                  id="batteryCharts2"
                ></div>
              </div>
            </div>
          </div>
          <div style="width:100%;height:10%" class="df_column">
            <small-header :title="'活跃度'">
              <div slot="right">
                <span style="color: #7E96BA">辆</span>
              </div>
            </small-header>
            <div
              class="dfcc_column appTon"
              style="align-items: flex-end;justify-content: flex-end;"
            >
              <legend-list :list="carMilageList"></legend-list>
            </div>
          </div>
        </div>
        <div class="center_content dfcc_column">
          <div class="center_content_top">
            <div class="dfc center_title" style="height:3vh;">
              <div
                style="width:1.6vh;height:1.6vh;margin-right:1vh"
                class="dfc"
              >
                <img src="../../../assets/month/sanjiao.png" class="wh100" />
              </div>
              <span class="fontB">车辆活跃情况</span>
            </div>
            <div class="mapBox">
              <div id="chinaChart2" class="mapCharts"></div>
            </div>
          </div>
        </div>
        <div class="right_content dfcc_column">
          <div class="right_content_top df_column">
            <small-header :title="'车型活跃分析'"> </small-header>
            <div class="appTon" style="width: 100%;">
              <div id="zheChartsA" class="wh100"></div>
            </div>
          </div>
          <div class="right_content_bottom">
            <small-header :title="'活跃城市TOP10'">
              <div slot="right">
                <span style="color: #7E96BA">辆</span>
              </div>
            </small-header>
            <div class="appTon" style="width: 100%;">
              <div id="hengZhuCharts2" class="wh100"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom_content">
        <div class="wh100" id="zheChart2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { chinaJSON } from "@/utils/chinaJSON";
import {
  lineCharts,
  hengZhuCharts,
  zheLineChart2,
  mapCharts,
  ringCharts,
  liquidFill,
} from "@/charts/page1";
import countTo from "vue-count-to";
import smallHeader from "./smallHeader";
import legendList from "./legendList";
import carNum from "./carNum";

import { getMonth } from "@/api/month/page1";
export default {
  name: "Page1",
  components: { smallHeader, legendList, countTo, carNum },
  props: {
    load: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mileageTotal: 0, //累计总里程
      legendColors: ["rgba(0, 118, 146, .8)", "rgba(0, 61, 133, .8)"],
      reachingstandardcarcount: 0,
      totalmileage: 0,
      carMilageList: [
        {
          title: "上月",
          bgColor: "#00F7FF",
          yDataList: [1, 2, 13, 109, 2],
        },
        {
          title: "本月",
          bgColor: "#007EFF",
          yDataList: [1, 2, 13, 109, 2],
        },
      ],
      bottomThreeList: [
        {
          url: "roundTheEarth_home",
          num: 873372,
          title: "累计绕地球行驶(圈)",
        },
        {
          url: "plantingTrees_home",
          num: 5964217,
          title: "综合节能减排(吨)",
        },
        {
          url: "energySaving_home",
          num: 2177,
          title: "相当于种植大树(万棵)",
        },
      ],
      activeInfoData: [],
    };
  },
  mounted() {
    this.getMonthinfo();
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
      getMonth({ type: "ActiveInfo" })
        .then(({ data }) => {
          if (data.code === 0) {
            this.activeInfoData = data.data ? data.data : {};
            //月度活跃数
            this.mileageTotal = this.activeInfoData.monthActiveCount
              ? this.activeInfoData.monthActiveCount
              : 0;
            //月度活跃率
            let monthActiveRate = this.activeInfoData.monthActiveRate
              ? this.activeInfoData.monthActiveRate
              : 0;
            let monthActiveRise = this.activeInfoData.monthActiveRise
              ? this.activeInfoData.monthActiveRise
              : 0;
            this.loadRingCharts(monthActiveRate);
            this.loadBatteryCharts1(monthActiveRate, monthActiveRise);
            //日均活跃数
            let dayActiveCount = this.activeInfoData.dayActiveCount
              ? this.activeInfoData.dayActiveCount
              : 0;
            let dayActiveRate = this.activeInfoData.dayActiveRate
              ? this.activeInfoData.dayActiveRate
              : 0;
            this.loadLiquidFill(dayActiveRate);
            this.loadBatteryCharts(dayActiveCount);
            //活跃度
            let activeDayData = this.activeInfoData.activeDay
              ? JSON.parse(this.activeInfoData.activeDay)
              : {};
            let activeDay1 = [[], []];
            let activeDay2 = [[], []];
            // 上月
            for (const key in activeDayData[1]) {
              activeDay1[0].push(activeDayData[1][key].carCount);
              activeDay2[0].push(activeDayData[1][key].day);
            }
            //本月
            for (const key in activeDayData[0]) {
              activeDay1[1].push(activeDayData[0][key].carCount);
              activeDay2[1].push(activeDayData[0][key].day);
            }
            this.zheCharts(activeDay1, activeDay2);
            //车辆活跃情况
            let activeC = [];
            let chinaData = this.activeInfoData.activeProvince
              ? JSON.parse(this.activeInfoData.activeProvince)
              : {};
            for (const key in chinaData) {
              if (chinaData[key].activeCount) {
                activeC.push({
                  name: chinaData[key].provinceName,
                  value: chinaData[key].activeCount,
                });
              }
            }
            this.chinaEcharts(activeC);
            //车型活跃分析
            let loadZheX = [];
            let loadZheY = [];
            let loadZheYData = this.activeInfoData.activeCityCarType
              ? JSON.parse(this.activeInfoData.activeCityCarType)
              : {};
            for (const key in loadZheYData) {
              loadZheX.push(loadZheYData[key].carTypeName);
              loadZheY.push(
                parseFloat(
                  (loadZheYData[key].activeCarProportion * 100).toFixed(2)
                )
              );
            }
            this.loadZheCharts2(loadZheX, loadZheY);
            //活跃城市TOP10
            let loadHeng = [];
            let loadHengData = this.activeInfoData.activeCity
              ? JSON.parse(this.activeInfoData.activeCity)
              : {};
            for (const key in loadHengData) {
              loadHeng.push({
                provinceName: loadHengData[key].cityName,
                onlineCount: loadHengData[key].activeCount,
              });
            }
            this.loadHengZhuCharts(loadHeng.splice(0, 9));
          }
        })
        .catch(() => {});
    },
    chinaEcharts(data) {
      // var data = [
      //   { name: "广东", value: 92 },
      //   { name: "浙江", value: 76 },
      //   { name: "北京", value: 77 },
      //   { name: "江苏", value: 69 },
      //   { name: "上海", value: 67 },
      //   { name: "山东", value: 21 },
      //   { name: "安徽", value: 19 },
      //   { name: "福建", value: 18 },
      //   { name: "四川", value: 12 },
      //   { name: "河南", value: 11 },
      //   { name: "湖南", value: 11 },
      //   { name: "江西", value: 11 },
      //   { name: "湖北", value: 10 },
      //   { name: "天津", value: 8 },
      //   { name: "河北", value: 6 },
      //   { name: "陕西", value: 6 },
      //   { name: "重庆", value: 4 },
      //   { name: "辽宁", value: 3 },
      //   { name: "吉林", value: 3 },
      //   { name: "黑龙江", value: 2 },
      //   { name: "山西", value: 2 },
      //   { name: "贵州省", value: 2 },
      //   { name: "新疆", value: 2 },
      //   { name: "海南", value: 1 },
      //   { name: "云南", value: 1 },
      //   { name: "广西", value: 1 },
      // ];
      var geoCoordMap = {};
      this.$echarts.registerMap("china", chinaJSON);
      var mapFeatures = chinaJSON.features;
      mapFeatures.forEach(function(v) {
        var name = v.properties.name;
        geoCoordMap[name] = v.properties.cp;
      });
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value),
            });
          }
        }
        return res;
      };
      const Dom = document.getElementById("chinaChart2");
      const myChart = this.$echarts.init(Dom);
      const optionData = mapCharts(convertData(data));
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    zheCharts(y, x) {
      const Dom = document.getElementById("zheChart2");
      const myChart = this.$echarts.init(Dom);
      let legendData = ["上月", "本月"];
      let yData = y;
      let xData = x[1];
      let textColor = "#5B759B";
      // myChart.clear();
      const optionData = lineCharts(
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
    loadHengZhuCharts(data) {
      // let data = [
      // 	{ provinceName: "北京", onlineCount: 10980 },
      // 	{ provinceName: "山东", onlineCount: 9760 },
      // 	{ provinceName: "广东", onlineCount: 9050 },
      // 	{ provinceName: "浙江", onlineCount: 8120 },
      // 	{ provinceName: "河南", onlineCount: 8010 },
      // 	{ provinceName: "江苏", onlineCount: 6000 },
      // 	{ provinceName: "福建", onlineCount: 5321 },
      // 	{ provinceName: "河北", onlineCount: 3214 },
      // 	{ provinceName: "云南", onlineCount: 2134 },
      // 	{ provinceName: "天津", onlineCount: 1097 },
      // ];
      let total = data.map((i) => i.onlineCount).join("+") || 0;
      const Dom = document.getElementById("hengZhuCharts2");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let xData = data.map((item) => item.provinceName);
      let yData = data.map(
        (item) => (item.onlineCount / total).toFixed(2) * 100
      );
      const optionData = hengZhuCharts(xData, yData, data);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    loadZheCharts2(xData, yData) {
      const Dom = document.getElementById("zheChartsA");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      // let xData = ["极狐系列", "EU系列", "EC系列", "EX系列", "EV系列"];
      // let yData = [60, 50, 55, 40, 45];
      const optionData = zheLineChart2(xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    loadRingCharts(data) {
      // let data = {
      // 	activeTotalForToday: b,
      // 	carTotal: a,
      // };
      const Dom = document.getElementById("ringCharts");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let value = Math.floor(data) || 0;
      let xHeight = Number(Dom.childNodes[0].style.height.slice(0, -2)) * 0.65;
      let yHeight = Number(Dom.childNodes[0].style.height.slice(0, -2)) * 0.6;
      const optionData = ringCharts(value, xHeight, yHeight);
      myChart.setOption(optionData);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    loadLiquidFill(a) {
      let data = {
        percent: a,
      };
      const Dom = document.getElementById("liquidFill");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let value = data.percent / 100;
      const optionData = liquidFill(value);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    }, //电池图
    loadBatteryCharts() {
      // loadBatteryCharts(data) {
      let data = {
        activeTotalForToday: this.activeInfoData.dayActiveCount ? 50 : 0,
        carTotal: 100,
      };
      const Dom = document.getElementById("batteryCharts2");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      // let value =
      //   Math.floor((data.activeTotalForToday / data.carTotal) * 100) || 0;
      let xLabel = ["市区"];
      const optionData = {
        background: this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
          {
            offset: 1,
            color: "rgb(0,29,75)",
          },
          {
            offset: 0,
            color: "rgb(0,14,55)",
          },
        ]),
        animation: true,
        grid: {
          top: "center",
          // bottom: "1%", //也可设置left和right设置距离来控制图表的大小
          left: ".1%", //也可设置left和right设置距离来控制图表的大小
          right: ".1%", //也可设置left和right设置距离来控制图表的大小
        },
        xAxis: {
          type: "value",
          gridIndex: 0,
          min: 0,
          max: data.carTotal,
          interval: 25,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: [
          {
            data: xLabel,
            axisLine: {
              show: false, //隐藏X轴轴线
            },
            axisTick: {
              show: false, //隐藏X轴刻度
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            // 值
            name: "情况",
            type: "bar",
            barWidth: 15,
            itemStyle: {
              normal: {
                color: this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    offset: 1,
                    color: "#009CFF",
                  },
                  {
                    offset: 0,
                    color: "#00F7FF",
                  },
                ]),
              },
            },
            data: [data.activeTotalForToday],
            z: 10,
            zlevel: 2,
            label: {
              show: false,
            },
          },
          {
            // 值分隔
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "rgb(0,22,67)",
              },
            },
            symbolRepeat: "fixed",
            symbolMargin: 20,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [4, 30],
            symbolPosition: "start",
            symbolOffset: [0, 0],
            data: [data.activeTotalForToday],
            width: 25,
            z: 0,
            zlevel: 3,
          },
          {
            //辅助背景图形
            name: "背景条",
            type: "bar", //pictorialBar
            barWidth: "15",
            barGap: "-100%",
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: "#112B5F",
              },
              barBorderRadius: 10,
            },
            data: [data.carTotal],
            z: 0,
            zlevel: 0,
          },
          {
            // 背景分隔
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "rgb(0,26,72)",
              },
            },
            symbolRepeat: "fixed",
            symbolMargin: 17,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [4, 15],
            symbolPosition: "start",
            symbolOffset: [0, 0],
            data: [data.carTotal],
            width: 25,
            z: 0,
            zlevel: 1,
          },
        ],
      };

      myChart.setOption(optionData);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    loadBatteryCharts1() {
      // loadBatteryCharts(data) {
      let data = {
        activeTotalForToday: this.activeInfoData.monthActiveCount ? 60 : 0,
        carTotal: 100,
      };
      const Dom = document.getElementById("batteryCharts1");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      // let value =
      //   Math.floor((data.activeTotalForToday / data.carTotal) * 100) || 0;
      let xLabel = ["市区"];
      const optionData = {
        background: this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
          {
            offset: 1,
            color: "rgb(0,29,75)",
          },
          {
            offset: 0,
            color: "rgb(0,14,55)",
          },
        ]),
        animation: true,
        grid: {
          top: "center",
          // bottom: "1%", //也可设置left和right设置距离来控制图表的大小
          left: ".1%", //也可设置left和right设置距离来控制图表的大小
          right: ".1%", //也可设置left和right设置距离来控制图表的大小
        },
        xAxis: {
          type: "value",
          gridIndex: 0,
          min: 0,
          max: data.carTotal,
          interval: 25,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        yAxis: [
          {
            data: xLabel,
            axisLine: {
              show: false, //隐藏X轴轴线
            },
            axisTick: {
              show: false, //隐藏X轴刻度
            },
            axisLabel: {
              show: false,
            },
          },
        ],
        series: [
          {
            // 值
            name: "情况",
            type: "bar",
            barWidth: 15,
            itemStyle: {
              normal: {
                color: this.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    offset: 1,
                    color: "#009CFF",
                  },
                  {
                    offset: 0,
                    color: "#00F7FF",
                  },
                ]),
              },
            },
            data: [data.activeTotalForToday],
            z: 10,
            zlevel: 2,
            label: {
              show: false,
            },
          },
          {
            // 值分隔
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "rgb(0,22,67)",
              },
            },
            symbolRepeat: "fixed",
            symbolMargin: 17,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [4, 30],
            symbolPosition: "start",
            symbolOffset: [0, 0],
            data: [data.activeTotalForToday],
            width: 25,
            z: 0,
            zlevel: 3,
          },
          {
            //辅助背景图形
            name: "背景条",
            type: "bar", //pictorialBar
            barWidth: "15",
            barGap: "-100%",
            itemStyle: {
              normal: {
                borderWidth: 0,
                color: "#112B5F",
              },
              barBorderRadius: 10,
            },
            data: [data.carTotal],
            z: 0,
            zlevel: 0,
          },
          {
            // 背景分隔
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "rgb(0,26,72)",
              },
            },
            symbolRepeat: "fixed",
            symbolMargin: 15,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [4, 15],
            symbolPosition: "start",
            symbolOffset: [0, 0],
            data: [data.carTotal],
            width: 25,
            z: 0,
            zlevel: 1,
          },
        ],
      };

      myChart.setOption(optionData);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss">
.dfcc_column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.df_column {
  display: flex;
  flex-direction: column;
}
.df {
  display: flex;
}
.df_a {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wh100 {
  width: 100%;
  height: 100%;
}
.content {
  width: 100%;
  height: 87vh;
}
.top_content {
  height: 66vh;
  width: 100%;
}
.bottom_content {
  height: 21vh;
}
.left_content {
  width: 25%;
  height: 100%;
}
.center_content {
  width: 50%;
  height: 66vh;
  padding: 2vh;
  position: relative;
}
.right_content {
  width: 25%;
  height: 100%;
}
.left_content_top {
  width: 100%;
  height: 36%;
}
.left_content_center {
  width: 100%;
  height: 18%;
}
.left_content_bottom {
  width: 100%;
  height: 36%;
}
.right_content_top {
  width: 100%;
  height: 50%;
}
.right_content_bottom {
  width: 100%;
  height: 50%;
}
.appTon {
  height: calc(100% - 3vh);
}
.dfc {
  display: flex;
  justify-content: center;
  align-items: center;
}

.center_content_top {
  width: 100%;
  height: 100%;
  position: relative;
}
.center_title {
  position: absolute;
  top: 1vh;
  left: 8vh;
}
.mapBox {
  width: 100%;
  padding: 3vh 3vw 1vh 3vw;
  height: 62vh;
}
.mapCharts {
  height: 63vh;
  width: 100%;
  background: url("../../../assets/month/map-bg.png") no-repeat center center;
  background-size: 100% auto;
}

.c1 {
  width: calc(100% / 3);
}
.boldFont {
  font-family: "F";
  font-weight: bold;
}
.mb1 {
  margin-bottom: 1vh;
}
.mr1 {
  margin-right: 1vh;
}
.fontB {
  font-size: 2.1vh;
  font-family: SourceHanSansCN-Bold;
  font-weight: bold;
  color: #ffffff;
}
</style>
