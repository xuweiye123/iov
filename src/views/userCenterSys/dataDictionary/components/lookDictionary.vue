<template>
  <app-drawer
    :visibles="visibles"
    :title="'查看字典子项'"
    width="60%"
		:wrapperClosable="true"
    @close-drawer="closeDrawer"
    :isDrawerFoot="false"
  >
    <div slot="drawerContent">
      <app-search>
        <div slot="content">
          <seach-form
            :spanNumber="8"
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
      <div class="section-wrap">
        <!-- @click-add="handleAdd" -->
        <!-- 授权按钮 -->
        <app-authorize-button
          :buttonLeft="headersLeftList"
          :buttonRight="[]"
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

        <app-table
          slot="table"
          :isTableSelection="false"
          :isPagination="true"
          :list="list"
          :listLoading="listLoading"
          :filterTableList="filterTableList"
          :tableHeights="tableHeight"
          :pageObj="listQuery"
          :total="total"
          :actionWidth="actionWidth"
          :actionFixed="actionFixed"
          :isShowOperation="true"
          :buttonList="insideList"
          @click-update="handleUpdate"
          @click-delete="handleDelete"
          @handle-selection-change="handleSelectionChange"
          @sort-change="sortChange"
          @handle-size-change="handleSizeChange"
          @handle-current-change="handleCurrentChange"
        >
          <template slot="tableContent" slot-scope="scope">
            <span
              v-if="scope.item.prop === 'isDisabled'"
            >
               <el-tag
              :type="
                scope.row[scope.item.prop] == 0
                  ? 'danger'
                  : scope.row[scope.item.prop] == 1
                  ? 'success'
                  : 'info'
              "
              effect="dark"
              style="width: 50px;"
            >
              {{
                scope.row[scope.item.prop] == 0
                  ? "禁用"
                  : scope.row[scope.item.prop] == 1
                  ? "启用"
                  : "-"
              }}
            </el-tag>
            </span>
            <span v-else>
              {{
                scope.row[scope.item.prop] | processData
              }}
            </span>
          </template>
        </app-table>
      </div>
      <add-update-children-dialog
        :visibles.sync="addUpdateVisible"
        :is-edit="isEdit"
        :data="isEdit ? tableRow : parentData"
        @add-complete="addComplete"
        @update-complete="updateComplete"
      />
    </div>
  </app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import AddUpdateChildrenDialog from "./addUpdateChildrenDialog";
// request
import {
  getDictionaryChildren,
  deleteDictionaryItem,
} from "@/api/system/dataDictionary";

export default {
  name: "lookDictionary",
  mixins: [pagingMixin, getPageButton, drawerOtherHeight, tableStyle],
  components: { AddUpdateChildrenDialog },
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
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        dicCode: "",
        dicName: "",
      },
      addUpdateVisible: false,
      isEdit: false,
      parentData: {},
      tableList: [
        {
          value: "字典编号",
          prop: "dicCode",
          width: 100,
          checked: true,
        },
        {
          value: "字典名称",
          prop: "dicName",
          width: 120,
          checked: true,
        },
        // {
        //   value: "对应字典名称的值",
        //   prop: "dictionaryValue",
        //   width: 120,
        //   checked: true,
        // },
        {
          value: "字典状态",
          prop: "isDisabled",
          checked: true,
          width: 120,
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
   // 查询区数据
    searchList() {
      return [
        {
          label: "字典编号",
          value: "dicCode",
          type: "input",
        },
        {
          label: "字典名称",
          value: "dicName",
          type: "input",
        },
      ];
    },
  },
  watch: {
    visibles(e1) {
      if (e1) {
        const { dicId,dicCode, dicName } = this.data;
        this.parentData.parentDicCode = dicCode;
        this.parentData.parentDicName = dicName;
        this.parentData.parentId = dicId;
        this.listLoad();
      }
    },
  },
  mounted() {
    this.insideList = [
      {
        functionName: "编辑",
        functionNameEn: "编辑",
        functionType: 1,
        iconType:2,           
        url: "update",
        icon: "ic_edit",
        isShow: 1,
      },
      {
        functionName: "删除",
        functionNameEn: "删除",
        functionType: 1,
        iconType:2,
        url: "delete",
        icon: "ic_delete",
        isShow: 1,
      },
    ];
    // 
    this.headersLeftList = [
      {
        functionName: "新增",
        functionNameEn: "新增",
        functionType: 2,
        iconType:2,
        url: "create",
        icon: "ic_add",
        isShow: 1,
      },
     
    ];
  },
  methods: {
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
        return;
      }
      this.listLoading = true;
      this.listQuery.dicId = this.data.dicId;
      getDictionaryChildren(this.listQuery)
        .then(({ data }) => {
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
    closeDrawer() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        dicCode: "",
        dicName: "",
      };
      this.list = [];
      this.total = 0;
      this.$emit("update:visibles", false);
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
        dicId: row.dicId,
        dicName: row.dicName,
      };
      this.$confirm(`是否删除字典名称为 ${row.dicName} 的字典子项？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDictionaryItem(deleteData).then(({ data }) => {
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

<style scoped>

</style>
