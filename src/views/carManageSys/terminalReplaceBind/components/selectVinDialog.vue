<template>
  <app-dialog
    :visibles="visibles"
    :title="'双击选择一个VIN码'"
    width="85%"
    @close-dialog="closeDialog"
    :isFooter="false"
    top="10vh"
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
            <span>
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
import { getAuditCarPageList } from "@/api/carManageSys/terminalReplace";

export default {
  name: "selectVinDialog",
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
        pageSize: 10,
        pageNum: 1,
        terminalCode: "",
        vinNo: "",
      },
      showfilter: false,
      tableHeight: 0,
      total: 0,
      list: [],
      listLoading: false,
      tableRow: {},
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          checked: true,
          width:200,
        },
        {
          value: "ICCID1",
          prop: "iccidOne",
          checked: true,
          width:200,
        },
        {
          value: "ICCID2",
          prop: "iccidTwo",
          checked: true,
          width:200,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          checked: true,
          width:150,
        },
        {
          value: "TBOXSN",
          prop: "barCode",
          checked: true,
          width:150,
        },
      ],
    };
  },
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
      ];
    }
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
    // 双击
    rowDblclick(row) {
      this.$emit("dblclick-select-vin", row);
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
      getAuditCarPageList(this.listQuery).then(({ data }) => {
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
        pageSize: 10,
        pageNum: 1,
        terminalCode: "",
        vinNo: "",
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
