<template>
	<app-drawer
		:visibles.sync="visibles"
		:title="'车辆国标数据'"
		width="75%"
		:wrapperClosable="true"
		@close-drawer="closeDrawer"
		:isDrawerFoot="false"
		:loading="loading"
	>
		<div slot="drawerContent">
			<el-collapse v-model="activeNames">
				<el-collapse-item name="1">
					<template slot="title">
						<span class="title-style"></span>
						<span>整车数据</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row :gutter="10" type="flex" justify="start" align="middle">
								<el-col :span="24">
									<el-form-item label="车企数据时间：">
										{{ listObj.time | processData }}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="10">
								<el-col :span="6">
									<el-form-item label="车辆状态：">
										{{ dataList1.carStatusValue | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="充电状态：">
										{{ dataList1.chargeStatusValue | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="运行模式：">
										{{ dataList1.runStyle | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="车速：">
										{{ dataList1.speed | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="累计里程：">
										{{ dataList1.totalMile | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="总电压：">
										{{ dataList1.totalVoltage | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="总电流：">
										{{ dataList1.totalElectic | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="SOC：">
										{{ dataList1.soc | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="DC-DC状态：">
										{{ dataList1.dcDcStatus | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="档位：">
										{{ dataList1.gear | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="绝缘电阻：">
										{{ dataList1.insulatedResistance | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="驱动力：">
										{{ dataList1.my | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="制动力：">
										{{ dataList1.my | processData }}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="2">
					<template slot="title">
						<span class="title-style"></span>
						<span>{{ `驱动电机数据（个数：${dataList2.length}）` }}</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row
								v-for="(item, index) of dataList2"
								:key="index"
								:gutter="10"
							>
								<el-col :span="6">
									<el-form-item label="驱动电机序号：">
										{{ (index + 1) | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="驱动电机状态：">
										{{ item.status | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="驱动电机控制器温度：">
										{{ item.controllerTemperature | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="驱动电机转速：">
										{{ item.engineSpeed | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="驱动电机转矩：">
										{{ item.torque | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="驱动电机温度：">
										{{ item.temperature | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="电机控制器输入电压：">
										{{ item.inputVoltage | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item
										:title="item.current"
										label="电机控制器直流母线电流："
									>
										<span
											style="display: block;width: 70px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
											>{{ item.current | processData }}</span
										>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="3">
					<template slot="title">
						<span class="title-style"></span>
						<span>车辆位置数据</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row :gutter="10">
								<el-col :span="6">
									<el-form-item label="经度：">
										{{ dataList3.lgt | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="纬度：">
										{{ dataList3.lat | processData }}
									</el-form-item>
								</el-col>
								<!-- <el-col :span="6">
										<el-form-item label="南北纬：">
											{{ dataList3.lgtText | processData }}
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="东西经：">
											{{ dataList3.latText | processData }}
										</el-form-item>
									</el-col> -->
								<el-col :span="6">
									<el-form-item label="是否有效定位：">
										{{ dataList3.locationStatus | processData }}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="4">
					<template slot="title">
						<span class="title-style"></span>
						<span>极值数据</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row :gutter="10">
								<el-col :span="6">
									<el-form-item label="最高电压电池子系统号：">
										{{ dataList4.highestVoltageBatteryNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最高电压电池单体代号：">
										{{ dataList4.highestVoltageBatteryUnitNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="电池单体电压最高值：">
										{{ dataList4.batteryUnitVoltageHighValue | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最低电压电池子系统号：">
										{{ dataList4.lowestVoltageBatteryNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最低电压电池单体代号：">
										{{ dataList4.lowestVoltageBatteryUnitNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="电池单体电压最低值：">
										{{ dataList4.batteryUnitVoltageLowestValue | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最高温度子系统号：">
										{{ dataList4.highestTemBatteryNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最高温度探针序号：">
										{{ dataList4.highestTemBatteryUnitNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最高温度值：">
										{{ dataList4.batteryUnitHighestValue | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最低温度子系统号：">
										{{ dataList4.lowestestTemBatteryNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最低温度探针序号：">
										{{ dataList4.lowestTemBatteryUnitNo | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="最低温度值：">
										{{ dataList4.batteryUnitLowestValue | processData }}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="5">
					<template slot="title">
						<span class="title-style"></span>
						<span>燃料电池数据</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row :gutter="10" type="flex" justify="start" align="middle">
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="6">
					<template slot="title">
						<span class="title-style"></span>
						<span>发动机数据</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row :gutter="10" type="flex" justify="start" align="middle">
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="7">
					<template slot="title">
						<span class="title-style"></span>
						<span>报警扩展数据</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row :gutter="10" type="flex" justify="start" align="middle">
								<el-col :span="12">
									<el-form-item label="数据接收时间：">
										{{ listObj.time | processData }}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="8">
					<template slot="title">
						<span class="title-style"></span>
						<span>{{ `单体电池电压数据（个数：${dataList5.length}）` }}</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row
								:gutter="10"
								v-for="(item, index) of dataList5"
								:key="index"
							>
								<el-col :span="6">
									<el-form-item label="动力电池子系统号：">
										{{ item.systemNumber | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="动力电池电压：">
										{{ item.voltage | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="动力电池电流：">
										{{ item.electricity | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="单体电池总数：">
										{{ item.batteryTotoalCount | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="本帧起始电池序号：">
										{{ item.startingFrameNumber | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="本帧起始电池总数：">
										{{ item.batteryCount | processData }}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="9">
					<template slot="title">
						<span class="title-style"></span>
						<span>{{ `单体电池温度数据（个数：${dataList6.length}）` }}</span>
					</template>
					<div class="field">
						<el-form :label-position="'right'" label-width="150px">
							<el-row
								:gutter="10"
								v-for="(item, index) of dataList6"
								:key="index"
							>
								<el-col :span="6">
									<el-form-item label="动力电池子系统号：">
										{{ item.systemNumber | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="6">
									<el-form-item label="动力电池温度探针个数：">
										{{ item.temperatureCount | processData }}
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="动力电池温度值：">
										{{ item.temperatures | processData }}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-collapse-item>
				<el-collapse-item name="10">
					<template slot="title">
						<span class="title-style"></span>
						<span>单体电池电压</span>
					</template>
					<div
						v-if="batteryVoltagesChartsShow"
						id="barCharts"
						class="barCharts"
					></div>
				</el-collapse-item>
				<el-collapse-item name="11">
					<template slot="title">
						<span class="title-style"></span>
						<span>单体电池温度</span>
					</template>
					<div
						v-if="temperaturesChartsShow"
						id="barCharts1"
						class="barCharts"
					></div>
				</el-collapse-item>
			</el-collapse>
		</div>
	</app-drawer>
</template>

<script>
import { otherHeight } from "@/mixins/getOtherHeight";
// request
import { getData } from "@/api/carMonitorSys/gbCarMonitor";
export default {
	name: "gbDataDrawer",
	mixins: [otherHeight],
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
			loading: false,
			activeNames: ["1", "2", "3", "4", "7", "8", "9", "10", "11"],
			listObj: {},
			dataList1: {},
			dataList2: [],
			dataList3: {},
			dataList4: {},
			dataList5: [],
			dataList6: [],
			showfilter: false,
			list: [],
			textColor: "#9EA8B2",
			batteryVoltagesChartsShow: false,
			temperaturesChartsShow: false,
		};
	},
	watch: {
		visibles(e1) {
			if (e1) {
				this._gbCarInfo();
			}
		},
		"$store.state.theme.activeName": function(val) {
			if (val === "default") {
				this.textColor = "#9EA8B2";
			}
			if (val === "blue") {
				this.textColor = "#515C60";
			}
		},
	},
	mounted() {},
	methods: {
		// 关闭
		closeDrawer() {
			this.listObj = {};
			this.dataList1 = {};
			this.dataList2 = [];
			this.dataList3 = {};
			this.dataList4 = {};
			this.dataList5 = [];
			this.dataList6 = [];
			this.batteryVoltagesChartsShow = false;
			this.temperaturesChartsShow = false;
			this.$emit("update:visibles", false);
		},
		// 车辆国标数据
		_gbCarInfo() {
			if (!this.visibles) {
				return;
			}
			this.loading = true;
			const postdata = {
				vinNo: this.data.vinNo,
				// vinNo: "TA131354653216432", //假数据测试
			};
			getData(postdata)
				.then(({ data }) => {
					this.loading = false;
					if (data.code === 0) {
						this.listObj = data.data;
						let { batterVoltages = [] } = this.listObj["dataList"][8];
						let { batteryTemperatures = [] } = this.listObj["dataList"][9];
						this.batteryVoltagesChartsShow = batterVoltages.length > 0;
						this.temperaturesChartsShow = batteryTemperatures.length > 0;
						this.dataList1 = this.listObj["dataList"][1];
						this.dataList2 = this.listObj["dataList"][2]["motorUnitList"];
						this.dataList3 = this.listObj["dataList"][5];
						// this.dataList3.lgtText = "北纬";
						// this.dataList3.latText ="东经";
						this.dataList4 = this.listObj["dataList"][6];
						this.dataList5 = this.listObj["dataList"][8]["batterVoltages"];
						this.dataList6 = this.listObj["dataList"][9]["batteryTemperatures"];
						if (this.batteryVoltagesChartsShow) {
							this.$nextTick(() => {
								this.loadBarChart();
							});
						}
						if (this.temperaturesChartsShow) {
							this.$nextTick(() => {
								this.loadBarChart1();
							});
						}
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		loadBarChart() {
			let yData = [];
			let xData = [];
			let yArr = [];
			this.dataList5.forEach((it, index) => {
				yData.push(...it.batteryVoltages);
				it.batteryVoltages.forEach((item) => {
					yArr.push({
						value: item,
						itemStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0, //右
									y: 0, //下
									x2: 0, //左
									y2: 1, //上
									colorStops: [
										{
											offset: 0,
											color:
												index % 2 == 0 ? "rgba(121, 221, 150, 1)" : "#e1e1ee", // 0% 处的颜色
										},
										{
											offset: 1,
											color:
												index % 2 == 0 ? "rgba(121, 221, 150, 1)" : "#e1e1ee", // 100% 处的颜色
										},
									],
								},
								barBorderWidth: 1,
							},
						},
					});
				});
			});
			const Dom = document.getElementById("barCharts");
			const myChart = this.$echarts.init(Dom);
			const optionData = this.barCharts(xData, yData, yArr);
			myChart.setOption(optionData);
			this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
				this.$nextTick(() => {
					myChart.resize();
				});
			});
			// window.addEventListener("resize", function() {
			// 	myChart.resize();
			// });
		},
		loadBarChart1() {
			let yData = [];
			let xData = [];
			let yArr = [];
			this.dataList6.forEach((it, index) => {
				yData.push(...it.temperatures);
				it.temperatures.forEach((item) => {
					yArr.push({
						value: item,
						itemStyle: {
							normal: {
								color: {
									type: "linear",
									x: 0, //右
									y: 0, //下
									x2: 0, //左
									y2: 1, //上
									colorStops: [
										{
											offset: 0,
											color:
												index % 2 == 0 ? "rgba(121, 221, 150, 1)" : "#e1e1ee", // 0% 处的颜色
										},
										{
											offset: 1,
											color:
												index % 2 == 0 ? "rgba(121, 221, 150, 1)" : "#e1e1ee", // 100% 处的颜色
										},
									],
								},
								barBorderWidth: 1,
							},
						},
					});
				});
			});
			const Dom = document.getElementById("barCharts1");
			const myChart = this.$echarts.init(Dom);
			const optionData = this.barCharts(xData, yData, yArr);
			myChart.setOption(optionData);
			this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
				this.$nextTick(() => {
					myChart.resize();
				});
			});
			// window.addEventListener("resize", function() {
			// 	myChart.resize();
			// });
		},
		barCharts(xData, yData, yArr) {
			let max = Math.max(...yData);
			let maxIndex = yData.findIndex((i) => i == max);
			let min = Math.min(...yData);
			let minIndex = yData.findIndex((i) => i == min);
			let markPointArr = [
				{
					name: "最小值",
					value: min,
					xAxis: minIndex,
					yAxis: min,
					itemStyle: {
						normal: {
							color: {
								type: "linear",
								x: 0, //右
								y: 0, //下
								x2: 0, //左
								y2: 1, //上
								colorStops: [
									{
										offset: 0,
										color: "rgba(81, 242, 103, 1)", // 0% 处的颜色
									},
									{
										offset: 1,
										color: "rgba(0, 160, 233, 1)", // 100% 处的颜色
									},
								],
							},
						},
					},
				},
				{
					name: "最大值",
					value: max,
					xAxis: maxIndex,
					yAxis: max,
					itemStyle: {
						normal: {
							color: {
								type: "linear",
								x: 0, //右
								y: 0, //下
								x2: 0, //左
								y2: 1, //上
								colorStops: [
									{
										offset: 0,
										color: "rgba(245, 125, 101, 1)", // 0% 处的颜色
									},
									{
										offset: 1,
										color: "rgba(255, 42, 0, 1)", // 100% 处的颜色
									},
								],
							},
						},
					},
				},
			];
			let optionData = {
				grid: {
					x: 27,
					y: 25,
					x2: 25,
					y2: 25,
				},
				tooltip: {
					trigger: "item",
				},
				xAxis: [
					{
						type: "category",
						axisLine: {
							lineStyle: {
								color: "#657e91",
							},
						},
						axisTick: {
							show: false,
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: this.textColor,
							},
						},
						data: xData,
					},
				],
				yAxis: [
					{
						type: "value",
						splitNumber: 4,
						axisLine: {
							lineStyle: {
								color: "#657e91",
							},
						},
						axisTick: {
							show: false,
						},
						axisLabel: {
							textStyle: {
								color: this.textColor,
							},
						},
						splitLine: {
							show: false,
						},
					},
				],
				series: [
					{
						type: "bar",
						name: "单体电压",
						barCategoryGap: 1,
						data: yArr,
						itemStyle: {
							normal: {
								barBorderRadius: [3, 3, 0, 0],
							},
							emphasis: {
								barBorderRadius: [3, 3, 0, 0],
							},
						},
						markPoint: {
							symbolSize: 53,
							label: {
								color: "#fff",
							},
							data: markPointArr,
						},
					},
				],
			};
			return optionData;
		},
	},
};
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar {
	.el-scrollbar__wrap {
		padding-right: 15px;
		max-height: calc(100vh - 60px);
		overflow-x: hidden !important; // 隐藏横向滚动栏
	}
}
.barCharts {
	width: calc(100vw - 250px);
	height: 200px;
}
</style>
