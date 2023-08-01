<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form
          :labelWidth="'75px'" 
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
          <span
            v-if="scope.item.prop === 'contactType'||scope.item.prop === 'gender'"
          >
           {{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
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
      :data="isEdit?tableRow:{}"
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
import addUpdateDrawer from './components/addUpdateDrawer'

// request
import { getPageList, deleteContact } from "@/api/carManageSys/contact";

// 辅助函数
export default {
  name: "contact",
  components: {
    addUpdateDrawer,
  },
  filters: {
    switchText(val, type) {
      if (type === "contactType") {
        return val === 1
          ? "车主"
          : val === 2
          ? "单位联系人"
          : val === 3
          ? "用车人"
          : "-";
      } else if (type === "gender") {
        return val === 1 ? "男" : val === 2 ? "女" : "-";
      } else {
        return val || (val===0 ? val:'-');
      }
    },
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        name: "",
        contactType: "",
      },
      contactTypeList: [
        { label: "单位联系人", value: 2 },
        { label: "用车人", value: 3 },
      ],
      addUpdateVisible: false /* 查看导出记录*/,
      isEdit: false, //是否编辑
      // 字段管理所需字段
      tableList: [
        {
          value: "联系人名称",
          prop: "name",
          checked: true,
          width: "100px",
        },
        {
          value: "联系人类型",
          prop: "contactType",
          checked: true,
          width: "100px",
        },
        {
          value: "购车时间",
          prop: "buyDate",
          width: "150px",
          checked: true,
        },
        {
          value: "性别",
          prop: "gender",
          checked: true,
          width: "70px",
        },
        {
          value: "生日",
          prop: "birthdate",
          width: "150px",
          checked: true,
        },
        {
          value: "手机号码",
          prop: "mobilePhone",
          checked: true,
          width: "100px",
        },
        {
          value: "家庭电话",
          prop: "homePhone",
          checked: true,
          width: "100px",
        },
        {
          value: "家庭地址",
          prop: "homeAddress",
          checked: true,
          width: "150px",
        },
        {
          value: "备注说明",
          prop: "remark",
          checked: true,
          width: "150px",
        },
      ],
    };
  },
  watch: {},
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "联系人名称",
          value: "name",
          type: 'input',
        },
        {
          label: "联系人类型",
          value: "contactType",
          type: 'select',
          options: {
            data: this.contactTypeList,
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
    // 删除
    handleDelete(row) {
      const deleteData = {
        contactId: row.contactId,
        name: row.name,
      };
      this.$confirm(`是否删除${row.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteContact(deleteData).then(({ data }) => {
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
