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
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'success'">
            <el-tag
              :type="
                  scope.row.success == 1
                  ? 'success'
                  : 'danger'
              "
              effect="dark"
              style="width: 50px;"
            >
              {{ scope.row['success'] ===1 ? '成功' : '失败' }}
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
import { getTodayTime0, getTodayEndTime,} from "@/utils/base";
import { mapGetters } from "vuex";

// request
import {
  getLoginLog
} from "@/api/system/log";

// 辅助函数
export default {
  name: "loginLog",
  filters: {
    switchText(val, type) {
      if (type === "success") {
        return val === 0 ? "失败" : " 成功";
      }
    },
  },
  mixins: [
    pagingMixin,
    otherHeight,
    tableStyle,
    getPageButton,
  ],
  data() {
    return {
      listQuery: {
        loginName: "",
        email: "",
        mobile: "",
        // startTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
        ipAddress: "",
        success: "",
        timeRange:[getTodayTime0(),getTodayEndTime()],
        // userType: "",
      },
      loginResult: [
        { label: "成功", value: 1 },
        { label: "失败", value: 0 },
      ],
      // 字段管理所需字段
      tableList: [
        {
          value: "用户名",
          prop: "loginName",
          width: 125,
          // sortable:true,
          checked: true,
          fixed: "left",
          position: "center",
        },
        {
          value: "工作邮箱",
          prop: "email",
          width: 160,
          // sortable:true,
          checked: true,
          position: "center",
        },
        {
          value: "手机号码",
          prop: "mobile",
          width: 100,
          // sortable:true,
          checked: true,
          position: "center",
        },
        // {
        //   value: "用户名",
        //   prop: "email",
        //   position: "center",
        //   // sortable: "custom",
        //   width: 110,
        //   checked: true,
        // },
        // {
        //   value: "用户姓名",
        //   prop: "realName",
        //   position: "center",
        //   // sortable: "custom",
        //   width: 150,
        //   checked: true,
        // },
        {
          value: "登录时间",
          prop: "loginTime",
          position: "center",
          // sortable: "custom",
          width: 150,
          checked: true,
        },
        {
          value: "客户端IP",
          prop: "ipAddress",
          position: "center",
          // sortable: "custom",
          width: 150,
          checked: true,
        },
        {
          value: "客户端浏览器",
          prop: "explore",
          position: "center",
          width: 150,
          // sortable: "custom",
          checked: true,
        },
        {
          value: "登录结果",
          prop: "success",
          position: "center",
          // sortable: "custom",
          checked: true,
          width: 80,
        },
        // {
        //   value: "用户类型",
        //   prop: "userType",
        //   position: "center",
        //   // sortable: "custom",
        //   checked: true,
        //   width: 80,
        // },
        // {
        //   value: "会话ID",
        //   prop: "sessionid",
        //   position: "center",
        //   sortable: "custom",
        //   checked: true,
        // },
      ],
      selectDate:'',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate? minDate.getTime():''
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
         if (this.selectDate !== '') {
            const one = 6 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["commontData"]),
    // 查询区数据
    searchList() {
      return [
        {
          label: "用户名",
          value: "loginName",
          type: "input",
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
          pickerOptions:this.pickerOptions
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
          label: "工作邮箱",
          value: "email",
          type: "input",
        },
        {
          label: "手机号码",
          value: "mobile",
          type: "input",
        },
        {
          label: "客户端IP",
          value: "ipAddress",
          type: "input",
        },
        {
          label: "登录结果",
          value: "success",
          type: "select",
          options: {
            data: this.loginResult,
          },
        },
        
        // {
        //   label: "用户类型",
        //   value: "userType",
        //   type: 'select',
        //   options: {
        //     data: this.commontData.usertypeList,
        //   },
        // },
      ];
    },
  },
  mounted() {
    
  },
  methods: {
    handleClear() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        loginName: "",
        email: "",
        mobile: "",
        // startTime: getTodayTime0(),
        // endTime: getTodayEndTime(),
        ipAddress: "",
        success: "",
        timeRange:[getTodayTime0(),getTodayEndTime()],
        // userType: "",
      };
      this.listLoad();
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
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      if (!this.listQuery.startTime||!this.listQuery.endTime) {
        this.$message.warning({
          message: "请输入所有查询时间!",
          duration: 2 * 1000,
        });
        return;
      }
      this.listLoading = true;
      this.list = [];
      getLoginLog(this.listQuery)
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
  },
};
</script>

<style lang="scss" scoped></style>
