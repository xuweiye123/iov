<template>
	<div>
		<app-dialog
			:visibles="visibles"
			:title="'选择分系统'"
			width="70%"
			top="8vh"
			@close-dialog="closeDialog"
			@handle-submit="handleConfirm"
			:isFooter="true"
		>
			<div slot="formContent">
				<app-search>
					<div slot="content">
						<seach-form
							:listQuery="listQuery"
							:searchList="searchList"
							labelWidth="80px"
						/>
					</div>
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
							已选中分系统：
							<span class="textColor">
								{{ systemName }}
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
						:buttonList="buttonList"
						:isShowOperation="true"
						:tableHeights="tableHeight"
						@click-detail="queryEcuList"
						@row-dblclick="rowDblClick"
						@row-click="rowClick"
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
		<query-ecu-list :visibles.sync="ecuListVisible" :ecuClassId="ecuClassId" />
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
// request
import { getSubSystemList } from "@/api/diagnosisSys/commont";
// 组件
import queryEcuList from "../queryEcuDialog";
export default {
	name: "selectSubSystem",
	doNotInit: true,
	components: {
		queryEcuList,
	},
	mixins: [pagingMixin, dialogOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		carTypeId: {
			type: String,
			default: "",
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	filters: {
		disableText(status) {
			return status ? "启用" : "禁用";
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.listLoad();
					if (this.data.id) {
						this.systemName = this.data.subSystemName;
						this.tableRow = {...this.data};
					}
				}
			},
		},
	},
	data() {
		return {
			listQuery: {
				subSystemName: "",
				ecuName: "",
			},
			tableRow: null,
			tableList: [
				{ value: "分系统ID", prop: "id", checked: false },
				{
					value: "分系统名称",
					prop: "subSystemName",
					width: 120,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					width: 140,
					checked: false,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 120,
					checked: false,
				},
				{
					value: "车型名称	",
					prop: "carTypeName",
					width: 120,
					checked: true,
				},
			],
			ecuListVisible: false,
			ecuClassId: "", // 用于查看关联ECU
			systemName: "",
			buttonList: [
				{
					functionName: "查看关联ECU",
					functionNameEn: "查看关联ECU",
					url: "detail",
					icon: "detail",
					isShow: 1,
				},
			],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "分系统名称",
					value: "subSystemName",
				},
				{
					type: "input",
					label: "ECU名称",
					value: "ecuName",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			if (!this.carTypeId) {
				return;
			}
			this.listLoading = true;
			this.listQuery.carTypeId = this.carTypeId;
			getSubSystemList(this.listQuery)
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
			this.systemName = row.subSystemName;
		},
		queryEcuList(row) {
			this.ecuClassId = row.id;
			this.ecuListVisible = true;
		},
		// 关闭dialog
		closeDialog() {
			this.handleClear();
			this.systemName = "";
			this.tableRow = null;
			this.$emit("update:visibles", false);
		},
		rowDblClick(row) {
			if (row) this.tableRow = row;
			this.handleConfirm();
		},
		handleConfirm() {
			if (!this.tableRow) {
				this.$alert("请选择分系统", "提示", {
					confirmButtonText: "确定",
				});
				return;
			}
			this.$emit("setSubSystemName", this.tableRow);
			this.closeDialog();
		},
	},
};
</script>

<style lang="scss" scoped></style>
