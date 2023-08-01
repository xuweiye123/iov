<template>
	<div class="js-system-user app-container">
		<app-search>
			<div slot="content">
				<seach-form
          :listQuery="listQuery"
          :searchList="searchList"
        />
			</div>
			<!-- 清空按钮 -->
			<app-search-button
				slot="bottom"
				:isdisabled="listLoading"
				:is-collapse="false"
				@click-filter="handleFilter"
				@click-clear="handleClear"
			/>
		</app-search>


   <el-scrollbar wrap-class="default-scrollbar__wrap">
			<div class="content-chart">
				<div class="chart-content" v-loading="listLoading1">
					<charts-title :svgName="'columnChart'" :title="'行程数据统计（次）'" />
					<div id="carConditionBars" class="echarts-box" />
				</div>
			</div>
			<div
				class="section-wrap"
			
			>
				<!-- 授权按钮 -->
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
					:tableHeights="tableHeight +10000"
					:isShowOperation="false"
					@handle-size-change="handleSizeChange"
					@handle-current-change="handleCurrentChange"
				>
					<template slot="tableContent" slot-scope="scope">
						<span v-if="scope.item.prop === 'jwmark'">
							{{
								scope.row[scope.item.prop] == 0
									? "否"
									: scope.row[scope.item.prop] == 1
									? "是"
									: "-"
							}}
						</span>
						<span v-else>
							{{
								scope.row[scope.item.prop] | processData
							}}
						</span>
					</template>
				</app-table>
			</div>
		</el-scrollbar>
	</div>
</template>

<script>
import { mapState } from "vuex";
// 混入
import { pagingMixin } from "@/mixins/table";
import { otherHeight } from "@/mixins/getOtherHeight";
import { tableStyle } from "@/mixins/tableStyle";
import { getPageButton } from "@/mixins/getButton";
// utils
import { getLastMonthTime0, getTodayEndTime, getDaysBetween,beginTimeAndEndTime } from "@/utils/base";
// 组件
import chartsTitle from "@/components/chartsTitle";
// echarts
import { carBarsCharts } from "@/utils/eCharts";
//request
import {
	getPagelist,
	exportDetail,
	getChartData,
} from "@/api/carControlSys/strokeDataAnalysis";
// 辅助函数
export default {
	name: "strokeDataAnalysis",
	components: { chartsTitle },
	filters: {},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				vin: "",
				// beginTime: getLastMonthTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getLastMonthTime0(),getTodayEndTime()],
			},
			listLoading1: false,
			chart1: null,
			accData: {},
			// 字段管理所需字段
			tableList: [
				{
					value: "VIN码",
					prop: "vin",
					width: 190,
					checked: true,
				},
				{
					value: "车型名称",
					prop: "carType",
					width: 140,
					checked: true,
				},
				{
					value: "开始时间",
					prop: "startTime",
					width: 160,
					checked: true,
				},
				{
					value: "结束时间",
					prop: "endTime",
					width: 160,
					checked: true,
				},
				{
					value: "行驶里程",
					prop: "mileage",
					width: 100,
					checked: true,
				},
				{
					value: "急加速",
					prop: "anxiousAccelerate",
					width: 100,
					checked: true,
				},
				{
					value: "急减速",
					prop: "anxiousDecelerate",
					width: 100,
					checked: true,
				},
				{
					value: "最高车速",
					prop: "maxSpeed",
					width: 100,
					checked: true,
				},
				{
					value: "平均车速",
					prop: "avgSpeed",
					width: 100,
					checked: true,
				},
				{
					value: "记录时间",
					prop: "recordTime",
					width: 160,
					checked: true,
				},
			],
			selectDate:'',
			// 30天
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate? minDate.getTime():''
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
         if (this.selectDate !== '') {
            const one = 29 * 24 * 3600 * 1000
            const minTime = this.selectDate - one
            const maxTime = this.selectDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
		};
	},
	watch: {
		// "$store.state.theme.activeName": function(val) {
		// 	if (val&&this.$route.name=='strokeDataAnalysis') {
		// 		if(document.getElementById("carConditionBars")){
    //       this.carConditionBars(this.accData);
		// 		}	
		// 	}
		// },
		// "$store.state.app.sidebarCollapse": function() {
		// 	if(this.$route.name=='strokeDataAnalysis'){
		// 		this.listLoad();
		// 	}
		// },
		// $route: {
		// 	handler: function(val) {
		// 		// 如果是memberMaintenance路由，就执行计时器
		// 		if (val.name == "strokeDataAnalysis") {
		// 			this.carConditionBars(this.accData);
		// 		}
		// 	},
		// 	deep: true,
		// },
	},
	computed: {
		...mapState("theme", ["activeName"]),
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
          pickerOptions:this.pickerOptions
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
	mounted() {
		this.$nextTick(() => {
			this.carConditionBars();
		});
	},
	methods: {
		handleClear() {
			this.listQuery = {
				vin: "",
				// beginTime: getLastMonthTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getLastMonthTime0(),getTodayEndTime()],
				pageNum: 1,
				pageSize: 10,
			};
			this.accData = {};
			this.list = [];
			this.total = 0;
			this.listLoad();
		},
		handleCurrentChange(res) {
			this.listQuery.pageNum = res;
			let dan = "1";
			this.listLoad(dan);
		},
		// 加载数据
		listLoad(dan) {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			if (!this.listQuery.endTime ||!this.listQuery.beginTime) {
				this.$message.warning({
					message: "请选择开始时间和结束时间",
					duration: 2 * 1000,
				});
				return;
			}
			this.listLoading = true;
			this.list = [];
			getPagelist(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data && data.data ? data.data : [];
						this.total = data.total ? data.total : 0;
					}
					// console.log(this.list,"this.list");
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
			if (!dan) {
				this.listLoading1 = true;
				this.accData = {};
				getChartData(this.listQuery)
					.then(({ data }) => {
						if (data.code === 0) {
							this.accData = data.data && data.data ? data.data : {};
							this.carConditionBars(this.accData);
						}
						this.listLoading1 = false;
					})
					.catch(() => {
						this.listLoading1 = false;
					});
			}
		},
		// 导出
		handleExport() {
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			if (!this.listQuery.endTime ||!this.listQuery.beginTime) {
				this.$message.warning({
					message: "请选择开始时间和结束时间",
					duration: 2 * 1000,
				});
				return;
			}
			this.exportLoading = true;
			exportDetail(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					//
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// 行程数据统计（次）
		carConditionBars(data) {
			let xData = [];
			let yData = [];
			let yData1 = [];
			if (data) {
				let dataTime =  this.ReverseRankingDate(data,"time")
				for (const key in data) {
					xData.push(dataTime[key].time);
					yData.push(dataTime[key].quickSpeed);
					yData1.push(dataTime[key].lowSpeed);
				}
			} else {
				xData = [];
				yData = [];
				yData1 = [];
			}
			let colorList =
			 this.activeName == "red"?
         ["#C9CDD4","#E8534E"]
				:this.activeName == "green"
					? ["#C9CDD4 ", "#00B074"]
					: ["#C9CDD4", "#1E64DD"];
			// let textColor = this.activeName == "default" ? ["#9EA8B2","#9EA8B2"] : ["#595757","#929292"];
			// let lineColor = this.activeName == "default" ? "#2E3844" : "#EFF4F8";
			let textColor = ["#595757","#929292"];
			let lineColor = "#EFF4F8";

			// if (
			// 	this.chart1
			// ) {
			// 	this.chart1.dispose(); //销毁
			// }
			const Dom = document.getElementById("carConditionBars");
			this.chart1 = this.$echarts.init(Dom);
			const optionData = carBarsCharts(
				xData,
				yData,
				yData1,
				textColor,
				colorList,
				lineColor
			);
			this.chart1.clear();
			this.chart1.setOption(optionData);
			this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          this.chart1.resize();
        });
      });
			// window.addEventListener("resize", () => {
			// 	if (this.chart1 != null && this.chart1 != "" && this.chart1 != undefined) {
			// 		this.chart1.resize();
			// 	}
			// });
		},
		//时间排序
		ReverseRankingDate(data, p) {
			for (var i = 0; i < data.length - 1; i++) {
				for ( var j = 0; j < data.length - 1 - i; j++) {
					// console.log(Date.parse(data[j][p]));
					if (Date.parse(data[j][p]) > Date.parse(data[j + 1][p])) {
						var temp = data[j];
						data[j] = data[j + 1];
						data[j + 1] = temp;
					}
				}
			}
			return data;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .add-btn {
	padding-bottom: 3px !important;
}
.echarts-box {
	width: 100%;
	height: calc(24vh - 10px);
}

::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    padding: 0 10px 25px 0;
    max-height: calc(100vh - 234px); // 最大高度
    overflow-x: hidden !important; // 隐藏横向滚动栏
  }
}
</style>
