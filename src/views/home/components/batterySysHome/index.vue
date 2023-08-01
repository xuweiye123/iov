<template>
  <div class="container">
    <div class="container-up">
      <el-row :gutter="10">
        <el-col :span="16">
          <div class="container-up-left-one">
            <span class="h_h3 blockh3 home-card-box-title">
              车辆生产信息统计</span
            >
            <el-row
              :gutter="10"
              type="flex"
              justify="start"
              align="center"
              class="left-one-row"
            >
              <el-col
                v-for="(item, index) in LefttopInfo"
                :key="index"
                type="flex"
                :span="6"
                justify="center"
              >
                <left-topmenu-Info
                  :text="item.text"
                  :icon="item.icon"
                  :value="item.value"
                >
                </left-topmenu-Info>
              </el-col>
            </el-row>
          </div>
          <div class="container-up-left-one">
            <span class="h_h3 blockh3 home-card-box-title">
              车辆维修信息统计</span
            >
            <el-row
              :gutter="10"
              type="flex"
              justify="start"
              align="center"
              class="left-one-row"
            >
              <el-col
                v-for="(item, index) in LeftcenterInfo"
                :key="index"
                type="flex"
                :span="6"
                justify="center"
              >
                <left-topmenu-Info
                  :text="item.text"
                  :icon="item.icon"
                  :value="item.value"
                >
                </left-topmenu-Info>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="container-up-right">
            <span class="h_h3 blockh3 home-card-box-title">
              车辆换电信息统计
            </span>
            <div class="home-hd-height">
              <div class="hd-list" v-for="(item, index) in hdList" :key="index">
                <img
                  style="margin-top:5px;margin-right: 20px;"
                  :src="
                    require(`@/assets/images/theme/${activeName}/${item.img}`)
                  "
                  width="30px"
                  height="30px"
                  alt=""
                />
                <div class="hd-list-left">
                  <div class="hd-list-left-top">
                    <span class="hd-title">{{ item.name }}</span>
                    <span class="hd-number">{{ item.cunt }}</span>
                  </div>
                  <el-progress
                    :percentage="item.percentage"
                    :color="customColor"
                    :show-text="false"
                  ></el-progress>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="10" class="container-bottom">
      <el-col :span="8">
        <home-card
          class="container-bottom-item"
          :title-left="'电池退役信息统计'"
          :iconName="activeName + '_dianchituiyi'"
        >
          <div slot="content">
            <div ref="barFaultCodeTop" class="echarts-box" />
          </div>
        </home-card>
      </el-col>
      <el-col :span="8">
        <home-card
          class="container-bottom-item"
          :title-left="'回收网点电池信息统计'"
          :iconName="activeName + '_huishouwangdian'"
        >
          <div slot="content">
            <div ref="barhswddcxx" class="echarts-box" />
          </div>
        </home-card>
      </el-col>
      <el-col :span="8">
        <home-card
          class="container-bottom-item last"
          :title-left="'车型电池规格信息统计'"
          :iconName="activeName + '_chexingdianchi'"
        >
          <div slot="content">
            <div ref="cxdcggcxx" class="echarts-box" />
          </div>
        </home-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import interval from "@/mixins/interval";
import { barCharts, pieCharts, piebanCharts } from "@/utils/batterySysEcharts";
import leftTopmenuInfo from "./components/leftTopmenuInfo";
import homeCard from "./components/homeCard";
import { mapState } from "vuex";
import {
  getCarStatis,
  getRetireStatis,
  getRecycsStatis,
  getChangStatis,
  getModuleStatis,
} from "@/api/batterySys/home";
const iconPath =
  "M38.8,47.9c0,1.3,0.1,2.8,0.3,4.5c0.2,1.7,0.4,3.1,0.7,4.5c0-1.3-0.1-2.8-0.3-4.5C39.2,50.7,39,49.3,38.8,47.9 c0.2-0.6,0.2-1.5,0-1.9c-0.1-0.6-0.3-1.1-0.7-1.6c-0.1-0.1-0.2-0.3-0.3-0.4l-0.4-0.4l-0.2,0.6c-0.9,0.7-5.6,1.1-7.1,1.1 c-1.5,0-6.3-0.7-7.1-1.1l-0.2-0.6l-0.4,0.6c-0.1,0.1-0.2,0.2-0.3,0.4c-0.3,0.4-0.6,1-0.7,1.6c-0.1,0.4,0,1.8,0.3,2.1 c0.8,1.1,1.7,1.3,2.9,1.7c1.6,0.4,3.9,0.4,5.6,0.4c1.7,0,3.8,0,5.5-0.4c1.2-0.3,2.3-0.7,3.1-1.7C38.7,48.1,38.8,48,38.8,47.9 L38.8,47.9z M18.6,19.3L18.5,18h-0.3c-0.1,0-0.2-0.1-0.2-0.2V9.9c0-0.1,0.1-0.2,0.2-0.2h0.2V7.9c0-0.6,0.4-1.7,1.2-2.8 c0.4-0.8,1-1.5,1.3-1.9C21.7,2.3,23.7,0,25,0l10.2,0c0.6,0,1.3,0.4,2,1c0.3,0,0.8,0.2,0.9,0.6c0.6,0.4,1,1,1.5,1.6 c0.4,0.4,1.3,1.8,1.3,2.6c0.4,0.8,0.8,1.7,0.8,2.2v2h0.2c0.1,0,0.2,0.1,0.2,0.2V18c0,0.1-0.1,0.2-0.2,0.2h-0.3v1.2 c1.3,0.3,2.7,0.4,2.2,1.7c-0.8-0.2-1.5-0.3-2.2-0.6L41,45h0.3c0.1,0,0.2,0.1,0.2,0.2V53c0,0.1-0.1,0.2-0.2,0.2h-0.4v1.3 c0,1.5-0.9,2.6-2.3,3.5c-5.2,3.4-19,2.3-19.1-3.1v-1.7h-0.6c-0.1,0-0.2-0.1-0.2-0.2v-7.8c0-0.1,0.1-0.2,0.2-0.2h0.3l-0.6-24.6 c-0.9,0.2-1.7,0.4-2.5,0.7C15.7,19.8,17.1,19.8,18.6,19.3L18.6,19.3z M40.2,20.1c0-0.1,0.1-0.3,0.1-0.4c-0.8,1-1.6,4-1.8,8.6v5.5 c0.4-0.1,1.6-0.2,1.6-0.8c0-4.4,0.1-8.4,0.2-12.7C40.3,20.2,40.2,20.2,40.2,20.1z M19.2,5.6c-0.1-0.8,0.9-2.2,1.3-2.8 c0.3-0.6,0.9-1.1,1.5-1.6c0.2-0.1,0.7-0.4,1-0.3l-0.2,0.2c-0.8,0.8-1.5,1.7-1.9,2.1c-0.4,0.6-1,1.3-1.6,2.2V5.4 C19.2,5.5,19.2,5.6,19.2,5.6z M39.9,43.4c0.1-3.1,0.2-5.9,0.1-9.3c-0.1-0.2-1.1,0.2-1.6,0.3v8.6C38.9,43.3,39.6,43.7,39.9,43.4 L39.9,43.4z M21.5,43.1v-8.6c-0.3-0.2-1.5-0.7-1.6-0.3c0.1,3.2,0.1,6,0.2,9.3C20.5,43.7,21.1,43.3,21.5,43.1z M21.5,33.7v-5.5 c-0.1-4.7-1-7.8-1.8-8.6c0.1,4.5,0.2,8.7,0.3,13.3C20,33.4,21.1,33.6,21.5,33.7z M39.3,17v-0.3c-5.9-1.9-11.8-2-17.8,0 c-0.2,0.1-0.3,0.3-0.3,0.6c0.3,2.6,0.8,4.5,1.2,7.1c0,0.1,0.1,0.1,0.1,0.2h0.1c4.9-0.9,9.9-0.9,14.9,0c0.1,0,0.2,0,0.3-0.1 s0.2-0.2,0.2-0.3C38.6,21.4,38.9,19.5,39.3,17z M25.2,8.7c0.2,2,0.4,3.9,0.7,5.5c0-1.7-0.1-3.5-0.3-5.5c-0.2-2-0.4-3.9-0.7-5.5 C24.8,4.8,24.9,6.7,25.2,8.7z M34.7,8.7c-0.2,2-0.3,3.9-0.3,5.5c0.2-1.7,0.4-3.5,0.7-5.5s0.3-3.9,0.3-5.5 C35.1,4.8,34.9,6.7,34.7,8.7z M20.8,52.4c0.2-1.7,0.3-3.1,0.3-4.5c-0.2,1.3-0.4,2.8-0.7,4.5c-0.2,1.7-0.3,3.1-0.3,4.5 C20.4,55.5,20.7,53.9,20.8,52.4z";
const colors = ["#d6d6d6", "#52d98f", "#ff5764", "#fcdd5e"];
export default {
  name: "home",
  components: { leftTopmenuInfo, homeCard },
  mixins: [interval],
  props: {
    positionId: [String, Number],
  },
  data() {
    return {
      customColor: "#E8534E",
      LefttopInfo: [
        {
          value: 0,
          text: "已销售车辆数(辆)",
          icon: "yxscls.png",
        },
        {
          value: 0,
          text: "车辆总数(辆)",
          icon: "clzs.png",
        },
        {
          value: 0,
          text: "电池包总数",
          icon: "dcbzs.png",
        },
        {
          value: 0,
          text: "电池模块总数",
          icon: "dcmkzs.png",
        },
        {
          value: 0,
          text: "单体电池总数",
          icon: "dtdczs.png",
        },
      ],
      LeftcenterInfo: [
        {
          value: 0,
          text: "维修总次数",
          icon: "wxzcs.png",
        },
        {
          value: 0,
          text: "维修车辆数",
          icon: "wxcls.png",
        },
        {
          value: 0,
          text: "更换电池包数",
          icon: "ghdcbs.png",
        },
        {
          value: 0,
          text: "更换电池模块数",
          icon: "ghdcmks.png",
        },
      ],
      hdList: [
        { name: "入库电池包记录数", img: "icon_rukudianchi.png", cunt: 0 },
        { name: "车辆换电次数", img: "icon_huandiancishu.png", cunt: 0 },
        { name: "换电出库电池包数", img: "icon_huandianchuku.png", cunt: 0 },
        { name: "换电退役电池包数", img: "icon_huandiantuiyi.png", cunt: 0 },
        { name: "换电企业总数", img: "icon_huandianqiye.png", cunt: 0 },
      ],
      debounce: 50,
      center: [100.530449, 13.722944],
      zoom: 13,
      carid: null,
      data: [],
      infoWindowPosition: null,
      vehicleInfoWindowOffset: [0, -20],
      visible: false,
      clusterer: null,
      vehicleMarkerEvents: {
        init: (m) => {
          // this.clusterer.addMarker(m, true);
          this.clusterer.addMarker(m, true);
          this.debouncedRedraw();
        },
        destroyed: (m) => {
          // this.clusterer.removeMarker(m, true);
          this.clusterer.removeMarker(m, true);
          this.debouncedRepaint();
        },
        click: (marker, vueMarker) => {
          this.handleMarkerClick(vueMarker.$attrs.vehicle);
        },
      },
      echarts1: null,
      echarts2: null,
      echarts3: null,
      echarts4: null,
      speedVisible: false,
      tempSpeed: 60,
      maxSpeed: 60,
      interval: 30 * 1000,
      timerNumber: null,
      totalVehicle: "",
      totalVehiclelm: "",
      totalVehicleltm: "",
      totalMileage: "",
      totalMileagelm: "",
      totalMileageltm: "",
      totalFuel: "",
      totalFuellm: "",
      totalFuelltm: "",
      totalTrip: "",
      totalTriplm: "",
      totalTripltm: "",
      avgMileage: "",
      avgMileagelm: "",
      avgMileageltm: "",
      avgFuel: "",
      avgFuellm: "",
      avgFuelltm: "",
    };
  },
  computed: {
    vehicles() {
      const { maxSpeed } = this;
      let data = this.data;
      return data.map((v) => {
        const lng = +(v.lng || 0);
        const lat = +(v.lat || 0);
        let status = 0;
        //0 灰色 1 绿色 2 红色 3黄色
        if (v.speed > 0 && v.online == 1) {
          //在线，m.driving不等于0且小于设置的最大车速,则为正常车速
          if (v.speed < maxSpeed) {
            status = 1;
          }
          //在线gpsspeed大于设置最大车速，则为超速
          if (v.speed > maxSpeed) {
            status = 2;
          }
        }
        //如果转速rpm大于0，则为停车未熄火否则就为停车熄火状态
        else if (v.rpm > 0 && v.online == 1) {
          status = 3;
        }
        //如果无转速,不在线，则为离线
        else {
          status = 0;
        }
        return {
          /*   转速>0 & 车速=0    :  Engine On（Stop）
              转速=0                     :  Engine Off
              转速>0 & 车速>0 & 车速<maxSpeed  : Normal Speed
              转速>0 & 车速>maxSpeed  : Over Speed */
          status: status,
          position: [lng, lat],
          id: v.carId,
          visible: lng != 0 && lat != 0,
          icon: {
            anchor: { x: 30, y: 30 },
            path: iconPath,
            fillColor: colors[status],
            fillOpacity: 1,
            scale: 0.6,
            rotation: v.direction,
          },
        };
      });
    },
    ...mapState("theme", ["color", "activeName"]),
  },
  watch: {
    positionId(newVal) {
      this.find(newVal);
    },
    "$store.state.theme.activeName": function(val) {
      this.themeColor = this.color;
      let fontsizeColor = "#9EA8B2";
      let xycolor = "#39485A";
      if (val === "red") {
        this.customColor = "#E8534E";
        fontsizeColor = "#9EA8B2";
        xycolor = "#39485A";
      } else if (val === "green") {
        this.themeColor = "#00BC7C ";
        fontsizeColor = "#9EA8B2";
        xycolor = "#39485A";
      } else {
        this.themeColor = "#1E64DD";
        fontsizeColor = "#666D7A";
        xycolor = "#E0E5E7";
      }
      this.carPowerchangeTopInit(this.themeColor);
      this.CoderetireTopInit(this.themeColor, fontsizeColor, xycolor);
      this.hswddcxxTopInit(fontsizeColor);
      this.cxdcggxxTopInit(fontsizeColor);
    },
    $route: {
      handler: function(val) {
        // 如果是首页‘home’路由，就执行计时器
        if (val.name === "home") {
          this.setInterNumber();
        } else {
          clearInterval(this.timerNumber);
          this.timerNumber = null; // 停止
        }
      },
      deep: true,
    },
  },
  destroyed: function() {
    clearInterval(this.timerNumber);
    this.timerNumber = null; // 停止
  },
  mounted() {
    let _this = this;
    this.themeColor = this.color;
    let fontsizeColor = "#9EA8B2";
    let xycolor = "#39485A";
    if (this.activeName === "red") {
      this.customColor = "#E8534E";
      fontsizeColor = "#9EA8B2";
      xycolor = "#39485A";
    } else if (this.activeName === "green") {
      this.themeColor = "#00BC7C ";
      fontsizeColor = "#9EA8B2";
      xycolor = "#39485A";
    } else {
      this.themeColor = "#1E64DD";
      fontsizeColor = "#666D7A";
      xycolor = "#E0E5E7";
    }
    this.getAllData();
    this.carPowerchangeTopInit(this.themeColor);
    this.CoderetireTopInit(this.themeColor, fontsizeColor, xycolor);
    this.hswddcxxTopInit(fontsizeColor);
    this.cxdcggxxTopInit(fontsizeColor);
  },
  created() {},
  methods: {
    // 计时器
    setInterNumber() {
      this.timerNumber = setInterval(() => {
        this.getAllData();
      }, 60 * 1000);
    },
    getAllData() {
      getCarStatis().then(({ data }) => {
        if (data.code === 0 && data.data && data.data[0]) {
          this.LefttopInfo = [
            {
              value: data.data&&data.data[0].col1?data.data[0].col1:0,
              text: "已销售车辆数(辆)",
              icon: "yxscls.png",
            },
            {
              value: data.data&&data.data[0].col2?data.data[0].col2:0,
              text: "车辆生产总数(辆)",
              icon: "clzs.png",
            },
            {
              value: data.data&&data.data[0].col3?data.data[0].col3:0,
              text: "电池包总数",
              icon: "dcbzs.png",
            },
            {
              value: data.data&&data.data[0].col4?data.data[0].col4:0,
              text: "电池模块总数",
              icon: "dcmkzs.png",
            },
            {
              value: data.data&&data.data[0].col5?data.data[0].col5:0,
              text: "单体电池总数",
              icon: "dtdczs.png",
            },
          ];
          this.LeftcenterInfo = [
            {
              value: data.data&&data.data[0].col6?data.data[0].col6:0,
              text: "维修总次数",
              icon: "wxzcs.png",
            },
            {
              value: data.data&&data.data[0].col7?data.data[0].col7:0,
              text: "维修车辆数",
              icon: "wxcls.png",
            },
            {
              value: data.data&&data.data[0].col8?data.data[0].col8:0,
              text: "更换电池包数",
              icon: "ghdcbs.png",
            },
            {
              value: data.data&&data.data[0].col9?data.data[0].col9:0,
              text: "更换电池模块数",
              icon: "ghdcmks.png",
            },
          ];
        }
      });
    },
    // 车辆换电信息统计（柱状图）
    carPowerchangeTopInit(color) {
      getChangStatis().then(({ data }) => {
        if (data.code === 0) {
          let statisTotal = 0
           if(data.data&&data.data.length){
            data.data.forEach((item, index) => {
              statisTotal += +item
            })
            data.data.forEach((item, index) => {
              this.hdList[index].percentage = (+item/statisTotal)*100;
              this.hdList[index].cunt = item
            });
           }
          
        }
      });
    },
    // 电池退役信息统计（柱状图）
    CoderetireTopInit(color, fontsizeColor, xycolor) {
      getRetireStatis().then(({ data }) => {
        if (data.code === 0) {
          var xdata = [
            "退役电池包",
            "退役电池模块数",
            "退役单体总数",
            "退役厂商数",
          ];
          var chartsdata = data.data;
          // var chartsdata = [1, 2, 3, 4];
          const Dom = this.$refs.barFaultCodeTop;
          this.echarts2 = this.$echarts.init(Dom);
          this.echarts2.clear();

          const optionData = barCharts(
            color,
            xdata,
            chartsdata,
            "#797979",
            "#E0E5E7"
          );
          this.echarts2.setOption(optionData);
          this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
            this.$nextTick(() => {
              this.echarts2.resize();
            });
          });
          // let _this = this;
          // window.addEventListener("resize", function() {
          //   _this.echarts2.resize();
          // });
        }
      });
    },
    // 回收网点电池信息统计（扇形图）
    hswddcxxTopInit(fontsizeColor) {
      getRecycsStatis().then(({ data }) => {
        if (data.code === 0) {
          const chartsdata = [
            { name: "入库电池包数", value: data.data&&data.data[0] ? data.data[0] : 0 },
            { name: "入库电池模块数", value: data.data&&data.data[1] ? data.data[1] : 0 },
            { name: "入库单体电池数", value: data.data&&data.data[2] ? data.data[2] : 0 },
            { name: "回收服务网点", value: data.data&&data.data[3] ? data.data[3] : 0 },
          ];
          let colorList = ["#1E64DD", "#29CAF8", "#FFC826", "#C9CDD4"];
          const Dom = this.$refs.barhswddcxx;
          this.echarts3 = this.$echarts.init(Dom);
          this.echarts3.clear();
          const optionData = pieCharts(chartsdata, fontsizeColor, colorList);
          this.echarts3.setOption(optionData);
          this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
            this.$nextTick(() => {
              this.echarts3.resize();
            });
          });
          //   let _this = this;
          //   window.addEventListener("resize", function() {
          //     _this.echarts3.resize();
          //   });
        }
      });
    },
    // 车型电池规格信息统计（半径扇形图）
    cxdcggxxTopInit(fontsizeColor) {
      getModuleStatis().then(({ data }) => {
        if (data.code === 0) {
          const chartsdata = [
            { name: "电池包型号数", value: data.data&&data.data[0] ? data.data[0] : 0 },
            { name: "电池模块型号数", value: data.data&&data.data[1] ? data.data[1] : 0 },
            { name: "电池单体型号数", value: data.data&&data.data[2] ? data.data[2] : 0 },
            { name: "车辆型号数", value: data.data&&data.data[3] ? data.data[3] : 0 },
          ];
          let colorList = ["#1E64DD", "#1FE0A3", "#2EBEFF", "#FFCD38"];
          const Dom = this.$refs.cxdcggcxx;
          this.echarts4 = this.$echarts.init(Dom);
          this.echarts4.clear();
          const optionData = piebanCharts(
            this.themeColor,
            chartsdata,
            fontsizeColor,
            colorList
          );
          this.echarts4.setOption(optionData);
          this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
            this.$nextTick(() => {
              this.echarts4.resize();
            });
          });
          // let _this = this;
          // window.addEventListener("resize", function() {
          //   _this.echarts4.resize();
          // });
        }
      });
    },

    handleMapReady() {
      this.doRefresh();
    },
    redraw() {
      if (this.clusterer) {
        this.clusterer.redraw_();
      }
    },
    repaint() {
      if (this.clusterer) {
        this.clusterer.repaint();
      }
    },
    refresh() {
      return this.getVehicleGps();
    },
    handleMarkerClick(v) {
      this.carid = v.id;
      this.infoWindowPosition = v.position;
      this.visible = true;
    },
    /*   handleSingleMonitor(id) {
      this.$emit('single-monitor', id)
    }, */
    find(id) {
      const vehicle = this.vehicles.filter((v) => v.id == id)[0];
      if (vehicle) {
        this.center = vehicle.position;
        this.zoom = 18;
        // 如果有定位就自动打开小窗口
        if (vehicle.position[0] !== 0 && vehicle.position[1] !== 0) {
          window.setTimeout(() => {
            this.handleMarkerClick(vehicle);
          }, 10);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-card {
  background: #fff;
  border-radius: 4px;
}
.home-card-box-title {
  font-weight: bold;
  color: #262834;
  // border-bottom: 1px solid #EFF4F8;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 120px);
  //  padding:20px !important;
  //  box-sizing: border-box;
  .container-up {
    height: 60%;
    // box-sizing: border-box;
    .el-row {
      height: 100%;
    }
    .el-col {
      // padding-right: 20px;
      height: 100%;
      .container-up-left-one {
        width: 100%;
        height: calc(50% - 10px);
        background: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .left-one-row {
        height: calc(100% - 40px);
        .el-col {
          height: 100%;
        }
      }
    }
    .container-up-right {
      height: calc(100% - 10px);
      border-radius: 4px;
      background: #fff;
      border-radius: 4px;
    }
  }
  .container-bottom {
    height: calc(40% - 30px);
    // margin-top: 20px;
    .el-col {
      height: 100%;
    }
    .container-bottom-item {
      height: 100%;
      font-weight: bold;
      color: #262834;
      // border-bottom: 1px solid #EFF4F8;
    }
  }
}
.echarts-box {
  width: 100%;
  height: 100%;
}
.echarts-boxhd {
  float: left;
  width: 83%;
  height: 100%;
}
.home-bottom {
  margin-top: -14px;
}
.h_h3 {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  display: block;
  font-weight: bold;
  color: #262834;
  // border-bottom: 1px solid #EFF4F8;
}
.home-car {
  border-radius: 4px;
}
.home-hd-height {
  height: calc(100% - 40px);
  padding: 0 20px 20px;
  box-sizing: border-box;
}
.hd-list {
  display: flex;
  height: 20%;
  .hd-list-left {
    flex: 1;
  }
  .hd-list-left-top {
    display: flex;
    span {
      display: inline-block;
      padding: 5px 0 8px 0;
    }
  }
  .hd-title {
    flex: 1;
    color: #595757;
  }
  .hd-number {
    color: #262834;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
