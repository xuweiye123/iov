import * as echarts from "echarts";

// 柱状图
function cpxhtj(xdata, data) {
	let obj = [],
		lengendData = [];
	let colordata = [
		{ bgcolor: "#005B8E", borderColor: "#00A0E9" },
		{ bgcolor: "#29874F", borderColor: "#51F267" },
		{ bgcolor: "#7F771C", borderColor: "#FDD100" },
		{ bgcolor: "#7E335A", borderColor: "#FB497B" },
	];
	data.forEach((item, index) => {
		lengendData.push(item.name);
		obj.push({
			name: item.name,
			type: "bar",
			barWidth: "8",
			yAxisIndex: 0,
			showBackground: false,
			itemStyle: {
				normal: {
					color: colordata[index].bgcolor,
					borderColor: colordata[index].borderColor,
					borderWidth: 1,
				},
			},
			data: item.data,
		});
	});
	let optionData = {
		legend: {
			// top: 0,
			// left: 0,
			icon: "roundRect",
			itemWidth: 8,
			itemHeight: 8,
			itemGap: 8,
      align: 'auto' ,
			textStyle: {
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: "rgba(255, 255, 255, 1)",
			},
			data: lengendData,
		},
		grid: {
			top: "28%",
			left: "10%",
			right: "0%",
			bottom: "15%",
		},
		animationDuration: 2000,
		xAxis: {
			type: "category",
			data: xdata,
			axisLine: {
				show: true,
				lineStyle: {
					color: "#0D3A52",
				},
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				interval: 0, //防止x轴文字显示不全
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: "#fff",
			},
			axisTick: {
				show: true,
				inside: true,
				alignWithLabel: true,
				lineStyle: {
					color: "#0D3A52",
				},
			},
		},
		yAxis: [
			{
				type: "value",
				name: "",
				nameTextStyle: {
					fontFamily: "MicrosoftYaHei",
					fontSize: 12,
					color: "rgba(92, 124, 149, 1)",
				},
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
					formatter: "{value}",
					show: true,
					textStyle: {
						fontFamily: "MicrosoftYaHei",
						fontSize: 12,
						color: "rgba(92, 124, 149, 1)",
					},
				},
				axisTick: {
					show: false,
				},
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "shadow",
			},
			backgroundColor: "transparent",
			borderColor: "transparent",
			textStyle: {
				color: "#fff", //设置文字颜色
			},
			formatter: function(params) {
				console.log(params, "params");
				// let colors = ["rgba(81, 242, 103, .6)", "rgba(0, 160, 233, .6)"];
				let returnData =
					'<div style="background: rgba(0,90,139,0.8);border: 1px solid #32AFAA;box-shadow: 0px 2px 1px 0px rgba(0,39,70,0.8);border-radius: 4px;padding:10px;">';
				returnData +=
					'<span style="font-family: MicrosoftYaHei; font-size: 14px; color: #fff;font-weight: bold">' +
					params[0].axisValue +
					"</span><br/>";
				for (let i = 0; i < params.length; i++) {
					returnData +=
						'<span style="display:inline-block; width:10px; height:8px; margin-right:5px; border-radius:1px; background-color:' +
						colordata[i].borderColor +
						'"></span>';
					returnData +=
						'<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
						'">' +
						params[i].seriesName +
						'：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
						'">' +
						params[i].value +
						'</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
						'">个</span><br/>';
				}
				returnData += "</div>";
				return returnData;
			},
		},
		series: obj,
	};
	return optionData;
}

// 雷达图
function radarCharts(indicatorMax, data) {
	var indicator = [
		{
			text: "入库电池包记录数",
			max: indicatorMax,
		},
		{
			text: "车辆换电次数",
			max: indicatorMax,
		},
		{
			text: "换电出库电池包数",
			max: indicatorMax,
		},
		{
			text: "换电退役电池包数",
			max: indicatorMax,
		},
		{
			text: "换电企业总数",
			max: indicatorMax,
		},
	];
	const optionData = {
		radar: {
			name: {
				textStyle: {
					color: "#fff",
					fontSize: 12,
				},
			},
			shape: "polygon",
			center: ["50%", "53%"],
			radius: "70%",
			// startAngle: 120,
			scale: true,
			axisLine: {
				lineStyle: {
					color: "#112B5F",
				},
			},
			splitLine: {
				show: true,
				lineStyle: {
					width: 1,
					color: "#112B5F", // 设置网格的颜色
				},
			},
			indicator: indicator,
			splitArea: {
				show: false,
			},
		},
		series: [
			{
				name: "个人雷达图",
				type: "radar",
				symbol: "circle", // 拐点的样式，还可以取值'rect','angle'等
				symbolSize: 8, // 拐点的大小
				hoverAnimation: false,
				silent: true,
				areaStyle: {
					normal: {
						color: "rgba(0, 68, 148, 1)",
						opacity: 0.5,
					},
				},
				label: {
					normal: {
						show: true,
						formatter: (params) => {
							return params.value;
						},
						color: "#fff",
					},
				},
				data: [
					{
						value: data,
						name: "",
						lineStyle: {
							color: "#007EFF", //设置折线的颜色
						},
					},
					{
						value: [data[0], 0, 0, 0, 0],
						name: "入库电池包记录数",
						label: {
							show: false,
						},
						itemStyle: {
							color: "#FB497B",
							borderWidth: 1,
							borderColor: "#fff",
						},
						lineStyle: {
							color: "transparent", //设置折线的颜色
						},
					},
					{
						value: [0, data[1], 0, 0, 0],
						name: "车辆换电次数",
						label: {
							show: false,
						},
						itemStyle: {
							color: "#FDD100",
							borderWidth: 1,
							borderColor: "#fff",
						},
						lineStyle: {
							color: "transparent", //设置折线的颜色
						},
					},
					{
						value: [0, 0, data[2], 0, 0],
						name: "换电出库电池包数",
						label: {
							show: false,
						},
						itemStyle: {
							color: "#7351E3",
							borderWidth: 1,
							borderColor: "#fff",
						},
						lineStyle: {
							color: "transparent", //设置折线的颜色
						},
					},
					{
						value: [0, 0, 0, data[3], 0],
						name: "换电退役电池包数",
						label: {
							show: false,
						},
						itemStyle: {
							color: "#16C8C5",
							borderWidth: 1,
							borderColor: "#fff",
						},
						lineStyle: {
							color: "transparent", //设置折线的颜色
						},
					},
					{
						value: [0, 0, 0, 0, data[4]],
						name: "换电企业总数",
						label: {
							show: false,
						},
						itemStyle: {
							color: "#007EFF",
							borderWidth: 1,
							borderColor: "#fff",
						},
						lineStyle: {
							color: "transparent", //设置折线的颜色
						},
					},
					{
						value: [0, 0, 0, 0, 0],
						name: "all",
						// symbolSize: 18,
						itemStyle: {
							color: "rgba(0, 68, 148, .1)",
							// color: "rgba(0,45,102)",
							borderWidth: 1,
							borderColor: "rgba(0, 68, 148, .1)",
						},
						label: {
							show: false,
						},
					},
				], 
			},
		],
	};
	return optionData;
}

// 折线图
function dctyxxtj(nameList, colors, xData, yData) {
	// console.log(21)
	// xData=[1,2,3,4,5]
	// yData=[[12,11,23,12,11],[11,2,12,33,22,11]]
	let optionData = {
		legend: {
			top: 0,
			right: 0,
			icon: "roundRect",
			itemWidth: 8,
			itemHeight: 8,
			itemGap: 10,
			textStyle: {
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: "rgba(255, 255, 255, 1)",
			},
			data: nameList,
		},
		grid: {
			top: "19%",
			left: "0%",
			right: "11%",
			bottom: "10%",
			containLabel: true,
		},
		animationDuration: 2000,
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "line",
				lineStyle: {
					type: "solid",
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: "rgba(81, 242, 103, 1)",
						},
						{
							offset: 1,
							color: "rgba(65, 171, 184, 1)",
						},
					]),
				},
			},
			backgroundColor: "transparent",
			borderColor: "transparent",
			formatter: function(params) {
				let returnData =
					'<div style="background: rgba(0,90,139,0.8);border: 1px solid #32AFAA;box-shadow: 0px 2px 1px 0px rgba(0,39,70,0.8);border-radius: 4px;padding:10px;">';
				returnData +=
					'<span style="font-family: MicrosoftYaHei; font-weight: bold;font-size: 14px; color: rgba(255, 255, 255, 1);">' +
					params[0].axisValue +
					"</span><br/>";
				for (let i = 0; i < params.length; i++) {
					returnData +=
						'<span style="display:inline-block; width:10px; height:10px; margin-right:5px; border-radius:1px; background-color:' +
						colors[i] +
						'"></span>';
					returnData +=
						'<span style="font-family: MicrosoftYaHei;font-size: 12px;color: rgba(255, 255, 255, 1);">' +
						params[i].seriesName +
						' </span><span style="font-family: Verdana; font-size: 12px;color: rgba(255, 255, 255, 1);">' +
						params[i].value +
						'</span><span style="display:inline-block;color: rgba(255, 255, 255, 1); margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px;"></span><br/>';
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
					color: "#0D3A52",
				},
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: "#fff",
			},
			axisTick: {
				show: true,
				inside: true,
				alignWithLabel: true,
				lineStyle: {
					color: "#0D3A52",
				},
			},
			boundaryGap: false,
			data: xData,
		},
		yAxis: {
			type: "value",
			name: "",
			nameTextStyle: {
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: "rgba(92, 124, 149, 1)",
			},
			min: 0,
			axisLine: {
				show: false,
			},
			splitLine: {
				show: false,
			},
			axisLabel: {
				show: true,
				margin: 20,
				textStyle: {
					fontFamily: "MicrosoftYaHei",
					fontSize: 12,
					color: "rgba(92, 124, 149, 1)",
				},
			},
			axisTick: {
				show: false,
			},
		},
		series: [
			{
				name: nameList[0],
				type: "line",
				showSymbol: false,
				smooth: true, //true曲线; false折线
				// symbol: "circle",
				symbolSize: 7,
				lineStyle: {
					color: colors[0],
				},
				label: {
					show: false,
				},
				itemStyle: {
					color: colors[0],
					borderColor: colors[0],
					borderWidth: 1,
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: colors[0],
								},
								{
									offset: 1,
									color: "rgba(17, 51, 40, .1)",
									// color: "rgba(81, 242, 103, .1)"
								},
							],
							false
						),
						// shadowColor: colors[0],
						// shadowBlur: 10
					},
				},
				data: yData[0],
			},
			{
				name: nameList[1],
				type: "line",
				showSymbol: false,
				smooth: true, //true曲线; false折线
				// symbol: "circle",
				symbolSize: 7,
				lineStyle: {
					color: colors[1],
				},
				label: {
					show: false,
				},
				itemStyle: {
					normal: {
						lineStyle: {
							// 设置线的宽度
							width: 1,
							//'dotted'虚线 'solid'实线
							// type: 'dashed',
							color: colors[1],
						},
					},
				},
				areaStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(
							0,
							0,
							0,
							1,
							[
								{
									offset: 0,
									color: colors[1],
								},
								{
									offset: 1,
									color: "rgba(2, 35, 57, .1)",
									// color: "rgba(0, 160, 233, .1)"
								},
							],
							false
						),
						// shadowColor: colors[1],
						// shadowBlur: 10
					},
				},
				data: yData[1],
			},
		],
	};
	return optionData;
}

// 环形图
function hswddctj(data) {
	// data= [
	// 	{
	// 		name: "入库电池包数",
	// 		value: 900,
	// 	},
	// 	{
	// 		name: "入库电池模块数",
	// 		value: 890,
	// 	},
	// 	{
	// 		name: "入库单体电池数",
	// 		value: 700,
	// 	},
	// 	{
	// 		name: "回收服务网点",
	// 		value: 600,
	// 	},
	// ];
	var arrName = getArrayValue(data, "name");
	var objData = array2obj(data, "name");
	var optionData = getData(data);
	function getArrayValue(array, key) {
		var key1 = key || "value";
		var res = [];
		if (array) {
			array.forEach(function(t) {
				res.push(t[key1]);
			});
		}
		return res;
	}
	function array2obj(array, key) {
		var resObj = {};
		for (var i = 0; i < array.length; i++) {
			resObj[array[i][key]] = array[i];
		}
		return resObj;
	}

	function getData(data) {
		var res = {
			series: [],
			yAxis: [],
		};
		let dataNumber=[]
		data.forEach(i=>{
			dataNumber.push(i.value)
		})
		for (let i = 0; i < data.length; i++) {
			res.series.push({
				name: "",
				type: "pie",
				clockWise: false, //顺时加载
				hoverAnimation: false, //鼠标移入变大
				radius: [93 - i * 18 + "%", 83 - i * 18 + "%"],
				center: ["30%", "53%"],
				label: {
					show: false,
				},
				itemStyle: {
					label: {
						show: false,
					},
					labelLine: {
						show: false,
					},
					borderWidth: 5,
				},
				data: [
					{
						value: data[i].value,
						name: data[i].name,
					},
					{
						value:Math.max(...dataNumber),
						name: "",
						itemStyle: {
							color: "rgba(0,0,0,0)",
							borderWidth: 0,
						},
						tooltip: {
							show: false,
						},
						hoverAnimation: false,
					},
				],
			});
			res.series.push({
				name: "",
				type: "pie",
				silent: true,
				z: 1,
				clockWise: false, //顺时加载
				hoverAnimation: false, //鼠标移入变大
				radius: [93 - i * 18 + "%", 83 - i * 18 + "%"],
				center: ["30%", "53%"],
				label: {
					show: false,
				},
				itemStyle: {
					label: {
						show: false,
					},
					labelLine: {
						show: false,
					},
					borderWidth: 5,
				},
				data: [
					{
						value: 7.5,
						itemStyle: {
							color: "#0D2F52",
							borderWidth: 0,
						},
						tooltip: {
							show: false,
						},
						hoverAnimation: false,
					},
					{
						value: 2.5,
						name: "",
						itemStyle: {
							color: "rgba(0,0,0,0)",
							borderWidth: 0,
						},
						tooltip: {
							show: false,
						},
						hoverAnimation: false,
					},
				],
			});
			res.yAxis.push(data[i].value);
		}
		return res;
	}

	let option = {
		legend: {
			show: true,
			top: "5%",
			left: "60%",
			data: arrName,
			icon: "roundRect",
			itemWidth: 8,
			itemHeight: 8,
			width: 10,
			padding: [0, 2],
			itemGap: 3,
			formatter: function(name) {
				return "{title|" + name + "}\n{value|" + objData[name].value + "}";
			},
			textStyle: {
				rich: {
					title: {
						fontSize: 12,
						lineHeight: 15,
						color: "#5C7C95",
					},
					value: {
						fontSize: 12,
						lineHeight: 15,
						color: "#fff",
					},
				},
			},
		},
		tooltip: {
			show: true,
			trigger: "item",
			axisPointer: {
				type: "shadow",
			},
			backgroundColor: "transparent",
			borderColor: "transparent",
			textStyle: {
				color: "#fff", //设置文字颜色
			},
			formatter: function(params) {
				let returnData =
					'<div style="background: rgba(0,90,139,0.8);border: 1px solid #32AFAA;box-shadow: 0px 2px 1px 0px rgba(0,39,70,0.8);border-radius: 4px;padding:10px;">';
				returnData +=
					'<span style="display:inline-block; width:10px; height:8px; margin-right:5px; border-radius:1px; background-color:' +
					params.color +
					'"></span>';
				returnData +=
					'<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
					'">' +
					params.name +
					'：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
					'">' +
					params.value +
					'</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
					'"></span><br/>';
				returnData += "</div>";
				return returnData;
			},
		},
		color: ["#16C8C5", "#FDD100", "#007EFF", "#FB497B"],
		grid: {
			top: "0%",
			bottom: "50%",
			left: "30%",
			containLabel: false,
		},
		yAxis: [
			{
				type: "category",
				inverse: true,
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					interval: 0,
					inside: true,
					textStyle: {
						color: "#fff",
						fontSize: 12,
					},
					show: true,
				},
				data: optionData.yAxis,
			},
		],
		xAxis: [
			{
				show: false,
			},
		],
		series: optionData.series,
	};
	return option;
}

// earth

export { cpxhtj, radarCharts, dctyxxtj, hswddctj };
