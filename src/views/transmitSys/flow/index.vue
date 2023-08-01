<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
					:listQuery="listQuery"
					:searchList="searchList"
					:labelWidth="'90px'"
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
				:actionWidth="actionWidth"
				:actionFixed="actionFixed"
				:isShowOperation="true"
				:buttonList="insideList"
				@click-see="handleSee"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						v-if="
							scope.item.prop === 'sendFlow' ||
								scope.item.prop === 'receiveFlow'
						"
					>
						{{ scope.row[scope.item.prop] | fileSizeConversion }}
					</span>
					<span v-else>
						{{ scope.row[scope.item.prop] | processData }}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 详情dialog -->
		<detail-drawer :visibles.sync="detailVisible" :data="tableRow" />
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { beginTimeAndEndTime } from "@/utils/base";
// request
import {
	getTargetFlowStatistics,
	exTargetFlowStatistics,
} from "@/api/transmitSys/flow";
import detailDrawer from "./components/detailDrawer";
// 辅助函数
export default {
	name: "flow",
	components: {
		detailDrawer,
	},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				targetName: "",
				beginTime: "",
				endTime: "",
				timeRange:["",""],
			},
			detailVisible: false,
			// 字段管理所需字段
			tableList: [
				{
					value: "目标平台名称",
					prop: "targetName",
					width: 150,
					checked: true,
				},
				{
					value: "发送流量",
					prop: "sendFlow",
					width: 100,
					checked: true,
				},
				{
					value: "发送数量",
					prop: "sendCount",
					width: 90,
					checked: true,
				},
				{
					value: "接收流量",
					prop: "receiveFlow",
					width: 110,
					checked: true,
				},
				{
					value: "接收数量",
					prop: "receiveCount",
					width: 120,
					checked: true,
				},
				{
					value: "统计数据日期",
					prop: "countDate",
					width: 110,
					checked: true,
				},
			],
		};
	},
	computed: {
		searchList() {
			return [
				{
					type: "input",
					label: "目标平台名称",
					value: "targetName",
				},
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
				// {
				// 	label: "开始时间",
				// 	value: "beginTime",
				// 	type: "dateTime",
				// },
				// {
				// 	label: "结束时间",
				// 	value: "endTime",
				// 	type: "dateTime",
				// 	defaultType: "end",
				// },
			];
		},
	},
	methods: {
		/**
		 * @name: 查看详情
		 */
		handleSee(row) {
			if (row) this.tableRow = row;
			this.detailVisible = true;
		},
		handleClear() {
			this.listQuery = {
				pageNum: 1,
				pageSize: 10,
				targetName: "",
				beginTime: "",
				endTime: "",
				timeRange:["",""],
			};
			this.listLoad();
		},
		// 导出
		handleExport() {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
      this.exportLoading = true;
			exTargetFlowStatistics(this.listQuery).then(({ data }) => {
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
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.list = [];
			this.listLoading = true;
			getTargetFlowStatistics(this.listQuery)
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
