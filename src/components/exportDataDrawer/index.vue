<template>
  <app-drawer
    :visibles="visibles"
    :title="'导出记录'"
    width="60%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :spanNumber="8"
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
      <!-- table -->
      <div class="section-wrap">
        <app-authorize-button
          :buttonLeft="headersLeftList"
          @click-filter="showfilter = false"
          :showRightButton="false"
          @click-delete="handleDelete"
        >
          <checked-Filter
            slot="check-filter"
            :show.sync="showfilter"
            :list="tableList"
            :scroll-line="8"
          />
        </app-authorize-button>
        <p class="textColor" style="margin: 0 0 10px 10px">
          已选中 {{ selectList.length }} 条数据
        </p>
        <app-table
          slot="table"
          ref="historyTable"
          :isTableSelection="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          rowKey="taskId"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop === 'taskStatus'">
              <el-tag
              :type="
                scope.row[scope.item.prop] == 0
                  ? ''
                  : scope.row[scope.item.prop] == 1
                  ? ''
                  : scope.row[scope.item.prop] == 2
                  ? 'success'
                  : scope.row[scope.item.prop] == 3
                  ? 'danger'
                  : scope.row[scope.item.prop] == 4
                  ? 'warning'
                  : 'info'
              "
              effect="dark"
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop] | switchText(scope.item.prop)
              }}
            </el-tag>
            </span>
            <span
              v-else-if="
                scope.item.prop === 'fileName' && scope.row['taskStatus'] == 2
              "
            >
            <!--  :href="'file/Download/sheets/' + scope.row['fullfilename']" -->
              <el-tooltip 
                  class="item" 
                  effect="dark" 
                  :content="'点击下载导出文件'"
                  placement="top">
              <a
                :href="scope.row.filePath"
                class="vinNo"
                >{{ scope.row[scope.item.prop] | processData}}</a
              >
              </el-tooltip>
            </span>
            <el-progress
              v-else-if="scope.item.prop === 'progress' && scope.row[scope.item.prop]!=null"
              :text-outside="true"
              :stroke-width="10"
              :percentage="scope.row[scope.item.prop]"
            />
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
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
// request
import { 
  getTaskRecordPageList,
  deleteDataTask,
  faultGetTaskRecordPageList,
  faultDeleteDataTask
  } from "@/api/commont";

export default {
  doNotInit: true,
  name: "exportDataDrawer",
  mixins: [pagingMixin, getPageButton, drawerOtherHeight, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    fileType: {
      type: Number,
      default: null,
    },
  },
  filters: {
    switchText(val, type) {
      if (type === "taskStatus") {
        return val == 0
          ? "排队中"
          : val == 1
          ? "进行中"
          : val == 2
          ? "已完成"
          : val == 3
          ? "异常"
          : val == 4
          ? "无数据"
          : "-";
      } else {
        return val || (val===0 ? val:'-');
      }
    },
  },
  data() {
    return {
      listQuery: {
        startTime: "",
        endTime: "",
        timeRange:["",""],
      },
      selectList: [],
      tableList: [
        {
          value: "文件名称",
          prop: "fileName",
          checked: true,
          width: 200,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
        {
          value: "下载进度",
          prop: "progress",
          checked: true,
          width: 120,
        },
        {
          value: "下载状态",
          prop: "taskStatus",
          checked: true,
          width: 100,
        },
      ],
    };
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad();
      }
    },
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
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
  mounted() {
    	// 暂时强行添加1
    this.headersLeftList = [
      {
        functionName: "删除",
        functionNameEn: "删除",
        functionType: 1,
        iconType:2,
        url: "delete",
        icon: "ic_delete",
        isShow: 1,
      },
		]
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val,"val")
      this.selectList = val;
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
    handleDelete() {
      if (this.selectList.length == 0) {
        this.$alert("请选中需要删除项", "提示", {
          confirmButtonText: "确定",
        });
        return;
      }
      const ids = [];
      this.selectList.forEach((item) => {
        ids.push(item.taskId);
      });
      const deleteData = {
        taskId: ids,
      };
      this.$confirm(`是否删除选中的数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if(this.fileType == 9 || this.fileType == 10 ){
            faultDeleteDataTask(deleteData).then(({ data }) => {
              if (data.code === 0) {
                this.$message.success({
                  message: "删除成功",
                  duration: 2 * 1000,
                });
                this.$refs.historyTable.refTable().clearSelection();
                this.selectList = []
                this.listLoad(); 
              }
            });
          }else{
             deleteDataTask(deleteData).then(({ data }) => {
              if (data.code === 0) {
                this.$message.success({
                  message: "删除成功",
                  duration: 2 * 1000,
                });
                this.$refs.historyTable.refTable().clearSelection();
                this.selectList = []
                this.listLoad(); 
              }
            });
          }
          
        })
    },
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      
      console.log(this.selectList, "this.fileType");
      this.listLoading = true;
      this.listQuery.type = this.fileType;
      if(this.fileType == 9 || this.fileType == 10 ){
        faultGetTaskRecordPageList(this.listQuery)
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
      }else{
        getTaskRecordPageList(this.listQuery)
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
      }
      
    },
    // 关闭
    closeDrawer() {
      this.listQuery = {
        timeRange:["",""],
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 10,
      };
      this.list = [];
      this.selectList = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>

</style>
