<template>
  <div class="js-car-manage app-container">
    <!-- 查询 -->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'75px'"
          :listQuery="listQuery"
          :collapse="collapse"
          :searchList="searchList"
        />
        <!-- <el-form :model="listQuery" label-width="65px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="开始时间：" prop="startTime">
                <el-date-picker
                  v-model="listQuery.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间：" prop="endTime">
                <el-date-picker
                  v-model="listQuery.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="'电池包编码：'" label-width="75px">
                <el-input
                  v-model="listQuery.psn"
                  filterable
                  clearable
                  :placeholder="'请输入电池包编码'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="collapse">
              <el-form-item :label="'绑定状态：'">
                <el-select
                  v-model="listQuery.status"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in vehicleModel"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-show="collapse">
            <el-col :span="6">
              <el-form-item :label="'电池用途：'">
                <el-select
                  v-model="listQuery.cyclNumber"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in cellType"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> -->
      </div>
      <!--折叠 过滤 清空 -->
      <app-search-button
        slot="bottom"
        :is-collapse="true"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <!-- 按钮 -->
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-export="handleExport"
        @click-import="handleImport"
        @click-import-select="handleImportCar"
        @click-exportData="lookExportTask"
        @click-exportQuery="lookImportTask"
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
        @row-click="rowClick"
        @click-delete="handleDelete"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="
              scope.item.prop === 'msnCount' || scope.item.prop === 'csnCount'
            "
          >
            <span :class="scope.row[scope.item.prop] == 0 ? '' : 'vinNo'">
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
                  : '-'
              "
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row[scope.item.prop] | processData }}
            </el-tag>
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!--导入-->
    <import-dialog
      ref="importDialog"
      action="api/battery/psn/import"
      :template-url="
        'api/battery/fileStatics/ImportBatteryPackInformationBatch.xlsx'
      "
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'产品型号'"
        :keys="'faultcode'"
        :message="'无导入失败信息'"
        @close="resultClose"
        :is-show="true"
      />
    </import-dialog>
    <!--导入或导出任务dialog弹窗-->
    <look-export-import-drawer
      :visibles.sync="exportImportTaskVisible"
      :is-export="isExport"
      :category="'psn'"
    >
    </look-export-import-drawer>
    <!--查看电池信息-->
    <lookcell-drawer :visibles.sync="lookVisible2" :data="lookvin" />
    <lookcell-drawer :visibles.sync="lookVisible3" :data="lookvin" />
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/psn/importPsnCode'"
      :title="'导入查询'"
      :template-url="
        'api/battery/fileStatics/BatteryPackInformationImportQuery.xlsx'
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
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
// 组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import {
  getList,
  exportPsnManager,
  dcbDel,
  exportByPsnCodeList,
} from "@/api/batterySys/packageMes";
import LookExportImportDrawer from "@/components/lookExportImportDrawer";
import lookcellDrawer from "./components/lookcellDrawer";
import { exportCarCheck } from "@/api/batterySys/commont";
export default {
  name: "packageMes",
  components: {
    importDialog,
    resultDialog,
    LookExportImportDrawer,
    lookcellDrawer,
  },
  filters: {},
  watch: {},
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      vehicleModel: [
        { label: "已绑定", value: "1" },
        { label: "未绑定", value: "0" },
      ],
      cellType: [
        { label: "生产", value: "1" },
        { label: "售后", value: "2" },
      ],
      uploadloading: null,
      exportImportTaskVisible: false, //导入或导出任务dialog
      isExport: false,
      listQuery: {
        psn: "",
        status: "",
        cyclNumber: "",
        startTime: "",
        endTime: "",
        timeRange:["",""],
      },
      tableList: [
        {
          value: "电池包编码",
          prop: "psn",
          width: "200px",
          checked: true,
        },
        {
          value: "电池包厂商规格",
          prop: "batPackageName",
          width: "150px",
          checked: true,
        },
        {
          value: "所含电池模块数量",
          prop: "msnCount",
          width: "140px",
          checked: true,
        },
        {
          value: "所含电池单体数量",
          prop: "csnCount",
          width: "120px",
          checked: true,
        },
        {
          value: "绑定状态",
          prop: "status",
          width: "100px",
          checked: true,
        },
        {
          value: "电池用途",
          prop: "cyclNumber",
          width: "100px",
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
      resultVisible: false,
      lookVisible2: false,
      lookVisible3: false,
      importResult: {},
      lookvin: {},
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "电池包编码",
          value: "psn",
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
        {
          label: "电池用途",
          value: "cyclNumber",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.cellType, //下拉数组
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
  created() {},
  mounted() {},
  methods: {
    //查看导入任务按钮
    lookImportTask() {
      this.isExport = false;
      this.exportImportTaskVisible = true;
    },
    lookExportTask() {
      this.isExport = true;
      this.exportImportTaskVisible = true;
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
    // 点击列
    rowClick({ row, column }) {
      const label = column.label;
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.oid === row.oid) {
          row.$index = index;
        }
      });
      this.tableRow = row;
      this.lookvin.psn = row.psn;
      if (label === "所含电池模块数量" && row.msnCount != 0) {
        this.lookVisible2 = true;
        this.lookvin.cells = "dcmk";
      }
      if (label === "所含电池单体数量" && row.csnCount != 0) {
        this.lookVisible3 = true;
        this.lookvin.cells = "dcdt";
      }
    },

    //导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportPsnManager(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "新增导出任务成功",
            duration: 2 * 1000,
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        id: row.oid,
      };
      this.$confirm(`是否删除${row.psn}电池包编码?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dcbDel(deleteData).then(({ data }) => {
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
    // 导入
    handleImport() {
      this.importVisible = true;
    },
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
          exportByPsnCodeList(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },

    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "电池包信息",
        key: "电池包编码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss"></style>
