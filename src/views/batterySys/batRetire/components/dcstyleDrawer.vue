<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看电池生命周期'"
    width="60%"
    :isDrawerFoot="false"
    :wrapperClosable="true"
    @close-drawer="closeDrawer"
  >
    <div slot="drawerContent">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="电池生命周期图" name="1">
          <style-dialog :data="this.data" />
        </el-collapse-item>
        <el-collapse-item title="电池轶事记录" name="2">
          <div class="el-collapse-item__content">
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
              @row-click="rowClick"
              :tableHeights="tableHeight"
              :actionFixed="actionFixed"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
            >
              <template slot="tableContent" slot-scope="scope">
                <span v-if="scope.item.prop === 'state'" :class="'vinNo'">{{
                  scope.row[scope.item.prop] | switchText(scope.item.prop)
                }}</span>
                <span v-else>
                  {{ scope.row[scope.item.prop] | processData }}
                </span>
              </template>
            </app-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </app-drawer>
</template>

<script>
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDcstyleList } from "@/api/batterySys/batRetire";
import styleDialog from "./styleDialog";
//组件
// 验证
// import reg from "@/utils/reg"
export default {
  name: "AddUpdateDialog",
  components: { styleDialog },
  filters: {
    switchText(val, type) {
      if (type === "state") {
        return val === "produce"
          ? "车辆下线"
          : val === "sales"
          ? "车辆销售"
          : val === "repair"
          ? "返厂维修"
          : val === "retire"
          ? "车辆退役"
          : "-";
      }
    },
  },
  mixins: [
    pagingMixin,
    partialForm,
    drawerOtherHeight,
    tableStyle,
    getPageButton,
  ],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
    },
  },
  data() {
    return {
      list: [],
      activeNames: ["1", "2"],
      tableList: [
        {
          value: "时间点",
          prop: "date",
          checked: true,
        },
        {
          value: "事件",
          prop: "state",
          checked: true,
        },
      ],
      listLoading: false,
      total: 0,
      listQuery: {},
    };
  },
  computed: {},
  watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad();
      }
    },
  },
  created() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    // 点击列
    rowClick({ row, column }) {
      const label = column.label;
      this.tableRow = row;
      if (label === "事件") {
        if (row.state === "produce") {
          const { name } = { name: "carproduce" };
          this.$router.push({ name: name, query: { vinNo: row.vinNo } });
        }
        if (row.state === "sales") {
          const { name } = { name: "carsales" };
          this.$router.push({ name: name, query: { vinNo: row.vinNo } });
        }
        if (row.state === "repair") {
          const { name } = { name: "carrepair" };
          this.$router.push({ name: name, query: { vinNo: row.vinNo } });
        }
        if (row.state === "retire") {
          const { name } = { name: "batRetire" };
          this.$router.push({ name: name, query: { vinNo: row.vinNo } });
          this.$emit("add-complete");
        }
        this.closeDrawer();
      }
    },
    // 关闭dialog
    closeDrawer() {
      this.$emit("update:visibles", false);
    },
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      this.listQuery.batteryType = "电池包";
      this.listQuery.code = this.data;
      getDcstyleList(this.listQuery)
        .then(({ data }) => {
          this.list = [];
          this.total = 0;
          if (data.code === 0) {
            this.list = data.data;
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__content {
  padding-top: 10px;
}
</style>
