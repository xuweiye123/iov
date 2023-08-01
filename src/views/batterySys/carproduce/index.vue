<template>
  <div class="js-system-user app-container">
    <!-- 查询 -->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'90px'"
          :listQuery="listQuery"
          :collapse="collapse"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
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
        @click-export="handleExport"
        @click-import="handleImport"
        @click-look-export-task="lookExportTask"
        @click-import-car="handleImportCar"
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
        @click-unbing="handleUnbing"
        @row-click="rowClick"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="
              scope.item.prop === 'psnCount' ||
              scope.item.prop === 'msnCount' ||
              scope.item.prop === 'csnCount' ||
              scope.item.prop === 'vinNo'
            "
          >
            <span
              :class="scope.row[scope.item.prop] === 0 ? '' : 'vinNo'"
              :style="{
                cursor: scope.row[scope.item.prop] === 0 ? '' : 'pointer',
              }"
            >
              {{ scope.row[scope.item.prop] | processData }}
            </span>
          </span>
          <span v-else-if="scope.item.prop == 'code'">
            <el-tag
              :type="
                scope.row.code == '初始'
                  ? 'info'
                  : scope.row.code == '成功'
                  ? 'success'
                  : scope.row.code == '失败'
                  ? 'danger'
                  : ''
              "
              effect="dark"
              style="width: 65px"
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
    <!--查看电池信息-->
    <lookcell-drawer :visibles.sync="lookVisible1" :data="lookvin" />
    <lookcell-drawer :visibles.sync="lookVisible2" :data="lookvin" />
    <lookcell-drawer :visibles.sync="lookVisible3" :data="lookvin" />
    <!--查看车辆信息-->
    <lookcar-drawer :visibles.sync="lookcarVisible" :data="lookvin" />

    <!--导入-->
    <import-dialog
      ref="importDialog"
      action="api/battery/carproduce/import"
      :template-url="'api/battery/fileStatics/ImportVehicleProductionInformationBatch.xlsx'"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'VIN码'"
        :keys="'faultcode'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        @close="resultClose"
        :is-show="true"
      />
    </import-dialog>
    <!--导入或导出任务dialog弹窗-->
    <look-export-import-drawer
      :visibles.sync="exportImportTaskVisible"
      :is-export="isExport"
      :category="'carproduce'"
    >
    </look-export-import-drawer>
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/carproduce/importVin'"
      :title="'导入查询'"
      :template-url="'api/battery/fileStatics/ImportVINInformation.xlsx'"
      :visibles.sync="importCarVisible"
      @upload-success="reloadCarList"
    />
    <result-dialog
      :visibles.sync="resultCarVisible"
      :data="importResult"
      :text="'VIN码'"
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
import { checkFormRule } from "@/mixins/validateOne";
// 组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import {
  getCarproduceList,
  ubindcar,
  exportCheck
} from "@/api/batterySys/carproduce";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
import lookcellDrawer from "./components/lookcellDrawer";
import lookcarDrawer from "./components/lookcarDrawer";
import lookExportImportDrawer from "@/components/lookExportImportDrawer";
import { exportCarproduce } from "@/api/batterySys/carproduce";
export default {
  name: "carproduce",
  components: {
    importDialog,
    resultDialog,
    lookcellDrawer,
    lookcarDrawer,
    lookExportImportDrawer
  },
  filters: {},
  mixins: [
    pagingMixin,
    partialForm,
    otherHeight,
    tableStyle,
    getPageButton,
    checkFormRule
  ],
  data() {
    return {
      vehicleModel: [
        { label: "初始", value: "2" },
        { label: "成功", value: "0" },
        { label: "失败", value: "1" },
      ],
      exportImportTaskVisible: false, //导入或导出任务dialog
      isExport: false,
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "170px",
          checked: true,
        },
        {
          value: "车辆制造企业",
          prop: "qualifications",
          width: "150px",
          checked: true,
        },
        {
          value: "车辆型号",
          prop: "vehicleModel",
          width: "100px",
          checked: true,
        },
        {
          value: "电池包数",
          prop: "psnCount",
          width: "95px",
          checked: true,
        },
        {
          value: "电池模块数",
          prop: "msnCount",
          width: "100px",
          checked: true,
        },
        {
          value: "电池单体数",
          prop: "csnCount",
          width: "100px",
          checked: true,
        },
        {
          value: "上传状态",
          prop: "code",
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
      addUpdateVisible: false,
      importVisible: false, // 导入
      resultVisible: false,
      lookVisible1: false,
      lookVisible2: false,
      lookVisible3: false,
      lookcarVisible: false,
      importResult: {},
      lookvin: {},
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  computed: {
      searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vinNo",
          inputEvent:this.clearVINno
				},
        {
					type: "input",
					label: "车辆制造企业",
					value: "qualifications"
				},
        {
					type: "input",
					label: "车辆型号",
					value: "vehicleModel"
				},
        {
					type: "input",
					label: "电池包编码",
					value: "psn"
				},
        {
					type: "select",
					label: "上传状态",
					value: "code",
					options: {
						data: this.vehicleModel//下拉数组	
					},
				}
			];
		}
  },
  mounted() {
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    //清空
    handleClear1() {
      for (const k in this.listQuery) {
        if (k === "pageNum" || k === "pageSize") {
          continue;
        } else {
          this.listQuery[k] = "";
        }
      }
      this.$route.query.vinNo = "";
      this.listLoad();
    },
    //查看导出任务按钮
    lookExportTask() {
      this.isExport = true;
      this.exportImportTaskVisible = true;
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      if (
        this.$route.query.vinNo != "" &&
        this.$route.query.vinNo != undefined
      ) {
        this.listQuery.vinNo = this.$route.query.vinNo;
      }
      getCarproduceList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
      //  }
    },
    // 点击列
    rowClick({ row, column }) {
      const label = column.label;
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
      this.lookvin.vinNo = row.vinNoTotal;
      if (label === "电池包数" && row.psncount != 0) {
        this.lookVisible1 = true;
        this.lookvin.cells = "dcb";
      }
      if (label === "电池模块数" && row.msncount != 0) {
        this.lookVisible2 = true;
        this.lookvin.cells = "dcmk";
      }
      if (label === "电池单体数" && row.csncount != 0) {
        this.lookVisible3 = true;
        this.lookvin.cells = "dcdt";
      }
      if (label === "VIN码") {
        this.lookcarVisible = true;
      }
    },

    //导出
    handleExport() {
      this.exportLoading = true;
      exportCarproduce(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "新增导出任务成功",
            duration: 2 * 1000,
          });
          this.listLoad();
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    //解绑
    handleUnbing(row) {
      const deleteData = {
        id: row.id,
        vinNo: row.vinNoTotal
      };
      this.$confirm(`是否确定解绑?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ubindcar(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "解绑成功",
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
    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "车辆生产信息",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
     clearVINno() {
      this.$route.query.vinNo = "";
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
      this.$alert("导入成功" + data.successList.length + "辆", "提示", {
        confirmButtonText: "下载",
      })
        .then(() => {
          let codeList = [];
          data.successList.forEach((ele) => {
            codeList.push(ele.vinNo);
          });
          let params = {
            key: "carProductInfo",
            codeList
          };
          exportByVin(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
</style>
