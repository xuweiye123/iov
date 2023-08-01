<template>
	<div>
		<app-drawer
			:visibles="visibles"
			width="700px"
			:title="'过滤规则'"
			@close-drawer="closeDialog"
			:wrapperClosable="true"
			:isDrawerFoot="false"
		>
			<div slot="drawerContent">
				<app-search>
					<div slot="content">
						<seach-form
							:listQuery="listQuery"
							:searchList="searchList"
							:labelWidth="'80px'"
							:spanNumber="8"
						/>
					</div>
					<!-- 清空按钮 -->
					<app-search-button
						slot="bottom"
						:isCollapse="false"
						:isdisabled="listLoading"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</app-search>
				<!-- 授权按钮 -->
				<app-authorize-button
					:buttonLeft="headersLeftList"
					:buttonRight="headersRightList"
					@click-fLinkRuleEntity="handleFLinkRuleEntity"
					@click-filter="showfilter = true"
				>
					<checked-Filter
						slot="check-filter"
						:show.sync="showfilter"
						:list="tableList"
						:scroll-line="8"
					/>
				</app-authorize-button>
				<app-table
					ref="tables"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:actionWidth="actionWidth"
					:actionFixed="actionFixed"
					:tableHeights="tableHeight"
					:isShowOperation="true"
					:buttonList="insideList"
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
				<add-filter-dialog :visibles.sync="isFilter" :data="data" />
			</div>
		</app-drawer>
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { tableStyle } from "@/mixins/tableStyle";
import { addUpdateAction } from "@/mixins/addUpdateAction";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import {
	getProtocolVariableOption,
	deleteFileTerRule,
	getLinkRuleList,
	delLinkRule,
} from "@/api/transmitSys/forwardFilter";
import addFilterDialog from "./addFilterDialog.vue";
export default {
	doNotInit: true,
	name: "addFilterRules",
	components: {
		addFilterDialog,
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => {},
		},
	},
	mixins: [pagingMixin, tableStyle, addUpdateAction, drawerOtherHeight],
	data() {
		return {
			headersLeftList: [
				{
					functionName: "添加链路规则",
					functionNameEn: "添加链路规则",
					functionType: 1,
					iconType: 2,
					buttonPosition: 3,
					url: "fLinkRuleEntity",
					icon: "ic_add",
					isShow: 1,
				},
			],
			headersRightList: [],
			insideList: [],
			isFilter: false,
			listQuery: {
				variableId: "",
				formulaName: "",
				linkId: "",
			},
			serverIpList: [],
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
		};
	},

	watch: {
		visibles: {
			handler(e) {
				if (e) {
					let { linkId } = this.data;
					this.listQuery.linkId = linkId;
					this.listLoad();
				}
			},
		},
		isFilter: {
			handler(e) {
				if (e) {
					this.listLoad();
				}
			},
		},
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
			this.list = [];
			this.$emit("update:visibles", false);
		},
		// 加载数据
		listLoad() {
			if (!this.linkId) {
				return;
			}
			this.list = [];
			this.listLoading = true;
			getLinkRuleList(this.listQuery)
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
		handleDelete(row) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					let param = {
						id: row.id,
						node: this.data.linkName + "-" + "[" + row.formulaName + "]",
					};
					delLinkRule(param).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
		handleFLinkRuleEntity() {
			this.isFilter = true;
		},
	},
};
</script>

<style></style>
