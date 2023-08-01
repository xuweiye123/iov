<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form :listQuery="listQuery" :searchList="searchList" :labelWidth="'100px'" />
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
				:tableHeights="tableHeight"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span v-if="scope.item.prop === 'description'">
						<el-tag
							:type="
								scope.row.description &&
								JSON.parse(scope.row.description).tcpStatus === 1
									? 'success'
									: 'info'
							"
							effect="dark"
						>
							<span>
								{{
									scope.row.description &&
										JSON.parse(scope.row.description).tcpStatus | Tcpstatus
								}}
							</span>
						</el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'activeTime'">
						<el-tag
							:type="
								scope.row.description &&
								JSON.parse(scope.row.description).platformStatus === 1
									? 'success'
									: 'info'
							"
							effect="dark"
						>
							<span>{{
								scope.row.description &&
									JSON.parse(scope.row.description).platformStatus
										| Platformstatus
							}}</span>
						</el-tag>
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
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
import {
	getForwardLinkStatusService,
	exportForwardLinkStatusService,
} from "@/api/transmitSys/linkProtocol";
export default {
	name: "linkProtocol",
	mixins: [
		pagingMixin,
		otherHeight,
		tableStyle,
		getPageButton,
		getProtocolListMixin,
	],
	data() {
		return {
			listQuery: {
				protocolId: "",
				linkName: "",
				targetName: "",
			},
			protocolList: [],
			// 字段管理所需字段
			tableList: [
				{
					value: "协议插件名称",
					prop: "protocolName",
					width: 120,
					checked: true,
				},
				{
					value: "目标平台名称",
					prop: "targetName",
					width: 120,
					checked: true,
				},
				{
					value: "链路名称",
					prop: "linkName",
					width: 120,
					checked: true,
				},
				{
					value: "链路车辆数量",
					prop: "carCount",
					width: 100,
					checked: true,
				},
				{
					value: "连接状态",
					prop: "description",
					width: 110,
					checked: true,
				},
				{
					value: "登录状态",
					prop: "activeTime",
					width: 110,
					checked: true,
				},
			],
		};
	},
	filters: {
		Platformstatus(e) {
			switch (e) {
				case 0:
					return "未登录";
				case 1:
					return "已登录";
				default:
					return "-";
			}
		},
		Tcpstatus(e) {
			switch (e) {
				case 0:
					return "断开";
				case 1:
					return "连接";
				default:
					return "-";
			}
		},
	},
	computed: {
		searchList() {
			return [
				{
					type: "select",
					label: "协议插件名称",
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
					label: "目标平台",
					value: "targetName",
				},
				{
					type: "input",
					label: "链路名称",
					value: "linkName",
				},
			];
		},
	},
	methods: {
		// 导出
		handleExport() {
			this.exportLoading = true;
			exportForwardLinkStatusService(this.listQuery).then(({ data }) => {
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
		// 加载数据
		listLoad() {
			this.listLoading = true;
			getForwardLinkStatusService(this.listQuery)
				.then(({ data }) => {
					this.listLoading = false;
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
						this.tableRow = {};
					}
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
	},
};
</script>

<style lang="scss" scoped></style>
