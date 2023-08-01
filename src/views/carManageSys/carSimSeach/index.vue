<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        @click-filter="showfilter = true"
        @click-add="handleAdd"
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
        @click-delete="handleDelete"
        @click-downLoadFile="handleDownLoadFile"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
        <template slot="tableOperation" slot-scope="scope">
          <div style="text-align: left !important">
            <el-tooltip
              v-for="(l, index) in insideList"
              :key="index"
              :open-delay="250"
              class="item"
              effect="dark"
              :content="l.functionName"
              placement="top"
              :disabled="$store.state.app.isDisTooltip"
            >
              <span
                class="card-action"
                v-if="l.url === 'delete'"
                @click="handleDelete(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
              <span
                class="card-action"
                v-else-if="l.url === 'downLoadFile' && scope.row['succeedCount'] > 0"
                @click="handleDownLoadFile(scope.row)"
              >
                <i :class="'iconfont icon-' + l.icon"></i>
              </span>
            </el-tooltip>
          </div>
        </template>
      </app-table>
    </div>

    <!-- 新增编辑dialog弹窗 -->
    <add-task-drawer
      :visibles.sync="addVisible"
      @add-complete="addComplete"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

import { switchTime } from "@/utils/base"
// 组件
import addTaskDrawer from './components/addTaskDrawer'

// request
import {
  getPageList,
  deleteSIMsearch,
  exportDetail,
} from "@/api/carManageSys/carSimSearch";

// 辅助函数
export default {
  name: "carSimSeach",
  components: {
    addTaskDrawer
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        taskName: "",
      },
      addVisible: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "任务名称",
          prop: "taskName",
          width:150,
          checked: true,
        },
        {
          value: "车辆总数 ",
          prop: "totalCount",
          width:80,
          checked: true,
        },
        {
          value: "已完成",
          prop: "succeedCount",
          width:80,
          checked: true,
        },
        {
          value: "任务创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
        {
          value: "任务结束时间",
          prop: "endTime",
          width: 140,
          checked: true,
        },
        {
          value: "查询已耗时",
          prop: "queryTime",
          width:100,
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width:150,
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
          label: "任务名称",
          value: "taskName",
          type: "input",
        },
      ];
    },
    specialButton() {
      return this.insideList.filter(
        (item) => item.url == "downLoadFile" 
      );
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
      this.list = [];
      this.listLoading = true;
      getPageList(this.listQuery)
        .then(({ data }) => {
      if (data.code === 0) {
        this.list = data.data;
        this.total = data.total;
        this.list.forEach((item) => {
          item.queryTime = switchTime(item.queryTime);
        });
        if (
          this.list.every((item) => {
            return item.succeedCount < 1;
          })
        ) {
          this.actionWidth = this.operateWidth(
            this.insideList.length - this.specialButton.length
          );
        } else {
          this.actionWidth = this.operateWidth(this.insideList.length);
        }
      }
      this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
      });
    },
    handleDownLoadFile(row) {
      // if (row.succeedCount <1) {
			// 	this.$message.warning({
			// 		message: "当前任务未完成，无法下载",
			// 		duration: 2000,
			// 	});
			// 	return;
			// }
      const postData = {
        taskId: row.taskId,
        vinNo:row.vinNo
      };
      exportDetail(postData).then(({ data }) => {
        if (data.code === 0) {
        }
      });
    },
    // 新增
    handleAdd() {
      this.addVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },
    // 删除
    handleDelete(row) {
      const deleteData = {
        id: row.taskId,
        taskName: row.taskName,
      };
      this.$confirm(`是否删除${row.taskName}任务?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSIMsearch(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
