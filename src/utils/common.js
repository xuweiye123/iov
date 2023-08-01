
/**
 * @name: 判断是否有值
 * @param {*} v 值
 */
function isValue(v) {
  if (v != null && v.length > 0) {
    return v
  } else {
    return false
  }
};
/**
 * @name: 截取-的前后字符
 * @param {*} obj
 * @param {*} state
 */
function getCaption(obj, state) {
  if (obj) {
    var index = obj.lastIndexOf("\-");
    if (state == 0) {
      obj = obj.substring(0, index);
    } else {
      obj = obj.substring(index + 1, obj.length);
    }
    return obj;
  } else {
    return '';
  }

};
/**
 * @name: 获取当前时间
 * @param {*} 
 */
function getNowFormatTime() {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var currenttime = hour + ":" + minutes + ":" + seconds;

  return currenttime;
};
/**
 * @name: 获取当前日期时间
 * @param {*} 
 */
 function getNowTime () {
  let now = new Date();
  let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
  let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  let today = now.getDate(); //获取当前日(1-31)
  let hour = now.getHours(); //获取当前小时数(0-23)
  let minute = now.getMinutes(); //获取当前分钟数(0-59)
  let second = now.getSeconds(); //获取当前秒数(0-59)
  let nowTime = ''
  nowTime = year + '-' + fillZero(month) + '-' + fillZero(today) + ' ' + fillZero(hour) + ':' +
    fillZero(minute) + ':' + fillZero(second)
  return nowTime
};
function fillZero (str) {
  var realNum;
  if (str < 10) {
    realNum = '0' + str;
  } else {
    realNum = str;
  }
  return realNum;
}
/*获取guid */
function getGuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}
//list 是已有的数据，search 是模糊搜索的关键字，attribute 是模糊搜索的字段
export const fuzzySearch = (list, search, attribute = "name") => {
	let arr = [];
	if (!search && search != 0) {
		arr = list;
	}
	for (let i = 0; i < list.length; i++) {
		if (list[i][attribute].match(search) != null) {
			arr.push(list[i]);
		}
	}
	return arr;
};
//防抖函数  fn是需要防抖的函数，wait是防抖的时间
export const debounce = (fn, wait) => {
	let timer = null;
	return function(...args) {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(function() {
			fn.apply(this, args);
		}, wait);
	};
};
export {
  isValue,
  getCaption,
  getNowFormatTime,
  getNowTime,
  getGuid
}

