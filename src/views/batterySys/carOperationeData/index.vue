<template>
  <div class="js-system-user app-container">
    <!--查询-->
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
        @click-import="importVisible = true"
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
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop] | processData
              }}
            </el-tag>
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
      <!--导入dialog弹窗-->
      <import-dialog
        ref="importDialog"
        action="api/battery/carsales/import"
        :template-url="
          'api/battery/fileStatics/ImportVehicleSalesInformationBatch.xlsx'
        "
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      />
      <!--导入结果dialog弹窗-->
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'VIN编码'"
        :keys="'vinNo'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        @close="resultClose"
      />

      <!-- 导入查询 -->
      <!-- <import-dialog
        :action="'/api/battery/carsales/importVin'"
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
      /> -->
    </div>
  </div>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
//引入导入组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import { getList, exportCarSales, exportCheck } from "@/api/batterySys/carsales";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
export default {
  name: "carOperationeData",
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  components: { importDialog, resultDialog },
  computed: {
       searchList() {
      return [
        {
          type: "vin",
          label: "VIN码",
          value: "vinNo",
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
          }
        },
        {
          type: "select",
          label: "上传状态",
          value: "code",
          options: {
            data: this.vehiclemodel,
          }
        },
      ];
    },
  },
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
          value: "换电日期",
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
        // {
        //   value: "上传状态",
        //   prop: "code",
        //   width: "100px",
        //   checked: true,
        // },
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
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    //导出
    handleExport() {
      this.exportLoading = true;
      exportCarSales(this.listQuery)
        .then(() => {
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
        this.total = 0
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
      }).finally(()=>{
        this.listLoading = false;
      })
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
            key: "carSalesInfo",
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
        title: "生产信息预警",
        key: "VIN码",
        failedList: data,
      };
      exportCarCheck(params)
        .then(() => {})
        .catch(() => {});
    },
  },
 
  mounted() {
    // this.authouizeList = [
    //   {
    //     functionName: "导出",
    //     functionNameEn: "导出",
    //     functionType: 2,
    //     url: "export",
    //     iconType:2,
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
    //    {
    //     functionName: "导入查询",
    //     functionNameEn: "导入查询",
    //     functionType: 1,
    //     url: "importCar",
    //     icon: "importSelect",
    //     isShow: 1,
    //     iconType:2
    //   },
    // ];
  },
};
</script>

<style scoped></style>
