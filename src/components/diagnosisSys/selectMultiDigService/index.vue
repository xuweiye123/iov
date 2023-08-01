<template>
	<app-dialog
		:visibles="visibles"
		:title="'选择诊断服务'"
		width="70%"
		top="8vh"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
		:isFooter="true"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form :listQuery="listQuery" :searchList="searchList"/>
				</div>
				<!-- 清空查询按钮 -->
				<app-search-button
					slot="bottom"
					:isCollapse="false"
					:isdisabled="listLoading"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<div class="section-wrap">
				<div class="section-flex">
					<div style="padding-left:10px">
						诊断服务：
						<span class="textColor">
							{{ rowDigService }}
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
					ref="historyTable"
					:isTableSelection="true"
					:list="list"
					:listLoading="listLoading"
					:tableHeights="tableHeight"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:isShowOperation="false"
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
// request
import { getReadList } from "@/api/diagnosisSys/online";
export default {
	doNotInit: true,
	name: "selectMultiDigService",
	mixins: [pagingMixin, dialogOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		propServiceList: {
			type: Array,
			default: () => {
				return [];
			},
		},
		ecuList: {
			default: () => ({}),
		},
		ecuClassId: {
			type: String,
			default: "",
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.selectionDataList = this.propServiceList;
				this.changdu = this.selectionDataList.length;
				this.listQuery.pageNum = 1;
				this.listLoad();
				this.rowDigService = "已选中" + this.selectionDataList.length + "个";
			}
		},
	},
	data() {
		return {
			listQuery: {
				serviceName: "",
				aliasName: "",
			},
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 120,
				},
				{
					value: "服务名称",
					prop: "serviceName",
					checked: true,
					width: 120,
				},
				{
					value: "服务别名",
					prop: "aliasName",
					checked: true,
					width: 120,
				},
				{
					value: "指令内容",
					prop: "content",
					checked: true,
					width: 120,
				},
			],
			changdu: 0,
			rowDigService: "",
			selectionDataList: [],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "服务名称",
					value: "serviceName",
				},
				{
					type: "input",
					label: "服务别名",
					value: "aliasName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			this.listQuery.ecuId = this.ecuList.ecuid;
			this.listQuery.ecuClassId = this.ecuList.ecuClassId;
			getReadList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.$nextTick(() => {
							if (this.selectionDataList.length > 0) {
								this.toggleSelection(this.selectionDataList);
							}
						});
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		handleSelectionChange(val) {
			this.selectionDataList = val;
			if (val !== []) {
				this.rowDigService = "已选中" + this.selectionDataList.length + "个";
			}
		},
		toggleSelection(rows) {
			if (rows) {
				rows.forEach((row) => {
					for (let i = 0; i < this.list.length; i++) {
						if (row.id == this.list[i].id) {
							this.$refs.historyTable
								.refTable()
								.toggleRowSelection(this.list[i], true);
						}
					}
				});
			} else {
				this.$refs.historyTable.refTable().clearSelection();
			}
		},
		handleConfirm() {
			if (!this.selectionDataList.length) {
				this.$alert("请选择诊断服务", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("setDigService", this.selectionDataList);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.selectionDataList = [];
			this.listQuery = {
				serviceName: "",
				aliasName: "",
				pageSize: 10,
				pageNum: 1,
			};
			this.changdu = 0;
			this.list = [];
			this.total = 0;
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
