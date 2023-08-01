import DonMessage from "./message";
const Message = new DonMessage();

function transformData(data) {
	var arr = [];
	var indexObj = {};
	data.forEach((row) => {
		var pname = row.provinceName || "其它";
		var index = indexObj[pname];
		var pro = arr[index];
		if (index === undefined) {
			pro = {
				name: pname,
				id: row.provinceId || -1,
				firstWord: row.provinceFirstWordChar || "Z",
				total: 0,
				online: 0,
				type: "pro",
				children: [],
			};
			indexObj[pname] = arr.length;
			arr.push(pro);
		}
		pro.children.push({
			name: row.cityName || "其它",
			id: row.cityId || -1,
			firstWord: row.cityFirstWord || "Z",
			total: row.totalCount,
			type: "city",
			pid: row.provinceId || -2,
			pageNum: 1,
			pageSize: 10,
			children: [{
				show: false
			}],
		});
		pro.total += row.totalCount;
	});
	sort(arr);
	arr.forEach((pro) => {
		sort(pro.children);
	});
	return arr;
}

function sort(arr) {
	arr.sort(function (a, b) {
		if (a.id == "0" || a.id == "1") {
			return 1;
		} else if (b.id == "0" || b.id == "1") {
			return -1;
		}
		return a.firstWord == b.firstWord ?
			b.total - a.total :
			a.firstWord > b.firstWord ?
			1 :
			-1;
	});
}

function transfromCarTypeData(data) {
	var arr = [];
	data.forEach((row) => {
		arr.push({
			name: row.carTypeName,
			pageNum: 1,
			pageSize: 10,
			// pageSize: 5,
			pid: -2,
			id: row.carTypeId,
			total: row.totalCount,
			type: "city",
			children: [{
				show: false
			}],
		});
	});
	return arr;
}
// 判断起始时间是否大于结束时间
function beginTimeAndEndTime(obj) {
	const startTime = new Date(obj.startTime).getTime();
	const endTime = new Date(obj.endTime).getTime();
	if (startTime && endTime && startTime > endTime) {
		Message.warning({
			message: obj.message || "开始时间不能大于结束时间",
			duration: 2 * 1000,
		});
		return false;
	} else {
		return true;
	}
}
// 数组对象去重
function duplicateRemoval(arr, k) {
	const obj = {};
	arr = arr.reduce((cur, next) => {
		if (!obj[next[k]]) {
			obj[next[k]] = true;
			if (obj[next[k]]) {
				cur.push(next);
			}
		}
		return cur;
	}, []);
	return arr;
}
// data是json对象，Name是根据什么字段去重
function filterJSONByName(data, Name) {
	var dest = [];
	for (var i = 0; i < data.length; i++) {
		var ai = data[i];
		if (i == 0) {
			dest.push(ai);
		} else {
			var filterData = dest.filter(function (e) {
				return e[Name] == ai[Name];
			});
			if (filterData.length == 0) {
				dest.push(ai);
			}
		}
	}
	return dest;
}
// 秒转时分秒
function formatSeconds(value) {
	let result = parseInt(value);
	let h =
		Math.floor(result / 3600) < 10 ?
		"0" + Math.floor(result / 3600) :
		Math.floor(result / 3600);
	let m =
		Math.floor((result / 60) % 60) < 10 ?
		"0" + Math.floor((result / 60) % 60) :
		Math.floor((result / 60) % 60);
	let s =
		Math.floor(result % 60) < 10 ?
		"0" + Math.floor(result % 60) :
		Math.floor(result % 60);

	let res = "";
	// if(h !== '00') res += `${h}h`;
	// if(m !== '00') res += `${m}m`;
	// if(s !== '00') res += `${s}s`;
	// if(s == '00') res=0+'s';
	res += `${h}:` + `${m}:` + `${s}`;

	return res;
}
// 获取前一天的年月日
function getYesterday() {
	var timenow = new Date();
	timenow.setDate(timenow.getDate() - 1); //设置天数 -1 天，昨天的日期
	var y = timenow.getFullYear(); //年
	var m = timenow.getMonth() + 1; //月
	m = m < 10 ? "0" + m : m;
	var d = timenow.getDate(); //日
	d = d < 10 ? "0" + d : d;
	var yesterdayTime = y + "-" + m + "-" + d; //字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
	return yesterdayTime;
}
// 获取当天的年月日
function getToday() {
	var timenow = new Date();
	var y = timenow.getFullYear(); //年
	var m = timenow.getMonth() + 1; //月
	m = m < 10 ? "0" + m : m;
	var d = timenow.getDate(); //日
	d = d < 10 ? "0" + d : d;
	var time = y + "-" + m + "-" + d; //字符串拼接成自己想要的时间格式，现在是yyyy/mm/dd格式
	return time;
}
// 获取今天的0时0分0秒
function getTodayTime0() {
	let nowday = new Date();
	let time = new Date(
		nowday.getFullYear(),
		nowday.getMonth(),
		nowday.getDate(),
		0,
		0,
		0
	);
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}
// 获取此刻
function getTodayTime() {
	let time = new Date();
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}

function getTodayTimeAgo() {
	let time = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}
// 获取今天的23时59分590秒
function getTodayEndTime() {
	let times = new Date();
	let time = new Date(
		times.getFullYear(),
		times.getMonth(),
		times.getDate(),
		23,
		59,
		59
	);
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}
// 获取昨天的0时0分0秒
function getYesterdayTime0() {
	let yesterDay = new Date().getTime() - 24 * 60 * 60 * 1000;
	yesterDay = new Date(yesterDay);
	let time = new Date(
		yesterDay.getFullYear(),
		yesterDay.getMonth(),
		yesterDay.getDate(),
		0,
		0,
		0
	);
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}
// 获取30天前的0时0分0秒
function getLastMonthTime0() {
	let lastMonthDay = new Date().getTime() - 24 * 29 * 60 * 60 * 1000;
	lastMonthDay = new Date(lastMonthDay);
	let time = new Date(
		lastMonthDay.getFullYear(),
		lastMonthDay.getMonth(),
		lastMonthDay.getDate(),
		0,
		0,
		0
	);
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}
// 获取昨天的23时59分59秒
function getYesterdayTime1() {
	let yesterDay = new Date().getTime() - 24 * 60 * 60 * 1000;
	yesterDay = new Date(yesterDay);
	let time = new Date(
		yesterDay.getFullYear(),
		yesterDay.getMonth(),
		yesterDay.getDate(),
		23,
		59,
		59
	);
	time = time.format("yyyy-MM-dd hh:mm:ss")
	return time;
}

function checkTimeRange(startTime, endTime) {
	let start = new Date(startTime);
	let end = new Date(endTime);
	let diff = end.getTime() - start.getTime();
	let diffDay = diff / (1000 * 60 * 60 * 24);
	if (diffDay > 90) {
		return false;
	}
	return true;
}
// 计算开始时间结束时间相差几天
function getDaysBetween(dateString1, dateString2) {
	var startDate = dateString1 ? Date.parse(dateString1) : 0;
	var endDate = dateString2 ? Date.parse(dateString2) : 0;
	var days = Math.abs((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
	// alert(days);
	return days;
}

//echarts双y轴图计算最大值
function calMax(arr) {
	const max = Math.max(...arr)
	// 这样处理是为了不让最大值刚好到坐标轴顶部
	return Math.ceil(max / 9.5) * 10;
}

//echarts双y轴图计算最小值
function calMin(arr) {
	const min = Math.min(...arr)
	// 这样处理是为了不让最小值刚好到坐标轴底部
	return Math.floor(min / 12) * 10;
}

// 时间转换
function switchTime(value) {
	if (value) {
		if (parseFloat(value) > 0 && parseFloat(value) < 60) {
			return value + "秒";
		} else if (parseFloat(value) >= 60 && parseFloat(value) < 3600) {
			return Math.floor(value / 60) + "分钟" + (value % 60) + "秒";
		} else if (parseFloat(value) >= 3600 && parseFloat(value) < 86400) {
			return (
				Math.floor(value / 3600) +
				"小时" +
				Math.floor((value % 3600) / 60) +
				"分钟" +
				((value % 3600) % 60) +
				"秒"
			);
		} else if (parseFloat(value) >= 86400) {
			return (
				Math.floor(value / 86400) +
				"天" +
				Math.floor((value % 86400) / 3600) +
				"小时" +
				Math.floor(((value % 86400) % 3600) / 60) +
				"分钟" +
				(((value % 86400) % 3600) % 60) +
				"秒"
			);
		} else {
			return "-";
		}
	} else {
		return "-";
	}
}

// 表格操作列宽度
function operateWidth(num) {
	return num === 0 ? 0 : num === 1 ? 60 : num < 5 ? num * 45 : num * 38
}

// 判断数据是否为Json
function isJSON(str) {
	if (typeof str == 'string') {
	    try {
	        var obj=JSON.parse(str);
	        if(typeof obj == 'object' && obj ){
	            return true;
	        }else{
	            return false;
	        }
	
	    } catch(e) {
	        return false;
	    }
	}
}

//计算对象数组中某个属性合计
function countTotal(arr, keyName) {
	let total = 0;
	total = arr.reduce(function (total, currentValue, currentIndex, arr){
			return currentValue[keyName] ? (total + currentValue[keyName]) : total;
	}, 0);
	return total;
}

export {
	transformData,
	transfromCarTypeData,
	beginTimeAndEndTime,
	duplicateRemoval,
	filterJSONByName,
	formatSeconds,
	getYesterday,
	getToday,
	getTodayTimeAgo,
	getTodayTime0,
	getTodayTime,
	getTodayEndTime,
	getYesterdayTime0,
	getYesterdayTime1,
	getLastMonthTime0,
	checkTimeRange,
	getDaysBetween,
	calMax,
	calMin,
	switchTime,
	operateWidth,
	isJSON,
	countTotal
};