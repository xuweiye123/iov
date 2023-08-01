<template>
  <div class="content-page page3">
    <el-row class="page3-subject">
      <el-col :span="6">
        <div class="page3-left">
          <!-- 从上往下第一块 -->
          <div class="page3-left-1">
            <!-- 头部插件 -->
            <small-header :title="'通过国家公告车型数'"> </small-header>
            <div class="page3-left-1_content">
              <div class="page3-left-1-1">
                <img
                  src="../../../assets/images/mileage.png"
                  class="page3-left-1-1-img"
                  alt=""
                />
                <img
                  src="../../../assets/images/Notice.png"
                  class="page3-left-1-1-img2"
                  alt=""
                />
                <span>累计公告车型数</span>
                <div class="page3-left-1-data">
                  {{ page5data.carTypeCount ? page5data.carTypeCount : 0 }}
                  <div>个</div>
                </div>
              </div>

              <div class="page3-left-1-2">
                <img
                  src="../../../assets/images/mileage.png"
                  class="page3-left-1-1-img"
                  alt=""
                />
                <img
                  src="../../../assets/images/dygg.png"
                  class="page3-left-1-1-img2"
                  alt=""
                />
                <span>当月公告车型数</span>
                <div class="page3-left-1-data">
                  {{
                    page5data.carTypeCountMonth
                      ? page5data.carTypeCountMonth
                      : 0
                  }}
                  <div>个</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 第二块 -->
          <div class="page3-left-2">
            <!-- 头部插件 -->
            <small-header :title="'地方，企业平台转发数分析'"> </small-header>
            <div class="page3-left-2_content">
              <div class="page3-left-2_content_text">
                <span class="page3-left-2-lift">对地方平台</span>
                <span class="page3-left-2-right">对企业平台</span>
              </div>
              <div class="page3-left-2-border1">
                <div class="page3-left-2-border2">
                  <div
                    class="page3-left-2-border2-lift"
                    :style="{ width: typecar + '%' }"
                  >
                    <span style="padding-left:10px;">{{ typecar + "%" }}</span>
                  </div>
                  <div
                    class="page3-left-2-border2-right"
                    :style="{ width: typecar1 + '%' }"
                  >
                    <span style="padding-right:10px;">{{
                      typecar1 + "%"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 第三块 -->
          <div class="page3-left-3">
            <!-- 头部插件 -->
            <small-header :title="'车型详情'">
              <!-- <div slot="right">
                <span style="color: #7E96BA">辆</span>
              </div> -->
            </small-header>
            <div
              class="page3-left-3-div"
              @mouseenter="mouseenter()"
              @mouseleave="mouseleave()"
            >
              <el-table :data="typeNumber" stripe size="mini" height="39vh">
                <el-table-column label="排名">
                  <template slot-scope="scope">
                    <div v-if="scope.$index == 0" class="paimingkaung1">
                      <div class="paimingkaungIndex">
                        {{ scope.$index + 1 }}
                      </div>
                    </div>
                    <div v-else-if="scope.$index == 1" class="paimingkaung2">
                      <div class="paimingkaungIndex">
                        {{ scope.$index + 1 }}
                      </div>
                    </div>
                    <div v-else-if="scope.$index == 2" class="paimingkaung3">
                      <div class="paimingkaungIndex">
                        {{ scope.$index + 1 }}
                      </div>
                    </div>
                    <div v-else class="paimingkaung">
                      <div class="paimingkaungIndex">
                        {{ scope.$index + 1 }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="车型">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="value"
                  label="转发数"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="page3-middle">
          <div class="page3-middle-frequency">
            <div class="module-title" style="height:3vh;">
              <div
                style="width:1.6vh;height:1.6vh;margin-right:1vh"
                class="dfc"
              >
                <img
                  style="width:100%;height:100%;"
                  src="../../../assets/month/sanjiao.png"
                />
              </div>
              <span class="fontB">转发总次数</span>
            </div>
            <div class="car-number">
              <div class="cuntings-box">
                <i
                  v-for="(item, index) in cunting"
                  :key="index"
                  :class="['cunting', item === '' ? 'douhao-bg' : '']"
                  >{{ item }}</i
                >
              </div>
              <div style="display:flex;align-items: self-end;">
                <span
                  v-for="(item, index) in numbers"
                  :key="index"
                  :class="[
                    'numbers',
                    item === ',' ? 'douhao douhao-bg' : 'numbers-bg',
                  ]"
                  >{{ item }}</span
                >
                <span class="cunting">次</span>
              </div>
            </div>
          </div>
          <div class="page3-middle-Map" id="Charts-china"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="page3-right">
          <div
            class="page3-right-left"
            v-for="(item, index) in rightList"
            :key="index"
          >
            <img :src="require(`@/assets/images/${item.icon}.png`)" />
            <div class="page3-right-left-bg">
              <span>{{ item.name }}：</span>
              <div class="page3-right-right">
                <span class="page3-right-right-size">{{ item.unti }}</span>
                <div>{{ item.num }}</div>
              </div>
              <div class="sanjiao"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 组件
import smallHeader from "./smallHeader";
import { ChineseCharts } from "@/charts/page3";

import { getMonth } from "@/api/month/page1";

export default {
  name: "Page3",
  props: {
    load: {
      type: Boolean,
      default: false,
    },
  },
  components: { smallHeader },
  data() {
    return {
      cunt: ["亿", "千万", "百万", "十万", "万", "千", ""], // 空字符串是为了数字里面的逗号预留位置
      cunting: [],
      numbers: [],
      page5data: [],
      typecar: 50,
      typecar1: 50,
      carCountPublicPlace: 0,
      carCountPrivate: 0,
      faulttal: 0,
      faultlv: 0,
      faultcar: 0,
      typeNumber: [],
      carCountTotal: 0,
      rightList: [],
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
  mounted() {},
  methods: {
    getMonthinfo() {
      getMonth({ type: "CarForward" })
        .then(({ data }) => {
          if (data.code === 0) {
            this.page5data = data.data ? data.data : {};
            //地方，企业平台转发数分析
            this.carCountPublicPlace =
              this.page5data && this.page5data.carCountPublicPlace
                ? this.page5data.carCountPublicPlace
                : 0;
            this.carCountPrivate =
              this.page5data && this.page5data.carCountPrivate
                ? this.page5data.carCountPrivate
                : 0;
            this.typecar =
              this.carCountPublicPlace == this.carCountPrivate
                ? 50
                : this.carCountPublicPlace && !this.carCountPrivate
                ? 100
                : !this.carCountPublicPlace && this.carCountPrivate
                ? 0
                : this.carCountPublicPlace &&
                  this.carCountPrivate &&
                  this.carCountPublicPlace != this.carCountPrivate
                ? parseInt(
                    ((this.carCountPublicPlace * 1) /
                      [
                        this.carCountPublicPlace * 1 + this.carCountPrivate * 1,
                      ]) *
                      100
                  )
                : 0;
            this.typecar1 = parseInt(100 - this.typecar);
            //车型详情
            let forwardCar =
              data.data && data.data.forwardCarTop5
                ? JSON.parse(data.data.forwardCarTop5)
                : {};
            for (const key in forwardCar) {
              this.typeNumber.push({
                name: forwardCar[key].typeName,
                value: forwardCar[key].forwardCount,
              });
            }

            //转发总次数
            this.carCountTotal =
              data.data && data.data.carCountTotal
                ? data.data.carCountTotal
                : 0;
            this.rightList = [
              {
                name: "转发总车辆数",
                num: this.carCountTotal,
                icon: "zf-vehicles",
                unti: "辆",
              },
              {
                name: "转发总数据量",
                num: this.page5data.sendCountTotal
                  ? this.page5data.sendCountTotal
                  : 0,
                icon: "zfs",
                unti: "TB",
              },
              {
                name: "对国家平台转发车辆数",
                num: this.page5data.carCountPublicCountry
                  ? this.page5data.carCountPublicCountry
                  : 0,
                icon: "gjc",
                unti: "辆",
              },
              {
                name: "对国家平台转发数据量",
                num: this.page5data.sendCountPublicCountry
                  ? this.page5data.sendCountPublicCountry
                  : 0,
                icon: "gjs",
                unti: "TB",
              },
              {
                name: "对地方平台转发车辆数",
                num: this.page5data.carCountPublicPlace
                  ? this.page5data.carCountPublicPlace
                  : 0,
                icon: "df-vehicles",
                unti: "辆",
              },
              {
                name: "对地方平台转发数据量",
                num: this.page5data.sendCountPublicPlace
                  ? this.page5data.sendCountPublicPlace
                  : 0,
                icon: "dfs",
                unti: "TB",
              },
              {
                name: "对企业平台转发车辆数",
                num: this.page5data.carCountPrivate
                  ? this.page5data.carCountPrivate
                  : 0,
                icon: "qyc",
                unti: "辆",
              },
              {
                name: "对企业平台转发数据量",
                num: this.page5data.sendCountPrivate
                  ? this.page5data.sendCountPrivate
                  : 0,
                icon: "qys",
                unti: "TB",
              },
            ];
            this.cuntFilter(this.carCountTotal);
            //地图
            this.forwardCityList =
              data.data && data.data.forwardCityList
                ? data.data.forwardCityList
                : [];
            this._ChineseCharts(this.forwardCityList);
          }
        })
        .catch(() => {});
    },
    cuntFilter(data) {
      const cunt = ["亿", "千万", "百万", "十万", "万", "千", ""];
      // 数字
      let val = data.toString();
      if (val.length < 9) {
        // 还差几位到9位
        let cNum = 9 - val.length;
        for (let index = 0; index < cNum; index++) {
          val = val.split("");
          val.unshift("0");
          val = val.join("");
        }
      }
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
        cunt.splice(3, 0, "");
      }
      this.cunting = cunt.slice(
        cunt.length + 3 - this.numbers.length,
        cunt.length
      );
    },
    _ChineseCharts(data) {
      const Dom = document.getElementById("Charts-china");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();
      const optionData = ChineseCharts(data);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    //鼠标进入el-table时
    mouseenter() {
      this.$emit("mouseenter1");
    },
    //鼠标离开el-table时
    mouseleave() {
      this.$emit("mouseleave1");
    },
  },
};
</script>

<style scoped lang="scss">
/* el-table样式重写 */
::v-deep .page3-left-3-div .el-table {
  background-color: transparent !important;
  font-size: 10px;
  color: rgba(21, 186, 255, 1) !important;
  border-radius: 0 !important;
  box-shadow: unset !important;
  border: 1px solid #112b5f;
}
::v-deep .el-table th,
.el-table tr {
  background: transparent !important;
}
::v-deep .page3-left-3-div .el-table th {
  color: aliceblue;
  border-right: 0px solid;
  border-bottom: 1px solid #112b5f !important ;
  text-align: center;
}
::v-deep .page3-left-3-div .el-table tr {
  background: transparent !important;
  padding: 3px 0 !important;
  height: 35px;
  line-height: 35px;
}
/* 斑马纹 */
::v-deep .page3-left-3-div .el-table tr:nth-child(odd) {
  position: relative;
  background: linear-gradient(
    90deg,
    RGBA(13, 38, 68, 1),
    RGBA(13, 38, 68, 0)
  ) !important;
}
::v-deep .has-gutter tr {
  background: red !important;
}
::v-deep .el-table__body {
  width: 100% !important;
}
::v-deep .has-gutter .gutter {
  width: 0 !important;
}
::v-deep .el-table tr td,
.el-table--border::after,
.el-table--group::after,
.el-table::before,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-bottom: 1px solid #112b5f !important;
  background: transparent !important;
  padding: 2px 0 !important;
  text-align: center;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: transparent !important; /*滚动条的背景颜色*/
  border: 1px solid #112b5f !important;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #0f498a !important;
}

.page3-subject {
  height: 87vh;
}
.page3-left {
  height: 87vh;
}
.page3-left-1 {
  width: 100%;
  height: 28vh;
  .page3-left-1_content {
    margin: 1vh auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}

.page3-left-1-1 {
  height: 10vh;
  position: relative;
  margin-bottom: 1vh;
}
.page3-left-1-2 {
  height: 10vh;
  position: relative;
}

.page3-left-1 span {
  font-weight: 500;
  position: absolute;
  font-size: 1.7vh;
  top: 3.5vh;
  left: 11vh;
}
.page3-left-1-data {
  position: absolute;
  top: -1vh;
  font-size: 4vh;
  left: 27vh;
  color: #009cff;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
.page3-left-1-data div {
  color: #7e96ba;
  margin-left: 2px;
}
.page3-left-2 {
  width: 100%;
  height: 17vh;
  /* margin-top: 5vh; */
  .page3-left-2_content {
    height: 14vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .page3-left-2_content_text {
      margin-bottom: 5px;
    }
    .page3-left-2-lift {
      font-size: 14px;
      font-weight: 400;
      float: left;
      padding-left: 5px;
    }
    .page3-left-2-right {
      font-size: 14px;
      font-weight: 400;
      float: right;
      padding-right: 5px;
    }
  }
}
.page3-left-3 {
  width: 100%;
  height: 42vh;
}
.page3-middle {
  height: 87vh;
  padding: 2vh;
}
.page3-middle-frequency {
  width: 100%;
  height: 20vh;
}

.page3-middle-Map {
  width: 100%;
  height: 67vh;
  background: url(../../../assets/images/MapDi.png) no-repeat;
  background-position: center;
  background-size: 90%;
}
.page3-right {
  height: 87vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.paimingkaung {
  background: url("../../../assets/images/04.png") no-repeat;
  background-position: center;
  background-size: 30%;
  height: 31.67px;
  position: relative;
}
.paimingkaung1 {
  background: url("../../../assets/images/01.png") no-repeat;
  background-position: center;
  background-size: 30%;
  height: 31.67px;
  position: relative;
}
.paimingkaung2 {
  background: url("../../../assets/images/02.png") no-repeat;
  background-position: center;
  background-size: 30%;
  height: 31.67px;
  position: relative;
}
.paimingkaung3 {
  background: url("../../../assets/images/03.png") no-repeat;
  background-position: center;
  background-size: 30%;
  height: 31.67px;
  position: relative;
}
.page3-left-3-div {
  display: flex;
  align-content: center;
  justify-content: center;
}
.page3-left-3-div img {
  position: absolute;
  top: 5px;
  left: 48px;
}

.page3-left-2-border1 {
  width: 100%;
  height: 4.5vh;
  border-radius: 8px;
  border: 1px solid #0d3a52;
  padding: 4px;
}

.page3-right-right span {
  width: 15% !important;
  margin-top: 1.5vh;
  margin-right: 5px;
  color: RGBA(92, 124, 149, 1);
}
.paimingkaungIndex {
  height: 30px;
  line-height: 30px;
  color: aliceblue;
}
.page3-left-2-border2 {
  width: 100%;
  height: 3vh;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page3-left-2-border2-lift {
  background: linear-gradient(90deg, rgba(22, 200, 197, 0), #16c8c5);
  /* width: 67%; */
  height: 100%;
  border-radius: 6px 0px 0px 6px;
  border: 1px solid #19a8ba;
  // border: 1px solid #2af8ff;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 5px;
}
.page3-left-2-border2-right {
  background: linear-gradient(90deg, #fb497b, rgba(251, 73, 123, 0));
  /* width: 33%; */
  height: 100%;
  border: 1px solid #97335a;
  // border: 1px solid #fb497b;
  border-radius: 0px 6px 6px 0px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-left: 5px;
}
.page3-right img {
  height: 6vh;
}
.page3-right span {
  margin-left: 10px;
  font-size: 12px;
  width: 100%;
  transform: scale(0.9);
}
.page3-right-left {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
.page3-right-left-bg {
  width: 100%;
  height: 6vh;
  background: url("../../../assets/images/forward.png") no-repeat;
  background-size: 100% 145%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
}
.page3-right-right {
  width: 40%;
  height: 6vh;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-right: 1.5vh;
}
.page3-right-right span {
  color: #7e96ba;
}
.page3-right-right div {
  background: linear-gradient(90deg, #00f7ff 0%, #009cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3.5vh;
  font-weight: 500;
}
.page3-left-1-1-img {
  position: absolute;
  height: 10vh;
}
.page3-left-1-1-img2 {
  position: absolute;
  height: 8vh;
  top: 1vh;
  left: 1vh;
}
.page3-middle .module-title {
  padding: 3vh 0 0 8vh;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
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
.car-number {
  // padding-left:3vh;
  position: absolute;
  top: 15vh;
  left: calc(50% + 3vh);
  transform: translate(-50%, -50%);
}
.cuntings-box {
  margin: 0 0 0.2vh 0;
  height: 2.6vh;
}
.cunting {
  font-family: SourceHanSansCN-Bold;
  font-weight: bold;
  color: #ffffff;
  display: inline-block;
  width: 6vh;
  text-align: center;
  font-style: normal;
  margin-right: 5px;
}
.douhao-bg {
  width: 1vh !important;
  background-color: unset;
}
.numbers {
  display: inline-block;
  width: 6vh;
  height: 10vh;
  line-height: 11vh;
  text-align: center;
  font-size: 45px !important;
  font-family: Roboto-Regular;
  margin-right: 5px;
  position: relative;
  border-radius: 5px 5px 5px 5px;
}
.numbers-bg {
  color: #fff;
  background: url(../../../assets/month/nub.png) center no-repeat;
  background-size: 100% 100%;
}
.sanjiao {
  width: 0;
  height: 0;
  border-bottom: 1vh solid #007eff;
  border-left: 1vh solid transparent;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
