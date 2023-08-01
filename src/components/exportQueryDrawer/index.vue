<template>
  <div>
    <app-drawer
      :visibles.sync="visibles"
      :title="'导入任务详情'"
      :wrapperClosable="true"
      width="70%"
      @close-drawer="closeDrawer"
      :isDrawerFoot="false"
    >
      <!-- table -->
      <div slot="drawerContent">
        <app-search :show-title="false">
          <div slot="content">
            <seach-form
              :spanNumber="8"
              :collapse="collapse"
              :listQuery="listQuery"
              :searchList="searchList"
            />
          </div>
          <!-- 清空按钮 -->
          <app-search-button
            @click-collapse="handleCollapse"
            slot="bottom"
            :isdisabled="listLoading"
            @click-filter="handleFilter"
            @click-clear="handleClear"
          />
        </app-search>
        <div class="section-wrap">
          <app-table
            ref="tableList"
            size="mini"
            :listLoading="listLoading"
            :list="list"
            :pageObj="listQuery"
            :isTableNumber="true"
            :isTableSelection="false"
            :filterTableList="filterTableList"
            :total="total"
            :tableHeights="tableHeight"
						@sort-change="sortChange"
						@handle-size-change="handleSizeChange"
						@handle-current-change="handleCurrentChange"
          >
            <template slot="tableContent" slot-scope="scope">
              <!--  :href="
                  `file/Download/tmp/excel/downloadCarStatus/${
                    scope.row[scope.item.prop]
                  }.xlsx`
                " -->
                <span
                  v-if="
                  scope.item.prop == 'taskName' && scope.row['taskStatus'] == 3
                "
                >
                  <el-tooltip 
                      class="item" 
                      effect="dark" 
                      :content="'点击下载文件'"
                      placement="top">
                    <a
                      :href="scope.row.downloadPath"
                      class="vinno"
                      >{{ scope.row[scope.item.prop] | processData}}</a
                    >
                  </el-tooltip>
              </span>
              <span
                v-else-if="
                  scope.item.prop == 'taskStatus' &&
                    scope.row['taskStatus'] == 4
                "
                @click="errMsg(scope.row)"
              >
                <el-tag type="danger" class="tagPointer" effect="dark" style="width: 65px;">
                  {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
                </el-tag></span
              >
              <span
                v-else-if="
                  scope.item.prop == 'taskStatus' &&
                    scope.row['taskStatus'] == 3 &&
                    scope.row['errorCondition']
                "
                @click="errMsg(scope.row)"
              >
                <el-tag type="success" class="tagPointer" effect="dark" style="width: 65px;">
                  {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
                </el-tag></span
              >
              <span v-else-if="scope.item.prop == 'taskStatus'">
                <el-tag
                  :type="
                    scope.row[scope.item.prop] == 0
                      ? ''
                      : scope.row[scope.item.prop] == 1
                      ? 'info'
                      : scope.row[scope.item.prop] == 2
                      ? ''
                      : scope.row[scope.item.prop] == 3
                      ? 'success'
                      : scope.row[scope.item.prop] == 4
                      ? 'danger'
                      : 'info'
                  "
                  effect="dark"
                  style="width: 65px;"
                >
                  {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
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
    </app-drawer>
    <err-msg-dialog :visibles.sync="errMsgVisible" :data="tableRow" />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
// request
import { getCarInfoTasks } from "@/api/commont";
import errMsgDialog from "./components/errMsgDialog";
export default {
  name: "exportQueryDrawer",
  mixins: [pagingMixin, drawerOtherHeight, tableStyle],
  components: { errMsgDialog },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    taskType: {
      type: Number,
      default: null,
    },
  },
  filters: {
    switchText(val, type) {
      if (type === "taskStatus") {
        return val === 0
          ? "下载中"
          : val === 1
          ? "未开始"
          : val === 2
          ? "进行中"
          : val === 3
          ? "已完成"
          : val === 4
          ? "异常"
          : "-";
      } else {
        return val || (val===0 ? val:'-');
      }
    },
  },
  data() {
    return {
      listQuery: {
        taskName: "",
        taskStatus: "",
        startTime: "",
        endTime: "",
      },
      tableList: [
        {
          value: "任务名称",
          width: 200,
          prop: "taskName",
          checked: true,
        },
        {
          value: "开始时间",
          width: 140,
          prop: "startTime",
          checked: true,
        },
        {
          value: "结束时间",
          width: 140,
          prop: "endTime",
          checked: true,
        },
        // {
        //   value: "下载地址",
        //   width: 160,
        //   prop: "uploadPath",
        //   checked: false,
        // },
        {
          value: "任务创建时间",
          width: 140,
          prop: "createdOn",
          checked: true,
        },
        {
          value: "任务执行状态",
          width: 120,
          prop: "taskStatus",
          checked: true,
        },
        {
          value: "备注",
          width: 160,
          prop: "remark",
          checked: true,
        },
      ],
      errMsgVisible: false,
      statusList: [
        { label: "未开始", value: "1" },
        { label: "进行中", value: "2" },
        { label: "已完成", value: "3" },
        { label: "异常", value: "4" },
      ],
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "任务名称",
          value: "taskName",
          type: 'input',
        },
        {
          label: "任务状态",
          value: "taskStatus",
          type: 'select',
          options: {
            data: this.statusList,
          },
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
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
      ];
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad();
      }
    },
  },
  mounted() {},
  methods: {
    // 关闭dialog
    closeDrawer() {
      this.listQuery = {
        timeRange:["",""],
        taskName: "",
        taskStatus: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.collapse = false;
      this.$emit("update:visibles", false);
    },
    errMsg(row) {
      console.log(row);
      this.tableRow = row;
      this.errMsgVisible = true;
    },
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      
      this.listLoading = true;
      this.listQuery.taskType = this.taskType;
      getCarInfoTasks(this.listQuery)
        .then(({ data }) => {
					this.list = [];
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
  },
};
</script>

<style lang="scss" scoped>
.search_list {
  padding-top: 0;
}
</style>
