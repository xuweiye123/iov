<template>
	<app-drawer
		:visibles="visibles"
		:title="'任务详情列表'"
		width="750px"
		@close-drawer="closeDialog"
		:wrapperClosable="true"
		:isDrawerFoot="false"
	>
		<div slot="drawerContent">
			<app-search>
				<div slot="content">
					<seach-form
						:collapse="collapse"
						:listQuery="listQuery"
						:searchList="searchList"
						:spanNumber="8"
						:labelWidth="'95px'"
					/>
				</div>
				<!-- 清空按钮 -->
				<app-search-button
					slot="bottom"
					:isdisabled="listLoading"
					@click-collapse="handleCollapse"
					@click-filter="handleFilter"
					@click-clear="handleClear"
				/>
			</app-search>
			<app-table
				ref="tables"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="tableList"
				:pageObj="listQuery"
				:total="total"
				:isShowOperation="true"
				:actionWidth="actionWidth"
				:buttonList="insideList"
				:tableHeights="tableHeight"
				@click-ienformation="handlIenformation"
				@click-ErrorMessage="handleErrorMessage"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'taskStatus'">
						<el-tag
							:type="
								scope.row[scope.item.prop] === 0
									? ''
									: scope.row[scope.item.prop] === 1
									? ''
									: scope.row[scope.item.prop] === 2
									? 'success'
									: scope.row[scope.item.prop] === 3
									? 'danger'
									: 'info'
							"
							effect="dark"
						>
							{{
								scope.row[scope.item.prop] === 0
									? "排队中"
									: scope.row[scope.item.prop] === 1
									? "进行中"
									: scope.row[scope.item.prop] === 2
									? "已完成"
									: scope.row[scope.item.prop] === 3
									? "异常"
									: "-"
							}}
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'taskType'">
						{{
							scope.row[scope.item.prop] === 1
								? "车辆状态批量查询"
								: scope.row[scope.item.prop] === 2
								? "批量添加车辆转发"
								: scope.row[scope.item.prop] === 3
								? "批量开启车辆转发"
								: scope.row[scope.item.prop] === 4
								? "批量暂停车辆转发 "
								: "批量删除转发车辆"
						}}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
				<template slot="tableOperation" slot-scope="scope">
					<div style="text-align: left !important">
						<el-tooltip
							v-for="(l, index) in insideList"
							:key="index"
							:open-delay="250"
							class="item"
							effect="dark"
							:content="l.functionName"
							placement="top"
						>
							<span
								class="card-action"
								v-if="l.url === 'retueninformation' && scope.row.filePath"
								@click="handlIenformation(scope.row)"
							>
								<i :class="'iconfont icon-' + l.icon"></i>
							</span>
							<span
								class="card-action"
								v-else-if="l.url === 'errormessage' && scope.row.errorPath"
								@click="handleErrorMessage(scope.row)"
							>
								<i :class="'iconfont icon-' + l.icon"></i>
							</span>
						</el-tooltip>
					</div>
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
import {
	getUploadTask,
} from "@/api/transmitSys/forwardVehicle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
export default {
	doNotInit: true,
	name: "TaskDetailsList",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle, getPageButton],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		isTaskType: {
			type: String,
			default: "",
		},
		linkId: {
			type: String,
			default: "",
		},
		companyIdList: {
			type: Array,
		},
	},

	data() {
		return {
			serverIpList: [],
			taskStatusList: [
				{
					value: "0",
					text: "排队中",
				},
				{
					value: "1",
					text: "进行中",
				},
				{
					value: "2",
					text: "已完成",
				},
				{
					value: "3",
					text: "异常",
				},
			],
			listQuery: {
				taskName: "",
				taskType: "",
				taskStatus: "",
				startTime: "",
				endTime: "",
				linkId: "",
				timeRange:["",""],
			},
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 180,
					checked: true,
				},
				{
					value: "任务类型",
					prop: "taskType",
					width: 150,
					checked: true,
				},
				{
					value: "任务执行状态",
					prop: "taskStatus",
					width: 100,
					checked: true,
				},
				{
					value: "链路名称",
					prop: "linkName",
					width: 150,
					checked: true,
				},
				// {
				// 	value: "任务开始时间",
				// 	prop: "startTime",
				// 	width: 140,
				// 	checked: true,
				// },
				// {
				// 	value: "任务结束时间",
				// 	prop: "endTime",
				// 	width: 140,
				// 	checked: true,
				// },
				{
					value: "任务创建时间",
					prop: "createdOn",
					width: 140,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 100,
					checked: true,
				},
			],
		};
	},
	watch: {
		visibles: {
			handler(e) {
				if (e) {
					this.listQuery.linkId = this.linkId;
					this.listLoad();
				}
			},
		},
	},
	mounted() {
		if (this.isTaskType == "1") {
			this.insideList = [
				{
					functionName: "返回信息",
					functionNameEn: "返回信息",
					functionType: 1,
					iconType: 2,
					buttonPosition: 3,
					url: "retueninformation",
					icon: "lookDownload",
					isShow: 1,
				},
				{
					functionName: "错误信息",
					functionNameEn: "错误信息",
					functionType: 1,
					iconType: 2,
					buttonPosition: 3,
					url: "errormessage",
					icon: "lookDownload",
					isShow: 1,
				},
			];
			this.serverIpList = [
				{
					value: "1",
					text: "车辆状态批量查询",
				},
				{
					value: "2",
					text: "批量添加车辆转发",
				},
			];
			this.listQuery.taskType = "1";
		} else {
			this.insideList = [
				{
					functionName: "返回信息",
					functionNameEn: "返回信息",
					functionType: 1,
					iconType: 2,
					buttonPosition: 3,
					url: "retueninformation",
					icon: "lookDownload",
					isShow: 1,
				},
			];
			this.listQuery.taskType = "3";
			this.serverIpList = [
				{
					value: "3",
					text: "批量开启转发车辆",
				},
				{
					value: "4",
					text: "批量暂停转发车辆",
				},
				{
					value: "5",
					text: "批量删除转发车辆",
				},
			];
		}
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "任务名称",
					value: "taskName",
				},
				{
					type: "select",
					label: "任务状态",
					value: "taskStatus",
					options: {
						data: this.taskStatusList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
        },
				// {
				// 	label: "任务开始时间",
				// 	value: "startTime",
				// 	type: "dateTime",
				// },
				// {
				// 	label: "任务结束时间",
				// 	value: "endTime",
				// 	type: "dateTime",
				// 	defaultType: "end",
				// },
			];
		},
	},
	methods: {
		handleClear() {
			if (this.isTaskType == "1") {
				this.listQuery = {
					taskName: "",
					taskType: "1",
					taskStatus: "",
					startTime: "",
					endTime: "",
					linkId: this.linkId ? this.linkId : "",
					pageNum: 1,
					pageSize: 10,
					timeRange:["",""],
				};
			} else {
				this.listQuery = {
					taskName: "",
					taskType: "3",
					taskStatus: "",
					startTime: "",
					endTime: "",
					linkId: this.linkId ? this.linkId : "",
					pageNum: 1,
					pageSize: 10,
					timeRange:["",""],
				};
			}
			this.listLoad();
		},
		handlIenformation(row) {
			if (!row.filePath) {
				this.$message.error("无下载内容");
				return;
			}
			let a = document.createElement("a"); //创建a标签
			a.setAttribute("href", "/file/" + row.filePath); //设置文件下载地址
			a.setAttribute("target", "_blank"); //在当前页面创建下载
			document.body.appendChild(a); //添加到body
			a.click(); //触发事件
			document.body.removeChild(a); //移除标签
		},
		handleErrorMessage(row) {
			if (!row.errorPath) {
				this.$message.error("无下载内容");
				return;
			}
			let a = document.createElement("a"); //创建a标签
			a.setAttribute("href", "/file/" + row.errorPath); //设置文件下载地址
			a.setAttribute("target", "_blank"); //在当前页面创建下载
			document.body.appendChild(a); //添加到body
			a.click(); //触发事件
			document.body.removeChild(a); //移除标签
		},
		// 关闭dialog
		closeDialog() {
			this.handleClear();
			this.collapse = false;
			this.$emit("update:visibles", false);
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''

			this.list = [];
			this.listLoading = true;
			getUploadTask(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.tableRow = {};
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
