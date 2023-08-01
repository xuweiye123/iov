<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form :listQuery="listQuery" :searchList="searchList" />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div class="analysis">
      <!-- <el-scrollbar wrap-class="default-scrollbar__wrap"> -->
      <div class="content-left">
        <h3 class="echarts-title chartsText">
          平均指令时长（s）
        </h3>
        <div class="content-left-content" v-loading="listLoading">
          <el-scrollbar wrap-class="default-scrollbar__wrap">
            <div ref="averageDuration" class="echarts-box" />
          </el-scrollbar>
        </div>
      </div>
      <div class="content-right">
        <div class="content-right-top">
          <h3
            class="echarts-title chartsText"
            style="display:flex;justify-content: flex-start;align-items: center;"
          >
            总次数：
            <span class="frequencyText">
              共计执行<span class="frequencyNumber">{{ totalCount }}</span
              >次
            </span>
          </h3>
        </div>
        <div class="content-right-bottom">
          <h3
            class="echarts-title chartsText"
            style="display:flex;justify-content: space-between;align-items: center;"
          >
            功能情况（次数）
            <div class="legendList">
              <!-- <div class="legends">
                外圈：
                <div
                  v-for="(item, index) in legendList1"
                  :key="index"
                  class="legendListItem"
                >
                  <div
                    class="divBg distance"
                    :style="{ background: item.color }"
                  ></div>
                  <div>{{ item.title }}</div>
                </div>
              </div> -->
              <div class="legends" style="margin:0 20px">
                内圈：
                <div
                  v-for="(item, index) in legendList2"
                  :key="index"
                  class="legendListItem"
                >
                  <div
                    class="divBg distance"
                    :style="{ background: item.color }"
                  ></div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </h3>
          <div class="content-right-bottom-echarts" v-loading="listLoading">
            <!-- <el-scrollbar wrap-class="default-scrollbar__wrap1"> -->
              <div class="echarts-box1">
                <div class="echarts_content">
                  <div
                    class="echarts-box1_box"
                    v-for="(i, index) in list"
                    :key="index"
                  >
                    <div
                      :id="'functionCondition' + index"
                      class="echarts-right-box"
                    />
                    <div class="little_title">{{ i.title }}</div>
                  </div>
                </div>
              </div>
            <!-- </el-scrollbar> -->
          </div>
        </div>
      </div>
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
// utils
import {
  getTodayTime0,
  getTodayEndTime,
  beginTimeAndEndTime,
} from "@/utils/base";
import { mapState } from "vuex";
import { horizontalHistogramCharts, circularPieCharts } from "@/utils/eCharts";
// 组件

//request
import { getData } from "@/api/carControlSys/remoteControlAnalysis";
// 辅助函数
export default {
  doNotInit: true,
  name: "remoteControlAnalysis",
  filters: {},
  mixins: [pagingMixin, otherHeight],
  data() {
    return {
      listQuery: {
        vin: "",
        // beginTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
        timeRange:[getTodayTime0(),getTodayEndTime()],
      },
      colorList: [],
      legendList1: [],
      legendList2: [],
      totalCount: 0,
      list: [
        {
          prop: "frontAirConditioning",
          title: "控制前空调开启/关闭",
          name: ["控制前空调开启", "控制前空调关闭", "成功", "失败"],
          value: [0, 0, 0, 0],
        },
        {
          prop: "rearAirConditioning",
          title: "控制后空调开启/关闭",
          name: ["控制后空调开启", "控制后空调关闭", "成功", "失败"],
          value: [0, 0, 0, 0],
        },
        {
          prop: "setAirConditioningTemperature",
          title: "控制前/后空调温度",
          name: ["控制前空调温度", "控制后空调温度", "成功", "失败"],
          value: [0, 0, 0, 0],
        },
        {
          prop: "carDoor",
          title: "控制车辆解锁/闭锁",
          name: ["控制车辆解锁", "控制车辆闭锁", "成功", "失败"],
          value: [0, 0, 0, 0],
        },
        {
          prop: "frontWindowOpening",
          title: "控制前左/右车窗开度",
          name: ["控制前左车窗开度", "控制前右车窗开度", "成功", "失败"],
          value: [0, 0, 0, 0],
        },
        {
          prop: "rearWindowOpening",
          title: "控制后左/右车窗开度",
          name: ["控制后左车窗开度", "控制后右车窗开度", "成功", "失败"],
          value: [0, 0, 0, 0],
        },
        {
          prop: "seatHeatingLevel",
          title: "控制座椅加热高档/低档/中档/关闭",
          name: ["控制座椅加热高档", "控制座椅加热低档","控制座椅加热中档", "控制座椅加热关闭", "成功", "失败"],
          value: [0, 0, 0, 0, 0, 0],
        },
        {
          prop: "carSearch",
          title: "一键寻车闪灯/鸣笛/闪灯+鸣笛",
          name: ["一键寻车闪灯", "一键寻车鸣笛","一键寻车鸣笛+闪灯", "成功", "失败"],
          value: [0, 0, 0, 0, 0],
        },
      ],
      infoData: [
        { title: "控制前空调开启", prop: "frontAirConditioningOnTime", value: 0 },
        { title: "控制前空调关闭", prop: "frontAirConditioningOffTime", value: 0 },
        { title: "控制前空调温度", prop: "frontAirConditioningSetTime", value: 0 },
        { title: "控制后空调温度", prop: "rearAirConditioningSetTime", value: 0 },
        { title: "控制后空调开启", prop: "rearAirConditioningOnTime", value: 0 },
        { title: "控制后空调关闭", prop: "rearAirConditioningOffTime", value: 0 },
        { title: "控制车辆解锁", prop: "carDoorOnTime", value: 0 },
        { title: "控制车辆闭锁", prop: "carDoorOffTime", value: 0 },
        { title: "控制左前车窗开度", prop: "leftFrontWindowOpeningTime", value: 0 },
        { title: "控制右前车窗开度", prop: "rightFrontWindowOpeningTime", value: 0 },
        { title: "控制左后车窗开度", prop: "leftRearWindowOpeningTime", value: 0 },
        { title: "控制右后车窗开度", prop: "rightRearWindowOpeningTime", value: 0 },
        { title: "控制座椅加热等级", prop: "seatHeatingLevelTime", value: 0 },
        { title: "控制座椅加热关闭", prop: "seatHeatingOffTime", value: 0 },
        { title: "一键寻车", prop: "carSearchTime", value: 0 },
      ],
      showfilter: false,
      listLoading: false,
      themeColor: "",
      textColor: "",
      authouizeList: [],
      total: 0,
      selectDate:'',
			// 1天
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate? minDate.getTime():''
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
         if (this.selectDate !== '') {
            const one = 0 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
    };
  },
  computed: {
    ...mapState("theme", ["color", "activeName"]),
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vin",
          type: "vin",
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
          pickerOptions:this.pickerOptions
        },
        // {
        //   label: "开始时间",
        //   value: "beginTime",
        //   type: "dateTime",
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: "dateTime",
        //   defaultType: "end",
        // },
      ];
    },
  },
  // 监听
  watch: {
    // "$store.state.theme.activeName": function(val) {
    // 	if(this.$route.name=='remoteControlAnalysis'){
    // 		this.themeColor = this.color;
    // 		// if (val === "default") {
    // 		// 	this.themeColor = "#66b1ff";
    // 		// 	this.textColor = ["#9EA8B2","#9EA8B2"];
    // 		// 	this.colorList = ["#00A0E9", "#37C0FF", "#9EA8B2", "#66b1ff"];
    // 		// }
    // 		// if (val === "green") {
    // 		// 	this.themeColor = "#00B074";
    // 		// 	this.textColor = ["#262834 ","#595757"];
    // 		// 	this.colorList = ["#C9CDD4", "#00B074", "#C9CDD4", "#FFCD38"];
    // 		// }
    // 		if (val === "blue") {
    // 			this.themeColor = "#1E64DD";
    // 			this.textColor = ["#262834 ","#595757"];
    // 			this.colorList = ["#C9CDD4", "#599AFF", "#C9CDD4", "#1FE0A3"];
    // 		}
    // 		// if (val === "red") {
    // 		// 	this.themeColor = "#66b1ff";
    // 		// 	this.textColor = ["#262834 ","#595757"];
    // 		// 	this.colorList = ["#C9CDD4", "#599AFF", "#C9CDD4", "#E8534E"];
    // 		// }
    // 		this.legendList1=[
    // 			{color:this.colorList[3],title:"开启"},
    // 			{color:this.colorList[2],title:"关闭"},
    // 		]
    // 		this.legendList2=[
    // 			{color:this.colorList[1],title:"成功"},
    // 			{color:this.colorList[0],title:"失败"},
    // 		]
    // 		this.func();
    // 	}
    // },
  },
  mounted() {
    this.$nextTick(() => {
      this.themeColor = this.color;
      this.themeColor = "#1E64DD";
      this.textColor = ["#262834 ", "#595757"];
      this.colorList = ["#C9CDD4", "#599AFF", "#C9CDD4", "#1FE0A3","#FFC826","#E8534E"];
      this.legendList1 = [
        { color: this.colorList[3], title: "开启" },
        { color: this.colorList[2], title: "关闭" },
      ];
      this.legendList2 = [
        { color: this.colorList[1], title: "成功" },
        { color: this.colorList[0], title: "失败" },
      ];
      this.func();
    });
  },
  methods: {
    handleClear() {
      this.listQuery = {
        vin: "",
        // beginTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
        timeRange:[getTodayTime0(),getTodayEndTime()],
        pageNum: 1,
        pageSize: 10,
      };
      this.list.forEach((item) => {
        item.value = item.prop == "seatHeatingLevel"?[0, 0, 0, 0, 0, 0]:item.prop == "carSearch"?[0, 0, 0, 0, 0]:[0, 0, 0, 0];
      });
      this.totalCount = 0;
      this.infoData.forEach((item) => {
        item.value = 0;
      });
      this.func();
      // this.listLoad();
    },
    // 加载数据
    listLoad() {
      this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      if (!this.listQuery.vin) {
        this.$message.warning({
          message: "请输入VIN码",
          duration: 2 * 1000,
        });
        return;
      }
      if (!this.listQuery.endTime || !this.listQuery.beginTime) {
        this.$message.warning({
          message: "请选择开始时间和结束时间",
          duration: 2 * 1000,
        });
        return;
      }
      this.listLoading = true;
      getData(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            console.log("data", data);
            // this.list = data.data;
            if (data.hasOwnProperty("data")) {
              this.list.forEach((item) => {
                if(item.prop == "seatHeatingLevel"){
                  item.value = data.data[item.prop] || [0, 0, 0, 0, 0, 0];
                }else if(item.prop == "carSearch"){
                  item.value = data.data[item.prop] || [0, 0, 0, 0, 0];
                }else{
                  item.value = data.data[item.prop] || [0, 0, 0, 0];
                }
              });
              this.totalCount = data.data.totalCount;
              this.infoData.forEach((item) => {
                item.value = data.data[item.prop] || 0;
              });
              this.func();
            } else {
              this.list.forEach((item) => {
                item.value = item.prop == "seatHeatingLevel"?[0, 0, 0, 0, 0, 0]:item.prop == "carSearch"?[0, 0, 0, 0, 0]:[0, 0, 0, 0];
              });
              this.totalCount = 0;
              this.infoData.forEach((item) => {
                item.value = 0;
              });
              this.func();
            }
          } else {
            this.list.forEach((item) => {
              item.value = item.prop == "seatHeatingLevel"?[0, 0, 0, 0, 0, 0]:item.prop == "carSearch"?[0, 0, 0, 0, 0]:[0, 0, 0, 0];
            });
            this.totalCount = 0;
            this.infoData.forEach((item) => {
              item.value = 0;
            });
            this.func();
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    func() {
      let dataList = this.infoData.map(
        (i) => parseFloat(((i.value * 1) / 1000).toFixed(2)) * 1
      );
      this.averageDurationInfo(this.themeColor, this.textColor, dataList);
      // 右侧饼图
      this.list.forEach((item, index) => {
        let dataList1 = [
          {
            value: item.prop == "seatHeatingLevel"?item.value[5]:item.prop == "carSearch"?item.value[4]:item.value[3],
            // name: `${item.value[3]}`,
            name: "失败",
            itemStyle: {
              color: this.colorList[0],
            },
          },
          {
            value: item.prop == "seatHeatingLevel"?item.value[4]:item.prop == "carSearch"?item.value[3]:item.value[2],
            name: "成功",
            itemStyle: {
              color: this.colorList[1],
            },
          },
        ];
        let dataList2=[]
        if(item.prop == "seatHeatingLevel"){
          dataList2 = [
          {
            value: item.value[3],
            name: item.name[3],
            itemStyle: {
              color: this.colorList[2],
            },
          },
          {
            value: item.value[2],
            name: item.name[2],
            itemStyle: {
              color: this.colorList[4],
            },
          },
          {
            value: item.value[1],
            name:item.name[1],
            itemStyle: {
              color: this.colorList[3],
            },
          },
          {
            value: item.value[0],
            name: item.name[0],
            itemStyle: {
              color: this.colorList[5],
            },
          },
        ];}else if(item.prop == "carSearch"){
           dataList2 = [
          {
            value: item.value[2],
            name: item.name[2],
            itemStyle: {
              color: this.colorList[2],
            },
          },
          {
            value: item.value[1],
            name: item.name[1],
            itemStyle: {
              color: this.colorList[3],
            },
          },
          {
            value: item.value[0],
            name: item.name[0],
            itemStyle: {
              color: this.colorList[4],
            },
          },
        ];
        }else{
          dataList2 = [
          {
            value: item.value[1],
            name: item.name[1],
            itemStyle: {
              color: this.colorList[2],
            },
          },
          {
            value: item.value[0],
            name:  item.name[0],
            itemStyle: {
              color: this.colorList[3],
            },
          },
        ];
        }
       
        let Dom = document.getElementById(`functionCondition` + index);
        let myChart = this.$echarts.init(Dom);
        myChart.clear();
        let optionData = circularPieCharts(dataList1, dataList2);
        myChart.setOption(optionData);
        this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
          this.$nextTick(() => {
            myChart.resize();
          });
        });
        // window.addEventListener("resize", function() {
        // 	myChart.resize();
        // });
      });
    },
    // 左侧柱状图
    averageDurationInfo(color, textColor, chartsData) {
      var xData = this.infoData.map((i) => i.title);
      // console.log(chartsData, "chartsData");
      xData.reverse();
      chartsData.reverse();
      const Dom = this.$refs.averageDuration;
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      const optionData = horizontalHistogramCharts(
        xData,
        chartsData,
        color,
        textColor,
        "#ECF0F6",
        this.activeName == "red"
          ? ["#E8534E", "#C9CDD4"]
          : this.activeName == "green"
          ? ["#00B074", "#C9CDD4"]
          : ["#1E64DD", "#C9CDD4"]
      );
      myChart.setOption(optionData);
      this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          myChart.resize();
        });
      });
      // window.addEventListener("resize", function() {
      // 	myChart.resize();
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar {
  .default-scrollbar__wrap.el-scrollbar__wrap {
    // max-height: calc(86.74vh - 155px); // 最大高度
    max-height: calc(96vh - 263px); // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
    //  padding-bottom: 10px;
     margin-bottom: 0 !important;
  }
  .default-scrollbar__wrap1.el-scrollbar__wrap {
    // max-height: calc(76.37vh - 155px); // 最大高度
    max-height: calc(92vh - 263px); // 最大高度
    // 263 -30
    overflow-x: hidden !important; // 隐藏横向滚动栏
    // padding-bottom: 30px;
    margin-bottom: 0 !important;
    // padding-bottom: 12px;
  }
}
.content-left {
  float: left;
  width: 30%;
  padding: 5px 0;
  box-sizing: border-box;
  border-radius: 5px;
  // overflow: hidden;
  height: calc(100vh - 253px);
}
.content-left-content {
  height: calc(96vh - 263px);
  overflow: hidden;
}
.echarts-box {
  // height: 100vh;
   height: calc(96vh - 263px);
}
.content-right {
  float: right;
  width: 69%;
  border-radius: 5px;
  padding: 5px 0;
  // overflow: hidden;
  height: calc(100vh - 253px);
}

.content-right-bottom {
  height: calc(96vh - 263px);
}
.content-right-bottom-echarts {
  height: calc(92vh - 263px);
  overflow: hidden;
}
.echarts-title {
  height: 4vh;
  line-height: 4vh;
  margin: 0;
  padding-right: 1vh;
}
.chartsText {
  padding-left: 15px;
  font-size: 13px;
  // font-family: Microsoft YaHei;
  font-weight: bold;
  color: #262834;
}

.echarts-box1 {
  // height: 69vh;
  height: 46vh;
}
.echarts_content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.frequencyText {
  font-size: 12px;
  color: #595757;
  font-weight: none;
  margin: 5px 0;
}
.frequencyNumber {
  font-size: 13px;
  margin: 0 3px;
  font-weight: bold;
}

.echarts-box1_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 23vh;
  width: 25%;
}
.echarts-right-box {
  height: 20vh;
  width: 100%;
}
.little_title {
  height: 3vh;
  // padding:0 5px;
  // font-size: 12px;
}
.legendList,
.legends {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.legendListItem {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 5px;
}
.divBg {
  width: 10px;
  height: 10px;
}
.distance {
  margin-right: 5px;
}
</style>
