<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
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
        @click-exportRight="handleExport"
        @click-filter="showfilter = true"
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
        :isShowOperation="false"
        :tableHeights="tableHeight"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'loginType'">
            {{ scope.row[scope.item.prop] == 1 ? "主动登出" : "主动登入" }}
          </span>
          <span
            v-else-if="scope.item.prop === 'batteryCode'"
            :style="{
              color:
                scope.row[scope.item.prop].includes('�') ||
                !scope.row[scope.item.prop]
                  ? 'red'
                  : '',
            }"
          >
            {{ isbatteryCode(scope.row[scope.item.prop]) }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] ||
              (scope.row[scope.item.prop] == "0"
                ? scope.row[scope.item.prop]
                : "-")
            }}
          </span>
        </template>
      </app-table>
    </div>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { getCarLoginOut } from "@/api/transmitSys/gbLoginAndLogoutQuery.js";
// 辅助函数
export default {
  name: "gbLoginAndLogoutQuery",
  components: {},
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        timeRange: [],
      },
      // 字段管理所需字段
      tableList: [
        {
          value: "企业名称",
          prop: "companyName",
          position: "center",
          width: 180,
          checked: true,
          fixed: "left",
        },
        {
          value: "VIN码",
          prop: "vinNo",
          position: "center",
          width: 180,
          checked: true,
        },
        {
          value: "登入流水号",
          prop: "loginSerialNum",
          position: "center",
          width: 120,
          checked: true,
        },
        {
          value: "登出流水号",
          prop: "outSerialNum",
          width: 120,
          position: "center",
          checked: true,
        },
        {
          value: "登入时间",
          prop: "loginTime",
          position: "center",
          width: 140,
          checked: true,
        },
        {
          value: "登出时间",
          prop: "outTime",
          position: "center",
          width: 140,
          checked: true,
        },
        {
          value: "ICCID",
          prop: "iccid",
          position: "center",
          width: 180,
          checked: true,
        },
        {
          value: "可充电储能子系统数",
          prop: "batteryCount",
          position: "center",
          width: 150,
          checked: true,
        },
        {
          value: "可充电储能系统编码",
          prop: "batteryCode",
          position: "center",
          width: 200,
          checked: true,
        },
        {
          value: "可充电储能系统编码长度",
          prop: "batteryCodeLength",
          position: "center",
          width: 170,
          checked: true,
        },
        {
          value: "登入状态",
          prop: "loginType",
          position: "center",
          width: 100,
          checked: true,
        },
      ],
      listLoading: false,
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
          type: "dateTimeRange",
          spanNumber: 12,
        },
      ];
    },
  },
  methods: {
    isbatteryCode(item) {
      //判断item字符串包含�
      if (item.includes("�") || !item) {
        return "-";
      } else {
        return item;
      }
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";
      let parms = {
        ...this.listQuery,
        carType: null,
      };
      getCarLoginOut(parms)
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
    /**
     * @name: 导出
     * @param {*}
     */
    handleExport() {
      exportCar(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功",
            duration: 2 * 1000,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.defaults {
  border-bottom: 1px solid #109cff;
}
.errors {
  border-bottom: 1px solid #ff0000;
}
.queue::before {
  content: "";
  display: block;
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00d2cb;
  border-radius: 50%;
}
</style>
