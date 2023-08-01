<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'65px'"
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
        @click-approval="handleApproval"
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
            v-if="scope.item.prop === 'vinNo'"
          >
            {{ scope.row[scope.item.prop] | processData }}
          </span>
          <span v-else-if="scope.item.prop == 'status'">
            <el-tag
              :type="
                scope.row.status === 1
                  ? 'success'
                  : scope.row.status === 2
                  ? 'danger'
                  : 'info'
              "
              effect="dark"
              style="width: 80px;"
            >
              {{
                scope.row["status"] === 1
                  ? "审核通过"
                  : scope.row["status"] === 2
                  ? "审核不通过"
                  : scope.row["status"] === 0
                  ? "未审核"
                  : "-"
              }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop == 'bindType'">
            {{
              scope.row[scope.item.prop] == "1"
                ? "整体更换"
                : scope.row[scope.item.prop] == "2"
                ? "新终端新卡"
                : scope.row[scope.item.prop] == "3"
                ? "新终端旧卡"
                : "-"
            }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
          <div style="text-align: left !important">
            <el-tooltip
              v-for="(l, index) in insideList"
              :key="index"
              :open-delay="250"
              class="item"
              effect="dark"
              :content="l.functionName"
              placement="top"
              :disabled="$store.state.app.isDisTooltip"
            >
              <span
                class="card-action"
                v-if="l.url === 'update' && scope.row['status'] == 0"
                @click="handleUpdate(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="l.url === 'delete' && scope.row['status'] != 1"
                @click="handleDelete(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="l.url === 'approval' && scope.row['status'] == 0"
                @click="handleApproval(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
            </el-tooltip>
          </div>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
    <!-- 查看 -->
    <detail-drawer :data="tableRow" :visibles.sync="detailVisible" />
    <!-- 审核 -->
    <approval-drawer
      :data="tableRow"
      :visibles.sync="approvalVisible"
      @approval-complete="approvalComplete"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import {
  getTodayTime0,
  getTodayEndTime,
  beginTimeAndEndTime,
} from "@/utils/base";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import detailDrawer from "./components/detailDrawer";
import approvalDrawer from "./components/approvalDrawer";
import {
  getTerminalPageList,
  deleteHandle,
  exportHandle,
} from "@/api/carManageSys/terminalReplace";

// 辅助函数
export default {
  name: "terminalReplaceBind",
  components: {
    addUpdateDrawer,
    detailDrawer,
    approvalDrawer,
  },
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        iccid: "",
        status: "",
        terminalCode: "",
        barCode: "",
        // startTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
        timeRange:["",""],
      },
      stateList: [
        { label: "未审核", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "审核未通过", value: 2 },
      ],
      addUpdateVisible: false /* 添加/编辑、 */,
      detailVisible: false /* 查看*/,
      approvalVisible: false /* 审核 */,
      isEdit: false, //是否编辑
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "服务站名称",
          prop: "stationName",
          width: 140,
          checked: true,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          width: 120,
          checked: true,
        },
        // {
        //   value: "系统终端编号",
        //   prop: "terminalCode",
        //   width: 100,
        //   checked: true,
        // },
        // {
        //   value: "系统TBOXSN",
        //   prop: "barCode",
        //   width: 240,
        //   checked: true,
        // },
        {
          value: "原终端编号",
          prop: "oldTerminalCode",
          width: 100,
          checked: true,
        },
        {
          value: "新终端编号",
          prop: "newTerminalCode",
          width: 100,
          checked: true,
        },
        {
          value: "原TBOXSN",
          prop: "oldBarCode",
          width: 150,
          checked: true,
        },
        {
          value: "新TBOXSN",
          prop: "newBarCode",
          width: 150,
          checked: true,
        },
        // {
        //   value: "系统ICCID",
        //   prop: "iccid",
        //   width: 180,
        //   checked: true,
        // },
        {
          value: "原ICCID1",
          prop: "oldIccidOne",
          width: 180,
          checked: true,
        },
        {
          value: "原ICCID2",
          prop: "oldIccidTwo",
          width: 180,
          checked: true,
        },
        {
          value: "新ICCID1",
          prop: "newIccidOne",
          width: 180,
          checked: true,
        },
        {
          value: "新ICCID2",
          prop: "newIccidTwo",
          width: 180,
          checked: true,
        },
        // {
        //   value: "换绑类型",
        //   prop: "bindType",
        //   width: 100,
        //   checked: true,
        // },
        {
          value: "审核状态",
          prop: "status",
          width: 110,
          checked: true,
        },
        {
          value: "创建日期",
          prop: "createdOn",
          width: 150,
          checked: true,
        },
        {
          value: "审核日期",
          prop: "auditTime",
          width: 150,
          checked: true,
        },
        {
          value: "审核备注",
          prop: "auditContent",
          width: 140,
          checked: true,
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
          label: "VIN码",
          value: "vinNo",
          type: "vin",
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: "dateTime",
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: "dateTime",
        //   defaultType: "end",
        // },
        {
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        },
        {
          label: "TBOXSN",
          value: "barCode",
          type: "input",
        },
        {
          label: "ICCID",
          value: "iccid",
          type: "input",
        },
        {
          label: "审核状态",
          value: "status",
          type: "select",
          options: {
            data: this.stateList,
          },
        },
      ];
    },
    isShowButton() {
      return this.insideList.filter(
        (item) => item.url == "update" || item.url == "approval"
      );
    },
  },
  mounted() {},
  methods: {
    // handleClear() {
    //   this.listQuery = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     vinNo: "",
    //     iccid: "",
    //     status: "",
    //     terminalCode: "",
    //     barCode: "",
    //     timeRange:[getTodayTime0(),getTodayEndTime()],
    //     // startTime: getTodayTime0(),
    //     // endTime: getTodayEndTime(),
    //   };
    //     this.listLoad();
    // },
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
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.list = [];
      this.listLoading = true;
      getTerminalPageList(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
            this.tableRow = {};

            // 根据每页按钮的状态来显示操作列宽度
            if (
              this.list.every((item) => {
                return item.status == 1;
              })
            ) {
              this.actionFixed = "false";
            } else if (
              this.list.every((item) => {
                return item.status == 2;
              })
            ) {
              this.actionFixed = "right";
              this.actionWidth = this.operateWidth(
                this.insideList.length - this.isShowButton.length
              );
            } else {
              this.actionFixed = "right";
              this.actionWidth = this.operateWidth(this.insideList.length);
            }
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 新增
    handleAdd() {
      this.isEdit = false;
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
      if (row.status != 0) {
        this.$message.warning({
          message: "已审核终端不可编辑",
          duration: 2 * 1000,
        });
        return;
      }
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.tableRow = row;
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
      const deleteData = {
        vinNo: row.vinNo,
        id: row.terminalAlterAuditId,
      };
      this.$confirm(`是否删除${row.vinNo}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteHandle(deleteData).then(({ data }) => {
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
      this.tableRow = row;
      this.approvalVisible = true;
    },
    // 审核完成
    approvalComplete() {
      this.listLoad();
    },
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportHandle(this.listQuery).then(({ data }) => {
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
    // 查看历史记录
    handleLook(row) {
      this.detailVisible = true;
      this.tableRow = row;
    },
  },
};
</script>

<style lang="scss" scoped></style>
