<template>
	<app-drawer
		:visibles="visibles"
		:title="'流量统计明细'"
		width="800px"
		:wrapperClosable="true"
		@close-drawer="closeDialog"
		:isDrawerFoot="false"
	>
		<div slot="drawerContent">
			<!-- table -->
			<app-table
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						v-if="
							scope.item.prop === 'sendFlow' ||
								scope.item.prop === 'receiveFlow'
						"
					>
						{{ scope.row[scope.item.prop] | fileSizeConversion }}
					</span>
					<span v-else>
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
import { tableStyle } from "@/mixins/tableStyle";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
// request
import { getLinkFlowStatistics } from "@/api/transmitSys/flow";
export default {
	doNotInit: true,
	name: "detailDrawer",
	mixins: [pagingMixin, tableStyle, drawerOtherHeight],
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
	data() {
		return {
			tableList: [
				{
					value: "转发链路名称",
					prop: "linkName",
					width: 150,
					checked: true,
				},
				{
					value: "发送流量",
					prop: "sendFlow",
					width: 120,
					checked: true,
				},
				{
					value: "发送数量",
					prop: "sendCount",
					width: 90,
					checked: true,
				},
				{
					value: "接收流量",
					prop: "receiveFlow",
					width: 120,
					checked: true,
				},
				{
					value: "接收数量",
					prop: "receiveCount",
					width: 120,
					checked: true,
				},
				{
					value: "统计数据日期",
					prop: "countDate",
					width: 110,
					checked: true,
				},
			],
		};
	},
	watch: {
		visibles: {
			handler(e) {
				if (e) {
					this.listQuery = {
						...this.data,
						...this.listQuery,
					};
					this.listLoad();
				}
			},
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getLinkFlowStatistics(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 关闭
		closeDialog() {
			this.listQuery = {
				pageSize: 10,
				pageNum: 1,
			};
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
