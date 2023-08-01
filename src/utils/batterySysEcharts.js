// 竖向柱状图
function barCharts(color, xdata, data, fontsizeColor, xycolor) {
  console.log(color, xdata, data, fontsizeColor, xycolor)
  const optionData = {
    grid: {
      left: '3%',
      right: '10%',
      top: '20%',
      bottom: '0%',
      containLabel: true
    },
    color: [color],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderColor: '#ccc',
      borderRadius: 4,
      borderWidth: 1,
      extraCssText: 'box-shadow:0 0 5px #ccc',
      textStyle: {
        color: '#9EA8B2'
      }
    },
    xAxis: [
      {
        splitLine: { show: false },
        type: 'category',
        data: xdata,
        axisLine: {
          lineStyle: {
            color: xycolor
          }
        },
        axisLabel: {
          formatter: function(value) {
            var ret = ''// 拼接加\n返回的类目项
            var maxLength = 4// 每项显示文字个数
            var valLength = value.length// X轴类目项的文字个数
            var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
            if (rowN > 1)
            {
              for (var i = 0; i < rowN; i++) {
                var temp = ''// 每次截取的字符串
                var start = i * maxLength// 开始截取的位置
                var end = start + maxLength// 结束截取的位置
                // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                temp = value.substring(start, end) + '\n'
                ret += temp // 凭借最终的字符串
              }
              return ret
            } else {
              return value
            }
          },
          interval: 0, // 横轴信息全部显示
          //  rotate: 10, // -15度角倾斜显示
          show: true,
          textStyle: {
            color: fontsizeColor,
            fontSize:11
          }
        },
        axisTick:{
          show:false
        }
      }
    ],
    yAxis: [
      {
        splitLine: {
          show: true,
          lineStyle: {
            color: xycolor,
            type: 'dashed'
          }
        },
        type: 'value',
        minInterval: 1,
        axisLine: {
          show: false,
          lineStyle: {
            color: xycolor,
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: fontsizeColor
          }
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'bar',
        barWidth: 10, // 柱图宽度
        itemStyle: {
          normal: {
            barBorderRadius:[5, 5, 5, 5],
            areaStyle: { type: 'default' },
            label: {
              color:"#595757",
              show: true, //开启显示
              position: 'top', //在上方显示
              textStyle: { //数值样式
                fontSize: 16
              }
            },
            lineStyle: {
              color: '#4ca0ff',
              width: 2
            }
          }
        },
        data: data
      }
    ]
  }
  return optionData
}

//半圆形图
function piebanCharts(themeColor,data, fontsizeColor,colorList) {
	let numcount = 0;
	for (var i = 0; i < data.length; i++) {
		numcount += parseInt(data[i].value);
	}

	const optionData = {
		legend: {
			orient: "horizontal",
			right: 30,
			bottom: 0,
			textStyle: {
				fontSize: 10,
				color: fontsizeColor,
				padding: 2,
				rich: {
					a: {
						fontSize: 11,
						align: "left",
						// padding:[0,28,0,0],
						width: 60,
					},
					b: {
						fontSize: 11,
						align: "right",
						color: "#595757",
						fontWeight: "bold",
						// padding:[0,28,0,0],
						width: 50,
					},
				},
			},
			icon: "circle",
			left: "center",
			inactiveColor:'#eee',
			inactiveBorderColor:'#fff',
      itemWidth: 8,
			itemHeight: 8,
			itemGap: 2,
			data: ["电池包型号数", "电池模块型号数", "电池单体型号数", "车辆型号数"],
			formatter: function(name) {
				var index = 0;
				var clientlabels = [
					"电池包型号数",
					"电池模块型号数",
					"电池单体型号数",
					"车辆型号数",
				];
				var clientcounts = data;
				clientlabels.forEach(function(value, i) {
					if (value == name) {
						index = i;
					}
				});

				let arr = [
					"{a|" + name + "}       {b|" + clientcounts[index].value + "}",
				];

				return arr.join("\n");
			},
		},

		title: {
			text: "总数",
			left: "center",
			top: "48%",
			textStyle: {
				//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
				fontFamily: "Arial, Verdana, sans...",
				fontSize: 12,
				fontStyle: "normal",
				fontWeight: "normal",
				color: "#595757",
			},
		},
		graphic: {
			//图形中间文字
			type: "text",
			left: "center",
			top: "34%",
			style: {
				text: numcount,
				// textAlign: "center",
				fontSize: 20,
				fill: themeColor,
			},
		},
		series: [
			{
				startAngle: 0, // 饼图的角度
				hoverAnimation: true, // 取消饼图放大效果
				name: "访问来源",
				type: "pie",
				radius: ["80%", "100%"],
				center: ["50%", "60%"],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: "center",
				},
				emphasis: {
					label: {
						show: false,
						fontSize: "30",
						fontWeight: "bold",
					},
				},
				itemStyle: {
					borderColor: "#fff",
					borderWidth: 3,
					borderRadius: 10,
				},
				labelLine: {
					show: false,
				},
				data: [
					{
						value: 100,
						itemStyle: {
							normal: {
								color: "transparent", // 透明色
							},
						},
						name: "",
					},
					{
						value: (data[0].value / numcount) * 100,
						name: "电池包型号数",
						itemStyle: {
							color: colorList[0],
						},
					},
					{
						value: (data[1].value / numcount) * 100,
						name: "电池模块型号数",
						itemStyle: {
							normal: {
								color: colorList[1],
							},
						},
					},
					{
						value: (data[2].value / numcount) * 100,
						name: "电池单体型号数",
						itemStyle: {
							normal: {
								color: colorList[2],
							},
						},
					},
					{
						value: (data[3].value / numcount) * 100,
						name: "车辆型号数",
						itemStyle: {
							normal: {
								color: colorList[3],
							},
						},
					},
				],
			},
		],
	};
	return optionData;
}
// 环形图
function pieCharts(data, fontsizeColor,colorList) {
  const optionData = {
		tooltip: {
			trigger: "item",
			backgroundColor: "rgba(255,255,255,0.7)",
			borderColor: "#ccc",
			borderRadius: 4,
			borderWidth: 1,
			extraCssText: "box-shadow:0 0 5px #ccc",
			textStyle: {
				color: "#9EA8B2",
			},
			formatter: "{b}: {c}",
		},
		color: colorList,
		legend: {
			type: "scroll",
			orient: "vertical",
			top: "center",
			right: "10%",
			icon: "circle",
			itemWidth: 8,
			itemHeight: 8,
			itemGap: 2,
			inactiveColor:'#eee',
			inactiveBorderColor:'#fff',
			textStyle: {
				fontSize: 14,
				color: fontsizeColor,
				padding: 2,
				rich: {
					a: {
						fontSize: 11,
						align: "left",
						// padding:[0,28,0,0],
						width: 70,
					},
					b: {
						fontSize: 11,
						align: "right",
						color: "#595757",
						fontWeight: "bold",
						// padding:[0,28,0,0],
						width: 50,
					},
				},
			},
			formatter: function(name) {
				var index = 0;
				var clientlabels = [
					"入库电池包数",
					"入库电池模块数",
					"入库单体电池数",
					"回收服务网点",
				];
				var clientcounts = data;
				clientlabels.forEach(function(value, i) {
					if (value == name) {
						index = i;
					}
				});
				let arr = ["{a|" + name + "} {b|" + clientcounts[index].value + "}"];

				return arr.join("\n");
			},
		},
		series: [
			{
				name: "",
				type: "pie",
				radius: ["50%", "80%"],
				center: ["26%", "50%"],
				itemStyle: {
					normal: {
						label: {
							show: false,
						},
						labelLine: {
							show: false,
						},
						borderColor: "#fff",
						borderWidth: 5,
					},
					emphasis: {
						label: {
							show: false,
							position: "center",
							textStyle: {
								fontSize: "12",
								fontWeight: "bold",
							},
						},
					},
				},
				data: data,
			},
		],
	};
  return optionData
}

export {
  barCharts,
  pieCharts,
  piebanCharts
}
