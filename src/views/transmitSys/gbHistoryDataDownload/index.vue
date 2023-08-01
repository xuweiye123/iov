<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :exportLoading="exportLoading"
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :showRightMore="false"
        @click-export="handleSubmit"
        @click-taskDetails="handleDetails"
      >
      </app-authorize-button>
      <!-- table -->
      <el-table
        v-loading="loading"
        v-if="istable"
        :data="listType"
        :height="tableHeight"
        class="NoStripe"
        :header-cell-style="{ 'border-right': '1px solid #e0e5e7' }"
      >
        <el-table-column
          v-for="(item, index) in lieData"
          :prop="item.value"
          :key="index"
          :label="item.label"
          :show-overflow-tooltip="true"
          :fit="true"
          :align="'center'"
        >
          <el-table-column
            v-for="(item1, index) in item.children"
            :prop="item1.value"
            :key="index"
            :fit="true"
            :show-overflow-tooltip="true"
            width="190px"
            :align="'center'"
          >
            <div slot="header">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item1.name"
                placement="top"
                :disabled="String(item1.name).length < 12"
              >
                <span>{{ item1.name }}</span>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table-column>
        <!-- 自定义暂无数据 -->
        <template slot="empty">
          <img
            :src="require(`@/assets/images/img_zanwushuju.png`)"
            alt=""
            style="margin-bottom: 20px"
          />
          <div style="display: inline-block; margin-left: -105px">暂无数据</div>
        </template>
      </el-table>
    </div>
    <vehicle-Status
      :visibles.sync="vehicleStatusVisible"
      @ploadTree="ploadTree"
      :ison="ison"
      @isont="isont"
    ></vehicle-Status>

    <Task-Details-List :visibles.sync="taskDetailsVisible" />
  </div>
</template>

<script>
import vehicleStatus from "./components/vehicleStatus";
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import TaskDetailsList from "./components/detailsDialog";
// request
import {
  getHistoryData,
  getHisDataParams,
  historicalDataExport,
} from "@/api/transmitSys/vehicleComponyManagement";
// 辅助函数
export default {
  doNotInit: true,
  name: "gbHistoryDataDownload",
  components: { vehicleStatus, TaskDetailsList },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vin: "",
        params: null,
        isResend: "",
        timeRange: [],
      },
      faultLevelList: [
        { value: "0", label: "实时数据" },
        { value: "1", label: "补发数据" },
      ],
      loading: false,
      istable: true, //强制刷新列表
      vehicleStatusVisible: false,
      // 字段管理所需字段
      list11: [],
      listType: [],
      ison: false,
      lieData: [],
      listLoading: false,
      title: "",
      isEdit: false, //是否编辑
      selectCarVisible: false,
      taskDetailsVisible: false,
    };
  },
  watch: {},
  computed: {
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
          type: "dateTimeRange",
          spanNumber: 12,
        },
        {
          label: "数据类型",
          value: "isResend",
          type: "select",
          options: {
            data: this.faultLevelList, //下拉数组
          },
        },
        {
          label: "选择参数",
          value: "groupDateName",
          type: "input",
          readonly: true,
          focusEvent: this.handleStatus,
        },
      ];
    },
  },
  mounted() {
    this.getparams();
  },
  methods: {
    getparams() {
      // getHisDataParams().then(({ data }) => {
      //   if (data.code === 0) {
      this.lieData = [];
      // data.data.forEach((item, index) => {
      //   if (index === 0) {
      //     let dataaa = {
      //       label: item.paramName,
      //       value: item.paramValue,
      //       children: [],
      //     };
      //     this.lieData.push(dataaa);
      //     item.children.forEach((item1) => {
      //       let name = item1.paramName;
      //       let value = item1.paramValue;
      //       this.lieData[index].children.push({ name, value });
      //     });
      //   }
      // });

      this.lieData.unshift({
        label: "基础数据",
        value: "data",
        children: [],
      });
      this.lieData[0].children.splice(0, 0, {
        name: "数据采集时间",
        value: "collectionTime",
      });
      this.lieData[0].children.splice(1, 0, {
        name: "数据接收时间",
        value: "receiveTime",
      });
      this.lieData[0].children.splice(2, 0, {
        name: "数据类型",
        value: "isResend",
      });
      this.lieData.push({
        label: "整车数据",
        value: "CarStatus",
        children: [
          {
            name: "车辆状态",
            value: "carStatusValue",
          },
          {
            name: "充电状态",
            value: "chargeStatusValue",
          },
          {
            name: "运行模式",
            value: "runStyle",
          },
          {
            name: "车速",
            value: "speed",
          },
          {
            name: "累计里程",
            value: "totalMile",
          },
          {
            name: "总电压",
            value: "totalVoltage",
          },
          {
            name: "总电流",
            value: "totalElectic",
          },
          {
            name: "SOC",
            value: "soc",
          },
          {
            name: "dcdc状态",
            value: "dcDcStatus",
          },
          {
            name: "挡位",
            value: "gear",
          },
          {
            name: "绝缘电阻",
            value: "insulatedResistance",
          },
        ],
      });
      //   }
      // });
      console.log(this.lieData, "this.lieD111ata");
    },
    handleDetails(val) {
      this.taskDetailsVisible = true;
    },
    isont() {
      this.ison = false;
    },
    handleSubmit() {
      //时间必填
      if (!this.listQuery.timeRange[0] || !this.listQuery.timeRange[1]) {
        this.$message.warning({
          message: "请先选择时间范围！",
          duration: 2 * 1000,
        });
        return;
      }
      if (
        new Date(this.listQuery.timeRange[1]) -
          new Date(this.listQuery.timeRange[0]) >
        7 * 24 * 60 * 60 * 1000
      ) {
        this.$message.warning({
          message: "只能查询七天之内的数据!",
          duration: 2 * 1000,
        });
        return;
      }
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";

      let parms = {
        ...this.listQuery,
        taskType: 2,
      };
      this.exportLoading = true;
      historicalDataExport(parms)
        .then(({ data }) => {
          if (data.code == 0) {
            this.$message.success({
              message: "离线下载完成！",
              duration: 2 * 1000,
            });
          } else {
          }
        })
        .finally(() => {
          this.exportLoading = false;
        })
    },
    ploadTree(dataList, groupDateName, Alldata) {
      this.vehicleStatusVisible = false;
      this.listQuery.groupDateName = groupDateName.join(",");
      if (Object.keys(dataList).length == 0) {
        this.listQuery.params = null;
      } else {
        this.listQuery.params = dataList;
      }
      this.list11 = [];
      Alldata.forEach((item, index) => {
        let adata = {
          label: item.paramName,
          value: item.paramValue,
          children: [],
        };
        if (item.groupDate) {
          this.list11.push(adata);
          item.groupDate.forEach((item1) => {
            item.children.forEach((item2) => {
              if (item1 == item2.paramName) {
                let name = item2.paramName;
                let value = item2.paramValue;
                this.list11[index].children.push({ name, value });
              }
            });
          });
        } else {
          let adata1 = {
            label: "",
            value: "",
            children: [],
          };
          this.list11.push(adata1);
        }
      });
      this.list11 = this.list11.filter((item) => {
        return item.children.length > 0;
      });
      this.list11.unshift({
        label: "基础数据",
        value: "data",
        children: [],
      });
      this.list11[0].children.splice(0, 0, {
        name: "数据采集时间",
        value: "collectionTime",
        children: [],
      });
      this.list11[0].children.splice(1, 0, {
        name: "数据接收时间",
        value: "receiveTime",
        children: [],
      });
      this.list11[0].children.splice(2, 0, {
        name: "数据类型",
        value: "isResend",
        children: [],
      });
      console.log(this.list11, "this.list11");
      this.listLoad();
    },
    handleVinNo() {
      this.selectCarVisible = true;
    },
    selectionVal(val) {
      this.selectCarVisible = false;
      this.listQuery.vin = val.length ? val[0].vinNo : "";
    },
    handleStatus() {
      if (this.listQuery.timeRange[0] && this.listQuery.timeRange[1]) {
        this.vehicleStatusVisible = true;
      } else {
        this.$message.warning({
          message: "请先选择时间范围！",
          duration: 2 * 1000,
        });
      }
    },

    // 加载数据
    listLoad() {
      // this.ison = false;
      this.listType = [];
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";
      //vin码必填
      if (!this.listQuery.vin) {
        this.$message.warning({
          message: "请先输入VIN码！",
          duration: 2 * 1000,
        });
        return;
      }
      //时间必填
      if (!this.listQuery.timeRange[0] || !this.listQuery.timeRange[1]) {
        this.$message.warning({
          message: "请先选择时间范围！",
          duration: 2 * 1000,
        });
        return;
      }

      if (
        new Date(this.listQuery.timeRange[1]) -
          new Date(this.listQuery.timeRange[0]) >
        7 * 24 * 60 * 60 * 1000
      ) {
        this.$message.warning({
          message: "只能查询七天之内的数据!",
          duration: 2 * 1000,
        });
        return;
      }
      this.listLoading = true;
      this.loading = true;
       let params = {
        ...this.listQuery,
        carType: null,
      };
      this.$forceUpdate();
      getHistoryData(params)
        .then(({ data }) => {
          this.istable = false;
          if (data.code === 0) {
            if (!this.list11 || this.list11.length == 0) {
              this.getparams();
            }
            //对数据进行判断，数据格式不对的跳出，执行下一次循环
            let num10 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            data.data &&
              data.data.forEach((item, i) => {
                //当dataList中的key不在num10中时，跳出此次循环
                for (const key in item.dataList) {
                  //当key在num10中没有时，跳出此次循环
                  if (num10.indexOf(Number(key)) == -1) {
                    return;
                  }
                }
                // console.log("1")
                let { dataList = {} } = item;
                var arr = Object.keys(dataList);
                if (arr.length > 0) {
                  let receiveTime = item.receiveTime ? item.receiveTime : [];
                  let collectionTime = item.collectionTime
                    ? item.collectionTime
                    : [];
                  let isResend;
                  if (item.isResend == 0) {
                    isResend = "实时数据";
                  } else if (item.isResend == 1) {
                    isResend = "补发数据";
                  }
                  // console.log(dataList[2], "dataList[2]");
                  let motorUnitListN =
                    dataList[2] != [] &&
                    dataList[2] != undefined &&  dataList[2].motorUnitList &&
                    dataList[2].motorUnitList != []
                      ? dataList[2].motorUnitList[0]
                      : [];
                  let batterVoltagesN =
                    dataList[8] != [] &&
                    dataList[8] != undefined &&
                    dataList[8].batterVoltages != []
                      ? dataList[8].batterVoltages[0]
                      : [];
                  let batteryTemperaturesN =
                    dataList[9] != [] &&
                    dataList[9] != undefined &&
                    dataList[9].batteryTemperatures != []
                      ? dataList[9].batteryTemperatures[0]
                      : [];
                  let serial2;
                  let status2;
                  let temperature2;
                  let controllerTemperature2;
                  let engineSpeed2;
                  let torque2;
                  let inputVoltage2;
                  let current2;
                  // console.log(batterVoltagesN,"motorUnitListN");
                  // let batteryVoltages = batterVoltagesN.batteryVoltages != undefined && ? dataList[10].batteryVoltages[0] : [];
                  let col = {
                    ...dataList[1],
                    ...dataList[2],
                    ...dataList[3],
                    ...dataList[4],
                    ...dataList[5],
                    ...dataList[6],
                    ...dataList[7],
                    ...dataList[8],
                    ...dataList[9],
                    ...motorUnitListN,
                    ...batterVoltagesN,
                    ...batteryTemperaturesN,
                    receiveTime,
                    collectionTime,
                    isResend,
                    serial2,
                    status2,
                    temperature2,
                    controllerTemperature2,
                    engineSpeed2,
                    torque2,
                    inputVoltage2,
                    current2,
                  };
                  if (this.list11 && this.list11.length > 0) {
                    this.lieData = [];
                    this.lieData = this.list11;
                    console.log(this.lieData, "this.lieData");
                  }
                  this.listType.push(col);
                }
              });

            this.listType.map((item) => {
              if (item.motorUnitList&&item.motorUnitList[1]) {
                item.serial2 = item.motorUnitList[1].serial;
                item.status2 = item.motorUnitList[1].status;
                item.temperature2 = item.motorUnitList[1].temperature;
                item.controllerTemperature2 =
                  item.motorUnitList[1].controllerTemperature;
                item.engineSpeed2 = item.motorUnitList[1].engineSpeed;
                item.torque2 = item.motorUnitList[1].torque;
                item.inputVoltage2 = item.motorUnitList[1].inputVoltage;
                item.current2 = item.motorUnitList[1].current;
              }
              if (item.batteryVoltages) {
                console.log(item.batteryVoltages, "item.batteryVoltages");
                //循环数组，给每一项补足三位小数
                // item.batteryVoltages = item.batteryVoltages.map((item) => {
                //   return item.toFixed(3);
                // });
                item.batteryVoltages = item.batteryVoltages.join(", ");
              }

              if (item.temperatures) {
                item.temperatures = item.temperatures.join(", ");
              }
              for (const key in item) {
                if (this.getdata(key, item[key])) {
                  item[key] = this.getdata(key, item[key]);
                }
              }
              //处理通用报警标志这个字段
              item.commonAlarmFlag = this.commonData(item.commonAlarmFlag);
            });
            this.total = data.total;
            this.tableRow = {};
          }
          this.listLoading = false;
          this.loading = false;
        })
        .finally(() => {
          this.istable = true;
          this.listLoading = false;
          this.loading = false;
        });
      console.log(this.listType, "this.listType");
      // this.listType = [this.listType[0]]
    },
    //处理通用报警标志这个字段
    commonData(data) {
      console.log(data, "data");
      if (data == 0) {
        return data;
      }
      if (data) {
        // let jj = 85;
        let x = data.toString(2);
        //数字反转
        let commonX = x.split("").reverse();
        //不够17位后面补0
        for (let i = 0; i < 17; i++) {
          if (commonX[i] == undefined) {
            commonX[i] = "0";
          }
        }
        let currency = [
          "温度差异报警",
          "电池高温报警",
          "车载储能装置类型过压报警",
          "车载储能装置类型欠压报警",
          "SOC低报警",
          "单体电池过压报警",
          "单体电池欠压报警",
          "SOC过高报警",
          "SOC跳变报警",
          "可充电储能系统不匹配报警",
          "电池单体一致性差报警",
          "绝缘失效报警",
          "DC-DC温度报警",
          "制动系统报警",
          "DC-DC状态报警",
          "驱动电机控制器温度报警",
          "高压互锁状态报警",
          "驱动电机温度报警",
          "车载储能装置类型过充",
        ];
        //循环遍历，0不显示，1显示
        let commonY = [];
        for (let i = 0; i < commonX.length; i++) {
          if (commonX[i] == 1) {
            commonY.push(currency[i]);
          }
        }

        //数组转字符串
        return commonY.join(",");
      }
    },
    chunk(arr, size) {
      var arr1 = new Array();
      for (let i = 0; i < Math.ceil(arr.length / size); i++) {
        arr1[i] = new Array();
      }
      var j = 0;
      var x = 0;
      for (let i = 0; i < arr.length; i++) {
        if (!(i % size == 0 && i != 0)) {
          arr1[j][x] = arr[i];
          x++;
        } else {
          j++;
          x = 0;
          arr1[j][x] = arr[i];
          x++;
        }
      }
      //将二维数组arr1转换为一维数组arr2
      var arr2 = new Array();
      for (let i = 0; i < arr1.length; i++) {
        arr2.push(arr1[i].toString());
      }
      return arr2;
    },
    handleClear() {
      this.listQuery.vin = "";
      this.listQuery.timeRange = [];
      this.listQuery.groupDateName = "";
      this.listQuery.isResend = "";
      this.listQuery.params = null;
      this.list11 = [];
      this.getparams();
      this.listType = [];
      // this.listLoad();
      this.ison = true;
    },

    /**
     * @name: 导出
     * @param {*}
     */
    handleExport() {
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";
      exportCarMaker(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功",
            duration: 2 * 1000,
          });
        }
      });
    },
    //判断是否有数据，有就展示没有就--
    isdata(item, index) {
      if (item) {
        let arr = item.split(",");
        console.log(arr, "arr");

        this.chunk(arr, 10);
        return this.chunk(arr, 10);
      }
    },
    getdata(data, key) {
      switch (data) {
        case "carStatusValue":
          return key == "1"
            ? "启动"
            : key == "2"
            ? "熄火"
            : key == "3"
            ? "其他"
            : key == "254"
            ? "异常"
            : "无效";
        case "chargeStatusValue":
          return key == "1"
            ? "停车充电"
            : key == "2"
            ? "行驶充电"
            : key == "3"
            ? "未充电状态"
            : key == "4"
            ? "充电完成"
            : key == "254"
            ? "异常"
            : "无效";
        case "runStyle":
          return key == "1"
            ? "纯电"
            : key == "2"
            ? "混动"
            : key == "3"
            ? "燃油"
            : key == "254"
            ? "异常"
            : "无效";
        case "dcDcStatus":
          return key == "1"
            ? "工作"
            : key == "2"
            ? "断开"
            : key == "254"
            ? "异常"
            : "无效";
        case "status":
          return key == "1"
            ? "耗电"
            : key == "2"
            ? "发电"
            : key == "3"
            ? "关闭状态"
            : key == "4"
            ? "准备状态"
            : key == "254"
            ? "异常"
            : "无效";
        case "status2":
          return key == "1"
            ? "耗电"
            : key == "2"
            ? "发电"
            : key == "3"
            ? "关闭状态"
            : key == "4"
            ? "准备状态"
            : key == "254"
            ? "异常"
            : key == undefined
            ? ""
            : "无效";
        case "carEngineStatus":
          return key == "1"
            ? "启动"
            : key == "2"
            ? "关闭"
            : key == "254"
            ? "异常"
            : "无效";
        case "locationStatus":
          return key == "0" ? "有效定位" : "无效定位";
        case "alarmLevel":
          return key == "0"
            ? "无故障"
            : key == "1"
            ? "一级故障"
            : key == "2"
            ? "二级故障"
            : key == "3"
            ? "三级故障"
            : key == "254"
            ? "异常"
            : "无效";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.defaults {
  border-bottom: 1px solid #109cff;
}
.errors {
  border-bottom: 1px solid #ff0000;
}
.queue::before {
  content: "";
  display: block;
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00d2cb;
  border-radius: 50%;
}
.section-G {
  ::v-deep .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
}
// .el-table th.el-table__cell.is-leaf {
// 	border: #ebeef5 solid 1px !important;
// }
</style>
