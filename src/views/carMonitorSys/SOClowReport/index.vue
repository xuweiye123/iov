<template>
	<div class="app-container">
		<!-- 查询 -->
		<app-search>
			<div slot="content">
				<seach-form
				  :labelWidth="'85px'"
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
				@click-clear="handleClear"
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
// request
import {
	getPageList,
	handleExports,
	selectAlarmTypeList,
} from "@/api/carMonitorSys/SOClowReport";
import { getBatchAll } from "@/api/commont";
import { beginTimeAndEndTime } from "@/utils/base";
export default {
	name: "SOClowReport",
	CN_name: "SOC过低提醒历史记录",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				carBatchId: "",
				alarmLevelExpression: "",
				startTime: "",
				endTime: "",
				vinNo: "",
				timeRange:["",""],
			},
			alarmtypeList: [],
			carBatchCodeList: [],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 180,
					checked: true,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					width: 150,
					checked: true,
				},
				{
					value: "报警类型",
					prop: "alarmLevelExpression",
					width: 150,
					checked: true,
				},
				{
					value: "报警开始时间",
					prop: "startTime",
					width: 150,
					checked: true,
				},
				{
					value: "报警结束时间",
					prop: "endTime",
					width: 150,
					checked: true,
				},
			],
			addUpdateVisible: false,
			isEdit: false,
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
          label: "项目代号",
          value: "carBatchId",
          type: 'select',
          options: {
            data: this.carBatchCodeList,
            extraProps: {
              value: "carBatchId",
              label: "carBatchCode",
            },
          },
        },
				{
          label: "报警类型",
          value: "alarmLevelExpression",
          type: 'select',
          options: {
            data: this.alarmtypeList,
            extraProps: {
              value: "value",
              label: "text",
            },
          },
        },
				{
          label: "报警时间范围",
          value: "timeRange",
          type: 'dateTimeRange',
          spanNumber:12,
        },
				// {
        //   label: "报警开始时间",
        //   value: "startTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "报警结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
      ];
    },
	},
	mounted() {
		this.getAlarmtypeList();
		this.getBatchAllList();
	},
	methods: {
		//获取项目代号
		getBatchAllList() {
			getBatchAll().then(({ data }) => {
				if (data.code === 0) {
					this.carBatchCodeList = data.data || [];
				}
			});
		},
		//获取报警类型
		getAlarmtypeList() {
			selectAlarmTypeList().then(({ data }) => {
				if (data.code === 0) {
					this.alarmtypeList = data.data;
				}
			});
		},
		// 导入成功之后刷新list
		reloadList() {
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
						this.tableRow = {};
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
			handleExports(this.listQuery).then(({ data }) => {
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

<style lang="scss" scoped></style>