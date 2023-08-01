<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'80px'"
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空查询按钮 -->
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
        :tableHeights="tableHeight"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :buttonList="insideList"
        :isShowOperation="true"
        @click-detail="queryResult"
        @click-detailCommand="queryCommand"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'status'">
            <el-tag
              :type="scope.row.status == '成功' ? 'success' : 'danger'"
              effect="dark"
              style="width: 50px"
            >
              {{ scope.row[scope.item.prop] | processData }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop === 'userName'">
            {{
              scope.row[scope.item.prop]
                ? scope.row[scope.item.prop].split("@")[0]
                : "-"
            }}
          </span>
          <span v-else> {{ scope.row[scope.item.prop] | processData }}</span>
        </template>
      </app-table>
    </div>
    <!-- 查看诊断结果 -->
    <dig-result
      :visibles.sync="digResultVisible"
      :digTitle="digTitle"
      :digType="digType"
      :vin="controlVin"
      :digServiceId="digServiceId"
    />

    <query-command :visibles.sync="queryCommandVisible" :data="tableRow" />
  </div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
//组件
import digResult from "./components/queryDigResult";
import queryCommand from "./components/queryCommand";
// request
import { getDxOperLog, exportDigLog } from "@/api/diagnosisSys/digLog";

export default {
  name: "digLog",
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  components: {
    digResult,
    queryCommand,
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "用户名",
          value: "loginName",
          type: "input",
        },
        {
          label: "用户姓名",
          value: "realName",
          type: "input",
        },
        {
          label: "操作模块",
          value: "operateModule",
          type: "input",
        },
        {
          label: "分系统/ECU名称",
          value: "subSystemName",
          type: "input",
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
      ];
    },
  },
  data() {
    return {
      listQuery: {
        startTime: "",
        endTime: "",
        timeRange:["",""],
      },
      componentAuthouizeList: [],
      tableList: [
        {
          value: "用户名",
          prop: "loginName",
          checked: true,
          width: 170,
        },
        {
          value: "用户姓名",
          prop: "userName",
          checked: true,
          width: 100,
        },
        {
          value: "操作时间",
          prop: "operateTime",
          checked: true,
          width: 140,
        },
        {
          value: "受控车辆",
          prop: "vinNo",
          checked: true,
          width: 180,
        },
        {
          value: "操作模块",
          prop: "operateModule",
          checked: true,
          width: 120,
        },
        {
          value: "分系统/ECU名称",
          prop: "subSysName",
          checked: true,
          width: 140,
        },
        {
          value: "客户端ip",
          prop: "operateIp",
          checked: true,
          width: 100,
        },
        {
          value: "浏览器",
          prop: "operateBrowser",
          checked: true,
          width: 100,
        },
        {
          value: "操作结果状态",
          prop: "status",
          checked: true,
          width: 100,
        },
      ],
      digResultVisible: false, //查看诊断结果dialog
      digServiceId: "",
      digTitle: "", //诊断标题
      digType: "", //诊断类型
      controlVin: "", //受控车辆
      queryCommandVisible: false, //查看命令结果dialog
    };
  },
  methods: {
    // 导出
    handleExport() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
      exportDigLog(this.listQuery).finally(() => {
        this.exportLoading = false;
      })
    },
    // 加载数据
    listLoad() {
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.listLoading = true;
      getDxOperLog(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    queryResult(row) {
      this.digServiceId = row.token;
      this.digResultVisible = true;
      let title = row.operateModule;
      let type = "";
      switch (row.operateModule) {
        case "一键读取整车故障":
          title = "读取整车故障";
          type = "1";
          break;
        case "一键清除整车故障":
        case "清除整车故障":
          title = "清除整车故障";
          type = "5";
          break;
        case "读取当前故障":
          type = "2";
          break;
        case "读取历史故障":
          type = "3";
          break;
        case "读取冻结帧":
          type = "4";
          break;
        case "读取整车数据流":
          type = "7";
          break;
        case "写入零部件":
          type = "8";
          break;
        case "打印诊断报告":
          type = "12";
          this.controlVin = row.vin;
          break;
      }
      title += "结果";
      this.digTitle = title;
      this.digType = type;
    },
    queryCommand(row) {
      if (row) this.tableRow = row;
      this.queryCommandVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
