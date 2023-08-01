<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form 
        :listQuery="listQuery" 
        :searchList="searchList"
         labelWidth="80px"
         />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isCollapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
        :isdisabled="listLoading"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
       :buttonLeft="headersLeftList"
	   :buttonRight="headersRightList"
        @click-add="handleAdd"
        @click-filter="showfilter = true"
      >
        <checked-Filter
          slot="check-filter"
          :show.sync="showfilter"
          :list="tableList"
          :scroll-line="8"
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
        :tableHeights="tableHeight"
        :isShowOperation="true"
        :buttonList="insideList"
        @click-delete="handleDelete"
        @click-update="handleUpdate"
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
    <!-- 新增修改dialog -->
    <add-update-dialog
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
  </div>
</template>

<script>
import addUpdateDialog from "./components/addUpdateDialog";

// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
// request
import {
  getFileTerRule,
  getProtocolVariableOption,
  deleteFileTerRule,
  updateFileTerRule,
} from "@/api/transmitSys/forwardFilter";
// 辅助函数
export default {
  name: "forwardFilter",
  components: {
    addUpdateDialog,
  },
  filters: {},
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton,addUpdateAction],
  data() {
    return {
      listQuery: {
        variableId: "",
        formulaName: "",
      },
      faultLevelList: [],
      // 字段管理所需字段
      tableList: [
        {
          value: "协议数据项",
          prop: "variableName",
          width: 200,
          checked: true,
        },
        {
          value: "公式名称",
          prop: "formulaName",
          position: "center",
          checked: true,
          width: 150,
        },
        {
          value: "显示公式",
          prop: "formulaValue",
          width: 150,
          position: "center",
          checked: true,
        },
        {
          value: "备注",
          prop: "remark",
          width: 220,
          position: "center",
          checked: true,
        },
      ],
      addUpdateVisible: false /* 添加/编辑、 */,
      importVisible: false,
      resultVisible: false,
      importQueryVisible: false,
      importResult: {},
      title: "",
      isEdit: false, //是否编辑
    };
  },
  watch: {},
  computed: {
    searchList() {
      return [
        {
          type: "select",
          label: "协议数据项",
          value: "variableId",
          options: {
            data: this.faultLevelList, //下拉数组
            extraProps: {
              label: "text",
              value: "value",
            },
          },
        },
        {
          type: "input",
          label: "公式名称",
          value: "formulaName",
        },
      ];
    },
  },
  mounted() {
    this._getProtocolVariableOption();
  },
  methods: {
    _getProtocolVariableOption() {
      getProtocolVariableOption().then((res) => {
        this.faultLevelList = res.data.data;
      });
    },
    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getFileTerRule(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
            this.tableRow = {};
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    /**
     * @name: 添加
     * @param {*}
     */
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    /**
     * @name: 导出
     * @param {*}
     */
    handleExport() {
      exportCarMaker(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功",
            duration: 2 * 1000,
          });
        }
      });
    },
    // 新增完成
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },

    // 编辑
    handleUpdate(row) {
      this.tableRow = row;
      this.isEdit = true;
      this.addUpdateVisible = true;
    },

    // 编辑成功
    updateComplete() {
      this.listLoad();
      this.$message.success({
        message: "编辑成功",
        duration: 2 * 1000,
      });
    },
    // 删除
    handleDelete(row) {
      // console.log(row);
      // 确定删除协议名称为 ${row.protocolName} 的数据吗？
      this.$confirm(`确定要删除这条数据吗？`, "删除", {
      confirmButtonText: this.$t("addUpdateAction.define"),
	    cancelButtonText: this.$t("addUpdateAction.cancel"),
        type: "warning",
      })
        .then(() => {
          let param = {
            filterRulesId: row.filterRulesId,
            formulaName: row.formulaName,
          };
          deleteFileTerRule(param).then(({ data }) => {
            if (data.code === 0) {
                this.deleteComplete();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.defaults {
  border-bottom: 1px solid #109cff;
}
.errors {
  border-bottom: 1px solid #ff0000;
}
.queue::before {
  content: "";
  display: block;
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00d2cb;
  border-radius: 50%;
}
</style>
