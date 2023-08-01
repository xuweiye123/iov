<template>
	<app-dialog
		:visibles="visibles"
		:title="'查看ECU'"
		width="60%"
		top="8vh"
		@close-dialog="closeDialog"
		:isFooter="false"
	>
		<div slot="formContent">
			<app-search>
				<div slot="content">
					<seach-form
						:spanNumber="8"
						:listQuery="listQuery"
						:searchList="searchList"
						labelWidth="80px"
					/>
				</div>
				<div slot="bottom">
					<!-- 清空查询按钮 -->
					<app-search-button
						slot="bottom"
						:isCollapse="false"
						:isdisabled="listLoading"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</div>
			</app-search>
			<div class="section-wrap">
				<app-authorize-button @click-filter="showfilter = true">
					<checked-Filter
						slot="check-filter"
						:show.sync="showfilter"
						:list="tableList"
						:scroll-line="8"
					/>
				</app-authorize-button>
				<!-- table -->
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
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { dialogOtherHeight } from "@/mixins/getDialogOtherHeight";
// request
import { getECUList2 } from "@/api/diagnosisSys/commont";
export default {
	doNotInit: true,
	name: "queryEcuDialog",
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
	},
	watch: {
		visibles: {
			handler(e1) {
				if (e1) {
					this.listLoad();
				}
			},
		},
	},
	data() {
		return {
			listQuery: { ecuName: "" },
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 100,
				},
				{
					value: "ODX文件",
					prop: "odxName",
					checked: true,
					width: 300,
				},
				{
					value: "波特率",
					prop: "canbaudrate",
					checked: true,
					width: 100,
				},
				{
					value: "发送地址",
					prop: "requestCanId",
					checked: true,
					width: 120,
				},
				{
					value: "接受地址",
					prop: "responseCanId",
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
		};
	},
	computed: {
		searchList() {
			return [
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
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			this.listQuery.ecuClassId = this.ecuClassId;
			getECUList2(this.listQuery)
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
			this.handleClear();
			this.listQuery.ecuName = "";
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
