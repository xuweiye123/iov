<template>
	<app-dialog
		:visibles="visibles"
		width="60%"
		:title="'添加链路规则'"
		@close-dialog="closeDialog"
		@handle-submit="submitForm"
		:isFooter="true"
		top="5vh"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form
						:listQuery="listQuery"
						:searchList="searchList"
						:labelWidth="'80px'"
					/>
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					slot="bottom"
					:isdisabled="listLoading"
					:isCollapse="false"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<app-table
				ref="tables"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="false"
				:tableHeights="tableHeight"
				@row-click="rowClick"
				@handle-selection-change="handleSelectionChange"
				@click-delete="handleDelete"
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
	</app-dialog>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { tableStyle } from "@/mixins/tableStyle";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
import {
	getFileTerRule,
	getProtocolVariableOption,
	createLinkRule,
} from "@/api/transmitSys/forwardFilter";
export default {
	name: "addFilterDialog",
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
	mixins: [pagingMixin, tableStyle, dialogOtherHeight],
	data() {
		return {
			headersLeftList: [],
			headersRightList: [],
			insideList: [],
			listQuery: {
				variableId: "",
				formulaName: "",
			},
			faultLevelList: [],
			// 字段管理所需字段
			tableList: [
				{
					value: "协议数据项",
					prop: "variableName",
					width: 150,
					checked: true,
				},
				{
					value: "公式名称",
					prop: "formulaName",
					checked: true,
					width: 150,
				},
				{
					value: "显示公式",
					prop: "formulaValue",
					width: 150,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 150,
					checked: true,
				},
			],
			dataList: [],
			formulaName: [],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "select",
					label: "协议数据项",
					value: "variableId",
					options: {
						data: this.faultLevelList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "input",
					label: "公式名称",
					value: "formulaName",
				},
			];
		},
	},
	mounted() {
		this._getProtocolVariableOption();
	},
	methods: {
		_getProtocolVariableOption() {
			getProtocolVariableOption().then(({ data }) => {
				this.faultLevelList = data.data;
			});
		},
		closeDialog() {
			this.listQuery = {
				variableId: "",
				formulaName: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.$emit("update:visibles", false);
		},
		submitForm() {
			if (this.dataList.length == 0) {
				this.$message.error("请选择过滤规则");
				return;
			}
			let parms = {
				linkId: this.data.linkId,
				ruleId: this.dataList,
				linkName: this.data.linkName,
				formulaName: this.formulaName,
			};
			createLinkRule(parms)
				.then(({ data }) => {
					if (data.code == 0) {
						this.$message.success("添加成功");
						this.$emit("update:visibles", false);
					}
				})
				.catch(() => {});
		},
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getFileTerRule(this.listQuery)
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
		// 删除
		handleDelete({ filterRulesId, formulaName }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteFileTerRule({ filterRulesId, formulaName }).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
		//选中
		handleSelectionChange(row) {
			this.dataList = row.map((item) => item.filterRulesId);
			this.formulaName = row.map((item) => item.formulaName);
		},
	},
};
</script>

<style></style>
