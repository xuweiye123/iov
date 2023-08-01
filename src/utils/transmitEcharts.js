function barCharts(xdata, data) {
	const optionData = {
		grid: {
			left: "0%",
			right: "0%",
			top: "5%",
			bottom: "10%",
			containLabel: true,
		},
		color: ['#1E64DD'],
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
				axisLine: {
					// show: false, //隐藏y轴
					lineStyle:{
						color:"#EFF4F8"
					}
				},
				axisTick: {
					// show: false, //刻度线
					alignWithLabel:true,
					lineStyle:{
						color:"#EFF4F8"
					}
				},
				splitLine: { show: false },
				type: "category",
				boundaryGap: true,
				data: xdata,
				axisLabel: {
					interval: 0, // 横轴信息全部显示
					formatter: function (value) {
						return value.split("").join("\n");
					},
					show: true,
					textStyle: {
						color: "#595757",
						fontSize: "10",
					},
				},
			},
		],
		yAxis: [
			{
				axisTick: {
					show: false, //刻度线
				},
				axisLine: {
					show: false, //隐藏y轴
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#f3f5f6",
						type: "dashed",
					},
				},
				type: "value",
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
						areaStyle: { type: "default" },
						lineStyle: {
							color: "#49a9ee",
							width: 2,
						},
						barBorderRadius: [34, 34, 0, 0], // 圆角
						borderWidth: 1,
            color:"#1E64DD"
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

export { barCharts }