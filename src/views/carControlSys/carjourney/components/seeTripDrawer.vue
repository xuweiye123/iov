<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'查看行程推送'"
		:wrapperClosable="true"
		width="65%"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
	>
		<!-- table -->
		<div slot="drawerContent">
			<app-search :show-title="false">
				<div slot="content">
					<seach-form
					  :spanNumber="8"
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
			<div class="section-wrap">
				<app-authorize-button
					:buttonLeft="[]"
          :buttonRight="headersRightList"
					:exportLoading="exportLoading"
					@click-filter="showfilter = true"
					@click-export="handleExport"
				>
					<checked-Filter
						slot="check-filter"
						:show.sync="showfilter"
						:list="tableList"
						:scroll-line="8"
					/>
				</app-authorize-button>
				<app-table
					ref="tableList"
					slot="table"
					:isTableSelection="false"
					:list="list"
					:listLoading="listLoading"
					:filterTableList="filterTableList"
					:pageObj="listQuery"
					:total="total"
					:tableHeights="tableHeight"
					:isTableNumber="true"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span
							class="vinno"
							@click="handleDetail(scope.row)"
							v-if="scope.item.prop === 'vin'"
						>
							{{ scope.row[scope.item.prop] | processData}}
						</span>
						<span v-else>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</template>
				</app-table>
			</div>
			<pus-content-dialog :visibles.sync="pusContentVisible" :data="tableRow" />
		</div>
	</app-drawer>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { drawerOtherHeight } from "@/mixins/getDrawerOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { getTodayTime0, getTodayEndTime,beginTimeAndEndTime } from "@/utils/base";
// request
import {
	// getAipDrivinglogList,
	// exportData2,
} from "@/api/carControlSys/carjourney";

import pusContentDialog from "./pusContentDialog";

export default {
	doNotInit: true,
	name: "seetrip",
	mixins: [pagingMixin, drawerOtherHeight, tableStyle, getPageButton],
	components: { pusContentDialog },
	props: {
		visibles: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			listQuery: {
				vin: "",
				startTime: "",
				endTime: "",
				timeRange:["",""],
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vin",
					checked: true,
					width: 170,
				},
				{
					value: "行程开始时间",
					prop: "startTime",
					width: 160,
					checked: true,
				},
				{
					value: "行程结束时间",
					prop: "endTime",
					width: 160,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createTime",
					checked: true,
					width: 160,
				},
				{
					value: "响应状态",
					prop: "status",
					width: 120,
					checked: true,
				},
			],
			selectList: [],
			pusContentVisible: false,
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vin",
          type: "vin",
        },
				{
          label: "时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:16,
        },
        // {
        //   label: "开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
      ];
    },
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this.listLoad();
			}
		},
	},
	mounted() {
		// 暂时强行添加1
		this.headersRightList = [
			{
				functionName: "导出",
				functionNameEn: "导出",
				functionType: 1,
				url: "export",
				icon: "export",
				iconType: 2,
				isShow: 1,
			},
		];
	},
	methods: {
		// 查看详情
		handleDetail(e) {
			this.tableRow = e;
			this.pusContentVisible = true;
		},
		// 关闭dialog
		closeDrawer() {
			this.listQuery = {
				vin: "",
				startTime:"",
				endTime: "",
				pageNum: 1,
				pageSize: 10,
				timeRange:["",""],
			};
			this.collapse = false;
			this.list = [];
			this.total = 0;
			this.$emit("update:visibles", false);
		},
		listLoad() {
			if (!this.visibles) {
				return;
			}
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			this.listQuery.fileType = 6;
			getAipDrivinglogList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data;
						this.total = data.total;
					}
					this.tableRow = {};
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 清空
		// handleClearTrip() {
		// 	this.listQuery = {
		// 		vin: "",
		// 		startTime: getTodayTime0(),
		// 		endTime: getTodayEndTime(),
		// 		pageNum: 1,
		// 		pageSize: 10,
		// 	};
		// 	this.listLoad();
		// },
		// 导出
		handleExport() {
			if(!this.total){
				this.$message.warning({
					message: "暂无数据，无法导出",
					duration: 2 * 1000,
				});
				return;
			}
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			exportData2(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					//
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
	},
};
</script>

<style lang="scss" scoped>
.search_list {
	padding-top: 0;
}
</style>
