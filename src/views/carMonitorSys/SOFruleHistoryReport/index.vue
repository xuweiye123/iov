<template>
	<div class="app-container">
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
import { getDropList } from "@/mixins/dictionaryDropList";
// request
import {
	getPageList,
	handleExports,
} from "@/api/carMonitorSys/SOFruleHistoryReport";
import { getBatchAll } from "@/api/commont";
import { beginTimeAndEndTime } from "@/utils/base";
export default {
	name: "SOFruleHistoryReport",
	CN_name: "失效规则历史记录",
	mixins: [pagingMixin, partialForm, otherHeight, tableStyle, getPageButton,getDropList],
	data() {
		return {
			listQuery: {
				batteryCategory: "",
				carBatchId: "",
				startTime: "",
				endTime: "",
				vinNo: "",
				timeRange:["",""],
			},
			dropList:[
        { postData:{dicCode:1006},key:'batteryTypeList' },
      ],
			batteryTypeList: [],
			carBatchCodeList: [],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					checked: true,
					width: 170,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					checked: true,
					width: 120,
				},
				{
					value: "电池类型",
					prop: "dicName",
					checked: true,
					width: 140,
				},
				{
					value: "故障码",
					prop: "faultCode",
					checked: true,
					width: 120,
				},
				{
					value: "开始时间",
					prop: "startTime",
					checked: true,
					width: 140,
				},
				{
					value: "结束时间",
					prop: "endTime",
					checked: true,
					width: 140,
				},
				{
					value: "备注",
					prop: "remark",
					checked: true,
					width: 140,
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
          label: "电池类型",
          value: "batteryCategory",
          type: 'select',
          options: {
            data: this.batteryTypeList,
            // extraProps: {
            //   value: "value",
            //   label: "text",
            // },
          },
        },
      ];
    },
	},
	mounted() {
		this.getBatchAllList();
		// 数据字典下拉
		this.getDropList(this.dropList)
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