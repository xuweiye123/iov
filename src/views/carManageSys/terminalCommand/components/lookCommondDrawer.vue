<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看命令包参数'"
    :wrapperClosable="true"
    width="50%"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :labelWidth="'90px'"
            :spanNumber="12"
            :collapseNumber="2"
            :listQuery="formInfo"
            :searchList="searchList"
          />
        </div>
      </app-search>
      <!-- table -->
      <div class="section-wrap">
        <app-table
          slot="table"
          :isTableSelection="false"
          :isPagination="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
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
import { getEditCommandParamById } from "@/api/carManageSys/terminalCommand";

export default {
  doNotInit: true,
  name: "lookCommondDrawer",
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
      listQuery: {},
      formInfo:{},
      tableList: [
        {
          value: "命令名称",
          prop: "commandName",
          checked: true,
          width: 120,
        },
        {
          value: "参数",
          prop: "param",
          checked: true,
          width: 200,
        },
        {
          value: "备注",
          prop: "remark",
          checked: true,
          width: 120,
        },
      ],
    };
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "命令包名称",
          value: "packetName",
          type: "input",
          disabled:true
        },
        {
          label: "备注",
          value: "remark",
          type: 'input',
          disabled:true
        },
      ];
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo=this.data
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
      let param = {
        packetId: this.formInfo.packetId,
      };
      getEditCommandParamById(param)
        .then(({ data }) => {
          this.list = [];
          if (data.code === 0) {
            this.list = data.data;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 关闭
    closeDrawer() {
      this.formInfo={
        packetName:"",
        remark:""
      }
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>

</style>
