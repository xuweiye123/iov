<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看绑定电池单体信息'"
    :width="'800px'"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div slot="drawerContent">
      <!-- 按钮 -->
      <div class="section-wrap">
        <app-table
          slot="table"
          :isTableSelection="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :pageObj="listQuery"
          :total="total"
          :isShowOperation="false"
          :isPagination="true"
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
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";

import { lookDetail } from "@/api/batterySys/modulesMes";

export default {
  name: "lookDetailDrawer",
  mixins: [pagingMixin, partialForm, drawerOtherHeight, tableStyle],
  props: {
    data1: {
      type: String,
      default: "",
    },
    visibles: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listQuery: {},
      tableList: [
        {
          value: "电池模块编码",
          prop: "msn",
          width: "200px",
          checked: true,
        },
        {
          value: "对应电池单体编码",
          prop: "csn",
          width: "200px",
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: "140px",
          checked: true,
        },
      ],
    };
  },
  watch: {
    visibles: {
      handler(v) {
        if (v) {
          this.listLoad();
        }
      },
      immediate: true,
    },
  },
  methods: {
    //加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.listQuery.msn = this.data1;
      lookDetail(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0;
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
    closeDrawer() {
      this.$emit("update:visibles", false);
      this.listQuery = { pageNum: 1, pageSize: 10 };
      this.list = [];
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style scoped></style>
