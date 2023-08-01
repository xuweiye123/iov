<template>
  <div class="js-basedata-cargroup app-container">
    <!--查询-->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'85px'"
          :listQuery="listQuery"
          :collapse="collapse"
          :searchList="searchList"
        />
      </div>
      <!--折叠 过滤 清空 -->
      <app-search-button
        slot="bottom"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
        :isdisabled="listLoading"
      />
    </app-search>
    <!-- 按钮 -->
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-delete="handleDelete"
        @click-export="handleExport"
        @click-import="importVisible = true"
        @click-import-select="handleImportCar"
        @click-exportData="lookExportTask"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>

      <app-table
        slot="table"
        ref="table"
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
        @click-delete="handleDelete"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'csnCount'">
            <span
              v-if="scope.row[scope.item.prop]"
              :class="scope.row[scope.item.prop] === 0 ? '' : 'vinNo'"
              @click="lookDetail(scope.row)"
            >
              {{ scope.row[scope.item.prop] | processData }}
            </span>
            <span v-else>
              {{ scope.row[scope.item.prop] | processData }}
            </span>
          </span>
          <span v-else-if="scope.item.prop == 'status'">
            <el-tag
              :type="
                scope.row.status == '已绑定'
                  ? 'success'
                  : scope.row.status == '未绑定'
                  ? 'info'
                  : ''
              "
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row[scope.item.prop] | processData }}
            </el-tag>
          </span>
          <div v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </div>
        </template>
      </app-table>
      <look-detail-drawer
        :visibles.sync="lookVisible"
        :data1="lookData"
      ></look-detail-drawer>
      <!--导入或导出任务dialog弹窗-->
      <look-export-import-drawer
        :visibles.sync="exportImportTaskVisible"
        :is-export="isExport"
        :category="'msn'"
      />
      <!--导入dialog弹窗-->
      <import-dialog
        ref="importDialog"
        action="/api/battery/msn/import"
        :template-url="
          'api/battery/fileStatics/ImportBatteryModuleInformationBatch.xlsx'
        "
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      />
      <!--导入结果dialog弹窗-->
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'电池模块编码'"
        :keys="'msn'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        @close="resultClose"
      />
      <!-- 导入查询 -->
      <import-dialog
        :action="'/api/battery/msn/importMsnCode'"
        :title="'导入查询'"
        :template-url="
          'api/battery/fileStatics/BatteryModuleInformationImportQuery.xlsx'
        "
        :visibles.sync="importCarVisible"
        @upload-success="reloadCarList"
        :auto-upload="false"
      />
      <result-dialog
        :visibles.sync="resultCarVisible"
        :data="importResult"
        :text="'电池包编码'"
        :keys="'vinNo'"
        :message="'无导入失败信息'"
        @export-fail="exportCarFail"
      />
    </div>
  </div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { exportCarCheck } from "@/api/batterySys/commont";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
//引入导入组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import {
  getList,
  exportMsnManager,
  deleteMsnManager,
  exportCheck,
  exportByMsnCodeList,
} from "@/api/batterySys/modulesMes";
import lookDetailDrawer from "./components/lookDetailDrawer";
import lookExportImportDrawer from "@/components/lookExportImportDrawer";
export default {
  name: "modulesMes",
  //声明组件
  components: {
    importDialog,
    resultDialog,
    lookDetailDrawer,
    lookExportImportDrawer,
  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        timeRange:["",""],
      },
      vehicleModel: [
        { label: "已绑定", value: "1" },
        { label: "未绑定", value: "0" },
      ],
      tableList: [
        {
          value: "电池模块编码",
          prop: "msn",
          width: "200px",
          checked: true,
        },
        {
          value: "模块厂商规格",
          prop: "specification",
          width: "100px",
          checked: true,
        },
        {
          value: "所含单体数量",
          prop: "csnCount",
          width: "100px",
          checked: true,
        },
        {
          value: "绑定状态",
          prop: "status",
          width: "95px",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "140px",
          checked: true,
        },
      ],
      importVisible: false, // 导入
      importResult: {},
      resultVisible: false,
      lookVisible: false,
      lookData: "", //行点击查看的绑定数据
      importCarVisible: false,
      resultCarVisible: false,
      exportImportTaskVisible: false,
      isExport: false,
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "电池模块编码",
          value: "msn",
          type: "input",
        },
        {
          label: "绑定状态",
          value: "status",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.vehicleModel, //下拉数组
          },
        },
        // {
        //   label: "电池用途",
        //   value: "cyclNumber",
        //   type: "select",
        //   labelWidth: "65px",
        //   options: {
        //     data: this.cellType, //下拉数组
        //   },
        // },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
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
  mounted() {},
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportMsnManager(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.$message.success({
              message: "新增导出任务成功",
              duration: 2 * 1000,
            });
          }
        })
        .finally(() => {
          this.exportLoading = false;
        })
    },
    // 加载数据
    listLoad() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listLoading = true;
      getList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //查看导出任务按钮
    lookExportTask() {
      this.isExport = true;
      this.exportImportTaskVisible = true;
    },

    // 删除
    handleDelete(row) {
      const deleteData = {
        id: row.oid,
      };
      this.$confirm(`是否删除${row.msn}电池模块编码?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMsnManager(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
              this.listLoad();
            }
          });
        })
        .catch(() => {});
    },
    //点击所含电池单体数量项
    lookDetail(row) {
      this.lookData = row.msn;
      this.lookVisible = true;
    },
    //上传成功的回调
    reloadList(data) {
      this.importResult = data;
      if (data.failedList.length > 0) {
        this.resultVisible = true;
      }else{
        this.importVisible = false
       }
      this.listLoad();
    },
    resultClose() {
      this.$refs.importDialog.closeDialog();
    },
    // 导入查询
    handleImportCar() {
      this.importCarVisible = true;
    },
    reloadCarList(data) {
      this.importResult = data;
      console.log(data);
      if (data.failedList.length > 0) {
        this.resultCarVisible = true;
      }
      this.importCarVisible = false;
      if (data.successList.length == 0) {
        return;
      }
      this.$alert("导入成功" + data.successList.length + "条", "提示", {
        confirmButtonText: "下载",
      })
        .then(() => {
          let codeList = [];
          data.successList.forEach((ele) => {
            codeList.push(ele.vinNo);
          });
          let params = {
            codeList,
          };
          exportByMsnCodeList(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },

    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "电池模块信息",
        key: "电池模块编码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>

<style scoped></style>
