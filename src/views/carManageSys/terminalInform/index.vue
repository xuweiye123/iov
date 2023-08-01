<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'65px'"
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
      >
      <!--    @click-bind-sim="bindSim" @click-bind-terminal-sim="bindTerminalSim"-->
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>
      <!-- table -->
      <!--  @click-lookHistory="handleLookHistory" -->
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
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isBind'">
            <svg-icon :icon-class="scope.row[scope.item.prop] ==1?'isBind':scope.row[scope.item.prop] ==0?'noBind':''" />&nbsp;
            {{ scope.row[scope.item.prop] ==0?"未绑定":scope.row[scope.item.prop] ==1?"已绑定":'-' }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit?tableRow:{}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
    <!-- 查看历史记录 -->
    <!-- ref="historyDialog" -->
    <!-- <history-dialog
      :data="tableRow"
      :visibles.sync="historyVisible"
    /> -->
    <!-- 查看导出记录 -->
    <export-data-drawer
      :visibles.sync="exportDataVisible"
      :file-type="fileType"
    />
    <!-- 批量导入 -->
     <!-- 批量导入 -->
    <import-dialog
      :title="'TBOX导入'"
      :action="'api/vehicle/terminal/importSimToTerminal'"
      :template-url="'api/vehicle/fileStatics/ImportNewEnergyTbox.xlsx'"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'TBOXSN'"
        :keys="'tboxSn'"
        :message="'无导入失败信息'"
        :is-show="true"
        @export-fail="exportFail"
      >
      </result-dialog>
    </import-dialog>
    <!-- <import-dialog
      :radioObject="radioObject"
      :action="importDataConifg.importUrl"
      :action1="importDataConifg.importUrl1"
      :template-url="importDataConifg.importTmp"
      :template-url1="importDataConifg.importTmp1"
      :visibles.sync="importVisible"
      :isShowName="true"
      @upload-success="reloadList"
      @upload-complete="uploadComplete"
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
    </import-dialog> -->
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
import exportDataDrawer from '@/components/carManageSys/exportDataDrawer'
import historyDialog from './components/lookHistory'
import importDialog from '@/components/carManageSys/importDialog'
import resultDialog from '@/components/carManageSys/resultDialog'
import {
  getTerminalList,
  deleteTerminalCode,
  exportTerminal,
  exportCheckTerminal,
} from "@/api/carManageSys/terminalInform";


// 辅助函数
export default {
  name: "terminalInform",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
    historyDialog,
    exportDataDrawer
  },
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        terminalCode: "",
        barCode: "",
        // terminalType: null,
        iccid: "",
        timeRange:["",""],
        // startTime:getTodayTime0(),
        // endTime:getTodayEndTime(),
      },
      // terminalTypeList:[
      //   { label:'INTEST',value:1 },
      //   { label:'北斗',value:2 },
      // ],
      importVisible: false,
      resultVisible:false,
      importQueryVisible:false,
      addUpdateVisible: false /* 添加/编辑、 */,
      // historyVisible: false /* 查看历史数据*/,
      exportDataVisible: false /* 查看导出记录*/,
      isEdit: false, //是否编辑
      type:null,
      radioObject:{},
      importResult: {},
      authouizeList: [],
      importDataConifg: {},
      fileType:null,
      // 字段管理所需字段
      tableList: [
        {
          value: "TBOXSN",
          prop: "barCode",
          width: "160",
          checked: true,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          width: "90",
          checked: true,
        },
        {
          value: "ICCID1",
          prop: "iccidOne",
          width: "160",
          checked: true,
        },
        {
          value: "ICCID2",
          prop: "iccidTwo",
          width: "160",
          checked: true,
        },
        // {
        //   value: "TBOX供应商",
        //   prop: "terminalType",
        //   width: "100",
        //   checked: true,
        // },
        {
          value: "绑定状态",
          prop: "isBind",
          width: "160",
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: "100",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "140",
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          checked: true,
          width: "140",
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
          label: "TBOXSN",
          value: "barCode",
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
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        }, 
        {
          label: "ICCID",
          value: "iccid",
          type: "input",
        },
        // {
        //   label: "TBOX供应商",
        //   value: "terminalType",
        //   type: 'select',
        //   options: {
        //     data: this.terminalTypeList,
        //   },
        // },
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
    //     terminalCode: "",
    //     barCode: "",
    //     // terminalType: null,
    //     iccid: "",
    //     timeRange:[getTodayTime0(),getTodayEndTime()]
    //     // startTime:getTodayTime0(),
    //     // endTime:getTodayEndTime(),
    //   };
    //   this.listLoad();
    // },
    // 点击列
    rowClick({row}) {
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
      this.listLoading = true;
      getTerminalList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
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
    // 导入成功之后刷新list
    reloadList(data) {
      if (data.failedList&&data.failedList.length > 0) {
        this.importResult = data;
        this.resultVisible = true; 
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
      this.listLoad();
    },
    // 导出失败信息
    exportFail(data) {
      exportCheckTerminal(data);
    },
    // 文件上传
    // uploadComplete(val){
    //   console.log(val,"val")
    //  this.type=val
    //  this.importDataConifg.text=this.type==1?"TBOXSN":"TBOXSN";
    //  this.importDataConifg.keys=this.type==1?"tboxSn":"tboxSn";
    //  this.importDataConifg.show = true;
    // },
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
    // 编辑
    handleUpdate(row) {
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.tableRow=row
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
        terminalId: row.terminalId,
        barCode: row.barCode,
      };
      this.$confirm(`是否删除TBOXSN${row.barCode}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTerminalCode(deleteData).then(({ data }) => {
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
      this.fileType=3
    },
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportTerminal(this.listQuery).then(({ data }) => {
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
    // 导入
    handleImport() {
      this.importVisible = true;
      // this.importDataConifg.importUrl = "api/vehicle/terminal/importSimToTerminal";
      // this.importDataConifg.importUrl1 = "api/vehicle/terminal/importTbox";
      // this.importDataConifg.importTmp =
      //   "api/vehicle/fileStatics/ImportNewEnergyTbox.xlsx";
      // this.importDataConifg.importTmp1 =
      //   "api/vehicle/fileStatics/ImportTbox.xlsx";
      // this.radioObject={
      //   label:"TBOX供应商：",
      //   value1:"INTEST",
      //   value2:"北斗",
      // }

      // this.importDataConifg.text="终端编号";
      // this.importDataConifg.show = true;
    },
    // 绑定Sim
    // bindSim() {
    //   this.importVisible = true;
    //   this.importDataConifg.importUrl = "api/vehicle/terminal/importBindSim";
    //   this.importDataConifg.importTmp =
    //     "file/upload/template/SIM批量绑定模版.xlsx";
    //   this.importDataConifg.text = "TBOXSN";
    //   this.importDataConifg.show = false;
    // },
    // 绑定终端&sim
    // bindTerminalSim() {
    //   this.importVisible = true;
    //   this.importDataConifg.importUrl = "api/vehicle/terminal/importSimToTerminal";
    //   this.importDataConifg.importTmp =
    //     "file/upload/template/TerminalCode.xlsx";
    //   this.importDataConifg.text = "终端编号";
    //   this.importDataConifg.show = false;
    // },
    // 查看历史记录
    // handleLookHistory(row) {
    //   this.tableRow=row
    //   this.historyVisible = true;
    //   // this.$refs.historyDialog.listQuery.terminalid = row.terminalid;
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
