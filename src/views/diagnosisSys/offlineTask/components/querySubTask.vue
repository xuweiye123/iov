<template>
	<div>
		<app-drawer
			:visibles="visibles"
			:title="'任务详情列表'"
			width="800px"
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
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span
							v-if="scope.item.prop === 'vinNo'"
							class="vinNo"
							@click="handleClick(scope.row)"
						>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
						<span v-else-if="scope.item.prop === 'progress'">
							<el-progress
								:text-outside="true"
								:stroke-width="10"
								:percentage="
									(scope.row[scope.item.prop] && +scope.row[scope.item.prop]) ||
										0
								"
							></el-progress>
						</span>
						<span v-else-if="scope.item.prop === 'state'">
							<el-tag
								:type="
									scope.row[scope.item.prop] == -1
										? 'danger'
										: scope.row[scope.item.prop] == 0
										? 'danger'
										: scope.row[scope.item.prop] == 1
										? 'dark'
										: scope.row[scope.item.prop] == 2
										? 'success'
										: 'info'
								"
								effect="dark"
							>
								{{ scope.row[scope.item.prop] | switchText }}
							</el-tag>
						</span>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
					</template>
				</app-table>
			</div>
		</app-drawer>
		<query-result :visibles.sync="queryResultVisible" :subTaskId="subTaskId" />
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
// request
import { getSubTaskList } from "@/api/diagnosisSys/offlineTask";
//组件
import queryResult from "./queryResult";
export default {
	doNotInit: true,
	name: "QuerySubTask",
	mixins: [pagingMixin, drawerOtherHeight],
	components: {
		queryResult,
	},
	computed: {
		searchList() {
			return [
				{
					type: "vin",
					label: "VIN码",
					value: "vin",
				},
			];
		},
	},
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		taskId: {
			type: String,
			default: "",
		},
	},
	filters: {
		switchText(val) {
			return val == -1
				? "失效(被替换)"
				: val == 0
				? "未开始"
				: val == 1
				? "进行中"
				: val == 2
				? "已完成"
				: "-";
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
			listQuery: { vin: "" },
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					checked: true,
					width: 180,
				},
				{
					value: "状态",
					prop: "state",
					checked: true,
					width: 130,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
				{
					value: "最新下发时间",
					prop: "lastExcuteTime",
					checked: true,
					width: 180,
				},
				// {
				// 	value: "执行时间",
				// 	prop: "uploadTime",
				// 	checked: true,
				// 	width: 140,
				// },
				// {
				// 	value: "任务结束时间",
				// 	prop: "taskEndTime",
				// 	checked: true,
				// 	width: 140,
				// },
				{
					value: "下发进度",
					prop: "progress",
					checked: true,
					width: 110,
				},
				{
					value: "下发完成数",
					prop: "completedCount",
					checked: true,
					width: 90,
				},
			],
			queryResultVisible: false,
			subTaskId: "", //子任务id
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listLoading = true;
			this.listQuery.taskId = this.taskId;
			getSubTaskList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.total = data.total;
						this.list = data.data;
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 关闭dialog
		closeDialog() {
			this.listQuery = { vin: "", pageSize: 10, pageNum: 1 };
			this.$emit("update:visibles", false);
		},
		handleClick(row) {
			this.queryResultVisible = true;
			this.subTaskId = row.id;
		},
	},
};
</script>

<style lang="scss" scoped></style>
