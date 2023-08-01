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
        :isdisabled="listLoading"
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-add="handleAdd"
        @click-import="importVisible = true"
        @click-export="handleExport"
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
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :isShowOperation="true"
        :buttonList="insideList"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @click-look="handleLook"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
						@click="handleLook(scope.row)"
						class="vinNo"
						v-if="scope.item.prop === 'productTypeNumber'"
					>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
          <span
            v-else-if="scope.item.prop === 'status'"
          >
             <el-tag
              :type="
                scope.row[scope.item.prop] == 1
                 ?'success'
                : 'info'
              "
              effect="dark"
              style="width: 65px;"
            >
              {{  
                scope.row[scope.item.prop] == 0
                ? "未审核"
                : scope.row[scope.item.prop] == 1
                ? "已审核"
                : "-"
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
    </div>

    <!-- 新增编辑dialog弹窗 -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :is-detail="isDetail"
      :data="isEdit || isDetail ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
      @approval-complete="approvalComplete"
    />

    <!-- 导入dialog弹窗 -->
    <import-dialog
      :action="'api/vehicle/productType/importProductType'"
      :template-url="'api/vehicle/fileStatics/ImportProductNumber.xlsx'"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'行数'"
        :keys="'row'"
        :message="'无导入失败信息'"
        :is-show="false"
      >
      </result-dialog>
    </import-dialog>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";

// request
import {
  getProduct,
  deletePruduct,
  exportProductType,
} from "@/api/carManageSys/productType";

// 辅助函数
export default {
  name: "productType",
  CH_name:"产品型号管理",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        productTypeNumber: "",
      },
      addUpdateVisible: false /* 查看导出记录*/,
      isEdit: false, //是否编辑
      isDetail: false, //是否查看
      importVisible: false,
      resultVisible: false,
      importResult: {},
      // 字段管理所需字段
      tableList: [
        {
          value: "产品型号",
          prop: "productTypeNumber",
          checked: true,
          width:160,
        },
        {
          value: "状态",
          prop: "status",
          checked: true,
          width:120
        },
        {
          value: "创建人",
          prop: "createdBy",
          checked: true,
          width:120
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width:140
        },
        {
          value: "备注",
          prop: "remark",
          checked: true,
          width:120
        },
      ],
    };
  },
  watch: {},
  computed: {
   // 查询区数据
    searchList() {
      return [
        {
          label: "产品型号",
          value: "productTypeNumber",
          type: "input",
        },
      ];
    },
  },
  mounted() {
  },
  methods: {
    // 导入成功之后刷新list
    reloadList(data) {
      if (data.failedList&&data.failedList.length > 0) {
        this.importResult = data;
        this.resultVisible = true; 
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
      this.listLoad(data);
    },
    // 点击列
    rowClick({ row }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
    },
    // 判断是否选中
    tableRowIsSlect() {
      const { $index } = this.tableRow;
      if ($index === undefined) {
        return false;
      } else {
        return true;
      }
    },
    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getProduct(this.listQuery)
        .then(({ data }) => {
      if (data.code === 0) {
        this.list = data.data;
        this.total = data.total;
        this.tableRow = {};
      }
      this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
      });
    },
    // 查看
    handleLook(row) {
      this.isDetail = true;
      this.isEdit = false;
      this.tableRow = row;
      this.addUpdateVisible = true;
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.isDetail = false;
      this.addUpdateVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },
    // 编辑
    handleUpdate(row) {
      this.tableRow = row;
      if (row.status === 1) {
        this.$message.warning({
          message: "已审核记录,不可编辑",
          duration: 2 * 1000,
        });
        return;
      }
      this.isEdit = true;
      this.isDetail = false;
      this.addUpdateVisible = true;
    },
    // 编辑成功
    updateComplete() {
      this.listLoad();
      this.$message.success({
        message: "编辑成功",
        duration: 2 * 1000,
      });
    },
    // 审核成功
    approvalComplete() {
      this.listLoad();
      this.$message.success({
        message: "审核成功",
        duration: 2 * 1000,
      });
    },
    // 删除
    handleDelete(row) {
      // if (row.isaudit === 1) {
      //   this.$message.warning({
      //     message: "已审核车型不可删除",
      //     duration: 2 * 1000,
      //   });
      //   return;
      // }
      const deleteData = {
        productTypeId: row.productTypeId,
        productTypeNumber: row.productTypeNumber,
      };
      this.$confirm(`是否删除产品型号为${row.productTypeNumber}的数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePruduct(deleteData).then(({ data }) => {
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
    // 导出
    handleExport() {
      this.exportLoading = true;
      exportProductType(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功！",
            duration: 2 * 1000,
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
