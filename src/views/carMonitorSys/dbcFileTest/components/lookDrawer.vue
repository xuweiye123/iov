<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看车辆信息'"
    width="55%"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <!-- 授权按钮 -->
      <app-authorize-button @click-filter="showfilter = true">
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
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
        :isShowOperation="false"
        :tableHeights="tableHeight"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span>
            {{ scope.row[scope.item.prop] | processData }}
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
import { seeCarMessage } from "@/api/carMonitorSys/dbcFileTest";

export default {
  name: "lookDrawer",
  doNotInit: true,
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
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          this.listQuery.dbcId = this.data.dbcId;
          this.listLoad();
        }
      },
    },
  },
  filters: {},
  data() {
    return {
      listQuery: {},
      timer: null,
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
        {
          value: "使用区域",
          prop: "areaName",
          width: 120,
          checked: true,
        },
        // { value: '公司名称', prop: 'companyname', sortable: 'custom', position: 'center', checked: true },
        // { value: '车牌号', prop: 'licenseplate', sortable: 'custom', position: 'center', checked: true }
      ],
    };
  },
  computed: {},
  mounted() {},
  methods: {
    // 渲染
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      seeCarMessage(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.total = data.total;
            this.list = data.data || [];
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    // 关闭dialog
    closeDrawer() {
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped></style>
