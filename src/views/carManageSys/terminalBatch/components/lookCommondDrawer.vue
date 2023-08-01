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
          <el-form :model="listQuery" label-width="80px" style="width:100%">
            <el-row>
              <el-col :span="12">
                <el-form-item label="命令包名称：">
                  <el-input
                    disabled
                    v-model="formInfo.packetName"
                    clearable
                    placeholder="请输入命令包名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注：">
                  <el-input placeholder="请输入备注" disabled v-model="packetRemark" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
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
import { getCommandParamById } from "@/api/carManageSys/terminalBatch";

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
      packetRemark: "",
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
  },
  watch: {
    visibles(e1) {
      if (e1) {
        this.formInfo = { ...this.data }
        this.listLoad();
      }
    },
  },
  mounted() {},
  methods: {
    // 加载数据
    listLoad() {
      if (!this.visibles) {
        return;
      }
      this.listLoading = true;
      let param = {
        packetId: this.data.packetId,
      };
      getCommandParamById(param)
        .then(({ data }) => {
          this.list = [];
          if (data.code === 0) {
            this.list = data.data;
            // this.total = data.total;
            this.packetRemark = data.data?data.data[0].packetRemark:"";
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 关闭
    closeDrawer() {
      this.formInfo.packetName="";
      this.packetRemark="";
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>

</style>
