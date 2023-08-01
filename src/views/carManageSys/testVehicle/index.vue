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
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-export="handleExport"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>
      <!-- table -->
      <app-table
        slot="table"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :isShowOperation="true"
        :buttonList="insideList"
        @click-vehicleCar="handleVehicleCar"
        @click-switchCar="handleSwitchCar"
        @click-terminalReplace="handleTerminalReplace"
        @click-operUnBind="handleOperUnBind"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'isBindTerminal'">
            <svg-icon :icon-class="scope.row[scope.item.prop] ==1?'isBind':scope.row[scope.item.prop] ==0?'noBind':''" />&nbsp;
            {{
              scope.row[scope.item.prop] | switchText(scope.item.prop)
            }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
          <!-- 数据源：试验车(包括车辆状态为报废的试验车) 、商品车 (仅车辆状态为折价处理的商品车) -->
          <div style="text-align: left !important">
            <a
              v-for="(l,index) in insideList"
              :key="index"
            >
            <!-- 试验车-逻辑(报废状态、折价处理状态车不支持所有功能) -->
            <!-- 只有不是报废和折价处理状态的试验车才显示按钮 -->
            <span v-if="scope.row['vehicleType']=='商品车' || (scope.row['vehicleType']=='试验车' && scope.row['carStatus']!='报废' && scope.row['carStatus']!='折价处理')"> 
              <el-tooltip
                class="item" 
                effect="dark"
                :content="l.functionName"
                :disabled="$store.state.app.isDisTooltip"
                placement="top">
                <!-- 已绑定状态的车才能解绑 -->
                <span
                  class="card-action"
                  v-if="l.url === 'operUnBind' && scope.row['isBindTerminal'] == 1"
                  @click="handleOperUnBind(scope.row)"
                >
                  <i :class="'iconfont icon-' + l.icon"></i>
                </span>
                <!-- 除了报废和折价的试验车都能换绑 -->
                <span
                  class="card-action"
                  v-else-if="l.url === 'terminalReplace'"
                  @click="handleTerminalReplace(scope.row)"
                >
                  <i :class="'iconfont icon-' + l.icon"></i>
                </span>
                <!-- 非报废状态的车才能报废 -->
                <span
                  class="card-action"
                  v-else-if="l.url === 'vehicleCar' && scope.row['vehicleType'] &&  scope.row['carStatus'].toString().indexOf('报废') ==-1 "
                  @click="handleVehicleCar(scope.row)"
                >
                  <i :class="'iconfont icon-' + l.icon"></i>
                </span>
                <!-- 不是商品车的才能转换为商品车 -->
                <span
                  class="card-action"
                  v-else-if="l.url === 'switchCar' && scope.row['vehicleType'] &&  scope.row['vehicleType'].toString().indexOf('商品车') ==-1"
                  @click="handleSwitchCar(scope.row)"
                >
                  <i :class="'iconfont icon-' + l.icon"></i>
                </span>
                <!-- <span v-if="l.url=='operUnBind' && scope.row.isBindTerminal == 0"></span>
                <span v-else class="card-action" @click="authouizeButtonAction(scope.row, l)">
                  <i :class="'iconfont icon-'+l.icon"></i>
                </span> -->
              </el-tooltip>
            </span>
            </a>
          </div>
        </template>
      </app-table>
    </div>
    <!-- 终端更换 -->
    <terminal-replace-drawer
      :visibles.sync="terminalReplaceVisibles"
      :data="tableRow"
      @terminal-replace-complete="reloadList"
    />

    <!-- 解除绑定dialog弹窗 -->
    <un-bind-drawer
      :visibles.sync="unBindVisible"
      :data="tableRow"
      @unbind-complete="reloadList"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";

// utils
// import { beginTimeAndEndTime } from "@/utils/base";

// 组件
import unBindDrawer from "./components/unBindDrawer";
import terminalReplaceDrawer from "@/views/carManageSys/carInform/components/terminalReplaceDrawer";

import {
  getVehiclecarList,
  deleteBind,
  changeVehiclecar,
  exportVehicleCar,
} from "@/api/carManageSys/testVehicle";
import { getBatchAll } from "@/api/carManageSys/commont";
import { getProductInfo } from "@/api/carManageSys/carInform";

// 辅助函数
export default {
  name: "testVehicle",
  CH_name:"试验车处理",
  components: { unBindDrawer, terminalReplaceDrawer },
  filters: {
    switchText(val, type) {
      if (type === "isBindTerminal") {
        return val === 0 ? "未绑定" : val === 1 ? "已绑定" : "-";
      }
    },
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton,getDropList],
  data() {
    return {
      listQuery: {
        vinNo: "",
        startTime: "",
        endTime: "", 
        timeRange:["",""],
      }, 
      batchList: [],
      productList: [],
      isBindTerminalList: [
        { label: "未绑定", value: 0 },
        { label: "已绑定", value: 1 },
      ],
      vehicleTypeList: [
      ],
      carStatusList: [
      ],
       // 下拉
      dropList:[
        { postData:{dicCode:1002},key:'vehicleTypeList' },
        { postData:{dicCode:1013},key:'carStatusList' }
      ],
      unBindVisible: false,
      terminalReplaceVisibles: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "车型名称",
          prop: "carTypeName",
          width: 100,
          checked: true,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          width: 100,
          checked: true,
        },
        {
          value: "车辆类型",
          prop: "vehicleType",
          width: 100,
          checked: true,
        },
        {
          value: "车辆状态",
          prop: "carStatus",
          width: 100,
          checked: true,
        },
        {
          value: "绑定状态",
          prop: "isBindTerminal",
          checked: true,
          width: 100,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          width: 100,
          checked: true,
        },
        {
          value: "产品型号",
          prop: "productTypeNumber",
          width: 140,
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: 120,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
      ],
    };
  },
  watch: {},
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          type: "vin",
        },
        {
          label: "项目代号",
          value: "carBatchId",
          type: 'select',
          options: {
            data: this.batchList,
            extraProps: { 
              label: "carBatchCode",
              value: "carBatchId",
            }, 
          },
        },
        {
          label: "车辆类型",
          value: "vehicleTypeId",
          type: 'select',
          options: {
            data: this.vehicleTypeList,
          },
        },
        {
          label: "车辆状态",
          value: "carStatusId",
          type: 'select',
          options: {
            data: this.carStatusList,
          },
        },
        {
          label: "绑定状态",
          value: "isBindTerminal",
          type: 'select',
          options: {
            data: this.isBindTerminalList,
          },
        },
        {
          label: "产品型号",
          value: "productTypeId",
          type: 'select',
          options: {
            data: this.productList,
            extraProps: { 
              label: "productTypeNumber",
              value: "productTypeId",
            }, 
          },
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
      ];
    },
    isSpecialButton() {
      return this.insideList.filter(
        (item) => item.url == "operUnBind"
      );
    },
  },
  mounted() {
    this.carBatchListHandle();
    this._getProductInfo();
    // 数据字典下拉
    this.getDropList(this.dropList)
  },
  methods: {
    // 项目代号
    carBatchListHandle() {
      getBatchAll().then(({ data }) => {
        if (data.code === 0) {
          this.batchList = data.data || [];
        }
      });
    },
    // 产品型号
    _getProductInfo() {
      getProductInfo().then(({ data }) => {
        if (data.code === 0) {
          this.productList = data.data || [];
        }
      });
    },

    // 点击列
    rowClick({ row }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
    },
    // 判断是否选中
    tableRowIsSlect() {
      const { $index } = this.tableRow;
      if ($index === undefined) {
        return false;
      } else {
        return true;
      }
    },
    // 加载数据
    listLoad() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.list =[]
      this.listLoading = true;
      getVehiclecarList(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            if (
              this.list.every((item) => {
                return item.vehicleType =='试验车'&&(item.carStatus=='报废'||item.carStatus=='折价处理');
              })
            ) {
              this.actionWidth = 0;
            } else if(this.list.every((item) => {
                // return item.vehicleType =='试验车' && item.carStatus!='报废' && item.carStatus!='折价处理' && item.isBindTerminal ==0;
                return  item.isBindTerminal ==0;
              })) {
               this.actionWidth = this.operateWidth(
                this.insideList.length - this.isSpecialButton.length
              );
            }else{
              this.actionWidth = this.operateWidth(this.insideList.length);
            }
            this.total = data.total;
            this.tableRow = {};
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //操作列方法
    authouizeButtonAction(row, item) {
			switch (item.url) {
				case "vehicleCar":
					this.handleVehicleCar(row);
          break;
        case "switchCar":
					this.handleSwitchCar(row);
					break;
        case "terminalReplace":
					this.handleTerminalReplace(row);
					break;
        case "operUnBind":
					this.handleOperUnBind(row);
					break;
				default:
					break;
			}
		},
    handleVehicleCar(row) {
      this.tableRow=row
      const deleteData = {
        carTerminalId: row.carTerminalId,
        carId: row.carId,
        vinNo: row.vinNo,
      };
      this.$confirm(`是否报废${row.vinNo}车辆?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteBind(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "报废成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    handleSwitchCar(row) {
      this.tableRow=row
      const postData = {
        carId: row.carId,
        vinNo: row.vinNo,
      };

      this.$confirm(`是将${row.vinNo}车辆转换为商品车?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          changeVehiclecar(postData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "转换成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    //终端换绑
    handleTerminalReplace(row) {
      this.tableRow=row
      if (row.isBindTerminal === 0) {
        this.terminalReplaceVisibles = true;
      } else {
        this.$confirm("当前车辆已绑定，是否需要修改绑定?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.terminalReplaceVisibles = true;
          })
          .catch(() => {});
      }
    },
    //解除绑定
    handleOperUnBind(row) {
      this.tableRow=row
      if (row.isBindTerminal == 1) {
        this.$confirm(`当前车辆已绑定，确定要解除绑定吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.unBindVisible = true;
          })
          .catch(() => {});
      }
    },
    // 刷新list
    reloadList() {
      this.listLoad();
    },
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportVehicleCar(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功",
            duration: 2 * 1000,
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
