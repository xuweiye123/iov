<template>
	<app-dialog
		:visibles="visibles"
		:title="'双击选择诊断周期配置'"
		width="70%"
		:top="'6vh'"
		@close-dialog="closeDialog"
		@handle-submit="handleConfirm"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form
						:listQuery="listQuery"
						:searchList="searchList"
						:spanNumber="8"
					/>
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
						已选中诊断周期：
						<span class="textColor">
							{{ rowVinno }}
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
					:tableHeights="tableHeight"
					:isShowOperation="false"
					@row-click="rowClick"
					@row-dblclick="rowDblClick"
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
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
// request
import { getConfigList } from "@/api/diagnosisSys/offlineConfig";
export default {
	doNotInit: true,
	name: "selectCycleConfig",
	mixins: [pagingMixin, drawerOtherHeight,dialogOtherHeight],
	computed: {
		// 查询区数据
		searchList() {
			return [
				{
					label: "诊断周期名称",
					value: "configName",
					type: "input",
					labelWidth: "90px",
				},
			];
		},
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
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
					if (this.data.vinNo) {
						this.rowVinno = this.data.configName;
						this.tableRow = this.data;
					}
				}
			},
		},
	},
	data() {
		return {
			listQuery: {},
			tableList: [
				{
					value: "诊断周期名称",
					prop: "configName",
					checked: true,
					width: 180,
				},
				{
					value: "诊断服务数量",
					prop: "serviceCount",
					checked: true,
					width: 120,
				},
				{
					value: "支持车型",
					prop: "carTypeName",
					position: "center",
					checked: true,
					width: 80,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
				{
					value: "备注",
					prop: "remark",
					checked: true,
					width: 140,
				},
			],
			rowVinno: "",
			tableRow: null,
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getConfigList(this.listQuery)
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
			this.rowVinno = row.configName;
			this.tableRow = row;
		},
		rowDblClick(row) {
			this.tableRow = row;
			this.handleConfirm();
		},
		handleConfirm() {
			if (!this.tableRow) {
				this.$alert("请选中诊断配置", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("setConfigName", this.tableRow);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery.configName = "";
			this.listQuery.pageNum = 1;
			this.tableRow = null;
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
