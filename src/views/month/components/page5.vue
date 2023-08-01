<template>
  <div class="content-page page5">
    <div class="top">
      <div class="top-left">
        <div class="top-left-item">
          <small-header :title="'换电次数'"> </small-header>
            <div class="page5-left-1_content">
              <div class="page5-left-1-1">
                <img
                  src="../../../assets/images/mileage.png"
                  class="page5-left-1-1-img"
                  alt=""
                />
                <img
                  src="../../../assets/images/ljhdcs.png"
                  class="page5-left-1-1-img2"
                  alt=""
                />
                <span>累计换电次数</span>
                <div class="page5-left-1-data">
                  {{ totalNum }}
                  <div>次</div>
                </div>
              </div>

              <div class="page5-left-1-2">
                <img
                  src="../../../assets/images/mileage.png"
                  class="page5-left-1-1-img"
                  alt=""
                />
                <img
                  src="../../../assets/images/dyhdcs.png"
                  class="page5-left-1-1-img2"
                  alt=""
                />
                <span>当月换电次数</span>
                <div class="page5-left-1-data">
                  {{
                     monthNum
                  }}
                  <div>次</div>
                </div>
              </div>
            </div>
        </div>
        <div class="top-left-item">
          <small-header :title="'各时间段换电次数统计'"> </small-header>
          <div id="leftChartTwo" style="height:26vh;width:100%;"></div>
        </div>
        <div class="top-left-bottom">
          <small-header :title="'本月日均换电时长及换电次数'"> </small-header>
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
          <span class="fontB">换电热力图</span>
        </div>
        <!-- <h3 class="center-title"><svg-icon icon-class="bt-month"/> 换电热力图</h3> -->
        <div class="mapBox">
          <div id="mapCharts5" class="mapCharts"></div>
        </div>
      </div>
      <div class="top-right">
        <div class="top-right-item">
          <small-header :title="'各时间段换电时长统计分布'"> </small-header>
          
          <div id="rightChartOne" style="height:15.5vh;width:100%;"></div>
        </div>
        <div class="top-right-item">
          <small-header :title="'开始换电SOC分布占比'"> </small-header>
          <legend-list
            :list="monthList"
            style="width:100%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="rightChartTwo" style="height:15.5vh;width:100%;"></div>
        </div>
        <div class="top-right-item">
          <small-header :title="'结束换电SOC分布占比'"> </small-header>
          <legend-list
            :list="monthList"
            style="width:100%;margin-top:1vh;align-items: flex-end;justify-content: flex-end;"
          ></legend-list>
          <div id="rightChartThree" style="height:17vh;width:100%;"></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div id="bottomLineCharts" style="height:100%;width:100%;"></div>
    </div>
  </div>
</template>

<script>
import  cityJSON  from "@/utils/cityJSON.json";
import smallHeader from "./smallHeader";
import legendList from "./legendList";
import {
  mapCharts,
  chargingLineChartTwo,
  chargingBarChartOne,
  chargingBarChartTwo,
  chargingLineCharts,
} from "@/charts/page5";

import { getReport } from "@/api/month/page1";
export default {
  name: "Page5",
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
        { title: "快充换电时长", border: "1px solid #00F7FF" },
        { title: "慢充换电时长", border: "1px dashed #007EFF" },
      ],
      chargingFrequencyList: [
        { title: "换电总次数", border: "1px solid #00F7FF" },
      ],
      charginGdurationList: [
        { title: "换电总时长", border: "1px solid #007EFF" },
      ],
      chargingList: [
        {
          title: "换电时长",
          bgColor: "#00F7FF",
        },
        {
          title: "换电次数",
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
      totalNum:0,
      monthNum:0,
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
      getReport()
        .then(({ data }) => {
          if (data.code === 0) {
            let dataBase = data.data?data.data:{}
            // 换电次数
            this.totalNum = dataBase.totalNum?dataBase.totalNum:0;
            this.monthNum = dataBase.monthNum?dataBase.monthNum:0;
            
            // 各时间段换电次数统计
            let chargingLineData =
            dataBase.periodTimeNum ? JSON.parse(dataBase.periodTimeNum) : [];  
            this.chargingLineChartTwo(chargingLineData);

            // 本月日均换电时长及换电次数
            let chargCharts =
            dataBase.durationNumDaily ? JSON.parse(dataBase.durationNumDaily) : {};
            this.chargingLineCharts(chargCharts);

            // 换电热力图
            let chargMapCharts =
              dataBase.thermodynamicDiagram ? JSON.parse(dataBase.thermodynamicDiagram) : {};
            this.mapCharts(chargMapCharts);

            // 各时间段换电时长统计分布
            let chargingBar =
              dataBase.periodTimeDuration ? JSON.parse(dataBase.periodTimeDuration) : [];
            this.chargingBarChartOne(chargingBar);
 
            // 开始换电SOC分布占比
            let startSoc =
              dataBase.startSocDistribution ? JSON.parse(dataBase.startSocDistribution) : {};
            this.chargingBarChartTwo(startSoc);
            // 结束换电SOC分布占比
            let endSoc =
              dataBase.endSocDistribution ? JSON.parse(dataBase.endSocDistribution) : {}; //上月
            this.chargingBarChartThree(endSoc);
          }
        })
        .catch(() => {});
    },

    // 中间地图
    mapCharts(data) {
      
			// data = [
			// 	{ name: "海门", value: 100 },
			// 	{ name: "鄂尔多斯", value: 512 },
			// 	{ name: "招远", value: 112 },
			// 	{ name: "舟山", value: 412 },
			// 	{ name: "齐齐哈尔", value: 114 },
			// 	{ name: "盐城", value: 100 },
			// 	{ name: "赤峰", value: 16 },
			// 	{ name: "青岛", value: 450 },
			// 	{ name: "乳山", value: 118 },
			// 	{ name: "金昌", value: 119 },
			// 	{ name: "泉州", value: 21 },
			// 	{ name: "莱西", value: 300 },
			// 	{ name: "日照", value: 521 },
			// 	{ name: "胶南", value: 125 },
			// 	{ name: "南通", value: 23 },
			// 	{ name: "拉萨", value: 321 },
			// 	{ name: "云浮", value: 444 },
			// 	{ name: "梅州", value: 25 },
			// 	{ name: "文登", value: 456 },
			// 	{ name: "上海", value: 125 },
			// 	{ name: "攀枝花", value: 125 },
			// 	{ name: "威海", value: 425 },
			// 	{ name: "承德", value: 525 },
			// 	{ name: "厦门", value: 126 },
			// 	{ name: "汕尾", value: 26 },
			// 	{ name: "潮州", value: 247 },
			// 	{ name: "丹东", value: 227 },
			// 	{ name: "太仓", value: 427 },
			// 	{ name: "曲靖", value: 327 },
			// 	{ name: "烟台", value: 28 },
			// 	{ name: "福州", value: 29 },
			// 	{ name: "瓦房店", value: 30 },
			// 	{ name: "即墨", value: 30 },
			// 	{ name: "抚顺", value: 31 },
			// 	{ name: "玉溪", value: 531 },
			// 	{ name: "张家口", value: 31 },
			// 	{ name: "阳泉", value: 31 },
			// 	{ name: "莱州", value: 32 },
			// 	{ name: "湖州", value: 32 },
			// 	{ name: "汕头", value: 32 },
			// 	{ name: "昆山", value: 33 },
			// 	{ name: "宁波", value: 33 },
			// 	{ name: "湛江", value: 33 },
			// 	{ name: "揭阳", value: 34 },
			// 	{ name: "荣成", value: 34 },
			// 	{ name: "连云港", value: 35 },
			// 	{ name: "葫芦岛", value: 35 },
			// 	{ name: "常熟", value: 236 },
			// 	{ name: "东莞", value: 336 },
			// 	{ name: "河源", value: 36 },
			// 	{ name: "淮安", value: 436 },
			// 	{ name: "泰州", value: 236 },
			// 	{ name: "南宁", value: 437 },
			// 	{ name: "营口", value: 37 },
			// 	{ name: "惠州", value: 337 },
			// 	{ name: "江阴", value: 37 },
			// 	{ name: "蓬莱", value: 37 },
			// 	{ name: "韶关", value: 38 },
			// 	{ name: "嘉峪关", value: 38 },
			// 	{ name: "广州", value: 138 },
			// 	{ name: "延安", value: 138 },
			// 	{ name: "太原", value: 139 },
			// 	{ name: "清远", value: 139 },
			// 	{ name: "中山", value: 139 },
			// 	{ name: "昆明", value: 139 },
			// 	{ name: "寿光", value: 440 },
			// 	{ name: "盘锦", value: 40 },
			// 	{ name: "长治", value: 41 },
			// 	{ name: "深圳", value: 41 },
			// 	{ name: "珠海", value: 42 },
			// 	{ name: "宿迁", value: 43 },
			// 	{ name: "咸阳", value: 43 },
			// 	{ name: "铜川", value: 44 },
			// 	{ name: "平度", value: 44 },
			// 	{ name: "佛山", value: 44 },
			// 	{ name: "海口", value: 44 },
			// 	{ name: "江门", value: 45 },
			// 	{ name: "章丘", value: 45 },
			// 	{ name: "肇庆", value: 46 },
			// 	{ name: "大连", value: 47 },
			// 	{ name: "临汾", value: 47 },
			// 	{ name: "吴江", value: 47 },
			// 	{ name: "石嘴山", value: 49 },
			// 	{ name: "沈阳", value: 50 },
			// 	{ name: "苏州", value: 50 },
			// 	{ name: "茂名", value: 50 },
			// 	{ name: "嘉兴", value: 51 },
			// 	{ name: "长春", value: 51 },
			// 	{ name: "胶州", value: 52 },
			// 	{ name: "银川", value: 52 },
			// 	{ name: "张家港", value: 52 },
			// 	{ name: "三门峡", value: 53 },
			// 	{ name: "锦州", value: 154 },
			// 	{ name: "南昌", value: 154 },
			// 	{ name: "柳州", value: 154 },
			// 	{ name: "三亚", value: 154 },
			// 	{ name: "自贡", value: 156 },
			// 	{ name: "吉林", value: 156 },
			// 	{ name: "阳江", value: 257 },
			// 	{ name: "泸州", value: 157 },
			// 	{ name: "西宁", value: 157 },
			// 	{ name: "宜宾", value: 258 },
			// 	{ name: "呼和浩特", value: 58 },
			// 	{ name: "成都", value: 58 },
			// 	{ name: "大同", value: 58 },
			// 	{ name: "镇江", value: 59 },
			// 	{ name: "桂林", value: 59 },
			// 	{ name: "张家界", value: 59 },
			// 	{ name: "宜兴", value: 59 },
			// 	{ name: "北海", value: 60 },
			// 	{ name: "西安", value: 61 },
			// 	{ name: "金坛", value: 62 },
			// 	{ name: "东营", value: 62 },
			// 	{ name: "牡丹江", value: 63 },
			// 	{ name: "遵义", value: 63 },
			// 	{ name: "绍兴", value: 63 },
			// 	{ name: "扬州", value: 64 },
			// 	{ name: "常州", value: 64 },
			// 	{ name: "潍坊", value: 65 },
			// 	{ name: "重庆", value: 66 },
			// 	{ name: "台州", value: 67 },
			// 	{ name: "南京", value: 67 },
			// 	{ name: "滨州", value: 70 },
			// 	{ name: "贵阳", value: 71 },
			// 	{ name: "无锡", value: 71 },
			// 	{ name: "本溪", value: 71 },
			// 	// {name: "克拉玛依", value: 72},
			// 	{ name: "渭南", value: 72 },
			// 	{ name: "马鞍山", value: 72 },
			// 	{ name: "宝鸡", value: 72 },
			// 	{ name: "焦作", value: 75 },
			// 	{ name: "句容", value: 75 },
			// 	{ name: "北京", value: 79 },
			// 	{ name: "徐州", value: 79 },
			// 	{ name: "衡水", value: 80 },
			// 	{ name: "包头", value: 80 },
			// 	{ name: "绵阳", value: 80 },
			// 	{ name: "乌鲁木齐", value: 84 },
			// 	{ name: "枣庄", value: 84 },
			// 	{ name: "杭州", value: 84 },
			// 	{ name: "淄博", value: 85 },
			// 	{ name: "鞍山", value: 86 },
			// 	{ name: "溧阳", value: 86 },
			// 	// {name: "库尔勒", value: 86},
			// 	{ name: "安阳", value: 190 },
			// 	{ name: "开封", value: 390 },
			// 	{ name: "济南", value: 292 },
			// 	{ name: "德阳", value: 393 },
			// 	{ name: "温州", value: 95 },
			// 	{ name: "九江", value: 96 },
			// 	{ name: "邯郸", value: 98 },
			// 	{ name: "临安", value: 99 },
			// 	{ name: "兰州", value: 99 },
			// 	{ name: "沧州", value: 100 },
			// 	{ name: "临沂", value: 103 },
			// 	{ name: "南充", value: 104 },
			// 	{ name: "天津", value: 105 },
			// 	{ name: "富阳", value: 106 },
			// 	{ name: "泰安", value: 112 },
			// 	{ name: "诸暨", value: 112 },
			// 	{ name: "郑州", value: 113 },
			// 	{ name: "哈尔滨", value: 114 },
			// 	{ name: "聊城", value: 116 },
			// 	{ name: "芜湖", value: 117 },
			// 	{ name: "唐山", value: 119 },
			// 	{ name: "平顶山", value: 119 },
			// 	{ name: "邢台", value: 119 },
			// 	{ name: "德州", value: 120 },
			// 	{ name: "济宁", value: 120 },
			// 	{ name: "荆州", value: 127 },
			// 	{ name: "宜昌", value: 130 },
			// 	{ name: "义乌", value: 132 },
			// 	{ name: "丽水", value: 133 },
			// 	{ name: "洛阳", value: 134 },
			// 	{ name: "秦皇岛", value: 136 },
			// 	{ name: "株洲", value: 143 },
			// 	{ name: "石家庄", value: 147 },
			// 	{ name: "莱芜", value: 148 },
			// 	{ name: "常德", value: 152 },
			// 	{ name: "保定", value: 153 },
			// 	{ name: "湘潭", value: 154 },
			// 	{ name: "金华", value: 157 },
			// 	{ name: "岳阳", value: 169 },
			// 	{ name: "长沙", value: 175 },
			// 	{ name: "衢州", value: 177 },
			// 	{ name: "廊坊", value: 193 },
			// 	{ name: "菏泽", value: 194 },
			// 	{ name: "合肥", value: 229 },
			// 	{ name: "武汉", value: 273 },
			// 	{ name: "大庆", value: 279 },
			// ];
      let dataBase=[]
      for (const key in data) {
        dataBase.push({'name':key, 'value':data[key]});
      }
			var convertData = function(dataBase) {
				var res = [];
				for (var i = 0; i < dataBase.length; i++) {
					var geoCoord = cityJSON.city[dataBase[i].name];
					if (geoCoord) {
						res.push(geoCoord.concat(dataBase[i].value));
					}
				}
				return res;
			};
      // console.log(dataBase,convertData(dataBase),1234)
			// this.$echarts.registerMap("china", chinaJSON);
			const option = mapCharts(convertData(dataBase));
			const Dom = document.getElementById("mapCharts5");
      const myChart = this.$echarts.init(Dom);
			myChart.setOption(option);
			window.addEventListener("resize", function() {
				myChart.resize();
			});
    },

    //左二 各时间段换电次数统计分布
    chargingLineChartTwo(data) {
      // console.log(data,123)
      const Dom = document.getElementById("leftChartTwo");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      
      let nameList = this.chargingFrequencyList.map((item) => item.title);
      let colors = ["#00F7FF", "#007EFF"];
      let xData = [];
      let yData = [];
      data.forEach(i => {
        xData.push(i.key)
        yData.push(i.value)
      });
      //  xData = [1,2,3,4];
      //  yData =[100,200,150,200];

      const optionData = chargingLineChartTwo(
        nameList,
        colors,
        xData,
        yData,
      );
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //右一 各时间段换电时长统计分布
    chargingBarChartOne(data) {
      const Dom = document.getElementById("rightChartOne");
       const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let nameList = this.charginGdurationList.map((item) => item.title);
      let colors = ["#007EFF"];
      let xData = [];
      let yData = [];
      data.forEach(i => {
        xData.push(i.key)
        yData.push(parseFloat((i.value/1000).toFixed(2)))
      });
      //  xData = [1,2,3,4];
      //  yData =[100,200,150,200];

      const optionData = chargingBarChartOne(
        nameList,
        colors,
        xData,
        yData,
      );
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //右二 开始换电SOC分布占比
    chargingBarChartTwo(data) {
      const Dom = document.getElementById("rightChartTwo");
      const myChart = this.$echarts.init(Dom);
      let lastMonth = data.lastMonth?data.lastMonth:[]
      let sameMonth = data.sameMonth?data.sameMonth:[]

      let xData = [];
      let yData1 = [];
      let yData2 = [];
      let yData = [[], []]; //开始换电SOC分布占比
      let y1=[]
      let x1=[]
      lastMonth.forEach(i=>{  
        x1.push(i.key)  
        y1.push(i.value)
      })
      let y2=[]
      let x2=[]
      sameMonth.forEach(i=>{
        x2.push(i.key)
        y2.push(i.value)
      })
      xData=x1&&x1.length?x1:x2; 
      y1.forEach(i=>{
        yData1.push(parseFloat((i/eval(y1.join("+"))*100).toFixed(2))) 
      })
      y2.forEach(i=>{
        yData2.push(parseFloat((i/eval(y2.join("+"))*100).toFixed(2)))
      })
      yData = [yData1,yData2]
      // xData = [1,2,3,4];
      // yData =[[100,200,150,200],[200,230,100,150]];
      // console.log(y1,y2,yData,999)
      const optionData = chargingBarChartTwo(xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    //右三 结束换电SOC分布占比
    chargingBarChartThree(data) {
      let lastMonth = data.lastMonth?data.lastMonth:[]
      let sameMonth = data.sameMonth?data.sameMonth:[]
      const Dom = document.getElementById("rightChartThree");
      const myChart = this.$echarts.init(Dom);
      let xData = [];
      let yData1 = [];
      let yData2 = [];
      let yData = [[], []]; //开始换电SOC分布占比
      let y1=[]
      let x1=[]
      lastMonth.forEach(i=>{
        y1.push(i.value)
        x1.push(i.key) 
      })
      let y2=[]
      let x2=[]
      sameMonth.forEach(i=>{
        x2.push(i.key)
        y2.push(i.value)
      })
      xData=x1&&x1.length?x1:x2; 
      y1.forEach(i=>{
        yData1.push(parseFloat((i/eval(y1.join("+"))*100).toFixed(2))) 
      })
      y2.forEach(i=>{
        yData2.push(parseFloat((i/eval(y2.join("+"))*100).toFixed(2)))
      })
      yData = [yData1,yData2]
      // console.log(y1,y2,yData,888)
      // xData = [1,2,3,4];
      // yData =[[100,200,150,200],[200,230,100,150]];
      const optionData = chargingBarChartTwo(xData, yData);
      myChart.setOption(optionData);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },

    // 底部换电折线图
    chargingLineCharts(data) {
      const Dom = document.getElementById("bottomLineCharts");
      const myChart = this.$echarts.init(Dom);
      // myChart.clear();
      let legendData = ["换电时长", "换电次数"];
      let dailyDuration = data.dailyDuration?data.dailyDuration:[]
      let dayNum = data.dayNum?data.dayNum:[]
      let xData=[]
      let yData1 = []
      let yData2 = []
      let yData = [[],[]]
      let x1=[]
      dailyDuration.forEach(i=>{
        x1.push(i.key) 
        yData1.push(i.value)
      })
      let x2=[]
      dayNum.forEach(i=>{
        x2.push(i.key)
        yData2.push(i.value)
      })
      xData=x1&&x1.length?x1:x2; 
      yData=[yData1,yData2]
      // console.log(xData,yData,333)
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

  .page5-left-1_content {
    margin: 1vh auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }


.page5-left-1-1 {
  height: 10vh;
  position: relative;
  margin-bottom: 1vh;
}
.page5-left-1-2 {
  height: 10vh;
  position: relative;
}

.page5-left-1_content span {
  font-weight: 500;
  position: absolute;
  font-size: 1.7vh;
  top: 3.5vh;
  left: 11vh;
}
.page5-left-1-data {
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
.page5-left-1-data div {
  color: #7e96ba;
  margin-left: 2px;
}
.page5-left-2 {
  width: 100%;
  height: 17vh;
  /* margin-top: 5vh; */
  .page5-left-2_content {
    height: 14vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .page5-left-2_content_text {
      margin-bottom: 5px;
    }
    .page5-left-2-lift {
      font-size: 14px;
      font-weight: 400;
      float: left;
      padding-left: 5px;
    }
    .page5-left-2-right {
      font-size: 14px;
      font-weight: 400;
      float: right;
      padding-right: 5px;
    }
  }
}
.page5-left-1-1-img {
  position: absolute;
  height: 10vh;
}
.page5-left-1-1-img2 {
  position: absolute;
  height: 8vh;
  top: 1vh;
  left: 1vh;
}
.top {
  display: flex;
  align-content: space-between;
  height: 66vh;
  .top-left {
    height: 66vh;
    width: 25%;
    .top-left-item {
      height: 28vh;
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
