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
        :is-collapse="false"
        @click-filter="handleFilter"
        @click-clear="handleClear"
        :isdisabled="listLoading"
      />
    </app-search>
    <div
      class="section-wrap"
      :style="{'min-height':minBoxHeight+'px'}"
    >
      <app-authorize-button
        :buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
        @click-add="handleAdd"
        @click-filter="showfilter=true"
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
        @click-delete="handleDelete"
        @click-update="handleUpdate"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
        >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop==='roleName'">
            <a class="vinNo" @click="seePermisson(scope.row)">{{scope.row[scope.item.prop]| processData}}</a>
          </span>
          <span v-else>
            {{ scope.row[scope.item.prop] | processData }}
          </span>
        </template>
      </app-table>
    </div>
    <!-- 新增修改dialog -->
    <add-update-dialog
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit?tableRow:{}"
      @add-complete="addComplete"
      @update-complete="updateComplete"
      :isSeePermisson="isSeePermisson"
    />
  </div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import { getRole, deleteRole } from "@/api/system/role";
// 组件
import AddUpdateDialog from "./components/addUpdateDialog";
export default {
  name: "role",
  components: {
    AddUpdateDialog,
  },
  mixins: [
    pagingMixin,
    otherHeight,
    tableStyle,
    getPageButton,
  ],
  computed: {
    // 查询区数据
    searchList() {
      return [
        {
          label: "角色名称",
          value: "roleName",
          type: "input",
        },
      ];
    },
  },
  data() {
    return {
      listQuery: {
        roleName:''
      },
      tableList: [
        {
          value: "角色名称",
          prop: "roleName",
          // sortable:true,
          checked: true,
          width:100,
        },
        {
          value: "角色描述",
          prop: "remark",
          width: 100,
          // sortable:true,
          checked: true,
        },
        {
          value: "创建人",
          prop: "createdBy",
          width: 120,
          checked: true,
        },
          {
          value: "创建时间",
          prop: "createdOn",
          width: 140,
          checked: true,
        },
        {
          value: "修改人",
          prop: "modifiedBy",
          width: 120,
          // sortable:true,
          checked: true,
        },
        {
          value: "修改时间",
          prop: "modifiedOn",
          width: 140,
          // sortable:true,
          checked: true,
        },
      ],
      addUpdateVisible: false, // 新增修改dialog
      permissonVisible: false /*权限 */,
      isSeePermisson: false /* 是否为详情 */,
      isEdit: false, // false: 新增, true:编辑
      isPut: false,
    };
  },
  mounted() {

  },
  methods: {
    // 加载数据
    listLoad() {
      this.list=[];
      this.listLoading = true;
      getRole(this.listQuery)
        .then(({ data }) => {
          if (data.code === 0) {
            this.list = data.data
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
      this.addUpdateVisible = true;
      this.isEdit = false;
      this.isSeePermisson = false;
    },
    // 新增完成
    addComplete() {
      this.listLoad();
      this.$message.success({
        message: '新增成功',
        duration: 2 * 1000,
      });
    },
    // 编辑
    handleUpdate(row) {
      this.tableRow = row;
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.isSeePermisson = false;
    },
     // 编辑成功
    updateComplete() {
      this.listLoad();
      this.$message.success({
        message: '编辑成功',
        duration: 2 * 1000,
      });
    },
    /**
     * @name: 查看权限
     * @param {*} row
     */
    seePermisson(row) {
      this.tableRow = row;
      this.isEdit = true;
      this.addUpdateVisible = true;
      this.isSeePermisson = true;
    },
    
    // 删除
    handleDelete(row) {
      this.$confirm("删除角色会导致相关账户失去此角色的权限！请确认您的操作！", "删除角色", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
      })
        .then(() => {
          const deleteData = {
            id: row.roleId,
            roleName:row.roleName
          };
          deleteRole(deleteData).then(({ data }) => {
            if (data.code === 0) {
              this.listLoad();
              this.$message.success({
                message: '删除成功',
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

<style lang='scss' scoped>
.defaults {
  border-bottom: 1px solid #1890ff;
}
.errors {
  border-bottom: 1px solid #ff0000;
}
.action {
  cursor: pointer;
}
.infoBtn {
  color: #40baff;
  margin-right:10px;
  cursor: pointer;
}
::v-deep .el-form-item__label-wrap{
     margin-left: 24px;
   }
</style>
