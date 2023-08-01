//月报第五个页面中国地图
function ChineseCharts(data) {
	// var data = ["湖北", "河北","新疆","陕西","aoteman"];
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
	coordsData.map(function(i){
		if(i.coords&&i.coords[1]&&i.coords[1][0]&&i.coords[1][0]< 116.4551){
			i.lineStyle = {
        color: "rgba(249, 252, 62, 1)",
        curveness: -0.3
      };
		}else{
			i.lineStyle = {
        color: "rgba(249, 252, 62, 1)",
        curveness: 0.3
      };
		}
	})
	console.log(coordsData,"coordsData")

	let optionData = {
		geo: [
			{
				type: "map",
				map: "china",
				zlevel: -1,
				zoom: 1.2,
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
				zoom: 1.2,
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
				zoom: 1.2,
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

export { ChineseCharts };
