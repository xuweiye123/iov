<template>
	<div class="app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>
		<!-- <p style="margin: 12px 0 0 10px">里程统计查询</p> -->
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
        :buttonRight="headersRightList"
				:exportLoading="exportLoading"
				@click-filter="showfilter = true"
				@click-export="handleExport"
			>
				<!-- @click-seeTrip="handSeeTrip"
				@click-seeEletric="handSeeEletric" -->
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
						{{ scope.row[scope.item.prop] | processData }}
					</span>
					<span v-else-if="scope.item.prop =='mileage'">
            {{ (scope.row[scope.item.prop] || scope.row[scope.item.prop] == "0")
									? parseFloat((scope.row[scope.item.prop]*1 / 1000).toFixed(2))
									: "-" }}
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<!-- <see-trip-drawer :visibles.sync="seeTripVisible" />
		<see-eletric-drawer :visibles.sync="seeEletricVisible" /> -->
		<detail-drawer :visibles.sync="detailVisible" :data="tableRow" />
	</div>
</template>

<script>
// 混入
import { partialForm } from "@/mixins/partialForm";
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { getTodayTime0, getTodayEndTime,beginTimeAndEndTime } from "@/utils/base";
// request
import { getPagelist, exportData1 } from "@/api/carControlSys/carjourney";
// 组件
// import seeTripDrawer from "./components/seeTripDrawer";
// import seeEletricDrawer from "./components/seeEletricDrawer";
import detailDrawer from "./components/detailDrawer";
export default {
	name: "carjourney",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	components: { 
		// seeTripDrawer, 
		// seeEletricDrawer, 
		detailDrawer 
	},
	data() {
		return {
			listQuery: {
				vin: "",
				beginTime: "",
				endTime: "",
				timeRange:["",""],
			},
			allBatchList: [],
			detailVisible: false,
			tableList: [
				{
					value: "VIN码",
					prop: "vin",
					width: 170,
					checked: true,
				},
				{
					value: "行程开始时间",
					prop: "startTime",
					width: 150,
					checked: true,
				},
				{
					value: "行程结束时间",
					prop: "endTime",
					width: 160,
					checked: true,
				},
				{
					value: "平均车速(km/h)",
					prop: "avgSpeed",
					width: 160,
					checked: true,
				},
				{
					value: "小计能耗(kWh/100km)",
					prop: "energyConsume",
					width: 160,
					checked: true,
				},
				{
					value: "行驶时长(s)",
					prop: "sumTime",
					width: 150,
					checked: true,
				},
				{
					value: "里程(km)",
					prop: "mileage",
					width: 80,
					checked: true,
				},
				{
					value: "创建时间",
					prop: "createTime",
					width: 170,
					checked: true,
				},
			],
			seeTripVisible: false,
			seeEletricVisible: false,
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
          spanNumber:12,
        },
        // {
        //   label: "开始时间",
        //   value: "beginTime",
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
	created() {},
	mounted() {
	},
	methods: {
		// 加载数据
		listLoad() {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			getPagelist(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.tableRow = {};
						this.list = data.data;
						this.total = data.total;
						if (data.data && data.data.length > 0) {
							this.list.forEach((item) => {
								item.sjwd = "[" + item.sLongitude + "," + item.sLatitude + "]";
								item.ejwd = "[" + item.eLongitude + "," + item.eLatitude + "]";
							});
						}
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 查看行程推送
		handSeeTrip() {
			this.seeTripVisible = true;
		},
		// 查看充电推送
		handSeeEletric() {
			this.seeEletricVisible = true;
		},
		// 查看详情
		handleDetail(e) {
			this.tableRow = e;
			this.detailVisible = true;
		},
		// 导出
		handleExport() {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			exportData1(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// handleClearSearch() {
		// 	this.listQuery = {
		// 		vin: "",
		// 		beginTime: getTodayTime0(),
		// 		endTime: getTodayEndTime(),
		// 		pageNum: 1,
		// 		pageSize: 10,
		// 	};
		// 	this.listLoad();
		// },
	},
};
</script>

<style lang="scss" scoped>
.mileage-i {
	position: absolute;
	right: 2px;
	top: 2px;
	font-style: normal;
	font-size: 12px;
}

a,
a:hover,
a:active {
	text-decoration: none;
	cursor: pointe;
	cursor: pointer;
}
a {
	color: red;
}
::v-deep .el-dialog {
	min-height: 100px;
}
::v-deep .el-dialog__body {
	font-size: 14px;

	text-align: left;
}
::v-deep .el-dialog__headerbtn {
	background: linear-gradient(#0bc9ff, #014fff);
	margin-top: -16px;
	margin-right: -10px;
}
::v-deep .el-dialog__title {
	font-size: 14px;
}

//  .el-table .cell div {
//   white-space: pre-line !important;
// }
</style>
