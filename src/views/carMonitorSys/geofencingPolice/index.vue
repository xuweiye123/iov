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
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'alarmType'" >
            <el-tag
              :type="
                scope.row[scope.item.prop] == 1
                 ?'success'
                : ''
              "
              effect="dark"
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop] == 0
                  ? "驶出"
                  : scope.row[scope.item.prop] == 1
                  ? "驶入"
                  : "-"
              }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop == 'alarmSubType'" >
            <el-tag
              :type="
                scope.row[scope.item.prop] == 1
                 ?'danger'
                : 'info'
              "
              effect="dark"
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop] == 1
                  ? "超速"
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
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

// request
import { getPagelist, exportCar } from "@/api/carMonitorSys/geofencingPolice";

import { beginTimeAndEndTime } from "@/utils/base";
// 辅助函数
export default {
  name: "geofencingPolice",
  components: {},
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        alarmType: "",
        geofenceRulesName: "",
        startTime: "",
        endTime: "",
        isEnd: 0,
        timeRange:["",""],
      },
      alarmTypeList: [
        { label: "驶出", value: 0 },
        { label: "驶入", value: 1 },
      ],
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "报警名称",
          prop: "geofenceRulesName",
          width: 100,
          checked: true,
        },
        {
          value: "报警类型",
          prop: "alarmType",
          width: 90,
          checked: true,
        },
        {
          value: "报警子类型",
          prop: "alarmSubType",
          width: 90,
          checked: true,
        },
        {
          value: "当前报警车速",
          prop: "currentAlarmSpeed",
          width: 120,
          checked: true,
        },
        {
          value: "开始时间",
          prop: "startTime",
          width: 140,
          checked: true,
        },
        {
          value: "结束时间",
          prop: "endTime",
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
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
        {
          label: "报警名称",
          value: "geofenceRulesName",
          type: "input",
        },
        {
          label: "报警类型",
          value: "alarmType",
          type: 'select',
          options: {
            data: this.alarmTypeList,
          },
        },
      ];
    },
  },
  mounted() {
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
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listQuery.isEnd=0
      this.listQuery.userId = this.$store.state.user.userInfo.userId
      this.listLoading = true;
      getPagelist(this.listQuery)
        .then(({ data }) => {
          this.list = [];
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
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportCar(this.listQuery).then(({ data }) => {
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
