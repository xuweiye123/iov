<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
      />
    </app-search>
    <div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
      <!-- 授权按钮 -->
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-add="handleAdd"
        @click-export="handleExport"
        @click-import="importVisible = true"
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
        :isShowOperation="true"
        :buttonList="insideList"
        @click-update="handleUpdate"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop ==='parameterTypeId'">
            {{
              paramTypeList &&
              paramTypeList.length &&
              paramTypeList.find((item) => item.value == scope.row[scope.item.prop])
                ? paramTypeList.find(
                    (item) => item.value == scope.row[scope.item.prop]
                  ).label
                : "-"
            }}
            <!-- {{
               scope.row[scope.item.prop] | switchText(scope.item.prop)
            }} -->
          </span>
          <span v-else>
            {{
              scope.row[scope.item.prop] | processData
            }}
          </span>
        </template>
      </app-table>
    </div>

    <!-- 新增编辑dialog弹窗 -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />

    <!-- 导入dialog弹窗 -->
    <import-dialog
      action="api/monitor/nationalStandardParameter/import"
      :template-url="'api/monitor/fileStatics/ImportNationalStandardParameter.xlsx'"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'参数名称'"
        :keys="'parameterName'"
        :is-show="false"
      >
      </result-dialog>
    </import-dialog>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";
// import { mapGetters } from "vuex";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";

// request
import {
  getPageList,
  paramexports,
} from "@/api/carMonitorSys/nationalParameters";

// 辅助函数
export default {
  name: "nationalParameters",
  CH_name:"国标参数维护",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton,getDropList],
  data() {
    return {
      listQuery: {
        parameterName: "",
        parameterTypeId: "",
      },
      paramTypeList:[],
      dropList: [{ postData: { dicCode: 1012 }, key: "paramTypeList" }],
      addUpdateVisible: false /* 查看导出记录*/,
      importVisible: false,
      resultVisible: false,
      importResult: {},
      isEdit: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "参数名称",
          prop: "parameterName",
          checked: true,
          width: 120,
        },
        {
          value: "参数类型",
          // prop: "paramType",
          prop: "parameterTypeId",
          width: 120,
          checked: true,
        },
        {
          value: "参数单位",
          prop: "parameterUnit",
          checked: true,
          width: 100,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          checked: true,
          width: 140,
        },
        {
          value: "创建人",
          prop: "createdBy",
          checked: true,
          width: 120,
        },
        {
          value: "备注说明",
          prop: "remark",
          checked: true,
          width: 150,
        },
      ],
    };
  },
  filters: {
    // switchText(val, type) {
    //   if (type === "parameterTypeId") {
    //     return val == 1
    //       ? "报警数据"
    //       : val == 2
    //       ? "发动机数据"
    //       : val == 3
    //       ? "极值数据"
    //       : val == 4
    //       ? "燃料电池数据"
    //       : val == 5
    //       ? "可充电储能装置"
    //       : val == 6
    //       ? "车辆位置数据"
    //       : val == 7
    //       ? "整车数据"
    //       : val == 8
    //       ? "驱动电机数据"
    //       : "-";
    //   }
    // },
  },
  computed: {
    // ...mapGetters(["commontData"]),
    // 查询区数据
    searchList() {
      return [
        {
          label: "参数名称",
          value: "parameterName",
          type: 'input',
        },
        {
          label: "参数类型",
          value: "parameterTypeId",
          type: 'select',
          options: {
            // data: this.commontData.paramTypeList,
            data: this.paramTypeList,
          },
        },
      ];
    },
  },
  mounted() {
    // 数据字典下拉
    this.getDropList(this.dropList)
  },
  methods: {
    // 导入成功之后刷新list
    reloadList(data) {
      if (data.failedList&&data.failedList.length > 0) {
        this.importResult = data;
        this.resultVisible = true; 
      } else {
        this.resultVisible = false;
        this.importVisible = false;
      }
      this.listLoad();
    },
    // 点击列
    rowClick({ row }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.id === row.id) {
          row.$index = index;
        }
      });
      this.tableRow = row;
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
    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getPageList(this.listQuery)
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
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 新增成功
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: "新增成功",
        duration: 2 * 1000,
      });
    },
    // 编辑
    handleUpdate(row) {
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.tableRow = row;
    },
    // 编辑成功
    updateComplete() {
      this.listLoad();
      this.$message.success({
        message: "编辑成功",
        duration: 2 * 1000,
      });
    },
    // // 删除
    // handleDelete(row) {
    //   const deleteData = {
    // parameterName:row.parameterName
    //     nationalStandardParameterId: row.nationalStandardParameterId,
    //   };
    //   this.$confirm(`是否删除 ${row.parameterName}？`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       deleteParam(deleteData).then(({ data }) => {
    //         if (data.code === 0) {
    //           this.listLoad();
    //           this.$message.success({
    //             message: "删除成功",
    //             duration: 2 * 1000,
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },
    // 导出
    handleExport() {
      this.exportLoading = true;
      paramexports(this.listQuery).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "导出成功！",
            duration: 2 * 1000,
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      })
    },
  },
};
</script>

<style lang="scss" scoped></style>
