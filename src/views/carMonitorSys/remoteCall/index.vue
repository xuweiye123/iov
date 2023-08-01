<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form :listQuery="listQuery" :searchList="searchList" />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :is-collapse="false"
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
        @click-getCanFile="handleGetMessage"
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
        :isShowOperation="true"
        :buttonList="insideList"
        @click-downLoadFile="downLoadFile"
        @click-lookDownload="lookDownload"
        @click-canUpdate="updateMessage"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isOnline'">
            <svg-icon
              :icon-class="
                scope.row[scope.item.prop] == 1 ? 'online-start' : 'online-end'
              "
              :class="scope.row[scope.item.prop] == 1 ? 'yesgps' : 'nogps'"
            />
            {{
              scope.row[scope.item.prop]
                | switchText(scope.item.prop, scope.row)
            }}
          </span>
          <span v-else-if="scope.item.prop === 'process'">
            <el-progress
              :stroke-width="10"
              :percentage="
                scope.row[scope.item.prop] > 100
                  ? 100
                  : Math.round(scope.row[scope.item.prop], 1)
              "
            />
          </span>
          <!-- <span v-else-if="scope.item.prop === 'currentStatus'"
            :class="scope.row[scope.item.prop]==0 ?'badge-default'
            :scope.row[scope.item.prop]==1 ?'badge-processing'
            :scope.row[scope.item.prop]==2 ?'badge-success'
            :scope.row[scope.item.prop]==3 ?'badge-success1'
            :scope.row[scope.item.prop]==4 ?'badge-error'
            :''"
          >
            <em></em>{{ scope.row[scope.item.prop] | switchText(scope.item.prop,scope.row) }}
          </span> -->
          <span v-else-if="scope.item.prop === 'currentStatus'">
            {{
              scope.row[scope.item.prop]
                | switchText(scope.item.prop, scope.row)
            }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <get-message-drawer
      :visibles.sync="getMessageVisible"
      @get-success="successComplete"
    />
    <!-- 下载文件 -->
    <file-drawer
      :visibles.sync="fileVisible"
      :data="tableRow"
      @download-success="handleSuccess"
    ></file-drawer>
    <!-- 查看下载明细 -->
    <look-drawer :visibles.sync="lookVisible" :data="tableRow"></look-drawer>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import {
  getDownloadTaskPageList,
  resetDownloadTask,
} from "@/api/carMonitorSys/remoteCall";
// 组件
import getMessageDrawer from "./components/getMessageDrawer";
import fileDrawer from "./components/fileDrawer";
import lookDrawer from "./components/lookDrawer";
// 辅助函数
export default {
  name: "remoteCall",
  components: {
    getMessageDrawer,
    fileDrawer,
    lookDrawer,
  },
  filters: {
    switchText(val, type) {
      if (type === "isOnline") {
        return val === 1 ? "在线" : "离线";
      } else if (type === "currentStatus") {
        return val === 0
          ? "未执行"
          : val === 1
          ? "进行中"
          : val === 2
          ? "已完成"
          : val === 3
          ? "已完成，目录不完整"
          : val === 4
          ? "失败"
          : val === 5
          ? "离线命令已加载"
          : "-";
      } else {
        return val || (val === 0 ? val : "-");
      }
    },
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        vinNo: "",
        terminalCode: "",
        barCode: "",
      },
      carBrandIdList: [],
      // 字段管理所需字段
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "车型名称",
          prop: "carTypeName",
          width: 110,
          checked: true,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          width: 100,
          checked: true,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          width: 110,
          checked: true,
        },
        {
          value: "TBOXSN",
          prop: "barCode",
          width: 160,
          checked: true,
        },
        {
          value: "终端是否在线",
          prop: "isOnline",
          width: 120,
          checked: true,
        },
        {
          value: "下载状态",
          prop: "currentStatus",
          width: 150,
          checked: true,
        },
        {
          value: "下载进度",
          prop: "process",
          width: 150,
          checked: true,
        },
        {
          value: "总文件数量",
          prop: "allCount",
          width: 110,
          checked: true,
        },
        {
          value: "下载数量",
          prop: "downloadCount",
          width: 110,
          checked: true,
        },
        {
          value: "下载完成数量",
          prop: "successCount",
          width: 110,
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width: 150,
          checked: true,
        },
      ],
      getMessageVisible: false /* 添加/编辑、 */,
      fileVisible: false,
      lookVisible: false,
      title: "",
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
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        },
        {
          label: "TBOXSN",
          value: "barCode",
          type: "input",
        },
      ];
    },
  },
  mounted() {
    // 暂时强行添加
  },
  methods: {
    rowClick(data) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === data.row.id) {
          data.row.$index = index;
        }
      });
      this.tableRow = data.row;
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
      this.listLoading = true;
      getDownloadTaskPageList(this.listQuery)
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

    /**
     * @name: 添加
     * @param {*}
     */
    handleGetMessage() {
      this.getMessageVisible = true;
    },
    // 获取完成
    successComplete() {
      this.listLoad();
      this.$message.success({
        message: "获取成功",
        duration: 2 * 1000,
      });
    },
    // 立即更新
    updateMessage(row) {
      resetDownloadTask({ pathCarId: row.pathCarId,vinNo:row.vinNoTotal?row.vinNoTotal:row.vinNo }).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "更新成功",
            duration: 2 * 1000,
          });
          this.listLoad();
        }
      });
    },
    // 查看下载明细
    lookDownload(row) {
      this.tableRow = row;
      this.lookVisible = true;
    },
    // 下载文件
    downLoadFile(row) {
      this.tableRow = row;
      this.fileVisible = true;
    },
    // 下载完成
    handleSuccess() {
      this.listLoad();
      this.$message.success({
        message: "下载成功",
        duration: 2 * 1000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.yesgps {
  color: #00e56c;
}
.nogps {
  color: #98a3af;
}
</style>
