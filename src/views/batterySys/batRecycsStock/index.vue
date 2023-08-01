<template>
  <div class="js-car-manage app-container">
    <!--查询-->
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'115px'"
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
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
      :action="'api/battery/batrecycsstock/import'"
      :template-url="
        'api/battery/fileStatics/ImportRecyclingNetworkStorageInformationBatch.xlsx'
      "
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'入库电池编码'"
        :keys="'faultcode'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        :is-show="true"
      />
    </import-dialog>
    <!-- 导入查询 -->
    <import-dialog
      :action="'/api/battery/batrecycsstock/importCode'"
      :title="'导入查询'"
      :template-url="
        'api/battery/fileStatics/RecyclingNetworkStorageInformationImportQuery.xlsx'
      "
      :visibles.sync="importCarVisible"
      @upload-success="reloadCarList"
    />
    <result-dialog
      :visibles.sync="resultCarVisible"
      :data="importResult"
      :text="'入库电池编码'"
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
//组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";

import {
  getBatrecycsList,
  getBatrecycsExport,
  exportCheck,
  exportByCode,
} from "@/api/batterySys/batRecycsStock";
import { exportCarCheck } from "@/api/batterySys/commont";
export default {
  name: "batRecycsStock",
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
      uploadloading: null,
      listQuery: {},
      tableList: [
        {
          value: "入库电池编码",
          prop: "batStockCode",
          width: "200px",
          checked: true,
        },
        {
          value: "产品类型",
          prop: "productType",
          width: "150px",
          checked: true,
        },
        {
          value: "入库日期",
          prop: "stockDate",
          width: "140px",
          checked: true,
        },
        {
          value: "回收服务网点名称",
          prop: "supplierName",
          width: "120px",
          checked: true,
        },
        {
          value: "回收服务网点统一社会信用代码",
          prop: "supplierCode",
          width: "200px",
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
      productTypeList: [
        { label: "电池包", value: "电池包" },
        { label: "电池模块", value: "电池模块" },
        { label: "电池单体", value: "电池单体" },
      ],
      importCarVisible: false,
      resultCarVisible: false,
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "入库电池编码",
          value: "batStockCode",
          labelWidth: "90px",
          type: "input",
        },
         {
          label: "产品类型",
          value: "productType",
          type: "select",
          labelWidth: "65px",
          options: {
            data: this.productTypeList, //下拉数组
          },
        },
        {
          label: "回收服务网点名称",
          value: "supplierName",
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
  mounted() {},
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {})
        .catch(() => {});
    },
    //加载数据
    listLoad() {
      this.listLoading = true;
      getBatrecycsList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0;
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

    //导出
    handleExport() {
      // this.uploadloading = this.$loading({
      //   target: document.querySelector(".el-dialog-import-sim"),
      //   text: "正在导出，请稍候...",
      //   background: "rgba(1,1,1,0.3)",
      //   customClass: "svg-otherColor",
      // });
      this.exportLoading = true;
      getBatrecycsExport(this.listQuery).then(() => {
        // this.uploadloading.close();
      }).finally(() => {
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
          exportByCode(params).then(({ data }) => {
            if (data.code === 0) {
            }
          });
        })
        .catch(() => {});
    },

    // 导出编码失败信息
    exportCarFail(data) {
      let params = {
        title: "回收网点入库信息",
        key: "入库电池编码",
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
