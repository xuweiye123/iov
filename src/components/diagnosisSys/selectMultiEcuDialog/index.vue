<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择ECU'"
		:width="'65%'"
		:top="'5vh'"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
		:isFooter="true"
	>
		<div slot="formContent" class="box-list">
			<app-search>
				<div slot="content">
					<seach-form
						:spanNumber="8"
						:labelWidth="'75px'"
						:listQuery="listQuery"
						:searchList="searchList"
					/>
				</div>
				<div slot="bottom">
					<!-- 清空查询按钮 -->
					<app-search-button
						:isCollapse="false"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</div>
			</app-search>
			<div class="section-wrap">
				<div
					style="display:flex;justify-content: space-between;align-items: center;"
				>
					<p class="textColor" style="margin-left:8px;">
						已选择： {{ selectList.length }}个
					</p>
					<app-authorize-button @click-filter="showfilter = true">
						<checked-Filter
							slot="check-filter"
							:show.sync="showfilter"
							:list="tableList"
							:scroll-line="8"
						/>
					</app-authorize-button>
				</div>
				<!-- 按钮 -->
				<app-table
					slot="table"
					ref="historyTable"
					:isTableSelection="true"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:actionWidth="actionWidth"
					:actionFixed="actionFixed"
					:tableHeights="tableHeight"
					rowKey="id"
					:isShowOperation="false"
					:isPagination="true"
					@handle-selection-change="handleSelectionChange"
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
		</div>
	</app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";

import { duplicateRemoval } from "@/utils/base";
import { getECUList } from "@/api/diagnosisSys/commont";
export default {
	doNotInit: true,
	name: "selectEcuDialog",
	mixins: [pagingMixin, dialogOtherHeight, tableStyle],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Array,
			default: () => [],
		},
	},
	filters: {},
	data() {
		return {
			listQuery: {
				ecuname: "",
			},
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 140,
				},
				{
					value: "ODX文件",
					prop: "odxName",
					checked: true,
					width: 300,
				},
				{
					value: "波特率",
					prop: "baudrate",
					checked: true,
					width: 140,
				},
				{
					value: "发送地址",
					prop: "sendAddress",
					checked: true,
					width: 140,
				},
				{
					value: "接受地址",
					prop: "responseAddress",
					checked: true,
					width: 140,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
			],
			batchCodeList: [],
			carTypeList: [],
			selectList: [],
			confirmSelect: [],
			changdu: 0,
		};
	},
	computed: {
		// 查询区数据
		searchList() {
			return [
				{
					label: "ECU名称",
					value: "ecuname",
					type: "input",
				},
			];
		},
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.list = [];
					this.listLoad();
					this.$nextTick(() => {
						this.toggleSelection(this.data);
					});
				}
			},
		},
	},
	methods: {
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					this.$refs.historyTable.refTable().toggleRowSelection(row, true);
				});
			} else {
				this.$refs.historyTable.refTable().clearSelection();
			}
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery = {
				ecuname: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.selectList = [];
			this.$emit("update:visibles", false);
		},
		listLoad() {
			if (!this.visibles) {
				return;
			}
			// let postDate = {}
			// postDate.pageNum=this.listQuery.pageNum
			// postDate.pageSize=this.listQuery.pageSize
			this.listLoading = true;
			getECUList(this.listQuery)
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
		rowSelect(selection, row) {
			const index = this.selectList.findIndex((item) => item.id === row.id);
			if (index > -1) {
				this.selectList.splice(index, 1);
			} else {
				this.selectList.push(row);
			}
			this.changdu = selection.length;
		},
		selectAll(selection) {
			//此时反选
			if (this.changdu > selection.length) {
				for (let i = 0; i < this.list.length; i++) {
					const index = this.selectList.findIndex(
						(item) => item.id === this.list[i].id
					);
					if (index > -1) {
						this.selectList.splice(index, 1);
					}
				}
			} else {
				for (let i = 0; i < this.list.length; i++) {
					this.selectList.push(this.list[i]);
				}
			}
			this.changdu = selection.length;
			this.selectList = duplicateRemoval([...this.selectList], "vinNo");
		},
		clickRow({ row }) {
			const index = this.selectList.findIndex((item) => item.id === row.id);
			if (index > -1) {
				this.selectList.splice(index, 1);
			} else {
				this.selectList.push(row);
			}
			this.changdu = this.selectList.length;
		},
		handleSelectionChange(val) {
			this.selectList = val;
		},
		// 提交按钮
		handleConfirm() {
			this.listQuery.ecuname = "";
			this.listQuery.pageNum = 1;
			this.$emit("carECU", this.selectList);
			this.closeDialog();
		},
	},
};
</script>

<style lang="scss" scoped></style>
