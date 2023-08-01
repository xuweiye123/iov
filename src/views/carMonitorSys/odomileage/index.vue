<template>
	<div class="menuManager">
		<div class="box-content">
			<!--  左侧 -->
			<div class="box-list box-left">
				<app-search
					:title="'单车查询'"
					:show-title="true"
					:icons="'car-search'"
					style="margin-bottom:2vh;"
				>
					<div slot="content">
						<el-form
							:label-position="'right'"
							:model="leftListQuery"
							label-width="65px"
						>
							<el-row type="flex" justify="start" align="middle">
								<el-col :span="24" style="margin-bottom:1.5vh;">
									<el-form-item label="VIN码：" size="mini" style="margin-bottom:0;">
										<vin-select
										  size="mini"
											@returnValue="returnValue"
											customClass="vinsearch"
											v-model="leftListQuery.vinNo"
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row
								type="flex"
								justify="start"
								align="middle"
							>
								<el-col :span="24" style="margin-bottom:1.5vh;">
									<el-form-item label="开始时间：" size="mini" style="margin-bottom:0;">
										<el-date-picker
											v-model="leftListQuery.startTime"
											size="mini"
											filterable
											clearable
											placeholder="请选择"
											type="datetime"
											value-format="yyyy-MM-dd HH:mm:ss"
											default-time="00:00:00"
											:picker-options="pickerOptionsOne"
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row
								type="flex"
								justify="start"
								align="middle"
							>
								<el-col :span="24" style="margin-bottom:1.5vh;">
									<el-form-item label="结束时间：" size="mini" style="margin-bottom:0;">
										<el-date-picker
											v-model="leftListQuery.endTime"
											size="mini"
											filterable
											clearable
											placeholder="请选择"
											type="datetime"
											value-format="yyyy-MM-dd HH:mm:ss"
											default-time="23:59:59"
											:picker-options="pickerOptionsTwo"
										/>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row type="flex" justify="start" align="middle">
								<el-col :span="6">
									<el-form-item label="占位符" style="visibility: hidden;">
										<el-input />
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<app-search-button
						slot="bottom"
						size="mini"
						:isdisabled="loading"
						:position="{ x: 15, y: 10 }"
						:is-collapse="false"
						@click-filter="handleSearch"
						@click-clear="handleClearLeft"
					/>
				</app-search>
				<div class="fieldset-style" v-loading="loading">
					<div class="fieldset-style-center">
						<header class="fieldset-title">
							<span class="smallTitle">车辆数据</span>
						</header>
						<p>&emsp;&nbsp;VIN码：{{ carInfo.vinNo || '-' }}</p>
						<p>车型名称：{{ carInfo.carTypeName  || '-' }}</p>
						<p>项目代号：{{ carInfo.batchCode || '-'  }}</p>
						<p style="margin-bottom:0">使用区域：{{ carInfo.areaName || '-'  }}</p>
					</div>
				</div>
				<div class="fieldset-style" style="margin-top:10px;" v-loading="loading">
					<div class="fieldset-style-center">
						<header class="fieldset-title">
							<span class="smallTitle">里程数据</span>
						</header>
						<p>开始时间：{{ carInfo.minTime  || '-' }}</p>
						<p>结束时间：{{ carInfo.maxTime  || '-' }}</p>
						<p>
							<span v-if="carInfo.min == null"
								>开始里程：{{ carInfo.min  || '-' }}</span
							>
							<span v-else>开始里程：{{ carInfo.min  }} km</span>
						</p>
						<p>
							<span v-if="carInfo.max == null"
								>结束里程：{{ carInfo.max || '-'  }}</span
							>
							<span v-else>结束里程：{{ carInfo.max }} km</span>
						</p>
						<p style="margin-bottom:0">
							<span v-if="carInfo.mileage == null"
								>行驶里程：{{ carInfo.mileage || '-'  }}</span
							>
							<span v-else>行驶里程：{{ carInfo.mileage.toFixed(2) }} km</span>
						</p>
					</div>
				</div>
			</div>
			<!-- 右侧 -->
			<div class="box-list box-right">
				<app-search
					:title="'批量查询'"
					:show-title="true"
					:icons="'odo-search'"
				>
					<div slot="content">
						<el-row :gutter="10">
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
						</el-row>
					</div>
					<app-search-button
						slot="bottom"
						:is-collapse="false"
						:isdisabled="listLoading"
						@click-collapse="handleCollapse"
						@click-filter="handleFilter"
						@click-clear="handleClear"
					/>
				</app-search>
				<!-- 授权按钮 -->
				<div
					class="section-wrap"
					:style="{ 'min-height': minBoxHeight + 85 + 'px' }"
				>
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
						:tableHeights="tableHeight + 133"
						:buttonList="insideList"
						@click-look="lookInfo"
						@click-delete="handleDelete"
						@click-downLoadFile="downloadInfo"
						@handle-size-change="handleSizeChange"
						@handle-current-change="handleCurrentChange"
					>
						<template slot="tableContent" slot-scope="scope">
							<span
								@click="lookInfo(scope.row)"
								class="vinNo"
								v-if="scope.item.prop === 'taskName'"
							>
								{{ scope.row[scope.item.prop] | processData}}
							</span>
							<span v-else-if="scope.item.prop === 'ismainstation'">{{
								scope.row[scope.item.prop] == 0 ? "否" : "是"
							}}</span>
							<span v-else-if="scope.item.prop === 'queryTime'">{{
								scope.row[scope.item.prop]
									| switchText(scope.item.prop, scope.row)
							}}</span>
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
		<add-task-drawer :visibles.sync="addTaskVisible" @add-complete="listLoad" />
		<!-- 查看详情 drawer -->
		<look-info-drawer :visibles.sync="lookInfoVisible" :data="tableRow" />
	</div>
</template>

<script>
import {
	getTask,
	deleteTask,
	getMileage,
	getTaskid,
} from "@/api/carMonitorSys/odoMileage";
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import AddTaskDrawer from "./components/addTaskDrawer";
import lookInfoDrawer from "./components/lookInfoDrawer";
// 组件
import vinSelect from "./components/vinSelect";

import { beginTimeAndEndTime } from "@/utils/base";
export default {
	name: "odomileage",
	CN_name: "ODO里程计算",
	components: { AddTaskDrawer, lookInfoDrawer, vinSelect },
	filters: {
		switchText(val, type) {
			if (type === "queryTime") {
				if (!val) {
					return "-";
				}
				let time = parseInt(val) + "秒";
				if (parseInt(val) > 60) {
					const second = parseInt(val) % 60;
					let min = parseInt(val / 60);
					time = min + "分" + second + "秒";

					if (min > 60) {
						min = parseInt(val / 60) % 60;
						let hour = parseInt(parseInt(val / 60) / 60);
						time = hour + "小时" + min + "分" + second + "秒";

						if (hour > 24) {
							hour = parseInt(parseInt(val / 60) / 60) % 24;
							const day = parseInt(parseInt(parseInt(val / 60) / 60) / 24);
							time = day + "天" + hour + "小时" + min + "分" + second + "秒";
						}
					}
				}
				return time;
			} else {
				return val;
			}
		},
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	computed: {
		
	},
	data() {
		return {
			listQuery: {
				taskName: "",
			},
			leftListQuery: {
				startTime: "",
				endTime: "",
				carId: "",
				vinNo: "",
			},
			loading: false,
			addTaskVisible: false,
			tableList: [
				{
					value: "任务名称",
					prop: "taskName",
					width: 150,
					checked: true,
				},
				{
					value: "车辆总数",
					prop: "totalCount",
					width: 93,
					checked: true,
				},
				{
					value: "已完成",
					prop: "successCount",
					width: 85,
					checked: true,
				},
				{
					value: "未查询",
					prop: "unqueryCount",
					width: 85,
					checked: true,
				},
				{
					value: "任务开始时间",
					prop: "taskStartTime",
					width: 150,
					checked: true,
				},
				{
					value: "任务结束时间",
					prop: "overTime",
					width: 150,
					checked: true,
				},
				{
					value: "查询已耗时",
					prop: "queryTime",
					width: 110,
					checked: true,
				},
				{
					value: "开始时间",
					prop: "startTime",
					width: 150,
					checked: true,
				},
				{
					value: "结束时间",
					prop: "endTime",
					width: 150,
					checked: true,
				},
				{
					value: "任务创建时间",
					prop: "createdOn",
					width: 150,
					checked: true,
				},
				{
					value: "创建人",
					prop: "createdBy",
					width: 100,
					checked: true,
				},
				{ value: "备注", prop: "remark", checked: true },
			],
			selectCarList: [],
			vinNoList: [],
			carInfo: {},
			lookInfoVisible: false,
			// 禁用今天之前的时间
        pickerOptionsOne: {
					disabledDate:(time) => {
           let endDate = new Date(this.leftListQuery.endTime)
              return time.getTime() > endDate 
							// - 8.64e7
          }
        },
   
        pickerOptionsTwo: {
          disabledDate:(time) => {
           let startDate = new Date(this.leftListQuery.startTime)
              return time.getTime() < startDate 
          }
        },
		};
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getTask(this.listQuery)
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
		returnValue(val) {
			this.leftListQuery.vinNo = val;
		},
		handleSearch() {
			if (this.leftListQuery.vinNo === "") {
				this.$message.warning({
					message: "请选择VIN码",
					duration: 2 * 1000,
				});
				return;
			}
			if (
				!beginTimeAndEndTime({
					startTime: this.leftListQuery.startTime,
					endTime: this.leftListQuery.endTime,
				})
			){
				return;
      }
			this.loading = true;
			getMileage(this.leftListQuery).then(({ data }) => {
				this.loading = false;
				if (data.code === 0) {
					this.carInfo = data.data[0] || {};
				}
			}).catch(()=>{
				this.loading = false;
			})
		},
		handleClearLeft() {
			for (const k in this.leftListQuery) {
				this.leftListQuery[k] = "";
			}
		},
		// 点击列
		rowClick(row) {
			this.$refs.table.toggleRowSelection(row);
		},
		handleSelectionChange(e) {
			this.selectCarList = [...e];
		},
		handleAdd() {
			this.addTaskVisible = true;
		},
		handleDelete(row) {
			const { id } = row;
			this.$confirm(`是否删除选择的项`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteTask({ id }).then(({ data }) => {
						if (data.code === 0) {
							this.$message.success({
								message: "删除成功",
								duration: 2 * 1000,
							});
							this.listLoad();
						}
					});
				})
				.catch(() => {});
		},
		// 查看
		lookInfo(row) {
			if (row) this.tableRow = row;
			this.lookInfoVisible = true;
		},
		//下载
		downloadInfo(row) {
			const { id } = row;
			getTaskid({ id }).then(({ data }) => {
				if (data.code === 0) {
					var url =
						"file/CarActiveCity/PExport?limit=0&sourceKey=TaskDetailExport&TASKID=" +
						data.data;
					window.location.href = url;
				}
			});
		},
		// // ODO里程计算说明书及指导文档
		// handleoperDownloadODOHelp() {
		// 	var url = "file/upload/template/ODO帮助.pdf";
		// 	// window.location.href = url
		// 	window.open(url, "_blank");
		// },
	},
};
</script>

<style lang="scss" scoped>
p {
	// margin: 1.5vh 1vh;
	// color: #606266;
	font-size: 12px;
}
.box-content {
	width: 100%;
	height: calc(100vh - 180px) !important;
	clear: both;
	.box-left {
		width: 280px;
		height: 100%;
		float: left;
		padding-right: 1.5vh;
		// background: #fff;
		background-clip: content-box;
		display: flex;
		flex-direction: column;

		.fieldset-style {
			flex: auto;
			display: flex;
			padding: 0.75vh 1.5vh;
			// border-top: 1px dashed #e0e5e7;
			// justify-content: center;
			align-items: center;
			.fieldset-style-center {
				margin-left:5px;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.fieldset-title {
					font-size: 15px;
					font-weight: bold;
					svg {
						margin-right: 0.8vh;
					}
					.smallTitle{
            font-family: Microsoft YaHei;
						font-weight: bold;
						color: #262834;
						font-size:14px;
					}
					
				}
				p{
					font-family: Microsoft YaHei;
					font-weight: 400;
					color: #262834;
				}
			}
		}
	}
	.box-right {
		width: calc(100% - 280px);
		float: right;
	}
}
</style>
