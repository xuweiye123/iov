/**
 * @description: 处理空数据 装换为 -
 * @param { String|Number|null|undefined } arg
 * @returns { String }
 * @example {{ arg | processData }}
 */
function processData(arg) {
	const arr = [null, "", undefined, "undefined", "null"];
	if (arg === 0) {
		return "0";
	} else {
		if (arr.includes(arg) || !arg) {
			return "-";
		} else {
			return arg;
		}
	}
}

/**
 * @description: 文件大小转换
 * @param { String|Number } limit
 * @returns { String }
 * @example {{ limit | fileSizeConversion }}
 */
function fileSizeConversion(limit) {
	const arr = [null, "", undefined, "undefined", "null"];
	if (limit <= 0) {
		return "0B";
	}
	if (arr.includes(limit) || !limit) {
		return "-";
	}
	let kb = 1024;
	let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let i = Math.floor(Math.log(limit) / Math.log(kb)); // let unit = size < 1024 ? 'KB' : size < 1024*1024 ? 'MB'
	return parseFloat((limit / Math.pow(kb, i)).toFixed(1)) + "" + unit[i];
}

export {
	processData,
	fileSizeConversion,
};
