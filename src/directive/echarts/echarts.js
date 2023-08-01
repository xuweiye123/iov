import * as echarts from "echarts";
const install = function(Vue) {
	Object.defineProperties(Vue.prototype, {
		$echartsDiagnosis: {
			get() {
				return {
					// 折现图
					line1: function(id, xdata, data, extraParams) {
						this.chart = echarts.init(document.getElementById(id));
						this.chart.clear();
						const optionData = {
							grid: {
								left: "3%",
								right: "3%",
								top: "0",
								bottom: "0",
								containLabel: false,
							},
							tooltip: {
								trigger: "axis",
								backgroundColor: "rgb(237, 238, 239)",
								borderColor: "#ccc",
								textStyle: {
									color: "#666",
								},
								formatter: function(a) {
									let xToolTipLable = extraParams.xToolTipLable;
									xToolTipLable =
										xToolTipLable === "" ? "" : xToolTipLable + "：";
									return (
										xToolTipLable +
										a[0].axisValue +
										"<br/>" +
										extraParams.yToolTipLable +
										"：" +
										a[0].value
									);
								},
							},
							xAxis: [
								{
									splitLine: { show: false },
									type: "category",
									boundaryGap: false,
									data: xdata,
									axisLine: {
										// lineStyle: {
										//   color: '#ccc'
										// }
									},
									axisLabel: {
										show: true,
										// textStyle: {
										//   color: '#666'
										// }
									},
									show: false,
								},
							],
							yAxis: [
								{
									splitLine: { show: false },
									type: "value",
									axisLine: {
										// lineStyle: {
										//   color: '#ccc'
										// }
									},
									axisLabel: {
										show: true,
										// textStyle: {
										//   color: '#666'
										// }
									},
									show: false,
								},
							],
							series: [
								{
									name: "",
									type: "line",
									smooth: true,
									symbolSize: 0,
									itemStyle: {
										normal: {
											areaStyle: { type: "default" },
											lineStyle: {
												color: extraParams.lineColor,
												width: 1,
											},
											color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
												{
													offset: 0,
													color: extraParams.topColor, // 0% 处的颜色
												},
												{
													offset: 1,
													color: extraParams.bottomColor, // 100% 处的颜色
												},
											]), //背景渐变色
										},
									},
									data: data,
								},
							],
						};
						this.chart.setOption(optionData);
					},
					// 柱状图
					bar1: function(id, xdata, data, extraParams) {
						this.chart = echarts.init(document.getElementById(id));
						this.chart.clear();
						const optionData = {
							grid: {
								left: "3%",
								right: "3%",
								bottom: "3%",
								top: "5%",
								containLabel: true,
							},
							// color: ['#3ba1ff'],
							tooltip: {
								trigger: "axis",
								backgroundColor: "rgb(237, 238, 239)",
								borderColor: "#ccc",
								textStyle: {
									color: "#666",
									//fontSize:20
								},
								formatter: function(a) {
									return (
										'<span style="display:inline-block; width:8px; height:8px; margin-right:5px; border-radius:50px; background-color:#1E64DD"></span>'+
										extraParams.xToolTipLable +
										"：" +
										a[0].axisValue +
										"<br/>" +
										'<span style="display:inline-block; width:8px; height:8px; margin-right:5px; border-radius:50px; background-color:#1E64DD"></span>'+
										extraParams.yToolTipLable +
										"：" +
										a[0].value
									);
								},
							},
							xAxis: [
								{
									splitLine: { show: false },
									type: "category",
									boundaryGap: true,
									data: xdata,
									axisLine: {
										lineStyle: {
											color: "#E0E5E7",
										},
									},
									axisLabel: {
										show: true,
										textStyle: {
											color: "#595757",
											fontSize: 11,
										},
										rotate: 50,
									},
								},
							],
							yAxis: [
								{
									splitLine: {
										show: true,
										lineStyle: {
											color: "#E0E5E7",
											type: "dashed",
										},
									},
									type: "value",
									// axisLine: {
									// 	lineStyle: {
									// 		color: extraParams.lineColor,
									// 	},
									// },
									axisLabel: {
										show: true,
										textStyle: {
											color: "#929292",
										},
									},
								},
							],
							series: [
								{
									name: "",
									type: "bar",
									barWidth: 10, // 柱图宽度
									itemStyle: {
										normal: {
											barBorderRadius: [34, 34, 0, 0], // 圆角
											areaStyle: { type: "default" },
											color:extraParams.color
											// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											// 	{ offset: 0, color: extraParams.topColor },
											// 	{ offset: 1, color: extraParams.bottomColor },
											// ]),
										},
									},
									data: data,
								},
							],
						};
						this.chart.setOption(optionData);
					},
					// 环形图
					pie1: function(id, legendData, data, textName) {
						this.chart = echarts.init(document.getElementById(id));
						this.chart.clear();
						const optionData = {
							color: [
								"#3aa0ff",
								"#4ecb73",
								"#fad337",
								"#f04864",
								"#975fe4",
								"#36cbcb",
							],
							tooltip: {
								trigger: "item",
								formatter: "{a} <br/>{b} : {c} ({d}%)",
							},
							legend: {
								orient: "vertical",
								x: "60%",
								y: "20%",
								data: legendData,
								icon: "circle",
								formatter: function(params) {
									for (var i = 0; i < data.length; i++) {
										if (data[i].name == params) {
											return (
												params + "| " + data[i].percent + "| " + data[i].value
											);
										}
									}
								},
							},
							graphic: [
								{
									type: "text",
									left: "22%",
									top: "42%",
									style: {
										text: textName,
										textAlign: "center",
										fill: "#999",
										width: 140,
									},
								},
								{
									type: "text",
									left: "18%",
									top: "50%",
									style: {
										text: "12345",
										textAlign: "center",
										fill: "#000",
										fontSize: 24,
										width: 140,
									},
								},
							],
							series: [
								{
									name: "",
									type: "pie",
									radius: ["50%", "70%"],
									center: ["25%", "50%"],
									itemStyle: {
										normal: {
											label: {
												show: false,
											},
											labelLine: {
												show: false,
											},
										},
										emphasis: {
											label: {
												show: true,
												position: "center",
												textStyle: {
													fontSize: "14",
													fontWeight: "bold",
												},
											},
										},
									},
									data: data,
								},
							],
						};
						this.chart.setOption(optionData);
					},
				};
			},
		},
	});
};

export default {
	install,
};
