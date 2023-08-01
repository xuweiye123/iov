<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:listQuery="listQuery"
					:searchList="searchList"
					:labelWidth="'95px'"
				/>
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:is-collapse="false"
				:isdisabled="listLoading"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 授权按钮 -->
			<app-authorize-button
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-add="handleAdd"
				@click-carStatusSearch="handleStatus"
				@click-export="handleExport"
				@click-taskDetails="handleDetails"
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
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:tableHeights="tableHeight"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-delete="handleDelete"
				@click-update="handleUpdate"
				@click-handFilterRules="handleHandFilterRules"
				@click-addCar="handleAddcar"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'targetType'">
						{{
							scope.row[scope.item.prop] == 0
								? "国家平台"
								: scope.row[scope.item.prop] == 1
								? "地方平台"
								: scope.row[scope.item.prop] == 2
								? "企业平台"
								: "-"
						}}
					</span>
					<span v-else-if="scope.item.prop === 'isPassword'">
						{{
							scope.row[scope.item.prop] == 0
								? "否"
								: scope.row[scope.item.prop] == 1
								? "是"
								: "-"
						}}
					</span>
					<span v-else-if="scope.item.prop === 'serviceType'">
						{{
							scope.row[scope.item.prop] == 0
								? "对公平台"
								: scope.row[scope.item.prop] == 1
								? "对私平台"
								: "-"
						}}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 新增修改dialog -->
		<add-update-drawer
			:visibles.sync="addUpdateVisible"
			:is-edit="isEdit"
			:data="isEdit ? tableRow : {}"
			@add-complete="addComplete"
			@update-complete="updateComplete"
		/>
		<!-- 添加车辆 -->
		<add-car-dialog
			:visibles.sync="addCarVisible"
			:target-id="tableRow.targetId"
			:link-id="tableRow.linkId"
			:link-name="tableRow.linkName"
			:car-count="tableRow.carCount"
			@set-complete="setComplete"
		/>
		<!-- 车辆状态查询 -->
		<import-dialog
			action="/api/transmit/uploadTask/importUploadTask"
			:template-url="'/api/transmit/fileStatics/VINQueryTemplate.xlsx'"
			:data="postData"
			:append-to-body="true"
			:visibles.sync="importVisible"
			@upload-success="reloadList"
		/>
		<result-dialog
			:visibles.sync="resultVisible"
			:data="importResult"
			:text="'VIN码'"
			:keys="'vinNo'"
			@export-fail="exportFail"
		/>
		<!-- 任务详情 -->
		<Task-Details-List
			:visibles.sync="taskDetailsVisible"
			:isTaskType="isTaskType"
		/>
		<!-- 协议规则 -->
		<add-Filter-Rules :visibles.sync="FilterRules" :data="tableRow" />
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { addUpdateAction } from "@/mixins/addUpdateAction";
// request
import {
	getForwardLink,
	deleteForwardLink,
	exportForwardLink,
} from "@/api/transmitSys/forwardLink";
import { getForwardTargetList } from "@/api/transmitSys/commont";
// 组件
import addUpdateDrawer from "./components/addUpdateDrawer";
import addCarDialog from "./components/addCarDialog";
import addFilterRules from "./components/addFilterRules";
import importDialog from "@/components/importDialog";
import resultDialog from "@/components/resultDialog";
import TaskDetailsList from "@/components/TaskDetailsList";
export default {
	name: "forwardLink",
	components: {
		addUpdateDrawer,
		addCarDialog,
		importDialog,
		resultDialog,
		TaskDetailsList,
		addFilterRules,
	},
	mixins: [
		pagingMixin,
		otherHeight,
		tableStyle,
		getPageButton,
		addUpdateAction,
	],
	data() {
		return {
			isTaskType: "1",
			postData: { taskType: 1 },
			FilterRules: false,
			importResult: {},
			listQuery: {
				targetId: "",
				linkName: "",
				serverIp: "",
			},
			forwardTargetList: [],
			addCarVisible: false,
			// 字段管理所需字段
			tableList: [
				{
					value: "目标平台名称",
					prop: "targetName",
					width: 150,
					checked: true,
				},
				{
					value: "链路名称",
					prop: "linkName",
					width: 150,
					checked: true,
				},
				{
					value: "链路端口",
					prop: "linkPort",
					width: 150,
					checked: true,
				},
				{
					value: "转发车辆数",
					prop: "carCount",
					width: 90,
					checked: true,
				},
				{
					value: "唯一识别码",
					prop: "uniqueCode",
					width: 100,
					checked: true,
				},
				{
					value: "转发服务主机",
					prop: "serverName",
					width: 120,
					checked: true,
				},
				{
					value: "服务器端口",
					prop: "serverPort",
					width: 90,
					checked: true,
				},
				{
					value: "备注",
					prop: "remark",
					width: 120,
					checked: true,
				},
			],
			importVisible: false,
			resultVisible: false,
			taskDetailsVisible: false,
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "select",
					label: "目标平台名称",
					value: "targetId",
					options: {
						data: this.forwardTargetList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "input",
					label: "链路名称",
					value: "linkName",
				},
				{
					type: "input",
					label: "转发服务主机",
					value: "serverIp",
				},
			];
		},
	},
	mounted() {
		this._getForwardTargetList();
	},
	methods: {
		exportFail() {
			// exportFail(data);
		},
		// 导入成功之后刷新list
		reloadList(data) {
			this.importVisible = false;
			if (data.failedList.length > 0) {
				this.resultVisible = true;
			} else {
				this.resultVisible = false;
			}
			this.listLoad();
		},
		handleStatus() {
			this.importVisible = true;
		},
		handleDetails() {
			this.taskDetailsVisible = true;
		},
		// 获取协议名称
		_getForwardTargetList() {
			getForwardTargetList().then(({ data }) => {
				if (data.code === 0) {
					this.forwardTargetList = data.data;
				}
			});
		},
		// 加载数据
		listLoad() {
			this.list = [];
			this.listLoading = true;
			getForwardLink(this.listQuery)
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

		/**
		 * @name: 导出
		 * @param {*}
		 */
		handleExport() {
			this.exportLoading = true;
			exportForwardLink(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: this.$t("addUpdateAction.exportSuccess"),
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// 添加车辆
		handleAddcar(row) {
			if (row) this.tableRow = row;
			this.addCarVisible = true;
		},
		// 过滤规则
		handleHandFilterRules(row) {
			if (row) this.tableRow = row;
			this.FilterRules = true;
		},
		// 设置成功
		setComplete() {
			this.listLoad();
			this.$message.success({
				message: "添加成功",
				duration: 2 * 1000,
			});
		},
		// 删除
		handleDelete({ linkId, carCount, linkName, serverId }) {
			this.$confirm(`确定要删除这条数据吗？`, "删除", {
				confirmButtonText: this.$t("addUpdateAction.define"),
				cancelButtonText: this.$t("addUpdateAction.cancel"),
				type: "warning",
			})
				.then(() => {
					deleteForwardLink({ linkId, carCount, linkName, serverId }).then(
						({ data }) => {
							if (data.code === 0) {
								this.deleteComplete();
							}
						}
					);
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss" scoped></style>
