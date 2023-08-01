import * as echarts from "echarts";
// 折线图(开始充电SOC分布)
// function lineCharts(xdata, ydata) {
//   const optionData = {
//     legend: {
//       show: false,
//       bottom: 0,
//       itemStyle: {
//         borderColor: '#FFF',
//         borderWidth: 2,
//         shadowBlur: 3,
//         shadowColor: 'rgba(169, 175, 184, 0.5)',
//       }
//     },
//     tooltip: {
//       trigger: 'axis',
//       transitionDuration: 0,
//       formatter: function (data) {
//         // console.log(data,111);
//         return data[0].name + '<br/>' + `<div style="font-size:12px;" class="badge-orange"><em></em>` + '充电次数' + `&nbsp;&nbsp;&nbsp;` + data[0].value + `</div>`; //将小数转化为百分数显示
//       },
//       axisPointer: {
//         type: "line",
//       },
//       show: true,
//     },
//     animation: true,
//     grid: {
//       x: 50,
//       y: 10,
//       x2: 10,
//       y2: 25,
//     },
//     toolbox: {
//       show: false,
//       feature: {
//         mark: {
//           show: false,
//         },
//         dataView: {
//           show: false,
//           readOnly: true,
//         },
//         magicType: {
//           show: false,
//           type: ["line", "bar", "stack", "tiled"],
//         },
//         restore: {
//           show: false,
//         },
//         saveAsImage: {
//           show: true,
//         },
//         dataZoom: {
//           show: false,
//         },
//         axisPointer: {
//           lineStyle: {
//             color: "rgba(0, 0, 0, 0.3)",
//             width: 1,
//           },
//         },
//       },
//     },
//     xAxis: [{
//       type: "category",
//       boundaryGap: true,
//       data: xdata,
//       axisLine: {
//         lineStyle: {
//           color: "rgb(214, 214, 214)",
//           width: 1,
//         },
//         show: true,
//       },
//       axisTick: {
//         show: false,
//       },
//       splitLine: {
//         show: false,
//       },
//       axisLabel: {
//         interval: 'auto',
//         show: true,
//         textStyle: {
//           color: "rgba(0, 0, 0, 0.65)",
//           fontSize: 10,
//         },
//       },
//     }, ],
//     yAxis: [{
//       type: "value",
//       axisLabel: {
//         textStyle: {
//           color: "rgba(0, 0, 0, 0.65)",
//           fontSize: 9,
//         },
//         show: true,
//       },
//       axisLine: {
//         lineStyle: {
//           color: "rgb(214, 214, 214)",
//           width: 1,
//         },
//         show: false,
//       },
//       axisTick: {
//         /* 刻度线 */
//         show: false,
//       },
//       // name: "辆",
//       nameTextStyle: {
//         color: "rgba(0, 0, 0,.8)",
//         fontSize: 14,
//       },
//       nameLocation: "end",
//       splitLine: {
//         show: true,
//         lineStyle: {
//           color: "#EAEAEA",
//           width: 1,
//           type: "dashed",
//         },
//       },
//     }, ],
//     series: [{
//       name: "充电次数",
//       type: "line",
//       smooth: false,
//       symbol: 'circle',
//       symbolSize: 6,
//       animation: true,
//       itemStyle: {
//         normal: {
//           color: '#ED6A00', //拐点颜色
//           borderColor: '#fff', //拐点边框颜色
//           borderWidth: 1, //拐点边框大小
//           shadowBlur: 3,
//           shadowColor: 'rgba(169, 175, 184, 0.5)',
//           lineStyle: {
//             type: "solid",
//             width: 2,
//             color: "#FF7741",
//             shadowColor: '#FFBA00',
//             shadowBlur: 5,
//           },
//         },
//       },
//       areaStyle: {
//         normal: {
//           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//               offset: 0,
//               // color: "#FF7741",
//               color: 'rgba(255,243,210)',
//             },
//             {
//               offset: 1,
//               color: "rgba(255,254,250)",
//               // color: "#FF7741",
//             },
//           ]),
//         }
//       },
//       data: ydata,
//       // symbol: "circle",
//       // symbolSize: 4 /* 曲线上的图标大小 */,
//     }, ],
//   }
//   return optionData
// }
function lineCharts(color, xdata, data, textColor, lineColor) {
	const optionData = {
		grid: {
			left: "3%",
			right: "7%",
			top: "10%",
			bottom: "4%",
			containLabel: true,
		},
		color: color,
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		xAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: { show: false },
				type: "category",
				boundaryGap: false,
				data: xdata,
				axisLine: {
					lineStyle: {
						color: "#E0E5E7",
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor,
					},
					interval: 0, // 横轴信息全部显示
					formatter: function(val) {
						var value = val.replace(/\s+/g, "");
						var ret = ""; // 拼接加\n返回的类目项
						var maxLength = 5; // 每项显示文字个数
						var valLength = value.length; // X轴类目项的文字个数
						var rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
						if (rowN > 1) {
							// 如果类目项的文字大于3,
							for (var i = 0; i < rowN; i++) {
								var temp = ""; // 每次截取的字符串
								var start = i * maxLength; // 开始截取的位置
								var end = start + maxLength; // 结束截取的位置
								// 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
								temp = value.substring(start, end) + "\n";
								ret += temp; // 凭借最终的字符串
							}
							return ret;
						} else {
							return value;
						}
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#E0E5E7",
						type: "dashed",
					},
				},
				type: "value",
				minInterval: 1,
				axisLine: {
					lineStyle: {
						color: "#E0E5E7",
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor,
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "line",
				smooth: true,
				itemStyle: {
					normal: {
						areaStyle: { type: "default" },
						lineStyle: {
							color: lineColor,
							width: 2,
						},
					},
				},
				data: data,
			},
		],
	};
	return optionData;
}
// 圆滑折线图(开始充电时间分布)
function lineCharts2(xdata, ydata) {
	const optionData = {
		legend: {
			show: false,
			icon: "rect",
			bottom: 0,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						// color: "#FF7741",
						color: "#FACE99",
					},
					{
						offset: 1,
						color: "rgba(255,253,249)",
					},
				]),
				borderColor: "#FFF",
				borderWidth: 2,
			},
		},
		tooltip: {
			trigger: "axis",
			transitionDuration: 0,
			formatter: function(data) {
				// console.log(data,111);
				return (
					data[0].name +
					"<br/>" +
					`<div style="font-size:12px;" class="badge-orange"><em></em>` +
					"充电次数" +
					`&nbsp;&nbsp;&nbsp;` +
					data[0].value +
					`</div>`
				); //将小数转化为百分数显示
			},
			axisPointer: {
				type: "line",
			},
			show: true,
		},
		animation: true,
		grid: {
			x: 50,
			y: 10,
			x2: 10,
			y2: 25,
		},
		emphasis: {
			itemStyle: {
				color: "#ED6A00", //拐点颜色
				borderColor: "#fff", //拐点边框颜色
				borderWidth: 1, //拐点边框大小
				shadowBlur: 3,
				shadowColor: "rgba(169, 175, 184, 0.5)",
			},
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: false,
				},
				dataView: {
					show: false,
					readOnly: true,
				},
				magicType: {
					show: false,
					type: ["line", "bar", "stack", "tiled"],
				},
				restore: {
					show: false,
				},
				saveAsImage: {
					show: true,
				},
				dataZoom: {
					show: false,
				},
				axisPointer: {
					lineStyle: {
						color: "rgba(0, 0, 0, 0.3)",
						width: 1,
					},
				},
			},
		},
		xAxis: [
			{
				type: "category",
				boundaryGap: true,
				data: xdata,
				axisLine: {
					lineStyle: {
						color: "rgb(214, 214, 214)",
						width: 1,
					},
					show: true,
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false,
				},
				axisLabel: {
					interval: "auto",
					show: true,
					textStyle: {
						color: "rgba(0, 0, 0, 0.65)",
						fontSize: 10,
					},
				},
			},
		],
		yAxis: [
			{
				type: "value",
				axisLabel: {
					textStyle: {
						color: "rgba(0, 0, 0, 0.65)",
						fontSize: 10,
					},
					show: true,
				},
				axisLine: {
					lineStyle: {
						color: "rgb(214, 214, 214)",
						width: 1,
					},
					show: false,
				},
				axisTick: {
					/* 刻度线 */
					show: false,
				},
				// name: "辆",
				nameTextStyle: {
					color: "rgba(0, 0, 0,.8)",
					fontSize: 14,
				},
				nameLocation: "end",
				splitLine: {
					show: true,
					lineStyle: {
						color: "#EAEAEA",
						width: 1,
						type: "dashed",
					},
				},
			},
		],
		series: [
			{
				name: "充电次数",
				type: "line",
				smooth: true,
				symbol: "circle",
				symbolSize: 6,
				animation: true,
				itemStyle: {
					normal: {
						color: "rgba(255,255,255,0)", //拐点颜色
						//borderColor:'#fff',//拐点边框颜色
						//borderWidth:1,//拐点边框大小
						// shadowBlur:1,
						//shadowColor:'rgba(169, 175, 184, 0.5)',
						lineStyle: {
							type: "solid",
							width: 2,
							color: "#FF7741",
							shadowColor: "#FFBA00",
							shadowBlur: 5,
						},
					},
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								// color: "#FF7741",
								color: "#FACE99",
							},
							{
								offset: 1,
								color: "rgba(255,245,223)",
							},
						]),
					},
				},
				data: ydata,
				// symbol: "circle",
				// symbolSize: 4 /* 曲线上的图标大小 */,
			},
		],
	};
	return optionData;
}
// 不规则环形图（车型占比）
// function pieCharts(data) {
//   const optionData = {
//     legend: {
//       orient: 'vertical',
//       left: '70%', //图例距离左的距离
//       y: 'center', //图例上下居中
//       icon: "circle",
//       textStyle: {
//         fontSize: 12
//       }
//     },
//     tooltip: {
//       show: true,
//       transitionDuration: 0
//     },
//     color: ['#ED6A00', '#FFC029', '#948E8A', '#262626 '],
//     series: [{
//       name: '车型',
//       type: 'pie',
//       radius: ['30%', '68%'],
//       center: ['42%', '53%'],
//       roseType: 'radius',
//       label: {
//         formatter: "{a|{d}%}\n{b|{b}}",
//         rich: {
//           a: {
//             color: "#262626",
//             height: 20,
//             fontWeight: '600',
//             fontSize: 12,
//           },
//           b: {
//             color: "#999999",
//             fontSize: 11,
//           }
//         },
//       },
//       itemStyle: {
//         borderRadius: 0,
//         shadowBlur: 6,
//         shadowColor: '#ED6A00' ,
//       },
//       labelLine: {
//         normal: {
//           length: 1,
//           lineStyle: {
//             type: 'dashed',
//           },
//         }
//       },
//       data: data
//     }]
//   }
//   return optionData
// }
function pieCharts(data, colorList) {
	const optionData = {
		tooltip: {
			trigger: "item",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
			formatter: "{b}: {c}%",
		},
		color: colorList,
		legend: {
			y: "bottom",
			padding: [0, 0, 10, 0],
			orient: "horizontal",
			itemWidth: 8,
			itemHeight: 8,
			itemGap: 2,
			textStyle: { fontSize: 11, color: "#bbb" },
		},
		series: [
			{
				name: "",
				type: "pie",
				radius: ["40%", "60%"],
				center: ["50%", "40%"],
				itemStyle: {
					normal: {
						label: {
							show: true,
							color: "#9EA8B2",
						},
						labelLine: {
							show: true,
						},
					},
					emphasis: {
						label: {
							show: true,
							// position: "center",
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
	return optionData;
}
// 规则环形图（故障等级占比）
function pieCharts1(data) {
	const optionData = {
		tooltip: {
			show: true,
			transitionDuration: 0,
		},
		color: ["#ED6A00", "#FFC029", "#262626 "],
		legend: {
			orient: "vertical",
			left: "75%", //图例距离左的距离
			y: "center", //图例上下居中
			icon: "circle",
			textStyle: {
				fontSize: 12,
			},
		},
		series: [
			{
				name: "故障等级",
				type: "pie",
				radius: ["30%", "70%"],
				center: ["42%", "53%"],
				// avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 0,
					borderColor: "#fff",
					borderWidth: 4,
					// shadowBlur: 10,
					// shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
				label: {
					formatter: "{a|{d}%}\n{b|{b}}",
					rich: {
						a: {
							color: "#262626",
							height: 20,
							fontWeight: "600",
							fontSize: 12,
						},
						b: {
							color: "#999999",
							fontSize: 10,
						},
					},
				},
				emphasis: {
					label: {
						show: true,
						fontSize: "40",
						fontWeight: "bold",
					},
				},
				labelLine: {
					normal: {
						// length: 5,
						lineStyle: {
							type: "dashed",
						},
					},
				},
				data: data,
			},
		],
	};
	return optionData;
}
// 横向柱状图(运营城市TOP5)
function cylindricalCharts(xdata, ydata) {
	const optionData = {
		tooltip: {
			show: true,
			transitionDuration: 0,
			// formatter:'{b}：{c}{a}'
		},
		grid: {
			x: 60,
			y: 0,
			x2: 20,
			y2: 25,
		},
		xAxis: {
			show: true,
			//设置title 刻度标签样式
			axisLabel: {
				show: true,
				color: "#666666",
				lineStyle: {
					show: false,
					type: "solid",
				},
			},
			// 设置底部轴线样式
			axisLine: {
				show: false,
			},
			//设置网格线颜色
			splitLine: {
				show: false,
			},
			//坐标轴刻度
			axisTick: {
				show: false,
			},
		},
		yAxis: [
			//左侧Y轴设置
			{
				//数据
				data: xdata,
				//显示
				show: true,
				//是否是反向坐标轴
				inverse: false,
				//轴线样式
				axisLine: {
					show: true,
					lineStyle: {
						color: "#DDDDDD",
						width: 1,
						type: "solid",
						dashOffset: 2,
					},
				},
				//设置网格线
				splitLine: {
					show: false,
				},
				//坐标轴刻度
				axisTick: {
					show: true,
					alignWithLabel: true,
				},
				//设置title 刻度标签样式
				axisLabel: {
					color: "#666666",
				},
			},
			//右侧侧Y轴设置
			{
				show: false,
				inverse: false,
				// data: valdata,
				axisLabel: {
					textStyle: {
						fontSize: 12,
						color: "red",
					},
				},
				axisLine: {
					show: false,
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
		],
		series: [
			{
				name: "运营城市车辆",
				type: "bar",
				yAxisIndex: 0,
				data: ydata,
				barWidth: 12,
				itemStyle: {
					normal: {
						barBorderRadius: [0, 30, 30, 0],
						color: "#ED6A00",
						shadowColor: "rgba(251,224,202)",
						shadowBlur: 5,
						shadowOffsetX: 0,
						shadowOffsetY: 5,
					},
				},
				label: {
					normal: {
						show: false,
						position: "inside",
						formatter: "{c}%",
					},
				},
			},
		],
	};
	return optionData;
}
// 竖向柱状图
function cylindricalCharts1(xdata, ydata) {
	const optionData = {
		tooltip: {
			trigger: "axis",
			transitionDuration: 0,
			// formatter: function (data) {
			//   // console.log(data,111);
			//   return data[0].name + '<br/>' + `<div style="font-size:12px;" class="badge-orange"><em></em>` + '充电次数' + `&nbsp;&nbsp;&nbsp;` + data[0].value + `</div>`; //将小数转化为百分数显示
			// },
			axisPointer: {
				type: "shadow",
			},
		},
		grid: {
			x: 60,
			y: 20,
			x2: 20,
			y2: 25,
		},
		xAxis: [
			{
				type: "category",
				data: xdata,
				axisTick: {
					alignWithLabel: true,
				},
			},
		],
		yAxis: [
			{
				type: "value",
				splitLine: {
					show: true,
					lineStyle: {
						color: "#EAEAEA ",
						width: 1,
						type: "dashed",
					},
				},
			},
		],
		series: [
			{
				name: "故障码",
				type: "bar",
				barWidth: 25,
				itemStyle: {
					normal: {
						barBorderRadius: [5, 5, 0, 0],
						color: "#ED6A00",
						shadowColor: "rgba(251,224,202)",
						shadowBlur: 5,
						shadowOffsetX: 5,
						shadowOffsetY: 0,
					},
				},
				data: ydata,
			},
		],
	};
	return optionData;
}

// function chinaCharts(data,data1,data2) {
//   const optionData = {
//     tooltip: { // 鼠标移到图里面的浮动提示框
//       show: true,
//       transitionDuration: 0,
//       formatter: function(params) {
//         console.log("params",params)
//         return params.data.name+'：'+params.data.value[2]
//       },
//       // trigger: 'item',
//       // backgroundColor: 'rgba(255,255,255,0.7)',
//       // borderColor: '#ccc',
//       // borderRadius: 4,
//       // borderWidth: 1,
//       // extraCssText: 'box-shadow:0 0 5px #ccc',
//       // textStyle: {
//       //   color: '#666'
//       // }
//     },
//     geo: { // 这个是重点 —— 这里设置为地图的阴影
//       map: 'china', // 表示中国地图
//       roam: false, // 禁止拖拽
//       silent: true, // 禁止hover效果
//       zoom: 1.2, // 地图比例
//       top: '11%',
//       center: [105.194115019531, 36.182111640625], // 地图中心位置， 此处的纬度与下面的center相差1度是形成阴影的距离，可自己随意调整
//       itemStyle: {
//         normal: {
//           borderColor: 'transparent',
//           areaColor: '#FFA256',
//         },
//         emphasis: {
//           show: false
//         }
//       },
//       regions: [{
//         name: "南海诸岛",
//         value: 0,
//         itemStyle: {
//           normal: {
//             opacity: 0,
//             label: {
//               show: false
//             }
//           }
//         }
//       }]
//     },
//     visualMap: {
//       // type:'piecewise' ,
//       //图例值控制
//       min: 0,
//       max: 100000,
//       calculable: true,
//       show: true,
//       left: 0,
//       // seriesIndex: 1,
//       bottom: 0,
//       itemWidth:10,
//       itemHeight:60,
//       color: [ "#ED1700","rgb(242,65,18)", "#FF790D","#FFBD0A"],
//       text: ["高", "低"],
//       // inRange:{
//       //   symbolSize: [10, 20]},
//       textStyle: {
//         color: "rgba(70,42,18)",
//         fontSize:10,
//         fontWeight:'bold'
//       },
//     },
//     series: [{
//         name: '门店区域分布数', // 浮动框的标题
//         type: 'map',
//         map: 'china',
//         top: '11%',
//         zoom: 1.2,
//         silent: true,
//         zlevel: 1, // 设置地图的层级，将该地图上移（类似z-index）
//         symbol: 'pin',
//         emphasis: { // 鼠标hover是否显示内容，可自己调节
//           label: {
//             show: false
//           },
//         },
//         label: { // 地图标注
//           normal: {
//             show: true, // 是否显示对应地名
//             textStyle: {
//               color: '#BFBFBF',
//               fontSize: 9,
//             }
//           }
//         },
//         center: [105.194115019531, 35.582111640625], // 设置地图中心
//         itemStyle: { // 地图的样式
//           normal: {
//             borderColor: '#786454',
//             borderWidth: 1,
//             areaColor: 'rgba(70,42,18)',
//             //  areaColor: 'rgba(70,42,18)',
//             //  borderColor: '#786454', // 省份边框颜色
//             //  borderWidth: 0.5, // 省份边框宽度
//             //   // shadowColor:"rgba(100,255,238,0.5)", // 省份边框阴影
//             // shadowBlur: 5, // 省份边框聚焦
//           },
//         },
//         // data: data  // 最后数据，下面是假数据
//       },
//       // 区域散点图
//       {
//         type: "scatter",
//         coordinateSystem: "geo",
//         symbolSize: 5,
//         label: {
//           normal: {
//             formatter: "{b}",
//             position: "right",
//             show: false,
//           },
//           emphasis: {
//             show: false,
//           },
//         },
//         hoverAnimation: false,
//         itemStyle: {
//           normal: {
//             color: "#fff",
//           },
//         },
//         zlevel: 1,
//         data: data,
//       },
//       //标记图形 大头针
//       {
//         type: "scatter",
//         coordinateSystem: "geo",
//         symbol: "pin", //标记的图形 图片参考：https://echarts.apache.org/zh/option.html#series-scatter.symbol
//         symbolSize: [40, 40],
//         label: {
//           normal: {
//             show: true,
//             textStyle: {
//               color: "#fff",
//               fontSize: 9,
//             },
//             formatter(value) {
//               return value.data.value[2];
//             },
//           },
//         },
//         hoverAnimation: true,
//         itemStyle: {
//           normal: {
//             color: "#D8BC37", //标志颜色
//             // shadowBlur: 10,
//             // shadowColor: '#333'
//           },
//         },
//         zlevel: 1,
//         data: data1,
//       },
//       {
//         type: "scatter",
//         coordinateSystem: "geo",
//         symbol: "pin", //标记的图形 图片参考：https://echarts.apache.org/zh/option.html#series-scatter.symbol
//         symbolSize(value, params) {
//           params.symbolSize = params.data.value[2].toString().length*10
//           // console.log(params,11111,params.symbolSize)
//           return params.symbolSize;
//         },
//         label: {
//           normal: {
//             show: true,
//             textStyle: {
//               color: "#fff",
//               fontSize: 9,
//             },
//             formatter(value) {
//               return value.data.value[2];
//             },
//           },
//         },
//         hoverAnimation: true,
//         itemStyle: {
//           normal: {
//             color: "#D8BC37", //标志颜色
//             // shadowBlur: 10,
//             // shadowColor: '#333'
//           },
//         },
//         zlevel: 1,
//         data: data2,
//       },
//     ],
//   };
//   return optionData
// }
// 堆叠柱状图
function barStackCharts(xdata, data, textColor) {
	const optionData = {
		grid: {
			left: "3%",
			right: "3%",
			top: "20%",
			bottom: "4%",
			containLabel: true,
		},
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
			// formatter(value) {
			// 	return value.data;
			// },
		},
		// tooltip: {
		// 	formatter: function() {
		// 		return “;
		// 	},
		// 	trigger: "item",
		// 	backgroundColor: "rgba(255,255,255,0.7)",
		// 	borderColor: "#ccc",
		// 	confine: true, //是否将 tooltip 框限制在图表的区域内
		// 	borderRadius: 4,
		// 	borderWidth: 1,
		// 	extraCssText: "box-shadow:0 0 5px #ccc",
		// 	textStyle: {
		// 		color: "#666",
		// 	},
		// },
		legend: {
			orient: "horizontal",
			itemWidth: 8,
			itemHeight: 8,
			itemGap: 2,
			textStyle: { fontSize: 11, color: "#bbb" },
			// data: ['一级故障', '二级故障', '三级故障', '四级故障']
		},
		xAxis: [
			{
				axisTick: {
					show: false,
				},
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
					interval: 0, // 横轴信息全部显示
					textStyle: {
						color: textColor,
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#E0E5E7",
						type: "dashed",
					},
				},
				type: "value",
				minInterval: 1,
				axisLine: {
					lineStyle: {
						color: "#E0E5E7",
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor,
					},
					formatter: "{value}",
				},
			},
		],
		series: data,
	};
	return optionData;
}
// 横向柱状图
function barHorizontalCharts(
	xdata,
	data,
	color,
	textColor,
	backgroundColor,
	colorList
) {
	const optionData = {
		grid: {
			left: "3%",
			right: "3%",
			top: "5%",
			bottom: "2%",
			containLabel: true,
		},
		color: [color],
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		xAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false,
					// lineStyle: {
					//   color: '#f2f2f2',
					//   type: 'dashed'
					// }
				},

				type: "value",
				splitNumber: 4,
				boundaryGap: true,
				axisLine: {
					lineStyle: {
						color: "#E0E5E7",
						type: "dashed",
					},
				},
				axisLabel: {
					show: false,
					interval: 0, // 横轴信息全部显示
					rotate: 30, // -15度角倾斜显示
					textStyle: {
						color: textColor,
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false,
					lineStyle: {
						color: "#f2f2f2",
						type: "dashed",
					},
				},
				type: "category",
				data: xdata,
				axisLine: {
					show: false,
					// lineStyle: {
					//   color: '#ccc'
					// }
				},
				axisLabel: {
					interval: 0,
					inside: true,
					color: "#929292",
					margin: 0,
					padding: [0, 0, 5, 0],
					align: "left",
					verticalAlign: "bottom",
					formatter: function(value, index) {
						return "{title|" + value + "}";
					},
					rich: {
						title: {
							width: 50,
							fontSize: 12,
						},
					},
				},
			},
			{
				triggerEvent: true,
				show: true,
				inverse: true,
				data: xdata,
				axisLine: {
					show: false,
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					margin: 0,
					interval: 0,
					inside: true,
					padding: [0, 0, 5, 0],
					color: textColor,
					fontSize: 12,
					align: "right",
					verticalAlign: "bottom",
					formatter: function(value, index) {
						return data[index];
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "bar",
				barWidth: 7, // 柱图宽度
				backgroundStyle: {
					color: backgroundColor,
					barBorderRadius: [0, 34, 34, 0], // 圆角
				},
				itemStyle: {
					barBorderRadius: [0, 34, 34, 0], // 圆角
					borderWidth: 1,
					color: colorList,
				},
				showBackground: true,
				data: data,
			},
		],
	};
	return optionData;
}
// 竖向柱状图
function barCharts(xdata, data, color, textColor, colorList) {
	const optionData = {
		grid: {
			left: "3%",
			right: "10%",
			top: "10%",
			bottom: "4%",
			containLabel: true,
		},
		color: [color],
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		xAxis: [
			{
				axisTick: {
					show: false,
				},
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
					formatter: function(value) {
						var ret = ""; // 拼接加\n返回的类目项
						var maxLength = 5; // 每项显示文字个数
						var valLength = value.length; // X轴类目项的文字个数
						var rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
						if (rowN > 1) {
							// 如果类目项的文字大于3,
							for (var i = 0; i < rowN; i++) {
								var temp = ""; // 每次截取的字符串
								var start = i * maxLength; // 开始截取的位置
								var end = start + maxLength; // 结束截取的位置
								// 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
								temp = value.substring(start, end) + "\n";
								ret += temp; // 凭借最终的字符串
							}
							return ret;
						} else {
							return value;
						}
					},
					interval: 0, // 横轴信息全部显示
					// rotate: 25, // 25度角倾斜显示
					show: true,
					textStyle: {
						color: textColor,
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#E0E5E7",
						type: "dashed",
					},
				},
				type: "value",
				minInterval: 1,
				axisLine: {
					lineStyle: {
						color: "#E0E5E7",
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor,
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "bar",
				barWidth: 8, // 柱图宽度
				itemStyle: {
					normal: {
						areaStyle: { type: "default" },
						lineStyle: {
							color: "#49a9ee",
							width: 2,
						},
						barBorderRadius: [34, 34, 34, 34], // 圆角
						borderWidth: 1,
						color: colorList,
					},
				},
				data: data,
			},
		],
	};
	return optionData;
}
//充电热力图
function chargeChinaCharts(color, datas) {
	const optionData = {
		visualMap: {
			show: false,
			min: 0,
			max: 15000,
			splitNumber: 5,
			inRange: {
				// color: ['#d94e5d','#eac736','#50a3ba'].reverse()
				color: ["#d94e5d", "#eac736", "#50a3ba"],
			},
		},
		// 新建一个地理坐标系 geo ，
		geo: {
			top: 0,
			bottom: 10,
			map: "china",
			label: {
				emphasis: {
					show: false,
				},
			},
			silent: true,
			itemStyle: {
				normal: {
					// areaColor: color,
					areaColor: "transparent",
					// areaColor:'rgb(56,179,255)',
					borderWidth: "1",
					borderColor: "#00454d",
				},
			},
		},
		series: [
			{
				type: "heatmap",
				coordinateSystem: "geo",
				pointSize: 10,
				blurSize: 20,
				data: datas,
			},
		],
	};
	return optionData;
}

//充电热力图
function loadMap(outdata, visualMapColor,textColor, areaColor,util='人') {
	const optionData = {
		tooltip: {
			show: true,
			formatter: function(params) {
				if (params.value) {
					return (
						"&nbsp;&nbsp;" +
						params.name +
						"&nbsp;&nbsp;&nbsp;" +
						params.value +
						util+"&nbsp;&nbsp;"
					);
				} else {
					return (
						"&nbsp;&nbsp;" +
						params.name +
						"&nbsp;&nbsp;&nbsp;" +
						0 +
						util+"&nbsp;&nbsp;"
					);
				}
			},
		},
		visualMap: {
			show: false,
			type: "piecewise",
			left: "5",
			bottom: "15",
			itemWidth: 10,
			itemHeight: 10,
			textStyle: {
				color: textColor,
				fontSize: 12,
			},
			min: 0,
			max: 1000,
			splitNumber: 5,
			pieces: [
				{
					min: 1000,
					label: ">1000",
				},
				{
					max: 1000,
					min: 900,
					label: "900-1000",
				},
				{
					max: 900,
					min: 800,
					label: "800-900",
				},
				{
					max: 800,
					min: 700,
					label: "700-800",
				},
				{
					max: 700,
					min: 600,
					label: "600-700",
				},
				{
					max: 600,
					min: 500,
					label: "500-600",
				},
				{
					max: 500,
					min: 400,
					label: "400-500",
				},
				{
					max: 400,
					min: 300,
					label: "300-400",
				},
				{
					max: 300,
					min: 200,
					label: "200-300",
				},
				{
					max: 200,
					min: 100,
					label: "100-200",
				},
				{
					max: 100,
					min: 0,
					label: "<100",
				},
				{
					value: 0,
					label: "无数据",
				},
			],
			inRange: {
				color: visualMapColor,
			},
			outOfRange: {
				color: ["#999999"],
			},
		},
		geo: {
			map: "china",
			show: true,
			roam: false,
			zoom:1.2,
			label: {
				emphasis: {
					show: false,
				},
			},
			itemStyle: {
				normal: {
					// borderColor: "rgba(0,63,140,0.2)",
					shadowColor: "rgba(0,63,140,0.2)",
					shadowOffsetY: 20,
					shadowBlur: 30,
				},
			}
		},
		series: [
			{
				type: "map",
				map: "china",
				aspectScale: 0.75,
				zoom:1.2,
				label: {
					normal: {
						show: true,
						textStyle: {
							color: "#fff",
						},
					},
					emphasis: {
						show: true,
						textStyle: {
							color: "#fff",
						},
					},
				},
				itemStyle: {
					normal: {
						areaColor: "#D9DCDF",
						borderColor: "#fff",
						borderWidth: 1,
					},
					emphasis: {
						areaColor: areaColor,
					},
				},
				data: outdata,
			},
		],
	};
	return optionData;
}
// 雷达图
function radarCharts(indicator, color, data, textColor) {
	const optionData = {
		grid: {
			position: "bottom",
		},
		triggerEvent: true,
		tooltip: {
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		textStyle: {
			color: textColor,
		},
		radar: {
			axisLine: {
				lineStyle: {
					opacity: 0.4,
					color: "#DDE2EA", // 分割线
				},
			},
			splitArea: {
				show: false,
			},
			splitLine: {
				show: true,
				lineStyle: {
					opacity: 0.4,
					color: "#DDE2EA", // 设置网格的颜色
				},
			},
			nameGap: 5, // 图中字距离图的距离
			indicator: indicator,
			// radius: 60,
		},
		series: [
			{
				name: "充电情况分布",
				type: "radar",
				symbol: "none",
				// 边框
				itemStyle: {
					normal: {
						color: color,
						lineStyle: {
							color: color,
						},
					},
				},
				// 区域
				areaStyle: {
					normal: {
						opacity: 0.2,
						color: color, // 选择区域颜色
					},
				},
				data: data,
			},
		],
	};
	return optionData;
}
// 中国地图
function chinaCharts(color, data, flagColor) {
	const optionData = {
		// 新建一个地理坐标系 geo ，
		layoutCenter: ["50%", "49%"], //位置
		layoutSize: "125%", //大小
		geo: {
			map: "china", // 地图类型为中国地图,要是世界那就是world,要是省市区：例如beijing、shanghai
			itemStyle: {
				// 定义样式
				normal: {
					// 普通状态下的样式
					// areaColor: color,
					areaColor: "#d9dcdf",
					// areaColor: {
					// 	type: "linear-gradient",
					// 	x: 0,
					// 	y: 600,
					// 	x2: 0,
					// 	y2: 0,
					// 	colorStops: [
					// 		{
					// 			offset: 0.5,
					// 			color: "RGBA(32, 41, 52, 1)", // 0% 处的颜色
					// 		},
					// 		{
					// 			offset: 1,
					// 			color: "rgba(170, 174, 189, 1)", // 100% 处的颜色
					// 		},
					// 	],
					// 	global: true, // 缺省为 false
					// },
					borderColor: "#FFFFFF",
				},
				emphasis: {
					// 高亮状态下的样式
					// areaColor: "#838A91",
					// areaColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
					// 	{ offset: 0, color: color[0] },
					// 	{ offset: 1, color: color[1] },
					// ]),
					areaColor: color,
				},
			},
			label: {
				show: true,
				color: "#777777",
				emphasis: {
					show: true,
					color: "#FFFFFF",
				},
			},
			tooltip: {
				formatter: function(params) {
					let count = 0;
					if (data) {
						data.forEach((i) => {
							if (i.name == params.name) {
								count = i.cunt;
							}
						});
					}
					return params.name + " : " + count;
				},
				trigger: "item",
				backgroundColor: "rgba(255,255,255,0.7)",
				borderColor: "#ccc",
				borderRadius: 4,
				borderWidth: 1,
				extraCssText: "box-shadow:0 0 5px #ccc",
				textStyle: {
					color: "#666",
				},
				confine: true, //是否将 tooltip 框限制在图表的区域内
			},
		},
		// 标志颜色
		color: flagColor,
		// 新建散点图series
		series: [
			{
				name: "", // series名称
				type: "effectScatter", // 为散点类型
				coordinateSystem: "geo", // series坐标系类型
				data: data,
				// symbol: 'pin',
				symbolSize: 7,
				rippleEffect: {
					brushType: "stroke",
				},
			},
		],
		tooltip: {
			formatter: function(params) {
				return params.name + " : " + params.data.cunt;
			},
			trigger: "item",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
	};
	return optionData;
}

// 远控分析
// 横向柱状图
function horizontalHistogramCharts(
	xdata,
	data,
	color,
	textColor,
	backgroundColor,
	colorList
) {
	let labelData= JSON.parse(JSON.stringify(data))
	// let bgData = []
	// bgData = 	Array(data.length).fill(parseFloat((Math.max(...data) * 1.2).toFixed(2)));
	// console.log(data,"bgData",bgData)
	const optionData = {
		grid: {
			left: "5%",
			right: "5%",
			top: "1%",
			bottom: "3%",
			containLabel: true,
		},
		color: [color],
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			confine:true,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		xAxis: [
			{
				// minInterval: 1,
				axisTick: {
					show: true,//x轴间隔线
					lineStyle: {
						color: "#E0E5E7",
						type: "solid",
					},
				},	
				splitLine: {
					show: false,
					// lineStyle: {
					//   color: '#f2f2f2',
					//   type: 'dashed'
					// }
				},
				type: "value",
				splitNumber: 4,
				boundaryGap: true,
				axisLine: {			
          show: true ,
					lineStyle: {
						color: "#E0E5E7",
						type: "solid",
					},
				},
				axisLabel: {
					show: true,
					interval: 0, // 横轴信息全部显示
					// rotate: 30, // -15度角倾斜显示
					textStyle: {
						color: textColor[0],
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false,
					lineStyle: {
						color: "#f2f2f2",
						type: "dashed",
					},
				},
				type: "category",
				data: xdata,
				axisLine: {
					show: false,
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor[1],
					},
				},
			},
			{
				type: 'category',
				inverse: true,
				axisTick: 'none',
				axisLine: 'none',
				show: true,
				axisLabel: {
						textStyle: {
								color: textColor[1],
								fontSize: '12',
						},
				},
				data:labelData.reverse()
			},
		],
		series: [
			{
				name: "平均指令时长",
				zlevel: 1,
				type: "bar",
				barWidth: "30%", // 柱子宽度
				showBackground: true,//显示背景
				backgroundStyle: {
					color:'#F2F3F5',
					borderRadius: 20, 
				},
				itemStyle: {
					barBorderRadius: 20, // 圆角（左上、右上、右下、左下）
					borderWidth: 1,
					color: function (params) {
						let color
						if(params.dataIndex % 2 == 0){
              color = colorList[0]
						}else{
              color = colorList[1]
						}
						return color
					}
					// color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
					// 	{ offset: 0, color: colorList[0] },
					// 	{ offset: 1, color: colorList[1] },
					// ]),
				},
				data: data,
			},
		// 	{
		// 		name: '背景',
		// 		type: 'bar',
		// 		barWidth: "50%", // 柱子宽度
		// 		barGap: '-100%',
		// 		data: bgData,
		// 		itemStyle: {
		// 				normal: {
		// 						color: '#F2F3F5',
		// 						barBorderRadius:  [20, 20, 20, 20],
		// 				},
		// 		},
		// },
		],
	};
	return optionData;
}
// 饼图
function circularPieCharts(dataList1, dataList2) {
	const optionData = {
		// backgroundColor: '#000C1C',
		tooltip: {
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",	
      confine:true,
			textStyle: {
				color: "#666",
			},
			formatter: function(params) {
				return (
					'<span style="display:inline-block; width:8px; height:8px; margin-right:5px; border-radius:50px; background-color:'+params.color+'"></span>'+
					params.name +
					"：" +
					params.value
				);
				// console.log(params,123)
				// return params.name + "：" + params.value;
			}
		},
		series: [
			{
				name: "成功/失败次数",
				type: "pie",
				radius: [0, "40%"],
				// legendHoverLink: false,
				hoverAnimation: false,
				selectedOffset:0,
				label: {
					// formatter:'{c}',
					formatter:function(params){
						// console.log(params,"params1111111111")
						if(params.color == "#599AFF"||params.color =="#00B074"||params.color =="#00ACFF"){
						 return	`{a|${params.value}}`
						}else{
							return	`{b|${params.value}}`
						}
					},
					position: "inner",
					fontSize: 11,
					rich: {
						a: { color: '#fff' },
						b: { color: '#595757' },
					},
				},
				itemStyle: {
					borderColor: '#fff',
					borderWidth: 1,
					// shadowBlur: 5,
					// shadowColor: "rgba(0, 0, 0, 0.5)",
				},
				selectedMode: "single",
				data: dataList1,
			},
			{
				name: "开启/关闭次数",
				type: "pie",
				radius: ["60%", "75%"],
				// legendHoverLink: false,
				hoverAnimation: false,
				itemStyle: {
					borderColor: '#fff',
					borderWidth: 1,
					// shadowBlur: 5,
					// shadowColor: "rgba(0, 0, 0, 0.5)",
				},
				label: {
					normal: {
						// formatter: function(params) {
						// 	if (params.value != 0)
						// 			return params.data.type + "\n" + params.value + '人';
						// 	else
						// 			return '';
						// },
						show: false,
						// fontSize: 11
					},
				},
				data: dataList2,
			},
		],
	};
	return optionData;
}

// 中间地图
function mapCharts(data) {
	let optionData = {
		geo: [
			{
				type: "map",
				map: "china",
				zlevel: -1,
				zoom: 1.3,
				layoutCenter: ["50%", "48%"],
				layoutSize: "70%",
				roam: false,
				silent: true,
				label: {
					normal: {
						show: true, //文字颜色
						textStyle: {
							color: "RGBA(138, 170, 195, 1)",
						},
					},
					emphasis: {
						show: false,
					},
				},
				itemStyle: {
					normal: {
						borderColor: "rgba(35, 161, 184,0.5)",
						areaColor: "#003b56",
					},
				},
				regions: [
					{
						name: "南海诸岛",
						itemStyle: {
							normal: {
								opacity: 0,
								label: {
									show: false,
								},
							},
						},
					},
				],
			},
			{
				type: "map",
				map: "china",
				zlevel: -2,
				zoom: 1.3,
				layoutCenter: ["50%", "48%"],
				layoutSize: "70%",
				roam: false,
				silent: true,
				itemStyle: {
					normal: {
						borderColor: "#00cbc1",
						borderWidth: 3,
						areaColor: "#003b56",
					},
				},
				regions: [
					{
						name: "南海诸岛",
						itemStyle: {
							normal: {
								opacity: 0,
								label: {
									show: false,
								},
							},
						},
					},
				],
			},
			{
				type: "map",
				map: "china",
				zlevel: -3,
				zoom: 1.3,
				layoutCenter: ["50%", "50.5%"],
				layoutSize: "70%",
				roam: false,
				silent: true,
				itemStyle: {
					normal: {
						borderColor: "rgba(7, 65, 117,0.5)",
						areaColor: "#006d9d",
					},
				},
			},
		],
		series: [
			{
				symbolSize: 5,
				label: {
					normal: {
						formatter: "{b}",
						position: "right",
						show: false,
					},
					emphasis: {
						show: false,
					},
				},
				itemStyle: {
					normal: {
						color: "#fff",
					},
				},
				name: "light",
				type: "scatter",
				coordinateSystem: "geo",
				data: data,
			},
			{
				name: "Top 5",
				type: "effectScatter",
				coordinateSystem: "geo",
				symbolSize: 10,
				itemStyle: {
					normal: {
						color: "#EFFD09", //标志颜色
					},
				},
				label: {
					normal: {
						show: true,
						position: "bottom",
						formatter: "{b}",
						color: "#fff",
					},
				},
				data: data,
				showEffectOn: "render",
				rippleEffect: {
					brushType: "stroke",
				},
				hoverAnimation: true,
				zlevel: 1,
			},
			// 线 和 点
			{
				type: "lines",
				zlevel: 1, //设置这个才会有轨迹线的小尾巴
				polyline: true,
				effect: {
					show: true,
					period: 5,
					trailLength: 0,
					color: "#EFFD09", //流动点颜色
					symbol: "arrow",
					symbolSize: 8,
				},
				lineStyle: {
					normal: {
						color: "#FFFA17", //线条颜色
						width: 2,
						curveness: 0.2,
						shadowColor: "#FFFA17",
					},
				},
				data: [
					{
						fromName: "湖北",
						toName: "北京",
						coords: [
							[112.2363, 31.1572],
							[116.4551, 40.2539],
						],
					},
					{
						fromName: "湖北",
						toName: "海南",
						coords: [
							[112.2363, 31.1572],
							[109.9512, 19.2041],
						],
					},
					{
						fromName: "浙江",
						toName: "湖北",
						coords: [
							[120.498, 29.0918],
							[112.2363, 31.1572],
						],
					},
					{
						fromName: "重庆",
						toName: "海南",
						coords: [
							[107.7539, 30.1904],
							[109.9512, 19.2041],
						],
					},
					{
						fromName: "海南",
						toName: "北京",
						coords: [
							[109.9512, 19.2041],
							[116.4551, 40.2539],
						],
					},
					{
						fromName: "北京",
						toName: "重庆",
						coords: [
							[116.4551, 40.2539],
							[107.7539, 30.1904],
						],
					},
					{
						fromName: "湖北",
						toName: "重庆",
						coords: [
							[112.2363, 31.1572],
							[107.7539, 30.1904],
						],
					},
					{
						fromName: "台湾",
						toName: "北京",
						coords: [
							[121.0254, 23.5986],
							[116.4551, 40.2539],
						],
					},
				],
			},
		],
	};
	return optionData;
}

// 远程控制 环形图
function carPieCharts(data, colorList, textColor, borderColor, showLegend) {
	var rich = {
		name: {
			color: textColor,
			fontSize: 13,
			fontWeight: "400",
			fontFamily: "Microsoft YaHei",
		},
	};
	// data.map(function(item, index) {
	// 	rich["p" + index] = {
	// 		// color: item.numberColor,
	// 		fontSize: 13,
	// 		fontWeight: "400",
	// 		fontFamily: "Microsoft YaHei",
	// 	};
	// });
	const optionData = {
		tooltip: {
			trigger: "item",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			confine:true,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
			// formatter: "{b}: {c}%",
		},
		color: colorList,
		animationDuration: 2000,
		legend: {
			show: showLegend ? false : true,
			y: "bottom",
			// padding: [0, 0, 5, 0],
			orient: "horizontal",
			itemWidth: 12,
			itemHeight: 12,
			itemGap: 20,
			inactiveColor:'#eee',
			inactiveBorderColor:'#fff',
			textStyle: { fontSize: 13, color: textColor },
		},
		series: [
			{
				name: "",
				type: "pie",
				radius: ["40%", "60%"],
				center: ["50%", "40%"],
				labelLine: {
					length: 5,
					length2: 10,
				},
				itemStyle: {
					normal: {
						borderColor: borderColor,
						borderWidth: 2,
					},
				},
				label: {
					formatter: function(params) {
						return `{name|${params.name}} {name|${params.value}}`;
						// return `{name|${params.name}} {p${params.dataIndex}|${params.value}}`;
					},
					rich: rich,
				},
				data: data,
			},
		],
	};
	return optionData;
}

// 远程控制 竖向柱状图
function carBarCharts(xdata, data, color, textColor, barColor, lineColor) {
	const optionData = {
		grid: {
			left: "2%",
			right: "2%",
			top: "15%",
			bottom: "5%",
			containLabel: true,
		},
		animationDuration: 2000,
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			confine:true,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		xAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: { show: false },
				type: "category",
				boundaryGap: true,
				data: xdata,
				axisLine: {
					lineStyle: {
						color: lineColor,
						type: "dashed",
					},
				},
				axisLabel: {
					// interval: 0, // 横轴信息全部显示
					// rotate: 10, // -15度角倾斜显示
					show: true,
					textStyle: {
						color: textColor[0],
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: lineColor,
						type: "dashed",
					},
				},
				type: "value",
				axisLine: {
					lineStyle: {
						color: lineColor,
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor[1],
					},
				},
			},
		],
		series: [
			{
				name: "",
				type: "bar",
				barWidth: 14, // 柱图宽度
				itemStyle: {
					normal: {
						label: {
							show: true,
							position: "top",
							textStyle: {
								color: color,
								fontSize: 14,
								fontWeight: "400",
							},
						},
						areaStyle: { type: "default" },
						lineStyle: {
							color: "#49a9ee",
							width: 2,
						},
						barBorderRadius: [34, 34, 34, 34], // 圆角
						borderWidth: 1,
						color:barColor
						// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 	{ offset: 0, color: colorList[1] },
						// 	{ offset: 1, color: colorList[0] },
						// ]),
					},
				},
				data: data,
			},
		],
	};
	return optionData;
}

// 远程控制 双竖向柱状图
function carBarsCharts(
	xdata,
	data,
	data1,
	textColor,
	colorList,
	lineColor
) {
	const optionData = {
		grid: {
			left: "2%",
			right: "2%",
			top: "15%",
			bottom: "5%",
			containLabel: true,
		},
		legend: {
			top: "0",
			right: "2%",
			// padding: [0, 0, 5, 0],
			orient: "horizontal",
			inactiveColor:'#eee',
			itemWidth: 12,
			itemHeight: 12,
			itemGap: 20,
			textStyle: { fontSize: 13, color: textColor },
		},
		animationDuration: 2000,
		tooltip: {
			trigger: "axis",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			confine:true,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#666",
			},
		},
		xAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: { show: false },
				type: "category",
				boundaryGap: true,
				data: xdata,
				axisLine: {
					lineStyle: {
						color: lineColor,
						type: "dashed",
					},
				},
				axisLabel: {
					// interval: 0, // 横轴信息全部显示
					// rotate: 10, // -15度角倾斜显示
					show: true,
					textStyle: {
						color: textColor[0],
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: lineColor,
						type: "dashed",
					},
				},
				type: "value",
				axisLine: {
					lineStyle: {
						color: lineColor,
					},
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor[1],
					},
				},
			},
		],
		series: [
			{
				name: "急加速次数",
				type: "bar",
				barWidth: 14, // 柱图宽度
				itemStyle: {
					normal: {
						// label:{
						//  show:true,
						//  position:'top',
						//  textStyle:{
						// 	color:color,
						// 	fontSize:14,
						// 	fontWeight:'400'
						//  }
						// },
						areaStyle: { type: "default" },
						lineStyle: {
							color: "#49a9ee",
							width: 2,
						},
						barBorderRadius: [34, 34, 34, 34], // 圆角
						borderWidth: 1,
						color:colorList[0]
						// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 	{ offset: 0, color: colorList[1] },
						// 	{ offset: 1, color: colorList[0] },
						// ]),
					},
				},
				data: data,
			},
			{
				name: "急减速次数",
				type: "bar",
				barWidth: 14, // 柱图宽度
				itemStyle: {
					normal: {
						// label:{
						//  show:true,
						//  position:'top',
						//  textStyle:{
						// 	color:color,
						// 	fontSize:14,
						// 	fontWeight:'400'
						//  }
						// },
						areaStyle: { type: "default" },
						lineStyle: {
							color: "#49a9ee",
							width: 2,
						},
						barBorderRadius: [34, 34, 34, 34], // 圆角
						borderWidth: 1,
						color:colorList[1]
						// color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 	{ offset: 0, color: colorList1[1] },
						// 	{ offset: 1, color: colorList1[0] },
						// ]),
					},
				},
				data: data1,
			},
		],
	};
	return optionData;
}

//地图
//月报第五个页面中国地图
function ChineseCharts(data) {
	// var data = ["湖北", "河北","新疆","陕西","aoteman"];
	console.log(data);
	var geoCoordMap = {
		江苏: [118.8062, 31.9208],
		黑龙江: [127.9688, 45.368],
		内蒙古: [110.3467, 41.4899],
		吉林: [125.8154, 44.2584],
		北京市: [116.4551, 40.2539],
		辽宁: [123.1238, 42.1216],
		河北: [114.4995, 38.1006],
		天津: [117.4219, 39.4189],
		山西: [112.3352, 37.9413],
		陕西: [109.1162, 34.2004],
		甘肃: [103.5901, 36.3043],
		宁夏: [106.3586, 38.1775],
		青海: [101.4038, 36.8207],
		新疆: [87.9236, 43.5883],
		四川: [103.9526, 30.7617],
		重庆: [108.384366, 30.439702],
		山东: [117.1582, 36.8701],
		河南: [113.4668, 34.6234],
		安徽: [117.29, 32.0581],
		湖北: [114.3896, 30.6628],
		浙江: [119.5313, 29.8773],
		福建: [119.4543, 25.9222],
		江西: [116.0046, 28.6633],
		湖南: [113.0823, 28.2568],
		贵州: [106.6992, 26.7682],
		云南: [102.9199, 25.4663],
		广东: [113.12244, 23.009505],
		广西: [108.479, 23.1152],
		海南: [110.3893, 19.8516],
		上海: [121.4648, 31.2891],
		西藏: [91.11, 29.97],
	};
	//根据data拿到geoCoordMap的坐标
	var points = [{ coord: [116.4551, 40.2539], name: "北京" }];
	for (var i = 0; i < data.length; i++) {
		var geoCoord = geoCoordMap[data[i]];
		if (geoCoord) {
			points.push({
				name: data[i],
				coord: geoCoord,
			});
		}
	}
	// console.log(points, "points");

	// {
	// 	coords: [
	// 		[118.8062, 31.9208],
	// 		[119.4543, 25.9222],
	// 	],
	// },

	var coordsData = [];
	points.map(function(item) {
		coordsData.push({
			coords: [
				points[0].coord,
				item.coord,
			],
		});
	});

	let optionData = {
		geo: [
			{
				type: "map",
				map: "china",
				zlevel: -1,
				zoom: 1.1,
				layoutCenter: ["50%", "46%"],
				layoutSize: "90%",
				roam: false,
				silent: true,
				label: {
					normal: {
						show: true, //文字颜色
						textStyle: {
							color: "RGBA(138, 170, 195, 1)",
						},
					},
					emphasis: {
						show: false,
					},
				},
				itemStyle: {
					normal: {
						borderColor: "rgba(35, 161, 184,0.5)",
						areaColor: "#003b56",
					},
				},
				regions: [
					{
						name: "南海诸岛",
						itemStyle: {
							normal: {
								opacity: 0,
								label: {
									show: false,
								},
							},
						},
					},
				],
			},
			{
				type: "map",
				map: "china",
				zlevel: -2,
				zoom: 1.1,
				layoutCenter: ["50%", "46%"],
				layoutSize: "90%",
				roam: false,
				silent: true,
				itemStyle: {
					normal: {
						borderColor: "#00cbc1",
						borderWidth: 3,
						areaColor: "#003b56",
					},
				},
				regions: [
					{
						name: "南海诸岛",
						itemStyle: {
							normal: {
								opacity: 0,
								label: {
									show: false,
								},
							},
						},
					},
				],
			},
			{
				type: "map",
				map: "china",
				zlevel: -3,
				zoom: 1.1,
				layoutCenter: ["50%", "48.5%"],
				layoutSize: "90%",
				roam: false,
				silent: true,
				itemStyle: {
					normal: {
						borderColor: "rgba(7, 65, 117,0.5)",
						areaColor: "#006d9d",
					},
				},
			},
		],
		series: [
			{
				name: "热力图",
				type: "scatter",
				coordinateSystem: "geo",
				symbolSize: 7,
				markPoint: {
					symbol: "image://" + require("../assets/images/icon_che.png"), // 自定义图片路径
					symbolSize: [34, 55], // 图片大小
					label: {
						show: false,
					},
					symbolOffset: [0, -15],
					// coord数组存放地址坐标
					data: points,
				},
			},
			{
				type: "lines",
				// symbolSize: 30,
				zlevel: 2,
				effect: {
					show: true,
					period: 4, //箭头指向速度，值越小速度越快
					trailLength: 0.3, //特效尾迹长度[0,1]值越大，尾迹越长重
					symbol: "circle", //箭头图标
					symbolSize: 3, //图标大小
				},
				lineStyle: {
					normal: {
						width: 1, //线条宽度
						color: "rgba(249, 252, 62, 1)",
						opacity: 0.1, //尾迹线条透明度
						curveness: 0.3, //尾迹线条曲直度
					},
				},
				data: coordsData,
			},
		],
	};
	return optionData;
}


export {
	lineCharts,
	lineCharts2,
	cylindricalCharts,
	cylindricalCharts1,
	pieCharts,
	pieCharts1,
	chinaCharts,
	barStackCharts,
	barHorizontalCharts,
	chargeChinaCharts,
	loadMap,
	radarCharts,
	barCharts,
	horizontalHistogramCharts,
	circularPieCharts,
	mapCharts,
	carPieCharts,
	carBarCharts,
	carBarsCharts,
	ChineseCharts,
};
