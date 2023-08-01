<template>
	<div
		v-loading="loading"
		class="menuManager app-container"
		style="position:relative;"
	>
		<div class="history-arrow" @click="clickCollapse">
			<i v-show="!collapse1" class='iconfont icon-history-z RightTop'></i>
			<i v-show="collapse1 &&collapse" class='iconfont icon-history-s RightBottom'></i>
			<i v-show="collapse1 &&!collapse" class='iconfont icon-history-s RightTop'></i>
		</div>
		<div
			class="history-down paneL"
			:style="{ padding: '0 ' + paneLeft + 'px 0 0' }"
		>
			<div class="box-list" style="height: calc(100vh - 121px);">
				<app-search>
					<div slot="content">
						<seach-form
					  	:spanNumber="collapse1?6:8"
							:collapse="collapse"
							:listQuery="listQuery"
							:searchList="searchList"
						/>
						<!-- <el-form
							:label-position="'right'"
							:model="listQuery"
							label-width="80px"
						>
							<el-row :gutter="10" type="flex" justify="start" align="middle">
								<el-col :span="8">
									<el-form-item label="任务名称：">
										<el-input
											v-model="listQuery.taskName"
											filterable
											clearable
											placeholder="请输入任务名称"
										/>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="下载类型：">
										<el-select
											v-model="listQuery.fileType"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option
												v-for="(item, index) in commontData.downLoadType"
												:key="index"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8" class="specialOne">
									<el-form-item label="下载状态：">
										<el-select
											v-model="listQuery.status"
											filterable
											clearable
											placeholder="请选择"
										>
											<el-option
												v-for="(item, index) in downLoadStatus"
												:key="index"
												:label="item.label"
												:value="item.value"
											/>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row
								:gutter="10"
							>
								<el-col :span="8">
									<el-form-item label="下载人：">
										<el-input
											v-model="listQuery.userName"
											filterable
											clearable
											placeholder="请输入下载人"
										/>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form> -->
					</div>
					<app-search-button
						slot="bottom"
						:position="collapse1?{ x: 35, y: 10 }:{x:10,y:10}"
						@click-collapse="handleCollapse"
						:isdisabled="listLoading"
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
						@click-add-task="addTask"
						@click-batch-addtask="handleBatchTask"
						@click-delete-task="_deleteTask"
						@click-look-book="lookbook"
						@click-packaging="packaging"
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
						:pagerCount="collapse1 ? 7 : 5"
						:actionWidth="actionWidth"
						:actionFixed="actionFixed"
						:isShowOperation="true"
						@click-packaging="packaging"
						@click-deleteTask="_deleteTask"
						:buttonList="insideList"
						:tableHeights="tableHeight"
						@row-click="rowClick"
						@sort-change="sortChange"
						@handle-size-change="handleSizeChange"
						@handle-current-change="handleCurrentChange"
					>
						<template slot="tableContent" slot-scope="scope">
							<span>
								<el-progress
									v-if="scope.item.prop === 'completedCount'"
									:text-outside="true"
									:stroke-width="10"
									:percentage="+scope.row[scope.item.prop]"
								/>
								<span
									v-else-if="
										scope.item.prop === 'status' || scope.item.prop === 'isPack'
									"
								>
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
							</span>
						</template>
						<!-- <template slot="tableOperation" slot-scope="scope">
							<div style="text-align: left !important">
								<span 	
								  v-for="(l, index) in insideList"
									:key="index"
								>
									<el-tooltip
									  v-if="(l.url === 'packaging' 
											&& scope.row['isPack'] == 0 
											&& scope.row['totalCount'] > 1
											&& scope.row['status'] != 5)||
											(l.url === 'deleteTask'
											  && scope.row['status']!=1
												&& scope.row['status']!=2
												&& scope.row['status']!=3
											)
										"
										:open-delay="250"
										class="item"
										effect="dark"
										:content="l.functionName"
										:disabled="$store.state.app.isDisTooltip"
										placement="top"
									>
										<span
											class="card-action"
											v-if="l.url === 'packaging' 
												&& scope.row['isPack'] == 0 
												&& scope.row['totalCount'] > 1
												&& scope.row['status'] != 5
											"
											@click="packaging(scope.row)"
										>
											<i :class="'iconfont icon-' + l.icon"></i>
										</span>
										<span
											class="card-action"
											v-else-if="l.url === 'deleteTask' 
												&& scope.row['status']!=1
												&& scope.row['status']!=2
												&& scope.row['status']!=3
											"
											@click="_deleteTask(scope.row)"
										>
											<i :class="'iconfont icon-' + l.icon"></i>
										</span>
									</el-tooltip>
								</span>
							</div>
						</template> -->
					</app-table>
				</div>
			</div>
		</div>

		<div
			v-show="!collapse1"
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
									<el-form-item label="VIN码：">
										<vin-select :is-vin="true" @vinNoTotal="getVinNoTotal" v-model="rightListQuery.vinNo" />
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
						@click-clear="rightListQuery.vinNo = ''"
					>
						<el-button v-waves type="primary" v-show="allDownloadVisible">
							<span @click="downLoadZip"
								><svg-icon icon-class="all-down" /> 打包下载</span
							>
						</el-button>
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
						:tableHeights="tableHeight"
						@row-click="rightRowClick"
						@handle-size-change="handleSizeChange"
						@handle-current-change="handleCurrentChange"
					>
						<template slot="tableContent" slot-scope="scope">
							<span v-if="scope.item.prop === 'fileSchedule'">
								<el-progress
									v-show="scope.row.status != 4 && scope.row.status != 5"
									:text-outside="true"
									:stroke-width="10"
									:percentage="+scope.row[scope.item.prop]"
								/>
							</span>
							<span v-else-if="scope.item.prop === 'vinNo'">
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
										<p>VIN码：{{ scope.row.vinNo | processData}}</p>
										<p>文件格式：{{ scope.row.fileExtension | processData}}</p>
										<p>
											时间范围：{{ scope.row.startTime | processData}} -
											{{ scope.row.endTime | processData}}
										</p>
									</div>
									<span
										v-if="scope.row.status === 3 && scope.row.httpUrl"
										class="vinNo"
										slot="reference"
										>{{ scope.row.vinNo | processData}}
										<i style="font-size:13px;" class="el-icon-warning-outline"></i>
									</span>
									<span v-else slot="reference"
										>{{ scope.row.vinNo | processData}} 
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
									scope.row[scope.item.prop] | processData
								}}
							</span>
						</template>
					</app-table>
				</div>
			</div>
		</div>
		<!-- </split-pane> -->
		<!-- 批量任务 -->
		<add-task-batch-dialog
			:visibles.sync="addTaskBatchVisible"
			@add-complete="listLoad"
		/>
		<!-- 普通任务 -->
		<add-task-general-dialog
			:visibles.sync="addTaskGeneralVisible"
			@add-complete="listLoad"
		/>
	</div>
</template>

<script>
// request
import {
	getTask,
	deleteTask,
	getTaskDetail,
	setTaskPack,
} from "@/api/carMonitorSys/downloadHistory";
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// 组件
import AddTaskBatchDialog from "./components/addTaskBatchDialog";
import AddTaskGeneralDialog from "./components/addTaskGeneralDialog";
// 辅助函数
import { mapGetters } from "vuex";
export default {
	name: "downloadHistoryData",
	CN_name: "历史数据下载",
	components: { AddTaskBatchDialog, AddTaskGeneralDialog },
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
						text = "已完成 ";
						break;
					case 5:
						text = "异常 ";
						break;
					// case 6:
					// 	text = "无历史数据";
					// 	break;
				}
				return text;
			} else if (type === "isPack") {
				let text = "-";
				switch (val) {
					// case 0:
					// 	text = "不打包";
					// 	break;
					case 1:
						text = "排队中";
						break;
					case 2:
						text = "压缩中";
						break;
					case 3:
						text = "压缩完成";
						break;
					case 4:
						text = "无任务压缩 ";
						break;
					case 5:
						text = "异常 ";
						break;
					default:
						text = "不打包";
				}
				return text;
			} else if (type === "fileType") {
				// return val == 1 ? "Excel" : val == 2 ? "INR" : val == 4 ? "CSV" : "-";
				return val == 1 ? "Excel" : val == 4 ? "CSV" : "-";
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
				// return val == 1 ? "Excel" : val == 2 ? "INR" : val == 4 ? "CSV" : "-";
				return val == 1 ? "Excel" :  val == 4 ? "CSV" : "-";
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
            data: this.downLoadStatus,
          },
        },
				{
          label: "下载人",
          value: "userName",
          type: 'input',
        },
				{
          label: "下载类型",
          value: "fileType",
          type: 'select',
          options: {
            data: this.commontData.downLoadType,
          },
        },
      ];
    },
		// isSpecialButton() {
    //   return this.insideList.filter(
    //     (item) => item.url == "packaging"
    //   );
    // },
		// isSpecialButton1() {
    //   return this.insideList.filter(
    //     (item) => item.url == "deleteTask"
    //   );
    // },
	},
	data() {
		return {
			showfilter: false,
			authouizeList: [],
			dialogTableVisible: true,
			actionWidth: 0,
			actionFixed: "right",
			listQuery: {
				taskName: "",
				fileType: "",
				status: "",
				userName: "",
			},
			downLoadStatus: [
				{ label: "排队中", value: 1 },
				{ label: "进行中", value: 2 },
				{ label: "压缩中 ", value: 3 },
				{ label: "已完成", value: 4 },
				{ label: "异常", value: 5 },
			],
			rightListQuery: {
				vinNo: "",
			},
			rightTableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 200,
				},
				{
					value: "下载进度",
					prop: "fileSchedule",
					width: 100,
				},
				{ value: "说明", prop: "errorNote", width: 150 },
			],
			rightTableListData: [],
			carList: [],
			listLoading1: false,
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
					value: "下载车辆数",
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
					value: "打包下载",
					prop: "isPack",
					width: 85,
					checked: true,
				},
				{
					value: "下载人",
					prop: "createdBy",
					width: 120,
					checked: true,
				},
				{
					value: "下载类型",
					prop: "fileType",
					width: 85,
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
			addTaskBatchVisible: false,
			addTaskGeneralVisible: false,
			collapse1: false,
			paneLeft: "440",
			paneRight: "430",
			allDownloadVisible: false,
		};
	},
	mounted() {
	},
	methods: {
		packaging(row) {
			if (row) this.tableRow = row;
			if (this.tableRow.isPack == 1) {
				this.$message.warning({
					message: "此任务已处于打包排队中",
					duration: 2000,
				});
				return;
			}
			if (
				this.tableRow.isPack == 2 ||
				this.tableRow.isPack == 3 ||
				this.tableRow.isPack == 4 ||
				this.tableRow.isPack == 5
			) {
				this.$message.warning({
					message: "打包下载状态为“不打包”的任务才可以打包",
					duration: 2000,
				});
				return;
			}
			if (this.tableRow.totalCount <= 1) {
				this.$message.warning({
					message: "下载车辆数小于2的任务不可打包",
					duration: 2000,
				});
				return;
			}
			if (this.tableRow.status == 5) {
				this.$message.warning({
					message: "下载状态为“异常”的任务不可打包",
					duration: 2000,
				});
				return;
			}
			const postData = {
				taskId: this.tableRow.taskId,
				isPack: 1,
			};
			this.$confirm(`是否打包${this.tableRow.taskName}任务?`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					setTaskPack(postData).then(({ data }) => {
						if (data.code === 0) {
							this.$message.success({
								message: "打包成功",
								duration: 2000,
							});
							this.listLoad();
							this.tableRow = {};
						}
					});
				})
				.catch(() => {});
		},
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
						// if (
            //   this.list.every((item) => {
            //     return item.isPack !=0 || item.totalCount <=1 || item.status == 5;
            //   })
            // ) {
            //   this.actionWidth = this.operateWidth(
            //     this.insideList.length - this.isSpecialButton.length
            //   );
            // }else if(this.list.every((item) => {
            //     return item.status == 1 || item.status == 2 || item.status == 3;
            //   })){
						// 		this.actionWidth = this.operateWidth(
            //     this.insideList.length - this.isSpecialButton1.length
            //   );
						// }
						// else{
            //   this.actionWidth = this.operateWidth(this.insideList.length);
            // }
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
				if (parseFloat(value) == 0) {
					return "0秒";
				}
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
		//添加任务
		addTask() {
			this.addTaskGeneralVisible = true;
		},
		// 添加批量任务
		handleBatchTask() {
			this.addTaskBatchVisible = true;
		},
		// 删除任务
		_deleteTask(row) {
			if (row) this.tableRow = row;
			if (this.tableRow.status === 1
					|| this.tableRow.status === 2
					|| this.tableRow.status === 3
				 ) {
				this.$message.warning({
					message: "排队中、进行中或压缩中的任务不可删除",
					duration: 2000,
				});
				return;
			}
			const postData = {
				taskId: this.tableRow.taskId,
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
		// 查看说明
		lookbook() {
			window.open("file/upload/template/历史数据下载操作说明书.pdf");
		},
		// 右侧列点击
		rightRowClick({ row, column }) {
			if (column.label === "VIN码" && row.status === 3 && row.httpUrl) {
				window.location.href = row.httpUrl;
			}
		},
		// 下载任务
		downLoadZip() {
			if (!this.tableRow.taskId) {
				this.$message.warning({
					message: "请选择任务",
					duration: 2 * 1000,
				});
			} else {
				if (this.tableRow.status === 4 && this.tableRow.httpUrl) {
					window.location.href = this.tableRow.httpUrl;
				} else {
					this.$message.warning({
						message: "当前任务未完成，无法下载",
						duration: 2 * 1000,
					});
				}
			}
		},
		// 右侧查询
		handleSearch() {
			if (!this.tableRow.taskId) {
				this.$message.warning({
					message: "请选择任务",
					duration: 2 * 1000,
				});
				return;
			}
			this.listLoading1 = true;
			const postData = {
				taskId: this.tableRow.taskId,
				taskName: this.tableRow.taskName,
				vinNo: this.rightListQuery.vinNo,
				vinNoTotal:this.rightListQuery.vinNoTotal
			};
			getTaskDetail(postData)
				.then(({ data }) => {
					if (data.code === 0) {
						this.rightTableListData = data.data || [];
						if (
							this.rightTableListData.length > 1 &&
							this.tableRow.isPack == 3
						) {
							this.allDownloadVisible = true;
						} else {
							this.allDownloadVisible = false;
						}
					}
					this.listLoading1 = false;
				})
				.catch(() => {
					this.listLoading1 = false;
				});
		},
		// 点击收缩展开
		clickCollapse() {
			this.collapse1 = !this.collapse1;
			if (this.collapse1) {
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
// .history-arrow {
// 	position: absolute;
// 	top: 20px;
// 	right: 10px;
// 	z-index: 22;
// 	svg {
// 		cursor: pointer;
// 		font-size: 16px !important;
// 	}
// }
 .history-arrow {
	.RightTop {
		position: absolute;
		top: 20px;
		right: 10px;
		z-index: 22;
	}
	.RightBottom {
		position: absolute;
		top: 61px;
		right: 10px;
		z-index: 22;
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
.specialOne{
	width: calc(100% / 3 - 25px);
}
</style>
