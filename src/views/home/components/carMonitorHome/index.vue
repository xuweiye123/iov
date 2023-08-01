<template>
	<div class="js-home app-container app" v-loading="listLoading">
		<div class="home-left">
			<h3 class="echarts-title">
				接入车辆
			</h3>
			<div class="car-number">
				<div class="cuntings-box">
					<i
						v-for="(item, index) in cunting"
						:key="index"
						:class="['cunting', item === '' ? 'douhao-bg' : '']"
						>{{ item }}</i
					>
				</div>
				<div>
					<span
						v-for="(item, index) in numbers"
						:key="index"
						:class="[
							'numbers',
							item === ',' ? 'douhao douhao-bg' : 'numbers-bg',
						]"
						:style="{
							color: item === ',' ? '#929292' : '',
							background: item === ',' ? 'unset' : '#F2F3F5',
						}"
						>{{ item }}</span
					>
					<span
						:style="{
							color: douhaoColor,
						}"
						class="cunting"
						>辆</span
					>
				</div>
			</div>
			<div ref="chinaChart" class="map-china" />
			<div class="car-cunt-box clearfix">
				<el-row :gutter="10">
					<el-col :span="16">
						<el-row :gutter="10">
							<el-col :span="12">
								<div class="car-box-list t">
									<span class="in-car-word">接入平台车型(种)</span>
									<span class="in-car-number">{{
										carInfo.carTypeCount || 0
									}}</span>
									<!-- <span class="in-car-word in-car-word2">
										同比上月
										<i
											:class="
												`iconfont ${
													carInfo.carTypeCountMom > 0
														? 'icon-jt-slode slode'
														: 'icon-jt-down down'
												}`
											"
										></i>
										<span
											:class="carInfo.carTypeCountMom > 0 ? 'slode' : 'down'"
										>
											{{ carInfo.carTypeCountMomPercent || 0 }}%
										</span>
									</span> -->
									<img
										:src="
											require(`@/assets/images/theme/${activeName}/img_jierupingtaichexing@2x.png`)
										"
										style="width:9vh;right:0px;bottom:5px;"
										alt=""
									/>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="car-box-list t">
									<span class="in-car-word">车辆总里程(公里)</span>
									<span class="in-car-number">{{
										Math.round(+carInfo.carMileage) || 0
									}}</span>
									<!-- <span class="in-car-word in-car-word2">
										同比上月
										<i
											:class="
												`iconfont ${
													carInfo.carMileageMom > 0
														? 'icon-jt-slode slode'
														: 'icon-jt-down down'
												}`
											"
										></i>
										<span :class="carInfo.carMileageMom > 0 ? 'slode' : 'down'">
											{{ carInfo.carMileageMomPercent || 0 }}%
										</span>
									</span> -->
									<img
										:src="
											require(`@/assets/images/theme/${activeName}/img_cheliangzonglicheng@2x.png`)
										"
										style="width:9vh;right:0px;bottom:5px;"
										alt=""
									/>
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :span="12">
								<div class="car-box-list t">
									<span class="in-car-word">接入城市个数(个)</span>
									<span class="in-car-number">{{
										carInfo.carAreaCount || 0
									}}</span>
									<!-- <span class="in-car-word in-car-word2">
										同比上月
										<i
											:class="
												`iconfont ${
													carInfo.cityCountMom > 0
														? 'icon-jt-slode slode'
														: 'icon-jt-down down'
												}`
											"
										></i>
										<span :class="carInfo.cityCountMom > 0 ? 'slode' : 'down'">
											{{ carInfo.cityCountMomPercent || 0 }}%
										</span>
									</span> -->
									<img
										:src="
											require(`@/assets/images/theme/${activeName}/img_jieruchengshishu@2x.png`)
										"
										style="width:9vh;right:0px;bottom:5px;"
										alt=""
									/>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="car-box-list t">
									<span class="in-car-word">充电时长(小时)</span>
									<span class="in-car-number">{{
										carInfo.chargeDuration || 0
									}}</span>
									<!-- <span class="in-car-word in-car-word2">
										同比上月
										<i
											:class="
												`iconfont ${
													carInfo.chargeDurationMom > 0
														? 'icon-jt-slode slode'
														: 'icon-jt-down down'
												}`
											"
										></i>
										<span
											:class="carInfo.chargeDurationMom > 0 ? 'slode' : 'down'"
										>
											{{ carInfo.chargeDurationMomPercent || 0 }}%
										</span>
									</span> -->
									<img
										:src="
											require(`@/assets/images/theme/${activeName}/img_chongdianshichang@2x.png`)
										"
										style="width:9vh;right:0px;bottom:5px;"
										alt=""
									/>
								</div>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="8">
						<div class="car-box-list2 t">
							<span class="in-car-word">本月新增车辆(辆)</span>
							<span class="in-car-number">{{ carInfo.carCurrentCount || 0 }}</span>
							<span class="in-car-word in-car-word2"
								>同比上月
								<i
									:class="
										`iconfont ${
											carInfo.monthCarCountMom <0
												?'icon-jt-down down' 
												:'icon-jt-slode slode'
										}`
									"
								></i>
								<span :class="carInfo.monthCarCountMom < 0 ? 'down' : 'slode'">
									{{ Math.abs(carInfo.monthCarCountMom) || 0 }}%</span
								></span
							>
							<img
								:src="
									require(`@/assets/images/theme/${activeName}/img_benzhouxinzengcheliang@2x.png`)
								"
								style="width:9vh;right:0px;top:1vh;"
								alt=""
							/>
							<img
								:src="
									require(`@/assets/images/theme/${activeName}/img_xzcl@2x.png`)
								"
								style="width:100%;right:0px;bottom:2px;"
								alt=""
							/>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<div class="home-right">
			<div class="home-echarts-list">
				<h3 class="echarts-title">
					零部件故障统计（个）
				</h3>
				<div ref="barFaultinfo" class="echarts-box" />
			</div>
			<div class="home-echarts-list ">
				<h3 class="echarts-title">
					故障等级占比（%）
				</h3>
				<div ref="barFaultLevel" class="echarts-box" />
			</div>
			<div v-loading="listLoading1" class="home-echarts-list">
				<h3 class="echarts-title">
					故障车辆TOP5（辆）
					<el-tabs
						v-model="errorActiveName"
						class="home-tab-list"
						@tab-click="handleErrorCarClick"
					>
						<el-tab-pane label="总计" name="1" />
						<el-tab-pane label="本月" name="2" />
						<el-tab-pane label="上月" name="3" />
					</el-tabs>
				</h3>
				<div ref="barFaultCarTop" class="echarts-box" />
			</div>
			<div class="home-echarts-list ">
				<h3 class="echarts-title">
					故障码TOP5（个）
				</h3>
				<div ref="barFaultCodeTop" class="echarts-box" />
			</div>
			<div v-loading="listLoading2" class="home-echarts-list">
				<h3 class="echarts-title">
					充电情况分布（小时）
					<el-tabs
						v-model="electricActiveName"
						class="home-tab-list"
						@tab-click="handleEletricClick"
					>
						<el-tab-pane label="总计" name="1" />
						<el-tab-pane label="本月" name="2" />
						<el-tab-pane label="上月" name="3" />
					</el-tabs>
				</h3>
				<div ref="barEletric" class="echarts-box" />
			</div>
			<div class="home-echarts-list ">
				<h3 class="echarts-title">
					实时故障趋势（个）
				</h3>
				<div ref="barFaultTrend" class="echarts-box" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import {
	lineCharts,
	barStackCharts,
	barHorizontalCharts,
	barCharts,
	pieCharts,
	radarCharts,
	chinaCharts,
} from "@/utils/eCharts";
import { chinaJSON } from "@/utils/chinaJSON";
import {
	getStaCar,
	getStaTotal,
	getHomePage,
	getStaFault,
	getStaCharge,
} from "@/api/carMonitorSys/carMonitorSysHome";
// import { info } from "console";
export default {
	name: "carMonitorHome",
	data() {
		return {
			cunt: ["千万", "百万", "十万", "万", "千", ""], // 空字符串是为了数字里面的逗号预留位置
			cunting: [],
			numbers: [],
			timerNumber: null,
			errorActiveName: "1",
			electricActiveName: "1",
			themeColor: "",
			textColor: "",
			douhaoColor: "",
			numberColor: "",
			pwdVisible: false,
			listLoading: false,
			listLoading1: false,
			listLoading2: false,
			carInfo: {
				carTypeCount: 0, // 接入平台车种
				// carTypeCountMom: 0, // 接入平台车种同比上月
				carMileage: 0, // 车辆总里程
				// carMileageMom: 0, // 车辆总里程同比上月
				carAreaCount: 0, // 接入城市个数
				// cityCountMom: 0, // 接入城市个数同比上月
				chargeDuration: 0, // 充电时长
				// chargeDurationMom: 0, // 充电时长同比上月
				carCurrentCount: 0, // 本月新增
				monthCarCountMom: 0, // 同比上月
			},
			newsVisible: false,
			content: "",
		};
	},
	computed: {
		...mapState("theme", ["color", "activeName"]),
	},
	// 监听
	watch: {
		"$store.state.theme.activeName": function(val) {
			this.listLoading = true;
			getHomePage()
				.then(({ data }) => {
					if (data.code == 0) {
						this.themeColor = this.color;
						if (this.activeName  === "blue") {
							this.themeColor = "#1E64DD ";
							this.textColor = "#515C60";
							this.douhaoColor = "#929292";
							this.numberColor = "#F2F3F5";
						}
						if (this.activeName  === "green") {
							this.themeColor = "#00BC7C";
							this.textColor = "#515C60";
							this.douhaoColor = "#929292";
							this.numberColor = "#F2F3F5";
						}
						if (this.activeName === "red") {
							this.themeColor = "#F46061";
							this.textColor = "#595757";
							this.douhaoColor = "#929292";
							this.numberColor = "#F2F3F5";
						}
						this.chinaChart(this.themeColor);
						this.barFaultinfoInit(this.textColor, data);
						this.barFaultLevelInit(data);
						this.barFaultCarTopInit(
							this.errorActiveName,
							this.themeColor,
							this.textColor,
							data
						);
						this.barFaultCodeTopInit(this.themeColor, this.textColor, data);
						this.barEletricInit(
							this.electricActiveName,
							this.themeColor,
							this.textColor,
							data
						);
						this.barFaultTrendInit(this.themeColor, this.textColor, data);
						
					}
					this.listLoading = false;
				})
				.catch(() => {
					this.listLoading = false;
				});
		},

		$route: {
			handler: function(val, oldval) {
				// 如果是首页‘home’路由，就执行计时器
				if (val.name === "home") {
					this.setInterNumber();
				} else {
					if (this.timerNumber) {
						clearInterval(this.timerNumber);
						this.timerNumber = null; // 停止
					}
				}
			},
			deep: true,
		},
	},
	created() {
		if (JSON.parse(localStorage.getItem("mustChangePwd"))) {
			this.pwdVisible = true;
		} else {
			this.pwdVisible = false;
		}
	},
	destroyed: function() {
		if (this.timerNumber) {
			clearInterval(this.timerNumber);
			this.timerNumber = null; // 停止
		}
		window.removeEventListener(
			"resize",
			function() {
				myChart.resize();
			},
			20
		);
	},
	mounted() {
		this.themeColor = "#1E64DD ";
		this.textColor = "#515C60";
		this.douhaoColor = "#929292";
		this.numberColor = "#F2F3F5";
		this.listLoading = true;
		getHomePage()
			.then(({ data }) => {
				if (data.code == 0) {
					// 零部件故障统计
					this.barFaultinfoInit(this.textColor, data);
					// 故障等级占比（%）
					this.barFaultLevelInit(data);
					// 故障车辆TOP5（辆）
					this.barFaultCarTopInit(
						this.errorActiveName,
						this.themeColor,
						this.textColor,
						data
					);
					// 故障码TOP5（个）
					this.barFaultCodeTopInit(this.themeColor, this.textColor, data);
					// 充电情况分布（小时）
					this.barEletricInit(
						this.electricActiveName,
						this.themeColor,
						this.textColor,
						data
					);
					// 实时故障趋势（个）
					this.barFaultTrendInit(this.themeColor, this.textColor, data);
				}
				this.listLoading = false;
			})
			.catch(() => {
				this.listLoading = false;
			});
		// this.barFaultinfoInit(this.textColor)

		this.chinaChart(this.themeColor);
		this.getAllData();
		this.setInterNumber();

		
	},
	methods: {
		// 计时器
		setInterNumber() {
			if (this.timerNumber) {
				clearInterval(this.timerNumber);
				this.timerNumber = null;
			}
			this.timerNumber = setInterval(() => {
				this.getAllData();
				this.chinaChart(this.themeColor);
			}, 60 * 1000);
		},
		// 获取总数据
		getAllData() {
			getStaTotal().then(({ data }) => {
				// 总数据
				const val = data.data[0].carTotalCount;
				this.cuntFilter(val);
				this.carInfo = data.data[0];
				if(this.carInfo.carCurrentCount > 0 && this.carInfo.carLastCount > 0){
					this.carInfo.monthCarCountMom  = ((this.carInfo.carCurrentCount - this.carInfo.carLastCount) / this.carInfo.carLastCount).toFixed(2) * 100
				}
				// this.carInfo.carTypeCountMom < 0
				// 	? (this.carInfo.carTypeCountMomPercent = Math.abs(
				// 			this.carInfo.carTypeCountMom
				// 	  ))
				// 	: (this.carInfo.carTypeCountMomPercent = this.carInfo.carTypeCountMom);
				// this.carInfo.carMileageMom < 0
				// 	? (this.carInfo.carMileageMomPercent = Math.abs(
				// 			this.carInfo.carMileageMom
				// 	  ))
				// 	: (this.carInfo.carMileageMomPercent = this.carInfo.carMileageMom);
				// this.carInfo.cityCountMom < 0
				// 	? (this.carInfo.cityCountMomPercent = Math.abs(
				// 			this.carInfo.cityCountMom
				// 	  ))
				// 	: (this.carInfo.cityCountMomPercent = this.carInfo.cityCountMom);
				// this.carInfo.chargeDurationMom < 0
				// 	? (this.carInfo.chargeDurationMomPercent = Math.abs(
				// 			this.carInfo.chargeDurationMom
				// 	  ))
				// 	: (this.carInfo.chargeDurationMomPercent = this.carInfo.chargeDurationMom);
				// this.carInfo.weekCarCountMom < 0
				// 	? (this.carInfo.weekCarCountMomPercent = Math.abs(
				// 			this.carInfo.weekCarCountMom
				// 	  ))
				// 	: (this.carInfo.weekCarCountMomPercent = this.carInfo.weekCarCountMom);
			}).catch(() => {

			})
		},
		// 数字单位格式化
		cuntFilter(data) {
			const cunt = ["千万", "百万", "十万", "万", "千", ""];
			// 数字
			const val = data ? data.toString() : "0";
			if (val.length > 3) {
				var result = [];
				var counter = 0;
				for (var i = val.length - 1; i >= 0; i--) {
					counter++;
					result.unshift(val[i]);
					if (!(counter % 3) && i != 0) {
						result.unshift(",");
					}
				}
				this.numbers = result;
			} else {
				this.numbers = val.split("");
			}
			// 单位
			if (val.length > 6) {
				cunt.splice(2, 0, "");
			}
			this.cunting = cunt.slice(
				cunt.length + 3 - this.numbers.length,
				cunt.length
			);
		},
		// 中国地图
		chinaChart() {
			this.$echarts.registerMap("china", chinaJSON);
			getStaCar().then(({ data }) => {
				if (data.code === 0) {
					let flagColor =
						this.activeName == "green"
							? "#00BC7C"
							: this.activeName == "red"
							? "#E8534E"
							: "#1E64DD ";
					let color =
						this.activeName == "green"
							? "#00BC7C"
							: this.activeName == "red"
							? "#E8534E"
							: "#1E64DD ";
					const dataList = data.data ? data.data : {};
					const res = [];
					for (var i = 0; i < chinaJSON.features.length; i++) {
						var geoCoord = chinaJSON.features[i].properties.name; // 省份名称
						var lgt = chinaJSON.features[i].properties.cp; // 经纬度
						for (var k = 0; k < dataList.length; k++) {
							if (geoCoord === dataList[k].province) {
								res.push({
									name: dataList[k].province,
									value: lgt,
									cunt: dataList[k].carCount,
								});
							}
						}
					}
					const Dom = this.$refs.chinaChart;
					const myChart = this.$echarts.init(Dom);
					myChart.clear();
					const optionData = chinaCharts(color, res, flagColor);
					myChart.setOption(optionData);
					this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
						this.$nextTick(() => {
							myChart.resize();
						});
					});
					// window.addEventListener("resize", function() {
					// 	myChart.resize();
					// });
				}
			}).catch(() => {

			})
		},
		// 零部件故障统计(堆叠柱状图)
		barFaultinfoInit(textColor, data) {
			const xData = data.statPart.xaxis;
			const chartsData = [];
			if (data.statPart.date) {
				data.statPart.date.forEach((r) => {
					for (var item in r) {
						const obj = {
							name: item,
							type: "bar",
							barWidth: 10,
							stack: "a",
							data: r[item].length ? r[item] : ["0"],
							itemStyle: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: "#FFD369" }, // 0% 处的颜色
									{ offset: 1, color: "#FFBA01" }, // 100% 处的颜色
								]), //渐变色
							},
						};
						chartsData.push(obj);
					}
				});
				let greenList = ["#599AFF ", "#00BC7C ", "#FFCD38", "#E8534E"];
				let blueColorList = ["#29CAF8","#1E64DD", "#FFCE3D", "#EF5858"];
				let redColorList = ["#C9CDD4", "#FFCD38", "#E8534E", "#599AFF"];
				let colorList =
					this.activeName == "green"
						? greenList
						: this.activeName == "red"
						? redColorList
						: blueColorList;
				chartsData.forEach((item, index) => {
					item.itemStyle.color = colorList[index];
				});
			}
			const Dom = this.$refs.barFaultinfo;
			const myChart = this.$echarts.init(Dom);
			myChart.clear();
			const optionData = barStackCharts(xData, chartsData, textColor);
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
		// 故障等级占比(环形图)
		barFaultLevelInit(data) {
			const chartsData = [];
			let dataList=data&&data.data&&data.data[0]?data.data[0]:[]
			let colorList =["#29CAF8","#1E64DD", "#FFCE3D", "#EF5858"];
			for (var item in dataList) {
				const name =
					item === "level1Rate"
						? "一级"
						: item === "level2Rate"
						? "二级"
						: item === "level3Rate"
						? "三级"
						: item === "level4Rate"
						? "四级"
						: "";
				const obj = {
					name: name,
					value: dataList[item],
				};
				chartsData.push(obj);
			}
			const Dom = this.$refs.barFaultLevel;
			const myChart = this.$echarts.init(Dom);
			myChart.clear();
			const optionData = pieCharts(chartsData, colorList);
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
		// 故障车辆TOP5（横向柱状图）
		barFaultCarTopInit(resourceType, color, textColor, data) {
			var xData = data&&data.staColumnar&&data.staColumnar.xaxis?data.staColumnar.xaxis:[];
			var chartsData = data&&data.staColumnar&&data.staColumnar.date?data.staColumnar.date:[];
			const Dom = this.$refs.barFaultCarTop;
			const myChart = this.$echarts.init(Dom);
			myChart.clear();
			const optionData = barHorizontalCharts(
				xData,
				chartsData,
				color,
				textColor,
				this.activeName == "default" ? "#0E1015" : "#ECF0F6",
				this.activeName == "red" ? "#599AFF" : color
			);
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
		// 故障车辆TOP5（横向柱状图）（总计，本月，上月）
		barFaultCarTopInit1(resourceType, color, textColor) {
			this.listLoading1 = true;
			getStaFault({ resourceType })
				.then(({ data }) => {
					if (data.code === 0) {
						var xData = data.data.xaxis;
						let { date = [] } = data.data;
						var chartsData = date.length > 0 ? date : ["0", "0", "0", "0", "0"];
						const Dom = this.$refs.barFaultCarTop;
						const myChart = this.$echarts.init(Dom);
						myChart.clear();
						const optionData = barHorizontalCharts(
							xData,
							chartsData,
							color,
							textColor,
							this.activeName == "default" ? "#0E1015" : "#ECF0F6",
							this.activeName == "red" ? "#599AFF" : color
						);
						myChart.setOption(optionData);
						this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
							this.$nextTick(() => {
								myChart.resize();
							});
						});
						// window.addEventListener("resize", function() {
						// 	myChart.resize();
						// });
					}
					this.listLoading1 = false;
				})
				.catch(() => {
					this.listLoading1 = false;
				});
		},
		// 故障车辆TOP5（总计，本月，上月）
		handleErrorCarClick() {
			this.barFaultCarTopInit1(
				this.errorActiveName,
				this.themeColor,
				this.textColor
			);
		},
		// 故障码TOP5（柱状图）
		barFaultCodeTopInit(color, textColor, data) {
			var xData = data&&data.faultCodeColumnar&&data.faultCodeColumnar.xaxis?data.faultCodeColumnar.xaxis:[];
			var chartsData = data&&data.faultCodeColumnar&&data.faultCodeColumnar.date
				? data.faultCodeColumnar.date
				: [];
			const Dom = this.$refs.barFaultCodeTop;
			const myChart = this.$echarts.init(Dom);
			myChart.clear();
			const optionData = barCharts(
				xData,
				chartsData,
				color,
				textColor,
				this.activeName == "red" ? "#599AFF" : color
			);
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
		// 充电情况分布(雷达图)
		barEletricInit(stateType, color, textColor, data) {
			const keyArry =
				data&&data.staChargeList
					? JSON.parse(data.staChargeList[0].timePeriod)
					: [6, 10, 14, 18, 22];
			const valueArry =
				data&&data.staChargeList
					? JSON.parse(data.staChargeList[0].duration)
					: [0, 0, 0, 0, 0];
			var chartsData = [{ name: "", value: valueArry }];
			// console.log(keyArry,valueArry,chartsData,"chartsData")
			const maxNum = Math.max(...valueArry) + 20;
			const indicator = [];
			keyArry.forEach((row) => {
				indicator.push({
					name: row + ":00",
					max: maxNum,
				});
			});
			// console.log(chartsData, "chartsData111");
			const Dom = this.$refs.barEletric;
			const myChart = this.$echarts.init(Dom);
			myChart.clear();
			const optionData = radarCharts(indicator, "#00C3FB", chartsData, textColor);
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
		// 充电情况分布(雷达图)（总计，本月，上月）
		barEletricInit1(stateType, color, textColor) {
			this.listLoading2 = true;
			getStaCharge({ stateType: stateType })
				.then(({ data }) => {
					if (data.code === 0) {
						const keyArry =
							data.data != null &&
							data.data != undefined &&
							data.data.length > 0
								? JSON.parse(data.data[0].timePeriod)
								: [6, 10, 14, 18, 22];

						const valueArry =
							data.data != null &&
							data.data != undefined &&
							data.data.length > 0
								? JSON.parse(data.data[0].duration)
								: [0, 0, 0, 0, 0];

						// const valueArry = JSON.parse(data.data[0].value);
						var chartsData = [{ name: "", value: valueArry }];
						const maxNum = Math.max(...valueArry) + 20;
						const indicator = [];
						keyArry.forEach((row) => {
							indicator.push({
								name: row + ":00",
								max: maxNum,
							});
						});
						// console.log(chartsData, "chartsData");

						const Dom = this.$refs.barEletric;
						const myChart = this.$echarts.init(Dom);
						myChart.clear();
						const optionData = radarCharts(
							indicator,
							'#00C3FB',
							chartsData,
							textColor
						);
						myChart.setOption(optionData);
						this.$elementResizeDetectorMaker.listenTo(Dom, (element) => {
							this.$nextTick(() => {
								myChart.resize();
							});
						});
						// window.addEventListener("resize", function() {
						// 	myChart.resize();
						// });
					}
					this.listLoading2 = false;
				})
				.catch(() => {
					this.listLoading2 = false;
				});
		},
		// 充电分布（总计，本月，上月）
		handleEletricClick() {
			this.barEletricInit1(
				this.electricActiveName,
				this.themeColor,
				this.textColor
			);
		},
		// 实时故障趋势（折线图）
		barFaultTrendInit(color, textColor, data) {
			let blueColorList = [
				new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: "rgba(89, 154, 255, 0.6)",
					},
					{
						offset: 1,
						color: "rgba(112, 138, 255, 0.1)",
					},
				]),
			];
			let defaultColorList = [
				new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: "rgba(89, 154, 255, 0.6)",
					},
					{
						offset: 1,
						color: "rgba(112, 138, 255, 0.1)",
					},
				]),
			];
			let colorList =
				this.activeName == "blue" ? blueColorList : defaultColorList;
			let lineColor = this.activeName == "blue" ? "#1E64DD" : "#599AFF";
			var Da = data.staRealFaultColumnar.xaxis;
			var xData = [];
			for (const key in Da) {
				xData.push(Da[key].substr(6, 11));
			}
			var chartsData = data.staRealFaultColumnar.date.length
				? data.staRealFaultColumnar.date
				: ["0"];
			const Dom = this.$refs.barFaultTrend;
			const myChart = this.$echarts.init(Dom);
			myChart.clear();
			const optionData = lineCharts(
				colorList,
				xData,
				chartsData,
				textColor,
				lineColor
			);
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
	},
};
</script>

<style lang="scss" scoped>
@font-face {
	font-family: "DIN";
	src: url("../../../../assets/font/din-bold_.otf");
}
.app {
	height: calc(100vh - 140px) !important;
	// min-width: 1080px;
}
.home-left {
	float: left;
	width: 49%;
	// margin-top: 1vh;
	margin-bottom: 1vh;
	// margin-left: 1vh;
	padding: 0 10px;
	box-sizing: border-box;
	border-radius: 4px;
	height: calc(100% - 1vh);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.home-right {
	float: right;
	// margin-top: 1vh;
	width: 51%;
	// margin-right: 1vh;
	height: 100%;
}
.home-echarts-list {
	float: left;
	width: calc(50% - 1vh);
	// padding: 0 10px;
	box-sizing: border-box;
	border-radius: 4px;
	margin-left: 1vh;
	padding-left: 1vh;
	margin-bottom: 1vh;
	height: calc(100% / 3 - 1vh);
}
.echarts-title {
	height: 4vh;
	line-height: 4vh;
	margin: 0;
	padding-right: 1vh;
}
.echarts-box {
	height: calc(100% - 4vh);
}
.cuntings-box {
	margin: 2.5vh 0 0.2vh 0;
	height: 2.6vh;
}
.cunting {
	color: #929292;
	display: inline-block;
	width: 5vh;
	text-align: center;
	font-style: normal;
	margin-right: 5px;
}
.douhao-bg {
	width: 3vh !important;
	background-color: unset;
}
.numbers {
	display: inline-block;
	width: 5vh;
	height: 6vh;
	line-height: 6vh;
	text-align: center;
	font-size: 35px !important;
	font-family: Arial, Helvetica, sans-serif;
	margin-right: 5px;
	position: relative;
	border-radius: 5px 5px 5px 5px;
}
.numbers-bg {
	color: #595757;
}
.douhao {
	font-weight: bold;
}
.numbers:after {
	// content: "";
	// position: absolute;
	// top: 50%;
	// left: 0;
	// border-top: 1px solid #fff;
	// width: 100%;
}
.numbers.douhao:after {
	display: none;
}
.map-china {
	height: 38vh;
	// margin: 10px 0;
}
.car-box-list {
	border-radius: 4px;
	margin-bottom: 1vh;
	height: 10.5vh;
	color: #fff;
	padding: 10px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	min-height: 68px;
}
.car-box-list2 {
	height: 22vh;
	border-radius: 4px;
	margin-bottom: 1vh;
	color: #fff;
	padding: 10px;
	position: relative;
	min-height: 144.5px;
}
.car-box-list img {
	position: absolute;
	right: 0;
	bottom: 10px;
}
.car-box-list2 img {
	position: absolute;
	right: 0;
	bottom: 10px;
}
// .t1 {
// 	background-image: linear-gradient(to right, #5eedd2, #18b9ff);
// }
// .t2 {
// 	background-image: linear-gradient(to right, #ffb57d, #ff729f);
// }
// .t3 {
// 	background-image: linear-gradient(to right, #af5fd2, #4f2dcb);
// }
// .t4 {
// 	background-image: linear-gradient(to right, #0aebff, #0e94ff);
// }
// .t5 {
// 	background-image: linear-gradient(to right, #7384ff, #8f6bff);
// }
.in-car-word {
	display: block;
	color: #797979;
	font-size: 12px !important;
}
.in-car-word2 {
	font-size: 12px !important;
}
.in-car-number {
	display: block;
	font-size: 20px !important;
	margin: 5px 0;
	font-family: DIN;
	font-weight: bold;
}
::v-deep .home-tab-list {
	float: right;
	.el-tabs__nav-wrap::after,
	.el-tabs__active-bar {
		display: none;
	}
	.el-tabs__item {
		height: 20px;
		line-height: 25px;
		padding: 0px 5px;
	}
	.el-tabs__nav-wrap {
		line-height: 27px;
		height: 27px;
	}
}
.iconColor {
	margin-right: 0.5vh;
}

</style>
