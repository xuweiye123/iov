<template>
  <app-drawer
    :visibles.sync="visibles"
    :title="'车辆实时参数'"
    width="75%"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
    :loading="loading"
  >
    <div slot="drawerContent">
      <div
        class="map-box clearfix"
        :style="{
          color:
            $store.state.theme.activeName === 'default' ? '#BCD5F1' : '#606266',
        }"
      >
        <div
          class="amap-page-container"
          :class="isMoven ? 'all-moven-box' : ''"
        >
          <div id="realtimeMap" style="width:100%;height:100%;"></div>
          <div v-show="!isMoven" class="all-moven" @click="isMoven = true">
            <i class="iconfont icon-fullscreen" />
          </div>
          <div
            v-show="isMoven"
            class="all-moven moven2"
            @click="isMoven = false"
          >
            <i class="iconfont icon-exit-fullscreen" />
          </div>
        </div>
        <!-- 仪表盘 -->
        <div class="car-speed-box1">
          <div ref="bar_dv" class="car-speed-box-chart1" />
          <!-- 电池 -->
          <div class="car-real-battery">
            <div class="car-real-battery-soc">
              <div
                class="car-real-battery-progress-text"
                style="font-size:20px!important"
              >
                {{ (soc && soc != "null") ? (+soc).toFixed(2) : 0.0 }}%
              </div>
              <div
                class="car-real-battery-progress"
                :style="{ width: +soc + '%' }"
              />
            </div>
            <div class="car-real-battery-txt">
              当前电池电量(SOC)
            </div>
          </div>
        </div>
        <!-- 其他信息 -->
        <div class="car-real-area-data">
          <ul class="clearfix">
            <li v-for="(item, index) in baseData" :key="index">
              <span class="in-name">{{ item.name }}：</span>
              <span class="in-value" :class="item.className">{{
                item.value
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 下半部分 -->
      <div v-if="data.hasCan === 1" class="carStatusData1">
        <el-scrollbar style="height:100%" wrap-class="default-scrollbar__wrap">
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(item, index) in list2"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <span class="title-style"></span>
                <span>{{ item.title }}</span>
              </template>
              <div
                class="car-data clearfix"
                :style="{
                  borderColor:
                    $store.state.theme.activeName === 'block'
                      ? '#151a20'
                      : '#e6e9ec',
                }"
              >
                <p
                  v-for="(x, i) in item.data"
                  :key="i"
                  :style="{
                    borderColor:
                      $store.state.theme.activeName === 'block'
                        ? '#151a20'
                        : '#e6e9ec',
                  }"
                >
                  <span
                    :style="{
                      borderColor:
                        $store.state.theme.activeName === 'block'
                          ? '#151a20'
                          : '#e6e9ec',
                    }"
                    class="carmessage-name"
                    :title="x.name"
                    >{{ x.name }}：</span
                  >
                  <span
                    :style="{
                      borderColor:
                        $store.state.theme.activeName === 'block'
                          ? '#151a20'
                          : '#e6e9ec',
                    }"
                    class="carmessage-value"
                    >{{
                      x.value &&
                      x.value.indexOf(".") != -1 &&
                      x.value.split(".")[1].length > 2
                        ? x.value.substr(0, x.value.indexOf(".") + 3)
                        : x.value || "0.0"
                    }}{{ x.unit ? x.unit : "" }}</span
                  >
                </p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </div>
      <div v-else class="carStatusData1 dfc">
        <img
          :src="require(`../../../../assets/images/img_zanwushuju.png`)"
          alt=""
        />
        <div
          :style="{
            color:
              $store.state.theme.activeName === 'default'
                ? '#BCD5F1'
                : '#606266',
          }"
        >
          暂无数据
        </div>
      </div>
    </div>
  </app-drawer>
</template>

<script>
//百度地图版本
import { BMapLoader } from "@/utils/bmapLoader";
// request
import {
  getcarinfo,
  getdbcvar,
  getWebSocket,
} from "@/api/carMonitorSys/carStatus";
import WebsocketHeartbeatJs from "@/utils/websocket-heartbeat";
export default {
  name: "RealTimeDialog",
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const self = this;
    return {
      loading: false,
      mycharts: null,
      echartsData: 0,
      soc: 0, // 电池电量
      websocketHeartbeatJs: null, //WS对象
      baseDataVary: {
        isOnline: "",
        travelTime: "",
        vinNo: "",
        carTypeName: "",
        carBatchCode: "",
        productTypeNumber: "",
        areaName: "",
        xhQD: "",
        isGpsPosition: "",
        isDriving: "",
        GPSlicheng: "",
        GPSspeed: "",
        hasCAN: "",
        hasCANClass: "",
        isdrivingClass: "",
        isOnlineClass: "",
        isGpsPositionClass: "",
      },
      baseData: [
        { name: "终端是否在线", value: "", className: "" },
        { name: "最后数据上报时间", value: "" },
        { name: "VIN码", value: "" },
        { name: "车型编码", value: "" },
        { name: "项目代号", value: "" },
        { name: "产品型号", value: "" },
        { name: "使用区域", value: "" },
        { name: "信号强度", value: "" },
        { name: "是否定位", value: "", className: "" },
        { name: "是否行驶", value: "", className: "" },
        { name: "GPS里程", value: "" },
        { name: "CAN数据", value: "", className: "" },
        { name: "GPS车速", value: "" },
      ],
      activeNames: [],
      list2: [],
      formInfo: {},
      // 高德地图
      isMoven: false, // 全屏
      center: [116.4, 39.9],
      zoom: 18,
      markers: null,
      lineArr: [],
      map: null,
      polyline: null,
    };
  },
  computed: {
    activeName() {
      return this.$store.state.theme.activeName;
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.$nextTick(() => {
          this.initMap();
          
        });
        this.resetForm();
        this.formInfo = { ...this.data };
        this.formInfo.vinNo =this.data.vinNoTotal
        //列表默认值
        this.baseDataVary.isOnline =
          this.formInfo.isOnline == 1 ? "在线" : "离线";
        this.baseDataVary.isOnlineClass =
          this.formInfo.isOnline == 1 ? "yesCAN" : "noCAN";
        this.baseDataVary.hasCANClass =
          this.formInfo.hasCan == 1 && this.formInfo.isOnline == 1
            ? "yesCAN"
            : "noCAN";
        this.baseDataVary.isdrivingClass =
          this.formInfo.isOnline == 1 && this.formInfo.isDriving == 1
            ? "yesCAN"
            : "noCAN";
        if (this.formInfo.isOnline === 0) {
          this.baseDataVary.isGpsPositionClass = "noCAN";
          this.baseDataVary.isGpsPosition = "未定位";
        } else {
          this.baseDataVary.isGpsPositionClass =
            this.formInfo.isGpsPosition == 1 ? "yesCAN" : "noCAN";
          this.baseDataVary.isGpsPosition =
            this.formInfo.isGpsPosition == 1 ? "已定位" : "未定位";
        }
        this.baseDataVary.isDriving =
          this.formInfo.isOnline == 1 && this.formInfo.isDriving == 1
            ? "行驶"
            : "停止";
        this.baseDataVary.hasCAN =
          this.formInfo.hasCan == 1 && this.formInfo.isOnline == 1
            ? "有CAN"
            : "无CAN";
        this.setCarData();
        this._carinfo();
      } else {
        if (this.websocketHeartbeatJs) {
          this.websocketHeartbeatJs.close();
          this.websocketHeartbeatJs = null;
        }
      }
    },
  },
  created() {
    window.addEventListener("beforeunload", (e) => {
      if (this.websocketHeartbeatJs) {
        this.websocketHeartbeatJs.close();
        this.websocketHeartbeatJs = null;
      }
    });
  },
  beforeDestroy() {
    if (this.websocketHeartbeatJs) {
      this.websocketHeartbeatJs.close();
      this.websocketHeartbeatJs = null;
    }
  },
  mounted() {},
  methods: {
    initMap() {
      BMapLoader("XYGGuNFiNdrDDS3pedeGIjybxNgGAtjp")
        .then((BMapGL) => {
          this.map = new BMapGL.Map("realtimeMap");
          this.map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 18); // 初始化地图，中心点和缩放级别
          this.map.enableScrollWheelZoom(true);
          // 发送心跳
          getWebSocket().then(({ data }) => {
            if (data.code === 0) {
              let urlBefore = location.protocol === "https:" ? "wss://" : "ws://";
              let self = this;
              // 线上地址
              // const soketIntence = socket.createSocket(urlBefore + data.data);
              // 本地地址
              // const soketIntence = socket.createSocket(
              // 	"wss://fullscreenapi-iov.bjev.com.cn/"
              // );
              self.websocketHeartbeatJs = new WebsocketHeartbeatJs({
                // url: "ws://10.9.21.104:8810",
                url: urlBefore + data.data,
                pingTimeout: 4000, //每隔4秒发送一次心跳，如果收到任何后端消息定时器将会重置
                pongTimeout: 10000, //心跳消息发送之后，10秒内没收到后端消息便会认为连接断开
                reconnectTimeout: 2000, //尝试重连的间隔时间
                pingMsg: "0#", //心跳消息值
                repeatLimit: 50, //允许最大重连次数
              });
              self.websocketHeartbeatJs.onopen = function() {
                console.log("---连接成功---");
                self.websocketHeartbeatJs.send("2#" + self.formInfo.vinNo);
              };
              self.websocketHeartbeatJs.onmessage = function(e) {
                if (e.data == "close") self.websocketHeartbeatJs.close();
                self._webSocket(e);
              };
              self.websocketHeartbeatJs.onreconnect = function() {
                console.log("断线重连中...");
              };
              self.websocketHeartbeatJs.onclose = () => {
                console.log("断开");
              };
            } else {
              this.$message.warning({
                message: "获取websocket地址失败",
                duration: 2 * 1000,
              });
            }
          });
          this.echartsInit(this.echartsData);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 关闭
    closeDrawer() {
      this.$emit("update:visibles", false);
      if (this.websocketHeartbeatJs) {
        this.websocketHeartbeatJs.send("4#" + this.formInfo.vinNo);
        this.websocketHeartbeatJs.close();
        this.websocketHeartbeatJs = null;
      }
    },
    // 仪表盘
    echartsInit(speedData) {
      const bar_dv = this.$refs.bar_dv;
      const option = {
        title: {
          // 设置仪表盘中间显示文字样式
          text: "Km/h",
          left: "center",
          top: "20%",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "#a5abb0",
          },
        },
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            name: "车速",
            type: "gauge",
            radius: "90%",
            center: ["50%", "43%"],
            min: 0,
            max: 180,
            splitNumber: 9,
            pointer: {
              width: 3, // 指针的宽度
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [0, "#409eff"],
                  [1, "#ddd"],
                ],
                width: 4, // 轴线宽度
              },
            },
            axisLabel: {
              show: true,
              color: "#a5abb0",
              distance: 8,
            },
            splitLine: {
              // 分割线样式
              distance: 1,
              length: 6,
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                width: 1,
                color: "#ddd",
              },
            },
            detail: { formatter: "{value}", color: "#a5abb0", fontSize: 18 },
            data: [{ value: speedData }],
          },
        ],
      };
      this.mycharts = this.$echarts.init(bar_dv);
      this.mycharts.setOption(option, true);
    },
    // 仪表盘设置
    setSpeedData(speed) {
      if (this.mycharts) {
        this.mycharts.setOption({
          series: [
            {
              axisLine: {
                show: true,
                lineStyle: {
                  color: [
                    [speed / 180, "#409eff"],
                    [1, "#ddd"],
                  ],
                  width: 4, // 轴线宽度
                },
              },
              detail: { formatter: "{value}" },
              data: [{ value: speed || 0 }],
            },
          ],
        });
      }
    },
    // 车辆基础数据
    _carinfo() {
      this.loading = true;
      const postdata = {
        vinNo: this.formInfo.vinNo,
      };
      getcarinfo(postdata)
        .then(({ data }) => {
          if (data.code === 0) {
            const dataMsg = data.data[0] || [];
            this.baseDataVary.productTypeNumber = dataMsg.productTypeNumber;
            this.baseDataVary.carTypeName = dataMsg.carTypeName;
            this.baseDataVary.areaName = dataMsg.areaName;
            this.baseDataVary.carBatchCode = dataMsg.carBatchCode;
            this.baseDataVary.vinNo = dataMsg.vinNo;
            this.setCarData();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // Socket数据
    _webSocket(e) {
      let i = 0;
      const msgArr = e.data.substring(2, e.data.length).split(/[,#]/);
      console.log(msgArr);
      // 上半部分
      const vinNo = msgArr[i++];
      console.log(vinNo);
      const status = msgArr[i++]; // 状态位
      // 是否在线
      // console.log(status,status & 0x01,"status是否在线0x01")
      const isOnline = !!(status & 0x01);
      // 是否行驶
      // console.log(status >> 1,(status >> 1) & 0x01,"isDriving是否行驶0x01")
      const isDriving = !!((status >> 1) & 0x01);
      // // 是否充电
      // isCharging: !!((status >> 2) & 0x01)
      // // 是否故障
      // isFault: !!((status >> 3) & 0x01)
      // 是否定位
      // console.log(status >> 4,(status >> 4) & 0x01,"是否定位",isOnline)
      const isGpsPosition = !!((status >> 4) & 0x01);

      // const isOnline = msgArr2.substring(msgArr2.length - 1, msgArr2.length); // 是否在线
      // const isGpsPosition = msgArr2.substring(
      // 	msgArr2.length - 5,
      // 	msgArr2.length - 4
      // ); // 是否定位
      // const isDriving = msgArr2.substring(
      // 	msgArr2.length - 2,
      // 	msgArr2.length - 1
      // ); // 是否行驶
      const lat = +msgArr[i++];
      const lng = +msgArr[i++];
      console.log(lng,lat,"经纬度")
      const direction = +msgArr[i++];
      this.baseDataVary.isOnline = isOnline ? "在线" : "离线";
      this.baseDataVary.isOnlineClass = isOnline ? "yesCAN" : "noCAN";
      const travelTime = msgArr[i++];
      const gpsSpeed = msgArr[i++];
      const gpsMileage = msgArr[i++];
      const extCount = ~~msgArr[i++];
      i += extCount;
      let md5 = msgArr[i++];
      const canCount = ~~msgArr[i++];
      // console.log("最后数据上报时间：",travelTime,"GPS里程：",gpsMileage,"GPS车速：",gpsSpeed)
      this.baseDataVary.travelTime = travelTime;
      this.baseDataVary.GPSlicheng = gpsMileage;
      this.baseDataVary.GPSspeed = gpsSpeed;
      this.baseDataVary.xhQD = 0;
      // msgArr[8]扩展字段
      let index = 8;
      if (msgArr[8] > 0) {
        index = 8 + parseInt(msgArr[8]);
        this.baseDataVary.xhQD = msgArr[9];
        // console.log("信号强度：",msgArr[9])
      }
      // const lnglat = [lat, lng];
      // 经纬度不为0
      if (lng != 0 && lat != 0) {
        //移除图标
        if (this.markers) {
          this.map.removeOverlay(this.markers);
        }
        // 创建图标
        const marker = new BMapGL.Marker(new BMapGL.Point(lng, lat));
        this.markers = marker;
        this.map.addOverlay(marker);
        this.map.centerAndZoom(new BMapGL.Point(lng, lat), 18);
      }
      // 轨迹
      if (isDriving) {
        // 行驶状态才会出现轨迹
        this.lineArr.push(new BMapGL.Point(lng, lat));
        this.polyline = new BMapGL.Polyline(this.lineArr, {
          strokeColor: "#ff0000",
          strokeWeight: 6,
          strokeOpacity: 1,
        });
        this.map.addOverlay(this.polyline);
      }
      // 车速
      this.setSpeedData(gpsSpeed);
      this.baseDataVary.isGpsPosition =
        isOnline && isGpsPosition ? "已定位" : "未定位";
      this.baseDataVary.isGpsPositionClass =
        isOnline && isGpsPosition ? "yesCAN" : "noCAN";
      this.baseDataVary.isDriving = isDriving ? "行驶" : "停止";
      this.baseDataVary.isdrivingClass = isDriving ? "yesCAN" : "noCAN";
      this.baseDataVary.hasCAN = ~~canCount > 0 && isOnline ? "有CAN" : "无CAN";
      this.baseDataVary.hasCANClass =
        ~~canCount > 0 && isOnline ? "yesCAN" : "noCAN";
      //}
      this.setCarData();
      // 下半部分数据
      if (this.formInfo.md5Code) {
        const listDataArr = msgArr.slice(i, i + canCount);
        this._getodbData(isOnline, listDataArr);
      }
    },
    // 下半部分数据
    _getodbData(isOnline, msgArr) {
      const postdata = {
        md5Code: this.formInfo.md5Code,
      };
      getdbcvar(postdata).then(({ data }) => {
        if (data.code === 0) {
          const listArry = data.data || [];
          // 切割socket数组
          const listDataArr = msgArr;
          // 标题去重
          const titleAll = [];
          for (var i = 0; i < listArry.length; i++) {
            titleAll.push(listArry[i].moduleName);
          }
          const titleArry = Array.from(new Set([...titleAll]));
          // 数据处理
          const listAll = [];
          var SOCFlag = false; // 判断是否有 ‘动力电池剩余电量SOC’
          var SOCarry = []; // 存储没有 ‘动力电池剩余电量SOC’ 时的soc值
          // 循环给list2加入数据
          for (var j = 0; j < titleArry.length; j++) {
            var obj1 = {
              title: titleArry[j],
              data: [],
            };
            for (var k = 0; k < listArry.length; k++) {
              if (titleArry[j] === listArry[k].moduleName) {
                const number =
                  parseInt(
                    listArry[k].columnName.substring(
                      4,
                      listArry[k].columnName.length
                    )
                  ) - 1;
                var obj2 = {};
                var valuenumber = 0;
                if (listDataArr[number] == 0.0) {
                  valuenumber = 0;
                } else {
                  valuenumber = listDataArr[number];
                }
                obj2 = {
                  name: listArry[k].varName,
                  unit: listArry[k].unit,
                  value: valuenumber,
                };
                obj1.data.push(obj2);
                // 电池电量
                // if (
                // 	listArry[k].varName
                // 		.toLowerCase()
                // 		.indexOf("SOC".toLowerCase()) > -1
                // ) {
                // 	if (listArry[k].varName === "动力电池剩余电量SOC") {
                // 		SOCFlag = true;
                // 		this.soc = Math.round(listDataArr[number]);
                // 	} else {
                // 		SOCarry.push(listDataArr[number]);
                // 	}
                // }
                // console.log(listArry[k].varName, listDataArr[number]);
                let reg = /^(BMS_SOC)$/;
                if (reg.test(listArry[k].varName)) {
                  // console.log(listArry[k].varName, listDataArr[number],3333);
                  SOCFlag = true;
                  this.soc = Math.round(listDataArr[number]);
                } else {
                  SOCarry.push(listDataArr[number]);
                }
              }
            }
            listAll.push(obj1);
          }
          if (!SOCFlag) {
            this.soc = SOCarry[0];
          }
          // console.log(listAll, SOCarry, "listAll");
          this.list2 = listAll;
          this.list2.forEach((item, index) => {
            this.activeNames.push(index);
          });
        }
      });
    },
    // tab点击事件
    itemclick(item, index) {
      if (!item.isSelect) {
        item.isSelect = true;
      } else {
        item.isSelect = !item.isSelect;
      }
      this.$set(this.list2, index, item);
    },
    // 设置车辆基础数据
    setCarData() {
      this.baseData = [
        {
          name: "终端是否在线",
          value: this.baseDataVary.isOnline || "-",
          className: this.baseDataVary.isOnlineClass,
        },
        {
          name: "最后数据上报时间",
          value: this.baseDataVary.travelTime || "-",
        },
        { name: "VIN码", value: this.baseDataVary.vinNo || "-" },
        { name: "车型编码", value: this.baseDataVary.carTypeName || "-" },
        { name: "项目代号", value: this.baseDataVary.carBatchCode || "-" },
        { name: "产品型号", value: this.baseDataVary.productTypeNumber || "-" },
        { name: "使用区域", value: this.baseDataVary.areaName || "-" },
        { name: "信号强度", value: this.baseDataVary.xhQD || 0 },
        {
          name: "是否定位",
          value: this.baseDataVary.isGpsPosition || "-",
          className: this.baseDataVary.isGpsPositionClass,
        },
        {
          name: "是否行驶",
          value: this.baseDataVary.isDriving || "-",
          className: this.baseDataVary.isdrivingClass,
        },
        { name: "GPS里程", value: (this.baseDataVary.GPSlicheng || 0) + "Km" },
        {
          name: "CAN数据",
          value: this.baseDataVary.hasCAN || "-",
          className: this.baseDataVary.hasCANClass,
        },
        { name: "GPS车速", value: (this.baseDataVary.GPSspeed || 0) + "Km/h" },
      ];
    },
    // 清空数据
    resetForm() {
      this.baseData = [
        { name: "终端是否在线", value: "", className: "" },
        { name: "最后数据上报时间", value: "" },
        { name: "VIN码", value: "" },
        { name: "车型编码", value: "" },
        { name: "项目代号", value: "" },
        { name: "产品型号", value: "" },
        { name: "使用区域", value: "" },
        { name: "信号强度", value: "" },
        { name: "是否定位", value: "", className: "" },
        { name: "是否行驶", value: "", className: "" },
        { name: "GPS里程", value: "" },
        { name: "CAN数据", value: "", className: "" },
        { name: "GPS车速", value: "" },
      ];
      this.baseDataVary = {
        isOnline: "",
        isOnlineClass: "",
        travelTime: "",
        vinNo: "",
        carTypeName: "",
        carBatchCode: "",
        productTypeNumber: "",
        areaName: "",
        xhQD: "",
        isGpsPosition: "",
        isGpsPositionClass: "",
        isDriving: "",
        GPSlicheng: "",
        GPSspeed: "",
        hasCAN: "",
        hasCANClass: "",
        isdrivingClass: "",
      };
      this.list2 = [];
      this.activeNames = [];
      this.echartsData = 0;
      this.soc = 0; // 电池电量
      this.lineArr = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.map-box {
  // padding-bottom: 10px;
  .amap-page-container {
    height: 195px;
    width: 25%;
    position: relative;
    float: left;
    border: 1px solid #e6e9ec;
    border-radius: 5px;
  }
  .all-moven-box {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 222;
  }
  .all-moven {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 2222;
    cursor: pointer;
    svg {
      font-size: 20px !important;
    }
  }
  .moven2 {
    svg {
      font-size: 26px !important;
    }
  }
  .car-speed-box1 {
    float: left;
    width: 16%;
    min-width: 180px;
    padding-left: 3%;
    box-sizing: border-box;
    .car-speed-box-chart1 {
      width: 100%;
      height: 180px;
    }
    .car-real-battery {
      width: 121px;
      margin: 0 auto;
      margin-top: -40px;
      .car-real-battery-soc {
        width: 121px;
        height: 33px;
        background: url("../../../../assets/images/soc_dlk.png") no-repeat;
        background-size: auto;
        position: relative;
        padding: 2px 4px 0 2px;
        box-sizing: border-box;
        .car-real-battery-progress {
          height: 29px;
          background: #00f65d;
          border-radius: 4px 0 0 4px;
          transition: all 2s;
          -moz-transition: all 2s; /* Firefox 4 */
          -webkit-transition: all 2s; /* Safari 和 Chrome */
          -o-transition: all 2s;
        }
        .car-real-battery-progress-text {
          position: absolute;
          top: 0;
          left: 0;
          line-height: 33px;
          width: 100%;
          text-align: center;
        }
      }
      .car-real-battery-txt {
        width: 121px;
        text-align: center;
        margin-top: 8px;
        display: inline-block;
        // color: #515c60;
      }
    }
  }
  .car-real-area-data {
    float: left;
    box-sizing: border-box;
    width: 55%;
    // flex: auto;
    ul {
      padding-left: 10px;
    }
    li {
      line-height: 30px;
      width: 50%;
      float: left;
      box-sizing: border-box;
      font-size: 12px;
      .in-name {
        // color: #515c60;
        width: 110px;
        display: inline-block;
        text-align: right;
      }
      // .in-value {
      // 	// color: #6e7679;
      // }
    }
  }
}
.yesCAN {
  color: #409eff;
}
.noCAN {
  color: #ff0000;
}
.dfc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.carStatusData1 {
  height: calc(100vh - 310px);
  ul {
    padding: 0 3px 0 0;
    margin: 0;
  }
  li {
    margin: 0 0 10px 0;
  }
  .car-title {
    line-height: 40px;
    font-weight: bold;
    padding: 0 10px;
    svg {
      font-size: 14px !important;
    }
  }
  .car-data {
    // border: 1px solid #e0e5e7;
    border-bottom: 0 none;
    border-left: 0 none;
    p {
      float: left;
      width: 50%;
      box-sizing: border-box;
      margin: 0;
      font-size: 12px;
      // border-bottom: 1px solid #e0e5e7;
      span {
        display: inline-block;
        line-height: 46px;
        border: 1px solid #e0e5e7;
      }
      .carmessage-name {
        background: transparent;
        width: 60%;
        text-align: right;
        padding: 0 10px;
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
      }
      .carmessage-value {
        width: 40%;
        text-align: center;
      }
    }
    p.borderNone {
      border-bottom: 0 none;
    }
  }
}
</style>
