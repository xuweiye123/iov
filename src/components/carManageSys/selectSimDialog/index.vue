<template>
  <app-dialog
    :visibles="visibles"
    :title="'双击选择一个SIM卡'"
    width="80%"
    @close-dialog="closeDialog"
    :isFooter="false"
    top="8vh"
  >
    <div slot="formContent">
      <app-search>
        <div slot="content">
          <el-form :model="listQuery" label-width="80px" style="width:100%">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="手机号码：">
                  <el-input
                    v-model="listQuery.simNumber"
                    placeholder="请输入手机号码"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ICCID：">
                  <el-input
                    v-model="listQuery.iccid"
                    placeholder="请输入ICCID"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" v-show="collapse">
                <el-form-item label="运营商类型：">
                  <el-select
                    v-model="listQuery.carrierType"
                    filterable
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in carrierTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="collapse">
							<el-col :span="6">
								<el-form-item label="占位符" style="visibility: hidden;">
									<el-input />
								</el-form-item>
							</el-col>
						</el-row>
          </el-form>
        </div>
        <app-search-button
          slot="bottom"
          :isdisabled="listLoading"
          @click-collapse="handleCollapse"
          @click-filter="handleFilter"
          @click-clear="handleClear"
        />
      </app-search>
      <!-- table -->
      <div class="section-wrap">
        <app-table
          slot="table"
          :isTableSelection="false"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          @row-dblclick="rowDblclick"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span v-if="scope.item.prop === 'simType'">
              {{ scope.row[scope.item.prop] == 0 ? "普通SIM卡" :scope.row[scope.item.prop] == 1 ? "物联网卡":'-' }}
            </span>
            <span v-else-if="scope.item.prop === 'dataSource'">
              {{ scope.row[scope.item.prop] == 0 ? "平台录入" :scope.row[scope.item.prop] == 1 ? "接口同步":'-' }}
            </span>
            <span v-else-if="scope.item.prop === 'carrierType'">
              {{ scope.row[scope.item.prop]==1?'移动'
               :scope.row[scope.item.prop]==2?'联通':'-' }}
            </span>
            <span v-else>
              {{
                scope.row[scope.item.prop] | processData
              }}
            </span>
          </template>
        </app-table>
      </div>
    </div>
  </app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { getSimList } from "@/api/carManageSys/commont";

export default {
  doNotInit: true,
  name: "selectSimDialog",
  mixins: [pagingMixin, getPageButton, dialogOtherHeight, tableStyle],
  props: {
    visibles: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default:0
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        simNumber: "",
        iccid: "",
        carrierType:''
      },
      carrierTypeList: [
        { label: "移动", value: 1 },
        { label: "联通", value: 2 },
      ],
      showfilter: false,
      tableHeight: 0,
      total: 0,
      list: [],
      listLoading: false,
      tableRow: {},
      tableList: [
        {
          value: "手机号码",
          prop: "simNumber",
          position: "center",
          width: 220,
          // sortable: "custom",
          checked: true,
        },
        {
          value: "ICCID",
          prop: "iccid",
          position: "center",
          width: 220,
          // sortable: "custom",
          checked: true,
        },
        {
          value: "SIM卡类型",
          prop: "simType",
          position: "center",
          // sortable: "custom",
          width: 120,
          checked: true,
        },
        {
          value: "运营商",
          prop: "carrierType",
          position: "center",
          // sortable: "custom",
          width: 90,
          checked: true,
        },
        {
          value: "数据来源",
          prop: "dataSource",
          position: "center",
          // sortable: "custom",
          width: 120,
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          position: "center",
          // sortable: "custom",
          width: 120,
          checked: true,
        },
      ],
    };
  },
   watch: {
    visibles(e1) {
      if (e1) {
        this.listLoad()
      }
    }
  },
  computed: {
    filterTableList() {
      return this.tableList.filter((item) => item.checked);
    },
  },
  mounted() {},
  methods: {
    // 双击
    rowDblclick(row) {
      if(this.type==2){
        this.$emit('dblclick-select-sim2', row)
      }else{
        this.$emit('dblclick-select-sim', row)
      }
      this.closeDialog()
    },
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
      // this.listQuery.dataSource=this.dataSource
      getSimList(this.listQuery).then(({ data }) => {
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
    closeDialog() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        simNumber: "",
        iccid: "",
        carrierType:''
      };
      this.collapse=false
      this.list = []
      this.total=0
      this.$emit("update:visibles", false);
    },
  },
};
</script>

<style scoped>

</style>
