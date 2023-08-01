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
				@click-chargeDiagram="handleDiagram"
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
					<span>
						{{
							scope.row[scope.item.prop] | processData
						}}
					</span>
				</template>
			</app-table>
		</div>
		<!-- 充电散点图 -->
		<charge-diagram :visibles.sync="chargeDiagramVisible" />
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
	getChargeDetailsPageList,
	exportChargeDetails,
} from "@/api/carMonitorSys/chargeDetails";
import { getCarTypeList, getBatchAll } from "@/api/commont";
// utils
import { getTodayTime0, getTodayEndTime,getDaysBetween,beginTimeAndEndTime } from "@/utils/base";
// 组件
import chargeDiagram from "./components/chargeDiagram";
export default {
	name: "chargeDetails",
	CN_name: "充电明细表",
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	components: { chargeDiagram },
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
				timeRange:[ "",""],
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
					value: "开始充电时间",
					prop: "beginTime",
					width: 160,
					checked: true,
				},
				{
					value: "结束充电时间",
					prop: "endTime",
					width: 160,
					checked: true,
				},
				{
					value: "每次充电时间(秒)",
					prop: "spendTime",
					width: 160,
					checked: true,
				},
				{
					value: "起始充电量(%)",
					prop: "beginSocValue",
					width: 130,
					checked: true,
				},
				{
					value: "终止充电量(%)",
					prop: "endSocValue",
					width: 130,
					checked: true,
				},
				// {
				// 	value: "充电类型",
				// 	prop: "chargeType",
				// 	width: 110,
				// 	checked: true,
				// },
			],
			chargeDiagramVisible: false,
			selectDate:'',
      pickerOptions: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.selectDate = minDate? minDate.getTime():''
      //     if (maxDate) {
      //       this.selectDate = ''
      //     }
      //   },
      //   disabledDate: (time) => {
      //    if (this.selectDate !== '') {
      //       const one = 6 * 24 * 3600 * 1000
      //       const minTime = this.selectDate - one
      //       const maxTime = this.selectDate + one
      //       return time.getTime() < minTime || time.getTime() > maxTime
      //     }
      //   }
      },
		};
	},
	watch: {
		// "listQuery.vinNo":{
		// 	immediate: true,
		// 	deep: true,
		// 	handler(e1) {
		// 		console.log(e1,123)
		// 		if (!e1) {
		// 			this.pickerOptions= {
		// 				onPick: ({ maxDate, minDate }) => {
		// 					this.selectDate = minDate? minDate.getTime():''
		// 					if (maxDate) {
		// 						this.selectDate = ''
		// 					}
		// 				},
		// 				disabledDate: (time) => {
		// 				if (this.selectDate !== '') {
		// 						const one =  0* 24 * 3600 * 1000
		// 						const minTime = this.selectDate - one
		// 						const maxTime = this.selectDate + one
		// 						return time.getTime() < minTime || time.getTime() > maxTime
		// 					}
		// 				}
		// 			}
		// 		}else{
		// 			console.log(22)
		// 			this.pickerOptions=null
		// 		}
		// 	},
		// }
		// "$route.path": {
		// 	immediate: true,
		// 	handler(e1) {
		// 		if (this.$route.query.vinNo) {
		// 			this.listQuery.vinNo = this.$route.query.vinNo;
		// 			this.$forceUpdate();
		// 			this.listQuery.beginTime = this.$route.query.btystarttime;
		// 			this.listQuery.endTime = this.$route.query.btyendtime;
		// 			this.listLoad();
		// 		}
		// 	},
		// },
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
					// pickerOptions:this.pickerOptions
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
		// 加载数据
		listLoad() {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
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
			const postData = this.getPostData();
			getChargeDetailsPageList(postData)
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
		getPostData() {
			const {
				vinNo,
				vinNoTotal,
				carBatchCode,
				carTypeId,
				beginTime,
				endTime,
				pageSize,
				pageNum,
				orderfield,
				direction,
			} = this.listQuery;
			const carBatchCode1 = carBatchCode
				? this.batchList.find((item) => item.carBatchId === carBatchCode)
						.carBatchCode
				: "";
			const postData = {
				vinNo,
				vinNoTotal,
				carTypeId,
				carBatchCode: carBatchCode1,
				beginTime,
				endTime,
				pageSize,
				pageNum,
				orderfield,
				direction,
			};
			return postData;
		},
		// 充电热力图
		handleDiagram() {
			this.chargeDiagramVisible = true;
		},
		// 导出
		handleExport() {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			const postData = this.getPostData();
			this.exportLoading = true;
			exportChargeDetails(postData).finally(() => {
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
		// 		timeRange:[getTodayTime0(),getTodayEndTime()],
		// 		pageSize: 10,
		// 		pageNum: 1,
		// 	};
		// 	this.listLoad();
		// },
	},
};
</script>

<style lang="scss" scoped></style>