<template>
  <div class="js-basedata-cargroup app-container">
    <!--查询-->
    <app-search>
      <div slot="content">
        <seach-form
          :listQuery="listQuery"
          :searchList="searchList"
           labelWidth="100px"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isCollapse="false"
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
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button>

      <!--表格-->
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
        @click-detail="handleLook"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span>
            {{
              scope.row[scope.item.prop]  | processData
            }}
          </span>
        </template>
      </app-table>
      <!--查看电池模块dialog-->
      <look-cell-module-drawer
        :visibles.sync="lookCellModuleVisible"
        :data="tableRow"
      >
      </look-cell-module-drawer>
      <!--导入dialog弹窗-->
      <import-dialog
        ref="importDialog"
        action="/api/battery/batmodule/import"
        :template-url="
          'api/battery/fileStatics/ImportBatteryModuleModelBatch.xlsx'
        "
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      />
      <!--导入结果dialog弹窗-->
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'模块前14位编码'"
        :keys="'top14Code'"
        :message="$t('resultDialog.noFailReason')"
        @export-fail="exportFail"
        @close="resultClose"
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
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";

import {
  getCellModuleList,
  exportCellModule,
  exportCheck,
} from "@/api/batterySys/batmodule";
import lookCellModuleDrawer from "./components/lookCellModuleDrawer";
export default {
  name: "batmodule",
  components: { lookCellModuleDrawer, importDialog, resultDialog },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      tableList: [
        {
          value: "模块厂商规格",
          prop: "specification",
          width: "100px",
          checked: true,
        },
        {
          value: "模块前14位编码",
          prop: "top14Code",
          width: "160px",
          checked: true,
        },
        {
          value: "电池模块型号",
          prop: "batmoduleName",
          width: "100px",
          checked: true,
        },
        {
          value: "电池模块规格代码",
          prop: "batmoduleCode",
          width: "140px",
          checked: true,
        },
        {
          value: "模块所含单体个数",
          prop: "cellamount",
          width: "140px",
          checked: true,
        },
        {
          value: "单体串并联方式",
          prop: "seriesparallerl",
          width: "140px",
          checked: true,
        },
        {
          value: "尺寸",
          prop: "modulesize",
          width: "140px",
          checked: true,
        },
        {
          value: "额定容量",
          prop: "capacity",
          width: "100px",
          checked: true,
        },
        {
          value: "标称电压",
          prop: "voltage",
          width: "100px",
          checked: true,
        },
      ],
      lookCellModuleVisible: false, //查看详情
      importVisible: false, // 导入
      importResult: {},
      resultVisible: false,
      lookData: {}, //行点击查看的绑定数据
    };
  },
  computed: {
    searchList() {
      return [
        {
          type: "input",
          label: "模块前14位编码",
          value: "top14Code"
        },
        {
          type: "input",
          label: "模块厂商规格",
          value: "specification",
        }
      ];
    }
  },
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
    //     functionName: "查看详情",
    //     functionNameEn: "查看详情",
    //     functionType: 2,
    //     url: "detail",
    //     icon: "ic_detail",
    //     isShow: 1,
    //   },
    // ];
  },
  methods: {
    //导出
    handleExport() {
      this.exportLoading = true;
      exportCellModule(this.listQuery)
        .then(() => {
        })
        .finally(() => {
        this.exportLoading = false;
      })
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getCellModuleList(this.listQuery).then(({ data }) => {
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

    //点击查看按钮
    handleLook(row) {
      this.tableRow = row
      this.lookCellModuleVisible = true;
      
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
    resultClose() {
      this.$refs.importDialog.closeDialog();
    },
  },
};
</script>

<style scoped></style>
