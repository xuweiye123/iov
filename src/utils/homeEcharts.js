import * as echarts from "echarts";
//远程控制首页三个原型饼图
function PieCharts(data,color) {
	const option = {
		backgroundColor: '#fff',
		legend: {
			show: false
		},
		title: {
			text: `{value|${data}}{unit|%}`,
			top: 'center',
			left: 'center',
			textStyle: {
				rich: {
					value: {
						fontSize: 16,
						color: '#262834',
						fontWeight: 500
					},
					unit: {
						fontSize: 12,
						color: '#262834',
						padding: [5, 0, 6, 1],
						fontWeight: 500

					}
				}
			}
		},
		series: [{
				type: 'pie',
				clockwise: false,
				radius: ['68%', '72%'],
				zlevel: 3,
				hoverAnimation: false,
				label: {
					show: false,
				},
				data: [{
					value: 100 - data,
					itemStyle: {
						color: 'transparent',
					}
				}, {
					value: data,
					itemStyle: {
						normal: {
							borderWidth: 7,
							borderColor: color,
							color: color
						}
					},
				}, ]
			},
			{
				type: 'pie',
				clockwise: false,
				radius: ['68%', '72%'],
				hoverAnimation: false,
				zlevel: 2,
				label: {
					show: false,
				},
				itemStyle: {
					color: '#F2F3F5',
					borderWidth: 4,
					borderColor: '#F2F3F5'
				},
				emphasis: {
					itemStyle: {
						color: '#F2F3F5',
						borderWidth: 5,
						borderColor: '#F2F3F5'
					}
				},
				data: [100]
			}
		]
	};
	return option;
}
//远程控制首页整体趋势
function wholCcarCharts(dataX1, dataY1, dataY2, colorList, lingColor) {
	let option = {
		tooltip: {
			trigger: "axis",
			backgroundColor: "transparent",
			borderColor: "transparent",
			padding: 0,
			borderWidth:0,
			extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, .0);',
			// backgroundColor:"rgba(227, 229, 233, .7)",
			// borderColor: "rgba(227, 229, 233, .7)",
			//浮窗字体颜色
			// textStyle: {
			// 	color: "#666D7A",
			// },
			formatter: function (params) {
				let returnData =
					'<div style="background:rgba(227, 229, 233, .7);border: 0;border-radius: 4px;padding:10px;">';
				returnData +=
					'<span style="font-family: MicrosoftYaHei; font-size: 14px; color: #262834;font-weight: bold">' +
					params[0].name +
					'</span><br/><div style="background:#FFF;border-radius: 4px;padding:10px;"> ';
				for (let i = 0; i < params.length; i++) {
					returnData +=
						'<span style="display:inline-block; width:8px; height:8px; margin-right:5px; border-radius:50px; background-color:' +
						params[i].color +
						'"></span>';
					returnData +=
						'<span style="font-family: MicrosoftYaHei; font-size: 12px; color:#595757' +
						'">' +
						params[i].seriesName +
						'：</span><span style="font-family: MicrosoftYaHei; font-size: 12px; color: #595757' +
						'">' +
						params[i].value +
						'</span><br/>';
				}
				returnData += "</div></div>";
				return returnData;
			},
			axisPointer:{
				// type:"line",
				lineStyle:{
					type:"solid",
					color:"#1E64DD"
				}
			}
		},
		grid: {
			top: "60px",
			left: "2%",
			right: "2%",
			bottom: "5%",
			// height: "100%",
			containLabel: true,
		},
		legend: {
			orient: "horizontal",
			data: ["昨天", "今日"],
			right: 20,
			top: 10,
			itemWidth: 10,
			itemHeight: 10,
			icon: "roundRect",
			itemGap: 10,
			textStyle: {
				color: colorList[3],
			},
		},
		xAxis: {
			type: "category",
			data: dataX1,
			boundaryGap: false,
			//x轴颜色
			axisLine: {
				lineStyle: {
					color: colorList[1],
					type: "dashed",
				},
			},
			axisLabel: {
				margin: 10,
				textStyle: {
					fontSize: 14,
					color: "#595757"
				},
			},
		},
		yAxis: {
			type: "value",
			splitLine: {
				lineStyle: {
					//y轴横线颜色
					color: colorList[1],
					type: "dashed",
				},
			},
			minInterval: 1,
			axisTick: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: colorList[0],
				},
			},
			axisLabel: {
				margin: 10,
				textStyle: {
					fontSize: 14,
					color: "#929292"
				},
			},
		},
		series: [{
				name: "昨天",
				type: "line",
				smooth: true,
				showSymbol: false,
				// symbol: "circle",
				symbolSize: 6,
				data: dataY1,
				itemStyle: {
					normal: {
						color: lingColor[0],
					},
				},
				lineStyle: {
					normal: {
						width: 2,
						color: lingColor[0],
					},
				},
				// areaStyle: {
				// 	//折线图颜色半透明
				// 	color: {
				// 		type: "linear",
				// 		x: 0,
				// 		y: 0,
				// 		x2: 0,
				// 		y2: 1,
				// 		colorStops: lingColorA[0],
				// 		global: false, // 缺省为 false
				// 	},
				// },
			},
			{
				name: "今日",
				type: "line",
				smooth: true,
				showSymbol: false,
				// symbol: "circle",
				symbolSize: 6,
				data: dataY2,
				itemStyle: {
					normal: {
						color: lingColor[1],
					},
				},
				lineStyle: {
					normal: {
						width: 2,
						color: lingColor[1],
					},
				},
				// areaStyle: {
				// 	//折线图颜色半透明
				// 	color: {
				// 			type: 'linear',
				// 			x: 0,
				// 			y: 0,
				// 			x2: 0,
				// 			y2: 1,
				// 			colorStops: lingColorA[1],
				// 			global: false // 缺省为 false
				// 	}
				// }
			},
		],
	};
	return option;
}
//远程控制首页TOP远程控制功能
function RemoteControl(datas, colorList, colorListTu) {

	const rich = {
		name: {
			color: "#262834",
			fontSize: 12,
			// align: "left",
			width: 100,
			fontWeight:"bold"
		},
		name1: {
			color: "#595757",
			fontSize: 12,
			// align: "left",
			width: 100,
		},
	};
	let option = {
		tooltip: {
			show: true,
			trigger: "item",
			backgroundColor:"rgba(227, 229, 233, .7)",
			borderColor: "rgba(227, 229, 233, .7)",
			//浮窗字体颜色
			textStyle: {
				color: "#666D7A",
				rich
			},
			// formatter: '{b0}: {c0}次',
			formatter: function(params) {
				// console.log(params,"params")
				return (
					'<span style="display:inline-block; width:8px; height:8px; margin-right:5px; border-radius:50px; background-color:'+params.color+'"></span>'+
					params.name +
					"：" +
					params.data.value+"次"
				);
			},
		},
		color: colorListTu,
		grid: {
			top: "0%",
			left: "2%",
			right: "2%",
			bottom: "0%",
			// height: "100%",
			containLabel: true,
		},
		legend: {
			orient: "vertical",
			icon: "circle",
			x: "55%",
			y: "center",
			itemWidth: 10,
			itemHeight: 10,
			width: "10",
			height: "100%",
			inactiveColor:'#eee',
			inactiveBorderColor:'#fff',
			itemGap: 4,
			align: "left",
			textStyle: {
				color: "#595757",
				rich,
				fontSize: 11,
			},
			// textStyle: { fontSize: 8, color: textColor },
			formatter: function (name) {
				// console.log(datas,"datas");
				let res = datas.filter((v) => v.name === name);
				let str = "";
				str = "{name1|" + res[0].name + "}{name|" + res[0].percent + " %}";
				return str;
			},
		},

		series: [{
			type: "pie",
			center: ["30%", "50%"],
			radius: ["55%", "85%"],
			data: datas,
			label: {
				show: false,
			},
			itemStyle: {
				normal: {
					borderColor: colorList[1],
					borderWidth: 2,
				},
			},
		}, ],
	};
	return option;
}
//远程控制首页TOP渠道
function RemoteTop(datas, colorList, colors) {
	const rich = {
		name: {
			color: "#262834",
			fontSize: 12,
			align: "left",
			width: 100,
			fontWeight:"bold"
		},
		name1: {
			color: "#595757",
			fontSize: 12,
			align: "right",
			width: 100,
		},
	};
	let option = {
		tooltip: {
			show: true,
			trigger: "item",
			backgroundColor:"rgba(227, 229, 233, .7)",
			borderColor: "rgba(227, 229, 233, .7)",
			//浮窗字体颜色
			textStyle: {
				color: "#666D7A",
				rich
			},
			// formatter: '{b0}: {c0}次',
			formatter: function(params) {
				// console.log(params,"params")
				return (
					'<span style="display:inline-block; width:8px; height:8px; margin-right:5px; border-radius:50px; background-color:'+params.color+'"></span>'+
					params.name +
					"：" +
					params.data.value+"个"
				);
			},
		},
		legend: {
			orient: "vertical",
			icon: "circle",
			x: "60%",
			y: "center",
			itemWidth: 10,
			itemHeight: 10,
			inactiveColor:'#eee',
      inactiveBorderColor:'#fff',
			// inactiveBorderWidth:'auto',
			// width: "4",
			align: "left",
			textStyle: {
				color: colorList[0],
				rich,
				fontSize: 11,
			},
			// data:["嵌入式","FLASH"],
			formatter: function (name) {
				let res = datas.filter((v) => v.name === name);
				let str = "";
				str = "{name1|" + res[0].name + "}{name|" + res[0].percent + "%}";
				return str;
			},
		},
		series: [{
			name: "库存情况",
			type: "pie",
			radius: "68%",
			center: ["40%", "50%"],
			radius: ["55%", "85%"],
			clockwise: false,
			data: datas,
			label: {
				normal: {
					show: false,
				},
			},
			labelLine: {
				normal: {
					show: false,
				},
			},
			itemStyle: {
				normal: {
					borderWidth: 1,
					borderColor: colorList[1],
				},

			},
		}, ],
		color: colors,
	};

	return option;
}

export {
	PieCharts,
	wholCcarCharts,
	RemoteControl,
	RemoteTop
};