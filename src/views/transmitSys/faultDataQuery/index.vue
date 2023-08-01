<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
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
        :buttonList="insideList"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'faultLevel'">
            {{
              scope.row[scope.item.prop]
                ? faultLevelList[scope.row[scope.item.prop]].label
                : "-"
            }}
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
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
import { getFaultData } from "@/api/transmitSys/faultDataQuery.js";
// 辅助函数
export default {
  name: "faultDataQuery",
  components: {},
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        faultLevel: "",
        vinNo: "",
        timeRange: [],
      },
      // 字段管理所需字段
      tableList: [
        {
          value: "企业名称",
          prop: "companyName",
          position: "center",
          checked: true,
          width: 140,
          fixed: "left",
        },
        {
          value: "VIN码",
          prop: "vinNo",
          position: "center",
          width: 170,
          checked: true,
        },
        {
          value: "故障等级",
          prop: "faultLevel",
          position: "center",
          width: 120,
          checked: true,
        },
        {
          value: "风险内容",
          prop: "faultContent",
          position: "center",
          checked: true,
          width: 140,
        },
        {
          value: "风险上报开始时间",
          prop: "startTime",
          position: "center",
          width: 140,
          checked: true,
        },
        {
          value: "风险上报结束时间",
          prop: "endTime",
          position: "center",
          width: 140,
          checked: true,
        },
      ],
      faultLevelList: [
        { value: 0, label: "不报警" },
        { value: 1, label: "一级" },
        { value: 2, label: "二级" },
        { value: 3, label: "三级" },
      ],
      isEdit: false, //是否编辑
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
        {
          label: "故障等级",
          value: "faultLevel",
          type: "select",
          options: {
            data: this.faultLevelList, //下拉数组
          },
        },
      ];
    },
  },
  methods: {
    // 加载数据
    listLoad() {
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";
      this.list = [];
      this.listLoading = true;
      this.listQuery.carType = null;
      getFaultData(this.listQuery)
        .then(({ data }) => {
          console.log(data);
          let { total = 0 } = data;
          if (data.code === 0) {
            this.list = data.data;
            this.total = total;
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
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";
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
