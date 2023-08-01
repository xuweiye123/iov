<template>
  <div class="js-system-user app-container">
    <!--查询-->
     <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'90px'"
          :collapse="collapse"
          :listQuery="listQuery"
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

    <!-- 授权按钮 -->
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-export="handleExport"
        @click-import="importVisible = true"
        @click-import-car="handleImportCar"
        @click-look-export-task="lookExportTask"
        @click-look-import-task="lookImportTask"
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
        :isShowOperation="false"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
    </div>
    <!--导入或导出任务dialog弹窗-->
    <look-export-import-drawer
      :visibles.sync="exportImportTaskVisible"
      :is-export="isExport"
      :category="'certificate'"
    >
    </look-export-import-drawer>
    <!--导入dialog弹窗-->
    <import-dialog
      ref="importDialog"
      action="/api/battery/certificate/import"
      :template-url="
        'api/battery/fileStatics/ImportCertificateInformationBatches.xlsx'
      "
      :visibles.sync="importVisible"
      :append-to-body="true"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'合格证编号'"
        :keys="'certificateNum'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        @close="resultClose"
      >
      </result-dialog>
    </import-dialog>

    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/certificate/importVin'"
      :title="'导入查询'"
      :template-url="'api/battery/fileStatics/ImportVINInformation.xlsx'"
      :visibles.sync="importCarVisible"
      @upload-success="reloadCarList"
      :auto-upload="false"
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
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

import {
  getList,
  exportConfigurator,
  exportByVin,
  exportCheck
} from "@/api/batterySys/certificate";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import lookExportImportDrawer from "@/components/lookExportImportDrawer";
import { exportCarCheck } from "@/api/batterySys/commont";
export default {
  name: "certificate",
  components: { lookExportImportDrawer, importDialog, resultDialog },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      tableList: [
        {
          value: "合格证编号",
          prop: "certificateNum",
          width: "180px",
          checked: true
        },
        {
          value: "VIN码",
          prop: "vinNo",
          width: "150px",
          checked: true,
        },
        {
          value: "车辆制造企业名称",
          prop: "vehicleManufacturerName",
          width: "130px",
          checked: true,
        },
        {
          value: "车辆类型",
          prop: "carType",
          width: "90px",
          checked: true,
        },
        {
          value: "车辆型号",
          prop: "vehicleModel",
          width: "90px",
          checked: true,
        },
        {
          value: "车辆制造日期",
          prop: "manufacturingDate",
          width: "140px",
          checked: true,
        },
      ],
      importVisible: false, // 导入
      importCarVisible: false, // 导入查询
      resultCarVisible: false,
      importResult: {},
      importDataConifg: {},
      resultVisible: false,
      exportImportTaskVisible: false, //导入或导出任务dialog
      isExport: false
    };
  },
  computed: {
    searchList() {
			return [
				{
					type: "input",
					label: "合格证编号",
					value: "certificateNum"
				},
        {
					type: "vin",
					label: "VIN码",
					value: "vinNo"
				},
        {
					type: "input",
					label: "车辆制造企业",
					value: "vehicleManufacturerName"
				},
         {
					type: "input",
					label: "车辆型号",
					value: "vehicleModel"
				}
			];
		},
  },
  methods: {
    //导出
    handleExport() {
      this.exportLoading = true;
      exportConfigurator(this.listQuery)
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
      this.listLoading = true;
      getList(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0;
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
      }).finally(() => {
         this.listLoading = false;
        })
    },
    //查看导出任务按钮
    lookExportTask() {
      this.isExport = true;
      this.exportImportTaskVisible = true;
    },
    //查看导入任务按钮
    lookImportTask() {
      this.isExport = false;
      this.exportImportTaskVisible = true;
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
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "合格证信息",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
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
      this.$alert("导入成功" + data.successList.length + "辆", "提示", {
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
          exportByVin(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    // this.authouizeList = [
    //   {
    //     functionName: "查看导入任务",
    //     functionNameEn: "查看导入任务",
    //     functionType: 2,
    //     url: "lookImportTask",
    //     icon: "detail",
    //     isShow: 1,
    //      iconType:2
    //   },
    //   {
    //     functionName: "查看导出任务",
    //     functionNameEn: "查看导出任务",
    //     functionType: 2,
    //     url: "lookExportTask",
    //     icon: "detail",
    //     isShow: 1,
    //      iconType:2
    //   },
    //   {
    //     functionName: "导入",
    //     functionNameEn: "导入",
    //     functionType: 1,
    //     url: "import",
    //     icon: "import",
    //     isShow: 1,
    //     iconType:2
    //   },
    //    {
    //     functionName: "导入查询",
    //     functionNameEn: "导入查询",
    //     functionType: 1,
    //     url: "importCar",
    //     icon: "importSelect",
    //     isShow: 1,
    //     iconType:2
    //   },
    //   {
    //     functionName: "导出",
    //     functionNameEn: "导出",
    //     functionType: 2,
    //     url: "export",
    //     iconType:2,
    //     icon: "export",
    //     isShow: 1,
    //     iconType:2
    //   },
    // ];
  },
};
</script>

<style scoped></style>
