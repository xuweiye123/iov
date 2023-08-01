const didi = [
	//整车数据
	{
		value: "整车数据",
		dataList: [
			{
				date: "",
				name: "数据采集时间：	",
				Company:"",
				prop: "time",
			},
			{
				date: "",
				name: "车辆状态：	",
				Company:"",
				prop: "carStatusValue",
			},
			{
				date: "",
				name: "充电状态：",
				Company:"",
				prop: "chargeStatusValue",
			},
			{
				date: "",
				name: "运行模式：	",
				Company:"",
				prop: "runStyle",
			},
			{
				date: "0",
				name: "车速：",
				Company:"km/h",
				prop: "speed",
			},
			{
				date: "0",
				name: "累计里程：	",
				Company:"km",
				prop: "totalMile",
			},
			{
				date: "0",
				name: "总电压：	",
				Company:"V",
				prop: "totalVoltage",
			},
			{
				date: "0",
				name: "总电流：	",
				Company:"A",
				prop: "totalElectic",
			},
			{
				date: "0",
				name: "SOC：	",
				Company:"%",
				prop: "soc",
			},
			{
				date: "",
				name: "dcdc状态：",
				Company:"",
				prop: "dcDcStatus",
			},
			{
				date: "",
				name: "挡位：",
				Company:"",
				prop: "gear",
			},
			{
				date: "",
				name: "制动力：",
				Company:"",
				prop: "brakeage",
			},
			{
				date: "",
				name: "驱动力：",
				Company:"",
				prop: "drive",
			},
			{
				date: "0",
				name: "绝缘电阻：	",
				Company:"kΩ",
				prop: "insulatedResistance",
			},
		],
	},
	//驱动电机数据
	{
		value: "驱动电机数据",
		dataList: [
			{
				date: "",
				name: "驱动电机序号：	",
				Company:"",
				prop: "serial",
			},
			{
				date: "",
				name: "驱动电机状态：	",
				Company:"",
				prop: "status",
			},
			{
				date: "",
				name: "驱动电机控制器温度： ",
				Company:"℃",
				prop: "controllerTemperature",
			},
			{
				date: "",
				name: "驱动电机转速：	",
				Company:"r/min",
				prop: "engineSpeed",
			},
			{
				date: "",
				name: "驱动电机转矩：	",
				Company:"N·m",
				prop: "torque",
			},
			{
				date: "",
				name: "驱动电机温度：	",
				Company:"℃",
				prop: "temperature",
			},
			{
				date: "",
				name: "电机控制器输入电压：	",
				Company:"V",
				prop: "inputVoltage",
			},
			{
				date: "",
				name: "电机控制器直流母线电流：	",
				Company:"A",
				prop: "current",
			},
		],
	},
	//燃料电池数据
	{
		value: "燃料电池数据",
		dataList: [
			{
				date: "",
				name: "燃料电池电压：	",
				Company:"V",
				prop: "fuelBatteryVolatage",
			},
			{
				date: "",
				name: "燃料电池电流：",
				Company:"A",
				prop: "fuelBatteryEle",
			},
			{
				date: "",
				name: "燃料消耗率：	",
				Company:"Kg/100Km",
				prop: "fuelUseRate",
			},
			{
				date: "",
				name: "燃料电池温度探针数：	",
				Company:"",
				prop: "fuelBatteryTemCount",
			},
			{
				date: "",
				name: "氢系统中最高温度：	",
				Company:"℃",
				prop: "highTemValue",
			},
			{
				date: "",
				name: "氢系统中最高温度探针代号：	",
				Company:"",
				prop: "highTemFuelNo",
			},
			{
				date: "",
				name: "氢气最高浓度：	",
				Company:"mg/kg",
				prop: "highConcentration",
			},
			{
				date: "",
				name: "氢气最高浓度传感器代号：	",
				Company:"",
				prop: "highConcentrationControllerNo",
			},
			{
				date: "",
				name: "氢气最高压力：	",
				Company:"Mpa",
				prop: "highPressure",
			},
			{
				date: "",
				name: "氢气最高压力传感器代号：	",
				Company:"",
				prop: "highPressureNo",
			},
			{
				date: "",
				name: "高压DC-DC状态：	",
				Company:"",
				prop: "hiVgDcDcStatus",
			},
			{
				date: "",
				name: "探针温度值(℃)：	",
				Company:"",
				prop: "fuelTemValue",
			},
		],
	},
	//发动机数据
	{
		value: "发动机数据",
		dataList: [
			{
				date: "",
				name: "发动机状态：	",
				Company:"",
				prop: "carEngineStatus",
			},
			{
				date: "",
				name: "曲轴转速：",
				Company:"r/min",
				prop: "speed",
			},
			{
				date: "",
				name: "燃料消耗率：	",
				Company:"L/100Km",
				prop: "fuelUseRate",
			},
		],
	},
	//车辆位置数据
	{
		value: "车辆位置数据",
		dataList: [
			{
				date: "",
				name: "定位状态：	",
				Company:"",
				prop: "locationStatus",
			},
			{
				date: "",
				name: "经度： ",
				Company:"",
				prop: "lgt",
			},
			{
				date: "",
				name: "纬度：	",
				Company:"",
				prop: "lat",
			},
		],
	},
	//极值数据
	{
		value: "极值数据",
		dataList: [
			{
				date: "",
				name: "最高电压电池子系统号：	",
				Company:"",
				prop: "highestVoltageBatteryNo",
			},
			{
				date: "",
				name: "最高电压电池单体代号：",
				Company:"",
				prop: "highestVoltageBatteryUnitNo",
			},
			{
				date: "",
				name: "电池单体电压最高值：	",
				Company:"V",
				prop: "batteryUnitVoltageHighValue",
			},
			{
				date: "",
				name: "最低电压电池子系统号：	",
				Company:"",
				prop: "lowestVoltageBatteryNo",
			},
			{
				date: "",
				name: "最低电压电池单体代号：	",
				Company:"",
				prop: "lowestVoltageBatteryUnitNo",
			},
			{
				date: "",
				name: "电池单体电压最低值：	",
				Company:"V",
				prop: "batteryUnitVoltageLowestValue",
			},
			{
				date: "",
				name: "最高温度子系统号：	",
				Company:"",
				prop: "highestTemBatteryNo",
			},
			{
				date: "",
				name: "最高温度探针序号：	",
				Company:"",
				prop: "highestTemBatteryUnitNo",
			},
			{
				date: "",
				name: "最高温度值：	",
				Company:"℃",
				prop: "batteryUnitHighestValue",
			},
			{
				date: "",
				name: "最低温度子系统号：	",
				Company:"",
				prop: "lowestestTemBatteryNo",
			},
			{
				date: "",
				name: "最低温度探针序号：	",
				Company:"",
				prop: "lowestTemBatteryUnitNo",
			},
			{
				date: "",
				name: "最低温度值：	",
				Company:"℃",
				prop: "batteryUnitLowestValue",
			},
		],
	},
	//报警扩展数据
	{
		value: "报警扩展数据",
		dataList: [
			{
				date: "",
				name: "最高报警等级：	",
				Company:"",
				prop: "alarmLevel",
			},
			{
				date: "",
				name: "通用报警标志：",
				Company:"",
				prop: "commonAlarmFlag",
			},
			{
				date: "",
				name: "可充电储能装置故障总数：	",
				Company:"",
				prop: "powerBatteryError",
			},
			{
				date: "",
				name: "可充电储能装置故障：	",
				Company:"",
				prop: "powerBatteryErrorList",
			},
			{
				date: "",
				name: "驱动电机故障总数：	",
				Company:"",
				prop: "motorErrorCount",
			},
			{
				date: "",
				name: "驱动电机故障：	",
				Company:"",
				prop: "motorErrorList",
			},
			{
				date: "",
				name: "发动机故障总数：	",
				Company:"",
				prop: "engineErrorCount",
			},
			{
				date: "",
				name: "发动机故障：	",
				Company:"",
				prop: "engineErrorList",
			},
			{
				date: "",
				name: "其他故障总数：	",
				Company:"",
				prop: "otherErrorCount",
			},
			{
				date: "",
				name: "其他故障：	",
				Company:"",
				prop: "otherErrorList",
			},
		],
	},
	//可用储能装置电压系统信息
	{
		value: "可用储能装置电压系统信息",
		dataList: [
		
			{
				date: "",
				name: "电压可充电储能子系统号：	",
				Company:"",
				prop: "systemNumber",
			},
			{
				date: "",
				name: "可充电储能装置电压：	",
				Company:"V",
				prop: "voltage",
			},
			{
				date: "",
				name: "可充电储能装置电流：	",
				Company:"A",
				prop: "electricity",
			},
			{
				date: "",
				name: "单体电池总数：	",
				Company:"",
				prop: "batteryTotoalCount",
			},
			{
				date: "",
				name: "本帧起始电池序号：	",
				Company:"",
				prop: "startingFrameNumber",
			},
			{
				date: "",
				name: "本帧单体电池总数：	",
				Company:"",
				prop: "batteryCount",
			},
			{
				date: "",
				name: "单体电池电压(V)：	",
				Company:"",
				prop: "batteryVoltages",
			},
		],
	},
	//可充电储能装置温度数据
	{
		value: "可充电储能装置温度数据",
		dataList: [

			{
				date: "",
				name: "温度可充电储能子系统号：	",
				Company:"",
				prop: "systemNumber",
			},
			{
				date: "",
				name: "可充电储能温度探针个数：	",
				Company:"",
				prop: "temperatureCount",
			},
			{
				date: "",
				name: "可充电储能子系统各温度探针检测到的温度值(℃)：	",
				Company:"",
				prop: "temperatures",
			},
		],
	},
];
export default didi;
