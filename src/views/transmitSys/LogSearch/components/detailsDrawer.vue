<template>
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
						:collapse="collapse"
						:listQuery="listQuery"
						:searchList="searchList"
						:spanNumber="8"
						:labelWidth="'85px'"
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
				:tableHeights="tableHeight"
				:buttonList="insideList"
				@click-ienformation="handlIenformation"
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
								? "转发日志离线导出"
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
								v-if="
									l.url === 'retueninformation' && scope.row.taskStatus === 2
								"
								@click="handlIenformation(scope.row)"
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
import { partialForm } from "@/mixins/partialForm";
import { getForwardLinktaskList } from "@/api/transmitSys/logSearch";
export default {
	doNotInit: true,
	name: "detailsDrawer",
	mixins: [partialForm, pagingMixin, drawerOtherHeight, tableStyle],
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			insideList: [],
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
				taskType: "1",
				taskStatus: "",
				startTime: "",
				endTime: "",
				timeRange:["",""],
			},
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 200,
					checked: true,
				},
				{
					value: "任务类型",
					prop: "taskType",
					width: 150,
					checked: true,
				},
				{
					value: "任务状态",
					prop: "taskStatus",
					width: 150,
					checked: true,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 150,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createdOn",
					width: 150,
					checked: true,
				},
				{
					value: "模板效验信息",
					prop: "vifInfo",
					width: 150,
					checked: true,
				},
				{
					value: "任务开始时间",
					prop: "startTime",
					width: 140,
					checked: true,
				},
				{
					value: "任务结束时间",
					prop: "endTime",
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
					this.listLoad();
				}
			},
		},
	},
	mounted() {
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
				// 	type: "dateTime",
				// 	label: "任务开始时间",
				// 	value: "startTime",
				// },
				// {
				// 	type: "dateTime",
				// 	defaultType: "end",
				// 	label: "任务结束时间",
				// 	value: "endTime",
				// },
				// {
				// 	type: "select",
				// 	label: "数据类型",
				// 	value: "dataType",
				// 	options: {
				// 		data: this.dataType, //下拉数组
				// 		extraProps: {
				// 			label: "text",
				// 			value: "value",
				// 		},
				// 	},
				// },
				// {
				// 	type: "select",
				// 	label: "消息类型",
				// 	value: "msgType",
				// 	options: {
				// 		data: this.messageType, //下拉数组
				// 		extraProps: {
				// 			label: "text",
				// 			value: "value",
				// 		},
				// 	},
				// },
				// {
				// 	type: "input",
				// 	label: "任务名称",
				// 	value: "taskName",
				// },
			];
		},
	},
	methods: {
		handlIenformation(row) {
			if (!row.filePath) {
				this.$message.error("无下载内容");
				return;
			}
			let a = document.createElement("a"); //创建a标签
			a.setAttribute("href", "/file/" + row.filePath); //设置文件下载地址
			a.setAttribute("download", row.filePath.split('/')[row.filePath.split('/').length-1]); //设置文件下载地址
			a.setAttribute("target", "_blank"); //在当前页面创建下载
			document.body.appendChild(a); //添加到body
			a.click(); //触发事件
			document.body.removeChild(a); //移除标签
		},
		// 关闭dialog
		closeDialog() {
			this.collapse = false;
			this.listQuery = {
				taskName: "",
				taskType: "1",
				taskStatus: "",
				startTime: "",
				endTime: "",
				pageSize: 10,
				pageNum: 1,
			};
			this.$emit("update:visibles", false);
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.list = [];
			this.listLoading = true;
			getForwardLinktaskList(this.listQuery)
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
