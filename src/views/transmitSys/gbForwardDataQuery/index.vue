<template>
  <div class="js-system-user app-container heightll">
    <app-search>
      <div slot="content">
        <el-form :model="listQuery" label-width="55px" style="width: 100%">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="VIN码：" prop="carStr">
                <vin-select
                  :is-vin="true"
                  :isType="[1, 2]"
                  customClass="vin-select-dialog"
                  v-model="listQuery.vinNo"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :is-collapse="false"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div
      class="section-wrap max-height divScroll baise"
      :style="{ 'min-height': minBoxHeight - 40 + 'px' }"
      v-if="isShow"
    >
      <div
        class="tableBotton"
        style="overflow: hidden"
        v-for="(item, index) in didi"
        :key="index"
      >
        <div style="padding-left: 20px;cursor: pointer;" @click="kgButton(item, index)">
          <i
            class="iconfont icon-arrowDown el-collapse-item__arrow"
            :class="didi[index].show ? 'right1' : 'down'"
          ></i>
          <span class="fontTitle">{{
            item.value == "可用储能装置电压系统信息" ||
            item.value == "可充电储能装置温度数据" ||
            item.value == "驱动电机数据"
              ? `${item.value} (个数：`
              : item.value
          }}</span>
          <span class="NumberProcessing">{{
            item.value == "可用储能装置电压系统信息" ||
            item.value == "可充电储能装置温度数据" ||
            item.value == "驱动电机数据"
              ? `${
                  index == 1
                    ? listLength2
                    : index == 7
                    ? listLength8
                    : index == 8
                    ? listLength9
                    : ""
                }`
              : ""
          }}</span>
          <span class="NumberProcessing1">{{
            item.value == "可用储能装置电压系统信息" ||
            item.value == "可充电储能装置温度数据" ||
            item.value == "驱动电机数据"
              ? `)`
              : ""
          }}</span>
        </div>
        <div
          class="Listtop"
          v-if="index !== 1 && index !== 7 && index !== 8 && didi[index].show"
        >
          <el-row>
            <el-col
              v-for="(item1, index) in item.dataList"
              :span="8"
              :key="index"
              :class="
                parseInt(index / 3) % 2 === 0 ? 'Listcolor1' : 'Listcolor1'
              "
            >
              <div class="ListCss">
                <div class="ListCssTow ListCssTowRight">{{ item1.name }}</div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="String(item1.date)"
                  :disabled="String(item1.date).length < 11"
                >
                  <span class="ListCssTow ListCssTowlift">
                    {{ isdata(item1) }}
                  </span>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
        </div>

        <div v-if="index == 1 && didi[index].show">
          <div
            class="Listtop"
            v-for="(item2, index11) in listLength2"
            :key="index11"
          >
            <el-row>
              <el-col
                :span="8"
                v-for="(item1, index) in item.dataList"
                :key="index"
                :class="
                  parseInt(index / 3) % 2 === 0 ? 'Listcolor1' : 'Listcolor1'
                "
              >
                <div class="ListCss">
                  <div class="ListCssTow ListCssTowRight">
                    {{ item1.name }}
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="String(item1.date[index11])"
                    :disabled="String(item1.date[index11]).length < 11"
                  >
                    <span class="ListCssTow ListCssTowlift">
                      {{ isdata(item1, index11) }}
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <div v-if="index == 7 && didi[index].show">
          <div
            class="Listtop"
            v-for="(item2, index88) in listLength8"
            :key="index88"
          >
            <el-row>
              <el-col
                v-for="(item1, index) in item.dataList"
                :key="index"
                :span="8"
                :class="
                  parseInt(index / 3) % 2 === 0 ? 'Listcolor1' : 'Listcolor1'
                "
              >
                <div class="ListCss" v-if="index != 6">
                  <div class="ListCssTow ListCssTowRight">
                    {{ item1.name }}
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="String(item1.date[index88])"
                    :disabled="String(item1.date[index88]).length < 11"
                  >
                    <span class="ListCssTow ListCssTowlift">
                      {{ isdata(item1, index88) }}
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                v-for="(item1, index) in item.dataList"
                :key="index"
                :span="24"
                class="Listcolor1"
              >
                <div class="ListCss11" v-if="index == 6">
                  <div class="ListCssTow ListCssTowRight1">
                    {{ item1.name }}
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="String(item1.date[index88])"
                    :disabled="String(item1.date[index88]).length < 11"
                  >
                    <div slot="content">
                      <div
                        v-for="(j, index) in isdata(item1, index88)"
                        :key="index"
                      >
                        {{ j }}
                      </div>
                      <br />
                    </div>
                    <span class="ListCssTow ListCssTowlift1">
                      <div
                        v-for="(j, index) in isdata(item1, index88)"
                        :key="index"
                      >
                        <span class="isdataSpan">{{
                          index * 10 + 1 + "-" + (index + 1) * 10 + "："
                        }}</span>
                        {{ j }}
                      </div>
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="index == 8 && didi[index].show">
          <div
            class="Listtop"
            v-for="(item2, index99) in listLength9"
            :key="index99"
          >
            <el-row>
              <el-col
                :span="8"
                v-for="(item1, index) in item.dataList"
                :key="index"
                :class="index99 % 2 === 0 ? 'Listcolor1' : 'Listcolor1'"
              >
                <div class="ListCss" v-if="index != 2">
                  <div class="ListCssTow ListCssTowRight">
                    {{ item1.name }}
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="String(item1.date[index99])"
                    :disabled="String(item1.date[index99]).length < 11"
                  >
                    <span class="ListCssTow ListCssTowlift">
                      {{ isdata(item1, index99) }}
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                v-for="(item1, index) in item.dataList"
                :key="index"
                :span="24"
                class="Listcolor1"
              >
                <div class="ListCss11" v-if="index == 2">
                  <div class="ListCssTow ListCssTowRight1 onedock">
                    <div style="text-align: left">{{ item1.name }}</div>
                  </div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="String(item1.date[index99])"
                    :disabled="String(item1.date[index99]).length < 11"
                  >
                    <div slot="content">
                      <div
                        v-for="(j, index) in isdata(item1, index99)"
                        :key="index"
                      >
                        {{ j }}
                      </div>
                      <br />
                    </div>
                    <span class="ListCssTow ListCssTowlift1">
                      <div
                        v-for="(j, index) in isdata(item1, index99)"
                        :key="index"
                      >
                        <span class="isdataSpan">{{
                          index * 10 + 1 + "-" + (index + 1) * 10 + "："
                        }}</span>
                        {{ j }}
                      </div>
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
 		<div v-else class="carStatusData1 dfc">
				<img
					:src="
						require(`@/assets/images/img_zanwushuju.png`)
					"
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
					请先查询
				</div>
			</div>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

import { getRealData } from "@/api/transmitSys/realTimeDataQuery";

import didi from "@/utils/gbForwardData";

export default {
  name: "gbForwardDataQuery",
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  watch: {
    "listQuery.vinNo": {
      handler() {
        clearTimeout(this.timer);
        this.timer = null;
      },
    },
  },

  //页面销毁时清除定时器
  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },
  data() {
    return {
      listQuery: {
        vinNo: "",
      },
      timer: "",
      buttonOne: false,
      isShow: false,
      selectCarVisible: false,
      listLoading: false,
      lists: [],
      list: [],
      didi: didi,
      handle: [],
      DataCollection: true,
      frequencyNo: 0,
      listLength2: 0,
      listLength8: 0,
      listLength9: 0,
      keyList: [],
      gearList:[
        { label:'空档',value:'0000'},
        { label:'1档',value:'0001'},
        { label:'2档',value:'0010'},
        { label:'3档',value:'0011'},
        { label:'4档',value:'0100'},
        { label:'5档',value:'0101'},
        { label:'6档',value:'0110'},
        { label:'倒档',value:'1101'},
        { label:'自动D档',value:'1110'},
        { label:'停车P档',value:'1111'},
      ]
    };
  },
  mounted() {
    // console.log(didi,"j");
    this.didiList();
  },
  methods: {
    didiList() {
      this.didi.forEach((item) => {
        item.show = true;
        // console.log(4 - (item.dataList.length % 4), "item.dataList.length");
        for (let i = 0; i < item.dataList.length % 4; i++) {
          item.dataList.push({
            date: "",
            name: "",
            prop: "",
          });
        }
      });
    },
    handleVinNo() {
      this.selectCarVisible = true;
    },
    selectionVal(val) {
      this.listQuery.vinNo = val.length ? val[0].vinNo : "";
    },
    hjhhh(item) {
      let arr = item.splice(",");
      var res = [];
      for (var index = 0; index < arr.length; index += 10) {
        res.push([arr[index], arr[index + 1]]);
      }
      return res;
    },
    listLoad() {},
    kgButton(item, index) {
      this.didi[index].show = !this.didi[index].show;
      this.$forceUpdate();
    },
    handleClear() {
      this.listQuery.vinNo = "";
      this.isShow = false;
      this.didi = didi;
    },
    //判断是否有数据，有就展示没有就--
    isdata(item, index) {
      if (item.name) {
        if (item.date) {
          //判断item.data是不是数组
          // console.log(item, index, "ite2222m");
          // console.log(item.name, "item.name");
          if (item.date instanceof Array) {
            if (item.prop == "batteryVoltages" || item.prop == "temperatures") {
              let arr = item.date[index].split(",");
              this.chunk(arr, 10);
              return this.chunk(arr, 10);
            }
            return item.date[index] + " " + item.Company;
          } else {
            return item.date + " " + item.Company;
          }
        } else {
          return "-";
        }
      } else {
        return "";
      }
    },
    //处理通用报警标志这个字段
    commonData(data) {
      // console.log(data, "data");
      if (data == 0) {
        return "0";
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
    // 加载数据
    handleFilter() {
      // this.didi.forEach((item) => {
      //   for (let i = 0; i < item.dataList.length; i++) {
      //     item.dataList.forEach((item1) => {
      //       item1.date = "";
      //     });
      //   }
      // });
      this.keyList = [];
      if (!this.listQuery.vinNo) {
        this.$message.warning({
          message: "VIN码不能为空!",
          duration: 2 * 1000,
        });
        return false;
      }
      // this.list = [];
      // this.listLoading = true;
      let params = {
        vinNo: this.listQuery.vinNo,
        carType: null,
      };
      getRealData(params)
        .then(({ data }) => {
          if (data.code === 0) {
            this.isShow = true;
            if (data.data.dataList) {
              this.list = data.data.dataList;
              this.listLength2 = this.list[2].motorUnitList?this.list[2].motorUnitList.length:0;
              this.listLength8 = this.list[8].systemCount;
              this.listLength9 = this.list[9].systemCount;

              for (const key1 in data.data.dataList) {
                this.keyList.push(key1);
                if (key1 !== 1 || key1 !== 7 || key1 !== 8) {
                  this.didi[Number(key1) - 1].dataList.forEach((item1) => {
                    if (data.data.dataList[key1]) {
                      for (const key in data.data.dataList[key1]) {
                        let datekkkk = data.data.dataList[key1][key];
                        if (item1.prop === key) {
                          let jjj = this.getdata(item1, datekkkk);
                          if (jjj || jjj == 0) {
                            item1.date = jjj;
                          } else {
                            item1.date = datekkkk;
                          }
                        }
                      }
                    }
                    if (item1.prop == "time") {
                      item1.date = data.data.time;
                    }
                  });
                }
              }
              console.log(this.didi[0].dataList,'111')
                let binaryGearStr = ''
                this.didi[0].dataList.forEach(item=>{
                    if(item.prop == "gear"){
                      if(item.date){
                       binaryGearStr = (+item.date).toString(2)
                       binaryGearStr =  binaryGearStr.padStart(4,'0')
                       let binaryGear = binaryGearStr.substring(binaryGearStr.length - 4)
                      this.gearList.forEach(ele=>{
                        if(ele.value == binaryGear){
                          item.date = ele.label
                        }
                      })
                    }
                  }
              if(item.prop == "brakeage"){
                 if(binaryGearStr.length == 5){
                   let str =  binaryGearStr.charAt(0) == '0' ? '无制动力' :binaryGearStr.charAt(0) == '1' ? '有制动力' : '-'
                    item.date = str
                  }
                  if(binaryGearStr.length == 6){
                   let str =  binaryGearStr.charAt(1) == '0' ? '无制动力' :binaryGearStr.charAt(1) == '1' ? '有制动力' : '-'
                    item.date = str
                  }
                }
              if(item.prop == "drive"){
                 if(binaryGearStr.length == 6){
                   let str =  binaryGearStr.charAt(0) == '0' ? '无驱动力' :binaryGearStr.charAt(0) == '1' ? '有驱动力' : '-'
                    item.date = str
                  }
                }

              })
              this.didi[1].dataList.forEach((item1) => {
                // console.log(item1, "1");
                if(this.list[2].motorUnitList){
                if (
                  item1.prop == "status" ||
                  item1.prop == "controllerTemperature" ||
                  item1.prop == "engineSpeed" ||
                  item1.prop == "torque" ||
                  item1.prop == "temperature" ||
                  item1.prop == "inputVoltage" ||
                  item1.prop == "current" ||
                  item1.prop == "serial"
                ) {   
                  item1.date = this.list[2].motorUnitList.map((i) =>
                    this.getdata(item1, i[item1.prop])
                      ? this.getdata(item1, i[item1.prop])
                      : i[item1.prop]
                  );
               
                if (item1.prop == "current") {
                  item1.date = this.list[2].motorUnitList.map(
                    (i) => i[item1.prop]
                  );
                }
                }
                }
              });
              this.didi[7].dataList.forEach((item1) => {
                if (
                  item1.prop == "systemNumber" ||
                  item1.prop == "voltage" ||
                  item1.prop == "electricity" ||
                  item1.prop == "batteryTotoalCount" ||
                  item1.prop == "startingFrameNumber" ||
                  item1.prop == "batteryCount"
                ) {
                  item1.date = this.list[8].batterVoltages.map(
                    (i) => i[item1.prop]
                  );
                }
                if (item1.prop == "batteryVoltages") {
                  item1.date = this.list[8].batterVoltages.map((i) => {
                    //循环数字，每一项都补足
                    // for (let index = 0; index < i[item1.prop].length; index++) {
                    //   //给每一项补足三位小数
                    //   i[item1.prop][index] = i[item1.prop][index].toFixed(3);
                    // }
                    return i[item1.prop].join(",");
                  });
                }
              });

              this.didi[8].dataList.forEach((item1) => {
                if (
                  item1.prop == "systemNumber" ||
                  item1.prop == "temperatureCount"
                ) {
                  item1.date = this.list[9].batteryTemperatures.map(
                    (i) => i[item1.prop]
                  );
                }
                if (item1.prop == "temperatures") {
                  item1.date = this.list[9].batteryTemperatures.map((i) =>
                    i[item1.prop].join(",")
                  );
                }
              });
            }
            this.didi[6].dataList[1].date = this.commonData(
              this.didi[6].dataList[1].date
            );

            console.log(this.didi[6].dataList[1], "this.didi");
            this.total = data.total;
            this.total = data.total;
            //定时器10秒刷新一次
            this.timer = setTimeout(() => {
              this.handleFilter();
              //关闭定时器
            }, 10000);
            this.tableRow = {};
          } else {
            this.isShow = false;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getdata(data, key) {
      switch (data.prop) {
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
      if (key == null) {
        return "";
      }
      if (key == 0) {
        return "0";
      }
      return key;
    },
  },
};
</script>

<style lang="scss" scoped>
.max-height {
  overflow-y: scroll;
  height: calc(100vh - 422px);
}
.NumberProcessing {
  color: red;
  font-size: 16px;
}
.NumberProcessing1 {
  color: black;
  font-size: 16px;
}
.down {
  transform: rotate(-90deg);
  display: inline-block;
}
.el-collapse-item__arrow {
  transition: transform 0.3s;
}
.right1 {
  transform: rotate(0deg);
  display: inline-block;
}

.ListCss {
  height: 35px;
  line-height: 35px;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  border-collapse: 0;
  overflow: hidden;
  /* border: 1px solid #e8e8e8; */
}
.ListCssTowRight {
  width: 160px;
  text-align: right;
  font-weight: 400;
  color: #262834!important;
}
.ListCssTowlift {
  width: calc(100% - 160px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.ListCssTowRight1 {
  // width: 21.45%;
  width:160px;
  text-align: right;
}
.ListCssTowlift1 {
  /* width: 35%; */
  text-overflow: ellipsis;
}
.heightll {
  overflow-y: hidden;
}
.Listtop {
  padding: 0 20px;
  color: #606266;
}

.baise {
  background-color: #f0f4f9 !important;
}
.isdataSpan {
  font-weight: 600;
  width: 60px;
  text-align: right;
  display: inline-block;
}
.ListCss11 {
  display: flex;
  align-items: center;
}
.onedock {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.dfc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.carStatusData1 {
  height: calc(100vh - 310px);
}
	.fontTitle {
		height: 40px;
		line-height: 40px;
    font-family: Microsoft YaHei;
    font-weight: 700;
    color: #262834!important;
	}
    	//实时数据
	.tableBotton {
		background-color: #fff;
		border-radius: 4px;
		margin-bottom: 10px;
		overflow: hidden;
		padding-bottom: 10px;
		box-shadow: 0px 4px 14px 0px rgba(101, 107, 119, 0.1);
		
	}
	.Listcolor1 {
		background-color: #fff;
		
	}
	.Listcolor {
		background-color:  #fff;
		
	}
	.ListCssTow {
		// text-align: right;
		// border: 1px solid rgb(35, 45, 57);
		border-collapse: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		// display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		/* padding: 4px; */
		// border: 1px solid #b9bbbf;
		// @if ($theme-name =='default') {
		//   border:1px solid #48505c;
		// }
	}
</style>
