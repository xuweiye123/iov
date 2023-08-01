<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'90px'"
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
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
      <!-- :buttonList="insideList" -->
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
        :isShowOperation="isShowOperation"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isAudit'">
            <el-tag
              :type="scope.row[scope.item.prop] == 1 ? 'success' : 'info'"
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
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
          <div>
            <a v-for="(l, index) in insideList" :key="index">
              <el-tooltip
                class="item"
                effect="dark"
                :content="l.functionName"
                placement="top"
                :disabled="$store.state.app.isDisTooltip"
              >
                <span v-if="scope.row.isAudit == 1"> </span>
                <span
                  v-else
                  class="card-action"
                  @click="authouizeButtonAction(scope.row, l)"
                >
                  <i :class="'iconfont icon-' + l.icon"></i>
                </span>
              </el-tooltip>
            </a>
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
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";s
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";

// request
import {
  getCarGroup,
  deteleCarGroup,
  approvalCarGroup,
  exportCarGroup,
} from "@/api/carManageSys/carType";

// 辅助函数
export default {
  name: "carType",
  components: {
    addUpdateDrawer,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton, getDropList],
  data() {
    return {
      isShowOperation: true,
      listQuery: {
        carTypeName: "",
        carBatchCode: "",
        vcuPartNumber: "",
        mcuPartNumber: "",
        brandId:""
      },
      brandList: [
      ], //品牌
      addUpdateVisible: false /* 查看导出记录*/,
      isEdit: false, //是否编辑
      // 下拉
      dropList: [{ postData: { dicCode: 1001 }, key: "brandList" }],
      // 字段管理所需字段
      tableList: [
        {
          value: "车型名称",
          prop: "carTypeName",
          checked: true,
          width: 100,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          checked: true,
          width: 100,
        },
        {
          value: "品牌",
          prop: "brand",
          width: 100,
          checked: true,
        },
        {
          value: "VCU零部件号",
          prop: "vcuPartNumber",
          checked: true,
          width: 120,
        },
        {
          value: "MCU零部件号",
          prop: "mcuPartNumber",
          checked: true,
          width: 120,
        },
        {
          value: "录入人员",
          prop: "createdBy",
          checked: true,
          width: 100,
        },
        {
          value: "录入时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
        {
          value: "审核状态",
          prop: "isAudit",
          checked: true,
          width: 100,
        },
        {
          value: "备注",
          prop: "remark",
          checked: true,
          width: 150,
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
          label: "车型名称",
          value: "carTypeName",
          type: "input",
        },
        {
          label: "项目代号",
          value: "carBatchCode",
          type: "input",
          labelWidth:"65px"
        },
        {
          label: "品牌",
          value: "brandId",
          type: "select",
          labelWidth:"65px",
          options: {
            data: this.brandList,
          },
        },
        {
          label: "VCU零部件号",
          value: "vcuPartNumber",
          type: "input",
        },
        {
          label: "MCU零部件号",
          value: "mcuPartNumber",
          type: "input",
        },
      ];
    },
  },
  mounted() {
    // 数据字典下拉
    this.getDropList(this.dropList);
  },
  methods: {
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
      getCarGroup(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data || [];
            if (
              this.list.every((item) => {
                return item.isAudit == 1;
              })
            ) {
              this.isShowOperation = false;
            } else {
              this.isShowOperation = true;
            }
            this.total = data.total;
            this.tableRow = {};
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //操作列方法
    authouizeButtonAction(row, item) {
      switch (item.url) {
        case "update":
          this.handleUpdate(row);
          break;
        case "delete":
          this.handleDelete(row);
          break;
        case "approval":
          this.handleApproval(row);
          break;
        default:
          break;
      }
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 新增成功
    addComplete() {
      this.isShowOperation = true;
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },
    // 编辑
    handleUpdate(row) {
      this.tableRow = row;
      // if (row.isAudit === 1) {
      //   this.$message.warning({
      //     message: "已审核车型不可编辑",
      //     duration: 2 * 1000,
      //   });
      //   return;
      // }
      this.isEdit = true;
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
    // 删除
    handleDelete(row) {
      // if (row.isAudit === 1) {
      //   this.$message.warning({
      //     message: "已审核车型不可删除",
      //     duration: 2 * 1000,
      //   });
      //   return;
      // }
      const deleteData = {
        carTypeId: row.carTypeId,
        carBatchId: row.carBatchId,
        carTypeName: row.carTypeName,
        carBatchCode: row.carBatchCode,
      };
      this.$confirm(`是否删除${row.carTypeName}车型名称?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deteleCarGroup(deleteData).then(({ data }) => {
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
    // 审核
    handleApproval(row) {
      // if (row.isAudit === 1) {
      //   this.$message.warning({
      //     message: "已审核车型不可继续审核",
      //     duration: 2 * 1000,
      //   });
      //   return;
      // }
      const postData = {
        carTypeId: row.carTypeId,
        carBatchId: row.carBatchId,
      };
      this.$confirm(`是否审核${row.carTypeName}车型名称?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          approvalCarGroup(postData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "审核成功",
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
      exportCarGroup(this.listQuery).then(({ data }) => {
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
