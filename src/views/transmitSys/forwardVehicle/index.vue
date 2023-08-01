<template>
	<div class="box">
		<div class="box-left">
			<div class="forward-car-title">
				<span class="fontSty">转发链路信息</span>
			</div>
			<div class="box-tree">
				<el-tree
					ref="tree"
					:props="treeProps"
					:load="loadNode"
					:expand-on-click-node="true"
					:default-expanded-keys="defaultCheckedKeys"
					accordion
					node-key="id"
					lazy
					class="divScroll"
					@node-click="nodeClick"
				>
					<span slot-scope="{ data }">
						<i
							:class="['iconfont', data.linkId ? 'icon-Parent' : 'icon-subset']"
						>
						</i>
						<span style="padding-left: 4px; font-size: 13px">{{
							data.name
						}}</span>
					</span>
				</el-tree>
			</div>
		</div>
		<div class="box-right">
			<div class="box-right-top">
				<div class="forward-car-title">
					<span class="fontSty">转发车辆详情</span>
				</div>
				<app-search>
					<div slot="content">
						<seach-form
							:collapse="collapse"
							:listQuery="listQuery"
							:searchList="searchList"
							:spanNumber="8"
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
			</div>
			<div
				class="section-wrap"
				:style="{ 'min-height': minBoxHeight + 'px' }"
			>
				<!-- 授权按钮 -->
				<app-authorize-button
					:buttonLeft="headersLeftList"
					:buttonRight="headersRightList"
					:exportLoading="exportLoading"
					@click-openForward="handleForward(1)"
					@click-stopForward="handleForward(2)"
					@click-batchOpenForward="handleBatchForward(1)"
					@click-batchStopForward="handleBatchForward(2)"
					@click-batchDeleteForward="handleBatchForward(3)"
					@click-taskDetails="handleDetails"
					@click-delete="handleDelete"
					@click-export="handleExport"
					@click-offlineExport="handleOfflineExport"
					@click-filter="showfilter = true"
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
					ref="forwardTable"
					id="forwardTable"
					:isTableSelection="true"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:rowKey="'taskId'"
					:actionWidth="actionWidth"
					:actionFixed="actionFixed"
					:tableHeights="tableHeight"
					:isShowOperation="false"
					:buttonList="insideList"
					@row-click="rowClick"
					@handle-selection-change="handleSelectionChange"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop === 'status'">
							<el-tag
								effect="dark"
								:type="
									scope.row.status == 1
										? ''
										: scope.row.status == 2 || scope.row.status === 3
										? 'danger'
										: 'info'
								"
							>
								<span>{{ scope.row.status | statusSwitch }}</span>
							</el-tag>
						</span>
						<span v-else-if="scope.item.prop === 'endTime'">
							{{ scope.row["status"] == 1 ? "-" : scope.row[scope.item.prop] }}
						</span>
						<span v-else>
							{{ scope.row[scope.item.prop] | processData }}
						</span>
					</template>
				</app-table>
			</div>
		</div>
		<el-dialog
			custom-class="dialogBox"
			v-if="addCarPromptVisible"
			v-el-drag-dialog
			:before-close="closeDialog"
			:visible.sync="addCarPromptVisible"
			:close-on-click-modal="false"
			:lock-scroll="false"
			:show-close="false"
			:append-to-body="true"
			center
			width="35%"
		  top="30vh"
			class="ordinary"
		>
			<div slot="title" class="dialogHeader">
				<span class="custom-dialog-header-title">
					<span class="title-style"></span>
					<span style="margin-left: 3px;font-size: 16px;">{{
						isStart == 1
							? "批量开启转发"
							: isStart == 2
							? "批量停止转发"
							: "批量删除车辆"
					}}</span>
				</span>
				<span @click="closeDialog" class="custom-dialog-header-close">
					<i class="iconfont icon-close"></i>
				</span>
			</div>
			<el-row :gutter="10" type="flex" justify="center">
				<el-col :span="16">
					<el-form>
						<el-form-item
							label-position="'right'"
							label-width="50px"
							label="文件："
						>
							<el-input v-model="leadingInPath" disabled />
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="4">
					<el-upload
						ref="upload"
						:headers="{ Authorization: token }"
						:auto-upload="false"
						:show-file-list="false"
						:file-list="fileList"
						:multiple="true"
						:on-change="fileChange"
						:on-success="fileSuccess"
						:action="baseUrl"
						:data="{
							taskType: isStart == 1 ? 3 : isStart == 2 ? 4 : 5,
							linkId: linkIdBtn,
							targetId: targetIdBtn,
							linkName: linkNameBtn,
						}"
						:accept="'.xls,.xlsx'"
						class="el-upload-block"
					>
						<el-button type="primary">浏览</el-button>
					</el-upload>
				</el-col>
			</el-row>
			<div style="display: flex;justify-content: center;">
				<div class="import-remark">
					<span class="textColor">注：</span>
					<div style="display: flex;justify-content: flex-start;flex-direction: column;">
						<div style="margin-bottom:10px;"> 1.仅支持 .xls,.xlsx 格式的文件，一次只能选择一个；</div>
						<div> 2.若已上传过的文件需重新选择方可上传，最多导入<span class="textColor"> 100000 </span>行。</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button v-waves>
					<a class="templateUrl" :href="'/api/transmit/fileStatics/VINQueryTemplate.xlsx'"> 
						<i class='iconfont icon-downLoad' style="font-size: 12px !important;margin-right:5px;"></i>
						下载模板</a
          >
				</el-button>
				<el-button v-waves type="primary" @click="setCarFlag">确定</el-button>
			</span>
		</el-dialog>
		<!-- 任务详情 -->
		<Task-Details-List
			:visibles.sync="taskDetailsVisible"
			:isTaskType="isTaskType"
			:linkId="linkId1"
		/>
		<offlineDetailsDrawer :visibles.sync="detailsDialogVisible" />
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
// utils
import readExcel from "@/utils/readExcel";
//组件
import TaskDetailsList from "@/components/TaskDetailsList";
import offlineDetailsDrawer from "./components/offlineDetailsDrawer";
// request
import {
	getForwardTargetLevel,
	getForwardLinkLevel,
	getForwardTask,
	updateForwardTask, // 编辑转发 1.开始转发 2.停止转发
	deleteForwardTask,
	exportForwardTask,
} from "@/api/transmitSys/forwardVehicle";
export default {
	name: "forwardVehicle",
	components: { TaskDetailsList, offlineDetailsDrawer },
	mixins: [
		pagingMixin,
		otherHeight,
		tableStyle,
		getPageButton,
		addUpdateAction,
	],
	filters: {
		statusSwitch(e) {
			switch (e) {
				case 0:
					return "未开启";
				case 1:
					return "转发中";
				case 2:
					return "已停止";
				case 3:
					return "自动停止";
				default:
					return "-";
			}
		},
	},
	data() {
		return {
			detailsDialogVisible: false,
			linkId1: "",
			targetIdBtn: "",
			linkIdBtn: "",
			linkNameBtn: "",
			isTaskType: "2",
			baseUrl: process.env.VUE_APP_TRA + "/uploadTask/importUploadTask",
			taskDetailsVisible: false,
			listQuery: {
				vinNo: "",
				fullName: "",
				linkName: "",
				status: "",
				targetId: "",
				linkId: "",
			},
			treeProps: {
				label: "name",
				children: "zones",
				isLeaf: "leaf",
			},
			statusList: [
				{
					value: 0,
					label: "未开启",
				},
				{
					value: 1,
					label: "转发中",
				},
				{
					value: 2,
					label: "已停止",
				},
				{
					value: 3,
					label: "自动停止",
				},
			],
			defaultCheckedKeys: [],
			level1: [],
			// 字段管理所需字段
			tableList: [
				{
					value: "链路名称",
					prop: "linkName",
					width: 120,
					checked: true,
				},
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "DBC名称",
					prop: "fullName",
					width: 140,
					checked: true,
				},
				{
					value: "转发状态",
					prop: "status",
					width: 100,
					checked: true,
				},
				{
					value: "开始时间",
					prop: "beginTime",
					width: 140,
					checked: true,
				},
				{
					value: "结束时间",
					prop: "endTime",
					width: 140,
					checked: true,
				},
			],
			addCarPromptVisible: false,
			fileList: [],
			leadingInPath: "",
			selectList: [],
			allCarList: [],
		};
	},
	computed: {
		activeName() {
			return this.$store.state.theme.activeName;
		},
		token() {
			return this.$store.getters.token;
		},
		searchList() {
			return [
				{
					type: "input",
					label: "链路名称",
					value: "linkName",
				},
				{
					type: "vin",
					label: "VIN码",
					value: "vinNo",
				},
				{
					type: "input",
					label: "DBC名称",
					value: "fullName",
				},
				{
					type: "select",
					label: "转发状态",
					value: "status",
					options: {
						data: this.statusList, //下拉数组
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
			];
		},
	},
	methods: {
		//导出详情
		handleOfflineExport() {
			this.detailsDialogVisible = true;
		},
		handleClear() {
			this.listQuery = {
				vinNo: "",
				fullName: "",
				linkName: "",
				status: "",
				targetId: "",
				linkId: "",
				pageNum: 1,
				pageSize: 10,
			};
			this.listLoad();
		},
		async loadNode(node, resolve) {
			if (node.level === 0) {
				await getForwardTargetLevel().then(({ data }) => {
					const newObj = [];
					if (data.code === 0 && data.data) {
						data.data.forEach((item) => {
							newObj.push({ name: item.targetName, id: item.targetId });
						});
						this.level1 = newObj;
						// 默认展开第一个子节点
						this.defaultCheckedKeys = [this.level1[0].id];
						this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
					}
				});
				//
				return resolve(this.level1);
			}
			if (node.level > 1) return resolve([]);
			const data = { targetId: node.data.id };
			const level2 = [];
			await getForwardLinkLevel(data).then(({ data }) => {
				if (data.code === 0 && data.data) {
					data.data.forEach((item) => {
						level2.push({
							name: item.linkName,
							linkId: item.linkId,
							leaf: true,
						});
					});
					return resolve(level2);
				}
			});
		},
		nodeClick(data, node) {
			if (data.id) {
				this.targetIdBtn = data.id;
				this.listQuery.targetId = data.id;
				this.listQuery.linkId = "";
				this.linkIdBtn = "";
				this.linkNameBtn = "";
				this.listLoad();
			}
			// 查询链路
			if (data.linkId) {
				this.linkIdBtn = data.linkId;
				this.linkNameBtn = data.name;
				this.listQuery.targetId = node.parent.data.id;
				this.listQuery.linkId = data.linkId;
				this.targetIdBtn = "";
				this.listLoad();
			}
		},
		closeDialog() {
			this.addCarPromptVisible = false;
		},
		// 批量删除
		handleBatchDeleteForward() {
			this.addCarPromptVisible = true;
		},
		// table checkBox选择事件
		handleSelectionChange(val) {
			this.selectList = val;
		},
		// 导出
		handleExport() {
			if (!this.listQuery.targetId && !this.listQuery.linkId) {
				this.$message.warning({
					message: "请选择转发链路",
					duration: 2 * 1000,
				});
				return;
			}
			this.exportLoading = true;
			exportForwardTask(this.listQuery).then(({ data }) => {
				if (data.code == 0) {
					this.$message.success({
						message: this.$t("addUpdateAction.exportSuccess"),
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// 开启转发or停止转发
		handleForward(e) {
			if (this.selectList.length === 0) {
				this.$message.warning({
					message: "请选择转发车辆",
					duration: 2 * 1000,
				});
				return;
			}
			const textInfo = e === 1 ? "是否开启转发?" : "是否停止转发?";
			this.$confirm(textInfo, "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					const data = [];
					let flag = false;
					if (e === 1) {
						try {
							this.selectList.forEach((item) => {
								if (item.status === 1) {
									this.$message.warning({
										message: "转发中车辆，不可开启转发",
										duration: 2 * 1000,
									});
									flag = true;
									throw new Error("error");
								} else {
									data.push({
										taskId: item.taskId,
										vinNo: item.vinNo,
										status: e,
										isFirst: item.beginTime ? 0 : 1,
									});
								}
							});
						} catch (e) {
							if (e.message !== "error") throw e;
						}
					} else if (e === 2) {
						try {
							this.selectList.forEach((item) => {
								if (item.status !== 1) {
									this.$message.warning({
										message: "未开启，已停止和自动停止车辆，不可停止转发",
										duration: 2 * 1000,
									});
									flag = true;
									throw new Error("error");
								} else {
									data.push({
										taskId: item.taskId,
										vinNo: item.vinNo,
										status: e,
										isFirst: item.beginTime ? 0 : 1,
									});
								}
							});
						} catch (e) {
							if (e.message !== "error") throw e;
						}
					}
					if (flag) return;
					updateForwardTask(data).then(({ data }) => {
						if (data.code === 0) {
							this.$message.success({
								message: e == 1 ? "开启转发成功" : e == 2 ? "停止转发成功" : "",
								duration: 2 * 1000,
							});
							this.selectList = [];
							this.listLoad();
						}
					});
				})
				.catch(() => {});
		},
		// 批量开启转发or批量停止转发
		handleBatchForward(flag) {
			if (!this.listQuery.linkId) {
				this.$message.warning({
					message: "请选择转发链路",
					duration: 2 * 1000,
				});
				return;
			}
			if (flag == 1) {
				this.isStart = 1;
			} else if (flag == 2) {
				this.isStart = 2;
			} else {
				this.isStart = 3;
			}
			this.addCarPromptVisible = true;
			this.leadingInPath = "";
			this.fileList = [];
		},
		handleDetails() {
			if (!this.listQuery.linkId) {
				this.$message.warning({
					message: "请选择转发链路",
					duration: 2 * 1000,
				});
				return;
			}
			this.linkId1 = this.listQuery.linkId;
			this.taskDetailsVisible = true;
		},
		// 删除
		handleDelete() {
			if (this.selectList.length === 0) {
				this.$message.warning({
					message: "请选择转发车辆",
					duration: 2 * 1000,
				});
				return;
			}
			this.$confirm("是否删除车辆?", "提示", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					const data = [];
					let flag = false;
					try {
						this.selectList.forEach((item) => {
							if (item.status === 1) {
								this.$message.warning({
									message: "转发中车辆，不可删除",
									duration: 2 * 1000,
								});
								flag = true;
								throw new Error("error");
							} else {
								data.push({
									taskId: item.taskId,
									linkId: item.linkId,
									carCount: item.carCount,
									vinNo: item.vinNo,
								});
							}
						});
					} catch (e) {
						if (e.message !== "error") throw e;
					}
					if (flag) return;
					if (data.length === 0) {
						this.$message.warning({
							message: "请选择需要删除的车辆",
							duration: 2 * 1000,
						});
						return;
					}
					deleteForwardTask(data).then(({ data }) => {
						if (data.code === 0) {
							this.deleteComplete();
						}
					});
				})
				.catch(() => {});
		},
		// 加载数据
		listLoad() {
			if (!this.listQuery.targetId && !this.listQuery.linkId) {
				return;
			}
			this.$refs.forwardTable.refTable().clearSelection();
			this.listLoading = true;
			getForwardTask(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.list.forEach((item) => {
							this.$refs.forwardTable
								.refTable()
								.toggleRowSelection(item, false);
						});
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 文件状态改变时触发
		fileChange(file, fileList) {
			if (file.size / 1024 > 1500) {
				this.$message.warning({
					message: "上传文件大小不应超过1.5MB，请重新上传",
					duration: 2 * 1000,
				});
				return;
			}
			// 获取最新的文件
			this.fileList = fileList.slice(-1);
			readExcel({ 0: file.raw })
				.then(() => {
					this.leadingInPath = file.name;
				})
				.catch(() => {});
		},
		// 导入车辆上传成功钩子
		fileSuccess(response) {
			if (response.code === 0) {
				this.openIsDisabled = false;
				this.$notify({
					title: "成功",
					message: "文件导入成功",
					type: "success",
					duration: 3000,
				});
			} else {
				this.$message.warning({
					message: response.message,
					duration: 2 * 1000,
				});
			}
		},
		// 导入车辆
		setCarFlag() {
			if (this.fileList.length === 0) {
				this.$message.warning({
					message: "请选择上传文件",
					duration: 2 * 1000,
				});
				return;
			}
			if (this.openIsDisabled) {
				this.$message.warning({
					message: "当前文件还未上传完毕",
					duration: 2 * 1000,
				});
				return;
			}
			this.$refs.upload.submit();
			this.addCarPromptVisible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.import-remark {
  display: flex;
  justify-content: flex-start;
}
.fontSty {
	font-family: Microsoft YaHei;
	font-weight: 400;
	font-size: 13px;
}
.box {
	height: calc(100vh - 134px);
	display: flex;
	justify-content: space-between;
}
.box-left {
	border-radius: 4px;
	width: 15vw;
	height: 100%;
	background: #fff !important;
	background-clip: content-box !important;
}
.box-right {
	width: calc(100% - 15vw);
}
.box-right-top {
	border-radius: 4px;
	background-color: #fff;
	// border-radius: 10px;
	margin-left: 6px;
}
.forward-car-title {
	height: 36px;
	border-bottom: 1px solid #f0f3f8;
	line-height: 36px;
	text-indent: 1em;
	font-size: 13px;
	color: #606266;
}
.box-tree {
	height: calc(100vh - 215px);
}
::v-deep.el-tree {
	width: 100%;
	height: calc(100vh - 215px);
	overflow: scroll;
}
::v-deep.el-tree > .el-tree-node {
	display: inline-block;
	min-width: 100%;
}
::v-deep .section-wrap {
	margin-top: 10px;
	margin-left: 6px;
}
</style>
