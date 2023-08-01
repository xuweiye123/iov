<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看ECU'"
    width="60%"
    @close-drawer="closeDialog"
    :wrapperClosable="true"
    :isDrawerFoot="false"
  >
    <div class="box-list" slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :spanNumber="8"
            :labelWidth="'75px'"
            :listQuery="listQuery"
            :searchList="searchList"
          />
        </div>
        <div slot="bottom">
          <!-- 清空查询按钮 -->
          <app-search-button
            slot="bottom"
            :isCollapse="false"
            @click-filter="handleFilter"
            @click-clear="handleClear"
          />
        </div>
      </app-search>
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
        :tableHeights="tableHeight"
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
// request
import { getECUList2 } from "@/api/diagnosisSys/commont";

export default {
  name: "QueryECUDialog",
  mixins: [pagingMixin, drawerOtherHeight, tableStyle],
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "ECU名称",
          value: "ecuName",
          type: "input",
        },
      ];
    },
  },
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    ecuClassId: {
      type: String,
      default: "",
    },
  },
  watch: {
    visibles: {
      handler(e1) {
        if (e1) {
          this.listLoad();
        }
      },
    },
  },
  data() {
    return {
      listQuery: { ecuName: "" },
      tableList: [
        {
          value: "ECU名称",
          prop: "ecuName",
          checked: true,
          width: 120,
        },
        {
          value: "ODX文件",
          prop: "odxName",
          checked: true,
          width: 300,
        },
        {
          value: "波特率",
          prop: "canbaudrate",
          checked: true,
          width: 100,
        },
        {
          value: "发送地址",
          prop: "requestCanId",
          checked: true,
          width: 120,
        },
        {
          value: "接受地址",
          prop: "responseCanId",
          checked: true,
          width: 120,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: false,
          width: 140,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.listQuery.ecuClassId = this.ecuClassId;
      getECUList2(this.listQuery)
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
    // 关闭dialog
    closeDialog() {
      this.formInfo = {};
      this.listQuery.ecuName = "";
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
