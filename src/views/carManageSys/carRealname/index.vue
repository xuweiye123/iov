<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'85px'" 
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
        :buttonList="insideList"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop=='syncResult'">
            <el-tag
              :type="
                scope.row[scope.item.prop] == '成功'
                 ?'success'
                : 'danger'
              "
              effect="dark"
              style="width: 50px;"
            >
              {{ scope.row[scope.item.prop] | processData}}
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
// utils
import { getTodayTime0, getTodayEndTime,beginTimeAndEndTime } from "@/utils/base";
// 组件

import { getPageList, exportsData } from "@/api/carManageSys/realname";

// 辅助函数
export default {
  name: "carRealname",
  components: {},
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        iccid: "",
        syncResult: "",
        auditResult: "",
        // startTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
        timeRange:["",""],
      },
      auditResultList: [
        { label: "审核通过", value: 0 },
        { label: "审核不通过", value: 1 },
        { label: "审核中", value: 2 },
        { label: "待提交审核资料", value: 3 },
        { label: "已解绑", value: 4 },
      ],
      syncResultList: [
        { label: "成功", value: 0 },
        { label: "失败", value: 1 },
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
          value: "ICCID",
          prop: "iccid",
          width: 160,
          checked: true,
        },
        {
          value: "IMEI",
          prop: "imei",
          width: 95,
          checked: true,
        },
        {
          value: "实名认证结果",
          prop: "auditResult",
          width: 120,
          checked: true,
        },
        {
          value: "同步结果",
          prop: "syncResult",
          width: 95,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
        {
          value: "更新时间",
          prop: "modifiedOn",
          width: 140,
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width: 150,
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
          type: 'vin',
        },
        {
          label: "创建时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
        // {
        //   label: "创建开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "创建结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
        {
          label: "ICCID",
          value: "iccid",
          type: 'input',
          labelWidth:"65px"
        },
        {
          label: "实名认证结果",
          value: "auditResult",
          type: 'select',
          options: {
            data: this.auditResultList,
          },
        },
        {
          label: "同步结果",
          value: "syncResult",
          type: 'select',
          options: {
            data: this.syncResultList,
          },
        },
      ];
    },
  },
  mounted() {
  },
  methods: {
    // handleClear() {
    //   this.listQuery = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     vinNo: "",
    //     syncResult: "",
    //     auditResult: "",
    //     iccid: "",
    //     // startTime:getTodayTime0(),
    //     // endTime: getTodayEndTime(),
    //     timeRange:[getTodayTime0(),getTodayEndTime()],
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

    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportsData(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功",
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
