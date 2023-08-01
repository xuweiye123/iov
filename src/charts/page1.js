import * as echarts from "echarts";

function lineCharts(legendData, legendColors, xdata, ydata, textColor) {
	let shadowColor = ["#00F7FF", "#007EFF"];
	const optionData = {
		backgroundColor: "transparent",
		animationDuration: 2000,
		grid: {
			top: "15%",
			left: "0",
			right: "2%",
			bottom: "2%",
			containLabel: true,
		},
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "line",
				lineStyle: {
					color: textColor,
				},
			},
			backgroundColor: "transparent",
			borderColor: "transparent",
			padding: 0,
			formatter: function (params) {
				let colors = shadowColor;
				let returnData =
					'<div style="background: rgba(0,90,139,0.8);border: 1px solid #32AFAA;box-shadow: 0px 2px 1px 0px rgba(0,39,70,0.8);border-radius: 4px;padding:10px;">';
				returnData +=
					'<span style="font-family: MicrosoftYaHei; font-size: 14px; color: #fff;font-weight: bold">' +
					params[0].axisValue +
					"</span><br/>";
				for (let i = 0; i < params.length; i++) {
					returnData +=
						'<span style="display:inline-block; width:10px; height:8px; margin-right:5px; border-radius:1px; background-color:' +
						colors[i] +
						'"></span>';
					returnData +=
						'<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
						'">' +
						params[i].seriesName +
						'：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
						'">' +
						params[i].value +
						'</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
						'">辆</span><br/>';
				}
				returnData += "</div>";
				return returnData;
			},
		},
		xAxis: {
			type: "category",
			axisLine: {
				show: true,
				lineStyle: {
					color: "#112B5F",
				},
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: textColor,
			},
			axisTick: {
				show: false,
				alignWithLabel: true,
			},
			boundaryGap: false,
			data: xdata,
		},
		yAxis: {
			type: "value",
			name: "",
			nameTextStyle: {
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: textColor,
			},
			min: 0,
			axisLine: {
				show: false,
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: "#0D3A52",
					type: "dashed",
				},
			},
			axisLabel: {
				show: true,
				margin: 20,
				textStyle: {
					fontFamily: "MicrosoftYaHei",
					fontSize: 12,
					color: textColor,
				},
			},
			axisTick: {
				show: false,
			},
		},
		series: [{
				name: legendData[0],
				type: "line",
				showSymbol: false,
				smooth: true, //true曲线; false折线
				symbolSize: 7,
				lineStyle: {
					shadowColor: shadowColor[0],
					shadowBlur: 5,
					color: shadowColor[0],
				},
				label: {
					show: false,
				},
				itemStyle: {
					color: "#fff",
					borderColor: shadowColor[0],
					borderWidth: 3,
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[{
									offset: 0,
									color: legendColors[0],
								},
								{
									offset: 1,
									color: "rgba(233, 195, 116, 0)",
								},
							],
							false
						),
					},
				},
				data: ydata[0],
			},
			{
				name: legendData[1],
				type: "line",
				showSymbol: false,
				smooth: true, //true曲线; false折线
				symbolSize: 7,
				lineStyle: {
					color: shadowColor[1],
					shadowColor: shadowColor[1],
					shadowBlur: 5,
				},
				label: {
					show: false,
				},
				itemStyle: {
					color: "#fff",
					borderColor: shadowColor[1],
					borderWidth: 3,
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[{
									offset: 0,
									color: legendColors[1],
								},
								{
									offset: 1,
									color: "rgba(233, 195, 116, 0)",
								},
							],
							false
						),
					},
				},
				data: ydata[1],
			},
		],
	};
	return optionData;
}

function hengZhuCharts(xdata, ydata, list) {
	let data = ydata;
	let className = xdata;
	let pdata = ydata.map((i) => ({
		value: i,
		symbolPosition: "end"
	}));
	let defaultData = [];
	list.forEach((i) => {
		defaultData.push(100);
	});
	let optionData = {
		grid: {
			left: "18%",
			right: "18%",
			bottom: "5%",
			top: "5%",
		},
		animationDuration: 2000,
		// backgroundColor: "#090D4E",
		xAxis: {
			show: false,
			type: "value",
		},
		yAxis: [{
				type: "category",
				inverse: true,
				axisLabel: {
					show: true,
					margin: 30,
					align: "center",
					textStyle: {
						color: "#fff",
					},
				},
				splitLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				data: className,
			},
			{
				type: "category",
				inverse: true,
				axisTick: "none",
				axisLine: "none",
				show: true,
				axisLabel: {
					textStyle: {
						color: "#009CFF",
						fontSize: "12",
					},
					formatter: function (value, index) {
						return `${list[index].onlineCount}`;
					},
				},
				data: data,
			},
		],
		series: [{
				name: "占比",
				type: "bar",
				zlevel: 1,
				itemStyle: {
					normal: {
						barBorderRadius: 30,
						color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
								offset: 0,
								color: "#009CFF",
							},
							{
								offset: 1,
								color: "#00F7FF",
							},
						]),
					},
				},
				barWidth: 4,
				data: data,
			},
			{
				name: "背景",
				type: "bar",
				barWidth: 4,
				barGap: "-100%",
				data: defaultData,
				itemStyle: {
					normal: {
						color: "#1C3657",
						barBorderRadius: 30,
					},
				},
			},
			// 条形图尾部方块
			{
				type: "pictorialBar",
				symbol: "rect",
				symbolSize: [2, 10],
				symbolOffset: [0, 0],
				zlevel: 2,
				itemStyle: {
					normal: {
						color: "#FFFFFF",
						shadowBlur: 5,
						shadowOffsetY: 2,
						shadowColor: "rgba(0, 0, 0, 0.72)",
					},
				},
				data: pdata,
			},
		],
	};
	return optionData;
}

function zheLineChart2(xData, yData) {
	let borderColorList = [
		"rgba(0, 160, 233, 1)",
		"rgba(22, 200, 197, 1)",
		"rgba(251, 73, 123, 1)",
		"rgba(253, 167, 0, 1)",
		"rgba(44, 203, 66, 1)",
	];
	let data = [];
	let mData = [];
	yData.forEach((item, index) => {
		data.push({
			value: item,
			itemStyle: {
				borderColor: borderColorList[index],
			},
		});
		mData.push({
			name: "坐标",
			value: item + "%",
			coord: [index, item],
			symbol: "image://" + require(`../assets/month/${index + 1}.png`),
			symbolSize: String(item).length == 1 ? [38, 32] : String(item).length == 2 ? [45, 32] : String(item).length == 3 ? [50, 32] : [60, 32],
		});
	});
	let optionData = {
		grid: {
			top: "20%",
			left: "5%",
			bottom: "5%",
			right: "10%",
			containLabel: true,
		},
		animationDuration: 2000,
		xAxis: [{
			type: "category",
			boundaryGap: true,
			data: xData,
			axisLabel: {
				interval: 0, //防止x轴文字显示不全
				fontFamily: "SourceHanSansCN-Light",
				fontSize: 13,
				color: "#FFF",
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: "#112B5F",
				},
			},
			axisTick: {
				show: true,
			},
		}, ],
		yAxis: [{
			axisLabel: {
				formatter: '{value}%',
				fontFamily: "SourceHanSansCN-Light",
				fontSize: 13,
				color: "#5B759B",
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: "#0D3A52",
					type: "dashed",
				},
			},
		}, ],
		series: [{
			name: "比例",
			type: "line",
			data: data,
			showAllSymbol: true,
			symbol: "circle",
			symbolSize: 10,
			itemStyle: {
				color: "#fff",
				borderWidth: 3,
			},
			markPoint: {
				data: mData,
				symbolOffset: [2, "-60%"],
				label: {
					fontFamily: "MicrosoftYaHei",
					fontSize: 12,
					color: "#fff",
					position: [9, 9],
				},
			},
			lineStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: 0,
						color: "#007EFF",
					},
					{
						offset: 1,
						color: "#00C6FF",
					},
				]),
				// shadowColor: "rgba(0, 160, 233, .8)",
				// shadowBlur: 10,
			},
			// areaStyle: {
			// 	//区域填充样式
			// 	normal: {
			// 		//线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
			// 		color: new echarts.graphic.LinearGradient(
			// 			0,
			// 			0,
			// 			0,
			// 			1,
			// 			[
			// 				{
			// 					offset: 0,
			// 					color: "rgba(44, 183, 248, 0.59)",
			// 				},
			// 				{
			// 					offset: 1,
			// 					color: "rgba(14, 165, 234, 0)",
			// 				},
			// 			],
			// 			false
			// 		),
			// 		shadowColor: "rgba(44, 183, 248, 0.59)", //阴影颜色
			// 		shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
			// 	},
			// },
		}, ],
	};
	return optionData;
}

// 中间地图
function mapCharts(data) {
	let optionData = {
		geo: [{
				type: "map",
				map: "china",
				zlevel: -1,
				zoom: 1.3,
				layoutCenter: ["50%", "46%"],
				layoutSize: "90%",
				roam: false,
				silent: true,
				label: {
					normal: {
						show: true, //文字颜色
						textStyle: {
							color: "#82a3bd",
						},
					},
					emphasis: {
						show: false,
					},
				},
				itemStyle: {
					normal: {
						borderColor: "#0C4899",
						areaColor: "rgba(0,37,92)",
					},
				},
				regions: [{
					name: "南海诸岛",
					itemStyle: {
						normal: {
							opacity: 0,
							label: {
								show: false,
							},
						},
					},
				}, ],
			},
			{
				type: "map",
				map: "china",
				zlevel: -2,
				zoom: 1.3,
				layoutCenter: ["50%", "46%"],
				layoutSize: "90%",
				roam: false,
				silent: true,
				itemStyle: {
					normal: {
						borderColor: "#0099fe",
						borderWidth: 3,
						areaColor: "#1973CF",
					},
				},
				regions: [{
					name: "南海诸岛",
					itemStyle: {
						normal: {
							opacity: 0,
							label: {
								show: false,
							},
						},
					},
				}, ],
			},
			{
				type: "map",
				map: "china",
				zlevel: -3,
				zoom: 1.3,
				layoutCenter: ["50%", "48.5%"],
				layoutSize: "90%",
				roam: false,
				silent: true,
				itemStyle: {
					normal: {
						borderColor: "rgba(8,87,172)",
						areaColor: "rgba(8,87,172)",
					},
				},
			},
		],
		series: [{
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
				type: "scatter",
				coordinateSystem: "geo",
				symbol: "pin",
				symbolSize: [50, 50],
				label: {
					normal: {
						show: true,
						textStyle: {
							color: "#fff",
							fontSize: 12,
							fontFamily: "SourceHanSansCN-Bold",
							fontWeight: "Bold",
						},
						formatter(value) {
							return value.data.value[2];
						},
					},
				},
				itemStyle: {
					normal: {
						color: "rgba(253, 209, 0, 1)", //标志颜色
						shadowColor: "rgba(253, 209, 0, 1)",
						shadowBlur: 5,
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
		],
	};
	return optionData;
}

function ringCharts(value, xHeight, yHeight) {
	let optionData = {
		graphic: {
			//图形中间图片
			elements: [
				// {
				//   type: "image",
				//   style: {
				//     image: require("../assets/images/home/arrowBottom.png"), //你的图片地址
				//     width: 10,
				//     height: 10
				//   },
				//   left: "40%",
				//   // top: "65%",
				//   keyframeAnimation: [
				//     {
				//       // 平移动画
				//       duration: 1000,
				//       loop: true,
				//       keyframes: [
				//         {
				//           percent: 0,
				//           y: yHeight
				//         },
				//         {
				//           percent: 1,
				//           y: xHeight
				//         }
				//       ]
				//     }
				//   ]
				// },
				{
					type: "image",
					style: {
						image: require("../assets/month/arrowTop.png"), //你的图片地址
						width: 8,
						height: 8,
					},
					left: "45%",
					// top: "65%",
					keyframeAnimation: [{
						// 平移动画
						duration: 1500,
						loop: true,
						keyframes: [{
								percent: 0,
								y: xHeight,
							},
							{
								percent: 1,
								y: yHeight,
							},
						],
					}, ],
				},
			],
		},
		animationDuration: 2000,
		title: {
			text: value + "{a|%}",
			x: "center",
			y: "center",
			textStyle: {
				color: "#FFFFFF",
				fontSize: "20",
				rich: {
					a: {
						fontSize: "10",
					},
				},
			},
		},
		// backgroundColor: "#111",
		polar: {
			radius: ["150%", "1%"],
			center: ["50%", "50%"],
		},
		angleAxis: {
			max: 100,
			show: false,
		},
		radiusAxis: {
			type: "category",
			show: true,
			axisLabel: {
				show: false,
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
		},
		series: [{
			name: "",
			type: "bar",
			roundCap: true,
			barWidth: 4,
			showBackground: true,
			backgroundStyle: {
				color: "RGBA(13, 58, 82, 1)",
			},
			data: [value],
			coordinateSystem: "polar",
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
							offset: 0,
							color: "#009CFF",
						},
						{
							offset: 1,
							color: "#00F7FF",
						},
					]),
				},
			},
		}, ],
	};
	return optionData;
}

function liquidFill(value) {
	let optionData = {
		animationDuration: 2000,
		title: {
			text: (value * 100).toFixed(0) + "{a|%}",
			textStyle: {
				fontSize: 20,
				fontWeight: "bold",
				color: "#fff",
				rich: {
					a: {
						fontSize: 10,
					},
				},
			},
			x: "center",
			y: "40%",
		},
		series: [{
			type: "liquidFill",
			radius: "80%",
			center: ["50%", "50%"],
			data: [value, value],
			backgroundStyle: {
				color: {
					type: "radial", // 径向渐变
					x: 0.5, // 圆心坐标（中心）
					y: 0.5,
					r: 1,
					colorStops: [{
							offset: 1,
							color: "RGBA(0, 29, 66, 1)",
						},
						{
							offset: 0,
							color: "RGBA(0, 8, 38, 1)",
						},
					],
					globalCoord: false,
				},
			},
			outline: {
				// show: false
				borderDistance: 0,
				itemStyle: {
					borderWidth: 1,
					borderColor: "RGBA(0, 29, 66, 1)",
				},
			},
			color: [{
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
							offset: 1,
							color: "rgba(0, 126, 255, .3)", //下
						},
						{
							offset: 0,
							color: "rgba(0, 246, 255, .3)",
						},
					],
					globalCoord: false,
				},
				{
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
							offset: 1,
							color: "#007EFF", //下
						},
						{
							offset: 0,
							color: "#00F6FF",
						},
					],
					globalCoord: false,
				},
			],
			label: {
				normal: {
					formatter: "",
				},
			},
		}, ],
	};
	return optionData;
}

export {
	lineCharts,
	hengZhuCharts,
	zheLineChart2,
	mapCharts,
	ringCharts,
	liquidFill,
};