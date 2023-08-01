/* 文件大小单位的换算 */
// function conver(limit) {
// 	let size = "";
// 	if (limit == 0) {
// 		return 0;
// 	} else if (limit < 0.1 * 1024) {
// 		//如果小于0.1KB转化成B
// 		size = limit.toFixed(1) + "B";
// 	} else if (limit < 0.1 * 1024 * 1024) {
// 		//如果小于0.1MB转化成KB
// 		size = (limit / 1024).toFixed(1) + "KB";
// 	} else if (limit < 0.1 * 1024 * 1024 * 1024) {
// 		//如果小于0.1GB转化成MB
// 		size = (limit / (1024 * 1024)).toFixed(1) + "MB";
// 	} else {
// 		//其他转化成GB
// 		size = (limit / (1024 * 1024 * 1024)).toFixed(1) + "GB";
// 	}

// 	var sizestr = size + "";
// 	// var len = sizestr.indexOf("\.");
// 	// var dec = sizestr.substr(len + 1, 1);
// 	// if (dec == "0") {//当小数点后为0时 去掉小数部分
// 	//     return sizestr.substring(0, len) + sizestr.substr(len+1, 3);
// 	// }
// 	return sizestr;
// }
function conver(limit) {
	if (limit == 0) {
		return "0B";
	}
	if (limit == null) {
		return "-";
	}
	let kb = 1024;
	let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let i = Math.floor(Math.log(limit) / Math.log(kb));
	
	return parseFloat((limit / Math.pow(kb, i)).toFixed(1)) + " " + unit[i];
	
}

export { conver };
