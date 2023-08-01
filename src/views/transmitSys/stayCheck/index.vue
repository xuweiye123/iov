<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form :listQuery="listQuery" :searchList="searchList" />
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:isCollapse="false"
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
				:isShowOperation="true"
				:tableHeights="tableHeight"
				:buttonList="insideList"
				@click-examine="handleExamine"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'status'">
						<el-tag
							effect="dark"
							:type="
								scope.row.status === 2
									? 'danger'
									: scope.row.status === 3
									? 'success'
									: 'info'
							"
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
		<check-dbc
			:visible.sync="innerVisible"
			:protocol-id="protocolId"
			:protocol-name="protocolName"
			:dbc-id="dbcId"
			:full-name="fullName"
			:task-id="taskId"
			:motor-count="motorCount"
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
import { checkTask, exportStayCheckTask } from "@/api/transmitSys/stayConfig";
import checkDbc from "./components/checkDbc";
// 辅助函数
export default {
	name: "stayCheck",
	components: {
		checkDbc,
	},
	filters: {
		dbcStatus(e) {
			switch (e) {
				case 0:
					return "未配置";
				case 1:
					return "未提交";
				case 2:
					return "待审核";
				case 3:
					return "已审核";
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
				md5Code: "",
				status: "",
			},
			protocolId: "",
			protocolName: "",
			fullName: "",
			dbcId: "",
			taskId: "",
			motorCount: 0,
			protocolList: [],
			innerVisible: false,
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
				// {
				// 	type: "input",
				// 	label: "MD5",
				// 	value: "md5Code",
				// },
				{
					type: "input",
					label: "DBC名称",
					value: "fullName",
				},
			];
		},
	},
	methods: {
		submitComplete() {
			this.$message.success({
				message: "退回成功",
				duration: 2 * 1000,
			});
			this.listLoad();
		},
		// 导出
		handleExport() {
			this.exportLoading = true;
			exportStayCheckTask(this.listQuery).then(({ data }) => {
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
		// 配置
		handleExamine(row) {
			const {
				dbcId,
				protocolId,
				protocolName,
				fullName,
				taskId,
				motorCount,
			} = row;
			this.protocolId = protocolId;
			this.protocolName = protocolName;
			this.dbcId = dbcId;
			this.fullName = fullName;
			this.taskId = taskId;
			this.motorCount = motorCount;
			this.checkVisible = true;
			this.innerVisible = true;
		},
		// 加载数据
		listLoad() {
			this.listLoading = true;
			this.list = [];
			checkTask(this.listQuery)
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
