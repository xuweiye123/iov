<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看电池包厂商规格'"
    :width="'800px'"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div slot="drawerContent" style="height:465px">
      <!-- table -->
      <app-table
        slot="table"
        ref="table"
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
              scope.row[scope.item.prop]  | processData
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
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
// request
import { getCell } from "@/api/batterySys/configure";
// 组件
export default {
  name: "SelectcarDialog",
  filters: {},
  mixins: [pagingMixin, tableStyle,drawerOtherHeight],
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
        configureNumber: "",
        productModel: "",
      },
      tableList: [
        {
          value: "电池包厂商规格",
          prop: "specification",
          position: "center",
          checked: true,
        },
        {
          value: "电池包型号",
          prop: "batPackageName",
          position: "center",
          checked: true,
        },
        {
          value: "规格对应个体数",
          prop: "batPackageCount",
          position: "center",
          checked: true,
        },
      ]
    };
  },
  computed: {
    filterTableList() {
      return this.tableList.filter((item) => item.checked);
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
      this.listQuery.configureNumber = this.data.configureNumber;
      this.listQuery.productModel = this.data.productModel;
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 9999;
      getCell(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0;
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
      }).finally(()=>{
        this.listLoading = false;
      })
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
