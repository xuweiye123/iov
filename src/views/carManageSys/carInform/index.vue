<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <el-form :model="listQuery" label-width="90px" style="width:100%">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="VIN码：">
                <vin-select :is-vin="true" @vinNoTotal="getVinNoTotal" v-model="listQuery.vinNo" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号码：">
                <el-input
                  v-model="listQuery.licensePlate"
                  filterable
                  clearable
                  placeholder="请输入车牌号码"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="销售状态：">
                <el-select
                  v-model="listQuery.rtmSaleStatus"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in rtmSaleStatusList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="车型名称：">
                <el-select
                  v-model="listQuery.carTypeId"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="carTypeChange"
                  @clear="carTypeClear"
                >
                  <el-option
                    v-for="(item, index) in carTypeList"
                    :key="index"
                    :label="item.carTypeName"
                    :value="item.carTypeId"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" v-show="collapse">
              <el-form-item label="项目代号：">
                <el-select
                  v-model="listQuery.carBatchId"
                  :disabled="carBatchDisabled"
                  filterable
                  clearable
                  placeholder="请先选择车型名称"
                >
                  <el-option
                    v-for="(item, index) in batchList"
                    :key="index"
                    :label="item.carBatchCode"
                    :value="item.carBatchId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="产品型号：">
                <el-select
                  v-model="listQuery.productTypeId"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in productList"
                    :key="index"
                    :label="item.productTypeNumber"
                    :value="item.productTypeId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="数据来源：">
                <el-select
                  v-model="listQuery.dataSource"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in dataSourceList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="整车物料号：">
                <el-input
                  v-model="listQuery.carAlias"
                  filterable
                  clearable
                  placeholder="请输入整车物料号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="车辆类型：">
                <el-select
                  v-model="listQuery.vehicleTypeId"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in vehicleTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="TBOXSN：">
                <el-input
                  v-model="listQuery.barCode"
                  filterable
                  clearable
                  placeholder="请输入TBOXSN"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="动力电池编码：">
                <el-input
                  v-model="listQuery.powerPartNumber"
                  filterable
                  clearable
                  placeholder="请输入动力电池编码"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="驱动电机编码：">
                <el-input
                  v-model="listQuery.driverPartNumber"
                  filterable
                  clearable
                  placeholder="请输入驱动电机编码"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="营运城市：">
                <el-select
                  v-model="listQuery.cityId"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in cityList"
                    :key="index"
                    :label="item.cityName"
                    :value="item.cityId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="collapse">
              <el-form-item label="时间范围：" prop="timeRange">
                <el-date-picker
                  v-model="listQuery.timeRange"
                  type="datetimerange"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  unlink-panels
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6" v-show="collapse">
              <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker
                  v-model="listQuery.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                  default-time="00:00:00"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                  v-model="listQuery.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                  default-time="23:59:59"
                >
                </el-date-picker>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span="6" v-show="collapse">
              <el-form-item label="TBOX供应商：">
                <el-select
                  v-model="listQuery.terminalType"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in terminalTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
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
        @click-add="handleAdd"
        @click-export="handleExport"
        @click-exportData="handExportData"
        @click-import-select="handleImportSelect"
        @click-operImportCars="handleoperImportCars"
        @click-carNumberImport="handleCarNumberImport"
        @click-powerImport="handlePowerImport"
        @click-operImportAreas="handleoperImportAreas"
        @click-exportQuery="handExportQuery"
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
        @click-carBindHistory="handleHistory"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @click-terminalReplace="handleTerminalReplace"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            @click="handleHistory(scope.row)"
            class="vinNo"
            v-if="scope.item.prop === 'vinNo'"
          >
            {{ scope.row[scope.item.prop] | processData }}
          </span>
          <span
            v-else-if="scope.item.prop == 'dataSource'"
          >
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
    <!-- 查看历史记录 -->
    <history-dialog :visibles.sync="lookHistoryVisible" :data="tableRow" :vehicleTypeList="vehicleTypeList" />
    <!-- 查看导出记录 -->
    <export-data-drawer
      :visibles.sync="exportDataVisible"
      :file-type="fileType"
    />
    <export-query-drawer
      :visibles.sync="exportQueryVisible"
      :task-type="taskType"
    />
    <!-- 新能源终端更换 -->
    <terminal-replace-drawer
      :visibles.sync="terminalReplaceVisibles"
      :data="tableRow"
      @terminal-replace-complete="terminalReplaceComplete"
    />
    <!-- 批量导入 -->
    <import-dialog
      :title="importDataConifg.title"
      :action="importDataConifg.importUrl"
      :importName="importDataConifg.importName"
      :template-url="importDataConifg.importTmp"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
      :auto-upload="false"
      :importType="importType"
      :isData="isData"
      :maxNumber="importDataConifg.maxNumber"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'VIN码'"
        :keys="'vinNo'"
        :message="'无导入失败信息'"
        :is-show="importDataConifg.show"
        @export-fail="exportFail"
      >
      </result-dialog>
    </import-dialog>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";

// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import exportDataDrawer from "@/components/carManageSys/exportDataDrawer";
import exportQueryDrawer from "@/components/carManageSys/exportQueryDrawer";
import historyDialog from "./components/lookHistory";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";
import terminalReplaceDrawer from "./components/terminalReplaceDrawer";

import {
  getCarPageList,
  getProductInfo,
  getBatchCodeInfo,
  deleteCar,
  exportCar,
  getContactId,
  exportCheckCar,
} from "@/api/carManageSys/carInform";
import {
  getCarTypeList,
  getyyCityList,
} from "@/api/carManageSys/commont";

// 辅助函数
export default {
  doNotInit: true,
  name: "carInform",
  CH_name: "车辆信息管理",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
    historyDialog,
    exportDataDrawer,
    exportQueryDrawer,
    terminalReplaceDrawer,
  },
  filters: {
    switchText(val, type) {
      if (type === "isBindTerminal") {
        return val == 0 ? "未绑定" : val == 1 ? "已绑定" : "-";
      }  else if (type === "dataSource") {
        return val == "0" ? "平台录入" : val == "1" ? "MES同步" : "-";
      }
    },
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton,getDropList],
  data() {
    return {
      listQuery: {
        timeRange: ["", ""],
      },
      radioObject: {},
      batchList: [],
      productList: [],
      carTypeList: [],
      companyList: [],
      vehicleTypeList: [],
      // rtmSaleStatusList: [
      //   {
      //     label: "销售退货",
      //     value: "XT",
      //   },
      //   {
      //     label: "实销",
      //     value: "XS",
      //   },
      //   {
      //     label: "经销商在库",
      //     value: "DK",
      //   },
      //   {
      //     label: "总部出库",
      //     value: "TC",
      //   },
      //   {
      //     label: "在途",
      //     value: "ZT",
      //   },
      //   {
      //     label: "总部在库",
      //     value: "ZZ",
      //   },
      // ],
      // terminalTypeList: [
      //   { label: "INTEST", value: 1 },
      //   { label: "北斗", value: 2 },
      // ],
      cityList: [],
      dataSourceList: [
        { label: "平台录入", value: 0 },
        { label: "MES同步", value: 1 },
      ], // 数据来源
      // 数据字典下拉
      dropList:[
        { postData:{dicCode:1002},key:'vehicleTypeList' }
      ],
      carBatchDisabled: true,
      importType: 0,
      exportQueryVisible: false,
      importVisible: false,
      resultVisible: false,
      importQueryVisible: false,
      addUpdateVisible: false /* 添加/编辑、 */,
      historyVisible: false /* 查看历史数据*/,
      exportDataVisible: false /* 查看导出记录*/,
      lookHistoryVisible: false,
      terminalReplaceVisibles: false,
      fuelReplaceVisibles: false,
      isEdit: false, //是否编辑
      isData: false,
      importResult: {},
      importDataConifg: {},
      fileType: null,
      taskType: null,
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
          width: 90,
          checked: true,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          width: 150,
          checked: true,
        },
        {
          value: "品牌",
          prop: "brand",
          width: 100,
          checked: true,
        },
        // {
        //   value: "TBOX供应商",
        //   prop: "terminalType",
        //   width: 100,
        //   checked: true,
        // },
        {
          value: "TBOXSN",
          prop: "barCode",
          width: 150,
          checked: true,
        },
        {
          value: "TBOX版本号",
          prop: "firmware",
          width: 120,
          checked: true,
        },
        {
          value: "产品型号",
          prop: "productTypeNumber",
          width: 160,
          checked: true,
        },
        {
          value: "数据来源",
          prop: "dataSource",
          width: 120,
          checked: true,
        },
        {
          value: "整车物料号",
          prop: "carAlias",
          width: 180,
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: 100,
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
  computed: {},
  mounted() {
    getProductInfo().then(({ data }) => {
      if (data.code === 0) {
        this.productList = data.data || [];
      }
    });
    getCarTypeList().then(({ data }) => {
      if (data.code === 0) {
        this.carTypeList = data.data || [];
      }
    });

    getContactId().then(({ data }) => {
      if (data.code === 0) {
        this.companyList = data.data || [];
      }
    });

    //营运城市
    this._getyyCityList();
    // 数据字典下拉
    this.getDropList(this.dropList)
  },
  methods: {
    //营运城市
    _getyyCityList() {
      getyyCityList().then(({ data }) => {
        if (data.code === 0) {
          this.cityList = data.data;
        }
      });
    },
    //导入查询
    handleImportSelect() {
      this.importType = 3;
      this.isData = true;
      this.importDataConifg = {
        importUrl: "api/vehicle/car/importCarQuery",
        importTmp: "api/vehicle/fileStatics/ImportVinBatchQuery.xlsx",
        maxNumber: 5000,
        title: "导入查询",
        show: true,
      };
      this.importVisible = true;
    },
    // 车辆导入
    handleoperImportCars() {
      this.importType = 0;
      this.importVisible = true;
      this.importDataConifg = {
        importUrl: "api/vehicle/car/importCar",
        importTmp: "api/vehicle/fileStatics/ImportVehicles.xlsx",
        title: "车辆导入",
      };
    },
    // 车牌号批量导入
    handleCarNumberImport() {
      this.importType = 0;
      this.importDataConifg = {
        importUrl: "api/vehicle/car/importLicenseplate",
        importTmp: "api/vehicle/fileStatics/ImportUpdateLicensePlate.xlsx",
        title: "车牌号导入",
        maxNumber: 1000,
        show: false,
      };
      this.importVisible = true;
    },
    //车辆区域导入
    handleoperImportAreas() {
      this.importType = 0;
      this.importDataConifg = {
        importUrl: "api/vehicle/car/importCarAreas",
        importTmp: "api/vehicle/fileStatics/ImportVehicleArea.xlsx",
        title: "车辆区域导入",
        maxNumber: 1000,
        show: false,
      };
      this.importVisible = true;
    },
    // 动力电池信息导入
    handlePowerImport() {
      this.importType = 0;
      this.importDataConifg = {
        importUrl: "api/vehicle/car/importBatterys",
        importTmp: "api/vehicle/fileStatics/ImportPowerBattery.xlsx",
        title: "动力电池信息导入",
        maxNumber: 1000,
        show: false,
      };
      this.importVisible = true;
    },
    // 导入成功刷新list
    reloadList(data) {
      if (this.importType == 3) {
        this.importVisible = false;
      } else {
        if (data.failedList && data.failedList.length > 0) {
          this.resultVisible = true;
          this.importResult = data;
        } else {
          this.resultVisible = false;
          this.importVisible = false;
        }
        this.listLoad();
      }
    },

    // 导出失败信息
    exportFail(data) {
      exportCheckCar(data);
    },
    carTypeChange(e) {
      if (!e) {
        return;
      }
      this.$set(this.listQuery, "carBatchId", "");
      this.batchList = [];
      const postData = {
        carTypeId: e,
      };
      this.carBatchDisabled = false;
      getBatchCodeInfo(postData).then(({ data }) => {
        if (data.code === 0) {
          this.batchList = data.data || [];
        }
      });
    },
    // 清空车型名称
    carTypeClear() {
      this.listQuery.carBatchId = "";
      this.batchList = [];
      this.carBatchDisabled = true;
    },
    // 点击列
    rowClick({ row }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.carId === row.carId) {
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
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
      this._getyyCityList();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },

    // 编辑
    handleUpdate(row) {
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.tableRow = row;
    },
    // 编辑成功
    updateComplete() {
      this.listLoad();
      this._getyyCityList();
      this.$message.success({
        message: "编辑成功",
        duration: 2 * 1000,
      });
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        carId: row.carId,
        vinNo: row.vinNo,
      };
      this.$confirm(`是否删除${row.vinNo}车辆?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCar(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this._getyyCityList();
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    terminalReplaceComplete() {
      this.listLoad();
    },
    // 查看绑定历史
    handleHistory(row) {
      this.tableRow = row;
      this.lookHistoryVisible = true;
    },
    // 终端换绑
    handleTerminalReplace(row) {
      this.tableRow = row;
      if (row.isBindTerminal == 0) {
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
    // 导入任务详情
    handExportQuery() {
      this.exportQueryVisible = true;
      this.taskType = 3;
    },
    //导出记录
    handExportData() {
      this.exportDataVisible = true;
      this.fileType = 1;
    },
    // 导出
    handleExport() {
      if (!this.total) {
        this.$message.warning({
          message: "暂无数据，无法导出",
          duration: 2 * 1000,
        });
        return;
      }
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportCar(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "任务创建成功，请在导出记录中查看生成进度",
            duration: 2 * 1000,
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    // 加载数据
    listLoad() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.list = [];
      this.listLoading = true;
      getCarPageList(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
            this.tableRow = {};
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
