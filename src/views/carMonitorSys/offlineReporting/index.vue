<template>
	<div class="js-basedata-cargroup app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				@click-filter="showfilter = true"
				@click-add="handleAdd"
			>
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-seeTask="handleSeeTask"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
				@row-click="rowClick"
				@click-detailCar="detailCarMessage"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						@click="handleSeeTask(scope.row)"
						class="vinNo"
						v-if="scope.item.prop === 'taskName'"
					>
						{{ scope.row[scope.item.prop] | processData}}
					</span>
					<span v-else-if="scope.item.prop == 'isDisable'">
						<el-tag
						  class="tagPointer"
							:type="scope.row[scope.item.prop] == 0 ? 'success' : 'danger'"
							effect="dark"
							style="width: 65px;"
						>
							{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}
						</el-tag>
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 新增编辑dialog弹窗 -->
		<add-task-drawer
			:visibles.sync="addUpdateVisible"
			@add-complete="addComplete"
		/>
		<!-- 查看车辆信息dialog弹窗-->
		<look-car-detail :visibles.sync="lookCarDetailVisible" :data="tableRow" />
		<!-- 查看任务详情dialog弹窗 -->
		<look-task-detail :visibles.sync="lookTaskDetailVisible" :data="tableRow" />
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import addTaskDrawer from "./components/addTaskDrawer";
import lookCarDetail from "./components/lookCarDetail";
import lookTaskDetail from "./components/lookTaskDetail";
// request
import {
	getpagelist,
	isDisableHandle,
} from "@/api/carMonitorSys/offlineReporting";
export default {
	name: "offlineReporting",
	CN_name: "离线报告",
	components: { addTaskDrawer, lookCarDetail, lookTaskDetail },
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	filters: {
		switchText(val, type) {
			if (type === "isDisable") {
				return val == 1 ? "禁用" : val == 0 ? "启用" : "-";
			} else {
				return val || (val===0 ? val:'-');
			}
		},
	},
	data() {
		return {
			listQuery: {
				taskName: "",
			},
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 150,
					checked: true,
				},
				{
					value: "未上线天数",
					prop: "noOnlineDay",
					width: 100,
					checked: true,
				},
				{
					value: "是否启用",
					prop: "isDisable",
					width: 95,
					checked: true,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 110,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "备注",
					prop: "note",
					width: 160,
					checked: true,
				},
			],
			addUpdateVisible: false,
			lookCarDetailVisible: false,
			lookTaskDetailVisible: false,
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "任务名称",
          value: "taskName",
          type: 'input',
        },
      ];
    },
	},
	mounted() {},
	methods: {
		// 导入成功之后刷新list
		reloadList() {
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getpagelist(this.listQuery)
				.then(({ data }) => {
					this.list = [];
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
		// 点击列
		rowClick({ row, column }) {
			const label = column.label;
			this.tableRow = {};
			if (row) this.tableRow = row;
			if (label === "是否启用") {
				const txt =
					row.isDisable == 1 ? "启用" : row.isDisable == 0 ? "禁用" : "";
				const isDisable =
					row.isDisable == 1 ? "0" : row.isDisable == 0 ? "1" : "";
				this.$confirm(`是否${txt}任务?`, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						const postData = {
							id: row.oid,
							isDisable: isDisable,
							taskName: row.taskName,
						};
						isDisableHandle(postData).then(({ data }) => {
							if (data.code === 0) {
								this.listLoad();
								this.tableRow = {};
								this.$message.success({
									message: txt + "成功",
									duration: 2 * 1000,
								});
							}
						});
					})
					.catch(() => {});
			}
		},
		// 新增
		handleAdd() {
			this.addUpdateVisible = true;
		},
		// 新增成功
		addComplete() {
			this.listLoad();
		},

		//车辆详情
		detailCarMessage(row) {
			if (row) this.tableRow = row;
			this.lookCarDetailVisible = true;
		},

		//任务详情
		handleSeeTask(row) {
			if (row) this.tableRow = row;
			this.lookTaskDetailVisible = true;
		},
	},
};
</script>

<style lang="scss"></style>