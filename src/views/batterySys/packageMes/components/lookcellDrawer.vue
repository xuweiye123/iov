<template>
  <app-drawer
    :visibles="visibles"
    :title="'电池列表'"
    :width="'850px'"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div slot="drawerContent">
      <!-- table -->
      <app-table
        slot="table"
        :isTableSelection="false"
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :isShowOperation="false"
        :isPagination="false"
        :tableHeights="tableHeight"
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
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { lookDcmk, lookDcdt } from "@/api/batterySys/packageMes";
// 组件
export default {
  name: "lookcellDrawer",
  filters: {},
  mixins: [pagingMixin, tableStyle, drawerOtherHeight, getPageButton],
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
        terminalcode: "",
      },
      tableList1: [
        {
          value: "VIN码",
          prop: "vinNo",
          checked: true,
          width: 170,
        },
        {
          value: "电池包编码",
          prop: "psn",
          checked: true,
          width: 220,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
      ],
      tableList2: [
        {
          value: "对应电池包编码",
          prop: "psn",
          checked: true,
          width: 200,
        },
        {
          value: "电池模块编码",
          prop: "msn",
          checked: true,
          width: 200,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
      ],
      tableList3: [
        {
          value: "对应电池包编码",
          prop: "psn",
          checked: true,
          width: 200,
        },
        {
          value: "对应电池模块编码",
          prop: "msn",
          checked: true,
          width: 200,
        },
        {
          value: "电池单体编码",
          prop: "csn",
          checked: true,
          width: 200,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
      ],
    };
  },
  computed: {
    filterTableList() {
      if (this.data.cells === "dcb") {
        return this.tableList1.filter((item) => item.checked);
      } else if (this.data.cells === "dcmk") {
        return this.tableList2.filter((item) => item.checked);
      } else {
        return this.tableList3.filter((item) => item.checked);
      }
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad();
      }
    },
  },
  mounted() {
  },
  methods: {
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.listQuery.psn = this.data.psn;
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 9999;
      if (this.data.cells === "dcmk") {
        lookDcmk(this.listQuery).then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;
        });
      } else {
        lookDcdt(this.listQuery).then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;
        });
      }
    },
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style lang="scss">
.buttonlist {
  .add-btn-right {
    display: none !important;
  }
}
</style>
