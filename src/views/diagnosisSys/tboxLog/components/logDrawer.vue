<template>
	<app-drawer
		:visibles="visibles"
		:title="'上传记录'"
		width="700px"
		@close-drawer="closeDialog"
		:isDrawerFoot="false"
		:wrapperClosable="true"
	>
		<div slot="drawerContent">
			<app-search>
				<div slot="content">
					<seach-form
						:collapse="collapse"
						:listQuery="listQuery"
						:searchList="searchList"
						:spanNumber="8"
					/>
				</div>
				<div slot="bottom">
					<app-search-button
						@click-collapse="handleCollapse"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</div>
			</app-search>
			<app-table
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="false"
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop == 'operationType'">
						{{
							scope.row[scope.item.prop] | switchText(scope.item.prop)
						}}
					</span>
					<span v-else>{{ scope.row[scope.item.prop] | processData }}</span>
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
import { logList, getcarTypeName } from "@/api/diagnosisSys/tboxLog";
// 组件
export default {
	doNotInit: true,
	name: "logDrawer",
	mixins: [pagingMixin, drawerOtherHeight],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		visibles: {
			handler(el) {
				if (el) {
					this.getcarTypeNameList();
					this.listLoad();
				}
			},
		},
	},
	filters: {
		switchText(val, fieldName) {
			if (fieldName === "operationType") {
				return val == 0 ? "下发信息" : val == 1 ? "接收应答" : "-";
			} else {
				return val;
			}
		},
	},
	data() {
		return {
			listQuery: {
				vinNo: "",
				carTypeId: "",
				operationType: "",
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					checked: true,
					width: "180px",
				},
				{
					value: "车型名称",
					prop: "batchName",
					checked: true,
					width: "80px",
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: "140px",
				},
				{
					value: "创建人",
					prop: "loginName",
					checked: true,
					width: "90px",
				},
				{
					value: "操作类型",
					prop: "operationType",
					checked: true,
					width: "80px",
				},
				{
					value: "参数",
					prop: "content",
					checked: true,
					width: "180px",
				},
				{
					value: "备注",
					prop: "note",
					checked: true,
					width: "180px",
				},
			],
			carTypeNameList: [],
			operationTypeList: [
				{ text: "下发信息", value: "0" },
				{ text: "接收应答", value: "1" },
			],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vinNo",
				},
				{
					type: "select",
					label: "车型名称",
					value: "carTypeId",
					options: {
						data: this.carTypeNameList, //下拉数组
						extraProps: {
							label: "carTypeName",
							value: "carTypeId",
						},
					},
				},
				{
					type: "select",
					label: "操作类型",
					value: "operationType",
					options: {
						data: this.operationTypeList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
			];
		},
	},
	methods: {
		// 车型名称
		getcarTypeNameList() {
			getcarTypeName(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.carTypeNameList = data.data;
				}
			});
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			logList(this.listQuery)
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
		// 关闭dialog
		closeDialog() {
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
