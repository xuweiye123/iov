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
import { tableStyle } from "@/mixins/tableStyle";
// request
import {
  lookpsnInfo,
  lookmsnInfo,
  lookcsnInfo
} from "@/api/batterySys/carproduce";
// 组件
export default {
  name: "lookcellDrawer",
  filters: {},
  mixins: [pagingMixin, tableStyle],
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
      tableList1: [
        {
          value: "VIN码",
          prop: "vinNo",
          checked: true,
          width: "180px",
        },
        {
          value: "电池包编码",
          prop: "psn",
          checked: true,
          width: "200px",
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: "140px",
        },
      ],
      tableList2: [
        {
          value: "对应电池包编码",
          prop: "psn",
          checked: true,
          width: "200px",
        },
        {
          value: "电池模块编码",
          prop: "msn",
          checked: true,
          width: "200px",
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: "140px",
        },
      ],
      tableList3: [
        {
          value: "对应电池包编码",
          prop: "psn",
          checked: true,
          width: "200px",
        },
        {
          value: "对应电池模块编码",
          prop: "msn",
          checked: true,
          width: "200px",
        },
        {
          value: "电池单体编码",
          prop: "csn",
          checked: true,
          width: "200px",
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "140px",
          checked: true,
        },
      ]
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
      this.listQuery.vinNo = this.data.vinNo;
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 9999;
      if (this.data.cells === "dcb") {
        lookpsnInfo(this.listQuery).then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        }).finally(()=>{
           this.listLoading = false;
        })
      } else if (this.data.cells === "dcmk") {
        lookmsnInfo(this.listQuery).then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        }).finally(()=>{
            this.listLoading = false;
        })
      } else {
        lookcsnInfo(this.listQuery).then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
          }
        }).finally(()=>{
            this.listLoading = false;
        })
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

</style>
