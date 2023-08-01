<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form :listQuery="listQuery" :searchList="searchList" />
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
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 授权按钮 -->
			<app-authorize-button
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				@click-add="handleAdd"
				@click-filter="showfilter = true"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
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
				:tableHeights="tableHeight"
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:buttonList="insideList"
				:isShowOperation="true"
				@click-delete="handleDelete"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						v-if="scope.item.prop === 'taskName'"
						class="vinNo"
						@click="handleClick(scope.row)"
					>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
					<span v-else-if="scope.item.prop === 'state'">{{
						scope.row[scope.item.prop] | switchText
					}}</span>
					<span v-else-if="scope.item.prop === 'progress'">
						<el-progress
							:text-outside="true"
							:stroke-width="10"
							:percentage="
								(scope.row[scope.item.prop] && +scope.row[scope.item.prop]) || 0
							"
						></el-progress>
					</span>
					<span v-else-if="scope.item.prop === 'createdBy'">
						{{
							scope.row[scope.item.prop]
								? scope.row[scope.item.prop].split("@")[0]
								: "-"
						}}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 新增修改drawer -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
		/>
		<query-sub-task :visibles.sync="querySubTaskVisible" :taskId="taskId" />
	</div>
</template>
<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
// request
import { getTaskList, deleteTask } from "@/api/diagnosisSys/offlineTask";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import querySubTask from "./components/querySubTask";
export default {
	name: "offlineTask",
	mixins: [pagingMixin, otherHeight, addUpdateAction, getPageButton],
	components: {
		addUpdateDrawer,
		querySubTask,
	},
	filters: {
		switchText(val) {
			switch (val) {
				case 1:
					return "正常";
				case 2:
					return "被替换";
				case 3:
					return "已过期";
			}
		},
	},
	data() {
		return {
			listQuery: {
				taskName: "",
				configName: "",
				vin: "",
			},
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					checked: true,
					width: 200,
				},
				{
					value: "诊断周期配置名称",
					prop: "configName",
					checked: true,
					width: 200,
				},
				{
					value: "创建人",
					prop: "createdBy",
					checked: true,
					width: 140,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					checked: true,
					width: 140,
				},
				{
					value: "任务开始时间",
					prop: "taskStart",
					checked: true,
					width: 140,
				},
				{
					value: "有效截止时间",
					prop: "taskEnd",
					checked: true,
					width: 140,
				},
				{
					value: "诊断车辆数量",
					prop: "subTaskCount",
					checked: true,
					width: 100,
				},
				// {
				// 	value: "下发进度",
				// 	prop: "progress",
				// 	checked: true,
				// 	width: 110,
				// },
				{
					value: "任务状态",
					prop: "state",
					checked: true,
					width: 80,
				},
				// {
				// 	value: "下发完成数",
				// 	prop: "completedCount",
				// 	checked: true,
				// 	width: 90,
				// },
			],
			querySubTaskVisible: false, // 查看子任务详情dialog
			taskId: "", //任务id
		};
	},
	computed: {
		// 查询区数据
		searchList() {
			return [
				{
					label: "任务名称",
					value: "taskName",
					type: "input",
					labelWidth: "65px",
				},
				{
					label: "诊断周期配置名称",
					value: "configName",
					type: "input",
					labelWidth: "110px",
				},
				{
					label: "VIN码",
					value: "vin",
					// type: "input",
					type: "vin",
					labelWidth: "65px",
				},
			];
		},
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getTaskList(this.listQuery)
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
			const deleteData = {
				taskId: row.id,
				taskName: row.taskName,
			};
			this.$confirm(`确定要删除这条数据吗？`, "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteTask(deleteData).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
		handleClick(row) {
			this.querySubTaskVisible = true;
			this.taskId = row.id;
		},
	},
};
</script>

<style lang="scss"></style>
