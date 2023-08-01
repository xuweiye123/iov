<template>
<!--   @handle-submit="submit" -->
  <app-dialog
    :visibles="visibles"
    :title="'双击选择一个命令'"
    width="80%"
    @close-dialog="closeDialog"
    :isFooter="false"
    top="6vh"
  >
    <div slot="formContent">
      <app-search :show-title="false">
        <div slot="content">
          <seach-form
            :spanNumber="8"
            :labelWidth="'80px'"
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
      <div class="section-wrap">
        <app-table
          slot="table"
          :isTableSelection="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :pageObj="listQuery"
          :total="total"
          :tableHeights="tableHeight"
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
import { getPageButton } from "@/mixins/getButton";
import { getCommandPacketPageList } from "@/api/carManageSys/terminalBatch";
import { tableStyle } from "@/mixins/tableStyle";

export default {
  name: "selectCommondDialog",
  mixins: [pagingMixin, dialogOtherHeight, getPageButton, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
  },
  doNotInit: true,
  data() {
    return {
      listQuery: {
        packetName: "",
      },
      tableList: [
        {
          value: "命令包名称",
          prop: "packetName",
          width: 160,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
        { value: "备注 ", prop: "remark", checked: true ,width: 140,},
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
    restData() {
      this.list = [];
      this.total = 0;
      this.listQuery.packetName = "";
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 10;
      this.tableRow = null;
    },
    // 关闭dialog
    closeDialog() {
      this.restData();
      this.$emit("update:visibles", false);
    },
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.tableRow = null;
      getCommandPacketPageList(this.listQuery)
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
    // rowClick({ row }) {
    //   this.tableRow = { ...row };
    // },
    // 双击
    rowDblclick(row) {
      this.$emit("select-complete", row)
      this.closeDialog();
    },
    // // 提交按钮
    // submit() {
    //   if (!this.tableRow) {
    //     this.$alert("请选择命令包", "提示", {
    //       confirmButtonText: "确定",
    //     });
    //     return;
    //   }
    //   this.$emit("select-complete", this.tableRow);
    //   this.closeDialog();
    // },
  },
};
</script>

<style lang="scss">
.custrom-search-dialog {
  padding-top: 0 !important;
}
</style>
