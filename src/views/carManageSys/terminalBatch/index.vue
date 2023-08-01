<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'75px'"
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
        @click-add-task="handleAdd"
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
        @click-seeTask="handleSeeTask"
        @click-seePackage="handleSeePackage"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
						@click="handleSeeTask(scope.row)"
						class="vinNo"
						v-if="scope.item.prop === 'operationName'"
					>
						{{ scope.row[scope.item.prop] | processData}}
					</span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
    </div>
    <look-commond-drawer :visibles.sync="lookCommondVisible" :data="tableRow" />
    <look-task-drawer :visibles.sync="lookTaskVisible" :data="tableRow" />
    <add-task-drawer
      :visibles.sync="addTaskVisible"
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
// 组件
import lookCommondDrawer from "./components/lookCommondDrawer";
import lookTaskDrawer from "./components/lookTaskDrawer";
import addTaskDrawer from "./components/addTaskDrawer";
// request
import { getBatchRemoteSettingPageList } from "@/api/carManageSys/terminalBatch";

// 辅助函数
export default {
  name: "terminalBatch",
  CH_name:"终端批量设置",
  components: {
    lookCommondDrawer,
    lookTaskDrawer,
    addTaskDrawer,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        operationName: "",
        vinNo: "",
        packetName: "",
      },
      lookCommondVisible: false,
      lookTaskVisible: false,
      addTaskVisible: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "任务名称",
          prop: "operationName",
          width: 160,
          checked: true,
        },
        {
          value: "命令包名称",
          prop: "packetName",
          width: 160,
          checked: true,
        },
        {
          value: "命令总数",
          prop: "taskCount",
          width: 90,
          checked: true,
        },
        {
          value: "未执行",
          width: 80,
          prop: "undoing",
          checked: true,
        },
        {
          value: "正在执行",
          prop: "doing",
          width: 80,
          checked: true,
        },
        {
          value: "已完成",
          width: 80,
          prop: "completed",
          checked: true,
        },
        {
          value: "执行失败",
          width: 80,
          prop: "failedCount",
          checked: true,
        },
        {
          value: "创建人",
          width: 100,
          prop: "createdBy",
          checked: true,
        },
        {
          value: "创建时间",
          width: 140,
          prop: "createdOn",
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
          label: "任务名称",
          value: "operationName",
          type: "input",
        },
        {
          label: "命令包名称",
          value: "packetName",
          type: "input",
        },
      ];
    },
  },
  mounted() {
   
  },
  methods: {
    // 点击列
    rowClick({ row }) {
      if(row) this.tableRow = row;
    },
    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getBatchRemoteSettingPageList(this.listQuery)
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
    // 添加任务
    handleAdd() {
      this.addTaskVisible = true;
    },
    // 添加成功
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "添加成功",
        duration: 2 * 1000,
      });
    },
    // 查看任务
    handleSeeTask(row) {
      if(row) this.tableRow = row;
      this.lookTaskVisible = true;
    },
    // 查看命令包
    handleSeePackage(row) {
      if(row) this.tableRow = row;
      this.lookCommondVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
