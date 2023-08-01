<template>
  <app-drawer
    :visibles="visibles"
    :title="'历史记录'"
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
import { getHistory } from "@/api/carManageSys/terminalInform";

export default {
  name: "lookHistory",
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
        pageSize:10,
        pageNum:1
      },
      tableList: [
        {
          value: "VIN码",
          prop: "vinNo",
          width: 170,
          checked: true,
        },
        {
          value: "终端编号",
          prop: "terminalCode",
          checked: true,
          width: 120,
        },
        {
          value: "开始时间",
          prop: "startTime",
          width: 140,
          checked: true,
        },
        {
          value: "结束时间",
          prop: "endTime",
          width: 140,
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
        this.listQuery.terminalId=this.data.terminalId
        this.listLoad()
      }
    }
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
        return
      }
      this.listLoading = true;
      getHistory(this.listQuery)
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
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>

</style>
