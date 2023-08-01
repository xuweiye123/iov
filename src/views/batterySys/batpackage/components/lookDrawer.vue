<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看模块厂商规格信息'"
    width="60%"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div slot="drawerContent">
      <!-- 按钮 -->
      <!-- <app-authorize-button
        :data="authouizeList"
        @click-filter="showfilter = true"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
        />
      </app-authorize-button> -->
      <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
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
              {{
                scope.row[scope.item.prop]  | processData
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
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { otherHeight } from "@/mixins/getOtherHeight";
import { getSpecification } from "@/api/batterySys/batpackage";
export default {
  name: "lookDrawer",
  mixins: [pagingMixin, partialForm, drawerOtherHeight, tableStyle,otherHeight],
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
      tableList: [
        {
          value: "模块厂商规格",
          prop: "moduleSpec",
          width: "120px",
          checked: true,
        },
        {
          value: "电池包对应模块规格数",
          prop: "moduleCount",
          width: "140px",
          checked: true,
        },
        {
          value: "单体厂商规格",
          prop: "cellSpec",
          width: "100px",
          checked: true,
        },
        {
          value: "模块对应单体规格数",
          prop: "cellAmount",
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
          this.listQuery.specification = this.data1;
          this.listLoad();
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  computed: {
   
  },
  methods: {
    //加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      getSpecification(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
      }).finally(() => {
        this.listLoading = false;
      })
    },
    closeDrawer() {
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped></style>
