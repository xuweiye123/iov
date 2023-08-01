<template>
  <div class="js-dockingSystem-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
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
        @click-filter="showfilter = true"
        @click-add="handleAdd"
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
          <span v-if="scope.item.prop === 'status'">
            <el-switch
              v-model="scope.row.status"
              @change="switchingState(scope.$index, scope.row)"
            >
            </el-switch>
          </span>
          <span
            v-else-if="
              scope.item.prop === 'transmissionMethod' ||
                scope.item.prop === 'transmissionFrequency' ||
                scope.item.prop === 'callMethod' ||
                scope.item.prop === 'authMethod'
            "
          >
            {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
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

// request
import {
  getList,
  deleteInterface,
  enableInterface,
  disableInterface,
} from "@/api/carManageSys/interfaceList";

// 辅助函数
export default {
  name: "interfaceList",
  components: {
    addUpdateDrawer,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        dockingSystem: "",
        interfaceName: "",
        interfaceAddress: "",
        status: "",
      },
      statusList: [
        { label: "启用", value: 1 },
        { label: "停用", value: 0 },
      ],
      fileType: null,
      addUpdateVisible: false /* 查看导出记录*/,
      isEdit: false,
      // 字段管理所需字段
      tableList: [ 
        {
          value: "接口名称",
          prop: "interfaceName",
          checked: true,
          width: 120,
        },
        {
          value: "接口地址",
          prop: "interfaceAddress",
          checked: true,
          width: 200,
        },
        {
          value: "传输方式",
          prop: "transmissionMethod",
          checked: true,
          width: 100,
        },
        {
          value: "传输频率",
          prop: "transmissionFrequency",
          width: 100,
          checked: true,
        },
        {
          value: "调用方式",
          prop: "callMethod",
          width: 100,
          checked: true,
        },
        {
          value: "鉴权方式",
          prop: "authMethod",
          checked: true,
          width: 120,
        },
        {
          value: "对接系统",
          prop: "dockingSystem",
          checked: true,
          width: 120,
        },
        {
          value: "接口状态",
          prop: "status",
          checked: true,
          width: 120,
        },
      ],
    };
  },
  filters: {
    switchText(val, type) {
      if (type === "transmissionMethod") {
        return val == 1 ? "查询" : val == 2 ? "同步" : "-";
      } else if (type === "transmissionFrequency") {
        return val == 1 ? "实时" : val == 2 ? "定时" : "-";
      } else if (type === "callMethod") {
        return val == 1 ? "post" : val == 2 ? "get" : "-";
      } else if (type === "authMethod") {
        return val == 1
          ? "账号密码"
          : val == 2
          ? "token"
          : val == 3
          ? "其他"
          : "-";
      } else {
        return val;
      }
    },
  },
  watch: {},
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "接口名称",
          value: "interfaceName",
          type: "input",
        },
        {
          label: "接口地址",
          value: "interfaceAddress",
          type: "input",
        },
        {
          label: "对接系统",
          value: "dockingSystem",
          type: "input",
        },
        {
          label: "接口状态",
          value: "status",
          type: "select",
          options: {
            data: this.statusList,
          },
        },
      ];
    },
  },
  mounted() {
  },
  methods: {
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
    /**
     * @name: 接口的启用和禁用
     * @param {*}
     */
    switchingState(e, row) {
      console.log("row", row);
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      let status = row.status; //保存点击之后v-modeld的值(true，false)
      row.status = !row.status; //保持switch点击前的状态
      if (status) {
        this.$confirm("您确定要启用这个接口吗？", "启用接口", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this._isEnable(row);
          })
          .catch(() => {});
      } else {
        this.$confirm("您确定要停用这个接口吗？", "停用接口", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this._isDisable(row);
          })
          .catch(() => {});
      }
    },
    /**
     * @name: 启用
     * @param {*}
     */
    _isEnable(row) {
      const postData = {
        id: row.id,
        interfaceName: row.interfaceName,
      };
      enableInterface(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "启用成功!",
          });
          this.listLoad();
        }
      });
    },
    /**
     * @name: 禁用
     * @param {*}
     */
    _isDisable(row) {
      const postData = {
        id: row.id,
        interfaceName: row.interfaceName,
      };
      disableInterface(postData).then(({ data }) => {
        if (data.code === 0) {
          this.$message.success({
            message: "停用成功!",
          });
          this.listLoad();
        }
      });
    },
    // 加载数据
    listLoad() {
      this.list = [];
      this.listLoading = true;
      getList(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data;
            this.total = data.total;
            if (this.list && this.list.length) {
              this.list.forEach((item) => {
                item.status = item.status == 1 ? true : false;
              });
            }
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
        id: row.id,
        interfaceName: row.interfaceName,
      };
      this.$confirm(`是否删除${row.interfaceName}接口？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteInterface(deleteData).then(({ data }) => {
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
  },
};
</script>

<style lang="scss" scoped></style>
