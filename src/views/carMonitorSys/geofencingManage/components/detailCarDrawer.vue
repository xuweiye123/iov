<template>
  <app-drawer
    :visibles="visibles"
    :title="'车辆明细'"
		:wrapperClosable="true"
    width="50%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <!-- table -->
      <div class="section-wrap">
        <app-table
          slot="table"
          :isTableSelection="false"
          :isPagination="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
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
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { getCarByMrulePageList } from "@/api/carMonitorSys/geofencingManage";

export default {
  doNotInit: true,
  name: "detailCarDrawer",
  mixins: [pagingMixin, getPageButton, drawerOtherHeight, tableStyle],
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
        geofenceRulesId: "",
        isSelectedAll:null,
        pageSize: 10,
        pageNum: 1,
      },
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
          width: 120,
          checked: true,
        },
        {
          value: "项目代号",
          prop: "carBatchCode",
          width: 120,
          checked: true,
        },
      ],
    };
  },
  computed: {
    
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.listQuery.geofenceRulesId = this.data.geofenceRulesId;
        this.listQuery.isSelectedAll = this.data.isSelectedAll;
        this.listLoad();
      }
    },
  },
  mounted() {},
  methods: {
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
      this.listLoading = true;
      getCarByMrulePageList(this.listQuery)
        .then(({ data }) => {
      this.list = [];
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
    closeDrawer() {
      this.listQuery = {
        geofenceRulesId: "",
        isSelectedAll:null,
        pageSize: 10,
        pageNum: 1,
      };
        (this.list = []);
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>

</style>
