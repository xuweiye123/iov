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
				@click-collapse="handleCollapse"
				:isdisabled="listLoading"
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
				@click-powerDiagram="handleDiagram"
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
				size="mini"
				slot="table"
				:isTableSelection="false"
				:isTableNumber="true"
				:list="list"
				:listLoading="listLoading"
				:filterTableList="filterTableList"
				:pageObj="listQuery"
				:total="total"
				@handle-size-change="handleSizeChange"
				@handle-current-change="handleCurrentChange"
			>
				<template slot="tableContent" slot-scope="scope">
					<span
						@click="lookProcess(scope.row)"
						class="vinNo"
						v-if="scope.item.prop === 'vinNo'"
					>
						{{ scope.row[scope.item.prop] | processData}}
					</span>
					<span v-else-if="scope.item.prop === 'changeResult'">
						<el-tag
              :type="
							 scope.row[scope.item.prop] == 0
                  ? 'success'
                  : scope.row[scope.item.prop] == 1
                  ? 'danger'
                  : 'info'
              "
              effect="dark"
              style="width: 65px;"
            >
					  	{{scope.row[scope.item.prop] == 0 ? '正常' : scope.row[scope.item.prop] == 1 ? '失败' : '-'}}
            </el-tag>
					</span>
					<span v-else-if="scope.item.prop === 'oldBatSoc'||scope.item.prop === 'newBatSoc'">
						{{(scope.row[scope.item.prop]||scope.row[scope.item.prop]==0)?scope.row[scope.item.prop]+'kwh':'-'}}
					</span> 
					<span v-else-if="scope.item.prop === 'changeOverTime'">
						{{ switchTime(scope.row[scope.item.prop]) }}
					</span>
					<span v-else>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 换电热力图 -->
		<power-diagram :visibles.sync="powerDiagramVisible" />
		<!-- 查看换电过程 -->
		<power-process :data="tableRow" :visibles.sync="powerProcessVisible"/>
	</div>
</template>

<script>
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// request
import {
	getPageList,
	exportDetails,
} from "@/api/carMonitorSys/powerChangeDetail";
import { getCarTypeList, getBatchAll } from "@/api/commont";
// utils
import { switchTime } from "@/utils/base"
// 组件
import powerDiagram from "./components/powerDiagram";
import powerProcess from "./components/powerProcess";

export default {
	name: "powerChangeDetail",
	CN_name: "换电明细表",
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	components: { powerDiagram,powerProcess },
	data() {
		return {
			listQuery: {
				vinNo: "",
				carBatchCode: "",
				carTypeId: "",
				// beginTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				pageSize: 10,
				pageNum: 1,
				timeRange:["",""],
			},
			vinNo: null,
			carTypeList: [],
			batchList: [],
			tableList: [
				{
					value: "VIN码",
					prop: "vinNo",
					width: 170,
					checked: true,
				},
				{
					value: "车型名称",
					prop: "carTypeName",
					width: 100,
					checked: true,
				},
				{
					value: "项目代号",
					prop: "carBatchCode",
					width: 110,
					checked: true,
				},
				{
					value: "原电池编码",
					prop: "oldBatCode",
					width: 200,
					checked: true,
				},
				{
					value: "原电池电量",
					prop: "oldBatSoc",
					width: 160,
					checked: true,
				},
				{
					value: "原电池健康值",
					prop: "oldBatSoe",
					width: 160,
					checked: true,
				},
				{
					value: "新电池编码",
					prop: "newBatCode",
					width: 200,
					checked: true,
				},
				{
					value: "新电池电量",
					prop: "newBatSoc",
					width: 130,
					checked: true,
				},
				{
					value: "新电池健康值",
					prop: "newBatSoe",
					width: 110,
					checked: true,
				},
				{
					value: "换电耗时",
					prop: "changeOverTime",
					width: 140,
					checked: true,
				},
				{
					value: "订单号",
					prop: "orderSn",
					width: 180,
					checked: true,
				},
				{
					value: "换电开始时间",
					prop: "startTime",
					width: 140,
					checked: true,
				},
				{
					value: "换电结果",
					prop: "changeResult",
					width: 110,
					checked: true,
				},
				// {
				// 	value: "操作人",
				// 	prop: "chargeType",
				// 	width: 110,
				// 	checked: true,
				// },
			],
			powerDiagramVisible: false,
			powerProcessVisible:false
		};
	},
	watch: {
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
        //   value: "beginTime",
        //   type: 'dateTime',
        // },
        // {
        //   label: "结束时间",
        //   value: "endTime",
        //   type: 'dateTime',
        //   defaultType:'end'
        // },
        {
          label: "车型名称",
          value: "carTypeId",
          type: "select",
          options: {
            data: this.carTypeList,
            extraProps: { 
              label: "carTypeName",
              value: "carTypeId",
            },
          },
        },
        {
          label: "项目代号",
          value: "carBatchCode",
          type: "select",
          options: {
            data: this.batchList,
            extraProps: { 
              label: "carBatchCode",
              value: "carBatchId",
            },
          },
        },
      ];
    },
	},
	created() {},
	mounted() {
		// this.authouizeList = [
		// 	{
		// 		functionName: "导出",
		// 		functionNameEn: "导出",
		// 		functionType: 2,
		// 		url: "export",
		// 		icon: "export",
		// 		isShow: 1,
		// 	},
		// 	{
		// 		functionName: "充电热力图",
		// 		functionNameEn: "充电热力图",
		// 		functionType: 2,
		// 		url: "chargeDiagram",
		// 		icon: "export",
		// 		isShow: 1,
		// 	},
		// ];
		getCarTypeList().then(({ data }) => {
			if (data.code === 0) {
				this.carTypeList = data.data || [];
			}
		});
		getBatchAll().then(({ data }) => {
			if (data.code === 0) {
				this.batchList = data.data || [];
			}
		});
	},
	methods: {
		switchTime,
		// 加载数据
		listLoad() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
            this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			// if (
			// 	!this.listQuery.vinNo &&
			// 	!this.listQuery.endTime &&
			// 	!this.listQuery.beginTime
			// ) {
			// 	this.$message.warning({
			// 		message: "请输入VIN,否则只能查询一天之内的数据!",
			// 		duration: 2 * 1000,
			// 	});
			// 	return;
			// }
			// if (!this.listQuery.vinNo) {
			// 	if (
			// 		getDaysBetween(this.listQuery.beginTime, this.listQuery.endTime) > 1
			// 	) {
			// 		this.$message.warning({
			// 			message: "请输入VIN,只能查询一天之内的数据!",
			// 			duration: 2 * 1000,
			// 		});
			// 		return;
			// 	}
			// }
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
		returnValue(val) {
			this.listQuery.vinNo = val;
		},

		// 换电热力图
		handleDiagram() {
			this.powerDiagramVisible = true;
		},
		// 导出
		handleExport() {
			this.listQuery.startTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			this.exportLoading = true;
			exportDetails(this.listQuery).finally(() => {
        this.exportLoading = false;
      })
		},
		// handleClearBettery() {
		// 	this.listQuery = {
		// 		vinNo: "",
		// 		carBatchCode: "",
		// 		carTypeId: "",
		// 		// beginTime: getTodayTime0(),
		// 		// endTime: getTodayEndTime(),
		// 		timeRange:[ getTodayTime0(),getTodayEndTime()],
		// 		pageSize: 10,
		// 		pageNum: 1,
		// 	};
		// 	this.listLoad();
		// },
		// 查看换电过程
		lookProcess(row){
			this.tableRow = row
			this.powerProcessVisible = true
		},
		// getChangeOverTime(val){
		// 	if(val){
		// 		if(val>60){
		// 			let min =  parseInt(val/60)
		// 			let second = parseInt(val%60)
		// 			 if(second<10){
		// 				second = '0'+second
		// 			 }
		// 			return min+'分'+second+'秒'
		// 		}
		// 		return val + '秒'
		// 	}
		// 	return "0秒"
		// }
	},
};
</script>

<style lang="scss" scoped></style>