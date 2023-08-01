function param2Obj(url) {
	const search = url.split("?")[1];
	if (!search) {
		return {};
	}
	return JSON.parse(
		'{"' +
			decodeURIComponent(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"') +
			'"}'
	);
}

function toggleClass(element, className) {
	if (!element || !className) {
		return;
	}
	let classString = element.className;
	const nameIndex = classString.indexOf(className);
	if (nameIndex === -1) {
		classString += "" + className;
	} else {
		classString =
			classString.substr(0, nameIndex) +
			classString.substr(nameIndex + className.length);
	}
	element.className = classString;
}

//判断是否为json字符串
function isJSON(str) {
	if (typeof str == "string") {
		try {
			var obj = JSON.parse(str);
			if (typeof obj == "object" && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	} else {
		return false;
	}
}
export { param2Obj, toggleClass, isJSON };
