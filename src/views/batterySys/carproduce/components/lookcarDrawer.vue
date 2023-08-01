<template>
  <app-drawer
    :visibles="visibles"
    :title="'车辆列表'"
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
        :isPagination="false"
        :isShowOperation="false"
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
import { tableStyle } from "@/mixins/tableStyle";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
// request
import { lookcarInfo } from "@/api/batterySys/carproduce";
// 组件
export default {
  name: "lookcarDrawer",
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
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: "180px",
          checked: true
        },
        {
          value: "车辆名称",
          prop: "vehicleName",
          width: "100px",
          checked: true
        },
        {
          value: "车辆型号",
          prop: "vehicleModel",
          width: "120px",
          checked: true
        },
        {
          value: "车辆类型",
          prop: "vehicleType",
          width: "100px",
          checked: true
        },
        {
          value: "车辆制造日期",
          prop: "vehicleProduceDate",
          width: "140px",
          checked: true
        },
        {
          value: "车辆品牌",
          prop: "vehicleBrand",
          width: "94px",
          checked: true
        },
      ]
    };
  },
  computed: {
    
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
      lookcarInfo(this.listQuery).then(({ data }) => {
        this.total = 0
        this.list = [];
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
