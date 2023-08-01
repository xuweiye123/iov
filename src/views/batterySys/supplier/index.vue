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
        :exportLoading="exportLoading"
        @click-filter="showfilter = true"
        @click-add="handleAdd"
        @click-export="handleExport"
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
        :list="list"
        :listLoading="listLoading"
        :filterTableList="filterTableList"
        :pageObj="listQuery"
        :total="total"
        :tableHeights="tableHeight"
        :isShowOperation="true"
        :actionWidth="actionWidth"
        :actionFixed="actionFixed"
        :buttonList="insideList"
        @click-update="handleUpdate"
        @click-delete="handleDelete"
        @handle-size-change="handleSizeChange"
        @handle-current-change="handleCurrentChange"
      >
        <template slot="tableContent" slot-scope="scope">
          <span v-if="scope.item.prop == 'isPush'">
            <el-tag
              :type="scope.row.isPush == 1 ? 'success' : 'info'"
              effect="dark"
              style="width: 65px;"
            >
              {{ scope.row["isPush"] === 1 ? "是" : "否" }}
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

    <!-- 新增编辑dialog弹窗 -->
    <add-update-drawer
      :visibles.sync="addUpdateVisible"
      :is-edit="isEdit"
      :data="isEdit ? tableRow : {}"
      :firmList="supperList"
      @add-complete="addComplete"
      @update-complete="updateComplete"
    />
  </div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getDropList } from "@/mixins/dictionaryDropList";

// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import {
  getsupplierList,
  deleteSupplier,
  exportSupplier,
} from "@/api/batterySys/supplier";
export default {
  name: "supplier",
  components: {
    addUpdateDrawer,
  },
  filters: {

  },
  watch: {

  },
  mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton,getDropList],
  data() {
    return {
      supperList: [],
      // 下拉
      dropList:[
        { postData:{dicCode:2001},key:'supperList' }
      ],
      tableList: [
        {
          value: "厂商名称",
          prop: "supplierName",
          width: 160,
          checked: true,
        },
        {
          value: "厂商代码",
          prop: "supplierCode",
          width: 100,
          checked: true,
        },
        {
          value: "厂商类型",
          prop: "dictionaryName",
          width: 100,
          checked: true,
        },
        {
          value: "统一社会信用代码",
          prop: "creditCode",
          width: 180,
          checked: true,
        },
        {
          value: "厂商地址",
          prop: "supplierAddress",
          width: 140,
          checked: true,
        },
        {
          value: "厂商联系人",
          prop: "supplierContacts",
          width: 100,
          checked: true,
        },
        {
          value: "推送邮箱",
          prop: "pushMail",
          width: 140,
          checked: true,
        },
        {
          value: "是否推送",
          prop: "isPush",
          position: "center",
          width: 100,
          checked: true,
        },
      ],
      addUpdateVisible: false,
      importResult: {},
      isEdit: false,
    };
  },
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "厂商名称",
					value: "supplierName",
				},
        {
					type: "input",
					label: "厂商代码",
					value: "supplierCode",
				},
				{
					type: "select",
					label: "厂商类型",
					value: "supplierType",
					options: {
						data: this.supperList, //下拉数组
						// extraProps: {
						// 	label: "dictionaryName",
						// 	value: "id",
						// },
					},
				}
			];
		}
	},
  created() {
  },
  mounted() {
    // this.authouizeList = [
    //   {
    //     functionName: "新增",
    //     functionNameEn: "新增",
    //     functionType: 2,
    //     url: "create",
    //     icon: "ic_add",
    //     isShow: 1,
    //     iconType:2,
    //   },
    //   {
    //     functionName: "导出",
    //     functionNameEn: "导出",
    //     functionType: 2,
    //     url: "export",
    //     icon: "export",
    //     isShow: 1,
    //     iconType:2,
    //   },
    //   {
    //     functionName: "编辑",
    //     functionNameEn: "编辑",
    //     functionType: 1,
    //     url: "update",
    //     icon: "ic_edit",
    //     isShow: 1,
    //   },
    //   {
    //     functionName: "删除",
    //     functionNameEn: "删除",
    //     functionType: 1,
    //     url: "delete",
    //     icon: "ic_delete",
    //     isShow: 1,
    //   },
    // ];
    // 数据字典下拉
    this.getDropList(this.dropList)
  },
  methods: {
    // 新增
    handleAdd() {
      this.isEdit = false;
      this.addUpdateVisible = true;
    },
    // 加载数据
    listLoad() {
      this.listLoading = true;
      getsupplierList(this.listQuery).then(({ data }) => {
        this.list = [];
        this.total = 0
        if (data.code === 0) {
          this.list = data.data;
          this.total = data.total;
        }
      }).finally(() => {
         this.listLoading = false;
        })
    },
   
    //导出
    handleExport() {
      this.exportLoading = true;
      exportSupplier(this.listQuery).then(() => {
      }).finally(() => {
        this.exportLoading = false;
      })
    },
    // 新增成功
    addComplete() {
      this.listLoad();
    },
    // 编辑
    handleUpdate(row) {
      this.isEdit = true;
      this.tableRow = row;
      this.addUpdateVisible = true;
    },
    // 编辑成功
    updateComplete() {
      this.listLoad();
    },

    // 删除
    handleDelete(row) {
      const deleteData = {
        id: row.oid,
      };
      this.$confirm(`是否删除${row.supplierName}厂商?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSupplier(deleteData).then(({ data }) => {
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
    }
  },
};
</script>

<style lang="scss">

</style>
