<template>
  <div class="js-system-user app-container">
    <!-- 查询 -->
     <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'75px'"
          :listQuery="listQuery"
          :searchList="searchList"
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
        @click-add="handleAdd"
        @click-export="handleExport"
        @click-import="handleImport"
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
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="scope.item.prop === 'packCount'"
            class="vinNo"
            style="cursor:pointer"
          >
            {{
              scope.row[scope.item.prop]  | processData
            }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop]  | processData
            }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
          <div style="text-align:left">
            <el-tooltip
              v-for="(l, index) in insideList"
              :key="index"
              :open-delay="250"
              class="item"
              effect="dark"
              v-clearTableIndex
              :content="l.functionName"
              placement="top"
            >
              <span
                class="card-action"
                v-if="l.url === 'bing' && scope.row.packCount == 1"
                @click="handlebing(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="l.url === 'unbing' && scope.row.packCount > 1"
                @click="handleUnbing(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="l.url === 'delete'"
                @click="handleDelete(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
            </el-tooltip>
          </div>
        </template>
      </app-table>
    </div>
    <!-- 新增编辑dialog弹窗 -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
    />
    <!--查看电池信息-->
    <lookcell-drawer :visibles.sync="lookVisible" :data="lookvin" />
    <!--绑定信息-->
    <bindcell-drawer
      :visibles.sync="bindVisible"
      :data="binddata"
      @add-complete="addComplete"
    />
    <!--解绑信息-->
    <unbind-drawer
      :visibles.sync="unbindVisible"
      :data="unbinddata"
      @add-complete="addComplete"
    />

    <!--导入-->
    <import-dialog
      action="api/battery/configure/import"
      :template-url="
        'api/battery/fileStatics/ImportConfigurationNumberInformationBatch.xlsx'
      "
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'配置号'"
        :keys="'faultcode'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        :is-show="true"
      />
    </import-dialog>
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
import addUpdateDrawer from "./components/addUpdateDrawer";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";

import {
  getConfigureList,
  configureDel,
  exportConfigure,
  exportCheck,
} from "@/api/batterySys/configure";
import lookcellDrawer from "./components/lookcellDrawer";
import bindcellDrawer from "./components/bindcellDrawer";
import unbindDrawer from "./components/unbindDrawer";
export default {
  name: "configure",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
    lookcellDrawer,
    bindcellDrawer,
    unbindDrawer
  },
  filters: {},
  watch: {

  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      lookvin: {},
      binddata: {},
      unbinddata: {},
      lookVisible: false,
      bindVisible: false,
      unbindVisible: false,
      tableList: [
        {
          value: "配置号",
          prop: "configureNumber",
          width: "150px",
          checked: true,
          fixed: true,
        },
        {
          value: "车型公告号",
          prop: "productModel",
          width: "150px",
          checked: true,
        },
        {
          value: "对应包规格数",
          prop: "packCount",
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
      importResult: {},
      isEdit: false,
    };
  },
  computed: {
    	searchList() {
			return [
				{
					type: "input",
					label: "配置号",
					value: "configureNumber",
				},
        {
					type: "input",
					label: "车型公告号",
					value: "productModel",
				}
			];
		}
  },
  created() {},
  mounted() {
    // this.authouizeList = [
    //   {
    //     functionName: "新增",
    //     functionNameEn: "新增",
    //     functionType: 2,
    //     url: "create",
    //     icon: "ic_add",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "导出",
    //     functionNameEn: "导出",
    //     functionType: 2,
    //     url: "export",
    //     iconType:2,
    //     icon: "export",
    //     isShow: 1,
    //   },
    //    {
    //     functionName: "导入",
    //     functionNameEn: "导入",
    //     functionType: 2,
    //     url: "import",
    //     icon: "import",
    //     isShow: 1,
    //   },

    //   {
    //     functionName: "绑定",
    //     functionNameEn: "绑定",
    //     functionType: 1,
    //     url: "bing",
    //     icon: "ic_fenpei",
    //     isShow: 1,
    //   },
    //    {
    //     functionName: "解绑",
    //     functionNameEn: "解绑",
    //     functionType: 1,
    //     url: "unbing",
    //     icon: "yuanquan",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "删除",
    //     functionNameEn: "删除",
    //     functionType: 1,
    //     url: "delete",
    //     icon: "ic_delete",
    //     isShow: 1,
    //   },
    // ];
  },
  methods: {
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getConfigureList(this.listQuery).then(({ data }) => {
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
    // 点击列
    rowClick({ row, column }) {
      const label = column.label;
      if (label === "对应包规格数" && row.packCount) {
        this.lookvin = row;
        this.lookVisible = true;
      }
    },

    //导出
    handleExport() {
      this.exportLoading = true;
      exportConfigure(this.listQuery).then(() => {
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {

        })
        .catch(() => {

        });
    },
    // 新增成功
    addComplete() {
      this.listLoad();
    },
    //解绑
    handleUnbing(row) {
      this.unbinddata = row;
      this.unbindVisible = true;
    },
    //绑定
    handlebing(row) {
      this.binddata = row;
      this.bindVisible = true;
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        id: row.oid,
        // vinno: this.tableRow.vinno
      };
      this.$confirm(`是否删除${row.configureNumber}配置号?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          configureDel(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
                 this.listLoad();
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
  },
};
</script>

<style lang="scss">

</style>
