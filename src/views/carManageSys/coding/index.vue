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
        @click-exportData="handExportData"
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
        :buttonList="insideList"
        :isShowOperation="true"
        @click-detail="handleDetail"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'flag'">
            <el-tag
              :type="scope.row.flag === 0 ? 'success' : 'info'"
              effect="dark"
              style="width: 50px;"
            >
              {{
                scope.row["flag"] === 0
                  ? "否"
                  : scope.row["flag"] === 1
                  ? "是"
                  : "-"
              }}
            </el-tag>
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 查看配置规则dialog弹窗 -->
    <detail-drawer :data="tableRow" :visibles.sync="viewDetailVisible" />
    <!-- 查看导出记录 -->
    <export-data-drawer
      :visibles.sync="exportDataVisible"
      :file-type="fileType"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

// 组件
import exportDataDrawer from "@/components/carManageSys/exportDataDrawer";
import detailDrawer from "./components/detailDrawer";

// request
import {
  getEquipmentPageList,
  exportEquipmentNew,
} from "@/api/carManageSys/coding";

// 辅助函数
export default {
  name: "coding",
  components: { exportDataDrawer, detailDrawer },
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        terminalCode: "",
        iccid: "",
        bmsCode: "",
        motorCode: "",
        flag: "",
      },
      flagList: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
      fileType: null,
      exportDataVisible: false /* 查看导出记录*/,
      viewDetailVisible: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          width: 90,
          checked: true,
        },
        {
          value: "ICCID",
          prop: "iccid",
          width: 170,
          checked: true,
        },
        {
          value: "动力电池编码",
          prop: "bmsCode",
          width: 240,
          checked: true,
        },
        {
          value: "驱动电机编码",
          prop: "motorCode",
          width: 260,
          checked: true,
        },
        {
          value: "是否异常",
          prop: "flag",
          width: 80,
          checked: true,
        },
        {
          value: "变更时间",
          prop: "changedTime",
          width: 140,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdTime",
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
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        },
        {
          label: "ICCID",
          value: "iccid",
          type: "input",
        },
        {
          label: "动力电池编码",
          value: "bmsCode",
          type: "input",
        },
        {
          label: "驱动电机编码",
          value: "motorCode",
          type: "input",
        },
        {
          label: "是否异常",
          value: "flag",
          type: "select",
          options: {
            data: this.flagList,
          },
        },
      ];
    },
  },
  mounted() {},
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
      getEquipmentPageList(this.listQuery)
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
    //查看变更明细
    handleDetail(row) {
      this.tableRow = row;
      this.viewDetailVisible = true;
    },
    //导出记录
    handExportData() {
      this.exportDataVisible = true;
      this.fileType = 4;
    },

    // 导出
    handleExport() {
      if (this.listQuery.flag == "") {
        this.listQuery.flag = "";
      } else if (params.flag === 0) {
        this.listQuery.flag = "否";
      } else if (params.flag === 1) {
        this.listQuery.flag = "是";
      }
      this.exportLoading = true;
      exportEquipmentNew(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "任务创建成功，请在导出记录中查看生成进度",
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
