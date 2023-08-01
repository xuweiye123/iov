<template>
	<app-drawer
		:visibles="visibles"
		:title="'选择诊断服务'"
		width="800px"
		@close-drawer="closeDialog"
		@ok-drawer="handleConfirm"
		:isDrawerFoot="true"
	>
		<div slot="drawerContent">
			<app-search>
				<div slot="content">
					<seach-form :listQuery="listQuery" :spanNumber="8" :searchList="searchList" />
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
			<div style="padding-left:10px" v-show="isShowTitle">
				ECU：
				<span class="textColor">
					{{ rowDigService }}
				</span>
			</div>
			<!-- table -->
			<!-- :selectionData="selectionDataList" -->
			<app-table
				slot="table"
				:isTableSelection="true"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="false"
				:tableHeights="tableHeight"
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
	</app-drawer>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
// request
import { getReadList } from "@/api/diagnosisSys/online";
export default {
	doNotInit: true,
	name: "selectDiagnosisServiceDrawer",
	mixins: [pagingMixin, drawerOtherHeight],
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
			type: Array,
			default: () => ([]),
		},
		ecuClassId: {
			type: String,
			default: "",
		},
	},
	watch: {
		visibles(e1) {
			if (e1) {
				if (
					this.ecuList.length<1
				) {
					this.isShowTitle = false;
					this.tableList[0].checked = true;
				}
				this.listLoad();
				this.rowDigService = this.ecuList.map((obj) => obj.ecuName).join(",");
			}
		},
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
	data() {
		return {
			listQuery: { ecuId: "" },
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					width: 150,
					checked: true,
				},
				{
					value: "服务名称",
					prop: "serviceName",
					width: 120,
					checked: true,
				},
				{
					value: "服务别名",
					prop: "aliasName",
					width: 120,
					checked: true,
				},
				{
					value: "指令内容",
					prop: "content",
					width: 120,
					checked: true,
				},
			],
			rowDigService: "",
			serviceList: [],
			serviceIdList: [],
			isShowTitle: true,
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.listQuery.ecuId = this.ecuList.map((obj) => obj.id).join(",");
			this.listQuery.ecuClassId = this.ecuList.ecuClassId;
			getReadList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
					this.listLoading = false;
				})
				.then(() => {
					if (this.propServiceList.length > 0) {
						this.serviceIdList = [];
						this.propServiceList.forEach((r) => {
							this.serviceIdList.push(r.id);
						});
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		handleSelectionChange(val) {
			this.serviceList = val;
			// let count = 0;
			val.forEach((r) => {
				if (this.serviceIdList.includes(r.id)) {
					this.propServiceList.splice(
						this.propServiceList.findIndex((item) => item.id === r.id),
						1
					);
					this.serviceIdList.splice(
						this.serviceIdList.findIndex((item) => item === r.id),
						1
					);
				}
			});
		},
		handleConfirm() {
			if (this.serviceList && this.serviceList.length <= 0) {
				this.$alert("请选中诊断服务", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			let arr = [...this.serviceList, ...this.propServiceList];
			this.$emit("setDigService", arr);
			this.closeDialog();
		},
		// 关闭dialog
		closeDialog() {
			this.list = [];
			this.handleClear();
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
