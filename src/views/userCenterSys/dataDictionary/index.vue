<template>
  <div class="js-system-user app-container">
    <app-search>
      <div slot="content">
        <seach-form :listQuery="listQuery" :searchList="searchList" />
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
        @click-lookDictionary="handlelookDictionary"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @row-click="rowClick"
        @handle-selection-change="handleSelectionChange"
        @sort-change="sortChange"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop === 'isDisabled'">
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

    <!-- 查看字典子项 -->
    <look-dictionary :data="tableRow" :visibles.sync="lookDictionaryVisible" />
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
import lookDictionary from "./components/lookDictionary";

// request
import {
  getDictionaryList,
  deleteDictionary,
} from "@/api/system/dataDictionary";

// 辅助函数
export default {
  name: "dataDictionary",
  components: {
    addUpdateDrawer,
    lookDictionary,
  },
  mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
  data() {
    return {
      listQuery: {
        dicCode: "",
        dicName: "",
      },
      addUpdateVisible: false,
      lookDictionaryVisible: false,
      addChildVisible: false,
      isEdit: false,
      // 字段管理所需字段
      tableList: [
        {
          value: "字典编号",
          prop: "dicCode",
          checked: true,
          width: 120,
        },
        {
          value: "字典名称",
          prop: "dicName",
          checked: true,
          width: 200,
        },
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
  watch: {},
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
  mounted() {
    // 暂时强行添加
  },
  methods: {
    // 点击列
    rowClick({ row }) {
      this.tableRow = {};
      this.list.some((item, index) => {
        if (item.dicId === row.dicId) {
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
      getDictionaryList(this.listQuery)
        .then(({ data }) => {
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
      this.$confirm(`是否删除字典名称为 ${row.dicName} 的字典？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDictionary(deleteData).then(({ data }) => {
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
    handlelookDictionary(row) {
      this.lookDictionaryVisible = true;
      this.tableRow = row;
    },
  },
};
</script>

<style lang="scss" scoped></style>
