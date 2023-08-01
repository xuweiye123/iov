<template>
	<div class="app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" style="padding-top:10px;" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- <app-authorize-button
				:data="authouize"
				@click-filter="showfilter = true"
				@click-add="handleAdd"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
					:scroll-line="8"
				/>
			</app-authorize-button> -->
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
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						v-if="
							scope.item.prop == 'contactType' || scope.item.prop == 'gender'
						"
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
			:data="isEdit ? tableRow : {}"
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
// request
import {
	getPageList,
	deleteHandle,
} from "@/api/carMonitorSys/SOFruleManagement";
export default {
	name: "SOFruleManagement",
	CN_name: "单体过放失效管理",
	components: { addUpdateDrawer },
	filters: {
		switchText(val, type) {
			if (type === "contactType") {
				return val === 1
					? "车主"
					: val === 2
					? "单位联系人"
					: val === 3
					? "车辆使用者"
					: "-";
			} else if (type === "gender") {
				return val === 1 ? "男" : val === 2 ? "女" : "-";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton,getDropList],
	data() {
		return {
			listQuery: {
				batteryCategory: "",
			},
			batteryTypeList: [],
			dropList:[
        { postData:{dicCode:1006},key:'batteryTypeList' },
      ],
			tableList: [
				{
					value: "电池类型",
					prop: "dicName",
					width: "100",
					checked: true,
				},
				{
					value: "报警表达式",
					prop: "alarmLevelExpression",
					width: "300",
					checked: true,
				},
			],
			addUpdateVisible: false,
			isEdit: false,
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "电池类型",
          value: "batteryCategory",
          type: 'select',
          options: {
            data: this.batteryTypeList,
            // extraProps: {
            //   value: "value",
            //   label: "text",
            // },
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
		reloadList() {
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getPageList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
					if (data.code === 0) {
						this.tableRow = {};
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
		},
		// 编辑
		handleUpdate(row) {
			if (row) this.tableRow = row;
			this.isEdit = true;
			this.addUpdateVisible = true;
		},
		// 编辑成功
		updateComplete() {
			this.listLoad();
		},
		// 删除
		handleDelete(row) {
			if (row) this.tableRow = row;
			const deleteData = {
				id: this.tableRow.oid,
				// dicName: this.tableRow.dicName,
			};
			this.$confirm(`是否删除 ${this.tableRow.dicName?this.tableRow.dicName:''} ?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteHandle(deleteData).then(({ data }) => {
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
			// handleExports(this.listQuery).then(({ data }) => {
			// 	if (data.code === 0) {
			// 		//
			// 	}
			// });
		},
	},
};
</script>

<style lang="scss" scoped></style>