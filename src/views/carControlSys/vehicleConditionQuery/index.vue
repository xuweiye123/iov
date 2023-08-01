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
				<div class="chart-left" v-loading="listLoading1">
					<charts-title :svgName="'pieChart'" :title="'车况查询统计（次）'" />
					<div id="carConditionPie" class="echarts-box" />
				</div>
				<div class="chart-right" v-loading="listLoading1">
					<charts-title
						:svgName="'columnChart'"
						:title="'车况查询每日统计（次）'"
					/>
					<div id="carConditionBar" class="echarts-box" />
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
						<span v-if="scope.item.prop === 'queryType'">
							{{
								scope.row[scope.item.prop] == 0
									? "数据库"
									: scope.row[scope.item.prop] == 1
									? "T-BOX"
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
import { getTodayTime0, getTodayEndTime, getDaysBetween,beginTimeAndEndTime } from "@/utils/base";
// 组件
import chartsTitle from "@/components/chartsTitle";
// echarts
import { carPieCharts, carBarCharts } from "@/utils/eCharts";
//request
import {
	getPagelist,
	getChartsList,
	exportQueryLog,
} from "@/api/carControlSys/vehicleConditionQuery";
// 辅助函数
export default {
	doNotInit: true,
	name: "vehicleConditionQuery",
	components: { chartsTitle },
	filters: {},
	mixins: [pagingMixin, otherHeight, tableStyle, getPageButton],
	data() {
		return {
			listQuery: {
				vin: "",
				// beginTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getTodayTime0(),getTodayEndTime()],
			},
			listLoading1: false,
			pieData: {},
			barData: {},
			chart: null,
			chart1: null,
			// 字段管理所需字段
			tableList: [
				{
					value: "VIN码",
					prop: "vin",
					width: 170,
					checked: true,
				},
				{
					value: "查询类型",
					prop: "queryType",
					width: 120,
					checked: true,
				},
				{
					value: "指令下发时间",
					prop: "cmdTime",
					width: 140,
					checked: true,
				},
				// {
				// 	value: "SDK版本号",
				// 	prop: "sdkVersion",
				// 	width: 90,
				// 	checked: true,
				// },
				{
					value: "指令Token",
					prop: "businessToken",
					width: 180,
					checked: true,
				},
				{
					value: "记录时间",
					prop: "createTime",
					width: 140,
					checked: true,
				},
			],
			selectDate:'',
			// 5天
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate? minDate.getTime():''
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (time) => {
         if (this.selectDate !== '') {
            const one = 4 * 24 * 3600 * 1000
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
		// 	if (val&&this.$route.name=='vehicleConditionQuery') {
		// 		if(document.getElementById("carConditionPie")){
    //       this.carConditionPie(this.pieData);
		// 		}
		// 		if(document.getElementById("carConditionBar")){
    //       this.carConditionBar(this.barData);
		// 		}
		// 	}
		// },
		// "$store.state.app.sidebarCollapse": function() {
		// 	if(this.$route.name=='vehicleConditionQuery'){
		// 		this.listLoad();
		// 	}
		// },
		// $route: {
		// 	handler: function(val) {
		// 		if (val.name == "vehicleConditionQuery") {
		// 			this.carConditionPie(this.pieData);
		// 			this.carConditionBar(this.barData);
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
			this.carConditionPie();
			this.carConditionBar();
		});
	},
	methods: {
		handleCurrentChange(res){
			this.listQuery.pageNum = res;
			let dan = "1"
			this.listLoad(dan)
		},
		handleClear() {
			this.listQuery = {
				vin: "",
				// beginTime: getTodayTime0(),
				// endTime: getTodayEndTime(),
				timeRange:[getTodayTime0(),getTodayEndTime()],
				pageNum: 1,
				pageSize: 10,
			};
			this.list = [];
			this.total = 0;
			this.pieData = {}
			this.barData = {}
			this.carConditionPie();
			this.carConditionBar();
		},
		// 加载数据
		listLoad(dan) {
			if (!this.listQuery.vin) {
				this.$message.warning({
					message: "请输入VIN码",
					duration: 2 * 1000,
				});
				return;
			}
			this.listQuery.beginTime=this.listQuery.timeRange?this.listQuery.timeRange[0]:''
      this.listQuery.endTime=this.listQuery.timeRange?this.listQuery.timeRange[1]:''
			if (!this.listQuery.endTime ||!this.listQuery.beginTime) {
				this.$message.warning({
					message: "请选择开始时间和结束时间",
					duration: 2 * 1000,
				});
				return;
			}
			if(!dan){
				this.listLoading1 = true;
				this.pieData = {};
		   	this.barData = {};
				getChartsList(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.pieData =
							data.data && data.data.pushCount ? data.data.pushCount : {};
						this.barData = data.data && data.data.daySum ? data.data.daySum : {};
						this.carConditionPie(this.pieData);
						this.carConditionBar(this.barData);
					}else{
						this.pieData = {}
						this.barData = {}
						this.carConditionPie(this.pieData);
						this.carConditionBar(this.barData);
					}
					this.listLoading1 = false;
				})
				.catch(() => {
					this.listLoading1 = false;
				});
			}
			this.listLoading = true;
			this.list = [];
			getPagelist(this.listQuery)
				.then(({ data }) => {
					if (data.code === 0) {
						this.list = data.data && data.data ? data.data : [];
						this.total = data.total ? data.total : 0;
					}else{
						this.list=[]
						this.total=0
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},
		// 导出
		handleExport() {
			if (!this.listQuery.vin) {
				this.$message.warning({
					message: "请输入VIN码",
					duration: 2 * 1000,
				});
				return;
			}
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
			exportQueryLog(this.listQuery).then(({ data }) => {
				if (data.code === 0) {
					this.$message.success({
						message: "导出成功",
						duration: 2 * 1000,
					});
				}
			}).finally(() => {
        this.exportLoading = false;
      })
		},
		// 车况查询统计（次）
		carConditionPie(data) {
			let greenColorList = ["#FFCD38 ","#00B074"];
			let blueColorList = ["#1FE0A3","#1E64DD"];
			let redColorList = ["#E8534E","#599AFF"];
			let colorList =
			this.activeName == "red" ?redColorList:
				this.activeName == "green" ? greenColorList : blueColorList;
			let textColor = this.activeName == "default" ? "#9EA8B2" : "#666D7A";
			let borderColor = this.activeName == "default" ? "#202934" : "#FFFFFF";
			let chartsData = [
				{
					name: "数据库",
					value: data && data["数据库"] ? data["数据库"] : 0,
					// numberColor: this.activeName == "default" ? "#00A0E9" : textColor,
				},
				{
					name: "T-Box",
					value: data && data["t-box"] ? data["t-box"] : 0,
					// numberColor: this.activeName == "default" ? "#FFD05E" : textColor,
				}
			];

			// if (this.chart) {
			// 	this.chart.dispose(); //销毁
			// }
			const Dom = document.getElementById("carConditionPie");
			this.chart = this.$echarts.init(Dom);
			const optionData = carPieCharts(
				chartsData,
				colorList,
				textColor,
				borderColor
			);
			this.chart.clear();
			this.chart.setOption(optionData);
			this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
        this.$nextTick(() => {
          this.chart.resize();
        });
      });
			// window.addEventListener("resize", () => {
			// 	if (this.chart != null && this.chart != "" && this.chart != undefined) {
			// 		this.chart.resize();
			// 	}
			// });
		},
		// 车况查询每日统计（次）
		carConditionBar(data) {
			let xData = [];
			let yData = [];
			if (data) {
				for (const key in data) {
					xData.push(data[key].time);
					yData.push(data[key].sum);
				}
			} else {
				xData = [];
				yData = [];
			}
			let barColor =
			this.activeName == "red"?
			  "#599AFF":
				this.activeName == "green"
					? "#00B074"
					: "#1E64DD";
			let textColor = ["#595757","#929292"];
			let color = "#929292";
			let lineColor = "#EFF4F8";

			// if (this.chart1) {
			// 	this.chart1.dispose(); //销毁
			// }
			const Dom = document.getElementById("carConditionBar");
			this.chart1 = this.$echarts.init(Dom);
			const optionData = carBarCharts(
				xData,
				yData,
				color,
				textColor,
				barColor,
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
