import * as echarts from "echarts";
import {
  calMax,
  calMin
} from "@/utils/base"

// 中间地图
function mapCharts(data) {
  let optionData = {
    visualMap: {
      min: 0,
      max: 1,
      calculable: false,
      show: true,
      hoverLink:false,
      left: 50,
      bottom: 40,
      itemWidth: 10,
      text: ['快', '慢'],
      orient: 'horizontal',
      color: ["#FFFF00", "#00F7FF"],
      textStyle: {
        color: '#fff'
      }
    },
    geo: [{
        type: 'map',
        map: 'china',
        zlevel: -1,
        zoom: 1.3,
        layoutCenter: ['50%', '46%'],
        layoutSize: '90%',
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
          name: '南海诸岛',
          itemStyle: {
            normal: {
              opacity: 0,
              label: {
                show: false
              }
            }
          }
        }]
      },
      {
        type: 'map',
        map: 'china',
        zlevel: -2,
        zoom: 1.3,
        layoutCenter: ['50%', '46%'],
        layoutSize: '90%',
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
          name: '南海诸岛',
          itemStyle: {
            normal: {
              opacity: 0,
              label: {
                show: false
              }
            }
          }
        }]
      },
      {
        type: 'map',
        map: 'china',
        zlevel: -3,
        zoom: 1.3,
        layoutCenter: ['50%', '48.5%'],
        layoutSize: '90%',
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
      name: '热力图',
      type: 'scatter',
      coordinateSystem: 'geo',
      symbolSize: 7,
      data: data
    }, ]
  };
  return optionData;
}

// 左一折线图
function chargingLineChartOne(nameList, colors, xData, yData1,yData2) {
  let optionData = {
    // backgroundColor: "rgba(30, 34, 48, 1)",
    grid: {
      top: "19%",
      left: "3%",
      right: "11%",
      bottom: "10%",
      containLabel: true
    },
    animationDuration: 2000,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          type: "solid",
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "#00F7FF"
            },
            {
              offset: 1,
              color: "#007EFF"
            }
          ])
        }
      },
      backgroundColor: "transparent",
      borderColor: "transparent",
      formatter: function (params) {
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
            '</span><span style="display:inline-block;color: rgba(255, 255, 255, 1); margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px;">千小时</span><br/>';
        }
        returnData += "</div>";
        return returnData;
      }
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontFamily: "MicrosoftYaHei",
        fontSize: 12,
        color: "#fff"
      },
      axisTick: {
        show: true,
        inside: true,
        alignWithLabel: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      type: "value",
      name: "充电总时长(千小时)",
      nameTextStyle: {
        fontFamily: "MicrosoftYaHei",
        fontSize: 12,
        color: "#7E97BB",
        align: 'left',
        verticalAlign: 'top'
      },
      // min: 0,
      axisLine: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#112B5F",
          type: "dashed"
        }
      },
      axisLabel: {
        show: true,
        //margin: 20, 
        textStyle: {
          fontFamily: "MicrosoftYaHei",
          fontSize: 12,
          color: "#7E97BB"
        }
      },
      axisTick: {
        show: false
      }
    },
    series: [{
        name: nameList[0],
        type: "line",
        showSymbol: false,
        smooth: false, //true曲线; false折线
        // symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          color: colors[0]
        },
        label: {
          show: false
        },
        itemStyle: {
          color: colors[0],
          borderColor: colors[0],
          borderWidth: 1
        },
        data: yData1
      },
      {
        name: nameList[1],
        type: "line",
        showSymbol: false,
        smooth: false, //true曲线; false折线
        // symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          color: colors[1]
        },
        label: {
          show: false
        },
        itemStyle: {
          // borderType:'dotted',//虚线
          // color: colors[1],
          // borderColor: colors[1],
          // borderWidth: 1,
          normal: {
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: colors[1],
            }
          }
        },
        data: yData2
      }
    ]
  };
  return optionData;
}

// 左二圆滑折线图
function chargingLineChartTwo(nameList, colors, xData, yData1,yData2) {
  let optionData = {
    // backgroundColor: "rgba(30, 34, 48, 1)",
    grid: {
      top: "19%",
      left: "3%",
      right: "11%",
      bottom: "10%",
      containLabel: true
    },
    animationDuration: 2000,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          type: "solid",
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "#00F7FF"
            },
            {
              offset: 1,
              color: "#007EFF"
            }
          ])
        }
      },
      backgroundColor: "transparent",
      borderColor: "transparent",
      formatter: function (params) {
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
            '</span><span style="display:inline-block;color: rgba(255, 255, 255, 1); margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px;">次</span><br/>';
        }
        returnData += "</div>";
        return returnData;
      }
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontFamily: "MicrosoftYaHei",
        fontSize: 12,
        color: "#fff"
      },
      axisTick: {
        show: true,
        inside: true,
        alignWithLabel: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      type: "value",
      name: "充电总次数(次)",
      nameTextStyle: {
        fontFamily: "MicrosoftYaHei",
        fontSize: 12,
        color: "#7E97BB",
        align: 'left',
        verticalAlign: 'top'
      },
      // min: 0,
      minInterval:1,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        //margin: 20, 
        textStyle: {
          fontFamily: "MicrosoftYaHei",
          fontSize: 12,
          color: "#7E97BB"
        }
      },
      axisTick: {
        show: false
      }
    },
    series: [{
        name: nameList[0],
        type: "line",
        showSymbol: false,
        smooth: true, //true曲线; false折线
        // symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          color: colors[0]
        },
        label: {
          show: false
        },
        itemStyle: {
          color: colors[0],
          borderColor: colors[0],
          borderWidth: 1
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
                  color: colors[0]
                },
                {
                  offset: 1,
                  color: "rgba(17, 51, 40, .1)"
                  // color: "rgba(81, 242, 103, .1)"
                }
              ],
              false
            )
            // shadowColor: colors[0],
            // shadowBlur: 10
          }
        },
        data: yData1
      },
      {
        name: nameList[1],
        type: "line",
        showSymbol: false,
        smooth: true, //true曲线; false折线
        // symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          color: colors[1]
        },
        label: {
          show: false
        },
        itemStyle: {
          color: colors[1],
          borderColor: colors[1],
          borderWidth: 1,
          normal: {
            lineStyle: {
              // 设置线的宽度
              width: 1,
              //'dotted'虚线 'solid'实线
              type: 'dashed',
              color: colors[1],
            }
          }
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
                  color: colors[1]
                },
                {
                  offset: 1,
                  color: "rgba(2, 35, 57, .1)"
                  // color: "rgba(0, 160, 233, .1)"
                }
              ],
              false
            )
            // shadowColor: colors[1],
            // shadowBlur: 10
          }
        },
        data: yData2
      }
    ]
  };
  return optionData;
}

// 右一充电柱状图
function chargingBarChartOne(xdata, ydata) {
  let Min1 = calMin(ydata[0])
  let Max1 = calMax(ydata[0])
  let Min2 = calMin(ydata[1])
  let Max2 = calMax(ydata[1])

  let optionData = {
    //   legend: {
    //   top: 8,
    //   right: 30,
    //   icon: "roundRect",
    //   itemWidth: 10,
    //   itemHeight: 8,
    //   itemGap: 15,
    //   textStyle: {
    //     fontFamily: "MicrosoftYaHei",
    //     fontSize: 14,
    //     color: "rgba(255, 255, 255, 1)"
    //   },
    //   data: ["充电时长", "充电次数"]
    // },
    grid: {
      top: "10%",
      left: "18%",
      right: "18%",
      bottom: "22%"
    },
    animationDuration: 2000,
    xAxis: {
      type: "category",
      data: xdata,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        // interval: 0, //防止x轴文字显示不全
        fontFamily: "MicrosoftYaHei",
        fontSize: 12,
        color: "#fff",
      },
      axisTick: {
        show: true,
        inside: true,
        alignWithLabel: true,
        lineStyle: {
          color: "#112B5F",
        }
      }
    },
    yAxis: [{
        type: "value",
        position: 'left',
        // scale: true,
        min: Min1,
        max: Max1,
        splitNumber: 5,
        interval: (Max1 - Min1) / 5,
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#112B5F",
            type: "dashed"
          }
        },
        axisLabel: {
          formatter: '{value} 小时',
          show: true,
          ////margin: 20,  
          textStyle: {
            fontFamily: "MicrosoftYaHei",
            fontSize: 12,
            color: "#7E97BB"
          }
        },
        axisTick: {
          show: false
        }
      },
      {
        type: "value",
        position: 'right',
        name: "",
        // scale: true,
        min: Min2,
        max: Max2,
        splitNumber: 5,
        interval: (Max2 - Min2) / 5,
        nameTextStyle: {
          fontFamily: "MicrosoftYaHei",
          fontSize: 12,
          color: "#7E97BB"
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#112B5F",
            type: "dashed"
          }
        },
        axisLabel: {
          formatter: '{value} 次',
          show: true,
          //margin: 20, 
          textStyle: {
            fontFamily: "MicrosoftYaHei",
            fontSize: 12,
            color: "#7E97BB"
          }
        },
        axisTick: {
          show: false
        }
      }
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      backgroundColor: "transparent",
      borderColor: "transparent",
      textStyle: {
        color: "#fff" //设置文字颜色
      },
      formatter: function (params) {
        // console.log(params,"params")
        let colors = ["#00F7FF", "#007EFF"];
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
          if (params[i].seriesName == "充电时长") {
            returnData +=
              '<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">' +
              params[i].seriesName +
              '：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
              '">' +
              params[i].value +
              '</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">小时</span><br/>';
          } else if (params[i].seriesName == "充电次数") {
            returnData +=
              '<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">' +
              params[i].seriesName +
              '：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
              '">' +
              params[i].value +
              '</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">次</span><br/>';
          }
        }
        returnData += "</div>";
        return returnData;
      }
    },
    series: [{
        name: "充电时长",
        type: "bar",
        barWidth: "15",
        yAxisIndex: 0,
        showBackground: false,
        // backgroundStyle: {
        //   color: "#0c3252"
        // },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [{
                  offset: 0,
                  color: "#009CFF" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color:"#00F7FF"  // 100% 处的颜色
                }
              ],
              false
            )
            // shadowColor: "rgba(0,160,221,1)",
            // shadowBlur: 4
          }
        },
        data: ydata[0],
      },
      {
        name: "充电次数",
        type: "line",
        showAllSymbol: true,
        symbol: "circle",
        symbolSize: 6,
        yAxisIndex: 1,
        lineStyle: {
          color: "#00A0E9",
        },
        label: {
          show: false
        },
        itemStyle: {
          color: "#fff",
          borderColor: "#007EFF",
          borderWidth: 3
        },
        // areaStyle: {
        //   normal: {
        //     color: new echarts.graphic.LinearGradient(
        //       0,
        //       0,
        //       0,
        //       1,
        //       [
        //         {
        //           offset: 0,
        //           color: "rgba(0, 160, 233, .6)",
        //         },
        //         {
        //           offset: 1,
        //           color: "rgba(233, 195, 116, 0)"
        //         }
        //       ],
        //       false
        //     )
        //   }
        // },
        data: ydata[1]
      }
    ]
  };
  return optionData;
}

// 右二、右三充电柱状图
function chargingBarChartTwo(xdata, ydata) {
  let optionData = {
		//   legend: {
		//   top: 8,
		//   right: 30,
		//   icon: "roundRect",
		//   itemWidth: 10,
		//   itemHeight: 8,
		//   itemGap: 15,
		//   textStyle: {
		//     fontFamily: "MicrosoftYaHei",
		//     fontSize: 14,
		//     color: "rgba(255, 255, 255, 1)"
		//   },
		//   data: ["充电时长", "充电次数"]
		// },
		// grid: {
		// 	top: "28%",
		// 	left: "13%",
		// 	right: "0%",
		// 	bottom: "22%",
		// 	containLabel: true,
		// },
		grid: {
			top: "20%",
			left: "5%",
			right: "5%",
			bottom: "5%",
			containLabel: true,
		},
		animationDuration: 2000,
		xAxis: {
			type: "category",
			data: xdata,
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
				// interval: 0, //防止x轴文字显示不全
				fontFamily: "MicrosoftYaHei",
				fontSize: 12,
				color: "#fff",
			},
			axisTick: {
				show: true,
				inside: true,
				alignWithLabel: true,
				lineStyle: {
					color: "#112B5F",
				},
			},
		},
		yAxis: [
			{
				type: "value",
				name: "频次占比(%)",
				nameTextStyle: {
					fontFamily: "MicrosoftYaHei",
					fontSize: 12,
					color: "#7E97BB",
          align: 'left',
          verticalAlign: 'top'
        },
				// scale: true,
				axisLine: {
					show: false,
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: "#112B5F",
						type: "dashed",
					},
				},
				axisLabel: {
					formatter: "{value}",
					show: true,
					//margin: 20,
					textStyle: {
						fontFamily: "MicrosoftYaHei",
						fontSize: 12,
						color: "#7E97BB",
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
				let returnData =
					'<div style="background: rgba(0,90,139,0.8);border: 1px solid #32AFAA;box-shadow: 0px 2px 1px 0px rgba(0,39,70,0.8);border-radius: 4px;padding:10px;">';
				returnData +=
					'<span style="font-family: MicrosoftYaHei; font-size: 14px; color: #fff;font-weight: bold">' +
					params[0].axisValue +
					"</span><br/>";
				for (let i = 0; i < params.length; i++) {
					returnData +=
						'<span style="display:inline-block; width:10px; height:8px; margin-right:5px; border-radius:1px; background-color:' +
						params[i].color +
						'"></span>';
					returnData +=
						'<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
						'">' +
						params[i].seriesName +
						'：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
						'">' +
						params[i].value +
						'</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
						'">%</span><br/>';
				}
				returnData += "</div>";
				return returnData;
			},
		},
		series: [
			{
				name: "上月",
				type: "bar",
				barWidth: "15",
				yAxisIndex: 0,
				showBackground: false,
				itemStyle: {
					normal: {
						color: "#00F7FF",
					},
				},
				data: ydata[0],
			},
			{
				name: "本月",
				type: "bar",
				barWidth: "15",
				showBackground: false,
				itemStyle: {
					normal: {
						color: "#007EFF",
					},
				},
				data: ydata[1],
			},
		],
	};
  return optionData;
}

// 底部充电折线图
function chargingLineCharts(legendData, legendColors, xdata, ydata, textColor) {
  let Min1 = calMin(ydata[0])
  let Max1 = calMax(ydata[0])
  let Min2 = calMin(ydata[1])
  let Max2 = calMax(ydata[1])

  const optionData = {
    backgroundColor: "transparent",
    // legend: {
    //   top: 10,
    //   right: 30,
    //   icon: "roundRect",
    //   itemWidth: 10,
    //   itemHeight: 8,
    //   itemGap: 15,
    //   textStyle: {
    //     fontFamily: "MicrosoftYaHei",
    //     fontSize: 14,
    //     color: "rgba(255, 255, 255, 1)"
    //   },
    //   data: legendData
    // },
    animationDuration: 2000,
    grid: {
      top: "15%",
      left: "0%",
      right: "0%",
      bottom: "2%",
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: textColor
        }
      },
      backgroundColor: "transparent",
      borderColor: "transparent",
      formatter: function (params) {
        let colors = legendColors;
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
          if (params[i].seriesName == "充电时长") {
            returnData +=
              '<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">' +
              params[i].seriesName +
              '：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
              '">' +
              params[i].value +
              '</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">小时</span><br/>';
          } else if (params[i].seriesName == "充电次数") {
            returnData +=
              '<span style="font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">' +
              params[i].seriesName +
              '：</span><span style="font-family: Verdana; font-size: 12px; color: #fff' +
              '">' +
              params[i].value +
              '</span><span style="display:inline-block; margin-left: 4px; line-height: 10px; font-family: MicrosoftYaHei; font-size: 12px; color: #fff' +
              '">次</span><br/>';
          }
        }
        returnData += "</div>";
        return returnData;
      }
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        fontFamily: "MicrosoftYaHei",
        fontSize: 12,
        color: textColor
      },
      axisTick: {
        show: true,
        inside: true,
        alignWithLabel: true,
        lineStyle: {
          color: "#112B5F",
        }
      },
      boundaryGap: false,
      data: xdata
    },
    yAxis: [{
        type: "value",
        position: 'left',
        name: "",
        min: Min1,
        max: Max1,
        splitNumber: 5,
        interval: (Max1 - Min1) / 5,
        nameTextStyle: {
          fontFamily: "MicrosoftYaHei",
          fontSize: 12,
          color: textColor
        },
        // min: 0,
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#112B5F",
            type: "dashed"
          }
        },
        axisLabel: {
          formatter: '{value} 小时',
          show: true,
          //margin: 20, 
          textStyle: {
            fontFamily: "MicrosoftYaHei",
            fontSize: 12,
            color: textColor
          }
        },
        axisTick: {
          show: false
        }
      },
      {
        type: "value",
        position: 'right',
        name: "",
        min: Min2,
        max: Max2,
        splitNumber: 5,
        interval: (Max2 - Min2) / 5,
        nameTextStyle: {
          fontFamily: "MicrosoftYaHei",
          fontSize: 12,
          color: textColor
        },
        // min: 0,
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#112B5F",
            type: "dashed"
          }
        },
        axisLabel: {
          formatter: '{value} 次',
          show: true,
          //margin: 20, 
          textStyle: {
            fontFamily: "MicrosoftYaHei",
            fontSize: 12,
            color: textColor
          }
        },
        axisTick: {
          show: false
        }
      }
    ],
    series: [{
        name: legendData[0],
        type: "line",
        showAllSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: legendColors[0],
          shadowBlur: 5,
          shadowColor: legendColors[0],
        },
        label: {
          show: false
        },
        itemStyle: {
          color: "#fff",
          borderColor: legendColors[0],
          borderWidth: 3
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
                  color: "rgba(0, 118, 146, .8)",
                },
                {
                  offset: 1,
                  color: "rgba(233, 195, 116, 0)"
                }
              ],
              false
            )
          }
        },
        data: ydata[0]
      },
      {
        name: legendData[1],
        type: "line",
        showAllSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        yAxisIndex: 1,
        lineStyle: {
          color: legendColors[1],
          shadowBlur: 5,
          shadowColor: legendColors[1],
        },
        label: {
          show: false
        },
        itemStyle: {
          color: "#fff",
          borderColor: legendColors[1],
          borderWidth: 3
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
                  color: "rgba(0, 61, 133, .8)"
                },
                {
                  offset: 1,
                  color: "rgba(233, 195, 116, 0)"
                }
              ],
              false
            )
          }
        },
        data: ydata[1]
      }
    ]
  };
  return optionData;
}

export {
  mapCharts,
  chargingLineChartOne,
  chargingLineChartTwo,
  chargingBarChartOne,
  chargingBarChartTwo,
  chargingLineCharts
}