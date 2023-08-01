<template>
  <app-dialog
    :visibles="visibles"
    :title="'双击选择一个TBOXSN'"
    width="80%"
    @close-dialog="closeDialog"
    :isFooter="false"
    top="8vh"
  >
    <div slot="formContent">
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
        <app-table
          slot="table"
          :isTableSelection="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          @row-dblclick="rowDblclick"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop === 'isBind'">
              <svg-icon :icon-class="scope.row[scope.item.prop] ==1?'isBind':scope.row[scope.item.prop] ==0?'noBind':''" />&nbsp;
            {{ scope.row[scope.item.prop] ==0?"未绑定":scope.row[scope.item.prop] ==1?"已绑定":'-' }}
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
  </app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { getCarToTerminal } from "@/api/carManageSys/carInform";

export default {
  doNotInit: true,
  name: "selectTerminalDialog",
  mixins: [pagingMixin, getPageButton, dialogOtherHeight, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      listQuery: {
        terminalCode: "",
        barCode: "",
      },
      tableList: [
        {
          value: "TBOXSN",
          prop: "barCode",
          checked: true,
          width:160
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          checked: true,
          width:120
        },
        // {
        //   value: "TBOX供应商",
        //   prop: "terminalType",
        //   checked: true,
        //   width:120
        // },
        {
          value: "绑定状态",
          prop: "isBind",
          checked: true,
          width:120
        },
      ],
    };
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad()
      }
    }
  },
  computed: {
     // 查询区数据
    searchList() {
      return [
        {
          label: "TBOXSN",
          value: "barCode",
          type: "input",
        },
        {
          label: "终端编号",
          value: "terminalCode",
          type: "input",
        },
      ];
    }
  },
  mounted() {},
  methods: {
    // 双击
    rowDblclick(row) {
      if (!row.simIdOne ||!row.simIdTwo) {
        this.$message.warning({
          message: "该终端未绑定SIM卡",
          duration: 2 * 1000,
        });
        return;
      }
      this.$emit("dblclick-select-terminal", row);
      this.closeDialog();
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
    lookDetail() {},
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.list = [];
      this.listLoading = true;
      // this.listQuery.terminalType=1
      getCarToTerminal(this.listQuery)
        .then(({ data }) => {
          this.tableRow = {};
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
    // 关闭
    closeDialog() {
      this.listQuery = {
        terminalCode: "",
        barCode: "",
        pageSize: 10,
        pageNum: 1,
      };
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>
</style>
