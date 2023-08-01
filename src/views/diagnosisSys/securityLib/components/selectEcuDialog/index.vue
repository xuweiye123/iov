<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择ECU'"
		width="70%"
		top="8vh"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
		:isFooter="true"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form :listQuery="listQuery" :searchList="searchList" />
				</div>
				<div slot="bottom">
					<!-- 清空查询按钮 -->
					<app-search-button
						:isCollapse="false"
						:isdisabled="listLoading"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</div>
			</app-search>
			<div class="section-wrap">
				<div class="section-flex">
					<div style="padding-left:10px">
						已选中ECU：
						<span class="textColor">
							{{ rowECUName }}
						</span>
					</div>
					<app-authorize-button @click-filter="showfilter = true">
						<checked-Filter
							slot="check-filter"
							:show.sync="showfilter"
							:list="tableList"
							:scroll-line="8"
						/>
					</app-authorize-button>
				</div>
				<!-- table -->
				<app-table
					slot="table"
					rowKey="id"
					ref="singleTable"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
					:tableHeights="tableHeight"
					@row-click="rowClick"
					@row-dblclick="rowDblClick"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span> {{ scope.row[scope.item.prop] | processData }}</span>
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
// request
import { getECUList } from "@/api/diagnosisSys/commont";
export default {
	doNotInit: true,
	name: "SelectECUDialog",
	mixins: [pagingMixin, dialogOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		ecuClassId: {
			type: String,
			default: "",
		},
		state: {
			type: Number,
			default: 0,
		},
		data: {
			type: Object,
			default: {},
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.listLoad();
					this.rowECUName = "";
					if (this.data.ecuName) {
						this.rowECUName = this.data.ecuName;
						this.tableRow = this.data;
					}
				}
			},
		},
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "ECU名称",
					value: "ecuname",
				},
			];
		},
	},
	data() {
		return {
			listQuery: {
				pageNum: 1,
        pageSize: 10,
			},
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 120,
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
					width: 100,
				},
				{
					value: "发送地址",
					prop: "sendAddress",
					checked: true,
					width: 120,
				},
				{
					value: "接受地址",
					prop: "responseAddress",
					checked: true,
					width: 120,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: false,
					width: 140,
				},
			],
			rowECUName: "",
			tableRow: null,
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.listQuery.ecuClassId = this.ecuClassId;
			this.listQuery.state = this.state;
			getECUList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.list.forEach((row) => {
							if (row.id == this.data.id) {
								this.$refs.singleTable.refTable().setCurrentRow(row);
							}
						});
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 点击列
		rowClick({ row }) {
			if (row) this.tableRow = row;
			this.rowECUName = row.ecuName;
		},
		rowDblClick(row) {
			if (row) this.tableRow = row;
			this.handleConfirm();
		},
		handleConfirm() {
			if (!this.tableRow) {
				this.$alert("请选中ECU", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("carECU", this.tableRow);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.tableRow = null;
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
