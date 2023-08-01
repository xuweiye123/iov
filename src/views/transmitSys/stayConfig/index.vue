<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:collapse="collapse"
					:listQuery="listQuery"
					:searchList="searchList"
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
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<!-- 授权按钮 -->
			<app-authorize-button
				:buttonLeft="headersLeftList"
				:buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-export="handleExport"
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
				@click-deploy="handleDeploy"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'status'">
						<el-tag
							:type="
								scope.row.status === 4
									? 'danger'
									: scope.row.status === 1
									? 'success'
									: 'info'
							"
							effect="dark"
						>
							<span>{{ scope.row[scope.item.prop] | dbcStatus }}</span>
						</el-tag>
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 配置dialog -->
		<config-drawer
			:visibles.sync="configVisible"
			:protocol-id="protocolId"
			:protocol-name="protocolName"
			:dbc-id="dbcId"
			:task-id="taskId"
			:motor-count="motorCount"
			:full-name="fullName"
			@submit-complete="submitComplete"
		/>
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
import { getProtocolListMixin } from "@/mixins/dropList";
// request
import { getDbcTask, exportStayConfigTask } from "@/api/transmitSys/stayConfig";
//组件
import configDrawer from "./components/configDrawer";
export default {
	name: "stayConfig",
	components: {
		configDrawer,
	},
	filters: {
		dbcStatus(e) {
			switch (e) {
				case 0:
					return "未配置";
				case 1:
					return "未提交";
				case 4:
					return "已退回";
				default:
					return "-";
			}
		},
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton, getProtocolListMixin],
	data() {
		return {
			listQuery: {
				protocolId: "",
				fullName: "",
				status: "",
				md5Code: "",
			},
			protocolId: "",
			protocolName: "",
			fullName: "",
			dbcId: "",
			taskId: "",
			motorCount: 0,
			protocolList: [],
			statusList: [
				{ value: 0, label: "未配置" },
				{ value: 1, label: "未提交" },
				{ value: 4, label: "已退回" },
			],
			configVisible: false,
			// 字段管理所需字段
			tableList: [
				{
					value: "协议名称",
					prop: "protocolName",
					width: 120,
					checked: true,
				},
				// {
				// 	value: "MD5",
				// 	prop: "md5Code",
				// 	width: 280,
				// 	checked: true,
				// },
				{
					value: "DBC名称",
					prop: "fullName",
					width: 280,
					checked: true,
				},
				{
					value: "DBC参数数量",
					prop: "variableCount",
					width: 110,
					checked: true,
				},
				{
					value: "配置状态",
					prop: "status",
					width: 90,
					checked: true,
				},
				{
					value: "配置数量",
					prop: "configCount",
					width: 90,
					checked: true,
				},
				// {
				// 	value: "车辆数",
				// 	prop: "carCount",
				// 	width: 90,
				// 	checked: true,
				// },
			],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "select",
					label: "协议名称",
					value: "protocolId",
					options: {
						data: this.protocolList, //下拉数组
						extraProps: {
							label: "text",
							value: "value",
						},
					},
				},
				{
					type: "input",
					label: "DBC名称",
					value: "fullName",
				},
				{
					type: "select",
					label: "配置状态",
					value: "status",
					options: {
						data: this.statusList, //下拉数组
						extraProps: {
							label: "label",
							value: "value",
						},
					},
				},
				// {
				// 	type: "input",
				// 	label: "MD5",
				// 	value: "md5Code",
				// },
			];
		},
	},
	methods: {
		submitComplete() {
			this.listLoad();
		},
		// 导出
		handleExport() {
			this.exportLoading = true;
			exportStayConfigTask(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: this.$t("addUpdateAction.exportSuccess"),
						duration: 2 * 1000,
					});
				}
			})
			.finally(() => {
        this.exportLoading = false;
      })
		},
		// 配置
		handleDeploy(row) {
			this.protocolId = row.protocolId;
			this.protocolName = row.protocolName;
			this.dbcId = row.dbcId;
			this.fullName = row.fullName;
			this.taskId = row.taskId;
			this.motorCount = row.motorCount;
			this.configVisible = true;
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.list = [];
			getDbcTask(this.listQuery)
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
	},
};
</script>

<style lang="scss" scoped></style>
