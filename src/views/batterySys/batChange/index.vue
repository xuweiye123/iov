<template>
  <div class="js-system-user app-container">
    <!-- 查询 -->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'90px'"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!--折叠 过滤 清空 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
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
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop]  | processData
              }}
            </el-tag>
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop]  | processData
            }}
          </span>
        </template>
      </app-table>
    </div>
    <!--导入-->
    <import-dialog
      ref="importDialog"
      action="api/battery/changecar/import"
      :template-url="
        'api/battery/fileStatics/ImportVehicleBatterySwapInformationBatch.xlsx'
      "
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
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/changecar/importVin'"
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
// 组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import { exportCarCheck, exportByVin } from "@/api/batterySys/commont";
import {
  getchangecarList,
  exportchangecar,
  exportCheck,
} from "@/api/batterySys/batChange";
export default {
  name: "batChange",
  components: {
    importDialog,
    resultDialog,
  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      vehicleModel: [
        { label: "初始", value: "2" },
        { label: "成功", value: "0" },
        { label: "失败", value: "1" },
      ],
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "170px",
          checked: true,
        },
        {
          value: "换电日期",
          prop: "changechargeTime",
          width: "150px",
          checked: true,
        },
        {
          value: "更换前电池包编码",
          prop: "changeingBatteryCode",
          width:"200px",
          checked: true,
        },
        {
          value: "更换后电池包编码",
          prop: "changendBatteryCode",
          width: "200px",
          checked: true,
        },
        {
          value: "换电企业名称",
          prop: "changeCompanyName",
          width: "100px",
          checked: true,
        },
        {
          value: "换电企业统一社会信用代码",
          prop: "unitCode",
          width: "180px",
          checked: true,
        },
        {
          value: "上传状态",
          prop: "code",
          width: "100px",
          checked: true,
        },
      ],
      importVisible: false, // 导入
      resultVisible: false,
      importResult: {},
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
          labelWidth: "60px",
          type: "vin",
        },
        {
          label: "换电企业名称",
          value: "supplier",
          type: "input",
        },
        {
          label: "上传状态",
          value: "code",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.vehicleModel, //下拉数组
          },
        },
      ];
    },
  },
  created() {},
  mounted() {
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getchangecarList(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },

    //导出
    handleExport() {
      this.exportLoading = true;
      exportchangecar(this.listQuery)
        .then(() => {
        })
        .finally(() => {
        this.exportLoading = false;
      })
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
      this.$alert("导入成功" + data.successList.length + "辆", "提示", {
        confirmButtonText: "下载",
      })
        .then(() => {
          let codeList = [];
          data.successList.forEach((ele) => {
            codeList.push(ele.vinNo);
          });
          let params = {
            key: "changecar",
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
        title: "车辆换电信息",
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
