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

      <!-- 表格 -->
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
          <span v-if="scope.item.prop === 'specification'">
            <span class="vinNo" @click="lookCellPack(scope.row)">{{
              scope.row[scope.item.prop] | processData
            }}</span>
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
      <!--查看模块厂商规格信息-->
      <look-drawer
        :visibles.sync="lookVisible"
        :data1="lookTableData"
      ></look-drawer>
      <!--查看电池包详细信息-->
      <look-cell-pack-drawer
        :visibles.sync="lookCellPackVisible"
        :data="tableRow"
      >
      </look-cell-pack-drawer>
      <!--导入dialog弹窗-->
      <import-dialog
        ref="importDialog"
        action="/api/battery/batpackage/import"
        :template-url="'api/battery/fileStatics/ImportBatteryPackModelBatch.xlsx'"
        :append-to-body="true"
        :visibles.sync="importVisible"
        @upload-success="reloadList"
      >
        <!--导入结果dialog弹窗-->
        <result-dialog
          :visibles.sync="resultVisible"
          :data="importResult"
          :text="'电池包前14位'"
          :keys="'top14Code'"
          :message="'无导出失败信息'"
          :isShow="true"
          @export-fail="exportFail"
          @close="resultClose"
        />
      </import-dialog>
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
  getCellPackList,
  exportCellPack,
  exportCheck,
} from "@/api/batterySys/batpackage";
import lookCellPackDrawer from "./components/lookCellPackDrawer";
import lookDrawer from "./components/lookDrawer";
export default {
  name: "batpackage",
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  components: {
    importDialog,
    resultDialog,
    lookDrawer,
    lookCellPackDrawer,
  },
  data() {
    return {
      tableList: [
        {
          value: "电池包厂商规格",
          prop: "specification",
          width: "120px",
          checked: true,
        },
        {
          value: "包前14位",
          prop: "top14Code",
          width: "120px",
          checked: true,
        },
        {
          value: "电池包型号",
          prop: "batpackageName",
          width: "100px",
          checked: true,
        },
        {
          value: "电池包规格代码",
          prop: "batpackageCode",
          width: "120px",
          checked: true,
        },
        {
          value: "包模块串并联方式",
          prop: "seriesparallerl",
          width: "120px",
          checked: true,
        },
        {
          value: "尺寸",
          prop: "packageSize",
          width: "160px",
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
      lookVisible: false, //模块厂商dialog
      importVisible: false, // 导入
      importResult: {}, //导入返回结果
      resultVisible: false,
      lookTableData: "", //查看电池包型号绑定的表格数据
      lookData: {}, //查看按钮绑定的数据
      lookCellPackVisible: false, //电池包详细dialog
    };
  },
  computed: {
      searchList() {
      return [
        {
          type: "input",
          label: "包前14位编码",
          value: "top14Code"
        },
        {
          type: "input",
          label: "电池包厂商规格",
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
      exportCellPack(this.listQuery)
        .then(() => {})
        .finally(() => {
        this.exportLoading = false;
      })
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getCellPackList(this.listQuery)
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

    //查看按钮
    handleLook(row) {
        this.tableRow = row
        this.lookCellPackVisible = true;
    },
    //点击模块厂商规格
    lookCellPack(row) {
      this.lookTableData = row.specification;
      this.lookVisible = true;
    },
    //上传成功的回调
    reloadList(data) {
      this.importResult = data; //上传接口的返回data
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
