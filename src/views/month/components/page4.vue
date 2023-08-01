<template>
  <div class="content-page page4">
    <div class="page4-left">
      <!-- 车辆维修信息统计 -->
      <div class="top-modle">
        <small-header :title="'车辆维修信息统计'"> </small-header>
        <div class="modle_content">
          <div class="clwx-content">
            <div
              class="m-list"
              style="width:48%;float:left;margin-bottom:5px;"
              v-for="(item, index) in clwxList"
              :key="index"
            >
              <img
                :src="require(`@/assets/month/${item.icon}.png`)"
                style="width:40%;height:auto;"
              />
              <div class="m-content">
                <p class="m-p1">{{ item.num }}</p>
                <p class="m-p2">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 每日维修信息 -->
      <div class="cpxh-modle">
        <small-header :title="'每日维修信息'">
          <div slot="right">
            <span style="color: #7E96BA">个</span>
          </div>
        </small-header>
        <div class="cpxh-modle_content">
          <div ref="cpxhtjEcharts" class="cpxhtjEcharts"></div>
        </div>
      </div>
      <!-- 车辆换电信息统计 -->
      <div class="clhdxxtj-modle">
        <small-header :title="'车辆换电信息统计'"> </small-header>
        <div class="clhdxxtj-modle_content">
          <div ref="clhdxxtjEcharts" class="clhdxxtjEcharts"></div>
        </div>
      </div>
    </div>
    <div class="page4-center">
      <el-row class="center-list">
        <el-col :span="8" v-for="(item, index) in centertopList" :key="index">
          <div class="c-list">
            <div class="c-bg-img">
              <img
                :src="require(`@/assets/month/lj-bg.png`)"
                class="c-bg-img-1"
              />
              <img
                :src="require(`@/assets/month/${item.icon}.png`)"
                class="c-bg-img-2"
              />
            </div>
            <div class="c-content">
              <p class="c-p1">{{ item.num }}</p>
              <p class="c-p2">{{ item.name }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <div
        ref="earthEcharts"
        class="earthEcharts"
        @mouseenter="mouseenter()"
        @mouseleave="mouseleave()"
      ></div>
      <el-row class="center-list">
        <el-col
          :span="12"
          v-for="(item, index) in centerbottomList"
          :key="index"
        >
          <div class="c-list">
            <div class="c-bg-img">
              <img
                :src="require(`@/assets/month/lj-bg.png`)"
                class="c-bg-img-1"
              />
              <img
                :src="require(`@/assets/month/${item.icon}.png`)"
                class="c-bg-img-2"
              />
            </div>
            <div class="c-content">
              <p class="c-p1">{{ item.num }}</p>
              <p class="c-p2">{{ item.name }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="page4-right">
      <!-- 车型电池规格信息统计 -->
      <div class="top-modle">
        <small-header :title="'车型电池规格信息统计'"> </small-header>
        <!-- <h3 class="module-title">
					<span class="montitle-1"
						><svg-icon icon-class="bt-month" /> 车型电池规格信息统计</span
					>
				</h3> -->
        <div class="modle_content">
          <div class="clwx-content">
            <div
              class="m-list"
              style="width:48%;float:left;margin-bottom:5px;"
              v-for="(item, index) in cxdcgzList"
              :key="index"
            >
              <img
                :src="require(`@/assets/month/${item.icon}.png`)"
                style="width:40%;height:auto;"
              />
              <div class="m-content">
                <p class="m-p1">{{ item.num }}</p>
                <p class="m-p2">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 回收网点电池统计 -->
      <div class="hswddctj-modle">
        <small-header :title="'回收网点电池统计'"> </small-header>
        <div class="hswddctj-modle_content">
          <div ref="hswddctjEcharts" class="hswddctjEcharts"></div>
        </div>
      </div>
      <!-- 电池退役信息统计 -->
      <div class="dctyxxtj-modle">
        <small-header :title="'电池退役信息统计'"> </small-header>
        <div class="dctyxxtj-modle_content">
          <div ref="dctyxxtjEcharts" class="dctyxxtjEcharts"></div>
        </div>
      </div>
      <!-- 退役单体总数 -->
      <div class="tydtzs-modle">
        <div class="page4-left-2_content_text">
          <span class="page4-left-2-lift">退役单体总数</span>
          <span class="page4-left-2-right">退役厂商数</span>
        </div>
        <div class="page4-left-2-border1">
          <div class="page4-left-2-border2">
            <div
              class="page4-left-2-border2-lift"
              :style="{ width: typecar + '%' }"
            >
              <span>{{ retireSingleCount }}</span>
            </div>
            <div
              class="page4-left-2-border2-right"
              :style="{ width: typecar1 + '%' }"
            >
              <span>{{ retireCompanyCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 组件
import smallHeader from "./smallHeader";

import { cpxhtj, radarCharts, dctyxxtj, hswddctj } from "@/charts/page4";
import { worldJSON } from "@/utils/worldJSON";
import { setTimeout } from "timers";
import { calMax } from "@/utils/base";

import { getMonth } from "@/api/month/page1";

export default {
  name: "Page4",
  props: {
    load: {
      type: Boolean,
      default: false,
    },
  },
  components: { smallHeader },
  data() {
    return {
      clwxList: [],
      cxdcgzList: [],
      centertopList: [],
      centerbottomList: [],
      page4Data: [],
      typecar: 50,
      typecar1: 50,
      retireSingleCount: 0,
      retireCompanyCount: 0,
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
  created() {},
  mounted() {
    // this.cpxhtjEcharts();
    // this.clhdxxtjEcharts();
    // this.dctyxxtjEcharts();
    // this.hswddctjEcharts();
    // this.earthEcharts();
  },
  methods: {
    getMonthinfo() {
      getMonth({ type: "BatteryInfo" })
        .then(({ data }) => {
          if (data.code === 0) {
            this.page4Data = data.data ? data.data : {};
            // 地球
            this.earthEcharts();

            //车辆维修信息统计
            let CarRepair =
              data.data && data.data.carRepairStatistic
                ? JSON.parse(data.data.carRepairStatistic)
                : {};
            this.clwxList = [
              {
                name: "维修总次数",
                num:
                  CarRepair && CarRepair.repairCount
                    ? CarRepair.repairCount
                    : 0,
                icon: "wxzcs",
              },
              {
                name: "维修车辆数",
                num:
                  CarRepair && CarRepair.repairCarCount
                    ? CarRepair.repairCarCount
                    : 0,
                icon: "wxcls",
              },
              {
                name: "更换电池包数",
                num:
                  CarRepair && CarRepair.changeBatCount
                    ? CarRepair.changeBatCount
                    : 0,
                icon: "ghdcbs",
              },
              {
                name: "更换电池模块数",
                num:
                  CarRepair && CarRepair.changeBatModuleCount
                    ? CarRepair.changeBatModuleCount
                    : 0,
                icon: "ghdcmks",
              },
            ];

            //车型电池规格信息统计
            let carTypeBattery =
              data.data && data.data.carTypeBatteryStatistic
                ? JSON.parse(data.data.carTypeBatteryStatistic)
                : {};
            this.cxdcgzList = [
              {
                name: "电池单体型号数",
                num:
                  carTypeBattery && carTypeBattery.batSingleTypeCount
                    ? carTypeBattery.batSingleTypeCount
                    : 0,
                icon: "dcdtxhs",
              },
              {
                name: "电池包型号数",
                num:
                  carTypeBattery && carTypeBattery.batTypeCount
                    ? carTypeBattery.batTypeCount
                    : 0,
                icon: "dcbxhs",
              },
              {
                name: "车辆型号数",
                num:
                  carTypeBattery && carTypeBattery.carTypeCount
                    ? carTypeBattery.carTypeCount
                    : 0,
                icon: "clxhs",
              },
              {
                name: "电池模块型号数",
                num:
                  carTypeBattery && carTypeBattery.batModuleTypeCount
                    ? carTypeBattery.batModuleTypeCount
                    : 0,
                icon: "dcmkxhs",
              },
            ];

            //电池包
            this.centertopList = [
              {
                name: "电池包总数",
                num:
                  data.data && data.data.batteryCount
                    ? data.data.batteryCount
                    : 0,
                icon: "dcbzs",
              },
              {
                name: "电池模块总数",
                num:
                  data.data && data.data.batteryModuleCount
                    ? data.data.batteryModuleCount
                    : 0,
                icon: "dcmkzs",
              },
              {
                name: "单车电池总数",
                num:
                  data.data && data.data.singleBatteryCount
                    ? data.data.singleBatteryCount
                    : 0,
                icon: "dcdczs",
              },
            ];

            //车辆数
            this.centerbottomList = [
              {
                name: "已销售车辆数",
                num:
                  data.data && data.data.carSoldCount
                    ? data.data.carSoldCount
                    : 0,
                icon: "yxscls",
              },
              {
                name: "车辆总数",
                num:
                  data.data && data.data.carTotalCount
                    ? data.data.carTotalCount
                    : 0,
                icon: "clzs",
              },
            ];

            //产品型号统计
            let production =
              data.data && data.data.productionTypeStatistic
                ? JSON.parse(data.data.productionTypeStatistic)
                : {};
            console.log(production, "production");
            this.cpxhtjEcharts(production);

            //车辆换电信息统计
            let carChangePowerInfo =
              data.data && data.data.carChangePowerInfoStatistic
                ? JSON.parse(data.data.carChangePowerInfoStatistic)
                : {};
            this.clhdxxtjEcharts(carChangePowerInfo);

            //电池退役信息统计
            let retireBatteryStatistic =
              data.data && data.data.retireBatteryStatistic
                ? JSON.parse(data.data.retireBatteryStatistic)
                : {};
            this.dctyxxtjEcharts(retireBatteryStatistic);

            //回收网点统计
            let recycleBattery =
              data.data && data.data.recycleBatteryStatistic
                ? JSON.parse(data.data.recycleBatteryStatistic)
                : {};
            this.hswddctjEcharts(recycleBattery);

            // 退役单体总数
            this.retireSingleCount =
              this.page4Data && this.page4Data.retireSingleCount
                ? this.page4Data.retireSingleCount
                : 0;
            this.retireCompanyCount =
              this.page4Data && this.page4Data.retireCompanyCount
                ? this.page4Data.retireCompanyCount
                : 0;
            this.typecar =
              this.retireSingleCount == this.retireCompanyCount
                ? 50
                : this.retireSingleCount && !this.retireCompanyCount
                ? 100
                : !this.retireSingleCount && this.retireCompanyCount
                ? 0
                : this.retireSingleCount &&
                  this.retireCompanyCount &&
                  this.retireSingleCount != this.retireCompanyCount
                ? (parseInt(this.retireSingleCount) /
                    [
                      parseInt(this.retireSingleCount) +
                        parseInt(this.retireCompanyCount),
                    ]) *
                  100
                : 0;

            this.typecar1 = 100 - this.typecar;
            // console.log(this.retireSingleCount,this.typecar,1111,this.retireCompanyCount,this.typecar1)
          }
        })
        .catch(() => {});
    },
    //鼠标进入el-table时
    mouseenter() {
      this.$emit("mouseenter1");
    },
    //鼠标离开el-table时
    mouseleave() {
      this.$emit("mouseleave1");
    },
    // 产品型号统计
    cpxhtjEcharts(arr) {
      const Dom = this.$refs.cpxhtjEcharts;
      const myChart = this.$echarts.init(Dom);
      // let xData = ["11-02", "11-12", "11-18", "11-24", "11-30"];
      // let data = [
      // 	{
      // 		name: "维修总次数",
      // 		data: [20, 30, 40, 50, 60],
      // 	},
      // 	{
      // 		name: "维修车辆数",
      // 		data: [36, 50, 60, 40, 20],
      // 	},
      // 	{
      // 		name: "更换电池包数",
      // 		data: [20, 20, 50, 30, 10],
      // 	},
      // 	{
      // 		name: "更换电池模块数",
      // 		data: [35, 32, 40, 25, 10],
      // 	},
      // ];
      let xData = arr.map((item) => item.statisticTime);
      let data = [
        {
          name: "维修总次数",
          data: arr.map((item) => item.repairCount),
        },
        {
          name: "维修车辆数",
          data: arr.map((item) => item.repairCarCount),
        },
        {
          name: "更换电池包数",
          data: arr.map((item) => item.changeBatCount),
        },
        {
          name: "更换电池模块数",
          data: arr.map((item) => item.changeBatModuleCount),
        },
      ];
      const optionData = cpxhtj(xData, data);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 雷达图
    clhdxxtjEcharts(data) {
      let chartsData = [];
      chartsData[0] = data["inBatPackRecord"];
      chartsData[1] = data["carChangeEleCount"];
      chartsData[2] = data["changeEleOutBatPackCount"];
      chartsData[3] = data["changeEleRetireBatPackCount"];
      chartsData[4] = data["changeCompanyCount"];
      // chartsData=[100,80,50,90,85]
      let indicatorMax =
        Math.max(...chartsData) > 10
          ? calMax(chartsData) + 5
          : Math.max(...chartsData) + 1;
      // console.log([chartsData[0], 0, 0, 0, 0],"1111",indicatorMax)
      const Dom = this.$refs.clhdxxtjEcharts;
      const myChart = this.$echarts.init(Dom);
      myChart.clear();
      const optionData = radarCharts(indicatorMax, chartsData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 地球
    earthEcharts() {
      this.$echarts.registerMap("world", worldJSON);
      let canvas = document.createElement("canvas");
      let baseTexture = this.$echarts.init(canvas, null, {
        width: 4096,
        height: 2048,
      });
      baseTexture.setOption({
        backgroundColor: "#004692",
        geo: {
          type: "map",
          map: "world",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          boundingCoords: [
            [-180, 90],
            [180, -90],
          ],
          roam: false,
          itemStyle: {
            normal: {
              areaColor: "#1879d5",
              borderColor: "#0956aa",
            },
            emphasis: {
              areaColor: "#2e9fff",
            },
          },
          label: {
            normal: {
              fontSize: 20,
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
            emphasis: {
              fontSize: 30,
              show: true,
              textStyle: {
                color: "yellow",
              },
            },
          },
        },
      });
      let option = {
        tooltip: {
          trigger: "item",
        },
        globe: {
          baseTexture: baseTexture, // 基础纹理
          globeRadius: 95, // 球面半径
          // environment: '#000',
          shading: "color",
          light: {
            // 光照阴影
            main: {
              color: "#fff", // 光照颜色
              intensity: 1, // 光照强度
              alpha: 40,
              beta: -30,
            },
            ambient: {
              color: "#fff",
              intensity: 1,
            },
          },
          viewControl: {
            alpha: 30,
            beta: 160,
            autoRotate: true, // 开启自动旋转
            autoRotateAfterStill: 10,
            distance: 240,
          },
        },
        series: [
          {
            name: "",
            type: "lines3D",
            coordinateSystem: "globe",
            effect: {
              show: false,
            },
            blendMode: "lighter",
            lineStyle: {
              width: 2,
            },
            data: [],
            silent: false,
          },
        ],
      };
      // // 随机数据 i控制线数量
      for (let i = 0; i < 100; i++) {
        option.series[0].data = option.series[0].data.concat(this.rodamData());
      }
      const Dom = this.$refs.earthEcharts;
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      myChart.setOption(option, true);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    rodamData() {
      let name = "随机数据" + Math.random().toFixed(5) * 100000;
      // 模拟数据，构造飞线的起始经纬度
      let longitude = 116.2;
      let latitude = 39.56;
      let longitude2 = Math.random() * 360 - 180;
      let latitude2 = Math.random() * 180 - 90;
      return {
        coords: [
          [longitude, latitude],
          [longitude2, latitude2],
        ],
        value: (Math.random() * 3000).toFixed(2),
      };
    },
    // 回收网点电池统计
    hswddctjEcharts(data) {
      let chartsData = [
        {
          name: "入库电池包数",
          value: 0,
        },
        {
          name: "入库电池模块数",
          value: 0,
        },
        {
          name: "入库单体电池数",
          value: 0,
        },
        {
          name: "回收服务网点",
          value: 0,
        },
      ];
      chartsData[0].value =
        data && data["inBatPackageCount"] ? data["inBatPackageCount"] : 0;
      chartsData[1].value =
        data && data["inBatModuleCount"] ? data["inBatModuleCount"] : 0;
      chartsData[2].value =
        data && data["inSingleBatCount"] ? data["inSingleBatCount"] : 0;
      chartsData[3].value =
        data && data["recycleServicePortCount"]
          ? data["recycleServicePortCount"]
          : 0;
      const Dom = this.$refs.hswddctjEcharts;
      const myChart = this.$echarts.init(Dom);
      const optionData = hswddctj(chartsData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 电池退役信息统计
    dctyxxtjEcharts(data) {
      const Dom = this.$refs.dctyxxtjEcharts;
      const myChart = this.$echarts.init(Dom);
      let nameList = ["电池包数", "电池模块数"];
      let colors = ["#16C8C5", "#007EFF"];
      let xData = [];
      let xData1 = [];
      let xData2 = [];
      let yData = [[], []];
      if (data && data.batPackList) {
        data.batPackList.forEach((i) => {
          xData1.push(i.statisticTime);
          yData[0].push(i.statisticNum);
        });
      }
      if (data && data.batModuleList) {
        data.batModuleList.forEach((i) => {
          xData2.push(i.statisticTime);
          yData[1].push(i.statisticNum);
        });
      }
      xData =
        xData1 && xData2 && xData1.length <= xData2.length
          ? xData1
          : xData1 && xData2 && xData2.length <= xData1.length
          ? xData2
          : [];
      const optionData = dctyxxtj(nameList, colors, xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page4 {
  display: flex;
}
.page4-left {
  width: 25%;
}
.top-modle {
  height: 22vh;
}
.modle_content {
  height: 19vh;
  display: flex;
  align-items: center;
}
.cpxh-modle {
  height: 32vh;
}
.clhdxxtj-modle {
  height: 33vh;
}
.page4-center {
  width: 50%;
  padding: 0 20px;
  box-sizing: border-box;
}
.page4-right {
  width: 25%;
}
.hswddctj-modle {
  height: 28vh;
}
.dctyxxtj-modle {
  // height: 37vh;
  height: 23vh;
}
.clwx-content::after {
  clear: both;
  content: "";
  display: block;
}
.m-list {
  display: flex;
  .m-content {
    padding-top: 5px;
  }
  .m-p1 {
    font-size: 22px;
  }
  .m-p2 {
    color: #7e96ba;
  }
}
.center-list {
  margin: 0 auto;
  height: 11vh;
}
.c-list {
  text-align: center;
  .c-bg-img {
    width: 10vh;
    height: 10vh;
    text-align: center;
    padding-top: 3vh;
    box-sizing: border-box;
    margin-right: 10px;
    display: inline-block;
    position: relative;
    .c-bg-img-1 {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      animation: turnZ 3s linear infinite;
    }
    .c-bg-img-2 {
      width: 70%;
      height: auto;
    }
  }
  @keyframes turnZ {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .c-content {
    // padding-top: 5px;
    text-align: left;
    display: inline-block;
  }
  .c-p1 {
    font-size: 22px;
    margin-bottom: 5px;
  }
  .c-p2 {
    color: #7e96ba;
    font-size: 1.5vh;
    // background: linear-gradient(0deg, #95f5a7 0%, #6ecde6 100%);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }
}
.center-title {
  font-size: 16px;
  padding: 0 50px;
  font-weight: normal;
  .svg-icon {
    vertical-align: 0;
  }
}
.cpxh-modle_content {
  height: 29vh;
  display: flex;
  align-items: flex-end;
}
.cpxhtjEcharts {
  height: 28vh;
  width: 100%;
}
.clhdxxtj-modle_content {
  height: 30vh;
  display: flex;
  align-items: center;
}
.clhdxxtjEcharts {
  height: 29vh;
  width: 100%;
}
.hswddctj-modle_content {
  height: 25vh;
  display: flex;
  align-items: center;
}
.hswddctjEcharts {
  height: 23vh;
  width: 100%;
}
.dctyxxtj-modle_content {
  height: 20vh;
  display: flex;
  align-items: center;
}
.dctyxxtjEcharts {
  height: 19vh;
  width: 100%;
}
.earthEcharts {
  height: 65vh;
  width: 100%;
  background: url("../../../assets/month/dz.png") no-repeat center bottom;
  background-size: 70% auto;
  padding-bottom: 50px;
}
.tydtzs-modle {
  height: 14vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.page4-left-2_content_text {
  margin-bottom: 5px;
}
.page4-left-2-border1 {
  width: 100%;
  border: 1px solid #0d3a52;
  border-radius: 8px;
  padding: 4px;
}
.page4-left-2-lift {
  font-size: 14px;
  font-weight: 400;
  float: left;
  padding-left: 5px;
}
.page4-left-2-right {
  font-size: 14px;
  font-weight: 400;
  float: right;
  padding-right: 5px;
}
.paimingkaungIndex {
  height: 30px;
  line-height: 30px;
  color: aliceblue;
}
.page4-left-2-border2 {
  width: 100%;
  height: 3vh;
  border-radius: 5px;
  display: flex;
}
.page4-left-2-border2-lift {
  background: linear-gradient(90deg, rgba(251, 73, 123, 0), #19a8ba);
  /* width: 33%; */
  height: 100%;
  border: 1px solid #19a8ba;
  border-radius: 6px 0px 0px 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
}
.page4-left-2-border2-right {
  background: linear-gradient(90deg, #97335a, rgba(22, 200, 197, 0));
  /* width: 67%; */
  height: 100%;
  border-radius: 0px 6px 6px 0px;
  border: 1px solid #97335a;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-right: 5px;
}
</style>
