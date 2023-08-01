<template>
  <div class="js-system-user app-container">
     <app-search>
      <div slot="content">
        <seach-form
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
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isOper'">
            <el-tag
              :type="
                scope.row.isOper == 0
                  ? 'info'
                  : scope.row.isOper == 1
                  ? 'success'
                  : 'danger'
              "
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop === 'attributes'">
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
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
              v-clearTableIndex
              effect="dark"
              :content="l.functionName"
              placement="top"
            >
              <span
                class="card-action"
                v-if="l.url === 'open' && scope.row.isOper != 1"
                @click="handleOpen(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="
                  l.url === 'close' &&
                    scope.row.isOper != 0 &&
                    scope.row.isOper != 2
                "
                @click="handleClose(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="
                  l.url === 'update' &&
                    scope.row.isOper != 1 &&
                    scope.row.isOper != 2
                "
                @click="handleUpdate(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="
                  l.url === 'delete' &&
                    scope.row.isOper != 1 &&
                    scope.row.isOper != 2
                "
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
      @update-complete="updateComplete"
    />
    <!--导入-->
    <import-dialog
      ref="importDialog"
      action="api/battery/model/import"
      :template-url="
        'api/battery/fileStatics/ImportProductModelInformationBatches.xlsx'
      "
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'产品型号'"
        :keys="'faultcode'"
        :message="'无导入失败信息'"
        @export-fail="exportFail"
        @close="resultClose"
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
  getProductmodelList,
  ProductmodelDel,
  isOper,
  exportProductmodel,
  exportCheck,
} from "@/api/batterySys/model";
export default {
  name: "model",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
  },
  filters: {
    switchText(val, type) {
      if (type === "isOper") {
        return val === 0 ? "初始" : val === 1 ? "开通" : "关闭";
      } else if (type === "attributes") {
        return val === 0 ? "2018年8月1号前新上公告" : "2018年8月1号后新上公告";
      }
    },
  },
  watch: {

  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      tableList: [
        {
          value: "产品型号",
          prop: "productModel",
          width: "150px",
          checked: true,
          fixed: true,
        },
        {
          value: "项目代号",
          prop: "projectCode",
          width: "150px",
          checked: true,
        },
        {
          value: "通用名称",
          prop: "genericName",
          width: "100px",
          checked: true,
        },
        {
          value: "产品名称",
          prop: "vehmodelName",
          width: "95px",
          checked: true,
        },
        {
          value: "开通状态",
          prop: "isOper",
          width: "100px",
          checked: true,
        },
        {
          value: "公告资质",
          prop: "qualifications",
          width: "160px",
          checked: true,
        },
        {
          value: "公告批次",
          prop: "batchNumber",
          width: "100px",
          checked: true,
        },
        {
          value: "属性",
          prop: "attributes",
          width: "180px",
          checked: true,
        },
        {
          value: "电池类型",
          prop: "dictionaryName",
          width: "100px",
          checked: true,
        },
        {
          value: "开通人员",
          prop: "isOperBy",
          width: "100px",
          checked: true,
        },
        {
          value: "关闭人员",
          prop: "isCloseBy",
          width: "100px",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "150px",
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
					label: "产品型号",
					value: "productModel"
				},
                {
					type: "input",
					label: "公告资质",
					value: "qualifications"
				}
			];
		},
  },
  created() {},
  mounted() {
    //  this.authouizeList = [
    //   {
    //     functionName: "新增",
    //     functionNameEn: "新增",
    //     functionType: 2,
    //     url: "create",
    //     icon: "ic_add",
    //     isShow: 1,
    //     iconType:2,
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
    //     functionName: "开通",
    //     functionNameEn: "开通",
    //     functionType: 1,
    //     url: "open",
    //     icon: "fabu",
    //     isShow: 1,
    //      iconType:2,
    //   },
    //   {
    //     functionName: "关闭",
    //     functionNameEn: "关闭",
    //     functionType: 1,
    //     url: "close",
    //     icon: "close",
    //     isShow: 1,
    //   },
    //    {
    //     functionName: "编辑",
    //     functionNameEn: "编辑",
    //     functionType: 1,
    //     url: "update",
    //     icon: "ic_edit",
    //     isShow: 1,
    //     iconType:2
    //   },
    //   {
    //     functionName: "删除",
    //     functionNameEn: "删除",
    //     functionType: 1,
    //     url: "delete",
    //     icon: "ic_delete",
    //     isShow: 1,
    //     iconType:2,
    //   },
    // ];
  },
  methods: {
    // 导出失败信息
    exportFail(data) {
      exportCheck(data)
        .then(() => {
        })
        .catch(() => {});
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getProductmodelList(this.listQuery).then(({ data }) => {
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

    //导出
    handleExport() {
      this.exportLoading = true;
      exportProductmodel(this.listQuery)
        .then(() => {
        })
        .finally(() => {
        this.exportLoading = false;
      })
    },
    // 新增成功
    addComplete() {
      this.listLoad();
    },
    // 编辑
    handleUpdate(row) {
      this.isEdit = true;
      this.tableRow = row;
      this.addUpdateVisible = true;
    },
    // 编辑成功
    updateComplete() {
      this.listLoad();
    },
    //开通
    handleOpen(row) {
      const stateData = {
        id: row.id,
        status: 1,
      };
      this.$confirm(`是否开通${row.productModel}产品型号?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          isOper(stateData).then(({ data }) => {
            if (data.code === 0) {
              this.$message.success({
                message: "开通成功",
                duration: 2 * 1000,
              });
              this.listLoad();
            }
          });
        })
        .catch(() => {});
    },
    //关闭
    handleClose(row) {
      const stateData = {
        id: row.id,
        status: 2,
      };
      this.$confirm(`是否关闭${row.productModel}产品型号?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          isOper(stateData).then(({ data }) => {
            if (data.code === 0) {
              this.$message.success({
                message: "关闭成功",
                duration: 2 * 1000,
              });
              this.listLoad();
            }
          });
        })
        .catch(() => {});
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        id: row.id,
        // vinno: this.tableRow.vinno
      };
      this.$confirm(`是否删除${row.productModel}产品型号?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ProductmodelDel(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
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
  },
};
</script>

<style lang="scss">

</style>
