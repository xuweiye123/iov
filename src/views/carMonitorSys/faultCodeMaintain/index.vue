<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'100px'"
          :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
      </div>
      <!-- 清空按钮 -->
      <app-search-button
        slot="bottom"
        :isdisabled="listLoading"
        @click-collapse="handleCollapse"
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
        @click-delete="handleDelete"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span
            v-if="
              scope.item.prop === 'faultType' ||
                scope.item.prop === 'faultLevel' ||
                scope.item.prop === 'gbFaultLevel' ||
                scope.item.prop === 'isPopup' ||
                scope.item.prop === 'systemType'
            "
          >
            <span>{{
              scope.row[scope.item.prop] | switchText(scope.item.prop)
            }}</span>
          </span>
          <!-- <span
            v-else-if="scope.item.prop === 'createdBy'"
          >
            {{ scope.row[scope.item.prop]?scope.row[scope.item.prop].split('@')[0]:'-'}}
          </span> -->
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
    <!--  action="api/monitor/fault/faultCode/importFaultCode" -->
    <import-dialog
      action="api/monitor/faultCode/importFaultCode"
      :template-url="'api/monitor/fileStatics/ImportFaultCodes.xlsx'"
      :visibles.sync="importVisible"
      @upload-success="reloadList"
    >
      <result-dialog
        :visibles.sync="resultVisible"
        :data="importResult"
        :text="'故障码'"
        :keys="'faultCode'"
        :is-show="false"
      />
    </import-dialog>
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import importDialog from "@/components/carManageSys/importDialog";
import resultDialog from "@/components/carManageSys/resultDialog";

// request
import {
  getFaultCode,
  deleteFaultCode,
  exportFaultCode,
} from "@/api/carMonitorSys/faultCodeMaintain";

// 辅助函数
export default {
  name: "faultCodeMaintain",
  name_CH: "故障码维护",
  components: {
    addUpdateDrawer,
    importDialog,
    resultDialog,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        faultCode: "",
        faultCodeName: "",
        faultLevel: "",
        faultType: "",
        isPopup: "",
        gbFaultLevel: "",
      },
      faultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
        { label: "四级", value: 4 },
      ],
      gbFaultLevelList: [
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
      ],
      isPopupList: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
      faultTypeList: [
        { label: "国标故障", value: 1 },
        { label: "自定义故障", value: 2 },
      ],
      fileType: null,
      addUpdateVisible: false /* 查看导出记录*/,
      importVisible: false,
      resultVisible: false,
      importResult: {},
      isEdit: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "故障码",
          prop: "faultCode",
          width: 120,
          checked: true,
        },
        {
          value: "故障名称",
          prop: "faultCodeName",
          width: 160,
          checked: true,
        },
        {
          value: "自定义故障等级",
          prop: "faultLevel",
          width: 120,
          checked: true,
        },
        {
          value: "国标故障等级",
          prop: "gbFaultLevel",
          width: 120,
          checked: true,
        },
        {
          value: "是否弹屏",
          prop: "isPopup",
          width: 80,
          checked: true,
        },
        {
          value: "故障类型",
          prop: "faultType",
          width: 120,
          checked: true,
        },
        {
          value: "系统归类",
          prop: "systemType",
          width: 110,
          checked: true,
        },
        {
          value: "零部件",
          prop: "carPartName",
          width: 110,
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: 100,
          checked: true,
        },
        {
          value: "创建时间",
          prop: "createdOn",
          width: 150,
          checked: true,
        },
        {
          value: "维修提示",
          prop: "maintainInfo",
          width: 150,
          checked: true,
        },
        {
          value: "解决方案",
          prop: "solutions",
          width: 150,
          checked: true,
        },
      ],
    };
  },
  filters: {
    switchText(val, type) {
      if (type === "faultType") {
        return val === 1 ? "国标故障" : val === 2 ? "自定义故障" : "-";
      } else if (type === "faultLevel") {
        return val === 1
          ? "一级"
          : val === 2
          ? "二级"
          : val === 3
          ? "三级"
          : val === 4
          ? "四级"
          : "-";
      } else if (type === "gbFaultLevel") {
        return val === 1
          ? "一级"
          : val === 2
          ? "二级"
          : val === 3
          ? "三级"
          : "-";
      } else if (type === "isPopup") {
        return val === 0 ? "否" : val === 1 ? "是" : "-";
      } else if (type === "systemType") {
        return val === 1
          ? "信息娱乐域"
          : val === 2
          ? "车身域系统"
          : val === 3
          ? "TBOX"
          : val === 4
          ? "智能驾驶域"
          : "-";
      }else {
        return val;
      }
    },
  },
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "故障码",
          value: "faultCode",
          type: "input",
          labelWidth:"65px"
        },
        {
          label: "故障名称",
          value: "faultCodeName",
          type: "input",
          labelWidth:"65px"
        },
        {
          label: "自定义故障等级",
          value: "faultLevel",
          type: 'select',
          options: {
            data: this.faultLevelList,
          },
        },
        {
          label: "国标故障等级",
          value: "gbFaultLevel",
          type: 'select',
          options: {
            data: this.gbFaultLevelList,
          },
        },
        {
          label: "是否弹屏",
          value: "isPopup",
          type: 'select',
          labelWidth:"65px",
          options: {
            data: this.isPopupList,
          },
        },
        {
          label: "故障类型",
          value: "faultType",
          type: 'select',
          labelWidth:"65px",
          options: {
            data: this.faultTypeList,
          },
        },
      ];
    },
  },
  mounted() {
    
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
    // 导出失败信息
    exportFail(data) {
      exportCheckSim(data);
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
      getFaultCode(this.listQuery)
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
    // 删除
    handleDelete(row) {
      const deleteData = {
        faultCodeId: row.faultCodeId,
        faultCode: row.faultCode,
      };
      this.$confirm(`是否删除${row.faultCodeName}故障码？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteFaultCode(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: "删除成功",
                duration: 2 * 1000,
              });
            }
          });
        })
        .catch(() => {});
    },
    // 导出
    handleExport() {
      this.exportLoading = true;
      exportFaultCode(this.listQuery).then(({ data }) => {
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
