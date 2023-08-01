<template>
  <app-drawer
    :visibles="visibles"
    :title="'任务详情列表'"
    width="80%"
    @close-drawer="closeDialog"
    :wrapperClosable="true"
    :loading="loading"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
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
      <app-table
        ref="tables"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="tableList"
        :pageObj="listQuery"
        :total="total"
        :tableHeights="collapse ? tableHeight + 63 : tableHeight + 105"
        :isShowOperation="true"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :buttonList="tableAction"
        @click-ienformation="handlIenformation"
        @click-update="handleUpdate"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'taskStatus'">
            <el-tag
              :type="
                scope.row[scope.item.prop] === 0
                  ? ''
                  : scope.row[scope.item.prop] === 1
                  ? ''
                  : scope.row[scope.item.prop] === 2
                  ? 'success'
                  : scope.row[scope.item.prop] === 3
                  ? 'danger'
                  : 'info'
              "
              effect="dark"
            >
              {{
                scope.row[scope.item.prop] === 0
                  ? "排队中"
                  : scope.row[scope.item.prop] === 1
                  ? "进行中"
                  : scope.row[scope.item.prop] === 2
                  ? "已完成"
                  : scope.row[scope.item.prop] === 3
                  ? "异常"
                  : "-"
              }}
            </el-tag>
          </span>
          <span v-else-if="scope.item.prop === 'taskType'">
            {{
              scope.row[scope.item.prop] === 2 ? "历史数据离线导出" : "未知数据"
            }}
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
        <template slot="tableOperation" slot-scope="scope">
          <div style="text-align: left !important">
            <el-tooltip
              v-for="(l, index) in tableAction"
              :key="index"
              :open-delay="250"
              class="item"
              effect="dark"
              :disabled="$store.state.app.isDisTooltip"
              :content="l.functionName"
              placement="top"
            >
              <span
                class="card-action"
                v-if="
                  l.url === 'retueninformation' && scope.row.taskStatus === 2
                "
                @click="handlIenformation(scope.row)"
              >
                <i
                  :class="'iconfont icon-' + l.icon"
                  style="font-size: 12px !important"
                ></i>
              </span>
              <!-- <span
                class="card-action"
                v-if="l.url === 'update' && scope.row.taskStatus === 3"
                @click="handleUpdate(scope.row)"
              >
                <i
                  :class="'iconfont icon-' + l.icon"
                  style="font-size: 12px !important"
                ></i>
              </span> -->
            </el-tooltip>
          </div>
        </template>
      </app-table>
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { partialForm } from "@/mixins/partialForm";
import { getPageButton } from "@/mixins/getButton";
import {
  getForwardLinktaskList,
  getForwardDownload,
} from "@/api/transmitSys/vehicleComponyManagement";
export default {
  doNotInit: true,
  name: "TaskDetailsList",
  mixins: [partialForm, pagingMixin, otherHeight, tableStyle, getPageButton],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      listLoading: false,
      serverIpList: [],
      TaskStatusList: [
        {
          value: "0",
          text: "未开始",
        },
        {
          value: "1",
          text: "进行中",
        },
        {
          value: "2",
          text: "已完成",
        },
        {
          value: "3",
          text: "异常",
        },
      ],
      loading: false,
      listQuery: {
        taskName: "",
        taskType: "2",
        taskStatus: "",
        timeRange: [],
      },
      time: ["", ""],
      selecttion: [], //克隆lists
      actionFixed: "right",
      list: [],
      total: 0,
      authouizeList: [],
      tableList: [
        // {
        //   value: "任务ID",
        //   prop: "taskId",
        //   width: 150,
        //   position: "center",
        //   checked: true,
        //   // fixed: "left",
        // },
        {
          value: "任务名称",
          prop: "taskName",
          width: 250,
          position: "center",
          checked: true,
          // fixed: "left",
        },
        {
          value: "任务类型",
          prop: "taskType",
          width: 150,
          position: "center",
          checked: true,
        },
        {
          value: "任务状态",
          prop: "taskStatus",
          width: 150,
          position: "center",
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: 150,
          position: "center",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 150,
          position: "center",
          checked: true,
        },
        // {
        // 	value: "模板效验信息",
        // 	prop: "vifInfo",
        // 	width: 150,
        // 	position: "center",
        // 	checked: true,
        // },
        {
          value: "任务开始时间",
          prop: "startTime",
          width: 140,
          position: "center",
          checked: true,
        },
        {
          value: "任务结束时间",
          prop: "endTime",
          width: 140,
          position: "center",
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width: 100,
          position: "center",
          checked: true,
        },
        // {
        //   value: "成功数量",
        //   prop: "successNum",
        //   width: 100,
        //   position: "center",
        //   checked: true,
        // },
        // {
        //   value: "失败数量",
        //   prop: "failedNum",
        //   width: 100,
        //   position: "center",
        //   checked: true,
        // },
        // {
        //   value: "文件下载路径",
        //   prop: "downloadPath",
        //   width: 100,
        //   position: "center",
        //   checked: true,
        // },
      ],
    };
  },
  watch: {
    visibles: {
      handler(e) {
        if (e) {
          this.listLoad();
        }
      },
    },
  },
  mounted() {
    this.serverIpList = [
      {
        value: "2",
        text: "历史数据离线导出",
      },
    ];
    this.listQuery.taskType = "2";
  },
  computed: {
    // table内部的按钮
    tableAction() {
      const res = this.insideList.filter((item) => {
        return item.url === "retueninformation" || item.url === "update";
      });
      return res;
    },
    // 查询区数据
    searchList() {
      return [
        {
          label: "任务名称",
          value: "taskName",
          type: "input",
        },
        {
          label: "时间范围",
          value: "timeRange",
          type: "dateTimeRange",
          spanNumber: 12,
        },
        {
          label: "任务状态",
          value: "taskStatus",
          type: "select",
          options: {
            data: this.TaskStatusList, //下拉数组
            extraProps: {
              label: "text",
              value: "value",
            },
          },
        },
      ];
    },
  },
  methods: {
    handlIenformation(row) {
      if (row.filePath == null) {
        this.$message.error("无下载内容");
        return;
      }
      let params = {
        fileName: row.filePath,
      };
      
  let a = document.createElement("a"); //创建a标签
			a.setAttribute("href", "/file/" + row.filePath); //设置文件下载地址
			a.setAttribute("target", "_blank"); //在当前页面创建下载
			document.body.appendChild(a); //添加到body
			a.click(); //触发事件
			document.body.removeChild(a); //移除标签
    },
    handleUpdate(row) {
      if (row.remark == null) {
        this.$message.error("无下载内容");
        return;
      }
      let params = {
        fileName: row.remark,
      };
      getForwardDownload(params)
        .then(({ data }) => {
          if (data.code === 0) {
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 关闭dialog
    closeDialog() {
      //关闭时清空查询
      this.listQuery = {
        taskName: "",
        taskType: "2",
        taskStatus: "",
        timeRange: [],
        pageNum: 1,
        pageSize: 10,
      };
      this.collapse = false; 
      this.$emit("update:visibles", false);
    },
    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      this.listQuery.taskType = "2";
      this.listQuery.startTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[0]
        : "";
      this.listQuery.endTime = this.listQuery.timeRange
        ? this.listQuery.timeRange[1]
        : "";
      getForwardLinktaskList(this.listQuery)
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
  },
};
</script>

<style lang="scss" scoped></style>
