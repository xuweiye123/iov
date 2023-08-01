<template>
  <div class="js-system-user app-container">
    <!-- 查询 -->
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
        @click-collapse="handleCollapse"
        @click-filter="handleFilter"
        @click-clear="handleClear1"
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
        @click-recombination="handlerecombination"
        @click-export="handleExport"
        @click-import="handleImport"
        @click-import-car="handleImportCar"
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
        :actionFixed="actionFixed"
        :isShowOperation="false"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'code'">
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
    <!--导入-->
    <import-dialog
      ref="importDialog"
      action="api/battery/carrepair/importCarRepair"
      :template-url="'api/battery/fileStatics/ImportVehicleMaintenanceInformationBatch.xlsx'"
      :visibles.sync="importVisible1"
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
    <!--导入-->
    <import-dialog
      action="api/battery/carrepair/importCarRepairGroup"
      :template-url="'api/battery/fileStatics/VehicleMaintenanceModuleReorganizationInformationImportBatch.xlsx'"
      :title="'导入重组'"
      :visibles.sync="importVisible2"
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

    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/carrepair/importVin'"
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
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import {
  getCarserviceList,
  exportCarservice,
  exportCheck,
} from "@/api/batterySys/carrepair";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
export default {
  name: "carrepair",
  components: {
    importDialog,
    resultDialog,
  },
  filters: {},
  watch: {},
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      vehiclemodel: [
        { label: "初始", value: "2" },
        { label: "成功", value: "0" },
        { label: "失败", value: "1" },
      ],
      modeltype: [
        { label: "电池包", value: "电池包" },
        { label: "电池模块", value: "电池模块" },
      ],
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "180px",
          checked: true,
          fixed: true,
        },
        {
          value: "车辆制造企业",
          prop: "qualifications",
          width: "150px",
          checked: true,
        },
        {
          value: "产品型号",
          prop: "productModel",
          width: "100px",
          checked: true,
        },
        {
          value: "维修日期",
          prop: "repairDate",
          width: "140px",
          checked: true,
        },
        {
          value: "产品类型",
          prop: "productType",
          width: "100px",
          checked: true,
        },
        {
          value: "更换前编码",
          prop: "preChangeTypeCode",
          width: "200px",
          checked: true,
        },
        {
          value: "更换后编码",
          prop: "changedTypeCode",
          width: "200px",
          checked: true,
        },
        {
          value: "去向单位名称",
          prop: "supplierName",
          width: "120px",
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
      importVisible1: false, // 导入
      importVisible2: false, // 导入
      resultVisible: false,
      importResult: {},
      isEdit: false,
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
          inputEvent: this.clearVINno,
        },
        {
          type: "input",
          label: "产品型号",
          value: "productModel",
        },
        {
          type: "select",
          label: "产品类型",
          value: "productType",
          options: {
            data: this.modeltype,
          },
          changeEvent: this.clearVINno,
        },
        {
          type: "select",
          label: "上传状态",
          value: "code",
          options: {
            data: this.vehiclemodel,
          },
          changeEvent: this.clearVINno,
        },
      ];
    },
  },
  created() {},
  mounted() {
    // this.authouizeList = [
    //   {
    //     functionName: "导出",
    //     functionNameEn: "导出",
    //     functionType: 2,
    //     url: "export",
    //     iconType: 2,
    //     icon: "export",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "导入",
    //     functionNameEn: "导入",
    //     functionType: 2,
    //     url: "import",
    //     icon: "import",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "导入(重组)",
    //     functionNameEn: "导入(重组)",
    //     functionType: 2,
    //     url: "recombination",
    //     icon: "import",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "导入查询",
    //     functionNameEn: "导入查询",
    //     functionType: 1,
    //     url: "importCar",
    //     icon: "importSelect",
    //     isShow: 1,
    //     iconType: 2,
    //   },
    // ];
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
    clearVINno() {
      this.$route.query.vinNo = "";
      this.listQuery.preChangeTypeCode = "";
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      if (this.$route.query.vinNo != "" && this.$route.query.vinNo != undefined)
        this.listQuery.preChangeTypeCode = this.$route.query.vinNo;
      getCarserviceList(this.listQuery)
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
    },

    //导出
    handleExport() {
      // this.uploadloading = this.$loading({
      //   target: document.querySelector(".el-dialog-import-sim"),
      //   text: "正在导出，请稍候...",
      //   background: "rgba(1,1,1,0.3)",
      //   customClass: "svg-otherColor",
      // });
      this.exportLoading = true;
      exportCarservice(this.listQuery).then(() => {
        // this.uploadloading.close();
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    terminalReplaceComplete() {
      this.listLoad();
    },
    // 导入
    handleImport() {
      this.importVisible1 = true;
    },
    handlerecombination() {
      this.importVisible2 = true;
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
      this.$alert("导入成功" + data.successList.length + "辆", "提示", {
        confirmButtonText: "下载",
      })
        .then(() => {
          let codeList = [];
          data.successList.forEach((ele) => {
            codeList.push(ele.vinNo);
          });
          let params = {
            key: "repairInfo",
            codeList,
          };
          exportByVin(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },
    // 导出车辆失败信息
    exportCarFail(data) {
      let params = {
        title: "车辆维修信息",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss">

</style>
