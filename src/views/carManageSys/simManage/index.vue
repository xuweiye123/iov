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
        @click-add="handleAdd"
        @click-export="handleExport"
        @click-exportData="handExportData"
        @click-import="handleImport"
        @click-flowImport="handleFlowImport"
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
        @click-look="handleLook"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="
              scope.item.prop === 'carrierType'
            "
          >
            {{ scope.row[scope.item.prop]==1?'移动'
               :scope.row[scope.item.prop]==2?'联通':'-' }}
          </span>
          <!-- <span
            v-else-if="
              scope.item.prop === 'loginName'
            "
          >
            {{ scope.row['email']?scope.row['email'].split('@')[0]:'-' }}
          </span> -->
          <span v-else-if="scope.item.prop === 'dataSource'">
            {{ scope.row[scope.item.prop] == 0 ? "平台录入" :scope.row[scope.item.prop] == 1 ? "接口同步":'-' }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
    </div>

    <!-- 新增编辑dialog弹窗 -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />

    <!-- 查看导出记录 -->
    <export-data-drawer
      :visibles.sync="exportDataVisible"
      :file-type="fileType"
    />

    <!-- 导入dialog弹窗 -->
    <import-dialog
      :title="importDataConifg.title"
      :action="importDataConifg.importUrl"
      :template-url="importDataConifg.importTmp"
      :maxNumber="importDataConifg.maxNumber"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
      :importType="importType"
      :isData="isData"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="importDataConifg.text"
        :keys="importDataConifg.keys"
        :is-show="importDataConifg.show"
        @export-fail="exportFail"
      >
      </result-dialog>
    </import-dialog>
    <!-- 查看 -->
    <detail-drawer
      :data="tableRow"
      :visibles.sync="detailVisible"
      @detail-complete="listLoad"
    />
    <!-- 流量导入详情 -->
    <export-query-drawer 
     :visibles.sync="exportQueryVisible"
     :task-type="taskType"
     />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { getTodayTime0, getTodayEndTime,beginTimeAndEndTime } from "@/utils/base";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";
import exportDataDrawer from "@/components/carManageSys/exportDataDrawer";
import exportQueryDrawer from "./components/exportQueryDrawer";
import detailDrawer from './components/detailDrawer'

// request
import { getSim, deleteSim, exportSim, exportCheckSim } from "@/api/carManageSys/simManage";

// 辅助函数
export default {
  name: "simManage",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
    exportDataDrawer,
    detailDrawer,
    exportQueryDrawer
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        simNumber: "",
        iccid: "",
        // startTime:getTodayTime0(),
        // endTime: getTodayEndTime(),
        timeRange:["",""],
        carrierType: "",
      },
      carrierTypeList: [
        { label: "移动", value: 1 },
        { label: "联通", value: 2 },
      ],
      sourceBaseList:[
        { label: "平台录入", value: 0 },
        { label: "接口同步", value: 1 },
      ],
      fileType:null,
      addUpdateVisible: false /* 查看导出记录*/,
      detailVisible:false,
      importVisible: false,
      resultVisible: false,
      importDataConifg:{},
      importResult: {},
      isEdit: false,
      exportDataVisible: false,
      exportQueryVisible: false,
      taskType: null,
      isData:false,
      importType:0,
      // 字段管理所需字段
      tableList: [
        {
          value: "手机号码",
          prop: "simNumber",
          width: 160,
          checked: true,
        },
        {
          value: "ICCID",
          prop: "iccid",
          width: 160,
          checked: true,
        },
        {
          value: "运营商",
          prop: "carrierType",
          width: 90,
          checked: true,
        },
        {
          value: "数据来源",
          prop: "dataSource",
          width: 100,
          checked: true,
        },
        {
          value: "公网剩余数据流量",
          prop: "publicNetworkRemainderTraffic",
          width: 120,
          checked: true,
        },
        {
          value: "公网数据流量",
          prop: "publicNetworkTraffic",
          width: 120,
          checked: true,
        },
        {
          value: "公网用量限额",
          prop: "publicNetworkTrafficLimit",
          width: 120,
          checked: true,
        },
        {
          value: "私网数据流量",
          prop: "privateNetworkTraffic",
          width: 120,
          checked: true,
        },
        {
          value: "流量更新时间",
          prop: "trafficUpdateTime",
          width: 140,
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
          width: 150,
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width: 120,
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
          label: "手机号码",
          value: "simNumber",
          type: "input",
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
        {
          label: "ICCID",
          value: "iccid",
          type: "input",
        },
        {
          label: "运营商",
          value: "carrierType",
          type: 'select',
          options: {
            data: this.carrierTypeList,
          },
        },
        {
          label: "数据来源",
          value: "dataSource",
          type: 'select',
          options: {
            data: this.sourceBaseList,
          },
        },
      ];
    }, 
  },
  mounted() {
  },
  methods: {
    // handleClear() {
    //   this.listQuery = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     simNumber: "",
    //     iccid: "",
    //     // startTime: getTodayTime0(),
    //     // endTime: getTodayEndTime(),
    //     timeRange:[getTodayTime0(),getTodayEndTime()],
    //     carrierType: "",
    //   };
    //     this.listLoad();
    // },
    // 导入
    handleImport() {
      this.importVisible = true;
      this.importDataConifg.importUrl = "api/vehicle/sim/importSim";
      this.importDataConifg.importTmp =
        "api/vehicle/fileStatics/ImportSimCard.xlsx";
      this.importDataConifg.text = "SIM卡";
      this.importDataConifg.keys = "sim";
      this.importDataConifg.title = "导入";
      this.importDataConifg.maxNumber = 1000;
      this.importDataConifg.show = true;
    },
    // 流量导入
    handleFlowImport(){
      this.importType = 1
      this.importVisible = true;
      this.isData=true;
      this.importDataConifg.importUrl = "api/vehicle/sim/importTrafficQuery";
      this.importDataConifg.importTmp =
        "api/vehicle/fileStatics/ImportTrafficQuery.xlsx";
      this.importDataConifg.text = "SIM卡";
      this.importDataConifg.keys = "sim";
      this.importDataConifg.title = "流量导入查询";
      this.importDataConifg.maxNumber = 5000;
      this.importDataConifg.show = true;
    },
    // 流量导入任务详情
    handExportQuery() {
      this.exportQueryVisible = true;
      this.taskType = 4;
    },
    // 导入成功之后刷新list
    reloadList(data) {
      if (this.importType == 1) {
        // this.importResult = data;
        this.importVisible = false;
        // this.$alert("导入成功" + data.successList.length + "辆", "提示", {
        //   confirmButtonText: "下载",
        // })
        // .then(() => {
        //   downloadExcel().then(({ data }) => {
        //     if (data.code === 0) {
        //       //
        //     }
        //   });
        // })
        // .catch(() => {});
      } else {
        if (data.failedList&&data.failedList.length > 0) {
          this.importResult = data;
          this.resultVisible = true; 
        } else {
          this.resultVisible = false;
          this.importVisible = false;
        }
        this.listLoad();
      }
    },
    // 导出失败信息
    exportFail(data) {
      if(this.importDataConifg.importUrl == "api/vehicle/sim/importSim"){
        exportCheckSim(data);
      }else{

      }
      
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
      this.list = [];
      this.listLoading = true;
      getSim(this.listQuery)
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
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },
    handleLook(row){
    this.tableRow = row;
     this.detailVisible =true
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
      this.$message.success({
        message: "编辑成功",
        duration: 2 * 1000,
      });
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        simId: row.simId,
        simNumber: row.simNumber,
      };
      this.$confirm(`是否删除${row.simNumber}卡号？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSim(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    //导出记录
    handExportData() {
      this.exportDataVisible = true;
      this.fileType = 2;
    },
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportSim(this.listQuery).then(({ data }) => {
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
  },
};
</script>

<style lang="scss" scoped></style>
