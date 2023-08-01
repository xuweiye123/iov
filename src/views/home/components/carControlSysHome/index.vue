<template>
  <div class="js-home-carControl home-container app-container carControl">
    <div class="home-header">
      <app-home-bread />
    </div>
    <div class="home-content">
      <div class="home-card-box-title">
        <p class="box-title bread-text-alone">
          <span>整体趋势</span>
        </p>
        <div class="RadioTop">
          <el-date-picker
            v-model="choiceData"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="switchCar"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="tabPositionDiv">
        <el-radio-group
          class="controlHomeRadio"
          v-model="tabPosition"
          size="mini"
          @change="switchCar"
        >
          <el-radio-button label="3">空调</el-radio-button>
          <el-radio-button label="4">除霜</el-radio-button>
          <el-radio-button label="2">解闭锁</el-radio-button>
          <el-radio-button label="1">车窗开度</el-radio-button>
          <el-radio-button label="6">座椅加热</el-radio-button>
          <el-radio-button label="5">寻车</el-radio-button>
        </el-radio-group>
      </div>
      <div v-loading="listLoading" id="wholCcar" class="wholCcar"></div>
    </div>
    <div class="home-footer">
      <div class="footer-list footer-list-w1">
        <h3 class="footer-title">
          <p class="box-title bread-text-alone">
            <span>TOP远程控制功能</span>
          </p>
          <el-radio-group
            class="controlHomeRadio RadioTop"
            v-model="footertitle"
            size="mini"
            @change="switchCar1"
          >
            <el-radio-button label="1">累计</el-radio-button>
            <el-radio-button label="2">近七日</el-radio-button>
            <el-radio-button label="3">近三十日</el-radio-button>
          </el-radio-group>
        </h3>
        <div v-loading="listLoading1" id="bar1" class="footer-bar"></div>
      </div>
      <div class="footer-list footer-list-w2">
        <h3 class="footer-title">
          <p class="box-title bread-text-alone">
            <span>TOP渠道</span>
          </p>
        </h3>
        <div v-loading="listLoading2" id="bar2" class="footer-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import appHomeBread from "./components/homeBread";
import { mapState } from "vuex";
import { wholCcarCharts, RemoteControl, RemoteTop } from "@/utils/homeEcharts";
import { countTotal } from "@/utils/base.js"

import {
  queryRemoteTypeSum,
  queryControlSumToday,
  getRemoteChannel
} from "@/api/carControlSys/carControlSysHome";
export default {
  name: "carControlSysHome",
  components: {
    appHomeBread,
  },
  data() {
    return {
      listLoading: false,
      listLoading1: false,
      listLoading2: false,
      choiceData: "",
      tabPosition: "3",
      footertitle: "1",
    };
  },
  computed: {
    ...mapState("theme", ["activeName"]),
  },
  watch: {
    // "$store.state.theme.activeName": function(val) {
    //   if (val) {
    //     if (this.$route.name == "home") {
    //       this.switchCar();
    //       this.switchCar1();
    //     }
    //   }
    // },
    // "$store.state.app.sidebarCollapse": function() {
    //   if (this.$route.name == "home") {
    //     this.switchCar();
    //     this.switchCar1();
    //   }
    // },
  },
  mounted() {
    this._dataGetter();
    this.switchCar();
    this.switchCar1();
    this._getRemoteChannel();
  },
  methods: {
    //根据日期和选项切换数据
    switchCar() {
      let parms = {
        startTime: this.choiceData + " 00:00:00",
        endTime: this.choiceData + " 23:59:59",
        controlType: this.tabPosition,
      };
      this.listLoading = true;
      const todayLise = [[], []];
      queryControlSumToday(parms)
        .then(({ data }) => {
          if (data.code == 0) {
            let todayData=data.data&&data.data.today?data.data.today:[]
            let yesterdayData=data.data&&data.data.yesterday?data.data.yesterday:[]
            todayData.forEach(i=>{
              // i.timeValue=i.time?i.time.split(" ")[1].split(":")[0]+":"+i.time.split(" ")[1].split(":")[1]:""
              i.timeValue=i.time?i.time.split(" ")[1].split(":")[0]+":00":""
            })
            yesterdayData.forEach(i=>{
              // i.timeValue=i.time?i.time.split(" ")[1].split(":")[0]+":"+i.time.split(" ")[1].split(":")[1]:""
              i.timeValue=i.time?i.time.split(" ")[1].split(":")[0]+":00":""
            })
            this._wholCcarCharts(todayData,yesterdayData);
            // for (const key in data.data.today) {
            //   todayLise[0].push(data.data.today[key].sum);
            // }
            // for (const key in data.data.yesterday) {
            //   todayLise[1].push(data.data.yesterday[key].sum);
            // }
            // this._wholCcarCharts(todayLise);
            
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    switchCar1() {
      let parms = {
        type: this.footertitle,
      };
      this.listLoading1 = true;
      queryRemoteTypeSum(parms)
        .then(({ data }) => {
          if (data.code == 0) {
            this._RemoteControl(data.data);
            this._RemoteControl2();
          }
          this.listLoading1 = false;
        })
        .catch(() => {
          this.listLoading1 = false;
        });
    },
    generateTimeList (delta) {
      let f = n => `${n}`.padStart(2, '0')
      let result = [], date = new Date()
      date.setHours(0)
      date.setMinutes(delta)
      let day = date.getDate()
      while (date.getDate() === day) {
        let h = date.getHours()
        let m = date.getMinutes()
        // console.log(h, m)
        result.push(`${f(h)}:${f(m)}`)
        date.setMinutes(m + delta)
      }
      result.unshift('00:00')
      result.push('24:00')
      return result
    },
    //整体趋势
    _wholCcarCharts(todayData,yesterdayData) {
      console.log(this.generateTimeList(60))
      let timeData=this.generateTimeList(60)
      let data=[]
      timeData.forEach(i=>{
        data.push({time:i,value1:0,value2:0})
      })
      // console.log(data,333)
      todayData.forEach(i=>{
        data.forEach(j=>{
           if(i.timeValue==j.time){
              j.value2=i.sum*1
           }
        })
      })
      yesterdayData.forEach(i=>{
        data.forEach(j=>{
           if(i.timeValue==j.time){
              j.value1=i.sum*1
           }
        })
      })
      // console.log(data,"data")
      let dataX=[],dataY1=[],dataY2=[]
      data.forEach(i=>{
        dataX.push(i.time);
        dataY1.push(i.value1);
        dataY2.push(i.value2)
      })
      let colorList = [
        "#9EA8B2",
        "#E0E5E7",
        "rgba(255, 255, 255, 1)",
        "#000000",
      ];
      let lingColor = ["#2EBEFF", "#1E64DD"];

      const Dom = document.getElementById("wholCcar");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();
      const optionData = wholCcarCharts(
        dataX,
        dataY1,
        dataY2,
        colorList,
        lingColor
      );
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
    // 进行排序
    compare(property){
      return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
      }
    },
    //远程功能
    _RemoteControl(dataList) {
      let colorList = ["#9ea8b2", "#ffffff"];
      let colorListTu = [
        "#1E64DD",
        "#29CAF8",
        "#C9CDD4",
        "#1FE0A3",
        "#FFC826",
        "#FF985D",
      ];
      let datas = [
        {
          name: "空调",
          type:3,
          percent: 0,
          value: 0,
        },
        {
          name: "寻车",
          type:5,
          percent: 0,
          value: 0,
        },
        {
          name: "解闭锁",
          type:2,
          percent: 0,
          value: 0,
        },
        {
          name: "车窗开度",
          type:1,
          percent: 0,
          value: 0,
        },
        {
          name: "座椅加热",
          type:6,
          percent: 0,
          value: 0,
        },
      ];
      dataList.forEach(i=>{
        datas.forEach(j=>{
          if(i.type==j.type){
            j.value=i.sum?i.sum:0
            j.percent=i.percent?parseInt(i.percent * 100):0
          }
        })
      })
      datas.sort(this.compare('value'));//排序
      // for (const key in dataList) {
      //   datas[key].value = parseInt(dataList[key].percent * 100)||0;
      //   datas[key].sum = dataList[key].sum||0;
      // }
      const Dom = document.getElementById("bar1");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();
      const optionData = RemoteControl(datas, colorList, colorListTu);
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
    _getRemoteChannel(){
      this.listLoading2=true
      getRemoteChannel()
        .then(({ data }) => {
          if (data.code == 0) {
            console.log(data,123)
            let datas = data.data || {}
            this._RemoteControl2(datas)
          }
        })
        .finally(() => {
          this.listLoading2=false
        });
    },
    //TOP渠道
    _RemoteControl2(data) {
      let datas = [
        {
          value: data.websiteNumber || 0,
          name: "网站",
        },
        {
          value: data.otherNumber || 0,
          name: "其他",
        },
      ];
      let sum = countTotal(datas,'value');
      datas.forEach(i=>{
        i.percent = i.value ? parseInt(i.value/sum * 100):0
      })
      let colorList = ["rgba(102, 109, 122, 1)", "#FFFFFF"];
      let colors = ["#1E64DD", "#C9CDD4"];

      const Dom = document.getElementById("bar2");
      const myChart = this.$echarts.init(Dom);
      myChart.clear();
      const optionData = RemoteTop(datas, colorList, colors);
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
    //获取时间
    _dataGetter() {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month > 9 ? month : "0" + month;
      day = day < 10 ? "0" + day : day;
      let today = year + "-" + month + "-" + day;
      this.choiceData = today;
    },
  },
};
</script>
<style scoped>
.RadioTop {
  margin-top: 5px;
}
.footer-list-w1 {
  width: 50% !important;
  margin-right: 1vh;
}
.footer-list-w2 {
  width: 50% !important;
}
.wholCcar {
  width: 100%;
  height: calc(100% - 38px);
}
.tabPositionDiv {
  position: absolute;
  top: 45px;
  left: 14px;
  width: 70%;
  z-index: 99;
}
</style>
<style lang="scss" scoped>
.js-home-carControl {
  height: calc(100vh - 140px) !important;
  overflow: hidden;
}
.home-container {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  .home-header {
    height: 19vh;
    margin: 0 !important;
    display: flex;
    justify-content: space-between;
  }
  .home-content {
    // height: 40%;
    height: calc(40% - 0px);
    margin-top: 1vh;
    border-radius: 4px;
    position: relative;
    .home-card-box-title {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      // height: 3vh;
      // line-height: 3vh;
      p {
        &.box-title {
          font-size: 15px;
          display: inline-block;
          vertical-align: middle;
          margin: 10px 0;
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
          line-height: 17px;
        }
        span {
          margin: 0 5px;
          &.click-color {
            color: #0fa5f6;
            border-bottom: 1px solid #0fa5f6;
          }
        }
      }
      // span {
      //   // margin-left: 10px;
      // }
    }
    .lineBox {
      display: flex;
      justify-content: space-between;
      padding: 0 5px;
      height: calc(100% - 40px);
    }
  }
  .content-echart-wrapper {
    height: calc(100% - 80px);
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .content-echart {
    width: 100%;
    height: 100%;
  }
  .home-footer {
    margin-top: 1vh;
    height: calc(35% - 20px);
    display: flex;
    justify-content: space-between;
    .footer-list {
      height: 100%;
      border-radius: 4px;
      width: 24%;
    }
    .footer-title {
      padding: 0 15px 0 10px;
      height: 38px;
      line-height: 38px;
      margin: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .footer-bar {
      width: 100%;
      height: calc(100% - 48px);
      margin-top: 10px;
    }
    .all-content-info {
      padding: 0;
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
      .statistics-scroll {
        overflow: hidden;
        //max-height: 250px;
        height: calc(100% - 40px);
      }
      .content-info-li {
        font-size: 12px;
        // color: #9EA8B2;
        padding: 14px 0px;
        // border-bottom: 1px solid #fbfbfc;
      }
      .table-header {
        color: #fff;
        // background: #f1faff;
        // background-clip: content-box;
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
