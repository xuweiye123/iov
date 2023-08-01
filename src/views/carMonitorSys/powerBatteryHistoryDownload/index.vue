<template>
	<div
		v-loading="loading"
		class="menuManager app-container"
		style="position:relative;"
	>
		<div class="history-arrow" @click="clickCollapse">
			<i v-show="!collapse"  class='iconfont icon-history-z' />
			<i v-show="collapse" class='iconfont icon-history-s' />
		</div>
		<div
			class="history-down paneL"
			:style="{ padding: '0 ' + paneLeft + 'px 0 0' }"
		>
			<div class="box-list" style="height: calc(100vh - 121px);">
				<app-search>
					<div slot="content">
						<seach-form
					  	:spanNumber="collapse?6:8"
							:listQuery="listQuery"
							:searchList="searchList"
						/>
						<!-- <el-row :gutter="10" type="flex" justify="start" align="middle">
							<el-col :span="8">
								<el-form
									:label-position="'right'"
									:model="listQuery"
									label-width="65px"
								>
									<el-form-item label="任务名称：">
										<el-input
											v-model="listQuery.taskName"
											filterable
											clearable
											placeholder="请输入任务名称"
										/>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="8">
								<el-form
									:label-position="'right'"
									:model="listQuery"
									label-width="65px"
								>
									<el-form-item label="下载状态：">
										<el-select
											v-model="listQuery.status"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option
												v-for="(item, index) in commontData.downLoadStatus"
												:key="index"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
						</el-row> -->
					</div>
					<app-search-button
						slot="bottom"
						:isdisabled="listLoading"
						:position="collapse?{ x: 35, y: 10 }:{x:10,y:10}"
						:is-collapse="false"
						@click-collapse="handleCollapse"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</app-search>
				<!-- 授权按钮 -->
				<div
					class="section-wrap"
					:style="{ 'min-height': minBoxHeight + 'px' }"
				>
					<app-authorize-button
						:buttonLeft="headersLeftList"
            :buttonRight="headersRightList"
						@click-add-task="addTaskVisible = true"
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
						:listLoading="listLoading"
						size="mini"
						:isTableSelection="false"
						:list="list"
						:pageObj="listQuery"
						:isTableNumber="true"
						:filterTableList="filterTableList"
						:total="total"
						:pagerCount="collapse ? 7 : 5"
						:actionWidth="actionWidth"
						:actionFixed="actionFixed"
						:isShowOperation="true"
						@click-deleteTask="_deleteTask"
						:buttonList="insideList"
						:tableHeights="tableHeight"
						@row-click="rowClick"
						@handle-size-change="handleSizeChange"
						@handle-current-change="handleCurrentChange"
					>
						<template slot="tableContent" slot-scope="scope">
							<el-progress
								v-if="scope.item.prop === 'completedCount'"
								:text-outside="true"
								:stroke-width="10"
								:percentage="+scope.row[scope.item.prop]"
							/>
							<span v-else-if="scope.item.prop === 'status'">
								{{ scope.row[scope.item.prop] | switchText(scope.item.prop) }}
							</span>
							<span
								v-else-if="
									scope.item.prop === 'fileType' ||
										scope.item.prop === 'taskLevel'
								"
								>{{
									scope.row[scope.item.prop] | switchText(scope.item.prop)
								}}</span
							>
							<span v-else>
								{{
									scope.row[scope.item.prop] | processData
								}}
							</span>
						</template>
					</app-table>
				</div>
			</div>
		</div>

		<div
			v-show="!collapse"
			class="history-down paneR"
			:style="{ width: paneRight + 'px' }"
		>
			<div
				class="box-list"
				style="height: calc(100vh - 121px);position:relative;"
			>
				<app-search
					:title="'下载子任务列表'"
					:show-title="true"
					:icons="'download-child'"
				>
					<div slot="content">
						<el-row :gutter="10">
							<el-col :span="24">
								<el-form
									:label-position="'right'"
									:model="rightListQuery"
									label-width="60px"
									style="margin:12px 0;"
								>
									<el-form-item label="电池编码：">
										<el-input
											v-model="rightListQuery.bmsCode"
											filterable
											clearable
											placeholder="请输入电池编码"
										/>
									</el-form-item>
								</el-form>
							</el-col>
						</el-row>
						<el-row
							:gutter="10"
						>
							<el-col :span="6">
								<el-form :label-position="'right'" label-width="70px">
									<el-form-item label="占位符" style="visibility: hidden;">
										<el-input />
									</el-form-item>
								</el-form>
							</el-col>
						</el-row>
					</div>
					<app-search-button
						slot="bottom"
						:is-collapse="false"
						:isdisabled="listLoading1"
						@click-collapse="handleCollapse"
						@click-filter="handleSearch"
						@click-clear="rightListQuery.bmsCode = ''"
					>
					</app-search-button>
				</app-search>
				<div
					class="section-wrap"
					:style="{ 'min-height': minBoxHeight + 'px' }"
				>
					<app-table
						ref="table"
						size="mini"
						:listLoading="listLoading1"
						:isTableSelection="false"
						:list="rightTableListData"
						:pageObj="rightListQuery"
						:isTableNumber="true"
						:filterTableList="rightTableList"
						:isPagination="false"
						:tableHeights="tableRightHeight"
						@row-click="rightRowClick"
					>
						<template slot="tableContent" slot-scope="scope">
							<!-- 如果需要特性化显示可使用v-if，v-else-if，v-else-->
							<span v-if="scope.item.prop === 'fileSchedule'">
								<el-progress
									v-show="scope.row.status != 4 && scope.row.status != 5"
									:text-outside="true"
									:stroke-width="10"
									:percentage="+scope.row[scope.item.prop]"
								/>
							</span>
							<span v-else-if="scope.item.prop === 'bmsCode'">
								<el-popover
									placement="top-start"
									width="230"
									trigger="hover"
									:visible-arrow="false"
								>
									<div>
										<p>
											下载状态：{{
												scope.row["status"] | switchTextChildren("status")
											}}
										</p>
										<p>电池编码：{{ scope.row.bmsCode  | processData}}</p>
										<p>文件格式：{{ scope.row.fileExtension  | processData}}</p>
										<p>
											时间范围：{{ scope.row.startTime  | processData}} -
											{{ scope.row.endTime  | processData}}
										</p>
									</div>
									<span
										v-if="scope.row.status === 3 && scope.row.filePath"
										class="vinNo"
										slot="reference"
										>{{ scope.row.bmsCode  | processData}}
										<i style="font-size:13px;" class="el-icon-warning-outline"></i>
									</span
									>
									<span v-else slot="reference">{{ scope.row.bmsCode  | processData}}
										<i style="font-size:13px;" class="el-icon-warning-outline"></i>
									</span>
								</el-popover>
							</span>
							<span
								:title="
									scope.item.prop === 'errorNote'
										? scope.row[scope.item.prop]
										: ''
								"
								v-else
							>
								{{
									scope.row[scope.item.prop]  | processData
								}}
							</span>
						</template>
					</app-table>
				</div>
			</div>
		</div>
		<!-- </split-pane> -->
		<add-task-dialog :visibles.sync="addTaskVisible" @add-complete="listLoad" />
	</div>
</template>

<script>
// request
import {
	getTask,
	deleteTask,
	setTask,
	getTaskDetail,
} from "@/api/carMonitorSys/powerBatteryHistoryDownload";
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import AddTaskDialog from "./components/addTaskDialog";
// 辅助函数
import { mapGetters } from "vuex";

export default {
	name: "powerBatteryHistoryDownload",
	CN_name: "动力电池历史数据下载",
	components: { AddTaskDialog },
	filters: {
		switchText(val, type) {
			if (type === "status") {
				let text = "-";
				switch (val) {
					case 1:
						text = "排队中";
						break;
					case 2:
						text = "进行中";
						break;
					case 3:
						text = "压缩中";
						break;
					case 4:
						text = "已完成";
						break;
					case 5:
						text = "异常";
						break;
					case 6:
						text = "无历史数据";
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
		switchTextChildren(val, type) {
			if (type === "status") {
				let text = "-";
				switch (val) {
					case 1:
						text = "初始化";
						break;
					case 2:
						text = "进行中";
						break;
					case 3:
						text = "已完成";
						break;
					case 4:
						text = "异常";
						break;
					case 5:
						text = "历史数据不存在";
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
		// 查询区数据
    searchList() {
      return [
        {
          label: "任务名称",
          value: "taskName",
          type: 'input',
        },
        {
          label: "下载状态",
          value: "status",
          type: 'select',
          options: {
            data: this.commontData.downLoadStatus,
          },
        },
      ];
    },
	},
	data() {
		return {
			dialogTableVisible: true,
			listQuery: {
				taskName: "",
				status: "",
			},
			rightListQuery: {
				bmsCode: "",
			},
			rightTableList: [
				{
					value: "电池编码",
					prop: "bmsCode",
					width: 220,
				},
				{
					value: "下载进度",
					prop: "fileSchedule",
					width: 100,
				},
				{ value: "说明", prop: "errorNote", width: 140 },
			],
			rightTableListData: [],
			carList: [],
			listLoading1: false,
			tableRightHeight: 0,
			isEdit: false,
			loading: false, // 页面加载
			treeData: [],
			defaultCheckedKeys: [],
			treeLight: true,
			choiceTreeNode: null,
			choiceTreeData: null,
			addUpdateVisible: false,
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 200,
					checked: true,
				},
				{
					value: "任务类型",
					prop: "taskLevel",
					width: 85,
					checked: true,
				},
				{
					value: "下载数",
					prop: "totalCount",
					width: 95,
					checked: true,
				},
				{
					value: "下载状态",
					prop: "status",
					width: 85,
					checked: true,
				},
				{
					value: "下载进度",
					prop: "completedCount",
					width: 100,
					checked: true,
				},
				{
					value: "下载人",
					prop: "createdBy",
					width: 140,
					checked: true,
				},
				{
					value: "任务创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "下载耗时",
					prop: "queryTime",
					width: 160,
					checked: true,
				},
			],
			addTaskVisible: false,
			collapse: false,
			paneLeft: "440",
			paneRight: "430",
		};
	},
	mounted() {},
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
					this.tableRow = {};
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
			//column存在的话，说明是点击行触发；
			//判断是否是在操作列点击
			if (column && column.label == "操作") {
				return;
			}
			this.tableRow = row;
			this.handleSearch();
		},
		// 删除任务
		_deleteTask(row) {
			if (row) this.tableRow = row;
			if (this.tableRow.status === 1) {
				this.$message.warning({
					message: "排队中、进行中或压缩中的任务不可删除",
					duration: 2000,
				});
				return;
			}
			if (this.tableRow.status === 2) {
				this.$message.warning({
					message: "排队中、进行中或压缩中的任务不可删除",
					duration: 2000,
				});
				return;
			}
			if (this.tableRow.status === 3) {
				this.$message.warning({
					message: "排队中、进行中或压缩中的任务不可删除",
					duration: 2000,
				});
				return;
			}
			const postData = {
				taskId: this.tableRow.id,
			};
			this.$confirm(`是否删除${this.tableRow.taskName}?`, "提示", {
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
		// 右侧列点击
		rightRowClick({ row, column }) {
			if (column.label === "电池编码" && row.status === 3 && row.filePath) {
				window.location.href = row.filePath;
			}
		},
		// 右侧查询
		handleSearch() {
			if (!this.tableRow.id) {
				this.$message.warning({
					message: "请选择任务",
					duration: 2 * 1000,
				});
				return;
			}
			const postData = {
				taskId: this.tableRow.id,
				bmsCode: this.rightListQuery.bmsCode,
				// orderfield: this.rightListQuery.orderfield,
				// direction: this.rightListQuery.direction,
			};
			this.listLoading1 = true;
			getTaskDetail(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.rightTableListData = data.data || [];
					}
					this.listLoading1 = false;
				})
				.catch(() => {
					this.listLoading1 = false;
				});
		},
		// 点击收缩展开
		clickCollapse() {
			this.collapse = !this.collapse;
			if (this.collapse) {
				this.paneLeft = "0";
				this.paneRight = "0";
			} else {
				this.paneLeft = "440";
				this.paneRight = "430";
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.history-arrow {
	position: absolute;
	top: 20px;
	right: 10px;
	z-index: 22;
	svg {
		cursor: pointer;
		font-size: 16px !important;
	}
}
.paneL {
	float: left;
	width: 100%;
	box-sizing: border-box;
	.search_content {
		padding-right: 35px !important;
	}
}
.paneR {
	position: absolute;
	top: 0;
	right: 0;
	box-sizing: border-box;
}
.history-down {
	.el-table .cell,
	.el-table th div,
	.el-table .cell,
	.el-table th div,
	.el-table--border td:first-child .cell,
	.el-table--border th:first-child .cell {
		padding: 0 5px;
	}
}
</style>
