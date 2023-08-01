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
        @click-testing="handleTesting"
        @click-detailCar="lookCar"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="
              scope.item.prop === 'isApproval' || scope.item.prop === 'status'
            "
          >
            <el-tag
              :type="scope.row[scope.item.prop] == 1 ? 'success' : 'danger'"
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop == 'approvalBy'">
            {{
              scope.row[scope.item.prop]
                ? scope.row[scope.item.prop].split("@")[0]
                : "-"
            }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <testing-drawer
      :visibles.sync="testingVisible"
      :data="tableRow"
      @prove-complete="proveComplete"
    ></testing-drawer>
    <look-drawer :visibles.sync="lookVisible" :data="tableRow"></look-drawer>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { getPageList, paramexports } from "@/api/carMonitorSys/dbcFileTest";
// 组件
import testingDrawer from "./components/testingDrawer";
import lookDrawer from "./components/lookDrawer";
// 辅助函数
export default {
  name: "dbcFileTest",
  components: {
    lookDrawer,
    testingDrawer,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        fileName: "",
        fullDbcName: "",
        status: "",
        isApproval: "",
      },
      statusList: [
        { label: "不符合", value: 0 },
        { label: "符合", value: 1 },
      ],
      isApprovalList: [
        { label: "已审核", value: 1 },
        { label: "未审核", value: 0 },
      ],
      // 字段管理所需字段
      tableList: [
        {
          value: "DBC文件名称",
          prop: "fileName",
          width: 180,
          checked: true,
        },
        {
          value: "DBC文件路径",
          prop: "fullDbcName",
          width: 180,
          checked: true,
        },
        {
          value: "DBC参数数量",
          prop: "variablesCount",
          width: 110,
          checked: true,
        },
        {
          value: "国标参数数量",
          prop: "nationalParameterCount",
          width: 110,
          checked: true,
        },
        // {
        //   value: "车辆数",
        //   prop: "vinNoCount",
        //   width: 80,
        //   checked: true,
        // },
        {
          value: "上传时间",
          prop: "uploadTime",
          width: 140,
          checked: true,
        },
        {
          value: "审核时间",
          prop: "approvalOn",
          width: 140,
          checked: true,
        },
        {
          value: "审核人",
          prop: "approvalBy",
          width: 90,
          checked: true,
        },
        {
          value: "审核状态",
          prop: "status",
          width: 90,
          checked: true,
        },
        {
          value: "是否审核",
          prop: "isApproval",
          width: 90,
          checked: true,
        },
      ],
      title: "",
      testingVisible: false,
      lookVisible: false,
    };
  },
  watch: {},
  filters: {
    switchText(val, type) {
      if (type === "isApproval") {
        return val === 1 ? "已审核" : val === 0 ? "未审核" : "-";
      } else if (type === "status") {
        return val === 1 ? "符合" : val === 0 ? "不符合" : "-";
      } else {
        return val || (val === 0 ? val : "-");
      }
    },
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "DBC文件名称",
          value: "fileName",
          type: "input",
        },
        {
          label: "DBC文件路径",
          value: "fullDbcName",
          type: "input",
        },
        {
          label: "审核状态",
          value: "status",
          type: "select",
          options: {
            data: this.statusList,
          },
        },
        {
          label: "是否审核",
          value: "isApproval",
          type: "select",
          options: {
            data: this.isApprovalList,
          },
        },
      ];
    },
  },
  mounted() {},
  methods: {
    // 导出
    handleExport() {
      this.exportLoading = true;
      paramexports(this.listQuery).then(({ data }) => {
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
    rowClick(data) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === data.row.id) {
          data.row.$index = index;
        }
      });
      this.tableRow = data.row;
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
      getPageList(this.listQuery)
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

    // 查看车辆信息
    lookCar(row) {
      this.tableRow = row;
      this.lookVisible = true;
    },
    // 检测
    handleTesting(row) {
      this.tableRow = row;
      this.testingVisible = true;
    },
    // 下载完成
    proveComplete() {
      this.listLoad();
    },
  },
};
</script>

<style lang="scss" scoped></style>
