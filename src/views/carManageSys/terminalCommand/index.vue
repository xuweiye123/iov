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
        @click-look="handleLook"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
						@click="handleLook(scope.row)"
						class="vinNo"
						v-if="scope.item.prop === 'packetName'"
					>
						{{ scope.row[scope.item.prop] }}
					</span>
          <span v-else-if="scope.item.prop === 'commond'">
             <el-tag
              :type="
                scope.row[scope.item.prop] == 0
                  ? 'info'
                  : scope.row[scope.item.prop] == 1
                  ? 'success'
                  : ''
              "
              effect="dark"
              style="width: 65px;"
            >
              {{
                scope.row[scope.item.prop] == 0
                ? "未执行"
                : scope.row[scope.item.prop] == 1
                ? "执行完毕"
                : "执行中"
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

    <!-- 新增编辑dialog弹窗 -->
    <add-drawer
      :visibles.sync="addVisible"
      @add-success="addComplete"
    />
    <look-commond-drawer :visibles.sync="lookCommondVisible" :data="tableRow" />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";

// 组件
import addDrawer from "./components/addDrawer";
import lookCommondDrawer from "./components/lookCommondDrawer";
// request
import { getCommandPacketPageList } from "@/api/carManageSys/terminalCommand";

// 辅助函数
export default {
  name: "terminalCommand",
  CH_name:"终端命令包设置",
  components: {
    addDrawer,
    lookCommondDrawer,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        packetName: "",
        timeRange:["",""]
      },
      addVisible: false /* 查看导出记录*/,
      lookCommondVisible: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "命令包名称",
          prop: "packetName",
          checked: true,
          width:140,
        },
        {
          value: "命令数量",
          prop: "paramsCount",
          checked: true,
          width:100
        },
        {
          value: "命令包状态",
          prop: "commond",
          checked: true,
          width:120
        },
        {
          value: "创建人",
          prop: "createdBy",
          checked: true,
          width:100
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width:140
        },
        {
          value: "备注",
          prop: "remark",
          checked: true,
          width:150
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
          label: "命令包名称",
          value: "packetName",
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
      this.list = [];
      this.listLoading = true;
      getCommandPacketPageList(this.listQuery)
        .then(({ data }) => {
      if (data.code === 0) {
        this.list = data.data;
        this.total = data.total;
        this.tableRow = {};
        let result = data.data || [];
        result.forEach(item => {
          // 0 未执行 1 执行完毕 2 执行中
          item.commond = item.sumCount == 0 ? 0 : item.doingCount == 0 ? 1 : 2
        });
        this.list = result
      }
      this.listLoading = false;
      })
      .catch(() => {
        this.listLoading = false;
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
    // 查看
    handleLook(row) {
      this.lookCommondVisible = true;
      this.tableRow = row;
    },
  },
};
</script>

<style lang="scss" scoped></style>
