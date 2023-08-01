<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
				  :label-width="'75px'"
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:is-collapse="false"
				:isdisabled="listLoading"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 授权按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				@click-add-task="handleBatchTask"
				@click-filter="showfilter = true"
			>
				<checked-Filter
					slot="check-filter"
					:show.sync="showfilter"
					:list="tableList"
				/>
			</app-authorize-button>
			<app-table
				ref="tableLeft"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-deleteTask="_deleteTask"
				@click-setCommonTask="handledsetTask1"
				@click-setSelfTask="handledsetTask2"
				@row-click="rowClick"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'taskName'" class="vinNo">{{
						scope.row[scope.item.prop]
					}}</span>
					<el-progress
						v-else-if="scope.item.prop === 'completedCount'"
						:text-outside="true"
						:stroke-width="10"
						:percentage="+scope.row[scope.item.prop]"
					/>
					<span v-else-if="scope.item.prop === 'status'">
						{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
					</span>
					<span
						v-else-if="
							scope.item.prop === 'fileType' || scope.item.prop === 'taskLevel'
						"
						>{{
							scope.row[scope.item.prop] | switchText(scope.item.prop)
						}}</span
					>
					<span v-else>{{
						scope.row[scope.item.prop] | processData
					}}</span>
				</template>
			</app-table>
		</div>
		<!-- 批量任务 -->
		<add-task-batch-drawer
			:visibles.sync="addTaskBatchVisible"
			@add-complete="listLoad"
		/>
		<!-- 详情 -->
		<history-detail-drawer
			:visibles.sync="historyDetailVisible"
			:data="tableRow"
		/>
	</div>
</template>

<script>
// request
import {
	getTask,
	deleteTask,
	setTask,
} from "@/api/carMonitorSys/historySearch";
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import AddTaskBatchDrawer from "./components/addTaskBatchDrawer";
import historyDetailDrawer from "./components/historyDetailDrawer";
// 辅助函数
import { mapGetters } from "vuex";

export default {
	name: "historySearch",
	CN_name: "历史故障离线查询",
	components: { AddTaskBatchDrawer, historyDetailDrawer },
	filters: {
		switchText(val, type) {
			if (type === "status") {
				let text = "";
				switch (val) {
					case 1:
						text = "排队中";
						break;
					case 2:
						text = "进行中";
						break;
					case 3:
						text = "已完成";
						break;
					case 4:
						text = "异常 ";
						break;
				}
				return text;
			} else if (type === "fileType") {
				return val === 1 ? "Excel" : "INR";
			} else if (type === "taskLevel") {
				return val === 1 ? "普通任务" : "紧急任务";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	computed: {
		...mapGetters(["commontData"]),
		// 由于v-for和v-if无法共存，必要情况下应该替换成computed
		// v-for比v-if优先，如果每一次都需要遍历整个数组，将会影响速度，尤其是当之需要渲染很小一部分的时候
		 searchList() {
      return [
        {
          label: "任务名称",
          value: "taskName",
          type: "input",
        },
        {
          label: "任务状态",
          value: "status",
          type: 'select',
          options: {
            data: this.commontData.downLoadStatus1,
          },
        },
        {
          label: "任务创建人",
          value: "createdBy",
          type: "input",
        },
      ];
    },
	},
	data() {
		return {
			listQuery: {
				taskName: "",
				status: "",
				createdBy: "",
			},
			isEdit: false,
			loading: false, // 页面加载
			addUpdateVisible: false,
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 190,
					checked: true,
				},
				{
					value: "任务类型",
					prop: "taskLevel",
					width: 85,
					checked: true,
				},
				// {
				// 	value: "车辆数",
				// 	prop: "totalCount",
				// 	width: 95,
				// 	checked: true,
				// },
				{
					value: "任务状态",
					prop: "status",
					width: 85,
					checked: true,
				},
				{
					value: "任务进度",
					prop: "completedCount",
					width: 100,
					checked: true,
				},
				{
					value: "任务创建人",
					prop: "createdBy",
					width: 100,
					checked: true,
				},
				{
					value: "任务创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "查询耗时",
					prop: "queryTime",
					width: 160,
					checked: true,
				},
			],
			addTaskBatchVisible: false,
			historyDetailVisible: false,
		};
	},
	mounted() {
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.tableRow = {};
			getTask(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data || [];
						this.total = data.total;
						this.list.forEach((item) => {
							item.completedCount =
								item.completedCount / item.totalCount > 1
									? 100
									: Math.round(
											(item.completedCount / item.totalCount) * 100,
											1
									  );
							item.queryTime = this.switchTime(item.queryTime);
						});
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 时间转换
		switchTime(value) {
			if (value) {
				if (parseFloat(value) > 0 && parseFloat(value) < 60) {
					return value + "秒";
				} else if (parseFloat(value) >= 60 && parseFloat(value) < 3600) {
					return Math.floor(value / 60) + "分钟" + (value % 60) + "秒";
				} else if (parseFloat(value) >= 3600 && parseFloat(value) < 86400) {
					return (
						Math.floor(value / 3600) +
						"小时" +
						Math.floor((value % 3600) / 60) +
						"分钟" +
						((value % 3600) % 60) +
						"秒"
					);
				} else if (parseFloat(value) >= 86400) {
					return (
						Math.floor(value / 86400) +
						"天" +
						Math.floor((value % 86400) / 3600) +
						"小时" +
						Math.floor(((value % 86400) % 3600) / 60) +
						"分钟" +
						(((value % 86400) % 3600) % 60) +
						"秒"
					);
				} else {
					return "-";
				}
			} else {
				return "-";
			}
		},
		// 左侧列点击
		rowClick({ row, column }) {
			const label = column.label;
			this.tableRow = row;
			if (label === "任务名称") {
				this.handleHistoryFault();
			}
		},
		// 添加批量任务
		handleBatchTask() {
			this.addTaskBatchVisible = true;
		},
		// 删除任务
		_deleteTask(row) {
			if (row.status === 2) {
				this.$message.warning({
					message: "任务进行中，不可删除",
					duration: 2000,
				});
				return;
			}
			const postData = {
				taskId: row.id,
			};
			this.$confirm(`是否删除${row.taskName}?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteTask(postData).then(({ data }) => {
						if (data.code === 0) {
							this.$message.success({
								message: "删除成功",
								duration: 2000,
							});
							this.listLoad();
							this.tableRow = {};
						}
					});
				})
				.catch(() => {});
		},
		//设置普通任务
		handledsetTask1(row) {
			const postData = {
				taskId: row.id,
				taskLevel: 1,
			};
			setTask(postData).then(({ data }) => {
				if (data.code === 0) {
					this.listLoad();
					this.tableRow = {};
					this.$message.success({
						message: "设置成功",
						duration: 2 * 1000,
					});
				}
			});
		},
		//设置紧急任务
		handledsetTask2(row) {
			const postData = {
				taskId: row.id,
				taskLevel: 2,
			};
			setTask(postData).then(({ data }) => {
				if (data.code === 0) {
					this.listLoad();
					this.tableRow = {};
					this.$message.success({
						message: "设置成功",
						duration: 2 * 1000,
					});
				}
			});
		},
		//查看详情
		handleHistoryFault() {
			this.historyDetailVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped></style>