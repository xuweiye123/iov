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
    </div>
    <!--单体明细dialog弹窗-->
    <detail-cell-drawer :visibles.sync="lookCellVisible" :data="tableRow">
    </detail-cell-drawer>
    <!--导入dialog弹窗-->
    <import-dialog
      ref="importDialog"
      action="/api/battery/batcell/import"
      :template-url="'api/battery/fileStatics/ImportBatteryCellModelBatch.xlsx'"
      :append-to-body="true"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    />
    <!--导入结果dialog弹窗-->
    <result-dialog
      :visibles.sync="resultVisible"
      :data="importResult"
      :text="'单体前14位编码'"
      :keys="'top14Code'"
      :message="'无导入失败信息'"
      @export-fail="exportFail"
      @close="resultClose"
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
import { getDropList } from "@/mixins/dictionaryDropList";
import {
  getCellList,
  getCell,
  exportCell,
  exportCheck,
} from "@/api/batterySys/batcell";
//引入导入组件
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import detailCellDrawer from "./components/detailCellDrawer";
export default {
  name: "batcell",
  //声明组件
  components: {
    importDialog,
    detailCellDrawer,
    resultDialog,
  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton,getDropList],
  data() {
    return {
      batteryTypeList: [], //绑定电池类型下拉框
      // 下拉
      dropList:[
        { postData:{dicCode:2006},key:'batteryTypeList' }
      ],
      tableList: [
        {
          value: "单体前14位编码",
          prop: "top14Code",
          width: "180px",
          checked: true,
          fixed: true,
        },
        {
          value: "单体厂商规格",
          prop: "specification",
          width: "100px",
          checked: true,
        },
        {
          value: "电池单体规格代码",
          prop: "batCellCode",
          width: "120px",
          checked: true,
        },
        {
          value: "电池单体型号",
          prop: "batCellName",
          width: "100px",
          checked: true,
        },
        {
          value: "额定容量",
          prop: "capacity",
          width: "100px",
          checked: true,
        },
        {
          value: "额定质量",
          prop: "quality",
          width: "100px",
          checked: true,
        },
        {
          value: "电池类型",
          prop: "batteryType",
          width: "100px",
          checked: true,
        },
        {
          value: "正极材料",
          prop: "anodeType",
          width: "140px",
          checked: true,
        },
        {
          value: "负极材料",
          prop: "cathodeType",
          width: "100px",
          checked: true,
        },
      ],
      importVisible: false, // 导入
      importResult: {},
      resultVisible: false,
      lookData: {}, //行点击查看的绑定数据
      lookCellVisible: false, //查看详情
    };
  },
  computed: {
      searchList() {
      return [
        {
          type: "input",
          label: "单体前14位编码",
          value: "top14Code"
        },
        {
          type: "input",
          label: "单体厂商规格",
          value: "specification",
        },
        {
					type: "select",
					label: "电池类型",
					value: "batteryType",
					options: {
						data: this.batteryTypeList, //下拉数组
						// extraProps: {
						// 	label: "dictionaryName",
						// 	value: "id",
						// },
					},
				},
      ];
    }
  },
  mounted() {
    // 数据字典下拉
    this.getDropList(this.dropList)
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
    // 导出
    handleExport() {
      this.exportLoading = true;
      exportCell(this.listQuery)
        .then(() => {
        })
        .finally(() => {
          this.exportLoading = false;
        })
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getCellList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        })
        .finally(()=>{
          this.listLoading = false;
        });
    },
    //查看按钮
    handleLook(row) {
      this.tableRow = row
      this.lookCellVisible = true;
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
