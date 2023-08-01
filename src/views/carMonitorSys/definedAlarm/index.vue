<template>
	<div class="js-basedata-cargroup app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
				  :collapse="collapse"
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				@click-collapse="handleCollapse"
				@click-filter="handleFilter"
				@click-clear="handleClearFault"
			/>
		</app-search>
		<!-- 按钮 -->
		<div class="section-wrap" :style="{ 'min-height': minBoxHeight + 'px' }">
			<app-authorize-button
				:buttonLeft="headersLeftList"
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
			<!-- table -->
			<app-table
				slot="table"
				:isTableSelection="false"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
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
import { getPageList, handleExports } from "@/api/carMonitorSys/definedAlarm";
export default {
	name: "definedAlarm",
	CN_name: "故障计算记录",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				vinNo: "",
				faultName: "",
				// startTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getTodayTime0(),getTodayEndTime()],
				faultCode: "",
			},
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					width: 100,
					checked: true,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					width: 95,
					checked: true,
				},
				{
					value: "故障码",
					prop: "faultCode",
					width: 90,
					checked: true,
				},
				{
					value: "报警名称",
					prop: "faultName",
					width: 120,
					checked: true,
				},
				{
					value: "开始时间",
					prop: "startTime",
					width: 140,
					checked: true,
				},
			],
		};
	},
	computed: {
		// 查询区数据
    searchList() {
      return [
        {
          label: "VIN码",
          value: "vinNo",
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
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
				{
          label: "故障码",
          value: "faultCode",
          type: "input",
        },
				{
          label: "报警名称",
          value: "faultName",
          type: "input",
        },
      ];
    },
	},
	mounted() {},
	methods: {
		// 导入成功之后刷新list
		reloadList() {
			this.listLoad();
		},
		// 清空
		handleClearFault() {
			this.listQuery = {
				vinNo: "",
				faultName: "",
				// startTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getTodayTime0(),getTodayEndTime()],
				pageNum: 1,
				pageSize: 10,
			};
			this.list = [];
			this.total = 0;
			this.listLoad();
		},
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.listLoading = true;
			getPageList(this.listQuery)
				.then(({ data }) => {
					this.list = [];
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

		// 导出
		handleExport() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			handleExports(this.listQuery)
				.then((res) => {})
				.finally(() => {
        this.exportLoading = false;
      })
		},
	},
};
</script>

<style lang="scss"></style>