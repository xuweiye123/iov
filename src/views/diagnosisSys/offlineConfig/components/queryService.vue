<template>
	<app-drawer
		:visibles="visibles"
		:title="'查看服务内容'"
		:wrapperClosable="true"
		width="650px"
		@close-drawer="closeDialog"
		:isDrawerFoot="false"
	>
		<div slot="drawerContent">
			<app-table
				slot="table"
				:listLoading="listLoading"
				size="mini"
				:isTableSelection="false"
				:list="list"
				:pageObj="listQuery"
				:filterTableList="filterTableList"
				:total="total"
				:isShowOperation="false"
				:tableHeights="tableHeight"
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
import { tableStyle } from "@/mixins/tableStyle";
// request
import { getConfigServiceList } from "@/api/diagnosisSys/offlineConfig";
export default {
	doNotInit: true,
	name: "QueryECUDialog",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		configId: {
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
			listQuery: {},
			tableList: [
				{
					value: "ECU名称",
					prop: "ecuName",
					checked: true,
					width: 140,
				},
				{
					value: "服务名称",
					prop: "serviceName",
					checked: true,
					width: 140,
				},
				{
					value: "诊断命令",
					prop: "content",
					checked: true,
					width: 140,
				},
				{
					value: "服务描述",
					prop: "description",
					checked: true,
					width: 140,
				},
			],
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			this.listQuery.configId = this.configId;
			getConfigServiceList(this.listQuery)
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
			this.formInfo = {};
			this.listQuery.ecuName = "";
			this.$emit("update:visibles", false);
		},
	},
};
</script>

<style lang="scss" scoped></style>
