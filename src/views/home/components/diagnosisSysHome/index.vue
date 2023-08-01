<template>
  <div class="js-home-diagnosis home-container app-container">
    <div class="home-header">
      <app-home-bread
        v-for="(item, index) in digInfoList"
        :key="index"
        :value="item.value"
        :text="item.text"
        :icon-name="item.icon"
        :index="index + 1"
        :img="item.img"
      />
    </div>

    <div class="home-content">
      <div class="home-card-box-title">
        <h3 class="footer-title" style="margin-bottom:0px">
          <span>诊断核心指标概览</span>
        </h3>
        <div style="display: flex;justify-content: flex-end;margin-bottom:5px;">
          <el-radio-group
            class="controlHomeRadio"
            v-model="activeClass"
            size="mini"
            @change="setDigAnalysis"
          >
            <el-radio-button label="1">昨天</el-radio-button>
            <el-radio-button label="2">上周</el-radio-button>
            <el-radio-button label="3">上月</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="lineBox">
        <app-home-core
          v-for="(item, index) in digAnalysisInfoList"
          :key="index"
          :titleCenter="item.titleCenter"
          :icon-nameriseorfall="item.iconRiseOrFall"
          :compareCount="item.compareCount"
          :comparePercent="item.comparePercent"
          :compareContent="item.compareContent"
          :compare="item.compare"
          :index="index + 1"
        >
          <div slot="content-center">
            <div class="box-tips"></div>
          </div>
          <div slot="content" class="content-echart-wrapper">
            <div :id="item.id" class="content-echart" />
          </div>
        </app-home-core>
      </div>
    </div>

    <div class="home-footer">
      <div class="footer-list">
        <h3 class="footer-title">
          <!-- <svg-icon :icon-class="'ecuTop5-'+activeName"/> -->
          ECU诊断Top5
        </h3>
        <div id="bar1" class="footer-bar"></div>
      </div>
      <div class="footer-list">
        <h3 class="footer-title">
          <!-- <svg-icon :icon-class="'zhenduanzhiling-'+activeName"/>  -->
          诊断指令Top5
        </h3>
        <div id="bar2" class="footer-bar"></div>
      </div>
      <div class="footer-list">
        <h3 class="footer-title">
          <!-- <svg-icon :icon-class="'zhenduanguzhangma-'+activeName"/>  -->
          诊断故障码Top5
        </h3>
        <ul class="all-content-info all-statistics-info">
          <li class="table-header flex-li">
            <p>排名</p>
            <p>故障码</p>
            <p>故障描述</p>
            <p>故障次数</p>
          </li>
          <div class="home-scroll statistics-scroll">
            <el-scrollbar
              style="height:100%;"
              wrap-class="default-scrollbar__wrap"
            >
              <li
                v-for="(item, index) in faultStatisticsList"
                :key="index"
                style="height:20%;color:#595757"
                :class="
                  index == faultStatisticsList.length - 1
                    ? 'flex-li content-info-li last-li'
                    : 'flex-li content-info-li'
                "
              >
                <p>{{ index + 1 }}</p>
                <p>{{ item.digResult }}</p>
                <el-tooltip
                  v-if="item.digContent"
                  :content="item.digContent"
                  placement="bottom"
                  effect="light"
                >
                  <p>
                    {{
                      item.digContent.length > 4
                        ? item.digContent.substring(0, 6) + "..."
                        : item.digContent
                    }}
                  </p>
                </el-tooltip>
                <p v-else>-</p>
                <p>{{ item.total }}</p>
              </li>
            </el-scrollbar>
          </div>
        </ul>
      </div>
      <div class="footer-list">
        <h3 class="footer-title">
          <!-- <svg-icon :icon-class="'yonghucaozuo-'+activeName"/>  -->
          用户操作Top5
        </h3>
        <ul class="all-content-info all-statistics-info">
          <li class="table-header flex-li flexUnset">
            <p style="width:15%">排名</p>
            <p style="width:60%">用户</p>
            <!-- <p>岗位</p> -->
            <p style="width:25%">诊断次数</p>
          </li>
          <div class="home-scroll statistics-scroll">
            <el-scrollbar
              style="height:100%;"
              wrap-class="default-scrollbar__wrap"
            >
              <li
                v-for="(item, index) in userOperStatisticsList"
                :key="index"
                style="height:20%;color:#595757"
                :class="
                  index == userOperStatisticsList.length - 1
                    ? 'flex-li flexUnset content-info-li last-li'
                    : 'flex-li flexUnset content-info-li'
                "
              >
                <p style="width:15%">{{ index + 1 }}</p>
                <p style="width:60%">{{ item.loginname }}</p>
                <!-- <p>{{ item.SHORTNAME }}</p> -->
                <p style="width:25%">{{ item.total }}</p>
              </li>
            </el-scrollbar>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import appHomeBread from "./components/homeBread";
import appHomeCard from "./components/homeCard";
import appHomeCore from "./components/homeCore";
import {
  getDigTotalData,
  getDigAnalysisInfo,
  getDigTop,
} from "@/api/diagnosisSys/home";
export default {
  name: "home",
  components: {
    appHomeBread,
    appHomeCard,
    appHomeCore,
  },
  data() {
    return {
      digInfoList: [
        {
          value: [0],
          text: ["累计诊断次数（次）"],
          icon: ["icon_zdcs"],
          type: "diagnosisTimes",
          img: "tp_leijizhenduancishu",
        },
        {
          value: [0],
          text: ["累计诊断车辆（台）"],
          icon: ["icon_zdcl"],
          type: "diagnosisCars",
          img: "tp_leijizhenduancheliang",
        },
        {
          value: [0],
          text: ["支持诊断车辆（台）"],
          icon: ["icon_zczd"],
          type: "supportCarNum",
          img: "tp_zhichizhenduan",
        },
        {
          value: [0, 0, 0],
          text: [
            "平台ODX文件（个）",
            "SO安全库文件（个）",
            "平台车型数量（个）",
          ],
          icon: ["ODX", "SOanquanwenjian", "pingtaichexing"],
          type: "saveServiceMoney",
        },
      ],
      digAnalysisInfoList: [
        {
          type: "totalDigData",
          id: "charts1",
          titleCenter: "累计诊断次数（次）",
          compareCount: 0,
          comparePercent: "0%",
          compareContent: "同比昨天",
          iconRiseOrFall: "",
          compare: 0,
          tips: "诊断次数",
        },
        {
          type: "onlineDigData",
          id: "charts2",
          titleCenter: "在线诊断次数（次）",
          compareCount: 0,
          comparePercent: "0%",
          compareContent: "同比昨天",
          iconRiseOrFall: "",
          compare: 0,
          tips: "诊断次数",
        },
        {
          type: "offlineDigData",
          id: "charts3",
          titleCenter: "离线诊断次数（次）",
          compareCount: 0,
          comparePercent: "0%",
          compareContent: "同比昨天",
          iconRiseOrFall: "",
          compare: 0,
          tips: "诊断次数",
        },
        {
          type: "carDigData",
          id: "charts4",
          titleCenter: "诊断车辆数（台）",
          compareCount: 0,
          comparePercent: "0%",
          compareContent: "同比昨天",
          iconRiseOrFall: "",
          compare: 0,
          tips: "诊断车辆数",
        },
      ],
      faultStatisticsList: [],
      userOperStatisticsList: [],
      digAnalysisDataList: {},
      activeClass: 1,
    };
  },
  computed: {
    ...mapGetters(["activeName"]),
  },
  mounted() {
    this.digTotalList();
    this._getDigAnalysisInfo();
    this.digTopList();
  },
  // 监听
  watch: {},
  created() {},
  methods: {
    //诊断统计数据
    digTotalList() {
      getDigTotalData().then(({ data }) => {
        if (data.code === 0) {
          if (data.data) {
            const result = data.data || [];
            const list = this.digInfoList;
            for (let i = 0; i < list.length; i++) {
              if (i == 3) {
                let array = [];
                let text = ["supportOdxNum", "supportSoNum", "supportCarType"];
                text.forEach((item) => {
                  let value = result[item] ? result[item] : 0;
                  array.push(value);
                });
                list[i]["value"] = array;
              } else {
                // console.log(list[i]["value"])
                // this.digInfoList[i]["value"][0] = result[this.digInfoList[i].type]
                list[i]["value"].push(Number(result[list[i].type]));
              }
            }
            // console.log(this.digInfoList);
          }
        }
      });
    },
    _getDigAnalysisInfo() {
      getDigAnalysisInfo().then(({ data }) => {
        if (data.code === 0) {
          if (data.data) {
            this.digAnalysisDataList = data.data;
            this.setDigAnalysis();
          }
        }
      });
    },
    setDigAnalysis() {
      let dateType =
        this.activeClass == 1
          ? "yesterdayData"
          : this.activeClass == 2
          ? "lastWeekData"
          : this.activeClass == 3
          ? "lastMonthData"
          : "yesterdayData";
      const item = this.getCompareContent(this.activeClass);
      if (Object.keys(this.digAnalysisDataList).length > 0) {
        const result = this.digAnalysisDataList[dateType];

        for (let i = 0; i < this.digAnalysisInfoList.length; i++) {
          const type = this.digAnalysisInfoList[i].type;
          this.digAnalysisInfoList[i].compareCount = result[type].total;
          this.digAnalysisInfoList[i].comparePercent =
            Math.abs(result[type].compare) + "%";
          this.digAnalysisInfoList[i].compare = result[type].compare;
          this.digAnalysisInfoList[i].compareContent = item;
          this.digAnalysisInfoList[i].iconRiseOrFall = this.getIcon(
            result[type].compare
          );
          var xdata = result[type].key || [];
          var ydata = result[type].value || [];
          // extraParams.yToolTipLable = this.digAnalysisInfoList[i].tips
          const extraParams = {
            xToolTipLable: "",
            yToolTipLable: this.digAnalysisInfoList[i].tips,
            lineColor: "#2aa6ff",
            topColor: "#F4FAFF",
            bottomColor: "#FAFDFF",
          };
          this.getExtraParams(i, extraParams);
          // console.log("charts" + (i + 1), xdata, ydata, extraParams, 123);
          this.$echartsDiagnosis.line1(
            "charts" + (i + 1),
            xdata,
            ydata,
            extraParams
          );
          let mychart = this.$echarts.init(
            document.getElementById("charts" + (i + 1))
          );
          this.$elementResizeDetectorMaker.listenTo(
            document.getElementById("charts" + (i + 1)),
            (element) => {
              this.$nextTick(() => {
                mychart.resize();
              });
            }
          );
        }
      }
    },
    getExtraParams(index, extraParams) {
      let lj = ["#00ACFF", "#00ACFF", "#fff"];
      let zx = ["#1E64DD", "#1E64DD", "#fff"];
      let lx = ["#1FE0A3", "#1FE0A3", "#fff"];
      let cl = ["#FFAB26", "#FFAB26", "#fff"];
      switch (index) {
        case 0:
            extraParams.lineColor = lj[0]
            extraParams.topColor = lj[1]
            extraParams.bottomColor = lj[2]
          break;
        case 1:
            extraParams.lineColor = zx[0]
            extraParams.topColor = zx[1]
            extraParams.bottomColor = zx[2]
          break;
        case 2:
          extraParams.lineColor = lx[0]
            extraParams.topColor = lx[1]
            extraParams.bottomColor = lx[2]
          break;
        case 3:
            extraParams.lineColor = cl[0]
            extraParams.topColor = cl[1]
            extraParams.bottomColor = cl[2]
          break;
      }
    },
    getCompareContent(index) {
      switch (index) {
        case 1:
          return "同比前天";
        case 2:
          return "同比上周";
        case 3:
          return "同比上月";
        default:
          return "同比前天";
      }
    },
    getIcon(compare) {
      if (compare >= 0) {
        return "jt-slode";
      } else {
        return "jt-down";
      }
    },
    digTopList() {
      getDigTop().then(({ data }) => {
        if (data.code === 0) {
          if (data.data) {
            const result = data.data || [];
            this.faultStatisticsList = JSON.parse(result.topErrorCode);
            this.userOperStatisticsList = JSON.parse(result.topUserOperate);
            let topEcu = JSON.parse(result["topEcu"]);
            let topCommand = JSON.parse(result["topCommand"]);
            this.setBar(topEcu, 1);
            this.setBar(topCommand, 2);
          }
        }
      });
    },
    setBar(array, index) {
      let key = [],
        value = [];
      array.forEach((element) => {
        let objkey = "",
          objvalue = "";
        if (index == 1) {
          objkey = element.ecuName;
          objvalue = element.num;
        } else if (index == 2) {
          objkey = element.op;
          objvalue = element.opCount;
        }
        key.push(objkey);
        value.push(objvalue);
      });

      let extraParams = {
        xToolTipLable: "ECU",
        yToolTipLable: "诊断次数",
        color: "#1E64DD",
      };
      if (index == 2) {
        extraParams.xToolTipLable = "诊断指令";
        extraParams.color = "#1E64DD";
      }
      this.$echartsDiagnosis.bar1("bar" + index, key, value, extraParams);
      let mychart = this.$echarts.init(document.getElementById("bar" + index));
      this.$elementResizeDetectorMaker.listenTo(
        document.getElementById("bar" + index),
        (element) => {
          this.$nextTick(() => {
            mychart.resize();
          });
        }
      );
    },
  },
};
</script>

<style lang="scss">
.js-home-diagnosis {
  height: 100% !important;
  overflow: hidden;
}
.home-container {
  display: flex;
  flex-direction: column;
  .home-header {
    // height: calc(20% - 10px);
    height: 20%;
    // margin: 10px 0 0 0;
    display: flex;
    justify-content: space-between;
  }
  .home-content {
    height: calc(40% - 10px);
    margin-top: 10px;
    border-radius: 4px;
    .home-card-box-title {
      padding: 0 15px;
      // height: 3vh;
      // line-height: 3vh;
      p {
        &.box-title {
          font-size: 15px;
          display: inline-block;
          vertical-align: middle;
          // margin: 10px 0;
        }
        &.core-title-left {
          span {
            font-size: 12px;
          }
          svg {
            font-size: 14px;
          }
        }
        &.core-title-right {
          float: right;
          font-size: 12px;
          cursor: pointer;
          // line-height: 17px;
        }
        span {
          margin: 0 5px;
          // &.click-color {
          // color: #0fa5f6;
          // border-bottom: 1px solid #0fa5f6;
          // }
        }
      }
      // span {
      // margin-left: 10px;
      // }
    }
    .lineBox {
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      height: calc(100% - 68px);
    }
  }
  .content-echart-wrapper {
    height: calc(100% - 65px);
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .content-echart {
    width: 100%;
    height: 100%;
  }
  .home-footer {
    margin-top: 10px;
    height: calc(40% - 10px);
    display: flex;
    justify-content: space-between;
    .footer-list {
      height: 100%;
      border-radius: 4px;
      width: 24%;
    }
    .footer-title {
      padding: 0 15px;
      height: 38px;
      line-height: 38px;
      margin: 0;
    }
    .footer-bar {
      width: 100%;
      // height: 78%;
      height: calc(100% - 40px);
      // margin-top: 10px;
    }
    .all-content-info {
      padding: 0 5px;
      margin: 0;
      height: calc(100% - 40px);
      &.all-fault-info {
        overflow: auto;
      }
      .flex-li {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        p {
          flex: 1;
          text-align-last: center;
        }
      }
      .flexUnset p {
        flex: unset !important;
      }
      .statistics-scroll {
        overflow: hidden;
        //max-height: 250px;
        height: calc(100% - 33px);
        .el-scrollbar__view {
          height: 100%;
        }
      }
      .content-info-li {
        font-size: 12px;
        // color: #9EA8B2;
        // padding: 14px 0px;
        // height: 20%;
        min-height: 15px;
        // border-bottom: 1px solid #fbfbfc;
      }
      .content-info-li.last-li {
        border-bottom: 0 none;
      }
      .table-header {
        color: #272727;
        // background: #f1faff;
        // background-clip: content-box;
        border-radius: 4px;
        font-size: 12px;
        p {
          padding: 10px 0;
        }
      }
    }
  }
}
.el-tooltip__popper.is-light {
  background: #edeeef !important;
  border: 1px solid #666 !important;
  color: #666 !important;
}
</style>
